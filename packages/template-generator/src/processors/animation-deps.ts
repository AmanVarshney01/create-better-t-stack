import type { Frontend, ProjectConfig } from "@better-fullstack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

import { addPackageDependency, type AvailableDependencies } from "../utils/add-deps";

// React-based web frameworks that support all animation libraries
const REACT_WEB_FRAMEWORKS: Frontend[] = [
  "tanstack-router",
  "react-router",
  "tanstack-start",
  "next",
];

// Non-React frameworks that support framework-agnostic animations
const OTHER_WEB_FRAMEWORKS: Frontend[] = ["solid", "svelte", "nuxt", "qwik", "astro", "fresh"];

// Native frameworks (always React-based)
const NATIVE_FRAMEWORKS: Frontend[] = ["native-bare", "native-uniwind", "native-unistyles"];

// Framework-agnostic animations that work with any frontend
const FRAMEWORK_AGNOSTIC_ANIMATIONS: ProjectConfig["animation"][] = ["gsap", "auto-animate"];

export function processAnimationDeps(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const { animation, frontend } = config;

  // Skip if not selected or set to "none"
  if (!animation || animation === "none") return;

  // Determine which packages need animation deps
  const hasReactWeb = frontend.some((f) => REACT_WEB_FRAMEWORKS.includes(f));
  const hasOtherWeb = frontend.some((f) => OTHER_WEB_FRAMEWORKS.includes(f));
  const hasNative = frontend.some((f) => NATIVE_FRAMEWORKS.includes(f));

  const webPath = "apps/web/package.json";

  // Add to web package if it's a React-based web frontend (all animations supported)
  if (hasReactWeb && vfs.exists(webPath)) {
    const deps = getAnimationDeps(animation, false);
    if (deps.length > 0) {
      addPackageDependency({
        vfs,
        packagePath: webPath,
        dependencies: deps,
      });
    }
  }

  // Non-React frameworks support framework-agnostic animations (GSAP, auto-animate)
  if (hasOtherWeb && !hasReactWeb && vfs.exists(webPath)) {
    if (FRAMEWORK_AGNOSTIC_ANIMATIONS.includes(animation)) {
      const deps = getAnimationDeps(animation, false);
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
    const deps = getAnimationDeps(animation, true);
    if (deps.length > 0) {
      addPackageDependency({
        vfs,
        packagePath: nativePath,
        dependencies: deps,
      });
    }
  }
}

function getAnimationDeps(
  animation: ProjectConfig["animation"],
  isNative: boolean,
): AvailableDependencies[] {
  const deps: AvailableDependencies[] = [];

  switch (animation) {
    case "framer-motion":
      deps.push("motion");
      break;
    case "gsap":
      deps.push("gsap");
      break;
    case "react-spring":
      // Use platform-specific package
      deps.push(isNative ? "@react-spring/native" : "@react-spring/web");
      break;
    case "auto-animate":
      // Same package works for both web and native
      deps.push("@formkit/auto-animate");
      break;
    case "lottie":
      // Use platform-specific Lottie package
      deps.push(isNative ? "lottie-react-native" : "lottie-react");
      break;
  }

  return deps;
}
