import type { ProjectConfig } from "@better-t-stack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";
import { addPackageDependency } from "../utils/add-deps";

export function processPaymentsDeps(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const { payments, frontend } = config;
  if (!payments || payments === "none") return;

  const authPath = "packages/auth/package.json";
  const webPath = "apps/web/package.json";

  const hasWebFrontend = frontend.some((f: ProjectConfig["frontend"][number]) =>
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

  if (payments === "polar") {
    if (vfs.exists(authPath)) {
      addPackageDependency({
        vfs,
        packagePath: authPath,
        dependencies: ["@polar-sh/better-auth", "@polar-sh/sdk"],
      });
    }

    if (vfs.exists(webPath) && hasWebFrontend) {
      addPackageDependency({
        vfs,
        packagePath: webPath,
        dependencies: ["@polar-sh/better-auth"],
      });
    }
  }

  if (payments === "dodo") {
    if (vfs.exists(authPath)) {
      addPackageDependency({
        vfs,
        packagePath: authPath,
        dependencies: ["@dodopayments/better-auth", "dodopayments"],
      });
    }

    if (vfs.exists(webPath) && hasWebFrontend) {
      addPackageDependency({
        vfs,
        packagePath: webPath,
        dependencies: ["@dodopayments/better-auth"],
      });
    }
  }
}
