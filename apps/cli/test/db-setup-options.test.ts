import { describe, expect, it } from "bun:test";
import fs from "fs-extra";
import path from "node:path";

import { create } from "../src/index";
import { readBtsConfig } from "../src/utils/bts-config";

const SMOKE_DIR_PATH = path.join(import.meta.dir, "..", ".smoke");

describe("Database setup options", () => {
  it("defaults remote provider setup to manual in silent mode and persists the resolved mode", async () => {
    const projectPath = path.join(SMOKE_DIR_PATH, "db-setup-neon-default-manual");
    await fs.remove(projectPath);

    const result = await create(projectPath, {
      frontend: ["tanstack-router"],
      backend: "hono",
      runtime: "bun",
      database: "postgres",
      orm: "drizzle",
      auth: "none",
      payments: "none",
      api: "trpc",
      addons: ["none"],
      examples: ["none"],
      dbSetup: "neon",
      webDeploy: "none",
      serverDeploy: "none",
      install: false,
      disableAnalytics: true,
    });

    expect(result.isOk()).toBe(true);
    if (result.isErr()) return;

    expect(result.value.projectConfig.dbSetupOptions).toEqual({ mode: "manual" });
    expect(result.value.reproducibleCommand).toContain("create-json --input");

    const btsConfig = await readBtsConfig(projectPath);
    expect(btsConfig?.dbSetupOptions).toEqual({ mode: "manual" });
  });

  it("does not inject manual dbSetupOptions for non-provisioning setups", async () => {
    const projectPath = path.join(SMOKE_DIR_PATH, "db-setup-d1-no-manual-default");
    await fs.remove(projectPath);

    const result = await create(projectPath, {
      frontend: ["tanstack-router"],
      backend: "hono",
      runtime: "workers",
      database: "sqlite",
      orm: "drizzle",
      auth: "none",
      payments: "none",
      api: "trpc",
      addons: ["none"],
      examples: ["none"],
      dbSetup: "d1",
      webDeploy: "none",
      serverDeploy: "cloudflare",
      install: false,
      disableAnalytics: true,
    });

    expect(result.isOk()).toBe(true);
    if (result.isErr()) return;

    expect(result.value.projectConfig.dbSetupOptions).toBeUndefined();

    const btsConfig = await readBtsConfig(projectPath);
    expect(btsConfig?.dbSetupOptions).toBeUndefined();
  });

  it("does not persist dbSetupOptions or force create-json when dbSetup is none", async () => {
    const projectPath = path.join(SMOKE_DIR_PATH, "db-setup-none-no-structured-options");
    await fs.remove(projectPath);

    const result = await create(projectPath, {
      frontend: ["tanstack-router"],
      backend: "hono",
      runtime: "bun",
      database: "sqlite",
      orm: "drizzle",
      auth: "better-auth",
      payments: "none",
      api: "trpc",
      addons: ["turborepo"],
      examples: ["todo"],
      dbSetup: "none",
      webDeploy: "none",
      serverDeploy: "none",
      git: true,
      packageManager: "bun",
      install: true,
      manualDb: false,
      disableAnalytics: true,
    });

    expect(result.isOk()).toBe(true);
    if (result.isErr()) return;

    expect(result.value.projectConfig.dbSetupOptions).toBeUndefined();
    expect(result.value.reproducibleCommand).not.toContain("create-json --input");

    const btsConfig = await readBtsConfig(projectPath);
    expect(btsConfig?.dbSetupOptions).toBeUndefined();
  });
});
