import type { Auth, Ecosystem } from "./types";

export type CapabilityName = "auth";

export type CapabilityStackContext = {
  ecosystem?: Ecosystem;
  backend?: string;
  frontend?: readonly string[];
  webFrontend?: readonly string[];
  nativeFrontend?: readonly string[];
};

export type CapabilityDefinitionBase = {
  id: string;
  label: string;
  description: string;
  promptHint: string;
  icon: string;
  color: string;
  default?: boolean;
};

export type AuthCapabilityDefinition = CapabilityDefinitionBase & {
  id: Auth;
};

type CapabilityDefinitionMap = {
  auth: AuthCapabilityDefinition;
};

export type CapabilityDefinition<K extends CapabilityName = CapabilityName> =
  CapabilityDefinitionMap[K];

export type CapabilityNormalizationResult<K extends CapabilityName = CapabilityName> = {
  value: CapabilityDefinitionMap[K]["id"];
  normalized: boolean;
  reason: string | null;
  message: string | null;
};

const AUTH_CAPABILITIES = [
  {
    id: "better-auth",
    label: "Better-Auth",
    description: "The most comprehensive authentication framework for TypeScript",
    promptHint: "comprehensive auth framework for TypeScript",
    icon: "/icon/better-auth.svg",
    color: "from-green-400 to-green-600",
    default: true,
  },
  {
    id: "go-better-auth",
    label: "GoBetterAuth",
    description: "Embedded auth routes for Go applications",
    promptHint: "embedded auth routes for Go applications",
    icon: "https://cdn.simpleicons.org/go/00ADD8",
    color: "from-cyan-400 to-sky-600",
  },
  {
    id: "clerk",
    label: "Clerk",
    description: "More than authentication, Complete User Management",
    promptHint: "More than auth, Complete User Management",
    icon: "https://cdn.simpleicons.org/clerk/6C47FF",
    color: "from-blue-400 to-blue-600",
  },
  {
    id: "nextauth",
    label: "Auth.js (NextAuth)",
    description: "Open source authentication for Next.js",
    promptHint: "Authentication for Next.js (formerly NextAuth.js)",
    icon: "/icon/nextauth.png",
    color: "from-orange-400 to-orange-600",
  },
  {
    id: "stack-auth",
    label: "Stack Auth",
    description: "Open-source Auth0/Clerk alternative with user management",
    promptHint: "Open-source Auth0/Clerk alternative",
    icon: "/icon/stack-auth.svg",
    color: "from-purple-400 to-purple-600",
  },
  {
    id: "supabase-auth",
    label: "Supabase Auth",
    description: "Open-source Auth with Supabase platform integration",
    promptHint: "Auth with Supabase platform integration",
    icon: "https://cdn.simpleicons.org/supabase/3FCF8E",
    color: "from-emerald-400 to-emerald-600",
  },
  {
    id: "auth0",
    label: "Auth0",
    description: "Flexible identity platform for authentication and authorization",
    promptHint: "Flexible identity platform for authentication",
    icon: "https://cdn.simpleicons.org/auth0/EB5424",
    color: "from-orange-400 to-orange-600",
  },
  {
    id: "none",
    label: "No Auth",
    description: "Skip authentication",
    promptHint: "No authentication",
    icon: "",
    color: "from-red-400 to-red-600",
  },
] as const satisfies readonly AuthCapabilityDefinition[];

const CAPABILITY_DEFINITIONS: {
  [K in CapabilityName]: readonly CapabilityDefinitionMap[K][];
} = {
  auth: AUTH_CAPABILITIES,
};

const NATIVE_FRONTENDS = new Set(["native-bare", "native-uniwind", "native-unistyles"]);
const CONVEX_BETTER_AUTH_WEB = new Set(["react-vite", "tanstack-router", "tanstack-start", "next"]);
const CONVEX_CLERK_WEB = new Set([
  "react-router",
  "react-vite",
  "tanstack-router",
  "tanstack-start",
  "next",
]);

function capitalizeFirst(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function dedupe(values: readonly string[]): string[] {
  return [...new Set(values)];
}

function getFrontendSets(context: CapabilityStackContext): {
  webFrontend: string[];
  nativeFrontend: string[];
} {
  if (context.frontend) {
    const webFrontend = context.frontend.filter((frontend) => !NATIVE_FRONTENDS.has(frontend));
    const nativeFrontend = context.frontend.filter((frontend) => NATIVE_FRONTENDS.has(frontend));
    return {
      webFrontend: dedupe(webFrontend),
      nativeFrontend: dedupe(nativeFrontend),
    };
  }

  return {
    webFrontend: dedupe(context.webFrontend ?? []),
    nativeFrontend: dedupe(context.nativeFrontend ?? []),
  };
}

function isSelfBackend(backend?: string): boolean {
  return backend === "self" || backend?.startsWith("self-") === true;
}

function getNextOnlyAuthLabel(optionId: Exclude<Auth, "none" | "better-auth" | "go-better-auth" | "clerk">): string {
  switch (optionId) {
    case "nextauth":
      return "Auth.js (NextAuth)";
    case "stack-auth":
      return "Stack Auth";
    case "supabase-auth":
      return "Supabase Auth";
    case "auth0":
      return "Auth0";
    default: {
      const _exhaustive: never = optionId;
      return String(_exhaustive);
    }
  }
}

function getAuthDisabledReason(context: CapabilityStackContext, optionId: Auth): string | null {
  if (optionId === "none") return null;

  const ecosystem = context.ecosystem ?? "typescript";
  const backend = context.backend;
  const { webFrontend, nativeFrontend } = getFrontendSets(context);
  const hasNextJs = webFrontend.includes("next");
  const hasTanStackStart = webFrontend.includes("tanstack-start");
  const hasNativeFrontend = nativeFrontend.some((frontend) => frontend !== "none");

  if (optionId === "go-better-auth") {
    return ecosystem === "go" ? null : "GoBetterAuth is available only for Go stacks";
  }

  if (ecosystem === "go") {
    return "Go stacks currently support GoBetterAuth only";
  }

  if (ecosystem !== "typescript") {
    return `${capitalizeFirst(ecosystem)} stacks do not support auth integrations yet`;
  }

  if (backend === "none") {
    return "No backend selected";
  }

  if (optionId === "better-auth") {
    if (backend === "convex") {
      const hasCompatibleFrontend =
        webFrontend.some((frontend) => CONVEX_BETTER_AUTH_WEB.has(frontend)) ||
        nativeFrontend.some((frontend) => NATIVE_FRONTENDS.has(frontend));

      if (!hasCompatibleFrontend) {
        return "Better-Auth with Convex requires React + Vite, TanStack Router, TanStack Start, Next.js, or React Native";
      }
    }

    return null;
  }

  if (optionId === "clerk") {
    if (backend === "convex") {
      const hasCompatibleFrontend =
        webFrontend.some((frontend) => CONVEX_CLERK_WEB.has(frontend)) ||
        nativeFrontend.some((frontend) => NATIVE_FRONTENDS.has(frontend));

      if (!hasCompatibleFrontend) {
        return "Clerk with Convex requires React Router, React + Vite, TanStack Router, TanStack Start, Next.js, or React Native";
      }

      return null;
    }

    if (isSelfBackend(backend)) {
      if ((hasNextJs || hasTanStackStart) && hasNativeFrontend) {
        return "In Better-Fullstack, Clerk with self backend is currently supported only for web-only Next.js or TanStack Start projects (no native companion app)";
      }

      if (hasNextJs || hasTanStackStart) {
        return null;
      }

      if (backend === "self-astro" || webFrontend.includes("astro")) {
        return "In Better-Fullstack, Clerk is not yet supported for Astro fullstack projects";
      }
      if (backend === "self-nuxt" || webFrontend.includes("nuxt")) {
        return "In Better-Fullstack, Clerk is not yet supported for Nuxt fullstack projects";
      }
      if (backend === "self-svelte" || webFrontend.includes("svelte")) {
        return "In Better-Fullstack, Clerk is not yet supported for SvelteKit fullstack projects";
      }
      if (backend === "self-solid-start" || webFrontend.includes("solid-start")) {
        return "In Better-Fullstack, Clerk is not yet supported for SolidStart fullstack projects";
      }

      return "In Better-Fullstack, Clerk is currently supported with Convex, Next.js fullstack, or TanStack Start fullstack";
    }

    return "In Better-Fullstack, Clerk is currently supported with Convex, Next.js fullstack, or TanStack Start fullstack";
  }

  const nextOnlyLabel = getNextOnlyAuthLabel(optionId);
  if (backend !== "self" && backend !== "self-next") {
    return `In Better-Fullstack, ${nextOnlyLabel} is currently supported only with the 'self' backend (fullstack Next.js)`;
  }

  if (!hasNextJs) {
    return `In Better-Fullstack, ${nextOnlyLabel} currently requires the Next.js frontend`;
  }

  return null;
}

export function getCapabilityDefinitions<K extends CapabilityName>(
  capability: K,
): readonly CapabilityDefinitionMap[K][] {
  return CAPABILITY_DEFINITIONS[capability];
}

export function getCapabilityDisabledReason<K extends CapabilityName>(
  capability: K,
  context: CapabilityStackContext,
  optionId: CapabilityDefinitionMap[K]["id"],
): string | null {
  if (capability === "auth") {
    return getAuthDisabledReason(context, optionId as Auth) as string | null;
  }

  return null;
}

export function getSupportedCapabilityOptions<K extends CapabilityName>(
  capability: K,
  context: CapabilityStackContext,
): readonly CapabilityDefinitionMap[K][] {
  return getCapabilityDefinitions(capability).filter(
    (definition) => getCapabilityDisabledReason(capability, context, definition.id) === null,
  );
}

export function normalizeCapabilitySelection<K extends CapabilityName>(
  capability: K,
  context: CapabilityStackContext,
  optionId: CapabilityDefinitionMap[K]["id"] | undefined,
): CapabilityNormalizationResult<K> {
  const fallbackValue = "none" as CapabilityDefinitionMap[K]["id"];

  if (!optionId || optionId === fallbackValue) {
    return {
      value: (optionId ?? fallbackValue) as CapabilityDefinitionMap[K]["id"],
      normalized: false,
      reason: null,
      message: null,
    };
  }

  const reason = getCapabilityDisabledReason(capability, context, optionId);
  if (!reason) {
    return {
      value: optionId,
      normalized: false,
      reason: null,
      message: null,
    };
  }

  return {
    value: fallbackValue,
    normalized: true,
    reason,
    message: `${capitalizeFirst(capability)} set to 'None' (${reason})`,
  };
}
