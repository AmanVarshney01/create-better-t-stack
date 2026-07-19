/**
 * Add dependencies to a package.json in the virtual filesystem
 */

import type { VirtualFileSystem } from "../core/virtual-fs";

type PackageJson = {
  name?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  [key: string]: unknown;
};

export const dependencyVersionMap = {
  typescript: "^6",

  "better-auth": "1.6.23",
  "@better-auth/expo": "1.6.23",

  "@clerk/backend": "^3.10.0",
  "@clerk/express": "^2.1.35",
  "@clerk/fastify": "^3.1.45",
  "@clerk/nextjs": "^7.5.12",
  "@clerk/react": "^6.11.3",
  "@clerk/react-router": "^3.5.4",
  "@clerk/tanstack-react-start": "^1.4.12",
  "@clerk/expo": "^3.6.5",

  "drizzle-orm": "^0.45.2",
  "drizzle-kit": "^0.31.10",
  "@planetscale/database": "^1.20.1",

  "@libsql/client": "0.17.4",
  libsql: "0.5.29",

  "@neondatabase/serverless": "^1.1.0",
  pg: "^8.22.0",
  "@types/pg": "^8.20.0",
  "@types/ws": "^8.18.1",
  ws: "^8.21.0",

  mysql2: "^3.22.5",

  "@prisma/client": "^7.8.0",
  prisma: "^7.8.0",
  "@prisma/adapter-d1": "^7.8.0",
  "@prisma/adapter-neon": "^7.8.0",
  "@prisma/adapter-mariadb": "^7.8.0",
  "@prisma/adapter-libsql": "^7.8.0",
  "@prisma/adapter-better-sqlite3": "^7.8.0",
  "@prisma/adapter-pg": "^7.8.0",
  "@prisma/adapter-planetscale": "^7.8.0",

  mongoose: "^9.7.3",
  mongodb: "^7.4.0",

  "vite-plugin-pwa": "^1.3.0",
  "@vite-pwa/assets-generator": "^1.0.2",

  "@tauri-apps/cli": "^2.11.4",

  "@biomejs/biome": "^2.5.2",

  oxlint: "^1.72.0",
  oxfmt: "^0.57.0",

  husky: "^9.1.7",
  lefthook: "^2.1.9",
  "lint-staged": "^17.0.7",

  tsx: "^4.22.5",
  "@types/node": "^22.13.14",

  "@types/bun": "^1.3.14",

  "@elysiajs/node": "^1.4.5",

  "@elysiajs/cors": "^1.4.2",
  "@elysiajs/trpc": "^1.1.0",
  elysia: "^1.4.29",
  // Peer dep of elysia; Bun isolated linker won't install peers, so Node/tsx fails without it.
  "@sinclair/typebox": "^0.34.49",

  "@hono/node-server": "^2.0.8",
  "@hono/trpc-server": "^0.4.2",
  hono: "^4.12.27",

  cors: "^2.8.6",
  express: "^5.2.1",
  "@types/express": "^5.0.6",
  "@types/cors": "^2.8.19",

  fastify: "^5.9.0",
  "@fastify/cors": "^11.2.0",

  turbo: "^2.10.2",
  nx: "^23.0.1",
  "vite-plus": "0.2.2",
  rolldown: "1.1.4",

  ai: "^7.0.13",
  "@ai-sdk/google": "^4.0.7",
  "@ai-sdk/vue": "^4.0.13",
  "@ai-sdk/svelte": "^5.0.13",
  "@ai-sdk/react": "^4.0.14",
  "@ai-sdk/devtools": "^1.0.1",
  streamdown: "^2.5.0",
  shiki: "^4.3.0",

  "@orpc/server": "^1.14.6",
  "@orpc/client": "^1.14.6",
  "@orpc/openapi": "^1.14.6",
  "@orpc/zod": "^1.14.6",
  "@orpc/tanstack-query": "^1.14.6",

  "@trpc/tanstack-react-query": "^11.18.0",
  "@trpc/server": "^11.18.0",
  "@trpc/client": "^11.18.0",

  next: "^16.2.0",
  nitro: "^3.0.260610-beta",

  convex: "^1.42.1",
  "@convex-dev/react-query": "^0.1.0",
  "@convex-dev/agent": "^0.6.4",
  "@convex-dev/polar": "^0.9.2",
  "convex-svelte": "^0.14.0",
  "convex-nuxt": "0.1.5",
  "convex-vue": "^0.1.5",
  "@convex-dev/better-auth": "^0.12.5",

  "@tanstack/svelte-query": "^6.1.36",
  "@tanstack/svelte-query-devtools": "^6.1.36",

  "@tanstack/vue-query-devtools": "^6.1.36",
  "@tanstack/vue-query": "^5.101.2",

  "@tanstack/react-query-devtools": "^5.101.2",
  "@tanstack/react-query": "^5.101.2",
  "@tanstack/react-form": "^1.33.0",
  "@tanstack/react-router-ssr-query": "^1.167.1",
  "@tanstack/solid-form": "^1.33.0",
  "@tanstack/svelte-form": "^1.33.0",

  "@tanstack/solid-query": "^5.101.2",
  "@tanstack/solid-query-devtools": "^5.101.2",
  "@tanstack/solid-router-devtools": "^1.167.0",

  wrangler: "^4.107.0",
  // Alchemy 0.93.12 shares persisted Miniflare state with this plugin.
  // Newer plugin releases use an incompatible workerd alarm-table schema.
  "@cloudflare/vite-plugin": "1.43.0",
  "@opennextjs/cloudflare": "^1.20.1",
  "nitro-cloudflare-dev": "^0.2.2",
  "@sveltejs/adapter-cloudflare": "^7.2.9",
  "@sveltejs/adapter-node": "^5.5.7",
  "@sveltejs/adapter-vercel": "^6.3.4",
  "@cloudflare/workers-types": "^4.20260702.1",
  "@astrojs/cloudflare": "^14.1.0",
  "@astrojs/node": "^11.0.1",
  "@astrojs/vercel": "^11.0.1",

  alchemy: "^0.93.12",
  vercel: "^54.18.6",

  dotenv: "^17.4.2",
  tsdown: "^0.22.3",
  zod: "^4.4.3",
  "@t3-oss/env-core": "^0.13.11",
  "@t3-oss/env-nextjs": "^0.13.11",
  "@t3-oss/env-nuxt": "^0.13.11",

  "@polar-sh/better-auth": "^1.8.4",
  "@polar-sh/checkout": "^0.4.0",
  "@polar-sh/sdk": "^0.47.1",
  "@stripe/react-stripe-js": "^5.6.1",
  "@stripe/stripe-js": "^8.11.0",

  evlog: "^2.19.2",
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
