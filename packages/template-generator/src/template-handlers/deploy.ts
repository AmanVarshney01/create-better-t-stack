import type { ProjectConfig } from "@better-t-stack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";
import { processAlchemyRun } from "../generators/alchemy/render";
import { isDatabaseConsumedByDocker } from "../utils/docker-database";
import { type TemplateData, processTemplatesFromPrefix } from "./utils";

function hasOwnKey<T extends object>(object: T, key: PropertyKey): key is keyof T {
  return Object.hasOwn(object, key);
}

export async function processDeployTemplates(
  vfs: VirtualFileSystem,
  templates: TemplateData,
  config: ProjectConfig,
): Promise<void> {
  const isBackendSelf = config.backend === "self";

  if (
    ["cloudflare", "prisma"].includes(config.webDeploy) ||
    ["cloudflare", "prisma"].includes(config.serverDeploy)
  ) {
    processTemplatesFromPrefix(vfs, templates, "packages/infra", "packages/infra", config);
    processAlchemyRun(vfs, config);
  }

  if (config.webDeploy === "docker" || config.serverDeploy === "docker") {
    processTemplatesFromPrefix(vfs, templates, "deploy/docker/compose", "", config);
    if (
      config.database === "sqlite" &&
      config.dbSetup === "none" &&
      isDatabaseConsumedByDocker(config)
    ) {
      vfs.writeFile(".data/.gitignore", "*\n!.gitignore\n");
    }
  }

  if (config.webDeploy === "vercel" || config.serverDeploy === "vercel") {
    processTemplatesFromPrefix(vfs, templates, "deploy/vercel", "", config);
  }

  if (config.webDeploy === "prisma") {
    const templateMap = {
      "react-router": "react/react-router",
    } satisfies Partial<Record<ProjectConfig["frontend"][number], string>>;

    for (const frontend of config.frontend) {
      if (hasOwnKey(templateMap, frontend)) {
        const templatePath = templateMap[frontend];
        processTemplatesFromPrefix(
          vfs,
          templates,
          `deploy/prisma/web/${templatePath}`,
          "apps/web",
          config,
        );
      }
    }
  }

  if (
    config.webDeploy !== "none" &&
    config.webDeploy !== "cloudflare" &&
    config.webDeploy !== "prisma" &&
    config.webDeploy !== "vercel"
  ) {
    const templateMap = {
      "tanstack-router": "react/tanstack-router",
      "tanstack-start": "react/tanstack-start",
      "react-router": "react/react-router",
      solid: "solid",
      next: "react/next",
      nuxt: "nuxt",
      svelte: "svelte",
      astro: "astro",
    } satisfies Record<string, string>;

    for (const f of config.frontend) {
      if (hasOwnKey(templateMap, f)) {
        processTemplatesFromPrefix(
          vfs,
          templates,
          `deploy/${config.webDeploy}/web/${templateMap[f]}`,
          "apps/web",
          config,
        );
      }
    }
  }

  if (
    config.serverDeploy !== "none" &&
    config.serverDeploy !== "cloudflare" &&
    config.serverDeploy !== "prisma" &&
    config.serverDeploy !== "vercel" &&
    !isBackendSelf
  ) {
    processTemplatesFromPrefix(
      vfs,
      templates,
      `deploy/${config.serverDeploy}/server`,
      "apps/server",
      config,
    );
  }
}
