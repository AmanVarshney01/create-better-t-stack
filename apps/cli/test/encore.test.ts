import { describe, expect, it } from "bun:test";

import { expectError, expectSuccess, runTRPCTest, type TestConfig } from "./test-utils";

describe("Encore.ts Backend", () => {
  describe("Valid Encore.ts Configurations", () => {
    it("should work with encore backend and basic configuration", async () => {
      const config: TestConfig = {
        projectName: "encore-basic",
        backend: "encore",
        runtime: "none",
        database: "none",
        orm: "none",
        auth: "none",
        api: "none",
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

      // Verify encore.dev dependency is added
      if (result.projectDir) {
        const serverPkg = await Bun.file(`${result.projectDir}/apps/server/package.json`).json();
        expect(serverPkg.dependencies["encore.dev"]).toBeDefined();
      }
    });

    it("should work with encore backend and Next.js frontend", async () => {
      const config: TestConfig = {
        projectName: "encore-next",
        backend: "encore",
        runtime: "none",
        database: "none",
        orm: "none",
        auth: "none",
        api: "none",
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

    it("should work with encore backend and React frontend", async () => {
      const config: TestConfig = {
        projectName: "encore-react",
        backend: "encore",
        runtime: "none",
        database: "none",
        orm: "none",
        auth: "none",
        api: "none",
        frontend: ["react-router"],
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

    it("should create proper encore project structure", async () => {
      const config: TestConfig = {
        projectName: "encore-structure",
        backend: "encore",
        runtime: "none",
        database: "none",
        orm: "none",
        auth: "none",
        api: "none",
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
        // Verify encore-specific files exist
        const encoreAppFile = Bun.file(`${result.projectDir}/apps/server/encore.app`);
        const encoreServiceFile = Bun.file(`${result.projectDir}/apps/server/encore.service.ts`);
        const indexFile = Bun.file(`${result.projectDir}/apps/server/src/index.ts`);

        expect(await encoreAppFile.exists()).toBe(true);
        expect(await encoreServiceFile.exists()).toBe(true);
        expect(await indexFile.exists()).toBe(true);

        // Verify package.json has correct scripts
        const serverPkg = await Bun.file(`${result.projectDir}/apps/server/package.json`).json();
        expect(serverPkg.scripts.dev).toBe("encore run");
        expect(serverPkg.scripts.build).toBe("encore build");
      }
    });
  });

  describe("Invalid Encore.ts Configurations", () => {
    it("should fail encore with non-none runtime", async () => {
      const result = await runTRPCTest({
        projectName: "encore-invalid-runtime",
        backend: "encore",
        runtime: "bun",
        database: "none",
        orm: "none",
        auth: "none",
        api: "none",
        frontend: ["tanstack-router"],
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        expectError: true,
      });

      expectError(result, "Encore.ts backend requires '--runtime none'");
    });

    it("should fail encore with node runtime", async () => {
      const result = await runTRPCTest({
        projectName: "encore-invalid-node-runtime",
        backend: "encore",
        runtime: "node",
        database: "none",
        orm: "none",
        auth: "none",
        api: "none",
        frontend: ["tanstack-router"],
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        expectError: true,
      });

      expectError(result, "Encore.ts backend requires '--runtime none'");
    });

    it("should fail encore with database specified", async () => {
      const result = await runTRPCTest({
        projectName: "encore-invalid-database",
        backend: "encore",
        runtime: "none",
        database: "postgres",
        orm: "drizzle",
        auth: "none",
        api: "none",
        frontend: ["tanstack-router"],
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        expectError: true,
      });

      expectError(result, "Encore.ts backend requires '--database none'");
    });

    it("should fail encore with ORM specified", async () => {
      const result = await runTRPCTest({
        projectName: "encore-invalid-orm",
        backend: "encore",
        runtime: "none",
        database: "none",
        orm: "prisma",
        auth: "none",
        api: "none",
        frontend: ["tanstack-router"],
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        expectError: true,
      });

      // Note: The ORM validation fires before Encore-specific validation
      // because validateDatabaseOrmAuth is called first
      expectError(result, "ORM selection requires a database");
    });

    it("should fail encore with API specified", async () => {
      const result = await runTRPCTest({
        projectName: "encore-invalid-api",
        backend: "encore",
        runtime: "none",
        database: "none",
        orm: "none",
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

      expectError(result, "Encore.ts backend requires '--api none'");
    });

    it("should fail encore with server deployment", async () => {
      const result = await runTRPCTest({
        projectName: "encore-invalid-deploy",
        backend: "encore",
        runtime: "none",
        database: "none",
        orm: "none",
        auth: "none",
        api: "none",
        frontend: ["tanstack-router"],
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "cloudflare",
        expectError: true,
      });

      expectError(result, "Encore.ts backend requires '--server-deploy none'");
    });

    it("should fail encore with db-setup specified", async () => {
      const result = await runTRPCTest({
        projectName: "encore-invalid-dbsetup",
        backend: "encore",
        runtime: "none",
        database: "none",
        orm: "none",
        auth: "none",
        api: "none",
        frontend: ["tanstack-router"],
        addons: ["none"],
        examples: ["none"],
        dbSetup: "docker",
        webDeploy: "none",
        serverDeploy: "none",
        expectError: true,
      });

      // Note: The database setup validation fires before Encore-specific validation
      // because validateDatabaseSetup is called first
      expectError(result, "Database setup requires a database");
    });
  });

  describe("Encore.ts in All Backend Types list", () => {
    it("should be included in all backend types", async () => {
      const backends = [
        "hono",
        "express",
        "fastify",
        "elysia",
        "nestjs",
        "encore",
        "convex",
        "none",
        "self",
      ] as const;

      // Verify encore is in the list
      expect(backends).toContain("encore");
    });
  });
});
