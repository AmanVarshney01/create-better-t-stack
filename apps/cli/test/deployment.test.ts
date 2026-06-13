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
  });

  describe("Combined Web and Server Deployment", () => {
    it("should work with both web and server deploy", async () => {
      const result = await runTRPCTest({
        projectName: "web-server-deploy-combo",
        webDeploy: "cloudflare",
        serverDeploy: "cloudflare",
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
        install: false,
      });

      expectSuccess(result);
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

    it("should work with different deploy providers", async () => {
      const result = await runTRPCTest({
        projectName: "different-deploy-providers",
        webDeploy: "cloudflare",
        serverDeploy: "cloudflare",
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
        install: false,
      });

      expectSuccess(result);
    });

    it("should work with web deploy only", async () => {
      const result = await runTRPCTest({
        projectName: "web-deploy-only",
        webDeploy: "cloudflare",
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

    it("should work with server deploy only", async () => {
      const result = await runTRPCTest({
        projectName: "server-deploy-only",
        webDeploy: "none",
        serverDeploy: "cloudflare",
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
        install: false,
      });

      expectSuccess(result);
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

    it("should work with deployment + fullstack setup", async () => {
      const result = await runTRPCTest({
        projectName: "deploy-fullstack",
        webDeploy: "cloudflare",
        serverDeploy: "cloudflare",
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
        install: false,
      });

      expectSuccess(result);
    });
  });

  describe("All Deployment Options", () => {
    const deployOptions: ReadonlyArray<{
      webDeploy: TestConfig["webDeploy"];
      serverDeploy: TestConfig["serverDeploy"];
    }> = [
      { webDeploy: "cloudflare", serverDeploy: "cloudflare" },
      { webDeploy: "none", serverDeploy: "cloudflare" },
      { webDeploy: "none", serverDeploy: "none" },
    ];

    for (const { webDeploy, serverDeploy } of deployOptions) {
      it(`should work with webDeploy: ${webDeploy}, serverDeploy: ${serverDeploy}`, async () => {
        const config: TestConfig = {
          projectName: `deploy-${webDeploy}-${serverDeploy}`,
          webDeploy,
          serverDeploy,
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
          install: false,
        };

        // Handle special cases
        if (
          webDeploy !== "none" &&
          !config.frontend?.some((f) =>
            [
              "tanstack-router",
              "react-router",
              "tanstack-start",
              "next",
              "nuxt",
              "svelte",
              "solid",
              "astro",
            ].includes(f),
          )
        ) {
          config.frontend = ["tanstack-router"]; // Ensure web frontend for web deploy
        }

        if (serverDeploy !== "none" && config.backend === "none") {
          config.backend = "hono"; // Ensure backend for server deploy
        }

        if (serverDeploy === "none" && webDeploy === "none") {
          config.runtime = "bun";
        }

        const result = await runTRPCTest(config);
        expectSuccess(result);
      });
    }
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

    it("should handle deployment constraints properly", async () => {
      // This should fail because we have web deploy but only native frontend
      const result = await runTRPCTest({
        projectName: "deployment-constraints-fail",
        webDeploy: "cloudflare",
        serverDeploy: "none",
        backend: "none", // No backend but we have server deploy
        runtime: "none",
        database: "none",
        orm: "none",
        auth: "none",
        api: "none",
        frontend: ["native-bare"], // Only native frontend
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        expectError: true,
      });

      expectError(result, "'--web-deploy' requires a web frontend");
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
      expect(webDockerfile).toContain("WORKDIR /app/apps/web");
      expect(webDockerfile).toContain('CMD ["node", ".output/server/index.mjs"]');
    });

    it("should serve React Router SPA builds with nginx", async () => {
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

      // react-router scaffolds with ssr: false, so the build is a static SPA
      expect(webDockerfile).toContain("FROM nginx:alpine");
      expect(webDockerfile).toContain("/app/apps/web/build/client");
      expect(files.has("apps/web/nginx.conf")).toBe(true);
      expect(compose).toContain('"3001:80"');
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
