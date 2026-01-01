/**
 * Payments dependencies processor
 * Adds Polar SDK deps based on payments config
 */

import type { ProjectConfig } from "@better-t-stack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

import { addPackageDependency } from "../utils/add-deps";

export function processPaymentsDeps(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const { payments, frontend } = config;

  if (!payments || payments === "none") return;

  const authPath = "packages/auth/package.json";
  const webPath = "apps/web/package.json";

  const authExists = vfs.exists(authPath);
  const webExists = vfs.exists(webPath);

  if (payments === "polar") {
    // Polar in auth package
    if (authExists) {
      addPackageDependency({
        vfs,
        packagePath: authPath,
        dependencies: ["@polar-sh/better-auth", "@polar-sh/sdk"],
      });
    }

    // Polar in web client
    if (webExists) {
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
