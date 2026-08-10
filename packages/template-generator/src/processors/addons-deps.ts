import type { ProjectConfig } from "@better-t-stack/types";

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
  const hasEvlogWebServer = config.frontend.some((frontend) =>
    ["next", "nuxt", "svelte", "tanstack-start", "astro"].includes(frontend),
  );

  if (config.addons.includes("turborepo")) {
    addPackageDependency({ vfs, packagePath: "package.json", devDependencies: ["turbo"] });
  }

  if (config.addons.includes("nx")) {
    addPackageDependency({ vfs, packagePath: "package.json", devDependencies: ["nx"] });
  }

  if (config.addons.includes("vite-plus")) {
    addPackageDependency({
      vfs,
      packagePath: "package.json",
      devDependencies: ["vite-plus", "rolldown"],
    });
  }

  if (config.addons.includes("evlog")) {
    const serverPkgPath = "apps/server/package.json";
    if (vfs.exists(serverPkgPath) && config.backend !== "self" && config.backend !== "none") {
      addPackageDependency({ vfs, packagePath: serverPkgPath, dependencies: ["evlog"] });
    }

    const webPkgPath = "apps/web/package.json";
    if (vfs.exists(webPkgPath) && hasEvlogWebServer) {
      addPackageDependency({
        vfs,
        packagePath: webPkgPath,
        dependencies: config.frontend.includes("tanstack-start") ? ["evlog", "nitro"] : ["evlog"],
      });
    }
  }

  if (config.addons.includes("sentry")) {
    addPackageDependency({
      vfs,
      packagePath: "package.json",
      devDependencies: ["sentry", "tsx"],
    });

    const rootPkg = vfs.readJson<PackageJson>("package.json");
    if (rootPkg) {
      rootPkg.scripts = {
        ...rootPkg.scripts,
        "sentry:setup": "tsx scripts/setup-sentry.ts",
      };
      vfs.writeJson("package.json", rootPkg);
    }

    const webPkgPath = "apps/web/package.json";
    if (vfs.exists(webPkgPath)) {
      const webDependencies: Array<
        | "@sentry/nextjs"
        | "@sentry/nuxt"
        | "@sentry/sveltekit"
        | "@sentry/solidstart"
        | "@sentry/astro"
        | "@sentry/react"
        | "@sentry/react-router"
        | "@sentry/tanstackstart-react"
        | "@sentry/cloudflare"
      > = [];

      if (config.frontend.includes("next")) webDependencies.push("@sentry/nextjs");
      if (config.frontend.includes("nuxt")) webDependencies.push("@sentry/nuxt");
      if (config.frontend.includes("svelte")) webDependencies.push("@sentry/sveltekit");
      if (config.frontend.includes("solid")) webDependencies.push("@sentry/solidstart");
      if (config.frontend.includes("astro")) webDependencies.push("@sentry/astro");
      if (config.frontend.includes("tanstack-router")) webDependencies.push("@sentry/react");
      if (config.frontend.includes("react-router")) webDependencies.push("@sentry/react-router");
      if (config.frontend.includes("tanstack-start")) {
        webDependencies.push("@sentry/tanstackstart-react");
      }
      if (
        config.webDeploy === "cloudflare" &&
        config.frontend.some((frontend) =>
          ["nuxt", "astro", "react-router", "tanstack-start"].includes(frontend),
        )
      ) {
        webDependencies.push("@sentry/cloudflare");
      }

      addPackageDependency({ vfs, packagePath: webPkgPath, dependencies: webDependencies });
    }

    const nativePkgPath = "apps/native/package.json";
    if (vfs.exists(nativePkgPath)) {
      addPackageDependency({
        vfs,
        packagePath: nativePkgPath,
        dependencies: ["@sentry/react-native"],
      });
    }

    const serverPkgPath = "apps/server/package.json";
    if (vfs.exists(serverPkgPath)) {
      if (config.backend === "hono") {
        const runtimeDependency =
          config.runtime === "workers"
            ? "@sentry/cloudflare"
            : config.runtime === "bun"
              ? "@sentry/bun"
              : "@sentry/node";
        addPackageDependency({
          vfs,
          packagePath: serverPkgPath,
          dependencies: ["@sentry/hono", runtimeDependency],
        });
      } else if (config.backend === "elysia") {
        addPackageDependency({
          vfs,
          packagePath: serverPkgPath,
          dependencies: ["@sentry/elysia"],
        });
      } else if (config.backend === "express" || config.backend === "fastify") {
        addPackageDependency({
          vfs,
          packagePath: serverPkgPath,
          dependencies: [config.runtime === "bun" ? "@sentry/bun" : "@sentry/node"],
        });
      }
    }
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
}
