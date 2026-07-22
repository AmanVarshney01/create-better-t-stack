import { describe, it } from "bun:test";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { expectError, expectSuccess, runTRPCTest } from "./test-utils";

describe("gRPC API (Connect)", () => {
  it("should work with Hono + Bun runtime", async () => {
    const result = await runTRPCTest({
      projectName: "grpc-hono-bun",
      api: "grpc",
      backend: "hono",
      runtime: "bun",
      database: "sqlite",
      orm: "drizzle",
      auth: "none",
      frontend: ["tanstack-router"],
      addons: ["none"],
      examples: ["none"],
      dbSetup: "none",
      webDeploy: "none",
      serverDeploy: "none",
      manualDb: true,
      install: false,
    });

    expectSuccess(result);

    const projectDir = result.projectDir!;
    const hasPackagesApi = existsSync(join(projectDir, "packages/api"));
    const hasConnectGenerated = existsSync(join(projectDir, "packages/api/src/generated"));
    const hasProtoFile = existsSync(join(projectDir, "packages/api/proto/service.proto"));
    const hasBufGen = existsSync(join(projectDir, "packages/api/buf.gen.yaml"));
    const hasBufYaml = existsSync(join(projectDir, "packages/api/buf.yaml"));

    if (!hasPackagesApi) {
      throw new Error("packages/api directory was not generated");
    }
    if (!hasConnectGenerated) {
      throw new Error("packages/api/src/generated directory was not generated");
    }
    if (!hasProtoFile) {
      throw new Error("proto/service.proto was not generated");
    }
    if (!hasBufGen) {
      throw new Error("buf.gen.yaml was not generated");
    }
    if (!hasBufYaml) {
      throw new Error("buf.yaml was not generated");
    }

    const proto = await readFile(join(projectDir, "packages/api/proto/service.proto"), "utf8");
    const apiPackage = await readFile(join(projectDir, "packages/api/package.json"), "utf8");
    const server = await readFile(join(projectDir, "apps/server/src/index.ts"), "utf8");
    if (!proto.includes("package api;")) throw new Error("gRPC proto package was not generated");
    if (!apiPackage.includes('"@connectrpc/protoc-gen-connect-es": "1.7.0"')) {
      throw new Error("gRPC codegen dependency version is invalid");
    }
    if (!server.includes("createFetchHandler"))
      throw new Error("gRPC Hono handler was not generated");
  });

  it("should work with Express backend", async () => {
    const result = await runTRPCTest({
      projectName: "grpc-express",
      api: "grpc",
      backend: "express",
      runtime: "node",
      database: "sqlite",
      orm: "drizzle",
      auth: "none",
      frontend: ["tanstack-router"],
      addons: ["none"],
      examples: ["none"],
      dbSetup: "none",
      webDeploy: "none",
      serverDeploy: "none",
      manualDb: true,
      install: false,
    });

    expectSuccess(result);
  });

  it("should work with Fastify backend", async () => {
    const result = await runTRPCTest({
      projectName: "grpc-fastify",
      api: "grpc",
      backend: "fastify",
      runtime: "node",
      database: "sqlite",
      orm: "drizzle",
      auth: "none",
      frontend: ["tanstack-router"],
      addons: ["none"],
      examples: ["none"],
      dbSetup: "none",
      webDeploy: "none",
      serverDeploy: "none",
      manualDb: true,
      install: false,
    });

    expectSuccess(result);
  });

  it("should work with Next.js self backend", async () => {
    const result = await runTRPCTest({
      projectName: "grpc-self-next",
      api: "grpc",
      backend: "hono",
      runtime: "bun",
      database: "sqlite",
      orm: "drizzle",
      auth: "none",
      frontend: ["next"],
      addons: ["none"],
      examples: ["none"],
      dbSetup: "none",
      webDeploy: "none",
      serverDeploy: "none",
      manualDb: true,
      install: false,
    });

    expectSuccess(result);
  });

  it("should work with TanStack Router frontend", async () => {
    const result = await runTRPCTest({
      projectName: "grpc-react-router",
      api: "grpc",
      backend: "hono",
      runtime: "bun",
      database: "postgres",
      orm: "drizzle",
      auth: "none",
      frontend: ["react-router"],
      addons: ["none"],
      examples: ["none"],
      dbSetup: "none",
      webDeploy: "none",
      serverDeploy: "none",
      manualDb: true,
      install: false,
    });

    expectSuccess(result);
  });

  it("should fail with Workers runtime", async () => {
    const result = await runTRPCTest({
      projectName: "grpc-workers-fail",
      api: "grpc",
      backend: "hono",
      runtime: "workers",
      database: "sqlite",
      orm: "drizzle",
      auth: "none",
      frontend: ["tanstack-router"],
      addons: ["none"],
      examples: ["none"],
      dbSetup: "d1",
      webDeploy: "none",
      serverDeploy: "cloudflare",
      expectError: true,
    });

    expectError(result, "gRPC API is not compatible with Cloudflare Workers runtime");
  });
});
