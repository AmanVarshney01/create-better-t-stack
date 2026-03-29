import type { ProjectConfig } from "@better-t-stack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";
import { addPackageDependency } from "../utils/add-deps";

export function processPaymentsDeps(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const { payments, frontend, backend } = config;
  if (!payments || payments === "none") return;

  const backendPath = "packages/backend/package.json";
  const authPath = "packages/auth/package.json";
  const webPath = "apps/web/package.json";

  if (payments === "polar") {
    if (backend === "convex") {
      if (vfs.exists(backendPath)) {
        addPackageDependency({
          vfs,
          packagePath: backendPath,
          dependencies: ["@convex-dev/polar", "@polar-sh/sdk"],
        });
      }

      if (vfs.exists(webPath)) {
        const hasReactWebFrontend = frontend.some((f) =>
          ["react-router", "tanstack-router", "tanstack-start", "next"].includes(f),
        );
        if (hasReactWebFrontend) {
          addPackageDependency({
            vfs,
            packagePath: webPath,
            dependencies: ["@convex-dev/polar", "@polar-sh/checkout"],
          });
        }
      }

      return;
    }

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
          "astro",
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
