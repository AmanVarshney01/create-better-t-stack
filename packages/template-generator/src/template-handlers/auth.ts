import type { ProjectConfig } from "@better-t-stack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

import { type TemplateData, processTemplatesFromPrefix } from "./utils";

export async function processAuthTemplates(
  vfs: VirtualFileSystem,
  templates: TemplateData,
  config: ProjectConfig,
): Promise<void> {
  if (!config.auth || config.auth === "none") return;

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

  const authProvider = config.auth;

  if (config.backend === "convex" && authProvider === "clerk") {
    processTemplatesFromPrefix(
      vfs,
      templates,
      "auth/clerk/convex/backend",
      "packages/backend",
      config,
    );

    if (hasReactWeb) {
      const reactFramework = config.frontend.find((f) =>
        ["tanstack-router", "react-router", "tanstack-start", "next"].includes(f),
      );
      if (reactFramework) {
        processTemplatesFromPrefix(
          vfs,
          templates,
          `auth/clerk/convex/web/react/${reactFramework}`,
          "apps/web",
          config,
        );
      }
    }

    if (hasNative) {
      processTemplatesFromPrefix(
        vfs,
        templates,
        "auth/clerk/convex/native/base",
        "apps/native",
        config,
      );

      let nativeFramework = "";
      if (hasNativeBare) nativeFramework = "bare";
      else if (hasUniwind) nativeFramework = "uniwind";
      else if (hasUnistyles) nativeFramework = "unistyles";

      if (nativeFramework) {
        processTemplatesFromPrefix(
          vfs,
          templates,
          `auth/clerk/convex/native/${nativeFramework}`,
          "apps/native",
          config,
        );
      }
    }
    return;
  }

  if (config.backend === "convex" && authProvider === "better-auth") {
    processTemplatesFromPrefix(
      vfs,
      templates,
      "auth/better-auth/convex/backend",
      "packages/backend",
      config,
    );

    if (hasReactWeb) {
      processTemplatesFromPrefix(
        vfs,
        templates,
        "auth/better-auth/convex/web/react/base",
        "apps/web",
        config,
      );

      const reactFramework = config.frontend.find((f) =>
        ["tanstack-router", "react-router", "tanstack-start", "next"].includes(f),
      );
      if (reactFramework) {
        processTemplatesFromPrefix(
          vfs,
          templates,
          `auth/better-auth/convex/web/react/${reactFramework}`,
          "apps/web",
          config,
        );
      }
    }

    if (hasNative) {
      processTemplatesFromPrefix(
        vfs,
        templates,
        "auth/better-auth/convex/native/base",
        "apps/native",
        config,
      );

      let nativeFramework = "";
      if (hasNativeBare) nativeFramework = "bare";
      else if (hasUniwind) nativeFramework = "uniwind";
      else if (hasUnistyles) nativeFramework = "unistyles";

      if (nativeFramework) {
        processTemplatesFromPrefix(
          vfs,
          templates,
          `auth/better-auth/convex/native/${nativeFramework}`,
          "apps/native",
          config,
        );
      }
    }
    return;
  }

  if (config.backend !== "convex" && config.backend !== "none") {
    processTemplatesFromPrefix(
      vfs,
      templates,
      `auth/${authProvider}/server/base`,
      "packages/auth",
      config,
    );

    if (config.orm !== "none" && config.database !== "none") {
      processTemplatesFromPrefix(
        vfs,
        templates,
        `auth/${authProvider}/server/db/${config.orm}/${config.database}`,
        "packages/db",
        config,
      );
    }
  }

  if (hasReactWeb) {
    processTemplatesFromPrefix(
      vfs,
      templates,
      `auth/${authProvider}/web/react/base`,
      "apps/web",
      config,
    );

    const reactFramework = config.frontend.find((f) =>
      ["tanstack-router", "react-router", "tanstack-start", "next"].includes(f),
    );
    if (reactFramework) {
      processTemplatesFromPrefix(
        vfs,
        templates,
        `auth/${authProvider}/web/react/${reactFramework}`,
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
          `auth/${authProvider}/fullstack/${reactFramework}`,
          "apps/web",
          config,
        );
      }
    }
  } else if (hasNuxtWeb) {
    processTemplatesFromPrefix(vfs, templates, `auth/${authProvider}/web/nuxt`, "apps/web", config);
  } else if (hasSvelteWeb) {
    processTemplatesFromPrefix(
      vfs,
      templates,
      `auth/${authProvider}/web/svelte`,
      "apps/web",
      config,
    );
  } else if (hasSolidWeb) {
    processTemplatesFromPrefix(
      vfs,
      templates,
      `auth/${authProvider}/web/solid`,
      "apps/web",
      config,
    );
  }

  if (hasNative) {
    processTemplatesFromPrefix(
      vfs,
      templates,
      `auth/${authProvider}/native/base`,
      "apps/native",
      config,
    );

    let nativeFramework = "";
    if (hasNativeBare) nativeFramework = "bare";
    else if (hasUniwind) nativeFramework = "uniwind";
    else if (hasUnistyles) nativeFramework = "unistyles";

    if (nativeFramework) {
      processTemplatesFromPrefix(
        vfs,
        templates,
        `auth/${authProvider}/native/${nativeFramework}`,
        "apps/native",
        config,
      );
    }
  }
}
