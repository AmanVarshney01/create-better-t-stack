import { describe, expect, it } from "bun:test";

import { createVirtual } from "../src/index";
import type { API, Backend, Database, Examples, Frontend, ORM, Runtime } from "../src/types";
import { collectFiles } from "./setup";
import { expectError, expectSuccess, runCreateTest, type TestConfig } from "./test-utils";

describe("API Configurations", () => {
  describe("tRPC API", () => {
    const reactFrontends = ["tanstack-router", "react-router", "tanstack-start", "next"];

    for (const frontend of reactFrontends) {
      it(`should work with tRPC + ${frontend}`, async () => {
        const result = await runCreateTest({
          projectName: `trpc-${frontend}`,
          frontend: [frontend as Frontend],
        });

        expectSuccess(result);
      });
    }

    const nativeFrontends = ["native-bare", "native-uniwind", "native-unistyles"];

    for (const frontend of nativeFrontends) {
      it(`should work with tRPC + ${frontend}`, async () => {
        const result = await runCreateTest({
          projectName: `trpc-${frontend}`,
          frontend: [frontend as Frontend],
        });

        expectSuccess(result);
      });
    }

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

        const result = await runCreateTest(config);
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
        const result = await runCreateTest({
          projectName: `orpc-${frontend}`,
          api: "orpc",
          frontend: [frontend as Frontend],
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

        const result = await runCreateTest(config);
        expectSuccess(result);
      });
    }
  });

  describe("No API", () => {
    it("should work with API none + basic setup", async () => {
      const config = {
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
      } satisfies TestConfig;

      const result = await runCreateTest(config);

      expectSuccess(result);

      const virtualResult = await createVirtual({
        ...config,
        git: false,
        packageManager: "bun",
        payments: "none",
      });
      expect(virtualResult.isOk()).toBe(true);
      if (virtualResult.isErr()) {
        throw virtualResult.error;
      }

      const files = collectFiles(virtualResult.value.root, virtualResult.value.root.path);
      const envPackageJson = JSON.parse(files.get("package.json") ?? "{}");
      const baseTsconfig = files.get("packages/config/tsconfig.base.json");

      expect(envPackageJson.devDependencies?.["@types/bun"]).toBeDefined();
      expect(envPackageJson.devDependencies?.["@types/node"]).toBeUndefined();
      expect(baseTsconfig).toContain('"bun"');
    });

    it("should work with API none + frontend only", async () => {
      const config = {
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
      } satisfies TestConfig;

      const result = await runCreateTest(config);

      expectSuccess(result);

      const virtualResult = await createVirtual({
        ...config,
        git: false,
        packageManager: "bun",
        payments: "none",
      });
      expect(virtualResult.isOk()).toBe(true);
      if (virtualResult.isErr()) {
        throw virtualResult.error;
      }

      const files = collectFiles(virtualResult.value.root, virtualResult.value.root.path);
      const envPackageJson = JSON.parse(files.get("package.json") ?? "{}");
      const baseTsconfig = files.get("packages/config/tsconfig.base.json");

      expect(envPackageJson.devDependencies?.["@types/node"]).toBeDefined();
      expect(baseTsconfig).toContain('"node"');
    });

    it("should work with API none + convex", async () => {
      const result = await runCreateTest({
        projectName: "api-none-convex",
        api: "none",
        backend: "convex",
        runtime: "none",
        database: "none",
        orm: "none",
      });

      expectSuccess(result);
    });

    it("should fail with API none + examples (non-convex backend)", async () => {
      const result = await runCreateTest({
        projectName: "api-none-examples-fail",
        api: "none",
        examples: ["todo"],
      });

      expectError(result);
    });

    it("should work with API none + examples + convex backend", async () => {
      const result = await runCreateTest({
        projectName: "api-none-examples-convex",
        api: "none",
        backend: "convex",
        runtime: "none",
        database: "none",
        orm: "none",
        examples: ["todo"],
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
        const result = await runCreateTest({
          projectName: `${api}-${database}-${orm}`,
          api: api as API,
          database: database as Database,
          orm: orm as ORM,
        });

        expectSuccess(result);
      });
    }
  });

  describe("API with Authentication", () => {
    it("should work with tRPC + better-auth", async () => {
      const result = await runCreateTest({
        projectName: "trpc-better-auth",
        auth: "better-auth",
      });

      expectSuccess(result);
    });

    it("should work with oRPC + better-auth", async () => {
      const result = await runCreateTest({
        projectName: "orpc-better-auth",
        api: "orpc",
        auth: "better-auth",
      });

      expectSuccess(result);
    });

    it("should work with API none + convex + clerk", async () => {
      const result = await runCreateTest({
        projectName: "api-none-convex-clerk",
        api: "none",
        auth: "clerk",
        backend: "convex",
        runtime: "none",
        database: "none",
        orm: "none",
      });

      expectSuccess(result);
    });
  });

  describe("API with Examples", () => {
    it("should work with tRPC + todo example", async () => {
      const result = await runCreateTest({
        projectName: "trpc-todo",
        examples: ["todo"],
      });

      expectSuccess(result);
    });

    it("should work with oRPC + AI example", async () => {
      const result = await runCreateTest({
        projectName: "orpc-ai",
        api: "orpc",
        examples: ["ai"],
      });

      expectSuccess(result);
    });

    const apiExampleCombinations = [
      { api: "trpc", examples: ["todo", "ai"] },
      { api: "orpc", examples: ["todo", "ai"] },
    ];

    for (const { api, examples } of apiExampleCombinations) {
      it(`should work with ${api} + both examples`, async () => {
        const result = await runCreateTest({
          projectName: `${api}-both-examples`,
          api: api as API,
          examples: examples as Examples[],
        });

        expectSuccess(result);
      });
    }
  });

  describe("API Edge Cases", () => {
    it("should scaffold native oRPC with Expo fetch support for each auth branch", async () => {
      const cases = [
        {
          auth: "none",
          database: "sqlite",
          orm: "drizzle",
          expected: ["fetch: expoFetch"],
        },
        {
          auth: "better-auth",
          database: "sqlite",
          orm: "drizzle",
          expected: [
            'import { authClient } from "@/lib/auth-client";',
            'import { Platform } from "react-native";',
            'credentials: Platform.OS === "web" ? "include" : "omit"',
            "const cookies = await authClient.getCookie();",
            "return expoFetch(request, {",
          ],
        },
        {
          auth: "clerk",
          database: "none",
          orm: "none",
          expected: [
            'import { getClerkAuthToken } from "@/utils/clerk-auth";',
            "const token = await getClerkAuthToken();",
            "return token ? { Authorization: `Bearer ${token}` } : {};",
            "fetch: expoFetch",
          ],
        },
      ] as const;

      for (const testCase of cases) {
        const result = await createVirtual({
          projectName: `native-orpc-expo-fetch-${testCase.auth}`,
          api: "orpc",
          frontend: ["native-bare"],
          backend: "hono",
          runtime: "bun",
          database: testCase.database,
          orm: testCase.orm,
          auth: testCase.auth,
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
        const orpcFile = files.get("apps/native/utils/orpc.ts");

        expect(orpcFile).toContain('const { fetch } = await import("expo/fetch");');
        for (const expected of testCase.expected) {
          expect(orpcFile).toContain(expected);
        }
      }
    });

    it("should handle API with complex frontend combinations", async () => {
      const result = await runCreateTest({
        projectName: "api-complex-frontend",
        frontend: ["tanstack-router", "native-bare"],
      });

      expectSuccess(result);
    });

    it("should handle API with workers runtime", async () => {
      const result = await runCreateTest({
        projectName: "api-workers",
        runtime: "workers",
        serverDeploy: "cloudflare",
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

        const result = await runCreateTest(config);
        expectSuccess(result);
      });
    }
  });
});
