import { isCancel, log, select, spinner, text } from "@clack/prompts";
import { Result } from "better-result";
import { $ } from "execa";
import fs from "fs-extra";
import path from "node:path";
import pc from "picocolors";

import type { PackageManager, ProjectConfig } from "../../types";

import { addEnvVariablesToFile, type EnvVariable } from "../../utils/env-utils";
import {
  DatabaseSetupError,
  databaseSetupError,
  UserCancelledError,
  userCancelled,
} from "../../utils/errors";
import { getPackageExecutionArgs } from "../../utils/package-runner";

type NeonConfig = {
  connectionString: string;
  projectId: string;
  dbName: string;
  roleName: string;
};

type NeonRegion = {
  label: string;
  value: string;
};

type NeonSetupResult = Result<void, DatabaseSetupError | UserCancelledError>;

const NEON_REGIONS: NeonRegion[] = [
  { label: "AWS US East (N. Virginia)", value: "aws-us-east-1" },
  { label: "AWS US East (Ohio)", value: "aws-us-east-2" },
  { label: "AWS US West (Oregon)", value: "aws-us-west-2" },
  { label: "AWS Europe (Frankfurt)", value: "aws-eu-central-1" },
  { label: "AWS Asia Pacific (Singapore)", value: "aws-ap-southeast-1" },
  { label: "AWS South America East 1 (São Paulo)", value: "aws-sa-east-1" },
  { label: "AWS Asia Pacific (Sydney)", value: "aws-ap-southeast-2" },
  { label: "Azure East US 2 region (Virginia)", value: "azure-eastus2" },
];

async function executeNeonCommand(
  packageManager: PackageManager,
  commandArgsString: string,
  spinnerText?: string,
): Promise<Result<{ stdout: string; stderr: string }, DatabaseSetupError>> {
  const s = spinner();
  const args = getPackageExecutionArgs(packageManager, commandArgsString);

  if (spinnerText) s.start(spinnerText);

  return Result.tryPromise({
    try: async () => {
      const result = await $`${args}`;
      if (spinnerText)
        s.stop(pc.green(spinnerText.replace("...", "").replace("ing ", "ed ").trim()));
      return result;
    },
    catch: (e) => {
      if (s) s.stop(pc.red(`Failed: ${spinnerText || "Command execution"}`));
      return new DatabaseSetupError({
        provider: "neon",
        message: `Command failed: ${e instanceof Error ? e.message : String(e)}`,
        cause: e,
      });
    },
  });
}

async function createNeonProject(
  projectName: string,
  regionId: string,
  packageManager: PackageManager,
): Promise<Result<NeonConfig, DatabaseSetupError>> {
  const commandArgsString = `neonctl@latest projects create --name ${projectName} --region-id ${regionId} --output json`;
  const execResult = await executeNeonCommand(
    packageManager,
    commandArgsString,
    `Creating Neon project "${projectName}"...`,
  );

  if (execResult.isErr()) {
    return execResult;
  }

  const parseResult = Result.try({
    try: () => JSON.parse(execResult.value.stdout),
    catch: (e) =>
      new DatabaseSetupError({
        provider: "neon",
        message: `Failed to parse Neon response: ${e instanceof Error ? e.message : String(e)}`,
        cause: e,
      }),
  });

  if (parseResult.isErr()) {
    return parseResult;
  }

  const response = parseResult.value;

  if (response.project && response.connection_uris && response.connection_uris.length > 0) {
    const projectId = response.project.id;
    const connectionUri = response.connection_uris[0].connection_uri;
    const params = response.connection_uris[0].connection_parameters;

    return Result.ok({
      connectionString: connectionUri,
      projectId: projectId,
      dbName: params.database,
      roleName: params.role,
    });
  }

  return databaseSetupError("neon", "Failed to extract connection information from Neon response");
}

async function writeEnvFile(
  projectDir: string,
  backend: ProjectConfig["backend"],
  config?: NeonConfig,
): Promise<Result<void, DatabaseSetupError>> {
  return Result.tryPromise({
    try: async () => {
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
    },
    catch: (e) =>
      new DatabaseSetupError({
        provider: "neon",
        message: `Failed to update .env file: ${e instanceof Error ? e.message : String(e)}`,
        cause: e,
      }),
  });
}

async function setupWithNeonDb(
  projectDir: string,
  packageManager: PackageManager,
  backend: ProjectConfig["backend"],
): Promise<Result<void, DatabaseSetupError>> {
  const s = spinner();
  s.start("Creating Neon database using get-db...");

  const targetApp = backend === "self" ? "apps/web" : "apps/server";
  const targetDir = path.join(projectDir, targetApp);

  const ensureDirResult = await Result.tryPromise({
    try: () => fs.ensureDir(targetDir),
    catch: (e) =>
      new DatabaseSetupError({
        provider: "neon",
        message: `Failed to create directory: ${e instanceof Error ? e.message : String(e)}`,
        cause: e,
      }),
  });

  if (ensureDirResult.isErr()) {
    s.stop(pc.red("Failed to create directory"));
    return ensureDirResult;
  }

  const packageArgs = getPackageExecutionArgs(
    packageManager,
    `get-db@latest --yes --ref "sbA3tIe"`,
  );

  return Result.tryPromise({
    try: async () => {
      await $({ cwd: targetDir })`${packageArgs}`;
      s.stop(pc.green("Neon database created successfully!"));
    },
    catch: (e) => {
      s.stop(pc.red("Failed to create database with get-db"));
      return new DatabaseSetupError({
        provider: "neon",
        message: `Failed to create database with get-db: ${e instanceof Error ? e.message : String(e)}`,
        cause: e,
      });
    },
  });
}

function displayManualSetupInstructions(target: "apps/web" | "apps/server") {
  log.info(`Manual Neon PostgreSQL Setup Instructions:

1. Get Neon with Better T Stack referral: https://get.neon.com/sbA3tIe
2. Create a new project from the dashboard
3. Get your connection string
4. Add the database URL to the .env file in ${target}/.env

DATABASE_URL="your_connection_string"`);
}

export async function setupNeonPostgres(
  config: ProjectConfig,
  cliInput?: { manualDb?: boolean },
): Promise<NeonSetupResult> {
  const { packageManager, projectDir, backend } = config;
  const manualDb = cliInput?.manualDb ?? false;
  const target: "apps/web" | "apps/server" = backend === "self" ? "apps/web" : "apps/server";

  if (manualDb) {
    const envResult = await writeEnvFile(projectDir, backend);
    if (envResult.isErr()) {
      return envResult;
    }
    displayManualSetupInstructions(target);
    return Result.ok(undefined);
  }

  const mode = await select({
    message: "Neon setup: choose mode",
    options: [
      {
        label: "Automatic",
        value: "auto",
        hint: "Automated setup with provider CLI, sets .env",
      },
      {
        label: "Manual",
        value: "manual",
        hint: "Manual setup, add env vars yourself",
      },
    ],
    initialValue: "auto",
  });

  if (isCancel(mode)) {
    return userCancelled("Operation cancelled");
  }

  if (mode === "manual") {
    const envResult = await writeEnvFile(projectDir, backend);
    if (envResult.isErr()) {
      return envResult;
    }
    displayManualSetupInstructions(target);
    return Result.ok(undefined);
  }

  const setupMethod = await select({
    message: "Choose your Neon setup method:",
    options: [
      {
        label: "Quick setup with get-db",
        value: "neondb",
        hint: "fastest, no auth required",
      },
      {
        label: "Custom setup with neonctl",
        value: "neonctl",
        hint: "More control - choose project name and region",
      },
    ],
    initialValue: "neondb",
  });

  if (isCancel(setupMethod)) {
    return userCancelled("Operation cancelled");
  }

  if (setupMethod === "neondb") {
    const neonDbResult = await setupWithNeonDb(projectDir, packageManager, backend);
    if (neonDbResult.isErr()) {
      log.error(pc.red(neonDbResult.error.message));
      const envResult = await writeEnvFile(projectDir, backend);
      if (envResult.isErr()) {
        return envResult;
      }
      displayManualSetupInstructions(target);
    } else {
      log.info(`Get Neon with Better T Stack referral: ${pc.cyan("https://get.neon.com/sbA3tIe")}`);
    }
    return neonDbResult;
  }

  // neonctl setup path
  const suggestedProjectName = path.basename(projectDir);
  const projectName = await text({
    message: "Enter a name for your Neon project:",
    defaultValue: suggestedProjectName,
    initialValue: suggestedProjectName,
  });

  if (isCancel(projectName)) {
    return userCancelled("Operation cancelled");
  }

  const regionId = await select({
    message: "Select a region for your Neon project:",
    options: NEON_REGIONS,
    initialValue: NEON_REGIONS[0].value,
  });

  if (isCancel(regionId)) {
    return userCancelled("Operation cancelled");
  }

  const neonConfigResult = await createNeonProject(projectName as string, regionId, packageManager);

  if (neonConfigResult.isErr()) {
    log.error(pc.red(neonConfigResult.error.message));
    const envResult = await writeEnvFile(projectDir, backend);
    if (envResult.isErr()) {
      return envResult;
    }
    displayManualSetupInstructions(target);
    return Result.ok(undefined);
  }

  const finalSpinner = spinner();
  finalSpinner.start("Configuring database connection");

  const envResult = await writeEnvFile(projectDir, backend, neonConfigResult.value);
  if (envResult.isErr()) {
    finalSpinner.stop(pc.red("Failed to configure database connection"));
    return envResult;
  }

  finalSpinner.stop("Neon database configured!");
  log.info(`Get Neon with Better T Stack referral: ${pc.cyan("https://get.neon.com/sbA3tIe")}`);
  return Result.ok(undefined);
}
