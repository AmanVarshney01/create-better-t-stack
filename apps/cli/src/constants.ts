import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { getUserPkgManager } from "./utils/get-package-manager";

/**
 * Find the package root directory containing templates.
 *
 * For compiled binaries: Uses CREATE_BETTER_T_STACK_PKG_ROOT env var set by bin stub.
 * For dev mode: Uses the source directory.
 */
function findPackageRoot(): string {
  // First, check if the bin stub passed the package root
  const envPkgRoot = process.env.CREATE_BETTER_T_STACK_PKG_ROOT;
  if (envPkgRoot) {
    const templatesPath = path.join(envPkgRoot, "templates");
    if (fs.existsSync(templatesPath)) {
      return envPkgRoot;
    }
  }

  // In development (running from source), find templates relative to this file
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const devRoot = path.resolve(__dirname, "..");
  const devTemplatesPath = path.join(devRoot, "templates");
  if (fs.existsSync(devTemplatesPath)) {
    return devRoot;
  }

  // Fallback: try walking up from executable location
  const execDir = path.dirname(process.execPath);
  let current = execDir;
  let iterations = 0;

  while (current !== path.dirname(current) && iterations < 20) {
    iterations++;
    const templatesPath = path.join(current, "templates");
    if (fs.existsSync(templatesPath)) {
      return current;
    }
    current = path.dirname(current);
  }

  // Not found - log error and return dev root as fallback
  console.error(`[PKG_ROOT ERROR] Could not find templates directory!`);
  console.error(`[PKG_ROOT ERROR] Env: ${envPkgRoot || "(not set)"}`);
  console.error(`[PKG_ROOT ERROR] execDir: ${execDir}`);
  return devRoot;
}

export const PKG_ROOT = findPackageRoot();

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

export const dependencyVersionMap = {
  typescript: "^5",

  "better-auth": "^1.4.7",
  "@better-auth/expo": "^1.4.7",

  "@clerk/nextjs": "^6.31.5",
  "@clerk/clerk-react": "^5.45.0",
  "@clerk/tanstack-react-start": "^0.26.3",
  "@clerk/clerk-expo": "^2.14.25",

  "drizzle-orm": "^0.45.1",
  "drizzle-kit": "^0.31.8",
  "@planetscale/database": "^1.19.0",

  "@libsql/client": "0.15.15",
  libsql: "0.5.22",

  "@neondatabase/serverless": "^1.0.2",
  pg: "^8.16.3",
  "@types/pg": "^8.15.6",
  "@types/ws": "^8.18.1",
  ws: "^8.18.3",

  mysql2: "^3.14.0",

  "@prisma/client": "^7.1.0",
  prisma: "^7.1.0",
  "@prisma/adapter-d1": "^7.1.0",
  "@prisma/adapter-neon": "^7.1.0",
  "@prisma/adapter-mariadb": "^7.1.0",
  "@prisma/adapter-libsql": "^7.1.0",
  "@prisma/adapter-better-sqlite3": "^7.1.0",
  "@prisma/adapter-pg": "^7.1.0",
  "@prisma/adapter-planetscale": "^7.1.0",

  mongoose: "^8.14.0",

  "vite-plugin-pwa": "^1.0.1",
  "@vite-pwa/assets-generator": "^1.0.0",

  "@tauri-apps/cli": "^2.4.0",

  "@biomejs/biome": "^2.2.0",

  oxlint: "^1.34.0",
  oxfmt: "^0.19.0",

  husky: "^9.1.7",
  "lint-staged": "^16.1.2",

  tsx: "^4.19.2",
  "@types/node": "^22.13.11",

  "@types/bun": "^1.3.4",

  "@elysiajs/node": "^1.3.1",

  "@elysiajs/cors": "^1.3.3",
  "@elysiajs/trpc": "^1.1.0",
  elysia: "^1.3.21",

  "@hono/node-server": "^1.14.4",
  "@hono/trpc-server": "^0.4.0",
  hono: "^4.8.2",

  cors: "^2.8.5",
  express: "^5.1.0",
  "@types/express": "^5.0.1",
  "@types/cors": "^2.8.17",

  fastify: "^5.3.3",
  "@fastify/cors": "^11.0.1",

  turbo: "^2.6.3",

  ai: "^5.0.49",
  "@ai-sdk/google": "^2.0.51",
  "@ai-sdk/vue": "^2.0.49",
  "@ai-sdk/svelte": "^3.0.39",
  "@ai-sdk/react": "^2.0.39",
  streamdown: "^1.6.10",
  shiki: "^3.12.2",

  "@orpc/server": "^1.12.2",
  "@orpc/client": "^1.12.2",
  "@orpc/openapi": "^1.12.2",
  "@orpc/zod": "^1.12.2",
  "@orpc/tanstack-query": "^1.12.2",

  "@trpc/tanstack-react-query": "^11.7.2",
  "@trpc/server": "^11.7.2",
  "@trpc/client": "^11.7.2",

  next: "^16.0.10",

  convex: "^1.31.2",
  "@convex-dev/react-query": "^0.1.0",
  "@convex-dev/agent": "^0.3.2",
  "convex-svelte": "^0.0.12",
  "convex-nuxt": "0.1.5",
  "convex-vue": "^0.1.5",
  "@convex-dev/better-auth": "^0.10.6",

  "@tanstack/svelte-query": "^5.85.3",
  "@tanstack/svelte-query-devtools": "^5.85.3",

  "@tanstack/vue-query-devtools": "^5.90.2",
  "@tanstack/vue-query": "^5.90.2",

  "@tanstack/react-query-devtools": "^5.91.1",
  "@tanstack/react-query": "^5.90.12",

  "@tanstack/solid-query": "^5.87.4",
  "@tanstack/solid-query-devtools": "^5.87.4",
  "@tanstack/solid-router-devtools": "^1.131.44",

  wrangler: "^4.54.0",
  "@cloudflare/vite-plugin": "^1.17.1",
  "@opennextjs/cloudflare": "^1.14.6",
  "nitro-cloudflare-dev": "^0.2.2",
  "@sveltejs/adapter-cloudflare": "^7.2.4",
  "@cloudflare/workers-types": "^4.20251213.0",

  alchemy: "^0.81.2",

  dotenv: "^17.2.2",
  tsdown: "^0.16.5",
  zod: "^4.1.13",
  srvx: "0.8.15",

  "@polar-sh/better-auth": "^1.1.3",
  "@polar-sh/sdk": "^0.34.16",
} as const;

export type AvailableDependencies = keyof typeof dependencyVersionMap;

export const ADDON_COMPATIBILITY = {
  pwa: ["tanstack-router", "react-router", "solid", "next"],
  tauri: ["tanstack-router", "react-router", "nuxt", "svelte", "solid", "next"],
  biome: [],
  husky: [],
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
