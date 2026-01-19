import type { Frontend, ProjectConfig } from "@better-t-stack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

import { addPackageDependency, type AvailableDependencies } from "../utils/add-deps";

// React-based web frameworks that support form libraries
const REACT_WEB_FRAMEWORKS: Frontend[] = [
  "tanstack-router",
  "react-router",
  "tanstack-start",
  "next",
];

// Native frameworks (always React-based)
const NATIVE_FRAMEWORKS: Frontend[] = ["native-bare", "native-uniwind", "native-unistyles"];

export function processFormsDeps(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const { forms, frontend } = config;

  // Skip if not selected or set to "none"
  if (!forms || forms === "none") return;

  // Determine which packages need form library deps
  const hasReactWeb = frontend.some((f) => REACT_WEB_FRAMEWORKS.includes(f));
  const hasNative = frontend.some((f) => NATIVE_FRAMEWORKS.includes(f));

  // Add to web package if it's a React-based web frontend
  const webPath = "apps/web/package.json";
  if (hasReactWeb && vfs.exists(webPath)) {
    const deps = getFormsDeps(forms, "web");
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
    const deps = getFormsDeps(forms, "native");
    if (deps.length > 0) {
      addPackageDependency({
        vfs,
        packagePath: nativePath,
        dependencies: deps,
      });
    }
  }
}

function getFormsDeps(
  forms: ProjectConfig["forms"],
  _target: "web" | "native",
): AvailableDependencies[] {
  const deps: AvailableDependencies[] = [];

  switch (forms) {
    case "formik":
      deps.push("formik", "yup");
      break;
    case "final-form":
      deps.push("final-form", "react-final-form");
      break;
    case "conform":
      deps.push("@conform-to/react", "@conform-to/zod");
      break;
    // react-hook-form and tanstack-form are handled elsewhere or already included
    // No additional deps needed for those cases
  }

  return deps;
}
