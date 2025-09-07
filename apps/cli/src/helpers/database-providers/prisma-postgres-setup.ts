import path from "node:path";
import { isCancel, log, select, spinner, text } from "@clack/prompts";
import { consola } from "consola";
import { execa } from "execa";
import fs from "fs-extra";
import pc from "picocolors";
import type { ORM, PackageManager, ProjectConfig } from "../../types";
import { addPackageDependency } from "../../utils/add-package-deps";
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
	orm: ORM,
) {
	try {
		log.info(
			"Starting Prisma Postgres setup with create-db. Please follow the instructions below:",
		);

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

		const databaseUrl =
			orm === "drizzle"
				? createDbResponse.directConnectionString
				: createDbResponse.connectionString;

		return {
			databaseUrl,
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

		log.info(
			"Starting Prisma PostgreSQL setup. Please follow the instructions below:",
		);

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
				"Please copy the Prisma Postgres URL from the output above.\nIt looks like: prisma+postgres://accelerate.prisma-data.net/?api_key=...",
			),
		);

		const databaseUrl = await text({
			message: "Paste your Prisma Postgres database URL:",
			validate(value) {
				if (!value) return "Please enter a database URL";
				if (!value.startsWith("prisma+postgres://")) {
					return "URL should start with prisma+postgres://";
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

async function writeEnvFile(projectDir: string, config?: PrismaConfig) {
	try {
		const envPath = path.join(projectDir, "apps/server", ".env");
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

async function addDotenvImportToPrismaConfig(projectDir: string) {
	try {
		const prismaConfigPath = path.join(
			projectDir,
			"apps/server/prisma.config.ts",
		);
		let content = await fs.readFile(prismaConfigPath, "utf8");
		content = `import "dotenv/config";\n${content}`;
		await fs.writeFile(prismaConfigPath, content);
	} catch (_error) {
		consola.error("Failed to update prisma.config.ts");
	}
}

function displayManualSetupInstructions() {
	log.info(`Manual Prisma PostgreSQL Setup Instructions:

1. Visit https://console.prisma.io and create an account
2. Create a new PostgreSQL database from the dashboard
3. Get your database URL
4. Add the database URL to the .env file in apps/server/.env

DATABASE_URL="your_database_url"`);
}

async function addPrismaAccelerateExtension(serverDir: string) {
	try {
		await addPackageDependency({
			dependencies: ["@prisma/extension-accelerate"],
			projectDir: serverDir,
		});

		const prismaIndexPath = path.join(serverDir, "prisma/index.ts");
		const prismaIndexContent = `
import { PrismaClient } from "./generated/client";
import { withAccelerate } from "@prisma/extension-accelerate";

const prisma = new PrismaClient().$extends(withAccelerate());

export default prisma;
`;
		await fs.writeFile(prismaIndexPath, prismaIndexContent.trim());

		const dbFilePath = path.join(serverDir, "src/db/index.ts");
		if (await fs.pathExists(dbFilePath)) {
			let dbFileContent = await fs.readFile(dbFilePath, "utf8");

			if (!dbFileContent.includes("@prisma/extension-accelerate")) {
				dbFileContent = `import { withAccelerate } from "@prisma/extension-accelerate";\n${dbFileContent}`;

				dbFileContent = dbFileContent.replace(
					"export const db = new PrismaClient();",
					"export const db = new PrismaClient().$extends(withAccelerate());",
				);

				await fs.writeFile(dbFilePath, dbFileContent);
			}
		}
		return true;
	} catch (_error) {
		log.warn(
			pc.yellow("Could not add Prisma Accelerate extension automatically"),
		);
		return false;
	}
}

export async function setupPrismaPostgres(config: ProjectConfig) {
	const { packageManager, projectDir, orm } = config;
	const serverDir = path.join(projectDir, "apps/server");

	try {
		await fs.ensureDir(serverDir);

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
			await writeEnvFile(projectDir);
			displayManualSetupInstructions();
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
			prismaConfig = await setupWithCreateDb(serverDir, packageManager, orm);
		} else {
			prismaConfig = await initPrismaDatabase(serverDir, packageManager);
		}

		if (prismaConfig) {
			await writeEnvFile(projectDir, prismaConfig);

			if (orm === "prisma") {
				await addDotenvImportToPrismaConfig(projectDir);
				await addPrismaAccelerateExtension(serverDir);
			}

			const connectionType =
				orm === "drizzle" ? "direct connection" : "Prisma Accelerate";
			log.success(
				pc.green(
					`Prisma Postgres database configured successfully with ${connectionType}!`,
				),
			);

			if (prismaConfig.claimUrl) {
				log.info(pc.blue(`Claim URL saved to .env: ${prismaConfig.claimUrl}`));
			}
		} else {
			await writeEnvFile(projectDir);
			displayManualSetupInstructions();
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
			await writeEnvFile(projectDir);
			displayManualSetupInstructions();
		} catch {}

		log.info("Setup completed with manual configuration required.");
	}
}
