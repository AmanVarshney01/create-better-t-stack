/**
 * Alchemy Next.js setup - CLI-only operations
 * NOTE: Dependencies are handled by template-generator's deploy-deps.ts
 * This only modifies config files for "add deploy" command
 */

import fs from "fs-extra";
import path from "node:path";

import type { PackageManager } from "../../../types";

export async function setupNextAlchemyDeploy(
  projectDir: string,
  _packageManager: PackageManager,
  _options?: { skipAppScripts?: boolean },
) {
  const webAppDir = path.join(projectDir, "apps/web");
  if (!(await fs.pathExists(webAppDir))) return;

  // Dependencies are added by template-generator's deploy-deps.ts
  // This only writes config files for "add deploy" command

  const openNextConfigPath = path.join(webAppDir, "open-next.config.ts");
  const openNextConfigContent = `import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({});
`;

  await fs.writeFile(openNextConfigPath, openNextConfigContent);

  const gitignorePath = path.join(webAppDir, ".gitignore");
  if (await fs.pathExists(gitignorePath)) {
    const gitignoreContent = await fs.readFile(gitignorePath, "utf-8");
    if (!gitignoreContent.includes("wrangler.jsonc")) {
      await fs.appendFile(gitignorePath, "\nwrangler.jsonc\n");
    }
  } else {
    await fs.writeFile(gitignorePath, "wrangler.jsonc\n");
  }
}
