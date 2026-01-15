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
  typescript: "^5",

  "better-auth": "^1.4.9",
  "@better-auth/expo": "^1.4.9",

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
  pg: "^8.17.1",
  "@types/pg": "^8.16.0",
  "@types/ws": "^8.18.1",
  ws: "^8.18.3",

  mysql2: "^3.14.0",

  "@prisma/client": "^7.2.0",
  prisma: "^7.2.0",
  "@prisma/adapter-d1": "^7.2.0",
  "@prisma/adapter-neon": "^7.2.0",
  "@prisma/adapter-mariadb": "^7.2.0",
  "@prisma/adapter-libsql": "^7.2.0",
  "@prisma/adapter-better-sqlite3": "^7.2.0",
  "@prisma/adapter-pg": "^7.2.0",
  "@prisma/adapter-planetscale": "^7.2.0",

  mongoose: "^8.14.0",

  "vite-plugin-pwa": "^1.0.1",
  "@vite-pwa/assets-generator": "^1.0.0",

  "@tauri-apps/cli": "^2.4.0",

  "@biomejs/biome": "^2.2.0",

  oxlint: "^1.34.0",
  oxfmt: "^0.19.0",

  husky: "^9.1.7",
  lefthook: "^2.0.13",
  "lint-staged": "^16.1.2",

  tsx: "^4.19.2",
  "@types/node": "^22.13.14",

  "@types/bun": "^1.3.4",

  "@elysiajs/node": "^1.3.1",

  "@elysiajs/cors": "^1.4.1",
  "@elysiajs/trpc": "^1.1.0",
  elysia: "^1.4.21",

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

  ai: "^6.0.3",
  "@ai-sdk/google": "^3.0.1",
  "@ai-sdk/vue": "^3.0.3",
  "@ai-sdk/svelte": "^4.0.3",
  "@ai-sdk/react": "^3.0.3",
  "@ai-sdk/devtools": "^0.0.2",
  streamdown: "^1.6.10",
  shiki: "^3.20.0",

  "@orpc/server": "^1.12.2",
  "@orpc/client": "^1.12.2",
  "@orpc/openapi": "^1.12.2",
  "@orpc/zod": "^1.12.2",
  "@orpc/tanstack-query": "^1.12.2",

  "@trpc/tanstack-react-query": "^11.7.2",
  "@trpc/server": "^11.7.2",
  "@trpc/client": "^11.7.2",

  next: "^16.1.1",

  convex: "^1.31.2",
  "@convex-dev/react-query": "^0.1.0",
  "@convex-dev/agent": "^0.3.2",
  "convex-svelte": "^0.0.12",
  "convex-nuxt": "0.1.5",
  "convex-vue": "^0.1.5",
  "@convex-dev/better-auth": "^0.10.9",

  "@tanstack/svelte-query": "^5.85.3",
  "@tanstack/svelte-query-devtools": "^5.85.3",

  "@tanstack/vue-query-devtools": "^5.90.2",
  "@tanstack/vue-query": "^5.90.2",

  "@tanstack/react-query-devtools": "^5.91.1",
  "@tanstack/react-query": "^5.90.12",
  "@tanstack/react-router-ssr-query": "^1.142.7",

  "@tanstack/solid-query": "^5.87.4",
  "@tanstack/solid-query-devtools": "^5.87.4",
  "@tanstack/solid-router-devtools": "^1.131.44",

  wrangler: "^4.54.0",
  "@cloudflare/vite-plugin": "^1.17.1",
  "@opennextjs/cloudflare": "^1.14.6",
  "nitro-cloudflare-dev": "^0.2.2",
  "@sveltejs/adapter-cloudflare": "^7.2.4",
  "@cloudflare/workers-types": "^4.20251213.0",

  alchemy: "^0.82.1",

  dotenv: "^17.2.2",
  tsdown: "^0.16.5",
  zod: "^4.1.13",
  "@t3-oss/env-core": "^0.13.1",
  "@t3-oss/env-nextjs": "^0.13.1",
  "@t3-oss/env-nuxt": "^0.13.1",
  srvx: "0.8.15",

  "@polar-sh/better-auth": "^1.1.3",
  "@polar-sh/sdk": "^0.34.16",
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
