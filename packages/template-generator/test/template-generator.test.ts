import type { ProjectConfig } from "@better-t-stack/types";

import { describe, expect, it } from "bun:test";

import { VirtualFileSystem } from "../src/core/virtual-fs";
import { processPackageConfigs } from "../src/post-process/package-configs";
import { processReadme } from "../src/processors/readme-generator";
import { processTurboConfig } from "../src/processors/turbo-generator";
import { generateReproducibleCommand } from "../src/utils/reproducible-command";

function baseConfig(overrides: Partial<ProjectConfig> = {}): ProjectConfig {
  return {
    projectName: "test-app",
    projectDir: "/tmp/test-app",
    relativePath: "test-app",
    database: "sqlite",
    orm: "drizzle",
    backend: "hono",
    runtime: "bun",
    frontend: ["tanstack-router"],
    addons: [],
    examples: [],
    auth: "none",
    payments: "none",
    git: true,
    packageManager: "bun",
    install: false,
    dbSetup: "none",
    api: "trpc",
    webDeploy: "none",
    serverDeploy: "none",
    ...overrides,
  };
}

describe("template-generator logic", () => {
  it("omits 'none' from multi-select flags when other values exist", () => {
    const command = generateReproducibleCommand(
      baseConfig({
        frontend: ["none", "next"],
        addons: ["none", "pwa"],
        examples: ["none", "ai"],
      }),
    );

    expect(command).toContain("--frontend next");
    expect(command).not.toContain("--frontend none");
    expect(command).toContain("--addons pwa");
    expect(command).not.toContain("--addons none");
    expect(command).toContain("--examples ai");
    expect(command).not.toContain("--examples none");
  });

  it("skips db scripts in README for mongoose configs", () => {
    const vfs = new VirtualFileSystem();
    processReadme(
      vfs,
      baseConfig({
        database: "mongodb",
        orm: "mongoose",
      }),
    );

    const readme = vfs.readFile("README.md") ?? "";
    expect(readme).not.toContain("db:push");
    expect(readme).not.toContain("db:generate");
    expect(readme).not.toContain("db:migrate");
    expect(readme).not.toContain("db:studio");
  });

  it("skips db:studio in README for D1 + Cloudflare", () => {
    const vfs = new VirtualFileSystem();
    processReadme(
      vfs,
      baseConfig({
        database: "sqlite",
        orm: "drizzle",
        dbSetup: "d1",
        serverDeploy: "cloudflare",
      }),
    );

    const readme = vfs.readFile("README.md") ?? "";
    expect(readme).toContain("db:push");
    expect(readme).not.toContain("db:studio");
  });

  it("omits db tasks from turbo config when ORM does not support them", () => {
    const vfs = new VirtualFileSystem();
    processTurboConfig(
      vfs,
      baseConfig({
        addons: ["turborepo"],
        database: "mongodb",
        orm: "mongoose",
      }),
    );

    const turbo = vfs.readJson<{ tasks?: Record<string, unknown> }>("turbo.json");
    expect(turbo?.tasks).toBeDefined();
    expect(turbo?.tasks?.["db:push"]).toBeUndefined();
    expect(turbo?.tasks?.["db:generate"]).toBeUndefined();
    expect(turbo?.tasks?.["db:migrate"]).toBeUndefined();
    expect(turbo?.tasks?.["db:studio"]).toBeUndefined();
  });

  it("adds db:local script for sqlite when using local setup", () => {
    const vfs = new VirtualFileSystem();
    vfs.writeJson("package.json", { scripts: {}, workspaces: [] });
    vfs.writeJson("packages/db/package.json", { scripts: {} });

    processPackageConfigs(
      vfs,
      baseConfig({
        database: "sqlite",
        orm: "drizzle",
        dbSetup: "none",
      }),
    );

    const dbPkg = vfs.readJson<{ scripts?: Record<string, string> }>("packages/db/package.json");
    expect(dbPkg?.scripts?.["db:local"]).toBe("turso dev --db-file local.db");
  });
});
