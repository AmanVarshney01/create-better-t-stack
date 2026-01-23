import { describe, it, expect } from "bun:test";
import fs from "fs-extra";
import path from "path";

import { expectSuccess, runTRPCTest } from "./test-utils";

describe("Analytics Configurations", () => {
  describe("Plausible", () => {
    it("should work with plausible + hono backend", async () => {
      const result = await runTRPCTest({
        projectName: "plausible-hono",
        analytics: "plausible",
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        api: "trpc",
        auth: "better-auth",
        frontend: ["tanstack-router"],
        addons: ["turborepo"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);

      // Check that Plausible dependency was added to web (client-side only)
      if (result.projectDir) {
        const webPackageJsonPath = path.join(result.projectDir, "apps/web/package.json");
        if (await fs.pathExists(webPackageJsonPath)) {
          const pkgJson = await fs.readJson(webPackageJsonPath);
          expect(pkgJson.dependencies?.["plausible-tracker"]).toBeDefined();
        }

        // Verify Plausible template was created in src/lib
        const plausiblePath = path.join(result.projectDir, "apps/web/src/lib/plausible.tsx");
        expect(await fs.pathExists(plausiblePath)).toBe(true);
      }
    });

    it("should work with plausible + express backend", async () => {
      const result = await runTRPCTest({
        projectName: "plausible-express",
        analytics: "plausible",
        backend: "express",
        runtime: "node",
        database: "sqlite",
        orm: "drizzle",
        api: "trpc",
        auth: "better-auth",
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

    it("should work with plausible + Next.js fullstack", async () => {
      const result = await runTRPCTest({
        projectName: "plausible-next",
        analytics: "plausible",
        backend: "self",
        runtime: "none",
        database: "sqlite",
        orm: "drizzle",
        api: "trpc",
        auth: "better-auth",
        frontend: ["next"],
        addons: ["turborepo"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);

      // For fullstack apps, Plausible should be in web package
      if (result.projectDir) {
        const webPackageJsonPath = path.join(result.projectDir, "apps/web/package.json");
        if (await fs.pathExists(webPackageJsonPath)) {
          const pkgJson = await fs.readJson(webPackageJsonPath);
          expect(pkgJson.dependencies?.["plausible-tracker"]).toBeDefined();
        }
      }
    });

    it("should work with plausible + react-router frontend", async () => {
      const result = await runTRPCTest({
        projectName: "plausible-react-router",
        analytics: "plausible",
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        api: "trpc",
        auth: "better-auth",
        frontend: ["react-router"],
        addons: ["turborepo"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });

    it("should not add plausible to server (client-side only)", async () => {
      const result = await runTRPCTest({
        projectName: "plausible-no-server",
        analytics: "plausible",
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        api: "trpc",
        auth: "better-auth",
        frontend: ["tanstack-router"],
        addons: ["turborepo"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);

      // Check that Plausible was NOT added to server (it's client-side only)
      if (result.projectDir) {
        const serverPackageJsonPath = path.join(result.projectDir, "apps/server/package.json");
        if (await fs.pathExists(serverPackageJsonPath)) {
          const pkgJson = await fs.readJson(serverPackageJsonPath);
          expect(pkgJson.dependencies?.["plausible-tracker"]).toBeUndefined();
        }
      }
    });

    it("should work with plausible + elysia backend", async () => {
      const result = await runTRPCTest({
        projectName: "plausible-elysia",
        analytics: "plausible",
        backend: "elysia",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        api: "trpc",
        auth: "better-auth",
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

    it("should create plausible.tsx template with correct env vars for Next.js", async () => {
      const result = await runTRPCTest({
        projectName: "plausible-env-next",
        analytics: "plausible",
        backend: "self",
        runtime: "none",
        database: "sqlite",
        orm: "drizzle",
        api: "trpc",
        auth: "better-auth",
        frontend: ["next"],
        addons: ["turborepo"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);

      // Check the env file contains the right env vars
      if (result.projectDir) {
        const envPath = path.join(result.projectDir, "apps/web/.env");
        if (await fs.pathExists(envPath)) {
          const envContent = await fs.readFile(envPath, "utf-8");
          expect(envContent).toContain("NEXT_PUBLIC_PLAUSIBLE_DOMAIN");
          expect(envContent).toContain("NEXT_PUBLIC_PLAUSIBLE_API_HOST");
        }
      }
    });

    it("should create plausible.tsx template with correct env vars for Vite", async () => {
      const result = await runTRPCTest({
        projectName: "plausible-env-vite",
        analytics: "plausible",
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        api: "trpc",
        auth: "better-auth",
        frontend: ["tanstack-router"],
        addons: ["turborepo"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);

      // Check the env file contains the right env vars
      if (result.projectDir) {
        const envPath = path.join(result.projectDir, "apps/web/.env");
        if (await fs.pathExists(envPath)) {
          const envContent = await fs.readFile(envPath, "utf-8");
          expect(envContent).toContain("VITE_PLAUSIBLE_DOMAIN");
          expect(envContent).toContain("VITE_PLAUSIBLE_API_HOST");
        }
      }
    });
  });

  describe("No Analytics (none)", () => {
    it("should not add analytics dependencies when analytics is none", async () => {
      const result = await runTRPCTest({
        projectName: "no-analytics",
        analytics: "none",
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        api: "trpc",
        auth: "better-auth",
        frontend: ["tanstack-router"],
        addons: ["turborepo"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);

      // Check that Plausible dependencies were NOT added
      if (result.projectDir) {
        const webPackageJsonPath = path.join(result.projectDir, "apps/web/package.json");
        if (await fs.pathExists(webPackageJsonPath)) {
          const pkgJson = await fs.readJson(webPackageJsonPath);
          expect(pkgJson.dependencies?.["plausible-tracker"]).toBeUndefined();
        }
      }
    });
  });

  describe("Analytics with Feature Flags", () => {
    it("should work with both plausible analytics and posthog feature flags", async () => {
      const result = await runTRPCTest({
        projectName: "plausible-posthog",
        analytics: "plausible",
        featureFlags: "posthog",
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        api: "trpc",
        auth: "better-auth",
        frontend: ["tanstack-router"],
        addons: ["turborepo"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);

      // Check that both Plausible and PostHog dependencies were added to web
      if (result.projectDir) {
        const webPackageJsonPath = path.join(result.projectDir, "apps/web/package.json");
        if (await fs.pathExists(webPackageJsonPath)) {
          const pkgJson = await fs.readJson(webPackageJsonPath);
          expect(pkgJson.dependencies?.["plausible-tracker"]).toBeDefined();
          expect(pkgJson.dependencies?.["posthog-js"]).toBeDefined();
        }
      }
    });

    it("should work with plausible analytics and growthbook feature flags", async () => {
      const result = await runTRPCTest({
        projectName: "plausible-growthbook",
        analytics: "plausible",
        featureFlags: "growthbook",
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        api: "trpc",
        auth: "better-auth",
        frontend: ["tanstack-router"],
        addons: ["turborepo"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);

      // Check that both Plausible and GrowthBook dependencies were added to web
      if (result.projectDir) {
        const webPackageJsonPath = path.join(result.projectDir, "apps/web/package.json");
        if (await fs.pathExists(webPackageJsonPath)) {
          const pkgJson = await fs.readJson(webPackageJsonPath);
          expect(pkgJson.dependencies?.["plausible-tracker"]).toBeDefined();
          expect(pkgJson.dependencies?.["@growthbook/growthbook-react"]).toBeDefined();
        }
      }
    });
  });
});
