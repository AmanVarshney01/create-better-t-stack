import path from "node:path";
import { fileURLToPath } from "node:url";

import type { CSSFramework, Frontend, UILibrary } from "./types";

import { getUserPkgManager } from "./utils/get-package-manager";

// Re-export from template-generator (single source of truth)
export {
  dependencyVersionMap,
  type AvailableDependencies,
} from "@better-t-stack/template-generator";

const __filename = fileURLToPath(import.meta.url);
const distPath = path.dirname(__filename);
export const PKG_ROOT = path.join(distPath, "../");

export const DEFAULT_CONFIG_BASE = {
  projectName: "my-better-t-app",
  relativePath: "my-better-t-app",
  frontend: ["tanstack-router"],
  database: "sqlite",
  orm: "drizzle",
  auth: "better-auth",
  payments: "none",
  email: "none",
  effect: "none",
  stateManagement: "none",
  validation: "zod",
  forms: "react-hook-form",
  testing: "vitest",
  ai: "none",
  realtime: "none",
  animation: "none",
  addons: ["turborepo"],
  examples: [],
  git: true,
  install: true,
  dbSetup: "none",
  backend: "hono",
  runtime: "bun",
  api: "trpc",
  webDeploy: "none",
  serverDeploy: "none",
  cssFramework: "tailwind",
  uiLibrary: "shadcn-ui",
} as const;

export function getDefaultConfig() {
  return {
    ...DEFAULT_CONFIG_BASE,
    projectDir: path.resolve(process.cwd(), DEFAULT_CONFIG_BASE.projectName),
    packageManager: getUserPkgManager(),
    frontend: [...DEFAULT_CONFIG_BASE.frontend],
    addons: [...DEFAULT_CONFIG_BASE.addons],
    examples: [...DEFAULT_CONFIG_BASE.examples],
  };
}

export const DEFAULT_CONFIG = getDefaultConfig();

export const ADDON_COMPATIBILITY = {
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
  oxlint: [],
  fumadocs: [],
  opentui: [],
  wxt: [],
  none: [],
} as const;

/**
 * UI Library compatibility rules
 * Defines which frontends and CSS frameworks each UI library supports
 */
export const UI_LIBRARY_COMPATIBILITY: Record<
  UILibrary,
  {
    frontends: readonly Frontend[];
    cssFrameworks: readonly CSSFramework[];
  }
> = {
  "shadcn-ui": {
    frontends: ["tanstack-router", "react-router", "tanstack-start", "next"],
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
      "astro",
      "qwik",
      "angular",
      "redwood",
      "fresh",
    ],
    cssFrameworks: ["tailwind"],
  },
  "radix-ui": {
    frontends: ["tanstack-router", "react-router", "tanstack-start", "next"],
    cssFrameworks: ["tailwind", "scss", "less", "postcss-only", "none"],
  },
  "headless-ui": {
    frontends: ["tanstack-router", "react-router", "tanstack-start", "next", "nuxt"],
    cssFrameworks: ["tailwind", "scss", "less", "postcss-only", "none"],
  },
  "park-ui": {
    frontends: ["tanstack-router", "react-router", "tanstack-start", "next", "nuxt", "solid"],
    cssFrameworks: ["tailwind", "scss", "less", "postcss-only"],
  },
  "chakra-ui": {
    frontends: ["tanstack-router", "react-router", "tanstack-start", "next"],
    cssFrameworks: ["tailwind", "scss", "less", "postcss-only", "none"],
  },
  nextui: {
    frontends: ["tanstack-router", "react-router", "tanstack-start", "next"],
    cssFrameworks: ["tailwind"],
  },
  mantine: {
    frontends: ["tanstack-router", "react-router", "tanstack-start", "next"],
    cssFrameworks: ["tailwind", "scss", "less", "postcss-only", "none"],
  },
  "base-ui": {
    frontends: ["tanstack-router", "react-router", "tanstack-start", "next"],
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
    ],
    cssFrameworks: ["tailwind", "scss", "less", "postcss-only", "none"],
  },
  "react-aria": {
    frontends: ["tanstack-router", "react-router", "tanstack-start", "next"],
    cssFrameworks: ["tailwind", "scss", "less", "postcss-only", "none"],
  },
  none: {
    frontends: [
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
    ],
    cssFrameworks: ["tailwind", "scss", "less", "postcss-only", "none"],
  },
} as const;

/**
 * Default UI library for each frontend framework
 * Falls back based on what's compatible
 */
export const DEFAULT_UI_LIBRARY_BY_FRONTEND: Record<Frontend, UILibrary> = {
  "tanstack-router": "shadcn-ui",
  "react-router": "shadcn-ui",
  "tanstack-start": "shadcn-ui",
  next: "shadcn-ui",
  nuxt: "daisyui",
  svelte: "daisyui",
  solid: "daisyui",
  astro: "daisyui",
  qwik: "daisyui",
  angular: "daisyui",
  redwood: "daisyui",
  fresh: "daisyui",
  "native-bare": "none",
  "native-uniwind": "none",
  "native-unistyles": "none",
  none: "none",
} as const;
