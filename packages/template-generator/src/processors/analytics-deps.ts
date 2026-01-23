import type { ProjectConfig } from "@better-fullstack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

import { addPackageDependency } from "../utils/add-deps";

export function processAnalyticsDeps(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const { analytics, frontend } = config;
  if (!analytics || analytics === "none") return;

  // Check if we have a web frontend
  const hasWebFrontend = frontend.some(
    (f) =>
      f !== "none" && f !== "native-bare" && f !== "native-uniwind" && f !== "native-unistyles",
  );

  if (analytics === "plausible") {
    // Plausible is client-side only - add to web app
    if (hasWebFrontend) {
      const webPath = "apps/web/package.json";
      if (vfs.exists(webPath)) {
        addPackageDependency({
          vfs,
          packagePath: webPath,
          dependencies: ["plausible-tracker"],
        });
      }
    }
  }
}
