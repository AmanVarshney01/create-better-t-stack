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
