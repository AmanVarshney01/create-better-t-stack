import { describe, expect, it } from "bun:test";

import { usesAlchemyManagedDatabase } from "@better-t-stack/types";

import { createVirtual } from "../src/index";
import { collectFiles } from "./setup";

type CreateOptions = Parameters<typeof createVirtual>[0];

const baseConfig = {
  projectName: "alchemy-provider-test",
  webDeploy: "cloudflare",
  serverDeploy: "cloudflare",
  backend: "hono",
  runtime: "workers",
  database: "postgres",
  orm: "prisma",
  auth: "better-auth",
  payments: "none",
  api: "orpc",
  frontend: ["next"],
  addons: ["none"],
  examples: ["todo"],
  dbSetup: "neon",
  install: false,
  git: false,
  packageManager: "bun",
} satisfies CreateOptions;

async function generate(overrides: Partial<CreateOptions>) {
  const result = await createVirtual({ ...baseConfig, ...overrides } as CreateOptions);
  if (result.isErr()) throw result.error;
  return collectFiles(result.value.root, result.value.root.path);
}

describe("Alchemy providers", () => {
  it("keeps Cloudflare development on each framework's documented frontend port", async () => {
    const scenarios = [
      { frontend: "tanstack-router", port: 3001 },
      { frontend: "react-router", port: 5173 },
      { frontend: "tanstack-start", port: 3001 },
      { frontend: "next", port: 3001 },
      { frontend: "nuxt", port: 3001 },
      { frontend: "svelte", port: 5173 },
      { frontend: "solid", port: 3001 },
      { frontend: "astro", port: 4321 },
    ] as const;

    for (const scenario of scenarios) {
      const files = await generate({
        projectName: `cloudflare-dev-${scenario.frontend}`,
        frontend: [scenario.frontend],
      });
      const infra = files.get("packages/infra/alchemy.run.ts") ?? "";

      if (scenario.frontend === "next" || scenario.frontend === "svelte") {
        expect(infra).toContain(`url: "http://localhost:${scenario.port}"`);
      } else {
        expect(infra).toContain(`dev: {\n        port: ${scenario.port},\n      }`);
      }
    }
  });

  it("keeps self-hosted applications same-origin", async () => {
    const cloudflareFiles = await generate({
      projectName: "cloudflare-self-origin",
      frontend: ["solid"],
      backend: "self",
      runtime: "none",
      webDeploy: "cloudflare",
      serverDeploy: "none",
    });
    const prismaFiles = await generate({
      projectName: "prisma-self-origin",
      frontend: ["solid"],
      backend: "self",
      runtime: "none",
      webDeploy: "prisma",
      serverDeploy: "none",
    });

    const cloudflareInfra = cloudflareFiles.get("packages/infra/alchemy.run.ts") ?? "";
    const prismaInfra = prismaFiles.get("packages/infra/alchemy.run.ts") ?? "";

    expect(cloudflareInfra).not.toContain("CORS_ORIGIN");
    expect(cloudflareInfra).toContain("BETTER_AUTH_URL: Cloudflare.Worker.URL");
    expect(prismaInfra).not.toContain("CORS_ORIGIN");
    expect(prismaInfra).toContain('BETTER_AUTH_URL: Config.string("BETTER_AUTH_URL")');
  });

  it("rejects OpenNext combinations that are broken in the current release", async () => {
    const nextPlanetScalePostgres = await createVirtual({
      ...baseConfig,
      projectName: "next-planetscale-postgres-blocked",
      backend: "self",
      runtime: "none",
      serverDeploy: "none",
      dbSetup: "planetscale",
    });
    expect(nextPlanetScalePostgres.isErr()).toBe(true);
    expect(nextPlanetScalePostgres.isErr() && nextPlanetScalePostgres.error.message).toContain(
      "OpenNext does not preserve pg-cloudflare's workerd files",
    );
  });

  it("assigns managed database ownership to the application plane that consumes it", () => {
    expect(
      usesAlchemyManagedDatabase({
        backend: "self",
        dbSetup: "neon",
        webDeploy: "prisma",
        serverDeploy: "none",
      }),
    ).toBe(true);
    expect(
      usesAlchemyManagedDatabase({
        backend: "hono",
        dbSetup: "planetscale",
        webDeploy: "none",
        serverDeploy: "cloudflare",
      }),
    ).toBe(true);
    expect(
      usesAlchemyManagedDatabase({
        backend: "hono",
        dbSetup: "neon",
        webDeploy: "prisma",
        serverDeploy: "vercel",
      }),
    ).toBe(false);
    expect(
      usesAlchemyManagedDatabase({
        backend: "hono",
        dbSetup: "neon",
        webDeploy: "none",
        serverDeploy: "prisma",
        dbSetupOptions: { mode: "auto" },
      }),
    ).toBe(false);
    expect(
      usesAlchemyManagedDatabase({
        backend: "hono",
        dbSetup: "neon",
        webDeploy: "none",
        serverDeploy: "prisma",
        dbSetupOptions: { mode: "alchemy" },
      }),
    ).toBe(true);
  });

  it("keeps Alchemy compute while allowing externally provisioned databases", async () => {
    const combinations = [
      { dbSetup: "neon", mode: "auto", providerResource: "Neon.Project" },
      { dbSetup: "planetscale", mode: "manual", providerResource: "Planetscale.PostgresDatabase" },
      { dbSetup: "prisma-postgres", mode: "auto", providerResource: "Prisma.Postgres" },
    ] as const;

    for (const combination of combinations) {
      const files = await generate({
        projectName: `external-${combination.dbSetup}`,
        dbSetup: combination.dbSetup,
        dbSetupOptions: { mode: combination.mode },
        webDeploy: "none",
        serverDeploy: "prisma",
        backend: "hono",
        runtime: "bun",
      });
      const infra = files.get("packages/infra/alchemy.run.ts") ?? "";
      const prismaConfig = files.get("packages/db/prisma.config.ts") ?? "";

      expect(infra).toContain('export const server = Prisma.Compute("server"');
      expect(infra).toContain('DATABASE_URL: Config.redacted("DATABASE_URL")');
      expect(infra).not.toContain(combination.providerResource);
      expect(prismaConfig).toContain("env('DATABASE_URL')");
      expect(prismaConfig).not.toContain("process.env.DATABASE_URL!");
    }
  });

  it("provisions Neon and applies checked-in Prisma migrations", async () => {
    const files = await generate({
      projectName: "neon-prisma-mixed",
      webDeploy: "cloudflare",
      serverDeploy: "prisma",
      backend: "hono",
      runtime: "bun",
    });
    const infra = files.get("packages/infra/alchemy.run.ts") ?? "";
    const infraPackage = JSON.parse(files.get("packages/infra/package.json") ?? "{}") as {
      scripts?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };

    expect(infra).toContain('Neon.Project("database"');
    expect(infra).toContain("database.pooledConnectionUri.pipe(Output.map(Redacted.make))");
    expect(infra).toContain('Command.Exec("database-migrations"');
    expect(infra).toContain('command: "bun run db:migrate:deploy"');
    expect(infra).toContain('"prisma/migrations/**"');
    expect(infra).toContain('export const server = Prisma.Compute("server"');
    expect(infra).toContain('yield* Cloudflare.Website.StaticSite("web"');
    expect(infra).toContain("NEXT_PUBLIC_SERVER_URL: serverWorker.url.as<string>()");
    expect(files.has("packages/infra/database.ts")).toBe(false);
    expect(files.has("packages/db/prisma/migrations/0000_init/migration.sql")).toBe(true);
    expect(infraPackage.scripts?.["check-types"]).toBe("tsc --noEmit");
    expect(infraPackage.devDependencies).toMatchObject({
      alchemy: "2.0.0-beta.72",
      effect: "4.0.0-rc.108",
      "@effect/platform-node": "4.0.0-rc.108",
      "@effect/platform-bun": "4.0.0-rc.108",
    });
  });

  it("uses PlanetScale Postgres migrations and a least-privilege runtime role", async () => {
    const files = await generate({
      projectName: "planetscale-postgres-drizzle",
      orm: "drizzle",
      dbSetup: "planetscale",
      frontend: ["tanstack-router"],
    });
    const infra = files.get("packages/infra/alchemy.run.ts") ?? "";
    const dbSource = files.get("packages/db/src/index.ts") ?? "";
    const dbPackage = JSON.parse(files.get("packages/db/package.json") ?? "{}") as {
      dependencies?: Record<string, string>;
    };
    const readme = files.get("README.md") ?? "";

    expect(infra).toContain('Planetscale.PostgresDatabase("database"');
    expect(infra).toContain('clusterSize: "PS_DEV"');
    expect(infra).toContain('migrationsDir: "../../packages/db/src/migrations"');
    expect(infra).toContain('inheritedRoles: ["pg_read_all_data", "pg_write_all_data"]');
    expect(infra).not.toContain('Command.Exec("database-migrations"');
    expect(dbSource).toContain("drizzle-orm/postgres-js");
    expect(dbSource).toContain('from "postgres"');
    expect(dbPackage.dependencies?.postgres).toBe("^3.4.9");
    expect(dbPackage.dependencies?.pg).toBeUndefined();
    expect(readme).toContain("PS_DEV");
    expect(readme).toContain("may charge for this database");
  });

  it("does not emit Prisma-only Neon migration credentials for Drizzle", async () => {
    const files = await generate({
      projectName: "neon-drizzle-prisma-web",
      webDeploy: "prisma",
      serverDeploy: "none",
      backend: "self",
      runtime: "none",
      orm: "drizzle",
      frontend: ["solid"],
    });
    const infra = files.get("packages/infra/alchemy.run.ts") ?? "";

    expect(infra).toContain("database.pooledConnectionUri.pipe(Output.map(Redacted.make))");
    expect(infra).not.toContain("database.connectionUri");
    expect(infra).not.toContain("migrationUrl");
  });

  it("does not import Prisma-only Redacted helpers for PlanetScale MySQL with Drizzle", async () => {
    const files = await generate({
      projectName: "planetscale-mysql-drizzle",
      database: "mysql",
      orm: "drizzle",
      dbSetup: "planetscale",
      frontend: ["tanstack-router"],
    });
    const infra = files.get("packages/infra/alchemy.run.ts") ?? "";

    expect(infra).toContain('Planetscale.MySQLDatabase("database"');
    expect(infra).not.toContain('import * as Redacted from "effect/Redacted"');
    expect(infra).not.toContain("migrationUrl");
  });

  it("creates separate PlanetScale MySQL runtime and migration credentials", async () => {
    const files = await generate({
      projectName: "planetscale-mysql-prisma",
      webDeploy: "prisma",
      serverDeploy: "none",
      backend: "self",
      runtime: "none",
      database: "mysql",
      orm: "prisma",
      dbSetup: "planetscale",
      frontend: ["solid"],
    });
    const infra = files.get("packages/infra/alchemy.run.ts") ?? "";
    const readme = files.get("README.md") ?? "";

    expect(infra).toContain('Planetscale.MySQLDatabase("database"');
    expect(infra).toContain('role: "readwriter"');
    expect(infra).toContain('role: "admin"');
    expect(infra).toContain("ttl: 600");
    expect(infra).toContain("Output.all(");
    expect(infra).toContain("Redacted.value(secret)");
    expect(infra).toContain("?sslaccept=strict");
    expect(infra).toContain('export const web = Prisma.Compute("web"');
    expect(infra).toContain('entrypoint: "server/index.mjs"');
    expect(files.has("packages/db/prisma/migrations/0000_init/migration.sql")).toBe(true);
    expect(readme).toContain("web on Prisma");
    expect(readme).not.toContain("Prisma Compute");
  });

  it("provisions Prisma Postgres and narrows optional provider URLs once", async () => {
    const files = await generate({
      projectName: "prisma-postgres-cloudflare",
      webDeploy: "cloudflare",
      serverDeploy: "none",
      backend: "self",
      runtime: "none",
      dbSetup: "prisma-postgres",
      frontend: ["solid"],
    });
    const infra = files.get("packages/infra/alchemy.run.ts") ?? "";
    const webVite = files.get("apps/web/vite.config.ts") ?? "";
    const dbSource = files.get("packages/db/src/index.ts") ?? "";
    const dbPackage = JSON.parse(files.get("packages/db/package.json") ?? "{}") as {
      dependencies?: Record<string, string>;
    };
    const webPackage = JSON.parse(files.get("apps/web/package.json") ?? "{}") as {
      devDependencies?: Record<string, string>;
    };

    expect(infra).toContain('Prisma.Project("project"');
    expect(infra).toContain('Prisma.Postgres("database"');
    expect(infra).toContain('Prisma.Connection("database-connection"');
    expect(infra).toContain("Prisma did not return a database connection URL");
    expect(infra).toContain("directUrl ?? fallbackUrl");
    expect(infra).toContain("const migrationUrl = runtimeUrl");
    expect(infra).toContain("export const databaseBindings = {");
    expect(infra).toContain("...databaseBindings");
    expect(infra).not.toContain("...resolvedDatabaseEnv");
    expect(webVite).toContain('import { unwasm } from "unwasm/plugin"');
    expect(webVite).toContain("unwasm({ esmImport: true })");
    expect(webVite).toContain('process.env.ALCHEMY_CLOUDFLARE_VITE_INJECTED === "1"');
    expect(webPackage.devDependencies?.unwasm).toBe("^0.6.0");
    expect(dbSource).toContain('from "@prisma/adapter-ppg"');
    expect(dbSource).toContain("new PrismaPostgresAdapter");
    expect(dbPackage.dependencies?.["@prisma/adapter-ppg"]).toBe("^7.9.1");
    expect(dbPackage.dependencies?.["@prisma/adapter-pg"]).toBeUndefined();
    expect(dbPackage.dependencies?.pg).toBeUndefined();
    expect(files.get("packages/db/prisma/schema/schema.prisma")).toContain(
      'runtime = "cloudflare"',
    );
  });

  it("preserves Prisma WASM modules across Cloudflare framework builds", async () => {
    const frameworkConfigs = [
      ["nuxt", "apps/web/nuxt.config.ts"],
      ["svelte", "apps/web/vite.config.ts"],
      ["solid", "apps/web/vite.config.ts"],
      ["tanstack-start", "apps/web/vite.config.ts"],
    ] as const;

    for (const [frontend, configPath] of frameworkConfigs) {
      const files = await generate({
        projectName: `cloudflare-${frontend}-prisma`,
        webDeploy: "cloudflare",
        serverDeploy: "none",
        backend: "self",
        runtime: "none",
        dbSetup: "prisma-postgres",
        frontend: [frontend],
      });
      const frameworkConfig = files.get(configPath) ?? "";
      const nuxtServerPlugin = files.get("apps/web/app/plugins/orpc.server.ts") ?? "";
      const webPackage = JSON.parse(files.get("apps/web/package.json") ?? "{}") as {
        devDependencies?: Record<string, string>;
      };

      expect(frameworkConfig).toContain('from "unwasm/plugin"');
      expect(frameworkConfig).toContain("unwasm({ esmImport: true })");
      expect(webPackage.devDependencies?.unwasm).toBe("^0.6.0");

      if (frontend === "nuxt") {
        expect(frameworkConfig).toContain("wasm: true");
        expect(frameworkConfig).toContain("'pg-native': 'unenv/mock/proxy'");
        expect(nuxtServerPlugin).toContain('url: "/rpc"');
        expect(nuxtServerPlugin).toContain("event.fetch(request, init)");
        expect(nuxtServerPlugin).not.toContain("createRouterClient");
      }
    }
  });

  it("uses Nuxt request context for native Alchemy bindings", async () => {
    const files = await generate({
      projectName: "nuxt-native-cloudflare-bindings",
      webDeploy: "cloudflare",
      serverDeploy: "none",
      backend: "self",
      runtime: "none",
      dbSetup: "prisma-postgres",
      frontend: ["nuxt"],
    });
    const infra = files.get("packages/infra/alchemy.run.ts") ?? "";
    const auth = files.get("packages/auth/src/index.ts") ?? "";
    const db = files.get("packages/db/src/index.ts") ?? "";
    const context = files.get("packages/api/src/context.ts") ?? "";
    const authRoute = files.get("apps/web/server/api/auth/[...all].ts") ?? "";
    const rpcRoute = files.get("apps/web/server/routes/rpc/[...].ts") ?? "";
    const todoRouter = files.get("packages/api/src/routers/todo.ts") ?? "";

    expect(infra).toContain('Cloudflare.Website.Nuxt("web", {');
    expect(auth).toContain("createAuth(env: CloudflareEnv)");
    expect(auth).toContain("createPrismaClient(env)");
    expect(db).toContain("createPrismaClient(env: CloudflareEnv)");
    expect(context).toContain("env: CloudflareEnv;");
    expect(context).toContain("createAuth(env)");
    expect(authRoute).toContain("event.context.cloudflare as { env: CloudflareEnv }");
    expect(rpcRoute).toContain("event.context.cloudflare as { env: CloudflareEnv }");
    expect(todoRouter).toContain("createPrismaClient(context.env)");
    expect(files.has("apps/web/cloudflare-workers.dev.ts")).toBe(false);
    expect(files.has("apps/web/wrangler.jsonc")).toBe(false);
  });

  it("preserves Prisma WASM modules in standalone Cloudflare server builds", async () => {
    const files = await generate({
      projectName: "cloudflare-server-prisma",
      webDeploy: "none",
      serverDeploy: "cloudflare",
      backend: "hono",
      runtime: "workers",
      frontend: ["none"],
    });
    const tsdown = files.get("apps/server/tsdown.config.ts") ?? "";
    const serverPackage = JSON.parse(files.get("apps/server/package.json") ?? "{}") as {
      devDependencies?: Record<string, string>;
    };

    expect(tsdown).toContain('import { unwasm } from "unwasm/plugin"');
    expect(tsdown).toContain("unwasm({ esmImport: true })");
    expect(serverPackage.devDependencies?.unwasm).toBe("^0.6.0");
  });

  it("keeps a provider external when its consuming server is not deployed by Alchemy", async () => {
    const files = await generate({
      projectName: "external-neon-prisma-web",
      webDeploy: "prisma",
      serverDeploy: "vercel",
      backend: "hono",
      runtime: "bun",
      dbSetup: "neon",
    });
    const infra = files.get("packages/infra/alchemy.run.ts") ?? "";

    expect(infra).not.toContain('Neon.Project("database"');
    expect(infra).not.toContain('Command.Exec("database-migrations"');
    expect(infra).toContain('DATABASE_URL: Config.redacted("DATABASE_URL")');
    expect(infra).toContain("export const databaseProviders = Prisma.providers()");
    expect(files.has("packages/db/prisma/migrations/0000_init/migration.sql")).toBe(false);
  });

  it("injects Cloudflare database bindings only when the Cloudflare plane consumes them", async () => {
    const files = await generate({
      projectName: "cloudflare-web-prisma-server",
      webDeploy: "cloudflare",
      serverDeploy: "prisma",
      backend: "hono",
      runtime: "bun",
      frontend: ["next"],
    });
    const infra = files.get("packages/infra/alchemy.run.ts") ?? "";

    expect(infra.match(/\.\.\.databaseBindings/g) ?? []).toHaveLength(0);
    expect(infra).toContain("export const databaseEnv =");
    expect(infra).toContain('export const server = Prisma.Compute("server"');
  });

  it("packages supported custom web framework artifacts for Prisma", async () => {
    const standalone = {
      serverDeploy: "none",
      backend: "none",
      runtime: "none",
      database: "none",
      orm: "none",
      auth: "none",
      payments: "none",
      api: "none",
      addons: ["none"],
      examples: ["none"],
      dbSetup: "none",
    } satisfies Partial<CreateOptions>;

    const reactRouter = await generate({
      ...standalone,
      projectName: "prisma-react-router",
      webDeploy: "prisma",
      frontend: ["react-router"],
    });
    const reactRouterInfra = reactRouter.get("packages/infra/alchemy.run.ts") ?? "";
    const reactRouterVite = reactRouter.get("apps/web/vite.config.ts") ?? "";
    const reactRouterPackage = JSON.parse(reactRouter.get("apps/web/package.json") ?? "{}") as {
      scripts?: Record<string, string>;
      dependencies?: Record<string, string>;
    };

    expect(reactRouterInfra).toContain('command: "bun run build"');
    expect(reactRouterInfra).toContain('outdir: "build"');
    expect(reactRouterInfra).toContain('entrypoint: "server/index.js"');
    expect(reactRouterVite).toContain('input: "./prisma.server.ts"');
    expect(reactRouterVite).toContain("noExternal: true");
    expect(reactRouter.get("apps/web/prisma.server.ts")).toContain(
      'import("virtual:react-router/server-build")',
    );
    expect(reactRouterPackage.scripts?.["build:prisma"]).toBeUndefined();
    expect(reactRouterPackage.dependencies).toMatchObject({
      "@react-router/express": "^8.3.0",
      express: "^5.2.1",
    });

    const svelte = await generate({
      ...standalone,
      projectName: "prisma-sveltekit",
      webDeploy: "prisma",
      frontend: ["svelte"],
    });
    const svelteInfra = svelte.get("packages/infra/alchemy.run.ts") ?? "";
    const svelteConfig = svelte.get("apps/web/svelte.config.js") ?? "";
    const svelteVite = svelte.get("apps/web/vite.config.ts") ?? "";
    const sveltePackage = JSON.parse(svelte.get("apps/web/package.json") ?? "{}") as {
      scripts?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };

    expect(svelteInfra).toContain('command: "bun run build"');
    expect(svelteInfra).toContain('outdir: "build"');
    expect(svelteInfra).toContain('entrypoint: "index.js"');
    expect(svelteConfig).toContain("@sveltejs/adapter-node");
    expect(svelteVite).toContain("noExternal: true");
    expect(svelte.has("apps/web/vite.prisma.config.ts")).toBe(false);
    expect(sveltePackage.scripts?.["build:prisma"]).toBeUndefined();
    expect(sveltePackage.devDependencies?.["@sveltejs/adapter-node"]).toBe("^5.5.7");
    expect(sveltePackage.devDependencies?.["@sveltejs/adapter-auto"]).toBeUndefined();
  });

  it("rejects static SPAs for Prisma Compute instead of generating a server shim", async () => {
    const result = await createVirtual({
      ...baseConfig,
      projectName: "prisma-tanstack-router",
      webDeploy: "prisma",
      serverDeploy: "none",
      backend: "none",
      runtime: "none",
      database: "none",
      orm: "none",
      auth: "none",
      api: "none",
      frontend: ["tanstack-router"],
      dbSetup: "none",
    });

    expect(result.isErr()).toBe(true);
    expect(result.isErr() && result.error.message).toContain(
      "TanStack Router is a static SPA, while Prisma Compute requires an executable server artifact",
    );
  });

  it("rejects desktop builds that replace Prisma server artifacts with static exports", async () => {
    for (const frontend of ["next", "react-router", "svelte", "astro"] as const) {
      const result = await createVirtual({
        ...baseConfig,
        projectName: `prisma-${frontend}-tauri`,
        webDeploy: "prisma",
        serverDeploy: "none",
        backend: "none",
        runtime: "none",
        database: "none",
        orm: "none",
        auth: "none",
        api: "none",
        frontend: [frontend],
        addons: ["tauri"],
        dbSetup: "none",
      });

      expect(result.isErr()).toBe(true);
      expect(result.isErr() && result.error.message).toContain(
        "Prisma Compute requires an executable server artifact",
      );
    }
  });

  it("approves required npm install scripts for Alchemy and Prisma", async () => {
    const files = await generate({
      projectName: "npm-alchemy-prisma",
      packageManager: "npm",
      webDeploy: "prisma",
      serverDeploy: "none",
      backend: "self",
      runtime: "none",
      dbSetup: "prisma-postgres",
      frontend: ["solid"],
    });
    const rootPackage = JSON.parse(files.get("package.json") ?? "{}") as {
      allowScripts?: Record<string, boolean>;
    };

    expect(rootPackage.allowScripts).toMatchObject({
      "@prisma/engines": true,
      "msgpackr-extract": true,
      prisma: true,
      workerd: true,
    });
  });
});
