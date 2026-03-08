import type {
  Addons,
  API,
  AstroIntegration,
  Auth,
  Backend,
  CSSFramework,
  Forms,
  Frontend,
  Runtime,
  UILibrary,
} from "./types";
import {
  getCapabilityDisabledReason,
  normalizeCapabilitySelection,
} from "./capabilities";

export type CompatibilityCategory =
  | "api"
  | "webFrontend"
  | "nativeFrontend"
  | "astroIntegration"
  | "runtime"
  | "backend"
  | "database"
  | "orm"
  | "dbSetup"
  | "webDeploy"
  | "serverDeploy"
  | "auth"
  | "payments"
  | "email"
  | "fileUpload"
  | "logging"
  | "observability"
  | "backendLibraries"
  | "stateManagement"
  | "forms"
  | "validation"
  | "testing"
  | "realtime"
  | "jobQueue"
  | "caching"
  | "search"
  | "fileStorage"
  | "animation"
  | "cssFramework"
  | "uiLibrary"
  | "cms"
  | "featureFlags"
  | "analytics"
  | "codeQuality"
  | "documentation"
  | "appPlatforms"
  | "packageManager"
  | "examples"
  | "ai"
  | "aiDocs"
  | "git"
  | "install"
  | "effect"
  | "rustWebFramework"
  | "rustFrontend"
  | "rustOrm"
  | "rustApi"
  | "rustCli"
  | "rustLibraries"
  | "pythonWebFramework"
  | "pythonOrm"
  | "pythonValidation"
  | "pythonAi"
  | "pythonTaskQueue"
  | "pythonQuality"
  | "goWebFramework"
  | "goOrm"
  | "goApi"
  | "goCli"
  | "goLogging";

export type CompatibilityIssue = {
  code: string;
  message: string;
  category?: CompatibilityCategory;
  optionId?: string;
};

export type CompatibilityEvaluation = {
  issues: CompatibilityIssue[];
};

export type CompatibilityAdjustment = {
  category: string;
  message: string;
};

export type CompatibilityInput = {
  ecosystem: "typescript" | "rust" | "python" | "go";
  projectName: string | null;
  webFrontend: string[];
  nativeFrontend: string[];
  astroIntegration: string;
  runtime: string;
  backend: string;
  database: string;
  orm: string;
  dbSetup: string;
  auth: string;
  payments: string;
  email: string;
  fileUpload: string;
  logging: string;
  observability: string;
  featureFlags: string;
  analytics: string;
  backendLibraries: string;
  stateManagement: string;
  forms: string;
  validation: string;
  testing: string;
  realtime: string;
  jobQueue: string;
  caching: string;
  animation: string;
  cssFramework: string;
  uiLibrary: string;
  cms: string;
  search: string;
  fileStorage: string;
  codeQuality: string[];
  documentation: string[];
  appPlatforms: string[];
  packageManager: string;
  examples: string[];
  aiSdk: string;
  aiDocs: string[];
  git: string;
  install: string;
  api: string;
  webDeploy: string;
  serverDeploy: string;
  yolo: string;
  rustWebFramework: string;
  rustFrontend: string;
  rustOrm: string;
  rustApi: string;
  rustCli: string;
  rustLibraries: string;
  pythonWebFramework: string;
  pythonOrm: string;
  pythonValidation: string;
  pythonAi: string;
  pythonTaskQueue: string;
  pythonQuality: string;
  goWebFramework: string;
  goOrm: string;
  goApi: string;
  goCli: string;
  goLogging: string;
};

const TYPESCRIPT_CATEGORY_ORDER: CompatibilityCategory[] = [
  "webFrontend",
  "nativeFrontend",
  "astroIntegration",
  "cssFramework",
  "uiLibrary",
  "backend",
  "backendLibraries",
  "runtime",
  "api",
  "database",
  "orm",
  "dbSetup",
  "webDeploy",
  "serverDeploy",
  "auth",
  "payments",
  "email",
  "fileUpload",
  "logging",
  "observability",
  "featureFlags",
  "analytics",
  "ai",
  "stateManagement",
  "forms",
  "validation",
  "testing",
  "realtime",
  "jobQueue",
  "caching",
  "search",
  "fileStorage",
  "animation",
  "cms",
  "codeQuality",
  "documentation",
  "appPlatforms",
  "packageManager",
  "examples",
  "aiDocs",
  "git",
  "install",
];

const CATEGORY_ORDER: CompatibilityCategory[] = [
  ...TYPESCRIPT_CATEGORY_ORDER,
  "rustWebFramework",
  "rustFrontend",
  "rustOrm",
  "rustApi",
  "rustCli",
  "rustLibraries",
  "pythonWebFramework",
  "pythonOrm",
  "pythonValidation",
  "pythonAi",
  "pythonTaskQueue",
  "pythonQuality",
  "goWebFramework",
  "goOrm",
  "goApi",
  "goCli",
  "goLogging",
];

const DEFAULT_RUNTIME = "bun";

export function validateProjectName(name: string): string | undefined {
  const INVALID_CHARS = ["<", ">", ":", '"', "|", "?", "*"];
  const MAX_LENGTH = 255;

  if (name === ".") return undefined;

  if (!name) return "Project name cannot be empty";
  if (name.length > MAX_LENGTH) {
    return `Project name must be less than ${MAX_LENGTH} characters`;
  }
  if (INVALID_CHARS.some((char) => name.includes(char))) {
    return "Project name contains invalid characters";
  }
  if (name.startsWith(".") || name.startsWith("-")) {
    return "Project name cannot start with a dot or dash";
  }
  if (name.toLowerCase() === "node_modules" || name.toLowerCase() === "favicon.ico") {
    return "Project name is reserved";
  }
  return undefined;
}

export const hasPWACompatibleFrontend = (webFrontend: string[]) =>
  webFrontend.some((f) =>
    ["tanstack-router", "react-router", "solid", "next", "astro"].includes(f),
  );

export const hasTauriCompatibleFrontend = (webFrontend: string[]) =>
  webFrontend.some((f) =>
    ["tanstack-router", "react-router", "nuxt", "svelte", "solid", "next", "astro"].includes(f),
  );

const isChatSdkExampleSupported = (stack: CompatibilityInput): boolean => {
  if (stack.ecosystem !== "typescript") return false;

  if (stack.backend === "self-next" || stack.backend === "self-tanstack-start") {
    return true;
  }

  if (stack.backend === "self-nuxt") {
    return true;
  }

  if (stack.backend === "hono") {
    return stack.runtime === "node";
  }

  return false;
};

export const requiresChatSdkVercelAI = (stack: CompatibilityInput): boolean => {
  return (
    stack.examples.includes("chat-sdk") &&
    (stack.backend === "self-nuxt" || (stack.backend === "hono" && stack.runtime === "node"))
  );
};

export const getCategoryDisplayName = (categoryKey: string): string => {
  // Custom display names for Rust categories
  const rustCategoryNames: Record<string, string> = {
    rustWebFramework: "Rust Web Framework",
    rustFrontend: "Rust Frontend (WASM)",
    rustOrm: "Rust ORM / Database",
    rustApi: "Rust API Layer",
    rustCli: "Rust CLI Tools",
    rustLibraries: "Rust Core Libraries",
  };

  // Custom display names for Python categories
  const pythonCategoryNames: Record<string, string> = {
    pythonWebFramework: "Python Web Framework",
    pythonOrm: "Python ORM / Database",
    pythonValidation: "Python Validation",
    pythonAi: "Python AI / ML",
    pythonTaskQueue: "Python Task Queue",
    pythonQuality: "Python Code Quality",
  };

  // Custom display names for Go categories
  const goCategoryNames: Record<string, string> = {
    goWebFramework: "Go Web Framework",
    goOrm: "Go ORM / Database",
    goApi: "Go API Layer",
    goCli: "Go CLI Tools",
    goLogging: "Go Logging",
  };

  if (rustCategoryNames[categoryKey]) {
    return rustCategoryNames[categoryKey];
  }

  if (pythonCategoryNames[categoryKey]) {
    return pythonCategoryNames[categoryKey];
  }

  if (goCategoryNames[categoryKey]) {
    return goCategoryNames[categoryKey];
  }

  const result = categoryKey.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
};

export type CompatibilityAnalysisResult = {
  adjustedStack: CompatibilityInput | null;
  notes: Record<string, { notes: string[]; hasIssue: boolean }>;
  changes: CompatibilityAdjustment[];
};

/**
 * Analyzes the stack and auto-adjusts incompatible selections.
 * This follows the CLI approach: when you make a selection, dependent items adjust automatically.
 * The flow is: frontend -> backend -> runtime -> database -> orm -> api -> auth -> etc.
 */
export const analyzeStackCompatibility = (
  stack: CompatibilityInput,
): CompatibilityAnalysisResult => {
  // Skip all validation if YOLO mode is enabled
  if (stack.yolo === "true") {
    return {
      adjustedStack: null,
      notes: {},
      changes: [],
    };
  }

  const nextStack = { ...stack };
  let changed = false;
  const notes: CompatibilityAnalysisResult["notes"] = {};
  const changes: CompatibilityAdjustment[] = [];

  for (const cat of CATEGORY_ORDER) {
    notes[cat] = { notes: [], hasIssue: false };
  }

  // ============================================
  // BACKEND CONSTRAINTS
  // ============================================

  if (nextStack.backend === "convex") {
    // Convex handles its own runtime, database, orm, api, dbSetup
    const convexOverrides: Partial<CompatibilityInput> = {
      runtime: "none",
      database: "none",
      orm: "none",
      api: "none",
      dbSetup: "none",
      serverDeploy: "none",
      search: "none",
      fileStorage: "none",
    };

    for (const [key, value] of Object.entries(convexOverrides)) {
      const catKey = key as keyof CompatibilityInput;
      if (nextStack[catKey] !== value) {
        nextStack[catKey] = value as never;
        changed = true;
        changes.push({
          category: "backend",
          message: `${getCategoryDisplayName(catKey)} set to '${value}' (Convex provides this)`,
        });
      }
    }

    // Remove incompatible frontends
    if (nextStack.webFrontend.includes("solid")) {
      nextStack.webFrontend = nextStack.webFrontend.filter((f) => f !== "solid");
      if (nextStack.webFrontend.length === 0) nextStack.webFrontend = ["none"];
      changed = true;
      changes.push({ category: "backend", message: "Removed Solid (incompatible with Convex)" });
    }
    if (nextStack.webFrontend.includes("solid-start")) {
      nextStack.webFrontend = nextStack.webFrontend.filter((f) => f !== "solid-start");
      if (nextStack.webFrontend.length === 0) nextStack.webFrontend = ["none"];
      changed = true;
      changes.push({
        category: "backend",
        message: "Removed SolidStart (incompatible with Convex)",
      });
    }
    if (nextStack.webFrontend.includes("astro")) {
      nextStack.webFrontend = nextStack.webFrontend.filter((f) => f !== "astro");
      if (nextStack.webFrontend.length === 0) nextStack.webFrontend = ["none"];
      nextStack.astroIntegration = "none";
      changed = true;
      changes.push({ category: "backend", message: "Removed Astro (incompatible with Convex)" });
    }

    // Remove AI example if incompatible frontends are selected (Convex AI only supports React-based frontends)
    if (nextStack.examples.includes("ai")) {
      const hasIncompatibleFrontend = nextStack.webFrontend.some((f) =>
        ["solid", "svelte", "nuxt"].includes(f),
      );
      if (hasIncompatibleFrontend) {
        nextStack.examples = nextStack.examples.filter((e) => e !== "ai");
        if (nextStack.examples.length === 0) nextStack.examples = ["none"];
        changed = true;
        changes.push({
          category: "examples",
          message: "AI example removed (Convex AI only supports React-based frontends)",
        });
      }
    }

  }

  if (nextStack.backend === "none") {
    // No backend means no runtime, database, orm, api, auth, dbSetup, serverDeploy
    const noneOverrides: Partial<CompatibilityInput> = {
      runtime: "none",
      database: "none",
      orm: "none",
      api: "none",
      dbSetup: "none",
      serverDeploy: "none",
      payments: "none",
      search: "none",
      fileStorage: "none",
    };

    if (nextStack.ecosystem !== "go") {
      noneOverrides.auth = "none";
    }

    for (const [key, value] of Object.entries(noneOverrides)) {
      const catKey = key as keyof CompatibilityInput;
      if (nextStack[catKey] !== value) {
        nextStack[catKey] = value as never;
        changed = true;
        changes.push({
          category: "backend",
          message: `${getCategoryDisplayName(catKey)} set to '${value}' (no backend)`,
        });
      }
    }

    // Clear examples
    if (
      nextStack.examples.length > 0 &&
      !(nextStack.examples.length === 1 && nextStack.examples[0] === "none")
    ) {
      nextStack.examples = ["none"];
      changed = true;
      changes.push({ category: "backend", message: "Examples cleared (no backend)" });
    }
  }

  // Self (fullstack) backend constraints
  if (
    nextStack.backend === "self-next" ||
    nextStack.backend === "self-tanstack-start" ||
    nextStack.backend === "self-astro" ||
    nextStack.backend === "self-nuxt" ||
    nextStack.backend === "self-svelte" ||
    nextStack.backend === "self-solid-start"
  ) {
    // Fullstack uses frontend's API routes, no separate runtime needed
    if (nextStack.runtime !== "none") {
      nextStack.runtime = "none";
      changed = true;
      changes.push({
        category: "backend",
        message: "Runtime set to 'None' (fullstack uses frontend's API routes)",
      });
    }
    if (nextStack.serverDeploy !== "none") {
      nextStack.serverDeploy = "none";
      changed = true;
      changes.push({
        category: "backend",
        message: "Server deploy set to 'None' (fullstack uses frontend deployment)",
      });
    }

    // Ensure correct frontend is selected
    if (nextStack.backend === "self-next" && !nextStack.webFrontend.includes("next")) {
      nextStack.webFrontend = ["next"];
      changed = true;
      changes.push({
        category: "backend",
        message: "Frontend set to 'Next.js' (required for Next.js fullstack)",
      });
    }
    if (
      nextStack.backend === "self-tanstack-start" &&
      !nextStack.webFrontend.includes("tanstack-start")
    ) {
      nextStack.webFrontend = ["tanstack-start"];
      changed = true;
      changes.push({
        category: "backend",
        message: "Frontend set to 'TanStack Start' (required for TanStack Start fullstack)",
      });
    }
    if (nextStack.backend === "self-astro" && !nextStack.webFrontend.includes("astro")) {
      nextStack.webFrontend = ["astro"];
      if (nextStack.astroIntegration === "none") {
        nextStack.astroIntegration = "react";
      }
      changed = true;
      changes.push({
        category: "backend",
        message: "Frontend set to 'Astro' (required for Astro fullstack)",
      });
    }
    if (nextStack.backend === "self-nuxt" && !nextStack.webFrontend.includes("nuxt")) {
      nextStack.webFrontend = ["nuxt"];
      changed = true;
      changes.push({
        category: "backend",
        message: "Frontend set to 'Nuxt' (required for Nuxt fullstack)",
      });
    }
    if (nextStack.backend === "self-svelte" && !nextStack.webFrontend.includes("svelte")) {
      nextStack.webFrontend = ["svelte"];
      changed = true;
      changes.push({
        category: "backend",
        message: "Frontend set to 'SvelteKit' (required for SvelteKit fullstack)",
      });
    }
    if (
      nextStack.backend === "self-solid-start" &&
      !nextStack.webFrontend.includes("solid-start")
    ) {
      nextStack.webFrontend = ["solid-start"];
      changed = true;
      changes.push({
        category: "backend",
        message: "Frontend set to 'SolidStart' (required for SolidStart fullstack)",
      });
    }
  }

  // ============================================
  // RUNTIME CONSTRAINTS
  // ============================================

  // Workers runtime requires Hono backend
  if (nextStack.runtime === "workers" && nextStack.backend !== "hono") {
    nextStack.backend = "hono";
    changed = true;
    changes.push({ category: "runtime", message: "Backend set to 'Hono' (required for Workers)" });
  }

  // Workers runtime requires server deployment
  if (nextStack.runtime === "workers" && nextStack.serverDeploy === "none") {
    nextStack.serverDeploy = "cloudflare";
    changed = true;
    changes.push({
      category: "runtime",
      message: "Server deploy set to 'Cloudflare' (required for Workers)",
    });
  }

  // Workers runtime is incompatible with MongoDB
  if (nextStack.runtime === "workers" && nextStack.database === "mongodb") {
    nextStack.database = "sqlite";
    nextStack.orm = "drizzle";
    nextStack.dbSetup = "d1";
    changed = true;
    changes.push({
      category: "runtime",
      message:
        "Database changed to SQLite with D1 (Better-Fullstack doesn't support MongoDB with Workers)",
    });
  }

  // Runtime "none" only for convex and fullstack backends
  if (
    nextStack.runtime === "none" &&
    nextStack.backend !== "convex" &&
    nextStack.backend !== "none" &&
    nextStack.backend !== "self-next" &&
    nextStack.backend !== "self-tanstack-start" &&
    nextStack.backend !== "self-astro" &&
    nextStack.backend !== "self-nuxt" &&
    nextStack.backend !== "self-svelte" &&
    nextStack.backend !== "self-solid-start"
  ) {
    nextStack.runtime = DEFAULT_RUNTIME;
    changed = true;
    changes.push({
      category: "runtime",
      message: `Runtime set to '${DEFAULT_RUNTIME}' (required for this backend)`,
    });
  }

  // ============================================
  // DATABASE & ORM CONSTRAINTS (CLI-like flow)
  // ============================================

  // Skip if backend doesn't use database
  if (nextStack.backend !== "convex" && nextStack.backend !== "none") {
    // If database is none, ORM and dbSetup must be none
    if (nextStack.database === "none") {
      if (nextStack.orm !== "none") {
        nextStack.orm = "none";
        changed = true;
        changes.push({ category: "database", message: "ORM set to 'None' (no database selected)" });
      }
      if (nextStack.dbSetup !== "none") {
        nextStack.dbSetup = "none";
        changed = true;
        changes.push({
          category: "database",
          message: "DB Setup set to 'None' (no database selected)",
        });
      }
    }

    // MongoDB requires Prisma or Mongoose
    if (nextStack.database === "mongodb") {
      if (nextStack.orm !== "prisma" && nextStack.orm !== "mongoose") {
        nextStack.orm = "prisma";
        changed = true;
        changes.push({
          category: "database",
          message: "ORM set to 'Prisma' (required for MongoDB)",
        });
      }
      // MongoDB only works with mongodb-atlas or none for dbSetup
      if (
        nextStack.dbSetup !== "mongodb-atlas" &&
        nextStack.dbSetup !== "none" &&
        nextStack.dbSetup !== "docker"
      ) {
        nextStack.dbSetup = "none";
        changed = true;
        changes.push({
          category: "database",
          message: "DB Setup set to 'None' (incompatible with MongoDB)",
        });
      }
    }

    // Relational databases (sqlite, postgres, mysql) need Drizzle or Prisma
    if (["sqlite", "postgres", "mysql"].includes(nextStack.database)) {
      if (nextStack.orm === "none") {
        nextStack.orm = "drizzle";
        changed = true;
        changes.push({
          category: "database",
          message: "ORM set to 'Drizzle' (required for database)",
        });
      }
      if (nextStack.orm === "mongoose") {
        nextStack.orm = "drizzle";
        changed = true;
        changes.push({
          category: "database",
          message: "ORM set to 'Drizzle' (Mongoose only works with MongoDB)",
        });
      }
    }

    // ORM selected but no database - select appropriate database
    if (nextStack.orm !== "none" && nextStack.database === "none") {
      if (nextStack.orm === "mongoose") {
        nextStack.database = "mongodb";
        changed = true;
        changes.push({
          category: "orm",
          message: "Database set to 'MongoDB' (required for Mongoose)",
        });
      } else {
        nextStack.database = "sqlite";
        changed = true;
        changes.push({ category: "orm", message: "Database set to 'SQLite' (required for ORM)" });
      }
    }

    // DB Setup constraints
    if (nextStack.dbSetup === "turso" && nextStack.database !== "sqlite") {
      nextStack.database = "sqlite";
      changed = true;
      changes.push({
        category: "dbSetup",
        message: "Database set to 'SQLite' (required for Turso)",
      });
    }
    if (nextStack.dbSetup === "d1") {
      if (nextStack.database !== "sqlite") {
        nextStack.database = "sqlite";
        changed = true;
        changes.push({
          category: "dbSetup",
          message: "Database set to 'SQLite' (required for D1)",
        });
      }
      if (nextStack.runtime !== "workers") {
        nextStack.runtime = "workers";
        nextStack.backend = "hono";
        changed = true;
        changes.push({
          category: "dbSetup",
          message: "Runtime set to 'Workers' with 'Hono' (required for D1)",
        });
      }
    }
    if (nextStack.dbSetup === "neon" && nextStack.database !== "postgres") {
      nextStack.database = "postgres";
      changed = true;
      changes.push({
        category: "dbSetup",
        message: "Database set to 'PostgreSQL' (required for Neon)",
      });
    }
    if (nextStack.dbSetup === "supabase" && nextStack.database !== "postgres") {
      nextStack.database = "postgres";
      changed = true;
      changes.push({
        category: "dbSetup",
        message: "Database set to 'PostgreSQL' (required for Supabase)",
      });
    }
    if (nextStack.dbSetup === "prisma-postgres" && nextStack.database !== "postgres") {
      nextStack.database = "postgres";
      changed = true;
      changes.push({
        category: "dbSetup",
        message: "Database set to 'PostgreSQL' (required for Prisma Postgres)",
      });
    }
    if (nextStack.dbSetup === "mongodb-atlas" && nextStack.database !== "mongodb") {
      nextStack.database = "mongodb";
      if (nextStack.orm !== "prisma" && nextStack.orm !== "mongoose") {
        nextStack.orm = "prisma";
      }
      changed = true;
      changes.push({
        category: "dbSetup",
        message: "Database set to 'MongoDB' (required for MongoDB Atlas)",
      });
    }
    if (
      nextStack.dbSetup === "planetscale" &&
      nextStack.database !== "postgres" &&
      nextStack.database !== "mysql"
    ) {
      nextStack.database = "postgres";
      changed = true;
      changes.push({
        category: "dbSetup",
        message: "Database set to 'PostgreSQL' (required for PlanetScale)",
      });
    }
    if (nextStack.dbSetup === "docker") {
      if (nextStack.database === "sqlite") {
        nextStack.dbSetup = "none";
        changed = true;
        changes.push({
          category: "dbSetup",
          message: "DB Setup set to 'None' (SQLite doesn't need Docker)",
        });
      }
      if (nextStack.runtime === "workers") {
        nextStack.dbSetup = "d1";
        changed = true;
        changes.push({
          category: "dbSetup",
          message:
            "DB Setup set to 'D1' (Better-Fullstack doesn't support Docker setup with Workers)",
        });
      }
    }
  }

  // ============================================
  // API CONSTRAINTS
  // ============================================

  if (nextStack.backend !== "convex" && nextStack.backend !== "none") {
    // Nuxt, Svelte, Solid, SolidStart require oRPC (not tRPC)
    const needsOrpc = nextStack.webFrontend.some((f) =>
      ["nuxt", "svelte", "solid", "solid-start"].includes(f),
    );
    if (needsOrpc && nextStack.api === "trpc") {
      nextStack.api = "orpc";
      changed = true;
      changes.push({ category: "api", message: "API set to 'oRPC' (required for this frontend)" });
    }

    // Astro with non-React integration requires oRPC
    if (
      nextStack.webFrontend.includes("astro") &&
      nextStack.astroIntegration !== "react" &&
      nextStack.api === "trpc"
    ) {
      nextStack.api = "orpc";
      changed = true;
      changes.push({
        category: "api",
        message: "API set to 'oRPC' (tRPC requires React integration with Astro)",
      });
    }
  }

  // ============================================
  // ASTRO INTEGRATION CONSTRAINTS
  // ============================================

  // If Astro is not selected, reset astroIntegration
  if (!nextStack.webFrontend.includes("astro") && nextStack.astroIntegration !== "none") {
    nextStack.astroIntegration = "none";
    changed = true;
    changes.push({
      category: "astroIntegration",
      message: "Astro integration reset (Astro not selected)",
    });
  }

  // If Astro is selected but no integration is set, default to react
  if (nextStack.webFrontend.includes("astro") && nextStack.astroIntegration === "none") {
    // Only set default if api is trpc (which requires react)
    if (nextStack.api === "trpc") {
      nextStack.astroIntegration = "react";
      changed = true;
      changes.push({
        category: "astroIntegration",
        message: "Astro integration set to 'React' (required for tRPC)",
      });
    }
  }

  // ============================================
  // AUTH CONSTRAINTS
  // ============================================

  const normalizedAuth = normalizeCapabilitySelection(
    "auth",
    {
      ecosystem: nextStack.ecosystem,
      backend: nextStack.backend,
      webFrontend: nextStack.webFrontend,
      nativeFrontend: nextStack.nativeFrontend,
    },
    nextStack.auth as Auth,
  );

  if (normalizedAuth.normalized && nextStack.auth !== normalizedAuth.value) {
    nextStack.auth = normalizedAuth.value;
    changed = true;
    changes.push({
      category: "auth",
      message: normalizedAuth.message ?? "Auth set to 'None'",
    });
  }

  // ============================================
  // PAYMENTS CONSTRAINTS
  // ============================================

  if (nextStack.payments === "polar") {
    if (nextStack.auth !== "better-auth") {
      nextStack.payments = "none";
      changed = true;
      changes.push({
        category: "payments",
        message: "Payments set to 'None' (Polar requires Better Auth)",
      });
    }
    if (nextStack.backend === "convex") {
      nextStack.payments = "none";
      changed = true;
      changes.push({
        category: "payments",
        message: "Payments set to 'None' (Polar incompatible with Convex)",
      });
    }
    const hasWebFrontend = nextStack.webFrontend.some((f) => f !== "none");
    if (!hasWebFrontend) {
      nextStack.payments = "none";
      changed = true;
      changes.push({
        category: "payments",
        message: "Payments set to 'None' (Polar requires web frontend)",
      });
    }
  }

  // ============================================
  // EMAIL CONSTRAINTS
  // ============================================

  if (nextStack.email !== "none") {
    if (nextStack.backend === "convex") {
      nextStack.email = "none";
      changed = true;
      changes.push({
        category: "email",
        message: "Email set to 'None' (incompatible with Convex)",
      });
    }
    if (nextStack.backend === "none") {
      nextStack.email = "none";
      changed = true;
      changes.push({
        category: "email",
        message: "Email set to 'None' (requires backend)",
      });
    }
  }

  // ============================================
  // CSS FRAMEWORK & UI LIBRARY CONSTRAINTS
  // ============================================

  // If no web frontend, reset CSS framework and UI library to none
  if (!nextStack.webFrontend.some((f) => f !== "none")) {
    if (nextStack.cssFramework !== "none") {
      nextStack.cssFramework = "none";
      changed = true;
      changes.push({
        category: "cssFramework",
        message: "CSS framework set to 'None' (no web frontend)",
      });
    }
    if (nextStack.uiLibrary !== "none") {
      nextStack.uiLibrary = "none";
      changed = true;
      changes.push({
        category: "uiLibrary",
        message: "UI library set to 'None' (no web frontend)",
      });
    }
  }

  // UI libraries requiring Tailwind - auto-adjust CSS framework or clear UI library
  const requiresTailwind = ["shadcn-ui", "daisyui", "nextui"].includes(nextStack.uiLibrary);
  if (requiresTailwind && nextStack.cssFramework !== "tailwind") {
    // Auto-set Tailwind when selecting a Tailwind-dependent UI library
    nextStack.cssFramework = "tailwind";
    changed = true;
    changes.push({
      category: "cssFramework",
      message: `CSS framework set to 'Tailwind' (required by ${nextStack.uiLibrary})`,
    });
  }

  // React-only UI libraries - check frontend compatibility
  const reactOnlyLibraries = ["shadcn-ui", "radix-ui", "chakra-ui", "nextui"];
  const reactFrontends = ["tanstack-router", "react-router", "tanstack-start", "next"];
  if (reactOnlyLibraries.includes(nextStack.uiLibrary)) {
    const hasReactFrontend = nextStack.webFrontend.some((f) => reactFrontends.includes(f));
    const hasAstroReact =
      nextStack.webFrontend.includes("astro") && nextStack.astroIntegration === "react";
    if (!hasReactFrontend && !hasAstroReact && nextStack.webFrontend.some((f) => f !== "none")) {
      // Reset to a compatible UI library (daisyui works with all frontends)
      nextStack.uiLibrary = "daisyui";
      changed = true;
      changes.push({
        category: "uiLibrary",
        message:
          "UI library changed to 'daisyUI' (React-only library incompatible with this frontend)",
      });
    }
  }

  // Headless UI requires React or Vue
  if (nextStack.uiLibrary === "headless-ui") {
    const hasReactFrontend = nextStack.webFrontend.some((f) => reactFrontends.includes(f));
    const hasVueFrontend = nextStack.webFrontend.includes("nuxt");
    const hasAstroReactOrVue =
      nextStack.webFrontend.includes("astro") &&
      ["react", "vue"].includes(nextStack.astroIntegration);
    if (!hasReactFrontend && !hasVueFrontend && !hasAstroReactOrVue) {
      nextStack.uiLibrary = "daisyui";
      changed = true;
      changes.push({
        category: "uiLibrary",
        message: "UI library changed to 'daisyUI' (Headless UI requires React or Vue)",
      });
    }
  }

  // Park UI requires React, Vue, or Solid
  if (nextStack.uiLibrary === "park-ui") {
    const hasReactFrontend = nextStack.webFrontend.some((f) => reactFrontends.includes(f));
    const hasVueFrontend = nextStack.webFrontend.includes("nuxt");
    const hasSolidFrontend = nextStack.webFrontend.includes("solid");
    const hasAstroCompatible =
      nextStack.webFrontend.includes("astro") &&
      ["react", "vue", "solid"].includes(nextStack.astroIntegration);
    if (
      !hasReactFrontend &&
      !hasVueFrontend &&
      !hasSolidFrontend &&
      !hasAstroCompatible &&
      nextStack.webFrontend.some((f) => f !== "none")
    ) {
      nextStack.uiLibrary = "daisyui";
      changed = true;
      changes.push({
        category: "uiLibrary",
        message: "UI library changed to 'daisyUI' (Park UI requires React, Vue, or Solid)",
      });
    }
  }

  // ============================================
  // APP PLATFORMS CONSTRAINTS
  // ============================================

  const pwaCompat = hasPWACompatibleFrontend(nextStack.webFrontend);
  const tauriCompat = hasTauriCompatibleFrontend(nextStack.webFrontend);

  if (!pwaCompat && nextStack.appPlatforms.includes("pwa")) {
    nextStack.appPlatforms = nextStack.appPlatforms.filter((a) => a !== "pwa");
    changed = true;
    changes.push({
      category: "appPlatforms",
      message: "PWA removed (requires compatible frontend)",
    });
  }
  if (!tauriCompat && nextStack.appPlatforms.includes("tauri")) {
    nextStack.appPlatforms = nextStack.appPlatforms.filter((a) => a !== "tauri");
    changed = true;
    changes.push({
      category: "appPlatforms",
      message: "Tauri removed (requires compatible frontend)",
    });
  }

  // ============================================
  // EXAMPLES CONSTRAINTS
  // ============================================

  // AI example constraints
  if (nextStack.examples.includes("ai")) {
    // Solid/SolidStart frontend is incompatible with AI example
    if (nextStack.webFrontend.includes("solid") || nextStack.webFrontend.includes("solid-start")) {
      nextStack.examples = nextStack.examples.filter((e) => e !== "ai");
      if (nextStack.examples.length === 0) nextStack.examples = ["none"];
      changed = true;
      changes.push({
        category: "examples",
        message: "AI removed (not compatible with Solid frontend)",
      });
    }
    // Convex AI only supports React-based frontends (not Svelte/Nuxt)
    if (nextStack.backend === "convex") {
      const hasIncompatibleFrontend = nextStack.webFrontend.some((f) =>
        ["svelte", "nuxt"].includes(f),
      );
      if (hasIncompatibleFrontend) {
        nextStack.examples = nextStack.examples.filter((e) => e !== "ai");
        if (nextStack.examples.length === 0) nextStack.examples = ["none"];
        changed = true;
        changes.push({
          category: "examples",
          message: "AI removed (Convex AI only supports React-based frontends)",
        });
      }
    }
  }

  // Chat SDK example constraints (framework-specific profiles in v1)
  if (nextStack.examples.includes("chat-sdk")) {
    if (!isChatSdkExampleSupported(nextStack)) {
      nextStack.examples = nextStack.examples.filter((e) => e !== "chat-sdk");
      if (nextStack.examples.length === 0) nextStack.examples = ["none"];
      changed = true;

      let reason = "unsupported stack";
      if (nextStack.ecosystem !== "typescript") {
        reason = "TypeScript ecosystem only";
      } else if (nextStack.backend === "convex") {
        reason = "Convex backend not supported in v1";
      } else if (nextStack.backend === "none") {
        reason = "requires a backend";
      } else if (nextStack.backend === "hono" && nextStack.runtime !== "node") {
        reason = "Hono profile requires Node runtime";
      } else if (nextStack.backend.startsWith("self-")) {
        reason = "self backend only supports Next.js, TanStack Start, or Nuxt in v1";
      }

      changes.push({
        category: "examples",
        message: `Chat SDK removed (${reason})`,
      });
    } else if (requiresChatSdkVercelAI(nextStack) && nextStack.aiSdk !== "vercel-ai") {
      nextStack.aiSdk = "vercel-ai";
      changed = true;
      changes.push({
        category: "ai",
        message: "AI SDK set to 'Vercel AI SDK' (required by Chat SDK Nuxt/Hono profile in v1)",
      });
    }
  }

  // ============================================
  // FRESH FRONTEND CONSTRAINTS
  // Fresh is Preact-based and incompatible with React-specific packages
  // ============================================

  const isFresh = nextStack.webFrontend.includes("fresh");

  if (isFresh) {
    // TanStack Form has no Preact adapter
    if (nextStack.forms === "tanstack-form") {
      nextStack.forms = "none";
      changed = true;
      changes.push({
        category: "forms",
        message: "Forms set to 'None' (TanStack Form has no Preact adapter)",
      });
    }

    // State management libraries that require React bindings
    const reactOnlyStateManagement = ["nanostores", "xstate", "tanstack-store"];
    if (reactOnlyStateManagement.includes(nextStack.stateManagement)) {
      const oldValue = nextStack.stateManagement;
      nextStack.stateManagement = "none";
      changed = true;
      changes.push({
        category: "stateManagement",
        message: `State management set to 'None' (${oldValue} requires React bindings)`,
      });
    }

    // Lottie uses lottie-react which requires React
    if (nextStack.animation === "lottie") {
      nextStack.animation = "none";
      changed = true;
      changes.push({
        category: "animation",
        message: "Animation set to 'None' (Lottie requires lottie-react)",
      });
    }
  }

  // ============================================
  // DEPLOYMENT CONSTRAINTS
  // ============================================

  // Web deploy requires web frontend
  if (nextStack.webDeploy !== "none" && !nextStack.webFrontend.some((f) => f !== "none")) {
    nextStack.webDeploy = "none";
    changed = true;
    changes.push({ category: "webDeploy", message: "Web deploy set to 'None' (no web frontend)" });
  }

  // Server deploy constraints
  if (nextStack.serverDeploy === "cloudflare") {
    if (nextStack.runtime !== "workers" || nextStack.backend !== "hono") {
      nextStack.serverDeploy = "none";
      changed = true;
      changes.push({
        category: "serverDeploy",
        message: "Server deploy set to 'None' (Cloudflare requires Workers + Hono)",
      });
    }
  }

  if (
    nextStack.serverDeploy !== "none" &&
    [
      "none",
      "convex",
      "self-next",
      "self-tanstack-start",
      "self-astro",
      "self-nuxt",
      "self-svelte",
      "self-solid-start",
    ].includes(nextStack.backend)
  ) {
    nextStack.serverDeploy = "none";
    changed = true;
    changes.push({
      category: "serverDeploy",
      message: "Server deploy set to 'None' (not needed for this backend)",
    });
  }

  return {
    adjustedStack: changed ? nextStack : null,
    notes,
    changes,
  };
};

/**
 * Returns a reason why an option is disabled, or null if it's enabled.
 *
 * PHILOSOPHY: Only disable options that are TRULY incompatible.
 * - Don't create circular dependencies
 * - Allow users to select options that will trigger auto-adjustments
 * - Follow CLI behavior: filter options based on UPSTREAM selections only
 */
export const getDisabledReason = (
  currentStack: CompatibilityInput,
  category: CompatibilityCategory,
  optionId: string,
): string | null => {
  // ============================================
  // CONVEX BACKEND - locks down many options
  // ============================================
  if (currentStack.backend === "convex") {
    if (category === "runtime" && optionId !== "none") {
      return "Convex provides its own runtime";
    }
    if (category === "database" && optionId !== "none") {
      return "Convex provides its own database";
    }
    if (category === "orm" && optionId !== "none") {
      return "Convex has built-in data access";
    }
    if (category === "api" && optionId !== "none") {
      return "Convex provides its own API layer";
    }
    if (category === "dbSetup" && optionId !== "none") {
      return "Convex handles database setup";
    }
    if (category === "serverDeploy" && optionId !== "none") {
      return "Convex has its own deployment";
    }
    if (category === "search" && optionId !== "none") {
      return "Search requires a standalone backend";
    }
    if (category === "fileStorage" && optionId !== "none") {
      return "File storage requires a standalone backend";
    }
    if (category === "webFrontend" && optionId === "solid") {
      return "In Better-Fullstack, the Convex backend is currently not available with Solid";
    }
    if (category === "webFrontend" && optionId === "astro") {
      return "In Better-Fullstack, the Convex backend is currently not available with Astro";
    }
    if (category === "examples" && optionId === "ai") {
      const hasIncompatibleFrontend = currentStack.webFrontend.some((f) =>
        ["solid", "svelte", "nuxt"].includes(f),
      );
      if (hasIncompatibleFrontend) {
        const frontendName = currentStack.webFrontend.find((f) =>
          ["solid", "svelte", "nuxt"].includes(f),
        );
        return `Convex AI example only supports React-based frontends (not ${frontendName})`;
      }
    }
    if (category === "payments" && optionId === "polar") {
      return "In Better-Fullstack, Polar is currently not available with the Convex backend";
    }
  }

  // ============================================
  // NO BACKEND - locks down backend-dependent options
  // ============================================
  if (currentStack.backend === "none") {
    if (category === "runtime" && optionId !== "none") {
      return "No backend selected";
    }
    if (category === "database" && optionId !== "none") {
      return "No backend selected";
    }
    if (category === "orm" && optionId !== "none") {
      return "No backend selected";
    }
    if (category === "api" && optionId !== "none") {
      return "No backend selected";
    }
    if (category === "dbSetup" && optionId !== "none") {
      return "No backend selected";
    }
    if (category === "serverDeploy" && optionId !== "none") {
      return "No backend selected";
    }
    if (category === "payments" && optionId !== "none") {
      return "No backend selected";
    }
    if (category === "search" && optionId !== "none") {
      return "No backend selected";
    }
    if (category === "fileStorage" && optionId !== "none") {
      return "No backend selected";
    }
    if (category === "examples" && optionId !== "none") {
      return "No backend selected";
    }
  }

  // ============================================
  // FULLSTACK BACKEND CONSTRAINTS
  // ============================================
  if (currentStack.backend === "self-next") {
    if (category === "runtime" && optionId !== "none") {
      return "Next.js fullstack uses built-in API routes";
    }
    if (category === "webFrontend" && optionId !== "next" && optionId !== "none") {
      return "Next.js fullstack requires Next.js frontend";
    }
    if (category === "serverDeploy" && optionId !== "none") {
      return "Fullstack uses frontend deployment";
    }
  }

  if (currentStack.backend === "self-tanstack-start") {
    if (category === "runtime" && optionId !== "none") {
      return "TanStack Start fullstack uses built-in API routes";
    }
    if (category === "webFrontend" && optionId !== "tanstack-start" && optionId !== "none") {
      return "TanStack Start fullstack requires TanStack Start frontend";
    }
    if (category === "serverDeploy" && optionId !== "none") {
      return "Fullstack uses frontend deployment";
    }
  }

  if (currentStack.backend === "self-astro") {
    if (category === "runtime" && optionId !== "none") {
      return "Astro fullstack uses built-in API routes";
    }
    if (category === "webFrontend" && optionId !== "astro" && optionId !== "none") {
      return "Astro fullstack requires Astro frontend";
    }
    if (category === "serverDeploy" && optionId !== "none") {
      return "Fullstack uses frontend deployment";
    }
  }

  if (currentStack.backend === "self-nuxt") {
    if (category === "runtime" && optionId !== "none") {
      return "Nuxt fullstack uses built-in API routes";
    }
    if (category === "webFrontend" && optionId !== "nuxt" && optionId !== "none") {
      return "Nuxt fullstack requires Nuxt frontend";
    }
    if (category === "serverDeploy" && optionId !== "none") {
      return "Fullstack uses frontend deployment";
    }
  }

  if (currentStack.backend === "self-svelte") {
    if (category === "runtime" && optionId !== "none") {
      return "SvelteKit fullstack uses built-in API routes";
    }
    if (category === "webFrontend" && optionId !== "svelte" && optionId !== "none") {
      return "SvelteKit fullstack requires SvelteKit frontend";
    }
    if (category === "serverDeploy" && optionId !== "none") {
      return "Fullstack uses frontend deployment";
    }
  }

  if (currentStack.backend === "self-solid-start") {
    if (category === "runtime" && optionId !== "none") {
      return "SolidStart fullstack uses built-in API routes";
    }
    if (category === "webFrontend" && optionId !== "solid-start" && optionId !== "none") {
      return "SolidStart fullstack requires SolidStart frontend";
    }
    if (category === "serverDeploy" && optionId !== "none") {
      return "Fullstack uses frontend deployment";
    }
  }

  // ============================================
  // BACKEND SELECTION CONSTRAINTS
  // ============================================
  if (category === "backend") {
    if (optionId === "self-next" && !currentStack.webFrontend.includes("next")) {
      return "Requires Next.js frontend";
    }
    if (
      optionId === "self-tanstack-start" &&
      !currentStack.webFrontend.includes("tanstack-start")
    ) {
      return "Requires TanStack Start frontend";
    }
    if (optionId === "self-astro" && !currentStack.webFrontend.includes("astro")) {
      return "Requires Astro frontend";
    }
    if (optionId === "self-nuxt" && !currentStack.webFrontend.includes("nuxt")) {
      return "Requires Nuxt frontend";
    }
    if (optionId === "self-svelte" && !currentStack.webFrontend.includes("svelte")) {
      return "Requires SvelteKit frontend";
    }
    if (optionId === "self-solid-start" && !currentStack.webFrontend.includes("solid-start")) {
      return "Requires SolidStart frontend";
    }
    if (optionId === "convex" && currentStack.webFrontend.includes("solid")) {
      return "In Better-Fullstack, Convex is currently not available with Solid";
    }
    if (optionId === "convex" && currentStack.webFrontend.includes("solid-start")) {
      return "In Better-Fullstack, Convex is currently not available with SolidStart";
    }
    if (optionId === "convex" && currentStack.webFrontend.includes("astro")) {
      return "In Better-Fullstack, Convex is currently not available with Astro";
    }
    // Workers runtime only works with Hono backend
    if (currentStack.runtime === "workers" && optionId !== "hono" && optionId !== "none") {
      return "In Better-Fullstack, Workers runtime is currently supported only with Hono";
    }
  }

  // ============================================
  // RUNTIME CONSTRAINTS
  // ============================================
  if (category === "runtime") {
    if (optionId === "workers" && currentStack.backend !== "hono") {
      return "In Better-Fullstack, Workers runtime currently requires the Hono backend";
    }
    if (optionId === "none") {
      const allowedBackends = [
        "convex",
        "none",
        "self-next",
        "self-tanstack-start",
        "self-astro",
        "self-nuxt",
        "self-svelte",
        "self-solid-start",
      ];
      if (!allowedBackends.includes(currentStack.backend)) {
        return "Runtime 'None' only for Convex or fullstack backends";
      }
    }
  }

  // ============================================
  // DATABASE CONSTRAINTS
  // ============================================
  if (category === "database") {
    if (optionId === "mongodb" && currentStack.runtime === "workers") {
      return "In Better-Fullstack, MongoDB is currently not available with Workers runtime";
    }
    // Allow all databases when ORM is none - system will auto-select ORM
  }

  // ============================================
  // ORM CONSTRAINTS
  // ============================================
  if (category === "orm") {
    if (optionId === "mongoose") {
      if (currentStack.runtime === "workers") {
        return "Mongoose requires MongoDB, and Better-Fullstack currently doesn't support MongoDB with Workers runtime";
      }
      // Only block if a non-MongoDB database is EXPLICITLY selected
      if (currentStack.database !== "none" && currentStack.database !== "mongodb") {
        return "Mongoose only works with MongoDB";
      }
      // Allow when database is "none" - system will auto-select MongoDB
    }
    if (optionId === "drizzle" && currentStack.database === "mongodb") {
      return "Drizzle does not support MongoDB";
    }
    if (optionId === "none" && currentStack.database !== "none") {
      return "Database requires an ORM";
    }
  }

  // ============================================
  // DB SETUP CONSTRAINTS
  // ============================================
  if (category === "dbSetup" && optionId !== "none") {
    if (currentStack.database === "none") {
      return "Select a database first";
    }

    // Database-specific setups
    if (optionId === "turso" && currentStack.database !== "sqlite") {
      return "Turso requires SQLite";
    }
    if (optionId === "d1") {
      if (currentStack.database !== "sqlite") return "D1 requires SQLite";
      if (currentStack.runtime !== "workers") return "D1 requires Workers runtime";
    }
    if (optionId === "neon" && currentStack.database !== "postgres") {
      return "Neon requires PostgreSQL";
    }
    if (optionId === "supabase" && currentStack.database !== "postgres") {
      return "Supabase requires PostgreSQL";
    }
    if (optionId === "prisma-postgres" && currentStack.database !== "postgres") {
      return "Prisma Postgres requires PostgreSQL";
    }
    if (optionId === "mongodb-atlas" && currentStack.database !== "mongodb") {
      return "MongoDB Atlas requires MongoDB";
    }
    if (
      optionId === "planetscale" &&
      currentStack.database !== "postgres" &&
      currentStack.database !== "mysql"
    ) {
      return "PlanetScale requires PostgreSQL or MySQL";
    }
    if (optionId === "docker") {
      if (currentStack.database === "sqlite") return "SQLite doesn't need Docker";
      if (currentStack.runtime === "workers") return "Docker is incompatible with Workers";
    }
  }

  // ============================================
  // API CONSTRAINTS
  // ============================================
  if (category === "api" && optionId === "trpc") {
    const needsOrpc = currentStack.webFrontend.some((f) =>
      ["nuxt", "svelte", "solid", "solid-start"].includes(f),
    );
    if (needsOrpc) {
      const frontendName = currentStack.webFrontend.find((f) =>
        ["nuxt", "svelte", "solid", "solid-start"].includes(f),
      );
      return `${frontendName} requires oRPC, not tRPC`;
    }
    // Astro with non-React integration requires oRPC
    if (
      currentStack.webFrontend.includes("astro") &&
      currentStack.astroIntegration !== "react" &&
      currentStack.astroIntegration !== "none"
    ) {
      return `Astro with ${currentStack.astroIntegration} integration requires oRPC, not tRPC`;
    }
  }

  // ============================================
  // ASTRO INTEGRATION CONSTRAINTS
  // ============================================
  if (category === "astroIntegration") {
    if (!currentStack.webFrontend.includes("astro") && optionId !== "none") {
      return "Astro integration requires Astro frontend";
    }
    // tRPC requires React integration
    if (currentStack.api === "trpc" && optionId !== "react" && optionId !== "none") {
      return "tRPC requires React integration with Astro";
    }
  }

  // ============================================
  // AUTH CONSTRAINTS
  // ============================================
  if (category === "auth") {
    return getCapabilityDisabledReason(
      "auth",
      {
        ecosystem: currentStack.ecosystem,
        backend: currentStack.backend,
        webFrontend: currentStack.webFrontend,
        nativeFrontend: currentStack.nativeFrontend,
      },
      optionId as Auth,
    );
  }

  // ============================================
  // PAYMENTS CONSTRAINTS
  // ============================================
  if (category === "payments" && optionId === "polar") {
    if (currentStack.auth !== "better-auth") {
      return "Polar requires Better Auth";
    }
    if (!currentStack.webFrontend.some((f) => f !== "none")) {
      return "Polar requires a web frontend";
    }
  }

  // ============================================
  // EMAIL CONSTRAINTS
  // ============================================
  if (category === "email" && optionId !== "none") {
    if (currentStack.backend === "convex") {
      return "Email integration is not available with Convex backend";
    }
    if (currentStack.backend === "none") {
      return "Email integration requires a backend";
    }
  }

  // ============================================
  // AI CONSTRAINTS
  // ============================================
  if (category === "ai" && requiresChatSdkVercelAI(currentStack) && optionId !== "vercel-ai") {
    return "Chat SDK example (Nuxt/Hono profile) requires Vercel AI SDK in v1";
  }

  // ============================================
  // APP PLATFORMS CONSTRAINTS
  // ============================================
  if (category === "appPlatforms") {
    if (optionId === "pwa" && !hasPWACompatibleFrontend(currentStack.webFrontend)) {
      return "PWA requires TanStack Router, React Router, Solid, Next.js, or Astro";
    }
    if (optionId === "tauri" && !hasTauriCompatibleFrontend(currentStack.webFrontend)) {
      return "Tauri requires TanStack Router, React Router, Nuxt, Svelte, Solid, Next.js, or Astro";
    }
  }

  // ============================================
  // EXAMPLES CONSTRAINTS
  // ============================================
  if (category === "examples") {
    if (optionId === "ai") {
      if (
        currentStack.webFrontend.includes("solid") ||
        currentStack.webFrontend.includes("solid-start")
      ) {
        return "AI example not compatible with Solid frontend";
      }
      if (currentStack.backend === "convex") {
        const hasIncompatibleFrontend = currentStack.webFrontend.some((f) =>
          ["svelte", "nuxt"].includes(f),
        );
        if (hasIncompatibleFrontend) {
          const frontendName = currentStack.webFrontend.find((f) => ["svelte", "nuxt"].includes(f));
          return `Convex AI example only supports React-based frontends (not ${frontendName})`;
        }
      }
    }

    if (optionId === "chat-sdk") {
      if (currentStack.ecosystem !== "typescript") {
        return "Chat SDK example is currently available only for TypeScript stacks";
      }
      if (currentStack.backend === "convex") {
        return "Chat SDK example is not supported with Convex backend in v1";
      }
      if (
        currentStack.backend === "self-astro" ||
        currentStack.backend === "self-svelte" ||
        currentStack.backend === "self-solid-start"
      ) {
        return "Chat SDK self backend profile supports Next.js, TanStack Start, or Nuxt in v1";
      }
      if (currentStack.backend === "self-next" || currentStack.backend === "self-tanstack-start") {
        return null;
      }
      if (currentStack.backend === "self-nuxt") {
        return null;
      }
      if (currentStack.backend === "hono") {
        if (currentStack.runtime !== "node") {
          return "Chat SDK Hono profile requires Node runtime in v1";
        }
        return null;
      }
      if (currentStack.backend.startsWith("self-")) {
        return "Chat SDK self backend profile supports Next.js, TanStack Start, or Nuxt in v1";
      }
      if (currentStack.backend !== "none") {
        return "Chat SDK example is only supported for self (Next/TanStack Start/Nuxt) or Hono+Node in v1";
      }
    }
  }

  // ============================================
  // FRESH FRONTEND CONSTRAINTS
  // Fresh is Preact-based and incompatible with React-specific packages
  // ============================================
  const isFresh = currentStack.webFrontend.includes("fresh");

  // Forms: TanStack Form has no Preact adapter
  if (category === "forms" && optionId === "tanstack-form" && isFresh) {
    return "TanStack Form has no Preact adapter (Fresh uses Preact)";
  }

  // State Management: These all require React bindings
  if (category === "stateManagement" && isFresh) {
    if (optionId === "nanostores") {
      return "Nanostores requires @nanostores/react (no Preact support)";
    }
    if (optionId === "xstate") {
      return "XState requires @xstate/react (no Preact support)";
    }
    if (optionId === "tanstack-store") {
      return "TanStack Store requires @tanstack/react-store (no Preact support)";
    }
  }

  // Animation: Lottie uses lottie-react which requires React
  if (category === "animation" && optionId === "lottie" && isFresh) {
    return "Lottie uses lottie-react which requires React (not Preact)";
  }

  // ============================================
  // CSS FRAMEWORK CONSTRAINTS
  // ============================================
  if (category === "cssFramework") {
    // CSS frameworks only apply to web frontends
    if (!currentStack.webFrontend.some((f) => f !== "none")) {
      if (optionId !== "none") {
        return "CSS framework requires a web frontend";
      }
    }
    // Some UI libraries require Tailwind
    const requiresTailwind = ["shadcn-ui", "daisyui", "nextui"].includes(currentStack.uiLibrary);
    if (requiresTailwind && optionId !== "tailwind") {
      return `${currentStack.uiLibrary === "shadcn-ui" ? "shadcn/ui" : currentStack.uiLibrary === "daisyui" ? "daisyUI" : "NextUI"} requires Tailwind CSS`;
    }
  }

  // ============================================
  // UI LIBRARY CONSTRAINTS
  // ============================================
  if (category === "uiLibrary") {
    // UI libraries only apply to web frontends
    if (!currentStack.webFrontend.some((f) => f !== "none")) {
      if (optionId !== "none") {
        return "UI library requires a web frontend";
      }
    }

    // React-only UI libraries
    const reactOnlyLibraries = ["shadcn-ui", "radix-ui", "chakra-ui", "nextui"];
    const reactFrontends = ["tanstack-router", "react-router", "tanstack-start", "next"];

    if (reactOnlyLibraries.includes(optionId)) {
      const hasReactFrontend = currentStack.webFrontend.some((f) => reactFrontends.includes(f));
      // Astro with React integration also works
      const hasAstroReact =
        currentStack.webFrontend.includes("astro") && currentStack.astroIntegration === "react";
      if (!hasReactFrontend && !hasAstroReact) {
        const libraryName =
          optionId === "shadcn-ui"
            ? "shadcn/ui"
            : optionId === "radix-ui"
              ? "Radix UI"
              : optionId === "chakra-ui"
                ? "Chakra UI"
                : "NextUI";
        return `${libraryName} requires a React-based frontend`;
      }
    }

    // Headless UI works with React and Vue
    if (optionId === "headless-ui") {
      const hasReactFrontend = currentStack.webFrontend.some((f) => reactFrontends.includes(f));
      const hasVueFrontend = currentStack.webFrontend.includes("nuxt");
      const hasAstroReactOrVue =
        currentStack.webFrontend.includes("astro") &&
        ["react", "vue"].includes(currentStack.astroIntegration);
      if (!hasReactFrontend && !hasVueFrontend && !hasAstroReactOrVue) {
        return "Headless UI requires React or Vue frontend";
      }
    }

    // Park UI works with React, Vue, and Solid
    if (optionId === "park-ui") {
      const hasReactFrontend = currentStack.webFrontend.some((f) => reactFrontends.includes(f));
      const hasVueFrontend = currentStack.webFrontend.includes("nuxt");
      const hasSolidFrontend =
        currentStack.webFrontend.includes("solid") ||
        currentStack.webFrontend.includes("solid-start");
      const hasAstroCompatible =
        currentStack.webFrontend.includes("astro") &&
        ["react", "vue", "solid"].includes(currentStack.astroIntegration);
      if (!hasReactFrontend && !hasVueFrontend && !hasSolidFrontend && !hasAstroCompatible) {
        return "Park UI requires React, Vue, or Solid frontend";
      }
      // Park UI requires a CSS framework (not "none")
      if (currentStack.cssFramework === "none") {
        return "Park UI requires a CSS framework";
      }
    }

    // UI libraries requiring Tailwind
    if (["shadcn-ui", "daisyui", "nextui"].includes(optionId)) {
      if (currentStack.cssFramework !== "tailwind") {
        const libraryName =
          optionId === "shadcn-ui" ? "shadcn/ui" : optionId === "daisyui" ? "daisyUI" : "NextUI";
        return `${libraryName} requires Tailwind CSS`;
      }
    }
  }

  // ============================================
  // DEPLOYMENT CONSTRAINTS
  // ============================================
  if (category === "webDeploy" && optionId !== "none") {
    if (!currentStack.webFrontend.some((f) => f !== "none")) {
      return "Web deployment requires a web frontend";
    }
  }

  if (category === "serverDeploy") {
    if (optionId === "cloudflare") {
      if (currentStack.runtime !== "workers") {
        return "In Better-Fullstack, Cloudflare server deploy currently requires Workers runtime";
      }
      if (currentStack.backend !== "hono") {
        return "In Better-Fullstack, Cloudflare server deploy is currently supported only with Hono";
      }
    }
    if (optionId !== "none") {
      const noServerDeploy = [
        "none",
        "convex",
        "self-next",
        "self-tanstack-start",
        "self-astro",
        "self-nuxt",
        "self-svelte",
        "self-solid-start",
      ];
      if (noServerDeploy.includes(currentStack.backend)) {
        return "Server deployment not needed for this backend";
      }
    }
    if (optionId === "none" && currentStack.runtime === "workers") {
      return "Workers requires server deployment";
    }
  }

  return null;
};

export const isOptionCompatible = (
  currentStack: CompatibilityInput,
  category: CompatibilityCategory,
  optionId: string,
): boolean => {
  if (currentStack.yolo === "true") {
    return true;
  }
  return getDisabledReason(currentStack, category, optionId) === null;
};

const WEB_FRAMEWORKS: readonly Frontend[] = [
  "tanstack-router",
  "react-router",
  "tanstack-start",
  "next",
  "nuxt",
  "svelte",
  "solid",
  "solid-start",
  "astro",
  "qwik",
  "angular",
  "redwood",
  "fresh",
  "none",
] as const;

const UI_LIBRARY_COMPATIBILITY: Record<
  UILibrary,
  {
    frontends: readonly Frontend[];
    cssFrameworks: readonly CSSFramework[];
  }
> = {
  "shadcn-ui": {
    frontends: ["tanstack-router", "react-router", "tanstack-start", "next", "astro"],
    cssFrameworks: ["tailwind"],
  },
  daisyui: {
    frontends: [
      "tanstack-router",
      "react-router",
      "tanstack-start",
      "next",
      "nuxt",
      "svelte",
      "solid",
      "solid-start",
      "astro",
      "qwik",
      "angular",
      "redwood",
      "fresh",
    ],
    cssFrameworks: ["tailwind"],
  },
  "radix-ui": {
    frontends: ["tanstack-router", "react-router", "tanstack-start", "next", "astro"],
    cssFrameworks: ["tailwind", "scss", "less", "postcss-only", "none"],
  },
  "headless-ui": {
    frontends: ["tanstack-router", "react-router", "tanstack-start", "next", "nuxt", "astro"],
    cssFrameworks: ["tailwind", "scss", "less", "postcss-only", "none"],
  },
  "park-ui": {
    frontends: [
      "tanstack-router",
      "react-router",
      "tanstack-start",
      "next",
      "nuxt",
      "solid",
      "solid-start",
      "astro",
    ],
    cssFrameworks: ["tailwind", "scss", "less", "postcss-only"],
  },
  "chakra-ui": {
    frontends: ["tanstack-router", "react-router", "tanstack-start", "next", "astro"],
    cssFrameworks: ["tailwind", "scss", "less", "postcss-only", "none"],
  },
  nextui: {
    frontends: ["tanstack-router", "react-router", "tanstack-start", "next", "astro"],
    cssFrameworks: ["tailwind"],
  },
  mantine: {
    frontends: ["tanstack-router", "react-router", "tanstack-start", "next", "astro"],
    cssFrameworks: ["tailwind", "scss", "less", "postcss-only", "none"],
  },
  "base-ui": {
    frontends: ["tanstack-router", "react-router", "tanstack-start", "next", "astro"],
    cssFrameworks: ["tailwind", "scss", "less", "postcss-only", "none"],
  },
  "ark-ui": {
    frontends: [
      "tanstack-router",
      "react-router",
      "tanstack-start",
      "next",
      "nuxt",
      "svelte",
      "solid",
      "solid-start",
      "astro",
    ],
    cssFrameworks: ["tailwind", "scss", "less", "postcss-only", "none"],
  },
  "react-aria": {
    frontends: ["tanstack-router", "react-router", "tanstack-start", "next", "astro"],
    cssFrameworks: ["tailwind", "scss", "less", "postcss-only", "none"],
  },
  none: {
    frontends: WEB_FRAMEWORKS,
    cssFrameworks: ["tailwind", "scss", "less", "postcss-only", "none"],
  },
};

const ADDON_COMPATIBILITY: Record<Addons, readonly Frontend[]> = {
  pwa: [
    "tanstack-router",
    "react-router",
    "solid",
    "next",
    "astro",
    "qwik",
    "angular",
    "redwood",
    "fresh",
  ],
  tauri: [
    "tanstack-router",
    "react-router",
    "nuxt",
    "svelte",
    "solid",
    "next",
    "astro",
    "qwik",
    "angular",
    "redwood",
    "fresh",
  ],
  biome: [],
  husky: [],
  lefthook: [],
  turborepo: [],
  starlight: [],
  ultracite: [],
  ruler: [],
  mcp: [],
  skills: [],
  oxlint: [],
  fumadocs: [],
  opentui: [],
  wxt: [],
  msw: [],
  storybook: ["tanstack-router", "react-router", "next", "nuxt", "svelte", "solid"],
  none: [],
};

export function isWebFrontend(value: Frontend) {
  return WEB_FRAMEWORKS.includes(value);
}

export function splitFrontends(values: Frontend[] = []): {
  web: Frontend[];
  native: Frontend[];
} {
  const web = values.filter((f) => isWebFrontend(f));
  const native = values.filter(
    (f) => f === "native-bare" || f === "native-uniwind" || f === "native-unistyles",
  );
  return { web, native };
}

export function allowedApisForFrontends(
  frontends: Frontend[] = [],
  astroIntegration?: AstroIntegration,
) {
  const includesNuxt = frontends.includes("nuxt");
  const includesSvelte = frontends.includes("svelte");
  const includesSolid = frontends.includes("solid");
  const includesAstro = frontends.includes("astro");
  const includesQwik = frontends.includes("qwik");
  const includesAngular = frontends.includes("angular");
  const includesRedwood = frontends.includes("redwood");
  const includesFresh = frontends.includes("fresh");
  const base: API[] = ["trpc", "orpc", "ts-rest", "garph", "none"];

  if (includesQwik || includesAngular || includesRedwood || includesFresh) {
    return ["none"] as API[];
  }

  const includesSolidStartApi = frontends.includes("solid-start");
  if (includesNuxt || includesSvelte || includesSolid || includesSolidStartApi) {
    return ["orpc", "none"] as API[];
  }

  if (includesAstro && astroIntegration && astroIntegration !== "react") {
    return ["orpc", "none"] as API[];
  }

  return base;
}

export function isFrontendAllowedWithBackend(frontend: Frontend, backend?: Backend, auth?: string) {
  if (backend === "convex" && frontend === "solid") return false;
  if (backend === "convex" && frontend === "solid-start") return false;
  if (backend === "convex" && frontend === "astro") return false;
  if (backend === "convex" && frontend === "qwik") return false;
  if (backend === "convex" && frontend === "angular") return false;
  if (backend === "convex" && frontend === "redwood") return false;
  if (backend === "convex" && frontend === "fresh") return false;

  if (frontend === "qwik" && backend && backend !== "none") return false;
  if (frontend === "angular" && backend && backend !== "none") return false;
  if (frontend === "redwood" && backend && backend !== "none") return false;
  if (frontend === "fresh" && backend && backend !== "none") return false;

  if (auth && auth !== "none") {
    return (
      getCapabilityDisabledReason(
        "auth",
        {
          ecosystem: "typescript",
          backend,
          frontend: [frontend],
        },
        auth as Auth,
      ) === null
    );
  }

  return true;
}

export function isExampleAIAllowed(backend?: Backend, frontends: Frontend[] = []) {
  const includesSolid = frontends.includes("solid");
  const includesSolidStart = frontends.includes("solid-start");
  if (includesSolid || includesSolidStart) return false;

  if (backend === "convex") {
    const includesNuxt = frontends.includes("nuxt");
    const includesSvelte = frontends.includes("svelte");
    if (includesNuxt || includesSvelte) return false;
  }

  return true;
}

function hasExampleChatSdkSelfFrontend(frontends: Frontend[] = []) {
  return frontends.some((f) => ["next", "tanstack-start", "nuxt"].includes(f));
}

export function isExampleChatSdkAllowed(
  backend?: Backend | string,
  frontends: Frontend[] = [],
  runtime?: Runtime | string,
) {
  if (!backend || backend === "none" || backend === "convex") return false;

  if (backend === "self") {
    return hasExampleChatSdkSelfFrontend(frontends);
  }

  if (backend === "self-next" || backend === "self-tanstack-start" || backend === "self-nuxt") {
    return true;
  }

  if (backend === "self-astro" || backend === "self-svelte" || backend === "self-solid-start") {
    return false;
  }

  if (backend === "hono") {
    return runtime === "node";
  }

  return false;
}

export function requiresChatSdkVercelAIForSelection(
  backend?: Backend | string,
  frontends: Frontend[] = [],
  runtime?: Runtime | string,
) {
  if (backend === "self" && frontends.includes("nuxt")) return true;
  if (backend === "self-nuxt") return true;
  if (backend === "hono" && runtime === "node") return true;
  return false;
}

export function validateAddonCompatibility(
  addon: Addons,
  frontend: Frontend[],
  _auth?: Auth,
): { isCompatible: boolean; reason?: string } {
  const compatibleFrontends = ADDON_COMPATIBILITY[addon];

  if (compatibleFrontends.length > 0) {
    const hasCompatibleFrontend = frontend.some((f) =>
      (compatibleFrontends as readonly string[]).includes(f),
    );

    if (!hasCompatibleFrontend) {
      const frontendList = compatibleFrontends.join(", ");
      return {
        isCompatible: false,
        reason: `${addon} addon requires one of these frontends: ${frontendList}`,
      };
    }
  }

  return { isCompatible: true };
}

export function getCompatibleAddons(
  allAddons: Addons[],
  frontend: Frontend[],
  existingAddons: Addons[] = [],
  auth?: Auth,
) {
  return allAddons.filter((addon) => {
    if (existingAddons.includes(addon)) return false;
    if (addon === "none") return false;
    const { isCompatible } = validateAddonCompatibility(addon, frontend, auth);
    return isCompatible;
  });
}

export function getCompatibleUILibraries(
  frontends: Frontend[] = [],
  astroIntegration?: AstroIntegration,
): UILibrary[] {
  const { web } = splitFrontends(frontends);
  if (web.length === 0) return ["none"];

  const webFrontend = web[0];
  const allUILibraries = Object.keys(UI_LIBRARY_COMPATIBILITY) as UILibrary[];

  return allUILibraries.filter((lib) => {
    if (lib === "none") return true;

    const compatibility = UI_LIBRARY_COMPATIBILITY[lib];
    if (webFrontend === "astro") {
      if (astroIntegration === "react") {
        return compatibility.frontends.some((f) =>
          ["tanstack-router", "react-router", "tanstack-start", "next", "astro"].includes(f),
        );
      }
      return compatibility.frontends.some((f) =>
        ["nuxt", "svelte", "solid", "qwik", "angular"].includes(f),
      );
    }

    return compatibility.frontends.includes(webFrontend);
  });
}

export function getCompatibleCSSFrameworks(uiLibrary: UILibrary | undefined): CSSFramework[] {
  if (!uiLibrary || uiLibrary === "none") {
    return ["tailwind", "scss", "less", "postcss-only", "none"];
  }

  const compatibility = UI_LIBRARY_COMPATIBILITY[uiLibrary];
  return compatibility.cssFrameworks as CSSFramework[];
}

export function hasWebStyling(frontends: Frontend[] = []): boolean {
  const { web } = splitFrontends(frontends);
  return web.length > 0;
}

export function getCompatibleFormLibraries(frontends: Frontend[] = []): Forms[] {
  const hasSolid = frontends.includes("solid");
  const hasSolidStart = frontends.includes("solid-start");
  const hasQwik = frontends.includes("qwik");
  const hasFresh = frontends.includes("fresh");

  const all: Forms[] = [
    "tanstack-form",
    "react-hook-form",
    "formik",
    "final-form",
    "conform",
    "modular-forms",
    "none",
  ];

  if (hasFresh) {
    return all.filter((f) => f !== "tanstack-form" && f !== "react-hook-form" && f !== "formik");
  }

  if (hasSolid || hasSolidStart || hasQwik) {
    return all.filter((f) => f !== "react-hook-form" && f !== "formik" && f !== "final-form");
  }

  return all;
}

export function evaluateCompatibility(input: CompatibilityInput): CompatibilityEvaluation {
  const issues: CompatibilityIssue[] = [];

  const scalarChecks: Array<[CompatibilityCategory, string]> = [
    ["runtime", input.runtime],
    ["backend", input.backend],
    ["database", input.database],
    ["orm", input.orm],
    ["dbSetup", input.dbSetup],
    ["api", input.api],
    ["auth", input.auth],
    ["payments", input.payments],
    ["email", input.email],
    ["cssFramework", input.cssFramework],
    ["uiLibrary", input.uiLibrary],
    ["webDeploy", input.webDeploy],
    ["serverDeploy", input.serverDeploy],
    ["forms", input.forms],
    ["stateManagement", input.stateManagement],
    ["animation", input.animation],
    ["ai", input.aiSdk],
  ];

  for (const [category, optionId] of scalarChecks) {
    const reason = getDisabledReason(input, category, optionId);
    if (reason) {
      issues.push({
        code: `INCOMPATIBLE_${category.toUpperCase()}`,
        message: reason,
        category,
        optionId,
      });
    }
  }

  for (const frontend of input.webFrontend) {
    const reason = getDisabledReason(input, "webFrontend", frontend);
    if (reason) {
      issues.push({
        code: "INCOMPATIBLE_FRONTEND",
        message: reason,
        category: "webFrontend",
        optionId: frontend,
      });
    }
  }

  for (const addon of [...input.codeQuality, ...input.documentation, ...input.appPlatforms]) {
    const reason = getDisabledReason(input, "appPlatforms", addon);
    if (reason) {
      issues.push({
        code: "INCOMPATIBLE_ADDON",
        message: reason,
        category: "appPlatforms",
        optionId: addon,
      });
    }
  }

  return { issues };
}
