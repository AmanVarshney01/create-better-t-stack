import path from "node:path";
import { cancel, isCancel, log, select, text } from "@clack/prompts";
import { consola } from "consola";
import { execa } from "execa";
import fs from "fs-extra";
import pc from "picocolors";
import type { ORM, PackageManager, ProjectConfig } from "../../types";
import { addPackageDependency } from "../../utils/add-package-deps";
import { getPackageExecutionCommand } from "../../utils/package-runner";
import {
	addEnvVariablesToFile,
	type EnvVariable,
} from "../project-generation/env-setup";

type PrismaConfig = {
	databaseUrl: string;
};

async function setupWithCreateDb(
	serverDir: string,
	packageManager: PackageManager,
	orm: ORM,
) {
	try {
		log.info(
			"Starting Prisma Postgres setup. Please follow the instructions below:",
		);

		const createDbCommand = getPackageExecutionCommand(
			packageManager,
			"create-db@latest -i",
		);

		await execa(createDbCommand, {
			cwd: serverDir,
			stdio: "inherit",
			shell: true,
		});

		log.info(
			orm === "drizzle"
				? pc.yellow(
						"Please copy the database URL from the output above and append ?sslmode=require for Drizzle.",
					)
				: pc.yellow(
						"Please copy the Prisma Postgres URL from the output above.",
					),
		);

		const databaseUrl = await text({
			message:
				orm === "drizzle"
					? "Paste your database URL (append ?sslmode=require for Drizzle):"
					: "Paste your Prisma Postgres database URL:",
			validate(value) {
				if (!value) return "Please enter a database URL";
				if (orm === "drizzle" && !value.includes("?sslmode=require")) {
					return "Please append ?sslmode=require to your database URL when using Drizzle";
				}
			},
		});

		if (isCancel(databaseUrl)) {
			cancel("Database setup cancelled");
			return null;
		}

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

		if (isCancel(databaseUrl)) {
			cancel("Database setup cancelled");
			return null;
		}

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

		if (isCancel(setupMethod)) {
			cancel(pc.red("Operation cancelled"));
			process.exit(0);
		}

		let prismaConfig: PrismaConfig | null = null;

		if (setupMethod === "create-db") {
			prismaConfig = await setupWithCreateDb(serverDir, packageManager, orm);
		} else {
			prismaConfig = await initPrismaDatabase(serverDir, packageManager);
		}

		if (prismaConfig) {
			await writeEnvFile(projectDir, prismaConfig);

			await addDotenvImportToPrismaConfig(projectDir);

			if (orm === "prisma") {
				await addPrismaAccelerateExtension(serverDir);
			}
			log.success(
				pc.green("Prisma Postgres database configured successfully!"),
			);
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
