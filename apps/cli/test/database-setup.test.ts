import { describe, expect, it } from "bun:test";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { expectError, expectSuccess, runCreateTest } from "./test-utils";

describe("Database Setup Configurations", () => {
  describe("SQLite Database Setups", () => {
    it("should work with Turso + SQLite", async () => {
      const result = await runCreateTest({
        projectName: "turso-sqlite",
        dbSetup: "turso",
        manualDb: true,
      });

      expectSuccess(result);
    });

    it("should work with D1 + SQLite + Workers", async () => {
      const result = await runCreateTest({
        projectName: "d1-sqlite-workers",
        dbSetup: "d1",
        runtime: "workers",
        serverDeploy: "cloudflare",
        manualDb: true,
      });

      expectSuccess(result);
    });

    it("should configure a package-local Prisma tooling database for D1", async () => {
      const result = await runCreateTest({
        projectName: "d1-prisma-tooling-db",
        orm: "prisma",
        dbSetup: "d1",
        backend: "self",
        runtime: "none",
        frontend: ["next"],
        webDeploy: "cloudflare",
      });

      expectSuccess(result);
      const envFile = await readFile(join(result.projectDir!, "apps/web/.env"), "utf8");
      expect(envFile).toContain("DATABASE_URL=file:./local.db");
      expect(envFile).not.toContain(`DATABASE_URL=file:${result.projectDir}`);
      expect(await readFile(join(result.projectDir!, "packages/db/local.db"), "utf8")).toBe("");
    });

    it("should fail with Turso + non-SQLite database", async () => {
      const result = await runCreateTest({
        projectName: "turso-postgres-fail",
        database: "postgres",
        dbSetup: "turso",
        manualDb: true,
      });

      expectError(result, "Turso setup requires SQLite database");
    });
  });

  describe("PostgreSQL Database Setups", () => {
    it("should work with Neon + PostgreSQL", async () => {
      const result = await runCreateTest({
        projectName: "neon-postgres",
        database: "postgres",
        dbSetup: "neon",
        manualDb: true,
      });

      expectSuccess(result);
    });

    it("should work with Supabase + PostgreSQL", async () => {
      const result = await runCreateTest({
        projectName: "supabase-postgres",
        database: "postgres",
        dbSetup: "supabase",
        manualDb: true,
      });

      expectSuccess(result);
    });

    it("should work with Prisma PostgreSQL setup", async () => {
      const result = await runCreateTest({
        projectName: "prisma-postgres-setup",
        database: "postgres",
        orm: "prisma",
        dbSetup: "prisma-postgres",
        manualDb: true,
      });

      expectSuccess(result);
    });

    it("should fail with Neon + non-PostgreSQL database", async () => {
      const result = await runCreateTest({
        projectName: "neon-mysql-fail",
        database: "mysql",
        dbSetup: "neon",
        manualDb: true,
      });

      expectError(result, "Neon setup requires PostgreSQL database");
    });
  });

  describe("MySQL Database Setups", () => {
    it("should work with PlanetScale + MySQL", async () => {
      const result = await runCreateTest({
        projectName: "planetscale-mysql",
        database: "mysql",
        dbSetup: "planetscale",
        manualDb: true,
      });

      expectSuccess(result);
    });

    it("should work with PlanetScale + PostgreSQL", async () => {
      const result = await runCreateTest({
        projectName: "planetscale-postgres",
        database: "postgres",
        dbSetup: "planetscale",
        manualDb: true,
      });

      expectSuccess(result);
    });
  });

  describe("MongoDB Database Setups", () => {
    it("should work with MongoDB Atlas + MongoDB", async () => {
      const result = await runCreateTest({
        projectName: "mongodb-atlas",
        database: "mongodb",
        orm: "mongoose",
        dbSetup: "mongodb-atlas",
        manualDb: true,
      });

      expectSuccess(result);
    });

    it("should fail with MongoDB Atlas + non-MongoDB database", async () => {
      const result = await runCreateTest({
        projectName: "mongodb-atlas-sqlite-fail",
        dbSetup: "mongodb-atlas",
        manualDb: true,
      });

      expectError(result, "MongoDB Atlas setup requires MongoDB database");
    });
  });

  describe("Docker Database Setup", () => {
    it("should work with Docker + PostgreSQL", async () => {
      const result = await runCreateTest({
        projectName: "docker-postgres",
        database: "postgres",
        dbSetup: "docker",
        manualDb: true,
      });

      expectSuccess(result);
    });

    it("should work with Docker + MySQL", async () => {
      const result = await runCreateTest({
        projectName: "docker-mysql",
        database: "mysql",
        dbSetup: "docker",
        manualDb: true,
      });

      expectSuccess(result);
    });

    it("should work with Docker + MongoDB", async () => {
      const result = await runCreateTest({
        projectName: "docker-mongodb",
        database: "mongodb",
        orm: "mongoose",
        dbSetup: "docker",
        manualDb: true,
      });

      expectSuccess(result);
    });

    it("should fail with Docker + SQLite", async () => {
      const result = await runCreateTest({
        projectName: "docker-sqlite-fail",
        dbSetup: "docker",
        manualDb: true,
      });

      expectError(result, "Docker setup is not compatible with SQLite database");
    });
  });

  describe("No Database Setup", () => {
    it("should work with dbSetup none", async () => {
      const result = await runCreateTest({
        projectName: "no-db-setup",
      });

      expectSuccess(result);
    });

    it("should fail with dbSetup but no database", async () => {
      const result = await runCreateTest({
        projectName: "db-setup-no-db-fail",
        database: "none",
        orm: "none",
        dbSetup: "turso",
      });

      expectError(
        result,
        "Database setup requires a database. Please choose a database or set '--db-setup none'.",
      );
    });
  });

  describe("Special Runtime Constraints", () => {
    it("should work with D1 + self backend + Cloudflare web deploy", async () => {
      const result = await runCreateTest({
        projectName: "d1-self-cloudflare-valid",
        dbSetup: "d1",
        backend: "self",
        runtime: "none",
        frontend: ["next"],
        webDeploy: "cloudflare",
      });

      expectSuccess(result);
    });

    it("should fail with D1 + non-Workers runtime", async () => {
      const result = await runCreateTest({
        projectName: "d1-node-fail",
        dbSetup: "d1",
        runtime: "node",
      });

      expectError(
        result,
        "Cloudflare D1 setup requires SQLite database and either Cloudflare Workers runtime with server deployment or backend 'self' with Cloudflare web deployment.",
      );
    });

    it("should fail with D1 + self backend without Cloudflare web deploy", async () => {
      const result = await runCreateTest({
        projectName: "d1-self-no-cloudflare-fail",
        dbSetup: "d1",
        backend: "self",
        runtime: "none",
        frontend: ["next"],
      });

      expectError(
        result,
        "Cloudflare D1 setup requires SQLite database and either Cloudflare Workers runtime with server deployment or backend 'self' with Cloudflare web deployment.",
      );
    });
  });
});
