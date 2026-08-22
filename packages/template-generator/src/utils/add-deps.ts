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
  typescript: "^6.0.3",

  "better-auth": "1.6.30",
  "@better-auth/expo": "1.6.30",

  "@clerk/backend": "^3.16.10",
  "@clerk/express": "^2.1.61",
  "@clerk/fastify": "^3.1.71",
  "@clerk/nextjs": "^7.8.0",
  "@clerk/react": "^6.14.5",
  "@clerk/react-router": "^3.6.15",
  "@react-router/express": "^8.3.0",
  "@clerk/tanstack-react-start": "^1.5.6",
  "@clerk/expo": "^4.5.2",

  "drizzle-orm": "^0.45.2",
  "drizzle-kit": "^0.31.10",
  "@planetscale/database": "^1.20.1",

  "@libsql/client": "0.17.4",
  libsql: "0.5.29",

  "@neondatabase/serverless": "^1.1.0",
  pg: "^8.22.0",
  postgres: "^3.4.9",
  "@types/pg": "^8.20.0",
  "@types/ws": "^8.18.1",
  ws: "^8.21.1",

  mysql2: "^3.23.2",

  "@prisma/client": "^7.9.1",
  prisma: "^7.9.1",
  "@prisma/adapter-d1": "^7.9.1",
  "@prisma/adapter-neon": "^7.9.1",
  "@prisma/adapter-mariadb": "^7.9.1",
  "@prisma/adapter-libsql": "^7.9.1",
  "@prisma/adapter-better-sqlite3": "^7.9.1",
  "@prisma/adapter-pg": "^7.9.1",
  "@prisma/adapter-ppg": "^7.9.1",
  "@prisma/adapter-planetscale": "^7.9.1",

  mongoose: "^9.8.1",
  mongodb: "^7.5.0",

  "vite-plugin-pwa": "^1.3.0",
  "@vite-pwa/assets-generator": "^1.0.2",

  "@tauri-apps/cli": "^2.11.4",

  "@biomejs/biome": "^2.5.6",

  oxlint: "^1.78.0",
  oxfmt: "^0.63.0",

  husky: "^9.1.7",
  lefthook: "^2.1.10",
  "lint-staged": "^17.2.0",

  tsx: "^4.23.1",
  "@types/node": "^26.2.0",

  "@types/bun": "^1.3.14",

  "@elysiajs/node": "^1.4.5",

  "@elysiajs/cors": "^1.4.2",
  "@elysiajs/trpc": "^1.1.0",
  elysia: "^1.4.29",
  // Peer dep of elysia; Bun isolated linker won't install peers, so Node/tsx fails without it.
  "@sinclair/typebox": "^0.34.52",

  "@hono/node-server": "^2.0.12",
  "@hono/trpc-server": "^0.4.2",
  hono: "^4.12.32",

  cors: "^2.8.6",
  express: "^5.2.1",
  "@types/express": "^5.0.6",
  "@types/cors": "^2.8.19",

  fastify: "^5.10.0",
  "@fastify/cors": "^11.3.0",

  turbo: "^2.10.7",
  nx: "^23.1.0",
  "vite-plus": "0.2.6",
  rolldown: "1.2.0",
  unwasm: "^0.6.0",

  ai: "^7.0.41",
  "@ai-sdk/google": "^4.0.27",
  "@ai-sdk/vue": "^4.0.41",
  "@ai-sdk/svelte": "^5.0.41",
  "@ai-sdk/react": "^4.0.44",
  "@ai-sdk/devtools": "^1.0.8",
  streamdown: "^2.5.0",
  shiki: "^4.3.1",

  "@orpc/server": "^1.14.12",
  "@orpc/client": "^1.14.12",
  "@orpc/openapi": "^1.14.12",
  "@orpc/zod": "^1.14.12",
  "@orpc/tanstack-query": "^1.14.12",

  "@trpc/tanstack-react-query": "^11.18.0",
  "@trpc/server": "^11.18.0",
  "@trpc/client": "^11.18.0",

  next: "^16.3.0",
  nitro: "^3.0.260610-beta",

  convex: "^1.45.0",
  "@convex-dev/react-query": "^0.1.0",
  "@convex-dev/agent": "^0.6.4",
  "@convex-dev/polar": "^0.9.2",
  "convex-svelte": "^0.14.0",
  "convex-nuxt": "0.1.5",
  "convex-vue": "^0.1.5",
  "@convex-dev/better-auth": "^0.12.5",

  "@tanstack/svelte-query": "^6.1.38",
  "@tanstack/svelte-query-devtools": "^6.1.38",

  "@tanstack/vue-query-devtools": "^6.1.38",
  "@tanstack/vue-query": "^5.101.4",

  "@tanstack/react-query-devtools": "^5.101.4",
  "@tanstack/react-query": "^5.101.4",
  "@tanstack/react-form": "^1.33.2",
  "@tanstack/react-router-ssr-query": "^1.167.1",
  "@tanstack/svelte-form": "^1.33.2",

  "@tanstack/solid-query": "^6.0.0-rc.0",
  "@tanstack/solid-query-devtools": "^6.0.0-rc.0",
  "@tanstack/query-core": "5.101.0",

  wrangler: "^4.115.0",
  "@cloudflare/vite-plugin": "1.48.0",
  "@opennextjs/cloudflare": "^1.20.2",
  "@sveltejs/adapter-cloudflare": "^7.2.9",
  "@sveltejs/adapter-node": "^5.5.7",
  "@sveltejs/adapter-vercel": "^6.3.4",
  "@cloudflare/workers-types": "^5.20260728.1",
  "@alchemy.run/cloudflare-frameworks": "2.0.0-beta.72",
  "@astrojs/node": "^11.0.3",
  "@astrojs/vercel": "^11.0.4",

  // exact pins: caret ranges on prereleases can resolve to stray npm test tags
  alchemy: "2.0.0-beta.72",
  effect: "4.0.0-rc.108",
  "@effect/platform-node": "4.0.0-rc.108",
  "@effect/platform-bun": "4.0.0-rc.108",
  vercel: "^58.1.0",

  dotenv: "^17.4.2",
  tsdown: "^0.22.14",
  zod: "^4.4.3",
  "@t3-oss/env-core": "^0.13.11",
  "@t3-oss/env-nextjs": "^0.13.11",
  "@t3-oss/env-nuxt": "^0.13.11",

  "@polar-sh/better-auth": "^1.8.4",
  "@polar-sh/checkout": "^0.4.0",
  "@polar-sh/sdk": "^0.47.0",
  "@stripe/react-stripe-js": "^6.8.0",
  "@stripe/stripe-js": "^9.12.1",

  evlog: "^2.22.4",
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
