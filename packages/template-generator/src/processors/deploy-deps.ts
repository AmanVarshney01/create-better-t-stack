import type { ProjectConfig } from "@better-fullstack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

import { addPackageDependency } from "../utils/add-deps";

export function processDeployDeps(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const { webDeploy, serverDeploy, frontend, backend } = config;

  const isCloudflareWeb = webDeploy === "cloudflare";
  const isCloudflareServer = serverDeploy === "cloudflare";
  const isFlyWeb = webDeploy === "fly";
  const isRailwayWeb = webDeploy === "railway";
  const isSstWeb = webDeploy === "sst";
  const isSstServer = serverDeploy === "sst";
  const isBackendSelf = backend === "self";

  // Handle Fly.io web deployment dependencies
  if (isFlyWeb) {
    const webPkgPath = "apps/web/package.json";
    if (vfs.exists(webPkgPath)) {
      // SvelteKit requires node adapter for Docker-based deployments
      if (frontend.includes("svelte")) {
        addPackageDependency({
          vfs,
          packagePath: webPkgPath,
          devDependencies: ["@sveltejs/adapter-node"],
        });
      }
    }
  }

  // Handle Railway web deployment dependencies (Docker-based, same as Fly.io)
  if (isRailwayWeb) {
    const webPkgPath = "apps/web/package.json";
    if (vfs.exists(webPkgPath)) {
      // SvelteKit requires node adapter for Docker-based deployments
      if (frontend.includes("svelte")) {
        addPackageDependency({
          vfs,
          packagePath: webPkgPath,
          devDependencies: ["@sveltejs/adapter-node"],
        });
      }
    }
  }

  // Handle SST deployment dependencies
  if (isSstWeb || isSstServer) {
    // Add SST to root package.json
    addPackageDependency({
      vfs,
      packagePath: "package.json",
      devDependencies: ["sst", "aws-cdk-lib", "constructs"],
    });

    // Add framework-specific SST adapters for web
    if (isSstWeb) {
      const webPkgPath = "apps/web/package.json";
      if (vfs.exists(webPkgPath)) {
        if (frontend.includes("next")) {
          addPackageDependency({
            vfs,
            packagePath: webPkgPath,
            devDependencies: ["@opennextjs/aws"],
          });
        } else if (frontend.includes("svelte")) {
          addPackageDependency({
            vfs,
            packagePath: webPkgPath,
            devDependencies: ["@sveltejs/adapter-node"],
          });
        }
      }
    }
  }

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
    } else if (
      frontend.includes("tanstack-router") ||
      frontend.includes("react-router") ||
      frontend.includes("solid")
    ) {
      addPackageDependency({ vfs, packagePath: webPkgPath, devDependencies: ["alchemy"] });
    }
  }
}
