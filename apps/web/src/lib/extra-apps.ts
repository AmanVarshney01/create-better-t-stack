import { TECH_OPTIONS } from "./constant";
import type { StackState } from "./constant";

/**
 * Extra frontend apps planned in the stack builder, scaffolded after create
 * via the CLI `add-app` command. Encoded in StackState as "name:frontend"
 * strings so URL/localStorage/share serialization work unchanged.
 */
export interface ExtraApp {
  name: string;
  frontend: string;
}

type ExtraAppStack = Pick<StackState, "backend" | "api" | "auth">;

const REACT_FAMILY_FRONTENDS = ["tanstack-router", "react-router", "tanstack-start", "next"];

export const EXTRA_APP_FRAMEWORKS = TECH_OPTIONS.webFrontend.filter(
  (option) => option.id !== "none",
);

const EXTRA_APP_FRAMEWORK_IDS = new Set(EXTRA_APP_FRAMEWORKS.map((option) => option.id));

// Mirrors RESERVED_APP_NAMES in packages/types/src/schemas.ts.
export const RESERVED_EXTRA_APP_NAMES = new Set([
  "web",
  "native",
  "server",
  "desktop",
  "docs",
  "fumadocs",
  "tui",
  "extension",
  "api",
  "auth",
  "db",
  "backend",
  "config",
  "env",
  "infra",
  "ui",
]);

const APP_NAME_PATTERN = /^[a-z][a-z0-9-]*$/;

/** Parses a "name:frontend" spec; returns null for malformed input. */
export function parseExtraApp(encoded: string): ExtraApp | null {
  const separatorIndex = encoded.indexOf(":");
  if (separatorIndex <= 0 || separatorIndex === encoded.length - 1) return null;
  return {
    name: encoded.slice(0, separatorIndex),
    frontend: encoded.slice(separatorIndex + 1),
  };
}

/** Encodes an extra app as its "name:frontend" spec. */
export function formatExtraApp(app: ExtraApp): string {
  return `${app.name}:${app.frontend}`;
}

/** Returns an error message, or null when the name is valid. */
export function validateExtraAppName(name: string, takenNames: ReadonlySet<string>): string | null {
  if (name.length === 0) return "App name cannot be empty";
  if (name.length > 30) return "App name must be 30 characters or fewer";
  if (!APP_NAME_PATTERN.test(name)) {
    return "Use lowercase letters, digits, and dashes, starting with a letter";
  }
  if (RESERVED_EXTRA_APP_NAMES.has(name)) return `'${name}' is a reserved name`;
  if (takenNames.has(name)) return `An app named '${name}' is already planned`;
  return null;
}

const isSelfBackend = (backend: string) => backend.startsWith("self-") || backend === "self";

/** Extra apps are unavailable entirely for fullstack (self) backends. */
export function getExtraAppsBlockedReason(stack: Pick<StackState, "backend">): string | null {
  if (isSelfBackend(stack.backend)) {
    return "Fullstack (self) backends serve API routes from the web app itself, so extra apps have no shared server to connect to.";
  }
  return null;
}

/**
 * Mirrors the CLI's validateAddAppFrontendCompatibility: which frameworks an
 * extra app may use, given the project's api/auth/backend.
 */
export function getExtraAppFrontendDisabledReason(
  stack: ExtraAppStack,
  frontend: string,
): string | null {
  const isReactFamily = REACT_FAMILY_FRONTENDS.includes(frontend);

  if (stack.api === "trpc" && !isReactFamily) {
    return "tRPC API supports React-family frameworks only. Use oRPC for this framework.";
  }

  if (stack.auth === "clerk" && !isReactFamily) {
    return "Clerk auth supports React-family frameworks only.";
  }

  if (stack.backend === "convex") {
    if (frontend === "solid" || frontend === "astro") {
      return "Convex does not support Solid or Astro.";
    }
    if (stack.auth === "better-auth" && !isReactFamily) {
      return "Better-Auth with Convex supports React-family frameworks only.";
    }
  }

  return null;
}

/**
 * Drops malformed entries, invalid names/frameworks, duplicates, and apps
 * incompatible with the current stack. Used when loading URL/localStorage state.
 */
export function sanitizeExtraApps(
  apps: readonly string[] | null | undefined,
  stack: ExtraAppStack & Pick<StackState, "backend">,
): string[] {
  if (apps == null || apps.length === 0) return [];
  if (getExtraAppsBlockedReason(stack)) return [];

  const seen = new Set<string>();
  const sanitized: string[] = [];

  for (const encoded of apps) {
    const app = parseExtraApp(encoded);
    if (!app) continue;
    if (validateExtraAppName(app.name, seen)) continue;
    if (!EXTRA_APP_FRAMEWORK_IDS.has(app.frontend)) continue;
    if (getExtraAppFrontendDisabledReason(stack, app.frontend)) continue;
    seen.add(app.name);
    sanitized.push(formatExtraApp(app));
  }

  return sanitized;
}
