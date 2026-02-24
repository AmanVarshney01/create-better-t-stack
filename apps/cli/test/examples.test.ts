import { describe, expect, it } from "bun:test";
import { join } from "node:path";

import { EXAMPLES, expectError, expectSuccess, runTRPCTest, type TestConfig } from "./test-utils";

describe("Example Configurations", () => {
  describe("AI Example", () => {
    it("should work with AI example + React frontend", async () => {
      const result = await runTRPCTest({
        projectName: "ai-react",
        examples: ["ai"],
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

    it("should work with AI example + Next.js", async () => {
      const result = await runTRPCTest({
        projectName: "ai-next",
        examples: ["ai"],
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

    it("should work with AI example + Nuxt", async () => {
      const result = await runTRPCTest({
        projectName: "ai-nuxt",
        examples: ["ai"],
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "orpc", // tRPC not supported with Nuxt
        frontend: ["nuxt"],
        addons: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });

    it("should work with AI example + Svelte", async () => {
      const result = await runTRPCTest({
        projectName: "ai-svelte",
        examples: ["ai"],
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "orpc", // tRPC not supported with Svelte
        frontend: ["svelte"],
        addons: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });

    it("should fail with AI example + Solid frontend", async () => {
      const result = await runTRPCTest({
        projectName: "ai-solid-fail",
        examples: ["ai"],
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "orpc",
        frontend: ["solid"],
        addons: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        expectError: true,
      });

      expectError(result, "The 'ai' example is not compatible with the Solid frontend");
    });

    it("should work with AI example + Convex + React frontend", async () => {
      const result = await runTRPCTest({
        projectName: "ai-convex-react",
        examples: ["ai"],
        backend: "convex",
        runtime: "none",
        database: "none",
        orm: "none",
        auth: "clerk",
        api: "none",
        frontend: ["tanstack-router"],
        addons: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });

    it("should work with AI example + Convex + Next.js", async () => {
      const result = await runTRPCTest({
        projectName: "ai-convex-next",
        examples: ["ai"],
        backend: "convex",
        runtime: "none",
        database: "none",
        orm: "none",
        auth: "better-auth",
        api: "none",
        frontend: ["next"],
        addons: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });

    it("should fail with AI example + Convex + Svelte", async () => {
      const result = await runTRPCTest({
        projectName: "ai-convex-svelte-fail",
        examples: ["ai"],
        backend: "convex",
        runtime: "none",
        database: "none",
        orm: "none",
        auth: "none",
        api: "none",
        frontend: ["svelte"],
        addons: ["none"],
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

    it("should fail with AI example + Convex + Nuxt", async () => {
      const result = await runTRPCTest({
        projectName: "ai-convex-nuxt-fail",
        examples: ["ai"],
        backend: "convex",
        runtime: "none",
        database: "none",
        orm: "none",
        auth: "none",
        api: "none",
        frontend: ["nuxt"],
        addons: ["none"],
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

    it("should fail with Convex + Solid (blocked at backend level)", async () => {
      const result = await runTRPCTest({
        projectName: "convex-solid-fail",
        examples: ["none"],
        backend: "convex",
        runtime: "none",
        database: "none",
        orm: "none",
        auth: "none",
        api: "none",
        frontend: ["solid"],
        addons: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        expectError: true,
      });

      expectError(
        result,
        "The following frontends are not compatible with '--backend convex': solid",
      );
    });
  });

  describe("Examples with None Option", () => {
    it("should work with examples none", async () => {
      const result = await runTRPCTest({
        projectName: "no-examples",
        examples: ["none"],
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

    it("should fail with none + other examples", async () => {
      const result = await runTRPCTest({
        projectName: "none-with-examples-fail",
        examples: ["none", "ai"],
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
        expectError: true,
      });

      expectError(result, "Cannot combine 'none' with other examples");
    });
  });

  describe("All Example Types", () => {
    for (const example of EXAMPLES) {
      if (example === "none") continue;

      it(`should work with ${example} example in appropriate setup`, async () => {
        const config: TestConfig = {
          projectName: `test-${example}`,
          examples: [example],
          backend: example === "chat-sdk" ? "self" : "hono",
          runtime: example === "chat-sdk" ? "none" : "bun",
          database: "sqlite",
          orm: "drizzle",
          auth: "none",
          api: "trpc",
          frontend: [example === "chat-sdk" ? "next" : "tanstack-router"],
          addons: ["none"],
          dbSetup: "none",
          webDeploy: "none",
          serverDeploy: "none",
          ...(example === "chat-sdk" ? { ai: "none" as const } : {}),
          install: false,
        };

        const result = await runTRPCTest(config);
        expectSuccess(result);
      });
    }
  });

  describe("Example Edge Cases", () => {
    it("should work with empty examples array", async () => {
      const result = await runTRPCTest({
        projectName: "empty-examples",
        examples: ["none"],
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

  describe("Chat SDK Example", () => {
    it("should scaffold Next.js self backend Slack profile", async () => {
      const result = await runTRPCTest({
        projectName: "chat-sdk-next",
        examples: ["chat-sdk"],
        backend: "self",
        runtime: "none",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "trpc",
        frontend: ["next"],
        addons: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        ai: "none",
        install: false,
      });

      expectSuccess(result);
      expect(result.projectDir).toBeDefined();

      const projectDir = result.projectDir!;
      const routeFile = await Bun.file(
        join(projectDir, "apps/web/src/app/api/webhooks/[platform]/route.ts"),
      ).text();
      const botFile = await Bun.file(join(projectDir, "apps/web/src/lib/chat-bot.tsx")).text();
      const webPkg = await Bun.file(join(projectDir, "apps/web/package.json")).json();

      expect(routeFile).toContain("chatBot.webhooks");
      expect(botFile).toContain("createSlackAdapter");
      expect(webPkg.dependencies.chat).toBeDefined();
      expect(webPkg.dependencies["@chat-adapter/slack"]).toBeDefined();
      expect(webPkg.dependencies["@chat-adapter/state-memory"]).toBeDefined();
    });

    it("should scaffold TanStack Start self backend Slack profile", async () => {
      const result = await runTRPCTest({
        projectName: "chat-sdk-tss",
        examples: ["chat-sdk"],
        backend: "self",
        runtime: "none",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "trpc",
        frontend: ["tanstack-start"],
        addons: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        ai: "none",
        install: false,
      });

      expectSuccess(result);
      expect(result.projectDir).toBeDefined();

      const projectDir = result.projectDir!;
      const routeFile = await Bun.file(join(projectDir, "apps/web/src/routes/api/webhooks/$.ts")).text();
      const webPkg = await Bun.file(join(projectDir, "apps/web/package.json")).json();

      expect(routeFile).toContain("createFileRoute(\"/api/webhooks/$\")");
      expect(routeFile).toContain("chatBot.webhooks");
      expect(webPkg.dependencies["@chat-adapter/slack"]).toBeDefined();
    });

    it("should scaffold Nuxt self backend Discord profile (requires vercel-ai)", async () => {
      const result = await runTRPCTest({
        projectName: "chat-sdk-nuxt",
        examples: ["chat-sdk"],
        backend: "self",
        runtime: "none",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "orpc",
        frontend: ["nuxt"],
        addons: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        ai: "vercel-ai",
        install: false,
      });

      expectSuccess(result);
      expect(result.projectDir).toBeDefined();

      const projectDir = result.projectDir!;
      const botFile = await Bun.file(join(projectDir, "apps/web/server/lib/chat-bot.tsx")).text();
      const gatewayFile = await Bun.file(
        join(projectDir, "apps/web/server/api/discord/gateway.get.ts"),
      ).text();
      const webEnv = await Bun.file(join(projectDir, "apps/web/.env")).text();
      const webPkg = await Bun.file(join(projectDir, "apps/web/package.json")).json();

      expect(botFile).toContain("createDiscordAdapter");
      expect(gatewayFile).toContain("startGatewayListener");
      expect(webEnv).toContain("DISCORD_BOT_TOKEN");
      expect(webEnv).toContain("ANTHROPIC_API_KEY");
      expect(webPkg.dependencies["@chat-adapter/discord"]).toBeDefined();
      expect(webPkg.dependencies["@ai-sdk/anthropic"]).toBeDefined();
    });

    it("should scaffold Hono Node GitHub review profile (requires vercel-ai)", async () => {
      const result = await runTRPCTest({
        projectName: "chat-sdk-hono-node",
        examples: ["chat-sdk"],
        backend: "hono",
        runtime: "node",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "trpc",
        frontend: ["tanstack-router"],
        addons: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        ai: "vercel-ai",
        install: false,
      });

      expectSuccess(result);
      expect(result.projectDir).toBeDefined();

      const projectDir = result.projectDir!;
      const serverIndex = await Bun.file(join(projectDir, "apps/server/src/index.ts")).text();
      const botFile = await Bun.file(join(projectDir, "apps/server/src/bot.ts")).text();
      const reviewFile = await Bun.file(join(projectDir, "apps/server/src/review.ts")).text();
      const serverEnv = await Bun.file(join(projectDir, "apps/server/.env")).text();
      const serverPkg = await Bun.file(join(projectDir, "apps/server/package.json")).json();

      expect(serverIndex).toContain("/api/webhooks/github");
      expect(botFile).toContain("createGitHubAdapter");
      expect(reviewFile).toContain("Sandbox.create");
      expect(serverEnv).toContain("GITHUB_WEBHOOK_SECRET");
      expect(serverPkg.dependencies["@chat-adapter/github"]).toBeDefined();
      expect(serverPkg.dependencies["@vercel/sandbox"]).toBeDefined();
      expect(serverPkg.dependencies["bash-tool"]).toBeDefined();
    });

    it("should fail with Hono + Bun runtime", async () => {
      const result = await runTRPCTest({
        projectName: "chat-sdk-hono-bun-fail",
        examples: ["chat-sdk"],
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
        ai: "vercel-ai",
        expectError: true,
      });

      expectError(result, "The 'chat-sdk' example with Hono requires '--runtime node'");
    });

    it("should fail with Convex backend", async () => {
      const result = await runTRPCTest({
        projectName: "chat-sdk-convex-fail",
        examples: ["chat-sdk"],
        backend: "convex",
        runtime: "none",
        database: "none",
        orm: "none",
        auth: "none",
        api: "none",
        frontend: ["tanstack-router"],
        addons: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        expectError: true,
      });

      expectError(result, "The 'chat-sdk' example is not supported with the Convex backend in v1");
    });

    it("should fail with non-vercel-ai on Nuxt/Hono chat-sdk profiles", async () => {
      const nuxtResult = await runTRPCTest({
        projectName: "chat-sdk-nuxt-ai-fail",
        examples: ["chat-sdk"],
        backend: "self",
        runtime: "none",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "orpc",
        frontend: ["nuxt"],
        addons: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        ai: "langchain",
        expectError: true,
      });

      expectError(nuxtResult, "The 'chat-sdk' example requires '--ai vercel-ai'");
    });
  });
});
