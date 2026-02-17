import type { Frontend, ProjectConfig } from "@better-fullstack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

import { addPackageDependency, type AvailableDependencies } from "../utils/add-deps";

// React-based web frameworks that support all state management libraries
const REACT_WEB_FRAMEWORKS: Frontend[] = [
  "tanstack-router",
  "react-router",
  "tanstack-start",
  "next",
];

// Non-React frameworks that support framework-agnostic state management
const OTHER_WEB_FRAMEWORKS: Frontend[] = ["solid", "svelte", "nuxt", "qwik", "astro", "fresh"];

// Native frameworks (always React-based)
const NATIVE_FRAMEWORKS: Frontend[] = ["native-bare", "native-uniwind", "native-unistyles"];

// Framework-agnostic state management that works with any frontend
// All state management libraries have framework-agnostic cores
const FRAMEWORK_AGNOSTIC_STATE: ProjectConfig["stateManagement"][] = [
  "zustand",
  "jotai",
  "valtio",
  "nanostores",
  "xstate",
  "mobx",
  "redux-toolkit",
  "tanstack-store",
  "legend-state",
];

export function processStateManagementDeps(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const { stateManagement, frontend, astroIntegration } = config;

  // Skip if not selected or set to "none"
  if (!stateManagement || stateManagement === "none") return;

  // Determine which packages need state management deps
  const hasReactWeb = frontend.some((f) => REACT_WEB_FRAMEWORKS.includes(f));
  const hasOtherWeb = frontend.some((f) => OTHER_WEB_FRAMEWORKS.includes(f));
  const hasNative = frontend.some((f) => NATIVE_FRAMEWORKS.includes(f));
  // Astro with React integration should be treated as React
  const hasAstroReact = frontend.includes("astro") && astroIntegration === "react";

  const webPath = "apps/web/package.json";

  // Add to web package if it's a React-based web frontend (all state management supported)
  // or Astro with React integration
  if ((hasReactWeb || hasAstroReact) && vfs.exists(webPath)) {
    const deps = getStateManagementDeps(stateManagement, "web", true);
    if (deps.length > 0) {
      addPackageDependency({
        vfs,
        packagePath: webPath,
        dependencies: deps,
      });
    }
  }

  // Add framework-agnostic state management to non-React frontends (excluding Astro+React)
  if (hasOtherWeb && !hasReactWeb && !hasAstroReact && vfs.exists(webPath)) {
    if (FRAMEWORK_AGNOSTIC_STATE.includes(stateManagement)) {
      const deps = getStateManagementDeps(stateManagement, "web", false);
      if (deps.length > 0) {
        addPackageDependency({
          vfs,
          packagePath: webPath,
          dependencies: deps,
        });
      }
    }
  }

  // Add to native package if it exists
  const nativePath = "apps/native/package.json";
  if (hasNative && vfs.exists(nativePath)) {
    const deps = getStateManagementDeps(stateManagement, "native", true);
    if (deps.length > 0) {
      addPackageDependency({
        vfs,
        packagePath: nativePath,
        dependencies: deps,
      });
    }
  }
}

function getStateManagementDeps(
  stateManagement: ProjectConfig["stateManagement"],
  _target: "web" | "native",
  isReact: boolean,
): AvailableDependencies[] {
  const deps: AvailableDependencies[] = [];

  switch (stateManagement) {
    case "zustand":
      // zustand works with any framework (uses vanilla store internally)
      deps.push("zustand");
      break;
    case "jotai":
      // jotai core works with any framework
      deps.push("jotai");
      break;
    case "nanostores":
      deps.push("nanostores");
      if (isReact) deps.push("@nanostores/react");
      break;
    case "redux-toolkit":
      deps.push("@reduxjs/toolkit");
      if (isReact) deps.push("react-redux");
      break;
    case "mobx":
      deps.push("mobx");
      if (isReact) deps.push("mobx-react-lite");
      break;
    case "xstate":
      deps.push("xstate");
      if (isReact) deps.push("@xstate/react");
      break;
    case "valtio":
      // valtio works with any framework (proxy-based)
      deps.push("valtio");
      break;
    case "tanstack-store":
      deps.push("@tanstack/store");
      if (isReact) deps.push("@tanstack/react-store");
      break;
    case "legend-state":
      deps.push("@legendapp/state");
      if (isReact) deps.push("@legendapp/state-react");
      break;
  }

  return deps;
}
