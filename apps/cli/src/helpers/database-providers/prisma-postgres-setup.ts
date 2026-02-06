import { isCancel, log, select, spinner } from "@clack/prompts";
import { Result } from "better-result";
import { $ } from "execa";
import fs from "fs-extra";
import path from "node:path";
import pc from "picocolors";

import type { PackageManager, ProjectConfig } from "../../types";

import { addEnvVariablesToFile, type EnvVariable } from "../../utils/env-utils";
import { DatabaseSetupError, UserCancelledError, userCancelled } from "../../utils/errors";
import { getPackageExecutionArgs } from "../../utils/package-runner";

type PrismaConfig = {
  databaseUrl: string;
  claimUrl?: string;
};

type CreateDbResponse = {
  connectionString: string;
  directConnectionString: string;
  claimUrl: string;
  deletionDate: string;
  region: string;
  name: string;
  projectId: string;
};

type PrismaSetupResult = Result<void, DatabaseSetupError | UserCancelledError>;

const AVAILABLE_REGIONS = [
  { value: "ap-southeast-1", label: "Asia Pacific (Singapore)" },
  { value: "ap-northeast-1", label: "Asia Pacific (Tokyo)" },
  { value: "eu-central-1", label: "Europe (Frankfurt)" },
  { value: "eu-west-3", label: "Europe (Paris)" },
  { value: "us-east-1", label: "US East (N. Virginia)" },
  { value: "us-west-1", label: "US West (N. California)" },
];

async function setupWithCreateDb(
  serverDir: string,
  packageManager: PackageManager,
): Promise<Result<PrismaConfig, DatabaseSetupError | UserCancelledError>> {
  log.info("Starting Prisma Postgres setup with create-db.");

  const selectedRegion = await select({
    message: "Select your preferred region:",
    options: AVAILABLE_REGIONS,
    initialValue: "ap-southeast-1",
  });

  if (isCancel(selectedRegion)) {
    return userCancelled("Operation cancelled");
  }

  const createDbArgs = getPackageExecutionArgs(
    packageManager,
    `create-db@latest --json --region ${selectedRegion} --user-agent "aman/better-t-stack"`,
  );

  const s = spinner();
  s.start("Creating Prisma Postgres database...");

  const execResult = await Result.tryPromise({
    try: async () => {
      const { stdout } = await $({ cwd: serverDir })`${createDbArgs}`;
      s.stop("Database created successfully!");
      return stdout;
    },
    catch: (e) => {
      s.stop(pc.red("Failed to create database"));
      return new DatabaseSetupError({
        provider: "prisma-postgres",
        message: `Failed to create database: ${e instanceof Error ? e.message : String(e)}`,
        cause: e,
      });
    },
  });

  if (execResult.isErr()) {
    return execResult;
  }

  const parseResult = Result.try({
    try: () => JSON.parse(execResult.value) as CreateDbResponse,
    catch: (e) =>
      new DatabaseSetupError({
        provider: "prisma-postgres",
        message: `Failed to parse create-db response: ${e instanceof Error ? e.message : String(e)}`,
        cause: e,
      }),
  });

  if (parseResult.isErr()) {
    return parseResult;
  }

  const createDbResponse = parseResult.value;

  return Result.ok({
    databaseUrl: createDbResponse.connectionString,
    claimUrl: createDbResponse.claimUrl,
  });
}

async function writeEnvFile(
  projectDir: string,
  backend: ProjectConfig["backend"],
  config?: PrismaConfig,
): Promise<Result<void, DatabaseSetupError>> {
  return Result.tryPromise({
    try: async () => {
      const targetApp = backend === "self" ? "apps/web" : "apps/server";
      const envPath = path.join(projectDir, targetApp, ".env");
      const variables: EnvVariable[] = [
        {
          key: "DATABASE_URL",
          value:
            config?.databaseUrl ??
            "postgresql://postgres:postgres@localhost:5432/mydb?schema=public",
          condition: true,
        },
      ];

      if (config?.claimUrl) {
        variables.push({
          key: "CLAIM_URL",
          value: config.claimUrl,
          condition: true,
        });
      }

      await addEnvVariablesToFile(envPath, variables);
    },
    catch: (e) =>
      new DatabaseSetupError({
        provider: "prisma-postgres",
        message: `Failed to update environment configuration: ${e instanceof Error ? e.message : String(e)}`,
        cause: e,
      }),
  });
}

function displayManualSetupInstructions(target: "apps/web" | "apps/server") {
  log.info(`Manual Prisma PostgreSQL Setup Instructions:

1. Visit https://console.prisma.io and create an account
2. Create a new PostgreSQL database from the dashboard
3. Get your database URL
4. Add the database URL to the .env file in ${target}/.env

DATABASE_URL="your_database_url"`);
}

export async function setupPrismaPostgres(
  config: ProjectConfig,
  cliInput?: { manualDb?: boolean },
): Promise<PrismaSetupResult> {
  const { packageManager, projectDir, backend } = config;
  const manualDb = cliInput?.manualDb ?? false;
  const dbDir = path.join(projectDir, "packages/db");
  const target: "apps/web" | "apps/server" = backend === "self" ? "apps/web" : "apps/server";

  const ensureDirResult = await Result.tryPromise({
    try: () => fs.ensureDir(dbDir),
    catch: (e) =>
      new DatabaseSetupError({
        provider: "prisma-postgres",
        message: `Failed to create directory: ${e instanceof Error ? e.message : String(e)}`,
        cause: e,
      }),
  });

  if (ensureDirResult.isErr()) {
    return ensureDirResult;
  }

  if (manualDb) {
    const envResult = await writeEnvFile(projectDir, backend);
    if (envResult.isErr()) {
      return envResult;
    }
    displayManualSetupInstructions(target);
    return Result.ok(undefined);
  }

  const setupMode = await select({
    message: "Prisma Postgres setup: choose mode",
    options: [
      {
        label: "Automatic (create-db)",
        value: "auto",
        hint: "Provision a database via Prisma's create-db CLI",
      },
      {
        label: "Manual",
        value: "manual",
        hint: "Add your own DATABASE_URL later",
      },
    ],
    initialValue: "auto",
  });

  if (isCancel(setupMode)) {
    return userCancelled("Operation cancelled");
  }

  if (setupMode === "manual") {
    const envResult = await writeEnvFile(projectDir, backend);
    if (envResult.isErr()) {
      return envResult;
    }
    displayManualSetupInstructions(target);
    return Result.ok(undefined);
  }

  const prismaConfigResult = await setupWithCreateDb(dbDir, packageManager);

  if (prismaConfigResult.isErr()) {
    // Check for user cancellation
    if (UserCancelledError.is(prismaConfigResult.error)) {
      return prismaConfigResult;
    }

    log.error(pc.red(prismaConfigResult.error.message));
    const envResult = await writeEnvFile(projectDir, backend);
    if (envResult.isErr()) {
      return envResult;
    }
    displayManualSetupInstructions(target);
    log.info("Setup completed with manual configuration required.");
    return Result.ok(undefined);
  }

  const envResult = await writeEnvFile(projectDir, backend, prismaConfigResult.value);
  if (envResult.isErr()) {
    return envResult;
  }

  log.success(pc.green("Prisma Postgres database configured successfully!"));

  if (prismaConfigResult.value.claimUrl) {
    log.info(pc.blue(`Claim URL saved to .env: ${prismaConfigResult.value.claimUrl}`));
  }

  return Result.ok(undefined);
}
