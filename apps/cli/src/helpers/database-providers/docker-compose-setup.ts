import { Result } from "better-result";
import path from "node:path";

import type { Database, ProjectConfig } from "../../types";

import { addEnvVariablesToFile, type EnvVariable } from "../../utils/env-utils";
import { DatabaseSetupError } from "../../utils/errors";

export async function setupDockerCompose(
  config: ProjectConfig,
): Promise<Result<void, DatabaseSetupError>> {
  const { database, projectDir, projectName, backend } = config;

  if (database === "none" || database === "sqlite") {
    return Result.ok(undefined);
  }

  const result = await Result.tryPromise({
    try: async () => {
      await writeEnvFile(projectDir, database, projectName, backend);
    },
    catch: (e) =>
      new DatabaseSetupError({
        provider: "docker-compose",
        message: `Failed to setup docker compose env: ${e instanceof Error ? e.message : String(e)}`,
        cause: e,
      }),
  });

  return result.isErr() ? result : Result.ok(undefined);
}

async function writeEnvFile(
  projectDir: string,
  database: Database,
  projectName: string,
  backend?: string,
) {
  const targetApp = backend === "self" ? "apps/web" : "apps/server";
  const envPath = path.join(projectDir, targetApp, ".env");
  const variables: EnvVariable[] = [
    {
      key: "DATABASE_URL",
      value: getDatabaseUrl(database, projectName),
      condition: true,
    },
  ];
  await addEnvVariablesToFile(envPath, variables);
}

function getDatabaseUrl(database: Database, projectName: string) {
  switch (database) {
    case "postgres":
      return `postgresql://postgres:password@localhost:5432/${projectName}`;
    case "mysql":
      return `mysql://user:password@localhost:3306/${projectName}`;
    case "mongodb":
      return `mongodb://root:password@localhost:27017/${projectName}?authSource=admin`;
    default:
      return "";
  }
}
