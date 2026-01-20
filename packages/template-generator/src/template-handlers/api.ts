import type { ProjectConfig } from "@better-fullstack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

import { type TemplateData, processTemplatesFromPrefix } from "./utils";

export async function processApiTemplates(
  vfs: VirtualFileSystem,
  templates: TemplateData,
  config: ProjectConfig,
): Promise<void> {
  if (config.api === "none") return;
  if (config.backend === "convex") return;

  processTemplatesFromPrefix(vfs, templates, `api/${config.api}/server`, "packages/api", config);

  const hasReactWeb = config.frontend.some((f) =>
    ["tanstack-router", "react-router", "tanstack-start", "next"].includes(f),
  );
  const hasNuxtWeb = config.frontend.includes("nuxt");
  const hasSvelteWeb = config.frontend.includes("svelte");
  const hasSolidWeb = config.frontend.includes("solid");
  const hasAstroWeb = config.frontend.includes("astro");

  if (hasReactWeb) {
    processTemplatesFromPrefix(
      vfs,
      templates,
      `api/${config.api}/web/react/base`,
      "apps/web",
      config,
    );

    const reactFramework = config.frontend.find((f) =>
      ["tanstack-router", "react-router", "tanstack-start", "next"].includes(f),
    );
    if (
      config.backend === "self" &&
      (reactFramework === "next" || reactFramework === "tanstack-start")
    ) {
      processTemplatesFromPrefix(
        vfs,
        templates,
        `api/${config.api}/fullstack/${reactFramework}`,
        "apps/web",
        config,
      );
    }
  } else if (hasAstroWeb) {
    // Astro with React integration can use tRPC or oRPC
    if (config.astroIntegration === "react") {
      processTemplatesFromPrefix(
        vfs,
        templates,
        `api/${config.api}/web/react/base`,
        "apps/web",
        config,
      );
    } else if (config.api === "orpc" || config.api === "garph") {
      // Non-React Astro integrations use oRPC or Garph
      processTemplatesFromPrefix(vfs, templates, `api/${config.api}/web/astro`, "apps/web", config);
    }

    // Astro fullstack mode
    if (config.backend === "self") {
      processTemplatesFromPrefix(
        vfs,
        templates,
        `api/${config.api}/fullstack/astro`,
        "apps/web",
        config,
      );
    }
  } else if (hasNuxtWeb && config.api === "orpc") {
    processTemplatesFromPrefix(vfs, templates, `api/${config.api}/web/nuxt`, "apps/web", config);
  } else if (hasSvelteWeb && config.api === "orpc") {
    processTemplatesFromPrefix(vfs, templates, `api/${config.api}/web/svelte`, "apps/web", config);
  } else if (hasSolidWeb && config.api === "orpc") {
    processTemplatesFromPrefix(vfs, templates, `api/${config.api}/web/solid`, "apps/web", config);
  }
}
