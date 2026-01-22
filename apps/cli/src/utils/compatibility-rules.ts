import type {
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
  ServerDeploy,
  UILibrary,
  WebDeploy,
} from "../types";

import { ADDON_COMPATIBILITY, UI_LIBRARY_COMPATIBILITY } from "../constants";
import { WEB_FRAMEWORKS } from "./compatibility";
import { constraintError, incompatibilityError, invalidSelectionError } from "./error-formatter";
import { exitWithError } from "./errors";

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

// Temporarily restrict to Next.js, TanStack Start, and Astro only for backend="self"
const FULLSTACK_FRONTENDS: readonly Frontend[] = [
  "next",
  "tanstack-start",
  "astro",
  // "nuxt",      // TODO: Add support in future update
  // "svelte",    // TODO: Add support in future update
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
        "Backend 'self' (fullstack) currently only supports Next.js, TanStack Start, and Astro frontends. Please use --frontend next, --frontend tanstack-start, or --frontend astro. Support for Nuxt and SvelteKit will be added in a future update.",
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
      "Backend 'self' (fullstack) currently only supports Next.js, TanStack Start, and Astro frontends. Please use --frontend next, --frontend tanstack-start, --frontend astro, or choose a different backend. Support for Nuxt and SvelteKit will be added in a future update.",
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
      message: "Cloudflare Workers runtime requires a compatible backend.",
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
      message: `Backend '${config.backend}' is not compatible with Workers runtime.`,
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
      message: "Cloudflare Workers runtime is not compatible with MongoDB.",
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
      message: "Cloudflare Workers runtime is not compatible with Docker setup.",
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
      message: "MongoDB is not compatible with Cloudflare Workers runtime.",
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

  // ts-rest and garph require React like tRPC
  if (
    (includesNuxt || includesSvelte || includesSolid) &&
    (api === "trpc" || api === "ts-rest" || api === "garph")
  ) {
    const apiName = api === "trpc" ? "tRPC" : api === "ts-rest" ? "ts-rest" : "garph";
    const incompatibleFrontend = includesNuxt ? "nuxt" : includesSvelte ? "svelte" : "solid";
    incompatibilityError({
      message: `${apiName} API requires React-based frontends.`,
      provided: { api, frontend: incompatibleFrontend },
      suggestions: [
        "Use --api orpc (works with all frontends)",
        "Use --api none",
        "Choose next, react-router, or tanstack-start",
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
  if (backend === "convex" && frontend === "solid") return false;
  if (backend === "convex" && frontend === "astro") return false;
  if (backend === "convex" && frontend === "qwik") return false;
  if (backend === "convex" && frontend === "angular") return false;
  if (backend === "convex" && frontend === "redwood") return false;
  if (backend === "convex" && frontend === "fresh") return false;

  // Qwik has its own built-in server, only works with backend=none
  if (frontend === "qwik" && backend && backend !== "none") return false;

  // Angular has its own built-in dev server, only works with backend=none
  if (frontend === "angular" && backend && backend !== "none") return false;

  // RedwoodJS has its own built-in GraphQL API, only works with backend=none
  if (frontend === "redwood" && backend && backend !== "none") return false;

  // Fresh (Deno) has its own built-in server, only works with backend=none
  if (frontend === "fresh" && backend && backend !== "none") return false;

  if (auth === "clerk" && backend === "convex") {
    const incompatibleFrontends = ["nuxt", "svelte", "solid"];
    if (incompatibleFrontends.includes(frontend)) return false;
  }

  // NextAuth only works with Next.js frontend and self backend
  if (auth === "nextauth") {
    if (frontend !== "next") return false;
    if (backend !== "self") return false;
  }

  return true;
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
      "Auth.js (NextAuth) is only supported with the 'self' backend (fullstack Next.js). Please use '--backend self' or choose a different auth provider.",
    );
  }

  if (!hasNextJs) {
    exitWithError(
      "Auth.js (NextAuth) requires Next.js frontend. Please use '--frontend next' or choose a different auth provider.",
    );
  }
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

  // Qwik uses its own server capabilities, only none is allowed
  if (includesQwik) {
    return ["none"];
  }

  // Angular uses its own HttpClient, only none is allowed
  if (includesAngular) {
    return ["none"];
  }

  // RedwoodJS uses its own GraphQL API, only none is allowed
  if (includesRedwood) {
    return ["none"];
  }

  // Fresh (Deno) uses its own built-in server, only none is allowed
  if (includesFresh) {
    return ["none"];
  }

  // Nuxt, Svelte, and Solid only support oRPC
  if (includesNuxt || includesSvelte || includesSolid) {
    return ["orpc", "none"];
  }

  // Astro with non-React integrations only supports oRPC
  if (includesAstro && astroIntegration && astroIntegration !== "react") {
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
  if (includesSolid) return false;

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
  database: ProjectConfig["database"] | undefined,
  frontend?: Frontend[],
  api?: API,
) {
  const examplesArr = examples ?? [];
  if (examplesArr.length === 0 || examplesArr.includes("none")) return;
  if (examplesArr.includes("todo") && backend !== "convex") {
    if (database === "none") {
      exitWithError(
        "The 'todo' example requires a database. Cannot use --examples todo when database is 'none'.",
      );
    }
    if (api === "none") {
      exitWithError(
        "The 'todo' example requires an API layer (tRPC or oRPC). Cannot use --examples todo when api is 'none'.",
      );
    }
  }

  if (examplesArr.includes("ai") && (frontend ?? []).includes("solid")) {
    exitWithError("The 'ai' example is not compatible with the Solid frontend.");
  }

  // Convex AI example only supports React-based frontends
  if (examplesArr.includes("ai") && backend === "convex") {
    const frontendArr = frontend ?? [];
    const includesNuxt = frontendArr.includes("nuxt");
    const includesSvelte = frontendArr.includes("svelte");
    if (includesNuxt || includesSvelte) {
      exitWithError(
        "The 'ai' example with Convex backend only supports React-based frontends (Next.js, TanStack Router, TanStack Start, React Router). Svelte and Nuxt are not supported with Convex AI.",
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

  const { web } = splitFrontends(frontends);
  if (web.length === 0) return;

  const compatibility = UI_LIBRARY_COMPATIBILITY[uiLibrary];
  const webFrontend = web[0];

  // Handle Astro with integrations
  if (webFrontend === "astro") {
    // If React integration, treat as React frontend for UI library compatibility
    if (astroIntegration === "react") {
      // Check if library supports React frontends
      const supportsReact = compatibility.frontends.some((f) =>
        ["tanstack-router", "react-router", "tanstack-start", "next"].includes(f),
      );
      if (supportsReact) return; // OK
    }

    // For non-React integrations, only allow libraries that explicitly support astro
    if (!compatibility.frontends.includes("astro")) {
      const integrationName = astroIntegration || "none";
      incompatibilityError({
        message: `UI library '${uiLibrary}' requires React.`,
        provided: { "ui-library": uiLibrary, "astro-integration": integrationName },
        suggestions: [
          "Use --astro-integration react",
          "Choose a different UI library (daisyui, ark-ui)",
        ],
      });
    }
    return;
  }

  // Original logic for non-Astro frontends
  if (!compatibility.frontends.includes(webFrontend)) {
    incompatibilityError({
      message: `UI library '${uiLibrary}' is not compatible with '${webFrontend}'.`,
      provided: { "ui-library": uiLibrary, frontend: webFrontend },
      suggestions: [
        `Supported frontends: ${compatibility.frontends.join(", ")}`,
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

  const compatibility = UI_LIBRARY_COMPATIBILITY[uiLibrary];

  if (!compatibility.cssFrameworks.includes(cssFramework)) {
    const supportedList = compatibility.cssFrameworks.join(", ");
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
  const { web } = splitFrontends(frontends);
  if (web.length === 0) return ["none"];

  const webFrontend = web[0];

  const allUILibraries = Object.keys(UI_LIBRARY_COMPATIBILITY) as UILibrary[];
  return allUILibraries.filter((lib) => {
    if (lib === "none") return true;

    const compatibility = UI_LIBRARY_COMPATIBILITY[lib];

    // Handle Astro with integrations
    if (webFrontend === "astro") {
      if (astroIntegration === "react") {
        // Allow React-compatible libraries
        return compatibility.frontends.some((f) =>
          ["tanstack-router", "react-router", "tanstack-start", "next", "astro"].includes(f),
        );
      }
      // Non-React integration - only allow libraries that explicitly support astro
      return compatibility.frontends.includes("astro");
    }

    return compatibility.frontends.includes(webFrontend);
  });
}

/**
 * Gets list of CSS frameworks compatible with the selected UI library
 */
export function getCompatibleCSSFrameworks(uiLibrary: UILibrary | undefined): CSSFramework[] {
  if (!uiLibrary || uiLibrary === "none") {
    return ["tailwind", "scss", "less", "postcss-only", "none"];
  }

  const compatibility = UI_LIBRARY_COMPATIBILITY[uiLibrary];
  return compatibility.cssFrameworks as unknown as CSSFramework[];
}

/**
 * Checks if a frontend has web styling (excludes native-only frontends)
 */
export function hasWebStyling(frontends: Frontend[] = []): boolean {
  const { web } = splitFrontends(frontends);
  return web.length > 0;
}

// React-based form libraries
const REACT_FORM_LIBRARIES: Forms[] = [
  "react-hook-form",
  "tanstack-form",
  "formik",
  "final-form",
  "conform",
];

// React-based frontends (web)
const REACT_WEB_FRONTENDS: Frontend[] = [
  "tanstack-router",
  "react-router",
  "tanstack-start",
  "next",
];

// Native frontends (always React-based)
const NATIVE_FRONTENDS: Frontend[] = ["native-bare", "native-uniwind", "native-unistyles"];

/**
 * Validates that a form library is compatible with the selected frontend(s)
 */
export function validateFormsFrontendCompatibility(
  forms: Forms | undefined,
  frontends: Frontend[] = [],
) {
  if (!forms || forms === "none") return;

  const hasSolid = frontends.includes("solid");
  const hasQwik = frontends.includes("qwik");
  const hasReactWeb = frontends.some((f) => REACT_WEB_FRONTENDS.includes(f));
  const hasNative = frontends.some((f) => NATIVE_FRONTENDS.includes(f));
  const hasReact = hasReactWeb || hasNative;

  // modular-forms is only for Solid and Qwik
  if (forms === "modular-forms") {
    if (!hasSolid && !hasQwik) {
      incompatibilityError({
        message: "Modular Forms is designed for Solid and Qwik frontends only.",
        provided: { forms, frontend: frontends },
        suggestions: [
          "Use a React form library: react-hook-form, tanstack-form, formik",
          "Use --frontend solid or --frontend qwik",
        ],
      });
    }
  }

  // React form libraries are only for React-based frontends
  if (REACT_FORM_LIBRARIES.includes(forms)) {
    if (hasSolid || hasQwik) {
      const incompatibleFrontend = hasSolid ? "solid" : "qwik";
      incompatibilityError({
        message: `${forms} is a React-based form library.`,
        provided: { forms, frontend: incompatibleFrontend },
        suggestions: [`Use --forms modular-forms for ${hasSolid ? "Solid" : "Qwik"}`],
      });
    }
    if (!hasReact) {
      // Allow if there's no frontend selected yet - prompts will handle this
      const { web } = splitFrontends(frontends);
      if (web.length > 0) {
        incompatibilityError({
          message: `${forms} requires a React-based frontend.`,
          provided: { forms, frontend: web },
          suggestions: [
            "Use tanstack-router, react-router, tanstack-start, or next",
            "Use --forms modular-forms for Solid or Qwik",
          ],
        });
      }
    }
  }
}

/**
 * Gets list of form libraries compatible with the selected frontend(s)
 */
export function getCompatibleFormLibraries(frontends: Frontend[] = []): Forms[] {
  const hasSolid = frontends.includes("solid");
  const hasQwik = frontends.includes("qwik");
  const hasReactWeb = frontends.some((f) => REACT_WEB_FRONTENDS.includes(f));
  const hasNative = frontends.some((f) => NATIVE_FRONTENDS.includes(f));
  const hasReact = hasReactWeb || hasNative;

  // Solid or Qwik - only modular-forms
  if (hasSolid || hasQwik) {
    return ["modular-forms", "none"];
  }

  // React frontends - all React form libraries
  if (hasReact) {
    return ["react-hook-form", "tanstack-form", "formik", "final-form", "conform", "none"];
  }

  // No frontend selected or non-React/Solid/Qwik - return all options
  return [
    "react-hook-form",
    "tanstack-form",
    "formik",
    "final-form",
    "conform",
    "modular-forms",
    "none",
  ];
}
