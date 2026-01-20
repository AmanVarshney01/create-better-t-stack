import type { ProjectConfig } from "@better-t-stack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";
import type { TemplateData } from "./utils";

import { isBinaryFile, processTemplateString, transformFilename } from "../core/template-processor";

export async function processRustBaseTemplate(
  vfs: VirtualFileSystem,
  templates: TemplateData,
  config: ProjectConfig,
): Promise<void> {
  // Only process Rust templates if ecosystem is "rust"
  if (config.ecosystem !== "rust") return;

  const prefix = "rust-base/";
  const hasLeptos = config.rustFrontend === "leptos";

  for (const [templatePath, content] of templates) {
    if (!templatePath.startsWith(prefix)) continue;

    // Skip client crate templates if Leptos is not selected
    if (!hasLeptos && templatePath.includes("crates/client/")) continue;

    const relativePath = templatePath.slice(prefix.length);
    const outputPath = transformFilename(relativePath);

    let processedContent: string;
    if (isBinaryFile(templatePath)) {
      processedContent = "[Binary file]";
    } else if (templatePath.endsWith(".hbs")) {
      processedContent = processTemplateString(content, config);
    } else {
      processedContent = content;
    }

    // Pass original template path for binary files
    const sourcePath = isBinaryFile(templatePath) ? templatePath : undefined;
    vfs.writeFile(outputPath, processedContent, sourcePath);
  }
}
