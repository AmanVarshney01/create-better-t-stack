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
    name: "nitro-orpc-drizzle-auth-todo",
    packageManagers: ["bun", "npm", "pnpm"],
    config: {
      ...baseConfig,
      frontend: ["tanstack-router"],
      backend: "nitro",
      runtime: "node",
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
    name: "nitro-trpc-clerk-bun",
    packageManagers: ["bun"],
    config: {
      ...baseConfig,
      frontend: ["tanstack-router"],
      backend: "nitro",
      runtime: "bun",
      database: "none",
      orm: "none",
      api: "trpc",
      auth: "clerk",
      payments: "none",
      addons: ["nx"],
      examples: ["none"],
    },
  },
  {
    name: "nitro-cloudflare-d1-auth-todo",
    packageManagers: ["bun"],
    config: {
      ...baseConfig,
      frontend: ["tanstack-router"],
      backend: "nitro",
      runtime: "workers",
      database: "sqlite",
      orm: "drizzle",
      dbSetup: "d1",
      api: "orpc",
      auth: "better-auth",
      payments: "none",
      addons: ["turborepo"],
      examples: ["todo"],
      serverDeploy: "cloudflare",
    },
  },
  {
    name: "nitro-prisma-better-auth",
    packageManagers: ["bun"],
    config: {
      ...baseConfig,
      frontend: ["react-router"],
      backend: "nitro",
      runtime: "bun",
      database: "sqlite",
      orm: "prisma",
      api: "trpc",
      auth: "better-auth",
      payments: "polar",
      addons: ["turborepo"],
      examples: ["none"],
    },
  },
  {
    name: "nitro-solid-mongoose",
    packageManagers: ["bun"],
    config: {
      ...baseConfig,
      frontend: ["solid"],
      backend: "nitro",
      runtime: "node",
      database: "mongodb",
      orm: "mongoose",
      api: "orpc",
      auth: "none",
      payments: "none",
      addons: ["turborepo"],
      examples: ["none"],
    },
  },
  {
    name: "nitro-ai-bun",
    packageManagers: ["bun"],
    config: {
      ...baseConfig,
      frontend: ["tanstack-router"],
      backend: "nitro",
      runtime: "bun",
      database: "none",
      orm: "none",
      api: "orpc",
      auth: "none",
      payments: "none",
      addons: ["turborepo"],
      examples: ["ai"],
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

async function validateSolidScaffold(sample: SelectedBuildSample, projectDir: string) {
  if (!sample.config.frontend?.includes("solid")) return;

  const webDir = path.join(projectDir, "apps/web");
  const requiredFiles = [
    "package.json",
    "tsconfig.json",
    "vite.config.ts",
    "src/App.tsx",
    "src/Document.tsx",
    "src/middleware.ts",
    "src/router.ts",
    "src/routes/index.tsx",
    "src/routes/[...404].tsx",
  ];
  for (const file of requiredFiles) {
    expect(await fs.pathExists(path.join(webDir, file))).toBe(true);
  }

  const legacyFiles = [
    "index.html",
    "src/main.tsx",
    "src/entry-client.tsx",
    "src/entry-server.tsx",
    "src/routeTree.gen.ts",
    "src/routes/__root.tsx",
  ];
  for (const file of legacyFiles) {
    expect(await fs.pathExists(path.join(webDir, file))).toBe(false);
  }

  const webPackageJson = await fs.readJson(path.join(webDir, "package.json"));
  expect(webPackageJson.dependencies?.["@solidjs/start"]).toBeUndefined();
  expect(webPackageJson.dependencies?.["solid-js"]).toBe("^2.0.0-rc.0");
  expect(webPackageJson.dependencies?.["@solidjs/web"]).toBe("^2.0.0-rc.0");
  expect(webPackageJson.dependencies?.["@solidjs/router"]).toBeDefined();
  expect(webPackageJson.devDependencies?.["@solidjs/vite-plugin"]).toBeDefined();
  expect(webPackageJson.devDependencies?.["filesystem-routing"]).toBeDefined();
  expect(webPackageJson.dependencies?.["@tanstack/solid-router"]).toBeUndefined();
  expect(webPackageJson.scripts?.["check-types"]).toBe("tsc --noEmit");

  if (sample.config.api === "orpc") {
    expect(webPackageJson.dependencies?.["@tanstack/query-core"]).toBe("5.101.0");
  }

  const viteConfig = await fs.readFile(path.join(webDir, "vite.config.ts"), "utf8");
  expect(viteConfig).toContain("solid({");
  expect(viteConfig).toContain("fileRoutes({ httpMethods: true })");
  expect(viteConfig).toContain("tsconfigPaths: true");

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
    expect(await fs.readFile(authRoute, "utf8")).toContain(".handler(request)");
  }

  if (sample.config.auth === "better-auth") {
    const authClient = path.join(projectDir, "packages/auth/src/client.ts");
    const webAuthClient = path.join(webDir, "src/lib/auth-client.ts");
    const authPackageJson = await fs.readJson(path.join(projectDir, "packages/auth/package.json"));

    expect(await fs.pathExists(authClient)).toBe(true);
    expect(await fs.readFile(authClient, "utf8")).toContain('from "better-auth/client"');
    expect(await fs.readFile(webAuthClient, "utf8")).toContain(
      `from "@${sample.name}/auth/client"`,
    );
    expect(webPackageJson.dependencies?.["better-auth"]).toBeUndefined();
    expect(webPackageJson.dependencies?.[`@${sample.name}/auth`]).toBeDefined();
    expect(authPackageJson.dependencies?.["better-auth"]).toBeDefined();

    if (sample.config.payments === "polar") {
      expect(webPackageJson.dependencies?.["@polar-sh/better-auth"]).toBeUndefined();
      expect(authPackageJson.dependencies?.["@polar-sh/better-auth"]).toBeDefined();
    }
  }

  if (sample.config.webDeploy === "cloudflare") {
    expect(viteConfig).toContain("const cloudflareWorkersAlias: Record<string, string>");
    expect(viteConfig).toContain('command === "serve"');
    expect(viteConfig).toContain('external: ["cloudflare:workers"]');
    const infra = await fs.readFile(path.join(projectDir, "packages/infra/alchemy.run.ts"), "utf8");
    expect(infra).toContain('flags: ["nodejs_compat"]');
    expect(infra).not.toContain("runWorkerFirst");
  }

  if (sample.config.webDeploy === "docker") {
    expect(await fs.pathExists(path.join(webDir, "Dockerfile"))).toBe(true);
  }

  if (sample.config.payments === "polar") {
    const authPackageJson = await fs.readJson(path.join(projectDir, "packages/auth/package.json"));
    expect(authPackageJson.dependencies["@polar-sh/sdk"]).toBe("^0.47.0");
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
      return await fetch(url, { ...init, signal: AbortSignal.timeout(1000) });
    } catch {
      await Bun.sleep(100);
    }
  }

  return undefined;
}

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
      const response = await fetchWhenReady(`http://127.0.0.1:${port}${pathname}`);
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

async function bootAndValidateSolidRuntime(sample: SelectedBuildSample, projectDir: string) {
  if (sample.name !== "solid-v2-self-orpc-no-auth") return;

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

async function bootAndValidateNitroRuntime(sample: SelectedBuildSample, projectDir: string) {
  if (sample.config.backend !== "nitro" || sample.config.runtime === "workers") return;

  const serverDir = path.join(projectDir, "apps/server");
  const port = await getAvailablePort();
  const runtime = execa(
    sample.config.runtime === "bun" ? "bun" : "node",
    [".output/server/index.mjs"],
    {
      cwd: serverDir,
      all: true,
      reject: false,
      env: {
        ...process.env,
        BETTER_AUTH_SECRET: "generated-build-test-secret-at-least-32-characters",
        BETTER_AUTH_URL: `http://127.0.0.1:${port}`,
        CLERK_PUBLISHABLE_KEY: "pk_test_generated-build-test",
        CLERK_SECRET_KEY: "sk_test_generated-build-test",
        CORS_ORIGIN: "https://web.example.test",
        DATABASE_URL: "file:./local.db",
        GOOGLE_GENERATIVE_AI_API_KEY: "generated-build-test-key",
        HOST: "127.0.0.1",
        NODE_ENV: "production",
        POLAR_ACCESS_TOKEN: "polar_generated-build-test",
        POLAR_SUCCESS_URL: `http://127.0.0.1:${port}/success`,
        PORT: String(port),
      },
    },
  );

  let failure: unknown;
  try {
    const root = await fetchWhenReady(`http://127.0.0.1:${port}/`);
    expect(root?.status).toBe(200);
    expect(await root?.text()).toBe("OK");

    const preflight = await fetchWhenReady(`http://127.0.0.1:${port}/rpc/healthCheck`, {
      method: "OPTIONS",
      headers: {
        origin: "https://web.example.test",
        "access-control-request-method": "POST",
      },
    });
    expect(preflight?.status).toBe(204);
    expect(preflight?.headers.get("access-control-allow-origin")).toBe("https://web.example.test");

    if (sample.config.api === "orpc") {
      const health = await fetchWhenReady(`http://127.0.0.1:${port}/rpc/healthCheck`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ json: null }),
      });
      expect(health?.status).toBe(200);
      expect(await health?.json()).toEqual({ json: "OK" });
    }

    if (sample.config.api === "trpc" && sample.config.auth !== "clerk") {
      const input = encodeURIComponent(JSON.stringify({ json: null }));
      const health = await fetchWhenReady(
        `http://127.0.0.1:${port}/trpc/healthCheck?input=${input}`,
      );
      expect(health?.status).toBe(200);
      expect(await health?.json()).toEqual({ result: { data: "OK" } });
    }

    if (sample.config.auth === "better-auth") {
      const session = await fetchWhenReady(`http://127.0.0.1:${port}/api/auth/get-session`);
      expect(session?.status).toBe(200);
      expect(await session?.json()).toBeNull();
    }
  } catch (error) {
    failure = error;
  } finally {
    runtime.kill("SIGTERM");
  }

  const result = await runtime;
  if (failure) {
    throw new Error(
      [`Generated Nitro runtime probe failed: ${String(failure)}`, formatOutput(result.all)]
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
        await validateSolidScaffold(sample, projectDir);

        for (const script of ["install", "build"] as const) {
          const { command, args } = getPackageManagerCommand(sample.packageManager, script);
          await runCommand(sample.name, projectDir, command, args);
        }
        await buildAndValidatePrismaWebArtifact(sample, projectDir);
        await bootAndValidatePrismaWebArtifact(sample, projectDir);
        await bootAndValidateSolidDevRuntime(sample, projectDir);
        await bootAndValidateSolidRuntime(sample, projectDir);
        await bootAndValidateNitroRuntime(sample, projectDir);
        await validateSolidBuildArtifacts(sample, projectDir);
        await runWorkspaceTypeChecks(sample.name, projectDir, sample.packageManager);
      },
      sampleTimeoutMs,
    );
  }
});
