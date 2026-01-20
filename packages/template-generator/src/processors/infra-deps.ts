import type { ProjectConfig } from "@better-fullstack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

import { addPackageDependency } from "../utils/add-deps";

export function processInfraDeps(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const infraPath = "packages/infra/package.json";
  if (!vfs.exists(infraPath)) return;

  const { serverDeploy, webDeploy } = config;
  if (serverDeploy === "cloudflare" || webDeploy === "cloudflare") {
    addPackageDependency({ vfs, packagePath: infraPath, devDependencies: ["alchemy"] });
  }
}
