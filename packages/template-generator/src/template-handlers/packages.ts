import type { ProjectConfig } from "@better-fullstack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

import { type TemplateData, processTemplatesFromPrefix } from "./utils";

export async function processConfigPackage(
  vfs: VirtualFileSystem,
  templates: TemplateData,
  config: ProjectConfig,
): Promise<void> {
  processTemplatesFromPrefix(vfs, templates, "packages/config", "packages/config", config);
}

export async function processEnvPackage(
  vfs: VirtualFileSystem,
  templates: TemplateData,
  config: ProjectConfig,
): Promise<void> {
  const hasWebFrontend = config.frontend.some((f) =>
    [
      "tanstack-router",
      "react-router",
      "tanstack-start",
      "next",
      "nuxt",
      "svelte",
      "solid",
    ].includes(f),
  );
  const hasNative = config.frontend.some((f) =>
    ["native-bare", "native-uniwind", "native-unistyles"].includes(f),
  );

  if (!hasWebFrontend && !hasNative && config.backend === "none") return;

  processTemplatesFromPrefix(vfs, templates, "packages/env", "packages/env", config);
}
