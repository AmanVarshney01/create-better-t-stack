/**
 * Infrastructure package dependencies processor
 * Adds Alchemy deps for Cloudflare deployments
 */

import type { ProjectConfig } from "@better-t-stack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

import { addPackageDependency } from "../utils/add-deps";

export function processInfraDeps(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const infraPath = "packages/infra/package.json";
  if (!vfs.exists(infraPath)) return;

  const { serverDeploy, webDeploy } = config;

  // Only add alchemy for Cloudflare deployments
  if (serverDeploy === "cloudflare" || webDeploy === "cloudflare") {
    addPackageDependency({
      vfs,
      packagePath: infraPath,
      devDependencies: ["alchemy"],
    });
  }
}
