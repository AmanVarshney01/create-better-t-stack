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

  if (config.backend === "nitro") {
    processTemplatesFromPrefix(vfs, templates, "backend/server/nitro/base", "apps/server", config);
    if (config.auth === "better-auth") {
      processTemplatesFromPrefix(
        vfs,
        templates,
        "backend/server/nitro/better-auth",
        "apps/server",
        config,
      );
    }
    if (config.api !== "none") {
      processTemplatesFromPrefix(
        vfs,
        templates,
        `backend/server/nitro/${config.api}`,
        "apps/server",
        config,
      );
    }
    if (
      config.auth === "better-auth" &&
      config.payments === "polar" &&
      config.frontend.some((frontend) =>
        ["native-bare", "native-uniwind", "native-unistyles"].includes(frontend),
      )
    ) {
      processTemplatesFromPrefix(
        vfs,
        templates,
        "backend/server/nitro/native-polar",
        "apps/server",
        config,
      );
    }
    if (config.examples.includes("ai")) {
      processTemplatesFromPrefix(vfs, templates, "backend/server/nitro/ai", "apps/server", config);
    }
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
