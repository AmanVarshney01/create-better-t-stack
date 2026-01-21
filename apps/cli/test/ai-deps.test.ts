import { describe, expect, it } from "bun:test";

import { expectSuccess, runTRPCTest } from "./test-utils";

describe("AI SDK Dependencies", () => {
  it("should install vercel-ai SDK when selected", async () => {
    const result = await runTRPCTest({
      projectName: "ai-deps-vercel",
      ecosystem: "typescript",
      frontend: ["tanstack-router"],
      backend: "hono",
      runtime: "bun",
      database: "sqlite",
      orm: "drizzle",
      api: "trpc",
      auth: "none",
      payments: "none",
      addons: ["none"],
      examples: ["none"],
      dbSetup: "none",
      webDeploy: "none",
      serverDeploy: "none",
      ai: "vercel-ai",
      cssFramework: "tailwind",
      uiLibrary: "none",
      effect: "none",
      email: "none",
      stateManagement: "none",
      forms: "react-hook-form",
      testing: "vitest",
      validation: "zod",
      realtime: "none",
      jobQueue: "none",
      animation: "none",
      logging: "none",
      observability: "none",
      cms: "none",
      caching: "none",
      fileUpload: "none",
      packageManager: "bun",
    });
    expectSuccess(result);

    // Check server package.json has ai dependency
    if (result.projectDir) {
      const serverPkg = await Bun.file(`${result.projectDir}/apps/server/package.json`).json();
      expect(serverPkg.dependencies["ai"]).toBeDefined();

      // Check frontend package.json has @ai-sdk/react for React frontend
      // Note: frontend folder is named "web" not the framework name
      const frontendPkg = await Bun.file(`${result.projectDir}/apps/web/package.json`).json();
      expect(frontendPkg.dependencies["@ai-sdk/react"]).toBeDefined();
    }
  });

  it("should install mastra SDK when selected", async () => {
    const result = await runTRPCTest({
      projectName: "ai-deps-mastra",
      ecosystem: "typescript",
      frontend: ["tanstack-router"],
      backend: "hono",
      runtime: "bun",
      database: "sqlite",
      orm: "drizzle",
      api: "trpc",
      auth: "none",
      payments: "none",
      addons: ["none"],
      examples: ["none"],
      dbSetup: "none",
      webDeploy: "none",
      serverDeploy: "none",
      ai: "mastra",
      cssFramework: "tailwind",
      uiLibrary: "none",
      effect: "none",
      email: "none",
      stateManagement: "none",
      forms: "react-hook-form",
      testing: "vitest",
      validation: "zod",
      realtime: "none",
      jobQueue: "none",
      animation: "none",
      logging: "none",
      observability: "none",
      cms: "none",
      caching: "none",
      fileUpload: "none",
      packageManager: "bun",
    });
    expectSuccess(result);

    if (result.projectDir) {
      const serverPkg = await Bun.file(`${result.projectDir}/apps/server/package.json`).json();
      expect(serverPkg.dependencies["mastra"]).toBeDefined();
      expect(serverPkg.dependencies["@mastra/core"]).toBeDefined();
    }
  });

  it("should install langgraph SDK when selected", async () => {
    const result = await runTRPCTest({
      projectName: "ai-deps-langgraph",
      ecosystem: "typescript",
      frontend: ["tanstack-router"],
      backend: "hono",
      runtime: "bun",
      database: "sqlite",
      orm: "drizzle",
      api: "trpc",
      auth: "none",
      payments: "none",
      addons: ["none"],
      examples: ["none"],
      dbSetup: "none",
      webDeploy: "none",
      serverDeploy: "none",
      ai: "langgraph",
      cssFramework: "tailwind",
      uiLibrary: "none",
      effect: "none",
      email: "none",
      stateManagement: "none",
      forms: "react-hook-form",
      testing: "vitest",
      validation: "zod",
      realtime: "none",
      jobQueue: "none",
      animation: "none",
      logging: "none",
      observability: "none",
      cms: "none",
      caching: "none",
      fileUpload: "none",
      packageManager: "bun",
    });
    expectSuccess(result);

    if (result.projectDir) {
      const serverPkg = await Bun.file(`${result.projectDir}/apps/server/package.json`).json();
      expect(serverPkg.dependencies["@langchain/langgraph"]).toBeDefined();
      expect(serverPkg.dependencies["@langchain/core"]).toBeDefined();
    }
  });

  it("should install llamaindex SDK when selected", async () => {
    const result = await runTRPCTest({
      projectName: "ai-deps-llamaindex",
      ecosystem: "typescript",
      frontend: ["tanstack-router"],
      backend: "hono",
      runtime: "bun",
      database: "sqlite",
      orm: "drizzle",
      api: "trpc",
      auth: "none",
      payments: "none",
      addons: ["none"],
      examples: ["none"],
      dbSetup: "none",
      webDeploy: "none",
      serverDeploy: "none",
      ai: "llamaindex",
      cssFramework: "tailwind",
      uiLibrary: "none",
      effect: "none",
      email: "none",
      stateManagement: "none",
      forms: "react-hook-form",
      testing: "vitest",
      validation: "zod",
      realtime: "none",
      jobQueue: "none",
      animation: "none",
      logging: "none",
      observability: "none",
      cms: "none",
      caching: "none",
      fileUpload: "none",
      packageManager: "bun",
    });
    expectSuccess(result);

    if (result.projectDir) {
      const serverPkg = await Bun.file(`${result.projectDir}/apps/server/package.json`).json();
      expect(serverPkg.dependencies["llamaindex"]).toBeDefined();
    }
  });

  it("should not install AI SDK when none selected", async () => {
    const result = await runTRPCTest({
      projectName: "ai-deps-none",
      ecosystem: "typescript",
      frontend: ["tanstack-router"],
      backend: "hono",
      runtime: "bun",
      database: "sqlite",
      orm: "drizzle",
      api: "trpc",
      auth: "none",
      payments: "none",
      addons: ["none"],
      examples: ["none"],
      dbSetup: "none",
      webDeploy: "none",
      serverDeploy: "none",
      ai: "none",
      cssFramework: "tailwind",
      uiLibrary: "none",
      effect: "none",
      email: "none",
      stateManagement: "none",
      forms: "react-hook-form",
      testing: "vitest",
      validation: "zod",
      realtime: "none",
      jobQueue: "none",
      animation: "none",
      logging: "none",
      observability: "none",
      cms: "none",
      caching: "none",
      fileUpload: "none",
      packageManager: "bun",
    });
    expectSuccess(result);

    if (result.projectDir) {
      const serverPkgText = await Bun.file(`${result.projectDir}/apps/server/package.json`).text();
      // Should not have any AI SDKs
      expect(serverPkgText).not.toContain('"ai":');
      expect(serverPkgText).not.toContain('"mastra"');
      expect(serverPkgText).not.toContain('"langchain"');
      expect(serverPkgText).not.toContain('"llamaindex"');
    }
  });

  it("should install vercel-ai to fullstack frontend when backend is self", async () => {
    const result = await runTRPCTest({
      projectName: "ai-deps-self",
      ecosystem: "typescript",
      frontend: ["next"],
      backend: "self",
      runtime: "none",
      database: "sqlite",
      orm: "drizzle",
      api: "trpc",
      auth: "none",
      payments: "none",
      addons: ["none"],
      examples: ["none"],
      dbSetup: "none",
      webDeploy: "none",
      serverDeploy: "none",
      ai: "vercel-ai",
      cssFramework: "tailwind",
      uiLibrary: "none",
      effect: "none",
      email: "none",
      stateManagement: "none",
      forms: "react-hook-form",
      testing: "vitest",
      validation: "zod",
      realtime: "none",
      jobQueue: "none",
      animation: "none",
      logging: "none",
      observability: "none",
      cms: "none",
      caching: "none",
      fileUpload: "none",
      packageManager: "bun",
    });
    expectSuccess(result);

    // For self backend, AI SDK should be in the frontend package
    // Next.js with self backend puts files directly in apps/web (or apps/next for Next.js)
    if (result.projectDir) {
      const nextPkg = await Bun.file(`${result.projectDir}/apps/web/package.json`).json();
      expect(nextPkg.dependencies["ai"]).toBeDefined();
      expect(nextPkg.dependencies["@ai-sdk/react"]).toBeDefined();
    }
  });
});
