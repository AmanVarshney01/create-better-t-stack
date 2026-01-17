import type { ProjectConfig } from "@better-t-stack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

import { addPackageDependency } from "../utils/add-deps";

export function processDeployDeps(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const { webDeploy, serverDeploy, frontend, backend } = config;

  const isCloudflareWeb = webDeploy === "cloudflare";
  const isCloudflareServer = serverDeploy === "cloudflare";
  const isBackendSelf = backend === "self";

  if (!isCloudflareWeb && !isCloudflareServer) return;

  if (isCloudflareWeb || isCloudflareServer) {
    addPackageDependency({
      vfs,
      packagePath: "package.json",
      devDependencies: ["@cloudflare/workers-types"],
    });
  }

  if (isCloudflareServer && !isBackendSelf) {
    const serverPkgPath = "apps/server/package.json";
    if (vfs.exists(serverPkgPath)) {
      addPackageDependency({
        vfs,
        packagePath: serverPkgPath,
        devDependencies: ["alchemy", "wrangler", "@types/node", "@cloudflare/workers-types"],
      });
    }
  }

  if (isCloudflareWeb) {
    const webPkgPath = "apps/web/package.json";
    if (!vfs.exists(webPkgPath)) return;

    if (frontend.includes("next")) {
      addPackageDependency({
        vfs,
        packagePath: webPkgPath,
        dependencies: ["@opennextjs/cloudflare"],
        devDependencies: ["alchemy", "wrangler", "@cloudflare/workers-types"],
      });
    } else if (frontend.includes("nuxt")) {
      addPackageDependency({
        vfs,
        packagePath: webPkgPath,
        devDependencies: ["alchemy", "nitro-cloudflare-dev", "wrangler"],
      });
    } else if (frontend.includes("svelte")) {
      addPackageDependency({
        vfs,
        packagePath: webPkgPath,
        devDependencies: ["alchemy", "@sveltejs/adapter-cloudflare"],
      });
    } else if (frontend.includes("tanstack-start")) {
      addPackageDependency({
        vfs,
        packagePath: webPkgPath,
        devDependencies: ["alchemy", "@cloudflare/vite-plugin", "wrangler"],
      });
    } else if (frontend.includes("astro")) {
      addPackageDependency({
        vfs,
        packagePath: webPkgPath,
        devDependencies: ["alchemy", "@cloudflare/workers-types"],
      });
    } else if (
      frontend.includes("tanstack-router") ||
      frontend.includes("react-router") ||
      frontend.includes("solid")
    ) {
      addPackageDependency({ vfs, packagePath: webPkgPath, devDependencies: ["alchemy"] });
    }
  }
}
