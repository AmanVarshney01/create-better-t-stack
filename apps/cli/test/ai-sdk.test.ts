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

  describe("VoltAgent AI Framework", () => {
    it("should work with AI example + VoltAgent", async () => {
      const result = await runTRPCTest({
        projectName: "ai-voltagent",
        examples: ["ai"],
        ai: "voltagent",
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

    it("should work with AI example + VoltAgent + Next.js (self backend)", async () => {
      const result = await runTRPCTest({
        projectName: "ai-voltagent-next",
        examples: ["ai"],
        ai: "voltagent",
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

    it("should work with AI example + VoltAgent + TanStack Start", async () => {
      const result = await runTRPCTest({
        projectName: "ai-voltagent-start",
        examples: ["ai"],
        ai: "voltagent",
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

    it("should work with AI example + VoltAgent + Express backend", async () => {
      const result = await runTRPCTest({
        projectName: "ai-voltagent-express",
        examples: ["ai"],
        ai: "voltagent",
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

    it("should work with VoltAgent without AI example (SDK only)", async () => {
      const result = await runTRPCTest({
        projectName: "voltagent-no-example",
        examples: ["none"],
        ai: "voltagent",
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

  describe("LangGraph.js AI Framework", () => {
    it("should work with AI example + LangGraph.js", async () => {
      const result = await runTRPCTest({
        projectName: "ai-langgraph",
        examples: ["ai"],
        ai: "langgraph",
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

    it("should work with AI example + LangGraph.js + Next.js (self backend)", async () => {
      const result = await runTRPCTest({
        projectName: "ai-langgraph-next",
        examples: ["ai"],
        ai: "langgraph",
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

    it("should work with AI example + LangGraph.js + TanStack Start", async () => {
      const result = await runTRPCTest({
        projectName: "ai-langgraph-start",
        examples: ["ai"],
        ai: "langgraph",
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

    it("should work with AI example + LangGraph.js + Express backend", async () => {
      const result = await runTRPCTest({
        projectName: "ai-langgraph-express",
        examples: ["ai"],
        ai: "langgraph",
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

  describe("OpenAI Agents SDK", () => {
    it("should work with AI example + OpenAI Agents SDK", async () => {
      const result = await runTRPCTest({
        projectName: "ai-openai-agents",
        examples: ["ai"],
        ai: "openai-agents",
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

    it("should work with AI example + OpenAI Agents SDK + Next.js (self backend)", async () => {
      const result = await runTRPCTest({
        projectName: "ai-openai-agents-next",
        examples: ["ai"],
        ai: "openai-agents",
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

    it("should work with AI example + OpenAI Agents SDK + TanStack Start", async () => {
      const result = await runTRPCTest({
        projectName: "ai-openai-agents-start",
        examples: ["ai"],
        ai: "openai-agents",
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

    it("should work with AI example + OpenAI Agents SDK + Express backend", async () => {
      const result = await runTRPCTest({
        projectName: "ai-openai-agents-express",
        examples: ["ai"],
        ai: "openai-agents",
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

    it("should work with OpenAI Agents SDK without AI example (SDK only)", async () => {
      const result = await runTRPCTest({
        projectName: "openai-agents-no-example",
        examples: ["none"],
        ai: "openai-agents",
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
