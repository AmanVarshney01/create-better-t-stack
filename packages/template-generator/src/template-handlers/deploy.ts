import type { ProjectConfig } from "@better-t-stack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

import { type TemplateData, processTemplatesFromPrefix } from "./utils";

export async function processDeployTemplates(
  vfs: VirtualFileSystem,
  templates: TemplateData,
  config: ProjectConfig,
): Promise<void> {
  const isBackendSelf = config.backend === "self";

  if (config.webDeploy === "cloudflare" || config.serverDeploy === "cloudflare") {
    processTemplatesFromPrefix(vfs, templates, "packages/infra", "packages/infra", config);
  }

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
