import { getLocalD1Owner, type ProjectConfig } from "@better-t-stack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";
import { addPackageDependency } from "../utils/add-deps";

export function processDeployDeps(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const { webDeploy, serverDeploy, frontend, backend, addons, orm } = config;

  const isCloudflareWeb = webDeploy === "cloudflare";
  const isCloudflareServer = serverDeploy === "cloudflare";
  const isPrismaWeb = webDeploy === "prisma";
  const isPrismaServer = serverDeploy === "prisma";
  const isDockerWeb = webDeploy === "docker";
  const isVercelWeb = webDeploy === "vercel";
  const isVercelServer = serverDeploy === "vercel";
  const isBackendSelf = backend === "self";

  if (
    !isCloudflareWeb &&
    !isCloudflareServer &&
    !isPrismaWeb &&
    !isPrismaServer &&
    !isDockerWeb &&
    !isVercelWeb &&
    !isVercelServer
  ) {
    return;
  }

  if (isPrismaWeb && frontend.includes("solid")) {
    addPackageDependency({
      vfs,
      packagePath: "apps/web/package.json",
      dependencies: ["nitro"],
    });
  }

  if (isPrismaWeb && frontend.includes("react-router")) {
    addPackageDependency({
      vfs,
      packagePath: "apps/web/package.json",
      dependencies: ["@react-router/express", "express"],
      devDependencies: ["@types/express"],
    });
  } else if (isPrismaWeb && frontend.includes("svelte")) {
    addPackageDependency({
      vfs,
      packagePath: "apps/web/package.json",
      devDependencies: ["@sveltejs/adapter-node"],
    });
  }

  if (
    isCloudflareWeb &&
    isBackendSelf &&
    orm === "prisma" &&
    (["nuxt", "svelte", "solid", "tanstack-start"] as const).some((framework) =>
      frontend.includes(framework),
    )
  ) {
    addPackageDependency({
      vfs,
      packagePath: "apps/web/package.json",
      devDependencies: ["unwasm"],
    });
  }

  if (isVercelWeb || isVercelServer) {
    // dotenv is already a root dependency via workspace-deps
    addPackageDependency({
      vfs,
      packagePath: "package.json",
      devDependencies: ["@types/node", "tsx", "vercel"],
    });
  }

  if ((isVercelWeb || isPrismaWeb) && frontend.includes("tanstack-start")) {
    // Nitro emits the standalone server artifact consumed by both deployment providers.
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

  if (
    isVercelWeb &&
    frontend.includes("svelte") &&
    !addons.includes("electrobun") &&
    !addons.includes("tauri")
  ) {
    // Vercel docs recommend the explicit adapter over adapter-auto resolving it at build time
    const webPkgPath = "apps/web/package.json";
    if (vfs.exists(webPkgPath)) {
      addPackageDependency({
        vfs,
        packagePath: webPkgPath,
        devDependencies: ["@sveltejs/adapter-vercel"],
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
        devDependencies: ["@types/node", "@cloudflare/workers-types"],
      });
    }
  }

  if (isCloudflareWeb) {
    const webPkgPath = "apps/web/package.json";
    if (!vfs.exists(webPkgPath)) return;

    const needsWranglerLocalD1 = getLocalD1Owner(config) === "wrangler";

    if (frontend.includes("next")) {
      addPackageDependency({
        vfs,
        packagePath: webPkgPath,
        dependencies: ["@opennextjs/cloudflare"],
        devDependencies: ["wrangler", "@cloudflare/workers-types"],
      });
    } else if (frontend.includes("nuxt")) {
      addPackageDependency({
        vfs,
        packagePath: webPkgPath,
        devDependencies: ["@alchemy.run/cloudflare-frameworks"],
      });
    } else if (frontend.includes("svelte")) {
      addPackageDependency({
        vfs,
        packagePath: webPkgPath,
        devDependencies: needsWranglerLocalD1
          ? ["@sveltejs/adapter-cloudflare", "wrangler"]
          : ["@sveltejs/adapter-cloudflare"],
      });
    } else if (frontend.includes("solid") && needsWranglerLocalD1) {
      addPackageDependency({
        vfs,
        packagePath: webPkgPath,
        devDependencies: ["wrangler"],
      });
    } else if (frontend.includes("astro")) {
      addPackageDependency({
        vfs,
        packagePath: webPkgPath,
        devDependencies: ["@alchemy.run/cloudflare-frameworks", "@cloudflare/workers-types"],
      });
    }
  }
}
