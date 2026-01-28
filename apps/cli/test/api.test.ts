import { describe, it } from "bun:test";

import type { API, Backend, Database, Examples, Frontend, ORM, Runtime } from "../src/types";

import { expectError, expectSuccess, runTRPCTest, type TestConfig } from "./test-utils";

describe("API Configurations", () => {
  describe("tRPC API", () => {
    const reactFrontends = ["tanstack-router", "react-router", "tanstack-start", "next"];

    for (const frontend of reactFrontends) {
      it(`should work with tRPC + ${frontend}`, async () => {
        const result = await runTRPCTest({
          projectName: `trpc-${frontend}`,
          api: "trpc",
          frontend: [frontend as Frontend],
          backend: "hono",
          runtime: "bun",
          database: "sqlite",
          orm: "drizzle",
          auth: "none",
          addons: ["none"],
          examples: ["none"],
          dbSetup: "none",
          webDeploy: "none",
          serverDeploy: "none",
          install: false,
        });

        expectSuccess(result);
      });
    }

    const nativeFrontends = ["native-bare", "native-uniwind", "native-unistyles"];

    for (const frontend of nativeFrontends) {
      it(`should work with tRPC + ${frontend}`, async () => {
        const result = await runTRPCTest({
          projectName: `trpc-${frontend}`,
          api: "trpc",
          frontend: [frontend as Frontend],
          backend: "hono",
          runtime: "bun",
          database: "sqlite",
          orm: "drizzle",
          auth: "none",
          addons: ["none"],
          examples: ["none"],
          dbSetup: "none",
          webDeploy: "none",
          serverDeploy: "none",
          install: false,
        });

        expectSuccess(result);
      });
    }

    it("should fail with tRPC + Nuxt", async () => {
      const result = await runTRPCTest({
        projectName: "trpc-nuxt-fail",
        api: "trpc",
        frontend: ["nuxt"],
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        expectError: true,
      });

      expectError(result, "tRPC API requires React-based frontends");
    });

    it("should fail with tRPC + Svelte", async () => {
      const result = await runTRPCTest({
        projectName: "trpc-svelte-fail",
        api: "trpc",
        frontend: ["svelte"],
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        expectError: true,
      });

      expectError(result, "tRPC API requires React-based frontends");
    });

    it("should fail with tRPC + Solid", async () => {
      const result = await runTRPCTest({
        projectName: "trpc-solid-fail",
        api: "trpc",
        frontend: ["solid"],
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        expectError: true,
      });

      expectError(result, "tRPC API requires React-based frontends");
    });

    const backends = ["hono", "express", "fastify", "elysia"];

    for (const backend of backends) {
      it(`should work with tRPC + ${backend}`, async () => {
        const config: TestConfig = {
          projectName: `trpc-${backend}`,
          api: "trpc",
          backend: backend as Backend,
          frontend: ["tanstack-router"],
          database: "sqlite",
          orm: "drizzle",
          auth: "none",
          addons: ["none"],
          examples: ["none"],
          dbSetup: "none",
          webDeploy: "none",
          serverDeploy: "none",
          install: false,
        };

        if (backend === "elysia") {
          config.runtime = "bun";
        } else {
          config.runtime = "bun";
        }

        const result = await runTRPCTest(config);
        expectSuccess(result);
      });
    }
  });

  describe("ts-rest API", () => {
    const reactFrontends = ["tanstack-router", "react-router", "tanstack-start", "next"];

    for (const frontend of reactFrontends) {
      it(`should work with ts-rest + ${frontend}`, async () => {
        const result = await runTRPCTest({
          projectName: `ts-rest-${frontend}`,
          api: "ts-rest",
          frontend: [frontend as Frontend],
          backend: "hono",
          runtime: "bun",
          database: "sqlite",
          orm: "drizzle",
          auth: "none",
          addons: ["none"],
          examples: ["none"],
          dbSetup: "none",
          webDeploy: "none",
          serverDeploy: "none",
          install: false,
        });

        expectSuccess(result);
      });
    }

    const nativeFrontends = ["native-bare", "native-uniwind", "native-unistyles"];

    for (const frontend of nativeFrontends) {
      it(`should work with ts-rest + ${frontend}`, async () => {
        const result = await runTRPCTest({
          projectName: `ts-rest-${frontend}`,
          api: "ts-rest",
          frontend: [frontend as Frontend],
          backend: "hono",
          runtime: "bun",
          database: "sqlite",
          orm: "drizzle",
          auth: "none",
          addons: ["none"],
          examples: ["none"],
          dbSetup: "none",
          webDeploy: "none",
          serverDeploy: "none",
          install: false,
        });

        expectSuccess(result);
      });
    }

    it("should fail with ts-rest + Nuxt", async () => {
      const result = await runTRPCTest({
        projectName: "ts-rest-nuxt-fail",
        api: "ts-rest",
        frontend: ["nuxt"],
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        expectError: true,
      });

      expectError(result, "ts-rest API requires React-based frontends");
    });

    it("should fail with ts-rest + Svelte", async () => {
      const result = await runTRPCTest({
        projectName: "ts-rest-svelte-fail",
        api: "ts-rest",
        frontend: ["svelte"],
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        expectError: true,
      });

      expectError(result, "ts-rest API requires React-based frontends");
    });

    it("should fail with ts-rest + Solid", async () => {
      const result = await runTRPCTest({
        projectName: "ts-rest-solid-fail",
        api: "ts-rest",
        frontend: ["solid"],
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        expectError: true,
      });

      expectError(result, "ts-rest API requires React-based frontends");
    });

    const backends = ["hono", "express", "fastify", "elysia"];

    for (const backend of backends) {
      it(`should work with ts-rest + ${backend}`, async () => {
        const config: TestConfig = {
          projectName: `ts-rest-${backend}`,
          api: "ts-rest",
          backend: backend as Backend,
          frontend: ["tanstack-router"],
          database: "sqlite",
          orm: "drizzle",
          auth: "none",
          addons: ["none"],
          examples: ["none"],
          dbSetup: "none",
          webDeploy: "none",
          serverDeploy: "none",
          install: false,
        };

        if (backend === "elysia") {
          config.runtime = "bun";
        } else {
          config.runtime = "bun";
        }

        const result = await runTRPCTest(config);
        expectSuccess(result);
      });
    }

    it("should work with ts-rest + better-auth", async () => {
      const result = await runTRPCTest({
        projectName: "ts-rest-better-auth",
        api: "ts-rest",
        auth: "better-auth",
        frontend: ["tanstack-router"],
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });

    const fullstackFrontends = ["next", "tanstack-start", "astro"];

    for (const frontend of fullstackFrontends) {
      it(`should work with ts-rest + self backend + ${frontend}`, async () => {
        const config: TestConfig = {
          projectName: `ts-rest-self-${frontend}`,
          api: "ts-rest",
          frontend: [frontend as Frontend],
          backend: "self",
          runtime: "none",
          database: "sqlite",
          orm: "drizzle",
          auth: "none",
          addons: ["none"],
          examples: ["none"],
          dbSetup: "none",
          webDeploy: "none",
          serverDeploy: "none",
          install: false,
        };

        // Astro requires React integration for ts-rest
        if (frontend === "astro") {
          config.astroIntegration = "react";
        }

        const result = await runTRPCTest(config);

        expectSuccess(result);
      });
    }
  });

  describe("Garph API", () => {
    const reactFrontends = ["tanstack-router", "react-router", "tanstack-start", "next"];

    for (const frontend of reactFrontends) {
      it(`should work with Garph + ${frontend}`, async () => {
        const result = await runTRPCTest({
          projectName: `garph-${frontend}`,
          api: "garph",
          frontend: [frontend as Frontend],
          backend: "hono",
          runtime: "bun",
          database: "sqlite",
          orm: "drizzle",
          auth: "none",
          addons: ["none"],
          examples: ["none"],
          dbSetup: "none",
          webDeploy: "none",
          serverDeploy: "none",
          install: false,
        });

        expectSuccess(result);
      });
    }

    const nativeFrontends = ["native-bare", "native-uniwind", "native-unistyles"];

    for (const frontend of nativeFrontends) {
      it(`should work with Garph + ${frontend}`, async () => {
        const result = await runTRPCTest({
          projectName: `garph-${frontend}`,
          api: "garph",
          frontend: [frontend as Frontend],
          backend: "hono",
          runtime: "bun",
          database: "sqlite",
          orm: "drizzle",
          auth: "none",
          addons: ["none"],
          examples: ["none"],
          dbSetup: "none",
          webDeploy: "none",
          serverDeploy: "none",
          install: false,
        });

        expectSuccess(result);
      });
    }

    it("should fail with Garph + Nuxt", async () => {
      const result = await runTRPCTest({
        projectName: "garph-nuxt-fail",
        api: "garph",
        frontend: ["nuxt"],
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        expectError: true,
      });

      expectError(result, "garph API requires React-based frontends");
    });

    it("should fail with Garph + Svelte", async () => {
      const result = await runTRPCTest({
        projectName: "garph-svelte-fail",
        api: "garph",
        frontend: ["svelte"],
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        expectError: true,
      });

      expectError(result, "garph API requires React-based frontends");
    });

    it("should fail with Garph + Solid", async () => {
      const result = await runTRPCTest({
        projectName: "garph-solid-fail",
        api: "garph",
        frontend: ["solid"],
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        expectError: true,
      });

      expectError(result, "garph API requires React-based frontends");
    });

    const backends = ["hono", "express", "fastify", "elysia"];

    for (const backend of backends) {
      it(`should work with Garph + ${backend}`, async () => {
        const config: TestConfig = {
          projectName: `garph-${backend}`,
          api: "garph",
          backend: backend as Backend,
          frontend: ["tanstack-router"],
          database: "sqlite",
          orm: "drizzle",
          auth: "none",
          addons: ["none"],
          examples: ["none"],
          dbSetup: "none",
          webDeploy: "none",
          serverDeploy: "none",
          install: false,
        };

        if (backend === "elysia") {
          config.runtime = "bun";
        } else {
          config.runtime = "bun";
        }

        const result = await runTRPCTest(config);
        expectSuccess(result);
      });
    }

    it("should work with Garph + better-auth", async () => {
      const result = await runTRPCTest({
        projectName: "garph-better-auth",
        api: "garph",
        auth: "better-auth",
        frontend: ["tanstack-router"],
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });

    const fullstackFrontends = ["next", "tanstack-start", "astro"];

    for (const frontend of fullstackFrontends) {
      it(`should work with Garph + self backend + ${frontend}`, async () => {
        const config: TestConfig = {
          projectName: `garph-self-${frontend}`,
          api: "garph",
          frontend: [frontend as Frontend],
          backend: "self",
          runtime: "none",
          database: "sqlite",
          orm: "drizzle",
          auth: "none",
          addons: ["none"],
          examples: ["none"],
          dbSetup: "none",
          webDeploy: "none",
          serverDeploy: "none",
          install: false,
        };

        // Astro requires React integration for Garph
        if (frontend === "astro") {
          config.astroIntegration = "react";
        }

        const result = await runTRPCTest(config);

        expectSuccess(result);
      });
    }

    it("should work with Garph + basic example", async () => {
      const result = await runTRPCTest({
        projectName: "garph-basic",
        api: "garph",
        examples: ["none"],
        frontend: ["tanstack-router"],
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        addons: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });
  });

  describe("oRPC API", () => {
    const frontends = [
      "tanstack-router",
      "react-router",
      "tanstack-start",
      "next",
      "nuxt",
      "svelte",
      "solid",
      "native-bare",
      "native-uniwind",
      "native-unistyles",
    ];

    for (const frontend of frontends) {
      it(`should work with oRPC + ${frontend}`, async () => {
        const result = await runTRPCTest({
          projectName: `orpc-${frontend}`,
          api: "orpc",
          frontend: [frontend as Frontend],
          backend: "hono",
          runtime: "bun",
          database: "sqlite",
          orm: "drizzle",
          auth: "none",
          addons: ["none"],
          examples: ["none"],
          dbSetup: "none",
          webDeploy: "none",
          serverDeploy: "none",
          install: false,
        });

        expectSuccess(result);
      });
    }

    const backends = ["hono", "express", "fastify", "elysia"];

    for (const backend of backends) {
      it(`should work with oRPC + ${backend}`, async () => {
        const config: TestConfig = {
          projectName: `orpc-${backend}`,
          api: "orpc",
          backend: backend as Backend,
          frontend: ["tanstack-router"],
          database: "sqlite",
          orm: "drizzle",
          auth: "none",
          addons: ["none"],
          examples: ["none"],
          dbSetup: "none",
          webDeploy: "none",
          serverDeploy: "none",
          install: false,
        };

        if (backend === "elysia") {
          config.runtime = "bun";
        } else {
          config.runtime = "bun";
        }

        const result = await runTRPCTest(config);
        expectSuccess(result);
      });
    }
  });

  describe("No API", () => {
    it("should work with API none + basic setup", async () => {
      const result = await runTRPCTest({
        projectName: "api-none-basic",
        api: "none",
        frontend: ["tanstack-router"],
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });

    it("should work with API none + frontend only", async () => {
      const result = await runTRPCTest({
        projectName: "api-none-frontend-only",
        api: "none",
        frontend: ["tanstack-router"],
        backend: "none",
        runtime: "none",
        database: "none",
        orm: "none",
        auth: "none",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });

    it("should work with API none + convex", async () => {
      const result = await runTRPCTest({
        projectName: "api-none-convex",
        api: "none",
        frontend: ["tanstack-router"],
        backend: "convex",
        runtime: "none",
        database: "none",
        orm: "none",
        auth: "none",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });

    it("should work with API none + no examples (non-convex backend)", async () => {
      const result = await runTRPCTest({
        projectName: "api-none-no-examples",
        api: "none",
        frontend: ["tanstack-router"],
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });

    it("should work with API none + examples + convex backend", async () => {
      const result = await runTRPCTest({
        projectName: "api-none-examples-convex",
        api: "none",
        frontend: ["tanstack-router"],
        backend: "convex",
        runtime: "none",
        database: "none",
        orm: "none",
        auth: "none",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });
  });

  describe("API with Different Database Combinations", () => {
    const apiDatabaseCombinations = [
      { api: "trpc", database: "sqlite", orm: "drizzle" },
      { api: "trpc", database: "postgres", orm: "drizzle" },
      { api: "trpc", database: "mysql", orm: "prisma" },
      { api: "trpc", database: "mongodb", orm: "mongoose" },
      { api: "orpc", database: "sqlite", orm: "drizzle" },
      { api: "orpc", database: "postgres", orm: "prisma" },
      { api: "orpc", database: "mysql", orm: "drizzle" },
      { api: "orpc", database: "mongodb", orm: "prisma" },
    ];

    for (const { api, database, orm } of apiDatabaseCombinations) {
      it(`should work with ${api} + ${database} + ${orm}`, async () => {
        const result = await runTRPCTest({
          projectName: `${api}-${database}-${orm}`,
          api: api as API,
          database: database as Database,
          orm: orm as ORM,
          frontend: ["tanstack-router"],
          backend: "hono",
          runtime: "bun",
          auth: "none",
          addons: ["none"],
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

  describe("API with Authentication", () => {
    it("should work with tRPC + better-auth", async () => {
      const result = await runTRPCTest({
        projectName: "trpc-better-auth",
        api: "trpc",
        auth: "better-auth",
        frontend: ["tanstack-router"],
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });

    it("should work with oRPC + better-auth", async () => {
      const result = await runTRPCTest({
        projectName: "orpc-better-auth",
        api: "orpc",
        auth: "better-auth",
        frontend: ["tanstack-router"],
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });

    it("should work with API none + convex + clerk", async () => {
      const result = await runTRPCTest({
        projectName: "api-none-convex-clerk",
        api: "none",
        auth: "clerk",
        frontend: ["tanstack-router"],
        backend: "convex",
        runtime: "none",
        database: "none",
        orm: "none",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });
  });

  describe("API with Examples", () => {
    it("should work with tRPC + AI example", async () => {
      const result = await runTRPCTest({
        projectName: "trpc-ai",
        api: "trpc",
        examples: ["ai"],
        frontend: ["tanstack-router"],
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        addons: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });

    it("should work with oRPC + AI example", async () => {
      const result = await runTRPCTest({
        projectName: "orpc-ai",
        api: "orpc",
        examples: ["ai"],
        frontend: ["tanstack-router"],
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        addons: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });

    const apiExampleCombinations = [
      { api: "trpc", examples: ["ai"] },
      { api: "orpc", examples: ["ai"] },
    ];

    for (const { api, examples } of apiExampleCombinations) {
      it(`should work with ${api} + AI example`, async () => {
        const result = await runTRPCTest({
          projectName: `${api}-ai-example`,
          api: api as API,
          examples: examples as Examples[],
          frontend: ["tanstack-router"],
          backend: "hono",
          runtime: "bun",
          database: "sqlite",
          orm: "drizzle",
          auth: "none",
          addons: ["none"],
          dbSetup: "none",
          webDeploy: "none",
          serverDeploy: "none",
          install: false,
        });

        expectSuccess(result);
      });
    }
  });

  describe("All API Types", () => {
    const apis = ["trpc", "orpc", "ts-rest", "garph", "none"];

    for (const api of apis) {
      it(`should work with ${api} API`, async () => {
        const config: TestConfig = {
          projectName: `test-api-${api}`,
          api: api as API,
          addons: ["none"],
          examples: ["none"],
          dbSetup: "none",
          webDeploy: "none",
          serverDeploy: "none",
          install: false,
        };

        if (api === "none") {
          config.backend = "none";
          config.runtime = "none";
          config.database = "none";
          config.orm = "none";
          config.auth = "none";
          config.frontend = ["tanstack-router"];
        } else {
          config.backend = "hono";
          config.runtime = "bun";
          config.database = "sqlite";
          config.orm = "drizzle";
          config.auth = "none";
          config.frontend = ["tanstack-router"];
        }

        const result = await runTRPCTest(config);
        expectSuccess(result);
      });
    }
  });

  describe("API Edge Cases", () => {
    it("should handle API with complex frontend combinations", async () => {
      const result = await runTRPCTest({
        projectName: "api-complex-frontend",
        api: "trpc",
        frontend: ["tanstack-router", "native-bare"],
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });

    it("should handle API with workers runtime", async () => {
      const result = await runTRPCTest({
        projectName: "api-workers",
        api: "trpc",
        frontend: ["tanstack-router"],
        backend: "hono",
        runtime: "workers",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "cloudflare",
        install: false,
      });

      expectSuccess(result);
    });

    const runtimeApiCombinations = [
      { runtime: "bun", api: "trpc" },
      { runtime: "node", api: "orpc" },
      { runtime: "workers", api: "trpc" },
    ];

    for (const { runtime, api } of runtimeApiCombinations) {
      it(`should handle ${api} with ${runtime} runtime`, async () => {
        const config: TestConfig = {
          projectName: `${runtime}-${api}`,
          api: api as API,
          runtime: runtime as Runtime,
          frontend: ["tanstack-router"],
          backend: "hono",
          database: "sqlite",
          orm: "drizzle",
          auth: "none",
          addons: ["none"],
          examples: ["none"],
          dbSetup: "none",
          webDeploy: "none",
          serverDeploy: "none",
          install: false,
        };

        if (runtime === "workers") {
          config.serverDeploy = "cloudflare";
        }

        const result = await runTRPCTest(config);
        expectSuccess(result);
      });
    }
  });
});
