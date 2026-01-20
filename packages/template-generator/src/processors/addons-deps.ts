import type { ProjectConfig } from "@better-fullstack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

import { addPackageDependency } from "../utils/add-deps";

type PackageJson = {
  name?: string;
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  "lint-staged"?: Record<string, string | string[]>;
  [key: string]: unknown;
};

export function processAddonsDeps(vfs: VirtualFileSystem, config: ProjectConfig): void {
  if (!config.addons || config.addons.length === 0) return;

  const hasViteReactFrontend =
    config.frontend.includes("react-router") || config.frontend.includes("tanstack-router");
  const hasSolidFrontend = config.frontend.includes("solid");
  const hasPwaCompatibleFrontend = hasViteReactFrontend || hasSolidFrontend;

  if (config.addons.includes("turborepo")) {
    addPackageDependency({ vfs, packagePath: "package.json", devDependencies: ["turbo"] });
  }

  if (config.addons.includes("pwa") && hasPwaCompatibleFrontend) {
    const webPkgPath = "apps/web/package.json";
    if (vfs.exists(webPkgPath)) {
      addPackageDependency({
        vfs,
        packagePath: webPkgPath,
        dependencies: ["vite-plugin-pwa"],
        devDependencies: ["@vite-pwa/assets-generator"],
      });
      const webPkg = vfs.readJson<PackageJson>(webPkgPath);
      if (webPkg) {
        webPkg.scripts = { ...webPkg.scripts, "generate-pwa-assets": "pwa-assets-generator" };
        vfs.writeJson(webPkgPath, webPkg);
      }
    }
  }

  if (config.addons.includes("tauri")) {
    const webPkgPath = "apps/web/package.json";
    if (vfs.exists(webPkgPath)) {
      addPackageDependency({ vfs, packagePath: webPkgPath, devDependencies: ["@tauri-apps/cli"] });
      const webPkg = vfs.readJson<PackageJson>(webPkgPath);
      if (webPkg) {
        webPkg.scripts = {
          ...webPkg.scripts,
          tauri: "tauri",
          "desktop:dev": "tauri dev",
          "desktop:build": "tauri build",
        };
        vfs.writeJson(webPkgPath, webPkg);
      }
    }
  }

  // MSW (Mock Service Worker) - API mocking for testing and development
  if (config.addons.includes("msw")) {
    const webPkgPath = "apps/web/package.json";
    const serverPkgPath = "apps/server/package.json";

    // Add MSW to web package (for browser-based mocking)
    if (vfs.exists(webPkgPath)) {
      addPackageDependency({ vfs, packagePath: webPkgPath, devDependencies: ["msw"] });
    }

    // Add MSW to server package (for Node.js-based mocking in tests)
    if (vfs.exists(serverPkgPath)) {
      addPackageDependency({ vfs, packagePath: serverPkgPath, devDependencies: ["msw"] });
    }
  }

  // Storybook - Component development and testing
  if (config.addons.includes("storybook")) {
    const webPkgPath = "apps/web/package.json";
    if (vfs.exists(webPkgPath)) {
      // Determine framework-specific Storybook package
      const hasReactVite =
        config.frontend.includes("tanstack-router") || config.frontend.includes("react-router");
      const hasNext = config.frontend.includes("next");
      const hasVue = config.frontend.includes("nuxt");
      const hasSvelte = config.frontend.includes("svelte");
      const hasSolid = config.frontend.includes("solid");

      // Base Storybook dependencies
      const devDeps: Parameters<typeof addPackageDependency>[0]["devDependencies"] = [
        "storybook",
        "@storybook/addon-essentials",
        "@storybook/addon-interactions",
        "@storybook/test",
      ];

      // Add framework-specific renderer
      if (hasNext) {
        devDeps.push("@storybook/nextjs");
      } else if (hasReactVite || hasSolid) {
        // Solid can use React Storybook with adapter, but for now use React-Vite
        devDeps.push("@storybook/react-vite");
      } else if (hasVue) {
        devDeps.push("@storybook/vue3-vite");
      } else if (hasSvelte) {
        devDeps.push("@storybook/svelte-vite");
      }

      addPackageDependency({ vfs, packagePath: webPkgPath, devDependencies: devDeps });

      // Add Storybook scripts
      const webPkg = vfs.readJson<PackageJson>(webPkgPath);
      if (webPkg) {
        webPkg.scripts = {
          ...webPkg.scripts,
          storybook: "storybook dev -p 6006",
          "build-storybook": "storybook build",
        };
        vfs.writeJson(webPkgPath, webPkg);
      }
    }
  }
}
