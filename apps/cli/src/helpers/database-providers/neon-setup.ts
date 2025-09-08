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
	{ label: "AWS South America East 1 (São Paulo)", value: "aws-sa-east-1" },
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

async function setupWithNeonDb(
	projectDir: string,
	packageManager: PackageManager,
) {
	try {
		const s = spinner();
		s.start("Creating Neon database using neondb...");

		const serverDir = path.join(projectDir, "apps/server");
		await fs.ensureDir(serverDir);

		const packageCmd = getPackageExecutionCommand(
			packageManager,
			"neondb --yes",
		);

		await execa(packageCmd, {
			shell: true,
			cwd: serverDir,
		});

		s.stop(pc.green("Neon database created successfully!"));

		return true;
	} catch (error) {
		consola.error(pc.red("Failed to create database with neondb"));
		throw error;
	}
}

function displayManualSetupInstructions() {
	log.info(`Manual Neon PostgreSQL Setup Instructions:

1. Visit https://neon.tech and create an account
2. Create a new project from the dashboard
3. Get your connection string
4. Add the database URL to the .env file in apps/server/.env

DATABASE_URL="your_connection_string"`);
}

export async function setupNeonPostgres(config: ProjectConfig) {
	const { packageManager, projectDir } = config;

	try {
		const mode = await select({
			message: "Neon setup: choose mode",
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

		const setupMethod = await select({
			message: "Choose your Neon setup method:",
			options: [
				{
					label: "Quick setup with neondb",
					value: "neondb",
					hint: "fastest, no auth required",
				},
				{
					label: "Custom setup with neonctl",
					value: "neonctl",
					hint: "More control - choose project name and region",
				},
			],
			initialValue: "neondb",
		});

		if (isCancel(setupMethod)) return exitCancelled("Operation cancelled");

		if (setupMethod === "neondb") {
			await setupWithNeonDb(projectDir, packageManager);
		} else {
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

			if (isCancel(projectName) || isCancel(regionId))
				return exitCancelled("Operation cancelled");

			const neonConfig = await createNeonProject(
				projectName as string,
				regionId,
				packageManager,
			);

			if (!neonConfig) {
				throw new Error(
					"Failed to create project - couldn't get connection information",
				);
			}

			const finalSpinner = spinner();
			finalSpinner.start("Configuring database connection");

			await fs.ensureDir(path.join(projectDir, "apps/server"));
			await writeEnvFile(projectDir, neonConfig);

			finalSpinner.stop("Neon database configured!");
		}
	} catch (error) {
		if (error instanceof Error) {
			consola.error(pc.red(error.message));
		}

		await writeEnvFile(projectDir);
		displayManualSetupInstructions();
	}
}
