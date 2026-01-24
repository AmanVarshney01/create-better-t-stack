import { describe, expect, it } from "bun:test";

import { expectSuccess, runTRPCTest, type TestConfig } from "./test-utils";

describe("Docker Deployment", () => {
  describe("Web Deployment with Docker", () => {
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
      it(`should generate Docker config for ${frontend} web frontend`, async () => {
        const config: TestConfig = {
          projectName: `docker-web-${frontend}`,
          webDeploy: "docker",
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

        // Verify Docker files are generated
        expect(result.success).toBe(true);
      });
    }

    it("should generate standalone output for Next.js with Docker", async () => {
      const result = await runTRPCTest({
        projectName: "docker-nextjs-standalone",
        webDeploy: "docker",
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

    it("should add node adapter for SvelteKit with Docker", async () => {
      const result = await runTRPCTest({
        projectName: "docker-sveltekit-adapter",
        webDeploy: "docker",
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

  describe("Server Deployment with Docker", () => {
    const backends = ["hono", "express", "fastify", "elysia"] as const;

    for (const backend of backends) {
      it(`should generate Docker config for ${backend} backend`, async () => {
        const result = await runTRPCTest({
          projectName: `docker-server-${backend}`,
          webDeploy: "none",
          serverDeploy: "docker",
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

  describe("Combined Web and Server Deployment with Docker", () => {
    it("should work with both web and server deployed to Docker", async () => {
      const result = await runTRPCTest({
        projectName: "docker-fullstack",
        webDeploy: "docker",
        serverDeploy: "docker",
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

    it("should work with Next.js fullstack on Docker", async () => {
      const result = await runTRPCTest({
        projectName: "docker-next-fullstack",
        webDeploy: "docker",
        serverDeploy: "docker",
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

    it("should generate docker-compose with PostgreSQL database", async () => {
      const result = await runTRPCTest({
        projectName: "docker-postgres",
        webDeploy: "docker",
        serverDeploy: "docker",
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

    it("should generate docker-compose with MySQL database", async () => {
      const result = await runTRPCTest({
        projectName: "docker-mysql",
        webDeploy: "docker",
        serverDeploy: "docker",
        backend: "hono",
        runtime: "bun",
        database: "mysql",
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

    it("should generate docker-compose with MongoDB database", async () => {
      const result = await runTRPCTest({
        projectName: "docker-mongodb",
        webDeploy: "docker",
        serverDeploy: "docker",
        backend: "hono",
        runtime: "bun",
        database: "mongodb",
        orm: "mongoose",
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

    it("should generate docker-compose with Redis database", async () => {
      const result = await runTRPCTest({
        projectName: "docker-redis",
        webDeploy: "docker",
        serverDeploy: "docker",
        backend: "hono",
        runtime: "bun",
        database: "redis",
        orm: "none",
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

  describe("Docker with Package Managers", () => {
    const packageManagers = ["npm", "pnpm", "bun"] as const;

    for (const pm of packageManagers) {
      it(`should work with ${pm} package manager`, async () => {
        const result = await runTRPCTest({
          projectName: `docker-${pm}-test`,
          webDeploy: "docker",
          serverDeploy: "docker",
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

  describe("Docker with Turborepo", () => {
    it("should work with Turborepo monorepo", async () => {
      const result = await runTRPCTest({
        projectName: "docker-turborepo",
        webDeploy: "docker",
        serverDeploy: "docker",
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
    it("should work with Docker web + no server deploy", async () => {
      const result = await runTRPCTest({
        projectName: "docker-web-only",
        webDeploy: "docker",
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

    it("should work with no web deploy + Docker server", async () => {
      const result = await runTRPCTest({
        projectName: "docker-server-only",
        webDeploy: "none",
        serverDeploy: "docker",
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
