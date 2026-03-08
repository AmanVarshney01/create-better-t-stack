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
    expect(desktopPackageJson.scripts.start).toBeDefined();
    expect(desktopPackageJson.scripts.dev).toBeDefined();
    expect(desktopPackageJson.scripts["dev:hmr"]).toBeDefined();
    expect(desktopPackageJson.scripts.hmr).toContain("bun run --filter web dev");
    expect(desktopPackageJson.scripts["build:stable"]).toContain("--env=stable");
    expect(desktopPackageJson.scripts["build:canary"]).toContain("--env=canary");
    expect(desktopPackageJson.scripts.start).toContain("bun run --filter web build");
    expect(desktopConfig).toContain('const webBuildDir = "../web/dist";');
    expect(desktopConfig).toContain('[webBuildDir]: "views/mainview"');
    expect(desktopConfig).toContain("watchIgnore: [`${webBuildDir}/**`]");
    expect(desktopConfig).toContain("bundleCEF: true");
    expect(desktopConfig).toContain('defaultRenderer: "cef"');
    expect(desktopEntry).toContain("const DEV_SERVER_PORT = 3001;");
    expect(desktopConfig).not.toContain("views/fallback");
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
      },
      {
        frontend: "next",
        api: "trpc",
        expectedOutputDir: 'const webBuildDir = "../web/out";',
        expectedPort: "const DEV_SERVER_PORT = 3001;",
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

      expect(desktopConfig).toContain(testCase.expectedOutputDir);
      expect(desktopEntry).toContain(testCase.expectedPort);
      if ("expectedBuildCommand" in testCase) {
        expect(desktopPackageJson.scripts.start).toContain(testCase.expectedBuildCommand);
        expect(desktopPackageJson.scripts["build:stable"]).toContain(testCase.expectedBuildCommand);
      }
    }
  });

  it("uses the configured monorepo runner for desktop web commands", async () => {
    const cases = [
      {
        projectName: "electrobun-turbo-runner-static-v2",
        addons: ["turborepo", "electrobun"] as const,
        expectedRunner: "turbo -F web build",
        expectedHmr: "turbo -F web dev",
      },
      {
        projectName: "electrobun-nx-runner-static-v2",
        addons: ["nx", "electrobun"] as const,
        expectedRunner: "nx run-many -t build --projects=web",
        expectedHmr: "nx run-many -t dev --projects=web",
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
        install: false,
      });

      expect(result.success).toBe(true);
      expect(result.projectDir).toBeDefined();
      if (!result.projectDir) continue;

      const desktopPackageJson = await fs.readJson(
        path.join(result.projectDir, "apps", "desktop", "package.json"),
      );

      expect(desktopPackageJson.scripts.start).toContain(testCase.expectedRunner);
      expect(desktopPackageJson.scripts.hmr).toBe(testCase.expectedHmr);
      expect(desktopPackageJson.scripts["build:stable"]).toContain(testCase.expectedRunner);
    }
  });
});
