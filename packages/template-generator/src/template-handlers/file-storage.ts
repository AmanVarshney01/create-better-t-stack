import type { ProjectConfig } from "@better-fullstack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

import { type TemplateData, processTemplatesFromPrefix } from "./utils";

export async function processFileStorageTemplates(
  vfs: VirtualFileSystem,
  templates: TemplateData,
  config: ProjectConfig,
): Promise<void> {
  if (!config.fileStorage || config.fileStorage === "none") return;
  if (config.backend === "convex") return;
  if (config.backend === "none") return;
  if (config.backend === "self") return;

  // Process server-side file storage templates
  processTemplatesFromPrefix(
    vfs,
    templates,
    `file-storage/${config.fileStorage}/server/base`,
    "apps/server",
    config,
  );
}
