import type { Frontend, ProjectConfig } from "@better-t-stack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

import { addPackageDependency, type AvailableDependencies } from "../utils/add-deps";

// React-based web frameworks that can use Socket.IO client
const REACT_WEB_FRAMEWORKS: Frontend[] = [
  "tanstack-router",
  "react-router",
  "tanstack-start",
  "next",
];

// Native frameworks (always React-based)
const NATIVE_FRAMEWORKS: Frontend[] = ["native-bare", "native-uniwind", "native-unistyles"];

export function processRealtimeDeps(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const { realtime, frontend, backend } = config;

  // Skip if not selected or set to "none"
  if (!realtime || realtime === "none") return;

  // Skip if no backend to support real-time (convex has its own real-time)
  if (backend === "none" || backend === "convex") return;

  // Determine which packages need real-time deps
  const hasReactWeb = frontend.some((f) => REACT_WEB_FRAMEWORKS.includes(f));
  const hasNative = frontend.some((f) => NATIVE_FRAMEWORKS.includes(f));

  // Add server-side real-time dependencies
  const serverPath = "apps/server/package.json";
  if (vfs.exists(serverPath)) {
    const deps = getRealtimeServerDeps(realtime);
    if (deps.length > 0) {
      addPackageDependency({
        vfs,
        packagePath: serverPath,
        dependencies: deps,
      });
    }
  }

  // Add to web package if it's a React-based web frontend
  const webPath = "apps/web/package.json";
  if (hasReactWeb && vfs.exists(webPath)) {
    const deps = getRealtimeClientDeps(realtime);
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
    const deps = getRealtimeClientDeps(realtime);
    if (deps.length > 0) {
      addPackageDependency({
        vfs,
        packagePath: nativePath,
        dependencies: deps,
      });
    }
  }
}

function getRealtimeServerDeps(realtime: ProjectConfig["realtime"]): AvailableDependencies[] {
  const deps: AvailableDependencies[] = [];

  switch (realtime) {
    case "socket-io":
      deps.push("socket.io");
      break;
    case "partykit":
      deps.push("partykit");
      break;
  }

  return deps;
}

function getRealtimeClientDeps(realtime: ProjectConfig["realtime"]): AvailableDependencies[] {
  const deps: AvailableDependencies[] = [];

  switch (realtime) {
    case "socket-io":
      deps.push("socket.io-client");
      break;
    case "partykit":
      deps.push("partysocket");
      break;
  }

  return deps;
}
