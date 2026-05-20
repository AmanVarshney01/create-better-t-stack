import { describe, expect, it } from "bun:test";
import path from "node:path";

import { execa } from "execa";
import fs from "fs-extra";

import type { CreateInput } from "../src";
import { create } from "../src";
import { SMOKE_DIR } from "./setup";

type PackageManager = NonNullable<CreateInput["packageManager"]>;

const shouldRunBuildSamples = process.env.BTS_BUILD_SAMPLES === "1";
const sampleFilter = process.env.BTS_BUILD_SAMPLE_FILTER;

if (shouldRunBuildSamples) {
  process.env.BTS_SKIP_EXTERNAL_COMMANDS = "1";
  process.env.BTS_TEST_MODE = "1";
}

function readPositiveIntEnv(name: string, fallback: number) {
  const raw = process.env[name];
  if (!raw) return fallback;

  const value = Number(raw);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

const commandTimeoutMs = readPositiveIntEnv("BTS_BUILD_SAMPLE_COMMAND_TIMEOUT_MS", 600_000);
const commandProgressIntervalMs = readPositiveIntEnv(
  "BTS_BUILD_SAMPLE_PROGRESS_INTERVAL_MS",
  30_000,
);
const sampleTimeoutMs = readPositiveIntEnv("BTS_BUILD_SAMPLE_TIMEOUT_MS", 1_500_000);

type BuildSample = {
  name: string;
  packageManagers?: readonly PackageManager[];
  config: Omit<CreateInput, "packageManager" | "projectName">;
};

type SelectedBuildSample = {
  name: string;
  packageManager: PackageManager;
  config: Omit<CreateInput, "projectName">;
};

const baseConfig = {
  git: false,
  install: false,
  dbSetup: "none",
  webDeploy: "none",
  serverDeploy: "none",
  directoryConflict: "overwrite",
  disableAnalytics: true,
} satisfies Partial<CreateInput>;

const buildSamples: BuildSample[] = [
  {
    name: "hono-trpc-drizzle-todo",
    packageManagers: ["bun", "npm", "pnpm"],
    config: {
      ...baseConfig,
      frontend: ["tanstack-router"],
      backend: "hono",
      runtime: "bun",
      database: "sqlite",
      orm: "drizzle",
      api: "trpc",
      auth: "better-auth",
      payments: "none",
      addons: ["turborepo"],
      examples: ["todo"],
    },
  },
  {
    name: "next-self-prisma",
    config: {
      ...baseConfig,
      frontend: ["next"],
      backend: "self",
      runtime: "none",
      database: "sqlite",
      orm: "prisma",
      api: "trpc",
      auth: "better-auth",
      payments: "none",
      addons: ["turborepo"],
      examples: [],
    },
  },
  {
    name: "nuxt-orpc",
    config: {
      ...baseConfig,
      frontend: ["nuxt"],
      backend: "hono",
      runtime: "bun",
      database: "sqlite",
      orm: "drizzle",
      api: "orpc",
      auth: "none",
      payments: "none",
      addons: ["turborepo"],
      examples: [],
    },
  },
  {
    name: "convex-clerk-react",
    config: {
      ...baseConfig,
      frontend: ["tanstack-router"],
      backend: "convex",
      runtime: "none",
      database: "none",
      orm: "none",
      api: "none",
      auth: "clerk",
      payments: "none",
      addons: ["turborepo"],
      examples: [],
    },
  },
  {
    name: "workers-d1",
    config: {
      ...baseConfig,
      frontend: ["tanstack-router"],
      backend: "hono",
      runtime: "workers",
      database: "sqlite",
      orm: "drizzle",
      api: "trpc",
      auth: "none",
      payments: "none",
      addons: ["turborepo"],
      examples: [],
      dbSetup: "d1",
      serverDeploy: "cloudflare",
    },
  },
  {
    name: "mongo-mongoose-express",
    config: {
      ...baseConfig,
      frontend: ["solid"],
      backend: "express",
      runtime: "node",
      database: "mongodb",
      orm: "mongoose",
      api: "orpc",
      auth: "none",
      payments: "none",
      addons: ["turborepo"],
      examples: [],
    },
  },
  {
    name: "mcp-addon-next",
    config: {
      ...baseConfig,
      frontend: ["next"],
      backend: "hono",
      runtime: "bun",
      database: "sqlite",
      orm: "drizzle",
      api: "trpc",
      auth: "none",
      payments: "none",
      addons: ["turborepo", "mcp"],
      examples: [],
    },
  },
];

function expandBuildSample(sample: BuildSample): SelectedBuildSample[] {
  const packageManagers = sample.packageManagers ?? ["bun"];
  return packageManagers.map((packageManager) => ({
    name: packageManagers.length > 1 ? `${sample.name}-${packageManager}` : sample.name,
    packageManager,
    config: {
      ...sample.config,
      packageManager,
    },
  }));
}

function getSelectedBuildSamples() {
  const samples = buildSamples.flatMap(expandBuildSample);
  if (!sampleFilter) return samples;
  const selected = samples.filter((sample) => sample.name.includes(sampleFilter));
  if (selected.length === 0) {
    throw new Error(`No generated build samples matched BTS_BUILD_SAMPLE_FILTER=${sampleFilter}`);
  }
  return selected;
}

function formatOutput(output: string | undefined) {
  if (!output) return "";
  if (output.length <= 8_000) return output;

  const head = output.slice(0, 3_000);
  const tail = output.slice(-4_000);
  return `${head}\n\n... [${output.length - 7_000} chars omitted] ...\n\n${tail}`;
}

async function runCommand(sampleName: string, projectDir: string, command: string, args: string[]) {
  const commandLabel = [command, ...args].join(" ");
  const startedAt = Date.now();
  let progressInterval: ReturnType<typeof setInterval> | undefined;

  console.info(
    JSON.stringify({
      event: "generated-build:command:start",
      sample: sampleName,
      command: commandLabel,
    }),
  );

  try {
    progressInterval = setInterval(() => {
      console.info(
        JSON.stringify({
          event: "generated-build:command:progress",
          sample: sampleName,
          command: commandLabel,
          elapsedMs: Date.now() - startedAt,
        }),
      );
    }, commandProgressIntervalMs);

    const result = await execa(command, args, {
      cwd: projectDir,
      all: true,
      reject: false,
      timeout: commandTimeoutMs,
      env: {
        ...process.env,
        CI: "1",
        BTS_TELEMETRY: "0",
        NEXT_TELEMETRY_DISABLED: "1",
        HUSKY: "0",
      },
    });

    if (result.failed) {
      throw new Error(
        [
          `Command failed in ${projectDir}: ${commandLabel}`,
          `Exit code: ${result.exitCode ?? "unknown"}`,
          formatOutput(result.all),
        ]
          .filter(Boolean)
          .join("\n\n"),
      );
    }

    console.info(
      JSON.stringify({
        event: "generated-build:command:done",
        sample: sampleName,
        command: commandLabel,
        elapsedMs: Date.now() - startedAt,
      }),
    );
  } finally {
    if (progressInterval) clearInterval(progressInterval);
  }
}

function getPackageManagerCommand(
  packageManager: PackageManager,
  script: "install" | "build" | "check-types",
) {
  if (script === "install") {
    return { command: packageManager, args: ["install"] };
  }
  return { command: packageManager, args: ["run", script] };
}

describe.skipIf(!shouldRunBuildSamples)("Generated project install/build samples", () => {
  for (const sample of getSelectedBuildSamples()) {
    it(
      `installs dependencies and builds ${sample.name}`,
      async () => {
        const projectDir = path.join(SMOKE_DIR, "generated-builds", sample.name);
        await fs.remove(projectDir);

        const createResult = await create(projectDir, sample.config);
        expect(createResult.isOk()).toBe(true);

        for (const script of ["install", "build", "check-types"] as const) {
          const { command, args } = getPackageManagerCommand(sample.packageManager, script);
          await runCommand(sample.name, projectDir, command, args);
        }
      },
      sampleTimeoutMs,
    );
  }
});
