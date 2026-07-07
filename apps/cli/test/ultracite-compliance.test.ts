import { describe, expect, it } from "bun:test";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { $ } from "execa";

// Opt-in guard: scaffolds real projects (network + installs) and asserts the
// generated code passes `ultracite check` and typechecks for every major
// stack combination. Run with BTS_ULTRACITE_COMPLIANCE=1 (see
// .github/workflows/ultracite-compliance.yaml).
const enabled = process.env.BTS_ULTRACITE_COMPLIANCE === "1";

const CLI = path.join(import.meta.dir, "..", "src", "cli.ts");

const BASE = {
  runtime: "bun",
  auth: "none",
  examples: ["todo"],
  git: true,
  install: true,
  dbSetup: "none",
  webDeploy: "none",
  serverDeploy: "none",
  packageManager: "bun",
  addons: ["ultracite", "turborepo", "lefthook"],
  database: "sqlite",
  orm: "drizzle",
  backend: "hono",
  api: "trpc",
  addonOptions: {
    ultracite: {
      linter: "oxlint",
      editors: ["vscode"],
      agents: ["universal"],
      hooks: [],
    },
  },
};

const COMBOS: Array<{ name: string; overrides: Record<string, unknown> }> = [
  { name: "tanstack-router", overrides: { frontend: ["tanstack-router"] } },
  { name: "next", overrides: { frontend: ["next"] } },
  { name: "react-router-orpc", overrides: { frontend: ["react-router"], api: "orpc" } },
  { name: "tanstack-start", overrides: { frontend: ["tanstack-start"] } },
  { name: "svelte", overrides: { frontend: ["svelte"], api: "orpc" } },
  { name: "solid", overrides: { frontend: ["solid"], api: "orpc" } },
  { name: "nuxt", overrides: { frontend: ["nuxt"], api: "orpc" } },
  { name: "astro", overrides: { frontend: ["astro"], api: "orpc" } },
  { name: "native-uniwind", overrides: { frontend: ["native-uniwind"], examples: [] } },
  {
    name: "mongoose",
    overrides: { frontend: ["tanstack-router"], database: "mongodb", orm: "mongoose" },
  },
  {
    name: "prisma",
    overrides: { frontend: ["tanstack-router"], database: "postgres", orm: "prisma" },
  },
  {
    name: "express-node",
    overrides: { frontend: ["tanstack-router"], backend: "express", runtime: "node" },
  },
  {
    name: "better-auth-husky",
    overrides: {
      frontend: ["tanstack-router"],
      auth: "better-auth",
      addons: ["ultracite", "turborepo", "husky"],
    },
  },
  { name: "ai-example", overrides: { frontend: ["tanstack-router"], examples: ["ai"] } },
  {
    name: "convex",
    overrides: {
      frontend: ["tanstack-router"],
      backend: "convex",
      api: "none",
      database: "none",
      orm: "none",
      runtime: "none",
    },
  },
  { name: "elysia", overrides: { frontend: ["tanstack-router"], backend: "elysia" } },
  { name: "native-bare-orpc", overrides: { frontend: ["native-bare"], api: "orpc" } },
  {
    name: "native-unistyles-polar",
    overrides: { frontend: ["native-unistyles"], auth: "better-auth", payments: "polar" },
  },
  { name: "clerk-web", overrides: { frontend: ["tanstack-router"], auth: "clerk" } },
  { name: "clerk-native", overrides: { frontend: ["native-bare"], auth: "clerk", examples: [] } },
  {
    name: "clerk-convex",
    overrides: {
      frontend: ["tanstack-router"],
      backend: "convex",
      api: "none",
      database: "none",
      orm: "none",
      runtime: "none",
      auth: "clerk",
    },
  },
  {
    name: "better-auth-convex",
    overrides: {
      frontend: ["react-router"],
      backend: "convex",
      api: "none",
      database: "none",
      orm: "none",
      runtime: "none",
      auth: "better-auth",
    },
  },
  {
    name: "self-next",
    overrides: { frontend: ["next"], backend: "self", runtime: "none", auth: "better-auth" },
  },
  {
    name: "self-start-orpc",
    overrides: {
      frontend: ["tanstack-start"],
      backend: "self",
      runtime: "none",
      api: "orpc",
      auth: "better-auth",
    },
  },
  {
    name: "mysql-docker",
    overrides: { frontend: ["tanstack-router"], database: "mysql", dbSetup: "docker" },
  },
  {
    name: "fastify-prisma",
    overrides: { frontend: ["tanstack-router"], backend: "fastify", orm: "prisma" },
  },
  {
    name: "prisma-mongodb",
    overrides: { frontend: ["svelte"], api: "orpc", database: "mongodb", orm: "prisma" },
  },
  {
    name: "postgres-docker-deploy",
    overrides: {
      frontend: ["solid"],
      api: "orpc",
      database: "postgres",
      dbSetup: "docker",
      webDeploy: "docker",
      serverDeploy: "docker",
    },
  },
  {
    name: "vercel-deploy",
    overrides: {
      frontend: ["next"],
      auth: "better-auth",
      webDeploy: "vercel",
      serverDeploy: "vercel",
    },
  },
  {
    name: "workers-d1",
    overrides: {
      frontend: ["tanstack-router"],
      runtime: "workers",
      dbSetup: "d1",
      webDeploy: "cloudflare",
      serverDeploy: "cloudflare",
    },
  },
  {
    name: "desktop-addons",
    overrides: {
      frontend: ["tanstack-router"],
      addons: ["ultracite", "turborepo", "lefthook", "pwa", "electrobun"],
    },
  },
  { name: "pnpm", overrides: { frontend: ["react-router"], api: "orpc", packageManager: "pnpm" } },
  {
    name: "frontend-only",
    overrides: {
      frontend: ["tanstack-router"],
      backend: "none",
      api: "none",
      database: "none",
      orm: "none",
      runtime: "none",
      examples: [],
    },
  },
];

describe.skipIf(!enabled)("ultracite template compliance (oxlint)", () => {
  for (const combo of COMBOS) {
    it(`scaffold (${combo.name}) passes ultracite check and typechecks`, async () => {
      const dir = await mkdtemp(path.join(tmpdir(), "bts-ultracite-"));
      try {
        const payload = { ...BASE, ...combo.overrides, projectName: "compliance-check" };
        // the global test preload sets skip flags; the spawned CLI must run externals
        const env = { BTS_SKIP_EXTERNAL_COMMANDS: "0", BTS_TEST_MODE: "0" };
        await $({ cwd: dir, env })`bun run ${CLI} create-json --input ${JSON.stringify(payload)}`;

        const projectDir = path.join(dir, "compliance-check");
        // fix mirrors what the installed pre-commit hook runs; twice because
        // ultracite's lint autofixes aren't re-formatted within the same pass
        await $({ cwd: projectDir, reject: false })`bun run fix`;
        await $({ cwd: projectDir, reject: false })`bun run fix`;
        const check = await $({ cwd: projectDir, reject: false })`bun run check`;
        expect(`${check.stdout}\n${check.stderr}`).not.toMatch(/: (error|warning) /);
        expect(check.exitCode).toBe(0);

        const tsc = await $({ cwd: projectDir, reject: false })`bun run check-types`;
        expect(tsc.exitCode).toBe(0);
      } finally {
        await rm(dir, { recursive: true, force: true });
      }
    }, 900_000);
  }
});
