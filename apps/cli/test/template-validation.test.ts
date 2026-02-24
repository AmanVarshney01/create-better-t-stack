import { describe, expect, it } from "bun:test";

import { createVirtual } from "../src/index";
import {
  FrontendSchema,
  BackendSchema,
  DatabaseSchema,
  ORMSchema,
  AuthSchema,
  APISchema,
  RustWebFrameworkSchema,
  RustFrontendSchema,
  RustOrmSchema,
  RustApiSchema,
  RustCliSchema,
  RustLibrariesSchema,
  type Frontend,
  type Backend,
  type Database,
  type ORM,
  type Auth,
  type API,
  type RustWebFramework,
  type RustFrontend,
  type RustOrm,
  type RustApi,
  type RustCli,
  type RustLibraries,
} from "../src/types";
import {
  validateAllTypeScriptFiles,
  validateAllJSONFiles,
  checkAllFilesForHandlebars,
  validateAllVueFiles,
  validateAllSvelteFiles,
  formatValidationErrors,
  getAllFiles,
  type ValidationResult,
} from "./validation-utils";

// Extract all enum values
const FRONTENDS = FrontendSchema.options;
const BACKENDS = BackendSchema.options;
const DATABASES = DatabaseSchema.options;
const ORMS = ORMSchema.options;
const AUTHS = AuthSchema.options;
const APIS = APISchema.options;
const RUST_WEB_FRAMEWORKS = RustWebFrameworkSchema.options;
const RUST_FRONTENDS = RustFrontendSchema.options;
const RUST_ORMS = RustOrmSchema.options;
const RUST_APIS = RustApiSchema.options;
const RUST_CLIS = RustCliSchema.options;
const RUST_LIBRARIES = RustLibrariesSchema.options;

/**
 * TypeScript config for testing
 */
interface TSConfig {
  name: string;
  frontend: Frontend[];
  backend: Backend;
  auth: Auth;
  api: API;
  database: Database;
  orm: ORM;
}

/**
 * Rust config for testing
 */
interface RustConfig {
  name: string;
  rustWebFramework: RustWebFramework;
  rustFrontend: RustFrontend;
  rustOrm: RustOrm;
  rustApi: RustApi;
  rustCli: RustCli;
  rustLibraries: RustLibraries[];
}

/**
 * Helper to validate a TypeScript config
 */
async function validateTSConfig(config: TSConfig): Promise<{
  success: boolean;
  ts: ValidationResult;
  json: ValidationResult;
  handlebars: ValidationResult;
  vue: ValidationResult;
  svelte: ValidationResult;
}> {
  const result = await createVirtual({
    projectName: `test-${config.name}`,
    ecosystem: "typescript",
    frontend: config.frontend,
    backend: config.backend,
    auth: config.auth,
    api: config.api,
    database: config.database,
    orm: config.orm,
  });

  if (!result.success || !result.tree) {
    return {
      success: false,
      ts: {
        valid: false,
        errors: [{ file: "N/A", type: "syntax", message: result.error || "Generation failed" }],
      },
      json: { valid: true, errors: [] },
      handlebars: { valid: true, errors: [] },
      vue: { valid: true, errors: [] },
      svelte: { valid: true, errors: [] },
    };
  }

  return {
    success: true,
    ts: validateAllTypeScriptFiles(result.tree),
    json: validateAllJSONFiles(result.tree),
    handlebars: checkAllFilesForHandlebars(result.tree),
    vue: validateAllVueFiles(result.tree),
    svelte: validateAllSvelteFiles(result.tree),
  };
}

/**
 * Helper to validate a Rust config
 */
async function validateRustConfig(config: RustConfig): Promise<{
  success: boolean;
  json: ValidationResult;
  handlebars: ValidationResult;
}> {
  const result = await createVirtual({
    projectName: `test-rust-${config.name}`,
    ecosystem: "rust",
    rustWebFramework: config.rustWebFramework,
    rustFrontend: config.rustFrontend,
    rustOrm: config.rustOrm,
    rustApi: config.rustApi,
    rustCli: config.rustCli,
    rustLibraries: config.rustLibraries,
  });

  if (!result.success || !result.tree) {
    return {
      success: false,
      json: {
        valid: false,
        errors: [{ file: "N/A", type: "json", message: result.error || "Generation failed" }],
      },
      handlebars: { valid: true, errors: [] },
    };
  }

  return {
    success: true,
    json: validateAllJSONFiles(result.tree),
    handlebars: checkAllFilesForHandlebars(result.tree),
  };
}

// ============================================================================
// TYPESCRIPT ECOSYSTEM - COMPREHENSIVE TEST CONFIGURATIONS
// ============================================================================

/**
 * All frontend frameworks with a standard backend
 */
const FRONTEND_CONFIGS: TSConfig[] = FRONTENDS.filter((f) => f !== "none").map((frontend) => ({
  name: `frontend-${frontend}`,
  frontend: [frontend] as Frontend[],
  backend:
    frontend === "next" ||
    frontend === "nuxt" ||
    frontend === "tanstack-start" ||
    frontend === "remix" ||
    frontend === "solid" ||
    frontend === "qwik" ||
    frontend === "redwood" ||
    frontend === "fresh"
      ? "self"
      : "hono",
  auth: "none",
  api:
    frontend === "next" ||
    frontend === "nuxt" ||
    frontend === "tanstack-start" ||
    frontend === "remix" ||
    frontend === "solid"
      ? "orpc"
      : "trpc",
  database: "sqlite",
  orm: "drizzle",
}));

/**
 * All backend frameworks with TanStack Router frontend
 */
const BACKEND_CONFIGS: TSConfig[] = BACKENDS.filter((b) => b !== "none" && b !== "self").map(
  (backend) => ({
    name: `backend-${backend}`,
    frontend: ["tanstack-router"] as Frontend[],
    backend: backend as Backend,
    auth: backend === "convex" ? "clerk" : "none",
    api: backend === "convex" ? "none" : "trpc",
    database: backend === "convex" ? "none" : "sqlite",
    orm: backend === "convex" ? "none" : "drizzle",
  }),
);

/**
 * All database types with Drizzle ORM
 */
const DATABASE_CONFIGS: TSConfig[] = DATABASES.filter((d) => d !== "none" && d !== "mongodb").map(
  (database) => ({
    name: `database-${database}`,
    frontend: ["tanstack-router"] as Frontend[],
    backend: "hono",
    auth: "none",
    api: "trpc",
    database: database as Database,
    orm: "drizzle",
  }),
);

/**
 * All ORM types with SQLite (where compatible)
 */
const ORM_CONFIGS: TSConfig[] = ORMS.filter(
  (o) =>
    o !== "none" && o !== "mongoose" && o !== "typeorm" && o !== "mikroorm" && o !== "sequelize",
).map((orm) => ({
  name: `orm-${orm}`,
  frontend: ["tanstack-router"] as Frontend[],
  backend: "hono",
  auth: "none",
  api: "trpc",
  database: orm === "kysely" ? "postgres" : "sqlite",
  orm: orm as ORM,
}));

/**
 * All auth providers
 */
const AUTH_CONFIGS: TSConfig[] = AUTHS.map((auth) => {
  if (auth === "clerk") {
    return {
      name: "auth-clerk-self-next",
      frontend: ["next"] as Frontend[],
      backend: "self" as Backend,
      auth: "clerk" as Auth,
      api: "trpc" as API,
      database: "sqlite" as Database,
      orm: "drizzle" as ORM,
    };
  }

  return {
    name: `auth-${auth}`,
    frontend: ["tanstack-router"] as Frontend[],
    backend: "hono",
    auth: auth as Auth,
    api: "trpc",
    database: auth === "none" ? "none" : "sqlite",
    orm: auth === "none" ? "none" : "drizzle",
  };
});

/**
 * All API types
 */
const API_CONFIGS: TSConfig[] = APIS.filter((a) => a !== "none").map((api) => ({
  name: `api-${api}`,
  frontend: ["tanstack-router"] as Frontend[],
  backend: "hono",
  auth: "none",
  api: api as API,
  database: "sqlite",
  orm: "drizzle",
}));

/**
 * Special combinations that test edge cases
 */
const SPECIAL_CONFIGS: TSConfig[] = [
  // Frontend-only (no backend)
  {
    name: "frontend-only",
    frontend: ["tanstack-router"],
    backend: "none",
    auth: "none",
    api: "none",
    database: "none",
    orm: "none",
  },
  // MongoDB with Mongoose
  {
    name: "mongodb-mongoose",
    frontend: ["tanstack-router"],
    backend: "hono",
    auth: "none",
    api: "trpc",
    database: "mongodb",
    orm: "mongoose",
  },
  // React Native
  {
    name: "native-bare-fullstack",
    frontend: ["native-bare"],
    backend: "hono",
    auth: "better-auth",
    api: "trpc",
    database: "sqlite",
    orm: "drizzle",
  },
  {
    name: "native-uniwind",
    frontend: ["native-uniwind"],
    backend: "hono",
    auth: "none",
    api: "trpc",
    database: "sqlite",
    orm: "drizzle",
  },
  {
    name: "native-unistyles",
    frontend: ["native-unistyles"],
    backend: "hono",
    auth: "none",
    api: "trpc",
    database: "sqlite",
    orm: "drizzle",
  },
  // Convex with Clerk
  {
    name: "convex-clerk",
    frontend: ["tanstack-router"],
    backend: "convex",
    auth: "clerk",
    api: "none",
    database: "none",
    orm: "none",
  },
  // Self backend Clerk (Next.js)
  {
    name: "self-next-clerk",
    frontend: ["next"],
    backend: "self",
    auth: "clerk",
    api: "trpc",
    database: "sqlite",
    orm: "drizzle",
  },
  // Self backend Clerk (TanStack Start)
  {
    name: "self-tanstack-start-clerk",
    frontend: ["tanstack-start"],
    backend: "self",
    auth: "clerk",
    api: "orpc",
    database: "sqlite",
    orm: "drizzle",
  },
  // Next.js with NextAuth
  {
    name: "next-nextauth",
    frontend: ["next"],
    backend: "self",
    auth: "nextauth",
    api: "trpc",
    database: "sqlite",
    orm: "drizzle",
  },
  // Full Prisma stack
  {
    name: "prisma-postgres",
    frontend: ["tanstack-router"],
    backend: "hono",
    auth: "better-auth",
    api: "orpc",
    database: "postgres",
    orm: "prisma",
  },
];

// ============================================================================
// RUST ECOSYSTEM - COMPREHENSIVE TEST CONFIGURATIONS
// ============================================================================

/**
 * All Rust web frameworks
 */
const RUST_WEB_FRAMEWORK_CONFIGS: RustConfig[] = RUST_WEB_FRAMEWORKS.map((framework) => ({
  name: `web-${framework}`,
  rustWebFramework: framework as RustWebFramework,
  rustFrontend: "none",
  rustOrm: "none",
  rustApi: "none",
  rustCli: "none",
  rustLibraries: [],
}));

/**
 * All Rust frontends
 */
const RUST_FRONTEND_CONFIGS: RustConfig[] = RUST_FRONTENDS.map((frontend) => ({
  name: `frontend-${frontend}`,
  rustWebFramework: "axum",
  rustFrontend: frontend as RustFrontend,
  rustOrm: "none",
  rustApi: "none",
  rustCli: "none",
  rustLibraries: [],
}));

/**
 * All Rust ORMs
 */
const RUST_ORM_CONFIGS: RustConfig[] = RUST_ORMS.map((orm) => ({
  name: `orm-${orm}`,
  rustWebFramework: "axum",
  rustFrontend: "none",
  rustOrm: orm as RustOrm,
  rustApi: "none",
  rustCli: "none",
  rustLibraries: [],
}));

/**
 * All Rust APIs
 */
const RUST_API_CONFIGS: RustConfig[] = RUST_APIS.map((api) => ({
  name: `api-${api}`,
  rustWebFramework: "axum",
  rustFrontend: "none",
  rustOrm: "none",
  rustApi: api as RustApi,
  rustCli: "none",
  rustLibraries: [],
}));

/**
 * All Rust CLIs
 */
const RUST_CLI_CONFIGS: RustConfig[] = RUST_CLIS.map((cli) => ({
  name: `cli-${cli}`,
  rustWebFramework: "none",
  rustFrontend: "none",
  rustOrm: "none",
  rustApi: "none",
  rustCli: cli as RustCli,
  rustLibraries: [],
}));

/**
 * All Rust libraries (individual)
 */
const RUST_LIBRARY_CONFIGS: RustConfig[] = RUST_LIBRARIES.filter((lib) => lib !== "none").map(
  (lib) => ({
    name: `lib-${lib}`,
    rustWebFramework: "axum",
    rustFrontend: "none",
    rustOrm: "none",
    rustApi: "none",
    rustCli: "none",
    rustLibraries: [lib] as RustLibraries[],
  }),
);

/**
 * Full Rust stack combinations
 */
const RUST_FULL_STACK_CONFIGS: RustConfig[] = [
  {
    name: "axum-leptos-seaorm",
    rustWebFramework: "axum",
    rustFrontend: "leptos",
    rustOrm: "sea-orm",
    rustApi: "none",
    rustCli: "none",
    rustLibraries: ["serde", "validator"],
  },
  {
    name: "actix-dioxus-sqlx",
    rustWebFramework: "actix-web",
    rustFrontend: "dioxus",
    rustOrm: "sqlx",
    rustApi: "none",
    rustCli: "none",
    rustLibraries: ["serde", "jsonwebtoken", "argon2"],
  },
  {
    name: "axum-tonic-seaorm",
    rustWebFramework: "axum",
    rustFrontend: "none",
    rustOrm: "sea-orm",
    rustApi: "tonic",
    rustCli: "none",
    rustLibraries: ["serde"],
  },
  {
    name: "axum-graphql-sqlx",
    rustWebFramework: "axum",
    rustFrontend: "none",
    rustOrm: "sqlx",
    rustApi: "async-graphql",
    rustCli: "none",
    rustLibraries: ["serde", "validator"],
  },
  {
    name: "cli-ratatui",
    rustWebFramework: "none",
    rustFrontend: "none",
    rustOrm: "none",
    rustApi: "none",
    rustCli: "ratatui",
    rustLibraries: ["serde"],
  },
  {
    name: "cli-clap",
    rustWebFramework: "none",
    rustFrontend: "none",
    rustOrm: "none",
    rustApi: "none",
    rustCli: "clap",
    rustLibraries: [],
  },
  {
    name: "full-stack-all-libs",
    rustWebFramework: "axum",
    rustFrontend: "leptos",
    rustOrm: "sea-orm",
    rustApi: "tonic",
    rustCli: "clap",
    rustLibraries: ["serde", "validator", "jsonwebtoken", "argon2", "tokio-test", "mockall"],
  },
];

// ============================================================================
// TEST SUITES
// ============================================================================

describe("Template Validation - TypeScript Ecosystem", () => {
  describe("All Frontends", () => {
    for (const config of FRONTEND_CONFIGS) {
      it(`should validate: ${config.name}`, async () => {
        const result = await validateTSConfig(config);

        if (!result.ts.valid) {
          console.error(`\nTypeScript errors for ${config.name}:`);
          console.error(formatValidationErrors(result.ts));
        }
        if (!result.json.valid) {
          console.error(`\nJSON errors for ${config.name}:`);
          console.error(formatValidationErrors(result.json));
        }
        if (!result.handlebars.valid) {
          console.error(`\nHandlebars errors for ${config.name}:`);
          console.error(formatValidationErrors(result.handlebars));
        }

        expect(result.success).toBe(true);
        expect(result.ts.valid).toBe(true);
        expect(result.json.valid).toBe(true);
        expect(result.handlebars.valid).toBe(true);
      });
    }
  });

  describe("All Backends", () => {
    for (const config of BACKEND_CONFIGS) {
      it(`should validate: ${config.name}`, async () => {
        const result = await validateTSConfig(config);

        if (!result.ts.valid) {
          console.error(`\nTypeScript errors for ${config.name}:`);
          console.error(formatValidationErrors(result.ts));
        }
        if (!result.json.valid) {
          console.error(`\nJSON errors for ${config.name}:`);
          console.error(formatValidationErrors(result.json));
        }

        expect(result.success).toBe(true);
        expect(result.ts.valid).toBe(true);
        expect(result.json.valid).toBe(true);
      });
    }
  });

  describe("All Databases", () => {
    for (const config of DATABASE_CONFIGS) {
      it(`should validate: ${config.name}`, async () => {
        const result = await validateTSConfig(config);

        if (!result.ts.valid) {
          console.error(`\nTypeScript errors for ${config.name}:`);
          console.error(formatValidationErrors(result.ts));
        }
        if (!result.json.valid) {
          console.error(`\nJSON errors for ${config.name}:`);
          console.error(formatValidationErrors(result.json));
        }

        expect(result.success).toBe(true);
        expect(result.ts.valid).toBe(true);
        expect(result.json.valid).toBe(true);
      });
    }
  });

  describe("All ORMs", () => {
    for (const config of ORM_CONFIGS) {
      it(`should validate: ${config.name}`, async () => {
        const result = await validateTSConfig(config);

        if (!result.ts.valid) {
          console.error(`\nTypeScript errors for ${config.name}:`);
          console.error(formatValidationErrors(result.ts));
        }
        if (!result.json.valid) {
          console.error(`\nJSON errors for ${config.name}:`);
          console.error(formatValidationErrors(result.json));
        }

        expect(result.success).toBe(true);
        expect(result.ts.valid).toBe(true);
        expect(result.json.valid).toBe(true);
      });
    }
  });

  describe("All Auth Providers", () => {
    for (const config of AUTH_CONFIGS) {
      it(`should validate: ${config.name}`, async () => {
        const result = await validateTSConfig(config);

        if (!result.ts.valid) {
          console.error(`\nTypeScript errors for ${config.name}:`);
          console.error(formatValidationErrors(result.ts));
        }
        if (!result.json.valid) {
          console.error(`\nJSON errors for ${config.name}:`);
          console.error(formatValidationErrors(result.json));
        }

        expect(result.success).toBe(true);
        expect(result.ts.valid).toBe(true);
        expect(result.json.valid).toBe(true);
      });
    }
  });

  describe("All API Types", () => {
    for (const config of API_CONFIGS) {
      it(`should validate: ${config.name}`, async () => {
        const result = await validateTSConfig(config);

        if (!result.ts.valid) {
          console.error(`\nTypeScript errors for ${config.name}:`);
          console.error(formatValidationErrors(result.ts));
        }
        if (!result.json.valid) {
          console.error(`\nJSON errors for ${config.name}:`);
          console.error(formatValidationErrors(result.json));
        }

        expect(result.success).toBe(true);
        expect(result.ts.valid).toBe(true);
        expect(result.json.valid).toBe(true);
      });
    }
  });

  describe("Special Combinations", () => {
    for (const config of SPECIAL_CONFIGS) {
      it(`should validate: ${config.name}`, async () => {
        const result = await validateTSConfig(config);

        if (!result.ts.valid) {
          console.error(`\nTypeScript errors for ${config.name}:`);
          console.error(formatValidationErrors(result.ts));
        }
        if (!result.json.valid) {
          console.error(`\nJSON errors for ${config.name}:`);
          console.error(formatValidationErrors(result.json));
        }
        if (!result.handlebars.valid) {
          console.error(`\nHandlebars errors for ${config.name}:`);
          console.error(formatValidationErrors(result.handlebars));
        }

        expect(result.success).toBe(true);
        expect(result.ts.valid).toBe(true);
        expect(result.json.valid).toBe(true);
        expect(result.handlebars.valid).toBe(true);
      });
    }
  });
});

describe("Template Validation - Rust Ecosystem", () => {
  describe("All Web Frameworks", () => {
    for (const config of RUST_WEB_FRAMEWORK_CONFIGS) {
      it(`should validate: ${config.name}`, async () => {
        const result = await validateRustConfig(config);

        if (!result.json.valid) {
          console.error(`\nJSON errors for ${config.name}:`);
          console.error(formatValidationErrors(result.json));
        }
        if (!result.handlebars.valid) {
          console.error(`\nHandlebars errors for ${config.name}:`);
          console.error(formatValidationErrors(result.handlebars));
        }

        expect(result.success).toBe(true);
        expect(result.json.valid).toBe(true);
        expect(result.handlebars.valid).toBe(true);
      });
    }
  });

  describe("All Frontends", () => {
    for (const config of RUST_FRONTEND_CONFIGS) {
      it(`should validate: ${config.name}`, async () => {
        const result = await validateRustConfig(config);

        if (!result.json.valid) {
          console.error(`\nJSON errors for ${config.name}:`);
          console.error(formatValidationErrors(result.json));
        }

        expect(result.success).toBe(true);
        expect(result.json.valid).toBe(true);
      });
    }
  });

  describe("All ORMs", () => {
    for (const config of RUST_ORM_CONFIGS) {
      it(`should validate: ${config.name}`, async () => {
        const result = await validateRustConfig(config);

        if (!result.json.valid) {
          console.error(`\nJSON errors for ${config.name}:`);
          console.error(formatValidationErrors(result.json));
        }

        expect(result.success).toBe(true);
        expect(result.json.valid).toBe(true);
      });
    }
  });

  describe("All APIs", () => {
    for (const config of RUST_API_CONFIGS) {
      it(`should validate: ${config.name}`, async () => {
        const result = await validateRustConfig(config);

        if (!result.json.valid) {
          console.error(`\nJSON errors for ${config.name}:`);
          console.error(formatValidationErrors(result.json));
        }

        expect(result.success).toBe(true);
        expect(result.json.valid).toBe(true);
      });
    }
  });

  describe("All CLIs", () => {
    for (const config of RUST_CLI_CONFIGS) {
      it(`should validate: ${config.name}`, async () => {
        const result = await validateRustConfig(config);

        if (!result.json.valid) {
          console.error(`\nJSON errors for ${config.name}:`);
          console.error(formatValidationErrors(result.json));
        }

        expect(result.success).toBe(true);
        expect(result.json.valid).toBe(true);
      });
    }
  });

  describe("All Libraries", () => {
    for (const config of RUST_LIBRARY_CONFIGS) {
      it(`should validate: ${config.name}`, async () => {
        const result = await validateRustConfig(config);

        if (!result.json.valid) {
          console.error(`\nJSON errors for ${config.name}:`);
          console.error(formatValidationErrors(result.json));
        }

        expect(result.success).toBe(true);
        expect(result.json.valid).toBe(true);
      });
    }
  });

  describe("Full Stack Combinations", () => {
    for (const config of RUST_FULL_STACK_CONFIGS) {
      it(`should validate: ${config.name}`, async () => {
        const result = await validateRustConfig(config);

        if (!result.json.valid) {
          console.error(`\nJSON errors for ${config.name}:`);
          console.error(formatValidationErrors(result.json));
        }
        if (!result.handlebars.valid) {
          console.error(`\nHandlebars errors for ${config.name}:`);
          console.error(formatValidationErrors(result.handlebars));
        }

        expect(result.success).toBe(true);
        expect(result.json.valid).toBe(true);
        expect(result.handlebars.valid).toBe(true);
      });
    }
  });
});

describe("Template Validation - Sanity Checks", () => {
  it("should generate reasonable file counts for full-stack TS config", async () => {
    const result = await createVirtual({
      projectName: "test-sanity-fullstack",
      ecosystem: "typescript",
      frontend: ["tanstack-router"],
      backend: "hono",
      auth: "better-auth",
      api: "trpc",
      database: "sqlite",
      orm: "drizzle",
    });

    expect(result.success).toBe(true);
    expect(result.tree).toBeDefined();
    expect(result.tree!.fileCount).toBeGreaterThan(20);
  });

  it("should generate reasonable file counts for full-stack Rust config", async () => {
    const result = await createVirtual({
      projectName: "test-sanity-rust",
      ecosystem: "rust",
      rustWebFramework: "axum",
      rustFrontend: "leptos",
      rustOrm: "sea-orm",
      rustApi: "none",
      rustCli: "none",
      rustLibraries: ["serde"],
    });

    expect(result.success).toBe(true);
    expect(result.tree).toBeDefined();
    expect(result.tree!.fileCount).toBeGreaterThan(5);
  });

  it("should always include root package.json for TS projects", async () => {
    const result = await createVirtual({
      projectName: "test-sanity-pkg",
      ecosystem: "typescript",
      frontend: ["tanstack-router"],
      backend: "hono",
      auth: "none",
      api: "trpc",
      database: "sqlite",
      orm: "drizzle",
    });

    expect(result.success).toBe(true);
    expect(result.tree).toBeDefined();

    const files = getAllFiles(result.tree!);
    const hasPackageJson = files.some(
      (f) => f.path === "/package.json" || f.path === "package.json",
    );
    expect(hasPackageJson).toBe(true);
  });

  it("should always include Cargo.toml for Rust projects", async () => {
    const result = await createVirtual({
      projectName: "test-sanity-cargo",
      ecosystem: "rust",
      rustWebFramework: "axum",
      rustFrontend: "none",
      rustOrm: "none",
      rustApi: "none",
      rustCli: "none",
      rustLibraries: [],
    });

    expect(result.success).toBe(true);
    expect(result.tree).toBeDefined();

    const files = getAllFiles(result.tree!);
    const hasCargoToml = files.some((f) => f.path === "/Cargo.toml" || f.path === "Cargo.toml");
    expect(hasCargoToml).toBe(true);
  });
});
