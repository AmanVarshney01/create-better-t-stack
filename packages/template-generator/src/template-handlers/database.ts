import type { ProjectConfig } from "@better-t-stack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

import { type TemplateData, processTemplatesFromPrefix } from "./utils";

export async function processDbTemplates(
  vfs: VirtualFileSystem,
  templates: TemplateData,
  config: ProjectConfig,
): Promise<void> {
  if (config.database === "none") return;

  // Convex database (database-only mode, not full backend)
  if (config.database === "convex" && config.backend !== "convex") {
    processTemplatesFromPrefix(vfs, templates, "db/convex", "packages/db", config);
    return;
  }

  // Full Convex backend handles its own database setup
  if (config.backend === "convex") return;

  // Traditional ORM-based databases
  if (config.orm === "none") return;

  processTemplatesFromPrefix(vfs, templates, "db/base", "packages/db", config);
  processTemplatesFromPrefix(vfs, templates, `db/${config.orm}/base`, "packages/db", config);
  processTemplatesFromPrefix(
    vfs,
    templates,
    `db/${config.orm}/${config.database}`,
    "packages/db",
    config,
  );

  if (config.dbSetup === "docker") {
    processTemplatesFromPrefix(
      vfs,
      templates,
      `db-setup/docker-compose/${config.database}`,
      "packages/db",
      config,
    );
  }
}
