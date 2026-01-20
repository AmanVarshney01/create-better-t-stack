import type { ProjectConfig } from "@better-fullstack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

import { type TemplateData, processTemplatesFromPrefix } from "./utils";

export async function processCMSTemplates(
  vfs: VirtualFileSystem,
  templates: TemplateData,
  config: ProjectConfig,
): Promise<void> {
  if (!config.cms || config.cms === "none") return;

  // Both Payload and Sanity require Next.js for optimal integration
  const hasNext = config.frontend.includes("next");

  if (config.cms === "payload" && hasNext) {
    // Process Payload CMS templates for Next.js
    processTemplatesFromPrefix(vfs, templates, "cms/payload/web/next", "apps/web", config);
  }

  if (config.cms === "sanity" && hasNext) {
    // Process Sanity CMS templates for Next.js
    processTemplatesFromPrefix(vfs, templates, "cms/sanity/web/next", "apps/web", config);
  }

  if (config.cms === "strapi" && hasNext) {
    // Process Strapi CMS templates for Next.js
    processTemplatesFromPrefix(vfs, templates, "cms/strapi/web/next", "apps/web", config);
  }
}
