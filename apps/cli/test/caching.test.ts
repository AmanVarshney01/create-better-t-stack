import { describe, test } from "bun:test";

import { createCustomConfig, expectSuccess, runTRPCTest } from "./test-utils";

describe("Caching Options", () => {
  describe("Upstash Redis with different backends", () => {
    test("upstash-redis with Hono backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "upstash-redis-hono",
          frontend: ["tanstack-router"],
          backend: "hono",
          caching: "upstash-redis",
        }),
      );
      expectSuccess(result);
    });

    test("upstash-redis with Express backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "upstash-redis-express",
          frontend: ["tanstack-router"],
          backend: "express",
          runtime: "node",
          caching: "upstash-redis",
        }),
      );
      expectSuccess(result);
    });

    test("upstash-redis with Fastify backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "upstash-redis-fastify",
          frontend: ["tanstack-router"],
          backend: "fastify",
          runtime: "node",
          caching: "upstash-redis",
        }),
      );
      expectSuccess(result);
    });

    test("upstash-redis with Elysia backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "upstash-redis-elysia",
          frontend: ["tanstack-router"],
          backend: "elysia",
          runtime: "bun",
          caching: "upstash-redis",
        }),
      );
      expectSuccess(result);
    });

    test("upstash-redis with NestJS backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "upstash-redis-nestjs",
          frontend: ["tanstack-router"],
          backend: "nestjs",
          runtime: "node",
          caching: "upstash-redis",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("Upstash Redis with fullstack frameworks", () => {
    test("upstash-redis with Next.js fullstack", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "upstash-redis-nextjs",
          frontend: ["next"],
          backend: "self",
          runtime: "none",
          caching: "upstash-redis",
        }),
      );
      expectSuccess(result);
    });

    test("upstash-redis with TanStack Start", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "upstash-redis-tanstack-start",
          frontend: ["tanstack-start"],
          backend: "self",
          runtime: "none",
          caching: "upstash-redis",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("Upstash Redis with different frontends", () => {
    test("upstash-redis with TanStack Router", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "upstash-redis-tanstack-router",
          frontend: ["tanstack-router"],
          caching: "upstash-redis",
        }),
      );
      expectSuccess(result);
    });

    test("upstash-redis with React Router", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "upstash-redis-react-router",
          frontend: ["react-router"],
          caching: "upstash-redis",
        }),
      );
      expectSuccess(result);
    });

    test("upstash-redis with Svelte", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "upstash-redis-svelte",
          frontend: ["svelte"],
          uiLibrary: "daisyui",
          api: "orpc",
          caching: "upstash-redis",
        }),
      );
      expectSuccess(result);
    });

    test("upstash-redis with Solid", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "upstash-redis-solid",
          frontend: ["solid"],
          uiLibrary: "daisyui",
          api: "orpc",
          caching: "upstash-redis",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("Upstash Redis with database setups", () => {
    test("upstash-redis with PostgreSQL and Drizzle", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "upstash-redis-postgres-drizzle",
          frontend: ["tanstack-router"],
          database: "postgres",
          orm: "drizzle",
          caching: "upstash-redis",
        }),
      );
      expectSuccess(result);
    });

    test("upstash-redis with SQLite and Prisma", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "upstash-redis-sqlite-prisma",
          frontend: ["tanstack-router"],
          database: "sqlite",
          orm: "prisma",
          caching: "upstash-redis",
        }),
      );
      expectSuccess(result);
    });

    test("upstash-redis with MySQL and TypeORM", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "upstash-redis-mysql-typeorm",
          frontend: ["tanstack-router"],
          database: "mysql",
          orm: "typeorm",
          runtime: "node",
          caching: "upstash-redis",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("Upstash Redis with authentication", () => {
    test("upstash-redis with Better Auth", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "upstash-redis-better-auth",
          frontend: ["tanstack-router"],
          auth: "better-auth",
          caching: "upstash-redis",
        }),
      );
      expectSuccess(result);
    });

    test("upstash-redis with Auth.js", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "upstash-redis-authjs",
          frontend: ["next"],
          backend: "self",
          runtime: "none",
          auth: "authjs",
          caching: "upstash-redis",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("No caching option", () => {
    test("none caching option", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "no-caching",
          frontend: ["tanstack-router"],
          caching: "none",
        }),
      );
      expectSuccess(result);
    });
  });
});
