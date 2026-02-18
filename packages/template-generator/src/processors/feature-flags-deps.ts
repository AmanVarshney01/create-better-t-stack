import type { ProjectConfig } from "@better-fullstack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

import { addPackageDependency } from "../utils/add-deps";
import { getWebPackagePath } from "../utils/project-paths";

export function processFeatureFlagsDeps(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const { featureFlags, frontend, backend } = config;
  if (!featureFlags || featureFlags === "none") return;

  // Check if we have a web frontend
  const hasWebFrontend = frontend.some(
    (f) =>
      f !== "none" && f !== "native-bare" && f !== "native-uniwind" && f !== "native-unistyles",
  );

  const webPath = getWebPackagePath(frontend);

  if (featureFlags === "growthbook") {
    // Add client-side React SDK to web app
    if (hasWebFrontend) {
      if (vfs.exists(webPath)) {
        addPackageDependency({
          vfs,
          packagePath: webPath,
          dependencies: ["@growthbook/growthbook-react"],
        });
      }
    }

    // Add server-side SDK to backend
    if (backend !== "none" && backend !== "convex") {
      const serverPath = "apps/server/package.json";
      if (vfs.exists(serverPath)) {
        addPackageDependency({
          vfs,
          packagePath: serverPath,
          dependencies: ["@growthbook/growthbook"],
        });
      }
    }

    // For fullstack frameworks (Next.js, etc.), add both SDKs to web
    if (backend === "self" && hasWebFrontend) {
      if (vfs.exists(webPath)) {
        addPackageDependency({
          vfs,
          packagePath: webPath,
          dependencies: ["@growthbook/growthbook-react", "@growthbook/growthbook"],
        });
      }
    }
  }

  if (featureFlags === "posthog") {
    // Add client-side PostHog SDK to web app
    if (hasWebFrontend) {
      if (vfs.exists(webPath)) {
        addPackageDependency({
          vfs,
          packagePath: webPath,
          dependencies: ["posthog-js"],
        });
      }
    }

    // Add server-side PostHog SDK to backend
    if (backend !== "none" && backend !== "convex") {
      const serverPath = "apps/server/package.json";
      if (vfs.exists(serverPath)) {
        addPackageDependency({
          vfs,
          packagePath: serverPath,
          dependencies: ["posthog-node"],
        });
      }
    }

    // For fullstack frameworks (Next.js, etc.), add both SDKs to web
    if (backend === "self" && hasWebFrontend) {
      if (vfs.exists(webPath)) {
        addPackageDependency({
          vfs,
          packagePath: webPath,
          dependencies: ["posthog-js", "posthog-node"],
        });
      }
    }
  }
}
