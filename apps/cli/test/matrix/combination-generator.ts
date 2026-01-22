/**
 * Matrix Combination Generator
 *
 * Generates all valid frontend × backend × database × ORM × API × Runtime combinations
 * by applying compatibility constraints extracted from the codebase.
 *
 * This enables comprehensive matrix testing of all valid stack configurations.
 */

import type {
  Frontend,
  Backend,
  Database,
  ORM,
  API,
  Auth,
  Runtime,
  AstroIntegration,
} from "../../src/types";

export interface MatrixCombination {
  id: string;
  frontend: Frontend[];
  backend: Backend;
  database: Database;
  orm: ORM;
  api: API;
  auth: Auth;
  runtime: Runtime;
  astroIntegration?: AstroIntegration;
}

export interface MatrixGeneratorOptions {
  /** Include API layer variations (Tier 2) */
  includeTier2?: boolean;
  /** Include Auth layer variations (Tier 3) */
  includeTier3?: boolean;
  /** Filter to specific frontends */
  frontendFilter?: Frontend[];
  /** Filter to specific backends */
  backendFilter?: Backend[];
  /** Filter to specific databases */
  databaseFilter?: Database[];
  /** Filter to specific ORMs */
  ormFilter?: ORM[];
}

export interface CombinationStats {
  totalTheoretical: number;
  validCombinations: number;
  invalidCombinations: number;
  coveragePercent: number;
}

// ============================================================================
// COMPATIBILITY RULES (extracted from compatibility-rules.ts and prompts)
// ============================================================================

/**
 * Database-ORM compatibility rules
 * Each database can only work with certain ORMs
 */
const DATABASE_ORM_RULES: Record<Database, readonly ORM[]> = {
  sqlite: ["drizzle", "prisma", "typeorm", "kysely", "mikroorm", "sequelize"],
  postgres: ["drizzle", "prisma", "typeorm", "kysely", "mikroorm", "sequelize"],
  mysql: ["drizzle", "prisma", "typeorm", "kysely", "mikroorm", "sequelize"],
  mongodb: ["mongoose", "prisma"],
  none: ["none"],
};

/**
 * Backend-Runtime compatibility rules
 * Each backend framework runs on specific runtimes
 */
const BACKEND_RUNTIME_RULES: Record<Backend, readonly Runtime[]> = {
  hono: ["bun", "node", "workers"],
  express: ["bun", "node"],
  fastify: ["bun", "node"],
  elysia: ["bun"],
  nestjs: ["bun", "node"],
  adonisjs: ["node"],
  nitro: ["bun", "node", "workers"],
  fets: ["bun", "node", "workers"],
  convex: ["none"],
  encore: ["none"],
  self: ["none"],
  none: ["none"],
};

/**
 * Frontends that are self-hosted (fullstack frameworks)
 * These require backend: "self" or "none"
 */
const SELF_HOSTED_FRONTENDS: readonly Frontend[] = [
  "next",
  "tanstack-start",
  "astro",
  // "nuxt", "svelte" - will be added in future update
];

/**
 * Frontends that ONLY work with backend: "none" (have their own built-in server)
 */
const BUILTIN_SERVER_FRONTENDS: readonly Frontend[] = ["qwik", "angular", "redwood", "fresh"];

/**
 * Frontends incompatible with Convex backend
 */
const CONVEX_INCOMPATIBLE_FRONTENDS: readonly Frontend[] = [
  "solid",
  "astro",
  "qwik",
  "angular",
  "redwood",
  "fresh",
];

/**
 * Frontend-API compatibility rules
 * tRPC, ts-rest, garph require React-based frontends
 */
const REACT_ONLY_APIS: readonly API[] = ["trpc", "ts-rest", "garph"];

/**
 * React-based web frontends (support tRPC and other React-only APIs)
 */
const REACT_WEB_FRONTENDS: readonly Frontend[] = [
  "tanstack-router",
  "react-router",
  "tanstack-start",
  "next",
];

/**
 * Native frontends (always React-based)
 */
const NATIVE_FRONTENDS: readonly Frontend[] = ["native-bare", "native-uniwind", "native-unistyles"];

/**
 * All web frontends
 */
const WEB_FRONTENDS: readonly Frontend[] = [
  "tanstack-router",
  "react-router",
  "tanstack-start",
  "next",
  "nuxt",
  "svelte",
  "solid",
  "astro",
  "qwik",
  "angular",
  "redwood",
  "fresh",
];

/**
 * Frontends that only support oRPC (not tRPC/ts-rest/garph)
 */
const ORPC_ONLY_FRONTENDS: readonly Frontend[] = ["nuxt", "svelte", "solid"];

/**
 * Frontends that have built-in capabilities and don't support external API layers
 */
const NO_API_FRONTENDS: readonly Frontend[] = ["qwik", "angular", "redwood", "fresh"];

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

/**
 * Check if database-ORM combination is valid
 */
export function isValidDatabaseOrm(database: Database, orm: ORM): boolean {
  // Both none is valid
  if (database === "none" && orm === "none") return true;
  // Database with no ORM is invalid
  if (database !== "none" && orm === "none") return false;
  // ORM with no database is invalid
  if (database === "none" && orm !== "none") return false;

  return DATABASE_ORM_RULES[database].includes(orm);
}

/**
 * Check if backend-runtime combination is valid
 */
export function isValidBackendRuntime(backend: Backend, runtime: Runtime): boolean {
  return BACKEND_RUNTIME_RULES[backend].includes(runtime);
}

/**
 * Check if frontend-backend combination is valid
 */
export function isValidFrontendBackend(frontend: Frontend, backend: Backend): boolean {
  // Native frontends work with any non-self backend (they communicate via API)
  if (NATIVE_FRONTENDS.includes(frontend)) {
    return backend !== "self";
  }

  // Frontends with built-in server ONLY work with backend=none
  if (BUILTIN_SERVER_FRONTENDS.includes(frontend)) {
    return backend === "none";
  }

  // Self-hosted frontends work with backend=self or backend=none
  if (SELF_HOSTED_FRONTENDS.includes(frontend)) {
    return backend === "self" || backend === "none";
  }

  // Convex has incompatible frontends
  if (backend === "convex" && CONVEX_INCOMPATIBLE_FRONTENDS.includes(frontend)) {
    return false;
  }

  // Standard frontends (tanstack-router, react-router) work with any backend except "self"
  return backend !== "self";
}

/**
 * Check if frontend-API combination is valid
 */
export function isValidFrontendApi(
  frontend: Frontend,
  api: API,
  astroIntegration?: AstroIntegration,
): boolean {
  // No API is always valid
  if (api === "none") return true;

  // Frontends with built-in capabilities don't support external APIs
  if (NO_API_FRONTENDS.includes(frontend)) {
    return false;
  }

  // oRPC works with all frontends (except NO_API_FRONTENDS, handled above)
  if (api === "orpc") return true;

  // tRPC, ts-rest, garph require React-based frontends
  if (REACT_ONLY_APIS.includes(api)) {
    // React web frontends support all APIs
    if (REACT_WEB_FRONTENDS.includes(frontend)) return true;

    // Native frontends support all React APIs
    if (NATIVE_FRONTENDS.includes(frontend)) return true;

    // Astro with React integration supports React APIs
    if (frontend === "astro" && astroIntegration === "react") return true;

    // Nuxt, Svelte, Solid don't support React APIs
    if (ORPC_ONLY_FRONTENDS.includes(frontend)) return false;

    return false;
  }

  return true;
}

/**
 * Check if backend-API combination is valid
 */
export function isValidBackendApi(backend: Backend, api: API): boolean {
  // Convex doesn't use external API layer
  if (backend === "convex") return api === "none";

  // Encore has its own API handling
  if (backend === "encore") return api === "none";

  // Backend=none with frontend that needs API
  if (backend === "none") return api === "none";

  // All other backends support all APIs
  return true;
}

/**
 * Check if database-backend combination is valid
 */
export function isValidDatabaseBackend(database: Database, backend: Backend): boolean {
  // Convex has its own data layer
  if (backend === "convex") return database === "none";

  // Encore has its own data handling
  if (backend === "encore") return database === "none";

  // Backend=none can have database for self-hosted frontends
  // Actually, backend=none typically means no database access
  if (backend === "none") return database === "none";

  // MongoDB with Workers runtime is not supported
  // (handled in runtime validation)

  return true;
}

/**
 * Check if runtime-database combination is valid
 */
export function isValidRuntimeDatabase(runtime: Runtime, database: Database): boolean {
  // Workers runtime doesn't support MongoDB
  if (runtime === "workers" && database === "mongodb") return false;
  return true;
}

/**
 * Check if a complete combination is valid
 */
export function isValidCombination(combo: MatrixCombination): boolean {
  const { frontend, backend, database, orm, api, runtime, astroIntegration } = combo;

  // We only support single web frontend for now
  const webFrontend = frontend[0];
  if (!webFrontend || webFrontend === "none") {
    // Frontend-less is valid only with backend=none
    return backend === "none" && database === "none" && orm === "none" && api === "none";
  }

  // Check all compatibility rules
  if (!isValidDatabaseOrm(database, orm)) return false;
  if (!isValidBackendRuntime(backend, runtime)) return false;
  if (!isValidFrontendBackend(webFrontend, backend)) return false;
  if (!isValidFrontendApi(webFrontend, api, astroIntegration)) return false;
  if (!isValidBackendApi(backend, api)) return false;
  if (!isValidDatabaseBackend(database, backend)) return false;
  if (!isValidRuntimeDatabase(runtime, database)) return false;

  return true;
}

// ============================================================================
// COMBINATION GENERATOR
// ============================================================================

/**
 * All possible values for each dimension
 */
const ALL_FRONTENDS: readonly Frontend[] = [
  "tanstack-router",
  "react-router",
  "tanstack-start",
  "next",
  "nuxt",
  "svelte",
  "solid",
  "astro",
  "qwik",
  "angular",
  "redwood",
  "fresh",
  "native-bare",
  "native-uniwind",
  "native-unistyles",
];

const ALL_BACKENDS: readonly Backend[] = [
  "hono",
  "express",
  "fastify",
  "elysia",
  "nestjs",
  "adonisjs",
  "nitro",
  "fets",
  "convex",
  // "encore", - excluded from matrix due to complexity
  "self",
  "none",
];

const ALL_DATABASES: readonly Database[] = ["sqlite", "postgres", "mysql", "mongodb", "none"];

const ALL_ORMS: readonly ORM[] = [
  "drizzle",
  "prisma",
  "mongoose",
  "typeorm",
  "kysely",
  "mikroorm",
  "sequelize",
  "none",
];

const ALL_APIS: readonly API[] = ["trpc", "orpc", "ts-rest", "garph", "none"];

const ALL_RUNTIMES: readonly Runtime[] = ["bun", "node", "workers", "none"];

const ALL_AUTHS: readonly Auth[] = ["better-auth", "clerk", "nextauth", "none"];

const ASTRO_INTEGRATIONS: readonly AstroIntegration[] = ["react", "vue", "svelte", "solid", "none"];

/**
 * Generate a unique ID for a combination
 */
function generateCombinationId(combo: Omit<MatrixCombination, "id">): string {
  const parts = [
    combo.frontend.join("+") || "none",
    combo.backend,
    combo.database,
    combo.orm,
    combo.api,
    combo.runtime,
  ];
  if (combo.astroIntegration && combo.astroIntegration !== "none") {
    parts.push(`astro:${combo.astroIntegration}`);
  }
  return parts.join("_");
}

/**
 * Get valid runtime for a backend (returns first valid runtime)
 */
function getDefaultRuntime(backend: Backend): Runtime {
  const validRuntimes = BACKEND_RUNTIME_RULES[backend];
  // Prefer bun, then node, then workers, then none
  if (validRuntimes.includes("bun")) return "bun";
  if (validRuntimes.includes("node")) return "node";
  if (validRuntimes.includes("workers")) return "workers";
  return "none";
}

/**
 * Generate all valid Tier 1 combinations (Frontend × Backend × Database × ORM)
 * Uses default API (trpc/orpc/none based on frontend) and Auth (none)
 */
export function generateTier1Combinations(options?: MatrixGeneratorOptions): MatrixCombination[] {
  const combinations: MatrixCombination[] = [];

  const frontends = options?.frontendFilter || ALL_FRONTENDS;
  const backends = options?.backendFilter || ALL_BACKENDS;
  const databases = options?.databaseFilter || ALL_DATABASES;
  const orms = options?.ormFilter || ALL_ORMS;

  for (const frontend of frontends) {
    for (const backend of backends) {
      for (const database of databases) {
        for (const orm of orms) {
          // Determine default API based on frontend/backend
          let api: API = "none";
          if (backend !== "none" && backend !== "convex" && backend !== "encore") {
            if (REACT_WEB_FRONTENDS.includes(frontend) || NATIVE_FRONTENDS.includes(frontend)) {
              api = "trpc";
            } else if (ORPC_ONLY_FRONTENDS.includes(frontend)) {
              api = "orpc";
            }
          }

          // Determine runtime based on backend
          const runtime = getDefaultRuntime(backend);

          // Handle Astro integrations
          if (frontend === "astro") {
            // Test Astro with React integration (supports tRPC)
            const astroReactCombo: MatrixCombination = {
              id: "",
              frontend: [frontend],
              backend,
              database,
              orm,
              api: backend !== "none" && backend !== "convex" ? "trpc" : "none",
              auth: "none",
              runtime,
              astroIntegration: "react",
            };
            astroReactCombo.id = generateCombinationId(astroReactCombo);

            if (isValidCombination(astroReactCombo)) {
              combinations.push(astroReactCombo);
            }

            // Test Astro with Vue integration (supports oRPC)
            const astroVueCombo: MatrixCombination = {
              id: "",
              frontend: [frontend],
              backend,
              database,
              orm,
              api: backend !== "none" && backend !== "convex" ? "orpc" : "none",
              auth: "none",
              runtime,
              astroIntegration: "vue",
            };
            astroVueCombo.id = generateCombinationId(astroVueCombo);

            if (isValidCombination(astroVueCombo)) {
              combinations.push(astroVueCombo);
            }
          } else {
            const combo: MatrixCombination = {
              id: "",
              frontend: [frontend],
              backend,
              database,
              orm,
              api,
              auth: "none",
              runtime,
            };
            combo.id = generateCombinationId(combo);

            if (isValidCombination(combo)) {
              combinations.push(combo);
            }
          }
        }
      }
    }
  }

  return combinations;
}

/**
 * Generate Tier 2 combinations (Tier 1 + API variations)
 */
export function generateTier2Combinations(options?: MatrixGeneratorOptions): MatrixCombination[] {
  const combinations: MatrixCombination[] = [];
  const seenIds = new Set<string>();

  const tier1 = generateTier1Combinations(options);

  for (const base of tier1) {
    for (const api of ALL_APIS) {
      const combo: MatrixCombination = {
        ...base,
        api,
        id: "",
      };
      combo.id = generateCombinationId(combo);

      if (!seenIds.has(combo.id) && isValidCombination(combo)) {
        seenIds.add(combo.id);
        combinations.push(combo);
      }
    }
  }

  return combinations;
}

/**
 * Generate Tier 3 combinations (Tier 2 + Auth variations)
 */
export function generateTier3Combinations(options?: MatrixGeneratorOptions): MatrixCombination[] {
  const combinations: MatrixCombination[] = [];
  const seenIds = new Set<string>();

  const tier2 = generateTier2Combinations(options);

  for (const base of tier2) {
    for (const auth of ALL_AUTHS) {
      // NextAuth only works with Next.js + self backend
      if (auth === "nextauth") {
        if (!base.frontend.includes("next") || base.backend !== "self") {
          continue;
        }
      }

      // Clerk with Convex has limited frontend support
      if (auth === "clerk" && base.backend === "convex") {
        const incompatible = ["nuxt", "svelte", "solid"];
        if (base.frontend.some((f) => incompatible.includes(f))) {
          continue;
        }
      }

      // better-auth requires database
      if (auth === "better-auth" && base.database === "none") {
        continue;
      }

      const combo: MatrixCombination = {
        ...base,
        auth,
        id: "",
      };
      // Include auth in ID to differentiate
      combo.id = `${generateCombinationId(base)}_auth:${auth}`;

      if (!seenIds.has(combo.id) && isValidCombination(combo)) {
        seenIds.add(combo.id);
        combinations.push(combo);
      }
    }
  }

  return combinations;
}

/**
 * Main entry point: Generate all valid combinations based on options
 */
export function generateValidCombinations(options?: MatrixGeneratorOptions): MatrixCombination[] {
  if (options?.includeTier3) {
    return generateTier3Combinations(options);
  }
  if (options?.includeTier2) {
    return generateTier2Combinations(options);
  }
  return generateTier1Combinations(options);
}

/**
 * Get statistics about combination coverage
 */
export function getCombinationStats(options?: MatrixGeneratorOptions): CombinationStats {
  const frontendCount = (options?.frontendFilter || ALL_FRONTENDS).length;
  const backendCount = (options?.backendFilter || ALL_BACKENDS).length;
  const databaseCount = (options?.databaseFilter || ALL_DATABASES).length;
  const ormCount = (options?.ormFilter || ALL_ORMS).length;

  let totalTheoretical = frontendCount * backendCount * databaseCount * ormCount;

  if (options?.includeTier2) {
    totalTheoretical *= ALL_APIS.length;
  }
  if (options?.includeTier3) {
    totalTheoretical *= ALL_AUTHS.length;
  }

  const validCombinations = generateValidCombinations(options).length;
  const invalidCombinations = totalTheoretical - validCombinations;

  return {
    totalTheoretical,
    validCombinations,
    invalidCombinations,
    coveragePercent: Math.round((validCombinations / totalTheoretical) * 100 * 100) / 100,
  };
}

/**
 * Print a summary of the generated combinations
 */
export function printCombinationSummary(options?: MatrixGeneratorOptions): void {
  const stats = getCombinationStats(options);
  const combinations = generateValidCombinations(options);

  console.log("\n=== Matrix Combination Summary ===");
  console.log(`Theoretical combinations: ${stats.totalTheoretical.toLocaleString()}`);
  console.log(`Valid combinations: ${stats.validCombinations.toLocaleString()}`);
  console.log(`Invalid combinations: ${stats.invalidCombinations.toLocaleString()}`);
  console.log(`Coverage: ${stats.coveragePercent}%`);

  // Group by frontend
  const byFrontend = new Map<string, number>();
  for (const combo of combinations) {
    const key = combo.frontend[0] || "none";
    byFrontend.set(key, (byFrontend.get(key) || 0) + 1);
  }

  console.log("\nCombinations by frontend:");
  for (const [frontend, count] of [...byFrontend.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${frontend}: ${count}`);
  }

  // Group by backend
  const byBackend = new Map<string, number>();
  for (const combo of combinations) {
    byBackend.set(combo.backend, (byBackend.get(combo.backend) || 0) + 1);
  }

  console.log("\nCombinations by backend:");
  for (const [backend, count] of [...byBackend.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${backend}: ${count}`);
  }
}
