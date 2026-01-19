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
    const emailOptions: Email[] = [
      "resend",
      "react-email",
      "nodemailer",
      "postmark",
      "sendgrid",
      "aws-ses",
      "mailgun",
      "plunk",
      "none",
    ];

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

  describe("Nodemailer Email", () => {
    it("should work with nodemailer + hono backend", async () => {
      const result = await runTRPCTest({
        projectName: "nodemailer-hono",
        email: "nodemailer",
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

      // Check that Nodemailer dependencies were added
      const serverPackageJson = result.result?.tree?.root?.children
        ?.find((c: any) => c.name === "packages")
        ?.children?.find((c: any) => c.name === "server")
        ?.children?.find((c: any) => c.name === "package.json");

      if (serverPackageJson?.content) {
        const pkgJson = JSON.parse(serverPackageJson.content);
        expect(pkgJson.dependencies?.nodemailer).toBeDefined();
        expect(pkgJson.devDependencies?.["@types/nodemailer"]).toBeDefined();
      }
    });

    it("should work with nodemailer + express backend", async () => {
      const result = await runTRPCTest({
        projectName: "nodemailer-express",
        email: "nodemailer",
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

    it("should not include react-email components with nodemailer", async () => {
      const result = await runTRPCTest({
        projectName: "nodemailer-no-react-email",
        email: "nodemailer",
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

      // Check that react-email dependencies were NOT added for nodemailer
      const serverPackageJson = result.result?.tree?.root?.children
        ?.find((c: any) => c.name === "packages")
        ?.children?.find((c: any) => c.name === "server")
        ?.children?.find((c: any) => c.name === "package.json");

      if (serverPackageJson?.content) {
        const pkgJson = JSON.parse(serverPackageJson.content);
        expect(pkgJson.dependencies?.["@react-email/components"]).toBeUndefined();
        expect(pkgJson.dependencies?.["react-email"]).toBeUndefined();
      }
    });

    const compatibleBackends: Backend[] = ["hono", "express", "fastify", "elysia"];

    for (const backend of compatibleBackends) {
      it(`should work with nodemailer + ${backend}`, async () => {
        const result = await runTRPCTest({
          projectName: `nodemailer-${backend}`,
          email: "nodemailer",
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

    it("should add SMTP environment variables when email is nodemailer", async () => {
      const result = await runTRPCTest({
        projectName: "nodemailer-env-vars",
        email: "nodemailer",
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
        expect(envFile.content).toContain("SMTP_HOST");
        expect(envFile.content).toContain("SMTP_PORT");
        expect(envFile.content).toContain("SMTP_USER");
        expect(envFile.content).toContain("SMTP_PASS");
        expect(envFile.content).toContain("SMTP_FROM_EMAIL");
      }
    });
  });

  describe("Postmark Email", () => {
    it("should work with postmark + hono backend", async () => {
      const result = await runTRPCTest({
        projectName: "postmark-hono",
        email: "postmark",
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

      // Check that Postmark dependencies were added
      const serverPackageJson = result.result?.tree?.root?.children
        ?.find((c: any) => c.name === "packages")
        ?.children?.find((c: any) => c.name === "server")
        ?.children?.find((c: any) => c.name === "package.json");

      if (serverPackageJson?.content) {
        const pkgJson = JSON.parse(serverPackageJson.content);
        expect(pkgJson.dependencies?.postmark).toBeDefined();
      }
    });

    it("should work with postmark + express backend", async () => {
      const result = await runTRPCTest({
        projectName: "postmark-express",
        email: "postmark",
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

    it("should not include react-email components with postmark", async () => {
      const result = await runTRPCTest({
        projectName: "postmark-no-react-email",
        email: "postmark",
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

      // Check that react-email dependencies were NOT added for postmark
      const serverPackageJson = result.result?.tree?.root?.children
        ?.find((c: any) => c.name === "packages")
        ?.children?.find((c: any) => c.name === "server")
        ?.children?.find((c: any) => c.name === "package.json");

      if (serverPackageJson?.content) {
        const pkgJson = JSON.parse(serverPackageJson.content);
        expect(pkgJson.dependencies?.["@react-email/components"]).toBeUndefined();
        expect(pkgJson.dependencies?.["react-email"]).toBeUndefined();
      }
    });

    const compatibleBackends: Backend[] = ["hono", "express", "fastify", "elysia"];

    for (const backend of compatibleBackends) {
      it(`should work with postmark + ${backend}`, async () => {
        const result = await runTRPCTest({
          projectName: `postmark-${backend}`,
          email: "postmark",
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

    it("should add POSTMARK environment variables when email is postmark", async () => {
      const result = await runTRPCTest({
        projectName: "postmark-env-vars",
        email: "postmark",
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
        expect(envFile.content).toContain("POSTMARK_SERVER_TOKEN");
        expect(envFile.content).toContain("POSTMARK_FROM_EMAIL");
      }
    });
  });

  describe("SendGrid Email", () => {
    it("should work with sendgrid + hono backend", async () => {
      const result = await runTRPCTest({
        projectName: "sendgrid-hono",
        email: "sendgrid",
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

      // Check that SendGrid dependencies were added
      const serverPackageJson = result.result?.tree?.root?.children
        ?.find((c: any) => c.name === "packages")
        ?.children?.find((c: any) => c.name === "server")
        ?.children?.find((c: any) => c.name === "package.json");

      if (serverPackageJson?.content) {
        const pkgJson = JSON.parse(serverPackageJson.content);
        expect(pkgJson.dependencies?.["@sendgrid/mail"]).toBeDefined();
      }
    });

    it("should work with sendgrid + express backend", async () => {
      const result = await runTRPCTest({
        projectName: "sendgrid-express",
        email: "sendgrid",
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

    it("should not include react-email components with sendgrid", async () => {
      const result = await runTRPCTest({
        projectName: "sendgrid-no-react-email",
        email: "sendgrid",
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

      // Check that react-email dependencies were NOT added for sendgrid
      const serverPackageJson = result.result?.tree?.root?.children
        ?.find((c: any) => c.name === "packages")
        ?.children?.find((c: any) => c.name === "server")
        ?.children?.find((c: any) => c.name === "package.json");

      if (serverPackageJson?.content) {
        const pkgJson = JSON.parse(serverPackageJson.content);
        expect(pkgJson.dependencies?.["@react-email/components"]).toBeUndefined();
        expect(pkgJson.dependencies?.["react-email"]).toBeUndefined();
      }
    });

    const compatibleBackends: Backend[] = ["hono", "express", "fastify", "elysia"];

    for (const backend of compatibleBackends) {
      it(`should work with sendgrid + ${backend}`, async () => {
        const result = await runTRPCTest({
          projectName: `sendgrid-${backend}`,
          email: "sendgrid",
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

    it("should add SENDGRID environment variables when email is sendgrid", async () => {
      const result = await runTRPCTest({
        projectName: "sendgrid-env-vars",
        email: "sendgrid",
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
        expect(envFile.content).toContain("SENDGRID_API_KEY");
        expect(envFile.content).toContain("SENDGRID_FROM_EMAIL");
      }
    });
  });

  describe("AWS SES Email", () => {
    it("should work with aws-ses + hono backend", async () => {
      const result = await runTRPCTest({
        projectName: "aws-ses-hono",
        email: "aws-ses",
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

      // Check that AWS SES dependencies were added
      const serverPackageJson = result.result?.tree?.root?.children
        ?.find((c: any) => c.name === "packages")
        ?.children?.find((c: any) => c.name === "server")
        ?.children?.find((c: any) => c.name === "package.json");

      if (serverPackageJson?.content) {
        const pkgJson = JSON.parse(serverPackageJson.content);
        expect(pkgJson.dependencies?.["@aws-sdk/client-ses"]).toBeDefined();
      }
    });

    it("should work with aws-ses + express backend", async () => {
      const result = await runTRPCTest({
        projectName: "aws-ses-express",
        email: "aws-ses",
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

    it("should not include react-email components with aws-ses", async () => {
      const result = await runTRPCTest({
        projectName: "aws-ses-no-react-email",
        email: "aws-ses",
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

      // Check that react-email dependencies were NOT added for aws-ses
      const serverPackageJson = result.result?.tree?.root?.children
        ?.find((c: any) => c.name === "packages")
        ?.children?.find((c: any) => c.name === "server")
        ?.children?.find((c: any) => c.name === "package.json");

      if (serverPackageJson?.content) {
        const pkgJson = JSON.parse(serverPackageJson.content);
        expect(pkgJson.dependencies?.["@react-email/components"]).toBeUndefined();
        expect(pkgJson.dependencies?.["react-email"]).toBeUndefined();
      }
    });

    const compatibleBackends: Backend[] = ["hono", "express", "fastify", "elysia"];

    for (const backend of compatibleBackends) {
      it(`should work with aws-ses + ${backend}`, async () => {
        const result = await runTRPCTest({
          projectName: `aws-ses-${backend}`,
          email: "aws-ses",
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

    it("should add AWS SES environment variables when email is aws-ses", async () => {
      const result = await runTRPCTest({
        projectName: "aws-ses-env-vars",
        email: "aws-ses",
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
        expect(envFile.content).toContain("AWS_REGION");
        expect(envFile.content).toContain("AWS_ACCESS_KEY_ID");
        expect(envFile.content).toContain("AWS_SECRET_ACCESS_KEY");
        expect(envFile.content).toContain("AWS_SES_FROM_EMAIL");
      }
    });

    it("should work with aws-ses + next.js fullstack", async () => {
      const result = await runTRPCTest({
        projectName: "aws-ses-next",
        email: "aws-ses",
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

    it("should work with aws-ses + tanstack-start fullstack", async () => {
      const result = await runTRPCTest({
        projectName: "aws-ses-tanstack-start",
        email: "aws-ses",
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

    it("should work with aws-ses + nestjs backend", async () => {
      const result = await runTRPCTest({
        projectName: "aws-ses-nestjs",
        email: "aws-ses",
        backend: "nestjs",
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
  });

  describe("Mailgun Email", () => {
    it("should work with mailgun + hono backend", async () => {
      const result = await runTRPCTest({
        projectName: "mailgun-hono",
        email: "mailgun",
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

      // Check that Mailgun dependencies were added
      const serverPackageJson = result.result?.tree?.root?.children
        ?.find((c: any) => c.name === "packages")
        ?.children?.find((c: any) => c.name === "server")
        ?.children?.find((c: any) => c.name === "package.json");

      if (serverPackageJson?.content) {
        const pkgJson = JSON.parse(serverPackageJson.content);
        expect(pkgJson.dependencies?.["mailgun.js"]).toBeDefined();
        expect(pkgJson.dependencies?.["form-data"]).toBeDefined();
      }
    });

    it("should work with mailgun + express backend", async () => {
      const result = await runTRPCTest({
        projectName: "mailgun-express",
        email: "mailgun",
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

    it("should not include react-email components with mailgun", async () => {
      const result = await runTRPCTest({
        projectName: "mailgun-no-react-email",
        email: "mailgun",
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

      // Check that react-email dependencies were NOT added for mailgun
      const serverPackageJson = result.result?.tree?.root?.children
        ?.find((c: any) => c.name === "packages")
        ?.children?.find((c: any) => c.name === "server")
        ?.children?.find((c: any) => c.name === "package.json");

      if (serverPackageJson?.content) {
        const pkgJson = JSON.parse(serverPackageJson.content);
        expect(pkgJson.dependencies?.["@react-email/components"]).toBeUndefined();
        expect(pkgJson.dependencies?.["react-email"]).toBeUndefined();
      }
    });

    const compatibleBackends: Backend[] = ["hono", "express", "fastify", "elysia"];

    for (const backend of compatibleBackends) {
      it(`should work with mailgun + ${backend}`, async () => {
        const result = await runTRPCTest({
          projectName: `mailgun-${backend}`,
          email: "mailgun",
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

    it("should add MAILGUN environment variables when email is mailgun", async () => {
      const result = await runTRPCTest({
        projectName: "mailgun-env-vars",
        email: "mailgun",
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
        expect(envFile.content).toContain("MAILGUN_API_KEY");
        expect(envFile.content).toContain("MAILGUN_DOMAIN");
        expect(envFile.content).toContain("MAILGUN_FROM_EMAIL");
      }
    });

    it("should work with mailgun + next.js fullstack", async () => {
      const result = await runTRPCTest({
        projectName: "mailgun-next",
        email: "mailgun",
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

    it("should work with mailgun + tanstack-start fullstack", async () => {
      const result = await runTRPCTest({
        projectName: "mailgun-tanstack-start",
        email: "mailgun",
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

    it("should work with mailgun + nestjs backend", async () => {
      const result = await runTRPCTest({
        projectName: "mailgun-nestjs",
        email: "mailgun",
        backend: "nestjs",
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
  });

  describe("Plunk Email", () => {
    it("should work with plunk + hono backend", async () => {
      const result = await runTRPCTest({
        projectName: "plunk-hono",
        email: "plunk",
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

      // Check that Plunk dependencies were added
      const serverPackageJson = result.result?.tree?.root?.children
        ?.find((c: any) => c.name === "packages")
        ?.children?.find((c: any) => c.name === "server")
        ?.children?.find((c: any) => c.name === "package.json");

      if (serverPackageJson?.content) {
        const pkgJson = JSON.parse(serverPackageJson.content);
        expect(pkgJson.dependencies?.["@plunk/node"]).toBeDefined();
      }
    });

    it("should work with plunk + express backend", async () => {
      const result = await runTRPCTest({
        projectName: "plunk-express",
        email: "plunk",
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

    it("should not include react-email components with plunk", async () => {
      const result = await runTRPCTest({
        projectName: "plunk-no-react-email",
        email: "plunk",
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

      // Check that react-email dependencies were NOT added for plunk
      const serverPackageJson = result.result?.tree?.root?.children
        ?.find((c: any) => c.name === "packages")
        ?.children?.find((c: any) => c.name === "server")
        ?.children?.find((c: any) => c.name === "package.json");

      if (serverPackageJson?.content) {
        const pkgJson = JSON.parse(serverPackageJson.content);
        expect(pkgJson.dependencies?.["@react-email/components"]).toBeUndefined();
        expect(pkgJson.dependencies?.["react-email"]).toBeUndefined();
      }
    });

    const compatibleBackends: Backend[] = ["hono", "express", "fastify", "elysia"];

    for (const backend of compatibleBackends) {
      it(`should work with plunk + ${backend}`, async () => {
        const result = await runTRPCTest({
          projectName: `plunk-${backend}`,
          email: "plunk",
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

    it("should add PLUNK environment variables when email is plunk", async () => {
      const result = await runTRPCTest({
        projectName: "plunk-env-vars",
        email: "plunk",
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
        expect(envFile.content).toContain("PLUNK_API_KEY");
        expect(envFile.content).toContain("PLUNK_FROM_EMAIL");
      }
    });

    it("should work with plunk + next.js fullstack", async () => {
      const result = await runTRPCTest({
        projectName: "plunk-next",
        email: "plunk",
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

    it("should work with plunk + tanstack-start fullstack", async () => {
      const result = await runTRPCTest({
        projectName: "plunk-tanstack-start",
        email: "plunk",
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

    it("should work with plunk + nestjs backend", async () => {
      const result = await runTRPCTest({
        projectName: "plunk-nestjs",
        email: "plunk",
        backend: "nestjs",
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
  });
});
