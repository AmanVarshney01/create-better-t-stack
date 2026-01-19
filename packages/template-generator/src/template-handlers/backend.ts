import type { ProjectConfig } from "@better-t-stack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

import { type TemplateData, processTemplatesFromPrefix } from "./utils";

export async function processBackendTemplates(
  vfs: VirtualFileSystem,
  templates: TemplateData,
  config: ProjectConfig,
): Promise<void> {
  if (config.backend === "none") return;

  if (config.backend === "convex") {
    processTemplatesFromPrefix(
      vfs,
      templates,
      "backend/convex/packages/backend",
      "packages/backend",
      config,
    );
    return;
  }

  if (config.backend === "self") return;

  if (config.backend === "encore") {
    processTemplatesFromPrefix(vfs, templates, "backend/server/encore", "apps/server", config);
    return;
  }

  if (config.backend === "adonisjs") {
    processTemplatesFromPrefix(vfs, templates, "backend/server/adonisjs", "apps/server", config);
    return;
  }

  if (config.backend === "nitro") {
    processTemplatesFromPrefix(vfs, templates, "backend/server/nitro", "apps/server", config);
    return;
  }

  if (config.backend === "fets") {
    processTemplatesFromPrefix(vfs, templates, "backend/server/base", "apps/server", config);
    processTemplatesFromPrefix(vfs, templates, "backend/server/fets", "apps/server", config);
    return;
  }

  processTemplatesFromPrefix(vfs, templates, "backend/server/base", "apps/server", config);
  processTemplatesFromPrefix(
    vfs,
    templates,
    `backend/server/${config.backend}`,
    "apps/server",
    config,
  );
}
