/**
 * Package.json configuration post-processor
 * Updates package names, scripts, and workspaces after template generation
 */

import type { ProjectConfig } from "@better-t-stack/types";

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

type PackageManagerConfig = {
  dev: string;
  build: string;
  checkTypes: string;
  filter: (workspace: string, script: string) => string;
};

/**
 * Update all package.json files with proper names, scripts, and workspaces
 */
export function processPackageConfigs(vfs: VirtualFileSystem, config: ProjectConfig): void {
  updateRootPackageJson(vfs, config);
  updateConfigPackageJson(vfs, config);
  updateEnvPackageJson(vfs, config);
  updateInfraPackageJson(vfs, config);

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

function updateConfigPackageJson(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const pkgJson = vfs.readJson<PackageJson>("packages/config/package.json");
  if (!pkgJson) return;

  pkgJson.name = `@${config.projectName}/config`;
  vfs.writeJson("packages/config/package.json", pkgJson);
}

function updateEnvPackageJson(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const pkgJson = vfs.readJson<PackageJson>("packages/env/package.json");
  if (!pkgJson) return;

  pkgJson.name = `@${config.projectName}/env`;

  // Set exports based on which env files exist
  const hasWebFrontend = config.frontend.some((f) =>
    [
      "tanstack-router",
      "react-router",
      "tanstack-start",
      "next",
      "nuxt",
      "svelte",
      "solid",
    ].includes(f),
  );
  const hasNative = config.frontend.some((f) =>
    ["native-bare", "native-uniwind", "native-unistyles"].includes(f),
  );
  const needsServerEnv = config.backend !== "none" && config.backend !== "convex";

  const exports: Record<string, string> = {};

  if (needsServerEnv) {
    exports["./server"] = "./src/server.ts";
  }
  if (hasWebFrontend) {
    exports["./web"] = "./src/web.ts";
  }
  if (hasNative) {
    exports["./native"] = "./src/native.ts";
  }

  pkgJson.exports = exports;

  vfs.writeJson("packages/env/package.json", pkgJson);
}

function updateInfraPackageJson(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const pkgJson = vfs.readJson<PackageJson>("packages/infra/package.json");
  if (!pkgJson) return;

  pkgJson.name = `@${config.projectName}/infra`;
  vfs.writeJson("packages/infra/package.json", pkgJson);
}

function updateConvexPackageJson(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const pkgJson = vfs.readJson<PackageJson>("packages/backend/package.json");
  if (!pkgJson) return;

  pkgJson.name = `@${config.projectName}/backend`;
  pkgJson.scripts = pkgJson.scripts || {};
  vfs.writeJson("packages/backend/package.json", pkgJson);
}
