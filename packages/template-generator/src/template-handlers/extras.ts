import type { ProjectConfig } from "@better-t-stack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";
import { type TemplateData, processSingleTemplate } from "./utils";

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
    processSingleTemplate(
      vfs,
      templates,
      "extras/pnpm-workspace.yaml",
      "pnpm-workspace.yaml",
      config,
    );
  }

  if (config.packageManager === "pnpm" && (hasNative || hasNuxt)) {
    processSingleTemplate(vfs, templates, "extras/_npmrc", ".npmrc", config);
  }

  if (
    config.serverDeploy === "cloudflare" ||
    (config.backend === "self" && config.webDeploy === "cloudflare")
  ) {
    processSingleTemplate(vfs, templates, "extras/env.d.ts", "packages/env/env.d.ts", config);
  }
}
