import fs from "fs-extra";
import path from "node:path";

import type { ProjectConfig } from "../../types";

import { addPackageDependency } from "../../utils/add-package-deps";
import { setupInfraScripts } from "./alchemy/alchemy-combined-setup";

export async function setupServerDeploy(config: ProjectConfig) {
  const { serverDeploy, webDeploy, projectDir, packageManager } = config;

  if (serverDeploy === "none") return;

  if (serverDeploy === "cloudflare" && webDeploy === "cloudflare") {
    return;
  }

  const serverDir = path.join(projectDir, "apps/server");
  if (!(await fs.pathExists(serverDir))) return;

  if (serverDeploy === "cloudflare") {
    await setupInfraScripts(projectDir, packageManager, config);
    await setupAlchemyServerDeploy(serverDir, projectDir);
  }
}

export async function setupAlchemyServerDeploy(serverDir: string, projectDir?: string) {
  if (!(await fs.pathExists(serverDir))) return;

  await addPackageDependency({
    devDependencies: ["alchemy", "wrangler", "@types/node", "@cloudflare/workers-types"],
    projectDir: serverDir,
  });

  if (projectDir) {
    await addAlchemyPackagesDependencies(projectDir);
  }
}

async function addAlchemyPackagesDependencies(projectDir: string) {
  await addPackageDependency({
    devDependencies: ["@cloudflare/workers-types"],
    projectDir,
  });
}
