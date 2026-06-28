/**
 * Package.json configuration post-processor
 * Updates package names, scripts, and workspaces after template generation
 */

import { desktopWebFrontends, type ProjectConfig } from "@better-t-stack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";
import { dependencyVersionMap } from "../utils/add-deps";
import { getDbScriptSupport } from "../utils/db-scripts";

type PackageJson = {
  name?: string;
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  overrides?: Record<string, string>;
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

type DesktopWebScript = "build" | "dev" | "generate";
type WorkspacesConfig = NonNullable<PackageJson["workspaces"]>;

const VITE_PLUS_VERSION = dependencyVersionMap["vite-plus"];

/**
 * Update all package.json files with proper names, scripts, and workspaces
 */
export function processPackageConfigs(vfs: VirtualFileSystem, config: ProjectConfig): void {
  updateRootPackageJson(vfs, config);
  updateConfigPackageJson(vfs, config);
  updateEnvPackageJson(vfs, config);
  updateUiPackageJson(vfs, config);
  updateInfraPackageJson(vfs, config);
  updateDesktopPackageJson(vfs, config);
  renameDevScriptsForAlchemy(vfs, config);
  updateVitePlusPackageScripts(vfs, config);

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

  const existingWorkspaces = pkgJson.workspaces;
  const workspaces = getWorkspacePackages(existingWorkspaces);

  const scripts = pkgJson.scripts;
  const { projectName, packageManager, backend, database, orm, dbSetup, addons, frontend } = config;
  const hasWebApp = frontend.some((item) =>
    (desktopWebFrontends as readonly string[]).includes(item),
  );
  const hasNativeApp = frontend.some((item) =>
    ["native-bare", "native-uniwind", "native-unistyles"].includes(item),
  );

  const backendPackageName = backend === "convex" ? `@${projectName}/backend` : "server";
  const dbPackageName = `@${projectName}/db`;
  const hasTurborepo = addons.includes("turborepo");
  const hasNx = addons.includes("nx");
  const hasVitePlus = addons.includes("vite-plus");
  const hasVitePlusNativeHooks =
    hasVitePlus && !addons.includes("husky") && !addons.includes("lefthook");

  const dbSupport = getDbScriptSupport(config);
  const needsDbScripts = dbSupport.hasDbScripts;
  const isD1Alchemy = dbSupport.isD1Alchemy;

  const pmConfig = getPackageManagerConfig(packageManager, { hasTurborepo, hasNx, hasVitePlus });

  scripts.dev = pmConfig.dev;
  scripts.build = pmConfig.build;
  scripts["check-types"] = pmConfig.checkTypes;

  if (hasVitePlus) {
    scripts.check = "vp check && vp run -r check-types";
    scripts.lint = "vp lint";
    scripts.format = "vp fmt";
    scripts.staged = "vp staged";

    if (hasVitePlusNativeHooks) {
      scripts["hooks:setup"] = "vp config";
    } else {
      delete scripts["hooks:setup"];
    }
  }

  if (hasNativeApp) {
    scripts["dev:native"] = pmConfig.filter("native", "dev");
  }

  if (hasWebApp) {
    scripts["dev:web"] = pmConfig.filter("web", "dev");
  }

  if (addons.includes("electrobun")) {
    scripts.dev = getElectrobunRootDevCommand(packageManager, {
      hasTurborepo,
      hasNx,
      hasVitePlus,
    });
    scripts.build = getElectrobunRootBuildCommand(vfs, packageManager, {
      hasTurborepo,
      hasNx,
      hasVitePlus,
    });
    scripts["dev:desktop"] = pmConfig.filter("desktop", "dev:hmr");
    scripts["build:desktop"] = pmConfig.filter("desktop", "build:stable");
    scripts["build:desktop:canary"] = pmConfig.filter("desktop", "build:canary");
  }

  if (addons.includes("opentui")) {
    scripts["dev:tui"] = pmConfig.filter("tui", "dev");
  }

  if (backend !== "self" && backend !== "none") {
    scripts["dev:server"] = pmConfig.filter(backendPackageName, "dev");
  }

  if (backend === "convex") {
    scripts["dev:setup"] = pmConfig.filter(backendPackageName, "dev:setup");
  }

  if (needsDbScripts) {
    if (dbSupport.hasDbPush) {
      scripts["db:push"] = pmConfig.filter(dbPackageName, "db:push");
    }

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

  const hasDockerDeployScripts = config.webDeploy === "docker" || config.serverDeploy === "docker";
  if (dbSetup === "docker") {
    if (hasDockerDeployScripts) {
      // The database service lives in the root docker-compose.yml; scope the
      // dev scripts to just that service so they don't touch web/server.
      scripts["db:start"] = `docker compose up -d ${database}`;
      scripts["db:watch"] = `docker compose up ${database}`;
      scripts["db:stop"] = `docker compose stop ${database}`;
      scripts["db:down"] = `docker compose down ${database}`;
    } else {
      scripts["db:start"] = pmConfig.filter(dbPackageName, "db:start");
      scripts["db:watch"] = pmConfig.filter(dbPackageName, "db:watch");
      scripts["db:stop"] = pmConfig.filter(dbPackageName, "db:stop");
      scripts["db:down"] = pmConfig.filter(dbPackageName, "db:down");
    }
  }

  // Add deploy/destroy scripts when using alchemy (cloudflare deployment)
  const infraPackageName = `@${projectName}/infra`;
  if (config.webDeploy === "cloudflare" || config.serverDeploy === "cloudflare") {
    scripts.deploy = pmConfig.filter(infraPackageName, "deploy");
    scripts.destroy = pmConfig.filter(infraPackageName, "destroy");
  }

  // Add compose scripts when deploying web/server as Docker containers
  if (config.webDeploy === "docker" || config.serverDeploy === "docker") {
    scripts["docker:build"] = "docker compose build";
    scripts["docker:up"] = "docker compose up -d --build";
    scripts["docker:down"] = "docker compose down";
    scripts["docker:logs"] = "docker compose logs -f";
  }

  // Note: packageManager version is set by CLI at runtime since it requires running the actual CLI
  // For preview purposes, we just show the configured package manager
  pkgJson.packageManager = `${packageManager}@latest`;

  if (config.api === "orpc" && config.frontend.includes("nuxt")) {
    pkgJson.overrides = {
      ...pkgJson.overrides,
      "@vue/devtools-api": "^8.0.7",
    };
  }

  if (hasVitePlus) {
    pkgJson.overrides = {
      ...pkgJson.overrides,
      vite: `npm:@voidzero-dev/vite-plus-core@${VITE_PLUS_VERSION}`,
      vitest: `npm:@voidzero-dev/vite-plus-test@${VITE_PLUS_VERSION}`,
    };
  }

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

  pkgJson.workspaces = getUpdatedWorkspaces(existingWorkspaces, workspaces);
  vfs.writeJson("package.json", pkgJson);
}

function getWorkspacePackages(workspaces: PackageJson["workspaces"]): string[] {
  if (Array.isArray(workspaces)) {
    return workspaces;
  }

  if (workspaces && typeof workspaces === "object" && workspaces.packages) {
    return workspaces.packages;
  }

  return [];
}

function getUpdatedWorkspaces(
  existingWorkspaces: PackageJson["workspaces"],
  packages: string[],
): WorkspacesConfig {
  if (
    existingWorkspaces &&
    !Array.isArray(existingWorkspaces) &&
    typeof existingWorkspaces === "object" &&
    existingWorkspaces.catalog
  ) {
    return {
      ...existingWorkspaces,
      packages,
    };
  }

  return packages;
}

function getPackageManagerConfig(
  packageManager: ProjectConfig["packageManager"],
  options: { hasTurborepo: boolean; hasNx: boolean; hasVitePlus: boolean },
): PackageManagerConfig {
  if (options.hasTurborepo) {
    return {
      dev: "turbo run dev",
      build: "turbo run build",
      checkTypes: "turbo run check-types",
      filter: (workspace, script) => `turbo run ${script} -F ${workspace}`,
    };
  }

  if (options.hasNx) {
    return {
      dev: "nx run-many -t dev",
      build: "nx run-many -t build",
      checkTypes: "nx run-many -t check-types",
      filter: (workspace, script) => `nx run-many -t ${script} --projects=${workspace}`,
    };
  }

  if (options.hasVitePlus) {
    return {
      dev: "vp run -r dev",
      build: "vp run -r build",
      checkTypes: "vp run -r check-types",
      filter: (workspace, script) => `vp run --filter ${workspace} ${script}`,
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
    default:
      return {
        dev: "bun run --if-present --filter '*' dev",
        build: "bun run --if-present --filter '*' build",
        checkTypes: "bun run --if-present --filter '*' check-types",
        filter: (workspace, script) => `bun run --filter ${workspace} ${script}`,
      };
  }
}

function getElectrobunRootDevCommand(
  packageManager: ProjectConfig["packageManager"],
  options: { hasTurborepo: boolean; hasNx: boolean; hasVitePlus: boolean },
): string {
  if (options.hasTurborepo) {
    return "turbo run dev --filter='!desktop'";
  }

  if (options.hasNx) {
    return "nx run-many -t dev --exclude=desktop";
  }

  if (options.hasVitePlus) {
    return "vp run -r dev --filter '!desktop'";
  }

  switch (packageManager) {
    case "npm":
      return "npm run dev --workspaces";
    case "pnpm":
      return "pnpm -r --filter '!desktop' dev";
    case "bun":
    default:
      return "bun run --if-present --filter '!desktop' dev";
  }
}

function getElectrobunRootBuildCommand(
  vfs: VirtualFileSystem,
  packageManager: ProjectConfig["packageManager"],
  options: { hasTurborepo: boolean; hasNx: boolean; hasVitePlus: boolean },
): string {
  if (options.hasTurborepo) {
    return "turbo run build --filter='!desktop' && turbo run build -F desktop";
  }

  if (options.hasNx) {
    return "nx run-many -t build --exclude=desktop && nx run-many -t build --projects=desktop";
  }

  if (options.hasVitePlus) {
    return "vp run -r build --filter '!desktop' && vp run --filter desktop build";
  }

  switch (packageManager) {
    case "npm":
      return [
        ...getWorkspacePackagePathsWithScript(vfs, "build")
          .filter((workspacePath) => workspacePath !== "apps/desktop")
          .map((workspacePath) => `npm run build --workspace ${workspacePath} --if-present`),
        "npm run build --workspace apps/desktop",
      ].join(" && ");
    case "pnpm":
      return "pnpm -r --filter '!desktop' build && pnpm --filter desktop build";
    case "bun":
    default:
      return "bun run --if-present --filter '!desktop' build && bun run --filter desktop build";
  }
}

function getWorkspacePackagePathsWithScript(vfs: VirtualFileSystem, scriptName: string): string[] {
  return vfs
    .getAllFiles()
    .filter((filePath) => filePath.endsWith("/package.json"))
    .map((filePath) => filePath.slice(0, -"/package.json".length))
    .filter(
      (workspacePath) => workspacePath.startsWith("apps/") || workspacePath.startsWith("packages/"),
    )
    .filter((workspacePath) => {
      const pkgJson = vfs.readJson<PackageJson>(`${workspacePath}/package.json`);
      return Boolean(pkgJson?.scripts?.[scriptName]);
    })
    .sort(compareWorkspacePackagePaths);
}

function compareWorkspacePackagePaths(a: string, b: string): number {
  const group = (workspacePath: string) => {
    if (workspacePath === "apps/desktop") return 3;
    if (workspacePath.startsWith("packages/")) return 0;
    if (workspacePath === "apps/web") return 2;
    return 1;
  };

  return group(a) - group(b) || a.localeCompare(b);
}

function updateDesktopPackageJson(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const pkgJson = vfs.readJson<PackageJson>("apps/desktop/package.json");
  if (!pkgJson) return;

  const { packageManager, addons, frontend } = config;
  const hasTurborepo = addons.includes("turborepo");
  const hasNx = addons.includes("nx");
  const hasVitePlus = addons.includes("vite-plus");
  const desktopBuildScript: DesktopWebScript = frontend.includes("nuxt") ? "generate" : "build";
  const webBuildCommand = getDesktopWebCommand(
    packageManager,
    { hasTurborepo, hasNx, hasVitePlus },
    desktopBuildScript,
  );
  const webDevCommand = getDesktopWebCommand(
    packageManager,
    { hasTurborepo, hasNx, hasVitePlus },
    "dev",
  );
  const localRunCommand = getLocalRunCommand(packageManager);

  pkgJson.scripts = {
    ...pkgJson.scripts,
    start: "electrobun dev",
    dev: "electrobun dev --watch",
    "dev:hmr": `concurrently "${localRunCommand} hmr" "${localRunCommand} dev"`,
    hmr: webDevCommand,
    build: `${webBuildCommand} && electrobun build`,
    "build:stable": `${webBuildCommand} && electrobun build --env=stable`,
    "build:canary": `${webBuildCommand} && electrobun build --env=canary`,
    "check-types": "tsc --noEmit",
  };

  vfs.writeJson("apps/desktop/package.json", pkgJson);
}

function getDesktopWebCommand(
  packageManager: ProjectConfig["packageManager"],
  options: { hasTurborepo: boolean; hasNx: boolean; hasVitePlus: boolean },
  script: DesktopWebScript,
): string {
  if (options.hasTurborepo) {
    return `turbo run ${script} -F web`;
  }

  if (options.hasNx) {
    return `nx run-many -t ${script} --projects=web`;
  }

  if (options.hasVitePlus) {
    return `vp run --filter web ${script}`;
  }

  switch (packageManager) {
    case "npm":
      return `npm run ${script} --workspace web`;
    case "pnpm":
      return `pnpm -w --filter web ${script}`;
    case "bun":
    default:
      return `bun run --filter web ${script}`;
  }
}

function getLocalRunCommand(packageManager: ProjectConfig["packageManager"]): string {
  switch (packageManager) {
    case "npm":
      return "npm run";
    case "pnpm":
      return "pnpm run";
    case "bun":
    default:
      return "bun run";
  }
}

function updateDbPackageJson(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const pkgJson = vfs.readJson<PackageJson>("packages/db/package.json");
  if (!pkgJson) return;

  pkgJson.name = `@${config.projectName}/db`;
  pkgJson.scripts = pkgJson.scripts || {};

  const scripts = pkgJson.scripts;
  const { database, orm, dbSetup } = config;
  const dbSupport = getDbScriptSupport(config);
  const { isD1Alchemy } = dbSupport;

  if (database !== "none") {
    if (database === "sqlite" && dbSetup !== "d1") {
      scripts["db:local"] = "turso dev --db-file local.db";
    }

    if (orm === "prisma") {
      if (dbSupport.hasDbPush) {
        scripts["db:push"] = "prisma db push";
      }
      scripts["db:generate"] = "prisma generate";
      scripts["db:migrate"] = "prisma migrate dev";
      scripts.postinstall ??= "prisma generate";
      if (!isD1Alchemy) {
        scripts["db:studio"] = "prisma studio";
      }
    } else if (orm === "drizzle") {
      if (dbSupport.hasDbPush) {
        scripts["db:push"] = "drizzle-kit push";
      }
      scripts["db:generate"] = "drizzle-kit generate";
      if (!isD1Alchemy) {
        scripts["db:studio"] = "drizzle-kit studio";
        scripts["db:migrate"] = "drizzle-kit migrate";
      }
    }
  }

  const hasDockerDeploy = config.webDeploy === "docker" || config.serverDeploy === "docker";
  if (dbSetup === "docker" && !hasDockerDeploy) {
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
  const hasWebFrontend = config.frontend.some((f: string) =>
    (desktopWebFrontends as readonly string[]).includes(f),
  );
  const hasNative = config.frontend.some((f: string) =>
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

function updateUiPackageJson(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const pkgJson = vfs.readJson<PackageJson>("packages/ui/package.json");
  if (!pkgJson) return;

  pkgJson.name = `@${config.projectName}/ui`;
  vfs.writeJson("packages/ui/package.json", pkgJson);
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

function renameDevScriptsForAlchemy(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const { serverDeploy, webDeploy, backend } = config;

  // Rename server dev script to dev:bare when serverDeploy is cloudflare
  if (serverDeploy === "cloudflare" && backend !== "self") {
    const serverPkgPath = "apps/server/package.json";
    const serverPkg = vfs.readJson<PackageJson>(serverPkgPath);
    if (serverPkg?.scripts?.dev) {
      serverPkg.scripts["dev:bare"] = serverPkg.scripts.dev;
      delete serverPkg.scripts.dev;
      vfs.writeJson(serverPkgPath, serverPkg);
    }
  }

  // Rename web dev script to dev:bare when webDeploy is cloudflare
  if (webDeploy === "cloudflare") {
    const webPkgPath = "apps/web/package.json";
    const webPkg = vfs.readJson<PackageJson>(webPkgPath);
    if (webPkg?.scripts?.dev) {
      webPkg.scripts["dev:bare"] = webPkg.scripts.dev;
      delete webPkg.scripts.dev;
      vfs.writeJson(webPkgPath, webPkg);
    }
  }
}

function updateVitePlusPackageScripts(vfs: VirtualFileSystem, config: ProjectConfig): void {
  if (!config.addons.includes("vite-plus")) {
    return;
  }

  const webPkgPath = "apps/web/package.json";
  const webPkg = vfs.readJson<PackageJson>(webPkgPath);
  if (!webPkg?.scripts) {
    return;
  }

  const viteScriptReplacements: Record<string, string> = {
    vite: "vp dev",
    "vite dev": "vp dev",
    "vite build": "vp build",
    "vite preview": "vp preview",
    "vitest run": "vp test",
    "vite build && tsc --noEmit": "vp build && tsc --noEmit",
  };

  for (const [scriptName, command] of Object.entries(webPkg.scripts)) {
    webPkg.scripts[scriptName] = viteScriptReplacements[command] ?? command;
  }

  vfs.writeJson(webPkgPath, webPkg);
}
