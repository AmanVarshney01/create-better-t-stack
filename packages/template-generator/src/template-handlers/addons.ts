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

    // Task runners are handled programmatically by generators.
    if (addon === "turborepo" || addon === "nx" || addon === "vite-plus") continue;

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

    if (addon === "sentry") {
      processTemplatesFromPrefix(vfs, templates, "addons/sentry/base", "", config);

      const webTarget = "apps/web";
      if (config.frontend.includes("next")) {
        processTemplatesFromPrefix(vfs, templates, "addons/sentry/web/next", webTarget, config);
      } else if (config.frontend.includes("nuxt")) {
        processTemplatesFromPrefix(
          vfs,
          templates,
          "addons/sentry/web/nuxt/base",
          webTarget,
          config,
        );
        processTemplatesFromPrefix(
          vfs,
          templates,
          config.webDeploy === "cloudflare"
            ? "addons/sentry/web/nuxt/cloudflare"
            : "addons/sentry/web/nuxt/node",
          webTarget,
          config,
        );
      } else if (config.frontend.includes("svelte")) {
        processTemplatesFromPrefix(vfs, templates, "addons/sentry/web/svelte", webTarget, config);
      } else if (config.frontend.includes("solid")) {
        processTemplatesFromPrefix(vfs, templates, "addons/sentry/web/solid", webTarget, config);
      } else if (config.frontend.includes("astro")) {
        processTemplatesFromPrefix(vfs, templates, "addons/sentry/web/astro", webTarget, config);
      } else if (config.frontend.includes("react-router")) {
        processTemplatesFromPrefix(
          vfs,
          templates,
          "addons/sentry/web/react-router/base",
          webTarget,
          config,
        );
        if (config.webDeploy !== "cloudflare") {
          processTemplatesFromPrefix(
            vfs,
            templates,
            "addons/sentry/web/react-router/node",
            webTarget,
            config,
          );
        }
      } else if (config.frontend.includes("tanstack-start")) {
        processTemplatesFromPrefix(
          vfs,
          templates,
          "addons/sentry/web/tanstack-start/base",
          webTarget,
          config,
        );
        processTemplatesFromPrefix(
          vfs,
          templates,
          config.webDeploy === "cloudflare"
            ? "addons/sentry/web/tanstack-start/cloudflare"
            : "addons/sentry/web/tanstack-start/node",
          webTarget,
          config,
        );
      }

      if (
        vfs.exists("apps/server/package.json") &&
        ((config.backend === "hono" && config.runtime === "node") ||
          config.backend === "express" ||
          config.backend === "fastify")
      ) {
        processTemplatesFromPrefix(vfs, templates, "addons/sentry/server", "apps/server", config);
      }
      continue;
    }

    processTemplatesFromPrefix(vfs, templates, `addons/${addon}`, "", config);
  }
}
