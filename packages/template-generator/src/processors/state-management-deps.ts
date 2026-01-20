import type { Frontend, ProjectConfig } from "@better-fullstack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

import { addPackageDependency, type AvailableDependencies } from "../utils/add-deps";

// React-based web frameworks that support state management libraries
const REACT_WEB_FRAMEWORKS: Frontend[] = [
  "tanstack-router",
  "react-router",
  "tanstack-start",
  "next",
];

// Native frameworks (always React-based)
const NATIVE_FRAMEWORKS: Frontend[] = ["native-bare", "native-uniwind", "native-unistyles"];

export function processStateManagementDeps(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const { stateManagement, frontend } = config;

  // Skip if not selected or set to "none"
  if (!stateManagement || stateManagement === "none") return;

  // Determine which packages need state management deps
  const hasReactWeb = frontend.some((f) => REACT_WEB_FRAMEWORKS.includes(f));
  const hasNative = frontend.some((f) => NATIVE_FRAMEWORKS.includes(f));

  // Add to web package if it's a React-based web frontend
  const webPath = "apps/web/package.json";
  if (hasReactWeb && vfs.exists(webPath)) {
    const deps = getStateManagementDeps(stateManagement, "web");
    if (deps.length > 0) {
      addPackageDependency({
        vfs,
        packagePath: webPath,
        dependencies: deps,
      });
    }
  }

  // Add to native package if it exists
  const nativePath = "apps/native/package.json";
  if (hasNative && vfs.exists(nativePath)) {
    const deps = getStateManagementDeps(stateManagement, "native");
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
): AvailableDependencies[] {
  const deps: AvailableDependencies[] = [];

  switch (stateManagement) {
    case "zustand":
      deps.push("zustand");
      break;
    case "jotai":
      deps.push("jotai");
      break;
    case "nanostores":
      deps.push("nanostores", "@nanostores/react");
      break;
    case "redux-toolkit":
      deps.push("@reduxjs/toolkit", "react-redux");
      break;
    case "mobx":
      deps.push("mobx", "mobx-react-lite");
      break;
    case "xstate":
      deps.push("xstate", "@xstate/react");
      break;
    case "valtio":
      deps.push("valtio");
      break;
    case "tanstack-store":
      deps.push("@tanstack/store", "@tanstack/react-store");
      break;
    case "legend-state":
      deps.push("@legendapp/state", "@legendapp/state-react");
      break;
  }

  return deps;
}
