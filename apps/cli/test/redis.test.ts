import { describe, it } from "bun:test";

import { expectError, expectSuccess, runTRPCTest } from "./test-utils";

describe("Redis Database", () => {
  describe("Basic Redis Configuration", () => {
    it("should work with Redis database and no ORM", async () => {
      const result = await runTRPCTest({
        projectName: "redis-basic",
        database: "redis",
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

    it("should work with Redis and Node.js runtime", async () => {
      const result = await runTRPCTest({
        projectName: "redis-node",
        database: "redis",
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

  describe("Redis ORM Validation", () => {
    it("should fail with Redis and Drizzle ORM", async () => {
      const result = await runTRPCTest({
        projectName: "redis-drizzle-invalid",
        database: "redis",
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

      expectError(result, "Redis is a key-value store and does not require an ORM");
    });

    it("should fail with Redis and Prisma ORM", async () => {
      const result = await runTRPCTest({
        projectName: "redis-prisma-invalid",
        database: "redis",
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

      expectError(result, "Redis is a key-value store and does not require an ORM");
    });
  });

  describe("Redis with Different Backends", () => {
    it("should work with Redis and Fastify", async () => {
      const result = await runTRPCTest({
        projectName: "redis-fastify",
        database: "redis",
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

    it("should work with Redis and Elysia", async () => {
      const result = await runTRPCTest({
        projectName: "redis-elysia",
        database: "redis",
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

  describe("Redis with Different Frontends", () => {
    it("should work with Redis and Next.js", async () => {
      const result = await runTRPCTest({
        projectName: "redis-nextjs",
        database: "redis",
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

    it("should work with Redis and React Router", async () => {
      const result = await runTRPCTest({
        projectName: "redis-react-router",
        database: "redis",
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

  describe("Redis with Docker Setup", () => {
    it("should work with Redis and Docker setup", async () => {
      const result = await runTRPCTest({
        projectName: "redis-docker",
        database: "redis",
        orm: "none",
        backend: "hono",
        runtime: "bun",
        frontend: ["tanstack-router"],
        auth: "none",
        api: "trpc",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "docker",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });
  });
});
