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

    // MSW templates - only add to existing packages
    if (addon === "msw") {
      if (vfs.exists("apps/web/package.json")) {
        processTemplatesFromPrefix(vfs, templates, "addons/msw/apps/web", "apps/web", config);
      }
      if (vfs.exists("apps/server/package.json")) {
        processTemplatesFromPrefix(vfs, templates, "addons/msw/apps/server", "apps/server", config);
      }
      continue;
    }

    // Storybook templates - only add to existing web packages
    if (addon === "storybook") {
      if (vfs.exists("apps/web/package.json")) {
        processTemplatesFromPrefix(vfs, templates, "addons/storybook/apps/web", "apps/web", config);
      }
      continue;
    }

    processTemplatesFromPrefix(vfs, templates, `addons/${addon}`, "", config);
  }
}
