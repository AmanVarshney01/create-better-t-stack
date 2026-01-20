import { describe, it } from "bun:test";

import { expectSuccess, runTRPCTest } from "./test-utils";

describe("AI SDK Configuration", () => {
  describe("Vercel AI SDK (default)", () => {
    it("should work with AI example + Vercel AI SDK", async () => {
      const result = await runTRPCTest({
        projectName: "ai-vercel-ai",
        examples: ["ai"],
        ai: "vercel-ai",
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "trpc",
        frontend: ["tanstack-router"],
        addons: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });

    it("should work with AI example + Vercel AI SDK + Next.js", async () => {
      const result = await runTRPCTest({
        projectName: "ai-vercel-next",
        examples: ["ai"],
        ai: "vercel-ai",
        backend: "self",
        runtime: "none",
        database: "sqlite",
        orm: "drizzle",
        auth: "better-auth",
        api: "trpc",
        frontend: ["next"],
        addons: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });
  });

  describe("Mastra AI Framework", () => {
    it("should work with AI example + Mastra", async () => {
      const result = await runTRPCTest({
        projectName: "ai-mastra",
        examples: ["ai"],
        ai: "mastra",
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "trpc",
        frontend: ["tanstack-router"],
        addons: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });

    it("should work with AI example + Mastra + Next.js (self backend)", async () => {
      const result = await runTRPCTest({
        projectName: "ai-mastra-next",
        examples: ["ai"],
        ai: "mastra",
        backend: "self",
        runtime: "none",
        database: "sqlite",
        orm: "drizzle",
        auth: "better-auth",
        api: "trpc",
        frontend: ["next"],
        addons: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });

    it("should work with AI example + Mastra + TanStack Start", async () => {
      const result = await runTRPCTest({
        projectName: "ai-mastra-start",
        examples: ["ai"],
        ai: "mastra",
        backend: "self",
        runtime: "none",
        database: "sqlite",
        orm: "drizzle",
        auth: "better-auth",
        api: "trpc",
        frontend: ["tanstack-start"],
        addons: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });

    it("should work with AI example + Mastra + Express backend", async () => {
      const result = await runTRPCTest({
        projectName: "ai-mastra-express",
        examples: ["ai"],
        ai: "mastra",
        backend: "express",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "trpc",
        frontend: ["tanstack-router"],
        addons: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });
  });

  describe("AI SDK without AI Example", () => {
    it("should work with Mastra without AI example (SDK only)", async () => {
      const result = await runTRPCTest({
        projectName: "mastra-no-example",
        examples: ["none"],
        ai: "mastra",
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "trpc",
        frontend: ["tanstack-router"],
        addons: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });

    it("should work with Vercel AI SDK without AI example (SDK only)", async () => {
      const result = await runTRPCTest({
        projectName: "vercel-ai-no-example",
        examples: ["none"],
        ai: "vercel-ai",
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "trpc",
        frontend: ["tanstack-router"],
        addons: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });
  });

  describe("AI SDK none option", () => {
    it("should work with ai: none", async () => {
      const result = await runTRPCTest({
        projectName: "ai-none",
        examples: ["none"],
        ai: "none",
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "trpc",
        frontend: ["tanstack-router"],
        addons: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });
  });
});
