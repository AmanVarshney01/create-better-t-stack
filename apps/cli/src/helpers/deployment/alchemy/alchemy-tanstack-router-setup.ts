import fs from "fs-extra";
import path from "node:path";

import type { PackageManager } from "../../../types";

import { addPackageDependency } from "../../../utils/add-package-deps";

export async function setupTanStackRouterAlchemyDeploy(
  projectDir: string,
  _packageManager: PackageManager,
  _options?: { skipAppScripts?: boolean },
) {
  const webAppDir = path.join(projectDir, "apps/web");
  if (!(await fs.pathExists(webAppDir))) return;

  await addPackageDependency({
    devDependencies: ["alchemy"],
    projectDir: webAppDir,
  });
  // Scripts are handled by packages/infra package
}
