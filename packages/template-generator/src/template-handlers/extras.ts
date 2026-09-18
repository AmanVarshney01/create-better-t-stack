import type { ProjectConfig } from "@better-t-stack/types";
import { parse, stringify } from "yaml";

import type { VirtualFileSystem } from "../core/virtual-fs";
import { getAllowedDependencyScripts } from "../utils/dependency-scripts";
import { type TemplateData, processSingleTemplate } from "./utils";

export async function processExtrasTemplates(
  vfs: VirtualFileSystem,
  templates: TemplateData,
  config: ProjectConfig,
): Promise<void> {
  const hasNative = config.frontend.some((f) =>
    ["native-bare", "native-uniwind", "native-unistyles"].includes(f),
  );
  const hasNuxt = config.frontend.includes("nuxt");

  if (config.packageManager === "pnpm") {
    const workspace = parse(vfs.readFile("pnpm-workspace.yaml") ?? "") ?? {};
    workspace.packages ??= ["apps/*", "packages/*"];
    const allowBuilds = getAllowedDependencyScripts(config);
    if (Object.keys(allowBuilds).length) {
      workspace.allowBuilds = { ...allowBuilds, ...workspace.allowBuilds };
    }
    if (config.frontend.includes("solid")) {
      workspace.overrides = {
        "@solidjs/signals": "2.0.0-rc.7",
        "@solidjs/compiler": "2.0.0-rc.7",
        "@solidjs/babel-plugin": "2.0.0-rc.7",
        ...workspace.overrides,
      };
      workspace.minimumReleaseAgeExclude = [
        ...new Set([
          ...(workspace.minimumReleaseAgeExclude ?? []),
          "@solidjs/babel-plugin@2.0.0-rc.7",
          "@solidjs/compiler@2.0.0-rc.7",
          "@solidjs/meta@1.0.0-next.2",
          "@solidjs/router@2.0.0-next.23",
          "@solidjs/signals@2.0.0-rc.7",
          "@solidjs/vite-plugin@3.0.0-next.39",
          "@solidjs/web@2.0.0-rc.7",
          "@tanstack/solid-query@6.0.0-rc.3",
          "solid-js@2.0.0-rc.7",
        ]),
      ];
    }
    vfs.writeFile("pnpm-workspace.yaml", stringify(workspace));
  }

  if (config.packageManager === "pnpm" && (hasNative || hasNuxt)) {
    processSingleTemplate(vfs, templates, "extras/_npmrc", ".npmrc", config);
  }

  if (
    config.serverDeploy === "cloudflare" ||
    (config.backend === "self" && config.webDeploy === "cloudflare")
  ) {
    processSingleTemplate(
      vfs,
      templates,
      "extras/env.d.ts",
      config.backend === "self"
        ? "apps/web/cloudflare-env.d.ts"
        : "apps/server/cloudflare-env.d.ts",
      config,
    );
  }
}
