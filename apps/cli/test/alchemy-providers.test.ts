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
      alchemy: "2.0.0-beta.70",
      effect: "4.0.0-beta.106",
      "@effect/platform-node": "4.0.0-beta.106",
      "@effect/platform-bun": "4.0.0-beta.106",
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
