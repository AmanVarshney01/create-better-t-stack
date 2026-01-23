import { describe, it } from "bun:test";

import { expectError, expectSuccess, runTRPCTest } from "./test-utils";

describe("EdgeDB Database", () => {
  describe("Basic EdgeDB Configuration", () => {
    it("should work with EdgeDB database and no ORM", async () => {
      const result = await runTRPCTest({
        projectName: "edgedb-basic",
        database: "edgedb",
        orm: "none",
        backend: "hono",
        runtime: "bun",
        frontend: ["tanstack-router"],
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

    it("should work with EdgeDB and Node.js runtime", async () => {
      const result = await runTRPCTest({
        projectName: "edgedb-node",
        database: "edgedb",
        orm: "none",
        backend: "express",
        runtime: "node",
        frontend: ["tanstack-router"],
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

  describe("EdgeDB ORM Validation", () => {
    it("should fail with EdgeDB and Drizzle ORM", async () => {
      const result = await runTRPCTest({
        projectName: "edgedb-drizzle-invalid",
        database: "edgedb",
        orm: "drizzle",
        backend: "hono",
        runtime: "bun",
        frontend: ["tanstack-router"],
        auth: "none",
        api: "trpc",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        expectError: true,
      });

      expectError(result, "EdgeDB has its own built-in query builder and does not require an ORM");
    });

    it("should fail with EdgeDB and Prisma ORM", async () => {
      const result = await runTRPCTest({
        projectName: "edgedb-prisma-invalid",
        database: "edgedb",
        orm: "prisma",
        backend: "hono",
        runtime: "bun",
        frontend: ["tanstack-router"],
        auth: "none",
        api: "trpc",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        expectError: true,
      });

      expectError(result, "EdgeDB has its own built-in query builder and does not require an ORM");
    });
  });

  describe("EdgeDB with Different Backends", () => {
    it("should work with EdgeDB and Fastify", async () => {
      const result = await runTRPCTest({
        projectName: "edgedb-fastify",
        database: "edgedb",
        orm: "none",
        backend: "fastify",
        runtime: "node",
        frontend: ["tanstack-router"],
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

    it("should work with EdgeDB and Elysia", async () => {
      const result = await runTRPCTest({
        projectName: "edgedb-elysia",
        database: "edgedb",
        orm: "none",
        backend: "elysia",
        runtime: "bun",
        frontend: ["tanstack-router"],
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

  describe("EdgeDB with Different Frontends", () => {
    it("should work with EdgeDB and Next.js", async () => {
      const result = await runTRPCTest({
        projectName: "edgedb-nextjs",
        database: "edgedb",
        orm: "none",
        backend: "self",
        runtime: "none",
        frontend: ["next"],
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

    it("should work with EdgeDB and React Router", async () => {
      const result = await runTRPCTest({
        projectName: "edgedb-react-router",
        database: "edgedb",
        orm: "none",
        backend: "hono",
        runtime: "bun",
        frontend: ["react-router"],
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
