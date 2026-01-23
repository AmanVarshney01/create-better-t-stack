import type { ProjectConfig } from "@better-fullstack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";
import type { TemplateData } from "./utils";

import { isBinaryFile, processTemplateString, transformFilename } from "../core/template-processor";

export async function processPythonBaseTemplate(
  vfs: VirtualFileSystem,
  templates: TemplateData,
  config: ProjectConfig,
): Promise<void> {
  // Only process Python templates if ecosystem is "python"
  if (config.ecosystem !== "python") return;

  const prefix = "python-base/";

  for (const [templatePath, content] of templates) {
    if (!templatePath.startsWith(prefix)) continue;

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

    // Skip empty files (templates that evaluate to nothing based on config)
    if (processedContent.trim() === "") continue;

    // Pass original template path for binary files
    const sourcePath = isBinaryFile(templatePath) ? templatePath : undefined;
    vfs.writeFile(outputPath, processedContent, sourcePath);
  }
}
