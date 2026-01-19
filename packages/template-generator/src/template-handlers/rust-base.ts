import type { ProjectConfig } from "@better-t-stack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

import { type TemplateData, processTemplatesFromPrefix } from "./utils";

export async function processRustBaseTemplate(
  vfs: VirtualFileSystem,
  templates: TemplateData,
  config: ProjectConfig,
): Promise<void> {
  // Only process Rust templates if ecosystem is "rust"
  if (config.ecosystem !== "rust") return;

  processTemplatesFromPrefix(vfs, templates, "rust-base", "", config);
}
