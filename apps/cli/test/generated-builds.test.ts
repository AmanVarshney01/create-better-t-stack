import { describe, expect, it } from "bun:test";
import { createServer } from "node:net";
import path from "node:path";

import { execa } from "execa";
import fs from "fs-extra";
import { z } from "zod";

import type { CreateInput } from "../src";
import { create } from "../src";
import { SMOKE_DIR } from "./setup";

type PackageManager = NonNullable<CreateInput["packageManager"]>;

const packageScriptsSchema = z.object({
  scripts: z.record(z.string(), z.string()).optional(),
});

const serverAddressSchema = z.object({ port: z.number().int().positive() });

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
    name: "solid-start-frontend-only",
    packageManagers: ["bun", "npm", "pnpm"],
    config: {
      ...baseConfig,
      frontend: ["solid"],
      backend: "none",
      runtime: "none",
      database: "none",
      orm: "none",
      api: "none",
      auth: "none",
      payments: "none",
      addons: ["none"],
      examples: [],
    },
  },
  {
    name: "solid-start-hono-bun-auth-todo",
    config: {
      ...baseConfig,
      frontend: ["solid"],
      backend: "hono",
      runtime: "bun",
      database: "sqlite",
      orm: "drizzle",
      api: "orpc",
      auth: "better-auth",
      payments: "none",
      addons: ["turborepo"],
      examples: ["todo"],
    },
  },
  {
    name: "solid-start-express-node-mongoose",
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
    name: "solid-start-fastify-node-prisma-polar",
    config: {
      ...baseConfig,
      frontend: ["solid"],
      backend: "fastify",
      runtime: "node",
      database: "postgres",
      orm: "prisma",
      api: "orpc",
      auth: "better-auth",
      payments: "polar",
      addons: ["turborepo"],
      examples: [],
    },
  },
  {
    name: "solid-start-elysia-bun",
    config: {
      ...baseConfig,
      frontend: ["solid"],
      backend: "elysia",
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
    name: "solid-start-hono-workers-cloudflare",
    config: {
      ...baseConfig,
      frontend: ["solid"],
      backend: "hono",
      runtime: "workers",
      database: "sqlite",
      orm: "drizzle",
      api: "orpc",
      auth: "none",
      payments: "none",
      addons: ["turborepo"],
      examples: [],
      serverDeploy: "cloudflare",
    },
  },
  {
    name: "solid-start-self-orpc-no-auth",
    config: {
      ...baseConfig,
      frontend: ["solid"],
      backend: "self",
      runtime: "none",
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
    name: "solid-start-self-orpc-auth-todo",
    config: {
      ...baseConfig,
      frontend: ["solid"],
      backend: "self",
      runtime: "none",
      database: "sqlite",
      orm: "drizzle",
      api: "orpc",
      auth: "better-auth",
      payments: "none",
      addons: ["turborepo"],
      examples: ["todo"],
    },
  },
  {
    name: "solid-start-self-cloudflare",
    config: {
      ...baseConfig,
      frontend: ["solid"],
      backend: "self",
      runtime: "none",
      database: "sqlite",
      orm: "drizzle",
      api: "orpc",
      auth: "better-auth",
      payments: "none",
      addons: ["turborepo"],
      examples: ["todo"],
      dbSetup: "d1",
      webDeploy: "cloudflare",
    },
  },
  {
    name: "solid-start-self-docker-pnpm",
    packageManagers: ["pnpm"],
    config: {
      ...baseConfig,
      frontend: ["solid"],
      backend: "self",
      runtime: "none",
      database: "sqlite",
      orm: "prisma",
      api: "orpc",
      auth: "better-auth",
      payments: "none",
      addons: ["turborepo"],
      examples: [],
      webDeploy: "docker",
    },
  },
  {
    name: "solid-start-self-vercel-npm",
    packageManagers: ["npm"],
    config: {
      ...baseConfig,
      frontend: ["solid"],
      backend: "self",
      runtime: "none",
      database: "postgres",
      orm: "drizzle",
      api: "orpc",
      auth: "better-auth",
      payments: "polar",
      addons: ["turborepo"],
      examples: [],
      webDeploy: "vercel",
    },
  },
  {
    name: "solid-start-pwa",
    config: {
      ...baseConfig,
      frontend: ["solid"],
      backend: "none",
      runtime: "none",
      database: "none",
      orm: "none",
      api: "none",
      auth: "none",
      payments: "none",
      addons: ["pwa"],
      examples: [],
    },
  },
  {
    name: "solid-start-vite-plus",
    config: {
      ...baseConfig,
      frontend: ["solid"],
      backend: "none",
      runtime: "none",
      database: "none",
      orm: "none",
      api: "none",
      auth: "none",
      payments: "none",
      addons: ["vite-plus"],
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
    name: "prisma-react-router-web",
    packageManagers: ["bun"],
    config: {
      ...baseConfig,
      frontend: ["react-router"],
      backend: "none",
      runtime: "none",
      database: "none",
      orm: "none",
      api: "none",
      auth: "none",
      payments: "none",
      addons: ["none"],
      examples: [],
      webDeploy: "prisma",
    },
  },
  {
    name: "prisma-sveltekit-web",
    packageManagers: ["pnpm"],
    config: {
      ...baseConfig,
      frontend: ["svelte"],
      backend: "none",
      runtime: "none",
      database: "none",
      orm: "none",
      api: "none",
      auth: "none",
      payments: "none",
      addons: ["none"],
      examples: [],
      webDeploy: "prisma",
    },
  },
  {
    name: "react-router-clerk-fastify",
    config: {
      ...baseConfig,
      frontend: ["react-router"],
      backend: "fastify",
      runtime: "node",
      database: "sqlite",
      orm: "drizzle",
      api: "orpc",
      auth: "clerk",
      payments: "none",
      addons: ["turborepo"],
      examples: [],
    },
  },
  {
    name: "tanstack-start-clerk-hono",
    config: {
      ...baseConfig,
      frontend: ["tanstack-start"],
      backend: "hono",
      runtime: "bun",
      database: "sqlite",
      orm: "drizzle",
      api: "trpc",
      auth: "clerk",
      payments: "none",
      addons: ["turborepo"],
      examples: [],
    },
  },
  {
    name: "expo-clerk-express",
    config: {
      ...baseConfig,
      frontend: ["native-uniwind"],
      backend: "express",
      runtime: "node",
      database: "sqlite",
      orm: "drizzle",
      api: "trpc",
      auth: "clerk",
      payments: "none",
      addons: ["turborepo"],
      examples: [],
    },
  },
  {
    name: "workers-clerk-hono",
    config: {
      ...baseConfig,
      frontend: ["tanstack-router"],
      backend: "hono",
      runtime: "workers",
      database: "sqlite",
      orm: "drizzle",
      api: "trpc",
      auth: "clerk",
      payments: "none",
      addons: ["turborepo"],
      examples: [],
      serverDeploy: "cloudflare",
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
        NODE_ENV: args.includes("build") ? "production" : process.env.NODE_ENV,
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

function getPackageManagerCommand(packageManager: PackageManager, script: "install" | "build") {
  if (script === "install") {
    return { command: packageManager, args: ["install"] };
  }
  return { command: packageManager, args: ["run", script] };
}

async function runWorkspaceTypeChecks(
  sampleName: string,
  projectDir: string,
  packageManager: PackageManager,
) {
  for (const workspaceRoot of ["apps", "packages"]) {
    const rootDir = path.join(projectDir, workspaceRoot);
    if (!(await fs.pathExists(rootDir))) continue;

    const entries = await fs.readdir(rootDir, { withFileTypes: true });
    for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
      if (!entry.isDirectory()) continue;

      const workspaceDir = path.join(rootDir, entry.name);
      const packageJsonPath = path.join(workspaceDir, "package.json");
      if (!(await fs.pathExists(packageJsonPath))) continue;

      const packageJson = packageScriptsSchema.parse(await fs.readJson(packageJsonPath));
      const typecheckScript = packageJson.scripts?.["check-types"]
        ? "check-types"
        : packageJson.scripts?.typecheck
          ? "typecheck"
          : undefined;
      if (!typecheckScript) continue;

      await runCommand(
        `${sampleName}:${workspaceRoot}/${entry.name}`,
        workspaceDir,
        packageManager,
        ["run", typecheckScript],
      );
    }
  }
}

async function validateSolidStartScaffold(sample: SelectedBuildSample, projectDir: string) {
  if (!sample.config.frontend?.includes("solid")) return;

  const webDir = path.join(projectDir, "apps/web");
  const requiredFiles = [
    "package.json",
    "tsconfig.json",
    "vite.config.ts",
    "src/app.tsx",
    "src/entry-client.tsx",
    "src/entry-server.tsx",
    "src/routes/index.tsx",
    "src/routes/[...404].tsx",
  ];
  for (const file of requiredFiles) {
    expect(await fs.pathExists(path.join(webDir, file))).toBe(true);
  }

  const legacyFiles = [
    "index.html",
    "src/main.tsx",
    "src/routeTree.gen.ts",
    "src/routes/__root.tsx",
  ];
  for (const file of legacyFiles) {
    expect(await fs.pathExists(path.join(webDir, file))).toBe(false);
  }

  const webPackageJson = await fs.readJson(path.join(webDir, "package.json"));
  expect(webPackageJson.dependencies?.["@solidjs/start"]).toBeDefined();
  expect(webPackageJson.dependencies?.["@solidjs/router"]).toBeDefined();
  expect(webPackageJson.dependencies?.["@tanstack/solid-router"]).toBeUndefined();
  expect(webPackageJson.scripts?.["check-types"]).toBe("tsc --noEmit");

  const viteConfig = await fs.readFile(path.join(webDir, "vite.config.ts"), "utf8");
  expect(viteConfig).toContain("solidStart()");

  if (sample.config.backend === "self" && sample.config.api === "orpc") {
    for (const file of [
      "src/routes/rpc/[...rest].ts",
      "src/routes/rpc/index.ts",
      "src/utils/orpc.ts",
      "src/utils/orpc.server.ts",
    ]) {
      expect(await fs.pathExists(path.join(webDir, file))).toBe(true);
    }

    const orpcClient = await fs.readFile(path.join(webDir, "src/utils/orpc.ts"), "utf8");
    expect(orpcClient).toContain("globalThis.$client");
  }

  if (sample.config.backend === "self" && sample.config.auth === "better-auth") {
    const authRoute = path.join(webDir, "src/routes/api/auth/[...auth].ts");
    expect(await fs.pathExists(authRoute)).toBe(true);
    expect(await fs.readFile(authRoute, "utf8")).toContain("toSolidStartHandler");
  }

  if (sample.config.webDeploy === "cloudflare") {
    expect(viteConfig).toContain("const cloudflareWorkersAlias: Record<string, string>");
    expect(viteConfig).toContain('command === "serve"');
    expect(viteConfig).toContain('external: ["cloudflare:workers"]');
    const infra = await fs.readFile(path.join(projectDir, "packages/infra/alchemy.run.ts"), "utf8");
    expect(infra).toContain('flags: ["nodejs_compat"]');
    expect(infra).toContain("runWorkerFirst: true");
  }

  if (sample.config.webDeploy === "docker") {
    expect(await fs.pathExists(path.join(webDir, "Dockerfile"))).toBe(true);
  }

  if (sample.config.payments === "polar") {
    const authPackageJson = await fs.readJson(path.join(projectDir, "packages/auth/package.json"));
    expect(authPackageJson.dependencies["@polar-sh/sdk"]).toBe("^0.47.0");
  }
}

async function validateSolidStartBuildArtifacts(sample: SelectedBuildSample, projectDir: string) {
  if (!sample.config.frontend?.includes("solid")) return;

  const serverEntry =
    sample.config.webDeploy === "cloudflare"
      ? "apps/web/dist/server/entry-server.js"
      : "apps/web/.output/server/index.mjs";
  expect(await fs.pathExists(path.join(projectDir, serverEntry))).toBe(true);
}

async function buildAndValidatePrismaWebArtifact(sample: SelectedBuildSample, projectDir: string) {
  if (sample.config.webDeploy !== "prisma") return;

  const webDir = path.join(projectDir, "apps/web");
  const entrypoint = sample.config.frontend?.includes("react-router")
    ? "build/server/index.js"
    : sample.config.frontend?.includes("svelte")
      ? "build/index.js"
      : undefined;

  if (entrypoint) {
    expect(await fs.pathExists(path.join(webDir, entrypoint))).toBe(true);
  }
}

async function getAvailablePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.unref();
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = serverAddressSchema.safeParse(server.address());
      if (!address.success) {
        server.close();
        reject(new Error("Could not allocate a port for the generated runtime probe"));
        return;
      }

      server.close((error) => {
        if (error) reject(error);
        else resolve(address.data.port);
      });
    });
  });
}

async function bootAndValidatePrismaWebArtifact(sample: SelectedBuildSample, projectDir: string) {
  if (sample.config.webDeploy !== "prisma") return;

  const frontend = sample.config.frontend ?? [];
  const entrypoint = frontend.includes("react-router")
    ? "build/server/index.js"
    : frontend.includes("svelte")
      ? "build/index.js"
      : undefined;
  if (!entrypoint) return;

  const webDir = path.join(projectDir, "apps/web");
  const port = await getAvailablePort();
  const runtime = execa("bun", [entrypoint], {
    cwd: webDir,
    all: true,
    reject: false,
    env: {
      ...process.env,
      HOST: "127.0.0.1",
      NODE_ENV: "production",
      PORT: String(port),
    },
  });

  let failure: unknown;
  try {
    for (const pathname of ["/"]) {
      let response: Response | undefined;
      for (let attempt = 0; attempt < 100; attempt++) {
        try {
          response = await fetch(`http://127.0.0.1:${port}${pathname}`);
          break;
        } catch {
          await Bun.sleep(100);
        }
      }
      expect(response?.status).toBe(200);
    }
  } catch (error) {
    failure = error;
  } finally {
    runtime.kill("SIGTERM");
  }

  const result = await runtime;
  if (failure) {
    throw new Error(
      [`Generated Prisma runtime probe failed: ${String(failure)}`, formatOutput(result.all)]
        .filter(Boolean)
        .join("\n\n"),
    );
  }
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
        await validateSolidStartScaffold(sample, projectDir);

        for (const script of ["install", "build"] as const) {
          const { command, args } = getPackageManagerCommand(sample.packageManager, script);
          await runCommand(sample.name, projectDir, command, args);
        }
        await buildAndValidatePrismaWebArtifact(sample, projectDir);
        await bootAndValidatePrismaWebArtifact(sample, projectDir);
        await validateSolidStartBuildArtifacts(sample, projectDir);
        await runWorkspaceTypeChecks(sample.name, projectDir, sample.packageManager);
      },
      sampleTimeoutMs,
    );
  }
});
