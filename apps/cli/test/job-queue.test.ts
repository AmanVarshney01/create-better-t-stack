import { describe, test } from "bun:test";

import { createCustomConfig, expectSuccess, runTRPCTest } from "./test-utils";

describe("Job Queue Options", () => {
  describe("Trigger.dev with different backends", () => {
    test("trigger-dev with Hono backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "trigger-dev-hono",
          frontend: ["tanstack-router"],
          backend: "hono",
          jobQueue: "trigger-dev",
        }),
      );
      expectSuccess(result);
    });

    test("trigger-dev with Express backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "trigger-dev-express",
          frontend: ["tanstack-router"],
          backend: "express",
          runtime: "node",
          jobQueue: "trigger-dev",
        }),
      );
      expectSuccess(result);
    });

    test("trigger-dev with Fastify backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "trigger-dev-fastify",
          frontend: ["tanstack-router"],
          backend: "fastify",
          runtime: "node",
          jobQueue: "trigger-dev",
        }),
      );
      expectSuccess(result);
    });

    test("trigger-dev with Elysia backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "trigger-dev-elysia",
          frontend: ["tanstack-router"],
          backend: "elysia",
          runtime: "bun",
          jobQueue: "trigger-dev",
        }),
      );
      expectSuccess(result);
    });

    test("trigger-dev with NestJS backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "trigger-dev-nestjs",
          frontend: ["tanstack-router"],
          backend: "nestjs",
          runtime: "node",
          jobQueue: "trigger-dev",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("Trigger.dev with fullstack frameworks", () => {
    test("trigger-dev with Next.js fullstack", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "trigger-dev-nextjs",
          frontend: ["next"],
          backend: "self",
          runtime: "none",
          jobQueue: "trigger-dev",
        }),
      );
      expectSuccess(result);
    });

    test("trigger-dev with TanStack Start", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "trigger-dev-tanstack-start",
          frontend: ["tanstack-start"],
          backend: "self",
          runtime: "none",
          jobQueue: "trigger-dev",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("Trigger.dev with different frontends", () => {
    test("trigger-dev with TanStack Router", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "trigger-dev-tanstack-router",
          frontend: ["tanstack-router"],
          jobQueue: "trigger-dev",
        }),
      );
      expectSuccess(result);
    });

    test("trigger-dev with React Router", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "trigger-dev-react-router",
          frontend: ["react-router"],
          jobQueue: "trigger-dev",
        }),
      );
      expectSuccess(result);
    });

    test("trigger-dev with Svelte", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "trigger-dev-svelte",
          frontend: ["svelte"],
          uiLibrary: "daisyui",
          api: "orpc",
          jobQueue: "trigger-dev",
        }),
      );
      expectSuccess(result);
    });

    test("trigger-dev with Solid", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "trigger-dev-solid",
          frontend: ["solid"],
          uiLibrary: "daisyui",
          api: "orpc",
          jobQueue: "trigger-dev",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("Trigger.dev with database setups", () => {
    test("trigger-dev with PostgreSQL and Drizzle", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "trigger-dev-postgres-drizzle",
          frontend: ["tanstack-router"],
          database: "postgres",
          orm: "drizzle",
          jobQueue: "trigger-dev",
        }),
      );
      expectSuccess(result);
    });

    test("trigger-dev with SQLite and Prisma", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "trigger-dev-sqlite-prisma",
          frontend: ["tanstack-router"],
          database: "sqlite",
          orm: "prisma",
          jobQueue: "trigger-dev",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("BullMQ with different backends", () => {
    test("bullmq with Hono backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "bullmq-hono",
          frontend: ["tanstack-router"],
          backend: "hono",
          jobQueue: "bullmq",
        }),
      );
      expectSuccess(result);
    });

    test("bullmq with Express backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "bullmq-express",
          frontend: ["tanstack-router"],
          backend: "express",
          runtime: "node",
          jobQueue: "bullmq",
        }),
      );
      expectSuccess(result);
    });

    test("bullmq with Fastify backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "bullmq-fastify",
          frontend: ["tanstack-router"],
          backend: "fastify",
          runtime: "node",
          jobQueue: "bullmq",
        }),
      );
      expectSuccess(result);
    });

    test("bullmq with Elysia backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "bullmq-elysia",
          frontend: ["tanstack-router"],
          backend: "elysia",
          runtime: "bun",
          jobQueue: "bullmq",
        }),
      );
      expectSuccess(result);
    });

    test("bullmq with NestJS backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "bullmq-nestjs",
          frontend: ["tanstack-router"],
          backend: "nestjs",
          runtime: "node",
          jobQueue: "bullmq",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("BullMQ with fullstack frameworks", () => {
    test("bullmq with Next.js fullstack", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "bullmq-nextjs",
          frontend: ["next"],
          backend: "self",
          runtime: "none",
          jobQueue: "bullmq",
        }),
      );
      expectSuccess(result);
    });

    test("bullmq with TanStack Start", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "bullmq-tanstack-start",
          frontend: ["tanstack-start"],
          backend: "self",
          runtime: "none",
          jobQueue: "bullmq",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("BullMQ with different frontends", () => {
    test("bullmq with TanStack Router", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "bullmq-tanstack-router",
          frontend: ["tanstack-router"],
          jobQueue: "bullmq",
        }),
      );
      expectSuccess(result);
    });

    test("bullmq with React Router", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "bullmq-react-router",
          frontend: ["react-router"],
          jobQueue: "bullmq",
        }),
      );
      expectSuccess(result);
    });

    test("bullmq with Svelte", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "bullmq-svelte",
          frontend: ["svelte"],
          uiLibrary: "daisyui",
          api: "orpc",
          jobQueue: "bullmq",
        }),
      );
      expectSuccess(result);
    });

    test("bullmq with Solid", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "bullmq-solid",
          frontend: ["solid"],
          uiLibrary: "daisyui",
          api: "orpc",
          jobQueue: "bullmq",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("BullMQ with database setups", () => {
    test("bullmq with PostgreSQL and Drizzle", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "bullmq-postgres-drizzle",
          frontend: ["tanstack-router"],
          database: "postgres",
          orm: "drizzle",
          jobQueue: "bullmq",
        }),
      );
      expectSuccess(result);
    });

    test("bullmq with SQLite and Prisma", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "bullmq-sqlite-prisma",
          frontend: ["tanstack-router"],
          database: "sqlite",
          orm: "prisma",
          jobQueue: "bullmq",
        }),
      );
      expectSuccess(result);
    });

    test("bullmq with MySQL and TypeORM", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "bullmq-mysql-typeorm",
          frontend: ["tanstack-router"],
          database: "mysql",
          orm: "typeorm",
          runtime: "node",
          jobQueue: "bullmq",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("Inngest with different backends", () => {
    test("inngest with Hono backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "inngest-hono",
          frontend: ["tanstack-router"],
          backend: "hono",
          jobQueue: "inngest",
        }),
      );
      expectSuccess(result);
    });

    test("inngest with Express backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "inngest-express",
          frontend: ["tanstack-router"],
          backend: "express",
          runtime: "node",
          jobQueue: "inngest",
        }),
      );
      expectSuccess(result);
    });

    test("inngest with Fastify backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "inngest-fastify",
          frontend: ["tanstack-router"],
          backend: "fastify",
          runtime: "node",
          jobQueue: "inngest",
        }),
      );
      expectSuccess(result);
    });

    test("inngest with Elysia backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "inngest-elysia",
          frontend: ["tanstack-router"],
          backend: "elysia",
          runtime: "bun",
          jobQueue: "inngest",
        }),
      );
      expectSuccess(result);
    });

    test("inngest with NestJS backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "inngest-nestjs",
          frontend: ["tanstack-router"],
          backend: "nestjs",
          runtime: "node",
          jobQueue: "inngest",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("Inngest with fullstack frameworks", () => {
    test("inngest with Next.js fullstack", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "inngest-nextjs",
          frontend: ["next"],
          backend: "self",
          runtime: "none",
          jobQueue: "inngest",
        }),
      );
      expectSuccess(result);
    });

    test("inngest with TanStack Start", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "inngest-tanstack-start",
          frontend: ["tanstack-start"],
          backend: "self",
          runtime: "none",
          jobQueue: "inngest",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("Inngest with different frontends", () => {
    test("inngest with TanStack Router", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "inngest-tanstack-router",
          frontend: ["tanstack-router"],
          jobQueue: "inngest",
        }),
      );
      expectSuccess(result);
    });

    test("inngest with React Router", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "inngest-react-router",
          frontend: ["react-router"],
          jobQueue: "inngest",
        }),
      );
      expectSuccess(result);
    });

    test("inngest with Svelte", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "inngest-svelte",
          frontend: ["svelte"],
          uiLibrary: "daisyui",
          api: "orpc",
          jobQueue: "inngest",
        }),
      );
      expectSuccess(result);
    });

    test("inngest with Solid", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "inngest-solid",
          frontend: ["solid"],
          uiLibrary: "daisyui",
          api: "orpc",
          jobQueue: "inngest",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("Inngest with database setups", () => {
    test("inngest with PostgreSQL and Drizzle", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "inngest-postgres-drizzle",
          frontend: ["tanstack-router"],
          database: "postgres",
          orm: "drizzle",
          jobQueue: "inngest",
        }),
      );
      expectSuccess(result);
    });

    test("inngest with SQLite and Prisma", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "inngest-sqlite-prisma",
          frontend: ["tanstack-router"],
          database: "sqlite",
          orm: "prisma",
          jobQueue: "inngest",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("Temporal with different backends", () => {
    test("temporal with Hono backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "temporal-hono",
          frontend: ["tanstack-router"],
          backend: "hono",
          jobQueue: "temporal",
        }),
      );
      expectSuccess(result);
    });

    test("temporal with Express backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "temporal-express",
          frontend: ["tanstack-router"],
          backend: "express",
          runtime: "node",
          jobQueue: "temporal",
        }),
      );
      expectSuccess(result);
    });

    test("temporal with Fastify backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "temporal-fastify",
          frontend: ["tanstack-router"],
          backend: "fastify",
          runtime: "node",
          jobQueue: "temporal",
        }),
      );
      expectSuccess(result);
    });

    test("temporal with Elysia backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "temporal-elysia",
          frontend: ["tanstack-router"],
          backend: "elysia",
          runtime: "bun",
          jobQueue: "temporal",
        }),
      );
      expectSuccess(result);
    });

    test("temporal with NestJS backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "temporal-nestjs",
          frontend: ["tanstack-router"],
          backend: "nestjs",
          runtime: "node",
          jobQueue: "temporal",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("Temporal with fullstack frameworks", () => {
    test("temporal with Next.js fullstack", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "temporal-nextjs",
          frontend: ["next"],
          backend: "self",
          runtime: "none",
          jobQueue: "temporal",
        }),
      );
      expectSuccess(result);
    });

    test("temporal with TanStack Start", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "temporal-tanstack-start",
          frontend: ["tanstack-start"],
          backend: "self",
          runtime: "none",
          jobQueue: "temporal",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("Temporal with different frontends", () => {
    test("temporal with TanStack Router", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "temporal-tanstack-router",
          frontend: ["tanstack-router"],
          jobQueue: "temporal",
        }),
      );
      expectSuccess(result);
    });

    test("temporal with React Router", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "temporal-react-router",
          frontend: ["react-router"],
          jobQueue: "temporal",
        }),
      );
      expectSuccess(result);
    });

    test("temporal with Svelte", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "temporal-svelte",
          frontend: ["svelte"],
          uiLibrary: "daisyui",
          api: "orpc",
          jobQueue: "temporal",
        }),
      );
      expectSuccess(result);
    });

    test("temporal with Solid", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "temporal-solid",
          frontend: ["solid"],
          uiLibrary: "daisyui",
          api: "orpc",
          jobQueue: "temporal",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("Temporal with database setups", () => {
    test("temporal with PostgreSQL and Drizzle", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "temporal-postgres-drizzle",
          frontend: ["tanstack-router"],
          database: "postgres",
          orm: "drizzle",
          jobQueue: "temporal",
        }),
      );
      expectSuccess(result);
    });

    test("temporal with SQLite and Prisma", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "temporal-sqlite-prisma",
          frontend: ["tanstack-router"],
          database: "sqlite",
          orm: "prisma",
          jobQueue: "temporal",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("No job queue option", () => {
    test("none job queue option", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "no-job-queue",
          frontend: ["tanstack-router"],
          jobQueue: "none",
        }),
      );
      expectSuccess(result);
    });
  });
});
