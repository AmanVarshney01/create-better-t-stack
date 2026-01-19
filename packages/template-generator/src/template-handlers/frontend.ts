import type { ProjectConfig } from "@better-t-stack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

import { type TemplateData, processTemplatesFromPrefix } from "./utils";

export async function processFrontendTemplates(
  vfs: VirtualFileSystem,
  templates: TemplateData,
  config: ProjectConfig,
): Promise<void> {
  const hasReactWeb = config.frontend.some((f) =>
    ["tanstack-router", "react-router", "tanstack-start", "next"].includes(f),
  );
  const hasNuxtWeb = config.frontend.includes("nuxt");
  const hasSvelteWeb = config.frontend.includes("svelte");
  const hasSolidWeb = config.frontend.includes("solid");
  const hasAstroWeb = config.frontend.includes("astro");
  const hasQwikWeb = config.frontend.includes("qwik");
  const hasAngularWeb = config.frontend.includes("angular");
  const hasNativeBare = config.frontend.includes("native-bare");
  const hasNativeUniwind = config.frontend.includes("native-uniwind");
  const hasUnistyles = config.frontend.includes("native-unistyles");
  const isConvex = config.backend === "convex";

  if (
    hasReactWeb ||
    hasNuxtWeb ||
    hasSvelteWeb ||
    hasSolidWeb ||
    hasAstroWeb ||
    hasQwikWeb ||
    hasAngularWeb
  ) {
    if (hasReactWeb) {
      processTemplatesFromPrefix(vfs, templates, "frontend/react/web-base", "apps/web", config);

      const reactFramework = config.frontend.find((f) =>
        ["tanstack-router", "react-router", "tanstack-start", "next"].includes(f),
      );
      if (reactFramework) {
        processTemplatesFromPrefix(
          vfs,
          templates,
          `frontend/react/${reactFramework}`,
          "apps/web",
          config,
        );
      }
    } else if (hasNuxtWeb) {
      processTemplatesFromPrefix(vfs, templates, "frontend/nuxt", "apps/web", config);
    } else if (hasSvelteWeb) {
      processTemplatesFromPrefix(vfs, templates, "frontend/svelte", "apps/web", config);
    } else if (hasSolidWeb) {
      processTemplatesFromPrefix(vfs, templates, "frontend/solid", "apps/web", config);
    } else if (hasAstroWeb) {
      // Process base Astro templates
      processTemplatesFromPrefix(vfs, templates, "frontend/astro", "apps/web", config);

      // Process integration-specific templates (React, Vue, Svelte, Solid)
      if (config.astroIntegration && config.astroIntegration !== "none") {
        processTemplatesFromPrefix(
          vfs,
          templates,
          `frontend/astro/integrations/${config.astroIntegration}`,
          "apps/web",
          config,
        );
      }
    } else if (hasQwikWeb) {
      processTemplatesFromPrefix(vfs, templates, "frontend/qwik", "apps/web", config);
    } else if (hasAngularWeb) {
      processTemplatesFromPrefix(vfs, templates, "frontend/angular", "apps/web", config);
    }
  }

  if (hasNativeBare || hasNativeUniwind || hasUnistyles) {
    processTemplatesFromPrefix(vfs, templates, "frontend/native/base", "apps/native", config);

    if (hasNativeBare) {
      processTemplatesFromPrefix(vfs, templates, "frontend/native/bare", "apps/native", config);
    } else if (hasNativeUniwind) {
      processTemplatesFromPrefix(vfs, templates, "frontend/native/uniwind", "apps/native", config);
    } else if (hasUnistyles) {
      processTemplatesFromPrefix(
        vfs,
        templates,
        "frontend/native/unistyles",
        "apps/native",
        config,
      );
    }

    if (!isConvex && (config.api === "trpc" || config.api === "orpc" || config.api === "ts-rest")) {
      processTemplatesFromPrefix(vfs, templates, `api/${config.api}/native`, "apps/native", config);
    }
  }
}
