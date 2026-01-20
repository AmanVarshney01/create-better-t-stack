import type { ProjectConfig } from "@better-t-stack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

import { type TemplateData, processTemplatesFromPrefix } from "./utils";

export async function processCMSTemplates(
  vfs: VirtualFileSystem,
  templates: TemplateData,
  config: ProjectConfig,
): Promise<void> {
  if (!config.cms || config.cms === "none") return;

  // Payload CMS requires Next.js in v3
  const hasNext = config.frontend.includes("next");

  if (config.cms === "payload" && hasNext) {
    // Process Payload CMS templates for Next.js
    processTemplatesFromPrefix(vfs, templates, "cms/payload/web/next", "apps/web", config);
  }
}
