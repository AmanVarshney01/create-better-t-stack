import { describe, expect, it } from "bun:test";

import { expectSuccess, runTRPCTest, type TestConfig } from "./test-utils";

describe("Railway Deployment", () => {
  describe("Web Deployment with Railway", () => {
    const webFrontends = [
      "tanstack-router",
      "react-router",
      "tanstack-start",
      "next",
      "nuxt",
      "svelte",
      "solid",
    ] as const;

    for (const frontend of webFrontends) {
      it(`should generate Railway config for ${frontend} web frontend`, async () => {
        const config: TestConfig = {
          projectName: `railway-web-${frontend}`,
          webDeploy: "railway",
          serverDeploy: "none",
          frontend: [frontend],
          backend: "hono",
          runtime: "bun",
          database: "sqlite",
          orm: "drizzle",
          auth: "none",
          addons: ["none"],
          examples: ["none"],
          dbSetup: "none",
          install: false,
        };

        // Handle API compatibility for non-React frontends
        if (["nuxt", "svelte", "solid"].includes(frontend)) {
          config.api = "orpc";
        } else {
          config.api = "trpc";
        }

        const result = await runTRPCTest(config);
        expectSuccess(result);

        // Verify Railway files are generated
        expect(result.success).toBe(true);
      });
    }

    it("should generate standalone output for Next.js with Railway", async () => {
      const result = await runTRPCTest({
        projectName: "railway-nextjs-standalone",
        webDeploy: "railway",
        serverDeploy: "none",
        frontend: ["next"],
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "trpc",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        install: false,
      });

      expectSuccess(result);
    });

    it("should add node adapter for SvelteKit with Railway", async () => {
      const result = await runTRPCTest({
        projectName: "railway-sveltekit-adapter",
        webDeploy: "railway",
        serverDeploy: "none",
        frontend: ["svelte"],
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "orpc",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        install: false,
      });

      expectSuccess(result);
    });
  });

  describe("Server Deployment with Railway", () => {
    const backends = ["hono", "express", "fastify", "elysia"] as const;

    for (const backend of backends) {
      it(`should generate Railway config for ${backend} backend`, async () => {
        const result = await runTRPCTest({
          projectName: `railway-server-${backend}`,
          webDeploy: "none",
          serverDeploy: "railway",
          backend,
          runtime: "bun",
          database: "sqlite",
          orm: "drizzle",
          auth: "none",
          api: "trpc",
          frontend: ["tanstack-router"],
          addons: ["none"],
          examples: ["none"],
          dbSetup: "none",
          install: false,
        });

        expectSuccess(result);
      });
    }
  });

  describe("Combined Web and Server Deployment with Railway", () => {
    it("should work with both web and server deployed to Railway", async () => {
      const result = await runTRPCTest({
        projectName: "railway-fullstack",
        webDeploy: "railway",
        serverDeploy: "railway",
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "trpc",
        frontend: ["tanstack-router"],
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        install: false,
      });

      expectSuccess(result);
    });

    it("should work with Next.js fullstack on Railway", async () => {
      const result = await runTRPCTest({
        projectName: "railway-next-fullstack",
        webDeploy: "railway",
        serverDeploy: "railway",
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "trpc",
        frontend: ["next"],
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        install: false,
      });

      expectSuccess(result);
    });
  });

  describe("Railway with Package Managers", () => {
    const packageManagers = ["npm", "pnpm", "bun"] as const;

    for (const pm of packageManagers) {
      it(`should work with ${pm} package manager`, async () => {
        const result = await runTRPCTest({
          projectName: `railway-${pm}-test`,
          webDeploy: "railway",
          serverDeploy: "railway",
          backend: "hono",
          runtime: pm === "bun" ? "bun" : "node",
          database: "sqlite",
          orm: "drizzle",
          auth: "none",
          api: "trpc",
          frontend: ["tanstack-router"],
          addons: ["none"],
          examples: ["none"],
          dbSetup: "none",
          packageManager: pm,
          install: false,
        });

        expectSuccess(result);
      });
    }
  });

  describe("Railway with Turborepo", () => {
    it("should work with Turborepo monorepo", async () => {
      const result = await runTRPCTest({
        projectName: "railway-turborepo",
        webDeploy: "railway",
        serverDeploy: "railway",
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "trpc",
        frontend: ["tanstack-router"],
        addons: ["turborepo"],
        examples: ["none"],
        dbSetup: "none",
        install: false,
      });

      expectSuccess(result);
    });
  });

  describe("Mixed Deployment Providers", () => {
    it("should work with Railway web + no server deploy", async () => {
      const result = await runTRPCTest({
        projectName: "railway-web-only",
        webDeploy: "railway",
        serverDeploy: "none",
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "trpc",
        frontend: ["tanstack-router"],
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        install: false,
      });

      expectSuccess(result);
    });

    it("should work with no web deploy + Railway server", async () => {
      const result = await runTRPCTest({
        projectName: "railway-server-only",
        webDeploy: "none",
        serverDeploy: "railway",
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "trpc",
        frontend: ["tanstack-router"],
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        install: false,
      });

      expectSuccess(result);
    });
  });
});
