import type { ProjectConfig } from "@better-fullstack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

import { type TemplateData, processTemplatesFromPrefix } from "./utils";

export async function processEmailTemplates(
  vfs: VirtualFileSystem,
  templates: TemplateData,
  config: ProjectConfig,
): Promise<void> {
  if (!config.email || config.email === "none") return;
  if (config.backend === "convex") return;
  if (config.backend === "none") return;

  const targetDir = config.backend === "self" ? "apps/web" : "apps/server";

  // Process server-side email templates (Resend client, email sending utilities)
  processTemplatesFromPrefix(
    vfs,
    templates,
    `email/${config.email}/server/base`,
    targetDir,
    config,
  );

  // Process React Email components for React-based frontends
  const hasReactWeb = config.frontend.some((f) =>
    ["tanstack-router", "react-router", "tanstack-start", "next"].includes(f),
  );

  if (hasReactWeb && (config.email === "resend" || config.email === "react-email")) {
    processTemplatesFromPrefix(
      vfs,
      templates,
      `email/${config.email}/components`,
      targetDir,
      config,
    );
  }
}
