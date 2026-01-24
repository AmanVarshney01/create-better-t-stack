import { describe, expect, it } from "bun:test";

import { expectSuccess, runTRPCTest, type TestConfig } from "./test-utils";

describe("SST Deployment", () => {
  describe("Web Deployment with SST", () => {
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
      it(`should generate SST config for ${frontend} web frontend`, async () => {
        const config: TestConfig = {
          projectName: `sst-web-${frontend}`,
          webDeploy: "sst",
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

        // Verify SST config file is generated
        expect(result.success).toBe(true);
      });
    }

    it("should add OpenNext adapter for Next.js with SST", async () => {
      const result = await runTRPCTest({
        projectName: "sst-nextjs-opennext",
        webDeploy: "sst",
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

    it("should add node adapter for SvelteKit with SST", async () => {
      const result = await runTRPCTest({
        projectName: "sst-sveltekit-adapter",
        webDeploy: "sst",
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

  describe("Server Deployment with SST", () => {
    const backends = ["hono", "express", "fastify", "elysia"] as const;

    for (const backend of backends) {
      it(`should generate SST config for ${backend} backend`, async () => {
        const result = await runTRPCTest({
          projectName: `sst-server-${backend}`,
          webDeploy: "none",
          serverDeploy: "sst",
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

  describe("Combined Web and Server Deployment with SST", () => {
    it("should work with both web and server deployed to SST", async () => {
      const result = await runTRPCTest({
        projectName: "sst-fullstack",
        webDeploy: "sst",
        serverDeploy: "sst",
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

    it("should work with Next.js fullstack on SST", async () => {
      const result = await runTRPCTest({
        projectName: "sst-next-fullstack",
        webDeploy: "sst",
        serverDeploy: "sst",
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

  describe("SST with Package Managers", () => {
    const packageManagers = ["npm", "pnpm", "bun"] as const;

    for (const pm of packageManagers) {
      it(`should work with ${pm} package manager`, async () => {
        const result = await runTRPCTest({
          projectName: `sst-${pm}-test`,
          webDeploy: "sst",
          serverDeploy: "sst",
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

  describe("SST with Turborepo", () => {
    it("should work with Turborepo monorepo", async () => {
      const result = await runTRPCTest({
        projectName: "sst-turborepo",
        webDeploy: "sst",
        serverDeploy: "sst",
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
    it("should work with SST web + no server deploy", async () => {
      const result = await runTRPCTest({
        projectName: "sst-web-only",
        webDeploy: "sst",
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

    it("should work with no web deploy + SST server", async () => {
      const result = await runTRPCTest({
        projectName: "sst-server-only",
        webDeploy: "none",
        serverDeploy: "sst",
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

  describe("SST with Database Configuration", () => {
    it("should include database environment variables for postgres", async () => {
      const result = await runTRPCTest({
        projectName: "sst-postgres",
        webDeploy: "sst",
        serverDeploy: "sst",
        backend: "hono",
        runtime: "bun",
        database: "postgres",
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

    it("should work with sqlite database", async () => {
      const result = await runTRPCTest({
        projectName: "sst-sqlite",
        webDeploy: "sst",
        serverDeploy: "sst",
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
