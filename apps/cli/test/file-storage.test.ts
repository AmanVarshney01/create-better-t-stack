import { describe, test } from "bun:test";

import { createCustomConfig, expectSuccess, runTRPCTest } from "./test-utils";

describe("File Storage Options", () => {
  describe("AWS S3 with different backends", () => {
    test("s3 with Hono backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "s3-hono",
          frontend: ["tanstack-router"],
          backend: "hono",
          fileStorage: "s3",
        }),
      );
      expectSuccess(result);
    });

    test("s3 with Express backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "s3-express",
          frontend: ["tanstack-router"],
          backend: "express",
          runtime: "node",
          fileStorage: "s3",
        }),
      );
      expectSuccess(result);
    });

    test("s3 with Fastify backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "s3-fastify",
          frontend: ["tanstack-router"],
          backend: "fastify",
          runtime: "node",
          fileStorage: "s3",
        }),
      );
      expectSuccess(result);
    });

    test("s3 with Elysia backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "s3-elysia",
          frontend: ["tanstack-router"],
          backend: "elysia",
          runtime: "bun",
          fileStorage: "s3",
        }),
      );
      expectSuccess(result);
    });

    test("s3 with NestJS backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "s3-nestjs",
          frontend: ["tanstack-router"],
          backend: "nestjs",
          runtime: "node",
          fileStorage: "s3",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("AWS S3 with fullstack frameworks", () => {
    test("s3 with Next.js fullstack", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "s3-nextjs",
          frontend: ["next"],
          backend: "self",
          runtime: "none",
          fileStorage: "s3",
        }),
      );
      expectSuccess(result);
    });

    test("s3 with TanStack Start", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "s3-tanstack-start",
          frontend: ["tanstack-start"],
          backend: "self",
          runtime: "none",
          fileStorage: "s3",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("AWS S3 with different frontends", () => {
    test("s3 with TanStack Router", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "s3-tanstack-router",
          frontend: ["tanstack-router"],
          fileStorage: "s3",
        }),
      );
      expectSuccess(result);
    });

    test("s3 with React Router", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "s3-react-router",
          frontend: ["react-router"],
          fileStorage: "s3",
        }),
      );
      expectSuccess(result);
    });

    test("s3 with Svelte", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "s3-svelte",
          frontend: ["svelte"],
          uiLibrary: "daisyui",
          api: "orpc",
          fileStorage: "s3",
        }),
      );
      expectSuccess(result);
    });

    test("s3 with Solid", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "s3-solid",
          frontend: ["solid"],
          uiLibrary: "daisyui",
          api: "orpc",
          fileStorage: "s3",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("AWS S3 with database setups", () => {
    test("s3 with PostgreSQL and Drizzle", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "s3-postgres-drizzle",
          frontend: ["tanstack-router"],
          database: "postgres",
          orm: "drizzle",
          fileStorage: "s3",
        }),
      );
      expectSuccess(result);
    });

    test("s3 with SQLite and Prisma", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "s3-sqlite-prisma",
          frontend: ["tanstack-router"],
          database: "sqlite",
          orm: "prisma",
          fileStorage: "s3",
        }),
      );
      expectSuccess(result);
    });

    test("s3 with MySQL and TypeORM", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "s3-mysql-typeorm",
          frontend: ["tanstack-router"],
          database: "mysql",
          orm: "typeorm",
          runtime: "node",
          fileStorage: "s3",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("AWS S3 with authentication", () => {
    test("s3 with Better Auth", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "s3-better-auth",
          frontend: ["tanstack-router"],
          auth: "better-auth",
          fileStorage: "s3",
        }),
      );
      expectSuccess(result);
    });

    test("s3 with Auth.js", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "s3-authjs",
          frontend: ["next"],
          backend: "self",
          runtime: "none",
          auth: "nextauth",
          fileStorage: "s3",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("Cloudflare R2 with different backends", () => {
    test("r2 with Hono backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "r2-hono",
          frontend: ["tanstack-router"],
          backend: "hono",
          fileStorage: "r2",
        }),
      );
      expectSuccess(result);
    });

    test("r2 with Express backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "r2-express",
          frontend: ["tanstack-router"],
          backend: "express",
          runtime: "node",
          fileStorage: "r2",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("Cloudflare R2 with fullstack frameworks", () => {
    test("r2 with Next.js fullstack", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "r2-nextjs",
          frontend: ["next"],
          backend: "self",
          runtime: "none",
          fileStorage: "r2",
        }),
      );
      expectSuccess(result);
    });

    test("r2 with TanStack Start", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "r2-tanstack-start",
          frontend: ["tanstack-start"],
          backend: "self",
          runtime: "none",
          fileStorage: "r2",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("No file storage option", () => {
    test("none file storage option", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "no-file-storage",
          frontend: ["tanstack-router"],
          fileStorage: "none",
        }),
      );
      expectSuccess(result);
    });
  });
});
