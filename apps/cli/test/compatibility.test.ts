import { describe, expect, test } from "bun:test";
import { join } from "node:path";

import { execa } from "execa";
import fs from "fs-extra";

import { SMOKE_DIR } from "./setup";

const cli = join(import.meta.dir, "../dist/cli.mjs");
const base = {
  frontend: ["tanstack-router"],
  backend: "hono",
  runtime: "bun",
  database: "sqlite",
  orm: "drizzle",
  dbSetup: "none",
  api: "trpc",
  auth: "none",
  payments: "none",
  addons: ["none"],
  examples: ["none"],
  webDeploy: "none",
  serverDeploy: "none",
  packageManager: "bun",
  install: false,
  git: false,
  dryRun: false,
  disableAnalytics: true,
};

const invalidStacks = [
  ...["nuxt", "svelte", "solid", "astro"].map((frontend) => ({
    name: `${frontend}-trpc`,
    options: { frontend: [frontend] },
    error: /tRPC API is not supported/,
  })),
  {
    name: "multiple-web",
    options: { frontend: ["next", "svelte"] },
    error: /multiple web frameworks/,
  },
  {
    name: "multiple-native",
    options: { frontend: ["native-bare", "native-uniwind"] },
    error: /multiple native frameworks/,
  },
  {
    name: "self-spa",
    options: { backend: "self", runtime: "none" },
    error: /Backend 'self'.*only supports/,
  },
  {
    name: "workers-express",
    options: { backend: "express", runtime: "workers" },
    error: /Workers.*only supported with Hono/,
  },
  {
    name: "mongoose-postgres",
    options: { database: "postgres", orm: "mongoose" },
    error: /Mongoose ORM requires MongoDB/,
  },
  { name: "database-without-orm", options: { orm: "none" }, error: /requires an ORM/ },
  { name: "neon-sqlite", options: { dbSetup: "neon" }, error: /Neon setup requires PostgreSQL/ },
  {
    name: "d1-without-deploy",
    options: { runtime: "workers", dbSetup: "d1" },
    error: /D1 setup requires/,
  },
  {
    name: "polar-clerk",
    options: { auth: "clerk", payments: "polar" },
    error: /Polar payments requires Better Auth/,
  },
  {
    name: "clerk-mixed-nuxt",
    options: { frontend: ["nuxt", "native-bare"], api: "orpc", auth: "clerk" },
    error: /Clerk authentication is not compatible.*nuxt/,
  },
  {
    name: "convex-database",
    options: { backend: "convex", runtime: "none", api: "none" },
    error: /Convex.*requires '--database none'/,
  },
  {
    name: "todo-without-db",
    options: { database: "none", orm: "none", examples: ["todo"] },
    error: /todo.*requires a database/,
  },
  {
    name: "todo-without-api",
    options: { api: "none", examples: ["todo"] },
    error: /todo.*requires an API layer/,
  },
  {
    name: "solid-ai",
    options: { frontend: ["solid"], api: "orpc", examples: ["ai"] },
    error: /ai.*not compatible with the Solid/,
  },
  {
    name: "task-runner-conflict",
    options: { addons: ["turborepo", "nx"] },
    error: /nx.*turborepo.*cannot be used together/,
  },
  {
    name: "observability-conflict",
    options: { addons: ["evlog", "axiom"] },
    error: /evlog.*axiom.*cannot be used together/,
  },
  {
    name: "native-web-deploy",
    options: { frontend: ["native-bare"], webDeploy: "vercel" },
    error: /web-deploy.*requires a web frontend/,
  },
  {
    name: "vercel-bun-runtime",
    options: { serverDeploy: "vercel" },
    error: /server-deploy vercel.*runtime bun/,
  },
  {
    name: "docker-workers",
    options: { runtime: "workers", serverDeploy: "docker" },
    error: /server-deploy docker.*runtime workers/,
  },
  {
    name: "planetscale-auto",
    options: { database: "postgres", dbSetup: "planetscale", dbSetupOptions: { mode: "auto" } },
    error: /PlanetScale does not support automatic database setup/,
  },
  {
    name: "alchemy-wrong-owner",
    options: {
      database: "postgres",
      dbSetup: "neon",
      dbSetupOptions: { mode: "alchemy" },
      serverDeploy: "vercel",
      runtime: "node",
    },
    error: /Alchemy database provisioning requires/,
  },
  {
    name: "unknown-key",
    options: { pakageManager: "bun" },
    error: /Unrecognized key.*pakageManager/,
  },
  {
    name: "conflicting-db-mode",
    options: { manualDb: true, dbSetupOptions: { mode: "manual" } },
    error: /manualDb.*dbSetupOptions.mode.*mutually exclusive/,
  },
  {
    name: "unknown-addon-option",
    options: { addonOptions: { mcp: { scope: "project", invented: true } } },
    error: /Unrecognized key.*invented/,
  },
];

function run(json: string) {
  return execa("node", [cli, "create-json", "--json", json], {
    cwd: SMOKE_DIR,
    reject: false,
    timeout: 15_000,
    env: { BTS_TELEMETRY: "0", BTS_TEST_MODE: "0", BTS_SKIP_EXTERNAL_COMMANDS: "0" },
  });
}

describe("CLI compatibility rejection", () => {
  for (const { name, options, error } of invalidStacks) {
    test(`rejects ${name} without creating a project`, async () => {
      const projectName = join(SMOKE_DIR, `compatibility-${name}`);
      const result = await run(JSON.stringify({ ...base, ...options, projectName }));
      expect(result.exitCode).toBe(1);
      expect(`${result.stdout}\n${result.stderr}`).toMatch(error);
      expect(await fs.pathExists(projectName)).toBe(false);
    });
  }
});

// These accepted edges are not represented by the generated-build fixtures.
const acceptedStacks = [
  {
    name: "self-d1",
    options: {
      frontend: ["next"],
      backend: "self",
      runtime: "none",
      dbSetup: "d1",
      webDeploy: "cloudflare",
      auth: "better-auth",
    },
  },
  { name: "server-only-clerk", options: { frontend: ["none"], auth: "clerk" } },
  {
    name: "mixed-clerk",
    options: { frontend: ["tanstack-router", "native-uniwind"], auth: "clerk" },
  },
];

for (const { name, options } of acceptedStacks) {
  test(`plans supported ${name} without dropping selections`, async () => {
    const projectName = join(SMOKE_DIR, `compatibility-${name}`);
    const result = await run(JSON.stringify({ ...base, ...options, projectName, dryRun: true }));
    expect(result.exitCode).toBe(0);
    expect(JSON.parse(result.stdout)).toMatchObject({
      success: true,
      projectConfig: {
        ...options,
        frontend: options.frontend[0] === "none" ? [] : options.frontend,
      },
    });
    expect(await fs.pathExists(projectName)).toBe(false);
  });
}

for (const name of ["invalid?name", "invalid\nname"]) {
  test(`rejects unsafe project name ${JSON.stringify(name)} before writing`, async () => {
    const projectName = join(SMOKE_DIR, name);
    const result = await run(JSON.stringify({ ...base, projectName, dryRun: false }));
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toMatch(/Invalid project name|control characters/);
    expect(await fs.pathExists(projectName)).toBe(false);
  });
}

for (const name of ["literal%23folder", "literal#folder"]) {
  test(`creates literal filesystem path ${name} without treating it as a URL`, async () => {
    const projectName = join(SMOKE_DIR, name);
    const result = await run(JSON.stringify({ ...base, projectName, dryRun: false }));
    expect(result.exitCode).toBe(0);
    expect(JSON.parse(result.stdout)).toMatchObject({
      success: true,
      projectDirectory: projectName,
    });
    expect(await fs.pathExists(join(projectName, "package.json"))).toBe(true);
  });
}
