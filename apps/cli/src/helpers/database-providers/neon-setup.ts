import path from "node:path";
import { cancel, isCancel, log, select, spinner, text } from "@clack/prompts";
import { consola } from "consola";
import { execa } from "execa";
import fs from "fs-extra";
import pc from "picocolors";
import type { PackageManager, ProjectConfig } from "../../types";
import { getPackageExecutionCommand } from "../../utils/get-package-execution-command";
import {
	type EnvVariable,
	addEnvVariablesToFile,
} from "../project-generation/env-setup";

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

const NEON_REGIONS: NeonRegion[] = [
	{ label: "AWS US East (N. Virginia)", value: "aws-us-east-1" },
	{ label: "AWS US East (Ohio)", value: "aws-us-east-2" },
	{ label: "AWS US West (Oregon)", value: "aws-us-west-2" },
	{ label: "AWS Europe (Frankfurt)", value: "aws-eu-central-1" },
	{ label: "AWS Asia Pacific (Singapore)", value: "aws-ap-southeast-1" },
	{ label: "AWS Asia Pacific (Sydney)", value: "aws-ap-southeast-2" },
	{ label: "Azure East US 2 region (Virginia)", value: "azure-eastus2" },
];

async function executeNeonCommand(
	packageManager: PackageManager,
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
		if (spinnerText)
			s.stop(
				pc.green(spinnerText.replace("...", "").replace("ing ", "ed ").trim()),
			);
		return result;
	} catch (error) {
		if (s) s.stop(pc.red(`Failed: ${spinnerText || "Command execution"}`));
		throw error;
	}
}

async function isNeonAuthenticated(packageManager: PackageManager) {
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

async function authenticateWithNeon(packageManager: PackageManager) {
	try {
		await executeNeonCommand(
			packageManager,
			"neonctl auth",
			"Authenticating with Neon...",
		);
		return true;
	} catch (_error) {
		consola.error(pc.red("Failed to authenticate with Neon"));
	}
}

async function createNeonProject(
	projectName: string,
	regionId: string,
	packageManager: PackageManager,
) {
	try {
		const commandArgsString = `neonctl projects create --name ${projectName} --region-id ${regionId} --output json`;
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
	} catch (_error) {
		consola.error(pc.red("Failed to create Neon project"));
	}
}

async function writeEnvFile(projectDir: string, config?: NeonConfig) {
	const envPath = path.join(projectDir, "apps/server", ".env");
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

export async function setupNeonPostgres(config: ProjectConfig): Promise<void> {
	const { packageManager, projectDir } = config;
	const setupSpinner = spinner();
	setupSpinner.start("Checking Neon authentication...");

	try {
		const isAuthenticated = await isNeonAuthenticated(packageManager);

		setupSpinner.stop("Neon authentication checked");

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

		const regionId = await select({
			message: "Select a region for your Neon project:",
			options: NEON_REGIONS,
			initialValue: NEON_REGIONS[0].value,
		});

		if (isCancel(projectName) || isCancel(regionId)) {
			cancel(pc.red("Operation cancelled"));
			process.exit(0);
		}

		const config = await createNeonProject(
			projectName as string,
			regionId,
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

		finalSpinner.stop("Neon database configured!");
	} catch (error) {
		setupSpinner.stop(pc.red("Neon authentication check failed"));

		if (error instanceof Error) {
			consola.error(pc.red(error.message));
		}

		await writeEnvFile(projectDir);
		displayManualSetupInstructions();
	}
}
