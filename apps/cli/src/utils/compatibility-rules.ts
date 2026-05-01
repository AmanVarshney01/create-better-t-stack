import { Result } from "better-result";

import { ADDON_COMPATIBILITY } from "../constants";
import type {
  Addons,
  API,
  Auth,
  Backend,
  CLIInput,
  Frontend,
  Payments,
  ProjectConfig,
  Runtime,
  ServerDeploy,
  WebDeploy,
} from "../types";
import { WEB_FRAMEWORKS } from "./compatibility";
import { ValidationError } from "./errors";

type ValidationResult = Result<void, ValidationError>;
type AddonCompatibilityConfig = Pick<ProjectConfig, "frontend" | "auth" | "backend" | "runtime">;

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

function validationErr(message: string): ValidationResult {
  return Result.err(new ValidationError({ message }));
}

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

export function ensureSingleWebAndNative(frontends: Frontend[]): ValidationResult {
  const { web, native } = splitFrontends(frontends);
  if (web.length > 1) {
    return validationErr(
      "Cannot select multiple web frameworks. Choose only one of: tanstack-router, tanstack-start, react-router, next, nuxt, svelte, solid, astro",
    );
  }
  if (native.length > 1) {
    return validationErr(
      "Cannot select multiple native frameworks. Choose only one of: native-bare, native-uniwind, native-unistyles",
    );
  }
  return Result.ok(undefined);
}

// Frontends that support backend="self" (fullstack mode with built-in server routes)
const FULLSTACK_FRONTENDS: readonly Frontend[] = [
  "next",
  "tanstack-start",
  "nuxt",
  "svelte",
  "astro",
] as const;

const EVLOG_SERVER_BACKENDS: readonly Backend[] = ["hono", "express", "fastify", "elysia"];
const EVLOG_FULLSTACK_FRONTENDS: readonly Frontend[] = FULLSTACK_FRONTENDS;

const evlogCompatibilityMessage =
  "evlog addon supports Hono, Express, Fastify, Elysia, or backend self with Next.js, TanStack Start, Nuxt, SvelteKit, or Astro. Convex and backend none are not supported yet.";

export function supportsEvlogAddon(
  frontend: Frontend[] = [],
  backend?: Backend,
  _runtime?: Runtime,
) {
  if (!backend) return true;

  if (EVLOG_SERVER_BACKENDS.includes(backend)) {
    return true;
  }

  if (backend === "self") {
    if (frontend.length === 0) return true;
    return frontend.some((f) => EVLOG_FULLSTACK_FRONTENDS.includes(f));
  }

  return false;
}

export function validateSelfBackendCompatibility(
  providedFlags: Set<string>,
  options: CLIInput,
  config: Partial<ProjectConfig>,
): ValidationResult {
  const backend = config.backend || options.backend;
  const frontends = config.frontend || options.frontend || [];

  if (backend === "self") {
    const { web, native } = splitFrontends(frontends);
    const hasSupportedWeb = web.length === 1 && FULLSTACK_FRONTENDS.includes(web[0]);

    if (!hasSupportedWeb) {
      return validationErr(
        "Backend 'self' (fullstack) currently only supports Next.js, TanStack Start, Nuxt, SvelteKit, and Astro frontends. Please use --frontend next, --frontend tanstack-start, --frontend nuxt, --frontend svelte, or --frontend astro.",
      );
    }

    if (native.length > 1) {
      return validationErr(
        "Cannot select multiple native frameworks. Choose only one of: native-bare, native-uniwind, native-unistyles",
      );
    }
  }

  const hasFullstackFrontend = frontends.some((f) => FULLSTACK_FRONTENDS.includes(f));
  if (providedFlags.has("backend") && !hasFullstackFrontend && backend === "self") {
    return validationErr(
      "Backend 'self' (fullstack) currently only supports Next.js, TanStack Start, Nuxt, SvelteKit, and Astro frontends. Please use --frontend next, --frontend tanstack-start, --frontend nuxt, --frontend svelte, --frontend astro, or choose a different backend.",
    );
  }

  return Result.ok(undefined);
}

export function validateWorkersCompatibility(
  providedFlags: Set<string>,
  options: CLIInput,
  config: Partial<ProjectConfig>,
): ValidationResult {
  if (
    providedFlags.has("runtime") &&
    options.runtime === "workers" &&
    config.backend &&
    config.backend !== "hono"
  ) {
    return validationErr(
      `Cloudflare Workers runtime (--runtime workers) is only supported with Hono backend (--backend hono). Current backend: ${config.backend}. Please use '--backend hono' or choose a different runtime.`,
    );
  }

  if (
    providedFlags.has("backend") &&
    config.backend &&
    config.backend !== "hono" &&
    config.runtime === "workers"
  ) {
    return validationErr(
      `Backend '${config.backend}' is not compatible with Cloudflare Workers runtime. Cloudflare Workers runtime is only supported with Hono backend. Please use '--backend hono' or choose a different runtime.`,
    );
  }

  if (
    providedFlags.has("runtime") &&
    options.runtime === "workers" &&
    config.database === "mongodb"
  ) {
    return validationErr(
      "Cloudflare Workers runtime (--runtime workers) is not compatible with MongoDB database. MongoDB requires Prisma or Mongoose ORM, but Workers runtime only supports Drizzle or Prisma ORM. Please use a different database or runtime.",
    );
  }

  if (
    providedFlags.has("database") &&
    config.database === "mongodb" &&
    config.runtime === "workers"
  ) {
    return validationErr(
      "MongoDB database is not compatible with Cloudflare Workers runtime. MongoDB requires Prisma or Mongoose ORM, but Workers runtime only supports Drizzle or Prisma ORM. Please use a different database or runtime.",
    );
  }

  return Result.ok(undefined);
}

export function validateApiFrontendCompatibility(
  api: API | undefined,
  frontends: Frontend[] = [],
): ValidationResult {
  const includesNuxt = frontends.includes("nuxt");
  const includesSvelte = frontends.includes("svelte");
  const includesSolid = frontends.includes("solid");
  const includesAstro = frontends.includes("astro");
  if ((includesNuxt || includesSvelte || includesSolid || includesAstro) && api === "trpc") {
    return validationErr(
      `tRPC API is not supported with '${includesNuxt ? "nuxt" : includesSvelte ? "svelte" : includesSolid ? "solid" : "astro"}' frontend. Please use --api orpc or --api none or remove '${includesNuxt ? "nuxt" : includesSvelte ? "svelte" : includesSolid ? "solid" : "astro"}' from --frontend.`,
    );
  }
  return Result.ok(undefined);
}

export function isFrontendAllowedWithBackend(
  frontend: Frontend,
  backend?: ProjectConfig["backend"],
  auth?: string,
) {
  if (backend === "convex") {
    if (
      auth === "better-auth" &&
      CONVEX_BETTER_AUTH_INCOMPATIBLE_FRONTENDS.includes(
        frontend as (typeof CONVEX_BETTER_AUTH_INCOMPATIBLE_FRONTENDS)[number],
      )
    ) {
      return false;
    }

    if (frontend === "solid" || frontend === "astro") return false;
  }

  if (auth === "clerk") {
    const incompatibleFrontends = ["nuxt", "svelte", "solid", "astro"];
    if (incompatibleFrontends.includes(frontend)) return false;
  }

  return true;
}

export function supportsConvexBetterAuth(frontends: readonly Frontend[] = []) {
  return frontends.some((frontend) =>
    CONVEX_BETTER_AUTH_SUPPORTED_FRONTENDS.includes(
      frontend as (typeof CONVEX_BETTER_AUTH_SUPPORTED_FRONTENDS)[number],
    ),
  );
}

export function allowedApisForFrontends(frontends: Frontend[] = []) {
  const includesNuxt = frontends.includes("nuxt");
  const includesSvelte = frontends.includes("svelte");
  const includesSolid = frontends.includes("solid");
  const includesAstro = frontends.includes("astro");
  const base: API[] = ["trpc", "orpc", "none"];
  if (includesNuxt || includesSvelte || includesSolid || includesAstro) {
    return ["orpc", "none"];
  }
  return base;
}

export function isExampleTodoAllowed(
  backend?: ProjectConfig["backend"],
  database?: ProjectConfig["database"],
  api?: API,
) {
  // Convex handles its own data layer, no need for database or API
  if (backend === "convex") return true;
  // Todo requires both database and API to communicate
  if (database === "none" || api === "none") return false;
  return true;
}

export function isExampleAIAllowed(backend?: ProjectConfig["backend"], frontends: Frontend[] = []) {
  const includesSolid = frontends.includes("solid");
  const includesAstro = frontends.includes("astro");
  if (includesSolid || includesAstro) return false;

  // Convex AI example only supports React-based frontends (not Svelte or Nuxt)
  if (backend === "convex") {
    const includesNuxt = frontends.includes("nuxt");
    const includesSvelte = frontends.includes("svelte");
    if (includesNuxt || includesSvelte) return false;
  }

  return true;
}

export function validateWebDeployRequiresWebFrontend(
  webDeploy: WebDeploy | undefined,
  hasWebFrontendFlag: boolean,
): ValidationResult {
  if (webDeploy && webDeploy !== "none" && !hasWebFrontendFlag) {
    return validationErr(
      "'--web-deploy' requires a web frontend. Please select a web frontend or set '--web-deploy none'.",
    );
  }
  return Result.ok(undefined);
}

export function validateServerDeployRequiresBackend(
  serverDeploy: ServerDeploy | undefined,
  backend: Backend | undefined,
): ValidationResult {
  if (serverDeploy && serverDeploy !== "none" && (!backend || backend === "none")) {
    return validationErr(
      "'--server-deploy' requires a backend. Please select a backend or set '--server-deploy none'.",
    );
  }
  return Result.ok(undefined);
}

export function validateAddonCompatibility(
  addon: Addons,
  frontend: Frontend[],
  _auth?: Auth,
  backend?: Backend,
  runtime?: Runtime,
): { isCompatible: boolean; reason?: string } {
  if (addon === "evlog" && !supportsEvlogAddon(frontend, backend, runtime)) {
    return {
      isCompatible: false,
      reason: evlogCompatibilityMessage,
    };
  }

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
  backend?: Backend,
  runtime?: Runtime,
) {
  return allAddons.filter((addon) => {
    if (existingAddons.includes(addon)) return false;

    if (addon === "none") return false;

    const { isCompatible } = validateAddonCompatibility(addon, frontend, auth, backend, runtime);
    return isCompatible;
  });
}

export function validateAddonsAgainstFrontends(
  addons: Addons[] = [],
  frontends: Frontend[] = [],
  auth?: Auth,
  backend?: Backend,
  runtime?: Runtime,
): ValidationResult {
  if (addons.includes("turborepo") && addons.includes("nx")) {
    return validationErr("Cannot combine 'turborepo' and 'nx' addons. Choose one monorepo tool.");
  }

  for (const addon of addons) {
    if (addon === "none") continue;
    const { isCompatible, reason } = validateAddonCompatibility(
      addon,
      frontends,
      auth,
      backend,
      runtime,
    );
    if (!isCompatible) {
      return validationErr(`Incompatible addon/frontend combination: ${reason}`);
    }
  }
  return Result.ok(undefined);
}

export function validateAddonsAgainstConfig(
  addons: Addons[] = [],
  config: Partial<AddonCompatibilityConfig>,
): ValidationResult {
  return validateAddonsAgainstFrontends(
    addons,
    config.frontend ?? [],
    config.auth,
    config.backend,
    config.runtime,
  );
}

export function validatePaymentsCompatibility(
  payments: Payments | undefined,
  auth: Auth | undefined,
  _backend: Backend | undefined,
  frontends: Frontend[] = [],
): ValidationResult {
  if (!payments || payments === "none") return Result.ok(undefined);

  if (payments === "polar") {
    if (!auth || auth === "none" || auth !== "better-auth") {
      return validationErr(
        "Polar payments requires Better Auth. Please use '--auth better-auth' or choose a different payments provider.",
      );
    }

    const { web } = splitFrontends(frontends);
    if (web.length === 0 && frontends.length > 0) {
      return validationErr(
        "Polar payments requires a web frontend or no frontend. Please select a web frontend or choose a different payments provider.",
      );
    }
  }

  return Result.ok(undefined);
}

export function validateExamplesCompatibility(
  examples: string[] | undefined,
  backend: ProjectConfig["backend"] | undefined,
  database: ProjectConfig["database"] | undefined,
  frontend?: Frontend[],
  api?: API,
): ValidationResult {
  const examplesArr = examples ?? [];
  if (examplesArr.length === 0 || examplesArr.includes("none")) return Result.ok(undefined);

  if (examplesArr.includes("todo") && backend !== "convex") {
    if (database === "none") {
      return validationErr(
        "The 'todo' example requires a database. Cannot use --examples todo when database is 'none'.",
      );
    }
    if (api === "none") {
      return validationErr(
        "The 'todo' example requires an API layer (tRPC or oRPC). Cannot use --examples todo when api is 'none'.",
      );
    }
  }

  if (examplesArr.includes("ai") && (frontend ?? []).includes("solid")) {
    return validationErr("The 'ai' example is not compatible with the Solid frontend.");
  }

  // Convex AI example only supports React-based frontends
  if (examplesArr.includes("ai") && backend === "convex") {
    const frontendArr = frontend ?? [];
    const includesNuxt = frontendArr.includes("nuxt");
    const includesSvelte = frontendArr.includes("svelte");
    if (includesNuxt || includesSvelte) {
      return validationErr(
        "The 'ai' example with Convex backend only supports React-based frontends (Next.js, TanStack Router, TanStack Start, React Router). Svelte and Nuxt are not supported with Convex AI.",
      );
    }
  }

  return Result.ok(undefined);
}
