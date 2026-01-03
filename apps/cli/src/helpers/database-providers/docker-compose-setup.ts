import path from "node:path";

import type { Database, ProjectConfig } from "../../types";

import { addEnvVariablesToFile, type EnvVariable } from "../../utils/env-utils";

export async function setupDockerCompose(config: ProjectConfig) {
  const { database, projectDir, projectName, backend } = config;

  if (database === "none" || database === "sqlite") {
    return;
  }

  try {
    await writeEnvFile(projectDir, database, projectName, backend);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    }
  }
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
