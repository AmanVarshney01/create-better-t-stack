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

    it("should wire Vercel web deploy with vercel.ts and CLI scripts", async () => {
      const result = await createVirtual({
        projectName: "next-vercel-deploy",
        webDeploy: "vercel",
        serverDeploy: "none",
        frontend: ["next"],
        backend: "self",
        runtime: "none",
        database: "postgres",
        orm: "prisma",
        auth: "better-auth",
        payments: "none",
        api: "trpc",
        addons: ["turborepo"],
        examples: ["none"],
        dbSetup: "none",
        packageManager: "bun",
        install: false,
        git: false,
      });

      if (result.isErr()) {
        throw result.error;
      }

      const files = collectFiles(result.value.root, result.value.root.path);
      const vercelConfig = files.get("apps/web/vercel.ts");
      const rootPkg = JSON.parse(files.get("package.json") ?? "{}");
      const webPkg = JSON.parse(files.get("apps/web/package.json") ?? "{}");
      const readme = files.get("README.md");

      expect(vercelConfig).toContain('import type { VercelConfig } from "@vercel/config/v1";');
      expect(vercelConfig).toContain('framework: "nextjs"');
      expect(vercelConfig).toContain("satisfies VercelConfig");
      expect(rootPkg.scripts.deploy).toBe("vercel deploy --target=preview");
      expect(rootPkg.scripts["deploy:prod"]).toBe("vercel deploy --prod");
      expect(rootPkg.scripts["deploy:link"]).toBe("vercel link --repo");
      expect(rootPkg.devDependencies.vercel).toBeDefined();
      expect(webPkg.scripts.deploy).toBeUndefined();
      expect(webPkg.scripts["deploy:prod"]).toBeUndefined();
      expect(webPkg.scripts["vercel:build"]).toBeUndefined();
      expect(webPkg.devDependencies.vercel).toBeDefined();
      expect(webPkg.devDependencies["@vercel/config"]).toBeDefined();
      expect(files.has("packages/infra/alchemy.run.ts")).toBe(false);
      expect(readme).toContain("### Web (Vercel)");
      expect(readme).toContain("apps/web/vercel.ts");
      expect(readme).toContain("Project Root Directory: `apps/web`");
    });

    it("should use the Astro Vercel adapter for Vercel web deploys", async () => {
      const result = await createVirtual({
        projectName: "astro-vercel-deploy",
        webDeploy: "vercel",
        serverDeploy: "none",
        frontend: ["astro"],
        backend: "self",
        runtime: "none",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        payments: "none",
        api: "orpc",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        packageManager: "pnpm",
        install: false,
        git: false,
      });

      if (result.isErr()) {
        throw result.error;
      }

      const files = collectFiles(result.value.root, result.value.root.path);
      const astroConfig = files.get("apps/web/astro.config.mjs");
      const webPkg = JSON.parse(files.get("apps/web/package.json") ?? "{}");
      const vercelConfig = files.get("apps/web/vercel.ts");

      expect(astroConfig).toContain('import vercel from "@astrojs/vercel";');
      expect(astroConfig).toContain("adapter: vercel()");
      expect(astroConfig).not.toContain("@astrojs/node");
      expect(webPkg.dependencies["@astrojs/vercel"]).toBeDefined();
      expect(webPkg.dependencies["@astrojs/node"]).toBeUndefined();
      expect(vercelConfig).toContain('framework: "astro"');
    });

    it("should emit a valid empty Next env config for Vercel web-only deploys", async () => {
      const result = await createVirtual({
        projectName: "next-vercel-web-only",
        webDeploy: "vercel",
        serverDeploy: "none",
        frontend: ["next"],
        backend: "none",
        runtime: "none",
        database: "none",
        orm: "none",
        auth: "none",
        payments: "none",
        api: "none",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        packageManager: "bun",
        install: false,
        git: false,
      });

      if (result.isErr()) {
        throw result.error;
      }

      const files = collectFiles(result.value.root, result.value.root.path);
      const envConfig = files.get("packages/env/src/web.ts");

      expect(envConfig).toContain("client: {}");
      expect(envConfig).toContain("experimental__runtimeEnv: {}");
    });

    it("should keep Vercel-tested TanStack Start and Solid frontend deps resolvable", async () => {
      const tanstackStart = await createVirtual({
        projectName: "tanstack-start-vercel-deps",
        webDeploy: "vercel",
        serverDeploy: "none",
        frontend: ["tanstack-start"],
        backend: "none",
        runtime: "none",
        database: "none",
        orm: "none",
        auth: "none",
        payments: "none",
        api: "none",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        packageManager: "bun",
        install: false,
        git: false,
      });
      const solid = await createVirtual({
        projectName: "solid-vercel-deps",
        webDeploy: "vercel",
        serverDeploy: "none",
        frontend: ["solid"],
        backend: "none",
        runtime: "none",
        database: "none",
        orm: "none",
        auth: "none",
        payments: "none",
        api: "none",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        packageManager: "bun",
        install: false,
        git: false,
      });

      if (tanstackStart.isErr()) throw tanstackStart.error;
      if (solid.isErr()) throw solid.error;

      const tanstackFiles = collectFiles(tanstackStart.value.root, tanstackStart.value.root.path);
      const solidFiles = collectFiles(solid.value.root, solid.value.root.path);
      const tanstackPkg = JSON.parse(tanstackFiles.get("apps/web/package.json") ?? "{}");
      const solidPkg = JSON.parse(solidFiles.get("apps/web/package.json") ?? "{}");

      expect(tanstackPkg.dependencies["@tanstack/react-router"]).toBe("1.168.22");
      expect(tanstackPkg.dependencies["@tanstack/react-start"]).toBe("1.167.41");
      expect(tanstackPkg.dependencies.nitro).toBe("^3.0.260429-beta");
      expect(solidPkg.devDependencies["@tanstack/solid-router-devtools"]).toBe("1.166.13");
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

    it("should support Cloudflare server deploy with Vercel web deploy", async () => {
      const result = await createVirtual({
        projectName: "cloudflare-server-vercel-web",
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
        addons: ["turborepo"],
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
      const rootPkg = JSON.parse(files.get("package.json") ?? "{}");
      const turboConfig = JSON.parse(files.get("turbo.json") ?? "{}");
      const infraFile = files.get("packages/infra/alchemy.run.ts");
      const vercelConfig = files.get("apps/web/vercel.ts");

      expect(infraFile).toContain('export const server = await Worker("server"');
      expect(vercelConfig).toContain('framework: "vite"');
      expect(rootPkg.scripts.deploy).toBe(
        "turbo -F @cloudflare-server-vercel-web/infra deploy && vercel deploy --target=preview",
      );
      expect(rootPkg.scripts["deploy:server"]).toBe(
        "turbo -F @cloudflare-server-vercel-web/infra deploy",
      );
      expect(rootPkg.scripts["deploy:web"]).toBe("vercel deploy --target=preview");
      expect(rootPkg.scripts.destroy).toBe("turbo -F @cloudflare-server-vercel-web/infra destroy");
      expect(turboConfig.tasks.deploy).toBeDefined();
      expect(turboConfig.tasks["deploy:prod"]).toBeDefined();
      expect(turboConfig.tasks.destroy).toBeDefined();
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
});
