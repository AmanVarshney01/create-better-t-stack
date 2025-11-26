import path from "node:path";
import { isCancel, log, select, spinner } from "@clack/prompts";
import { consola } from "consola";
import { execa } from "execa";
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
) {
	try {
		log.info("Starting Prisma Postgres setup with create-db.");

		const selectedRegion = await select({
			message: "Select your preferred region:",
			options: AVAILABLE_REGIONS,
			initialValue: "ap-southeast-1",
		});

		if (isCancel(selectedRegion)) return null;

		const createDbCommand = getPackageExecutionCommand(
			packageManager,
			`create-db@latest --json --region ${selectedRegion}`,
		);

		const s = spinner();
		s.start("Creating Prisma Postgres database...");

		const { stdout } = await execa(createDbCommand, {
			cwd: serverDir,
			shell: true,
		});

		s.stop("Database created successfully!");

		let createDbResponse: CreateDbResponse;
		try {
			createDbResponse = JSON.parse(stdout) as CreateDbResponse;
		} catch {
			consola.error("Failed to parse create-db response");
			return null;
		}

		return {
			databaseUrl: createDbResponse.connectionString,
			claimUrl: createDbResponse.claimUrl,
		};
	} catch (error) {
		if (error instanceof Error) {
			consola.error(error.message);
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
	} catch (_error) {
		consola.error("Failed to update environment configuration");
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
	cliInput?: { manualDb?: boolean },
) {
	const { packageManager, projectDir, backend } = config;
	const manualDb = cliInput?.manualDb ?? false;
	const dbDir = path.join(projectDir, "packages/db");

	try {
		await fs.ensureDir(dbDir);

		if (manualDb) {
			await writeEnvFile(projectDir, backend);
			displayManualSetupInstructions(
				backend === "self" ? "apps/web" : "apps/server",
			);
			return;
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

		if (isCancel(setupMode)) return;

		if (setupMode === "manual") {
			await writeEnvFile(projectDir, backend);
			displayManualSetupInstructions(
				backend === "self" ? "apps/web" : "apps/server",
			);
			return;
		}

		const prismaConfig = await setupWithCreateDb(dbDir, packageManager);

		if (prismaConfig) {
			await writeEnvFile(projectDir, backend, prismaConfig);

			log.success(
				pc.green("Prisma Postgres database configured successfully!"),
			);

			if (prismaConfig.claimUrl) {
				log.info(pc.blue(`Claim URL saved to .env: ${prismaConfig.claimUrl}`));
			}
		} else {
			await writeEnvFile(projectDir, backend);
			displayManualSetupInstructions(
				backend === "self" ? "apps/web" : "apps/server",
			);
		}
	} catch (error) {
		consola.error(
			pc.red(
				`Error during Prisma Postgres setup: ${
					error instanceof Error ? error.message : String(error)
				}`,
			),
		);

		try {
			await writeEnvFile(projectDir, backend);
			displayManualSetupInstructions(
				backend === "self" ? "apps/web" : "apps/server",
			);
		} catch {}

		log.info("Setup completed with manual configuration required.");
	}
}
