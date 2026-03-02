import type { ProjectConfig } from "@better-fullstack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

import { addPackageDependency, type AvailableDependencies } from "../utils/add-deps";
import { getWebPackagePath } from "../utils/project-paths";

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
      "angular",
      "redwood",
    ].includes(f),
  );

  if (!hasWeb) return;

  const webPath = getWebPackagePath(frontend);
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
  const { uiLibrary, frontend } = config;

  const hasReactWeb = frontend.some((f) =>
    ["tanstack-router", "react-router", "tanstack-start", "next", "redwood"].includes(f),
  );
  const hasNuxt = frontend.includes("nuxt");
  const hasSolid = frontend.includes("solid");
  const hasSvelte = frontend.includes("svelte");

  // Astro integration detection
  const hasAstro = frontend.includes("astro");
  const hasAstroReact = hasAstro && config.astroIntegration === "react";
  const hasAstroVue = hasAstro && config.astroIntegration === "vue";
  const hasAstroSvelte = hasAstro && config.astroIntegration === "svelte";
  const hasAstroSolid = hasAstro && config.astroIntegration === "solid";

  if (uiLibrary === "none") return;

  if (uiLibrary === "shadcn-ui") {
    processShadcnDeps(vfs, config);
    return;
  }

  const webPath = getWebPackagePath(frontend);
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
      if (hasReactWeb || hasAstroReact) {
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
      if (hasReactWeb || hasAstroReact) {
        deps.push("@headlessui/react");
      } else if (hasNuxt || hasAstroVue) {
        deps.push("@headlessui/vue");
      }
      break;

    case "park-ui":
      deps.push("@park-ui/panda-preset");
      if (hasReactWeb || hasAstroReact) {
        deps.push("@ark-ui/react");
      } else if (hasNuxt || hasAstroVue) {
        deps.push("@ark-ui/vue");
      } else if (hasSolid || hasAstroSolid) {
        deps.push("@ark-ui/solid");
      }
      break;

    case "chakra-ui":
      if (hasReactWeb || hasAstroReact) {
        deps.push("@chakra-ui/react", "@emotion/react");
      }
      break;

    case "nextui":
      if (hasReactWeb || hasAstroReact) {
        deps.push("@heroui/react", "framer-motion");
      }
      break;

    case "mantine":
      if (hasReactWeb || hasAstroReact) {
        deps.push("@mantine/core", "@mantine/hooks");
      }
      break;

    case "base-ui":
      if (hasReactWeb || hasAstroReact) {
        deps.push("@base-ui-components/react");
      }
      break;

    case "ark-ui":
      if (hasReactWeb || hasAstroReact) {
        deps.push("@ark-ui/react");
      } else if (hasNuxt || hasAstroVue) {
        deps.push("@ark-ui/vue");
      } else if (hasSolid || hasAstroSolid) {
        deps.push("@ark-ui/solid");
      } else if (hasSvelte || hasAstroSvelte) {
        deps.push("@ark-ui/svelte");
      }
      break;

    case "react-aria":
      if (hasReactWeb || hasAstroReact) {
        deps.push("react-aria-components");
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
 * Process shadcn/ui dependencies based on sub-options (base, icon library, etc.)
 */
function processShadcnDeps(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const { frontend } = config;
  const webPath = getWebPackagePath(frontend);
  if (!vfs.exists(webPath)) return;

  const deps: AvailableDependencies[] = [
    "shadcn",
    "class-variance-authority",
    "clsx",
    "tailwind-merge",
    "tw-animate-css",
  ];

  // Base UI library
  const shadcnBase = config.shadcnBase ?? "radix";
  if (shadcnBase === "radix") {
    deps.push("radix-ui");
  } else {
    deps.push("@base-ui-components/react");
  }

  // Icon library
  const iconLib = config.shadcnIconLibrary ?? "lucide";
  switch (iconLib) {
    case "lucide":
      deps.push("lucide-react");
      break;
    case "tabler":
      deps.push("@tabler/icons-react");
      break;
    case "hugeicons":
      deps.push("@hugeicons/react", "@hugeicons/core-free-icons");
      break;
    case "phosphor":
      deps.push("@phosphor-icons/react");
      break;
    case "remixicon":
      deps.push("@remixicon/react");
      break;
  }

  // Font package
  const font = config.shadcnFont ?? "inter";
  const FONT_PACKAGE_MAP: Record<string, AvailableDependencies[]> = {
    inter: ["@fontsource-variable/inter"],
    geist: ["geist"],
    figtree: ["@fontsource-variable/figtree"],
    "noto-sans": ["@fontsource-variable/noto-sans"],
    "nunito-sans": ["@fontsource-variable/nunito-sans"],
    roboto: ["@fontsource/roboto"],
    raleway: ["@fontsource-variable/raleway"],
    "dm-sans": ["@fontsource-variable/dm-sans"],
    "public-sans": ["@fontsource/public-sans"],
    outfit: ["@fontsource-variable/outfit"],
    "jetbrains-mono": ["@fontsource-variable/jetbrains-mono"],
    "geist-mono": ["geist"],
  };
  const fontPkgs = FONT_PACKAGE_MAP[font];
  if (fontPkgs) deps.push(...fontPkgs);

  addPackageDependency({
    vfs,
    packagePath: webPath,
    dependencies: deps,
  });
}

/**
 * Combined processor for both CSS framework and UI library dependencies
 */
export function processCSSAndUILibraryDeps(vfs: VirtualFileSystem, config: ProjectConfig): void {
  processCSSFrameworkDeps(vfs, config);
  processUILibraryDeps(vfs, config);
}
