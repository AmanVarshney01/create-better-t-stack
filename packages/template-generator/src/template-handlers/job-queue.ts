import type { ProjectConfig } from "@better-fullstack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

import { type TemplateData, processTemplatesFromPrefix } from "./utils";

export async function processJobQueueTemplates(
  vfs: VirtualFileSystem,
  templates: TemplateData,
  config: ProjectConfig,
): Promise<void> {
  if (!config.jobQueue || config.jobQueue === "none") return;
  if (config.backend === "convex") return;
  if (config.backend === "none") return;

  // Process server-side job queue templates
  processTemplatesFromPrefix(
    vfs,
    templates,
    `job-queue/${config.jobQueue}/server/base`,
    "apps/server",
    config,
  );
}
