/**
 * Catalogs post-processor
 * Deduplicates dependencies across packages using pnpm/bun catalogs
 */

import type { ProjectConfig } from "@better-fullstack/types";

import yaml from "yaml";

import type { VirtualFileSystem } from "../core/virtual-fs";

type PackageJson = {
  name?: string;
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  workspaces?: string[] | { packages?: string[]; catalog?: Record<string, string> };
  packageManager?: string;
  [key: string]: unknown;
};

type CatalogEntry = {
  versions: Set<string>;
  packages: string[];
};

type PackageInfo = {
  path: string;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
};

const PACKAGE_PATHS = [
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

/**
 * Process dependency catalogs for pnpm/bun
 */
export function processCatalogs(vfs: VirtualFileSystem, config: ProjectConfig): void {
  if (config.packageManager === "npm") return;

  const packagesInfo: PackageInfo[] = [];

  for (const pkgPath of PACKAGE_PATHS) {
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
  packagesInfo: PackageInfo[],
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
    if (!pkgJson.workspaces.catalog) {
      pkgJson.workspaces.catalog = {};
    }
    pkgJson.workspaces.catalog = {
      ...pkgJson.workspaces.catalog,
      ...catalog,
    };
  }

  vfs.writeJson("package.json", pkgJson);
}

function setupPnpmCatalogs(vfs: VirtualFileSystem, catalog: Record<string, string>): void {
  let content = vfs.readFile("pnpm-workspace.yaml");

  // Create pnpm-workspace.yaml if it doesn't exist
  if (!content) {
    content = `packages:
  - "apps/*"
  - "packages/*"
`;
    vfs.writeFile("pnpm-workspace.yaml", content);
  }

  const workspaceYaml = yaml.parse(content);

  if (!workspaceYaml.catalog) {
    workspaceYaml.catalog = {};
  }

  workspaceYaml.catalog = {
    ...workspaceYaml.catalog,
    ...catalog,
  };

  vfs.writeFile("pnpm-workspace.yaml", yaml.stringify(workspaceYaml));
}

function updatePackageJsonsWithCatalogs(
  vfs: VirtualFileSystem,
  packagesInfo: PackageInfo[],
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
