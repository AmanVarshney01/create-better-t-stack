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

  "better-auth": "1.6.22",
  "@better-auth/expo": "1.6.22",

  "@clerk/backend": "^3.2.1",
  "@clerk/express": "^2.0.5",
  "@clerk/fastify": "^3.1.3",
  "@clerk/nextjs": "^7.0.5",
  "@clerk/react": "^6.1.1",
  "@clerk/react-router": "^3.0.5",
  "@clerk/tanstack-react-start": "^1.1.3",
  "@clerk/expo": "^3.1.3",

  "drizzle-orm": "^0.45.1",
  "drizzle-kit": "^0.31.8",
  "@planetscale/database": "^1.19.0",

  "@libsql/client": "0.15.15",
  libsql: "0.5.22",

  "@neondatabase/serverless": "^1.0.2",
  pg: "^8.17.1",
  "@types/pg": "^8.16.0",
  "@types/ws": "^8.18.1",
  ws: "^8.18.3",

  mysql2: "^3.14.0",

  "@prisma/client": "^7.8.0",
  prisma: "^7.8.0",
  "@prisma/adapter-d1": "^7.8.0",
  "@prisma/adapter-neon": "^7.8.0",
  "@prisma/adapter-mariadb": "^7.8.0",
  "@prisma/adapter-libsql": "^7.8.0",
  "@prisma/adapter-better-sqlite3": "^7.8.0",
  "@prisma/adapter-pg": "^7.8.0",
  "@prisma/adapter-planetscale": "^7.8.0",

  mongoose: "^9.6.2",
  mongodb: "^7.2.0",

  "vite-plugin-pwa": "^1.3.0",
  "@vite-pwa/assets-generator": "^1.0.2",

  "@tauri-apps/cli": "^2.11.2",

  "@biomejs/biome": "^2.4.16",

  oxlint: "^1.68.0",
  oxfmt: "^0.53.0",

  husky: "^9.1.7",
  lefthook: "^2.1.9",
  "lint-staged": "^17.0.7",

  tsx: "^4.19.2",
  "@types/node": "^22.13.14",

  "@types/bun": "^1.3.4",

  "@elysiajs/node": "^1.4.5",

  "@elysiajs/cors": "^1.4.1",
  "@elysiajs/trpc": "^1.1.0",
  elysia: "^1.4.28",
  // Peer dep of elysia; Bun isolated linker won't install peers, so Node/tsx fails without it.
  "@sinclair/typebox": "^0.34.49",

  "@hono/node-server": "^1.14.4",
  "@hono/trpc-server": "^0.4.0",
  hono: "^4.8.2",

  cors: "^2.8.5",
  express: "^5.1.0",
  "@types/express": "^5.0.1",
  "@types/cors": "^2.8.17",

  fastify: "^5.3.3",
  "@fastify/cors": "^11.0.1",

  turbo: "^2.10.2",
  nx: "^22.7.5",
  "vite-plus": "0.1.24",
  rolldown: "1.1.0",

  ai: "^7.0.3",
  "@ai-sdk/google": "^4.0.1",
  "@ai-sdk/vue": "^4.0.3",
  "@ai-sdk/svelte": "^5.0.3",
  "@ai-sdk/react": "^4.0.4",
  "@ai-sdk/devtools": "^1.0.0",
  streamdown: "^2.5.0",
  shiki: "^3.20.0",

  "@orpc/server": "^1.14.6",
  "@orpc/client": "^1.14.6",
  "@orpc/openapi": "^1.14.6",
  "@orpc/zod": "^1.14.6",
  "@orpc/tanstack-query": "^1.14.6",

  "@trpc/tanstack-react-query": "^11.16.0",
  "@trpc/server": "^11.16.0",
  "@trpc/client": "^11.16.0",

  next: "^16.2.0",
  nitro: "^3.0.260429-beta",

  convex: "^1.42.0",
  "@convex-dev/react-query": "^0.1.0",
  "@convex-dev/agent": "^0.6.4",
  "@convex-dev/polar": "^0.9.2",
  "convex-svelte": "^0.14.0",
  "convex-nuxt": "0.1.5",
  "convex-vue": "^0.1.5",
  "@convex-dev/better-auth": "^0.12.5",

  "@tanstack/svelte-query": "^5.85.3",
  "@tanstack/svelte-query-devtools": "^5.85.3",

  "@tanstack/vue-query-devtools": "^6.1.5",
  "@tanstack/vue-query": "^5.92.9",

  "@tanstack/react-query-devtools": "^5.91.1",
  "@tanstack/react-query": "^5.90.12",
  "@tanstack/react-form": "^1.28.0",
  "@tanstack/react-router-ssr-query": "^1.166.11",
  "@tanstack/solid-form": "^1.28.0",
  "@tanstack/svelte-form": "^1.28.0",

  "@tanstack/solid-query": "^5.99.1",
  "@tanstack/solid-query-devtools": "^5.99.1",
  "@tanstack/solid-router-devtools": "^1.166.13",

  wrangler: "^4.103.0",
  "@cloudflare/vite-plugin": "^1.17.1",
  "@opennextjs/cloudflare": "^1.17.3",
  "nitro-cloudflare-dev": "^0.2.2",
  "@sveltejs/adapter-cloudflare": "^7.2.8",
  "@sveltejs/adapter-node": "^5.5.4",
  "@cloudflare/workers-types": "^4.20260621.1",
  "@astrojs/cloudflare": "^14.0.1",
  "@astrojs/node": "^11.0.0",
  "@astrojs/vercel": "^11.0.1",

  alchemy: "^0.91.2",
  vercel: "^54.18.6",

  dotenv: "^17.2.2",
  tsdown: "^0.21.9",
  zod: "^4.1.13",
  "@t3-oss/env-core": "^0.13.1",
  "@t3-oss/env-nextjs": "^0.13.1",
  "@t3-oss/env-nuxt": "^0.13.1",

  "@polar-sh/better-auth": "^1.8.4",
  "@polar-sh/checkout": "^0.2.1",
  "@polar-sh/sdk": "^0.47.1",
  "@stripe/react-stripe-js": "^4.0.2",
  "@stripe/stripe-js": "^7.9.0",

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
    }
  }

  // Add dev dependencies
  for (const dep of devDependencies) {
    if (!pkgJson.devDependencies[dep]) {
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
