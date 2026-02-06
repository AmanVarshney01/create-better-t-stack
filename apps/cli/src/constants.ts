import path from "node:path";
import { fileURLToPath } from "node:url";

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
  pwa: ["tanstack-router", "react-router", "solid", "next"],
  tauri: ["tanstack-router", "react-router", "nuxt", "svelte", "solid", "next"],
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
  skills: [],
  none: [],
} as const;
