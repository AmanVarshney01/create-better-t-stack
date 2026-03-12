import {
  allowedApisForFrontends as allowedApisForFrontendsShared,
  getCompatibleAddons as getCompatibleAddonsShared,
  getCompatibleCSSFrameworks as getCompatibleCSSFrameworksShared,
  getCompatibleFormLibraries as getCompatibleFormLibrariesShared,
  getCompatibleUILibraries as getCompatibleUILibrariesShared,
  hasWebStyling as hasWebStylingShared,
  isExampleAIAllowed as isExampleAIAllowedShared,
  isExampleChatSdkAllowed as isExampleChatSdkAllowedShared,
  isFrontendAllowedWithBackend as isFrontendAllowedWithBackendShared,
  isWebFrontend as isWebFrontendShared,
  requiresChatSdkVercelAIForSelection,
  splitFrontends as splitFrontendsShared,
  validateAddonCompatibility as validateAddonCompatibilityShared,
} from "@better-fullstack/types";

import type {
  AI,
  Addons,
  API,
  AstroIntegration,
  Auth,
  Backend,
  CLIInput,
  CSSFramework,
  Forms,
  Frontend,
  Payments,
  ProjectConfig,
  Runtime,
  ServerDeploy,
  UILibrary,
  WebDeploy,
} from "../types";

import { incompatibilityError, invalidSelectionError } from "./error-formatter";
import { exitWithError } from "./errors";

export function isWebFrontend(value: Frontend) {
  return isWebFrontendShared(value);
}

export function splitFrontends(values: Frontend[] = []): {
  web: Frontend[];
  native: Frontend[];
} {
  return splitFrontendsShared(values);
}

export function ensureSingleWebAndNative(frontends: Frontend[]) {
  const { web, native } = splitFrontends(frontends);
  if (web.length > 1) {
    invalidSelectionError({
      message: "Only one web framework can be selected per project.",
      provided: { frontend: web },
      suggestions: [
        "Keep one web framework and remove the others",
        "Use separate projects for multiple web frameworks",
      ],
    });
  }
  if (native.length > 1) {
    invalidSelectionError({
      message: "Only one native framework can be selected per project.",
      provided: { frontend: native },
      suggestions: [
        "Keep one native framework and remove the others",
        "Choose: native-bare, native-uniwind, or native-unistyles",
      ],
    });
  }
}

// Frontends with built-in server capabilities for backend="self"
const FULLSTACK_FRONTENDS: readonly Frontend[] = [
  "next",
  "tanstack-start",
  "astro",
  "nuxt",
  "svelte",
  "solid-start",
] as const;

export function validateSelfBackendCompatibility(
  providedFlags: Set<string>,
  options: CLIInput,
  config: Partial<ProjectConfig>,
) {
  const backend = config.backend || options.backend;
  const frontends = config.frontend || options.frontend || [];

  if (backend === "self") {
    const { web, native } = splitFrontends(frontends);
    const hasSupportedWeb = web.length === 1 && FULLSTACK_FRONTENDS.includes(web[0]);

    if (!hasSupportedWeb) {
      exitWithError(
        "Backend 'self' (fullstack) only supports Next.js, TanStack Start, Astro, Nuxt, SvelteKit, or SolidStart frontends. Please use --frontend next, --frontend tanstack-start, --frontend astro, --frontend nuxt, --frontend svelte, or --frontend solid-start.",
      );
    }

    if (native.length > 1) {
      exitWithError(
        "Cannot select multiple native frameworks. Choose only one of: native-bare, native-uniwind, native-unistyles",
      );
    }
  }

  const hasFullstackFrontend = frontends.some((f) => FULLSTACK_FRONTENDS.includes(f));
  if (providedFlags.has("backend") && !hasFullstackFrontend && backend === "self") {
    exitWithError(
      "Backend 'self' (fullstack) only supports Next.js, TanStack Start, Astro, Nuxt, SvelteKit, or SolidStart frontends. Please use --frontend next, --frontend tanstack-start, --frontend astro, --frontend nuxt, --frontend svelte, --frontend solid-start, or choose a different backend.",
    );
  }
}

// Backends that support Cloudflare Workers runtime
const WORKERS_COMPATIBLE_BACKENDS: readonly Backend[] = ["hono", "nitro", "fets"] as const;

export function validateWorkersCompatibility(
  providedFlags: Set<string>,
  options: CLIInput,
  config: Partial<ProjectConfig>,
) {
  if (
    providedFlags.has("runtime") &&
    options.runtime === "workers" &&
    config.backend &&
    !WORKERS_COMPATIBLE_BACKENDS.includes(config.backend)
  ) {
    incompatibilityError({
      message:
        "In Better-Fullstack, Cloudflare Workers runtime is currently supported only with compatible backends (Hono, Nitro, or Fets).",
      provided: { runtime: "workers", backend: config.backend },
      suggestions: [
        "Use --backend hono",
        "Use --backend nitro",
        "Use --backend fets",
        "Choose a different runtime (node, bun)",
      ],
    });
  }

  if (
    providedFlags.has("backend") &&
    config.backend &&
    !WORKERS_COMPATIBLE_BACKENDS.includes(config.backend) &&
    config.runtime === "workers"
  ) {
    incompatibilityError({
      message: `In Better-Fullstack, backend '${config.backend}' is currently not available with Cloudflare Workers runtime.`,
      provided: { backend: config.backend, runtime: "workers" },
      suggestions: [
        "Use --backend hono, --backend nitro, or --backend fets",
        "Choose a different runtime (node, bun)",
      ],
    });
  }

  if (
    providedFlags.has("runtime") &&
    options.runtime === "workers" &&
    config.database === "mongodb"
  ) {
    incompatibilityError({
      message:
        "In Better-Fullstack, Cloudflare Workers runtime is currently not available with MongoDB.",
      provided: { runtime: "workers", database: "mongodb" },
      suggestions: [
        "Use a different database (postgres, sqlite, mysql)",
        "Choose a different runtime (node, bun)",
      ],
    });
  }

  if (
    providedFlags.has("runtime") &&
    options.runtime === "workers" &&
    config.dbSetup === "docker"
  ) {
    incompatibilityError({
      message:
        "In Better-Fullstack, Cloudflare Workers runtime is currently not available with Docker database setup.",
      provided: { runtime: "workers", "db-setup": "docker" },
      suggestions: ["Use --db-setup d1 for SQLite", "Choose a different runtime (node, bun)"],
    });
  }

  if (
    providedFlags.has("database") &&
    config.database === "mongodb" &&
    config.runtime === "workers"
  ) {
    incompatibilityError({
      message:
        "In Better-Fullstack, MongoDB is currently not available with Cloudflare Workers runtime.",
      provided: { database: "mongodb", runtime: "workers" },
      suggestions: [
        "Use a different database (postgres, sqlite, mysql)",
        "Choose a different runtime (node, bun)",
      ],
    });
  }
}

export function validateApiFrontendCompatibility(
  api: API | undefined,
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

  const includesSolidStart = frontends.includes("solid-start");

  // ts-rest and garph require React like tRPC
  if (
    (includesNuxt || includesSvelte || includesSolid || includesSolidStart) &&
    (api === "trpc" || api === "ts-rest" || api === "garph")
  ) {
    const apiName = api === "trpc" ? "tRPC" : api === "ts-rest" ? "ts-rest" : "garph";
    const incompatibleFrontend = includesNuxt
      ? "nuxt"
      : includesSvelte
        ? "svelte"
        : includesSolid
          ? "solid"
          : "solid-start";
    incompatibilityError({
      message: `${apiName} API requires React-based frontends.`,
      provided: { api, frontend: incompatibleFrontend },
      suggestions: [
        "Use --api orpc (works with all frontends)",
        "Use --api none",
        "Choose next, react-router, react-vite, or tanstack-start",
      ],
    });
  }

  // Qwik has its own server-side capabilities, doesn't support traditional API layer
  if (includesQwik && api && api !== "none") {
    incompatibilityError({
      message: "Qwik has built-in server capabilities and doesn't support external APIs.",
      provided: { api, frontend: "qwik" },
      suggestions: ["Use --api none with Qwik"],
    });
  }

  // Angular has its own HttpClient and doesn't support external API layers
  if (includesAngular && api && api !== "none") {
    incompatibilityError({
      message: "Angular has built-in HttpClient and doesn't support external APIs.",
      provided: { api, frontend: "angular" },
      suggestions: ["Use --api none with Angular"],
    });
  }

  // RedwoodJS has its own built-in GraphQL API and doesn't support external API layers
  if (includesRedwood && api && api !== "none") {
    incompatibilityError({
      message: "RedwoodJS has built-in GraphQL API and doesn't support external APIs.",
      provided: { api, frontend: "redwood" },
      suggestions: ["Use --api none with RedwoodJS"],
    });
  }

  // Fresh (Deno) has its own built-in server capabilities and doesn't support external API layers
  if (includesFresh && api && api !== "none") {
    incompatibilityError({
      message: "Fresh has built-in server capabilities and doesn't support external APIs.",
      provided: { api, frontend: "fresh" },
      suggestions: ["Use --api none with Fresh"],
    });
  }

  // Astro with non-React integrations doesn't support tRPC, ts-rest, or garph
  if (
    includesAstro &&
    astroIntegration &&
    astroIntegration !== "react" &&
    (api === "trpc" || api === "ts-rest" || api === "garph")
  ) {
    const apiName = api === "trpc" ? "tRPC" : api === "ts-rest" ? "ts-rest" : "garph";
    incompatibilityError({
      message: `${apiName} API requires React integration with Astro.`,
      provided: { api, "astro-integration": astroIntegration },
      suggestions: [
        "Use --api orpc (works with all Astro integrations)",
        "Use --api none",
        "Use --astro-integration react",
      ],
    });
  }
}

export function isFrontendAllowedWithBackend(
  frontend: Frontend,
  backend?: ProjectConfig["backend"],
  auth?: string,
) {
  return isFrontendAllowedWithBackendShared(frontend, backend, auth);
}

export function validateClerkCompatibility(
  auth: Auth | undefined,
  backend: Backend | undefined,
  frontends: Frontend[] = [],
) {
  if (auth !== "clerk") return;

  if (backend === "convex") {
    const incompatibleFrontends = frontends.filter((f) =>
      ["nuxt", "svelte", "solid", "solid-start"].includes(f),
    );
    if (incompatibleFrontends.length > 0) {
      exitWithError(
        `In Better-Fullstack, Clerk + Convex is not compatible with the following frontends: ${incompatibleFrontends.join(
          ", ",
        )}. Please choose a different frontend or auth provider.`,
      );
    }
    return;
  }

  if (backend === "self") {
    const hasNative = frontends.some((f) =>
      ["native-bare", "native-uniwind", "native-unistyles"].includes(f),
    );
    if (hasNative) {
      exitWithError(
        "In Better-Fullstack, Clerk with the 'self' backend is currently supported only for web-only Next.js or TanStack Start projects (no native companion app). Please remove the native frontend or choose a different auth provider.",
      );
    }

    const hasNextJs = frontends.includes("next");
    const hasTanStackStart = frontends.includes("tanstack-start");

    if (!hasNextJs && !hasTanStackStart) {
      if (frontends.includes("astro")) {
        exitWithError(
          "In Better-Fullstack, Clerk is not yet supported for Astro fullstack projects. Please use '--frontend next' or '--frontend tanstack-start' with '--backend self', or choose a different auth provider.",
        );
      }
      if (frontends.includes("nuxt")) {
        exitWithError(
          "In Better-Fullstack, Clerk is not yet supported for Nuxt fullstack projects. Please use '--frontend next' or '--frontend tanstack-start' with '--backend self', or choose a different auth provider.",
        );
      }
      if (frontends.includes("svelte")) {
        exitWithError(
          "In Better-Fullstack, Clerk is not yet supported for SvelteKit fullstack projects. Please use '--frontend next' or '--frontend tanstack-start' with '--backend self', or choose a different auth provider.",
        );
      }
      if (frontends.includes("solid-start")) {
        exitWithError(
          "In Better-Fullstack, Clerk is not yet supported for SolidStart fullstack projects. Please use '--frontend next' or '--frontend tanstack-start' with '--backend self', or choose a different auth provider.",
        );
      }
      exitWithError(
        "In Better-Fullstack, Clerk with the 'self' backend currently requires the Next.js or TanStack Start frontend. Please use '--frontend next' or '--frontend tanstack-start', or choose a different auth provider.",
      );
    }

    return;
  }

  exitWithError(
    "In Better-Fullstack, Clerk authentication is currently supported with the Convex backend, or with the 'self' backend when using Next.js or TanStack Start. Please choose a supported backend/frontend combination or a different auth provider.",
  );
}

export function validateNextAuthCompatibility(
  auth: Auth | undefined,
  backend: Backend | undefined,
  frontends: Frontend[] = [],
) {
  if (auth !== "nextauth") return;

  const hasNextJs = frontends.includes("next");

  if (backend !== "self") {
    exitWithError(
      "In Better-Fullstack, Auth.js (NextAuth) is currently supported only with the 'self' backend (fullstack Next.js). Please use '--backend self' or choose a different auth provider.",
    );
  }

  if (!hasNextJs) {
    exitWithError(
      "In Better-Fullstack, Auth.js (NextAuth) currently requires the Next.js frontend. Please use '--frontend next' or choose a different auth provider.",
    );
  }
}

export function validateStackAuthCompatibility(
  auth: Auth | undefined,
  backend: Backend | undefined,
  frontends: Frontend[] = [],
) {
  if (auth !== "stack-auth") return;

  const hasNextJs = frontends.includes("next");

  if (backend !== "self") {
    exitWithError(
      "In Better-Fullstack, Stack Auth is currently supported only with the 'self' backend (fullstack Next.js). Please use '--backend self' or choose a different auth provider.",
    );
  }

  if (!hasNextJs) {
    exitWithError(
      "In Better-Fullstack, Stack Auth currently requires the Next.js frontend. Please use '--frontend next' or choose a different auth provider.",
    );
  }
}

export function validateSupabaseAuthCompatibility(
  auth: Auth | undefined,
  backend: Backend | undefined,
  frontends: Frontend[] = [],
) {
  if (auth !== "supabase-auth") return;

  const hasNextJs = frontends.includes("next");

  if (backend !== "self") {
    exitWithError(
      "In Better-Fullstack, Supabase Auth is currently supported only with the 'self' backend (fullstack Next.js). Please use '--backend self' or choose a different auth provider.",
    );
  }

  if (!hasNextJs) {
    exitWithError(
      "In Better-Fullstack, Supabase Auth currently requires the Next.js frontend. Please use '--frontend next' or choose a different auth provider.",
    );
  }
}

export function validateAuth0Compatibility(
  auth: Auth | undefined,
  backend: Backend | undefined,
  frontends: Frontend[] = [],
) {
  if (auth !== "auth0") return;

  const hasNextJs = frontends.includes("next");

  if (backend !== "self") {
    exitWithError(
      "In Better-Fullstack, Auth0 is currently supported only with the 'self' backend (fullstack Next.js). Please use '--backend self' or choose a different auth provider.",
    );
  }

  if (!hasNextJs) {
    exitWithError(
      "In Better-Fullstack, Auth0 currently requires the Next.js frontend. Please use '--frontend next' or choose a different auth provider.",
    );
  }
}

export function allowedApisForFrontends(
  frontends: Frontend[] = [],
  astroIntegration?: AstroIntegration,
) {
  return allowedApisForFrontendsShared(frontends, astroIntegration);
}

export function isExampleAIAllowed(backend?: ProjectConfig["backend"], frontends: Frontend[] = []) {
  return isExampleAIAllowedShared(backend, frontends);
}

export function isExampleChatSdkAllowed(
  backend?: ProjectConfig["backend"],
  frontends: Frontend[] = [],
  runtime?: Runtime,
) {
  return isExampleChatSdkAllowedShared(backend, frontends, runtime);
}

export function requiresChatSdkVercelAI(
  backend?: ProjectConfig["backend"],
  frontends: Frontend[] = [],
  runtime?: Runtime,
) {
  return requiresChatSdkVercelAIForSelection(backend, frontends, runtime);
}

export function validateWebDeployRequiresWebFrontend(
  webDeploy: WebDeploy | undefined,
  hasWebFrontendFlag: boolean,
) {
  if (webDeploy && webDeploy !== "none" && !hasWebFrontendFlag) {
    exitWithError(
      "'--web-deploy' requires a web frontend. Please select a web frontend or set '--web-deploy none'.",
    );
  }
}

export function validateServerDeployRequiresBackend(
  serverDeploy: ServerDeploy | undefined,
  backend: Backend | undefined,
) {
  if (serverDeploy && serverDeploy !== "none" && (!backend || backend === "none")) {
    exitWithError(
      "'--server-deploy' requires a backend. Please select a backend or set '--server-deploy none'.",
    );
  }
}

export function validateAddonCompatibility(
  addon: Addons,
  frontend: Frontend[],
  _auth?: Auth,
): { isCompatible: boolean; reason?: string } {
  return validateAddonCompatibilityShared(addon, frontend, _auth);
}

export function getCompatibleAddons(
  allAddons: Addons[],
  frontend: Frontend[],
  existingAddons: Addons[] = [],
  auth?: Auth,
) {
  return getCompatibleAddonsShared(allAddons, frontend, existingAddons, auth);
}

export function validateAddonsAgainstFrontends(
  addons: Addons[] = [],
  frontends: Frontend[] = [],
  auth?: Auth,
) {
  for (const addon of addons) {
    if (addon === "none") continue;
    const { isCompatible, reason } = validateAddonCompatibility(addon, frontends, auth);
    if (!isCompatible) {
      exitWithError(`Incompatible addon/frontend combination: ${reason}`);
    }
  }
}

export function validatePaymentsCompatibility(
  payments: Payments | undefined,
  auth: Auth | undefined,
  _backend: Backend | undefined,
  frontends: Frontend[] = [],
) {
  if (!payments || payments === "none") return;

  if (payments === "dodo" && frontends.includes("react-vite")) {
    exitWithError("Dodo Payments are not yet supported for React + Vite projects.");
  }

  if (payments === "polar") {
    if (!auth || auth === "none" || auth !== "better-auth") {
      exitWithError(
        "Polar payments requires Better Auth. Please use '--auth better-auth' or choose a different payments provider.",
      );
    }

    const { web } = splitFrontends(frontends);
    if (web.length === 0 && frontends.length > 0) {
      exitWithError(
        "Polar payments requires a web frontend or no frontend. Please select a web frontend or choose a different payments provider.",
      );
    }
  }
}

export function validateExamplesCompatibility(
  examples: string[] | undefined,
  backend: ProjectConfig["backend"] | undefined,
  frontend?: Frontend[],
  runtime?: Runtime,
  ai?: AI,
) {
  const examplesArr = examples ?? [];
  if (examplesArr.length === 0 || examplesArr.includes("none")) return;

  if (examplesArr.includes("ai") && (frontend ?? []).includes("solid")) {
    exitWithError("The 'ai' example is not compatible with the Solid frontend.");
  }

  if (examplesArr.includes("ai") && (frontend ?? []).includes("solid-start")) {
    exitWithError("The 'ai' example is not compatible with the SolidStart frontend.");
  }

  // Convex AI example only supports React-based frontends
  if (examplesArr.includes("ai") && backend === "convex") {
    const frontendArr = frontend ?? [];
    const includesNuxt = frontendArr.includes("nuxt");
    const includesSvelte = frontendArr.includes("svelte");
    if (includesNuxt || includesSvelte) {
      exitWithError(
        "The 'ai' example with Convex backend only supports React-based frontends (Next.js, TanStack Router, TanStack Start, React Router, React + Vite). Svelte and Nuxt are not supported with Convex AI.",
      );
    }
  }

  if (examplesArr.includes("chat-sdk")) {
    const frontendArr = frontend ?? [];

    if (frontendArr.includes("react-vite")) {
      exitWithError("The 'chat-sdk' example is not yet supported for React + Vite projects.");
    }

    if (!isExampleChatSdkAllowed(backend, frontendArr, runtime)) {
      if (backend === "none") {
        exitWithError("The 'chat-sdk' example requires a backend.");
      }

      if (backend === "convex") {
        exitWithError(
          "The 'chat-sdk' example is not supported with the Convex backend in v1. Use self backend (Next.js, TanStack Start, Nuxt) or Hono with Node runtime.",
        );
      }

      if (backend === "self") {
        exitWithError(
          "The 'chat-sdk' example with self backend only supports Next.js, TanStack Start, or Nuxt frontends in v1.",
        );
      }

      if (backend === "hono" && runtime !== "node") {
        exitWithError(
          "The 'chat-sdk' example with Hono requires '--runtime node' in v1 (Bun/Workers not supported yet).",
        );
      }

      exitWithError(
        "The 'chat-sdk' example is only supported with self backend (Next.js, TanStack Start, Nuxt) or Hono with Node runtime in v1.",
      );
    }

    if (requiresChatSdkVercelAI(backend, frontendArr, runtime) && ai && ai !== "vercel-ai") {
      exitWithError(
        "The 'chat-sdk' example requires '--ai vercel-ai' for the selected stack in v1 (Nuxt Discord and Hono GitHub profiles).",
      );
    }
  }
}

/**
 * Validates that a UI library is compatible with the selected frontend(s)
 */
export function validateUILibraryFrontendCompatibility(
  uiLibrary: UILibrary | undefined,
  frontends: Frontend[] = [],
  astroIntegration?: AstroIntegration,
) {
  if (!uiLibrary || uiLibrary === "none") return;
  const compatible = getCompatibleUILibrariesShared(frontends, astroIntegration);
  if (!compatible.includes(uiLibrary)) {
    const { web } = splitFrontends(frontends);
    const hasAstroWebFrontend = web.includes("astro");
    const isAstroNonReact = hasAstroWebFrontend && astroIntegration !== "react";
    const supportsAstroReact = getCompatibleUILibrariesShared(["astro"], "react").includes(
      uiLibrary,
    );

    if (isAstroNonReact && supportsAstroReact) {
      incompatibilityError({
        message: `UI library '${uiLibrary}' requires React.`,
        provided: { "ui-library": uiLibrary, "astro-integration": astroIntegration || "none" },
        suggestions: [
          "Use --astro-integration react",
          "Choose a different UI library (daisyui, ark-ui)",
        ],
      });
      return;
    }

    incompatibilityError({
      message: `UI library '${uiLibrary}' is not compatible with the selected frontend.`,
      provided: { "ui-library": uiLibrary, frontend: frontends },
      suggestions: [
        `Supported choices for this stack: ${compatible.join(", ")}`,
        "Choose a different UI library",
      ],
    });
  }
}

/**
 * Validates that a UI library is compatible with the selected CSS framework
 */
export function validateUILibraryCSSFrameworkCompatibility(
  uiLibrary: UILibrary | undefined,
  cssFramework: CSSFramework | undefined,
) {
  if (!uiLibrary || uiLibrary === "none") return;
  if (!cssFramework) return;

  const supported = getCompatibleCSSFrameworksShared(uiLibrary);
  if (!supported.includes(cssFramework)) {
    const supportedList = supported.join(", ");
    exitWithError(
      `UI library '${uiLibrary}' is not compatible with '${cssFramework}' CSS framework. Supported CSS frameworks: ${supportedList}`,
    );
  }
}

/**
 * Gets list of UI libraries compatible with the selected frontend(s)
 */
export function getCompatibleUILibraries(
  frontends: Frontend[] = [],
  astroIntegration?: AstroIntegration,
): UILibrary[] {
  return getCompatibleUILibrariesShared(frontends, astroIntegration);
}

/**
 * Gets list of CSS frameworks compatible with the selected UI library
 */
export function getCompatibleCSSFrameworks(uiLibrary: UILibrary | undefined): CSSFramework[] {
  return getCompatibleCSSFrameworksShared(uiLibrary);
}

/**
 * Checks if a frontend has web styling (excludes native-only frontends)
 */
export function hasWebStyling(frontends: Frontend[] = []): boolean {
  return hasWebStylingShared(frontends);
}

/**
 * Validates that a form library is compatible with the selected frontend(s)
 */
export function validateFormsFrontendCompatibility(
  forms: Forms | undefined,
  frontends: Frontend[] = [],
) {
  if (!forms || forms === "none") return;
  const compatible = getCompatibleFormLibrariesShared(frontends);
  if (!compatible.includes(forms)) {
    incompatibilityError({
      message: `${forms} is not compatible with the selected frontend.`,
      provided: { forms, frontend: frontends },
      suggestions: [`Compatible options: ${compatible.join(", ")}`],
    });
  }
}

/**
 * Gets list of form libraries compatible with the selected frontend(s)
 */
export function getCompatibleFormLibraries(frontends: Frontend[] = []): Forms[] {
  return getCompatibleFormLibrariesShared(frontends);
}
