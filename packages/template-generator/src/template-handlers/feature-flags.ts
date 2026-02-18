import type { ProjectConfig } from "@better-fullstack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

import { type TemplateData, processTemplatesFromPrefix } from "./utils";

export async function processFeatureFlagsTemplates(
  vfs: VirtualFileSystem,
  templates: TemplateData,
  config: ProjectConfig,
): Promise<void> {
  if (!config.featureFlags || config.featureFlags === "none") return;

  // Check if we have a web frontend (React-based)
  const hasReactFrontend = config.frontend.some(
    (f) =>
      f === "tanstack-router" || f === "react-router" || f === "tanstack-start" || f === "next",
  );

  // Process client-side templates for React-based frontends
  if (hasReactFrontend) {
    processTemplatesFromPrefix(
      vfs,
      templates,
      `feature-flags/${config.featureFlags}/web/react`,
      "apps/web",
      config,
    );
  }

  // Process server-side templates if we have a backend
  if (config.backend !== "none" && config.backend !== "convex" && config.backend !== "self") {
    processTemplatesFromPrefix(
      vfs,
      templates,
      `feature-flags/${config.featureFlags}/server/base`,
      "apps/server",
      config,
    );
  }

  // For fullstack frameworks (Next.js with self backend), also add server templates to web
  if (config.backend === "self" && hasReactFrontend) {
    processTemplatesFromPrefix(
      vfs,
      templates,
      `feature-flags/${config.featureFlags}/server/base`,
      "apps/web",
      config,
    );
  }
}
