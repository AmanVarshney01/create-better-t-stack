import path from "node:path";
import { log } from "../../utils/logger";
import { $ } from "bun";
import fs from "fs-extra";
import pc from "picocolors";
import type { PackageManager, ProjectConfig } from "../../types";
import { getPackageExecutionCommand } from "../../utils/package-runner";
import { addEnvVariablesToFile, type EnvVariable } from "../core/env-setup";

type NeonConfig = {
  connectionString: string;
  projectId: string;
  dbName: string;
  roleName: string;
};

export type NeonSetupOptions = {
  mode?: "auto" | "manual";
  setupMethod?: "neondb" | "neonctl";
  projectName?: string;
  regionId?: string;
};

const DEFAULT_REGION = "aws-us-east-1";

async function executeNeonCommand(
  packageManager: PackageManager,
  commandArgsString: string,
  stepText?: string,
) {
  try {
    const fullCommand = getPackageExecutionCommand(packageManager, commandArgsString);

    if (stepText) log.step(stepText);
    const result = await $`${{ raw: fullCommand }}`.text();
    if (stepText) log.success(stepText.replace("...", "").replace("ing ", "ed ").trim());
    return { stdout: result };
  } catch (error) {
    log.error(`Failed: ${stepText || "Command execution"}`);
    throw error;
  }
}

async function createNeonProject(
  projectName: string,
  regionId: string,
  packageManager: PackageManager,
) {
  try {
    const commandArgsString = `neonctl@latest projects create --name ${projectName} --region-id ${regionId} --output json`;
    const { stdout } = await executeNeonCommand(
      packageManager,
      commandArgsString,
      `Creating Neon project "${projectName}"...`,
    );

    const response = JSON.parse(stdout);

    if (response.project && response.connection_uris && response.connection_uris.length > 0) {
      const projectId = response.project.id;
      const connectionUri = response.connection_uris[0].connection_uri;
      const params = response.connection_uris[0].connection_parameters;

      return {
        connectionString: connectionUri,
        projectId: projectId,
        dbName: params.database,
        roleName: params.role,
      };
    }
    log.error("Failed to extract connection information from response");
    return null;
  } catch {
    log.error("Failed to create Neon project");
    return null;
  }
}

async function writeEnvFile(
  projectDir: string,
  backend: ProjectConfig["backend"],
  config?: NeonConfig,
) {
  const targetApp = backend === "self" ? "apps/web" : "apps/server";
  const envPath = path.join(projectDir, targetApp, ".env");
  const variables: EnvVariable[] = [
    {
      key: "DATABASE_URL",
      value:
        config?.connectionString ??
        "postgresql://postgres:postgres@localhost:5432/mydb?schema=public",
      condition: true,
    },
  ];
  await addEnvVariablesToFile(envPath, variables);

  return true;
}

async function setupWithNeonDb(
  projectDir: string,
  packageManager: PackageManager,
  backend: ProjectConfig["backend"],
) {
  try {
    log.step("Creating Neon database using get-db...");

    const targetApp = backend === "self" ? "apps/web" : "apps/server";
    const targetDir = path.join(projectDir, targetApp);
    await fs.ensureDir(targetDir);

    const packageCmd = getPackageExecutionCommand(packageManager, "get-db@latest --yes");

    await $`${{ raw: packageCmd }}`.cwd(targetDir);

    log.success("Neon database created successfully!");

    return true;
  } catch (error) {
    log.error("Failed to create database with get-db");
    throw error;
  }
}

function displayManualSetupInstructions(target: "apps/web" | "apps/server") {
  log.info(`Manual Neon PostgreSQL Setup Instructions:

1. Visit https://neon.tech and create an account
2. Create a new project from the dashboard
3. Get your connection string
4. Add the database URL to the .env file in ${target}/.env

DATABASE_URL="your_connection_string"`);
}

export async function setupNeonPostgres(config: ProjectConfig, options: NeonSetupOptions = {}) {
  const { packageManager, projectDir, backend } = config;
  const mode = options.mode ?? "auto";
  const setupMethod = options.setupMethod ?? "neondb";
  const projectName = options.projectName ?? path.basename(projectDir);
  const regionId = options.regionId ?? DEFAULT_REGION;

  try {
    if (mode === "manual") {
      await writeEnvFile(projectDir, backend);
      displayManualSetupInstructions(backend === "self" ? "apps/web" : "apps/server");
      return;
    }

    if (setupMethod === "neondb") {
      await setupWithNeonDb(projectDir, packageManager, backend);
    } else {
      const neonConfig = await createNeonProject(projectName, regionId, packageManager);

      if (!neonConfig) {
        throw new Error("Failed to create project - couldn't get connection information");
      }

      log.step("Configuring database connection...");
      await writeEnvFile(projectDir, backend, neonConfig);
      log.success("Neon database configured!");
    }
  } catch (error) {
    if (error instanceof Error) {
      log.error(error.message);
    }

    await writeEnvFile(projectDir, backend);
    displayManualSetupInstructions(backend === "self" ? "apps/web" : "apps/server");
  }
}
