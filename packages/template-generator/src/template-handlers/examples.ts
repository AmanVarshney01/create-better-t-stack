import type { ProjectConfig } from "@better-t-stack/types";

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
  const hasAstroWeb = config.frontend.includes("astro");
  const hasNativeBare = config.frontend.includes("native-bare");
  const hasUniwind = config.frontend.includes("native-uniwind");
  const hasUnistyles = config.frontend.includes("native-unistyles");
  const hasNative = hasNativeBare || hasUniwind || hasUnistyles;
  const frontendConfig = config.backend === "nest" ? { ...config, api: "orpc" as const } : config;

  for (const example of config.examples) {
    if (example === "none") continue;

    if (config.backend === "convex") {
      processTemplatesFromPrefix(
        vfs,
        templates,
        `examples/${example}/convex/packages/backend`,
        "packages/backend",
        config,
      );
    } else if (config.backend === "nest" && example === "todo") {
      processTemplatesFromPrefix(
        vfs,
        templates,
        "examples/todo/nest/server",
        "apps/server",
        config,
      );

      processTemplatesFromPrefix(
        vfs,
        templates,
        `examples/todo/server/${config.orm}/${config.database}`,
        "packages/db",
        config,
      );

      if (hasReactWeb) {
        processTemplatesFromPrefix(
          vfs,
          templates,
          "examples/todo/nest/web/react",
          "apps/web",
          config,
        );
      } else if (hasNuxtWeb) {
        processTemplatesFromPrefix(
          vfs,
          templates,
          "examples/todo/nest/web/nuxt",
          "apps/web",
          config,
        );
      } else if (hasSvelteWeb) {
        processTemplatesFromPrefix(
          vfs,
          templates,
          "examples/todo/nest/web/svelte",
          "apps/web",
          config,
        );
      } else if (hasSolidWeb) {
        processTemplatesFromPrefix(
          vfs,
          templates,
          "examples/todo/nest/web/solid",
          "apps/web",
          config,
        );
      } else if (hasAstroWeb) {
        processTemplatesFromPrefix(
          vfs,
          templates,
          "examples/todo/nest/web/astro",
          "apps/web",
          config,
        );
      }

      if (hasNative) {
        processTemplatesFromPrefix(
          vfs,
          templates,
          "examples/todo/nest/native",
          "apps/native",
          config,
        );
      }
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
          frontendConfig,
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
      if (config.backend === "self") {
        processTemplatesFromPrefix(
          vfs,
          templates,
          `examples/${example}/fullstack/nuxt`,
          "apps/web",
          config,
        );
      }
      processTemplatesFromPrefix(
        vfs,
        templates,
        `examples/${example}/web/nuxt`,
        "apps/web",
        frontendConfig,
      );
    } else if (hasSvelteWeb) {
      if (config.backend === "self") {
        processTemplatesFromPrefix(
          vfs,
          templates,
          `examples/${example}/fullstack/svelte`,
          "apps/web",
          config,
        );
      }
      processTemplatesFromPrefix(
        vfs,
        templates,
        `examples/${example}/web/svelte`,
        "apps/web",
        frontendConfig,
      );
    } else if (hasSolidWeb) {
      processTemplatesFromPrefix(
        vfs,
        templates,
        `examples/${example}/web/solid`,
        "apps/web",
        frontendConfig,
      );
    } else if (hasAstroWeb) {
      processTemplatesFromPrefix(
        vfs,
        templates,
        `examples/${example}/web/astro`,
        "apps/web",
        frontendConfig,
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
          frontendConfig,
        );
      }
    }
  }
}
