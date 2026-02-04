import { Result } from "better-result";
import fs from "fs-extra";
import path from "node:path";

import type { ProjectConfig } from "../../types";

import { addEnvVariablesToFile, type EnvVariable } from "../../utils/env-utils";
import { DatabaseSetupError } from "../../utils/errors";

export async function setupPlanetScale(
  config: ProjectConfig,
): Promise<Result<void, DatabaseSetupError>> {
  const { projectDir, database, orm, backend } = config;

  if (!["mysql", "postgres"].includes(database)) {
    return Result.ok(undefined);
  }

  return Result.tryPromise({
    try: async () => {
      const targetApp = backend === "self" ? "apps/web" : "apps/server";
      const envPath = path.join(projectDir, targetApp, ".env");

      if (database === "mysql" && orm === "drizzle") {
        const variables: EnvVariable[] = [
          {
            key: "DATABASE_URL",
            value: 'mysql://username:password@host/database?ssl={"rejectUnauthorized":true}',
            condition: true,
          },
          {
            key: "DATABASE_HOST",
            value: "",
            condition: true,
          },
          {
            key: "DATABASE_USERNAME",
            value: "",
            condition: true,
          },
          {
            key: "DATABASE_PASSWORD",
            value: "",
            condition: true,
          },
        ];

        await fs.ensureDir(path.join(projectDir, targetApp));
        await addEnvVariablesToFile(envPath, variables);
      }

      if (database === "postgres" && orm === "prisma") {
        const variables: EnvVariable[] = [
          {
            key: "DATABASE_URL",
            value: "postgresql://username:password@host/database?sslaccept=strict",
            condition: true,
          },
        ];

        await fs.ensureDir(path.join(projectDir, targetApp));
        await addEnvVariablesToFile(envPath, variables);
      }

      if (database === "postgres" && orm === "drizzle") {
        const variables: EnvVariable[] = [
          {
            key: "DATABASE_URL",
            value: "postgresql://username:password@host/database?sslmode=verify-full",
            condition: true,
          },
        ];

        await fs.ensureDir(path.join(projectDir, targetApp));
        await addEnvVariablesToFile(envPath, variables);
      }

      if (database === "mysql" && orm === "prisma") {
        const variables: EnvVariable[] = [
          {
            key: "DATABASE_URL",
            value: "mysql://username:password@host/database?sslaccept=strict",
            condition: true,
          },
        ];

        await fs.ensureDir(path.join(projectDir, targetApp));
        await addEnvVariablesToFile(envPath, variables);
      }
    },
    catch: (e) =>
      new DatabaseSetupError({
        provider: "planetscale",
        message: `Failed to set up PlanetScale env: ${e instanceof Error ? e.message : String(e)}`,
        cause: e,
      }),
  });
}
