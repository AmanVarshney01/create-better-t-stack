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
    const envFile = files.get("apps/server/src/env.server.ts");
    const serverFile = files.get("apps/server/src/index.ts");
    const contextFile = files.get("apps/server/src/context.ts");
    const todoRouterFile = files.get("packages/api/src/routers/todo.ts");

    expect(dbFile).toContain("export function createDb(env: DatabaseConfig)");
    expect(dbFile).not.toContain("export const db = createDb();");
    expect(authFile).toContain("export function createAuth(env: AuthConfig, database: Database");
    expect(authFile).not.toContain("export const auth = await createAuth();");
    expect(envFile).toContain('export { env } from "cloudflare:workers";');
    expect(serverFile).toContain("(await createAuth()).handler(c.req.raw)");
    expect(contextFile).toContain("(await createAuth(db)).api.getSession");
    expect(todoRouterFile).toContain("ctx.db");
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
      dbSetup: "neon",
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
    const envFile = files.get("apps/web/src/env.server.ts");
    const envPackageFile = files.get("apps/web/package.json");
    const routeFile = files.get("apps/web/src/app/api/auth/[...all]/route.ts");
    const dashboardFile = files.get("apps/web/src/app/dashboard/page.tsx");
    const contextFile = files.get("apps/web/src/context.ts");

    expect(dbFile).toContain("export function createPrismaClient(env: DatabaseConfig)");
    expect(dbFile).not.toContain("export default prisma;");
    expect(authFile).toContain("prismaAdapter(database,");
    expect(authFile).not.toContain("export const auth = await createAuth();");
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
    expect(routeFile).toContain("toNextJsHandler(await createAuth()).GET(request)");
    expect(routeFile).toContain("toNextJsHandler(await createAuth()).POST(request)");
    expect(dashboardFile).toContain("(await createAuth()).api.getSession");
    expect(dashboardFile).not.toContain('import { authClient } from "@/lib/auth-client";');
    expect(contextFile).toContain("(await createAuth(db)).api.getSession");
  });

  const selfCloudflareD1Scenarios = [
    {
      name: "Next.js",
      frontend: "next",
      api: "trpc",
      routePath: "apps/web/src/app/api/auth/[...all]/route.ts",
      routeNeedles: [
        "toNextJsHandler(await createAuth()).GET(request)",
        "toNextJsHandler(await createAuth()).POST(request)",
      ],
      envNeedle: 'import { getCloudflareContext } from "@opennextjs/cloudflare";',
      envAbsentNeedle: 'export { env } from "cloudflare:workers";',
    },
    {
      name: "TanStack Start",
      frontend: "tanstack-start",
      api: "trpc",
      routePath: "apps/web/src/routes/api/auth/$.ts",
      routeNeedles: ["const auth = await createAuth()", "return auth.handler(request)"],
      envNeedle: 'export { env } from "cloudflare:workers";',
    },
    {
      name: "Nuxt",
      frontend: "nuxt",
      api: "orpc",
      routePath: "apps/web/server/api/auth/[...all].ts",
      routeNeedles: [
        "createAuth((event.context.cloudflare as { env: CloudflareEnv }).env)",
        "return auth.handler(toWebRequest(event));",
      ],
      envNeedle: 'import type { CloudflareEnv } from "../cloudflare-env.d.ts";',
      envAbsentNeedle: 'from "cloudflare:workers"',
    },
    {
      name: "Solid 2",
      frontend: "solid",
      api: "orpc",
      routePath: "apps/web/src/routes/api/auth/[...auth].ts",
      routeNeedles: [
        "(await createAuth()).handler(request)",
        "export const GET = handle",
        "export const POST = handle",
      ],
      envNeedle: 'export { env } from "cloudflare:workers";',
    },
    {
      name: "Astro",
      frontend: "astro",
      api: "orpc",
      routePath: "apps/web/src/pages/api/auth/[...all].ts",
      routeNeedles: ["const auth = await createAuth();", "return auth.handler(ctx.request);"],
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
      const envFile = files.get("apps/web/src/env.server.ts");
      const routeFile = files.get(scenario.routePath);
      const contextFile = files.get("apps/web/src/context.ts");
      const todoRouterFile = files.get("packages/api/src/routers/todo.ts");

      expect(dbFile).toContain('import { drizzle } from "drizzle-orm/d1";');
      expect(dbFile).toContain("drizzle(env.DB, { schema })");
      expect(dbFile).not.toContain('import { drizzle } from "drizzle-orm/libsql";');
      expect(dbFile).not.toContain("export const db = createDb();");
      expect(authFile).toContain(
        scenario.frontend === "nuxt"
          ? "export function createAuth(env: AuthConfig, database: Database"
          : "export function createAuth(env: AuthConfig, database: Database",
      );
      expect(authFile).not.toContain("export const auth = await createAuth();");
      expect(envFile).toContain(scenario.envNeedle);
      if ("envAbsentNeedle" in scenario && scenario.envAbsentNeedle) {
        expect(envFile).not.toContain(scenario.envAbsentNeedle);
      }
      for (const needle of scenario.routeNeedles) {
        expect(routeFile).toContain(needle);
      }
      expect(contextFile).toContain(
        scenario.frontend === "nuxt"
          ? "(await createAuth(env, db)).api.getSession"
          : "(await createAuth(db)).api.getSession",
      );
      expect(todoRouterFile).toContain(scenario.api === "trpc" ? "ctx.db" : "context.db");

      if (scenario.frontend === "astro") {
        const infraFile = files.get("packages/infra/alchemy.run.ts") ?? "";
        const rootPackage = JSON.parse(files.get("package.json") ?? "{}") as {
          scripts?: Record<string, string>;
        };
        expect(infraFile).toContain('Cloudflare.Website.Astro("web", {');
        expect(infraFile.match(/SESSION: Cloudflare\.KV\.Namespace\("session"\)/g)).toHaveLength(1);
        expect(infraFile.match(/IMAGES: Cloudflare\.Images\.Images\(\)/g)).toHaveLength(1);
        expect(rootPackage.scripts?.["db:migrate:local"]).toBeUndefined();
      }

      if (scenario.frontend === "nuxt") {
        const rootPackage = JSON.parse(files.get("package.json") ?? "{}") as {
          scripts?: Record<string, string>;
        };
        expect(rootPackage.scripts?.["db:migrate:local"]).toBeUndefined();
      }
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
    const envFile = files.get("apps/web/src/env.server.ts");
    const routeFile = files.get("apps/web/src/app/api/auth/[...all]/route.ts");
    const contextFile = files.get("apps/web/src/context.ts");
    const infraFile = files.get("packages/infra/alchemy.run.ts") ?? "";
    const wranglerConfig = JSON.parse(files.get("apps/web/wrangler.jsonc") ?? "{}") as {
      d1_databases?: Array<{ migrations_dir?: string; migrations_pattern?: string }>;
      images?: { binding?: string };
    };

    expect(dbFile).toContain('import { PrismaD1 } from "@prisma/adapter-d1";');
    expect(dbFile).toContain("const adapter = new PrismaD1(env.DB);");
    expect(dbFile).not.toContain("export default prisma;");
    expect(authFile).toContain("prismaAdapter(database,");
    expect(authFile).not.toContain("export const auth = await createAuth();");
    expect(envFile).toContain('import { getCloudflareContext } from "@opennextjs/cloudflare";');
    expect(envFile).toContain("type EnvValue = Env[keyof Env];");
    expect(routeFile).toContain("toNextJsHandler(await createAuth()).GET(request)");
    expect(routeFile).toContain("toNextJsHandler(await createAuth()).POST(request)");
    expect(contextFile).toContain("(await createAuth(db)).api.getSession");
    expect(infraFile).toContain('export const web = Cloudflare.Website.StaticSite("web", {');
    expect(infraFile).toContain('BETTER_AUTH_SECRET: Config.redacted("BETTER_AUTH_SECRET")');
    expect(infraFile).not.toContain("BETTER_AUTH_SECRET: yield* Config.redacted");
    expect(infraFile).toContain("memo: false");
    expect(infraFile).toContain('migrations: "../../packages/db/prisma/migrations"');
    expect(infraFile).not.toContain("migrationsDir:");
    expect(wranglerConfig.d1_databases?.[0]).toMatchObject({
      migrations_dir: "../../packages/db/prisma/migrations",
      migrations_pattern: "../../packages/db/prisma/migrations/*/migration.sql",
    });
    expect(wranglerConfig.images?.binding).toBe("IMAGES");
    expect(infraFile.match(/IMAGES: Cloudflare\.Images\.Images\(\)/g)).toHaveLength(1);
  });

  it("uses a single connection for Cloudflare-targeted Postgres clients", async () => {
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

    expect(dbFile).toContain('import postgres from "postgres";');
    expect(dbFile).toContain("{ max: 1 }");
    expect(dbFile).toContain("return drizzle({ client, schema });");
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

    expect(authFile).toContain("export function createAuth(env: AuthConfig, database: Database");
    expect(authFile).not.toContain("export const auth = await createAuth();");
    expect(routeFile).toContain("toNextJsHandler(await createAuth()).GET(request)");
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

    expect(dbFile).not.toContain("export const db");
    expect(files.get("apps/server/src/services.ts")).toContain("const db = createDb(env)");
    expect(authFile).not.toContain("export const auth");
    expect(
      files.get("apps/server/src/services.ts") ?? files.get("apps/web/src/services.ts"),
    ).toContain("export const auth = createConfiguredAuth");
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

    expect(authFile).not.toContain("export const auth");
    expect(
      files.get("apps/server/src/services.ts") ?? files.get("apps/web/src/services.ts"),
    ).toContain("export const auth = createConfiguredAuth");
    expect(routeFile).toContain("export const { GET, POST } = toNextJsHandler(auth);");
    expect(routeFile).not.toContain("createAuth()");
  });
});

it("awaits MongoDB and shares one connection between auth and API context per request", async () => {
  const files = await createVirtualFiles({
    projectName: "cloudflare-mongo-context",
    frontend: ["next"],
    backend: "self",
    runtime: "none",
    database: "mongodb",
    orm: "mongoose",
    auth: "better-auth",
    api: "trpc",
    dbSetup: "mongodb-atlas",
    webDeploy: "cloudflare",
    serverDeploy: "none",
    packageManager: "bun",
    install: false,
    git: false,
    addons: ["none"],
    examples: ["none"],
    payments: "none",
  });
  // Execute the generated service/context code with an asynchronous database
  // driver, without opening a network connection or installing a generated app.
  const transpiler = new Bun.Transpiler({ loader: "ts" });
  const source = ["apps/web/src/services.ts", "apps/web/src/context.ts"]
    .map((file) => transpiler.transformSync(files.get(file)!))
    .join("\n")
    .replace(/^import .*;\n/gm, "")
    .replace(/^export /gm, "");
  let connections = 0;
  const createContext = new Function(
    "createDb",
    "createConfiguredAuth",
    "env",
    `${source}\nreturn createContext;`,
  )(
    async () => ({ connection: ++connections }),
    (_env: Record<string, string>, database: { connection: number }) => {
      expect(database.connection).toBeNumber();
      return { api: { getSession: async () => ({ database }) } };
    },
    {},
  );
  const first = await createContext(new Request("https://example.com/api"));
  const second = await createContext(new Request("https://example.com/api"));
  expect(connections).toBe(2);
  expect(first.db).toBe(first.session.database);
  expect(second.db).toBe(second.session.database);
  expect(first.db).not.toBe(second.db);
});

for (const frontend of [
  "next",
  "nuxt",
  "svelte",
  "solid",
  "astro",
  "tanstack-start",
  "tanstack-router",
  "react-router",
] as const) {
  it(`keeps Node-only Varlock runtime injection out of Alchemy ${frontend} builds`, async () => {
    const files = await createVirtualFiles({
      projectName: `alchemy-native-${frontend}`,
      frontend: [frontend],
      backend: "hono",
      runtime: "workers",
      database: "none",
      orm: "none",
      auth: "none",
      api: "none",
      dbSetup: "none",
      webDeploy: "cloudflare",
      serverDeploy: "cloudflare",
      packageManager: "bun",
      install: false,
      git: false,
      addons: ["none"],
      examples: ["none"],
      payments: "none",
    });
    for (const [file, content] of files) {
      if (!file.startsWith("apps/web/")) continue;
      expect(content).not.toContain("@varlock/");
      expect(content).not.toContain("varlock/auto-load");
    }
    const accessor = files.get("apps/web/src/env.public.ts");
    if (accessor) {
      expect(accessor).toContain("import type { PublicCoercedEnvSchema }");
      expect(accessor).not.toContain("varlock/env");
      expect(accessor).not.toContain("CORS_ORIGIN");
    }
    const infra = files.get("packages/infra/.env.schema")!;
    expect(infra).toContain("pick=[NODE_ENV, CORS_ORIGIN]");
    expect(infra).not.toContain("SERVER_URL");
    expect(files.get("packages/infra/alchemy.run.ts")).toContain('import "varlock/auto-load"');
  });
}

for (const managed of [false, true]) {
  it(`validates ${managed ? "managed" : "external"} database deployment inputs independently of resource outputs`, async () => {
    const files = await createVirtualFiles({
      projectName: `alchemy-inputs-${managed}`,
      frontend: ["next"],
      backend: "self",
      runtime: "none",
      database: "postgres",
      orm: "drizzle",
      auth: "better-auth",
      api: "trpc",
      dbSetup: managed ? "neon" : "none",
      webDeploy: "cloudflare",
      serverDeploy: "none",
      packageManager: "bun",
      install: false,
      git: false,
      addons: ["none"],
      examples: ["none"],
      payments: "none",
    });
    const schema = files.get("packages/infra/.env.schema")!;
    expect(schema).toContain("BETTER_AUTH_SECRET");
    expect(schema).not.toContain("BETTER_AUTH_URL");
    expect(schema).not.toContain("CORS_ORIGIN");
    if (managed) expect(schema).not.toContain("DATABASE_URL");
    else expect(schema).toContain("DATABASE_URL");
  });
}
