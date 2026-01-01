/**
 * Server deploy setup - CLI-only operations
 * NOTE: Dependencies are handled by template-generator's deploy-deps.ts processor
 * This file only handles external CLI calls for "add deploy" command
 */

import fs from "fs-extra";
import path from "node:path";

import type { ProjectConfig } from "../../types";

import { setupInfraScripts } from "./alchemy/alchemy-combined-setup";

export async function setupServerDeploy(config: ProjectConfig) {
  const { serverDeploy, webDeploy, projectDir, packageManager } = config;

  if (serverDeploy === "none") return;

  // Combined deploy is handled by web-deploy-setup
  if (serverDeploy === "cloudflare" && webDeploy === "cloudflare") {
    return;
  }

  const serverDir = path.join(projectDir, "apps/server");
  if (!(await fs.pathExists(serverDir))) return;

  if (serverDeploy === "cloudflare") {
    await setupInfraScripts(projectDir, packageManager, config);
    // Dependencies are handled by template-generator's deploy-deps.ts
  }
}
