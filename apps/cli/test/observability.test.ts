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
