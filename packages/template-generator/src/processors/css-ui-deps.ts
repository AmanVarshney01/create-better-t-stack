import type { ProjectConfig } from "@better-t-stack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

import { addPackageDependency, type AvailableDependencies } from "../utils/add-deps";

/**
 * Process CSS framework dependencies based on config.cssFramework
 */
export function processCSSFrameworkDeps(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const { cssFramework, frontend } = config;

  const hasWeb = frontend.some((f) =>
    [
      "tanstack-router",
      "react-router",
      "tanstack-start",
      "next",
      "nuxt",
      "svelte",
      "solid",
      "astro",
      "qwik",
    ].includes(f),
  );

  if (!hasWeb) return;

  const webPath = "apps/web/package.json";
  if (!vfs.exists(webPath)) return;

  // Add CSS preprocessor dependencies
  if (cssFramework === "scss") {
    addPackageDependency({
      vfs,
      packagePath: webPath,
      devDependencies: ["sass"],
    });
  } else if (cssFramework === "less") {
    addPackageDependency({
      vfs,
      packagePath: webPath,
      devDependencies: ["less"],
    });
  }
  // tailwind, postcss-only, and none don't need extra dependencies
  // tailwind is already included in the base templates
}

/**
 * Process UI library dependencies based on config.uiLibrary
 */
export function processUILibraryDeps(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const { uiLibrary, frontend, cssFramework } = config;

  const hasReactWeb = frontend.some((f) =>
    ["tanstack-router", "react-router", "tanstack-start", "next"].includes(f),
  );
  const hasNuxt = frontend.includes("nuxt");
  const hasSolid = frontend.includes("solid");
  const hasSvelte = frontend.includes("svelte");

  if (uiLibrary === "none" || uiLibrary === "shadcn-ui") {
    // shadcn-ui is handled by the shadcn CLI, not as a package dependency
    return;
  }

  const webPath = "apps/web/package.json";
  if (!vfs.exists(webPath)) return;

  const deps: AvailableDependencies[] = [];

  switch (uiLibrary) {
    case "daisyui":
      // daisyui is a Tailwind plugin, added via tailwind.config
      addPackageDependency({
        vfs,
        packagePath: webPath,
        devDependencies: ["daisyui"],
      });
      break;

    case "radix-ui":
      if (hasReactWeb) {
        deps.push(
          "@radix-ui/react-dialog",
          "@radix-ui/react-dropdown-menu",
          "@radix-ui/react-slot",
          "@radix-ui/react-label",
          "@radix-ui/react-checkbox",
          "@radix-ui/react-select",
          "@radix-ui/react-toast",
          "@radix-ui/react-popover",
          "@radix-ui/react-switch",
          "@radix-ui/react-tabs",
        );
      }
      break;

    case "headless-ui":
      if (hasReactWeb) {
        deps.push("@headlessui/react");
      } else if (hasNuxt) {
        deps.push("@headlessui/vue");
      }
      break;

    case "park-ui":
      // Park UI uses Panda CSS preset and Ark UI components
      deps.push("@park-ui/panda-preset", "@park-ui/ark");
      break;

    case "chakra-ui":
      if (hasReactWeb) {
        deps.push("@chakra-ui/react", "@emotion/react");
      }
      break;

    case "nextui":
      if (hasReactWeb) {
        deps.push("@heroui/react", "framer-motion");
      }
      break;

    case "mantine":
      if (hasReactWeb) {
        deps.push("@mantine/core", "@mantine/hooks");
      }
      break;

    case "base-ui":
      if (hasReactWeb) {
        deps.push("@base-ui-components/react");
      }
      break;

    case "ark-ui":
      if (hasReactWeb) {
        deps.push("@ark-ui/react");
      } else if (hasNuxt) {
        deps.push("@ark-ui/vue");
      } else if (hasSolid) {
        deps.push("@ark-ui/solid");
      } else if (hasSvelte) {
        deps.push("@ark-ui/svelte");
      }
      break;
  }

  if (deps.length > 0) {
    addPackageDependency({
      vfs,
      packagePath: webPath,
      dependencies: deps,
    });
  }
}

/**
 * Combined processor for both CSS framework and UI library dependencies
 */
export function processCSSAndUILibraryDeps(vfs: VirtualFileSystem, config: ProjectConfig): void {
  processCSSFrameworkDeps(vfs, config);
  processUILibraryDeps(vfs, config);
}
