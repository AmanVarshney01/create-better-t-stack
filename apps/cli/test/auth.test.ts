import { describe, expect, it } from "bun:test";
import path from "node:path";

import fs from "fs-extra";

import type { Backend, Database, Frontend, ORM } from "../src/types";
import {
  AUTH_PROVIDERS,
  expectError,
  expectSuccess,
  runTRPCTest,
  type TestConfig,
} from "./test-utils";

describe("Authentication Configurations", () => {
  describe("Better-Auth Provider", () => {
    it("should work with better-auth + database", async () => {
      const result = await runTRPCTest({
        projectName: "better-auth-db",
        auth: "better-auth",
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        api: "trpc",
        frontend: ["tanstack-router"],
        addons: ["turborepo"],
        examples: ["todo"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });

    const databases = ["sqlite", "postgres", "mysql"];
    for (const database of databases) {
      it(`should work with better-auth + ${database}`, async () => {
        const result = await runTRPCTest({
          projectName: `better-auth-${database}`,
          auth: "better-auth",
          backend: "hono",
          runtime: "bun",
          database: database as Database,
          orm: "drizzle",
          api: "trpc",
          frontend: ["tanstack-router"],
          addons: ["turborepo"],
          examples: ["todo"],
          dbSetup: "none",
          webDeploy: "none",
          serverDeploy: "none",
          install: false,
        });

        expectSuccess(result);
      });
    }

    it("should work with better-auth + mongodb + mongoose", async () => {
      const result = await runTRPCTest({
        projectName: "better-auth-mongodb",
        auth: "better-auth",
        backend: "hono",
        runtime: "bun",
        database: "mongodb",
        orm: "mongoose",
        api: "trpc",
        frontend: ["tanstack-router"],
        addons: ["turborepo"],
        examples: ["todo"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });

    it("should add nextCookies plugin for Next.js self backend", async () => {
      const result = await runTRPCTest({
        projectName: "better-auth-next-self-plugins",
        auth: "better-auth",
        backend: "self",
        runtime: "none",
        database: "postgres",
        orm: "drizzle",
        api: "trpc",
        frontend: ["next"],
        addons: ["turborepo"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "cloudflare",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
      if (!result.projectDir) {
        throw new Error("Expected projectDir to be defined");
      }

      const authFile = await fs.readFile(
        path.join(result.projectDir, "packages/auth/src/index.ts"),
        "utf8",
      );

      expect(authFile).toContain('import { nextCookies } from "better-auth/next-js";');
      expect(authFile).toContain("nextCookies()");
    });

    it("should add tanstackStartCookies plugin for TanStack Start self backend", async () => {
      const result = await runTRPCTest({
        projectName: "better-auth-tanstack-start-self-plugins",
        auth: "better-auth",
        backend: "self",
        runtime: "none",
        database: "postgres",
        orm: "drizzle",
        api: "trpc",
        frontend: ["tanstack-start"],
        addons: ["turborepo"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
      if (!result.projectDir) {
        throw new Error("Expected projectDir to be defined");
      }

      const authFile = await fs.readFile(
        path.join(result.projectDir, "packages/auth/src/index.ts"),
        "utf8",
      );

      expect(authFile).toContain(
        'import { tanstackStartCookies } from "better-auth/tanstack-start";',
      );
      expect(authFile).toContain("tanstackStartCookies()");
    });

    it("should fail with better-auth + no database (non-convex)", async () => {
      const result = await runTRPCTest({
        projectName: "better-auth-no-db-fail",
        auth: "better-auth",
        backend: "hono",
        runtime: "bun",
        database: "none",
        orm: "none",
        api: "trpc",
        frontend: ["tanstack-router"],
        addons: ["turborepo"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      // This should actually succeed - better-auth can work without a database
      // if no examples require one
      expectSuccess(result);
    });

    it("should work with better-auth + convex backend (tanstack-router)", async () => {
      const result = await runTRPCTest({
        projectName: "better-auth-convex-success",
        auth: "better-auth",
        backend: "convex",
        runtime: "none",
        database: "none",
        orm: "none",
        api: "none",
        frontend: ["tanstack-router"],
        addons: ["turborepo"],
        examples: ["todo"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
      });

      expectSuccess(result);
    });

    it("should scaffold react-router with Convex Better Auth wiring", async () => {
      const result = await runTRPCTest({
        projectName: "better-auth-convex-react-router",
        auth: "better-auth",
        backend: "convex",
        runtime: "none",
        database: "none",
        orm: "none",
        api: "none",
        frontend: ["react-router"],
        addons: ["turborepo"],
        examples: ["todo"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
      if (!result.projectDir) {
        throw new Error("Expected projectDir to be defined");
      }

      const rootFile = await fs.readFile(
        path.join(result.projectDir, "apps/web/src/root.tsx"),
        "utf8",
      );
      const authClientFile = await fs.readFile(
        path.join(result.projectDir, "apps/web/src/lib/auth-client.ts"),
        "utf8",
      );
      const dashboardFile = await fs.readFile(
        path.join(result.projectDir, "apps/web/src/routes/dashboard.tsx"),
        "utf8",
      );

      expect(rootFile).toContain("ConvexBetterAuthProvider");
      expect(rootFile).toContain('import { authClient } from "@/lib/auth-client";');
      expect(authClientFile).toContain("crossDomainClient(), convexClient()");
      expect(dashboardFile).toContain("Authenticated");
      expect(dashboardFile).toContain("Unauthenticated");
    });

    const convexUnsupportedFrontends = ["nuxt", "svelte", "solid", "astro"] as const;
    for (const frontend of convexUnsupportedFrontends) {
      it(`should fail with Convex Better Auth + ${frontend}`, async () => {
        const result = await runTRPCTest({
          projectName: `better-auth-convex-${frontend}-fail`,
          auth: "better-auth",
          backend: "convex",
          runtime: "none",
          database: "none",
          orm: "none",
          api: "none",
          frontend: [frontend],
          addons: ["turborepo"],
          examples: ["none"],
          dbSetup: "none",
          webDeploy: "none",
          serverDeploy: "none",
          install: false,
          expectError: true,
        });

        expectError(result, "Better Auth with '--backend convex' is not compatible");
      });
    }

    const compatibleFrontends = [
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

    for (const frontend of compatibleFrontends) {
      it(`should work with better-auth + ${frontend}`, async () => {
        const config: TestConfig = {
          projectName: `better-auth-${frontend}`,
          auth: "better-auth",
          backend: "hono",
          runtime: "bun",
          database: "sqlite",
          orm: "drizzle",
          frontend: [frontend as Frontend],
          addons: ["turborepo"],
          examples: ["todo"],
          dbSetup: "none",
          webDeploy: "none",
          serverDeploy: "none",
          install: false,
        };

        // Handle API compatibility
        if (["nuxt", "svelte", "solid"].includes(frontend)) {
          config.api = "orpc";
        } else {
          config.api = "trpc";
        }

        const result = await runTRPCTest(config);
        expectSuccess(result);
      });
    }
  });

  describe("Clerk Provider", () => {
    it("should work with clerk + convex", async () => {
      const result = await runTRPCTest({
        projectName: "clerk-convex",
        auth: "clerk",
        backend: "convex",
        runtime: "none",
        database: "none",
        orm: "none",
        api: "none",
        frontend: ["tanstack-router"],
        addons: ["turborepo"],
        examples: ["todo"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });

    it("should work with clerk + hono backend", async () => {
      const result = await runTRPCTest({
        projectName: "clerk-hono-success",
        auth: "clerk",
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        examples: ["todo"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        addons: ["turborepo"],
        orm: "drizzle",
        api: "trpc",
        frontend: ["tanstack-router"],
        install: false,
      });

      expectSuccess(result);
    });

    it("should work with clerk + self backend", async () => {
      const result = await runTRPCTest({
        projectName: "clerk-self-success",
        auth: "clerk",
        backend: "self",
        runtime: "none",
        database: "sqlite",
        orm: "drizzle",
        api: "trpc",
        frontend: ["next"],
        addons: ["turborepo"],
        examples: ["todo"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });

    it("should scaffold Next.js Clerk middleware without importing shared server env", async () => {
      const result = await runTRPCTest({
        projectName: "clerk-next-hono-current",
        auth: "clerk",
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        api: "trpc",
        frontend: ["next"],
        addons: ["turborepo"],
        examples: ["todo"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
      if (!result.projectDir) {
        throw new Error("Expected projectDir to be defined");
      }

      const proxyFile = await fs.readFile(
        path.join(result.projectDir, "apps/web/src/proxy.ts"),
        "utf8",
      );
      const dashboardFile = await fs.readFile(
        path.join(result.projectDir, "apps/web/src/app/dashboard/page.tsx"),
        "utf8",
      );
      const apiContextFile = await fs.readFile(
        path.join(result.projectDir, "packages/api/src/context.ts"),
        "utf8",
      );
      const serverEnvPackageFile = await fs.readFile(
        path.join(result.projectDir, "packages/env/src/server.ts"),
        "utf8",
      );
      const serverEnvFile = await fs.readFile(
        path.join(result.projectDir, "apps/server/.env"),
        "utf8",
      );

      expect(proxyFile).not.toContain('/env/server"');
      expect(proxyFile).not.toContain("env.CLERK_SECRET_KEY");
      expect(dashboardFile).not.toContain("SignedIn");
      expect(dashboardFile).not.toContain("SignedOut");
      expect(dashboardFile).toContain("useUser");
      expect(dashboardFile).toContain("privateData.queryOptions()");
      expect(apiContextFile).toContain("type ClerkContextAuth");
      expect(apiContextFile).toContain("type ClerkRequestContext");
      expect(apiContextFile).toContain("function toClerkContextAuth");
      expect(apiContextFile).toContain("Promise<ClerkRequestContext>");
      expect(apiContextFile).toContain("publishableKey: env.CLERK_PUBLISHABLE_KEY");
      expect(apiContextFile).toContain("authorizedParties: [env.CORS_ORIGIN]");
      expect(serverEnvPackageFile).toContain("CLERK_PUBLISHABLE_KEY");
      expect(serverEnvPackageFile).toContain("CLERK_SECRET_KEY");
      expect(serverEnvFile).toContain("CLERK_PUBLISHABLE_KEY=");
      expect(serverEnvFile).toContain("CLERK_SECRET_KEY=");
    });

    it("should scaffold TanStack Start Clerk templates without stale control components", async () => {
      const result = await runTRPCTest({
        projectName: "clerk-tanstack-start-hono-current",
        auth: "clerk",
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        api: "trpc",
        frontend: ["tanstack-start"],
        addons: ["turborepo"],
        examples: ["todo"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
      if (!result.projectDir) {
        throw new Error("Expected projectDir to be defined");
      }

      const startFile = await fs.readFile(
        path.join(result.projectDir, "apps/web/src/start.ts"),
        "utf8",
      );
      const dashboardFile = await fs.readFile(
        path.join(result.projectDir, "apps/web/src/routes/dashboard.tsx"),
        "utf8",
      );

      expect(startFile).not.toContain('/env/server"');
      expect(startFile).not.toContain("env.CLERK_SECRET_KEY");
      expect(dashboardFile).not.toContain("SignedIn");
      expect(dashboardFile).not.toContain("SignedOut");
      expect(dashboardFile).toContain("useUser");
      expect(dashboardFile).toContain("privateData.queryOptions()");
    });

    it("should scaffold Clerk native auth with the current Expo SDK flow", async () => {
      const result = await runTRPCTest({
        projectName: "clerk-native-hono-current",
        auth: "clerk",
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        api: "trpc",
        frontend: ["native-uniwind"],
        addons: ["turborepo"],
        examples: ["todo"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
      if (!result.projectDir) {
        throw new Error("Expected projectDir to be defined");
      }

      const nativePackageFile = await fs.readFile(
        path.join(result.projectDir, "apps/native/package.json"),
        "utf8",
      );
      const signInFile = await fs.readFile(
        path.join(result.projectDir, "apps/native/app/(auth)/sign-in.tsx"),
        "utf8",
      );
      const signUpFile = await fs.readFile(
        path.join(result.projectDir, "apps/native/app/(auth)/sign-up.tsx"),
        "utf8",
      );

      expect(nativePackageFile).toContain('"@clerk/expo": "^3.1.3"');

      expect(signInFile).not.toContain("setActive");
      expect(signInFile).not.toContain("signIn.create");
      expect(signInFile).toContain("const { signIn, errors, fetchStatus } = useSignIn()");
      expect(signInFile).toContain("await signIn.password");
      expect(signInFile).toContain("await signIn.finalize");

      expect(signUpFile).not.toContain("setActive");
      expect(signUpFile).not.toContain("prepareEmailAddressVerification");
      expect(signUpFile).not.toContain("attemptEmailAddressVerification");
      expect(signUpFile).toContain("const { signUp, errors, fetchStatus } = useSignUp()");
      expect(signUpFile).toContain("await signUp.password");
      expect(signUpFile).toContain("await signUp.verifications.sendEmailCode()");
      expect(signUpFile).toContain("await signUp.verifications.verifyEmailCode");
      expect(signUpFile).toContain("await signUp.finalize");
      expect(signUpFile).toContain('nativeID="clerk-captcha"');
    });

    const compatibleFrontends = [
      "tanstack-router",
      "react-router",
      "tanstack-start",
      "next",
      "native-bare",
      "native-uniwind",
      "native-unistyles",
    ];

    for (const frontend of compatibleFrontends) {
      it(`should work with clerk + ${frontend}`, async () => {
        const result = await runTRPCTest({
          projectName: `clerk-${frontend}`,
          auth: "clerk",
          backend: "convex",
          runtime: "none",
          database: "none",
          webDeploy: "none",
          serverDeploy: "none",
          addons: ["turborepo"],
          dbSetup: "none",
          examples: ["todo"],
          orm: "none",
          api: "none",
          frontend: [frontend as Frontend],
          install: false,
        });

        expectSuccess(result);
      });
    }

    const incompatibleFrontends = ["nuxt", "svelte", "solid", "astro"];

    for (const frontend of incompatibleFrontends) {
      it(`should fail with clerk + ${frontend}`, async () => {
        const result = await runTRPCTest({
          projectName: `clerk-${frontend}-fail`,
          auth: "clerk",
          backend: "convex",
          runtime: "none",
          database: "none",
          orm: "none",
          api: "none",
          frontend: [frontend as Frontend],
          addons: ["turborepo"],
          examples: ["todo"],
          dbSetup: "none",
          webDeploy: "none",
          serverDeploy: "none",
          expectError: true,
        });

        expectError(result, "Clerk authentication is not compatible");
      });
    }
  });

  describe("No Authentication", () => {
    it("should work with auth none", async () => {
      const result = await runTRPCTest({
        projectName: "no-auth",
        auth: "none",
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        api: "trpc",
        frontend: ["tanstack-router"],
        addons: ["turborepo"],
        examples: ["todo"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });

    it("should work with auth none + no database", async () => {
      // When backend is 'none', examples are automatically cleared
      const result = await runTRPCTest({
        projectName: "no-auth-no-db",
        auth: "none",
        backend: "none",
        runtime: "none",
        database: "none",
        orm: "none",
        api: "none",
        frontend: ["tanstack-router"],
        addons: ["turborepo"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });

    it("should work with auth none + convex", async () => {
      const result = await runTRPCTest({
        projectName: "no-auth-convex",
        auth: "none",
        backend: "convex",
        runtime: "none",
        database: "none",
        orm: "none",
        api: "none",
        frontend: ["tanstack-router"],
        addons: ["turborepo"],
        examples: ["todo"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });
  });

  describe("Authentication with Different Backends", () => {
    const backends = ["hono", "express", "fastify", "elysia", "self"];

    for (const backend of backends) {
      it(`should work with better-auth + ${backend}`, async () => {
        const config: TestConfig = {
          projectName: `better-auth-${backend}`,
          auth: "better-auth",
          backend: backend as Backend,
          database: "sqlite",
          orm: "drizzle",
          api: "trpc",
          frontend: backend === "self" ? ["next"] : ["tanstack-router"],
          addons: ["turborepo"],
          examples: ["todo"],
          dbSetup: "none",
          webDeploy: "none",
          serverDeploy: "none",
          install: false,
        };

        // Set appropriate runtime
        if (backend === "elysia") {
          config.runtime = "bun";
        } else if (backend === "self") {
          config.runtime = "none";
        } else {
          config.runtime = "bun";
        }

        const result = await runTRPCTest(config);
        expectSuccess(result);
      });
    }
  });

  describe("Authentication with Different ORMs", () => {
    const ormCombinations = [
      { database: "sqlite", orm: "drizzle" },
      { database: "sqlite", orm: "prisma" },
      { database: "postgres", orm: "drizzle" },
      { database: "postgres", orm: "prisma" },
      { database: "mysql", orm: "drizzle" },
      { database: "mysql", orm: "prisma" },
      { database: "mongodb", orm: "mongoose" },
      { database: "mongodb", orm: "prisma" },
    ];

    for (const { database, orm } of ormCombinations) {
      it(`should work with better-auth + ${database} + ${orm}`, async () => {
        const result = await runTRPCTest({
          projectName: `better-auth-${database}-${orm}`,
          auth: "better-auth",
          backend: "hono",
          runtime: "bun",
          database: database as Database,
          orm: orm as ORM,
          api: "trpc",
          frontend: ["tanstack-router"],
          addons: ["turborepo"],
          examples: ["todo"],
          dbSetup: "none",
          webDeploy: "none",
          serverDeploy: "none",
          install: false,
        });

        expectSuccess(result);
      });
    }
  });

  describe("All Auth Providers", () => {
    for (const auth of AUTH_PROVIDERS) {
      it(`should work with ${auth} in appropriate setup`, async () => {
        const config: TestConfig = {
          projectName: `test-${auth}`,
          auth,
          frontend: ["tanstack-router"],
          addons: ["turborepo"],
          examples: ["todo"],
          dbSetup: "none",
          webDeploy: "none",
          serverDeploy: "none",
          install: false,
        };

        // Set appropriate setup for each auth provider
        if (auth === "clerk") {
          config.backend = "convex";
          config.runtime = "none";
          config.database = "none";
          config.orm = "none";
          config.api = "none";
        } else if (auth === "better-auth") {
          config.backend = "hono";
          config.runtime = "bun";
          config.database = "sqlite";
          config.orm = "drizzle";
          config.api = "trpc";
        } else {
          // none
          config.backend = "hono";
          config.runtime = "bun";
          config.database = "sqlite";
          config.orm = "drizzle";
          config.api = "trpc";
        }

        const result = await runTRPCTest(config);
        expectSuccess(result);
      });
    }
  });

  describe("Auth Edge Cases", () => {
    it("should handle auth with complex frontend combinations", async () => {
      const result = await runTRPCTest({
        projectName: "auth-web-native-combo",
        auth: "better-auth",
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        api: "trpc",
        frontend: ["tanstack-router", "native-bare"],
        addons: ["turborepo"],
        examples: ["todo"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });

    it("should handle auth constraints with workers runtime", async () => {
      const result = await runTRPCTest({
        projectName: "auth-workers",
        auth: "better-auth",
        backend: "hono",
        runtime: "workers",
        database: "sqlite",
        orm: "drizzle",
        api: "trpc",
        frontend: ["tanstack-router"],
        addons: ["turborepo"],
        examples: ["todo"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "cloudflare",
        install: false,
      });

      expectSuccess(result);
    });
  });
});
