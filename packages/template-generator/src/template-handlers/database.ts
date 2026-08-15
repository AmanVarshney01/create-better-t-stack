import type { ProjectConfig } from "@better-t-stack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";
import { type TemplateData, processTemplatesFromPrefix } from "./utils";

export async function processDbTemplates(
  vfs: VirtualFileSystem,
  templates: TemplateData,
  config: ProjectConfig,
): Promise<void> {
  if (config.database === "none" || config.orm === "none") return;
  if (config.backend === "convex") return;

  processTemplatesFromPrefix(vfs, templates, "db/base", "packages/db", config);
  processTemplatesFromPrefix(vfs, templates, `db/${config.orm}/base`, "packages/db", config);
  processTemplatesFromPrefix(
    vfs,
    templates,
    `db/${config.orm}/${config.database}`,
    "packages/db",
    config,
  );

  // With a Docker deploy target, the database service lives in the root
  // docker-compose.yml instead of a separate packages/db compose file.
  const hasDockerDeploy = config.webDeploy === "docker" || config.serverDeploy === "docker";
  if (config.dbSetup === "docker" && !hasDockerDeploy) {
    processTemplatesFromPrefix(
      vfs,
      templates,
      `db-setup/docker-compose/${config.database}`,
      "packages/db",
      config,
    );
  }
}
