import path from "node:path";
import { cancel, isCancel, log, spinner, text } from "@clack/prompts";
import { consola } from "consola";
import { execa } from "execa";
import fs from "fs-extra";
import pc from "picocolors";
import type { ProjectPackageManager } from "../types";
import { getPackageExecutionCommand } from "../utils/get-package-execution-command";

type NeonConfig = {
	connectionString: string;
	projectId: string;
	dbName: string;
	roleName: string;
};

async function executeNeonCommand(
	packageManager: ProjectPackageManager,
	commandArgsString: string,
	spinnerText?: string,
) {
	const s = spinner();
	try {
		const fullCommand = getPackageExecutionCommand(
			packageManager,
			commandArgsString,
		);

		if (spinnerText) s.start(spinnerText);
		const result = await execa(fullCommand, { shell: true });
		if (spinnerText) s.stop(pc.green("Completed"));
		return result;
	} catch (error) {
		if (s) s.stop(pc.red(`Failed: ${spinnerText}`));
		throw error;
	}
}

async function isNeonAuthenticated(packageManager: ProjectPackageManager) {
	try {
		const commandArgsString = "neonctl projects list";
		const result = await executeNeonCommand(packageManager, commandArgsString);
		return (
			!result.stdout.includes("not authenticated") &&
			!result.stdout.includes("error")
		);
	} catch {
		return false;
	}
}

async function authenticateWithNeon(packageManager: ProjectPackageManager) {
	try {
		await executeNeonCommand(
			packageManager,
			"neonctl auth",
			"Authenticating with Neon...",
		);
		log.success("Authenticated with Neon successfully!");
		return true;
	} catch (error) {
		consola.error(pc.red("Failed to authenticate with Neon"));
	}
}

async function createNeonProject(
	projectName: string,
	packageManager: ProjectPackageManager,
) {
	try {
		const commandArgsString = `neonctl projects create --name "${projectName}" --output json`;
		const { stdout } = await executeNeonCommand(
			packageManager,
			commandArgsString,
			`Creating Neon project "${projectName}"...`,
		);

		const response = JSON.parse(stdout);

		if (
			response.project &&
			response.connection_uris &&
			response.connection_uris.length > 0
		) {
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
		consola.error(
			pc.red("Failed to extract connection information from response"),
		);
		return null;
	} catch (error) {
		consola.error(pc.red("Failed to create Neon project"));
	}
}

async function writeEnvFile(projectDir: string, config?: NeonConfig) {
	const envPath = path.join(projectDir, "apps/server", ".env");
	const envContent = config
		? `DATABASE_URL="${config.connectionString}"`
		: `DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mydb?schema=public"`;

	await fs.ensureDir(path.dirname(envPath));
	await fs.writeFile(envPath, envContent);

	return true;
}

function displayManualSetupInstructions() {
	log.info(`Manual Neon PostgreSQL Setup Instructions:

1. Visit https://neon.tech and create an account
2. Create a new project from the dashboard
3. Get your connection string
4. Add the database URL to the .env file in apps/server/.env

DATABASE_URL="your_connection_string"`);
}

import type { ProjectConfig } from "../types";

export async function setupNeonPostgres(config: ProjectConfig): Promise<void> {
	const { projectName, packageManager } = config;
	const projectDir = path.resolve(process.cwd(), projectName);
	const setupSpinner = spinner();
	setupSpinner.start("Setting up Neon PostgreSQL");

	try {
		const isAuthenticated = await isNeonAuthenticated(packageManager);

		setupSpinner.stop("Setting up Neon PostgreSQL");

		if (!isAuthenticated) {
			log.info("Please authenticate with Neon to continue:");
			await authenticateWithNeon(packageManager);
		}

		const suggestedProjectName = path.basename(projectDir);
		const projectName = await text({
			message: "Enter a name for your Neon project:",
			defaultValue: suggestedProjectName,
			initialValue: suggestedProjectName,
		});

		if (isCancel(projectName)) {
			cancel(pc.red("Operation cancelled"));
			process.exit(0);
		}

		const config = await createNeonProject(
			projectName as string,
			packageManager,
		);

		if (!config) {
			throw new Error(
				"Failed to create project - couldn't get connection information",
			);
		}

		const finalSpinner = spinner();
		finalSpinner.start("Configuring database connection");

		await fs.ensureDir(path.join(projectDir, "apps/server"));
		await writeEnvFile(projectDir, config);

		finalSpinner.stop("Neon database configured successfully!");
	} catch (error) {
		setupSpinner.stop(pc.red("Neon PostgreSQL setup failed"));

		if (error instanceof Error) {
			consola.error(pc.red(error.message));
		}

		await writeEnvFile(projectDir);
		displayManualSetupInstructions();
	}
}
