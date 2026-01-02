import { DEFAULT_STACK, type StackState, type TECH_OPTIONS } from "@/lib/constant";
import { CATEGORY_ORDER } from "@/lib/stack-utils";

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
  webFrontend.some((f) => ["tanstack-router", "react-router", "solid", "next"].includes(f));

export const hasTauriCompatibleFrontend = (webFrontend: string[]) =>
  webFrontend.some((f) =>
    ["tanstack-router", "react-router", "nuxt", "svelte", "solid", "next"].includes(f),
  );

export const getCategoryDisplayName = (categoryKey: string): string => {
  const result = categoryKey.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
};

interface CompatibilityResult {
  adjustedStack: StackState | null;
  notes: Record<string, { notes: string[]; hasIssue: boolean }>;
  changes: Array<{ category: string; message: string }>;
}

/**
 * Analyzes the stack and auto-adjusts incompatible selections.
 * This follows the CLI approach: when you make a selection, dependent items adjust automatically.
 * The flow is: frontend -> backend -> runtime -> database -> orm -> api -> auth -> etc.
 */
export const analyzeStackCompatibility = (stack: StackState): CompatibilityResult => {
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
  const notes: CompatibilityResult["notes"] = {};
  const changes: Array<{ category: string; message: string }> = [];

  for (const cat of CATEGORY_ORDER) {
    notes[cat] = { notes: [], hasIssue: false };
  }

  // ============================================
  // BACKEND CONSTRAINTS
  // ============================================

  if (nextStack.backend === "convex") {
    // Convex handles its own runtime, database, orm, api, dbSetup
    const convexOverrides: Partial<StackState> = {
      runtime: "none",
      database: "none",
      orm: "none",
      api: "none",
      dbSetup: "none",
      serverDeploy: "none",
    };

    for (const [key, value] of Object.entries(convexOverrides)) {
      const catKey = key as keyof StackState;
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

    // Auth constraints for Convex
    if (nextStack.auth === "clerk") {
      const hasClerkCompatible =
        nextStack.webFrontend.some((f) =>
          ["tanstack-router", "react-router", "tanstack-start", "next"].includes(f),
        ) ||
        nextStack.nativeFrontend.some((f) =>
          ["native-bare", "native-uniwind", "native-unistyles"].includes(f),
        );
      if (!hasClerkCompatible) {
        nextStack.auth = "none";
        changed = true;
        changes.push({
          category: "auth",
          message: "Auth set to 'None' (Clerk requires compatible frontend)",
        });
      }
    }

    if (nextStack.auth === "better-auth") {
      const hasBetterAuthCompatible =
        nextStack.webFrontend.some((f) =>
          ["tanstack-router", "tanstack-start", "next"].includes(f),
        ) ||
        nextStack.nativeFrontend.some((f) =>
          ["native-bare", "native-uniwind", "native-unistyles"].includes(f),
        );
      if (!hasBetterAuthCompatible) {
        nextStack.auth = "none";
        changed = true;
        changes.push({
          category: "auth",
          message: "Auth set to 'None' (Better-Auth with Convex requires compatible frontend)",
        });
      }
    }
  }

  if (nextStack.backend === "none") {
    // No backend means no runtime, database, orm, api, auth, dbSetup, serverDeploy
    const noneOverrides: Partial<StackState> = {
      runtime: "none",
      database: "none",
      orm: "none",
      api: "none",
      auth: "none",
      dbSetup: "none",
      serverDeploy: "none",
      payments: "none",
    };

    for (const [key, value] of Object.entries(noneOverrides)) {
      const catKey = key as keyof StackState;
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
  if (nextStack.backend === "self-next" || nextStack.backend === "self-tanstack-start") {
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
      message: "Database changed to SQLite with D1 (MongoDB incompatible with Workers)",
    });
  }

  // Runtime "none" only for convex, self-next, self-tanstack-start
  if (
    nextStack.runtime === "none" &&
    nextStack.backend !== "convex" &&
    nextStack.backend !== "none" &&
    nextStack.backend !== "self-next" &&
    nextStack.backend !== "self-tanstack-start"
  ) {
    nextStack.runtime = DEFAULT_STACK.runtime;
    changed = true;
    changes.push({
      category: "runtime",
      message: `Runtime set to '${DEFAULT_STACK.runtime}' (required for this backend)`,
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
          message: "DB Setup set to 'D1' (Docker incompatible with Workers)",
        });
      }
    }
  }

  // ============================================
  // API CONSTRAINTS
  // ============================================

  if (nextStack.backend !== "convex" && nextStack.backend !== "none") {
    // Nuxt, Svelte, Solid require oRPC (not tRPC)
    const needsOrpc = nextStack.webFrontend.some((f) => ["nuxt", "svelte", "solid"].includes(f));
    if (needsOrpc && nextStack.api === "trpc") {
      nextStack.api = "orpc";
      changed = true;
      changes.push({ category: "api", message: "API set to 'oRPC' (required for this frontend)" });
    }
  }

  // ============================================
  // AUTH CONSTRAINTS
  // ============================================

  if (nextStack.auth === "clerk" && nextStack.backend !== "convex") {
    nextStack.auth = "none";
    changed = true;
    changes.push({
      category: "auth",
      message: "Auth set to 'None' (Clerk only works with Convex)",
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
  // ADDONS CONSTRAINTS
  // ============================================

  const pwaCompat = hasPWACompatibleFrontend(nextStack.webFrontend);
  const tauriCompat = hasTauriCompatibleFrontend(nextStack.webFrontend);

  if (!pwaCompat && nextStack.addons.includes("pwa")) {
    nextStack.addons = nextStack.addons.filter((a) => a !== "pwa");
    if (nextStack.addons.length === 0) nextStack.addons = ["none"];
    changed = true;
    changes.push({ category: "addons", message: "PWA removed (requires compatible frontend)" });
  }
  if (!tauriCompat && nextStack.addons.includes("tauri")) {
    nextStack.addons = nextStack.addons.filter((a) => a !== "tauri");
    if (nextStack.addons.length === 0) nextStack.addons = ["none"];
    changed = true;
    changes.push({ category: "addons", message: "Tauri removed (requires compatible frontend)" });
  }

  // ============================================
  // EXAMPLES CONSTRAINTS
  // ============================================

  // Todo example requires database AND API (unless Convex)
  if (nextStack.examples.includes("todo") && nextStack.backend !== "convex") {
    const needsRemoval = nextStack.database === "none" || nextStack.api === "none";
    if (needsRemoval) {
      const reason = nextStack.database === "none" ? "requires database" : "requires API layer";
      nextStack.examples = nextStack.examples.filter((e) => e !== "todo");
      if (nextStack.examples.length === 0) nextStack.examples = ["none"];
      changed = true;
      changes.push({ category: "examples", message: `Todo removed (${reason})` });
    }
  }

  // AI example constraints
  if (nextStack.examples.includes("ai")) {
    // Solid frontend is incompatible with AI example
    if (nextStack.webFrontend.includes("solid")) {
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
    ["none", "convex", "self-next", "self-tanstack-start"].includes(nextStack.backend)
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
  currentStack: StackState,
  category: keyof typeof TECH_OPTIONS,
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
    if (category === "auth" && optionId === "better-auth") {
      const compatible =
        currentStack.webFrontend.some((f) =>
          ["tanstack-router", "tanstack-start", "next"].includes(f),
        ) ||
        currentStack.nativeFrontend.some((f) =>
          ["native-bare", "native-uniwind", "native-unistyles"].includes(f),
        );
      if (!compatible) {
        return "Better-Auth with Convex requires TanStack Router, TanStack Start, Next.js, or React Native";
      }
    }
    if (category === "webFrontend" && optionId === "solid") {
      return "Solid is not compatible with Convex";
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
      return "Polar is not compatible with Convex";
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
    if (category === "auth" && optionId !== "none") {
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
    if (optionId === "convex" && currentStack.webFrontend.includes("solid")) {
      return "Convex is not compatible with Solid";
    }
    // Workers runtime only works with Hono backend
    if (currentStack.runtime === "workers" && optionId !== "hono" && optionId !== "none") {
      return "Workers runtime only works with Hono";
    }
  }

  // ============================================
  // RUNTIME CONSTRAINTS
  // ============================================
  if (category === "runtime") {
    if (optionId === "workers" && currentStack.backend !== "hono") {
      return "Workers requires Hono backend";
    }
    if (optionId === "none") {
      const allowedBackends = ["convex", "none", "self-next", "self-tanstack-start"];
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
      return "MongoDB is not compatible with Workers runtime";
    }
    // Allow all databases when ORM is none - system will auto-select ORM
  }

  // ============================================
  // ORM CONSTRAINTS
  // ============================================
  if (category === "orm") {
    if (optionId === "mongoose") {
      if (currentStack.runtime === "workers") {
        return "Mongoose requires MongoDB, which is incompatible with Workers";
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
    const needsOrpc = currentStack.webFrontend.some((f) => ["nuxt", "svelte", "solid"].includes(f));
    if (needsOrpc) {
      const frontendName = currentStack.webFrontend.find((f) =>
        ["nuxt", "svelte", "solid"].includes(f),
      );
      return `${frontendName} requires oRPC, not tRPC`;
    }
  }

  // ============================================
  // AUTH CONSTRAINTS
  // ============================================
  if (category === "auth") {
    if (optionId === "clerk") {
      if (currentStack.backend !== "convex") {
        return "Clerk only works with Convex backend";
      }
      const hasClerkCompatibleFrontend =
        currentStack.webFrontend.some((f) =>
          ["react-router", "tanstack-router", "tanstack-start", "next"].includes(f),
        ) ||
        currentStack.nativeFrontend.some((f) =>
          ["native-bare", "native-uniwind", "native-unistyles"].includes(f),
        );
      if (!hasClerkCompatibleFrontend) {
        return "Clerk with Convex requires React Router, TanStack Router, TanStack Start, Next.js, or React Native";
      }
    }
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
  // ADDONS CONSTRAINTS
  // ============================================
  if (category === "addons") {
    if (optionId === "pwa" && !hasPWACompatibleFrontend(currentStack.webFrontend)) {
      return "PWA requires TanStack Router, React Router, Solid, or Next.js";
    }
    if (optionId === "tauri" && !hasTauriCompatibleFrontend(currentStack.webFrontend)) {
      return "Tauri requires TanStack Router, React Router, Nuxt, Svelte, Solid, or Next.js";
    }
  }

  // ============================================
  // EXAMPLES CONSTRAINTS
  // ============================================
  if (category === "examples") {
    if (optionId === "todo" && currentStack.backend !== "convex") {
      if (currentStack.database === "none") {
        return "Todo example requires a database";
      }
      if (currentStack.api === "none") {
        return "Todo example requires an API layer (tRPC or oRPC)";
      }
    }
    if (optionId === "ai") {
      if (currentStack.webFrontend.includes("solid")) {
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
      if (currentStack.runtime !== "workers") return "Cloudflare requires Workers runtime";
      if (currentStack.backend !== "hono") return "Cloudflare requires Hono backend";
    }
    if (optionId !== "none") {
      const noServerDeploy = ["none", "convex", "self-next", "self-tanstack-start"];
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
  currentStack: StackState,
  category: keyof typeof TECH_OPTIONS,
  optionId: string,
): boolean => {
  if (currentStack.yolo === "true") {
    return true;
  }
  return getDisabledReason(currentStack, category, optionId) === null;
};
