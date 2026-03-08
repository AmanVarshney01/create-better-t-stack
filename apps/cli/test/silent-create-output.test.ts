import { describe, expect, it } from "bun:test";
import path from "node:path";

import { execa } from "execa";
import fs from "fs-extra";

import { SMOKE_DIR } from "./setup";

const CLI_INDEX_PATH = path.join(import.meta.dir, "..", "src", "index.ts");

type SilentCreateCase = {
  name: string;
  projectName: string;
  options: Record<string, unknown>;
};

async function runSilentCreate(testCase: SilentCreateCase) {
  const projectPath = path.join(SMOKE_DIR, testCase.projectName);
  await fs.remove(projectPath);

  const script = `
    import { create } from ${JSON.stringify(CLI_INDEX_PATH)};

    const result = await create(${JSON.stringify(testCase.projectName)}, {
      ...${JSON.stringify(testCase.options)},
      disableAnalytics: true,
    });

    if (result.isErr()) {
      console.error(result.error.message);
      process.exit(1);
    }
  `;

  const result = await execa("bun", ["-e", script], {
    cwd: SMOKE_DIR,
    env: {
      BTS_TELEMETRY_DISABLED: "1",
    },
    reject: false,
  });

  return {
    ...result,
    projectPath,
  };
}

describe("silent create output", () => {
  const cases: SilentCreateCase[] = [
    {
      name: "stays quiet for oxlint addon setup",
      projectName: "silent-addon-oxlint",
      options: {
        frontend: ["next"],
        backend: "hono",
        runtime: "node",
        database: "none",
        orm: "none",
        api: "none",
        auth: "none",
        payments: "none",
        addons: ["nx", "oxlint"],
        examples: [],
        git: true,
        packageManager: "pnpm",
        install: false,
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
      },
    },
    {
      name: "stays quiet for manual neon setup",
      projectName: "silent-db-neon",
      options: {
        frontend: ["next"],
        backend: "hono",
        runtime: "node",
        database: "postgres",
        orm: "drizzle",
        api: "trpc",
        auth: "none",
        payments: "none",
        addons: [],
        examples: [],
        git: true,
        packageManager: "pnpm",
        install: false,
        dbSetup: "neon",
        dbSetupOptions: { mode: "manual" },
        webDeploy: "none",
        serverDeploy: "none",
      },
    },
    {
      name: "stays quiet for manual prisma-postgres setup",
      projectName: "silent-db-prisma-postgres",
      options: {
        frontend: ["next"],
        backend: "hono",
        runtime: "node",
        database: "postgres",
        orm: "prisma",
        api: "trpc",
        auth: "none",
        payments: "none",
        addons: [],
        examples: [],
        git: true,
        packageManager: "pnpm",
        install: false,
        dbSetup: "prisma-postgres",
        dbSetupOptions: { mode: "manual" },
        webDeploy: "none",
        serverDeploy: "none",
      },
    },
    {
      name: "stays quiet for manual turso setup",
      projectName: "silent-db-turso",
      options: {
        frontend: ["next"],
        backend: "hono",
        runtime: "node",
        database: "sqlite",
        orm: "drizzle",
        api: "trpc",
        auth: "none",
        payments: "none",
        addons: [],
        examples: [],
        git: true,
        packageManager: "pnpm",
        install: false,
        dbSetup: "turso",
        dbSetupOptions: { mode: "manual" },
        webDeploy: "none",
        serverDeploy: "none",
      },
    },
    {
      name: "stays quiet for manual supabase setup",
      projectName: "silent-db-supabase",
      options: {
        frontend: ["next"],
        backend: "hono",
        runtime: "node",
        database: "postgres",
        orm: "drizzle",
        api: "trpc",
        auth: "none",
        payments: "none",
        addons: [],
        examples: [],
        git: true,
        packageManager: "pnpm",
        install: false,
        dbSetup: "supabase",
        dbSetupOptions: { mode: "manual" },
        webDeploy: "none",
        serverDeploy: "none",
      },
    },
    {
      name: "stays quiet for manual mongodb atlas setup",
      projectName: "silent-db-mongodb-atlas",
      options: {
        frontend: ["next"],
        backend: "hono",
        runtime: "node",
        database: "mongodb",
        orm: "mongoose",
        api: "none",
        auth: "none",
        payments: "none",
        addons: [],
        examples: [],
        git: true,
        packageManager: "pnpm",
        install: false,
        dbSetup: "mongodb-atlas",
        dbSetupOptions: { mode: "manual" },
        webDeploy: "none",
        serverDeploy: "none",
      },
    },
  ];

  for (const testCase of cases) {
    it(testCase.name, async () => {
      const result = await runSilentCreate(testCase);

      expect(result.exitCode).toBe(0);
      expect(result.stdout).toBe("");
      expect(result.stderr).toBe("");
      expect(await fs.pathExists(result.projectPath)).toBe(true);
    });
  }
});
