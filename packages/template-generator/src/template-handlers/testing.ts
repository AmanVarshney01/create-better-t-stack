import type { ProjectConfig } from "@better-fullstack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

import { type TemplateData, processTemplatesFromPrefix } from "./utils";

export async function processTestingTemplates(
  vfs: VirtualFileSystem,
  templates: TemplateData,
  config: ProjectConfig,
): Promise<void> {
  if (config.testing === "playwright" || config.testing === "vitest-playwright") {
    processTemplatesFromPrefix(vfs, templates, "testing", "", config);
  }
}
