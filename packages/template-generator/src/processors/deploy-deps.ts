/**
 * Deployment dependencies processor
 * Adds dependencies for Cloudflare and other deploy targets
 */

import type { ProjectConfig } from "@better-t-stack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

import { addPackageDependency, type AvailableDependencies } from "../utils/add-deps";

/**
 * Process deployment dependencies
 */
export function processDeployDeps(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const { webDeploy, serverDeploy, frontend, backend } = config;

  const isCloudflareWeb = webDeploy === "cloudflare";
  const isCloudflareServer = serverDeploy === "cloudflare";
  const isBackendSelf = backend === "self";

  if (!isCloudflareWeb && !isCloudflareServer) return;

  // Root level - Cloudflare workers types
  if (isCloudflareWeb || isCloudflareServer) {
    addPackageDependency({
      vfs,
      packagePath: "package.json",
      devDependencies: ["@cloudflare/workers-types"],
    });
  }

  // Server deploy deps
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

  // Web deploy deps (framework-specific)
  if (isCloudflareWeb) {
    const webPkgPath = "apps/web/package.json";
    if (!vfs.exists(webPkgPath)) return;

    // Next.js
    if (frontend.includes("next")) {
      addPackageDependency({
        vfs,
        packagePath: webPkgPath,
        dependencies: ["@opennextjs/cloudflare"],
        devDependencies: ["alchemy", "wrangler", "@cloudflare/workers-types"],
      });
    }

    // Nuxt
    else if (frontend.includes("nuxt")) {
      addPackageDependency({
        vfs,
        packagePath: webPkgPath,
        devDependencies: ["alchemy", "nitro-cloudflare-dev", "wrangler"],
      });
    }

    // SvelteKit
    else if (frontend.includes("svelte")) {
      addPackageDependency({
        vfs,
        packagePath: webPkgPath,
        devDependencies: ["alchemy", "@sveltejs/adapter-cloudflare"],
      });
    }

    // TanStack Start
    else if (frontend.includes("tanstack-start")) {
      addPackageDependency({
        vfs,
        packagePath: webPkgPath,
        devDependencies: ["alchemy", "@cloudflare/vite-plugin", "wrangler"],
      });
    }

    // TanStack Router / React Router / Solid (Vite-based)
    else if (
      frontend.includes("tanstack-router") ||
      frontend.includes("react-router") ||
      frontend.includes("solid")
    ) {
      addPackageDependency({
        vfs,
        packagePath: webPkgPath,
        devDependencies: ["alchemy"],
      });
    }
  }
}
