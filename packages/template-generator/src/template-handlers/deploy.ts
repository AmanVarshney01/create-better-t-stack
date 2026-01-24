import type { ProjectConfig } from "@better-fullstack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

import { type TemplateData, processTemplatesFromPrefix } from "./utils";

export async function processDeployTemplates(
  vfs: VirtualFileSystem,
  templates: TemplateData,
  config: ProjectConfig,
): Promise<void> {
  const isBackendSelf = config.backend === "self";

  // Process Cloudflare-specific infrastructure templates
  if (config.webDeploy === "cloudflare" || config.serverDeploy === "cloudflare") {
    processTemplatesFromPrefix(vfs, templates, "packages/infra", "packages/infra", config);
  }

  // Process web deployment templates (non-cloudflare)
  if (config.webDeploy !== "none" && config.webDeploy !== "cloudflare") {
    const templateMap: Record<string, string> = {
      "tanstack-router": "react/tanstack-router",
      "tanstack-start": "react/tanstack-start",
      "react-router": "react/react-router",
      solid: "solid",
      next: "react/next",
      nuxt: "nuxt",
      svelte: "svelte",
    };

    for (const f of config.frontend) {
      if (templateMap[f]) {
        processTemplatesFromPrefix(
          vfs,
          templates,
          `deploy/${config.webDeploy}/web/${templateMap[f]}`,
          "apps/web",
          config,
        );
      }
    }
  }

  // Process server deployment templates (non-cloudflare)
  if (config.serverDeploy !== "none" && config.serverDeploy !== "cloudflare" && !isBackendSelf) {
    processTemplatesFromPrefix(
      vfs,
      templates,
      `deploy/${config.serverDeploy}/server`,
      "apps/server",
      config,
    );
  }
}
