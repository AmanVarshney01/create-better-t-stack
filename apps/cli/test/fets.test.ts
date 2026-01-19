import { describe, expect, it } from "bun:test";

import { expectSuccess, runTRPCTest } from "./test-utils";

describe("feTS Backend Framework", () => {
  describe("Basic Configuration", () => {
    it("should work with fets + node runtime", async () => {
      const result = await runTRPCTest({
        projectName: "fets-node",
        backend: "fets",
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

    it("should work with fets + bun runtime", async () => {
      const result = await runTRPCTest({
        projectName: "fets-bun",
        backend: "fets",
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

    it("should work with fets + workers runtime", async () => {
      const result = await runTRPCTest({
        projectName: "fets-workers",
        backend: "fets",
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
        serverDeploy: "cloudflare",
        install: false,
      });

      expectSuccess(result);
    });
  });

  describe("Frontend Combinations", () => {
    it("should work with fets + Next.js frontend", async () => {
      const result = await runTRPCTest({
        projectName: "fets-nextjs",
        backend: "fets",
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

    it("should work with fets + TanStack Start frontend", async () => {
      const result = await runTRPCTest({
        projectName: "fets-tanstack-start",
        backend: "fets",
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

    it("should work with fets + Nuxt frontend", async () => {
      const result = await runTRPCTest({
        projectName: "fets-nuxt",
        backend: "fets",
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
    it("should work with fets + tRPC", async () => {
      const result = await runTRPCTest({
        projectName: "fets-trpc",
        backend: "fets",
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

    it("should work with fets + oRPC", async () => {
      const result = await runTRPCTest({
        projectName: "fets-orpc",
        backend: "fets",
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

    it("should work with fets + no API", async () => {
      const result = await runTRPCTest({
        projectName: "fets-no-api",
        backend: "fets",
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
    it("should work with fets + better-auth", async () => {
      const result = await runTRPCTest({
        projectName: "fets-better-auth",
        backend: "fets",
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
    it("should generate proper feTS project structure", async () => {
      const result = await runTRPCTest({
        projectName: "fets-structure-test",
        backend: "fets",
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
      expect(result.projectDir).toBeDefined();
    });
  });

  describe("Database and ORM Combinations", () => {
    it("should work with fets + postgres + drizzle", async () => {
      const result = await runTRPCTest({
        projectName: "fets-postgres-drizzle",
        backend: "fets",
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

    it("should work with fets + mysql + prisma", async () => {
      const result = await runTRPCTest({
        projectName: "fets-mysql-prisma",
        backend: "fets",
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
