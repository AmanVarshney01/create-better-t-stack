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
  const hasDioxus = config.rustFrontend === "dioxus";
  const hasTonic = config.rustApi === "tonic";
  const hasAsyncGraphql = config.rustApi === "async-graphql";
  const hasClap = config.rustCli === "clap";
  const hasRatatui = config.rustCli === "ratatui";

  for (const [templatePath, content] of templates) {
    if (!templatePath.startsWith(prefix)) continue;

    // Skip client crate templates if Leptos is not selected
    if (!hasLeptos && templatePath.includes("crates/client/")) continue;

    // Skip dioxus-client crate templates if Dioxus is not selected
    if (!hasDioxus && templatePath.includes("crates/dioxus-client/")) continue;

    // Skip proto crate templates if Tonic is not selected
    if (!hasTonic && templatePath.includes("crates/proto/")) continue;

    // Skip grpc.rs if Tonic is not selected
    if (!hasTonic && templatePath.includes("crates/server/src/grpc.rs")) continue;

    // Skip graphql.rs if async-graphql is not selected
    if (!hasAsyncGraphql && templatePath.includes("crates/server/src/graphql.rs")) continue;

    // Skip cli crate templates if Clap is not selected
    if (!hasClap && templatePath.includes("crates/cli/")) continue;

    // Skip tui crate templates if Ratatui is not selected
    if (!hasRatatui && templatePath.includes("crates/tui/")) continue;

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
