import type { DatabaseSetup, Frontend, ProjectConfig } from "../../src/types";

export type MatrixRule =
  | "api-trpc-frontend-incompatible"
  | "auth-better-auth-convex-frontend"
  | "auth-clerk-frontend-incompatible"
  | "backend-convex-requires-owned-none"
  | "backend-none-requires-owned-none"
  | "backend-self-requires-fullstack-frontend"
  | "backend-self-runtime-none"
  | "database-requires-orm"
  | "db-setup-d1-requires-cloudflare-target"
  | "db-setup-d1-requires-sqlite"
  | "db-setup-docker-not-sqlite"
  | "db-setup-docker-not-workers"
  | "db-setup-mongodb-atlas-requires-mongodb"
  | "db-setup-neon-requires-postgres"
  | "db-setup-planetscale-requires-postgres-or-mysql"
  | "db-setup-prisma-postgres-requires-postgres"
  | "db-setup-requires-database"
  | "db-setup-supabase-requires-postgres"
  | "db-setup-turso-requires-sqlite"
  | "example-ai-frontend-incompatible"
  | "example-ai-requires-backend"
  | "example-ai-requires-supported-convex-frontend"
  | "example-todo-requires-api"
  | "example-todo-requires-database"
  | "frontend-convex-incompatible"
  | "orm-drizzle-not-mongodb"
  | "orm-mongoose-requires-mongodb"
  | "orm-mongodb-requires-mongoose-or-prisma"
  | "orm-requires-database"
  | "payments-polar-requires-better-auth"
  | "payments-revenuecat-requires-native-frontend"
  | "runtime-none-requires-terminal-backend"
  | "server-deploy-requires-backend"
  | "server-deploy-requires-workers-runtime"
  | "web-deploy-requires-web-frontend"
  | "workers-requires-hono"
  | "workers-requires-server-deploy"
  | "workers-rejects-mongodb";

export interface MatrixOracleResult {
  valid: boolean;
  rules: MatrixRule[];
}

const WEB_FRONTENDS: readonly Frontend[] = [
  "tanstack-router",
  "react-router",
  "tanstack-start",
  "next",
  "nuxt",
  "svelte",
  "solid",
  "astro",
] as const;

const FULLSTACK_FRONTENDS: readonly Frontend[] = [
  "next",
  "tanstack-start",
  "nuxt",
  "svelte",
  "astro",
] as const;

const NATIVE_FRONTENDS: readonly Frontend[] = [
  "native-bare",
  "native-uniwind",
  "native-unistyles",
] as const;

const CONVEX_INCOMPATIBLE_FRONTENDS: readonly Frontend[] = ["solid", "astro"] as const;

const CONVEX_BETTER_AUTH_SUPPORTED_FRONTENDS: readonly Frontend[] = [
  "tanstack-router",
  "react-router",
  "tanstack-start",
  "next",
  "native-bare",
  "native-uniwind",
  "native-unistyles",
] as const;

const CONVEX_BETTER_AUTH_INCOMPATIBLE_FRONTENDS: readonly Frontend[] = [
  "nuxt",
  "svelte",
  "solid",
  "astro",
] as const;

const CLERK_INCOMPATIBLE_FRONTENDS: readonly Frontend[] = ["nuxt", "svelte", "solid", "astro"];

function hasFrontend(frontends: readonly Frontend[], values: readonly Frontend[]) {
  return frontends.some((frontend) => values.includes(frontend));
}

function hasWebFrontend(frontends: readonly Frontend[]) {
  return hasFrontend(frontends, WEB_FRONTENDS);
}

function hasNativeFrontend(frontends: readonly Frontend[]) {
  return hasFrontend(frontends, NATIVE_FRONTENDS);
}

function addRule(rules: Set<MatrixRule>, condition: boolean, rule: MatrixRule) {
  if (condition) rules.add(rule);
}

function isWorkersD1Target(config: ProjectConfig) {
  return (
    config.backend === "hono" &&
    config.runtime === "workers" &&
    config.serverDeploy === "cloudflare"
  );
}

function isSelfCloudflareD1Target(config: ProjectConfig) {
  return (
    config.backend === "self" && config.runtime === "none" && config.webDeploy === "cloudflare"
  );
}

function expectedDatabaseForSetup(dbSetup: DatabaseSetup) {
  switch (dbSetup) {
    case "turso":
      return "sqlite";
    case "neon":
    case "prisma-postgres":
    case "supabase":
      return "postgres";
    case "mongodb-atlas":
      return "mongodb";
    case "d1":
      return "sqlite";
    default:
      return undefined;
  }
}

function validateOrmDatabase(config: ProjectConfig, rules: Set<MatrixRule>) {
  addRule(
    rules,
    config.orm === "mongoose" && config.database !== "mongodb",
    "orm-mongoose-requires-mongodb",
  );
  addRule(
    rules,
    config.orm === "drizzle" && config.database === "mongodb",
    "orm-drizzle-not-mongodb",
  );
  addRule(
    rules,
    config.database === "mongodb" && !["mongoose", "prisma", "none"].includes(config.orm),
    "orm-mongodb-requires-mongoose-or-prisma",
  );
  addRule(rules, config.database !== "none" && config.orm === "none", "database-requires-orm");
  addRule(rules, config.orm !== "none" && config.database === "none", "orm-requires-database");
}

function validateDatabaseSetup(config: ProjectConfig, rules: Set<MatrixRule>) {
  if (config.dbSetup === "none") return;

  addRule(rules, config.database === "none", "db-setup-requires-database");

  const expectedDatabase = expectedDatabaseForSetup(config.dbSetup);
  if (expectedDatabase && config.database !== expectedDatabase) {
    const ruleBySetup: Record<
      Exclude<DatabaseSetup, "docker" | "none" | "planetscale">,
      MatrixRule
    > = {
      d1: "db-setup-d1-requires-sqlite",
      "mongodb-atlas": "db-setup-mongodb-atlas-requires-mongodb",
      neon: "db-setup-neon-requires-postgres",
      "prisma-postgres": "db-setup-prisma-postgres-requires-postgres",
      supabase: "db-setup-supabase-requires-postgres",
      turso: "db-setup-turso-requires-sqlite",
    };
    rules.add(ruleBySetup[config.dbSetup as keyof typeof ruleBySetup]);
  }

  addRule(
    rules,
    config.dbSetup === "planetscale" &&
      config.database !== "postgres" &&
      config.database !== "mysql",
    "db-setup-planetscale-requires-postgres-or-mysql",
  );
  addRule(
    rules,
    config.dbSetup === "d1" && !isWorkersD1Target(config) && !isSelfCloudflareD1Target(config),
    "db-setup-d1-requires-cloudflare-target",
  );
  addRule(
    rules,
    config.dbSetup === "docker" && config.database === "sqlite",
    "db-setup-docker-not-sqlite",
  );
  addRule(
    rules,
    config.dbSetup === "docker" && config.runtime === "workers",
    "db-setup-docker-not-workers",
  );
}

function validateBackend(config: ProjectConfig, rules: Set<MatrixRule>) {
  if (config.auth === "clerk") {
    addRule(
      rules,
      hasFrontend(config.frontend, CLERK_INCOMPATIBLE_FRONTENDS),
      "auth-clerk-frontend-incompatible",
    );
  }

  if (config.backend === "convex") {
    addRule(
      rules,
      config.runtime !== "none" ||
        config.database !== "none" ||
        config.orm !== "none" ||
        config.api !== "none" ||
        config.dbSetup !== "none" ||
        config.serverDeploy !== "none",
      "backend-convex-requires-owned-none",
    );
    addRule(
      rules,
      hasFrontend(config.frontend, CONVEX_INCOMPATIBLE_FRONTENDS),
      "frontend-convex-incompatible",
    );
    addRule(
      rules,
      config.auth === "better-auth" &&
        (hasFrontend(config.frontend, CONVEX_BETTER_AUTH_INCOMPATIBLE_FRONTENDS) ||
          !hasFrontend(config.frontend, CONVEX_BETTER_AUTH_SUPPORTED_FRONTENDS)),
      "auth-better-auth-convex-frontend",
    );
  }

  if (config.backend === "none") {
    addRule(
      rules,
      config.runtime !== "none" ||
        config.database !== "none" ||
        config.orm !== "none" ||
        config.api !== "none" ||
        config.auth !== "none" ||
        config.payments !== "none" ||
        config.dbSetup !== "none" ||
        config.serverDeploy !== "none",
      "backend-none-requires-owned-none",
    );
  }

  if (config.backend === "self") {
    addRule(rules, config.runtime !== "none", "backend-self-runtime-none");
    addRule(
      rules,
      !hasFrontend(config.frontend, FULLSTACK_FRONTENDS),
      "backend-self-requires-fullstack-frontend",
    );
  }

  addRule(
    rules,
    config.runtime === "none" && !["convex", "none", "self"].includes(config.backend),
    "runtime-none-requires-terminal-backend",
  );
}

function validateRuntimeAndDeploy(config: ProjectConfig, rules: Set<MatrixRule>) {
  addRule(
    rules,
    config.runtime === "workers" && config.backend !== "hono",
    "workers-requires-hono",
  );
  addRule(
    rules,
    config.runtime === "workers" && config.database === "mongodb",
    "workers-rejects-mongodb",
  );
  addRule(
    rules,
    config.runtime === "workers" && config.serverDeploy === "none",
    "workers-requires-server-deploy",
  );
  addRule(
    rules,
    config.serverDeploy !== "none" && config.backend === "none",
    "server-deploy-requires-backend",
  );
  addRule(
    rules,
    config.serverDeploy === "cloudflare" && config.runtime !== "workers",
    "server-deploy-requires-workers-runtime",
  );
  addRule(
    rules,
    config.webDeploy !== "none" && !hasWebFrontend(config.frontend),
    "web-deploy-requires-web-frontend",
  );
}

function validateFrontendApi(config: ProjectConfig, rules: Set<MatrixRule>) {
  addRule(
    rules,
    config.api === "trpc" && hasFrontend(config.frontend, ["nuxt", "svelte", "solid", "astro"]),
    "api-trpc-frontend-incompatible",
  );
}

function validatePayments(config: ProjectConfig, rules: Set<MatrixRule>) {
  if (config.payments === "none") return;

  addRule(
    rules,
    config.payments === "polar" && config.auth !== "better-auth",
    "payments-polar-requires-better-auth",
  );

  addRule(
    rules,
    config.payments === "revenuecat" && !hasNativeFrontend(config.frontend),
    "payments-revenuecat-requires-native-frontend",
  );
}

function validateExamples(config: ProjectConfig, rules: Set<MatrixRule>) {
  if (config.examples.includes("todo") && config.backend !== "convex") {
    addRule(rules, config.database === "none", "example-todo-requires-database");
    addRule(rules, config.api === "none", "example-todo-requires-api");
  }

  if (config.examples.includes("ai")) {
    addRule(
      rules,
      hasFrontend(config.frontend, ["solid", "astro"]),
      "example-ai-frontend-incompatible",
    );
    addRule(rules, config.backend === "none", "example-ai-requires-backend");
    addRule(
      rules,
      config.backend === "convex" && hasFrontend(config.frontend, ["nuxt", "svelte"]),
      "example-ai-requires-supported-convex-frontend",
    );
  }
}

export function evaluateMatrixConfig(config: ProjectConfig): MatrixOracleResult {
  const rules = new Set<MatrixRule>();

  validateOrmDatabase(config, rules);
  validateDatabaseSetup(config, rules);
  validateBackend(config, rules);
  validateFrontendApi(config, rules);
  validateRuntimeAndDeploy(config, rules);
  validateExamples(config, rules);
  validatePayments(config, rules);

  return {
    valid: rules.size === 0,
    rules: [...rules],
  };
}

export function classifyMatrixError(message: string): MatrixRule | "unknown" {
  if (message.includes("tRPC API is not supported")) return "api-trpc-frontend-incompatible";
  if (message.includes("Better Auth with '--backend convex'")) {
    return "auth-better-auth-convex-frontend";
  }
  if (message.includes("Clerk authentication is not compatible")) {
    return "auth-clerk-frontend-incompatible";
  }
  if (message.includes("Convex backend requires")) return "backend-convex-requires-owned-none";
  if (message.includes("Backend 'none' requires")) return "backend-none-requires-owned-none";
  if (message.includes("Backend 'self' (fullstack) currently only supports")) {
    return "backend-self-requires-fullstack-frontend";
  }
  if (message.includes("Backend 'self' (fullstack) requires '--runtime none'")) {
    return "backend-self-runtime-none";
  }
  if (message.includes("Database selection requires an ORM")) return "database-requires-orm";
  if (message.includes("Cloudflare D1 setup requires SQLite database and either")) {
    return "db-setup-d1-requires-cloudflare-target";
  }
  if (message.includes("Cloudflare D1 setup requires SQLite database")) {
    return "db-setup-d1-requires-sqlite";
  }
  if (message.includes("Docker setup is not compatible with SQLite")) {
    return "db-setup-docker-not-sqlite";
  }
  if (message.includes("Docker setup is not compatible with Cloudflare Workers")) {
    return "db-setup-docker-not-workers";
  }
  if (message.includes("MongoDB Atlas setup requires MongoDB")) {
    return "db-setup-mongodb-atlas-requires-mongodb";
  }
  if (message.includes("Neon setup requires PostgreSQL")) return "db-setup-neon-requires-postgres";
  if (message.includes("PlanetScale setup requires PostgreSQL or MySQL")) {
    return "db-setup-planetscale-requires-postgres-or-mysql";
  }
  if (message.includes("Prisma PostgreSQL setup requires PostgreSQL")) {
    return "db-setup-prisma-postgres-requires-postgres";
  }
  if (message.includes("Database setup requires a database")) return "db-setup-requires-database";
  if (message.includes("Supabase setup requires PostgreSQL")) {
    return "db-setup-supabase-requires-postgres";
  }
  if (message.includes("Turso setup requires SQLite")) return "db-setup-turso-requires-sqlite";
  if (message.includes("The 'ai' example is not compatible")) {
    return "example-ai-frontend-incompatible";
  }
  if (message.includes("The 'ai' example requires a backend")) return "example-ai-requires-backend";
  if (message.includes("The 'ai' example with Convex backend only supports")) {
    return "example-ai-requires-supported-convex-frontend";
  }
  if (
    message.includes("'todo' example requires an API") ||
    message.includes("Cannot use '--examples todo'")
  ) {
    return "example-todo-requires-api";
  }
  if (message.includes("The 'todo' example requires a database")) {
    return "example-todo-requires-database";
  }
  if (message.includes("The following frontends are not compatible with '--backend convex'")) {
    return "frontend-convex-incompatible";
  }
  if (message.includes("Drizzle ORM does not support MongoDB")) return "orm-drizzle-not-mongodb";
  if (message.includes("Mongoose ORM requires MongoDB")) return "orm-mongoose-requires-mongodb";
  if (message.includes("MongoDB database requires Mongoose or Prisma")) {
    return "orm-mongodb-requires-mongoose-or-prisma";
  }
  if (message.includes("ORM selection requires a database")) return "orm-requires-database";
  if (message.includes("Polar payments requires Better Auth")) {
    return "payments-polar-requires-better-auth";
  }
  if (message.includes("RevenueCat payments requires a native frontend")) {
    return "payments-revenuecat-requires-native-frontend";
  }
  if (message.includes("'--runtime none' is only supported")) {
    return "runtime-none-requires-terminal-backend";
  }
  if (message.includes("'--server-deploy' requires a backend")) {
    return "server-deploy-requires-backend";
  }
  if (message.includes("Server deployment 'cloudflare' requires '--runtime workers'")) {
    return "server-deploy-requires-workers-runtime";
  }
  if (message.includes("'--web-deploy' requires a web frontend")) {
    return "web-deploy-requires-web-frontend";
  }
  if (message.includes("Workers runtime") && message.includes("only supported with Hono")) {
    return "workers-requires-hono";
  }
  if (message.includes("Workers runtime") && message.includes("not compatible with MongoDB")) {
    return "workers-rejects-mongodb";
  }
  if (message.includes("Cloudflare Workers runtime requires a server deployment")) {
    return "workers-requires-server-deploy";
  }

  return "unknown";
}

export function formatMatrixConfig(config: ProjectConfig) {
  return JSON.stringify(
    {
      database: config.database,
      orm: config.orm,
      backend: config.backend,
      runtime: config.runtime,
      frontend: config.frontend,
      api: config.api,
      auth: config.auth,
      payments: config.payments,
      dbSetup: config.dbSetup,
      webDeploy: config.webDeploy,
      serverDeploy: config.serverDeploy,
      examples: config.examples,
    },
    null,
    2,
  );
}
