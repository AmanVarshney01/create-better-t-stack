import { describe, test } from "bun:test";

import { expectSuccess, runTRPCTest, createCustomConfig } from "./test-utils";

describe("Validation Library Options", () => {
  describe("Valibot with React frontends", () => {
    test("valibot with TanStack Router", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "valibot-tanstack-router",
          frontend: ["tanstack-router"],
          validation: "valibot",
        }),
      );
      expectSuccess(result);
    });

    test("valibot with React Router", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "valibot-react-router",
          frontend: ["react-router"],
          validation: "valibot",
        }),
      );
      expectSuccess(result);
    });

    test("valibot with Next.js", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "valibot-nextjs",
          frontend: ["next"],
          backend: "self",
          runtime: "none",
          validation: "valibot",
        }),
      );
      expectSuccess(result);
    });

    test("valibot with TanStack Start", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "valibot-tanstack-start",
          frontend: ["tanstack-start"],
          backend: "self",
          runtime: "none",
          validation: "valibot",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("Valibot with different backends", () => {
    test("valibot with Hono backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "valibot-hono",
          frontend: ["tanstack-router"],
          backend: "hono",
          validation: "valibot",
        }),
      );
      expectSuccess(result);
    });

    test("valibot with Express backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "valibot-express",
          frontend: ["tanstack-router"],
          backend: "express",
          runtime: "node",
          validation: "valibot",
        }),
      );
      expectSuccess(result);
    });

    test("valibot with Fastify backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "valibot-fastify",
          frontend: ["tanstack-router"],
          backend: "fastify",
          runtime: "node",
          validation: "valibot",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("Valibot with native apps", () => {
    test("valibot with native-bare", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "valibot-native-bare",
          frontend: ["native-bare"],
          backend: "hono",
          validation: "valibot",
        }),
      );
      expectSuccess(result);
    });

    test("valibot with native-uniwind", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "valibot-native-uniwind",
          frontend: ["native-uniwind"],
          backend: "hono",
          validation: "valibot",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("ArkType with React frontends", () => {
    test("arktype with TanStack Router", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "arktype-tanstack-router",
          frontend: ["tanstack-router"],
          validation: "arktype",
        }),
      );
      expectSuccess(result);
    });

    test("arktype with React Router", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "arktype-react-router",
          frontend: ["react-router"],
          validation: "arktype",
        }),
      );
      expectSuccess(result);
    });

    test("arktype with Next.js", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "arktype-nextjs",
          frontend: ["next"],
          backend: "self",
          runtime: "none",
          validation: "arktype",
        }),
      );
      expectSuccess(result);
    });

    test("arktype with TanStack Start", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "arktype-tanstack-start",
          frontend: ["tanstack-start"],
          backend: "self",
          runtime: "none",
          validation: "arktype",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("ArkType with different backends", () => {
    test("arktype with Hono backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "arktype-hono",
          frontend: ["tanstack-router"],
          backend: "hono",
          validation: "arktype",
        }),
      );
      expectSuccess(result);
    });

    test("arktype with Express backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "arktype-express",
          frontend: ["tanstack-router"],
          backend: "express",
          runtime: "node",
          validation: "arktype",
        }),
      );
      expectSuccess(result);
    });

    test("arktype with Fastify backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "arktype-fastify",
          frontend: ["tanstack-router"],
          backend: "fastify",
          runtime: "node",
          validation: "arktype",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("ArkType with native apps", () => {
    test("arktype with native-bare", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "arktype-native-bare",
          frontend: ["native-bare"],
          backend: "hono",
          validation: "arktype",
        }),
      );
      expectSuccess(result);
    });

    test("arktype with native-uniwind", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "arktype-native-uniwind",
          frontend: ["native-uniwind"],
          backend: "hono",
          validation: "arktype",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("TypeBox with React frontends", () => {
    test("typebox with TanStack Router", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "typebox-tanstack-router",
          frontend: ["tanstack-router"],
          validation: "typebox",
        }),
      );
      expectSuccess(result);
    });

    test("typebox with React Router", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "typebox-react-router",
          frontend: ["react-router"],
          validation: "typebox",
        }),
      );
      expectSuccess(result);
    });

    test("typebox with Next.js", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "typebox-nextjs",
          frontend: ["next"],
          backend: "self",
          runtime: "none",
          validation: "typebox",
        }),
      );
      expectSuccess(result);
    });

    test("typebox with TanStack Start", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "typebox-tanstack-start",
          frontend: ["tanstack-start"],
          backend: "self",
          runtime: "none",
          validation: "typebox",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("TypeBox with different backends", () => {
    test("typebox with Hono backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "typebox-hono",
          frontend: ["tanstack-router"],
          backend: "hono",
          validation: "typebox",
        }),
      );
      expectSuccess(result);
    });

    test("typebox with Express backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "typebox-express",
          frontend: ["tanstack-router"],
          backend: "express",
          runtime: "node",
          validation: "typebox",
        }),
      );
      expectSuccess(result);
    });

    test("typebox with Fastify backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "typebox-fastify",
          frontend: ["tanstack-router"],
          backend: "fastify",
          runtime: "node",
          validation: "typebox",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("TypeBox with native apps", () => {
    test("typebox with native-bare", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "typebox-native-bare",
          frontend: ["native-bare"],
          backend: "hono",
          validation: "typebox",
        }),
      );
      expectSuccess(result);
    });

    test("typebox with native-uniwind", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "typebox-native-uniwind",
          frontend: ["native-uniwind"],
          backend: "hono",
          validation: "typebox",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("Typia with React frontends", () => {
    test("typia with TanStack Router", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "typia-tanstack-router",
          frontend: ["tanstack-router"],
          validation: "typia",
        }),
      );
      expectSuccess(result);
    });

    test("typia with React Router", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "typia-react-router",
          frontend: ["react-router"],
          validation: "typia",
        }),
      );
      expectSuccess(result);
    });

    test("typia with Next.js", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "typia-nextjs",
          frontend: ["next"],
          backend: "self",
          runtime: "none",
          validation: "typia",
        }),
      );
      expectSuccess(result);
    });

    test("typia with TanStack Start", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "typia-tanstack-start",
          frontend: ["tanstack-start"],
          backend: "self",
          runtime: "none",
          validation: "typia",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("Typia with different backends", () => {
    test("typia with Hono backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "typia-hono",
          frontend: ["tanstack-router"],
          backend: "hono",
          validation: "typia",
        }),
      );
      expectSuccess(result);
    });

    test("typia with Express backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "typia-express",
          frontend: ["tanstack-router"],
          backend: "express",
          runtime: "node",
          validation: "typia",
        }),
      );
      expectSuccess(result);
    });

    test("typia with Fastify backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "typia-fastify",
          frontend: ["tanstack-router"],
          backend: "fastify",
          runtime: "node",
          validation: "typia",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("Typia with native apps", () => {
    test("typia with native-bare", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "typia-native-bare",
          frontend: ["native-bare"],
          backend: "hono",
          validation: "typia",
        }),
      );
      expectSuccess(result);
    });

    test("typia with native-uniwind", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "typia-native-uniwind",
          frontend: ["native-uniwind"],
          backend: "hono",
          validation: "typia",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("Runtypes with React frontends", () => {
    test("runtypes with TanStack Router", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "runtypes-tanstack-router",
          frontend: ["tanstack-router"],
          validation: "runtypes",
        }),
      );
      expectSuccess(result);
    });

    test("runtypes with React Router", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "runtypes-react-router",
          frontend: ["react-router"],
          validation: "runtypes",
        }),
      );
      expectSuccess(result);
    });

    test("runtypes with Next.js", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "runtypes-nextjs",
          frontend: ["next"],
          backend: "self",
          runtime: "none",
          validation: "runtypes",
        }),
      );
      expectSuccess(result);
    });

    test("runtypes with TanStack Start", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "runtypes-tanstack-start",
          frontend: ["tanstack-start"],
          backend: "self",
          runtime: "none",
          validation: "runtypes",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("Runtypes with different backends", () => {
    test("runtypes with Hono backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "runtypes-hono",
          frontend: ["tanstack-router"],
          backend: "hono",
          validation: "runtypes",
        }),
      );
      expectSuccess(result);
    });

    test("runtypes with Express backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "runtypes-express",
          frontend: ["tanstack-router"],
          backend: "express",
          runtime: "node",
          validation: "runtypes",
        }),
      );
      expectSuccess(result);
    });

    test("runtypes with Fastify backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "runtypes-fastify",
          frontend: ["tanstack-router"],
          backend: "fastify",
          runtime: "node",
          validation: "runtypes",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("Runtypes with native apps", () => {
    test("runtypes with native-bare", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "runtypes-native-bare",
          frontend: ["native-bare"],
          backend: "hono",
          validation: "runtypes",
        }),
      );
      expectSuccess(result);
    });

    test("runtypes with native-uniwind", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "runtypes-native-uniwind",
          frontend: ["native-uniwind"],
          backend: "hono",
          validation: "runtypes",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("@effect/schema with React frontends", () => {
    test("effect-schema with TanStack Router", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "effect-schema-tanstack-router",
          frontend: ["tanstack-router"],
          validation: "effect-schema",
        }),
      );
      expectSuccess(result);
    });

    test("effect-schema with React Router", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "effect-schema-react-router",
          frontend: ["react-router"],
          validation: "effect-schema",
        }),
      );
      expectSuccess(result);
    });

    test("effect-schema with Next.js", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "effect-schema-nextjs",
          frontend: ["next"],
          backend: "self",
          runtime: "none",
          validation: "effect-schema",
        }),
      );
      expectSuccess(result);
    });

    test("effect-schema with TanStack Start", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "effect-schema-tanstack-start",
          frontend: ["tanstack-start"],
          backend: "self",
          runtime: "none",
          validation: "effect-schema",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("@effect/schema with different backends", () => {
    test("effect-schema with Hono backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "effect-schema-hono",
          frontend: ["tanstack-router"],
          backend: "hono",
          validation: "effect-schema",
        }),
      );
      expectSuccess(result);
    });

    test("effect-schema with Express backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "effect-schema-express",
          frontend: ["tanstack-router"],
          backend: "express",
          runtime: "node",
          validation: "effect-schema",
        }),
      );
      expectSuccess(result);
    });

    test("effect-schema with Fastify backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "effect-schema-fastify",
          frontend: ["tanstack-router"],
          backend: "fastify",
          runtime: "node",
          validation: "effect-schema",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("@effect/schema with native apps", () => {
    test("effect-schema with native-bare", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "effect-schema-native-bare",
          frontend: ["native-bare"],
          backend: "hono",
          validation: "effect-schema",
        }),
      );
      expectSuccess(result);
    });

    test("effect-schema with native-uniwind", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "effect-schema-native-uniwind",
          frontend: ["native-uniwind"],
          backend: "hono",
          validation: "effect-schema",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("Zod validation (default)", () => {
    test("zod with TanStack Router (explicit)", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "zod-tanstack-router",
          frontend: ["tanstack-router"],
          validation: "zod",
        }),
      );
      expectSuccess(result);
    });

    test("zod with Next.js (explicit)", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "zod-nextjs",
          frontend: ["next"],
          backend: "self",
          runtime: "none",
          validation: "zod",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("No validation option", () => {
    test("none validation option", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "no-validation",
          frontend: ["tanstack-router"],
          validation: "none",
        }),
      );
      expectSuccess(result);
    });
  });
});
