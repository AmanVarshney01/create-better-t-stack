import type { ProjectConfig } from "@better-t-stack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

import { addPackageDependency } from "../utils/add-deps";

export function processPaymentsDeps(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const { payments, frontend, backend } = config;
  if (!payments || payments === "none") return;

  const authPath = "packages/auth/package.json";
  const webPath = "apps/web/package.json";
  const backendPath = "packages/backend/package.json";

  if (payments === "polar") {
    // Convex backend uses @convex-dev/polar for backend
    if (backend === "convex") {
      if (vfs.exists(backendPath)) {
        addPackageDependency({
          vfs,
          packagePath: backendPath,
          dependencies: ["@convex-dev/polar", "@polar-sh/sdk"],
        });
      }

      // Web frontend needs @polar-sh/better-auth for polarClient.
      // NOTE: Convex's @convex-dev/better-auth peers on better-auth 1.4.9 (exact),
      // while newer @polar-sh/better-auth versions peer on better-auth ^1.4.12.
      // So we pin a compatible @polar-sh/better-auth version and install its peer deps explicitly.
      if (vfs.exists(webPath)) {
        const hasWebFrontend = frontend.some((f) =>
          ["react-router", "tanstack-router", "tanstack-start", "next"].includes(f),
        );
        if (hasWebFrontend) {
          addPackageDependency({
            vfs,
            packagePath: webPath,
            dependencies: [
              "@polar-sh/better-auth",
              "@polar-sh/sdk",
              "@polar-sh/checkout",
              "@stripe/react-stripe-js",
              "@stripe/stripe-js",
            ],
          });
        }
      }
      return;
    }

    // Non-Convex: use @polar-sh/better-auth
    if (vfs.exists(authPath)) {
      addPackageDependency({
        vfs,
        packagePath: authPath,
        dependencies: ["@polar-sh/better-auth", "@polar-sh/sdk"],
      });
    }

    if (vfs.exists(webPath)) {
      const hasWebFrontend = frontend.some((f) =>
        [
          "react-router",
          "tanstack-router",
          "tanstack-start",
          "next",
          "nuxt",
          "svelte",
          "solid",
        ].includes(f),
      );
      if (hasWebFrontend) {
        addPackageDependency({
          vfs,
          packagePath: webPath,
          dependencies: ["@polar-sh/better-auth"],
        });
      }
    }
  }
}
