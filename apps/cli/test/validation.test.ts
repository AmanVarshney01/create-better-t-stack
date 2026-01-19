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
