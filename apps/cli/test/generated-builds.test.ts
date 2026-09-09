import { describe, expect, it, spyOn } from "bun:test";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
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
    name: "next-self-orpc-prisma-polar",
    config: {
      ...baseConfig,
      frontend: ["next"],
      backend: "self",
      runtime: "none",
      database: "sqlite",
      orm: "prisma",
      api: "orpc",
      auth: "better-auth",
      payments: "polar",
      addons: ["none"],
      examples: ["todo"],
    },
  },
  {
    name: "expo-orpc-auth-todo",
    config: {
      ...baseConfig,
      frontend: ["native-bare"],
      backend: "hono",
      runtime: "bun",
      database: "sqlite",
      orm: "drizzle",
      api: "orpc",
      auth: "better-auth",
      payments: "none",
      addons: ["none"],
      examples: ["todo"],
    },
  },
  {
    name: "tanstack-start-self-auth-todo",
    config: {
      ...baseConfig,
      frontend: ["tanstack-start"],
      backend: "self",
      runtime: "none",
      database: "sqlite",
      orm: "drizzle",
      api: "orpc",
      auth: "better-auth",
      payments: "none",
      addons: ["none"],
      examples: ["todo"],
    },
  },
  {
    name: "tanstack-start-axiom-pnpm",
    packageManagers: ["pnpm"],
    config: {
      ...baseConfig,
      frontend: ["tanstack-start"],
      backend: "self",
      runtime: "none",
      database: "none",
      orm: "none",
      api: "none",
      auth: "none",
      payments: "none",
      addons: ["axiom"],
      examples: [],
    },
  },
  ...(["nuxt", "tanstack-start"] as const).map(
    (frontend) =>
      ({
        name: `${frontend}-axiom`,
        packageManagers: ["bun"] as const,
        config: {
          ...baseConfig,
          frontend: [frontend],
          backend: "self",
          runtime: "none",
          database: "none",
          orm: "none",
          api: "none",
          auth: "none",
          payments: "none",
          addons: ["axiom", "vite-plus"],
          examples: [],
          webDeploy: "docker",
        },
      }) satisfies BuildSample,
  ),
  ...(["tanstack-router", "react-router", "next"] as const).map(
    (frontend) =>
      ({
        name: `${frontend}-pwa`,
        config: {
          ...baseConfig,
          frontend: [frontend],
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
      }) satisfies BuildSample,
  ),
  ...(["astro"] as const).map(
    (frontend) =>
      ({
        name: `${frontend}-frontend-only`,
        config: {
          ...baseConfig,
          frontend: [frontend],
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
      }) satisfies BuildSample,
  ),
  ...(["svelte", "nuxt", "next", "native-bare", "native-uniwind", "native-unistyles"] as const).map(
    (frontend) =>
      ({
        name: `${frontend}-auth-todo-ai`,
        config: {
          ...baseConfig,
          frontend: [frontend],
          backend: "hono",
          runtime: "bun",
          database: "sqlite",
          orm: "drizzle",
          api: frontend === "next" ? "trpc" : "orpc",
          auth: "better-auth",
          payments: "none",
          addons: ["turborepo"],
          examples: ["todo", "ai"],
        },
      }) satisfies BuildSample,
  ),
  {
    name: "react-convex-ai",
    config: {
      ...baseConfig,
      frontend: ["tanstack-router"],
      backend: "convex",
      runtime: "none",
      database: "none",
      orm: "none",
      api: "none",
      auth: "better-auth",
      payments: "none",
      addons: ["turborepo"],
      examples: ["ai"],
    },
  },

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
    name: "solid-v2-frontend-only",
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
    name: "solid-v2-hono-bun-auth-todo",
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
    name: "solid-v2-express-node-mongoose",
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
    name: "solid-v2-fastify-node-prisma-polar",
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
    name: "solid-v2-elysia-bun",
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
    name: "solid-v2-hono-workers-cloudflare",
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
    name: "solid-v2-self-orpc-no-auth",
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
    name: "solid-v2-self-orpc-auth-todo",
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
    name: "solid-v2-self-cloudflare",
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
    name: "solid-v2-self-docker-pnpm",
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
    name: "solid-v2-self-vercel-npm",
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
    name: "solid-v2-prisma-web",
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
      webDeploy: "prisma",
    },
  },
  {
    name: "solid-v2-pwa",
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
    name: "solid-v2-vite-plus",
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
    name: "expo-convex-better-auth-polar",
    config: {
      ...baseConfig,
      frontend: ["native-bare"],
      backend: "convex",
      runtime: "none",
      database: "none",
      orm: "none",
      api: "none",
      auth: "better-auth",
      payments: "polar",
      addons: ["turborepo"],
      examples: ["todo"],
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
  let selected = sampleFilter
    ? samples.filter((sample) => sample.name.includes(sampleFilter))
    : samples;
  if (selected.length === 0) {
    throw new Error(`No generated build samples matched BTS_BUILD_SAMPLE_FILTER=${sampleFilter}`);
  }
  const shard = process.env.BTS_BUILD_SAMPLE_SHARD;
  if (shard) {
    const match = /^(\d+)\/(\d+)$/.exec(shard);
    const index = Number(match?.[1]);
    const total = Number(match?.[2]);
    if (!match || index < 1 || index > total || total > samples.length) {
      throw new Error(`Invalid BTS_BUILD_SAMPLE_SHARD=${shard}; expected 1/N through N/N`);
    }
    selected = selected.filter((_, position) => position % total === index - 1);
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
      const typecheckScript = packageJson.scripts?.["check-types"];
      if (await fs.pathExists(path.join(workspaceDir, "tsconfig.json"))) {
        expect(
          typecheckScript,
          `${sampleName}: ${workspaceRoot}/${entry.name} needs a check-types script`,
        ).toBeDefined();
      }
      if (!typecheckScript) continue;

      await runCommand(
        `${sampleName}:${workspaceRoot}/${entry.name}`,
        workspaceDir,
        packageManager,
        ["run", "check-types"],
      );
    }
  }
}

async function validateSolidBuildArtifacts(sample: SelectedBuildSample, projectDir: string) {
  if (!sample.config.frontend?.includes("solid")) return;

  const serverEntry =
    sample.config.webDeploy === "cloudflare"
      ? "apps/web/dist/server/server.js"
      : "apps/web/.output/server/index.mjs";
  expect(await fs.pathExists(path.join(projectDir, serverEntry))).toBe(true);
}

async function validatePwaBuildArtifacts(sample: SelectedBuildSample, projectDir: string) {
  if (!sample.config.addons?.includes("pwa")) return;
  const frontend = sample.config.frontend ?? [];
  const publicDir = path.join(
    projectDir,
    "apps/web",
    frontend.includes("solid")
      ? ".output/public"
      : frontend.includes("react-router")
        ? "build/client"
        : frontend.includes("next")
          ? "public"
          : "dist",
  );
  expect(await fs.pathExists(path.join(publicDir, "sw.js"))).toBe(true);
  if (frontend.includes("next")) {
    expect(await fs.pathExists(path.join(publicDir, "offline.html"))).toBe(true);
    const port = await getAvailablePort();
    const runtime = execa(
      "bun",
      ["run", "start", "--hostname", "127.0.0.1", "--port", String(port)],
      {
        cwd: path.join(projectDir, "apps/web"),
        all: true,
        reject: false,
      },
    );
    try {
      const response = await fetchWhenReady(`http://127.0.0.1:${port}/sw.js`);
      expect(response?.status).toBe(200);
      expect(response?.headers.get("content-type")).toBe("application/javascript; charset=utf-8");
      expect(response?.headers.get("cache-control")).toBe("no-cache, no-store, must-revalidate");
      expect(response?.headers.get("content-security-policy")).toBe(
        "default-src 'self'; script-src 'self'",
      );
    } finally {
      runtime.kill("SIGTERM");
      await runtime;
    }
    return;
  }
  expect(await fs.pathExists(path.join(publicDir, "registerSW.js"))).toBe(true);
  const manifest = await fs.readJson(path.join(publicDir, "manifest.webmanifest"));
  expect(manifest.start_url).toBe("/");
  expect(manifest.icons.length).toBeGreaterThan(0);
  for (const icon of manifest.icons) {
    expect(await fs.pathExists(path.join(publicDir, icon.src))).toBe(true);
  }
  if (frontend.includes("solid")) {
    const port = await getAvailablePort();
    const runtime = execa("node", [".output/server/index.mjs"], {
      cwd: path.join(projectDir, "apps/web"),
      all: true,
      reject: false,
      env: { ...process.env, HOST: "127.0.0.1", PORT: String(port) },
    });
    try {
      // Nitro records asset sizes during its build. Generating a worker later
      // can leave stale metadata and truncate the script sent to browsers.
      for (const asset of [
        "sw.js",
        "offline.html",
        ...manifest.icons.map((icon: { src: string }) => icon.src),
      ]) {
        const response = await fetchWhenReady(`http://127.0.0.1:${port}/${asset}`);
        expect(response?.status).toBe(200);
        expect(Buffer.from(await response!.arrayBuffer())).toEqual(
          await fs.readFile(path.join(publicDir, asset)),
        );
      }
    } finally {
      runtime.kill("SIGTERM");
      await runtime;
    }
  }
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

async function fetchWhenReady(url: string, init?: RequestInit) {
  for (let attempt = 0; attempt < 100; attempt++) {
    try {
      const response = await fetch(url, {
        ...init,
        signal: init?.signal ?? AbortSignal.timeout(5000),
      });
      // SSR can send headers before compilation/streaming finishes. Consume the
      // body inside the retry boundary so a timeout does not escape afterwards.
      const body = await response.arrayBuffer();
      return new Response(body, { status: response.status, headers: response.headers });
    } catch {
      init?.signal?.throwIfAborted();
      await Bun.sleep(100);
      init?.signal?.throwIfAborted();
    }
  }

  return undefined;
}

async function bootAndValidateStartAuthRuntime(sample: SelectedBuildSample, projectDir: string) {
  if (sample.name !== "tanstack-start-self-auth-todo") return;

  await runCommand(sample.name, projectDir, sample.packageManager, ["run", "db:push"]);
  const port = await getAvailablePort();
  const origin = `http://127.0.0.1:${port}`;
  const runtime = execa(
    sample.packageManager,
    ["run", "serve", "--host", "127.0.0.1", "--port", String(port)],
    {
      cwd: path.join(projectDir, "apps/web"),
      all: true,
      reject: false,
      timeout: commandTimeoutMs,
      killDescendants: true,
      env: { ...process.env, BETTER_AUTH_URL: origin },
    },
  );
  const rpc = (
    procedure: string,
    input: null | { text: string } | { id: number; completed?: boolean } = null,
    cookie = "",
  ) =>
    fetch(`${origin}/api/rpc/${procedure}`, {
      method: "POST",
      headers: { "content-type": "application/json", cookie },
      body: JSON.stringify({ json: input }),
      signal: AbortSignal.timeout(5000),
    });

  try {
    expect((await fetchWhenReady(`${origin}/`))?.status).toBe(200);
    expect(await (await rpc("healthCheck")).json()).toEqual({ json: "OK" });
    expect((await rpc("privateData")).status).toBe(401);
    const signup = await fetch(`${origin}/api/auth/sign-up/email`, {
      method: "POST",
      headers: { "content-type": "application/json", origin },
      body: JSON.stringify({
        name: "Generated test",
        email: "generated@example.test",
        password: "Generated-test-password-2026",
      }),
      signal: AbortSignal.timeout(5000),
    });
    expect(signup.status).toBe(200);
    const cookie = signup.headers
      .getSetCookie()
      .map((value) => value.split(";")[0])
      .join("; ");
    expect(cookie).not.toBe("");
    const session = await fetch(`${origin}/api/auth/get-session`, {
      headers: { cookie },
      signal: AbortSignal.timeout(5000),
    });
    expect(await session.json()).toMatchObject({ user: { email: "generated@example.test" } });
    expect((await rpc("privateData", null, cookie)).status).toBe(200);
    expect((await rpc("privateData")).status).toBe(401);

    expect((await rpc("todo/create", { text: "Generated runtime todo" })).status).toBe(200);
    const todos = z.object({
      json: z.array(z.object({ id: z.number(), text: z.string(), completed: z.boolean() })),
    });
    const created = todos.parse(await (await rpc("todo/getAll")).json()).json;
    expect(created).toHaveLength(1);
    expect(created[0]).toMatchObject({ text: "Generated runtime todo", completed: false });
    const { id } = created[0];
    expect((await rpc("todo/toggle", { id, completed: true })).status).toBe(200);
    expect(todos.parse(await (await rpc("todo/getAll")).json()).json).toEqual([
      { id, text: "Generated runtime todo", completed: true },
    ]);
    expect((await rpc("todo/delete", { id })).status).toBe(200);
    expect(todos.parse(await (await rpc("todo/getAll")).json()).json).toEqual([]);
  } finally {
    runtime.kill("SIGTERM");
    await runtime;
  }
}

async function bootAndValidateAxiomRuntime(sample: SelectedBuildSample, projectDir: string) {
  if (!sample.config.addons?.includes("axiom")) return;
  const received: Array<{ path?: string; status?: number }> = [];
  const collector = Bun.serve({
    port: 0,
    hostname: "127.0.0.1",
    async fetch(request) {
      const events = z
        .array(z.object({ path: z.string().optional(), status: z.number().optional() }))
        .parse(await request.json());
      received.push(...events);
      return Response.json({ ingested: events.length, failed: 0 });
    },
  });
  const port = await getAvailablePort();
  const runtime = execa("node", [".output/server/index.mjs"], {
    cwd: path.join(projectDir, "apps/web"),
    all: true,
    reject: false,
    env: {
      ...process.env,
      NODE_ENV: "production",
      HOST: "127.0.0.1",
      PORT: String(port),
      AXIOM_API_KEY: "xaat-local-test",
      AXIOM_DATASET: "generated-test",
      AXIOM_EDGE_URL: collector.url.toString(),
    },
  });
  try {
    expect((await fetchWhenReady(`http://127.0.0.1:${port}/`))?.status).toBe(200);
    expect((await fetchWhenReady(`http://127.0.0.1:${port}/missing-axiom-test`))?.status).toBe(404);
    for (let attempt = 0; attempt < 100 && received.length < 2; attempt++) await Bun.sleep(50);
    expect(received).toEqual(
      expect.arrayContaining([
        { path: "/", status: 200 },
        { path: "/missing-axiom-test", status: 404 },
      ]),
    );
  } finally {
    runtime.kill("SIGTERM");
    await runtime;
    collector.stop(true);
  }
}

describe("Generated runtime readiness", () => {
  it("preserves cancellation during the final retry delay", async () => {
    const controller = new AbortController();
    const reason = new Error("Runtime probe cancelled during retry delay");
    const fetchMock = spyOn(globalThis, "fetch").mockRejectedValue(new Error("Server not ready"));
    let delays = 0;
    const sleepMock = spyOn(Bun, "sleep").mockImplementation(async () => {
      await Promise.resolve();
      if (++delays === 100) controller.abort(reason);
    });

    try {
      await expect(
        fetchWhenReady("http://127.0.0.1:1/", { signal: controller.signal }),
      ).rejects.toBe(reason);
      expect(delays).toBe(100);
    } finally {
      sleepMock.mockRestore();
      fetchMock.mockRestore();
    }
  });

  it("stops when the caller cancels a streaming response", async () => {
    const controller = new AbortController();
    const reason = new Error("Runtime probe cancelled");
    let requests = 0;
    const server = Bun.serve({
      hostname: "127.0.0.1",
      port: 0,
      fetch() {
        requests++;
        return new Response(
          new ReadableStream({
            start(stream) {
              stream.enqueue(new TextEncoder().encode("pending"));
              controller.abort(reason);
            },
          }),
        );
      },
    });

    try {
      await expect(fetchWhenReady(server.url.href, { signal: controller.signal })).rejects.toBe(
        reason,
      );
      expect(requests).toBe(1);
    } finally {
      await server.stop(true);
    }
  });
});

async function bootAndValidatePrismaWebArtifact(sample: SelectedBuildSample, projectDir: string) {
  if (sample.config.webDeploy !== "prisma") return;

  const frontend = sample.config.frontend ?? [];
  const entrypoint = frontend.includes("react-router")
    ? "build/server/index.js"
    : frontend.includes("svelte")
      ? "build/index.js"
      : frontend.includes("solid")
        ? ".output/server/index.mjs"
        : undefined;
  if (!entrypoint) return;

  const webDir = path.join(projectDir, "apps/web");
  const runtimeRoot = await fs.mkdtemp(path.join(tmpdir(), "bts-prisma-artifact-"));
  const artifactDirectory = entrypoint.split("/")[0]!;
  await fs.copy(path.join(webDir, artifactDirectory), path.join(runtimeRoot, artifactDirectory));
  const port = await getAvailablePort();
  const runtime = execa("bun", [entrypoint], {
    cwd: runtimeRoot,
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
      const response = await fetchWhenReady(`http://127.0.0.1:${port}${pathname}`);
      expect(response?.status).toBe(200);
    }
  } catch (error) {
    failure = error;
  } finally {
    runtime.kill("SIGTERM");
  }

  const result = await runtime;
  await fs.remove(runtimeRoot);
  if (failure) {
    throw new Error(
      [`Generated Prisma runtime probe failed: ${String(failure)}`, formatOutput(result.all)]
        .filter(Boolean)
        .join("\n\n"),
    );
  }
}

async function bootAndValidateSolidRuntime(sample: SelectedBuildSample, projectDir: string) {
  if (!["solid-v2-self-orpc-no-auth", "solid-v2-self-orpc-auth-todo"].includes(sample.name)) return;

  const webDir = path.join(projectDir, "apps/web");
  const port = await getAvailablePort();
  const runtime = execa("node", [".output/server/index.mjs"], {
    cwd: webDir,
    all: true,
    reject: false,
    env: {
      ...process.env,
      CORS_ORIGIN: `http://127.0.0.1:${port}`,
      DATABASE_URL: "file:./local.db",
      HOST: "127.0.0.1",
      NODE_ENV: "production",
      PORT: String(port),
    },
  });

  let failure: unknown;
  try {
    const root = await fetchWhenReady(`http://127.0.0.1:${port}/`);
    expect(root?.status).toBe(200);
    expect(await root?.text()).toContain("Connected");

    const health = await fetchWhenReady(`http://127.0.0.1:${port}/rpc/healthCheck`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ json: null }),
    });
    expect(health?.status).toBe(200);
    expect(await health?.json()).toEqual({ json: "OK" });

    if (sample.name === "solid-v2-self-orpc-auth-todo") {
      const dashboard = await fetchWhenReady(`http://127.0.0.1:${port}/dashboard`, {
        signal: AbortSignal.timeout(15_000),
      });
      expect(dashboard?.status).toBe(200);
      expect(await dashboard?.text()).toContain("Loading...");
    }

    const missing = await fetchWhenReady(`http://127.0.0.1:${port}/missing-page`);
    expect(missing?.status).toBe(404);
  } catch (error) {
    failure = error;
  } finally {
    runtime.kill("SIGTERM");
  }

  const result = await runtime;
  if (failure) {
    throw new Error(
      [`Generated Solid runtime probe failed: ${String(failure)}`, formatOutput(result.all)]
        .filter(Boolean)
        .join("\n\n"),
    );
  }
}

async function bootAndValidateSolidDevRuntime(sample: SelectedBuildSample, projectDir: string) {
  if (sample.name !== "solid-v2-self-orpc-no-auth") return;

  const webDir = path.join(projectDir, "apps/web");
  const port = await getAvailablePort();
  const runtime = execa(
    sample.packageManager,
    ["run", "dev", "--", "--host", "127.0.0.1", "--port", String(port)],
    {
      cwd: webDir,
      all: true,
      reject: false,
      env: {
        ...process.env,
        CORS_ORIGIN: `http://127.0.0.1:${port}`,
        DATABASE_URL: "file:./local.db",
      },
    },
  );

  let failure: unknown;
  try {
    for (let request = 0; request < 2; request++) {
      const root = await fetchWhenReady(`http://127.0.0.1:${port}/`);
      expect(root?.status).toBe(200);
      expect(await root?.text()).toContain("Connected");
    }

    const health = await fetchWhenReady(`http://127.0.0.1:${port}/rpc/healthCheck`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ json: null }),
    });
    expect(health?.status).toBe(200);
    expect(await health?.json()).toEqual({ json: "OK" });

    const missing = await fetchWhenReady(`http://127.0.0.1:${port}/missing-page`);
    expect(missing?.status).toBe(404);
  } catch (error) {
    failure = error;
  } finally {
    runtime.kill("SIGTERM");
  }

  const result = await runtime;
  if (failure) {
    throw new Error(
      [`Generated Solid dev probe failed: ${String(failure)}`, formatOutput(result.all)]
        .filter(Boolean)
        .join("\n\n"),
    );
  }
}

async function writeSyntheticBuildConfig(projectDir: string) {
  const publishableKey = `pk_test_${Buffer.from("clerk.example.test$").toString("base64")}`;
  for (const app of ["web", "server", "native"]) {
    const file = path.join(projectDir, "apps", app, ".env");
    if (!(await fs.pathExists(file))) continue;
    let content = await fs.readFile(file, "utf8");
    content = content.replaceAll("https://example.convex.", "https://bts-build-test.convex.");
    content = content.replace(/^\s*#?\s*([A-Z][A-Z0-9_]*)=\s*$/gm, (line, key: string) => {
      if (key.endsWith("CLERK_PUBLISHABLE_KEY")) return `${key}=${publishableKey}`;
      if (key === "CLERK_SECRET_KEY") return `${key}=sk_test_bts_synthetic_build_key`;
      if (key === "GOOGLE_GENERATIVE_AI_API_KEY") return `${key}=bts-synthetic-build-key`;
      if (key === "POLAR_ACCESS_TOKEN") return `${key}=bts-synthetic-polar-build-token`;
      return line;
    });
    await fs.writeFile(file, content);
  }
}

async function writeOrpcInferenceChecks(sample: SelectedBuildSample, projectDir: string) {
  if (sample.config.api !== "orpc") return;
  const root = z
    .object({ name: z.string() })
    .parse(await fs.readJson(path.join(projectDir, "package.json")));
  await fs.appendFile(
    path.join(projectDir, "packages/api/src/routers/index.ts"),
    `\nexport const typeBoundaryProbe = {
  read: publicProcedure.handler(() => {
    const values: number[] = [];
    return values[0];
  }),
};
export type TypeBoundaryProbeClient = RouterClient<typeof typeBoundaryProbe>;\n`,
  );
  const checks = [
    `import type { AppRouterClient, TypeBoundaryProbeClient } from "@${root.name}/api/routers/index";`,
    "type IsAny<T> = 0 extends (1 & T) ? true : false;",
    "type Assert<T extends true> = T;",
    "type Health = Awaited<ReturnType<AppRouterClient['healthCheck']>>;",
    "export type HealthIsTyped = Assert<IsAny<Health> extends false ? true : false>;",
    "type IndexedOutput = Awaited<ReturnType<TypeBoundaryProbeClient['read']>>;",
    "export type ServerOptionsPreserved = Assert<undefined extends IndexedOutput ? true : false>;",
    "export async function checkClient(client: AppRouterClient) {",
    "  const health: string = await client.healthCheck();",
    "  // @ts-expect-error Health check output is not a number.",
    "  const invalidHealth: number = await client.healthCheck();",
  ];
  if (sample.config.examples?.includes("todo")) {
    checks.push(
      '  await client.todo.create({ text: "valid" });',
      "  // @ts-expect-error Todo input must retain its string type in the client.",
      "  await client.todo.create({ text: 123 });",
      "  const todos = await client.todo.getAll();",
      "  const text: string = todos[0]!.text;",
      "  const completed: boolean = todos[0]!.completed;",
      "  // @ts-expect-error Database-derived output must not become any.",
      "  todos[0]!.text = 123;",
      "  // @ts-expect-error Unknown database fields must be rejected.",
      "  todos[0]!.nonexistentField;",
      "  void [text, completed];",
    );
  }
  if (sample.config.auth === "better-auth") {
    checks.push(
      "  const privateData = await client.privateData();",
      "  const email: string = privateData.user!.email;",
      "  // @ts-expect-error Auth-derived output must not become any.",
      "  privateData.user!.email = 123;",
      "  void email;",
    );
  }
  checks.push("  return { health, invalidHealth };", "}");
  for (const app of ["web", "native", "server"]) {
    const dir = path.join(projectDir, "apps", app);
    if (!(await fs.pathExists(dir))) continue;
    const source =
      app === "native"
        ? dir
        : app === "web" && sample.config.frontend?.includes("nuxt")
          ? path.join(dir, "app")
          : path.join(dir, "src");
    await fs.outputFile(path.join(source, "orpc-inference-check.ts"), checks.join("\n"));
  }
}

describe.skipIf(!shouldRunBuildSamples)("Generated project install/build samples", () => {
  for (const sample of getSelectedBuildSamples()) {
    it(
      `installs dependencies and builds ${sample.name}`,
      async () => {
        const projectDir = path.join(SMOKE_DIR, "generated-builds", sample.name);
        await fs.remove(projectDir);

        try {
          const createResult = await create(projectDir, sample.config);
          expect(createResult.isOk()).toBe(true);
          await writeSyntheticBuildConfig(projectDir);

          const install = getPackageManagerCommand(sample.packageManager, "install");
          await runCommand(sample.name, projectDir, install.command, install.args);
          await writeOrpcInferenceChecks(sample, projectDir);
          await runWorkspaceTypeChecks(sample.name, projectDir, sample.packageManager);
          const build = getPackageManagerCommand(sample.packageManager, "build");
          await runCommand(sample.name, projectDir, build.command, build.args);
          await buildAndValidatePrismaWebArtifact(sample, projectDir);
          await bootAndValidatePrismaWebArtifact(sample, projectDir);
          await bootAndValidateAxiomRuntime(sample, projectDir);
          await bootAndValidateStartAuthRuntime(sample, projectDir);
          await bootAndValidateSolidDevRuntime(sample, projectDir);
          await bootAndValidateSolidRuntime(sample, projectDir);
          await validateSolidBuildArtifacts(sample, projectDir);
          await validatePwaBuildArtifacts(sample, projectDir);
          if (sample.config.frontend?.some((frontend) => frontend.startsWith("native-"))) {
            // Exercise Metro/Babel and platform imports as well as TypeScript.
            // This exports JS bundles; it does not compile or sign native binaries.
            for (const platform of ["ios", "android"]) {
              await runCommand(sample.name, path.join(projectDir, "apps/native"), "bun", [
                "x",
                "--no-install",
                "expo",
                "export",
                "--platform",
                platform,
              ]);
            }
          }
        } finally {
          await fs.remove(projectDir);
        }
      },
      sampleTimeoutMs,
    );
  }
});
