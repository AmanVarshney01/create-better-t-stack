/**
 * Examples dependencies processor
 * Adds dependencies for examples: todo, ai
 */

import type { ProjectConfig } from "@better-t-stack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

import { addPackageDependency, type AvailableDependencies } from "../utils/add-deps";

/**
 * Process example dependencies
 */
export function processExamplesDeps(vfs: VirtualFileSystem, config: ProjectConfig): void {
  if (!config.examples || config.examples.length === 0 || config.examples[0] === "none") {
    return;
  }

  // Todo example
  if (
    config.examples.includes("todo") &&
    config.backend !== "convex" &&
    config.backend !== "none"
  ) {
    setupTodoDependencies(vfs, config);
  }

  // AI example
  if (config.examples.includes("ai")) {
    setupAIDependencies(vfs, config);
  }
}

function setupTodoDependencies(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const { orm, database, backend } = config;

  const apiPkgPath = "packages/api/package.json";
  if (!vfs.exists(apiPkgPath) || backend === "none") {
    return;
  }

  if (orm === "drizzle") {
    const dependencies: AvailableDependencies[] = ["drizzle-orm"];
    if (database === "postgres") {
      dependencies.push("@types/pg");
    }
    addPackageDependency({
      vfs,
      packagePath: apiPkgPath,
      dependencies,
    });
  } else if (orm === "prisma") {
    addPackageDependency({
      vfs,
      packagePath: apiPkgPath,
      dependencies: ["@prisma/client"],
    });
  } else if (orm === "mongoose") {
    addPackageDependency({
      vfs,
      packagePath: apiPkgPath,
      dependencies: ["mongoose"],
    });
  }
}

function setupAIDependencies(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const { frontend, backend } = config;

  const webPkgPath = "apps/web/package.json";
  const nativePkgPath = "apps/native/package.json";
  const serverPkgPath = "apps/server/package.json";
  const convexBackendPkgPath = "packages/backend/package.json";

  const webExists = vfs.exists(webPkgPath);
  const nativeExists = vfs.exists(nativePkgPath);
  const serverExists = vfs.exists(serverPkgPath);
  const convexBackendExists = vfs.exists(convexBackendPkgPath);

  const hasReactWeb =
    frontend.includes("react-router") ||
    frontend.includes("tanstack-router") ||
    frontend.includes("next") ||
    frontend.includes("tanstack-start");
  const hasNuxt = frontend.includes("nuxt");
  const hasSvelte = frontend.includes("svelte");
  const hasReactNative =
    frontend.includes("native-bare") ||
    frontend.includes("native-uniwind") ||
    frontend.includes("native-unistyles");

  // Backend AI deps
  if (backend === "convex" && convexBackendExists) {
    addPackageDependency({
      vfs,
      packagePath: convexBackendPkgPath,
      dependencies: ["@convex-dev/agent", "ai", "@ai-sdk/google"],
    });
  } else if (backend === "self" && webExists) {
    addPackageDependency({
      vfs,
      packagePath: webPkgPath,
      dependencies: ["ai", "@ai-sdk/google", "@ai-sdk/devtools"],
    });
  } else if (serverExists && backend !== "none") {
    addPackageDependency({
      vfs,
      packagePath: serverPkgPath,
      dependencies: ["ai", "@ai-sdk/google", "@ai-sdk/devtools"],
    });
  }

  // Web AI deps
  if (webExists) {
    const dependencies: AvailableDependencies[] = [];

    if (backend === "convex") {
      if (hasReactWeb) {
        dependencies.push("@convex-dev/agent", "streamdown");
      }
    } else {
      dependencies.push("ai");
      if (hasNuxt) {
        dependencies.push("@ai-sdk/vue");
      } else if (hasSvelte) {
        dependencies.push("@ai-sdk/svelte");
      } else if (hasReactWeb) {
        dependencies.push("@ai-sdk/react", "streamdown");
      }
    }

    if (dependencies.length > 0) {
      addPackageDependency({
        vfs,
        packagePath: webPkgPath,
        dependencies,
      });
    }
  }

  // Native AI deps
  if (nativeExists && hasReactNative) {
    if (backend === "convex") {
      addPackageDependency({
        vfs,
        packagePath: nativePkgPath,
        dependencies: ["@convex-dev/agent"],
      });
    } else {
      addPackageDependency({
        vfs,
        packagePath: nativePkgPath,
        dependencies: ["ai", "@ai-sdk/react"],
      });
    }
  }
}
