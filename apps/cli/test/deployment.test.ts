import { describe, expect, it } from "bun:test";

import { createVirtual } from "../src/index";
import { collectFiles } from "./setup";
import {
  expectError,
  expectSuccess,
  runTRPCTest,
  SERVER_DEPLOYS,
  type TestConfig,
  WEB_DEPLOYS,
} from "./test-utils";

describe("Deployment Configurations", () => {
  describe("Web Deployment", () => {
    describe("Valid Web Deploy Configurations", () => {
      for (const webDeploy of WEB_DEPLOYS) {
        if (webDeploy === "none") continue;

        it(`should work with ${webDeploy} web deploy + web frontend`, async () => {
          const result = await runTRPCTest({
            projectName: `${webDeploy}-web-deploy`,
            webDeploy: webDeploy,
            serverDeploy: "none",
            frontend: ["tanstack-router"],
            backend: "hono",
            runtime: "bun",
            database: "sqlite",
            orm: "drizzle",
            auth: "none",
            api: "trpc",
            addons: ["none"],
            examples: ["none"],
            dbSetup: "none",
            install: false,
          });

          expectSuccess(result);
        });
      }
    });

    it("should work with web deploy none", async () => {
      const result = await runTRPCTest({
        projectName: "no-web-deploy",
        webDeploy: "none",
        serverDeploy: "none",
        frontend: ["tanstack-router"],
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "trpc",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        install: false,
      });

      expectSuccess(result);
    });

    it("should fail with web deploy but no web frontend", async () => {
      const result = await runTRPCTest({
        projectName: "web-deploy-no-web-frontend-fail",
        webDeploy: "cloudflare",
        serverDeploy: "none",
        frontend: ["native-bare"], // Native frontend only
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "trpc",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        expectError: true,
      });

      expectError(result, "'--web-deploy' requires a web frontend");
    });

    it("should work with web deploy + mixed web and native frontends", async () => {
      const result = await runTRPCTest({
        projectName: "web-deploy-mixed-frontends",
        webDeploy: "cloudflare",
        serverDeploy: "none",
        frontend: ["tanstack-router", "native-bare"],
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "trpc",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        install: false,
      });

      expectSuccess(result);
    });

    it("should work with web deploy + all web frontends", async () => {
      const webFrontends = [
        "tanstack-router",
        "react-router",
        "tanstack-start",
        "next",
        "nuxt",
        "svelte",
        "solid",
        "astro",
      ] as const;

      for (const frontend of webFrontends) {
        const config: TestConfig = {
          projectName: `web-deploy-${frontend}`,
          webDeploy: "cloudflare",
          serverDeploy: "none",
          frontend: [frontend],
          backend: "hono",
          runtime: "bun",
          database: "sqlite",
          orm: "drizzle",
          auth: "none",
          addons: ["none"],
          examples: ["none"],
          dbSetup: "none",
          install: false,
        };

        // Handle API compatibility
        if (["nuxt", "svelte", "solid", "astro"].includes(frontend)) {
          config.api = "orpc";
        } else {
          config.api = "trpc";
        }

        const result = await runTRPCTest(config);
        expectSuccess(result);
      }
    });
  });

  describe("Server Deployment", () => {
    describe("Valid Server Deploy Configurations", () => {
      for (const serverDeploy of SERVER_DEPLOYS) {
        if (serverDeploy === "none") continue;

        it(`should work with ${serverDeploy} server deploy + backend`, async () => {
          const result = await runTRPCTest({
            projectName: `${serverDeploy}-server-deploy`,
            webDeploy: "none",
            serverDeploy: serverDeploy,
            backend: "hono",
            runtime: serverDeploy === "cloudflare" ? "workers" : "bun",
            database: "sqlite",
            orm: "drizzle",
            auth: "none",
            api: "trpc",
            frontend: ["tanstack-router"],
            addons: ["none"],
            examples: ["none"],
            dbSetup: "none",
            install: false,
          });

          expectSuccess(result);
        });
      }
    });

    it("should work with server deploy none", async () => {
      const result = await runTRPCTest({
        projectName: "no-server-deploy",
        webDeploy: "none",
        serverDeploy: "none",
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "trpc",
        frontend: ["tanstack-router"],
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        install: false,
      });

      expectSuccess(result);
    });

    it("should fail with server deploy but no backend", async () => {
      const result = await runTRPCTest({
        projectName: "server-deploy-no-backend-fail",
        webDeploy: "none",
        serverDeploy: "cloudflare",
        backend: "none",
        runtime: "none",
        database: "none",
        orm: "none",
        auth: "none",
        api: "none",
        frontend: ["tanstack-router"],
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        expectError: true,
      });

      expectError(
        result,
        "Backend 'none' requires '--server-deploy none'. Please remove the --server-deploy flag or set it to 'none'.",
      );
    });

    it("should work with server deploy + all compatible backends", async () => {
      const backends = ["hono", "express", "fastify", "elysia"] as const;

      for (const backend of backends) {
        const config: TestConfig = {
          projectName: `server-deploy-${backend}`,
          webDeploy: "none",
          backend,
          database: "sqlite",
          orm: "drizzle",
          auth: "none",
          api: "trpc",
          frontend: ["tanstack-router"],
          addons: ["none"],
          examples: ["none"],
          dbSetup: "none",
          install: false,
          runtime: "workers",
        };

        // Set appropriate runtime
        if (backend === "hono") {
          config.runtime = "workers";
          config.serverDeploy = "cloudflare";
        } else {
          config.runtime = "bun";
          config.serverDeploy = "none";
        }

        const result = await runTRPCTest(config);
        expectSuccess(result);
      }
    });

    it("should fail with server deploy + convex backend", async () => {
      const result = await runTRPCTest({
        projectName: "server-deploy-convex-fail",
        webDeploy: "none",
        serverDeploy: "cloudflare",
        backend: "convex",
        runtime: "none",
        database: "none",
        orm: "none",
        auth: "clerk",
        api: "none",
        frontend: ["tanstack-router"],
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        expectError: true,
      });

      expectError(result, "Convex backend requires '--server-deploy none'");
    });
  });

  describe("Workers Runtime Deployment Constraints", () => {
    it("should work with workers runtime + server deploy", async () => {
      const result = await runTRPCTest({
        projectName: "workers-server-deploy",
        webDeploy: "none",
        runtime: "workers",
        serverDeploy: "cloudflare",
        backend: "hono",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "trpc",
        frontend: ["tanstack-router"],
        addons: ["none"],
        examples: ["none"],
        dbSetup: "d1",
        install: false,
      });

      expectSuccess(result);
    });

    it("should fail with workers runtime + no server deploy", async () => {
      const result = await runTRPCTest({
        projectName: "workers-no-server-deploy-fail",
        runtime: "workers",
        serverDeploy: "none",
        backend: "hono",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "trpc",
        frontend: ["tanstack-router"],
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        expectError: true,
      });

      expectError(result, "Cloudflare Workers runtime requires a server deployment");
    });

    it("should fail with workers runtime + vercel server deploy", async () => {
      const result = await runTRPCTest({
        projectName: "workers-vercel-server-deploy-fail",
        runtime: "workers",
        serverDeploy: "vercel",
        backend: "hono",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "trpc",
        frontend: ["tanstack-router"],
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        expectError: true,
      });

      expectError(result, "'--server-deploy vercel' is not compatible with '--runtime workers'");
    });
  });

  describe("Combined Web and Server Deployment", () => {
    it("should generate Vercel Services for combined web and server deploys", async () => {
      const result = await createVirtual({
        projectName: "next-hono-vercel",
        webDeploy: "vercel",
        serverDeploy: "vercel",
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "better-auth",
        payments: "none",
        api: "trpc",
        frontend: ["next"],
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        install: false,
        git: false,
        packageManager: "bun",
      });

      if (result.isErr()) {
        throw result.error;
      }

      const files = collectFiles(result.value.root, result.value.root.path);
      const vercelJson = files.get("vercel.json") ?? "{}";
      const vercelConfig = JSON.parse(vercelJson) as {
        bunVersion?: string;
        services?: Record<
          string,
          {
            root?: string;
            framework?: string;
            entrypoint?: string;
            buildCommand?: string;
            routes?: Array<Record<string, unknown>>;
          }
        >;
        rewrites?: Array<{
          source?: string;
          destination?: string | { service?: string };
        }>;
      };
      const packageJson = JSON.parse(files.get("package.json") ?? "{}") as {
        scripts?: Record<string, string>;
        devDependencies?: Record<string, string>;
      };

      expect(files.has("vercel.json")).toBe(true);
      expect(files.has("vercel.ts")).toBe(false);
      // Without this, no-git deploys upload local .env files and frameworks
      // like Next.js load the localhost values at runtime
      expect(files.get(".vercelignore")).toContain("**/.env");
      expect(vercelConfig.bunVersion).toBe("1.x");
      expect(vercelConfig.services?.web).toMatchObject({
        root: "apps/web",
        framework: "nextjs",
        buildCommand: "NEXT_PUBLIC_SERVER_URL=/api bun run build",
      });
      expect(vercelConfig.services?.server).toMatchObject({
        root: "apps/server",
        framework: "hono",
        entrypoint: "src/index.ts",
      });
      expect(vercelConfig.services?.server?.routes?.[0]).toMatchObject({
        src: "/api/((?!auth(?:/|$)).*)",
        transforms: [{ type: "request.path", op: "set", args: "/$1" }],
      });
      expect(vercelConfig.rewrites).toEqual([
        { source: "/api/(.*)", destination: { service: "server" } },
        { source: "/(.*)", destination: { service: "web" } },
      ]);
      expect(files.has("scripts/sync-vercel-env.ts")).toBe(true);
      expect(files.has("scripts/sync-vercel-env.mjs")).toBe(false);
      expect(files.get("scripts/sync-vercel-env.ts")).toContain(
        'const DEFAULT_ENVIRONMENT = "preview";',
      );
      expect(files.get("scripts/sync-vercel-env.ts")).toContain('"apps/web/.env"');
      expect(files.get("scripts/sync-vercel-env.ts")).toContain('"apps/server/.env"');
      expect(files.get("scripts/sync-vercel-env.ts")).toContain('"NEXT_PUBLIC_SERVER_URL", "/api"');
      expect(files.get("scripts/sync-vercel-env.ts")).toContain('"CORS_ORIGIN"');
      // Vercel CLI runs through the stack's package runner (local devDep)
      expect(files.get("scripts/sync-vercel-env.ts")).toContain('["bunx", "vercel"]');
      expect(files.get("scripts/sync-vercel-env.ts")).not.toContain("LOCAL_VERCEL_BIN");
      expect(files.get("scripts/sync-vercel-env.ts")).toContain("passthroughArgs");
      // Preview syncs must be non-interactive so the piped-stdin value does not
      // collide with Vercel's interactive "Git branch?" prompt.
      expect(files.get("scripts/sync-vercel-env.ts")).toContain('"--non-interactive"');
      expect(files.get("scripts/sync-vercel-env.ts")).toContain('import dotenv from "dotenv"');
      expect(files.get("scripts/sync-vercel-env.ts")).toContain("dotenv.parse");
      expect(files.get("scripts/sync-vercel-env.ts")).toContain("new Map<string, string>");
      expect(files.get("scripts/sync-vercel-env.ts")).not.toContain("function parseEnvFile");

      expect(packageJson.devDependencies).not.toHaveProperty("@vercel/config");
      expect(packageJson.devDependencies).toHaveProperty("@types/node");
      expect(packageJson.devDependencies).toHaveProperty("tsx");
      expect(packageJson.devDependencies).toHaveProperty("vercel");
      // dotenv comes from workspace-deps as a regular dependency; it must not
      // be duplicated into devDependencies (bun warns on cross-section dupes)
      expect(packageJson.devDependencies).not.toHaveProperty("dotenv");
      expect(packageJson.scripts).toMatchObject({
        "deploy:setup": "vercel link",
        "dev:vercel": "vercel dev -L",
        "env:preview": "tsx scripts/sync-vercel-env.ts preview",
        "env:production": "tsx scripts/sync-vercel-env.ts production",
        deploy: "vercel deploy",
        "deploy:prod": "vercel deploy --prod",
        "deploy:check": "vercel deploy --dry",
      });
      expect(packageJson.scripts).not.toHaveProperty("deploy:vercel");
      expect(files.get("packages/env/src/web.ts")).toContain("const serverUrlSchema = z.union");
      expect(files.get("packages/env/src/server.ts")).toContain("function getVercelOrigin()");
      // Server-side better-auth must build public callback URLs through the
      // /api rewrite prefix, not the bare origin
      expect(files.get("packages/env/src/server.ts")).toContain("${vercelOrigin}/api/auth");
      // better-auth and tRPC clients must normalize the same-origin /api path;
      // both reject relative URLs (BetterAuthError / SSR fetch failure)
      const authClient = files.get("apps/web/src/lib/auth-client.ts") ?? "";
      expect(authClient).toContain("function getServerUrl(url: string)");
      // The /api/auth suffix is required: better-auth uses a baseURL with a
      // path as-is, so the origin-only shortcut breaks same-origin deploys
      expect(authClient).toContain(
        'baseURL: new URL("/api/auth", getServerUrl(env.NEXT_PUBLIC_SERVER_URL)).toString()',
      );
      const trpcClient = files.get("apps/web/src/utils/trpc.ts") ?? "";
      expect(trpcClient).toContain("url: `${getServerUrl(env.NEXT_PUBLIC_SERVER_URL)}/trpc`");
      expect(files.get("README.md")).toContain("### Vercel Services");
      expect(files.get("README.md")).toContain("Sync preview env");
      expect(files.get("README.md")).toContain("Config: `vercel.json`");
      expect(files.get("README.md")).toContain("env:production --scope your-team");
      expect(files.get("README.md")).toContain("https://www.better-t-stack.dev/docs/guides/vercel");
    });

    it("should name deploy scripts by target for mixed Vercel + Cloudflare deploys", async () => {
      const result = await createVirtual({
        projectName: "mixed-vercel-cf",
        webDeploy: "vercel",
        serverDeploy: "cloudflare",
        backend: "hono",
        runtime: "workers",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        payments: "none",
        api: "trpc",
        frontend: ["tanstack-router"],
        addons: ["none"],
        examples: ["none"],
        dbSetup: "d1",
        install: false,
        git: false,
        packageManager: "bun",
      });

      if (result.isErr()) {
        throw result.error;
      }

      const files = collectFiles(result.value.root, result.value.root.path);
      const pkg = JSON.parse(files.get("package.json") ?? "{}") as {
        scripts?: Record<string, string>;
      };

      // Different platforms per target: scripts are named by what they deploy
      expect(pkg.scripts?.["deploy:web"]).toBe("vercel deploy");
      expect(pkg.scripts?.["deploy:web:prod"]).toBe("vercel deploy --prod");
      expect(pkg.scripts?.["deploy:server"]).toContain("deploy");
      expect(pkg.scripts?.destroy).toContain("destroy");
      expect(pkg.scripts).not.toHaveProperty("deploy");
      expect(pkg.scripts?.["deploy:setup"]).toBe("vercel link");
      expect(pkg.scripts?.["env:production"]).toBe("tsx scripts/sync-vercel-env.ts production");
    });

    it("should normalize relative Vercel oRPC URLs before creating RPC links", async () => {
      const result = await createVirtual({
        projectName: "orpc-vercel-url",
        webDeploy: "vercel",
        serverDeploy: "vercel",
        backend: "express",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        payments: "none",
        api: "orpc",
        frontend: ["tanstack-router"],
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        install: false,
        git: false,
        packageManager: "bun",
      });

      if (result.isErr()) {
        throw result.error;
      }

      const files = collectFiles(result.value.root, result.value.root.path);
      const vercelConfig = JSON.parse(files.get("vercel.json") ?? "{}") as {
        services?: Record<string, { buildCommand?: string }>;
      };
      const orpcClient = files.get("apps/web/src/utils/orpc.ts") ?? "";

      expect(vercelConfig.services?.web?.buildCommand).toBe("VITE_SERVER_URL=/api bun run build");
      // SPA frontends on the plain vite preset need an in-service fallback,
      // otherwise deep links like /login 404 in production
      expect(
        (vercelConfig.services?.web as { rewrites?: unknown[] } | undefined)?.rewrites,
      ).toEqual([{ source: "/(.*)", destination: "/index.html" }]);
      expect(files.get("packages/env/src/web.ts")).toContain(
        "Use an absolute URL or a same-origin path like /api",
      );
      expect(orpcClient).toContain("function getServerUrl(url: string)");
      expect(orpcClient).toContain("window.location.origin");
      expect(orpcClient).toContain("VERCEL_PROJECT_PRODUCTION_URL");
      // Preview/branch SSR must resolve the current deployment, not production.
      expect(orpcClient).toContain('VERCEL_ENV === "production"');
      expect(orpcClient).toContain("url: `${getServerUrl(env.VITE_SERVER_URL)}/rpc`");
    });

    it("should generate Vercel web-only config for self fullstack backends", async () => {
      const result = await createVirtual({
        projectName: "next-self-vercel",
        webDeploy: "vercel",
        serverDeploy: "none",
        backend: "self",
        runtime: "none",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        payments: "none",
        api: "trpc",
        frontend: ["next"],
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        install: false,
        git: false,
        packageManager: "pnpm",
      });

      if (result.isErr()) {
        throw result.error;
      }

      const files = collectFiles(result.value.root, result.value.root.path);
      const vercelConfig = JSON.parse(files.get("vercel.json") ?? "{}") as {
        services?: Record<string, { root?: string }>;
        rewrites?: Array<{ source?: string; destination?: string | { service?: string } }>;
      };

      expect(files.has("vercel.ts")).toBe(false);
      expect(vercelConfig.services?.web).toMatchObject({ root: "apps/web" });
      expect(vercelConfig.services?.server).toBeUndefined();
      expect(vercelConfig.rewrites).toEqual([{ source: "/(.*)", destination: { service: "web" } }]);
      // self fullstack apps run ON Vercel, so origin-dependent keys must be
      // skipped and derived at runtime — synced localhost values break auth
      const syncScript = files.get("scripts/sync-vercel-env.ts") ?? "";
      expect(syncScript).toContain('"BETTER_AUTH_URL"');
      expect(syncScript).toContain('"CORS_ORIGIN"');
    });

    it("should skip origin-derived envs for server-only Vercel deploys", async () => {
      const result = await createVirtual({
        projectName: "native-hono-vercel",
        webDeploy: "none",
        serverDeploy: "vercel",
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "better-auth",
        payments: "none",
        api: "trpc",
        frontend: ["native-bare"],
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        install: false,
        git: false,
        packageManager: "bun",
      });

      if (result.isErr()) {
        throw result.error;
      }

      const files = collectFiles(result.value.root, result.value.root.path);
      const syncScript = files.get("scripts/sync-vercel-env.ts") ?? "";

      // BETTER_AUTH_URL always derives from the deployment's own origin, and
      // Vercel manages NODE_ENV — pushing local values breaks production auth
      expect(syncScript).toContain('"BETTER_AUTH_URL"');
      expect(syncScript).toContain('"NODE_ENV"');
      // CORS_ORIGIN must sync: with the web app on another host it is not derivable
      expect(syncScript).not.toContain('"CORS_ORIGIN"');
    });

    it("should export Elysia apps for Vercel server deployments", async () => {
      const result = await createVirtual({
        projectName: "elysia-vercel",
        webDeploy: "none",
        serverDeploy: "vercel",
        backend: "elysia",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        payments: "none",
        api: "trpc",
        frontend: ["tanstack-router"],
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        install: false,
        git: false,
        packageManager: "bun",
      });

      if (result.isErr()) {
        throw result.error;
      }

      const files = collectFiles(result.value.root, result.value.root.path);
      const serverEntry = files.get("apps/server/src/index.ts");

      expect(serverEntry).toContain("const app = new Elysia()");
      expect(serverEntry).toContain("export default app;");
      // Bun does not auto-serve Elysia's default export, so a guarded local
      // listen must remain (skipped on Vercel via process.env.VERCEL).
      expect(serverEntry).toContain("if (!process.env.VERCEL)");
      expect(serverEntry).toContain("app.listen(3000");
    });

    it("should guard the local Elysia listen for node-runtime Vercel deploys", async () => {
      const result = await createVirtual({
        projectName: "elysia-node-vercel",
        webDeploy: "none",
        serverDeploy: "vercel",
        backend: "elysia",
        runtime: "node",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        payments: "none",
        api: "trpc",
        frontend: ["tanstack-router"],
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        install: false,
        git: false,
        packageManager: "bun",
      });

      if (result.isErr()) {
        throw result.error;
      }

      const files = collectFiles(result.value.root, result.value.root.path);
      const serverEntry = files.get("apps/server/src/index.ts");

      // node has no default-export auto-serve, so it must still listen locally
      // while exporting the app for Vercel functions.
      expect(serverEntry).toContain("export default app;");
      expect(serverEntry).toContain("if (!process.env.VERCEL)");
      expect(serverEntry).toContain("app.listen(3000");
    });

    it("should use the react-router preset for SSR React Router Vercel deploys", async () => {
      const result = await createVirtual({
        projectName: "rr-vercel-ssr",
        webDeploy: "vercel",
        serverDeploy: "vercel",
        backend: "hono",
        runtime: "bun",
        database: "none",
        orm: "none",
        auth: "none",
        payments: "none",
        api: "orpc",
        frontend: ["react-router"],
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        install: false,
        git: false,
        packageManager: "bun",
      });

      if (result.isErr()) {
        throw result.error;
      }

      const files = collectFiles(result.value.root, result.value.root.path);
      const web = (
        JSON.parse(files.get("vercel.json") ?? "{}") as {
          services?: Record<string, Record<string, unknown>>;
        }
      ).services?.web;

      // SSR is the default: the react-router preset serves the server build,
      // so no static outputDirectory or SPA fallback is generated
      expect(web?.framework).toBe("react-router");
      expect(web?.outputDirectory).toBeUndefined();
      expect(web?.rewrites).toBeUndefined();
      expect(files.get("apps/web/react-router.config.ts")).not.toContain("ssr: false");
      // Vercel functions have no node_modules; deps must be bundled into the server build
      expect(files.get("apps/web/vite.config.ts")).toContain("noExternal: true");
    });

    it("should use the explicit Vercel adapter for SvelteKit Vercel deploys", async () => {
      const result = await createVirtual({
        projectName: "svelte-vercel",
        webDeploy: "vercel",
        serverDeploy: "vercel",
        backend: "hono",
        runtime: "bun",
        database: "none",
        orm: "none",
        auth: "none",
        payments: "none",
        api: "orpc",
        frontend: ["svelte"],
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        install: false,
        git: false,
        packageManager: "bun",
      });

      if (result.isErr()) {
        throw result.error;
      }

      const files = collectFiles(result.value.root, result.value.root.path);
      const svelteConfig = files.get("apps/web/svelte.config.js");
      const webPkg = JSON.parse(files.get("apps/web/package.json") ?? "{}");

      // Vercel docs recommend the explicit adapter over adapter-auto
      expect(svelteConfig).toContain("@sveltejs/adapter-vercel");
      expect(svelteConfig).not.toContain("@sveltejs/adapter-auto");
      expect(webPkg.devDependencies["@sveltejs/adapter-vercel"]).toBeDefined();
    });

    it("should wire nitro into TanStack Start Vercel web deploys", async () => {
      const result = await createVirtual({
        projectName: "start-vercel",
        webDeploy: "vercel",
        serverDeploy: "vercel",
        backend: "fastify",
        runtime: "bun",
        database: "none",
        orm: "none",
        auth: "none",
        payments: "none",
        api: "orpc",
        frontend: ["tanstack-start"],
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        install: false,
        git: false,
        packageManager: "bun",
      });

      if (result.isErr()) {
        throw result.error;
      }

      const files = collectFiles(result.value.root, result.value.root.path);
      const viteConfig = files.get("apps/web/vite.config.ts") ?? "";
      const webPkg = JSON.parse(files.get("apps/web/package.json") ?? "{}") as {
        dependencies?: Record<string, string>;
      };

      // Without nitro the Start build is a plain node server Vercel cannot serve
      expect(viteConfig).toContain('import { nitro } from "nitro/vite"');
      expect(viteConfig).toContain("nitro(),");
      expect(viteConfig).toContain("noExternal: true");
      expect(webPkg.dependencies).toHaveProperty("nitro");
    });

    it("should use the Vercel adapter for Astro web deploys", async () => {
      const result = await createVirtual({
        projectName: "astro-vercel",
        webDeploy: "vercel",
        serverDeploy: "vercel",
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        payments: "none",
        api: "orpc",
        frontend: ["astro"],
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        install: false,
        git: false,
        packageManager: "bun",
      });

      if (result.isErr()) {
        throw result.error;
      }

      const files = collectFiles(result.value.root, result.value.root.path);
      const astroConfig = files.get("apps/web/astro.config.mjs") ?? "";
      const webPkg = JSON.parse(files.get("apps/web/package.json") ?? "{}") as {
        dependencies?: Record<string, string>;
      };

      expect(astroConfig).toContain('import vercel from "@astrojs/vercel"');
      expect(astroConfig).toContain("adapter: vercel()");
      expect(astroConfig).not.toContain("@astrojs/node");
      expect(webPkg.dependencies).toHaveProperty("@astrojs/vercel");
      expect(webPkg.dependencies).not.toHaveProperty("@astrojs/node");
    });

    it("should wire Cloudflare web deploys to the generated server Worker URL", async () => {
      const result = await createVirtual({
        projectName: "tanstack-start-hono-cloudflare-auth",
        webDeploy: "cloudflare",
        serverDeploy: "cloudflare",
        backend: "hono",
        runtime: "workers",
        database: "sqlite",
        orm: "prisma",
        auth: "better-auth",
        payments: "none",
        api: "orpc",
        frontend: ["tanstack-start"],
        addons: ["turborepo"],
        examples: ["todo"],
        dbSetup: "d1",
        install: false,
        git: false,
        packageManager: "bun",
      });

      if (result.isErr()) {
        throw result.error;
      }

      const files = collectFiles(result.value.root, result.value.root.path);
      const infraFile = files.get("packages/infra/alchemy.run.ts");

      expect(infraFile).toContain('export const server = await Worker("server"');
      expect(infraFile).toContain("url: true");
      expect(infraFile).toContain("VITE_SERVER_URL: server.url!");
      expect(infraFile!.indexOf('export const server = await Worker("server"')).toBeLessThan(
        infraFile!.indexOf('export const web = await TanStackStart("web"'),
      );
    });

    it("should keep native Metro from watching Alchemy state", async () => {
      const result = await createVirtual({
        projectName: "native-astro-alchemy",
        frontend: ["astro", "native-unistyles"],
        backend: "hono",
        runtime: "workers",
        api: "orpc",
        auth: "better-auth",
        payments: "none",
        database: "sqlite",
        orm: "drizzle",
        dbSetup: "d1",
        packageManager: "pnpm",
        git: false,
        webDeploy: "cloudflare",
        serverDeploy: "cloudflare",
        install: false,
        addons: ["evlog", "lefthook", "turborepo", "ultracite"],
        examples: ["none"],
      });

      if (result.isErr()) {
        throw result.error;
      }

      const files = collectFiles(result.value.root, result.value.root.path);
      const metroConfig = files.get("apps/native/metro.config.js");

      expect(metroConfig).toContain("config.resolver.blockList = [");
      expect(metroConfig).toContain("[/\\\\]packages[/\\\\]infra[/\\\\]\\.alchemy(?:[/\\\\]|$)");
      expect(metroConfig).not.toContain("config.watchFolders =");
    });

    it("should keep native Metro minimal without Cloudflare deploys", async () => {
      const result = await createVirtual({
        projectName: "native-no-alchemy",
        frontend: ["native-unistyles"],
        backend: "hono",
        runtime: "bun",
        api: "orpc",
        auth: "none",
        payments: "none",
        database: "sqlite",
        orm: "drizzle",
        dbSetup: "none",
        packageManager: "pnpm",
        git: false,
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
        addons: ["none"],
        examples: ["none"],
      });

      if (result.isErr()) {
        throw result.error;
      }

      const files = collectFiles(result.value.root, result.value.root.path);
      const metroConfig = files.get("apps/native/metro.config.js");

      expect(metroConfig).toBeDefined();
      expect(metroConfig).not.toContain("node:path");
      expect(metroConfig).not.toContain("config.resolver.blockList");
      expect(metroConfig).not.toContain("\\.alchemy");
    });
  });

  describe("Deployment with Special Backend Constraints", () => {
    it("should work with deployment + self backend", async () => {
      const result = await runTRPCTest({
        projectName: "deploy-self-backend",
        webDeploy: "cloudflare",
        serverDeploy: "none", // Self backend doesn't use server deployment
        backend: "self",
        runtime: "none",
        database: "sqlite",
        orm: "drizzle",
        auth: "better-auth",
        api: "trpc",
        frontend: ["next"],
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        install: false,
      });

      expectSuccess(result);
    });
  });

  describe("Deployment Edge Cases", () => {
    it("should handle deployment with complex configurations", async () => {
      const result = await runTRPCTest({
        projectName: "complex-deployment",
        webDeploy: "cloudflare",
        serverDeploy: "cloudflare",
        backend: "hono",
        runtime: "workers",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "trpc",
        frontend: ["tanstack-router"], // Single web frontend (compatible with PWA)
        addons: ["pwa", "turborepo"],
        examples: ["todo"],
        install: false,
      });

      expectSuccess(result);
    });
  });

  describe("Docker Deployment", () => {
    it("should generate a full Docker Compose stack (web + server + db)", async () => {
      const result = await createVirtual({
        projectName: "docker-full-stack",
        webDeploy: "docker",
        serverDeploy: "docker",
        backend: "hono",
        runtime: "bun",
        database: "postgres",
        orm: "drizzle",
        auth: "better-auth",
        payments: "none",
        api: "trpc",
        frontend: ["tanstack-router"],
        addons: ["turborepo"],
        examples: ["none"],
        dbSetup: "docker",
        install: false,
        git: false,
        packageManager: "bun",
      });

      if (result.isErr()) {
        throw result.error;
      }

      const files = collectFiles(result.value.root, result.value.root.path);
      const compose = files.get("docker-compose.yml");
      const webDockerfile = files.get("apps/web/Dockerfile");
      const serverDockerfile = files.get("apps/server/Dockerfile");
      const rootPkg = JSON.parse(files.get("package.json") ?? "{}");
      const readme = files.get("README.md");

      expect(files.has(".dockerignore")).toBe(true);
      expect(files.has("apps/web/nginx.conf")).toBe(true);

      // The database service is inlined in the root compose, not a separate file
      expect(files.has("packages/db/docker-compose.yml")).toBe(false);
      expect(compose).not.toContain("include:");
      expect(compose).toContain("container_name: docker-full-stack-postgres");
      expect(compose).toContain("docker-full-stack_postgres_data:");
      expect(compose).toContain("init: true");
      expect(compose).toContain("dockerfile: apps/web/Dockerfile");
      expect(compose).toContain("dockerfile: apps/server/Dockerfile");
      expect(compose).toContain('"3001:80"');
      expect(compose).toContain('"3000:3000"');
      expect(compose).toContain("CORS_ORIGIN: http://localhost:3001");
      expect(compose).toContain(
        // biome-ignore format: compose interpolation syntax
        "DATABASE_URL: postgresql://postgres:${POSTGRES_PASSWORD:-password}@postgres:5432/docker-full-stack",
      );
      expect(compose).toContain("condition: service_healthy");
      // public client values are baked via build args, not .env files in the context
      expect(compose).toContain("VITE_SERVER_URL: http://localhost:3000");
      expect(webDockerfile).toContain("ARG VITE_SERVER_URL");
      expect(files.get(".dockerignore")).toContain("**/.env");
      expect(webDockerfile).toContain("FROM node:24-slim AS builder");
      expect(serverDockerfile).toContain("FROM node:24-slim AS base");

      // SPA frontend builds static assets served by nginx with an SPA fallback
      expect(webDockerfile).toContain("FROM nginx:alpine");
      expect(files.get("apps/web/nginx.conf")).toContain("try_files $uri $uri/ /index.html");

      expect(serverDockerfile).toContain('CMD ["bun", "dist/index.mjs"]');
      expect(serverDockerfile).toContain("bun install");

      expect(rootPkg.scripts["docker:up"]).toBe("docker compose up -d --build");
      expect(rootPkg.scripts["docker:down"]).toBe("docker compose down");
      // db scripts are scoped to the database service of the root compose
      expect(rootPkg.scripts["db:start"]).toBe("docker compose up -d postgres");
      expect(rootPkg.scripts["db:stop"]).toBe("docker compose stop postgres");
      expect(readme).toContain("### Docker Compose");
      expect(readme).toContain("https://www.better-t-stack.dev/docs/guides/docker");
    });

    it("should generate a web-only container for a fullstack self backend", async () => {
      const result = await createVirtual({
        projectName: "docker-self-next",
        webDeploy: "docker",
        serverDeploy: "none",
        backend: "self",
        runtime: "none",
        database: "postgres",
        orm: "prisma",
        auth: "better-auth",
        payments: "none",
        api: "trpc",
        frontend: ["next"],
        addons: ["turborepo"],
        examples: ["none"],
        dbSetup: "docker",
        install: false,
        git: false,
        packageManager: "pnpm",
      });

      if (result.isErr()) {
        throw result.error;
      }

      const files = collectFiles(result.value.root, result.value.root.path);
      const compose = files.get("docker-compose.yml");
      const webDockerfile = files.get("apps/web/Dockerfile");

      expect(files.has("apps/server/Dockerfile")).toBe(false);
      expect(compose).not.toContain("dockerfile: apps/server/Dockerfile");
      expect(compose).toContain('"3001:3001"');
      expect(compose).toContain("BETTER_AUTH_URL: http://localhost:3001");
      expect(compose).toContain(
        // biome-ignore format: compose interpolation syntax
        "DATABASE_URL: postgresql://postgres:${POSTGRES_PASSWORD:-password}@postgres:5432/docker-self-next",
      );
      expect(webDockerfile).toContain("npm install -g pnpm");
      // Next.js Docker deploys use standalone output for a minimal runtime image
      expect(webDockerfile).toContain(".next/standalone");
      expect(webDockerfile).toContain('CMD ["node", "apps/web/server.js"]');
      expect(files.get("apps/web/next.config.ts")).toContain('output: "standalone"');
    });

    it("should switch Svelte to adapter-node for Docker web deploys", async () => {
      const result = await createVirtual({
        projectName: "docker-svelte",
        webDeploy: "docker",
        serverDeploy: "none",
        backend: "none",
        runtime: "none",
        database: "none",
        orm: "none",
        auth: "none",
        payments: "none",
        api: "none",
        frontend: ["svelte"],
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        install: false,
        git: false,
        packageManager: "npm",
      });

      if (result.isErr()) {
        throw result.error;
      }

      const files = collectFiles(result.value.root, result.value.root.path);
      const svelteConfig = files.get("apps/web/svelte.config.js");
      const webPkg = JSON.parse(files.get("apps/web/package.json") ?? "{}");
      const webDockerfile = files.get("apps/web/Dockerfile");

      expect(svelteConfig).toContain("@sveltejs/adapter-node");
      expect(svelteConfig).not.toContain("@sveltejs/adapter-auto");
      expect(webPkg.devDependencies["@sveltejs/adapter-node"]).toBeDefined();
      expect(webDockerfile).toContain('CMD ["node", "build/index.js"]');
    });

    it("should add the nitro plugin for TanStack Start Docker web deploys", async () => {
      const result = await createVirtual({
        projectName: "docker-tanstack-start",
        webDeploy: "docker",
        serverDeploy: "none",
        backend: "none",
        runtime: "none",
        database: "none",
        orm: "none",
        auth: "none",
        payments: "none",
        api: "none",
        frontend: ["tanstack-start"],
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        install: false,
        git: false,
        packageManager: "bun",
      });

      if (result.isErr()) {
        throw result.error;
      }

      const files = collectFiles(result.value.root, result.value.root.path);
      const viteConfig = files.get("apps/web/vite.config.ts");
      const webPkg = JSON.parse(files.get("apps/web/package.json") ?? "{}");
      const webDockerfile = files.get("apps/web/Dockerfile");

      expect(viteConfig).toContain('import { nitro } from "nitro/vite"');
      expect(viteConfig).toContain("nitro(),");
      expect(webPkg.dependencies.nitro).toBeDefined();
      // SSR chunks require() externals at runtime, so the app runs from the workspace
      expect(webDockerfile).toContain("FROM node:24-slim AS base");
      expect(webDockerfile).toContain("WORKDIR /app/apps/web");
      expect(webDockerfile).toContain('CMD ["node", ".output/server/index.mjs"]');
    });

    it("should use the full Node 24 image for Vite+ Docker web builds", async () => {
      const result = await createVirtual({
        projectName: "docker-vite-plus",
        webDeploy: "docker",
        serverDeploy: "docker",
        backend: "hono",
        runtime: "bun",
        database: "postgres",
        orm: "prisma",
        auth: "better-auth",
        payments: "none",
        api: "orpc",
        frontend: ["tanstack-start"],
        addons: ["vite-plus"],
        examples: ["none"],
        dbSetup: "docker",
        install: false,
        git: false,
        packageManager: "bun",
      });

      if (result.isErr()) {
        throw result.error;
      }

      const files = collectFiles(result.value.root, result.value.root.path);
      const webDockerfile = files.get("apps/web/Dockerfile");
      const webPkg = JSON.parse(files.get("apps/web/package.json") ?? "{}");

      expect(webPkg.scripts.build).toBe("vp build");
      expect(webDockerfile).toContain("FROM node:24 AS base");
      expect(webDockerfile).not.toContain("ca-certificates");
    });

    it("should serve React Router SSR builds with a node runner", async () => {
      const result = await createVirtual({
        projectName: "docker-react-router",
        webDeploy: "docker",
        serverDeploy: "none",
        backend: "none",
        runtime: "none",
        database: "none",
        orm: "none",
        auth: "none",
        payments: "none",
        api: "none",
        frontend: ["react-router"],
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        install: false,
        git: false,
        packageManager: "npm",
      });

      if (result.isErr()) {
        throw result.error;
      }

      const files = collectFiles(result.value.root, result.value.root.path);
      const webDockerfile = files.get("apps/web/Dockerfile");
      const compose = files.get("docker-compose.yml");

      // react-router scaffolds SSR-first, so the container runs the server build
      expect(webDockerfile).not.toContain("FROM nginx:alpine");
      expect(webDockerfile).toContain("FROM node:24-slim AS runner");
      expect(webDockerfile).toContain('CMD ["sh", "-c", "cd apps/web && npm run start"]');
      expect(files.has("apps/web/nginx.conf")).toBe(false);
      expect(compose).toContain('"3001:3001"');
    });

    it("should generate a server-only Docker setup with web on another deploy", async () => {
      const result = await createVirtual({
        projectName: "docker-server-only",
        webDeploy: "none",
        serverDeploy: "docker",
        backend: "express",
        runtime: "node",
        database: "postgres",
        orm: "drizzle",
        auth: "none",
        payments: "none",
        api: "orpc",
        frontend: ["nuxt"],
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        install: false,
        git: false,
        packageManager: "npm",
      });

      if (result.isErr()) {
        throw result.error;
      }

      const files = collectFiles(result.value.root, result.value.root.path);
      const compose = files.get("docker-compose.yml");
      const serverDockerfile = files.get("apps/server/Dockerfile");
      const webPkg = JSON.parse(files.get("apps/web/package.json") ?? "{}");

      // Explicit vue 3 pin keeps npm's resolver off the vue 2 optional-peer path
      expect(webPkg.dependencies.vue).toBeDefined();
      expect(files.has("apps/web/Dockerfile")).toBe(false);
      expect(compose).not.toContain("dockerfile: apps/web/Dockerfile");
      expect(compose).toContain("dockerfile: apps/server/Dockerfile");
      // External database: connection string comes from apps/server/.env
      expect(compose).not.toContain("DATABASE_URL:");
      expect(compose).not.toContain("include:");
      expect(serverDockerfile).toContain('CMD ["node", "dist/index.mjs"]');
    });

    it("should keep Solid production builds resolvable without an API layer", async () => {
      const result = await createVirtual({
        projectName: "docker-solid-no-api",
        webDeploy: "docker",
        serverDeploy: "none",
        backend: "none",
        runtime: "none",
        database: "none",
        orm: "none",
        auth: "none",
        payments: "none",
        api: "none",
        frontend: ["solid"],
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        install: false,
        git: false,
        packageManager: "bun",
      });

      if (result.isErr()) {
        throw result.error;
      }

      const files = collectFiles(result.value.root, result.value.root.path);
      const webPkg = JSON.parse(files.get("apps/web/package.json") ?? "{}");

      // __root.tsx imports the router devtools unconditionally
      expect(webPkg.devDependencies["@tanstack/solid-router-devtools"]).toBeDefined();
      expect(files.get("apps/web/Dockerfile")).toContain("FROM nginx:alpine");
    });

    it("should bind Fastify to all interfaces for Docker deploys", async () => {
      const result = await createVirtual({
        projectName: "docker-fastify-host",
        webDeploy: "none",
        serverDeploy: "docker",
        backend: "fastify",
        runtime: "node",
        database: "none",
        orm: "none",
        auth: "none",
        payments: "none",
        api: "orpc",
        frontend: ["nuxt"],
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        install: false,
        git: false,
        packageManager: "npm",
      });

      if (result.isErr()) {
        throw result.error;
      }

      const files = collectFiles(result.value.root, result.value.root.path);
      expect(files.get("apps/server/src/index.ts")).toContain(
        'fastify.listen({ port: 3000, host: "0.0.0.0" }',
      );
    });

    it("should fail with docker server deploy + workers runtime", async () => {
      const result = await runTRPCTest({
        projectName: "docker-workers-fail",
        webDeploy: "none",
        serverDeploy: "docker",
        backend: "hono",
        runtime: "workers",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "trpc",
        frontend: ["tanstack-router"],
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        expectError: true,
      });

      expectError(result, "'--server-deploy docker' is not compatible with '--runtime workers'");
    });

    it("should fail with docker server deploy + self backend", async () => {
      const result = await runTRPCTest({
        projectName: "docker-self-server-fail",
        webDeploy: "none",
        serverDeploy: "docker",
        backend: "self",
        runtime: "none",
        database: "postgres",
        orm: "drizzle",
        auth: "none",
        api: "trpc",
        frontend: ["next"],
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        expectError: true,
      });

      expectError(result, "'--server-deploy docker' requires a separate server backend");
    });
  });
});
