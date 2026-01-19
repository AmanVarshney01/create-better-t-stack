import { describe, test } from "bun:test";

import { expectSuccess, runTRPCTest, createCustomConfig } from "./test-utils";

describe("Testing Framework Options", () => {
  describe("Jest with React frontends", () => {
    test("jest with TanStack Router", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "jest-tanstack-router",
          frontend: ["tanstack-router"],
          testing: "jest",
        }),
      );
      expectSuccess(result);
    });

    test("jest with React Router", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "jest-react-router",
          frontend: ["react-router"],
          testing: "jest",
        }),
      );
      expectSuccess(result);
    });

    test("jest with Next.js", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "jest-nextjs",
          frontend: ["next"],
          backend: "self",
          runtime: "none",
          testing: "jest",
        }),
      );
      expectSuccess(result);
    });

    test("jest with TanStack Start", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "jest-tanstack-start",
          frontend: ["tanstack-start"],
          backend: "self",
          runtime: "none",
          testing: "jest",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("Jest with different backends", () => {
    test("jest with Hono backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "jest-hono",
          frontend: ["tanstack-router"],
          backend: "hono",
          testing: "jest",
        }),
      );
      expectSuccess(result);
    });

    test("jest with Express backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "jest-express",
          frontend: ["tanstack-router"],
          backend: "express",
          runtime: "node",
          testing: "jest",
        }),
      );
      expectSuccess(result);
    });

    test("jest with Fastify backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "jest-fastify",
          frontend: ["tanstack-router"],
          backend: "fastify",
          runtime: "node",
          testing: "jest",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("Vitest (default)", () => {
    test("vitest with TanStack Router (default)", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "vitest-tanstack-router",
          frontend: ["tanstack-router"],
          testing: "vitest",
        }),
      );
      expectSuccess(result);
    });

    test("vitest with Next.js", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "vitest-nextjs",
          frontend: ["next"],
          backend: "self",
          runtime: "none",
          testing: "vitest",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("Playwright E2E testing", () => {
    test("playwright with TanStack Router", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "playwright-tanstack-router",
          frontend: ["tanstack-router"],
          testing: "playwright",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("Vitest + Playwright (both)", () => {
    test("vitest-playwright with TanStack Router", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "vitest-playwright-tanstack-router",
          frontend: ["tanstack-router"],
          testing: "vitest-playwright",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("No testing option", () => {
    test("none testing option", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "no-testing",
          frontend: ["tanstack-router"],
          testing: "none",
        }),
      );
      expectSuccess(result);
    });
  });
});
