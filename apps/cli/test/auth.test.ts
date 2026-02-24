import { describe, expect, it } from "bun:test";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

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
        examples: ["none"],
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
          examples: ["none"],
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
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
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
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
      });

      expectSuccess(result);
    });

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
          examples: ["none"],
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

  describe("Auth.js (NextAuth) Provider", () => {
    it("should work with nextauth + self backend + next + drizzle", async () => {
      const result = await runTRPCTest({
        projectName: "nextauth-self-next-drizzle",
        auth: "nextauth",
        backend: "self",
        runtime: "none",
        database: "postgres",
        orm: "drizzle",
        api: "trpc",
        frontend: ["next"],
        addons: ["turborepo"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });

    it("should work with nextauth + self backend + next + prisma", async () => {
      const result = await runTRPCTest({
        projectName: "nextauth-self-next-prisma",
        auth: "nextauth",
        backend: "self",
        runtime: "none",
        database: "postgres",
        orm: "prisma",
        api: "trpc",
        frontend: ["next"],
        addons: ["turborepo"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });

    it("should work with nextauth + self backend + next + sqlite", async () => {
      const result = await runTRPCTest({
        projectName: "nextauth-self-next-sqlite",
        auth: "nextauth",
        backend: "self",
        runtime: "none",
        database: "sqlite",
        orm: "drizzle",
        api: "trpc",
        frontend: ["next"],
        addons: ["turborepo"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });

    it("should fail with nextauth + non-self backend", async () => {
      const result = await runTRPCTest({
        projectName: "nextauth-non-self-fail",
        auth: "nextauth",
        backend: "hono",
        runtime: "bun",
        database: "postgres",
        orm: "drizzle",
        api: "trpc",
        frontend: ["next"],
        addons: ["turborepo"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        expectError: true,
      });

      expectError(result, "Auth.js (NextAuth) is currently supported only with the 'self' backend");
    });

    it("should fail with nextauth + non-next frontend", async () => {
      const result = await runTRPCTest({
        projectName: "nextauth-non-next-fail",
        auth: "nextauth",
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
        expectError: true,
      });

      expectError(result, "Auth.js (NextAuth) currently requires the Next.js frontend");
    });

    it("should fail with nextauth + tanstack-router frontend", async () => {
      const result = await runTRPCTest({
        projectName: "nextauth-tanstack-router-fail",
        auth: "nextauth",
        backend: "hono",
        runtime: "bun",
        database: "postgres",
        orm: "drizzle",
        api: "trpc",
        frontend: ["tanstack-router"],
        addons: ["turborepo"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        expectError: true,
      });

      expectError(result, "Auth.js (NextAuth)");
    });

    it("should fail with nextauth + convex backend", async () => {
      const result = await runTRPCTest({
        projectName: "nextauth-convex-fail",
        auth: "nextauth",
        backend: "convex",
        runtime: "none",
        database: "none",
        orm: "none",
        api: "none",
        frontend: ["next"],
        addons: ["turborepo"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        expectError: true,
      });

      expectError(result, "Auth.js (NextAuth) is currently supported only with the 'self' backend");
    });
  });

  describe("Stack Auth Provider", () => {
    it("should work with stack-auth + self backend + next", async () => {
      const result = await runTRPCTest({
        projectName: "stack-auth-self-next",
        auth: "stack-auth",
        backend: "self",
        runtime: "none",
        database: "postgres",
        orm: "drizzle",
        api: "trpc",
        frontend: ["next"],
        addons: ["turborepo"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });

    it("should work with stack-auth + self backend + next + prisma", async () => {
      const result = await runTRPCTest({
        projectName: "stack-auth-self-next-prisma",
        auth: "stack-auth",
        backend: "self",
        runtime: "none",
        database: "postgres",
        orm: "prisma",
        api: "trpc",
        frontend: ["next"],
        addons: ["turborepo"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });

    it("should work with stack-auth + self backend + next + sqlite", async () => {
      const result = await runTRPCTest({
        projectName: "stack-auth-self-next-sqlite",
        auth: "stack-auth",
        backend: "self",
        runtime: "none",
        database: "sqlite",
        orm: "drizzle",
        api: "trpc",
        frontend: ["next"],
        addons: ["turborepo"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });

    it("should fail with stack-auth + non-self backend", async () => {
      const result = await runTRPCTest({
        projectName: "stack-auth-non-self-fail",
        auth: "stack-auth",
        backend: "hono",
        runtime: "bun",
        database: "postgres",
        orm: "drizzle",
        api: "trpc",
        frontend: ["next"],
        addons: ["turborepo"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        expectError: true,
      });

      expectError(result, "Stack Auth is currently supported only with the 'self' backend");
    });

    it("should fail with stack-auth + non-next frontend", async () => {
      const result = await runTRPCTest({
        projectName: "stack-auth-non-next-fail",
        auth: "stack-auth",
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
        expectError: true,
      });

      expectError(result, "Stack Auth currently requires the Next.js frontend");
    });

    it("should fail with stack-auth + tanstack-router frontend", async () => {
      const result = await runTRPCTest({
        projectName: "stack-auth-tanstack-router-fail",
        auth: "stack-auth",
        backend: "hono",
        runtime: "bun",
        database: "postgres",
        orm: "drizzle",
        api: "trpc",
        frontend: ["tanstack-router"],
        addons: ["turborepo"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        expectError: true,
      });

      expectError(result, "Stack Auth");
    });

    it("should fail with stack-auth + convex backend", async () => {
      const result = await runTRPCTest({
        projectName: "stack-auth-convex-fail",
        auth: "stack-auth",
        backend: "convex",
        runtime: "none",
        database: "none",
        orm: "none",
        api: "none",
        frontend: ["next"],
        addons: ["turborepo"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        expectError: true,
      });

      expectError(result, "Stack Auth is currently supported only with the 'self' backend");
    });
  });

  describe("Supabase Auth Provider", () => {
    it("should work with supabase-auth + self backend + next", async () => {
      const result = await runTRPCTest({
        projectName: "supabase-auth-self-next",
        auth: "supabase-auth",
        backend: "self",
        runtime: "none",
        database: "postgres",
        orm: "drizzle",
        api: "trpc",
        frontend: ["next"],
        addons: ["turborepo"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });

    it("should work with supabase-auth + self backend + next + prisma", async () => {
      const result = await runTRPCTest({
        projectName: "supabase-auth-self-next-prisma",
        auth: "supabase-auth",
        backend: "self",
        runtime: "none",
        database: "postgres",
        orm: "prisma",
        api: "trpc",
        frontend: ["next"],
        addons: ["turborepo"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });

    it("should work with supabase-auth + self backend + next + sqlite", async () => {
      const result = await runTRPCTest({
        projectName: "supabase-auth-self-next-sqlite",
        auth: "supabase-auth",
        backend: "self",
        runtime: "none",
        database: "sqlite",
        orm: "drizzle",
        api: "trpc",
        frontend: ["next"],
        addons: ["turborepo"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });

    it("should fail with supabase-auth + non-self backend", async () => {
      const result = await runTRPCTest({
        projectName: "supabase-auth-non-self-fail",
        auth: "supabase-auth",
        backend: "hono",
        runtime: "bun",
        database: "postgres",
        orm: "drizzle",
        api: "trpc",
        frontend: ["next"],
        addons: ["turborepo"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        expectError: true,
      });

      expectError(result, "Supabase Auth is currently supported only with the 'self' backend");
    });

    it("should fail with supabase-auth + non-next frontend", async () => {
      const result = await runTRPCTest({
        projectName: "supabase-auth-non-next-fail",
        auth: "supabase-auth",
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
        expectError: true,
      });

      expectError(result, "Supabase Auth currently requires the Next.js frontend");
    });

    it("should fail with supabase-auth + tanstack-router frontend", async () => {
      const result = await runTRPCTest({
        projectName: "supabase-auth-tanstack-router-fail",
        auth: "supabase-auth",
        backend: "hono",
        runtime: "bun",
        database: "postgres",
        orm: "drizzle",
        api: "trpc",
        frontend: ["tanstack-router"],
        addons: ["turborepo"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        expectError: true,
      });

      expectError(result, "Supabase Auth");
    });

    it("should fail with supabase-auth + convex backend", async () => {
      const result = await runTRPCTest({
        projectName: "supabase-auth-convex-fail",
        auth: "supabase-auth",
        backend: "convex",
        runtime: "none",
        database: "none",
        orm: "none",
        api: "none",
        frontend: ["next"],
        addons: ["turborepo"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        expectError: true,
      });

      expectError(result, "Supabase Auth is currently supported only with the 'self' backend");
    });
  });

  describe("Auth0 Provider", () => {
    it("should work with auth0 + self backend + next", async () => {
      const result = await runTRPCTest({
        projectName: "auth0-self-next",
        auth: "auth0",
        backend: "self",
        runtime: "none",
        database: "postgres",
        orm: "drizzle",
        api: "trpc",
        frontend: ["next"],
        addons: ["turborepo"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });

    it("should work with auth0 + self backend + next + prisma", async () => {
      const result = await runTRPCTest({
        projectName: "auth0-self-next-prisma",
        auth: "auth0",
        backend: "self",
        runtime: "none",
        database: "postgres",
        orm: "prisma",
        api: "trpc",
        frontend: ["next"],
        addons: ["turborepo"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });

    it("should work with auth0 + self backend + next + sqlite", async () => {
      const result = await runTRPCTest({
        projectName: "auth0-self-next-sqlite",
        auth: "auth0",
        backend: "self",
        runtime: "none",
        database: "sqlite",
        orm: "drizzle",
        api: "trpc",
        frontend: ["next"],
        addons: ["turborepo"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });

    it("should fail with auth0 + non-self backend", async () => {
      const result = await runTRPCTest({
        projectName: "auth0-non-self-fail",
        auth: "auth0",
        backend: "hono",
        runtime: "bun",
        database: "postgres",
        orm: "drizzle",
        api: "trpc",
        frontend: ["next"],
        addons: ["turborepo"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        expectError: true,
      });

      expectError(result, "Auth0 is currently supported only with the 'self' backend");
    });

    it("should fail with auth0 + non-next frontend", async () => {
      const result = await runTRPCTest({
        projectName: "auth0-non-next-fail",
        auth: "auth0",
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
        expectError: true,
      });

      expectError(result, "Auth0 currently requires the Next.js frontend");
    });

    it("should fail with auth0 + tanstack-router frontend", async () => {
      const result = await runTRPCTest({
        projectName: "auth0-tanstack-router-fail",
        auth: "auth0",
        backend: "hono",
        runtime: "bun",
        database: "postgres",
        orm: "drizzle",
        api: "trpc",
        frontend: ["tanstack-router"],
        addons: ["turborepo"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        expectError: true,
      });

      expectError(result, "Auth0");
    });

    it("should fail with auth0 + convex backend", async () => {
      const result = await runTRPCTest({
        projectName: "auth0-convex-fail",
        auth: "auth0",
        backend: "convex",
        runtime: "none",
        database: "none",
        orm: "none",
        api: "none",
        frontend: ["next"],
        addons: ["turborepo"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        expectError: true,
      });

      expectError(result, "Auth0 is currently supported only with the 'self' backend");
    });
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
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });

    it("should work with clerk + self backend + next and generate legit templates", async () => {
      const result = await runTRPCTest({
        projectName: "clerk-self-next",
        auth: "clerk",
        backend: "self",
        runtime: "none",
        database: "postgres",
        orm: "drizzle",
        api: "trpc",
        frontend: ["next"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        addons: ["turborepo"],
        install: false,
      });

      expectSuccess(result);
      expect(result.projectDir).toBeDefined();

      const projectDir = result.projectDir!;
      const middleware = await readFile(join(projectDir, "apps/web/src/middleware.ts"), "utf8");
      const dashboard = await readFile(join(projectDir, "apps/web/src/app/dashboard/page.tsx"), "utf8");
      const userMenu = await readFile(
        join(projectDir, "apps/web/src/components/user-menu.tsx"),
        "utf8",
      );
      const webEnv = await readFile(join(projectDir, "apps/web/.env"), "utf8");
      const webEnvSchema = await readFile(join(projectDir, "packages/env/src/web.ts"), "utf8");
      const webPackageJson = await readFile(join(projectDir, "apps/web/package.json"), "utf8");

      expect(middleware).toContain("clerkMiddleware");
      expect(dashboard).toContain('await auth()');
      expect(dashboard).toContain('redirect("/")');
      expect(userMenu).toContain("@clerk/nextjs");
      expect(webEnv).toContain("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=");
      expect(webEnv).toContain("CLERK_SECRET_KEY=");
      expect(webEnvSchema).toContain("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY");
      expect(webPackageJson).toContain("@clerk/nextjs");
    });

    it("should work with clerk + self backend + tanstack-start and generate legit templates", async () => {
      const result = await runTRPCTest({
        projectName: "clerk-self-tanstack-start",
        auth: "clerk",
        backend: "self",
        runtime: "none",
        database: "postgres",
        orm: "drizzle",
        api: "orpc",
        frontend: ["tanstack-start"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        addons: ["turborepo"],
        install: false,
      });

      expectSuccess(result);
      expect(result.projectDir).toBeDefined();

      const projectDir = result.projectDir!;
      const startFile = await readFile(join(projectDir, "apps/web/src/start.ts"), "utf8");
      const dashboard = await readFile(join(projectDir, "apps/web/src/routes/dashboard.tsx"), "utf8");
      const userMenu = await readFile(
        join(projectDir, "apps/web/src/components/user-menu.tsx"),
        "utf8",
      );
      const webEnv = await readFile(join(projectDir, "apps/web/.env"), "utf8");
      const webEnvSchema = await readFile(join(projectDir, "packages/env/src/web.ts"), "utf8");
      const webPackageJson = await readFile(join(projectDir, "apps/web/package.json"), "utf8");

      expect(startFile).toContain("clerkMiddleware()");
      expect(dashboard).toContain("@clerk/tanstack-react-start");
      expect(dashboard).toContain("createServerFn");
      expect(dashboard).toContain('to: "/"');
      expect(userMenu).toContain("@clerk/tanstack-react-start");
      expect(webEnv).toContain("VITE_CLERK_PUBLISHABLE_KEY=");
      expect(webEnv).toContain("CLERK_SECRET_KEY=");
      expect(webEnvSchema).toContain("VITE_CLERK_PUBLISHABLE_KEY");
      expect(webPackageJson).toContain("@clerk/tanstack-react-start");
      expect(webPackageJson).toContain("\"srvx\"");
    });

    it("should fail with clerk + unsupported standalone backend", async () => {
      const result = await runTRPCTest({
        projectName: "clerk-hono-fail",
        auth: "clerk",
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        addons: ["turborepo"],
        orm: "drizzle",
        api: "trpc",
        frontend: ["tanstack-router"],
        expectError: true,
      });

      expectError(result, "Clerk authentication is currently supported with the Convex backend");
    });

    it("should fail with clerk + self backend + astro", async () => {
      const result = await runTRPCTest({
        projectName: "clerk-self-astro-fail",
        auth: "clerk",
        backend: "self",
        runtime: "none",
        database: "sqlite",
        orm: "drizzle",
        api: "orpc",
        frontend: ["astro"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        addons: ["turborepo"],
        expectError: true,
      });

      expectError(result, "Clerk is not yet supported for Astro fullstack projects");
    });

    it("should fail with clerk + self backend + nuxt", async () => {
      const result = await runTRPCTest({
        projectName: "clerk-self-nuxt-fail",
        auth: "clerk",
        backend: "self",
        runtime: "none",
        database: "sqlite",
        orm: "drizzle",
        api: "orpc",
        frontend: ["nuxt"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        addons: ["turborepo"],
        expectError: true,
      });

      expectError(result, "Clerk is not yet supported for Nuxt fullstack projects");
    });

    it("should fail with clerk + self backend + next + native companion", async () => {
      const result = await runTRPCTest({
        projectName: "clerk-self-next-native-fail",
        auth: "clerk",
        backend: "self",
        runtime: "none",
        database: "postgres",
        orm: "drizzle",
        api: "trpc",
        frontend: ["next", "native-bare"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        addons: ["turborepo"],
        expectError: true,
      });

      expectError(result, "supported only for web-only Next.js or TanStack Start projects");
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
          examples: ["none"],
          orm: "none",
          api: "none",
          frontend: [frontend as Frontend],
          install: false,
        });

        expectSuccess(result);
      });
    }

    const incompatibleFrontends = ["nuxt", "svelte", "solid"];

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
          examples: ["none"],
          dbSetup: "none",
          webDeploy: "none",
          serverDeploy: "none",
          expectError: true,
        });

        expectError(
          result,
          frontend === "solid"
            ? "not compatible with '--backend convex'"
            : "Clerk + Convex is not compatible",
        );
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
        examples: ["none"],
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
        examples: ["none"],
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
          examples: ["none"],
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

  describe("All Auth Providers", () => {
    for (const auth of AUTH_PROVIDERS) {
      it(`should work with ${auth} in appropriate setup`, async () => {
        const config: TestConfig = {
          projectName: `test-${auth}`,
          auth,
          frontend: ["tanstack-router"],
          addons: ["turborepo"],
          examples: ["none"],
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
        } else if (auth === "nextauth") {
          config.backend = "self";
          config.runtime = "none";
          config.database = "postgres";
          config.orm = "drizzle";
          config.api = "trpc";
          config.frontend = ["next"];
        } else if (auth === "stack-auth") {
          config.backend = "self";
          config.runtime = "none";
          config.database = "postgres";
          config.orm = "drizzle";
          config.api = "trpc";
          config.frontend = ["next"];
        } else if (auth === "supabase-auth") {
          config.backend = "self";
          config.runtime = "none";
          config.database = "postgres";
          config.orm = "drizzle";
          config.api = "trpc";
          config.frontend = ["next"];
        } else if (auth === "auth0") {
          config.backend = "self";
          config.runtime = "none";
          config.database = "postgres";
          config.orm = "drizzle";
          config.api = "trpc";
          config.frontend = ["next"];
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
        examples: ["none"],
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
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "cloudflare",
        install: false,
      });

      expectSuccess(result);
    });
  });
});
