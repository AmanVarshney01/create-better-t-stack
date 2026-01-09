import type { ProjectConfig } from "@better-t-stack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

import { processTemplateString, transformFilename, isBinaryFile } from "../core/template-processor";

export type TemplateData = Map<string, string>;

export function hasTemplatesWithPrefix(templates: TemplateData, prefix: string): boolean {
  const normalizedPrefix = prefix.endsWith("/") ? prefix : `${prefix}/`;
  for (const path of templates.keys()) {
    if (path.startsWith(normalizedPrefix)) return true;
  }
  return false;
}

export function processSingleTemplate(
  vfs: VirtualFileSystem,
  templates: TemplateData,
  templatePath: string,
  destPath: string,
  config: ProjectConfig,
): void {
  const templateKey = templatePath.endsWith(".hbs") ? templatePath : `${templatePath}.hbs`;
  const content = templates.get(templateKey);

  if (!content) return;

  let processedContent: string;
  if (isBinaryFile(templateKey)) {
    processedContent = "[Binary file]";
  } else if (templateKey.endsWith(".hbs")) {
    processedContent = processTemplateString(content, config);
  } else {
    processedContent = content;
  }

  // Pass original template path for binary files
  const sourcePath = isBinaryFile(templateKey) ? templateKey : undefined;
  vfs.writeFile(destPath, processedContent, sourcePath);
}

export function processTemplatesFromPrefix(
  vfs: VirtualFileSystem,
  templates: TemplateData,
  prefix: string,
  destPrefix: string,
  config: ProjectConfig,
): void {
  const normalizedPrefix = prefix.endsWith("/") ? prefix : `${prefix}/`;

  for (const [templatePath, content] of templates) {
    if (!templatePath.startsWith(normalizedPrefix)) continue;

    const relativePath = templatePath.slice(normalizedPrefix.length);
    const outputPath = transformFilename(relativePath);
    const destPath = destPrefix ? `${destPrefix}/${outputPath}` : outputPath;

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
    vfs.writeFile(destPath, processedContent, sourcePath);
  }
}
