import { describe, expect, it } from "bun:test";

import { createVirtual } from "../src/index";
import { collectFiles } from "./setup";

describe("Cloudflare DB client generation", () => {
  it("uses request-scoped db/auth factories for Workers templates", async () => {
    const result = await createVirtual({
      projectName: "workers-request-scoped-db",
      frontend: ["tanstack-router"],
      backend: "hono",
      runtime: "workers",
      database: "sqlite",
      orm: "drizzle",
      auth: "better-auth",
      addons: ["none"],
      examples: ["todo"],
      dbSetup: "turso",
      webDeploy: "none",
      serverDeploy: "cloudflare",
      install: false,
      git: false,
      packageManager: "bun",
      payments: "none",
      api: "trpc",
    });

    if (result.isErr()) {
      throw result.error;
    }

    const files = collectFiles(result.value.root, result.value.root.path);
    const dbFile = files.get("packages/db/src/index.ts");
    const authFile = files.get("packages/auth/src/index.ts");
    const envFile = files.get("packages/env/src/server.ts");
    const serverFile = files.get("apps/server/src/index.ts");
    const contextFile = files.get("packages/api/src/context.ts");
    const todoRouterFile = files.get("packages/api/src/routers/todo.ts");

    expect(dbFile).toContain("export function createDb()");
    expect(dbFile).not.toContain("export const db = createDb();");
    expect(authFile).toContain("export function createAuth()");
    expect(authFile).not.toContain("export const auth = createAuth();");
    expect(envFile).toContain('export { env } from "cloudflare:workers";');
    expect(serverFile).toContain("createAuth().handler(c.req.raw)");
    expect(contextFile).toContain("createAuth().api.getSession");
    expect(todoRouterFile).toContain("const db = createDb();");
  });

  it("uses request-scoped db/auth factories for Next on Cloudflare", async () => {
    const result = await createVirtual({
      projectName: "next-cloudflare-request-scoped-db",
      frontend: ["next"],
      backend: "self",
      runtime: "none",
      database: "postgres",
      orm: "prisma",
      auth: "better-auth",
      addons: ["none"],
      examples: ["todo"],
      dbSetup: "none",
      webDeploy: "cloudflare",
      serverDeploy: "none",
      install: false,
      git: false,
      packageManager: "bun",
      payments: "none",
      api: "trpc",
    });

    if (result.isErr()) {
      throw result.error;
    }

    const files = collectFiles(result.value.root, result.value.root.path);
    const dbFile = files.get("packages/db/src/index.ts");
    const authFile = files.get("packages/auth/src/index.ts");
    const envFile = files.get("packages/env/src/server.ts");
    const envPackageFile = files.get("packages/env/package.json");
    const routeFile = files.get("apps/web/src/app/api/auth/[...all]/route.ts");
    const dashboardFile = files.get("apps/web/src/app/dashboard/page.tsx");
    const contextFile = files.get("packages/api/src/context.ts");

    expect(dbFile).toContain("export function createPrismaClient()");
    expect(dbFile).not.toContain("export default prisma;");
    expect(authFile).toContain("const prisma = createPrismaClient();");
    expect(authFile).not.toContain("export const auth = createAuth();");
    expect(envFile).toContain('import { getCloudflareContext } from "@opennextjs/cloudflare";');
    expect(envFile).toContain("function resolveEnvValue(key: string)");
    expect(envFile).toContain("export async function getEnvAsync()");
    expect(envFile).toContain("getCloudflareContext({ async: true })");
    expect(envFile).toContain("export const env = createEnvProxy(resolveEnvValue);");
    expect(envFile).not.toContain('export { env } from "cloudflare:workers";');
    expect(envPackageFile).toContain('"@opennextjs/cloudflare"');
    expect(dbFile).toContain("maxUses: 1");
    expect(routeFile).toContain("toNextJsHandler(createAuth()).GET(request)");
    expect(routeFile).toContain("toNextJsHandler(createAuth()).POST(request)");
    expect(dashboardFile).toContain("createAuth().api.getSession");
    expect(dashboardFile).not.toContain('import { authClient } from "@/lib/auth-client";');
    expect(contextFile).toContain("createAuth().api.getSession");
  });

  it("uses maxUses=1 for Cloudflare-targeted Postgres pools", async () => {
    const result = await createVirtual({
      projectName: "workers-postgres-pool-config",
      frontend: ["tanstack-router"],
      backend: "hono",
      runtime: "workers",
      database: "postgres",
      orm: "drizzle",
      auth: "better-auth",
      addons: ["none"],
      examples: ["none"],
      dbSetup: "none",
      webDeploy: "none",
      serverDeploy: "cloudflare",
      install: false,
      git: false,
      packageManager: "bun",
      payments: "none",
      api: "trpc",
    });

    if (result.isErr()) {
      throw result.error;
    }

    const files = collectFiles(result.value.root, result.value.root.path);
    const dbFile = files.get("packages/db/src/index.ts");

    expect(dbFile).toContain('import { Pool } from "pg";');
    expect(dbFile).toContain("maxUses: 1");
    expect(dbFile).toContain("return drizzle({ client: pool, schema });");
  });

  it("keeps Better Auth MongoDB templates factory-only for Cloudflare Next deployments", async () => {
    const result = await createVirtual({
      projectName: "next-cloudflare-mongodb-auth",
      frontend: ["next"],
      backend: "self",
      runtime: "none",
      database: "mongodb",
      orm: "mongoose",
      auth: "better-auth",
      addons: ["none"],
      examples: ["none"],
      dbSetup: "mongodb-atlas",
      webDeploy: "cloudflare",
      serverDeploy: "none",
      install: false,
      git: false,
      packageManager: "bun",
      payments: "none",
      api: "trpc",
    });

    if (result.isErr()) {
      throw result.error;
    }

    const files = collectFiles(result.value.root, result.value.root.path);
    const authFile = files.get("packages/auth/src/index.ts");
    const routeFile = files.get("apps/web/src/app/api/auth/[...all]/route.ts");

    expect(authFile).toContain("export function createAuth()");
    expect(authFile).not.toContain("export const auth = createAuth();");
    expect(routeFile).toContain("toNextJsHandler(createAuth()).GET(request)");
  });

  it("keeps singleton exports for non-Cloudflare runtimes", async () => {
    const result = await createVirtual({
      projectName: "bun-singleton-db",
      frontend: ["tanstack-router"],
      backend: "hono",
      runtime: "bun",
      database: "sqlite",
      orm: "drizzle",
      auth: "better-auth",
      addons: ["none"],
      examples: ["todo"],
      dbSetup: "none",
      webDeploy: "none",
      serverDeploy: "none",
      install: false,
      git: false,
      packageManager: "bun",
      payments: "none",
      api: "trpc",
    });

    if (result.isErr()) {
      throw result.error;
    }

    const files = collectFiles(result.value.root, result.value.root.path);
    const dbFile = files.get("packages/db/src/index.ts");
    const authFile = files.get("packages/auth/src/index.ts");
    const serverFile = files.get("apps/server/src/index.ts");

    expect(dbFile).toContain("export const db = createDb();");
    expect(authFile).toContain("export const auth = createAuth();");
    expect(serverFile).toContain("auth.handler(c.req.raw)");
  });

  it("keeps singleton auth handlers for Next outside Cloudflare", async () => {
    const result = await createVirtual({
      projectName: "next-singleton-auth",
      frontend: ["next"],
      backend: "self",
      runtime: "none",
      database: "postgres",
      orm: "prisma",
      auth: "better-auth",
      addons: ["none"],
      examples: ["todo"],
      dbSetup: "none",
      webDeploy: "none",
      serverDeploy: "none",
      install: false,
      git: false,
      packageManager: "bun",
      payments: "none",
      api: "trpc",
    });

    if (result.isErr()) {
      throw result.error;
    }

    const files = collectFiles(result.value.root, result.value.root.path);
    const authFile = files.get("packages/auth/src/index.ts");
    const routeFile = files.get("apps/web/src/app/api/auth/[...all]/route.ts");

    expect(authFile).toContain("export const auth = createAuth();");
    expect(routeFile).toContain("export const { GET, POST } = toNextJsHandler(auth);");
    expect(routeFile).not.toContain("createAuth()");
  });
});
