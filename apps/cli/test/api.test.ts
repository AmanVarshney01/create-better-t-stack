import { describe, expect, it } from "bun:test";

import { createVirtual } from "../src/index";
import type { API, Backend, Database, Examples, Frontend, ORM, Runtime } from "../src/types";
import { collectFiles } from "./setup";
import { expectError, expectSuccess, runTRPCTest, type TestConfig } from "./test-utils";

describe("API Configurations", () => {
  describe("tRPC API", () => {
    const reactFrontends = ["tanstack-router", "react-router", "tanstack-start", "next"];

    for (const frontend of reactFrontends) {
      it(`should work with tRPC + ${frontend}`, async () => {
        const result = await runTRPCTest({
          projectName: `trpc-${frontend}`,
          api: "trpc",
          frontend: [frontend as Frontend],
          backend: "hono",
          runtime: "bun",
          database: "sqlite",
          orm: "drizzle",
          auth: "none",
          addons: ["none"],
          examples: ["none"],
          dbSetup: "none",
          webDeploy: "none",
          serverDeploy: "none",
          install: false,
        });

        expectSuccess(result);
      });
    }

    const nativeFrontends = ["native-bare", "native-uniwind", "native-unistyles"];

    for (const frontend of nativeFrontends) {
      it(`should work with tRPC + ${frontend}`, async () => {
        const result = await runTRPCTest({
          projectName: `trpc-${frontend}`,
          api: "trpc",
          frontend: [frontend as Frontend],
          backend: "hono",
          runtime: "bun",
          database: "sqlite",
          orm: "drizzle",
          auth: "none",
          addons: ["none"],
          examples: ["none"],
          dbSetup: "none",
          webDeploy: "none",
          serverDeploy: "none",
          install: false,
        });

        expectSuccess(result);
      });
    }

    it("should fail with tRPC + Nuxt", async () => {
      const result = await runTRPCTest({
        projectName: "trpc-nuxt-fail",
        api: "trpc",
        frontend: ["nuxt"],
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        expectError: true,
      });

      expectError(result, "tRPC API is not supported with 'nuxt' frontend");
    });

    it("should fail with tRPC + Svelte", async () => {
      const result = await runTRPCTest({
        projectName: "trpc-svelte-fail",
        api: "trpc",
        frontend: ["svelte"],
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        expectError: true,
      });

      expectError(result, "tRPC API is not supported with 'svelte' frontend");
    });

    it("should fail with tRPC + Solid", async () => {
      const result = await runTRPCTest({
        projectName: "trpc-solid-fail",
        api: "trpc",
        frontend: ["solid"],
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        expectError: true,
      });

      expectError(result, "tRPC API is not supported with 'solid' frontend");
    });

    const backends = ["hono", "express", "fastify", "elysia"];

    for (const backend of backends) {
      it(`should work with tRPC + ${backend}`, async () => {
        const config: TestConfig = {
          projectName: `trpc-${backend}`,
          api: "trpc",
          backend: backend as Backend,
          frontend: ["tanstack-router"],
          database: "sqlite",
          orm: "drizzle",
          auth: "none",
          addons: ["none"],
          examples: ["none"],
          dbSetup: "none",
          webDeploy: "none",
          serverDeploy: "none",
          install: false,
        };

        if (backend === "elysia") {
          config.runtime = "bun";
        } else {
          config.runtime = "bun";
        }

        const result = await runTRPCTest(config);
        expectSuccess(result);
      });
    }
  });

  describe("oRPC API", () => {
    const frontends = [
      "tanstack-router",
      "react-router",
      "tanstack-start",
      "next",
      "nuxt",
      "svelte",
      "solid",
      "native-bare",
      "native-uniwind",
      "native-unistyles",
    ];

    for (const frontend of frontends) {
      it(`should work with oRPC + ${frontend}`, async () => {
        const result = await runTRPCTest({
          projectName: `orpc-${frontend}`,
          api: "orpc",
          frontend: [frontend as Frontend],
          backend: "hono",
          runtime: "bun",
          database: "sqlite",
          orm: "drizzle",
          auth: "none",
          addons: ["none"],
          examples: ["none"],
          dbSetup: "none",
          webDeploy: "none",
          serverDeploy: "none",
          install: false,
        });

        expectSuccess(result);
      });
    }

    const backends = ["hono", "express", "fastify", "elysia"];

    for (const backend of backends) {
      it(`should work with oRPC + ${backend}`, async () => {
        const config: TestConfig = {
          projectName: `orpc-${backend}`,
          api: "orpc",
          backend: backend as Backend,
          frontend: ["tanstack-router"],
          database: "sqlite",
          orm: "drizzle",
          auth: "none",
          addons: ["none"],
          examples: ["none"],
          dbSetup: "none",
          webDeploy: "none",
          serverDeploy: "none",
          install: false,
        };

        if (backend === "elysia") {
          config.runtime = "bun";
        } else {
          config.runtime = "bun";
        }

        const result = await runTRPCTest(config);
        expectSuccess(result);
      });
    }
  });

  describe("No API", () => {
    it("should work with API none + basic setup", async () => {
      const result = await runTRPCTest({
        projectName: "api-none-basic",
        api: "none",
        frontend: ["tanstack-router"],
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });

    it("should work with API none + frontend only", async () => {
      const result = await runTRPCTest({
        projectName: "api-none-frontend-only",
        api: "none",
        frontend: ["tanstack-router"],
        backend: "none",
        runtime: "none",
        database: "none",
        orm: "none",
        auth: "none",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });

    it("should work with API none + convex", async () => {
      const result = await runTRPCTest({
        projectName: "api-none-convex",
        api: "none",
        frontend: ["tanstack-router"],
        backend: "convex",
        runtime: "none",
        database: "none",
        orm: "none",
        auth: "none",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });

    it("should fail with API none + examples (non-convex backend)", async () => {
      const result = await runTRPCTest({
        projectName: "api-none-examples-fail",
        api: "none",
        frontend: ["tanstack-router"],
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        addons: ["none"],
        examples: ["todo"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        expectError: true,
      });

      expectError(result);
    });

    it("should work with API none + examples + convex backend", async () => {
      const result = await runTRPCTest({
        projectName: "api-none-examples-convex",
        api: "none",
        frontend: ["tanstack-router"],
        backend: "convex",
        runtime: "none",
        database: "none",
        orm: "none",
        auth: "none",
        addons: ["none"],
        examples: ["todo"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });
  });

  describe("API with Different Database Combinations", () => {
    const apiDatabaseCombinations = [
      { api: "trpc", database: "sqlite", orm: "drizzle" },
      { api: "trpc", database: "postgres", orm: "drizzle" },
      { api: "trpc", database: "mysql", orm: "prisma" },
      { api: "trpc", database: "mongodb", orm: "mongoose" },
      { api: "orpc", database: "sqlite", orm: "drizzle" },
      { api: "orpc", database: "postgres", orm: "prisma" },
      { api: "orpc", database: "mysql", orm: "drizzle" },
      { api: "orpc", database: "mongodb", orm: "prisma" },
    ];

    for (const { api, database, orm } of apiDatabaseCombinations) {
      it(`should work with ${api} + ${database} + ${orm}`, async () => {
        const result = await runTRPCTest({
          projectName: `${api}-${database}-${orm}`,
          api: api as API,
          database: database as Database,
          orm: orm as ORM,
          frontend: ["tanstack-router"],
          backend: "hono",
          runtime: "bun",
          auth: "none",
          addons: ["none"],
          examples: ["none"],
          dbSetup: "none",
          webDeploy: "none",
          serverDeploy: "none",
          install: false,
        });

        expectSuccess(result);
      });
    }
  });

  describe("API with Authentication", () => {
    it("should work with tRPC + better-auth", async () => {
      const result = await runTRPCTest({
        projectName: "trpc-better-auth",
        api: "trpc",
        auth: "better-auth",
        frontend: ["tanstack-router"],
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });

    it("should work with oRPC + better-auth", async () => {
      const result = await runTRPCTest({
        projectName: "orpc-better-auth",
        api: "orpc",
        auth: "better-auth",
        frontend: ["tanstack-router"],
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });

    it("should work with API none + convex + clerk", async () => {
      const result = await runTRPCTest({
        projectName: "api-none-convex-clerk",
        api: "none",
        auth: "clerk",
        frontend: ["tanstack-router"],
        backend: "convex",
        runtime: "none",
        database: "none",
        orm: "none",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });
  });

  describe("API with Examples", () => {
    it("should work with tRPC + todo example", async () => {
      const result = await runTRPCTest({
        projectName: "trpc-todo",
        api: "trpc",
        examples: ["todo"],
        frontend: ["tanstack-router"],
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        addons: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });

    it("should work with oRPC + AI example", async () => {
      const result = await runTRPCTest({
        projectName: "orpc-ai",
        api: "orpc",
        examples: ["ai"],
        frontend: ["tanstack-router"],
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        addons: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });

    const apiExampleCombinations = [
      { api: "trpc", examples: ["todo", "ai"] },
      { api: "orpc", examples: ["todo", "ai"] },
    ];

    for (const { api, examples } of apiExampleCombinations) {
      it(`should work with ${api} + both examples`, async () => {
        const result = await runTRPCTest({
          projectName: `${api}-both-examples`,
          api: api as API,
          examples: examples as Examples[],
          frontend: ["tanstack-router"],
          backend: "hono",
          runtime: "bun",
          database: "sqlite",
          orm: "drizzle",
          auth: "none",
          addons: ["none"],
          dbSetup: "none",
          webDeploy: "none",
          serverDeploy: "none",
          install: false,
        });

        expectSuccess(result);
      });
    }
  });

  describe("All API Types", () => {
    const apis = ["trpc", "orpc", "none"];

    for (const api of apis) {
      it(`should work with ${api} API`, async () => {
        const config: TestConfig = {
          projectName: `test-api-${api}`,
          api: api as API,
          addons: ["none"],
          examples: ["none"],
          dbSetup: "none",
          webDeploy: "none",
          serverDeploy: "none",
          install: false,
        };

        if (api === "none") {
          config.backend = "none";
          config.runtime = "none";
          config.database = "none";
          config.orm = "none";
          config.auth = "none";
          config.frontend = ["tanstack-router"];
        } else {
          config.backend = "hono";
          config.runtime = "bun";
          config.database = "sqlite";
          config.orm = "drizzle";
          config.auth = "none";
          config.frontend = ["tanstack-router"];
        }

        const result = await runTRPCTest(config);
        expectSuccess(result);
      });
    }
  });

  describe("API Edge Cases", () => {
    it("should scaffold Fastify oRPC context with matching request shapes", async () => {
      const result = await createVirtual({
        projectName: "fastify-orpc-request-shape",
        api: "orpc",
        frontend: ["tanstack-router"],
        backend: "fastify",
        runtime: "node",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
        git: false,
        packageManager: "bun",
        payments: "none",
      });

      if (result.isErr()) {
        throw result.error;
      }

      const files = collectFiles(result.value.root, result.value.root.path);
      const serverFile = files.get("apps/server/src/index.ts");
      const contextFile = files.get("packages/api/src/context.ts");

      expect(serverFile).toContain("context: await createContext(request.headers)");
      expect(contextFile).toContain('import type { IncomingHttpHeaders } from "node:http";');
      expect(contextFile).toContain(
        "export async function createContext(req: IncomingHttpHeaders)",
      );
    });

    it("should scaffold SvelteKit self backend oRPC routes and same-origin clients", async () => {
      const result = await createVirtual({
        projectName: "svelte-self-orpc",
        api: "orpc",
        frontend: ["svelte"],
        backend: "self",
        runtime: "none",
        database: "sqlite",
        orm: "drizzle",
        auth: "better-auth",
        addons: ["none"],
        examples: ["ai"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
        git: false,
        packageManager: "bun",
        payments: "none",
      });

      if (result.isErr()) {
        throw result.error;
      }

      const files = collectFiles(result.value.root, result.value.root.path);
      const rpcRoute = files.get("apps/web/src/routes/rpc/[...rest]/+server.ts");
      const orpcClient = files.get("apps/web/src/lib/orpc.ts");
      const hooks = files.get("apps/web/src/hooks.server.ts");
      const authClient = files.get("apps/web/src/lib/auth-client.ts");
      const aiRoute = files.get("apps/web/src/routes/api/ai/+server.ts");
      const aiPage = files.get("apps/web/src/routes/ai/+page.svelte");
      const contextFile = files.get("packages/api/src/context.ts");

      expect(rpcRoute).toContain('prefix: "/rpc"');
      expect(rpcRoute).toContain('prefix: "/rpc/api-reference"');
      expect(orpcClient).toContain("globalThis.$client ?? createORPCClient(link)");
      expect(orpcClient).toContain("window.location.origin");
      expect(hooks).toContain('import "./lib/orpc.server";');
      expect(hooks).toContain("svelteKitHandler");
      expect(authClient).not.toContain("PUBLIC_SERVER_URL");
      expect(aiRoute).toContain("export const POST");
      expect(aiPage).toContain('api: "/api/ai"');
      expect(contextFile).toContain("export async function createContext({ headers }");
    });

    it("should scaffold SvelteKit self backend with Alchemy-compatible Cloudflare env access", async () => {
      const result = await createVirtual({
        projectName: "svelte-self-cloudflare",
        api: "orpc",
        frontend: ["svelte"],
        backend: "self",
        runtime: "none",
        database: "sqlite",
        orm: "drizzle",
        auth: "better-auth",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "cloudflare",
        serverDeploy: "none",
        install: false,
        git: false,
        packageManager: "bun",
        payments: "none",
      });

      if (result.isErr()) {
        throw result.error;
      }

      const files = collectFiles(result.value.root, result.value.root.path);
      const envServer = files.get("packages/env/src/server.ts");
      const rpcRoute = files.get("apps/web/src/routes/rpc/[...rest]/+server.ts");
      const hooks = files.get("apps/web/src/hooks.server.ts");
      const appDts = files.get("apps/web/src/app.d.ts");
      const tsconfig = files.get("apps/web/tsconfig.json");
      const orpcServer = files.get("apps/web/src/lib/orpc.server.ts");
      const orpcClient = files.get("apps/web/src/lib/orpc.ts");
      const svelteConfig = files.get("apps/web/svelte.config.js");
      const alchemyConfig = files.get("packages/infra/alchemy.run.ts");

      expect(envServer).toContain("export type RuntimeEnv = Env");
      expect(envServer).not.toContain("getCloudflareEnv");
      expect(envServer).not.toContain("createEnvProxy");
      expect(envServer).not.toContain("process.env");
      expect(envServer).not.toContain("export const env");
      expect(envServer).not.toContain('from "$app/server"');
      expect(envServer).not.toContain('from "cloudflare:workers"');
      expect(rpcRoute).toContain("env: platform.env");
      expect(hooks).toContain("createAuth(event.platform.env)");
      expect(appDts).toContain("interface Platform");
      expect(appDts).toContain("env: Env");
      expect(appDts).toContain("ctx: ExecutionContext");
      expect(appDts).toContain("caches: CacheStorage");
      expect(appDts).toContain("cf: IncomingRequestCfProperties");
      expect(appDts).toContain("var $client: AppRouterClient | undefined");
      expect(tsconfig).toContain("@cloudflare/workers-types");
      expect(tsconfig).toContain("../../packages/env/env.d.ts");
      expect(orpcServer).not.toContain("declare global");
      expect(orpcClient).not.toContain("declare global");
      expect(svelteConfig).toContain("alchemy/cloudflare/sveltekit");
      expect(svelteConfig).toContain("adapter: alchemy()");
      expect(alchemyConfig).toContain('export const web = await SvelteKit("web"');
      expect(alchemyConfig).toContain('domain: "localhost:5173"');
    });

    it("should handle API with complex frontend combinations", async () => {
      const result = await runTRPCTest({
        projectName: "api-complex-frontend",
        api: "trpc",
        frontend: ["tanstack-router", "native-bare"],
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });

    it("should handle API with workers runtime", async () => {
      const result = await runTRPCTest({
        projectName: "api-workers",
        api: "trpc",
        frontend: ["tanstack-router"],
        backend: "hono",
        runtime: "workers",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "cloudflare",
        install: false,
      });

      expectSuccess(result);
    });

    const runtimeApiCombinations = [
      { runtime: "bun", api: "trpc" },
      { runtime: "node", api: "orpc" },
      { runtime: "workers", api: "trpc" },
    ];

    for (const { runtime, api } of runtimeApiCombinations) {
      it(`should handle ${api} with ${runtime} runtime`, async () => {
        const config: TestConfig = {
          projectName: `${runtime}-${api}`,
          api: api as API,
          runtime: runtime as Runtime,
          frontend: ["tanstack-router"],
          backend: "hono",
          database: "sqlite",
          orm: "drizzle",
          auth: "none",
          addons: ["none"],
          examples: ["none"],
          dbSetup: "none",
          webDeploy: "none",
          serverDeploy: "none",
          install: false,
        };

        if (runtime === "workers") {
          config.serverDeploy = "cloudflare";
        }

        const result = await runTRPCTest(config);
        expectSuccess(result);
      });
    }
  });
});
