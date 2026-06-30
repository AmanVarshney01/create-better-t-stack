import { describe, expect, it } from "bun:test";

import { createVirtual } from "../src/index";
import { collectFiles } from "./setup";

async function createVirtualFiles(config: Parameters<typeof createVirtual>[0]) {
  const result = await createVirtual(config);

  if (result.isErr()) {
    throw result.error;
  }

  return collectFiles(result.value.root, result.value.root.path);
}

describe("Cloudflare DB client generation", () => {
  it("uses request-scoped db/auth factories for Workers templates", async () => {
    const files = await createVirtualFiles({
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
    const files = await createVirtualFiles({
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
    expect(envFile).toContain("type EnvValue = Env[keyof Env];");
    expect(envFile).toContain(
      "function resolveEnvValue(key: keyof Env & string): EnvValue | undefined",
    );
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

  const selfCloudflareD1Scenarios = [
    {
      name: "Next.js",
      frontend: "next",
      api: "trpc",
      routePath: "apps/web/src/app/api/auth/[...all]/route.ts",
      routeNeedles: [
        "toNextJsHandler(createAuth()).GET(request)",
        "toNextJsHandler(createAuth()).POST(request)",
      ],
      envNeedle: 'import { getCloudflareContext } from "@opennextjs/cloudflare";',
      envAbsentNeedle: 'export { env } from "cloudflare:workers";',
    },
    {
      name: "TanStack Start",
      frontend: "tanstack-start",
      api: "trpc",
      routePath: "apps/web/src/routes/api/auth/$.ts",
      routeNeedles: ["const auth = createAuth()", "return auth.handler(request)"],
      envNeedle: 'export { env } from "cloudflare:workers";',
    },
    {
      name: "Nuxt",
      frontend: "nuxt",
      api: "orpc",
      routePath: "apps/web/server/api/auth/[...all].ts",
      routeNeedles: ["const auth = createAuth();", "return auth.handler(toWebRequest(event));"],
      envNeedle: 'export { env } from "cloudflare:workers";',
    },
    {
      name: "Astro",
      frontend: "astro",
      api: "orpc",
      routePath: "apps/web/src/pages/api/auth/[...all].ts",
      routeNeedles: ["const auth = createAuth();", "return auth.handler(ctx.request);"],
      envNeedle: 'export { env } from "cloudflare:workers";',
    },
  ] as const;

  for (const scenario of selfCloudflareD1Scenarios) {
    it(`uses request-scoped D1 db/auth factories for ${scenario.name} with self backend on Cloudflare`, async () => {
      const files = await createVirtualFiles({
        projectName: `${scenario.frontend}-self-cloudflare-d1`,
        frontend: [scenario.frontend],
        backend: "self",
        runtime: "none",
        database: "sqlite",
        orm: "drizzle",
        auth: "better-auth",
        addons: ["none"],
        examples: ["todo"],
        dbSetup: "d1",
        webDeploy: "cloudflare",
        serverDeploy: "none",
        install: false,
        git: false,
        packageManager: "bun",
        payments: "none",
        api: scenario.api,
      });

      const dbFile = files.get("packages/db/src/index.ts");
      const authFile = files.get("packages/auth/src/index.ts");
      const envFile = files.get("packages/env/src/server.ts");
      const routeFile = files.get(scenario.routePath);
      const contextFile = files.get("packages/api/src/context.ts");
      const todoRouterFile = files.get("packages/api/src/routers/todo.ts");

      expect(dbFile).toContain('import { drizzle } from "drizzle-orm/d1";');
      expect(dbFile).toContain("return drizzle(env.DB, { schema });");
      expect(dbFile).not.toContain('import { drizzle } from "drizzle-orm/libsql";');
      expect(dbFile).not.toContain("export const db = createDb();");
      expect(authFile).toContain("export function createAuth()");
      expect(authFile).not.toContain("export const auth = createAuth();");
      expect(envFile).toContain(scenario.envNeedle);
      if (scenario.envAbsentNeedle) {
        expect(envFile).not.toContain(scenario.envAbsentNeedle);
      }
      for (const needle of scenario.routeNeedles) {
        expect(routeFile).toContain(needle);
      }
      expect(contextFile).toContain("createAuth().api.getSession");
      expect(todoRouterFile).toContain("const db = createDb();");
    });
  }

  it("uses Prisma D1 request-scoped factories for Next self backend on Cloudflare", async () => {
    const files = await createVirtualFiles({
      projectName: "next-self-cloudflare-prisma-d1",
      frontend: ["next"],
      backend: "self",
      runtime: "none",
      database: "sqlite",
      orm: "prisma",
      auth: "better-auth",
      addons: ["none"],
      examples: ["todo"],
      dbSetup: "d1",
      webDeploy: "cloudflare",
      serverDeploy: "none",
      install: false,
      git: false,
      packageManager: "bun",
      payments: "none",
      api: "trpc",
    });

    const dbFile = files.get("packages/db/src/index.ts");
    const authFile = files.get("packages/auth/src/index.ts");
    const envFile = files.get("packages/env/src/server.ts");
    const routeFile = files.get("apps/web/src/app/api/auth/[...all]/route.ts");
    const contextFile = files.get("packages/api/src/context.ts");

    expect(dbFile).toContain('import { PrismaD1 } from "@prisma/adapter-d1";');
    expect(dbFile).toContain("const adapter = new PrismaD1(env.DB);");
    expect(dbFile).not.toContain("export default prisma;");
    expect(authFile).toContain("const prisma = createPrismaClient();");
    expect(authFile).not.toContain("export const auth = createAuth();");
    expect(envFile).toContain('import { getCloudflareContext } from "@opennextjs/cloudflare";');
    expect(envFile).toContain("type EnvValue = Env[keyof Env];");
    expect(routeFile).toContain("toNextJsHandler(createAuth()).GET(request)");
    expect(routeFile).toContain("toNextJsHandler(createAuth()).POST(request)");
    expect(contextFile).toContain("createAuth().api.getSession");
  });

  it("uses maxUses=1 for Cloudflare-targeted Postgres pools", async () => {
    const files = await createVirtualFiles({
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
    const dbFile = files.get("packages/db/src/index.ts");

    expect(dbFile).toContain('import { Pool } from "pg";');
    expect(dbFile).toContain("maxUses: 1");
    expect(dbFile).toContain("return drizzle({ client: pool, schema });");
  });

  it("keeps Better Auth MongoDB templates factory-only for Cloudflare Next deployments", async () => {
    const files = await createVirtualFiles({
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
    const authFile = files.get("packages/auth/src/index.ts");
    const routeFile = files.get("apps/web/src/app/api/auth/[...all]/route.ts");

    expect(authFile).toContain("export function createAuth()");
    expect(authFile).not.toContain("export const auth = createAuth();");
    expect(routeFile).toContain("toNextJsHandler(createAuth()).GET(request)");
  });

  it("keeps singleton exports for non-Cloudflare runtimes", async () => {
    const files = await createVirtualFiles({
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
    const dbFile = files.get("packages/db/src/index.ts");
    const authFile = files.get("packages/auth/src/index.ts");
    const serverFile = files.get("apps/server/src/index.ts");

    expect(dbFile).toContain("export const db = createDb();");
    expect(authFile).toContain("export const auth = createAuth();");
    expect(serverFile).toContain("auth.handler(c.req.raw)");
  });

  it("keeps singleton auth handlers for Next outside Cloudflare", async () => {
    const files = await createVirtualFiles({
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
    const authFile = files.get("packages/auth/src/index.ts");
    const routeFile = files.get("apps/web/src/app/api/auth/[...all]/route.ts");

    expect(authFile).toContain("export const auth = createAuth();");
    expect(routeFile).toContain("export const { GET, POST } = toNextJsHandler(auth);");
    expect(routeFile).not.toContain("createAuth()");
  });
});
