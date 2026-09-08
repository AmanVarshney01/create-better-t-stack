/**
 * Add dependencies to a package.json in the virtual filesystem
 */

import type { JsonValue } from "../core/json-types";
import type { VirtualFileSystem } from "../core/virtual-fs";

type PackageJson = {
  name?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  [key: string]: JsonValue | undefined;
};

export const dependencyVersionMap = {
  // TS 7 removes the compiler API required by vue-tsc, svelte-check and our tooling.
  typescript: "^6.0.3",

  "better-auth": "1.7.3",
  "@better-auth/expo": "1.7.3",

  "@clerk/backend": "^3.17.1",
  "@clerk/express": "^2.1.66",
  "@clerk/fastify": "^3.1.76",
  "@clerk/nextjs": "^7.9.1",
  "@clerk/react": "^6.15.1",
  "@clerk/react-router": "^3.6.21",
  "@react-router/express": "^8.3.1",
  "@clerk/tanstack-react-start": "^1.5.12",
  "@clerk/expo": "^4.6.5",

  "drizzle-orm": "^0.45.2",
  "drizzle-kit": "^0.31.10",
  "@planetscale/database": "^1.20.1",

  "@libsql/client": "0.18.0",
  libsql: "0.5.29",

  "@neondatabase/serverless": "^1.1.0",
  pg: "^8.23.0",
  postgres: "^3.4.9",
  "@types/pg": "^8.23.1",
  "@types/ws": "^8.18.1",
  ws: "^8.21.3",

  mysql2: "^3.24.3",

  "@prisma/client": "^7.10.0",
  prisma: "^7.10.0",
  "@prisma/adapter-d1": "^7.10.0",
  "@prisma/adapter-neon": "^7.10.0",
  "@prisma/adapter-mariadb": "^7.10.0",
  "@prisma/adapter-libsql": "^7.10.0",
  "@prisma/adapter-better-sqlite3": "^7.10.0",
  "@prisma/adapter-pg": "^7.10.0",
  "@prisma/adapter-ppg": "^7.10.0",
  "@prisma/adapter-planetscale": "^7.10.0",

  mongoose: "^9.9.5",
  mongodb: "^7.6.0",

  "vite-plugin-pwa": "^1.3.0",
  "@vite-pwa/assets-generator": "^1.0.2",

  "@tauri-apps/cli": "^2.11.4",

  "@biomejs/biome": "^2.5.12",

  oxlint: "^1.81.0",
  oxfmt: "^0.66.0",

  husky: "^9.1.7",
  lefthook: "^2.1.12",
  "lint-staged": "^17.5.0",

  tsx: "^4.23.13",
  "@types/node": "^26.4.1",

  "@types/bun": "^1.4.1",

  "@elysiajs/node": "^1.4.5",

  "@elysiajs/cors": "^1.4.2",
  "@elysiajs/trpc": "^1.1.0",
  elysia: "^1.4.30",
  // Peer dep of elysia; Bun isolated linker won't install peers, so Node/tsx fails without it.
  "@sinclair/typebox": "^0.34.52",

  "@hono/node-server": "^2.1.1",
  "@hono/trpc-server": "^0.4.2",
  hono: "^4.13.7",

  cors: "^2.8.6",
  express: "^5.2.1",
  "@types/express": "^5.0.6",
  "@types/cors": "^2.8.19",

  fastify: "^5.12.3",
  "@fastify/cors": "^11.3.0",

  turbo: "^2.10.12",
  nx: "^23.2.0",
  "vite-plus": "0.3.1",
  rolldown: "1.2.7",
  unwasm: "^0.6.0",

  ai: "^7.0.93",
  "@ai-sdk/google": "^4.0.64",
  "@ai-sdk/vue": "^4.0.93",
  "@ai-sdk/svelte": "^5.0.93",
  "@ai-sdk/react": "^4.0.96",
  "@ai-sdk/devtools": "^1.0.15",
  streamdown: "^2.6.0",
  shiki: "^4.4.3",

  "@orpc/server": "^1.15.0",
  "@orpc/client": "^1.15.0",
  "@orpc/openapi": "^1.15.0",
  "@orpc/zod": "^1.15.0",
  "@orpc/tanstack-query": "^1.15.0",

  "@trpc/tanstack-react-query": "^11.18.0",
  "@trpc/server": "^11.18.0",
  "@trpc/client": "^11.18.0",

  next: "^16.3.4",
  nitro: "3.0.260903-beta",

  convex: "^1.45.0",
  "@convex-dev/react-query": "^0.1.0",
  "@convex-dev/agent": "^0.7.1",
  "@convex-dev/polar": "^0.9.2",
  "convex-svelte": "^0.14.0",
  "convex-nuxt": "0.1.5",
  "convex-vue": "^0.1.5",
  "@convex-dev/better-auth": "^0.12.5",

  "@tanstack/svelte-query": "^6.1.48",
  "@tanstack/svelte-query-devtools": "^6.1.48",

  "@tanstack/vue-query-devtools": "^6.1.48",
  "@tanstack/vue-query": "^5.102.8",

  "@tanstack/react-query-devtools": "^5.102.8",
  "@tanstack/react-query": "^5.102.8",
  "@tanstack/react-form": "^1.33.5",
  "@tanstack/react-router-ssr-query": "^1.167.2",
  "@tanstack/svelte-form": "^1.33.5",

  // Keep this RC set and its exact Query Core dependency aligned (private class types).
  "@tanstack/solid-query": "6.0.0-rc.3",
  "@tanstack/solid-query-devtools": "6.0.0-rc.3",
  "@tanstack/query-core": "5.101.4",

  wrangler: "^4.129.0",
  "@cloudflare/vite-plugin": "1.54.4",
  "@opennextjs/cloudflare": "^1.20.6",
  "@sveltejs/adapter-cloudflare": "^7.2.9",
  "@sveltejs/adapter-node": "^5.5.7",
  "@sveltejs/adapter-vercel": "^6.3.4",
  "@cloudflare/workers-types": "^5.20260906.1",
  "@alchemy.run/frontend-frameworks": "2.0.0-beta.76",
  "@astrojs/node": "^11.1.5",
  "@astrojs/vercel": "^11.0.10",

  // exact pins: caret ranges on prereleases can resolve to stray npm test tags
  alchemy: "2.0.0-beta.76",
  effect: "4.0.0-rc.112",
  "@effect/platform-node": "4.0.0-rc.112",
  "@effect/platform-bun": "4.0.0-rc.112",
  vercel: "^59.11.7",

  "babel-preset-expo": "~57.0.10",
  varlock: "1.18.0",
  "@varlock/vite-integration": "1.5.1",
  "@varlock/nextjs-integration": "1.2.2",
  "@varlock/nuxt-integration": "0.1.1",
  "@varlock/astro-integration": "1.4.1",
  "@varlock/expo-integration": "1.2.1",
  "@varlock/cloudflare-integration": "1.5.1",
  tsdown: "^0.23.0",
  zod: "^4.5.4",

  "@polar-sh/better-auth": "^1.8.4",
  "@polar-sh/checkout": "^0.4.1",
  // Peer range required by @polar-sh/better-auth; update together.
  "@polar-sh/sdk": "^0.47.0",
  "@stripe/react-stripe-js": "^6.9.0",
  "@stripe/stripe-js": "^9.15.0",

  evlog: "^2.28.1",
} as const;

export type AvailableDependencies = keyof typeof dependencyVersionMap;

export type AddDepsOptions = {
  vfs: VirtualFileSystem;
  packagePath: string;
  dependencies?: AvailableDependencies[];
  devDependencies?: AvailableDependencies[];
  customDependencies?: Record<string, string>;
  customDevDependencies?: Record<string, string>;
};

/**
 * Add dependencies to a package.json file in the VFS
 */
export function addPackageDependency(options: AddDepsOptions): void {
  const {
    vfs,
    packagePath,
    dependencies = [],
    devDependencies = [],
    customDependencies = {},
    customDevDependencies = {},
  } = options;

  const pkgJson = vfs.readJson<PackageJson>(packagePath);
  if (!pkgJson) return;

  // Initialize if not present
  pkgJson.dependencies = pkgJson.dependencies || {};
  pkgJson.devDependencies = pkgJson.devDependencies || {};

  // Add regular dependencies
  for (const dep of dependencies) {
    if (!pkgJson.dependencies[dep]) {
      const version = dependencyVersionMap[dep as AvailableDependencies];
      if (!version) {
        throw new Error(
          `Missing version for dependency: ${dep}. Add it to dependencyVersionMap in add-deps.ts`,
        );
      }
      pkgJson.dependencies[dep] = version;
      // A package must not appear in both sections; runtime wins
      delete pkgJson.devDependencies[dep];
    }
  }

  // Add dev dependencies
  for (const dep of devDependencies) {
    if (!pkgJson.devDependencies[dep] && !pkgJson.dependencies[dep]) {
      const version = dependencyVersionMap[dep as AvailableDependencies];
      if (!version) {
        throw new Error(
          `Missing version for devDependency: ${dep}. Add it to dependencyVersionMap in add-deps.ts`,
        );
      }
      pkgJson.devDependencies[dep] = version;
    }
  }

  // Add custom dependencies (with specific versions)
  for (const [dep, version] of Object.entries(customDependencies)) {
    pkgJson.dependencies[dep] = version;
  }

  // Add custom dev dependencies (with specific versions)
  for (const [dep, version] of Object.entries(customDevDependencies)) {
    pkgJson.devDependencies[dep] = version;
  }

  vfs.writeJson(packagePath, pkgJson);
}
