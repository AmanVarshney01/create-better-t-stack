import type { BetterTStackConfig, ProjectConfig } from "@better-t-stack/types";

import type { VirtualFileSystem } from "./core/virtual-fs";

const BTS_CONFIG_FILE = "bts.jsonc";

/**
 * Writes the BTS configuration file to the VFS (for new project creation).
 * This is browser-safe as it only writes to VFS, not the real filesystem.
 */
export function writeBtsConfigToVfs(
  vfs: VirtualFileSystem,
  projectConfig: ProjectConfig,
  version: string,
  reproducibleCommand?: string,
): void {
  const btsConfig: BetterTStackConfig = {
    version,
    createdAt: new Date().toISOString(),
    reproducibleCommand,
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
    $schema: "https://r2.better-t-stack.dev/schema.json",
    ...btsConfig,
  };

  const jsonContent = JSON.stringify(baseContent, null, 2);

  const addCommand =
    projectConfig.packageManager === "npm"
      ? "npx create-better-t-stack add"
      : projectConfig.packageManager === "pnpm"
        ? "pnpm dlx create-better-t-stack add"
        : "bun create better-t-stack add";

  const finalContent = `// Better-T-Stack
//
// Website: https://www.better-t-stack.dev/
// Stack Builder: https://www.better-t-stack.dev/new
// Analytics: https://www.better-t-stack.dev/analytics
// Showcase: https://www.better-t-stack.dev/showcase
// Sponsor: https://github.com/sponsors/AmanVarshney01
//
// Add new addons with: ${addCommand}
// This file is safe to delete

${jsonContent}`;

  vfs.writeFile(BTS_CONFIG_FILE, finalContent);
}
