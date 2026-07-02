import { describe, expect, it } from "bun:test";
import path from "node:path";

import fs from "fs-extra";

import { runTRPCTest } from "./test-utils";

describe("Electrobun addon scaffolding", () => {
  it("scaffolds the desktop workspace for TanStack Router", async () => {
    const result = await runTRPCTest({
      projectName: "electrobun-files-tanstack-router-static-v2",
      addons: ["electrobun"],
      frontend: ["tanstack-router"],
      backend: "hono",
      runtime: "bun",
      database: "sqlite",
      orm: "drizzle",
      auth: "none",
      api: "trpc",
      examples: ["none"],
      dbSetup: "none",
      webDeploy: "none",
      serverDeploy: "none",
      install: false,
    });

    expect(result.success).toBe(true);
    expect(result.projectDir).toBeDefined();
    if (!result.projectDir) return;

    const rootPackageJson = await fs.readJson(path.join(result.projectDir, "package.json"));
    const desktopPackageJson = await fs.readJson(
      path.join(result.projectDir, "apps", "desktop", "package.json"),
    );
    const desktopConfig = await fs.readFile(
      path.join(result.projectDir, "apps", "desktop", "electrobun.config.ts"),
      "utf8",
    );
    const desktopEntry = await fs.readFile(
      path.join(result.projectDir, "apps", "desktop", "src", "bun", "index.ts"),
      "utf8",
    );
    const fallbackHtmlExists = await fs.pathExists(
      path.join(result.projectDir, "apps", "desktop", "src", "fallback", "index.html"),
    );

    expect(rootPackageJson.scripts["dev:desktop"]).toBeDefined();
    expect(rootPackageJson.scripts["build:desktop"]).toBeDefined();
    expect(rootPackageJson.scripts["build:desktop:canary"]).toBeDefined();
    // Root dev is the plain aggregate; the desktop has no dev script so it is skipped.
    expect(rootPackageJson.scripts.dev).toBe("bun run --filter '*' dev");
    expect(rootPackageJson.scripts.build).toBe(
      "bun run --filter '!desktop' build && bun run --filter desktop build",
    );
    expect(desktopPackageJson.scripts.start).toBeDefined();
    // The desktop intentionally has no `dev` script (root dev must skip it).
    expect(desktopPackageJson.scripts.dev).toBeUndefined();
    expect(desktopPackageJson.scripts["dev:hmr"]).toBeDefined();
    expect(desktopPackageJson.scripts.hmr).toContain("bun run --filter web dev");
    expect(desktopPackageJson.scripts["build:stable"]).toContain("--env=stable");
    expect(desktopPackageJson.scripts["build:canary"]).toContain("--env=canary");
    expect(desktopPackageJson.scripts.start).toBe("electrobun dev");
    expect(desktopPackageJson.scripts["dev:hmr"]).toContain('"bun run hmr"');
    expect(desktopPackageJson.scripts["dev:hmr"]).toContain('"electrobun dev --watch"');
    expect(desktopConfig).toContain('const webBuildDir = "../web/dist";');
    expect(desktopConfig).not.toContain("isDevCommand");
    expect(desktopConfig).toContain('[webBuildDir]: "views/mainview"');
    expect(desktopConfig).toContain("watchIgnore: [`${webBuildDir}/**`]");
    expect(desktopConfig).toContain("bundleCEF: true");
    expect(desktopConfig).toContain('defaultRenderer: "cef"');
    expect(desktopEntry).toContain("const DEV_SERVER_PORT = 3001;");
    expect(desktopEntry).toContain("return DEV_SERVER_URL;");
    expect(desktopEntry).not.toContain("HMR_RETRY_COUNT");
    expect(desktopEntry).toContain("fetch(DEV_SERVER_URL");
    expect(fallbackHtmlExists).toBe(false);
  });

  it("uses the React Router client build output for packaged desktop assets", async () => {
    const result = await runTRPCTest({
      projectName: "electrobun-files-react-router-static-v2",
      addons: ["electrobun"],
      frontend: ["react-router"],
      backend: "hono",
      runtime: "bun",
      database: "sqlite",
      orm: "drizzle",
      auth: "none",
      api: "trpc",
      examples: ["none"],
      dbSetup: "none",
      webDeploy: "none",
      serverDeploy: "none",
      install: false,
    });

    expect(result.success).toBe(true);
    expect(result.projectDir).toBeDefined();
    if (!result.projectDir) return;

    const desktopConfig = await fs.readFile(
      path.join(result.projectDir, "apps", "desktop", "electrobun.config.ts"),
      "utf8",
    );
    const desktopEntry = await fs.readFile(
      path.join(result.projectDir, "apps", "desktop", "src", "bun", "index.ts"),
      "utf8",
    );

    expect(desktopConfig).toContain('const webBuildDir = "../web/build/client";');
    expect(desktopEntry).toContain("const DEV_SERVER_PORT = 5173;");
  });

  it("maps desktop asset output and dev ports for non-Vite frontends", async () => {
    const cases = [
      {
        frontend: "tanstack-start",
        api: "trpc",
        expectedOutputDir: 'const webBuildDir = "../web/dist/client";',
        expectedPort: "const DEV_SERVER_PORT = 3001;",
        expectedWebConfigPath: "vite.config.ts",
        expectedWebConfig: ["prerender", "enabled: true"],
      },
      {
        frontend: "next",
        api: "trpc",
        expectedOutputDir: 'const webBuildDir = "../web/out";',
        expectedPort: "const DEV_SERVER_PORT = 3001;",
        expectedWebConfigPath: "next.config.ts",
        expectedWebConfig: ['output: "export"'],
      },
      {
        frontend: "nuxt",
        api: "orpc",
        expectedOutputDir: 'const webBuildDir = "../web/.output/public";',
        expectedPort: "const DEV_SERVER_PORT = 3001;",
        expectedBuildCommand: "bun run --filter web generate",
      },
      {
        frontend: "svelte",
        api: "orpc",
        expectedOutputDir: 'const webBuildDir = "../web/build";',
        expectedPort: "const DEV_SERVER_PORT = 5173;",
        expectedWebConfigPath: "svelte.config.js",
        expectedWebConfig: ["@sveltejs/adapter-static", 'fallback: "index.html"'],
      },
      {
        frontend: "solid",
        api: "orpc",
        expectedOutputDir: 'const webBuildDir = "../web/dist";',
        expectedPort: "const DEV_SERVER_PORT = 3001;",
      },
      {
        frontend: "astro",
        api: "orpc",
        expectedOutputDir: 'const webBuildDir = "../web/dist";',
        expectedPort: "const DEV_SERVER_PORT = 4321;",
        expectedWebConfigPath: "astro.config.mjs",
        expectedWebConfig: ['output: "static"'],
        unexpectedWebDependency: "@astrojs/node",
      },
    ] as const;

    for (const testCase of cases) {
      const result = await runTRPCTest({
        projectName: `electrobun-files-${testCase.frontend}-static-v2`,
        addons: ["electrobun"],
        frontend: [testCase.frontend],
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: testCase.api,
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expect(result.success).toBe(true);
      expect(result.projectDir).toBeDefined();
      if (!result.projectDir) continue;

      const desktopConfig = await fs.readFile(
        path.join(result.projectDir, "apps", "desktop", "electrobun.config.ts"),
        "utf8",
      );
      const desktopEntry = await fs.readFile(
        path.join(result.projectDir, "apps", "desktop", "src", "bun", "index.ts"),
        "utf8",
      );
      const desktopPackageJson = await fs.readJson(
        path.join(result.projectDir, "apps", "desktop", "package.json"),
      );
      const webPackageJson = await fs.readJson(
        path.join(result.projectDir, "apps", "web", "package.json"),
      );

      expect(desktopConfig).toContain(testCase.expectedOutputDir);
      expect(desktopEntry).toContain(testCase.expectedPort);
      if ("expectedWebConfig" in testCase && "expectedWebConfigPath" in testCase) {
        const webConfig = await fs.readFile(
          path.join(result.projectDir, "apps", "web", testCase.expectedWebConfigPath),
          "utf8",
        );
        for (const expectedConfig of testCase.expectedWebConfig) {
          expect(webConfig).toContain(expectedConfig);
        }
      }
      if ("unexpectedWebDependency" in testCase) {
        expect(webPackageJson.dependencies?.[testCase.unexpectedWebDependency]).toBeUndefined();
        expect(webPackageJson.devDependencies?.[testCase.unexpectedWebDependency]).toBeUndefined();
      }
      if ("expectedBuildCommand" in testCase) {
        expect(desktopPackageJson.scripts["build:stable"]).toContain(testCase.expectedBuildCommand);
      }
    }
  });

  it("uses the configured monorepo runner for desktop web commands", async () => {
    const cases = [
      {
        projectName: "electrobun-turbo-runner-static-v2",
        addons: ["turborepo", "electrobun"] as const,
        expectedRunner: "turbo run build -F web",
        expectedHmr: "turbo run dev -F web",
        expectedRootDev: "turbo run dev",
        expectedRootBuild: "turbo run build --filter='!desktop' && turbo run build -F desktop",
      },
      {
        projectName: "electrobun-nx-runner-static-v2",
        addons: ["nx", "electrobun"] as const,
        expectedRunner: "nx run-many -t build --projects=web",
        expectedHmr: "nx run-many -t dev --projects=web",
        expectedRootDev: "nx run-many -t dev",
        expectedRootBuild:
          "nx run-many -t build --exclude=desktop && nx run-many -t build --projects=desktop",
      },
      {
        projectName: "electrobun-vite-plus-runner-static-v2",
        addons: ["vite-plus", "electrobun"] as const,
        expectedRunner: "vp run --filter web build",
        expectedHmr: "vp run --filter web dev",
        expectedRootDev: "vp run -r dev",
        expectedRootBuild: "vp run -r build --filter '!desktop' && vp run --filter desktop build",
      },
      {
        projectName: "electrobun-pnpm-runner-static-v2",
        addons: ["electrobun"] as const,
        packageManager: "pnpm" as const,
        expectedRunner: "pnpm -w --filter web build",
        expectedHmr: "pnpm -w --filter web dev",
        expectedRootDev: "pnpm -r dev",
        expectedRootBuild: "pnpm -r --filter '!desktop' build && pnpm --filter desktop build",
      },
      {
        projectName: "electrobun-npm-runner-static-v2",
        addons: ["electrobun"] as const,
        packageManager: "npm" as const,
        expectedRunner: "npm run build --workspace web",
        expectedHmr: "npm run dev --workspace web",
        expectedRootDev: "npm run dev --workspaces --if-present",
        expectedRootBuildIncludes: [
          "npm run build --workspace apps/server --if-present",
          "npm run build --workspace apps/web --if-present",
          "npm run build --workspace apps/desktop",
        ],
        unexpectedRootBuild: "npm run build --workspaces",
      },
    ];

    for (const testCase of cases) {
      const result = await runTRPCTest({
        projectName: testCase.projectName,
        addons: [...testCase.addons],
        frontend: ["tanstack-router"],
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "trpc",
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        packageManager: "packageManager" in testCase ? testCase.packageManager : "bun",
        install: false,
      });

      expect(result.success).toBe(true);
      expect(result.projectDir).toBeDefined();
      if (!result.projectDir) continue;

      const desktopPackageJson = await fs.readJson(
        path.join(result.projectDir, "apps", "desktop", "package.json"),
      );
      const rootPackageJson = await fs.readJson(path.join(result.projectDir, "package.json"));

      expect(desktopPackageJson.scripts.start).toBe("electrobun dev");
      expect(desktopPackageJson.scripts.hmr).toBe(testCase.expectedHmr);
      // The desktop self-builds its web app, then electrobun (official pattern).
      expect(desktopPackageJson.scripts.build).toContain(testCase.expectedRunner);
      expect(desktopPackageJson.scripts["build:stable"]).toContain(testCase.expectedRunner);
      if ("expectedRootDev" in testCase) {
        expect(rootPackageJson.scripts.dev).toBe(testCase.expectedRootDev);
      }
      if ("expectedRootBuild" in testCase) {
        expect(rootPackageJson.scripts.build).toBe(testCase.expectedRootBuild);
      }
      if ("expectedRootBuildIncludes" in testCase) {
        for (const expectedCommand of testCase.expectedRootBuildIncludes) {
          expect(rootPackageJson.scripts.build).toContain(expectedCommand);
        }
        expect(rootPackageJson.scripts.build.indexOf("apps/desktop")).toBeGreaterThan(
          rootPackageJson.scripts.build.indexOf("apps/web"),
        );
      }
      if ("unexpectedRootBuild" in testCase) {
        expect(rootPackageJson.scripts.build).not.toContain(testCase.unexpectedRootBuild);
      }

      if (testCase.addons.includes("turborepo")) {
        const turboJson = await fs.readJson(path.join(result.projectDir, "turbo.json"));
        expect(turboJson.tasks.build.outputs).toContain("artifacts/**");
        expect(turboJson.tasks["dev:hmr"]).toEqual({
          cache: false,
          persistent: true,
        });
        expect(turboJson.tasks["build:stable"].outputs).toContain("artifacts/**");
        expect(turboJson.tasks["build:canary"].outputs).toContain("artifacts/**");
      }
    }
  });
});
