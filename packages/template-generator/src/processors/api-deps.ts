/**
 * API dependencies processor
 * Adds tRPC/oRPC dependencies to appropriate packages
 */

import type { ProjectConfig, Frontend, API, Backend } from "@better-t-stack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

import { addPackageDependency } from "../utils/add-deps";

type FrontendType = {
  hasReactWeb: boolean;
  hasNuxtWeb: boolean;
  hasSvelteWeb: boolean;
  hasSolidWeb: boolean;
  hasNative: boolean;
};

function getFrontendType(frontend: Frontend[]): FrontendType {
  return {
    hasReactWeb: frontend.some((f) =>
      ["tanstack-router", "react-router", "tanstack-start", "next"].includes(f),
    ),
    hasNuxtWeb: frontend.includes("nuxt"),
    hasSvelteWeb: frontend.includes("svelte"),
    hasSolidWeb: frontend.includes("solid"),
    hasNative: frontend.some((f) =>
      ["native-bare", "native-uniwind", "native-unistyles"].includes(f),
    ),
  };
}

export function processApiDeps(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const { api, backend, frontend } = config;

  if (api === "none") return;

  const frontendType = getFrontendType(frontend);

  // API package deps
  if (backend !== "convex") {
    addApiPackageDeps(vfs, api);
  }

  // Server deps
  addServerDeps(vfs, api, backend);

  // Web client deps
  addWebClientDeps(vfs, api, backend, frontendType);

  // Native deps
  if (frontendType.hasNative) {
    addNativeDeps(vfs, api, backend);
  }

  // Query deps (React Query etc)
  addQueryDeps(vfs, frontend, backend);
}

function addApiPackageDeps(vfs: VirtualFileSystem, api: API): void {
  const pkgPath = "packages/api/package.json";
  if (!vfs.exists(pkgPath)) return;

  if (api === "trpc") {
    addPackageDependency({
      vfs,
      packagePath: pkgPath,
      dependencies: ["@trpc/server", "superjson", "zod"],
    });
  } else if (api === "orpc") {
    addPackageDependency({
      vfs,
      packagePath: pkgPath,
      dependencies: ["@orpc/server", "@orpc/zod", "zod"],
    });
  }
}

function addServerDeps(vfs: VirtualFileSystem, api: API, backend: Backend): void {
  const serverPath = "apps/server/package.json";
  if (!vfs.exists(serverPath)) return;

  if (backend === "convex") return;

  if (api === "trpc") {
    addPackageDependency({
      vfs,
      packagePath: serverPath,
      dependencies: ["@trpc/server", "@hono/trpc-server"],
    });
  } else if (api === "orpc") {
    addPackageDependency({
      vfs,
      packagePath: serverPath,
      dependencies: ["@orpc/server", "@orpc/openapi"],
    });
  }
}

function addWebClientDeps(
  vfs: VirtualFileSystem,
  api: API,
  backend: Backend,
  frontendType: FrontendType,
): void {
  const webPath = "apps/web/package.json";
  if (!vfs.exists(webPath)) return;

  if (backend === "convex") return;

  if (api === "trpc") {
    if (frontendType.hasReactWeb) {
      addPackageDependency({
        vfs,
        packagePath: webPath,
        dependencies: ["@trpc/client", "@trpc/tanstack-react-query", "superjson"],
      });
    } else if (frontendType.hasNuxtWeb) {
      addPackageDependency({
        vfs,
        packagePath: webPath,
        dependencies: ["@trpc/client", "trpc-nuxt", "superjson"],
      });
    } else if (frontendType.hasSvelteWeb) {
      addPackageDependency({
        vfs,
        packagePath: webPath,
        dependencies: ["@trpc/client", "trpc-svelte-query", "superjson"],
      });
    } else if (frontendType.hasSolidWeb) {
      addPackageDependency({
        vfs,
        packagePath: webPath,
        dependencies: ["@trpc/client", "solid-trpc", "superjson"],
      });
    }
  } else if (api === "orpc") {
    if (frontendType.hasReactWeb) {
      addPackageDependency({
        vfs,
        packagePath: webPath,
        dependencies: ["@orpc/client", "@orpc/tanstack-query"],
      });
    }
  }
}

function addNativeDeps(vfs: VirtualFileSystem, api: API, backend: Backend): void {
  const nativePath = "apps/native/package.json";
  if (!vfs.exists(nativePath)) return;

  if (backend === "convex") return;

  if (api === "trpc") {
    addPackageDependency({
      vfs,
      packagePath: nativePath,
      dependencies: ["@trpc/client", "@trpc/tanstack-react-query", "superjson"],
    });
  } else if (api === "orpc") {
    addPackageDependency({
      vfs,
      packagePath: nativePath,
      dependencies: ["@orpc/client", "@orpc/tanstack-query"],
    });
  }
}

function addQueryDeps(vfs: VirtualFileSystem, frontend: Frontend[], backend: Backend): void {
  const webPath = "apps/web/package.json";
  const nativePath = "apps/native/package.json";

  const frontendType = getFrontendType(frontend);

  // React Query for React-based frontends
  if (frontendType.hasReactWeb && vfs.exists(webPath) && backend !== "convex") {
    addPackageDependency({
      vfs,
      packagePath: webPath,
      dependencies: ["@tanstack/react-query"],
    });
  }

  // Native React Query
  if (frontendType.hasNative && vfs.exists(nativePath) && backend !== "convex") {
    addPackageDependency({
      vfs,
      packagePath: nativePath,
      dependencies: ["@tanstack/react-query"],
    });
  }
}
