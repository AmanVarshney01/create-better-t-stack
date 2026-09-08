import { desktopWebFrontends } from "./constants";
import type {
  Addons,
  API,
  Backend,
  Database,
  DatabaseSetup,
  Frontend,
  ORM,
  ProjectConfig,
  Runtime,
} from "./types";

export const TASK_RUNNER_ADDONS: readonly Addons[] = ["turborepo", "nx", "vite-plus"];
export const OBSERVABILITY_ADDONS: readonly Addons[] = ["evlog", "axiom"];
export const STATIC_DESKTOP_ADDONS: readonly Addons[] = ["tauri", "electrobun"];
const TAURI_STATIC_EXPORT_FRONTENDS: readonly Frontend[] = ["next", "tanstack-start"];

export const CONVEX_BETTER_AUTH_INCOMPATIBLE_FRONTENDS = [
  "nuxt",
  "svelte",
  "solid",
  "astro",
] as const;

export const CONVEX_BETTER_AUTH_SUPPORTED_FRONTENDS = [
  "tanstack-router",
  "react-router",
  "tanstack-start",
  "next",
  "native-bare",
  "native-uniwind",
  "native-unistyles",
] as const;

// Frontends that support backend="self" (fullstack mode with built-in server routes)
export const FULLSTACK_FRONTENDS: readonly Frontend[] = [
  "next",
  "tanstack-start",
  "nuxt",
  "svelte",
  "solid",
  "astro",
] as const;

export const SERVER_BACKENDS: readonly Backend[] = ["hono", "express", "fastify", "elysia"];
const EVLOG_FULLSTACK_FRONTENDS: readonly Frontend[] = [
  "next",
  "tanstack-start",
  "nuxt",
  "svelte",
  "astro",
];

export const CLERK_INCOMPATIBLE_FRONTENDS = CONVEX_BETTER_AUTH_INCOMPATIBLE_FRONTENDS;
export const CLERK_SUPPORTED_FRONTENDS = CONVEX_BETTER_AUTH_SUPPORTED_FRONTENDS;
export const TRPC_INCOMPATIBLE_FRONTENDS = ["nuxt", "svelte", "solid", "astro"] as const;
export const CONVEX_INCOMPATIBLE_FRONTENDS = ["solid", "astro"] as const;
export const AI_INCOMPATIBLE_FRONTENDS = ["solid", "astro"] as const;
export const CONVEX_AI_INCOMPATIBLE_FRONTENDS = ["solid", "astro", "svelte", "nuxt"] as const;
export const DESKTOP_STATIC_EXPORT_FRONTENDS: readonly Frontend[] = [
  "next",
  "svelte",
  "astro",
  "react-router",
];
const evlogCompatibilityMessage =
  "The observability addons support Hono, Express, Fastify, Elysia, or backend self with Next.js, TanStack Start, Nuxt, SvelteKit, or Astro. Convex and backend none are not supported yet.";

export const ADDON_COMPATIBILITY = {
  pwa: ["tanstack-router", "react-router", "solid", "next"],
  tauri: desktopWebFrontends,
  electrobun: desktopWebFrontends,
  biome: [],
  husky: [],
  lefthook: [],
  turborepo: [],
  nx: [],
  "vite-plus": [],
  starlight: [],
  ultracite: [],
  mcp: [],
  oxlint: [],
  fumadocs: [],
  opentui: [],
  wxt: [],
  skills: [],
  evlog: [],
  axiom: [],
  none: [],
} as const;

export function supportsEvlogAddon(
  frontend: readonly string[] = [],
  backend?: string,
  _runtime?: Runtime,
) {
  if (!backend) return true;

  if (SERVER_BACKENDS.some((value) => value === backend)) {
    return true;
  }

  if (backend === "self") {
    if (frontend.length === 0) return true;
    return frontend.some((f) => EVLOG_FULLSTACK_FRONTENDS.some((value) => value === f));
  }

  return false;
}

export function isFrontendAllowedWithBackend(frontend: string, backend?: string, auth?: string) {
  if (backend === "convex") {
    if (
      auth === "better-auth" &&
      CONVEX_BETTER_AUTH_INCOMPATIBLE_FRONTENDS.includes(
        frontend as (typeof CONVEX_BETTER_AUTH_INCOMPATIBLE_FRONTENDS)[number],
      )
    ) {
      return false;
    }

    if (CONVEX_INCOMPATIBLE_FRONTENDS.some((value) => value === frontend)) return false;
  }

  if (auth === "clerk") {
    const incompatibleFrontends = CLERK_INCOMPATIBLE_FRONTENDS;
    if (incompatibleFrontends.some((value) => value === frontend)) return false;
  }

  return true;
}

export function supportsConvexBetterAuth(frontends: readonly string[] = []) {
  return frontends.some((frontend) =>
    CONVEX_BETTER_AUTH_SUPPORTED_FRONTENDS.includes(
      frontend as (typeof CONVEX_BETTER_AUTH_SUPPORTED_FRONTENDS)[number],
    ),
  );
}

export function allowedApisForFrontends(frontends: readonly string[] = []): API[] {
  return frontends.some((frontend) =>
    TRPC_INCOMPATIBLE_FRONTENDS.some((value) => value === frontend),
  )
    ? ["orpc", "none"]
    : ["trpc", "orpc", "none"];
}

export function isExampleTodoAllowed(backend?: string, database?: string, api?: string) {
  // Convex handles its own data layer, no need for database or API
  if (backend === "convex") return true;
  // Todo requires both database and API to communicate
  if (database === "none" || api === "none") return false;
  return true;
}

export function isExampleAIAllowed(backend?: string, frontends: readonly string[] = []) {
  return (
    backend !== "none" &&
    !frontends.some(
      (frontend) =>
        AI_INCOMPATIBLE_FRONTENDS.some((value) => value === frontend) ||
        (backend === "convex" &&
          CONVEX_AI_INCOMPATIBLE_FRONTENDS.some((value) => value === frontend)),
    )
  );
}

export const PRISMA_COMPUTE_WEB_FRONTENDS: readonly Frontend[] = [
  "next",
  "nuxt",
  "astro",
  "react-router",
  "tanstack-start",
  "svelte",
  "solid",
];

export function supportsPrismaWebDeploy(frontend: readonly string[]): boolean {
  return frontend.some((value) =>
    PRISMA_COMPUTE_WEB_FRONTENDS.some((frontend) => frontend === value),
  );
}

export interface AddonCompatibility {
  isCompatible: boolean;
  reason?: string;
}

export function validateAddonCompatibility(
  addon: string,
  frontend: readonly string[],
  auth?: string,
  backend?: string,
  runtime?: Runtime,
): AddonCompatibility {
  if (
    OBSERVABILITY_ADDONS.some((value) => value === addon) &&
    !supportsEvlogAddon(frontend, backend, runtime)
  ) {
    return {
      isCompatible: false,
      reason: evlogCompatibilityMessage,
    };
  }

  if (
    STATIC_DESKTOP_ADDONS.some((value) => value === addon) &&
    auth === "clerk" &&
    frontend.includes("react-router")
  ) {
    return {
      isCompatible: false,
      reason: `${addon} addon forces React Router into a static export, but Clerk on React Router requires SSR middleware. Remove the addon or use a different auth/frontend.`,
    };
  }

  if (backend === "self" && STATIC_DESKTOP_ADDONS.some((value) => value === addon)) {
    return {
      isCompatible: false,
      reason: `${addon} addon requires a separate backend or no backend because backend 'self' emits server routes that cannot be bundled as static desktop assets.`,
    };
  }

  if (addon === "tauri" && isTauriBlockedByConvexBetterAuth(frontend, backend, auth)) {
    return {
      isCompatible: false,
      reason:
        "tauri addon is not compatible with Convex Better Auth on Next.js or TanStack Start because those templates use server auth bootstrap and cannot be exported as static desktop assets.",
    };
  }

  if (!Object.hasOwn(ADDON_COMPATIBILITY, addon))
    return { isCompatible: false, reason: `Unknown addon: ${addon}` };
  const compatibleFrontends = ADDON_COMPATIBILITY[addon as Addons];

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

export function supportsClerkFrontend(frontends: readonly string[]) {
  return frontends.every(
    (frontend) =>
      frontend === "none" || CLERK_SUPPORTED_FRONTENDS.some((value) => value === frontend),
  );
}

export function supportsClerkBackend(
  backend: string | undefined,
  frontends: readonly string[] = [],
) {
  if (!backend) return true;
  if (backend === "self")
    return (
      frontends.length === 0 ||
      frontends.some((frontend) => frontend === "next" || frontend === "tanstack-start")
    );
  return backend === "convex" || SERVER_BACKENDS.some((value) => value === backend);
}

export function isTauriBlockedByConvexBetterAuth(
  frontends: readonly string[],
  backend?: string,
  auth?: string,
) {
  return (
    backend === "convex" &&
    auth === "better-auth" &&
    frontends.some((frontend) => TAURI_STATIC_EXPORT_FRONTENDS.some((value) => value === frontend))
  );
}

export function hasCloudflareNextPostgresConflict(config: {
  webDeploy?: string;
  frontend?: readonly string[];
  database?: string;
  orm?: string;
  dbSetup?: string;
}) {
  return (
    config.webDeploy === "cloudflare" &&
    !!config.frontend?.includes("next") &&
    config.database === "postgres" &&
    config.orm === "prisma" &&
    config.dbSetup !== "neon" &&
    config.dbSetup !== "prisma-postgres"
  );
}

export function getDesktopDeployConflict(
  deploy: string | undefined,
  addons: readonly string[] = [],
  frontends: readonly string[] = [],
  backend?: string,
  auth?: string,
) {
  if (deploy !== "docker" && deploy !== "prisma") return null;
  const selectedDesktopAddons = addons.filter((addon) =>
    STATIC_DESKTOP_ADDONS.some((value) => value === addon),
  );
  const affectedFrontend = frontends.find((frontend) =>
    DESKTOP_STATIC_EXPORT_FRONTENDS.some((value) => value === frontend),
  );
  if (!selectedDesktopAddons.length || !affectedFrontend) return null;
  // Electrobun retains Next.js standalone output for Convex's server auth bootstrap.
  if (
    deploy === "docker" &&
    affectedFrontend === "next" &&
    !selectedDesktopAddons.includes("tauri") &&
    backend === "convex" &&
    auth === "better-auth"
  )
    return null;
  return { affectedFrontend, selectedDesktopAddons };
}

const ORM_DATABASES = {
  none: ["none"],
  drizzle: ["sqlite", "postgres", "mysql"],
  prisma: ["sqlite", "postgres", "mysql", "mongodb"],
  mongoose: ["mongodb"],
} as const satisfies Record<ORM, readonly Database[]>;

export function supportsOrmDatabase(orm: string, database: string) {
  return Object.entries(ORM_DATABASES).some(
    ([candidate, databases]) => candidate === orm && databases.some((value) => value === database),
  );
}

const DATABASE_SETUP_DATABASES = {
  turso: ["sqlite"],
  d1: ["sqlite"],
  neon: ["postgres"],
  supabase: ["postgres"],
  "prisma-postgres": ["postgres"],
  planetscale: ["postgres", "mysql"],
  "mongodb-atlas": ["mongodb"],
  docker: ["postgres", "mysql", "mongodb"],
} as const satisfies Record<Exclude<DatabaseSetup, "none">, readonly Database[]>;

export function supportsDatabaseSetup(dbSetup: string, database: string | undefined) {
  return (
    dbSetup === "none" ||
    (!!database && getDatabaseSetupDatabases(dbSetup).some((value) => value === database))
  );
}

export function supportsRuntimeBackend(runtime: string | undefined, backend: string | undefined) {
  if (!runtime || !backend) return true;
  if (getBackendDisabledOptions(backend).some((key) => key === "runtime"))
    return runtime === "none";
  return runtime !== "none" && (runtime !== "workers" || backend === "hono");
}

export function supportsRuntimeDatabase(runtime: string | undefined, database: string | undefined) {
  return runtime !== "workers" || database !== "mongodb";
}

export function supportsDatabaseSetupRuntime(dbSetup: string, runtime?: string, backend?: string) {
  if (dbSetup === "docker") return runtime !== "workers";
  if (dbSetup === "d1") return runtime === "workers" || backend === "self";
  return true;
}

export function supportsServerDeployRuntime(
  deploy: string | undefined,
  runtime: string | undefined,
) {
  if (!deploy) return true;
  if (deploy === "none") return runtime !== "workers";
  if (deploy === "cloudflare") return runtime === "workers";
  return runtime === "bun" || runtime === "node";
}

export function supportsPaymentsAuth(payments?: string, auth?: string) {
  return payments !== "polar" || auth === "better-auth";
}

const BACKEND_DISABLED_OPTIONS = {
  convex: ["runtime", "database", "orm", "api", "dbSetup", "serverDeploy"],
  none: ["runtime", "database", "orm", "api", "auth", "payments", "dbSetup", "serverDeploy"],
  self: ["runtime", "serverDeploy"],
} as const satisfies Partial<Record<Backend, readonly (keyof ProjectConfig)[]>>;

export function getBackendDisabledOptions(backend: string) {
  return (
    Object.entries(BACKEND_DISABLED_OPTIONS).find(([candidate]) => candidate === backend)?.[1] ?? []
  );
}

export function getDatabaseSetupDatabases(dbSetup: string) {
  return (
    Object.entries(DATABASE_SETUP_DATABASES).find(([candidate]) => candidate === dbSetup)?.[1] ?? []
  );
}
