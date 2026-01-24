import type { ProjectConfig } from "@better-fullstack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";
import type { TemplateData } from "./utils";

import { isBinaryFile, processTemplateString, transformFilename } from "../core/template-processor";

export async function processGoBaseTemplate(
  vfs: VirtualFileSystem,
  templates: TemplateData,
  config: ProjectConfig,
): Promise<void> {
  // Only process Go templates if ecosystem is "go"
  if (config.ecosystem !== "go") return;

  const prefix = "go-base/";
  const hasGrpc = config.goApi === "grpc-go";
  const hasCobra = config.goCli === "cobra";
  const hasBubbletea = config.goCli === "bubbletea";

  for (const [templatePath, content] of templates) {
    if (!templatePath.startsWith(prefix)) continue;

    // Skip proto directory if gRPC is not selected
    if (!hasGrpc && templatePath.includes("proto/")) continue;

    // Skip cmd/cli directory if Cobra is not selected
    if (!hasCobra && templatePath.includes("cmd/cli/")) continue;

    // Skip cmd/tui directory if Bubble Tea is not selected
    if (!hasBubbletea && templatePath.includes("cmd/tui/")) continue;

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
