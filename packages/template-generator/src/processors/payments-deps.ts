import type { ProjectConfig } from "@better-t-stack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

import { addPackageDependency } from "../utils/add-deps";

export function processPaymentsDeps(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const { payments, frontend } = config;
  if (!payments || payments === "none") return;

  const authPath = "packages/auth/package.json";
  const webPath = "apps/web/package.json";

  if (payments === "polar") {
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

  if (payments === "stripe") {
    const serverPath = "apps/server/package.json";

    // Add server-side Stripe SDK
    if (vfs.exists(serverPath)) {
      addPackageDependency({
        vfs,
        packagePath: serverPath,
        dependencies: ["stripe"],
      });
    }

    // Also add to auth package if it exists (for webhook handling)
    if (vfs.exists(authPath)) {
      addPackageDependency({
        vfs,
        packagePath: authPath,
        dependencies: ["stripe"],
      });
    }

    // Add client-side Stripe.js for web frontends
    if (vfs.exists(webPath)) {
      const hasReactWeb = frontend.some((f) =>
        ["react-router", "tanstack-router", "tanstack-start", "next"].includes(f),
      );
      const hasOtherWeb = frontend.some((f) => ["nuxt", "svelte", "solid"].includes(f));

      if (hasReactWeb) {
        // React apps get the React bindings
        addPackageDependency({
          vfs,
          packagePath: webPath,
          dependencies: ["@stripe/stripe-js", "@stripe/react-stripe-js"],
        });
      } else if (hasOtherWeb) {
        // Non-React web apps get just the base Stripe.js
        addPackageDependency({
          vfs,
          packagePath: webPath,
          dependencies: ["@stripe/stripe-js"],
        });
      }
    }
  }
}
