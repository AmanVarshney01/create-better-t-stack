/**
 * Template helpers for "add" commands
 * Uses EMBEDDED_TEMPLATES from template-generator to write templates to existing projects
 */

import {
  EMBEDDED_TEMPLATES,
  processTemplateString,
  transformFilename,
  isBinaryFile,
} from "@better-t-stack/template-generator";
import fs from "fs-extra";
import path from "node:path";

import type { ProjectConfig } from "../../types";

/**
 * Copy templates matching a prefix to a destination directory
 */
async function copyTemplatesFromPrefix(
  templates: Map<string, string>,
  prefix: string,
  destDir: string,
  config: ProjectConfig,
): Promise<void> {
  const normalizedPrefix = prefix.endsWith("/") ? prefix : `${prefix}/`;

  for (const [templatePath, content] of templates.entries()) {
    if (!templatePath.startsWith(normalizedPrefix)) continue;

    // Get relative path within prefix
    const relativePath = templatePath.slice(normalizedPrefix.length);
    const outputPath = transformFilename(relativePath);

    // Skip if output is empty (conditional file)
    if (!outputPath) continue;

    const destPath = path.join(destDir, outputPath);
    await fs.ensureDir(path.dirname(destPath));

    // Process content if .hbs file
    if (templatePath.endsWith(".hbs")) {
      const processed = processTemplateString(content, config);
      await fs.writeFile(destPath, processed, "utf-8");
    } else if (isBinaryFile(templatePath)) {
      // Binary files are base64 encoded
      await fs.writeFile(destPath, Buffer.from(content, "base64"));
    } else {
      await fs.writeFile(destPath, content, "utf-8");
    }
  }
}

/**
 * Setup addon templates for add command
 */
export async function setupAddonsTemplate(
  projectDir: string,
  config: ProjectConfig,
): Promise<void> {
  if (!config.addons || config.addons.length === 0) return;

  for (const addon of config.addons) {
    if (addon === "none") continue;

    let prefix = `addons/${addon}`;
    let destDir = projectDir;

    if (addon === "pwa") {
      const webAppDir = path.join(projectDir, "apps/web");
      if (!(await fs.pathExists(webAppDir))) continue;
      destDir = webAppDir;

      if (config.frontend.includes("next")) {
        prefix = "addons/pwa/apps/web/next";
      } else if (
        config.frontend.some((f) => ["tanstack-router", "react-router", "solid"].includes(f))
      ) {
        prefix = "addons/pwa/apps/web/vite";
      } else {
        continue;
      }
    }

    await copyTemplatesFromPrefix(EMBEDDED_TEMPLATES, prefix, destDir, config);
  }
}

/**
 * Setup deployment templates for add command
 */
export async function setupDeploymentTemplates(
  projectDir: string,
  config: ProjectConfig,
): Promise<void> {
  const isBackendSelf = config.backend === "self";

  // Cloudflare infra package
  if (config.webDeploy === "cloudflare" || config.serverDeploy === "cloudflare") {
    const infraDir = path.join(projectDir, "packages/infra");
    await fs.ensureDir(infraDir);
    await copyTemplatesFromPrefix(EMBEDDED_TEMPLATES, "packages/infra", infraDir, config);
  }

  // Web deploy
  if (config.webDeploy !== "none" && config.webDeploy !== "cloudflare") {
    const webAppDir = path.join(projectDir, "apps/web");
    if (await fs.pathExists(webAppDir)) {
      const templateMap: Record<string, string> = {
        "tanstack-router": "react/tanstack-router",
        "tanstack-start": "react/tanstack-start",
        "react-router": "react/react-router",
        solid: "solid",
        next: "react/next",
        nuxt: "nuxt",
        svelte: "svelte",
      };

      for (const f of config.frontend) {
        if (templateMap[f]) {
          await copyTemplatesFromPrefix(
            EMBEDDED_TEMPLATES,
            `deploy/${config.webDeploy}/web/${templateMap[f]}`,
            webAppDir,
            config,
          );
        }
      }
    }
  }

  // Server deploy
  if (config.serverDeploy !== "none" && config.serverDeploy !== "cloudflare" && !isBackendSelf) {
    const serverAppDir = path.join(projectDir, "apps/server");
    if (await fs.pathExists(serverAppDir)) {
      await copyTemplatesFromPrefix(
        EMBEDDED_TEMPLATES,
        `deploy/${config.serverDeploy}/server`,
        serverAppDir,
        config,
      );
    }
  }
}
