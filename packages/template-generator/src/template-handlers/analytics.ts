import type { ProjectConfig } from "@better-fullstack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

import { type TemplateData, processTemplatesFromPrefix } from "./utils";

export async function processAnalyticsTemplates(
  vfs: VirtualFileSystem,
  templates: TemplateData,
  config: ProjectConfig,
): Promise<void> {
  if (!config.analytics || config.analytics === "none") return;

  // Check if we have a web frontend (React-based)
  const hasReactFrontend = config.frontend.some(
    (f) =>
      f === "tanstack-router" || f === "react-router" || f === "tanstack-start" || f === "next",
  );

  // Process client-side templates for React-based frontends
  // Plausible is client-only, no server-side SDK
  if (hasReactFrontend) {
    processTemplatesFromPrefix(
      vfs,
      templates,
      `analytics/${config.analytics}/web/react`,
      "apps/web",
      config,
    );
  }
}
