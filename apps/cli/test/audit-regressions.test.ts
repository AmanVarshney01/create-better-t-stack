import { describe, expect, it } from "bun:test";
import { readFile, rename, writeFile } from "node:fs/promises";
import { join } from "node:path";

import { processPwaPlugins, VirtualFileSystem } from "@better-t-stack/template-generator";
import type { ProjectConfig } from "@better-t-stack/types";

import { add, create } from "../src";
import { SMOKE_DIR } from "./setup";

const config: ProjectConfig = {
  projectName: "audit-regression",
  projectDir: "/unused",
  relativePath: ".",
  frontend: ["tanstack-router"],
  backend: "none",
  runtime: "none",
  database: "none",
  orm: "none",
  auth: "none",
  payments: "none",
  api: "none",
  dbSetup: "none",
  webDeploy: "none",
  serverDeploy: "none",
  addons: ["none"],
  examples: ["none"],
  packageManager: "bun",
  git: false,
  install: false,
};

async function makeProject(name: string, overrides: Partial<ProjectConfig> = {}) {
  const projectDir = join(SMOKE_DIR, name);
  const { projectName: _name, projectDir: _dir, relativePath: _relative, ...input } = config;
  const result = await create(projectDir, { ...input, ...overrides });
  expect(result.isOk()).toBe(true);
  return projectDir;
}

async function readPackage(projectDir: string, file = "package.json") {
  return JSON.parse(await readFile(join(projectDir, file), "utf8"));
}

describe("Add Path regressions", () => {
  for (const relative of [false, true]) {
    it(`preserves workspace identity in a renamed directory (${relative ? "relative" : "absolute"} path)`, async () => {
      const originalDir = await makeProject(`scope-original-${relative}`, {
        addons: ["turborepo"],
      });
      const projectDir = join(SMOKE_DIR, `scope-renamed-${relative}`);
      const envBefore = await readPackage(originalDir, "packages/env/package.json");
      const webBefore = await readPackage(originalDir, "apps/web/package.json");
      const rootBefore = await readPackage(originalDir);
      rootBefore.name = "custom-root-name";
      await writeFile(join(originalDir, "package.json"), JSON.stringify(rootBefore));
      await rename(originalDir, projectDir);
      const cwd = process.cwd();
      try {
        if (relative) process.chdir(projectDir);
        const result = await add({
          projectDir: relative ? "." : projectDir,
          addons: ["biome"],
          install: false,
        });
        expect(result.success).toBe(true);
        expect(result.projectDir).toBe(projectDir);
      } finally {
        process.chdir(cwd);
      }
      expect((await readPackage(projectDir)).name).toBe("custom-root-name");
      expect((await readPackage(projectDir, "packages/env/package.json")).name).toBe(
        envBefore.name,
      );
      expect((await readPackage(projectDir, "apps/web/package.json")).dependencies).toEqual(
        webBefore.dependencies,
      );
    });
  }

  it("adds runnable Electrobun scripts without a task runner", async () => {
    const projectDir = await makeProject("desktop-without-runner");
    const result = await add({ projectDir, addons: ["electrobun"], install: false });
    expect(result.success).toBe(true);
    const desktop = await readPackage(projectDir, "apps/desktop/package.json");
    expect(desktop.scripts["dev:hmr"]).toContain("electrobun");
    expect(desktop.scripts["build:stable"]).toContain("electrobun");
    const root = await readPackage(projectDir);
    expect(root.scripts["dev:desktop"]).toContain("dev:hmr");
    expect(root.scripts["build:desktop"]).toContain("build:stable");
  });

  for (const taskRunner of ["none", "turborepo"] as const) {
    it(`activates PWA when added with ${taskRunner}`, async () => {
      const projectDir = await makeProject(`add-pwa-${taskRunner}`, { addons: [taskRunner] });
      const result = await add({ projectDir, addons: ["pwa"], install: false });
      expect(result.success).toBe(true);
      const vite = await readFile(join(projectDir, "apps/web/vite.config.ts"), "utf8");
      expect(vite).toContain('from "vite-plugin-pwa"');
      expect(vite).toContain("VitePWA({");
    });
  }
});

describe("PWA template regressions", () => {
  it("registers PWA in the Solid Cloudflare config callback", async () => {
    const projectDir = await makeProject("solid-cloudflare-pwa", {
      frontend: ["solid"],
      webDeploy: "cloudflare",
      addons: ["pwa"],
    });
    const vite = await readFile(join(projectDir, "apps/web/vite.config.ts"), "utf8");
    expect(vite).toContain("VitePWA({");
    expect(vite).toContain("cloudflareWorkersAlias");
    expect(vite).toContain('command === "serve"');
  });

  it("launches the Next PWA at its generated home route", async () => {
    const projectDir = await makeProject("next-pwa-home", { frontend: ["next"], addons: ["pwa"] });
    expect(await readFile(join(projectDir, "apps/web/src/app/manifest.ts"), "utf8")).toContain(
      'start_url: "/"',
    );
  });

  for (const expression of [
    "{ plugins: [] }",
    "() => ({ plugins: [] })",
    "function () { const helper = () => ({ plugins: [] }); return { plugins: [helper()] }; }",
  ]) {
    it(`registers PWA once in ${expression}`, () => {
      const vfs = new VirtualFileSystem();
      vfs.writeFile(
        "apps/web/vite.config.ts",
        `import { defineConfig } from "vite"; export default defineConfig(${expression});`,
      );
      processPwaPlugins(vfs, { ...config, addons: ["pwa"] });
      processPwaPlugins(vfs, { ...config, addons: ["pwa"] });
      expect(vfs.readFile("apps/web/vite.config.ts")?.match(/VitePWA\(/g)).toHaveLength(1);
    });
  }
});
