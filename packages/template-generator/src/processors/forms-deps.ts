import type { Frontend, ProjectConfig } from "@better-fullstack/types";

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

// SolidJS frameworks
const SOLID_FRAMEWORKS: Frontend[] = ["solid"];

// Qwik frameworks
const QWIK_FRAMEWORKS: Frontend[] = ["qwik"];

export function processFormsDeps(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const { forms, frontend, astroIntegration } = config;

  // Skip if not selected or set to "none"
  if (!forms || forms === "none") return;

  // Determine which packages need form library deps
  const hasReactWeb = frontend.some((f) => REACT_WEB_FRAMEWORKS.includes(f));
  const hasNative = frontend.some((f) => NATIVE_FRAMEWORKS.includes(f));
  const hasSolid = frontend.some((f) => SOLID_FRAMEWORKS.includes(f));
  const hasQwik = frontend.some((f) => QWIK_FRAMEWORKS.includes(f));
  // Astro with React integration should be treated as React
  const hasAstroReact = frontend.includes("astro") && astroIntegration === "react";

  // Add to web package if it's a React-based web frontend or Astro with React
  const webPath = "apps/web/package.json";
  if ((hasReactWeb || hasAstroReact) && vfs.exists(webPath)) {
    const deps = getFormsDeps(forms, "react");
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
    const deps = getFormsDeps(forms, "react");
    if (deps.length > 0) {
      addPackageDependency({
        vfs,
        packagePath: nativePath,
        dependencies: deps,
      });
    }
  }

  // Add to Solid web package if it exists
  if (hasSolid && vfs.exists(webPath)) {
    const deps = getFormsDeps(forms, "solid");
    if (deps.length > 0) {
      addPackageDependency({
        vfs,
        packagePath: webPath,
        dependencies: deps,
      });
    }
  }

  // Add to Qwik web package if it exists
  if (hasQwik && vfs.exists(webPath)) {
    const deps = getFormsDeps(forms, "qwik");
    if (deps.length > 0) {
      addPackageDependency({
        vfs,
        packagePath: webPath,
        dependencies: deps,
      });
    }
  }
}

function getFormsDeps(
  forms: ProjectConfig["forms"],
  target: "react" | "solid" | "qwik",
): AvailableDependencies[] {
  const deps: AvailableDependencies[] = [];

  switch (forms) {
    case "formik":
      if (target === "react") {
        deps.push("formik", "yup");
      }
      break;
    case "final-form":
      if (target === "react") {
        deps.push("final-form", "react-final-form");
      }
      break;
    case "conform":
      if (target === "react") {
        deps.push("@conform-to/react", "@conform-to/zod");
      }
      break;
    case "modular-forms":
      if (target === "solid") {
        deps.push("@modular-forms/solid");
      } else if (target === "qwik") {
        deps.push("@modular-forms/qwik");
      }
      break;
    case "tanstack-form":
      if (target === "react") {
        deps.push("@tanstack/react-form");
      } else if (target === "solid") {
        deps.push("@tanstack/solid-form");
      }
      break;
    // react-hook-form is already included in templates
  }

  return deps;
}
