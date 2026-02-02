import { Result } from "better-result";
import path from "node:path";

import type { ProjectConfig } from "../../types";

import { addPackageDependency } from "../../utils/add-package-deps";
import { addEnvVariablesToFile, type EnvVariable } from "../../utils/env-utils";
import { DatabaseSetupError } from "../../utils/errors";

export async function setupCloudflareD1(
  config: ProjectConfig,
): Promise<Result<void, DatabaseSetupError>> {
  const { projectDir, serverDeploy, orm, backend } = config;

  if (!(serverDeploy === "cloudflare" && orm === "prisma")) {
    return Result.ok(undefined);
  }

  return Result.tryPromise({
    try: async () => {
      const targetApp = backend === "self" ? "apps/web" : "apps/server";
      const envPath = path.join(projectDir, targetApp, ".env");
      const variables: EnvVariable[] = [
        {
          key: "DATABASE_URL",
          value: `file:${path.join(projectDir, "apps/server", "local.db")}`,
          condition: true,
        },
      ];

      await addEnvVariablesToFile(envPath, variables);

      const serverDir = path.join(projectDir, backend === "self" ? "apps/web" : "apps/server");
      await addPackageDependency({
        dependencies: ["@prisma/adapter-d1"],
        projectDir: serverDir,
      });
    },
    catch: (e) =>
      new DatabaseSetupError({
        provider: "d1",
        message: `Failed to set up Cloudflare D1: ${e instanceof Error ? e.message : String(e)}`,
        cause: e,
      }),
  });
}
