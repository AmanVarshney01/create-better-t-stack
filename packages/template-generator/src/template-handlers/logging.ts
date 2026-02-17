import type { ProjectConfig } from "@better-fullstack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

import { type TemplateData, processTemplatesFromPrefix } from "./utils";

export async function processLoggingTemplates(
  vfs: VirtualFileSystem,
  templates: TemplateData,
  config: ProjectConfig,
): Promise<void> {
  if (!config.logging || config.logging === "none") return;
  if (config.backend === "convex") return;
  if (config.backend === "none") return;
  if (config.backend === "self") return;

  // Process server-side logging templates (Pino logger setup)
  processTemplatesFromPrefix(
    vfs,
    templates,
    `logging/${config.logging}/server/base`,
    "apps/server",
    config,
  );
}
