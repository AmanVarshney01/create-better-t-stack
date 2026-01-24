import type { ProjectConfig } from "@better-fullstack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

import { type TemplateData, processTemplatesFromPrefix } from "./utils";

export async function processSearchTemplates(
  vfs: VirtualFileSystem,
  templates: TemplateData,
  config: ProjectConfig,
): Promise<void> {
  if (!config.search || config.search === "none") return;
  if (config.backend === "convex") return;
  if (config.backend === "none") return;

  // Process server-side search templates
  processTemplatesFromPrefix(
    vfs,
    templates,
    `search/${config.search}/server/base`,
    "apps/server",
    config,
  );
}
