import { describe, test } from "bun:test";

import { createCustomConfig, expectSuccess, runTRPCTest } from "./test-utils";

describe("Search Options", () => {
  describe("Meilisearch with different backends", () => {
    test("meilisearch with Hono backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "meilisearch-hono",
          frontend: ["tanstack-router"],
          backend: "hono",
          search: "meilisearch",
        }),
      );
      expectSuccess(result);
    });

    test("meilisearch with Express backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "meilisearch-express",
          frontend: ["tanstack-router"],
          backend: "express",
          runtime: "node",
          search: "meilisearch",
        }),
      );
      expectSuccess(result);
    });

    test("meilisearch with Fastify backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "meilisearch-fastify",
          frontend: ["tanstack-router"],
          backend: "fastify",
          runtime: "node",
          search: "meilisearch",
        }),
      );
      expectSuccess(result);
    });

    test("meilisearch with Elysia backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "meilisearch-elysia",
          frontend: ["tanstack-router"],
          backend: "elysia",
          runtime: "bun",
          search: "meilisearch",
        }),
      );
      expectSuccess(result);
    });

    test("meilisearch with NestJS backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "meilisearch-nestjs",
          frontend: ["tanstack-router"],
          backend: "nestjs",
          runtime: "node",
          search: "meilisearch",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("Meilisearch with fullstack frameworks", () => {
    test("meilisearch with Next.js fullstack", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "meilisearch-nextjs",
          frontend: ["next"],
          backend: "self",
          runtime: "none",
          search: "meilisearch",
        }),
      );
      expectSuccess(result);
    });

    test("meilisearch with TanStack Start", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "meilisearch-tanstack-start",
          frontend: ["tanstack-start"],
          backend: "self",
          runtime: "none",
          search: "meilisearch",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("Meilisearch with different frontends", () => {
    test("meilisearch with TanStack Router", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "meilisearch-tanstack-router",
          frontend: ["tanstack-router"],
          search: "meilisearch",
        }),
      );
      expectSuccess(result);
    });

    test("meilisearch with React Router", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "meilisearch-react-router",
          frontend: ["react-router"],
          search: "meilisearch",
        }),
      );
      expectSuccess(result);
    });

    test("meilisearch with Svelte", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "meilisearch-svelte",
          frontend: ["svelte"],
          uiLibrary: "daisyui",
          api: "orpc",
          search: "meilisearch",
        }),
      );
      expectSuccess(result);
    });

    test("meilisearch with Solid", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "meilisearch-solid",
          frontend: ["solid"],
          uiLibrary: "daisyui",
          api: "orpc",
          search: "meilisearch",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("Meilisearch with database setups", () => {
    test("meilisearch with PostgreSQL and Drizzle", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "meilisearch-postgres-drizzle",
          frontend: ["tanstack-router"],
          database: "postgres",
          orm: "drizzle",
          search: "meilisearch",
        }),
      );
      expectSuccess(result);
    });

    test("meilisearch with SQLite and Prisma", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "meilisearch-sqlite-prisma",
          frontend: ["tanstack-router"],
          database: "sqlite",
          orm: "prisma",
          search: "meilisearch",
        }),
      );
      expectSuccess(result);
    });

    test("meilisearch with MySQL and TypeORM", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "meilisearch-mysql-typeorm",
          frontend: ["tanstack-router"],
          database: "mysql",
          orm: "typeorm",
          runtime: "node",
          search: "meilisearch",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("Meilisearch with authentication", () => {
    test("meilisearch with Better Auth", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "meilisearch-better-auth",
          frontend: ["tanstack-router"],
          auth: "better-auth",
          search: "meilisearch",
        }),
      );
      expectSuccess(result);
    });

    test("meilisearch with Auth.js", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "meilisearch-authjs",
          frontend: ["next"],
          backend: "self",
          runtime: "none",
          auth: "nextauth",
          search: "meilisearch",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("No search option", () => {
    test("none search option", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "no-search",
          frontend: ["tanstack-router"],
          search: "none",
        }),
      );
      expectSuccess(result);
    });
  });
});
