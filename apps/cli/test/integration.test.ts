import { describe, it } from "bun:test";

import { expectError, runTRPCTest } from "./test-utils";

describe("Integration Tests - Real World Scenarios", () => {
  describe("Complex Error Scenarios", () => {
    it("should fail with incompatible stack combination", async () => {
      // MongoDB + Drizzle is not supported
      const result = await runTRPCTest({
        projectName: "incompatible-stack-fail",
        backend: "hono",
        runtime: "bun",
        database: "mongodb",
        orm: "drizzle", // Not compatible with MongoDB
        auth: "better-auth",
        api: "trpc",
        frontend: ["tanstack-router"],
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        expectError: true,
      });

      expectError(result, "Drizzle ORM does not support MongoDB");
    });

    it("should fail with workers + incompatible database", async () => {
      const result = await runTRPCTest({
        projectName: "workers-mongodb-fail",
        backend: "hono",
        runtime: "workers",
        database: "mongodb", // Not compatible with Workers
        orm: "mongoose",
        auth: "none",
        api: "trpc",
        frontend: ["tanstack-router"],
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "cloudflare",
        expectError: true,
      });

      expectError(
        result,
        "Cloudflare Workers runtime (--runtime workers) is not compatible with MongoDB database",
      );
    });

    it("should fail with tRPC + incompatible frontend", async () => {
      const result = await runTRPCTest({
        projectName: "trpc-nuxt-fail",
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "trpc",
        frontend: ["nuxt"], // tRPC not compatible with Nuxt
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        expectError: true,
      });

      expectError(result, "tRPC API is not supported with 'nuxt' frontend");
    });

    it("should fail with Clerk + incompatible frontend", async () => {
      const result = await runTRPCTest({
        projectName: "clerk-svelte-fail",
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "clerk",
        api: "orpc",
        frontend: ["svelte"], // Clerk is not compatible with Svelte
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        expectError: true,
      });

      expectError(result, "Clerk authentication is not compatible");
    });

    it("should fail with addon incompatibility", async () => {
      const result = await runTRPCTest({
        projectName: "pwa-native-fail",
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "trpc",
        frontend: ["native-bare"],
        addons: ["pwa"], // PWA not compatible with native-only
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        expectError: true,
      });

      expectError(result, "pwa addon requires one of these frontends");
    });

    it("should fail with example incompatibility", async () => {
      const result = await runTRPCTest({
        projectName: "ai-solid-fail",
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "orpc",
        frontend: ["solid"],
        addons: ["none"],
        examples: ["ai"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        expectError: true,
      });

      expectError(result, "The 'ai' example is not compatible with the Solid frontend");
    });

    it("should fail with Convex AI example + incompatible frontend", async () => {
      const result = await runTRPCTest({
        projectName: "convex-ai-svelte-fail",
        backend: "convex",
        runtime: "none",
        database: "none",
        orm: "none",
        auth: "none",
        api: "none",
        frontend: ["svelte"],
        addons: ["none"],
        examples: ["ai"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        expectError: true,
      });

      expectError(
        result,
        "The 'ai' example with Convex backend only supports React-based frontends (Next.js, TanStack Router, TanStack Start, React Router). Svelte and Nuxt are not supported with Convex AI.",
      );
    });

    it("should fail with payments incompatibility", async () => {
      const result = await runTRPCTest({
        projectName: "polar-no-auth-fail",
        backend: "hono",
        runtime: "bun",
        database: "none",
        orm: "none",
        auth: "none",
        payments: "polar",
        api: "trpc",
        frontend: ["tanstack-router"],
        addons: ["turborepo"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        expectError: true,
      });

      expectError(result, "Polar payments requires Better Auth");
    });

    it("should fail with deployment constraint violation", async () => {
      const result = await runTRPCTest({
        projectName: "web-deploy-no-frontend-fail",
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "trpc",
        frontend: ["native-bare"], // Only native, no web
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "cloudflare", // Requires web frontend
        serverDeploy: "none",
        expectError: true,
      });

      expectError(result, "'--web-deploy' requires a web frontend");
    });
  });
});
