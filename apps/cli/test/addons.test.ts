import { describe, expect, it } from "bun:test";
import { existsSync } from "node:fs";
import { join } from "node:path";

import type { Addons, Frontend } from "../src";

import { expectError, expectSuccess, runTRPCTest, type TestConfig } from "./test-utils";

describe("Addon Configurations", () => {
  describe("Universal Addons (no frontend restrictions)", () => {
    const universalAddons = ["biome", "lefthook", "husky", "turborepo"];

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

    describe("Docker Compose Addon", () => {
      it("should work with docker-compose + Hono + postgres + drizzle", async () => {
        const result = await runTRPCTest({
          projectName: "docker-compose-hono-postgres",
          addons: ["docker-compose"],
          frontend: ["tanstack-router"],
          backend: "hono",
          runtime: "bun",
          database: "postgres",
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

      it("should work with docker-compose + Next.js + self backend", async () => {
        const result = await runTRPCTest({
          projectName: "docker-compose-nextjs-self",
          addons: ["docker-compose"],
          frontend: ["next"],
          backend: "self",
          runtime: "none",
          database: "postgres",
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

      it("should fail with docker-compose + Convex backend", async () => {
        const result = await runTRPCTest({
          projectName: "docker-compose-convex-fail",
          addons: ["docker-compose"],
          frontend: ["tanstack-router"],
          backend: "convex",
          runtime: "none",
          database: "none",
          orm: "none",
          auth: "none",
          api: "none", // Convex requires api: "none"
          examples: ["none"],
          dbSetup: "none",
          webDeploy: "none",
          serverDeploy: "none",
          expectError: true,
        });

        expectError(result, "docker-compose is not compatible with Convex backend");
      });

      it("should fail with docker-compose + Workers runtime", async () => {
        const result = await runTRPCTest({
          projectName: "docker-compose-workers-fail",
          addons: ["docker-compose"],
          frontend: ["tanstack-router"],
          backend: "hono",
          runtime: "workers",
          database: "sqlite",
          orm: "drizzle",
          auth: "none",
          api: "trpc",
          examples: ["none"],
          dbSetup: "none",
          serverDeploy: "cloudflare",
          serverDeploy: "alchemy", // Workers runtime requires server deployment
          expectError: true,
        });

        expectError(result, "docker-compose is not compatible with Cloudflare Workers runtime");
      });

      it("should work with docker-compose + mysql + prisma", async () => {
        const result = await runTRPCTest({
          projectName: "docker-compose-mysql-prisma",
          addons: ["docker-compose"],
          frontend: ["react-router"],
          backend: "hono",
          runtime: "bun",
          database: "mysql",
          orm: "prisma",
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

      it("should work with docker-compose + Nuxt + oRPC", async () => {
        const result = await runTRPCTest({
          projectName: "docker-compose-nuxt",
          addons: ["docker-compose"],
          frontend: ["nuxt"],
          backend: "hono",
          runtime: "bun",
          database: "postgres",
          orm: "drizzle",
          auth: "none",
          api: "orpc",
          examples: ["none"],
          dbSetup: "none",
          webDeploy: "none",
          serverDeploy: "none",
          install: false,
        });

        expectSuccess(result);
      });

      it("should work with docker-compose + Svelte", async () => {
        const result = await runTRPCTest({
          projectName: "docker-compose-svelte",
          addons: ["docker-compose"],
          frontend: ["svelte"],
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
          install: false,
        });

        expectSuccess(result);
      });

      describe("Docker Compose File Generation", () => {
        it("should generate docker-compose.yml at project root", async () => {
          const result = await runTRPCTest({
            projectName: "docker-compose-files-root",
            addons: ["docker-compose"],
            frontend: ["tanstack-router"],
            backend: "hono",
            runtime: "bun",
            database: "postgres",
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
          expect(result.projectDir).toBeDefined();

          const dockerComposeYml = join(result.projectDir!, "docker-compose.yml");
          expect(existsSync(dockerComposeYml)).toBe(true);
        });

        it("should generate Dockerfile in apps/server when backend exists", async () => {
          const result = await runTRPCTest({
            projectName: "docker-compose-files-server",
            addons: ["docker-compose"],
            frontend: ["tanstack-router"],
            backend: "hono",
            runtime: "bun",
            database: "postgres",
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
          expect(result.projectDir).toBeDefined();

          const serverDockerfile = join(result.projectDir!, "apps", "server", "Dockerfile");
          expect(existsSync(serverDockerfile)).toBe(true);
        });

        it("should generate Dockerfile in apps/web for Vite-based frontend", async () => {
          const result = await runTRPCTest({
            projectName: "docker-compose-files-web",
            addons: ["docker-compose"],
            frontend: ["tanstack-router"],
            backend: "hono",
            runtime: "bun",
            database: "postgres",
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
          expect(result.projectDir).toBeDefined();

          // Vite-based frontends get Dockerfile.vite
          const webDockerfile = join(result.projectDir!, "apps", "web", "Dockerfile.vite");
          expect(existsSync(webDockerfile)).toBe(true);
        });

        it("should generate Dockerfile in apps/web for Next.js + self backend", async () => {
          const result = await runTRPCTest({
            projectName: "docker-compose-files-nextjs",
            addons: ["docker-compose"],
            frontend: ["next"],
            backend: "self",
            runtime: "none",
            database: "postgres",
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
          expect(result.projectDir).toBeDefined();

          // With self backend, there should be no server directory but web Dockerfile should exist
          const dockerComposeYml = join(result.projectDir!, "docker-compose.yml");
          // Next.js frontend gets Dockerfile.next
          const webDockerfile = join(result.projectDir!, "apps", "web", "Dockerfile.next");

          expect(existsSync(dockerComposeYml)).toBe(true);
          expect(existsSync(webDockerfile)).toBe(true);
        });

        it("should generate .dockerignore files", async () => {
          const result = await runTRPCTest({
            projectName: "docker-compose-files-ignore",
            addons: ["docker-compose"],
            frontend: ["tanstack-router"],
            backend: "hono",
            runtime: "bun",
            database: "postgres",
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
          expect(result.projectDir).toBeDefined();

          const rootDockerignore = join(result.projectDir!, ".dockerignore");
          expect(existsSync(rootDockerignore)).toBe(true);
        });
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
