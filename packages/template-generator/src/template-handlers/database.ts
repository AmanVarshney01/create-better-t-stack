import type { ProjectConfig } from "@better-fullstack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

import { type TemplateData, processTemplatesFromPrefix } from "./utils";

export async function processDbTemplates(
  vfs: VirtualFileSystem,
  templates: TemplateData,
  config: ProjectConfig,
): Promise<void> {
  if (config.database === "none") return;
  if (config.backend === "convex") return;

  // EdgeDB has its own query builder, no ORM needed
  if (config.database === "edgedb") {
    processTemplatesFromPrefix(vfs, templates, "db/base", "packages/db", config);
    processTemplatesFromPrefix(vfs, templates, "db/edgedb/base", "packages/db", config);
    return;
  }

  // Redis uses its own client, no ORM needed
  if (config.database === "redis") {
    processTemplatesFromPrefix(vfs, templates, "db/base", "packages/db", config);
    processTemplatesFromPrefix(vfs, templates, "db/redis/base", "packages/db", config);
    return;
  }

  // Other databases require an ORM
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
