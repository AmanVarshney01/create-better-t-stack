import { describe, it } from "bun:test";

import { expectError, expectSuccess, runTRPCTest, type TestConfig } from "./test-utils";

describe("Astro Frontend Configurations", () => {
  describe("Basic Astro Setup", () => {
    it("should work with Astro + React integration + Hono + tRPC", async () => {
      const config: TestConfig = {
        projectName: "astro-react-trpc",
        frontend: ["astro"],
        astroIntegration: "react",
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "trpc",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      };

      const result = await runTRPCTest(config);
      expectSuccess(result);
    });

    it("should work with Astro + Vue integration + Hono + oRPC", async () => {
      const config: TestConfig = {
        projectName: "astro-vue-orpc",
        frontend: ["astro"],
        astroIntegration: "vue",
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "orpc",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      };

      const result = await runTRPCTest(config);
      expectSuccess(result);
    });

    it("should work with Astro + Svelte integration + Hono + oRPC", async () => {
      const config: TestConfig = {
        projectName: "astro-svelte-orpc",
        frontend: ["astro"],
        astroIntegration: "svelte",
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "orpc",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      };

      const result = await runTRPCTest(config);
      expectSuccess(result);
    });

    it("should work with Astro + Solid integration + Hono + oRPC", async () => {
      const config: TestConfig = {
        projectName: "astro-solid-orpc",
        frontend: ["astro"],
        astroIntegration: "solid",
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "orpc",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      };

      const result = await runTRPCTest(config);
      expectSuccess(result);
    });

    it("should work with Astro + no integration (static site)", async () => {
      const config: TestConfig = {
        projectName: "astro-none-static",
        frontend: ["astro"],
        astroIntegration: "none",
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "orpc",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      };

      const result = await runTRPCTest(config);
      expectSuccess(result);
    });
  });

  describe("Astro Fullstack Mode", () => {
    it("should work with Astro fullstack (self backend) + React + tRPC", async () => {
      const config: TestConfig = {
        projectName: "astro-fullstack-trpc",
        frontend: ["astro"],
        astroIntegration: "react",
        backend: "self",
        runtime: "none",
        database: "sqlite",
        orm: "drizzle",
        auth: "better-auth",
        api: "trpc",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      };

      const result = await runTRPCTest(config);
      expectSuccess(result);
    });

    it("should work with Astro fullstack (self backend) + Vue + oRPC", async () => {
      const config: TestConfig = {
        projectName: "astro-fullstack-vue-orpc",
        frontend: ["astro"],
        astroIntegration: "vue",
        backend: "self",
        runtime: "none",
        database: "sqlite",
        orm: "drizzle",
        auth: "better-auth",
        api: "orpc",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      };

      const result = await runTRPCTest(config);
      expectSuccess(result);
    });
  });

  describe("Astro API Compatibility", () => {
    it("should allow tRPC only with React integration", async () => {
      const config: TestConfig = {
        projectName: "astro-react-trpc-valid",
        frontend: ["astro"],
        astroIntegration: "react",
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "trpc",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      };

      const result = await runTRPCTest(config);
      expectSuccess(result);
    });

    it("should fail tRPC with Vue integration", async () => {
      const result = await runTRPCTest({
        projectName: "astro-vue-trpc-fail",
        frontend: ["astro"],
        astroIntegration: "vue",
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "trpc",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        expectError: true,
      });

      expectError(result, "tRPC API requires React integration with Astro");
    });

    it("should fail tRPC with Svelte integration", async () => {
      const result = await runTRPCTest({
        projectName: "astro-svelte-trpc-fail",
        frontend: ["astro"],
        astroIntegration: "svelte",
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "trpc",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        expectError: true,
      });

      expectError(result, "tRPC API requires React integration with Astro");
    });

    it("should fail tRPC with Solid integration", async () => {
      const result = await runTRPCTest({
        projectName: "astro-solid-trpc-fail",
        frontend: ["astro"],
        astroIntegration: "solid",
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "trpc",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        expectError: true,
      });

      expectError(result, "tRPC API requires React integration with Astro");
    });

    it("should fail tRPC with no integration", async () => {
      const result = await runTRPCTest({
        projectName: "astro-none-trpc-fail",
        frontend: ["astro"],
        astroIntegration: "none",
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "trpc",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        expectError: true,
      });

      expectError(result, "tRPC API requires React integration with Astro");
    });

    it("should allow oRPC with any integration", async () => {
      const integrations = ["react", "vue", "svelte", "solid", "none"] as const;

      for (const integration of integrations) {
        const result = await runTRPCTest({
          projectName: `astro-${integration}-orpc`,
          frontend: ["astro"],
          astroIntegration: integration,
          backend: "hono",
          runtime: "bun",
          database: "sqlite",
          orm: "drizzle",
          auth: "none",
          api: "orpc",
          addons: ["none"],
          examples: ["none"],
          dbSetup: "none",
          webDeploy: "none",
          serverDeploy: "none",
          install: false,
        });

        expectSuccess(result);
      }
    });
  });

  describe("Astro Incompatibilities", () => {
    it("should fail with Astro + Convex", async () => {
      const result = await runTRPCTest({
        projectName: "astro-convex-fail",
        frontend: ["astro"],
        astroIntegration: "react",
        backend: "convex",
        runtime: "none",
        database: "none",
        orm: "none",
        auth: "none",
        api: "none",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        expectError: true,
      });

      expectError(
        result,
        "The following frontends are not compatible with '--backend convex': astro",
      );
    });
  });

  describe("Astro with Addons", () => {
    it("should work with Astro + PWA", async () => {
      const config: TestConfig = {
        projectName: "astro-pwa",
        frontend: ["astro"],
        astroIntegration: "react",
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "trpc",
        addons: ["pwa"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      };

      const result = await runTRPCTest(config);
      expectSuccess(result);
    });

    it("should work with Astro + Tauri", async () => {
      const config: TestConfig = {
        projectName: "astro-tauri",
        frontend: ["astro"],
        astroIntegration: "react",
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "trpc",
        addons: ["tauri"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      };

      const result = await runTRPCTest(config);
      expectSuccess(result);
    });

    it("should work with Astro + Biome", async () => {
      const config: TestConfig = {
        projectName: "astro-biome",
        frontend: ["astro"],
        astroIntegration: "react",
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "trpc",
        addons: ["biome"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      };

      const result = await runTRPCTest(config);
      expectSuccess(result);
    });
  });

  describe("Astro with Examples", () => {
    it("should work with Astro + React + AI example", async () => {
      const config: TestConfig = {
        projectName: "astro-ai-example",
        frontend: ["astro"],
        astroIntegration: "react",
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "trpc",
        addons: ["none"],
        examples: ["ai"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      };

      const result = await runTRPCTest(config);
      expectSuccess(result);
    });
  });

  describe("Astro + Native Combo", () => {
    it("should work with Astro + Native app", async () => {
      const config: TestConfig = {
        projectName: "astro-native-combo",
        frontend: ["astro", "native-bare"],
        astroIntegration: "react",
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "trpc",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      };

      const result = await runTRPCTest(config);
      expectSuccess(result);
    });
  });

  describe("Astro with Different Backends", () => {
    const backends = ["hono", "express", "fastify", "elysia"] as const;

    for (const backend of backends) {
      it(`should work with Astro + ${backend}`, async () => {
        const config: TestConfig = {
          projectName: `astro-${backend}`,
          frontend: ["astro"],
          astroIntegration: "react",
          backend,
          runtime: "bun",
          database: "sqlite",
          orm: "drizzle",
          auth: "none",
          api: "trpc",
          addons: ["none"],
          examples: ["none"],
          dbSetup: "none",
          webDeploy: "none",
          serverDeploy: "none",
          install: false,
        };

        const result = await runTRPCTest(config);
        expectSuccess(result);
      });
    }
  });

  describe("Astro with Different Databases", () => {
    it("should work with Astro + PostgreSQL", async () => {
      const config: TestConfig = {
        projectName: "astro-postgres",
        frontend: ["astro"],
        astroIntegration: "react",
        backend: "hono",
        runtime: "bun",
        database: "postgres",
        orm: "drizzle",
        auth: "none",
        api: "trpc",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      };

      const result = await runTRPCTest(config);
      expectSuccess(result);
    });

    it("should work with Astro + MySQL", async () => {
      const config: TestConfig = {
        projectName: "astro-mysql",
        frontend: ["astro"],
        astroIntegration: "react",
        backend: "hono",
        runtime: "bun",
        database: "mysql",
        orm: "drizzle",
        auth: "none",
        api: "trpc",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      };

      const result = await runTRPCTest(config);
      expectSuccess(result);
    });

    it("should work with Astro + MongoDB", async () => {
      const config: TestConfig = {
        projectName: "astro-mongodb",
        frontend: ["astro"],
        astroIntegration: "react",
        backend: "hono",
        runtime: "bun",
        database: "mongodb",
        orm: "prisma",
        auth: "none",
        api: "trpc",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      };

      const result = await runTRPCTest(config);
      expectSuccess(result);
    });
  });
});
