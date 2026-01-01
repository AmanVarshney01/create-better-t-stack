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

export type AddDepsOptions = {
  vfs: VirtualFileSystem;
  packagePath: string;
  dependencies?: string[];
  devDependencies?: string[];
  customDependencies?: Record<string, string>;
  customDevDependencies?: Record<string, string>;
};

/**
 * Get the latest version placeholder for a dependency
 */
function getLatestVersion(dep: string): string {
  // Known versions for specific packages
  const versions: Record<string, string> = {
    // Prisma
    "@prisma/client": "^6.19.0",
    prisma: "^6.19.0",
    // Drizzle
    "drizzle-orm": "^0.44.2",
    "drizzle-kit": "^0.30.6",
    // Auth
    "better-auth": "^1.4.9",
    "@better-auth/expo": "^1.4.9",
    "@convex-dev/better-auth": "^0.1.8",
    "@clerk/nextjs": "^6.23.1",
    "@clerk/clerk-react": "^5.30.0",
    "@clerk/tanstack-react-start": "^0.1.6",
    "@clerk/clerk-expo": "^2.10.2",
    // Tanstack
    "@tanstack/react-query": "^5.80.7",
    "@trpc/client": "^11.1.2",
    "@trpc/server": "^11.1.2",
    "@trpc/tanstack-react-query": "^11.1.2",
    // Database adapters
    "@libsql/client": "^0.14.0",
    libsql: "^0.5.5",
    "@neondatabase/serverless": "^1.0.0",
    "@planetscale/database": "^1.19.0",
    pg: "^8.16.0",
    mysql2: "^3.14.1",
    mongoose: "^8.15.1",
    // Payments
    "polar-sdk": "^0.26.1",
    // Common
    zod: "^3.25.49",
    dotenv: "^16.5.0",
    typescript: "^5.8.3",
    hono: "^4.8.3",
    "@types/node": "^22.15.32",
    "@types/bun": "^1.2.15",
    "@types/pg": "^8.11.14",
    "@types/ws": "^8.18.1",
    ws: "^8.18.0",
    tsdown: "^0.18.2",
    // Convex
    convex: "^1.26.1",
    "@convex-dev/agent": "^0.2.1",
  };

  return versions[dep] || "latest";
}

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
      pkgJson.dependencies[dep] = getLatestVersion(dep);
    }
  }

  // Add dev dependencies
  for (const dep of devDependencies) {
    if (!pkgJson.devDependencies[dep]) {
      pkgJson.devDependencies[dep] = getLatestVersion(dep);
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
