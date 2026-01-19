import { describe, it, expect } from "bun:test";

import type { Backend, Frontend, Logging } from "../src/types";

import { expectSuccess, runTRPCTest, type TestConfig } from "./test-utils";

describe("Logging Configurations", () => {
  describe("Pino Logger", () => {
    it("should work with pino + hono backend", async () => {
      const result = await runTRPCTest({
        projectName: "pino-hono",
        logging: "pino",
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

      // Check that Pino dependencies were added - try both packages/server and apps/server paths
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
        expect(pkgJson.dependencies?.pino).toBeDefined();
        expect(pkgJson.dependencies?.["pino-http"]).toBeDefined();
        expect(pkgJson.devDependencies?.["pino-pretty"]).toBeDefined();
      }
    });

    it("should work with pino + express backend", async () => {
      const result = await runTRPCTest({
        projectName: "pino-express",
        logging: "pino",
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

    it("should work with pino + fastify backend", async () => {
      const result = await runTRPCTest({
        projectName: "pino-fastify",
        logging: "pino",
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

    it("should work with pino + elysia backend", async () => {
      const result = await runTRPCTest({
        projectName: "pino-elysia",
        logging: "pino",
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

    it("should work with pino + nitro backend", async () => {
      const result = await runTRPCTest({
        projectName: "pino-nitro",
        logging: "pino",
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

    it("should work with pino + nestjs backend", async () => {
      const result = await runTRPCTest({
        projectName: "pino-nestjs",
        logging: "pino",
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

    it("should work with pino + fets backend", async () => {
      const result = await runTRPCTest({
        projectName: "pino-fets",
        logging: "pino",
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

    it("should work with pino + Next.js fullstack", async () => {
      const result = await runTRPCTest({
        projectName: "pino-next",
        logging: "pino",
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

  describe("No Logging (none)", () => {
    it("should not add pino dependencies when logging is none", async () => {
      const result = await runTRPCTest({
        projectName: "no-logging",
        logging: "none",
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

      // Check that Pino dependencies were NOT added - try both packages/server and apps/server paths
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
        expect(pkgJson.dependencies?.pino).toBeUndefined();
        expect(pkgJson.dependencies?.["pino-http"]).toBeUndefined();
        expect(pkgJson.devDependencies?.["pino-pretty"]).toBeUndefined();
      }
    });
  });
});
