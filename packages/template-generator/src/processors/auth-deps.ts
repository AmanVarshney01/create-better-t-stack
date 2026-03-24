import type { ProjectConfig } from "@better-t-stack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";
import { addPackageDependency } from "../utils/add-deps";

const CONVEX_BETTER_AUTH_VERSION = "1.5.3";

export function processAuthDeps(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const { auth, backend } = config;
  if (!auth || auth === "none") return;

  if (backend === "convex") {
    processConvexAuthDeps(vfs, config);
  } else {
    processStandardAuthDeps(vfs, config);
  }
}

function processConvexAuthDeps(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const { auth, frontend } = config;
  const webPath = "apps/web/package.json";
  const nativePath = "apps/native/package.json";
  const backendPath = "packages/backend/package.json";

  const webExists = vfs.exists(webPath);
  const nativeExists = vfs.exists(nativePath);
  const backendExists = vfs.exists(backendPath);

  const hasNative = frontend.some((f) =>
    ["native-bare", "native-uniwind", "native-unistyles"].includes(f),
  );
  const hasNextJs = frontend.includes("next");
  const hasReactRouter = frontend.includes("react-router");
  const hasTanStackRouter = frontend.includes("tanstack-router");
  const hasTanStackStart = frontend.includes("tanstack-start");
  const hasViteReact = hasReactRouter || hasTanStackRouter;
  const hasSolid = frontend.includes("solid");
  const hasSvelte = frontend.includes("svelte");
  const hasReactWebAuthForms = hasNextJs || hasTanStackStart || hasViteReact;

  if (auth === "clerk") {
    if (webExists) {
      if (hasNextJs) {
        addPackageDependency({ vfs, packagePath: webPath, dependencies: ["@clerk/nextjs"] });
      } else if (hasReactRouter) {
        addPackageDependency({ vfs, packagePath: webPath, dependencies: ["@clerk/react-router"] });
      } else if (hasTanStackRouter) {
        addPackageDependency({ vfs, packagePath: webPath, dependencies: ["@clerk/react"] });
      } else if (hasTanStackStart) {
        addPackageDependency({
          vfs,
          packagePath: webPath,
          dependencies: ["@clerk/tanstack-react-start"],
        });
      }
    }
    if (nativeExists && hasNative) {
      addPackageDependency({ vfs, packagePath: nativePath, dependencies: ["@clerk/expo"] });
    }
  } else if (auth === "better-auth") {
    if (backendExists) {
      addPackageDependency({
        vfs,
        packagePath: backendPath,
        dependencies: ["better-auth", "@convex-dev/better-auth"],
        customDependencies: {
          "better-auth": CONVEX_BETTER_AUTH_VERSION,
        },
      });
      if (hasNative) {
        addPackageDependency({
          vfs,
          packagePath: backendPath,
          dependencies: ["@better-auth/expo"],
          customDependencies: {
            "@better-auth/expo": CONVEX_BETTER_AUTH_VERSION,
          },
        });
      }
    }

    if (webExists) {
      addPackageDependency({
        vfs,
        packagePath: webPath,
        dependencies: ["better-auth", "@convex-dev/better-auth"],
        customDependencies: {
          "better-auth": CONVEX_BETTER_AUTH_VERSION,
        },
      });

      if (hasReactWebAuthForms) {
        addPackageDependency({ vfs, packagePath: webPath, dependencies: ["@tanstack/react-form"] });
      }
      if (hasSolid) {
        addPackageDependency({ vfs, packagePath: webPath, dependencies: ["@tanstack/solid-form"] });
      }
      if (hasSvelte) {
        addPackageDependency({
          vfs,
          packagePath: webPath,
          dependencies: ["@tanstack/svelte-form"],
        });
      }
    }

    if (nativeExists && hasNative) {
      addPackageDependency({
        vfs,
        packagePath: nativePath,
        dependencies: [
          "better-auth",
          "@better-auth/expo",
          "@convex-dev/better-auth",
          "@tanstack/react-form",
        ],
        customDependencies: {
          "better-auth": CONVEX_BETTER_AUTH_VERSION,
          "@better-auth/expo": CONVEX_BETTER_AUTH_VERSION,
        },
      });
    }
  }
}

function processStandardAuthDeps(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const { auth, backend, frontend } = config;
  const authPath = "packages/auth/package.json";
  const apiPath = "packages/api/package.json";
  const webPath = "apps/web/package.json";
  const nativePath = "apps/native/package.json";
  const serverPath = "apps/server/package.json";

  const authExists = vfs.exists(authPath);
  const apiExists = vfs.exists(apiPath);
  const webExists = vfs.exists(webPath);
  const nativeExists = vfs.exists(nativePath);
  const serverExists = vfs.exists(serverPath);

  const hasNative = frontend.some((f) =>
    ["native-bare", "native-uniwind", "native-unistyles"].includes(f),
  );
  const hasWebFrontend = frontend.some((f) =>
    [
      "react-router",
      "tanstack-router",
      "tanstack-start",
      "next",
      "nuxt",
      "svelte",
      "solid",
      "astro",
    ].includes(f),
  );
  const hasReactWebAuthForms = frontend.some((f) =>
    ["react-router", "tanstack-router", "tanstack-start", "next"].includes(f),
  );
  const hasSolid = frontend.includes("solid");
  const hasSvelte = frontend.includes("svelte");
  const hasNextJs = frontend.includes("next");
  const hasReactRouter = frontend.includes("react-router");
  const hasTanStackRouter = frontend.includes("tanstack-router");
  const hasTanStackStart = frontend.includes("tanstack-start");

  if (auth === "clerk") {
    if (webExists) {
      if (hasNextJs) {
        addPackageDependency({ vfs, packagePath: webPath, dependencies: ["@clerk/nextjs"] });
      } else if (hasReactRouter) {
        addPackageDependency({ vfs, packagePath: webPath, dependencies: ["@clerk/react-router"] });
      } else if (hasTanStackRouter) {
        addPackageDependency({ vfs, packagePath: webPath, dependencies: ["@clerk/react"] });
      } else if (hasTanStackStart) {
        addPackageDependency({
          vfs,
          packagePath: webPath,
          dependencies: ["@clerk/tanstack-react-start"],
        });
      }
    }

    if (hasNative && nativeExists) {
      addPackageDependency({ vfs, packagePath: nativePath, dependencies: ["@clerk/expo"] });
    }

    if (apiExists) {
      if (backend === "self" || backend === "hono" || backend === "elysia") {
        addPackageDependency({ vfs, packagePath: apiPath, dependencies: ["@clerk/backend"] });
      } else if (backend === "express") {
        addPackageDependency({ vfs, packagePath: apiPath, dependencies: ["@clerk/express"] });
      } else if (backend === "fastify") {
        addPackageDependency({ vfs, packagePath: apiPath, dependencies: ["@clerk/fastify"] });
      }
    }

    if (serverExists) {
      if (backend === "express") {
        addPackageDependency({ vfs, packagePath: serverPath, dependencies: ["@clerk/express"] });
      } else if (backend === "fastify") {
        addPackageDependency({ vfs, packagePath: serverPath, dependencies: ["@clerk/fastify"] });
      }
    }
  } else if (auth === "better-auth") {
    if (authExists) {
      addPackageDependency({ vfs, packagePath: authPath, dependencies: ["better-auth"] });
      if (hasNative) {
        addPackageDependency({ vfs, packagePath: authPath, dependencies: ["@better-auth/expo"] });
      }
    }

    if (hasWebFrontend && webExists) {
      addPackageDependency({ vfs, packagePath: webPath, dependencies: ["better-auth"] });

      if (hasReactWebAuthForms) {
        addPackageDependency({ vfs, packagePath: webPath, dependencies: ["@tanstack/react-form"] });
      }
      if (hasSolid) {
        addPackageDependency({ vfs, packagePath: webPath, dependencies: ["@tanstack/solid-form"] });
      }
      if (hasSvelte) {
        addPackageDependency({
          vfs,
          packagePath: webPath,
          dependencies: ["@tanstack/svelte-form"],
        });
      }
    }

    if (hasNative && nativeExists) {
      addPackageDependency({
        vfs,
        packagePath: nativePath,
        dependencies: ["better-auth", "@better-auth/expo", "@tanstack/react-form"],
      });
    }
  }
}
