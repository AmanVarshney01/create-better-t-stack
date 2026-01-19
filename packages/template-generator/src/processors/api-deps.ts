import type { ProjectConfig, Frontend, API, Backend } from "@better-t-stack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

import { addPackageDependency, type AvailableDependencies } from "../utils/add-deps";

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
  const { api, backend, frontend, auth } = config;
  const frontendType = getFrontendType(frontend);

  if (backend === "convex") {
    addConvexDeps(vfs, frontend, frontendType);
    return;
  }

  if (api === "none") return;

  addApiPackageDeps(vfs, api, backend, frontend, auth);
  addServerDeps(vfs, api, backend);
  addSelfBackendWebDeps(vfs, api, backend, frontendType);
  addWebClientDeps(vfs, api, backend, frontendType);
  if (frontendType.hasNative) addNativeDeps(vfs, api, backend);
  addQueryDeps(vfs, frontend, backend);
}

function addApiPackageDeps(
  vfs: VirtualFileSystem,
  api: API,
  backend: Backend,
  frontend: Frontend[],
  auth: ProjectConfig["auth"],
): void {
  const pkgPath = "packages/api/package.json";
  if (!vfs.exists(pkgPath)) return;

  if (api === "trpc") {
    addPackageDependency({
      vfs,
      packagePath: pkgPath,
      dependencies: ["@trpc/server", "@trpc/client", "zod"],
    });
  } else if (api === "orpc") {
    addPackageDependency({
      vfs,
      packagePath: pkgPath,
      dependencies: ["@orpc/server", "@orpc/client", "@orpc/openapi", "@orpc/zod", "zod"],
    });
  } else if (api === "ts-rest") {
    addPackageDependency({
      vfs,
      packagePath: pkgPath,
      dependencies: ["@ts-rest/core", "zod"],
    });
  } else if (api === "garph") {
    addPackageDependency({
      vfs,
      packagePath: pkgPath,
      dependencies: ["garph", "graphql-yoga", "graphql"],
    });
  }

  // Add next dep for api package when backend is self and frontend includes next
  if (backend === "self" && frontend.includes("next")) {
    addPackageDependency({ vfs, packagePath: pkgPath, dependencies: ["next"] });
  }

  // Add better-auth for express/fastify backends
  if (auth === "better-auth" && (backend === "express" || backend === "fastify")) {
    addPackageDependency({ vfs, packagePath: pkgPath, dependencies: ["better-auth"] });
  }

  // Add @types/express for express backend
  if (backend === "express") {
    addPackageDependency({ vfs, packagePath: pkgPath, devDependencies: ["@types/express"] });
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
  } else if (api === "ts-rest") {
    addPackageDependency({
      vfs,
      packagePath: serverPath,
      dependencies: ["@ts-rest/core", "@ts-rest/serverless"],
    });
  } else if (api === "garph") {
    addPackageDependency({
      vfs,
      packagePath: serverPath,
      dependencies: ["garph", "graphql-yoga", "graphql"],
    });
  }
}

function addSelfBackendWebDeps(
  vfs: VirtualFileSystem,
  api: API,
  backend: Backend,
  frontendType: FrontendType,
): void {
  if (backend !== "self") return;

  const webPath = "apps/web/package.json";
  if (!vfs.exists(webPath) || !frontendType.hasReactWeb) return;

  // When backend is "self", add server deps to web too
  if (api === "trpc") {
    addPackageDependency({
      vfs,
      packagePath: webPath,
      dependencies: ["@trpc/server", "@trpc/client"],
    });
  } else if (api === "orpc") {
    addPackageDependency({
      vfs,
      packagePath: webPath,
      dependencies: ["@orpc/server", "@orpc/client", "@orpc/openapi", "@orpc/zod"],
    });
  } else if (api === "ts-rest") {
    addPackageDependency({
      vfs,
      packagePath: webPath,
      dependencies: ["@ts-rest/core", "@ts-rest/serverless", "@ts-rest/next"],
    });
  } else if (api === "garph") {
    addPackageDependency({
      vfs,
      packagePath: webPath,
      dependencies: ["garph", "graphql-yoga", "graphql"],
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
  if (!vfs.exists(webPath) || backend === "convex") return;

  if (api === "trpc" && frontendType.hasReactWeb) {
    addPackageDependency({
      vfs,
      packagePath: webPath,
      dependencies: ["@trpc/tanstack-react-query", "@trpc/client", "@trpc/server"],
    });
  } else if (api === "ts-rest" && frontendType.hasReactWeb) {
    addPackageDependency({
      vfs,
      packagePath: webPath,
      dependencies: ["@ts-rest/core", "@ts-rest/react-query"],
    });
  } else if (api === "orpc" && frontendType.hasReactWeb) {
    addPackageDependency({
      vfs,
      packagePath: webPath,
      dependencies: ["@orpc/tanstack-query", "@orpc/client", "@orpc/server"],
    });
  } else if (api === "orpc" && frontendType.hasNuxtWeb) {
    addPackageDependency({
      vfs,
      packagePath: webPath,
      dependencies: ["@tanstack/vue-query", "@orpc/tanstack-query", "@orpc/client", "@orpc/server"],
      devDependencies: ["@tanstack/vue-query-devtools"],
    });
  } else if (api === "orpc" && frontendType.hasSvelteWeb) {
    addPackageDependency({
      vfs,
      packagePath: webPath,
      dependencies: [
        "@orpc/tanstack-query",
        "@orpc/client",
        "@orpc/server",
        "@tanstack/svelte-query",
      ],
      devDependencies: ["@tanstack/svelte-query-devtools"],
    });
  } else if (api === "orpc" && frontendType.hasSolidWeb) {
    addPackageDependency({
      vfs,
      packagePath: webPath,
      dependencies: [
        "@orpc/tanstack-query",
        "@orpc/client",
        "@orpc/server",
        "@tanstack/solid-query",
      ],
      devDependencies: ["@tanstack/solid-query-devtools", "@tanstack/solid-router-devtools"],
    });
  } else if (api === "garph" && frontendType.hasReactWeb) {
    addPackageDependency({
      vfs,
      packagePath: webPath,
      dependencies: ["@garph/gqty", "gqty"],
    });
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
      dependencies: ["@trpc/tanstack-react-query", "@trpc/client", "@trpc/server"],
    });
  } else if (api === "orpc") {
    addPackageDependency({
      vfs,
      packagePath: nativePath,
      dependencies: ["@orpc/tanstack-query", "@orpc/client"],
    });
  } else if (api === "ts-rest") {
    addPackageDependency({
      vfs,
      packagePath: nativePath,
      dependencies: ["@ts-rest/core", "@ts-rest/react-query"],
    });
  } else if (api === "garph") {
    addPackageDependency({
      vfs,
      packagePath: nativePath,
      dependencies: ["@garph/gqty", "gqty"],
    });
  }
}

function addQueryDeps(vfs: VirtualFileSystem, frontend: Frontend[], backend: Backend): void {
  const webPath = "apps/web/package.json";
  const nativePath = "apps/native/package.json";
  const frontendType = getFrontendType(frontend);

  if (frontendType.hasReactWeb && vfs.exists(webPath) && backend !== "convex") {
    addPackageDependency({
      vfs,
      packagePath: webPath,
      dependencies: ["@tanstack/react-query"],
      devDependencies: ["@tanstack/react-query-devtools"],
    });
  }

  if (frontendType.hasSolidWeb && vfs.exists(webPath) && backend !== "convex") {
    addPackageDependency({
      vfs,
      packagePath: webPath,
      dependencies: ["@tanstack/solid-query"],
      devDependencies: ["@tanstack/solid-query-devtools", "@tanstack/solid-router-devtools"],
    });
  }

  if (frontendType.hasNative && vfs.exists(nativePath) && backend !== "convex") {
    addPackageDependency({
      vfs,
      packagePath: nativePath,
      dependencies: ["@tanstack/react-query"],
    });
  }
}

function addConvexDeps(
  vfs: VirtualFileSystem,
  frontend: Frontend[],
  frontendType: FrontendType,
): void {
  const webPath = "apps/web/package.json";
  const nativePath = "apps/native/package.json";
  const webExists = vfs.exists(webPath);
  const nativeExists = vfs.exists(nativePath);

  if (webExists) {
    const deps: AvailableDependencies[] = ["convex"];
    if (frontend.includes("tanstack-start")) {
      deps.push("@convex-dev/react-query", "@tanstack/react-router-ssr-query");
    }
    if (frontend.includes("svelte")) {
      deps.push("convex-svelte");
    }
    if (frontend.includes("nuxt")) {
      deps.push("convex-nuxt", "convex-vue");
    }
    addPackageDependency({ vfs, packagePath: webPath, dependencies: deps });
  }

  if (nativeExists && frontendType.hasNative) {
    addPackageDependency({ vfs, packagePath: nativePath, dependencies: ["convex"] });
  }
}
