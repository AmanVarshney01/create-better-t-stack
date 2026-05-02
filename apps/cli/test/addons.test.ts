import { describe, expect, it } from "bun:test";
import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

import {
  DiagnosticCategory,
  flattenDiagnosticMessageText,
  ModuleKind,
  ScriptTarget,
  transpileModule,
} from "typescript";

import { add, type Addons, type Backend, type Frontend } from "../src";
import { getCompatibleAddons } from "../src/utils/compatibility-rules";
import { expectError, expectSuccess, runTRPCTest, type TestConfig } from "./test-utils";

async function readSourceFiles(dir: string): Promise<{ path: string; content: string }[]> {
  if (!existsSync(dir)) return [];

  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = join(dir, entry.name);
      if (entry.isDirectory()) return readSourceFiles(entryPath);
      if (!/\.(?:cjs|js|mjs|ts|tsx|vue)$/.test(entry.name)) return [];
      return [{ path: entryPath, content: await readFile(entryPath, "utf-8") }];
    }),
  );

  return files.flat();
}

function expectParseableTypeScript(content: string) {
  const diagnostics =
    transpileModule(content, {
      compilerOptions: {
        module: ModuleKind.ESNext,
        target: ScriptTarget.ESNext,
      },
      reportDiagnostics: true,
    }).diagnostics?.filter((diagnostic) => diagnostic.category === DiagnosticCategory.Error) ?? [];

  expect(
    diagnostics.map((diagnostic) => flattenDiagnosticMessageText(diagnostic.messageText, "\n")),
  ).toEqual([]);
}

function expectDocsShapedEvlogAuth(content: string) {
  expect(content).not.toContain("createEvlogAuth");
  expect(content).not.toContain("toHeaders");
  expect(content).not.toContain("GetSessionInput");
  expect(content).not.toContain("GetSessionResult");
  expect(content).not.toContain("toEvlogAuthEvent");
  expect(content).not.toContain("await identifyUser(event);");
  expect(content).not.toContain('declare module "h3"');
  expect(content).not.toContain("H3EventContext");
  expect(content).not.toContain("as unknown as BetterAuthInstance");
}

describe("Addon Configurations", () => {
  describe("Universal Addons (no frontend restrictions)", () => {
    const universalAddons = ["biome", "lefthook", "husky", "turborepo", "mcp"];

    for (const addon of universalAddons) {
      it(`should work with ${addon} addon on any frontend`, async () => {
        const result = await runTRPCTest({
          projectName: `${addon}-universal`,
          addons: [addon as Addons],
          frontend: ["tanstack-router"],
          backend: "hono",
          runtime: "bun",
          database: "sqlite",
          orm: "drizzle",
          auth: "none",
          api: "trpc",
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

  describe("Frontend-Specific Addons", () => {
    describe("PWA Addon", () => {
      const pwaCompatibleFrontends = ["tanstack-router", "react-router", "solid", "next"];

      for (const frontend of pwaCompatibleFrontends) {
        it(`should work with PWA + ${frontend}`, async () => {
          const config: TestConfig = {
            projectName: `pwa-${frontend}`,
            addons: ["pwa"],
            frontend: [frontend as Frontend],
            backend: "hono",
            runtime: "bun",
            database: "sqlite",
            orm: "drizzle",
            auth: "none",
            examples: ["none"],
            dbSetup: "none",
            webDeploy: "none",
            serverDeploy: "none",
            install: false,
          };

          // Handle special frontend requirements
          if (frontend === "solid") {
            config.api = "orpc"; // tRPC not supported with solid
          } else {
            config.api = "trpc";
          }

          const result = await runTRPCTest(config);
          expectSuccess(result);
        });
      }

      const pwaIncompatibleFrontends = [
        "nuxt",
        "svelte",
        "native-bare",
        "native-uniwind",
        "native-unistyles",
      ];

      for (const frontend of pwaIncompatibleFrontends) {
        it(`should fail with PWA + ${frontend}`, async () => {
          const config: TestConfig = {
            projectName: `pwa-${frontend}-fail`,
            addons: ["pwa"],
            frontend: [frontend as Frontend],
            backend: "hono",
            runtime: "bun",
            database: "sqlite",
            orm: "drizzle",
            auth: "none",
            examples: ["none"],
            dbSetup: "none",
            webDeploy: "none",
            serverDeploy: "none",
            expectError: true,
          };

          if (["nuxt", "svelte"].includes(frontend)) {
            config.api = "orpc";
          } else {
            config.api = "trpc";
          }

          const result = await runTRPCTest(config);
          expectError(
            result,
            "pwa addon requires one of these frontends: tanstack-router, react-router, solid, next",
          );
        });
      }
    });

    describe("Tauri Addon", () => {
      const tauriCompatibleFrontends = [
        "tanstack-router",
        "react-router",
        "tanstack-start",
        "next",
        "nuxt",
        "svelte",
        "solid",
        "astro",
      ];

      for (const frontend of tauriCompatibleFrontends) {
        it(`should work with Tauri + ${frontend}`, async () => {
          const config: TestConfig = {
            projectName: `tauri-${frontend}`,
            addons: ["tauri"],
            frontend: [frontend as Frontend],
            backend: "hono",
            runtime: "bun",
            database: "sqlite",
            orm: "drizzle",
            auth: "none",
            examples: ["none"],
            dbSetup: "none",
            webDeploy: "none",
            serverDeploy: "none",
            install: false,
          };

          if (["nuxt", "svelte", "solid", "astro"].includes(frontend)) {
            config.api = "orpc";
          } else {
            config.api = "trpc";
          }

          const result = await runTRPCTest(config);
          expectSuccess(result);
        });
      }

      const tauriIncompatibleFrontends = ["native-bare", "native-uniwind", "native-unistyles"];

      for (const frontend of tauriIncompatibleFrontends) {
        it(`should fail with Tauri + ${frontend}`, async () => {
          const result = await runTRPCTest({
            projectName: `tauri-${frontend}-fail`,
            addons: ["tauri"],
            frontend: [frontend as Frontend],
            backend: "hono",
            runtime: "bun",
            database: "sqlite",
            orm: "drizzle",
            auth: "none",
            api: "trpc",
            examples: ["none"],
            dbSetup: "none",
            webDeploy: "none",
            serverDeploy: "none",
            expectError: true,
          });

          expectError(result, "tauri addon requires one of these frontends");
        });
      }
    });

    describe("Electrobun Addon", () => {
      const electrobunCompatibleFrontends = [
        "tanstack-router",
        "react-router",
        "tanstack-start",
        "next",
        "nuxt",
        "svelte",
        "solid",
        "astro",
      ];

      for (const frontend of electrobunCompatibleFrontends) {
        it(`should work with Electrobun + ${frontend}`, async () => {
          const config: TestConfig = {
            projectName: `electrobun-${frontend}`,
            addons: ["electrobun"],
            frontend: [frontend as Frontend],
            backend: "hono",
            runtime: "bun",
            database: "sqlite",
            orm: "drizzle",
            auth: "none",
            examples: ["none"],
            dbSetup: "none",
            webDeploy: "none",
            serverDeploy: "none",
            install: false,
          };

          config.api = ["nuxt", "svelte", "solid", "astro"].includes(frontend) ? "orpc" : "trpc";

          const result = await runTRPCTest(config);
          expectSuccess(result);
        });
      }

      const electrobunIncompatibleFrontends = ["native-bare", "native-uniwind", "native-unistyles"];

      for (const frontend of electrobunIncompatibleFrontends) {
        it(`should fail with Electrobun + ${frontend}`, async () => {
          const config: TestConfig = {
            projectName: `electrobun-${frontend}-fail`,
            addons: ["electrobun"],
            frontend: [frontend as Frontend],
            backend: "hono",
            runtime: "bun",
            database: "sqlite",
            orm: "drizzle",
            auth: "none",
            examples: ["none"],
            dbSetup: "none",
            webDeploy: "none",
            serverDeploy: "none",
            expectError: true,
          };

          config.api = "trpc";

          const result = await runTRPCTest(config);
          expectError(result, "electrobun addon requires one of these frontends");
        });
      }
    });
  });

  describe("Multiple Addons", () => {
    it("should work with multiple compatible addons", async () => {
      const result = await runTRPCTest({
        projectName: "multiple-addons",
        addons: ["biome", "husky", "turborepo", "pwa"],
        frontend: ["tanstack-router"],
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "trpc",
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });

    it("should work with lefthook and husky together", async () => {
      const result = await runTRPCTest({
        projectName: "both-git-hooks",
        addons: ["lefthook", "husky"],
        frontend: ["tanstack-router"],
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "trpc",
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });

    it("should fail with incompatible addon combination", async () => {
      const result = await runTRPCTest({
        projectName: "incompatible-addons-fail",
        addons: ["pwa"], // PWA not compatible with nuxt
        frontend: ["nuxt"],
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "orpc",
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        expectError: true,
      });

      expectError(result, "pwa addon requires one of these frontends");
    });

    it("should fail when turborepo and nx are combined", async () => {
      const result = await runTRPCTest({
        projectName: "monorepo-addon-conflict",
        addons: ["turborepo", "nx"],
        frontend: ["tanstack-router"],
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "trpc",
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        expectError: true,
      });

      expectError(result, "Cannot combine 'turborepo' and 'nx' addons");
    });

    it("should deduplicate addons", async () => {
      const result = await runTRPCTest({
        projectName: "duplicate-addons",
        addons: ["biome", "biome", "turborepo"], // Duplicate biome
        frontend: ["tanstack-router"],
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "trpc",
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });
  });

  describe("Evlog Addon", () => {
    it("should not offer evlog for Convex projects", () => {
      const compatibleAddons = getCompatibleAddons(
        ["evlog", "mcp"] as Addons[],
        ["tanstack-start", "native-uniwind"] as Frontend[],
        [],
        "better-auth",
        "convex",
        "none",
      );

      expect(compatibleAddons).not.toContain("evlog");
      expect(compatibleAddons).toContain("mcp");
    });

    const backendSnippets: Record<Backend, string> = {
      hono: 'import { evlog, type EvlogVariables } from "evlog/hono";',
      express: 'import { evlog } from "evlog/express";',
      fastify: 'import { evlog } from "evlog/fastify";',
      elysia: 'import { evlog } from "evlog/elysia";',
      convex: "",
      self: "",
      none: "",
    };

    for (const backend of ["hono", "express", "fastify", "elysia"] as const) {
      it(`should wire evlog middleware for ${backend}`, async () => {
        const result = await runTRPCTest({
          projectName: `evlog-${backend}`,
          addons: ["evlog"],
          frontend: ["tanstack-router"],
          backend,
          runtime: "bun",
          database: "sqlite",
          orm: "drizzle",
          auth: "none",
          api: "trpc",
          examples: ["none"],
          dbSetup: "none",
          webDeploy: "none",
          serverDeploy: "none",
          install: false,
        });

        expectSuccess(result);
        const projectDir = result.result?.projectDirectory;
        if (!projectDir) throw new Error("Expected generated project directory");

        const serverIndex = await readFile(join(projectDir, "apps/server/src/index.ts"), "utf-8");
        const serverPackageJson = await readFile(
          join(projectDir, "apps/server/package.json"),
          "utf-8",
        );

        expect(serverIndex).toContain('import { initLogger } from "evlog";');
        expect(serverIndex).toContain(backendSnippets[backend]);
        expect(serverIndex).toContain(`env: { service: "evlog-${backend}-server" }`);
        expect(serverPackageJson).toContain('"evlog": "^2.14.1"');
      });
    }

    const webCases = [
      {
        frontend: "next",
        api: "trpc",
        files: [
          ["apps/web/src/lib/evlog.ts", "createEvlog"],
          ["apps/web/instrumentation.ts", "defineNodeInstrumentation"],
          ["apps/web/src/proxy.ts", "evlogMiddleware"],
          ["apps/web/src/app/api/trpc/[trpc]/route.ts", "withEvlog(handler)"],
        ],
      },
      {
        frontend: "nuxt",
        api: "orpc",
        files: [["apps/web/nuxt.config.ts", '"evlog/nuxt"']],
      },
      {
        frontend: "svelte",
        api: "orpc",
        files: [
          ["apps/web/vite.config.ts", "evlog({ service:"],
          ["apps/web/src/hooks.server.ts", "createEvlogHooks"],
          ["apps/web/src/app.d.ts", "log: RequestLogger"],
        ],
      },
      {
        frontend: "tanstack-start",
        api: "trpc",
        files: [
          ["apps/web/nitro.config.ts", 'evlog from "evlog/nitro/v3"'],
          ["apps/web/src/routes/__root.tsx", "evlogErrorHandler"],
        ],
      },
      {
        frontend: "astro",
        api: "orpc",
        files: [
          ["apps/web/src/middleware.ts", "createRequestLogger"],
          ["apps/web/src/env.d.ts", "log: RequestLogger"],
        ],
      },
    ] as const;

    for (const webCase of webCases) {
      it(`should wire evlog for ${webCase.frontend} fullstack projects`, async () => {
        const result = await runTRPCTest({
          projectName: `evlog-${webCase.frontend}-web`,
          addons: ["evlog"],
          frontend: [webCase.frontend as Frontend],
          backend: "self",
          runtime: "none",
          database: "sqlite",
          orm: "drizzle",
          auth: "none",
          api: webCase.api,
          examples: ["none"],
          dbSetup: "none",
          webDeploy: "none",
          serverDeploy: "none",
          install: false,
        });

        expectSuccess(result);
        const projectDir = result.result?.projectDirectory;
        if (!projectDir) throw new Error("Expected generated project directory");

        for (const [filePath, snippet] of webCase.files) {
          const file = await readFile(join(projectDir, filePath), "utf-8");
          expect(file).toContain(snippet);
        }

        const webPackageJson = await readFile(join(projectDir, "apps/web/package.json"), "utf-8");
        expect(webPackageJson).toContain('"evlog": "^2.14.1"');
        if (webCase.frontend === "tanstack-start") {
          expect(webPackageJson).toContain('"nitro": "^3.0.260429-beta"');
        }
      });
    }

    it("should keep Nuxt config parseable with Cloudflare web deploy", async () => {
      const result = await runTRPCTest({
        projectName: "evlog-nuxt-cloudflare-web",
        addons: ["evlog"],
        frontend: ["nuxt"],
        backend: "self",
        runtime: "none",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "orpc",
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "cloudflare",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
      const projectDir = result.result?.projectDirectory;
      if (!projectDir) throw new Error("Expected generated project directory");

      const nuxtConfig = await readFile(join(projectDir, "apps/web/nuxt.config.ts"), "utf-8");

      expect(nuxtConfig).toContain('"evlog/nuxt"');
      expect(nuxtConfig).toContain("nitro:");
      expect(nuxtConfig).toContain('import { existsSync } from "node:fs";');
      expect(nuxtConfig).toContain('import { fileURLToPath } from "node:url";');
      expect(nuxtConfig).toContain("const alchemyConfigPath = fileURLToPath");
      expect(nuxtConfig).toContain("const hasAlchemyConfig = existsSync(alchemyConfigPath);");
      expect(nuxtConfig).toContain("const shouldUseAlchemy = !isNuxtPrepare && hasAlchemyConfig;");
      expect(nuxtConfig).toContain("alchemy({ dev: { configPath: alchemyConfigPath } })");
      expect(nuxtConfig).toContain("isNuxtDev");
      expect(nuxtConfig).toContain("const cloudflareWorkersShimPath = fileURLToPath");
      expect(nuxtConfig).toContain('"cloudflare:workers"');
      expect(nuxtConfig).toContain("cloudflareWorkersShimPath");
      expect(nuxtConfig).toContain("evlog:");
      expectParseableTypeScript(nuxtConfig);
    });

    it("should type Nitro Better Auth events for Nuxt Cloudflare projects", async () => {
      const result = await runTRPCTest({
        projectName: "evlog-nuxt-cloudflare-auth",
        addons: ["evlog"],
        frontend: ["nuxt"],
        backend: "self",
        runtime: "none",
        database: "sqlite",
        orm: "drizzle",
        auth: "better-auth",
        api: "orpc",
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "cloudflare",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
      const projectDir = result.result?.projectDirectory;
      if (!projectDir) throw new Error("Expected generated project directory");

      const authMiddleware = await readFile(
        join(projectDir, "apps/web/server/middleware/evlog-auth.ts"),
        "utf-8",
      );
      const authClient = await readFile(
        join(projectDir, "apps/web/app/plugins/auth-client.ts"),
        "utf-8",
      );
      const envServer = await readFile(join(projectDir, "packages/env/src/server.ts"), "utf-8");

      expect(existsSync(join(projectDir, "apps/web/server/plugins/evlog-auth.ts"))).toBe(false);
      expect(authMiddleware).toContain(
        'import { createAuthMiddleware, type BetterAuthInstance } from "evlog/better-auth";',
      );
      expect(authMiddleware).toContain(
        "const identify = createAuthMiddleware(createAuth() as BetterAuthInstance, {",
      );
      expect(authMiddleware).toContain('exclude: ["/api/auth/**"]');
      expect(authMiddleware).toContain("maskEmail: true");
      expect(authMiddleware).toContain("export default defineEventHandler(async (event) => {");
      expect(authMiddleware).toContain(
        "await identify(event.context.log, event.headers, event.path);",
      );
      expect(authMiddleware).not.toContain("createAuthIdentifier(");
      expectDocsShapedEvlogAuth(authMiddleware);
      expectParseableTypeScript(authMiddleware);

      expect(authClient).not.toContain("baseURL:");
      expect(authClient).not.toContain("as string");
      expectParseableTypeScript(authClient);

      expect(envServer).toContain('/// <reference types="@cloudflare/workers-types" />');
      expectParseableTypeScript(envServer);
    });

    const fullstackBetterAuthEvlogCases = [
      {
        frontend: "next",
        api: "trpc",
        path: "apps/web/src/lib/evlog-auth.ts",
        expected: "createAuthMiddleware(auth as BetterAuthInstance",
      },
      {
        frontend: "nuxt",
        api: "orpc",
        path: "apps/web/server/middleware/evlog-auth.ts",
        expected: "createAuthMiddleware(auth as BetterAuthInstance",
      },
      {
        frontend: "svelte",
        api: "orpc",
        path: "apps/web/src/hooks.server.ts",
        expected: "createAuthMiddleware(auth as BetterAuthInstance",
      },
      {
        frontend: "tanstack-start",
        api: "trpc",
        path: "apps/web/server/plugins/evlog-auth.ts",
        expected: "createAuthIdentifier(auth as BetterAuthInstance",
      },
      {
        frontend: "astro",
        api: "orpc",
        path: "apps/web/src/middleware.ts",
        expected: "createAuthMiddleware(auth as BetterAuthInstance",
      },
    ] as const;

    for (const webCase of fullstackBetterAuthEvlogCases) {
      it(`should generate docs-shaped evlog Better Auth wiring for ${webCase.frontend} fullstack projects`, async () => {
        const result = await runTRPCTest({
          projectName: `evlog-${webCase.frontend}-fullstack-auth`,
          addons: ["evlog"],
          frontend: [webCase.frontend as Frontend],
          backend: "self",
          runtime: "none",
          database: "sqlite",
          orm: "drizzle",
          auth: "better-auth",
          api: webCase.api,
          examples: ["none"],
          dbSetup: "none",
          webDeploy: "none",
          serverDeploy: "none",
          install: false,
        });

        expectSuccess(result);
        const projectDir = result.result?.projectDirectory;
        if (!projectDir) throw new Error("Expected generated project directory");

        const authFile = await readFile(join(projectDir, webCase.path), "utf-8");
        if (webCase.frontend === "tanstack-start") {
          expect(authFile).toContain(
            'import { createAuthIdentifier, type BetterAuthInstance } from "evlog/better-auth";',
          );
          expect(authFile).not.toContain("createAuthMiddleware(");
        } else {
          expect(authFile).toContain(
            'import { createAuthMiddleware, type BetterAuthInstance } from "evlog/better-auth";',
          );
        }
        expect(authFile).toContain(webCase.expected);
        expect(authFile).toContain('exclude: ["/api/auth/**"]');
        expect(authFile).toContain("maskEmail: true");
        expectDocsShapedEvlogAuth(authFile);
        expectParseableTypeScript(authFile);
      });
    }

    const fullstackBetterAuthFactoryEvlogCases = [
      {
        frontend: "next",
        api: "trpc",
        path: "apps/web/src/lib/evlog-auth.ts",
        expected: "createAuthMiddleware(createAuth() as BetterAuthInstance",
        insideMarker: "export async function identifyEvlogUser",
      },
      {
        frontend: "nuxt",
        api: "orpc",
        path: "apps/web/server/middleware/evlog-auth.ts",
        expected: "createAuthMiddleware(createAuth() as BetterAuthInstance",
        insideMarker: "export default defineEventHandler",
      },
      {
        frontend: "svelte",
        api: "orpc",
        path: "apps/web/src/hooks.server.ts",
        expected: "createAuthMiddleware(createAuth(authEnv) as BetterAuthInstance",
        insideMarker: "const evlogAuthHandle",
      },
      {
        frontend: "tanstack-start",
        api: "trpc",
        path: "apps/web/server/plugins/evlog-auth.ts",
        expected: "createAuthIdentifier(createAuth() as BetterAuthInstance",
        insideMarker: 'nitroApp.hooks.hook("request", async (event) => {',
      },
      {
        frontend: "astro",
        api: "orpc",
        path: "apps/web/src/middleware.ts",
        expected: "createAuthMiddleware(createAuth() as BetterAuthInstance",
        insideMarker: "export const onRequest",
      },
    ] as const;

    for (const webCase of fullstackBetterAuthFactoryEvlogCases) {
      it(`should keep factory-based evlog auth wiring inside the request path for ${webCase.frontend}`, async () => {
        const result = await runTRPCTest({
          projectName: `evlog-${webCase.frontend}-cloudflare-auth`,
          addons: ["evlog"],
          frontend: [webCase.frontend as Frontend],
          backend: "self",
          runtime: "none",
          database: "sqlite",
          orm: "drizzle",
          auth: "better-auth",
          api: webCase.api,
          examples: ["none"],
          dbSetup: "none",
          webDeploy: "cloudflare",
          serverDeploy: "none",
          install: false,
        });

        expectSuccess(result);
        const projectDir = result.result?.projectDirectory;
        if (!projectDir) throw new Error("Expected generated project directory");

        const authFile = await readFile(join(projectDir, webCase.path), "utf-8");
        expect(authFile).toContain(webCase.expected);
        expect(authFile.indexOf(webCase.insideMarker)).toBeLessThan(
          authFile.indexOf(webCase.expected),
        );
        expect(authFile).toContain('exclude: ["/api/auth/**"]');
        expect(authFile).toContain("maskEmail: true");
        expectDocsShapedEvlogAuth(authFile);
        expectParseableTypeScript(authFile);
      });
    }

    it("should reject evlog for Convex backend projects", async () => {
      const result = await runTRPCTest({
        projectName: "evlog-convex-fail",
        addons: ["evlog"],
        frontend: ["tanstack-start", "native-uniwind"],
        backend: "convex",
        runtime: "none",
        database: "none",
        orm: "none",
        auth: "better-auth",
        api: "none",
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
        expectError: true,
      });

      expectError(result, "Convex and backend none are not supported yet");
    });

    it("should wire evlog Better Auth and AI SDK helpers for server projects", async () => {
      const result = await runTRPCTest({
        projectName: "evlog-hono-auth-ai",
        addons: ["evlog"],
        frontend: ["tanstack-router"],
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "better-auth",
        api: "trpc",
        examples: ["ai"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
      const projectDir = result.result?.projectDirectory;
      if (!projectDir) throw new Error("Expected generated project directory");

      const serverIndex = await readFile(join(projectDir, "apps/server/src/index.ts"), "utf-8");
      expect(serverIndex).toContain(
        'import { createAuthMiddleware, type BetterAuthInstance } from "evlog/better-auth";',
      );
      expect(serverIndex).toContain(
        "const identifyUser = createAuthMiddleware(auth as BetterAuthInstance",
      );
      expect(serverIndex).toContain(
        'await identifyUser(c.get("log"), c.req.raw.headers, c.req.path);',
      );
      expectDocsShapedEvlogAuth(serverIndex);
      expect(serverIndex).toContain(
        'import { createAILogger, createEvlogIntegration } from "evlog/ai";',
      );
      expect(serverIndex).toContain('const ai = createAILogger(c.get("log"));');
      expect(serverIndex).toContain("model: ai.wrap(model)");
      expect(serverIndex).toContain("integrations: [createEvlogIntegration(ai)]");
    });

    it("should wire evlog AI SDK helpers for Express server projects", async () => {
      const result = await runTRPCTest({
        projectName: "evlog-express-ai",
        addons: ["evlog"],
        frontend: ["nuxt"],
        backend: "express",
        runtime: "node",
        database: "sqlite",
        orm: "drizzle",
        auth: "better-auth",
        api: "orpc",
        examples: ["ai"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
      const projectDir = result.result?.projectDirectory;
      if (!projectDir) throw new Error("Expected generated project directory");

      const serverIndex = await readFile(join(projectDir, "apps/server/src/index.ts"), "utf-8");
      expect(serverIndex).toContain(
        'import { createAILogger, createEvlogIntegration } from "evlog/ai";',
      );
      expect(serverIndex).toContain("const ai = createAILogger(req.log);");
      expect(serverIndex).toContain("model: ai.wrap(model)");
      expect(serverIndex).toContain("integrations: [createEvlogIntegration(ai)]");
    });

    it("should wire evlog request and auth helpers for Next fullstack AI projects", async () => {
      const result = await runTRPCTest({
        projectName: "evlog-next-auth-ai",
        addons: ["evlog"],
        frontend: ["next"],
        backend: "self",
        runtime: "none",
        database: "sqlite",
        orm: "drizzle",
        auth: "better-auth",
        api: "trpc",
        examples: ["ai"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
      const projectDir = result.result?.projectDirectory;
      if (!projectDir) throw new Error("Expected generated project directory");

      const evlogAuth = await readFile(join(projectDir, "apps/web/src/lib/evlog-auth.ts"), "utf-8");
      const trpcRoute = await readFile(
        join(projectDir, "apps/web/src/app/api/trpc/[trpc]/route.ts"),
        "utf-8",
      );
      const aiRoute = await readFile(join(projectDir, "apps/web/src/app/api/ai/route.ts"), "utf-8");

      expect(evlogAuth).toContain(
        'import { createAuthMiddleware, type BetterAuthInstance } from "evlog/better-auth";',
      );
      expect(evlogAuth).toContain("createAuthMiddleware(auth as BetterAuthInstance");
      expectDocsShapedEvlogAuth(evlogAuth);
      expect(trpcRoute).toContain("withEvlog(handler)");
      expect(trpcRoute).toContain("await identifyEvlogUser(req);");
      expect(aiRoute).toContain("withEvlog(async (req: Request)");
      expect(aiRoute).toContain("await identifyEvlogUser(req);");
      expect(aiRoute).not.toContain("createAILogger");
      expect(aiRoute).not.toContain("model: ai.wrap(model)");
      expect(aiRoute).not.toContain("createEvlogIntegration(ai)");
    });

    const separateBackendWebAuthCases = [
      { frontend: "next", api: "trpc" },
      { frontend: "nuxt", api: "orpc" },
      { frontend: "svelte", api: "orpc" },
      { frontend: "tanstack-start", api: "trpc" },
      { frontend: "astro", api: "orpc" },
    ] as const;

    for (const webCase of separateBackendWebAuthCases) {
      it(`should keep Better Auth identifiers in the server for ${webCase.frontend} + separate backend projects`, async () => {
        const projectName = `evlog-${webCase.frontend}-express-auth-ai`;
        const result = await runTRPCTest({
          projectName,
          addons: ["evlog"],
          frontend: [webCase.frontend as Frontend],
          backend: "express",
          runtime: "node",
          database: "sqlite",
          orm: "drizzle",
          auth: "better-auth",
          api: webCase.api,
          examples: ["todo", "ai"],
          dbSetup: "turso",
          webDeploy: "none",
          serverDeploy: "none",
          install: false,
        });

        expectSuccess(result);
        const projectDir = result.result?.projectDirectory;
        if (!projectDir) throw new Error("Expected generated project directory");

        const serverIndex = await readFile(join(projectDir, "apps/server/src/index.ts"), "utf-8");
        const webPackageJson = await readFile(join(projectDir, "apps/web/package.json"), "utf-8");
        const webFiles = await readSourceFiles(join(projectDir, "apps/web"));
        const webContent = webFiles.map((file) => file.content).join("\n");

        expect(serverIndex).toContain(
          'import { createAuthMiddleware, type BetterAuthInstance } from "evlog/better-auth";',
        );
        expect(serverIndex).toContain("createAuthMiddleware(auth as BetterAuthInstance");
        expectDocsShapedEvlogAuth(serverIndex);
        expect(serverIndex).toContain("maskEmail: true");
        expect(webPackageJson).not.toContain(`"@${projectName}/auth"`);
        expect(webPackageJson).not.toContain('"@libsql/client"');
        expect(webPackageJson).not.toContain('"libsql"');
        expect(webContent).not.toContain(`@${projectName}/auth`);
        expect(webContent).not.toContain(`@${projectName}/db`);
        expect(webContent).not.toContain(`@${projectName}/env/server`);
        expect(webContent).not.toContain("createAuthMiddleware");
        expect(webContent).not.toContain("createAuthIdentifier");
        expect(webContent).not.toContain("identifyEvlogUser");
        expect(webContent).not.toContain('serverExternalPackages: ["libsql", "@libsql/client"]');
        expect(webContent).not.toContain("BETTER_AUTH_SECRET");
        expect(webContent).not.toContain("DATABASE_URL");
      });
    }

    it("should patch an existing server when evlog is added later", async () => {
      const created = await runTRPCTest({
        projectName: "evlog-add-existing",
        addons: ["none"],
        frontend: ["tanstack-router"],
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "trpc",
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(created);
      const projectDir = created.result?.projectDirectory;
      if (!projectDir) throw new Error("Expected generated project directory");

      const addResult = await add({
        projectDir,
        addons: ["evlog"],
        install: false,
      });

      expect(addResult?.success).toBe(true);

      const serverIndex = await readFile(join(projectDir, "apps/server/src/index.ts"), "utf-8");
      const serverPackageJson = await readFile(
        join(projectDir, "apps/server/package.json"),
        "utf-8",
      );

      expect(serverIndex).toContain('import { evlog, type EvlogVariables } from "evlog/hono";');
      expect(serverIndex).toContain("app.use(evlog());");
      expect(serverPackageJson).toContain('"evlog": "^2.14.1"');
    });

    it("should reject evlog when added later to a Convex project", async () => {
      const created = await runTRPCTest({
        projectName: "evlog-add-convex-fail",
        addons: ["none"],
        frontend: ["tanstack-start", "native-uniwind"],
        backend: "convex",
        runtime: "none",
        database: "none",
        orm: "none",
        auth: "better-auth",
        api: "none",
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(created);
      const projectDir = created.result?.projectDirectory;
      if (!projectDir) throw new Error("Expected generated project directory");

      const addResult = await add({
        projectDir,
        addons: ["evlog"],
        install: false,
      });

      expect(addResult?.success).toBe(false);
      expect(addResult?.error).toContain("Convex and backend none are not supported yet");
    });
  });

  describe("Addons with None Option", () => {
    it("should work with addons none", async () => {
      const result = await runTRPCTest({
        projectName: "no-addons",
        addons: ["none"],
        frontend: ["tanstack-router"],
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "trpc",
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });

    it("should fail with none + other addons", async () => {
      const result = await runTRPCTest({
        projectName: "none-with-other-addons-fail",
        addons: ["none", "biome"],
        frontend: ["tanstack-router"],
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "trpc",
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        expectError: true,
      });

      expectError(result, "Cannot combine 'none' with other addons");
    });
  });

  describe("All Available Addons", () => {
    const testableAddons = [
      "pwa",
      "tauri",
      "electrobun",
      "biome",
      "husky",
      "turborepo",
      "nx",
      "oxlint",
      "evlog",
      // Note: starlight, ultracite, fumadocs are prompt-controlled only
    ];

    for (const addon of testableAddons) {
      it(`should work with ${addon} addon in appropriate setup`, async () => {
        const config: TestConfig = {
          projectName: `test-${addon}`,
          addons: [addon as Addons],
          backend: "hono",
          runtime: "bun",
          database: "sqlite",
          orm: "drizzle",
          auth: "none",
          api: "trpc",
          examples: ["none"],
          dbSetup: "none",
          webDeploy: "none",
          serverDeploy: "none",
          install: false,
        };

        // Choose compatible frontend for each addon
        if (["pwa"].includes(addon)) {
          config.frontend = ["tanstack-router"]; // PWA compatible
        } else if (["tauri"].includes(addon)) {
          config.frontend = ["tanstack-router"]; // Tauri compatible
        } else if (["electrobun"].includes(addon)) {
          config.frontend = ["tanstack-router"]; // Electrobun compatible
        } else {
          config.frontend = ["tanstack-router"]; // Universal addons
        }

        const result = await runTRPCTest(config);
        expectSuccess(result);
      });
    }
  });
});
