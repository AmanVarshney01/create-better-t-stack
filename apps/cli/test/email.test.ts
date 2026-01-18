import { describe, it, expect } from "bun:test";

import type { Backend, Frontend, Email } from "../src/types";

import { expectSuccess, runTRPCTest, type TestConfig } from "./test-utils";

describe("Email Configurations", () => {
  describe("Resend Email", () => {
    it("should work with resend + hono backend", async () => {
      const result = await runTRPCTest({
        projectName: "resend-hono",
        email: "resend",
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

      // Check that Resend dependencies were added
      const serverPackageJson = result.result?.tree?.root?.children
        ?.find((c: any) => c.name === "packages")
        ?.children?.find((c: any) => c.name === "server")
        ?.children?.find((c: any) => c.name === "package.json");

      if (serverPackageJson?.content) {
        const pkgJson = JSON.parse(serverPackageJson.content);
        expect(pkgJson.dependencies?.resend).toBeDefined();
        expect(pkgJson.dependencies?.["@react-email/components"]).toBeDefined();
      }
    });

    it("should work with resend + express backend", async () => {
      const result = await runTRPCTest({
        projectName: "resend-express",
        email: "resend",
        backend: "express",
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

    it("should work with resend + elysia backend", async () => {
      const result = await runTRPCTest({
        projectName: "resend-elysia",
        email: "resend",
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

    it("should work with resend + next.js fullstack", async () => {
      const result = await runTRPCTest({
        projectName: "resend-next",
        email: "resend",
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
    });

    it("should work with resend + tanstack-start fullstack", async () => {
      const result = await runTRPCTest({
        projectName: "resend-tanstack-start",
        email: "resend",
        backend: "self",
        runtime: "none",
        database: "sqlite",
        orm: "drizzle",
        api: "trpc",
        auth: "better-auth",
        frontend: ["tanstack-start"],
        addons: ["turborepo"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });

    const compatibleBackends: Backend[] = ["hono", "express", "fastify", "elysia"];

    for (const backend of compatibleBackends) {
      it(`should work with resend + ${backend}`, async () => {
        const result = await runTRPCTest({
          projectName: `resend-${backend}`,
          email: "resend",
          backend,
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
    }
  });

  describe("React Email Only", () => {
    it("should work with react-email only (no Resend)", async () => {
      const result = await runTRPCTest({
        projectName: "react-email-only",
        email: "react-email",
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
    });
  });

  describe("No Email", () => {
    it("should work with email: none", async () => {
      const result = await runTRPCTest({
        projectName: "no-email",
        email: "none",
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
    });
  });

  describe("Email with Different Frontends", () => {
    const reactFrontends: Frontend[] = [
      "tanstack-router",
      "react-router",
      "tanstack-start",
      "next",
    ];

    for (const frontend of reactFrontends) {
      it(`should work with resend + ${frontend}`, async () => {
        const config: TestConfig = {
          projectName: `resend-${frontend}`,
          email: "resend",
          database: "sqlite",
          orm: "drizzle",
          auth: "better-auth",
          frontend: [frontend],
          addons: ["turborepo"],
          examples: ["none"],
          dbSetup: "none",
          webDeploy: "none",
          serverDeploy: "none",
          install: false,
        };

        // Handle fullstack vs separate backend
        if (frontend === "next" || frontend === "tanstack-start") {
          config.backend = "self";
          config.runtime = "none";
          config.api = "trpc";
        } else {
          config.backend = "hono";
          config.runtime = "bun";
          config.api = "trpc";
        }

        const result = await runTRPCTest(config);
        expectSuccess(result);
      });
    }
  });

  describe("Email Not Available with Convex", () => {
    it("should skip email with convex backend (email defaults to none)", async () => {
      const result = await runTRPCTest({
        projectName: "email-convex",
        email: "none", // Email is not supported with Convex
        backend: "convex",
        runtime: "none",
        database: "none",
        orm: "none",
        api: "none",
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
  });

  describe("Email Environment Variables", () => {
    it("should add RESEND_API_KEY to .env when email is resend", async () => {
      const result = await runTRPCTest({
        projectName: "resend-env-vars",
        email: "resend",
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

      // Check that env variables were added
      const serverDir = result.result?.tree?.root?.children
        ?.find((c: any) => c.name === "apps")
        ?.children?.find((c: any) => c.name === "server");

      const envFile = serverDir?.children?.find((c: any) => c.name === ".env");

      if (envFile?.content) {
        expect(envFile.content).toContain("RESEND_API_KEY");
        expect(envFile.content).toContain("RESEND_FROM_EMAIL");
      }
    });
  });

  describe("All Email Options", () => {
    const emailOptions: Email[] = ["resend", "react-email", "none"];

    for (const email of emailOptions) {
      it(`should work with email: ${email}`, async () => {
        const result = await runTRPCTest({
          projectName: `email-${email}`,
          email,
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
      });
    }
  });
});
