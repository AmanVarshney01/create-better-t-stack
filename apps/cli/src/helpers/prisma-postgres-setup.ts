import path from "node:path";
import { cancel, isCancel, log, password, spinner } from "@clack/prompts";
import { consola } from "consola";
import { execa } from "execa";
import fs from "fs-extra";
import pc from "picocolors";
import type { ProjectPackageManager } from "../types";
import { addPackageDependency } from "../utils/add-package-deps";
import { getPackageExecutionCommand } from "../utils/get-package-execution-command";

type PrismaConfig = {
	databaseUrl: string;
};

async function initPrismaDatabase(
	serverDir: string,
	packageManager: ProjectPackageManager,
): Promise<PrismaConfig | null> {
	const s = spinner();
	try {
		s.start("Initializing Prisma PostgreSQL");

		const prismaDir = path.join(serverDir, "prisma");
		await fs.ensureDir(prismaDir);

		s.stop("Initializing Prisma. Follow the prompts below:");

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

		const databaseUrl = await password({
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
		s.stop(pc.red("Failed to initialize Prisma PostgreSQL"));
		if (error instanceof Error) {
			consola.error(error.message);
		}
		return null;
	}
}

async function writeEnvFile(projectDir: string, config?: PrismaConfig) {
	try {
		const envPath = path.join(projectDir, "apps/server", ".env");
		await fs.ensureDir(path.dirname(envPath));

		let envContent = "";
		if (await fs.pathExists(envPath)) {
			envContent = await fs.readFile(envPath, "utf8");
		}

		const databaseUrlLine = config
			? `DATABASE_URL="${config.databaseUrl}"`
			: `DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mydb?schema=public"`;

		if (!envContent.includes("DATABASE_URL=")) {
			envContent += `\n${databaseUrlLine}`;
		} else {
			envContent = envContent.replace(
				/DATABASE_URL=.*(\r?\n|$)/,
				`${databaseUrlLine}$1`,
			);
		}

		await fs.writeFile(envPath, envContent.trim());
	} catch (error) {
		consola.error("Failed to update environment configuration");
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
	} catch (error) {
		log.warn(
			pc.yellow("Could not add Prisma Accelerate extension automatically"),
		);
		return false;
	}
}

import type { ProjectConfig } from "../types";

export async function setupPrismaPostgres(config: ProjectConfig) {
	const { projectName, packageManager } = config;
	const projectDir = path.resolve(process.cwd(), projectName);
	const serverDir = path.join(projectDir, "apps/server");
	const s = spinner();
	s.start("Setting up Prisma PostgreSQL");

	try {
		await fs.ensureDir(serverDir);

		s.stop("Starting Prisma setup");

		const config = await initPrismaDatabase(serverDir, packageManager);

		if (config) {
			await writeEnvFile(projectDir, config);
			await addPrismaAccelerateExtension(serverDir);
			log.success(
				pc.green("Prisma PostgreSQL database configured successfully!"),
			);
		} else {
			const fallbackSpinner = spinner();
			fallbackSpinner.start("Setting up fallback configuration");
			await writeEnvFile(projectDir);
			fallbackSpinner.stop("Manual setup required");
			displayManualSetupInstructions();
		}
	} catch (error) {
		s.stop(pc.red("Prisma PostgreSQL setup failed"));
		consola.error(
			pc.red(
				`Error during Prisma PostgreSQL setup: ${
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
