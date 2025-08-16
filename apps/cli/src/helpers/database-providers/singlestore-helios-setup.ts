import path from "node:path";
import { log } from "@clack/prompts";
import fs from "fs-extra";
import pc from "picocolors";
import type { ProjectConfig } from "../../types";
import {
	addEnvVariablesToFile,
	type EnvVariable,
} from "../project-generation/env-setup";

type SingleStoreHeliosConfig = {
	connectionString: string;
};

async function writeEnvFile(
	projectDir: string,
	config?: SingleStoreHeliosConfig,
) {
	try {
		const envPath = path.join(projectDir, "apps/server", ".env");
		const variables: EnvVariable[] = [
			{
				key: "DATABASE_URL",
				value:
					config?.connectionString ??
					"singlestore://username:password@host:port/database?ssl=require",
				condition: true,
			},
		];
		await addEnvVariablesToFile(envPath, variables);
	} catch (_error) {
		log.error("Failed to update environment configuration");
	}
}

function displayManualSetupInstructions() {
	log.info(`
${pc.green("SingleStore Helios Manual Setup Instructions:")}

1. Sign up for SingleStore Cloud at:
   ${pc.blue("https://www.singlestore.com/cloud")}

2. Create a new workspace from the dashboard

3. Get your connection string from the workspace details:
   Format: ${pc.dim("singlestore://USERNAME:PASSWORD@HOST:PORT/DATABASE?ssl={}")}

4. Add the connection string to your .env file:
   ${pc.dim('DATABASE_URL="your_connection_string"')}

${pc.yellow("Important:")} 
- The connection string MUST include ${pc.bold("ssl={}")} at the end
- Use the singlestore:// protocol for SingleStore connections
- SingleStore requires SSL connections for cloud deployments`);
}

export async function setupSingleStoreHelios(config: ProjectConfig) {
	const { projectDir } = config;

	try {
		const serverDir = path.join(projectDir, "apps/server");
		await fs.ensureDir(serverDir);

		// For now, we'll create a default .env with placeholder values
		// In the future, this could integrate with SingleStore CLI if available
		await writeEnvFile(projectDir);

		log.success(
			pc.green(
				"SingleStore Helios setup complete! Please update the connection string in .env file.",
			),
		);

		displayManualSetupInstructions();
	} catch (error) {
		log.error(pc.red("SingleStore Helios setup failed"));
		if (error instanceof Error) {
			log.error(pc.red(error.message));
		}

		try {
			await writeEnvFile(projectDir);
			displayManualSetupInstructions();
		} catch {}
	}
}
