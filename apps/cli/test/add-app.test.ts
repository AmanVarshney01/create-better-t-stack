import { describe, expect, it } from "bun:test";
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";

import { parse as parseJsonc } from "jsonc-parser";
import { parse as parseYaml } from "yaml";

import { add, addApp, create } from "../src/index";
import type { BetterTStackConfig } from "../src/types";
import { SMOKE_DIR } from "./setup";
import { expectSuccess, runTRPCTest } from "./test-utils";

async function writeSyntheticProject(
  name: string,
  overrides: Partial<BetterTStackConfig> = {},
): Promise<string> {
  const projectDir = join(SMOKE_DIR, name);
  await rm(projectDir, { recursive: true, force: true });
  await mkdir(projectDir, { recursive: true });
  await writeFile(
    join(projectDir, "bts.jsonc"),
    JSON.stringify({
      version: "0.0.0-test",
      createdAt: new Date(0).toISOString(),
      database: "none",
      orm: "none",
      backend: "hono",
      runtime: "bun",
      frontend: ["tanstack-router"],
      addons: ["none"],
      examples: ["none"],
      auth: "none",
      payments: "none",
      packageManager: "bun",
      dbSetup: "none",
      api: "trpc",
      webDeploy: "none",
      serverDeploy: "none",
      ...overrides,
    }),
  );
  return projectDir;
}

async function scaffoldProject(projectName: string) {
  const result = await runTRPCTest({
    projectName,
    frontend: ["tanstack-router"],
    backend: "hono",
    runtime: "bun",
    api: "trpc",
    database: "none",
    orm: "none",
    auth: "none",
    payments: "none",
    addons: [],
    examples: [],
    dbSetup: "none",
    webDeploy: "none",
    serverDeploy: "none",
    git: false,
    install: false,
  });
  expectSuccess(result);
  return join(SMOKE_DIR, projectName);
}

async function collectAppFiles(dir: string): Promise<Map<string, string>> {
  const files = new Map<string, string>();
  async function walk(current: string) {
    for (const entry of await readdir(current, { withFileTypes: true })) {
      const fullPath = join(current, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
      } else {
        files.set(fullPath, await readFile(fullPath, "utf-8"));
      }
    }
  }
  await walk(dir);
  return files;
}

describe("addApp()", () => {
  describe("refusals", () => {
    it("returns an error in silent mode when the project config is missing", async () => {
      const projectDir = join(SMOKE_DIR, "add-app-missing-config");
      await mkdir(projectDir, { recursive: true });

      const result = await addApp({ projectDir, name: "admin", frontend: "next" });

      expect(result.success).toBe(false);
      expect(result.error).toContain("No Better-T-Stack project found");
    });

    it("requires name and frontend in silent mode", async () => {
      const projectDir = await writeSyntheticProject("add-app-silent-args");

      const result = await addApp({ projectDir });

      expect(result.success).toBe(false);
      expect(result.error).toContain("required in silent mode");
    });

    it("rejects reserved app names", async () => {
      const projectDir = await writeSyntheticProject("add-app-reserved-names");

      for (const name of ["web", "server", "native", "env", "ui"]) {
        const result = await addApp({ projectDir, name, frontend: "next" });
        expect(result.success).toBe(false);
        expect(result.error).toContain("reserved");
      }
    });

    it("rejects invalid app name syntax", async () => {
      const projectDir = await writeSyntheticProject("add-app-invalid-names");

      for (const name of ["Admin", "my app", "../evil", "1admin", "-admin"]) {
        const result = await addApp({ projectDir, name, frontend: "next" });
        expect(result.success).toBe(false);
        expect(result.error).toContain("App name");
      }
    });

    it("rejects a frontend incompatible with the project's tRPC api", async () => {
      const projectDir = await writeSyntheticProject("add-app-trpc-nuxt", { api: "trpc" });

      const result = await addApp({ projectDir, name: "admin", frontend: "nuxt" });

      expect(result.success).toBe(false);
      expect(result.error).toContain("tRPC API is not supported");
    });

    it("rejects a frontend incompatible with clerk auth", async () => {
      const projectDir = await writeSyntheticProject("add-app-clerk-svelte", {
        api: "orpc",
        auth: "clerk",
      });

      const result = await addApp({ projectDir, name: "admin", frontend: "svelte" });

      expect(result.success).toBe(false);
      expect(result.error).toContain("not compatible");
    });

    it("rejects a frontend incompatible with a convex backend", async () => {
      const projectDir = await writeSyntheticProject("add-app-convex-solid", {
        backend: "convex",
        runtime: "none",
        api: "none",
      });

      const result = await addApp({ projectDir, name: "admin", frontend: "solid" });

      expect(result.success).toBe(false);
      expect(result.error).toContain("not compatible");
    });

    it("rejects adding an app to a fullstack (self) project", async () => {
      const projectDir = await writeSyntheticProject("add-app-self", {
        backend: "self",
        frontend: ["next"],
        api: "none",
        runtime: "none",
      });

      const result = await addApp({ projectDir, name: "admin", frontend: "next" });

      expect(result.success).toBe(false);
      expect(result.error).toContain("fullstack");
    });

    it("rejects an app name already present in bts.jsonc", async () => {
      const projectDir = await writeSyntheticProject("add-app-duplicate", {
        apps: [{ name: "admin", frontend: "next", port: 3002 }],
      });

      const result = await addApp({ projectDir, name: "admin", frontend: "next" });

      expect(result.success).toBe(false);
      expect(result.error).toContain("already exists");
    });

    it("rejects when the app directory already exists", async () => {
      const projectDir = await writeSyntheticProject("add-app-dir-conflict");
      await mkdir(join(projectDir, "apps", "admin"), { recursive: true });
      await writeFile(join(projectDir, "apps", "admin", "keep.txt"), "user file");

      const result = await addApp({ projectDir, name: "admin", frontend: "next" });

      expect(result.success).toBe(false);
      expect(result.error).toContain("already exists");
      expect(await readFile(join(projectDir, "apps", "admin", "keep.txt"), "utf-8")).toBe(
        "user file",
      );
    });

    it("rejects a port already used by the project", async () => {
      const projectDir = await writeSyntheticProject("add-app-port-conflict");

      const result = await addApp({ projectDir, name: "admin", frontend: "next", port: 3001 });

      expect(result.success).toBe(false);
      expect(result.error).toContain("already used");
    });

    it("returns a validation error for invalid input shapes", async () => {
      const result = await addApp({
        name: "admin",
        // @ts-expect-error - intentionally invalid
        frontend: "angular",
      });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe("create --apps", () => {
    it("scaffolds extra apps as part of project creation", async () => {
      const projectDir = join(SMOKE_DIR, "create-with-apps");
      await rm(projectDir, { recursive: true, force: true });

      const result = await create(projectDir, {
        frontend: ["tanstack-router"],
        backend: "hono",
        runtime: "bun",
        api: "orpc",
        database: "none",
        orm: "none",
        auth: "none",
        payments: "none",
        addons: ["turborepo"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        apps: ["admin:next", "landing:astro"],
        install: false,
        git: false,
        packageManager: "bun",
        disableAnalytics: true,
      });
      expect(result.isOk()).toBe(true);

      const adminPkg = JSON.parse(
        await readFile(join(projectDir, "apps", "admin", "package.json"), "utf-8"),
      );
      expect(adminPkg.name).toBe("admin");
      expect(adminPkg.scripts.dev).toContain("--port 3002");

      const landingPkg = JSON.parse(
        await readFile(join(projectDir, "apps", "landing", "package.json"), "utf-8"),
      );
      expect(landingPkg.scripts.dev).toContain("--port 3003");

      const rootPkg = JSON.parse(await readFile(join(projectDir, "package.json"), "utf-8"));
      expect(rootPkg.scripts["dev:admin"]).toBeDefined();
      expect(rootPkg.scripts["dev:landing"]).toBeDefined();

      const btsConfig = parseJsonc(
        await readFile(join(projectDir, "bts.jsonc"), "utf-8"),
      ) as BetterTStackConfig;
      expect(btsConfig.apps).toEqual([
        { name: "admin", frontend: "next", port: 3002 },
        { name: "landing", frontend: "astro", port: 3003 },
      ]);
      expect(btsConfig.reproducibleCommand).toContain("--apps admin:next landing:astro");
    });

    it("rejects incompatible --apps entries before scaffolding", async () => {
      const projectDir = join(SMOKE_DIR, "create-with-apps-invalid");
      await rm(projectDir, { recursive: true, force: true });

      const result = await create(projectDir, {
        frontend: ["tanstack-router"],
        backend: "hono",
        runtime: "bun",
        api: "trpc",
        database: "none",
        orm: "none",
        auth: "none",
        payments: "none",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        apps: ["landing:astro"],
        install: false,
        git: false,
        packageManager: "bun",
        disableAnalytics: true,
      });

      expect(result.isErr()).toBe(true);
      if (result.isOk()) throw new Error("Expected create() to reject incompatible apps");
      expect(result.error.message).toContain("tRPC");
    });
  });

  describe("dry run", () => {
    it("plans without writing any files", async () => {
      const projectDir = await scaffoldProject("add-app-dry-run");
      const rootPkgBefore = await readFile(join(projectDir, "package.json"), "utf-8");
      const btsBefore = await readFile(join(projectDir, "bts.jsonc"), "utf-8");

      const result = await addApp({ projectDir, name: "admin", frontend: "next", dryRun: true });

      expect(result.success).toBe(true);
      expect(result.dryRun).toBe(true);
      expect(result.plannedFileCount).toBeGreaterThan(0);
      expect(result.appName).toBe("admin");
      expect(result.port).toBe(3002);

      const appsEntries = await readdir(join(projectDir, "apps"));
      expect(appsEntries).not.toContain("admin");
      expect(await readFile(join(projectDir, "package.json"), "utf-8")).toBe(rootPkgBefore);
      expect(await readFile(join(projectDir, "bts.jsonc"), "utf-8")).toBe(btsBefore);
    });
  });

  describe("full write", () => {
    it("scaffolds a cross-framework app wired into the workspace", async () => {
      const projectDir = await scaffoldProject("add-app-full");
      const projectName = "add-app-full";

      const result = await addApp({ projectDir, name: "admin", frontend: "next" });

      expect(result.error).toBeUndefined();
      expect(result.success).toBe(true);
      expect(result.port).toBe(3002);

      // App identity
      const appPkg = JSON.parse(
        await readFile(join(projectDir, "apps", "admin", "package.json"), "utf-8"),
      );
      expect(appPkg.name).toBe("admin");
      expect(appPkg.scripts.dev).toContain("--port 3002");

      // Root dev script mirrors the project's task-runner filter syntax
      const rootPkg = JSON.parse(await readFile(join(projectDir, "package.json"), "utf-8"));
      expect(rootPkg.scripts["dev:web"]).toBeDefined();
      expect(rootPkg.scripts["dev:admin"]).toBe(
        rootPkg.scripts["dev:web"].replace(/\bweb\b/, "admin"),
      );

      // Per-app env module and preserved exports
      const envPkg = JSON.parse(
        await readFile(join(projectDir, "packages", "env", "package.json"), "utf-8"),
      );
      expect(envPkg.exports["./admin"]).toBe("./src/admin.ts");
      expect(envPkg.exports["./web"]).toBe("./src/web.ts");
      const envModule = await readFile(
        join(projectDir, "packages", "env", "src", "admin.ts"),
        "utf-8",
      );
      expect(envModule).toContain("NEXT_PUBLIC_");

      // No dangling references to the primary app's env module, no catalog refs
      const appFiles = await collectAppFiles(join(projectDir, "apps", "admin"));
      for (const [filePath, content] of appFiles) {
        expect(content, `env/web reference left in ${filePath}`).not.toContain(
          `@${projectName}/env/web`,
        );
      }
      const appPkgRaw = appFiles.get(join(projectDir, "apps", "admin", "package.json"));
      expect(appPkgRaw).not.toContain('"catalog:"');

      // bts.jsonc updated, comments preserved
      const btsRaw = await readFile(join(projectDir, "bts.jsonc"), "utf-8");
      expect(btsRaw).toContain("// Better-T-Stack");
      const btsConfig = parseJsonc(btsRaw) as BetterTStackConfig;
      expect(btsConfig.apps).toEqual([{ name: "admin", frontend: "next", port: 3002 }]);
    });

    it("allocates the next free port and covers routeTree.gen.ts for tanstack apps", async () => {
      const projectDir = await scaffoldProject("add-app-second");

      const first = await addApp({ projectDir, name: "admin", frontend: "next" });
      expect(first.success).toBe(true);
      expect(first.port).toBe(3002);

      const second = await addApp({ projectDir, name: "staff", frontend: "tanstack-router" });
      expect(second.success).toBe(true);
      expect(second.port).toBe(3003);

      const viteConfig = await readFile(
        join(projectDir, "apps", "staff", "vite.config.ts"),
        "utf-8",
      );
      expect(viteConfig).toContain("port: 3003");

      const gitignore = await readFile(join(projectDir, "apps", "staff", ".gitignore"), "utf-8");
      expect(gitignore).toContain("src/routeTree.gen.ts");

      const btsConfig = parseJsonc(
        await readFile(join(projectDir, "bts.jsonc"), "utf-8"),
      ) as BetterTStackConfig;
      expect(btsConfig.apps).toHaveLength(2);
    });

    it("unions pnpm allowBuilds and release-age entries when the keys are absent", async () => {
      const projectDir = join(SMOKE_DIR, "add-app-pnpm-allowbuilds");
      await rm(projectDir, { recursive: true, force: true });
      const createResult = await create(projectDir, {
        frontend: ["tanstack-router"],
        backend: "hono",
        runtime: "bun",
        api: "orpc",
        database: "none",
        orm: "none",
        auth: "none",
        payments: "none",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
        git: false,
        packageManager: "pnpm",
        disableAnalytics: true,
      });
      expect(createResult.isOk()).toBe(true);

      // Precondition for the regression: the keys start out absent.
      const before = parseYaml(
        await readFile(join(projectDir, "pnpm-workspace.yaml"), "utf-8"),
      ) as { allowBuilds?: Record<string, boolean>; minimumReleaseAgeExclude?: string[] };
      expect(before.allowBuilds).toBeUndefined();

      const nuxtResult = await addApp({ projectDir, name: "landing", frontend: "nuxt" });
      expect(nuxtResult.error).toBeUndefined();
      expect(nuxtResult.success).toBe(true);

      const afterNuxt = parseYaml(
        await readFile(join(projectDir, "pnpm-workspace.yaml"), "utf-8"),
      ) as { allowBuilds?: Record<string, boolean> };
      // All nuxt entries must survive, not just the last one written.
      expect(afterNuxt.allowBuilds?.esbuild).toBe(true);
      expect(afterNuxt.allowBuilds?.["@parcel/watcher"]).toBe(true);
      expect(afterNuxt.allowBuilds?.["vue-demi"]).toBe(true);

      const solidResult = await addApp({ projectDir, name: "solid-app", frontend: "solid" });
      expect(solidResult.success).toBe(true);

      const afterSolid = parseYaml(
        await readFile(join(projectDir, "pnpm-workspace.yaml"), "utf-8"),
      ) as { minimumReleaseAgeExclude?: string[] };
      expect(afterSolid.minimumReleaseAgeExclude?.length ?? 0).toBeGreaterThan(1);
    });

    it("keeps the per-app env export when addons are added later", async () => {
      const projectDir = await scaffoldProject("add-app-then-addon");

      const appResult = await addApp({ projectDir, name: "admin", frontend: "next" });
      expect(appResult.success).toBe(true);

      // The scaffolded project already has a task runner, so adding any addon
      // runs processPackageConfigs — the path that rebuilds env exports.
      const addonResult = await add({ projectDir, addons: ["biome"], install: false });
      expect(addonResult.success).toBe(true);
      expect(addonResult.addedAddons).toContain("biome");

      const envPkg = JSON.parse(
        await readFile(join(projectDir, "packages", "env", "package.json"), "utf-8"),
      );
      expect(envPkg.exports["./admin"]).toBe("./src/admin.ts");
      expect(envPkg.exports["./web"]).toBe("./src/web.ts");
    });
  });
});
