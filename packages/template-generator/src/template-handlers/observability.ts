import type { ProjectConfig } from "@better-fullstack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

import { type TemplateData, processTemplatesFromPrefix } from "./utils";

export async function processObservabilityTemplates(
  vfs: VirtualFileSystem,
  templates: TemplateData,
  config: ProjectConfig,
): Promise<void> {
  if (!config.observability || config.observability === "none") return;
  if (config.backend === "convex") return;
  if (config.backend === "none") return;

  const targetDir = config.backend === "self" ? "apps/web" : "apps/server";

  // Process server-side observability templates (OpenTelemetry tracing setup)
  processTemplatesFromPrefix(
    vfs,
    templates,
    `observability/${config.observability}/server/base`,
    targetDir,
    config,
  );
}
