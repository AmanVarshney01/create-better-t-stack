import type { ProjectConfig } from "@better-t-stack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

import { type TemplateData, processTemplatesFromPrefix } from "./utils";

export async function processPaymentsTemplates(
  vfs: VirtualFileSystem,
  templates: TemplateData,
  config: ProjectConfig,
): Promise<void> {
  if (!config.payments || config.payments === "none") return;

  const hasReactWeb = config.frontend.some((f) =>
    ["tanstack-router", "react-router", "tanstack-start", "next"].includes(f),
  );
  const hasNuxtWeb = config.frontend.includes("nuxt");
  const hasSvelteWeb = config.frontend.includes("svelte");
  const hasSolidWeb = config.frontend.includes("solid");
  const hasNativeBare = config.frontend.includes("native-bare");
  const hasUniwind = config.frontend.includes("native-uniwind");
  const hasUnistyles = config.frontend.includes("native-unistyles");
  const hasNative = hasNativeBare || hasUniwind || hasUnistyles;

  // Handle Convex backend separately - uses @convex-dev/polar
  if (config.backend === "convex") {
    // Process Convex-specific Polar templates
    processTemplatesFromPrefix(
      vfs,
      templates,
      `payments/${config.payments}/convex/backend`,
      "packages/backend",
      config,
    );

    // Process web frontend success pages for Convex
    if (hasReactWeb) {
      const reactFramework = config.frontend.find((f) =>
        ["tanstack-router", "react-router", "tanstack-start", "next"].includes(f),
      );
      if (reactFramework) {
        processTemplatesFromPrefix(
          vfs,
          templates,
          `payments/${config.payments}/convex/web/react/${reactFramework}`,
          "apps/web",
          config,
        );
      }
    }
    // Note: Nuxt/Svelte/Solid not yet supported with Convex + Polar

    // Process native frontend components for Convex
    if (hasNative) {
      processTemplatesFromPrefix(
        vfs,
        templates,
        `payments/${config.payments}/convex/native/base`,
        "apps/native",
        config,
      );

      let nativeFramework = "";
      if (hasNativeBare) nativeFramework = "bare";
      else if (hasUniwind) nativeFramework = "uniwind";
      else if (hasUnistyles) nativeFramework = "unistyles";

      if (nativeFramework) {
        processTemplatesFromPrefix(
          vfs,
          templates,
          `payments/${config.payments}/convex/native/${nativeFramework}`,
          "apps/native",
          config,
        );
      }
    }
    return;
  }

  // Non-Convex backends - use @polar-sh/better-auth
  if (config.backend !== "none") {
    processTemplatesFromPrefix(
      vfs,
      templates,
      `payments/${config.payments}/server/base`,
      "packages/auth",
      config,
    );
  }

  if (hasReactWeb) {
    const reactFramework = config.frontend.find((f) =>
      ["tanstack-router", "react-router", "tanstack-start", "next"].includes(f),
    );
    if (reactFramework) {
      processTemplatesFromPrefix(
        vfs,
        templates,
        `payments/${config.payments}/web/react/${reactFramework}`,
        "apps/web",
        config,
      );
    }
  } else if (hasNuxtWeb) {
    processTemplatesFromPrefix(
      vfs,
      templates,
      `payments/${config.payments}/web/nuxt`,
      "apps/web",
      config,
    );
  } else if (hasSvelteWeb) {
    processTemplatesFromPrefix(
      vfs,
      templates,
      `payments/${config.payments}/web/svelte`,
      "apps/web",
      config,
    );
  } else if (hasSolidWeb) {
    processTemplatesFromPrefix(
      vfs,
      templates,
      `payments/${config.payments}/web/solid`,
      "apps/web",
      config,
    );
  }
}
