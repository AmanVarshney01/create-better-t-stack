import { describe, test } from "bun:test";

import { createCustomConfig, expectSuccess, runTRPCTest } from "./test-utils";

describe("CMS Options", () => {
  describe("Payload CMS with Next.js", () => {
    test("payload with Next.js and SQLite", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "payload-nextjs-sqlite",
          frontend: ["next"],
          backend: "self",
          runtime: "none",
          database: "sqlite",
          cms: "payload",
        }),
      );
      expectSuccess(result);
    });

    test("payload with Next.js and PostgreSQL", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "payload-nextjs-postgres",
          frontend: ["next"],
          backend: "self",
          runtime: "none",
          database: "postgres",
          cms: "payload",
        }),
      );
      expectSuccess(result);
    });

    test("payload with Next.js and MongoDB", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "payload-nextjs-mongodb",
          frontend: ["next"],
          backend: "self",
          runtime: "none",
          database: "mongodb",
          orm: "mongoose",
          cms: "payload",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("Payload CMS with different ORMs", () => {
    test("payload with Drizzle ORM", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "payload-drizzle",
          frontend: ["next"],
          backend: "self",
          runtime: "none",
          database: "postgres",
          orm: "drizzle",
          cms: "payload",
        }),
      );
      expectSuccess(result);
    });

    test("payload with Prisma ORM", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "payload-prisma",
          frontend: ["next"],
          backend: "self",
          runtime: "none",
          database: "postgres",
          orm: "prisma",
          cms: "payload",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("Payload CMS with authentication", () => {
    test("payload with better-auth", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "payload-better-auth",
          frontend: ["next"],
          backend: "self",
          runtime: "none",
          database: "sqlite",
          auth: "better-auth",
          cms: "payload",
        }),
      );
      expectSuccess(result);
    });

    test("payload with nextauth", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "payload-nextauth",
          frontend: ["next"],
          backend: "self",
          runtime: "none",
          database: "sqlite",
          auth: "nextauth",
          cms: "payload",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("No CMS option", () => {
    test("none CMS option with Next.js", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "no-cms-nextjs",
          frontend: ["next"],
          backend: "self",
          runtime: "none",
          cms: "none",
        }),
      );
      expectSuccess(result);
    });

    test("none CMS option with TanStack Router", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "no-cms-tanstack",
          frontend: ["tanstack-router"],
          cms: "none",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("CMS not supported with non-Next.js frontends", () => {
    test("payload without Next.js should still work (cms deps skipped)", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "payload-tanstack-router",
          frontend: ["tanstack-router"],
          cms: "payload",
        }),
      );
      // Payload requires Next.js, but the project should still be created
      // The CMS deps processor will skip adding Payload deps for non-Next.js
      expectSuccess(result);
    });
  });
});
