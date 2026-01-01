/**
 * Addon dependencies processor
 * Adds dependencies for addons: turborepo, biome, husky, oxlint, pwa, tauri
 */

import type { ProjectConfig } from "@better-t-stack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

import { addPackageDependency, type AvailableDependencies } from "../utils/add-deps";

type PackageJson = {
  name?: string;
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  "lint-staged"?: Record<string, string | string[]>;
  [key: string]: unknown;
};

/**
 * Process addon dependencies
 */
export function processAddonsDeps(vfs: VirtualFileSystem, config: ProjectConfig): void {
  if (!config.addons || config.addons.length === 0) return;

  const hasReactWebFrontend =
    config.frontend.includes("react-router") ||
    config.frontend.includes("tanstack-router") ||
    config.frontend.includes("next");
  const hasSolidFrontend = config.frontend.includes("solid");
  const hasWebFrontend = hasReactWebFrontend || hasSolidFrontend;

  // Turborepo
  if (config.addons.includes("turborepo")) {
    addPackageDependency({
      vfs,
      packagePath: "package.json",
      devDependencies: ["turbo"],
    });
  }

  // Biome
  if (config.addons.includes("biome")) {
    addPackageDependency({
      vfs,
      packagePath: "package.json",
      devDependencies: ["@biomejs/biome"],
    });

    // Add check script
    const rootPkg = vfs.readJson<PackageJson>("package.json");
    if (rootPkg) {
      rootPkg.scripts = {
        ...rootPkg.scripts,
        check: "biome check --write .",
      };
      vfs.writeJson("package.json", rootPkg);
    }
  }

  // Husky
  if (config.addons.includes("husky")) {
    addPackageDependency({
      vfs,
      packagePath: "package.json",
      devDependencies: ["husky", "lint-staged"],
    });

    const rootPkg = vfs.readJson<PackageJson>("package.json");
    if (rootPkg) {
      rootPkg.scripts = {
        ...rootPkg.scripts,
        prepare: "husky",
      };

      // Configure lint-staged based on available linters
      if (config.addons.includes("oxlint")) {
        rootPkg["lint-staged"] = {
          "*": ["oxlint", "oxfmt --write"],
        };
      } else if (config.addons.includes("biome")) {
        rootPkg["lint-staged"] = {
          "*.{js,ts,cjs,mjs,d.cts,d.mts,jsx,tsx,json,jsonc}": ["biome check --write ."],
        };
      } else {
        rootPkg["lint-staged"] = {
          "**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx,vue,astro,svelte}": "",
        };
      }

      vfs.writeJson("package.json", rootPkg);
    }
  }

  // Oxlint
  if (config.addons.includes("oxlint")) {
    addPackageDependency({
      vfs,
      packagePath: "package.json",
      devDependencies: ["oxlint", "oxfmt"],
    });

    const rootPkg = vfs.readJson<PackageJson>("package.json");
    if (rootPkg) {
      rootPkg.scripts = {
        ...rootPkg.scripts,
        check: "oxlint && oxfmt --write",
      };
      vfs.writeJson("package.json", rootPkg);
    }
  }

  // PWA (for React/Vite and Solid frontends)
  if (config.addons.includes("pwa") && hasWebFrontend) {
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
        webPkg.scripts = {
          ...webPkg.scripts,
          "generate-pwa-assets": "pwa-assets-generator",
        };
        vfs.writeJson(webPkgPath, webPkg);
      }
    }
  }

  // Tauri
  if (config.addons.includes("tauri")) {
    const webPkgPath = "apps/web/package.json";
    if (vfs.exists(webPkgPath)) {
      addPackageDependency({
        vfs,
        packagePath: webPkgPath,
        devDependencies: ["@tauri-apps/cli"],
      });

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
}
