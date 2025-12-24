import path from "node:path";
import { log } from "../../utils/logger";
import { $ } from "bun";
import fs from "fs-extra";
import pc from "picocolors";
import type { PackageManager, ProjectConfig } from "../../types";
import { getPackageExecutionCommand } from "../../utils/package-runner";
import { addEnvVariablesToFile, type EnvVariable } from "../core/env-setup";

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

export type PrismaPostgresSetupOptions = {
  mode?: "auto" | "manual";
  region?: string;
};

const DEFAULT_REGION = "ap-southeast-1";

async function setupWithCreateDb(
  serverDir: string,
  packageManager: PackageManager,
  region: string,
) {
  try {
    log.info("Starting Prisma Postgres setup with create-db.");

    const createDbCommand = getPackageExecutionCommand(
      packageManager,
      `create-db@latest --json --region ${region}`,
    );

    log.step("Creating Prisma Postgres database...");

    const stdout = await $`${{ raw: createDbCommand }}`.cwd(serverDir).text();

    log.success("Database created successfully!");

    let createDbResponse: CreateDbResponse;
    try {
      createDbResponse = JSON.parse(stdout) as CreateDbResponse;
    } catch {
      log.error("Failed to parse create-db response");
      return null;
    }

    return {
      databaseUrl: createDbResponse.connectionString,
      claimUrl: createDbResponse.claimUrl,
    };
  } catch (error) {
    if (error instanceof Error) {
      log.error(error.message);
    }
    return null;
  }
}

async function writeEnvFile(
  projectDir: string,
  backend: ProjectConfig["backend"],
  config?: PrismaConfig,
) {
  try {
    const targetApp = backend === "self" ? "apps/web" : "apps/server";
    const envPath = path.join(projectDir, targetApp, ".env");
    const variables: EnvVariable[] = [
      {
        key: "DATABASE_URL",
        value:
          config?.databaseUrl ?? "postgresql://postgres:postgres@localhost:5432/mydb?schema=public",
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
  } catch {
    log.error("Failed to update environment configuration");
  }
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
  options: PrismaPostgresSetupOptions = {},
) {
  const { packageManager, projectDir, backend } = config;
  const mode = options.mode ?? "auto";
  const region = options.region ?? DEFAULT_REGION;
  const dbDir = path.join(projectDir, "packages/db");

  try {
    await fs.ensureDir(dbDir);

    if (mode === "manual") {
      await writeEnvFile(projectDir, backend);
      displayManualSetupInstructions(backend === "self" ? "apps/web" : "apps/server");
      return;
    }

    const prismaConfig = await setupWithCreateDb(dbDir, packageManager, region);

    if (prismaConfig) {
      await writeEnvFile(projectDir, backend, prismaConfig);

      log.success("Prisma Postgres database configured successfully!");

      if (prismaConfig.claimUrl) {
        log.info(pc.blue(`Claim URL saved to .env: ${prismaConfig.claimUrl}`));
      }
    } else {
      await writeEnvFile(projectDir, backend);
      displayManualSetupInstructions(backend === "self" ? "apps/web" : "apps/server");
    }
  } catch (error) {
    log.error(
      `Error during Prisma Postgres setup: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );

    try {
      await writeEnvFile(projectDir, backend);
      displayManualSetupInstructions(backend === "self" ? "apps/web" : "apps/server");
    } catch {}

    log.info("Setup completed with manual configuration required.");
  }
}
