import path from "node:path";

import { Result } from "better-result";
import fs from "fs-extra";

import type { ProjectConfig } from "../../types";
import { addPackageDependency } from "../../utils/add-package-deps";
import { addEnvVariablesToFile, type EnvVariable } from "../../utils/env-utils";
import { DatabaseSetupError } from "../../utils/errors";

export async function setupCloudflareD1(
  config: ProjectConfig,
): Promise<Result<void, DatabaseSetupError>> {
  const { projectDir, serverDeploy, webDeploy, orm, backend } = config;

  const isCloudflareD1Target =
    orm === "prisma" &&
    (serverDeploy === "cloudflare" || (backend === "self" && webDeploy === "cloudflare"));

  if (!isCloudflareD1Target) {
    return Result.ok(undefined);
  }

  return Result.tryPromise({
    try: async () => {
      const targetApp = backend === "self" ? "apps/web" : "apps/server";
      const envPath = path.join(projectDir, targetApp, ".env");
      const variables: EnvVariable[] = [
        {
          key: "DATABASE_URL",
          // Prisma resolves this URL from packages/db, where its config lives.
          // D1 runtime access uses the DB binding; this file is tooling-only.
          value: "file:./local.db",
          condition: true,
        },
      ];

      await addEnvVariablesToFile(envPath, variables);
      // Prisma 7's SQLite schema engine expects the file to exist before the
      // first `migrate dev` run. Keep it beside prisma.config.ts.
      await fs.ensureFile(path.join(projectDir, "packages/db/local.db"));

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
