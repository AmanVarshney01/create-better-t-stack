import type { ProjectConfig } from "@better-fullstack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

import { type TemplateData, processTemplatesFromPrefix } from "./utils";

export async function processExampleTemplates(
  vfs: VirtualFileSystem,
  templates: TemplateData,
  config: ProjectConfig,
): Promise<void> {
  if (!config.examples || config.examples.length === 0 || config.examples[0] === "none") return;

  const hasReactWeb = config.frontend.some((f) =>
    ["tanstack-router", "react-router", "tanstack-start", "next"].includes(f),
  );
  const hasNuxtWeb = config.frontend.includes("nuxt");
  const hasSvelteWeb = config.frontend.includes("svelte");
  const hasSolidWeb = config.frontend.includes("solid");
  const hasNativeBare = config.frontend.includes("native-bare");
  const hasUniwind = config.frontend.includes("native-uniwind");
  const hasUnistyles = config.frontend.includes("native-unistyles");
  const hasNative = hasNativeBare || hasUniwind || hasUnistyles;

  for (const example of config.examples) {
    if (example === "none") continue;

    if (example === "chat-sdk" && config.backend === "hono") {
      processTemplatesFromPrefix(
        vfs,
        templates,
        "examples/chat-sdk/server/hono",
        "apps/server",
        config,
      );
    }

    if (config.backend === "convex") {
      processTemplatesFromPrefix(
        vfs,
        templates,
        `examples/${example}/convex/packages/backend`,
        "packages/backend",
        config,
      );
    } else if (config.backend !== "none" && config.api !== "none") {
      processTemplatesFromPrefix(
        vfs,
        templates,
        `examples/${example}/server/${config.orm}/base`,
        "packages/api",
        config,
      );

      if (config.orm !== "none" && config.database !== "none") {
        processTemplatesFromPrefix(
          vfs,
          templates,
          `examples/${example}/server/${config.orm}/${config.database}`,
          "packages/db",
          config,
        );
      }
    }

    if (hasReactWeb) {
      const reactFramework = config.frontend.find((f) =>
        ["next", "react-router", "tanstack-router", "tanstack-start"].includes(f),
      );
      if (reactFramework) {
        processTemplatesFromPrefix(
          vfs,
          templates,
          `examples/${example}/web/react/${reactFramework}`,
          "apps/web",
          config,
        );

        if (
          config.backend === "self" &&
          (reactFramework === "next" || reactFramework === "tanstack-start")
        ) {
          processTemplatesFromPrefix(
            vfs,
            templates,
            `examples/${example}/fullstack/${reactFramework}`,
            "apps/web",
            config,
          );
        }
      }
    } else if (hasNuxtWeb) {
      processTemplatesFromPrefix(
        vfs,
        templates,
        `examples/${example}/web/nuxt`,
        "apps/web",
        config,
      );
    } else if (hasSvelteWeb) {
      processTemplatesFromPrefix(
        vfs,
        templates,
        `examples/${example}/web/svelte`,
        "apps/web",
        config,
      );
    } else if (hasSolidWeb) {
      processTemplatesFromPrefix(
        vfs,
        templates,
        `examples/${example}/web/solid`,
        "apps/web",
        config,
      );
    }

    if (hasNative) {
      let nativeFramework = "";
      if (hasNativeBare) nativeFramework = "bare";
      else if (hasUniwind) nativeFramework = "uniwind";
      else if (hasUnistyles) nativeFramework = "unistyles";

      if (nativeFramework) {
        processTemplatesFromPrefix(
          vfs,
          templates,
          `examples/${example}/native/${nativeFramework}`,
          "apps/native",
          config,
        );
      }
    }
  }
}
