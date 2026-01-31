import type { ProjectConfig } from "@better-t-stack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

import { type TemplateData, processTemplatesFromPrefix } from "./utils";

export async function processAddonTemplates(
  vfs: VirtualFileSystem,
  templates: TemplateData,
  config: ProjectConfig,
): Promise<void> {
  if (!config.addons || config.addons.length === 0) return;

  for (const addon of config.addons) {
    if (addon === "none") continue;

    // turborepo is handled programmatically by turbo-generator.ts
    if (addon === "turborepo") continue;

    if (addon === "pwa") {
      if (config.frontend.includes("next")) {
        processTemplatesFromPrefix(vfs, templates, "addons/pwa/apps/web/next", "apps/web", config);
      } else if (
        config.frontend.some((f) => ["tanstack-router", "react-router", "solid"].includes(f))
      ) {
        processTemplatesFromPrefix(vfs, templates, "addons/pwa/apps/web/vite", "apps/web", config);
      }
      continue;
    }

    if (addon === "docker-compose") {
      // Place docker-compose.yml at project root
      processTemplatesFromPrefix(vfs, templates, "addons/docker-compose", "", config);

      // Place server Dockerfile if backend exists
      if (config.backend !== "self" && config.backend !== "none") {
        processTemplatesFromPrefix(
          vfs,
          templates,
          "addons/docker-compose/apps/server",
          "apps/server",
          config,
        );
      }

      // Place web Dockerfile based on frontend
      if (config.frontend.includes("next")) {
        processTemplatesFromPrefix(
          vfs,
          templates,
          "addons/docker-compose/apps/web",
          "apps/web",
          config,
        );
      } else if (
        config.frontend.some((f) =>
          [
            "tanstack-router",
            "react-router",
            "tanstack-start",
            "solid",
            "svelte",
            "nuxt",
            "astro",
          ].includes(f),
        )
      ) {
        processTemplatesFromPrefix(
          vfs,
          templates,
          "addons/docker-compose/apps/web",
          "apps/web",
          config,
        );
      }
      continue;
    }

    processTemplatesFromPrefix(vfs, templates, `addons/${addon}`, "", config);
  }
}
