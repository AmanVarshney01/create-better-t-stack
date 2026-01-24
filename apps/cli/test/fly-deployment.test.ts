import { describe, expect, it } from "bun:test";

import { expectSuccess, runTRPCTest, type TestConfig } from "./test-utils";

describe("Fly.io Deployment", () => {
  describe("Web Deployment with Fly.io", () => {
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
      it(`should generate Fly.io config for ${frontend} web frontend`, async () => {
        const config: TestConfig = {
          projectName: `fly-web-${frontend}`,
          webDeploy: "fly",
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

        // Verify Fly.io files are generated
        expect(result.success).toBe(true);
      });
    }

    it("should generate standalone output for Next.js with Fly.io", async () => {
      const result = await runTRPCTest({
        projectName: "fly-nextjs-standalone",
        webDeploy: "fly",
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

    it("should add node adapter for SvelteKit with Fly.io", async () => {
      const result = await runTRPCTest({
        projectName: "fly-sveltekit-adapter",
        webDeploy: "fly",
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

  describe("Server Deployment with Fly.io", () => {
    const backends = ["hono", "express", "fastify", "elysia"] as const;

    for (const backend of backends) {
      it(`should generate Fly.io config for ${backend} backend`, async () => {
        const result = await runTRPCTest({
          projectName: `fly-server-${backend}`,
          webDeploy: "none",
          serverDeploy: "fly",
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

  describe("Combined Web and Server Deployment with Fly.io", () => {
    it("should work with both web and server deployed to Fly.io", async () => {
      const result = await runTRPCTest({
        projectName: "fly-fullstack",
        webDeploy: "fly",
        serverDeploy: "fly",
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

    it("should work with Next.js fullstack on Fly.io", async () => {
      const result = await runTRPCTest({
        projectName: "fly-next-fullstack",
        webDeploy: "fly",
        serverDeploy: "fly",
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

  describe("Fly.io with Package Managers", () => {
    const packageManagers = ["npm", "pnpm", "bun"] as const;

    for (const pm of packageManagers) {
      it(`should work with ${pm} package manager`, async () => {
        const result = await runTRPCTest({
          projectName: `fly-${pm}-test`,
          webDeploy: "fly",
          serverDeploy: "fly",
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

  describe("Fly.io with Turborepo", () => {
    it("should work with Turborepo monorepo", async () => {
      const result = await runTRPCTest({
        projectName: "fly-turborepo",
        webDeploy: "fly",
        serverDeploy: "fly",
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
    it("should work with Fly.io web + no server deploy", async () => {
      const result = await runTRPCTest({
        projectName: "fly-web-only",
        webDeploy: "fly",
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

    it("should work with no web deploy + Fly.io server", async () => {
      const result = await runTRPCTest({
        projectName: "fly-server-only",
        webDeploy: "none",
        serverDeploy: "fly",
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
