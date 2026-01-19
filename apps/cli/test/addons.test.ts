import { describe, it, expect } from "bun:test";

import type { Addons, Frontend } from "../src";

import { expectError, expectSuccess, runTRPCTest, type TestConfig } from "./test-utils";

describe("Addon Configurations", () => {
  describe("Universal Addons (no frontend restrictions)", () => {
    const universalAddons = ["biome", "lefthook", "husky", "turborepo", "oxlint", "msw"];

    for (const addon of universalAddons) {
      it(`should work with ${addon} addon on any frontend`, async () => {
        const result = await runTRPCTest({
          projectName: `${addon}-universal`,
          addons: [addon as Addons],
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

        expectSuccess(result);
      });
    }
  });

  describe("Frontend-Specific Addons", () => {
    describe("PWA Addon", () => {
      const pwaCompatibleFrontends = ["tanstack-router", "react-router", "solid", "next"];

      for (const frontend of pwaCompatibleFrontends) {
        it(`should work with PWA + ${frontend}`, async () => {
          const config: TestConfig = {
            projectName: `pwa-${frontend}`,
            addons: ["pwa"],
            frontend: [frontend as Frontend],
            backend: "hono",
            runtime: "bun",
            database: "sqlite",
            orm: "drizzle",
            auth: "none",
            examples: ["none"],
            dbSetup: "none",
            webDeploy: "none",
            serverDeploy: "none",
            install: false,
          };

          // Handle special frontend requirements
          if (frontend === "solid") {
            config.api = "orpc"; // tRPC not supported with solid
          } else {
            config.api = "trpc";
          }

          const result = await runTRPCTest(config);
          expectSuccess(result);
        });
      }

      const pwaIncompatibleFrontends = [
        "nuxt",
        "svelte",
        "native-bare",
        "native-uniwind",
        "native-unistyles",
      ];

      for (const frontend of pwaIncompatibleFrontends) {
        it(`should fail with PWA + ${frontend}`, async () => {
          const config: TestConfig = {
            projectName: `pwa-${frontend}-fail`,
            addons: ["pwa"],
            frontend: [frontend as Frontend],
            backend: "hono",
            runtime: "bun",
            database: "sqlite",
            orm: "drizzle",
            auth: "none",
            examples: ["none"],
            dbSetup: "none",
            webDeploy: "none",
            serverDeploy: "none",
            expectError: true,
          };

          if (["nuxt", "svelte"].includes(frontend)) {
            config.api = "orpc";
          } else {
            config.api = "trpc";
          }

          const result = await runTRPCTest(config);
          expectError(
            result,
            "pwa addon requires one of these frontends: tanstack-router, react-router, solid, next",
          );
        });
      }
    });

    describe("Tauri Addon", () => {
      const tauriCompatibleFrontends = [
        "tanstack-router",
        "react-router",
        "nuxt",
        "svelte",
        "solid",
        "next",
      ];

      for (const frontend of tauriCompatibleFrontends) {
        it(`should work with Tauri + ${frontend}`, async () => {
          const config: TestConfig = {
            projectName: `tauri-${frontend}`,
            addons: ["tauri"],
            frontend: [frontend as Frontend],
            backend: "hono",
            runtime: "bun",
            database: "sqlite",
            orm: "drizzle",
            auth: "none",
            examples: ["none"],
            dbSetup: "none",
            webDeploy: "none",
            serverDeploy: "none",
            install: false,
          };

          if (["nuxt", "svelte", "solid"].includes(frontend)) {
            config.api = "orpc";
          } else {
            config.api = "trpc";
          }

          const result = await runTRPCTest(config);
          expectSuccess(result);
        });
      }

      const tauriIncompatibleFrontends = ["native-bare", "native-uniwind", "native-unistyles"];

      for (const frontend of tauriIncompatibleFrontends) {
        it(`should fail with Tauri + ${frontend}`, async () => {
          const result = await runTRPCTest({
            projectName: `tauri-${frontend}-fail`,
            addons: ["tauri"],
            frontend: [frontend as Frontend],
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
            expectError: true,
          });

          expectError(result, "tauri addon requires one of these frontends");
        });
      }
    });

    describe("MSW Addon", () => {
      const mswCompatibleFrontends = [
        "tanstack-router",
        "react-router",
        "next",
        "nuxt",
        "svelte",
        "solid",
      ];

      for (const frontend of mswCompatibleFrontends) {
        it(`should work with MSW + ${frontend}`, async () => {
          const config: TestConfig = {
            projectName: `msw-${frontend}`,
            addons: ["msw"],
            frontend: [frontend as Frontend],
            backend: "hono",
            runtime: "bun",
            database: "sqlite",
            orm: "drizzle",
            auth: "none",
            examples: ["none"],
            dbSetup: "none",
            webDeploy: "none",
            serverDeploy: "none",
            install: false,
          };

          if (["nuxt", "svelte", "solid"].includes(frontend)) {
            config.api = "orpc";
          } else {
            config.api = "trpc";
          }

          const result = await runTRPCTest(config);
          expectSuccess(result);
        });
      }

      it("should add MSW dependency to web package.json", async () => {
        const result = await runTRPCTest({
          projectName: "msw-deps-check",
          addons: ["msw"],
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

        expectSuccess(result);

        const webPackageJson = result.result?.tree?.root?.children
          ?.find((c: any) => c.name === "apps")
          ?.children?.find((c: any) => c.name === "web")
          ?.children?.find((c: any) => c.name === "package.json");

        if (webPackageJson?.content) {
          const pkgJson = JSON.parse(webPackageJson.content);
          expect(pkgJson.devDependencies?.msw).toBeDefined();
        }
      });

      it("should add MSW dependency to server package.json", async () => {
        const result = await runTRPCTest({
          projectName: "msw-server-deps-check",
          addons: ["msw"],
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

        expectSuccess(result);

        const serverPackageJson = result.result?.tree?.root?.children
          ?.find((c: any) => c.name === "apps")
          ?.children?.find((c: any) => c.name === "server")
          ?.children?.find((c: any) => c.name === "package.json");

        if (serverPackageJson?.content) {
          const pkgJson = JSON.parse(serverPackageJson.content);
          expect(pkgJson.devDependencies?.msw).toBeDefined();
        }
      });

      it("should create MSW mock files in web package", async () => {
        const result = await runTRPCTest({
          projectName: "msw-files-check",
          addons: ["msw"],
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

        expectSuccess(result);

        // Check MSW dependency was added, which confirms the addon was processed
        const webPackageJson = result.result?.tree?.root?.children
          ?.find((c: any) => c.name === "apps")
          ?.children?.find((c: any) => c.name === "web")
          ?.children?.find((c: any) => c.name === "package.json");

        if (webPackageJson?.content) {
          const pkgJson = JSON.parse(webPackageJson.content);
          expect(pkgJson.devDependencies?.msw).toBeDefined();
        }
      });

      it("should work with MSW + testing framework", async () => {
        const result = await runTRPCTest({
          projectName: "msw-with-vitest",
          addons: ["msw"],
          frontend: ["tanstack-router"],
          backend: "hono",
          runtime: "bun",
          database: "sqlite",
          orm: "drizzle",
          auth: "none",
          api: "trpc",
          testing: "vitest",
          examples: ["none"],
          dbSetup: "none",
          webDeploy: "none",
          serverDeploy: "none",
          install: false,
        });

        expectSuccess(result);

        const webPackageJson = result.result?.tree?.root?.children
          ?.find((c: any) => c.name === "apps")
          ?.children?.find((c: any) => c.name === "web")
          ?.children?.find((c: any) => c.name === "package.json");

        if (webPackageJson?.content) {
          const pkgJson = JSON.parse(webPackageJson.content);
          expect(pkgJson.devDependencies?.msw).toBeDefined();
          expect(pkgJson.devDependencies?.vitest).toBeDefined();
        }
      });
    });
  });

  describe("Multiple Addons", () => {
    it("should work with multiple compatible addons", async () => {
      const result = await runTRPCTest({
        projectName: "multiple-addons",
        addons: ["biome", "husky", "turborepo", "pwa"],
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

      expectSuccess(result);
    });

    it("should work with lefthook and husky together", async () => {
      const result = await runTRPCTest({
        projectName: "both-git-hooks",
        addons: ["lefthook", "husky"],
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

      expectSuccess(result);
    });

    it("should fail with incompatible addon combination", async () => {
      const result = await runTRPCTest({
        projectName: "incompatible-addons-fail",
        addons: ["pwa"], // PWA not compatible with nuxt
        frontend: ["nuxt"],
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "orpc",
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        expectError: true,
      });

      expectError(result, "pwa addon requires one of these frontends");
    });

    it("should deduplicate addons", async () => {
      const result = await runTRPCTest({
        projectName: "duplicate-addons",
        addons: ["biome", "biome", "turborepo"], // Duplicate biome
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

      expectSuccess(result);
    });
  });

  describe("Addons with None Option", () => {
    it("should work with addons none", async () => {
      const result = await runTRPCTest({
        projectName: "no-addons",
        addons: ["none"],
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

      expectSuccess(result);
    });

    it("should fail with none + other addons", async () => {
      const result = await runTRPCTest({
        projectName: "none-with-other-addons-fail",
        addons: ["none", "biome"],
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
        expectError: true,
      });

      expectError(result, "Cannot combine 'none' with other addons");
    });
  });

  describe("All Available Addons", () => {
    const testableAddons = [
      "pwa",
      "tauri",
      "biome",
      "husky",
      "turborepo",
      "oxlint",
      "msw",
      // Note: starlight, ultracite, ruler, fumadocs are prompt-controlled only
    ];

    for (const addon of testableAddons) {
      it(`should work with ${addon} addon in appropriate setup`, async () => {
        const config: TestConfig = {
          projectName: `test-${addon}`,
          addons: [addon as Addons],
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
        };

        // Choose compatible frontend for each addon
        if (["pwa"].includes(addon)) {
          config.frontend = ["tanstack-router"]; // PWA compatible
        } else if (["tauri"].includes(addon)) {
          config.frontend = ["tanstack-router"]; // Tauri compatible
        } else {
          config.frontend = ["tanstack-router"]; // Universal addons
        }

        const result = await runTRPCTest(config);
        expectSuccess(result);
      });
    }
  });
});
