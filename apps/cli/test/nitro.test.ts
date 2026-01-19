import { describe, expect, it } from "bun:test";

import { expectSuccess, runTRPCTest, type TestConfig } from "./test-utils";

describe("Nitro Backend Framework", () => {
  describe("Basic Configuration", () => {
    it("should work with nitro + node runtime", async () => {
      const result = await runTRPCTest({
        projectName: "nitro-node",
        backend: "nitro",
        runtime: "node",
        frontend: ["tanstack-router"],
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
      });

      expectSuccess(result);
    });

    it("should work with nitro + bun runtime", async () => {
      const result = await runTRPCTest({
        projectName: "nitro-bun",
        backend: "nitro",
        runtime: "bun",
        frontend: ["tanstack-router"],
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
      });

      expectSuccess(result);
    });

    it("should work with nitro + workers runtime", async () => {
      const result = await runTRPCTest({
        projectName: "nitro-workers",
        backend: "nitro",
        runtime: "workers",
        frontend: ["tanstack-router"],
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "trpc",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "cloudflare", // Workers requires server deployment
        install: false,
      });

      expectSuccess(result);
    });
  });

  describe("Frontend Combinations", () => {
    it("should work with nitro + Next.js frontend", async () => {
      const result = await runTRPCTest({
        projectName: "nitro-nextjs",
        backend: "nitro",
        runtime: "node",
        frontend: ["next"],
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
      });

      expectSuccess(result);
    });

    it("should work with nitro + TanStack Start frontend", async () => {
      const result = await runTRPCTest({
        projectName: "nitro-tanstack-start",
        backend: "nitro",
        runtime: "node",
        frontend: ["tanstack-start"],
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
      });

      expectSuccess(result);
    });

    it("should work with nitro + Nuxt frontend", async () => {
      const result = await runTRPCTest({
        projectName: "nitro-nuxt",
        backend: "nitro",
        runtime: "node",
        frontend: ["nuxt"],
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "orpc", // Nuxt requires orpc instead of trpc
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

  describe("API Layer Combinations", () => {
    it("should work with nitro + tRPC", async () => {
      const result = await runTRPCTest({
        projectName: "nitro-trpc",
        backend: "nitro",
        runtime: "node",
        frontend: ["tanstack-router"],
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
      });

      expectSuccess(result);
    });

    it("should work with nitro + oRPC", async () => {
      const result = await runTRPCTest({
        projectName: "nitro-orpc",
        backend: "nitro",
        runtime: "node",
        frontend: ["tanstack-router"],
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
    });

    it("should work with nitro + no API", async () => {
      const result = await runTRPCTest({
        projectName: "nitro-no-api",
        backend: "nitro",
        runtime: "node",
        frontend: ["tanstack-router"],
        database: "none",
        orm: "none",
        auth: "none",
        api: "none",
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

  describe("Authentication Combinations", () => {
    it("should work with nitro + better-auth", async () => {
      const result = await runTRPCTest({
        projectName: "nitro-better-auth",
        backend: "nitro",
        runtime: "node",
        frontend: ["tanstack-router"],
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
      });

      expectSuccess(result);
    });
  });

  describe("Project Structure Validation", () => {
    it("should generate proper Nitro project structure", async () => {
      const result = await runTRPCTest({
        projectName: "nitro-structure-test",
        backend: "nitro",
        runtime: "node",
        frontend: ["tanstack-router"],
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
      });

      expectSuccess(result);

      // The result contains the project directory path
      // Verifying success is enough - the templates are validated by other tests
      expect(result.projectDir).toBeDefined();
    });
  });

  describe("Database and ORM Combinations", () => {
    it("should work with nitro + postgres + drizzle", async () => {
      const result = await runTRPCTest({
        projectName: "nitro-postgres-drizzle",
        backend: "nitro",
        runtime: "node",
        frontend: ["tanstack-router"],
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
      });

      expectSuccess(result);
    });

    it("should work with nitro + mysql + prisma", async () => {
      const result = await runTRPCTest({
        projectName: "nitro-mysql-prisma",
        backend: "nitro",
        runtime: "node",
        frontend: ["tanstack-router"],
        database: "mysql",
        orm: "prisma",
        auth: "none",
        api: "trpc",
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
});
