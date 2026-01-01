/**
 * Post-processor - Modifies virtual files after template generation
 * Handles package.json scripts, dependencies, catalogs, and naming
 */

import type { ProjectConfig } from "@better-t-stack/types";

import type { VirtualFileSystem } from "./core/virtual-fs";

type PackageJson = {
  name?: string;
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  workspaces?: string[] | { packages?: string[]; catalog?: Record<string, string> };
  packageManager?: string;
  [key: string]: unknown;
};

type PackageManagerConfig = {
  dev: string;
  build: string;
  checkTypes: string;
  filter: (workspace: string, script: string) => string;
};

/**
 * Run all post-processing steps on the virtual filesystem
 */
export function processPostGeneration(vfs: VirtualFileSystem, config: ProjectConfig): void {
  updatePackageConfigurations(vfs, config);
  processCatalogs(vfs, config);
}

/**
 * Update all package.json files with proper names, scripts, and workspaces
 */
function updatePackageConfigurations(vfs: VirtualFileSystem, config: ProjectConfig): void {
  updateRootPackageJson(vfs, config);

  if (config.backend === "convex") {
    updateConvexPackageJson(vfs, config);
  } else if (config.backend !== "none") {
    updateDbPackageJson(vfs, config);
    updateAuthPackageJson(vfs, config);
    updateApiPackageJson(vfs, config);
  }
}

function updateRootPackageJson(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const pkgJson = vfs.readJson<PackageJson>("package.json");
  if (!pkgJson) return;

  pkgJson.name = config.projectName;
  pkgJson.scripts = pkgJson.scripts || {};

  // Ensure workspaces is an array
  let workspaces: string[] = [];
  if (Array.isArray(pkgJson.workspaces)) {
    workspaces = pkgJson.workspaces;
  } else if (
    pkgJson.workspaces &&
    typeof pkgJson.workspaces === "object" &&
    pkgJson.workspaces.packages
  ) {
    workspaces = pkgJson.workspaces.packages;
  }
  pkgJson.workspaces = workspaces;

  const scripts = pkgJson.scripts;
  const { projectName, packageManager, backend, database, orm, dbSetup, serverDeploy, addons } =
    config;

  const backendPackageName = backend === "convex" ? `@${projectName}/backend` : "server";
  const dbPackageName = `@${projectName}/db`;
  const hasTurborepo = addons.includes("turborepo");

  const needsDbScripts =
    backend !== "convex" && database !== "none" && orm !== "none" && orm !== "mongoose";
  const isD1Alchemy = dbSetup === "d1" && serverDeploy === "cloudflare";

  const pmConfig = getPackageManagerConfig(packageManager, hasTurborepo);

  scripts.dev = pmConfig.dev;
  scripts.build = pmConfig.build;
  scripts["check-types"] = pmConfig.checkTypes;
  scripts["dev:native"] = pmConfig.filter("native", "dev");
  scripts["dev:web"] = pmConfig.filter("web", "dev");

  if (backend !== "self" && backend !== "none") {
    scripts["dev:server"] = pmConfig.filter(backendPackageName, "dev");
  }

  if (backend === "convex") {
    scripts["dev:setup"] = pmConfig.filter(backendPackageName, "dev:setup");
  }

  if (needsDbScripts) {
    scripts["db:push"] = pmConfig.filter(dbPackageName, "db:push");

    if (!isD1Alchemy) {
      scripts["db:studio"] = pmConfig.filter(dbPackageName, "db:studio");
    }

    if (orm === "prisma") {
      scripts["db:generate"] = pmConfig.filter(dbPackageName, "db:generate");
      scripts["db:migrate"] = pmConfig.filter(dbPackageName, "db:migrate");
    } else if (orm === "drizzle") {
      scripts["db:generate"] = pmConfig.filter(dbPackageName, "db:generate");
      if (!isD1Alchemy) {
        scripts["db:migrate"] = pmConfig.filter(dbPackageName, "db:migrate");
      }
    }
  }

  if (database === "sqlite" && dbSetup !== "d1") {
    scripts["db:local"] = pmConfig.filter(dbPackageName, "db:local");
  }

  if (dbSetup === "docker") {
    scripts["db:start"] = pmConfig.filter(dbPackageName, "db:start");
    scripts["db:watch"] = pmConfig.filter(dbPackageName, "db:watch");
    scripts["db:stop"] = pmConfig.filter(dbPackageName, "db:stop");
    scripts["db:down"] = pmConfig.filter(dbPackageName, "db:down");
  }

  // Note: packageManager version is set by CLI at runtime since it requires running the actual CLI
  // For preview purposes, we just show the configured package manager
  pkgJson.packageManager = `${packageManager}@latest`;

  if (backend === "convex") {
    if (!workspaces.includes("packages/*")) {
      workspaces.push("packages/*");
    }
    const needsAppsDir = config.frontend.length > 0 || addons.includes("starlight");
    if (needsAppsDir && !workspaces.includes("apps/*")) {
      workspaces.push("apps/*");
    }
  } else {
    if (!workspaces.includes("apps/*")) {
      workspaces.push("apps/*");
    }
    if (!workspaces.includes("packages/*")) {
      workspaces.push("packages/*");
    }
  }

  vfs.writeJson("package.json", pkgJson);
}

function getPackageManagerConfig(
  packageManager: ProjectConfig["packageManager"],
  hasTurborepo: boolean,
): PackageManagerConfig {
  if (hasTurborepo) {
    return {
      dev: "turbo dev",
      build: "turbo build",
      checkTypes: "turbo check-types",
      filter: (workspace, script) => `turbo -F ${workspace} ${script}`,
    };
  }

  switch (packageManager) {
    case "pnpm":
      return {
        dev: "pnpm -r dev",
        build: "pnpm -r build",
        checkTypes: "pnpm -r check-types",
        filter: (workspace, script) => `pnpm --filter ${workspace} ${script}`,
      };
    case "npm":
      return {
        dev: "npm run dev --workspaces",
        build: "npm run build --workspaces",
        checkTypes: "npm run check-types --workspaces",
        filter: (workspace, script) => `npm run ${script} --workspace ${workspace}`,
      };
    case "bun":
      return {
        dev: "bun run --filter '*' dev",
        build: "bun run --filter '*' build",
        checkTypes: "bun run --filter '*' check-types",
        filter: (workspace, script) => `bun run --filter ${workspace} ${script}`,
      };
  }
}

function updateDbPackageJson(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const pkgJson = vfs.readJson<PackageJson>("packages/db/package.json");
  if (!pkgJson) return;

  pkgJson.name = `@${config.projectName}/db`;
  pkgJson.scripts = pkgJson.scripts || {};

  const scripts = pkgJson.scripts;
  const { database, orm, dbSetup, serverDeploy } = config;
  const isD1Alchemy = dbSetup === "d1" && serverDeploy === "cloudflare";

  if (database !== "none") {
    if (database === "sqlite" && dbSetup !== "d1") {
      scripts["db:local"] = "turso dev --db-file local.db";
    }

    if (orm === "prisma") {
      scripts["db:push"] = "prisma db push";
      scripts["db:generate"] = "prisma generate";
      scripts["db:migrate"] = "prisma migrate dev";
      if (!isD1Alchemy) {
        scripts["db:studio"] = "prisma studio";
      }
    } else if (orm === "drizzle") {
      scripts["db:push"] = "drizzle-kit push";
      scripts["db:generate"] = "drizzle-kit generate";
      if (!isD1Alchemy) {
        scripts["db:studio"] = "drizzle-kit studio";
        scripts["db:migrate"] = "drizzle-kit migrate";
      }
    }
  }

  if (dbSetup === "docker") {
    scripts["db:start"] = "docker compose up -d";
    scripts["db:watch"] = "docker compose up";
    scripts["db:stop"] = "docker compose stop";
    scripts["db:down"] = "docker compose down";
  }

  vfs.writeJson("packages/db/package.json", pkgJson);
}

function updateAuthPackageJson(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const pkgJson = vfs.readJson<PackageJson>("packages/auth/package.json");
  if (!pkgJson) return;

  pkgJson.name = `@${config.projectName}/auth`;
  vfs.writeJson("packages/auth/package.json", pkgJson);
}

function updateApiPackageJson(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const pkgJson = vfs.readJson<PackageJson>("packages/api/package.json");
  if (!pkgJson) return;

  pkgJson.name = `@${config.projectName}/api`;
  vfs.writeJson("packages/api/package.json", pkgJson);
}

function updateConvexPackageJson(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const pkgJson = vfs.readJson<PackageJson>("packages/backend/package.json");
  if (!pkgJson) return;

  pkgJson.name = `@${config.projectName}/backend`;
  pkgJson.scripts = pkgJson.scripts || {};
  vfs.writeJson("packages/backend/package.json", pkgJson);
}

// =============================================================================
// Catalogs - Deduplicate dependencies across packages
// =============================================================================

type CatalogEntry = {
  versions: Set<string>;
  packages: string[];
};

function processCatalogs(vfs: VirtualFileSystem, config: ProjectConfig): void {
  if (config.packageManager === "npm") return;

  const packagePaths = [
    ".",
    "apps/server",
    "apps/web",
    "apps/native",
    "apps/fumadocs",
    "apps/docs",
    "packages/api",
    "packages/db",
    "packages/auth",
    "packages/backend",
    "packages/config",
    "packages/env",
    "packages/infra",
  ];

  type PackageInfo = {
    path: string;
    dependencies: Record<string, string>;
    devDependencies: Record<string, string>;
  };

  const packagesInfo: PackageInfo[] = [];

  for (const pkgPath of packagePaths) {
    const jsonPath = pkgPath === "." ? "package.json" : `${pkgPath}/package.json`;
    const pkgJson = vfs.readJson<PackageJson>(jsonPath);

    if (pkgJson) {
      packagesInfo.push({
        path: pkgPath,
        dependencies: (pkgJson.dependencies || {}) as Record<string, string>,
        devDependencies: (pkgJson.devDependencies || {}) as Record<string, string>,
      });
    }
  }

  const catalog = findDuplicateDependencies(packagesInfo, config.projectName);

  if (Object.keys(catalog).length === 0) return;

  if (config.packageManager === "bun") {
    setupBunCatalogs(vfs, catalog);
  } else if (config.packageManager === "pnpm") {
    setupPnpmCatalogs(vfs, catalog);
  }

  updatePackageJsonsWithCatalogs(vfs, packagesInfo, catalog);
}

function findDuplicateDependencies(
  packagesInfo: {
    path: string;
    dependencies: Record<string, string>;
    devDependencies: Record<string, string>;
  }[],
  projectName: string,
): Record<string, string> {
  const depCount = new Map<string, CatalogEntry>();
  const projectScope = `@${projectName}/`;

  for (const pkg of packagesInfo) {
    const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };

    for (const [depName, version] of Object.entries(allDeps)) {
      if (depName.startsWith(projectScope)) continue;
      if (version.startsWith("workspace:")) continue;

      const existing = depCount.get(depName);
      if (existing) {
        existing.versions.add(version);
        existing.packages.push(pkg.path);
      } else {
        depCount.set(depName, {
          versions: new Set([version]),
          packages: [pkg.path],
        });
      }
    }
  }

  const catalog: Record<string, string> = {};
  for (const [depName, info] of depCount.entries()) {
    if (info.packages.length > 1 && info.versions.size === 1) {
      const version = Array.from(info.versions)[0];
      if (version) {
        catalog[depName] = version;
      }
    }
  }

  return catalog;
}

function setupBunCatalogs(vfs: VirtualFileSystem, catalog: Record<string, string>): void {
  const pkgJson = vfs.readJson<PackageJson>("package.json");
  if (!pkgJson) return;

  if (!pkgJson.workspaces) {
    pkgJson.workspaces = {};
  }

  if (Array.isArray(pkgJson.workspaces)) {
    pkgJson.workspaces = {
      packages: pkgJson.workspaces,
      catalog,
    };
  } else if (typeof pkgJson.workspaces === "object") {
    const ws = pkgJson.workspaces as { packages?: string[]; catalog?: Record<string, string> };
    if (!ws.catalog) {
      ws.catalog = {};
    }
    ws.catalog = { ...ws.catalog, ...catalog };
  }

  vfs.writeJson("package.json", pkgJson);
}

function setupPnpmCatalogs(vfs: VirtualFileSystem, catalog: Record<string, string>): void {
  const content = vfs.readFile("pnpm-workspace.yaml");
  if (!content) return;

  // Simple YAML handling - add catalog section
  // Note: For full YAML support, we'd need a YAML library, but for preview this is sufficient
  const lines = content.split("\n");
  const hasExistingCatalog = lines.some((line) => line.startsWith("catalog:"));

  if (hasExistingCatalog) {
    // Find catalog section and append
    const catalogIndex = lines.findIndex((line) => line.startsWith("catalog:"));
    const catalogEntries = Object.entries(catalog).map(
      ([name, version]) => `  ${name}: "${version}"`,
    );
    lines.splice(catalogIndex + 1, 0, ...catalogEntries);
  } else {
    // Add new catalog section
    lines.push("catalog:");
    for (const [name, version] of Object.entries(catalog)) {
      lines.push(`  ${name}: "${version}"`);
    }
  }

  vfs.writeFile("pnpm-workspace.yaml", lines.join("\n"));
}

function updatePackageJsonsWithCatalogs(
  vfs: VirtualFileSystem,
  packagesInfo: {
    path: string;
    dependencies: Record<string, string>;
    devDependencies: Record<string, string>;
  }[],
  catalog: Record<string, string>,
): void {
  for (const pkg of packagesInfo) {
    const jsonPath = pkg.path === "." ? "package.json" : `${pkg.path}/package.json`;
    const pkgJson = vfs.readJson<PackageJson>(jsonPath);
    if (!pkgJson) continue;

    let updated = false;

    if (pkgJson.dependencies) {
      for (const depName of Object.keys(pkgJson.dependencies)) {
        if (catalog[depName]) {
          (pkgJson.dependencies as Record<string, string>)[depName] = "catalog:";
          updated = true;
        }
      }
    }

    if (pkgJson.devDependencies) {
      for (const depName of Object.keys(pkgJson.devDependencies)) {
        if (catalog[depName]) {
          (pkgJson.devDependencies as Record<string, string>)[depName] = "catalog:";
          updated = true;
        }
      }
    }

    if (updated) {
      vfs.writeJson(jsonPath, pkgJson);
    }
  }
}
