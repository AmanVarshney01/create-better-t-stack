import type { ProjectConfig } from "@better-t-stack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";
import { type TemplateData, processTemplatesFromPrefix } from "./utils";

export async function processPaymentsTemplates(
  vfs: VirtualFileSystem,
  templates: TemplateData,
  config: ProjectConfig,
): Promise<void> {
  if (!config.payments || config.payments === "none") return;

  const hasReactWeb = config.frontend.some((f) =>
    ["tanstack-router", "react-router", "tanstack-start", "next"].includes(f),
  );
  const hasNuxtWeb = config.frontend.includes("nuxt");
  const hasSvelteWeb = config.frontend.includes("svelte");
  const hasSolidWeb = config.frontend.includes("solid");

  const nativeVariant = config.frontend.includes("native-bare")
    ? "bare"
    : config.frontend.includes("native-uniwind")
      ? "uniwind"
      : config.frontend.includes("native-unistyles")
        ? "unistyles"
        : null;

  if (config.backend === "convex") {
    processTemplatesFromPrefix(
      vfs,
      templates,
      `payments/${config.payments}/convex/backend`,
      "packages/backend",
      config,
    );

    if (config.payments === "revenuecat" && config.auth !== "better-auth") {
      processTemplatesFromPrefix(
        vfs,
        templates,
        "payments/revenuecat/convex/no-better-auth",
        "packages/backend",
        config,
      );
    }
  } else if (config.backend !== "none") {
    processTemplatesFromPrefix(
      vfs,
      templates,
      `payments/${config.payments}/server/base`,
      "packages/auth",
      config,
    );
  }

  if (nativeVariant) {
    processTemplatesFromPrefix(
      vfs,
      templates,
      `payments/${config.payments}/native/base`,
      "apps/native",
      config,
    );
    processTemplatesFromPrefix(
      vfs,
      templates,
      `payments/${config.payments}/native/${nativeVariant}`,
      "apps/native",
      config,
    );
  }

  if (config.backend === "convex") return;

  if (hasReactWeb) {
    const reactFramework = config.frontend.find((f) =>
      ["tanstack-router", "react-router", "tanstack-start", "next"].includes(f),
    );
    if (reactFramework) {
      processTemplatesFromPrefix(
        vfs,
        templates,
        `payments/${config.payments}/web/react/${reactFramework}`,
        "apps/web",
        config,
      );
    }
  } else if (hasNuxtWeb) {
    processTemplatesFromPrefix(
      vfs,
      templates,
      `payments/${config.payments}/web/nuxt`,
      "apps/web",
      config,
    );
  } else if (hasSvelteWeb) {
    processTemplatesFromPrefix(
      vfs,
      templates,
      `payments/${config.payments}/web/svelte`,
      "apps/web",
      config,
    );
  } else if (hasSolidWeb) {
    processTemplatesFromPrefix(
      vfs,
      templates,
      `payments/${config.payments}/web/solid`,
      "apps/web",
      config,
    );
  }
}
