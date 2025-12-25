import fs from "fs-extra";
import path from "node:path";

import type { ProjectConfig } from "../../types";

import { addPackageDependency } from "../../utils/add-package-deps";

export async function setupInfraPackageDependencies(projectDir: string, _options: ProjectConfig) {
  const infraDir = path.join(projectDir, "packages/infra");
  if (!(await fs.pathExists(infraDir))) return;

  await addPackageDependency({
    devDependencies: ["alchemy"],
    projectDir: infraDir,
  });
}
