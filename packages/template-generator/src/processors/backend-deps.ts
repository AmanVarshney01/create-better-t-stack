import type { ProjectConfig } from "@better-t-stack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";
import { addPackageDependency, type AvailableDependencies } from "../utils/add-deps";

export function processBackendDeps(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const { backend, runtime, api, auth } = config;

  if (backend === "convex") {
    const convexPath = "packages/backend/package.json";
    if (vfs.exists(convexPath)) {
      addPackageDependency({ vfs, packagePath: convexPath, dependencies: ["convex"] });
    }
    return;
  }

  const serverPath = "apps/server/package.json";
  if (!vfs.exists(serverPath) || backend === "self" || backend === "none") return;

  const deps: AvailableDependencies[] = [];
  const devDeps: AvailableDependencies[] = [];

  if (backend === "hono") {
    deps.push("hono");
    if (runtime === "node") deps.push("@hono/node-server");
  } else if (backend === "elysia") {
    deps.push("elysia", "@elysiajs/cors", "@sinclair/typebox");
    if (runtime === "node") deps.push("@elysiajs/node");
  } else if (backend === "express") {
    deps.push("express", "cors");
    devDeps.push("@types/express", "@types/cors");
  } else if (backend === "fastify") {
    deps.push("fastify", "@fastify/cors");
  } else if (backend === "nest") {
    deps.push(
      "@nestjs/common",
      "@nestjs/core",
      "@nestjs/platform-express",
      "reflect-metadata",
      "rxjs",
    );
    if (auth === "better-auth") deps.push("@thallesp/nestjs-better-auth");
    if (config.examples.includes("todo")) deps.push("class-transformer", "class-validator");
  }

  if (api === "trpc") {
    deps.push("@trpc/server");
    if (backend === "hono") deps.push("@hono/trpc-server");
    else if (backend === "elysia") deps.push("@elysiajs/trpc");
  } else if (api === "orpc") {
    deps.push("@orpc/server", "@orpc/openapi", "@orpc/zod");
  }

  if (auth === "better-auth") deps.push("better-auth");

  if (runtime === "node") devDeps.push("tsx", "@types/node");
  else if (runtime === "bun") devDeps.push("@types/bun");

  if (deps.length > 0 || devDeps.length > 0) {
    addPackageDependency({
      vfs,
      packagePath: serverPath,
      dependencies: deps,
      devDependencies: devDeps,
    });
  }
}
