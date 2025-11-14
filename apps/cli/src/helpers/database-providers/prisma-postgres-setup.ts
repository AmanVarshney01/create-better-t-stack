import path from "node:path";
import { isCancel, log, select, spinner, text } from "@clack/prompts";
import { consola } from "consola";
import { execa } from "execa";
import fs from "fs-extra";
import pc from "picocolors";
import type { PackageManager, ProjectConfig } from "../../types";
import { exitCancelled } from "../../utils/errors";
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

async function initPrismaDatabase(
	serverDir: string,
	packageManager: PackageManager,
) {
	try {
		const prismaDir = path.join(serverDir, "prisma");
		await fs.ensureDir(prismaDir);

		log.info("Starting Prisma PostgreSQL setup.");

		const prismaInitCommand = getPackageExecutionCommand(
			packageManager,
			"prisma init --db",
		);

		await execa(prismaInitCommand, {
			cwd: serverDir,
			stdio: "inherit",
			shell: true,
		});

		log.info(
			pc.yellow(
				"Please copy the Prisma Postgres URL.\nIt looks like: postgresql://user:password@host:5432/db?sslmode=require",
			),
		);

		const databaseUrl = await text({
			message: "Paste your Prisma Postgres database URL:",
			validate(value) {
				if (!value) return "Please enter a database URL";
				if (!value.startsWith("postgresql://")) {
					return "URL should start with postgresql://";
				}
			},
		});

		if (isCancel(databaseUrl)) return null;

		return {
			databaseUrl: databaseUrl as string,
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

async function addDotenvImportToPrismaConfig(
	projectDir: string,
	backend: ProjectConfig["backend"],
) {
	try {
		const prismaConfigPath = path.join(
			projectDir,
			"packages/db/prisma.config.ts",
		);
		let content = await fs.readFile(prismaConfigPath, "utf8");
		const envPath =
			backend === "self" ? "../../apps/web/.env" : "../../apps/server/.env";
		content = `import dotenv from "dotenv";\ndotenv.config({ path: "${envPath}" });\n${content}`;
		await fs.writeFile(prismaConfigPath, content);
	} catch (_error) {
		consola.error("Failed to update prisma.config.ts");
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
	const { packageManager, projectDir, orm, backend } = config;
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

		const mode = await select({
			message: "Prisma Postgres setup: choose mode",
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

		if (isCancel(mode)) return exitCancelled("Operation cancelled");

		if (mode === "manual") {
			await writeEnvFile(projectDir, backend);
			displayManualSetupInstructions(
				backend === "self" ? "apps/web" : "apps/server",
			);
			return;
		}

		const setupOptions = [
			{
				label: "Quick setup with create-db",
				value: "create-db",
				hint: "Fastest, automated database creation (no auth)",
			},
		];

		if (orm === "prisma") {
			setupOptions.push({
				label: "Custom setup with Prisma Init",
				value: "custom",
				hint: "More control (requires auth)",
			});
		}

		const setupMethod = await select({
			message: "Choose your Prisma Postgres setup method:",
			options: setupOptions,
			initialValue: "create-db",
		});

		if (isCancel(setupMethod)) return exitCancelled("Operation cancelled");

		let prismaConfig: PrismaConfig | null = null;

		if (setupMethod === "create-db") {
			prismaConfig = await setupWithCreateDb(dbDir, packageManager);
		} else {
			prismaConfig = await initPrismaDatabase(dbDir, packageManager);
		}

		if (prismaConfig) {
			await writeEnvFile(projectDir, backend, prismaConfig);

			if (orm === "prisma") {
				await addDotenvImportToPrismaConfig(projectDir, backend);
			}

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
