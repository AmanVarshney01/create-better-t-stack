import path from "node:path";
import { log } from "@clack/prompts";
import { execa } from "execa";
import fs from "fs-extra";
import type { ProjectConfig } from "../../types";
import { setupWorkspaceDependencies } from "./workspace-setup";

export async function updatePackageConfigurations(projectDir: string, options: ProjectConfig) {
  await updateRootPackageJson(projectDir, options);

  if (options.backend === "convex") {
    await updateConvexPackageJson(projectDir, options);
  } else if (options.backend !== "none") {
    await updateDbPackageJson(projectDir, options);
    await updateAuthPackageJson(projectDir, options);
    await updateApiPackageJson(projectDir, options);

    if (options.backend !== "self") {
      await updateServerPackageJson(projectDir, options);
    }
  }

  await setupWorkspaceDependencies(projectDir, options);
}

async function updateRootPackageJson(projectDir: string, options: ProjectConfig) {
  const rootPackageJsonPath = path.join(projectDir, "package.json");
  if (!(await fs.pathExists(rootPackageJsonPath))) return;

  const packageJson = await fs.readJson(rootPackageJsonPath);
  packageJson.name = options.projectName;
  packageJson.scripts = packageJson.scripts || {};
  packageJson.workspaces = packageJson.workspaces || [];

  const scripts = packageJson.scripts;
  const workspaces = packageJson.workspaces;

  const { projectName, packageManager, backend, database, orm, dbSetup, serverDeploy, addons } =
    options;

  const backendPackageName = backend === "convex" ? `@${projectName}/backend` : "server";
  const dbPackageName = `@${projectName}/db`;
  const hasTurborepo = addons.includes("turborepo");

  const needsDbScripts =
    backend !== "convex" && database !== "none" && orm !== "none" && orm !== "mongoose";

  const isD1Alchemy = dbSetup === "d1" && serverDeploy === "alchemy";

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

  try {
    const { stdout } = await execa(packageManager, ["-v"], { cwd: projectDir });
    packageJson.packageManager = `${packageManager}@${stdout.trim()}`;
  } catch {
    log.warn(`Could not determine ${packageManager} version.`);
  }

  if (backend === "convex") {
    if (!workspaces.includes("packages/*")) {
      workspaces.push("packages/*");
    }
    const needsAppsDir = options.frontend.length > 0 || addons.includes("starlight");
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

  await fs.writeJson(rootPackageJsonPath, packageJson, { spaces: 2 });
}

type PackageManagerConfig = {
  dev: string;
  build: string;
  checkTypes: string;
  filter: (workspace: string, script: string) => string;
};

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

async function updateServerPackageJson(projectDir: string, _options: ProjectConfig) {
  const serverPackageJsonPath = path.join(projectDir, "apps/server/package.json");
  if (!(await fs.pathExists(serverPackageJsonPath))) return;

  const serverPackageJson = await fs.readJson(serverPackageJsonPath);
  serverPackageJson.scripts = serverPackageJson.scripts || {};

  await fs.writeJson(serverPackageJsonPath, serverPackageJson, { spaces: 2 });
}

async function updateDbPackageJson(projectDir: string, options: ProjectConfig) {
  const dbPackageJsonPath = path.join(projectDir, "packages/db/package.json");
  if (!(await fs.pathExists(dbPackageJsonPath))) return;

  const dbPackageJson = await fs.readJson(dbPackageJsonPath);
  dbPackageJson.name = `@${options.projectName}/db`;
  dbPackageJson.scripts = dbPackageJson.scripts || {};

  const scripts = dbPackageJson.scripts;
  const { database, orm, dbSetup, serverDeploy } = options;
  const isD1Alchemy = dbSetup === "d1" && serverDeploy === "alchemy";

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

  await fs.writeJson(dbPackageJsonPath, dbPackageJson, { spaces: 2 });
}

async function updateAuthPackageJson(projectDir: string, options: ProjectConfig) {
  const authPackageJsonPath = path.join(projectDir, "packages/auth/package.json");
  if (!(await fs.pathExists(authPackageJsonPath))) return;

  const authPackageJson = await fs.readJson(authPackageJsonPath);
  authPackageJson.name = `@${options.projectName}/auth`;

  await fs.writeJson(authPackageJsonPath, authPackageJson, { spaces: 2 });
}

async function updateApiPackageJson(projectDir: string, options: ProjectConfig) {
  const apiPackageJsonPath = path.join(projectDir, "packages/api/package.json");
  if (!(await fs.pathExists(apiPackageJsonPath))) return;

  const apiPackageJson = await fs.readJson(apiPackageJsonPath);
  apiPackageJson.name = `@${options.projectName}/api`;

  await fs.writeJson(apiPackageJsonPath, apiPackageJson, { spaces: 2 });
}

async function updateConvexPackageJson(projectDir: string, options: ProjectConfig) {
  const convexPackageJsonPath = path.join(projectDir, "packages/backend/package.json");
  if (!(await fs.pathExists(convexPackageJsonPath))) return;

  const convexPackageJson = await fs.readJson(convexPackageJsonPath);
  convexPackageJson.name = `@${options.projectName}/backend`;
  convexPackageJson.scripts = convexPackageJson.scripts || {};

  await fs.writeJson(convexPackageJsonPath, convexPackageJson, { spaces: 2 });
}
