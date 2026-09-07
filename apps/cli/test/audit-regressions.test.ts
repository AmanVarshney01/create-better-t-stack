import { describe, expect, it } from "bun:test";
import { readFile, rename, writeFile } from "node:fs/promises";
import { join } from "node:path";

import { processPwaPlugins, VirtualFileSystem } from "@better-t-stack/template-generator";
import type { ProjectConfig } from "@better-t-stack/types";
import { Node, Project, SyntaxKind } from "ts-morph";

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
      const configBefore = await readPackage(originalDir, "packages/config/package.json");
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
      expect((await readPackage(projectDir, "packages/config/package.json")).name).toBe(
        configBefore.name,
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
  it("preserves existing Next headers and supports static exports", async () => {
    const projectDir = await makeProject("next-pwa-headers", {
      frontend: ["next"],
      addons: ["pwa"],
    });
    const { withPwa } = await import(join(projectDir, "apps/web/pwa.config.ts"));
    const custom = { source: "/custom", headers: [{ key: "X-Custom", value: "preserved" }] };
    const original = { headers: async () => [custom], typedRoutes: true };
    const wrapped = withPwa(original);
    expect(wrapped.typedRoutes).toBe(true);
    expect(await wrapped.headers()).toEqual([
      custom,
      {
        source: "/sw.js",
        headers: [
          { key: "Content-Type", value: "application/javascript; charset=utf-8" },
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Content-Security-Policy", value: "default-src 'self'; script-src 'self'" },
        ],
      },
    ]);
    expect(await original.headers()).toEqual([custom]);
    const staticConfig = { output: "export" };
    expect(withPwa(staticConfig)).toBe(staticConfig);
  });

  for (const [frontend, documentPath] of [
    ["solid", "apps/web/src/Document.tsx"],
    ["react-router", "apps/web/src/root.tsx"],
    ["next", "apps/web/src/app/layout.tsx"],
  ] as const) {
    it(`registers PWA in an existing ${frontend} document without losing custom content`, async () => {
      const projectDir = await makeProject(`add-ssr-pwa-${frontend}`, { frontend: [frontend] });
      const original = await readFile(join(projectDir, documentPath), "utf8");
      await writeFile(join(projectDir, documentPath), `// custom document\n${original}`);
      const result = await add({ projectDir, addons: ["pwa"], install: false });
      expect(result.success).toBe(true);
      const document = await readFile(join(projectDir, documentPath), "utf8");
      expect(document).toContain("// custom document");
      expect(document).toContain(frontend === "next" ? "<PwaRegistration" : 'src="/registerSW.js"');
      expect(await readFile(join(projectDir, "apps/web/public/offline.html"), "utf8")).toContain(
        "You are offline",
      );
      const vfs = new VirtualFileSystem();
      vfs.writeFile(documentPath, document);
      processPwaPlugins(vfs, { ...config, frontend: [frontend], addons: ["pwa"] });
      expect(
        vfs
          .readFile(documentPath)
          ?.match(frontend === "next" ? /<PwaRegistration/g : /src="\/registerSW.js"/g),
      ).toHaveLength(1);
      if (frontend !== "next") {
        expect(document).toContain('rel="manifest"');
        const vite = await readFile(join(projectDir, "apps/web/vite.config.ts"), "utf8");
        expect(vite).toContain("environments.client.build.outDir");
        expect(vite).toContain('environment.name === "client"');
        expect(vite).toContain('handler: "NetworkOnly"');
      } else {
        expect(await readFile(join(projectDir, "apps/web/next.config.ts"), "utf8")).toContain(
          "withPwa(nextConfig)",
        );
        expect(await readFile(join(projectDir, "apps/web/pwa.config.ts"), "utf8")).toContain(
          "no-cache, no-store, must-revalidate",
        );
      }
    });
  }

  for (const plugins of [
    "plugins",
    "plugins: plugins",
    "plugins: getPlugins()",
    "plugins: enabled && plugins",
  ]) {
    it(`preserves existing plugin expressions (${plugins})`, () => {
      const vfs = new VirtualFileSystem();
      vfs.writeFile(
        "apps/web/vite.config.ts",
        `import { defineConfig } from "vite";
const plugins = [{ name: "framework" }];
const enabled = true;
const getPlugins = () => Promise.resolve(plugins);
export default defineConfig({ ${plugins} });`,
      );
      processPwaPlugins(vfs, { ...config, addons: ["pwa"] });
      processPwaPlugins(vfs, { ...config, addons: ["pwa"] });
      const source = new Project({ useInMemoryFileSystem: true }).createSourceFile(
        "vite.config.ts",
        vfs.readFile("apps/web/vite.config.ts"),
      );
      const object = source
        .getExportAssignmentOrThrow(() => true)
        .getExpression()
        .asKindOrThrow(SyntaxKind.CallExpression)
        .getArguments()[0]!
        .asKindOrThrow(SyntaxKind.ObjectLiteralExpression);
      expect(object.getProperties()).toHaveLength(1);
      const elements = object
        .getPropertyOrThrow("plugins")
        .asKindOrThrow(SyntaxKind.PropertyAssignment)
        .getInitializerOrThrow()
        .asKindOrThrow(SyntaxKind.ArrayLiteralExpression)
        .getElements();
      expect(elements).toHaveLength(2);
      expect(elements[0]!.getText()).toBe(
        plugins === "plugins" ? "plugins" : plugins.slice("plugins: ".length),
      );
      expect(elements[1]!.getText()).toStartWith("VitePWA(");
    });
  }

  it("escapes package-derived PWA names as string values", () => {
    const projectName = 'quote"\\newline\n, injected: process.exit(), value: "';
    const vfs = new VirtualFileSystem();
    vfs.writeFile(
      "apps/web/vite.config.ts",
      'import { defineConfig } from "vite"; export default defineConfig({});',
    );
    processPwaPlugins(vfs, { ...config, projectName, addons: ["pwa"] });
    const source = new Project({ useInMemoryFileSystem: true }).createSourceFile(
      "vite.config.ts",
      vfs.readFile("apps/web/vite.config.ts"),
    );
    const manifest = source
      .getDescendantsOfKind(SyntaxKind.PropertyAssignment)
      .find((property) => property.getName() === "manifest")!
      .getInitializerOrThrow()
      .asKindOrThrow(SyntaxKind.ObjectLiteralExpression);
    for (const name of ["name", "short_name", "description"]) {
      const value = manifest
        .getPropertyOrThrow(name)
        .asKindOrThrow(SyntaxKind.PropertyAssignment)
        .getInitializerOrThrow();
      expect(Node.isStringLiteral(value)).toBe(true);
      expect(value.asKindOrThrow(SyntaxKind.StringLiteral).getLiteralValue()).toBe(
        name === "description" ? `${projectName} - PWA Application` : projectName,
      );
    }
    expect(
      source
        .getDescendantsOfKind(SyntaxKind.CallExpression)
        .map((call) => call.getExpression().getText()),
    ).toEqual(["defineConfig", "VitePWA"]);
  });

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
    "() => { const helper = { make() { return { plugins: [] }; } }; return { plugins: [helper.make()] }; }",
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
