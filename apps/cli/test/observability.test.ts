import { describe, it, expect } from "bun:test";

import { expectSuccess, runTRPCTest } from "./test-utils";

describe("Observability Configurations", () => {
  describe("OpenTelemetry", () => {
    it("should work with opentelemetry + hono backend", async () => {
      const result = await runTRPCTest({
        projectName: "otel-hono",
        observability: "opentelemetry",
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

      // Check that OpenTelemetry dependencies were added
      const packagesServer = result.result?.tree?.root?.children
        ?.find((c: any) => c.name === "packages")
        ?.children?.find((c: any) => c.name === "server");

      const appsServer = result.result?.tree?.root?.children
        ?.find((c: any) => c.name === "apps")
        ?.children?.find((c: any) => c.name === "server");

      const serverDir = packagesServer || appsServer;
      const serverPackageJson = serverDir?.children?.find((c: any) => c.name === "package.json");

      if (serverPackageJson?.content) {
        const pkgJson = JSON.parse(serverPackageJson.content);
        expect(pkgJson.dependencies?.["@opentelemetry/api"]).toBeDefined();
        expect(pkgJson.dependencies?.["@opentelemetry/sdk-node"]).toBeDefined();
        expect(pkgJson.dependencies?.["@opentelemetry/auto-instrumentations-node"]).toBeDefined();
        expect(pkgJson.dependencies?.["@opentelemetry/exporter-trace-otlp-http"]).toBeDefined();
      }
    });

    it("should work with opentelemetry + express backend", async () => {
      const result = await runTRPCTest({
        projectName: "otel-express",
        observability: "opentelemetry",
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

    it("should work with opentelemetry + fastify backend", async () => {
      const result = await runTRPCTest({
        projectName: "otel-fastify",
        observability: "opentelemetry",
        backend: "fastify",
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

    it("should work with opentelemetry + elysia backend", async () => {
      const result = await runTRPCTest({
        projectName: "otel-elysia",
        observability: "opentelemetry",
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

    it("should work with opentelemetry + nitro backend", async () => {
      const result = await runTRPCTest({
        projectName: "otel-nitro",
        observability: "opentelemetry",
        backend: "nitro",
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

    it("should work with opentelemetry + nestjs backend", async () => {
      const result = await runTRPCTest({
        projectName: "otel-nestjs",
        observability: "opentelemetry",
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

    it("should work with opentelemetry + fets backend", async () => {
      const result = await runTRPCTest({
        projectName: "otel-fets",
        observability: "opentelemetry",
        backend: "fets",
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

    it("should work with opentelemetry + Next.js fullstack", async () => {
      const result = await runTRPCTest({
        projectName: "otel-next",
        observability: "opentelemetry",
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
  });

  describe("Sentry", () => {
    it("should work with sentry + hono backend", async () => {
      const result = await runTRPCTest({
        projectName: "sentry-hono",
        observability: "sentry",
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

      // Check that Sentry dependencies were added
      const packagesServer = result.result?.tree?.root?.children
        ?.find((c: any) => c.name === "packages")
        ?.children?.find((c: any) => c.name === "server");

      const appsServer = result.result?.tree?.root?.children
        ?.find((c: any) => c.name === "apps")
        ?.children?.find((c: any) => c.name === "server");

      const serverDir = packagesServer || appsServer;
      const serverPackageJson = serverDir?.children?.find((c: any) => c.name === "package.json");

      if (serverPackageJson?.content) {
        const pkgJson = JSON.parse(serverPackageJson.content);
        expect(pkgJson.dependencies?.["@sentry/node"]).toBeDefined();
        expect(pkgJson.dependencies?.["@sentry/profiling-node"]).toBeDefined();
      }
    });

    it("should work with sentry + express backend", async () => {
      const result = await runTRPCTest({
        projectName: "sentry-express",
        observability: "sentry",
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

    it("should work with sentry + fastify backend", async () => {
      const result = await runTRPCTest({
        projectName: "sentry-fastify",
        observability: "sentry",
        backend: "fastify",
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

    it("should work with sentry + elysia backend", async () => {
      const result = await runTRPCTest({
        projectName: "sentry-elysia",
        observability: "sentry",
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

    it("should work with sentry + nitro backend", async () => {
      const result = await runTRPCTest({
        projectName: "sentry-nitro",
        observability: "sentry",
        backend: "nitro",
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

    it("should work with sentry + nestjs backend", async () => {
      const result = await runTRPCTest({
        projectName: "sentry-nestjs",
        observability: "sentry",
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

    it("should work with sentry + fets backend", async () => {
      const result = await runTRPCTest({
        projectName: "sentry-fets",
        observability: "sentry",
        backend: "fets",
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

    it("should work with sentry + Next.js fullstack", async () => {
      const result = await runTRPCTest({
        projectName: "sentry-next",
        observability: "sentry",
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
  });

  describe("Grafana", () => {
    it("should work with grafana + hono backend", async () => {
      const result = await runTRPCTest({
        projectName: "grafana-hono",
        observability: "grafana",
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

      // Check that Grafana (prom-client) dependencies were added
      const packagesServer = result.result?.tree?.root?.children
        ?.find((c: any) => c.name === "packages")
        ?.children?.find((c: any) => c.name === "server");

      const appsServer = result.result?.tree?.root?.children
        ?.find((c: any) => c.name === "apps")
        ?.children?.find((c: any) => c.name === "server");

      const serverDir = packagesServer || appsServer;
      const serverPackageJson = serverDir?.children?.find((c: any) => c.name === "package.json");

      if (serverPackageJson?.content) {
        const pkgJson = JSON.parse(serverPackageJson.content);
        expect(pkgJson.dependencies?.["prom-client"]).toBeDefined();
      }
    });

    it("should work with grafana + express backend", async () => {
      const result = await runTRPCTest({
        projectName: "grafana-express",
        observability: "grafana",
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

    it("should work with grafana + fastify backend", async () => {
      const result = await runTRPCTest({
        projectName: "grafana-fastify",
        observability: "grafana",
        backend: "fastify",
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

    it("should work with grafana + elysia backend", async () => {
      const result = await runTRPCTest({
        projectName: "grafana-elysia",
        observability: "grafana",
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

    it("should work with grafana + nitro backend", async () => {
      const result = await runTRPCTest({
        projectName: "grafana-nitro",
        observability: "grafana",
        backend: "nitro",
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

    it("should work with grafana + nestjs backend", async () => {
      const result = await runTRPCTest({
        projectName: "grafana-nestjs",
        observability: "grafana",
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

    it("should work with grafana + fets backend", async () => {
      const result = await runTRPCTest({
        projectName: "grafana-fets",
        observability: "grafana",
        backend: "fets",
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

    it("should work with grafana + Next.js fullstack", async () => {
      const result = await runTRPCTest({
        projectName: "grafana-next",
        observability: "grafana",
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
  });

  describe("No Observability (none)", () => {
    it("should not add observability dependencies when observability is none", async () => {
      const result = await runTRPCTest({
        projectName: "no-observability",
        observability: "none",
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

      // Check that OpenTelemetry dependencies were NOT added
      const packagesServer = result.result?.tree?.root?.children
        ?.find((c: any) => c.name === "packages")
        ?.children?.find((c: any) => c.name === "server");

      const appsServer = result.result?.tree?.root?.children
        ?.find((c: any) => c.name === "apps")
        ?.children?.find((c: any) => c.name === "server");

      const serverDir = packagesServer || appsServer;
      const serverPackageJson = serverDir?.children?.find((c: any) => c.name === "package.json");

      if (serverPackageJson?.content) {
        const pkgJson = JSON.parse(serverPackageJson.content);
        expect(pkgJson.dependencies?.["@opentelemetry/api"]).toBeUndefined();
        expect(pkgJson.dependencies?.["@opentelemetry/sdk-node"]).toBeUndefined();
        expect(pkgJson.dependencies?.["@opentelemetry/auto-instrumentations-node"]).toBeUndefined();
      }
    });
  });
});
