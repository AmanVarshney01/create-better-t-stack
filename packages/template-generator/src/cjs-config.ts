import type { CreateJSStackConfig, ProjectConfig } from "@create-js-stack/types";

import type { VirtualFileSystem } from "./core/virtual-fs";

const CJS_CONFIG_FILE = "cjs.jsonc";

/**
 * Writes the Create JS Stack configuration file to the VFS (for new project creation).
 * This is browser-safe as it only writes to VFS, not the real filesystem.
 */
export function writeCjsConfigToVfs(
  vfs: VirtualFileSystem,
  projectConfig: ProjectConfig,
  version: string,
  reproducibleCommand?: string,
): void {
  const cjsConfig: CreateJSStackConfig = {
    version,
    createdAt: new Date().toISOString(),
    reproducibleCommand,
    addonOptions: projectConfig.addonOptions,
    dbSetupOptions: projectConfig.dbSetupOptions,
    database: projectConfig.database,
    orm: projectConfig.orm,
    backend: projectConfig.backend,
    runtime: projectConfig.runtime,
    frontend: projectConfig.frontend,
    addons: projectConfig.addons,
    examples: projectConfig.examples,
    auth: projectConfig.auth,
    payments: projectConfig.payments,
    packageManager: projectConfig.packageManager,
    dbSetup: projectConfig.dbSetup,
    api: projectConfig.api,
    webDeploy: projectConfig.webDeploy,
    serverDeploy: projectConfig.serverDeploy,
  };

  const baseContent = {
    $schema: "https://r2.create-js-stack.dev/schema.json",
    ...cjsConfig,
  };

  const jsonContent = JSON.stringify(baseContent, null, 2);

  const addCommand =
    projectConfig.packageManager === "npm"
      ? "npx create-js-stack add"
      : projectConfig.packageManager === "pnpm"
        ? "pnpm dlx create-js-stack add"
        : "bun create create-js-stack add";

  const finalContent = `// Create-JS-Stack
//
// Website: https://www.create-js-stack.dev/
// Stack Builder: https://www.create-js-stack.dev/new
// Analytics: https://www.create-js-stack.dev/analytics
// Showcase: https://www.create-js-stack.dev/showcase
// Sponsor: https://github.com/sponsors/riteshintro
//
// Add new addons with: ${addCommand}
// This file is safe to delete

${jsonContent}`;

  vfs.writeFile(CJS_CONFIG_FILE, finalContent);
}
