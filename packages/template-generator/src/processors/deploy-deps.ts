import type { ProjectConfig } from "@better-t-stack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";
import { addPackageDependency } from "../utils/add-deps";

export function processDeployDeps(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const { webDeploy, serverDeploy, frontend, backend, addons } = config;

  const isCloudflareWeb = webDeploy === "cloudflare";
  const isCloudflareServer = serverDeploy === "cloudflare";
  const isDockerWeb = webDeploy === "docker";
  const isVercelWeb = webDeploy === "vercel";
  const isVercelServer = serverDeploy === "vercel";
  const isBackendSelf = backend === "self";

  if (!isCloudflareWeb && !isCloudflareServer && !isDockerWeb && !isVercelWeb && !isVercelServer) {
    return;
  }

  if (isVercelWeb || isVercelServer) {
    // dotenv is already a root dependency via workspace-deps
    addPackageDependency({
      vfs,
      packagePath: "package.json",
      devDependencies: ["@types/node", "tsx", "vercel"],
    });
  }

  if (isVercelWeb && frontend.includes("tanstack-start")) {
    // Nitro emits Vercel's Build Output API; without it the Start build is a
    // plain node server the platform cannot serve
    const webPkgPath = "apps/web/package.json";
    if (vfs.exists(webPkgPath)) {
      addPackageDependency({ vfs, packagePath: webPkgPath, dependencies: ["nitro"] });
    }
  }

  if (
    isVercelWeb &&
    frontend.includes("astro") &&
    !addons.includes("electrobun") &&
    !addons.includes("tauri")
  ) {
    // Astro needs the Vercel adapter for SSR; the default @astrojs/node
    // standalone output is not served by Vercel's astro framework preset.
    const webPkgPath = "apps/web/package.json";
    if (vfs.exists(webPkgPath)) {
      addPackageDependency({
        vfs,
        packagePath: webPkgPath,
        dependencies: ["@astrojs/vercel"],
      });
    }
  }

  if (isDockerWeb) {
    const webPkgPath = "apps/web/package.json";
    if (vfs.exists(webPkgPath)) {
      if (frontend.includes("svelte")) {
        addPackageDependency({
          vfs,
          packagePath: webPkgPath,
          devDependencies: ["@sveltejs/adapter-node"],
        });
      } else if (frontend.includes("tanstack-start")) {
        // Same section as the evlog addon so the two never duplicate nitro
        addPackageDependency({
          vfs,
          packagePath: webPkgPath,
          dependencies: ["nitro"],
        });
      }
    }
  }

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
        dependencies: ["@astrojs/node"],
        devDependencies: [
          "alchemy",
          "@astrojs/cloudflare",
          "wrangler",
          "@cloudflare/workers-types",
        ],
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
