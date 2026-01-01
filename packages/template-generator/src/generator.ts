import type { ProjectConfig } from "@better-t-stack/types";

import type { GeneratorOptions, GeneratorResult, VirtualFileTree } from "./types";

import { processTemplateString, transformFilename, isBinaryFile } from "./core/template-processor";
import { VirtualFileSystem } from "./core/virtual-fs";
import { processPostGeneration } from "./post-processor";
import { processDependencies, processReadme } from "./processors";

/**
 * Template data structure for embedded templates
 * Key: template path (relative to templates directory)
 * Value: template content
 */
export type TemplateData = Map<string, string>;

/**
 * Generate a virtual file tree from project configuration
 */
export async function generateVirtualProject(options: GeneratorOptions): Promise<GeneratorResult> {
  try {
    const { config, templates } = options;

    if (!templates || templates.size === 0) {
      return {
        success: false,
        error: "No templates provided. Templates must be passed via the templates option.",
      };
    }

    const vfs = new VirtualFileSystem();

    // Phase 1: Process templates based on configuration
    await processBaseTemplate(vfs, templates, config);
    await processFrontendTemplates(vfs, templates, config);
    await processBackendTemplates(vfs, templates, config);
    await processDbTemplates(vfs, templates, config);
    await processApiTemplates(vfs, templates, config);
    await processConfigPackage(vfs, templates, config);
    await processEnvPackage(vfs, templates, config);
    await processAuthTemplates(vfs, templates, config);
    await processPaymentsTemplates(vfs, templates, config);
    await processAddonTemplates(vfs, templates, config);
    await processExampleTemplates(vfs, templates, config);
    await processExtrasTemplates(vfs, templates, config);
    await processDeployTemplates(vfs, templates, config);

    // Phase 2: Post-process package.json (scripts, naming, catalogs)
    processPostGeneration(vfs, config);

    // Phase 3: Add dependencies to all packages
    processDependencies(vfs, config);

    // Phase 4: Generate README.md
    processReadme(vfs, config);

    const tree: VirtualFileTree = {
      root: vfs.toTree(config.projectName),
      fileCount: vfs.getFileCount(),
      directoryCount: vfs.getDirectoryCount(),
      config,
    };

    return { success: true, tree };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Check if templates exist for a given prefix
 */
function hasTemplatesWithPrefix(templates: TemplateData, prefix: string): boolean {
  const normalizedPrefix = prefix.endsWith("/") ? prefix : `${prefix}/`;
  for (const path of templates.keys()) {
    if (path.startsWith(normalizedPrefix)) return true;
  }
  return false;
}

/**
 * Process templates from a specific directory prefix
 */
function processTemplatesFromPrefix(
  vfs: VirtualFileSystem,
  templates: TemplateData,
  prefix: string,
  destPrefix: string,
  config: ProjectConfig,
): void {
  const normalizedPrefix = prefix.endsWith("/") ? prefix : `${prefix}/`;

  for (const [templatePath, content] of templates) {
    if (!templatePath.startsWith(normalizedPrefix)) continue;

    // Get relative path from prefix
    const relativePath = templatePath.slice(normalizedPrefix.length);

    // Transform filename (remove .hbs, convert _gitignore, etc.)
    const outputPath = transformFilename(relativePath);
    const destPath = destPrefix ? `${destPrefix}/${outputPath}` : outputPath;

    // Process content
    let processedContent: string;
    if (isBinaryFile(templatePath)) {
      processedContent = "[Binary file]";
    } else if (templatePath.endsWith(".hbs")) {
      processedContent = processTemplateString(content, config);
    } else {
      processedContent = content;
    }

    vfs.writeFile(destPath, processedContent);
  }
}

// =============================================================================
// Base Template
// =============================================================================

async function processBaseTemplate(
  vfs: VirtualFileSystem,
  templates: TemplateData,
  config: ProjectConfig,
): Promise<void> {
  processTemplatesFromPrefix(vfs, templates, "base", "", config);
}

// =============================================================================
// Frontend Templates
// =============================================================================

async function processFrontendTemplates(
  vfs: VirtualFileSystem,
  templates: TemplateData,
  config: ProjectConfig,
): Promise<void> {
  const hasReactWeb = config.frontend.some((f) =>
    ["tanstack-router", "react-router", "tanstack-start", "next"].includes(f),
  );
  const hasNuxtWeb = config.frontend.includes("nuxt");
  const hasSvelteWeb = config.frontend.includes("svelte");
  const hasSolidWeb = config.frontend.includes("solid");
  const hasNativeBare = config.frontend.includes("native-bare");
  const hasNativeUniwind = config.frontend.includes("native-uniwind");
  const hasUnistyles = config.frontend.includes("native-unistyles");
  const isConvex = config.backend === "convex";

  // Web frontend
  if (hasReactWeb || hasNuxtWeb || hasSvelteWeb || hasSolidWeb) {
    if (hasReactWeb) {
      processTemplatesFromPrefix(vfs, templates, "frontend/react/web-base", "apps/web", config);

      const reactFramework = config.frontend.find((f) =>
        ["tanstack-router", "react-router", "tanstack-start", "next"].includes(f),
      );
      if (reactFramework) {
        processTemplatesFromPrefix(
          vfs,
          templates,
          `frontend/react/${reactFramework}`,
          "apps/web",
          config,
        );
      }
    } else if (hasNuxtWeb) {
      processTemplatesFromPrefix(vfs, templates, "frontend/nuxt", "apps/web", config);
    } else if (hasSvelteWeb) {
      processTemplatesFromPrefix(vfs, templates, "frontend/svelte", "apps/web", config);
    } else if (hasSolidWeb) {
      processTemplatesFromPrefix(vfs, templates, "frontend/solid", "apps/web", config);
    }
  }

  // Native frontend
  if (hasNativeBare || hasNativeUniwind || hasUnistyles) {
    processTemplatesFromPrefix(vfs, templates, "frontend/native/base", "apps/native", config);

    if (hasNativeBare) {
      processTemplatesFromPrefix(vfs, templates, "frontend/native/bare", "apps/native", config);
    } else if (hasNativeUniwind) {
      processTemplatesFromPrefix(vfs, templates, "frontend/native/uniwind", "apps/native", config);
    } else if (hasUnistyles) {
      processTemplatesFromPrefix(
        vfs,
        templates,
        "frontend/native/unistyles",
        "apps/native",
        config,
      );
    }

    // Native API integration
    if (!isConvex && (config.api === "trpc" || config.api === "orpc")) {
      processTemplatesFromPrefix(vfs, templates, `api/${config.api}/native`, "apps/native", config);
    }
  }
}

// =============================================================================
// Backend Templates
// =============================================================================

async function processBackendTemplates(
  vfs: VirtualFileSystem,
  templates: TemplateData,
  config: ProjectConfig,
): Promise<void> {
  if (config.backend === "none") return;

  if (config.backend === "convex") {
    processTemplatesFromPrefix(
      vfs,
      templates,
      "backend/convex/packages/backend",
      "packages/backend",
      config,
    );
    return;
  }

  if (config.backend === "self") {
    // Fullstack mode - no separate server app
    return;
  }

  // Standalone server
  processTemplatesFromPrefix(vfs, templates, "backend/server/base", "apps/server", config);
  processTemplatesFromPrefix(
    vfs,
    templates,
    `backend/server/${config.backend}`,
    "apps/server",
    config,
  );
}

// =============================================================================
// Database Templates
// =============================================================================

async function processDbTemplates(
  vfs: VirtualFileSystem,
  templates: TemplateData,
  config: ProjectConfig,
): Promise<void> {
  if (config.database === "none" || config.orm === "none") return;
  if (config.backend === "convex") return;

  processTemplatesFromPrefix(vfs, templates, "db/base", "packages/db", config);
  processTemplatesFromPrefix(vfs, templates, `db/${config.orm}/base`, "packages/db", config);
  processTemplatesFromPrefix(
    vfs,
    templates,
    `db/${config.orm}/${config.database}`,
    "packages/db",
    config,
  );
}

// =============================================================================
// API Templates
// =============================================================================

async function processApiTemplates(
  vfs: VirtualFileSystem,
  templates: TemplateData,
  config: ProjectConfig,
): Promise<void> {
  if (config.api === "none") return;
  if (config.backend === "convex") return;

  // API server package
  processTemplatesFromPrefix(vfs, templates, `api/${config.api}/server`, "packages/api", config);

  const hasReactWeb = config.frontend.some((f) =>
    ["tanstack-router", "react-router", "tanstack-start", "next"].includes(f),
  );
  const hasNuxtWeb = config.frontend.includes("nuxt");
  const hasSvelteWeb = config.frontend.includes("svelte");
  const hasSolidWeb = config.frontend.includes("solid");

  // Web API integration
  if (hasReactWeb) {
    processTemplatesFromPrefix(
      vfs,
      templates,
      `api/${config.api}/web/react/base`,
      "apps/web",
      config,
    );

    // Fullstack mode
    const reactFramework = config.frontend.find((f) =>
      ["tanstack-router", "react-router", "tanstack-start", "next"].includes(f),
    );
    if (
      config.backend === "self" &&
      (reactFramework === "next" || reactFramework === "tanstack-start")
    ) {
      processTemplatesFromPrefix(
        vfs,
        templates,
        `api/${config.api}/fullstack/${reactFramework}`,
        "apps/web",
        config,
      );
    }
  } else if (hasNuxtWeb && config.api === "orpc") {
    processTemplatesFromPrefix(vfs, templates, `api/${config.api}/web/nuxt`, "apps/web", config);
  } else if (hasSvelteWeb && config.api === "orpc") {
    processTemplatesFromPrefix(vfs, templates, `api/${config.api}/web/svelte`, "apps/web", config);
  } else if (hasSolidWeb && config.api === "orpc") {
    processTemplatesFromPrefix(vfs, templates, `api/${config.api}/web/solid`, "apps/web", config);
  }
}

// =============================================================================
// Config Package
// =============================================================================

async function processConfigPackage(
  vfs: VirtualFileSystem,
  templates: TemplateData,
  config: ProjectConfig,
): Promise<void> {
  processTemplatesFromPrefix(vfs, templates, "packages/config", "packages/config", config);
}

// =============================================================================
// Env Package
// =============================================================================

async function processEnvPackage(
  vfs: VirtualFileSystem,
  templates: TemplateData,
  config: ProjectConfig,
): Promise<void> {
  const hasWebFrontend = config.frontend.some((f) =>
    [
      "tanstack-router",
      "react-router",
      "tanstack-start",
      "next",
      "nuxt",
      "svelte",
      "solid",
    ].includes(f),
  );
  const hasNative = config.frontend.some((f) =>
    ["native-bare", "native-uniwind", "native-unistyles"].includes(f),
  );

  if (!hasWebFrontend && !hasNative && config.backend === "none") {
    return;
  }

  // Copy base env package files
  processTemplatesFromPrefix(vfs, templates, "packages/env", "packages/env", config);
}

// =============================================================================
// Auth Templates
// =============================================================================

async function processAuthTemplates(
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

  // Convex + Clerk
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

  // Convex + Better Auth
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

  // Non-Convex auth - server/auth package
  if (config.backend !== "convex" && config.backend !== "none") {
    processTemplatesFromPrefix(
      vfs,
      templates,
      `auth/${authProvider}/server/base`,
      "packages/auth",
      config,
    );

    // Auth DB integration
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

  // Auth web integration
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

      // Fullstack auth
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

  // Native auth
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

// =============================================================================
// Payments Templates
// =============================================================================

async function processPaymentsTemplates(
  vfs: VirtualFileSystem,
  templates: TemplateData,
  config: ProjectConfig,
): Promise<void> {
  if (!config.payments || config.payments === "none") return;
  if (config.backend === "convex") return;

  const hasReactWeb = config.frontend.some((f) =>
    ["tanstack-router", "react-router", "tanstack-start", "next"].includes(f),
  );
  const hasNuxtWeb = config.frontend.includes("nuxt");
  const hasSvelteWeb = config.frontend.includes("svelte");
  const hasSolidWeb = config.frontend.includes("solid");

  // Payments server
  if (config.backend !== "none") {
    processTemplatesFromPrefix(
      vfs,
      templates,
      `payments/${config.payments}/server/base`,
      "packages/auth",
      config,
    );
  }

  // Payments web
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

// =============================================================================
// Addon Templates
// =============================================================================

async function processAddonTemplates(
  vfs: VirtualFileSystem,
  templates: TemplateData,
  config: ProjectConfig,
): Promise<void> {
  if (!config.addons || config.addons.length === 0) return;

  for (const addon of config.addons) {
    if (addon === "none") continue;

    // PWA has special handling
    if (addon === "pwa") {
      if (config.frontend.includes("next")) {
        processTemplatesFromPrefix(vfs, templates, "addons/pwa/apps/web/next", "apps/web", config);
      } else if (
        config.frontend.some((f) => ["tanstack-router", "react-router", "solid"].includes(f))
      ) {
        processTemplatesFromPrefix(vfs, templates, "addons/pwa/apps/web/vite", "apps/web", config);
      }
      continue;
    }

    // Standard addons
    processTemplatesFromPrefix(vfs, templates, `addons/${addon}`, "", config);
  }
}

// =============================================================================
// Example Templates
// =============================================================================

async function processExampleTemplates(
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

    // Convex examples
    if (config.backend === "convex") {
      processTemplatesFromPrefix(
        vfs,
        templates,
        `examples/${example}/convex/packages/backend`,
        "packages/backend",
        config,
      );
    } else if (config.backend !== "none" && config.api !== "none") {
      // Server-side examples
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

    // Web examples
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

        // Fullstack examples
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

    // Native examples
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

// =============================================================================
// Extras Templates (pnpm-workspace, bunfig, npmrc)
// =============================================================================

async function processExtrasTemplates(
  vfs: VirtualFileSystem,
  templates: TemplateData,
  config: ProjectConfig,
): Promise<void> {
  const hasNative = config.frontend.some((f) =>
    ["native-bare", "native-uniwind", "native-unistyles"].includes(f),
  );
  const hasNuxt = config.frontend.includes("nuxt");

  if (config.packageManager === "pnpm") {
    if (hasTemplatesWithPrefix(templates, "extras")) {
      processTemplatesFromPrefix(vfs, templates, "extras/pnpm-workspace.yaml", "", config);
    }
  }

  if (config.packageManager === "bun") {
    processTemplatesFromPrefix(vfs, templates, "extras/bunfig.toml", "", config);
  }

  if (config.packageManager === "pnpm" && (hasNative || hasNuxt)) {
    processTemplatesFromPrefix(vfs, templates, "extras/_npmrc", "", config);
  }
}

// =============================================================================
// Deploy Templates
// =============================================================================

async function processDeployTemplates(
  vfs: VirtualFileSystem,
  templates: TemplateData,
  config: ProjectConfig,
): Promise<void> {
  const isBackendSelf = config.backend === "self";

  // Cloudflare infra package
  if (config.webDeploy === "cloudflare" || config.serverDeploy === "cloudflare") {
    processTemplatesFromPrefix(vfs, templates, "packages/infra", "packages/infra", config);
  }

  // Web deploy (non-cloudflare)
  if (config.webDeploy !== "none" && config.webDeploy !== "cloudflare") {
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

  // Server deploy
  if (config.serverDeploy !== "none" && config.serverDeploy !== "cloudflare" && !isBackendSelf) {
    processTemplatesFromPrefix(
      vfs,
      templates,
      `deploy/${config.serverDeploy}/server`,
      "apps/server",
      config,
    );
  }
}

// =============================================================================
// Minimal Preview (for quick skeleton)
// =============================================================================

/**
 * Create a minimal preview file tree without actual template content
 * This is faster and doesn't require template data
 */
export function generateMinimalPreview(config: ProjectConfig): VirtualFileTree {
  const vfs = new VirtualFileSystem();

  // Always add base files
  vfs.writeFile("package.json", "{}");
  vfs.writeFile("tsconfig.json", "{}");
  vfs.writeFile(".gitignore", "");

  // Add frontend structure
  const hasReactWeb = config.frontend.some((f) =>
    ["tanstack-router", "react-router", "tanstack-start", "next"].includes(f),
  );
  const hasNuxtWeb = config.frontend.includes("nuxt");
  const hasSvelteWeb = config.frontend.includes("svelte");
  const hasSolidWeb = config.frontend.includes("solid");
  const hasNative = config.frontend.some((f) => f.startsWith("native-"));

  if (hasReactWeb || hasNuxtWeb || hasSvelteWeb || hasSolidWeb) {
    vfs.writeFile("apps/web/package.json", "{}");
    vfs.writeFile("apps/web/tsconfig.json", "{}");
    vfs.writeFile("apps/web/src/index.tsx", "");
  }

  if (hasNative) {
    vfs.writeFile("apps/native/package.json", "{}");
    vfs.writeFile("apps/native/app.json", "{}");
  }

  // Add backend structure
  if (config.backend !== "none" && config.backend !== "self" && config.backend !== "convex") {
    vfs.writeFile("apps/server/package.json", "{}");
    vfs.writeFile("apps/server/src/index.ts", "");
  }

  // Add packages
  if (config.backend !== "none") {
    if (config.backend === "convex") {
      vfs.writeFile("packages/backend/package.json", "{}");
      vfs.writeFile("packages/backend/convex/schema.ts", "");
    } else {
      if (config.api !== "none") {
        vfs.writeFile("packages/api/package.json", "{}");
        vfs.writeFile("packages/api/src/index.ts", "");
      }

      if (config.database !== "none" && config.orm !== "none") {
        vfs.writeFile("packages/db/package.json", "{}");
        vfs.writeFile("packages/db/src/index.ts", "");
      }

      if (config.auth !== "none") {
        vfs.writeFile("packages/auth/package.json", "{}");
        vfs.writeFile("packages/auth/src/index.ts", "");
      }
    }
  }

  return {
    root: vfs.toTree(config.projectName),
    fileCount: vfs.getFileCount(),
    directoryCount: vfs.getDirectoryCount(),
    config,
  };
}
