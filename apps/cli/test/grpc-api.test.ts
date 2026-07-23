import { describe, it } from "bun:test";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { expectError, expectSuccess, runTRPCTest } from "./test-utils";

describe("gRPC API (Connect)", () => {
  async function assertGeneratedGrpcProject(
    projectDir: string,
    backendMarker: string,
  ): Promise<void> {
    const requiredFiles = [
      "packages/api/proto/api/v1/service.proto",
      "packages/api/src/generated/api/v1/service_pb.ts",
      "packages/api/src/generated/api/v1/service_connect.ts",
      "packages/api/buf.gen.yaml",
      "packages/api/buf.yaml",
      "packages/api/scripts/generate.mjs",
    ];

    for (const file of requiredFiles) {
      if (!existsSync(join(projectDir, file))) {
        throw new Error(`${file} was not generated`);
      }
    }

    const apiPackage = await readFile(join(projectDir, "packages/api/package.json"), "utf8");
    const proto = await readFile(
      join(projectDir, "packages/api/proto/api/v1/service.proto"),
      "utf8",
    );
    const server = await readFile(join(projectDir, "apps/server/src/index.ts"), "utf8");
    if (!proto.includes("package api.v1;"))
      throw new Error("versioned gRPC proto package was not generated");
    if (!apiPackage.includes('"@connectrpc/protoc-gen-connect-es": "1.7.0"')) {
      throw new Error("gRPC codegen dependency version is invalid");
    }
    if (!apiPackage.includes('"./proto/api/v1/service.proto"')) {
      throw new Error("gRPC proto package export is invalid");
    }
    if (!server.includes(backendMarker)) {
      throw new Error(`${backendMarker} was not generated for ${backendMarker} backend`);
    }
  }

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

    await assertGeneratedGrpcProject(result.projectDir!, "createFetchHandler");
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
    await assertGeneratedGrpcProject(result.projectDir!, "expressConnectMiddleware");
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
    await assertGeneratedGrpcProject(result.projectDir!, "fastifyConnectPlugin");
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
    await assertGeneratedGrpcProject(result.projectDir!, "createFetchHandler");
  });

  it("should work with React Router frontend", async () => {
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
