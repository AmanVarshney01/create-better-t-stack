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
    // Setup infra scripts for individual server cloudflare deploy
    await setupInfraScripts(projectDir, packageManager, config);
    await setupAlchemyServerDeploy(serverDir, projectDir);
  }
}

export async function setupAlchemyServerDeploy(serverDir: string, projectDir?: string) {
  if (!(await fs.pathExists(serverDir))) return;

  // Add Cloudflare types to server package
  await addPackageDependency({
    devDependencies: ["alchemy", "wrangler", "@types/node", "@cloudflare/workers-types"],
    projectDir: serverDir,
  });

  if (projectDir) {
    await addAlchemyPackagesDependencies(projectDir);
  }
  // Scripts are handled by packages/infra package
}

async function addAlchemyPackagesDependencies(projectDir: string) {
  await addPackageDependency({
    devDependencies: ["@cloudflare/workers-types"],
    projectDir,
  });
}
