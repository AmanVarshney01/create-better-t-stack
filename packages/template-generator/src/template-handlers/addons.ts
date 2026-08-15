import type { ProjectConfig } from "@better-t-stack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";
import { type TemplateData, processTemplatesFromPrefix } from "./utils";

function updateNixGitignore(vfs: VirtualFileSystem): void {
  const gitignore = vfs.readFile(".gitignore");
  if (gitignore === undefined) return;

  const existingEntries = new Set(gitignore.split(/\r?\n/).map((line) => line.trim()));
  const missingEntries = [".direnv/", "result", "result-*"].filter(
    (entry) => !existingEntries.has(entry),
  );
  if (missingEntries.length === 0) return;

  const existingContent = gitignore.trimEnd();
  const separator = existingContent ? "\n\n# Nix\n" : "# Nix\n";
  vfs.writeFile(".gitignore", `${existingContent}${separator}${missingEntries.join("\n")}\n`);
}

export async function processAddonTemplates(
  vfs: VirtualFileSystem,
  templates: TemplateData,
  config: ProjectConfig,
): Promise<void> {
  if (!config.addons || config.addons.length === 0) return;

  for (const addon of config.addons) {
    if (addon === "none") continue;

    // Task runners are handled programmatically by generators.
    if (addon === "turborepo" || addon === "nx" || addon === "vite-plus") continue;

    if (addon === "pwa") {
      if (config.frontend.includes("next")) {
        processTemplatesFromPrefix(vfs, templates, "addons/pwa/apps/web/next", "apps/web", config);
      } else if (
        config.frontend.some((f) => ["tanstack-router", "react-router", "solid"].includes(f))
      ) {
        processTemplatesFromPrefix(vfs, templates, "addons/pwa/apps/web/vite", "apps/web", config);
      }
      continue;
    }

    processTemplatesFromPrefix(vfs, templates, `addons/${addon}`, "", config);
    if (addon === "nix-flake") updateNixGitignore(vfs);
  }
}
