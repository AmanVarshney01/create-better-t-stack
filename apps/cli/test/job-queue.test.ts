import { describe, test } from "bun:test";

import { createCustomConfig, expectSuccess, runTRPCTest } from "./test-utils";

describe("Job Queue Options", () => {
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
