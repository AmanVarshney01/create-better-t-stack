import path from "node:path";

import { isCancel, select } from "@clack/prompts";
import { Result } from "better-result";
import { $ } from "execa";
import fs from "fs-extra";
import pc from "picocolors";

import type { PackageManager, ProjectConfig } from "../../types";
import { isSilent } from "../../utils/context";
import { addEnvVariablesToFile, type EnvVariable } from "../../utils/env-utils";
import { DatabaseSetupError, UserCancelledError, userCancelled } from "../../utils/errors";
import { getPackageRunnerPrefix } from "../../utils/package-runner";
import { cliLog, createSpinner } from "../../utils/terminal-output";
import {
  type DatabaseSetupCliOptions,
  type DbSetupMode,
  resolveDbSetupMode,
} from "../core/db-setup-options";

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

const CREATE_DB_USER_AGENT = "aman/better-t-stack";

async function setupWithCreateDb(
  serverDir: string,
  packageManager: PackageManager,
  regionId?: string,
): Promise<Result<PrismaConfig, DatabaseSetupError | UserCancelledError>> {
  cliLog.info("Starting Prisma Postgres setup with create-db.");

  let selectedRegion = regionId;

  if (!selectedRegion) {
    if (isSilent()) {
      selectedRegion = "ap-southeast-1";
    } else {
      const promptedRegion = await select({
        message: "Select your preferred region:",
        options: AVAILABLE_REGIONS,
        initialValue: "ap-southeast-1",
      });

      if (isCancel(promptedRegion)) {
        return userCancelled("Operation cancelled");
      }

      selectedRegion = promptedRegion;
    }
  }

  const createDbArgs = [
    ...getPackageRunnerPrefix(packageManager),
    "create-db@latest",
    "create",
    "--json",
    "--region",
    selectedRegion,
    "--user-agent",
    CREATE_DB_USER_AGENT,
  ];

  const s = createSpinner();
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
  cliLog.info(`Manual Prisma PostgreSQL Setup Instructions:

1. Visit https://console.prisma.io and create an account
2. Create a new PostgreSQL database from the dashboard
3. Get your database URL
4. Add the database URL to the .env file in ${target}/.env

DATABASE_URL="your_database_url"`);
}

export async function setupPrismaPostgres(
  config: ProjectConfig,
  cliInput?: DatabaseSetupCliOptions,
): Promise<PrismaSetupResult> {
  const { packageManager, projectDir, backend } = config;
  const setupMode = resolveDbSetupMode("prisma-postgres", {
    manualDb: cliInput?.manualDb,
    dbSetupOptions: cliInput?.dbSetupOptions ?? config.dbSetupOptions,
  });
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

  if (setupMode === "manual") {
    const envResult = await writeEnvFile(projectDir, backend);
    if (envResult.isErr()) {
      return envResult;
    }
    displayManualSetupInstructions(target);
    return Result.ok(undefined);
  }

  let selectedSetupMode: DbSetupMode | undefined = setupMode;

  if (!selectedSetupMode) {
    if (isSilent()) {
      selectedSetupMode = "manual";
    } else {
      const promptedSetupMode = await select<DbSetupMode>({
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

      if (isCancel(promptedSetupMode)) {
        return userCancelled("Operation cancelled");
      }

      selectedSetupMode = promptedSetupMode;
    }
  }

  if (selectedSetupMode === "manual") {
    const envResult = await writeEnvFile(projectDir, backend);
    if (envResult.isErr()) {
      return envResult;
    }
    displayManualSetupInstructions(target);
    return Result.ok(undefined);
  }

  const prismaConfigResult = await setupWithCreateDb(
    dbDir,
    packageManager,
    cliInput?.dbSetupOptions?.prismaPostgres?.regionId ??
      config.dbSetupOptions?.prismaPostgres?.regionId,
  );

  if (prismaConfigResult.isErr()) {
    // Check for user cancellation
    if (UserCancelledError.is(prismaConfigResult.error)) {
      return prismaConfigResult;
    }

    cliLog.error(pc.red(prismaConfigResult.error.message));
    const envResult = await writeEnvFile(projectDir, backend);
    if (envResult.isErr()) {
      return envResult;
    }
    displayManualSetupInstructions(target);
    cliLog.info("Setup completed with manual configuration required.");
    return Result.ok(undefined);
  }

  const envResult = await writeEnvFile(projectDir, backend, prismaConfigResult.value);
  if (envResult.isErr()) {
    return envResult;
  }

  cliLog.success(pc.green("Prisma Postgres database configured successfully!"));

  if (prismaConfigResult.value.claimUrl) {
    cliLog.info(pc.blue(`Claim URL saved to .env: ${prismaConfigResult.value.claimUrl}`));
  }

  return Result.ok(undefined);
}
