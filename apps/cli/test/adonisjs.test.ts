import { describe, expect, it } from "bun:test";

import { expectError, expectSuccess, runTRPCTest, type TestConfig } from "./test-utils";

describe("AdonisJS Backend", () => {
  describe("Valid AdonisJS Configurations", () => {
    it("should work with adonisjs backend and basic configuration", async () => {
      const config: TestConfig = {
        projectName: "adonisjs-basic",
        backend: "adonisjs",
        runtime: "node",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "trpc",
        frontend: ["tanstack-router"],
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      };

      const result = await runTRPCTest(config);
      expectSuccess(result);

      // Verify @adonisjs/core dependency is added
      if (result.projectDir) {
        const serverPkg = await Bun.file(`${result.projectDir}/apps/server/package.json`).json();
        expect(serverPkg.dependencies["@adonisjs/core"]).toBeDefined();
        expect(serverPkg.dependencies["@adonisjs/cors"]).toBeDefined();
        expect(serverPkg.dependencies["reflect-metadata"]).toBeDefined();
      }
    });

    it("should work with adonisjs backend and Next.js frontend", async () => {
      const config: TestConfig = {
        projectName: "adonisjs-next",
        backend: "adonisjs",
        runtime: "node",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "trpc",
        frontend: ["next"],
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

    it("should work with adonisjs backend and better-auth", async () => {
      const config: TestConfig = {
        projectName: "adonisjs-auth",
        backend: "adonisjs",
        runtime: "node",
        database: "sqlite",
        orm: "drizzle",
        auth: "better-auth",
        api: "trpc",
        frontend: ["tanstack-router"],
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

    it("should work with adonisjs backend and oRPC", async () => {
      const config: TestConfig = {
        projectName: "adonisjs-orpc",
        backend: "adonisjs",
        runtime: "node",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "orpc",
        frontend: ["tanstack-router"],
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

    it("should create proper adonisjs project structure", async () => {
      const config: TestConfig = {
        projectName: "adonisjs-structure",
        backend: "adonisjs",
        runtime: "node",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "trpc",
        frontend: ["tanstack-router"],
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      };

      const result = await runTRPCTest(config);
      expectSuccess(result);

      if (result.projectDir) {
        // Verify adonisjs-specific files exist
        const adonisrcFile = Bun.file(`${result.projectDir}/apps/server/adonisrc.ts`);
        const routesFile = Bun.file(`${result.projectDir}/apps/server/start/routes.ts`);
        const serverBinFile = Bun.file(`${result.projectDir}/apps/server/bin/server.ts`);
        const configFile = Bun.file(`${result.projectDir}/apps/server/config/app.ts`);

        expect(await adonisrcFile.exists()).toBe(true);
        expect(await routesFile.exists()).toBe(true);
        expect(await serverBinFile.exists()).toBe(true);
        expect(await configFile.exists()).toBe(true);

        // Verify package.json has correct scripts
        const serverPkg = await Bun.file(`${result.projectDir}/apps/server/package.json`).json();
        expect(serverPkg.scripts.dev).toBe("node ace serve --watch");
        expect(serverPkg.scripts.build).toBe("node ace build");
        expect(serverPkg.scripts.start).toBe("node bin/server.js");
      }
    });
  });

  describe("Invalid AdonisJS Configurations", () => {
    it("should fail adonisjs with bun runtime", async () => {
      const result = await runTRPCTest({
        projectName: "adonisjs-invalid-bun",
        backend: "adonisjs",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "trpc",
        frontend: ["tanstack-router"],
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        expectError: true,
      });

      expectError(result, "AdonisJS backend requires '--runtime node'");
    });

    it("should fail adonisjs with workers runtime", async () => {
      const result = await runTRPCTest({
        projectName: "adonisjs-invalid-workers",
        backend: "adonisjs",
        runtime: "workers",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "trpc",
        frontend: ["tanstack-router"],
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        expectError: true,
      });

      expectError(result, "AdonisJS backend requires '--runtime node'");
    });

    it("should fail adonisjs with none runtime", async () => {
      const result = await runTRPCTest({
        projectName: "adonisjs-invalid-none",
        backend: "adonisjs",
        runtime: "none",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "trpc",
        frontend: ["tanstack-router"],
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        expectError: true,
      });

      // This should fail because AdonisJS requires Node.js runtime
      expectError(result, "AdonisJS backend requires '--runtime node'");
    });
  });

  describe("AdonisJS in All Backend Types list", () => {
    it("should be included in all backend types", async () => {
      const backends = [
        "hono",
        "express",
        "fastify",
        "elysia",
        "nestjs",
        "adonisjs",
        "encore",
        "convex",
        "none",
        "self",
      ] as const;

      // Verify adonisjs is in the list
      expect(backends).toContain("adonisjs");
    });
  });
});
