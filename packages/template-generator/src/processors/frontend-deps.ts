import type { ProjectConfig } from "@better-t-stack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";
import { addPackageDependency } from "../utils/add-deps";

export function processFrontendDeps(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const { frontend, webDeploy } = config;

  if (!frontend.includes("astro") || webDeploy === "cloudflare") return;

  const webPackagePath = "apps/web/package.json";
  if (!vfs.exists(webPackagePath)) return;

  addPackageDependency({
    vfs,
    packagePath: webPackagePath,
    dependencies: ["@astrojs/node"],
  });
}
