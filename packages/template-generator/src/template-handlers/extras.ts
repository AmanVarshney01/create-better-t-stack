import type { ProjectConfig } from "@better-fullstack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

import {
  type TemplateData,
  hasTemplatesWithPrefix,
  processTemplatesFromPrefix,
  processSingleTemplate,
} from "./utils";

export async function processExtrasTemplates(
  vfs: VirtualFileSystem,
  templates: TemplateData,
  config: ProjectConfig,
): Promise<void> {
  const hasNative = config.frontend.some((f) =>
    ["native-bare", "native-uniwind", "native-unistyles"].includes(f),
  );
  const hasNuxt = config.frontend.includes("nuxt");

  if (config.packageManager === "pnpm") {
    if (hasTemplatesWithPrefix(templates, "extras")) {
      processTemplatesFromPrefix(vfs, templates, "extras/pnpm-workspace.yaml", "", config);
    }
  }

  if (config.packageManager === "bun") {
    processTemplatesFromPrefix(vfs, templates, "extras/bunfig.toml", "", config);
  }

  if (config.packageManager === "pnpm" && (hasNative || hasNuxt)) {
    processTemplatesFromPrefix(vfs, templates, "extras/_npmrc", "", config);
  }

  if (config.serverDeploy === "cloudflare") {
    processSingleTemplate(vfs, templates, "extras/env.d.ts", "packages/env/env.d.ts", config);
  }
}
