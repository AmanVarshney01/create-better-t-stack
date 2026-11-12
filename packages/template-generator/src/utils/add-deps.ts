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

  "better-auth": "1.7.22",
  "@better-auth/core": "1.7.22",
  "@better-auth/drizzle-adapter": "1.7.22",
  "@better-auth/expo": "1.7.22",

  "@clerk/backend": "^3.27.0",
  "@clerk/express": "^2.1.88",
  "@clerk/fastify": "^3.1.98",
  "@clerk/nextjs": "^7.9.25",
  "@clerk/react": "^6.18.6",
  "@clerk/react-router": "^3.7.0",
  "@react-router/express": "^8.5.1",
  "@clerk/tanstack-react-start": "^1.7.11",
  "@clerk/expo": "^4.15.1",

  "drizzle-orm": "1.0.0-rc.5",
  "drizzle-kit": "1.0.0-rc.5",
  // Intentional: drizzle-orm's planetscale-serverless driver still passes query params, which
  // @planetscale/database 2.0 rejects (drizzle-team/drizzle-orm#6398).
  "@planetscale/database": "^1.20.1",

  "@libsql/client": "0.18.0",
  libsql: "0.5.29",

  "@neondatabase/serverless": "^1.2.0",
  pg: "^8.23.1",
  postgres: "^4.1.1",
  "@types/pg": "^8.23.1",
  "@types/ws": "^8.18.2",
  ws: "^8.22.2",

  mysql2: "^3.24.6",

  "@prisma/client": "^7.10.1",
  prisma: "^7.10.1",
  "@prisma/adapter-d1": "^7.10.1",
  "@prisma/adapter-neon": "^7.10.1",
  "@prisma/adapter-mariadb": "^7.10.1",
  "@prisma/adapter-libsql": "^7.10.1",
  "@prisma/adapter-better-sqlite3": "^7.10.1",
  "@prisma/adapter-pg": "^7.10.1",
  "@prisma/adapter-ppg": "^7.10.1",
  "@prisma/adapter-planetscale": "^7.10.1",

  mongoose: "^9.12.1",
  mongodb: "^7.8.0",

  "vite-plugin-pwa": "^2.0.0",
  "@vite-pwa/assets-generator": "^2.0.0",
  "workbox-window": "^7.4.1",

  "@tauri-apps/cli": "^2.12.4",

  "@biomejs/biome": "^2.6.7",

  oxlint: "^1.93.0",
  oxfmt: "^0.78.0",

  husky: "^9.1.7",
  lefthook: "^2.2.2",
  "lint-staged": "^17.6.0",

  tsx: "^4.23.15",
  "@types/node": "^26.6.6",

  "@types/bun": "^1.4.4",

  "@elysiajs/node": "^1.4.5",

  "@elysiajs/cors": "^1.4.3",
  "@elysiajs/trpc": "^1.1.0",
  elysia: "^1.4.32",
  // Peer dep of elysia; Bun isolated linker won't install peers, so Node/tsx fails without it.
  "@sinclair/typebox": "^0.34.52",

  "@hono/node-server": "^2.1.8",
  "@hono/trpc-server": "^0.4.2",
  hono: "^4.13.18",

  cors: "^2.8.6",
  express: "^5.3.0",
  "@types/express": "^5.0.6",
  "@types/cors": "^2.8.19",

  fastify: "^5.12.8",
  "@fastify/cors": "^11.4.1",

  turbo: "^2.11.11",
  nx: "^24.0.6",
  "vite-plus": "1.6.0",
  rolldown: "1.3.2",
  unwasm: "^0.6.3",

  ai: "^7.0.170",
  "@ai-sdk/google": "^4.0.118",
  "@ai-sdk/vue": "^4.0.170",
  "@ai-sdk/svelte": "^5.0.170",
  "@ai-sdk/react": "^4.0.174",
  "@ai-sdk/devtools": "^1.0.73",
  streamdown: "^2.7.1",
  shiki: "^4.6.0",

  "@orpc/server": "^1.16.2",
  "@orpc/client": "^1.16.2",
  "@orpc/openapi": "^1.16.2",
  "@orpc/zod": "^1.16.2",
  "@orpc/tanstack-query": "^1.16.2",

  "@trpc/tanstack-react-query": "^11.28.0",
  "@trpc/server": "^11.28.0",
  "@trpc/client": "^11.28.0",

  next: "^16.4.6",
  nitro: "3.0.261103-rc",

  convex: "^1.49.0",
  "@convex-dev/react-query": "^0.1.0",
  "@convex-dev/agent": "^0.7.9",
  "@convex-dev/polar": "^0.9.2",
  "convex-svelte": "^0.15.1",
  "convex-nuxt": "0.1.5",
  "convex-vue": "^0.1.5",
  "@convex-dev/better-auth": "^0.13.0",

  "@tanstack/svelte-query": "^6.4.1",
  "@tanstack/svelte-query-devtools": "^6.4.1",

  "@tanstack/vue-query-devtools": "^6.4.1",
  "@tanstack/vue-query": "^5.107.1",

  "@tanstack/react-query-devtools": "^5.107.1",
  "@tanstack/react-query": "^5.107.1",
  "@tanstack/react-form": "^1.33.5",
  "@tanstack/react-router-ssr-query": "^1.167.3",
  "@tanstack/svelte-form": "^1.33.5",

  // Keep this RC set and its exact Query Core dependency aligned (private class types).
  "@tanstack/solid-query": "6.0.0-rc.5",
  "@tanstack/query-core": "5.101.4",

  wrangler: "^4.161.0",
  "@cloudflare/vite-plugin": "1.69.1",
  "@opennextjs/cloudflare": "^1.20.17",
  "@sveltejs/adapter-cloudflare": "^8.0.2",
  "@sveltejs/adapter-node": "^6.0.2",
  "@sveltejs/adapter-vercel": "^7.0.3",
  "@cloudflare/workers-types": "^5.20261112.1",
  "@alchemy.run/frontend-frameworks": "2.0.0-beta.86",
  "@astrojs/node": "^11.1.12",
  "@astrojs/vercel": "^11.0.21",

  // exact pins: caret ranges on prereleases can resolve to stray npm test tags
  "@vercel/nft": "^1.11.1",
  alchemy: "2.0.0-beta.86",
  "@alchemy.run/axiom": "2.0.0-beta.86",
  "@alchemy.run/cloudflare": "2.0.0-beta.86",
  "@alchemy.run/neon": "2.0.0-beta.86",
  "@alchemy.run/planetscale": "2.0.0-beta.86",
  "@alchemy.run/prisma": "2.0.0-beta.86",
  effect: "4.1.4",
  "@effect/platform-node": "4.1.4",
  "@effect/platform-bun": "4.1.4",

  "babel-preset-expo": "~58.0.25",
  varlock: "1.24.0",
  "@varlock/vite-integration": "1.5.5",
  "@varlock/nextjs-integration": "2.0.0",
  "@varlock/nuxt-integration": "0.1.5",
  "@varlock/astro-integration": "1.4.5",
  "@varlock/expo-integration": "1.2.2",
  "@varlock/cloudflare-integration": "1.6.3",
  tsdown: "^0.23.7",
  zod: "^4.6.7",

  "@polar-sh/better-auth": "^2.1.4",
  "@polar-sh/checkout": "^0.6.0",
  "@polar-sh/sdk": "^1.1.0",
  "@stripe/react-stripe-js": "^7.0.1",
  "@stripe/stripe-js": "^10.2.1",

  evlog: "^2.35.1",
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
