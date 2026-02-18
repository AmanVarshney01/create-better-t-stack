import type { ProjectConfig } from "@better-fullstack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

import { addPackageDependency } from "../utils/add-deps";
import { getWebPackagePath, getServerPackagePath } from "../utils/project-paths";

export function processPaymentsDeps(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const { payments, frontend } = config;
  if (!payments || payments === "none") return;

  const authPath = "packages/auth/package.json";
  const webPath = getWebPackagePath(frontend);
  const serverPath = getServerPackagePath(frontend);

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
          "redwood",
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
        ["react-router", "tanstack-router", "tanstack-start", "next", "redwood"].includes(f),
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

  if (payments === "lemon-squeezy") {
    // Add server-side Lemon Squeezy SDK (server-side only for security)
    if (vfs.exists(serverPath)) {
      addPackageDependency({
        vfs,
        packagePath: serverPath,
        dependencies: ["@lemonsqueezy/lemonsqueezy.js"],
      });
    }

    // Also add to auth package if it exists (for webhook handling)
    if (vfs.exists(authPath)) {
      addPackageDependency({
        vfs,
        packagePath: authPath,
        dependencies: ["@lemonsqueezy/lemonsqueezy.js"],
      });
    }
  }

  if (payments === "paddle") {
    // Add server-side Paddle SDK
    if (vfs.exists(serverPath)) {
      addPackageDependency({
        vfs,
        packagePath: serverPath,
        dependencies: ["@paddle/paddle-node-sdk"],
      });
    }

    // Also add to auth package if it exists (for webhook handling)
    if (vfs.exists(authPath)) {
      addPackageDependency({
        vfs,
        packagePath: authPath,
        dependencies: ["@paddle/paddle-node-sdk"],
      });
    }

    // Add client-side Paddle.js for web frontends
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
          "redwood",
        ].includes(f),
      );

      if (hasWebFrontend) {
        addPackageDependency({
          vfs,
          packagePath: webPath,
          dependencies: ["@paddle/paddle-js"],
        });
      }
    }
  }

  if (payments === "dodo") {
    // Add server-side Dodo Payments SDK
    if (vfs.exists(serverPath)) {
      addPackageDependency({
        vfs,
        packagePath: serverPath,
        dependencies: ["dodopayments"],
      });
    }

    // Also add to auth package if it exists (for webhook handling)
    if (vfs.exists(authPath)) {
      addPackageDependency({
        vfs,
        packagePath: authPath,
        dependencies: ["dodopayments"],
      });
    }

    // Add client-side Dodo Payments checkout for web frontends
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
          "redwood",
        ].includes(f),
      );

      if (hasWebFrontend) {
        addPackageDependency({
          vfs,
          packagePath: webPath,
          dependencies: ["dodopayments-checkout"],
        });
      }
    }
  }
}
