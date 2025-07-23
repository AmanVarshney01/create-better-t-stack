import path from "node:path";
import { cancel, isCancel, log, spinner, text } from "@clack/prompts";
import consola from "consola";
import { execa } from "execa";
import fs from "fs-extra";
import pc from "picocolors";
import type { ProjectConfig } from "../../types";
import { commandExists } from "../../utils/command-exists";
import {
	addEnvVariablesToFile,
	type EnvVariable,
} from "../project-generation/env-setup";

type MongoDBConfig = {
	connectionString: string;
};

async function checkAtlasCLI() {
	const s = spinner();
	s.start("Checking for MongoDB Atlas CLI...");

	try {
		const exists = await commandExists("atlas");
		s.stop(
			exists
				? "MongoDB Atlas CLI found"
				: pc.yellow("MongoDB Atlas CLI not found"),
		);
		return exists;
	} catch (_error) {
		s.stop(pc.red("Error checking MongoDB Atlas CLI"));
		return false;
	}
}

async function initMongoDBAtlas(
	serverDir: string,
): Promise<MongoDBConfig | null> {
	try {
		const hasAtlas = await checkAtlasCLI();

		if (!hasAtlas) {
			consola.error(pc.red("MongoDB Atlas CLI not found."));
			log.info(
				pc.yellow(
					"Please install it from: https://www.mongodb.com/docs/atlas/cli/current/install-atlas-cli/",
				),
			);
			return null;
		}

		log.info(pc.blue("Running MongoDB Atlas setup..."));

		await execa("atlas", ["deployments", "setup"], {
			cwd: serverDir,
			stdio: "inherit",
		});

		log.info(pc.green("MongoDB Atlas deployment ready"));

		const connectionString = await text({
			message: "Enter your MongoDB connection string:",
			placeholder:
				"mongodb+srv://username:password@cluster.mongodb.net/database",
			validate(value) {
				if (!value) return "Please enter a connection string";
				if (!value.startsWith("mongodb")) {
					return "URL should start with mongodb:// or mongodb+srv://";
				}
			},
		});

		if (isCancel(connectionString)) {
			cancel("MongoDB setup cancelled");
			return null;
		}

		return {
			connectionString: connectionString as string,
		};
	} catch (error) {
		if (error instanceof Error) {
			consola.error(pc.red(error.message));
		}
		return null;
	}
}

async function writeEnvFile(projectDir: string, config?: MongoDBConfig) {
	try {
		const envPath = path.join(projectDir, "apps/server", ".env");
		const variables: EnvVariable[] = [
			{
				key: "DATABASE_URL",
				value: config?.connectionString ?? "mongodb://localhost:27017/mydb",
				condition: true,
			},
		];
		await addEnvVariablesToFile(envPath, variables);
	} catch (_error) {
		consola.error("Failed to update environment configuration");
	}
}

function displayManualSetupInstructions() {
	log.info(`
${pc.green("MongoDB Atlas Manual Setup Instructions:")}

1. Install Atlas CLI:
   ${pc.blue(
			"https://www.mongodb.com/docs/atlas/cli/stable/install-atlas-cli/",
		)}

2. Run the following command and follow the prompts:
   ${pc.blue("atlas deployments setup")}

3. Get your connection string from the Atlas dashboard:
   Format: ${pc.dim(
			"mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/DATABASE_NAME",
		)}

4. Add the connection string to your .env file:
   ${pc.dim('DATABASE_URL="your_connection_string"')}
`);
}

export async function setupMongoDBAtlas(config: ProjectConfig) {
	const { projectDir } = config;
	const mainSpinner = spinner();
	mainSpinner.start("Setting up MongoDB Atlas...");

	const serverDir = path.join(projectDir, "apps/server");
	try {
		await fs.ensureDir(serverDir);

		mainSpinner.stop("MongoDB Atlas setup ready");

		const config = await initMongoDBAtlas(serverDir);

		if (config) {
			await writeEnvFile(projectDir, config);
			log.success(
				pc.green(
					"MongoDB Atlas setup complete! Connection saved to .env file.",
				),
			);
		} else {
			log.warn(pc.yellow("Falling back to local MongoDB configuration"));
			await writeEnvFile(projectDir);
			displayManualSetupInstructions();
		}
	} catch (error) {
		mainSpinner.stop(pc.red("MongoDB Atlas setup failed"));
		consola.error(
			pc.red(
				`Error during MongoDB Atlas setup: ${
					error instanceof Error ? error.message : String(error)
				}`,
			),
		);

		try {
			await writeEnvFile(projectDir);
			displayManualSetupInstructions();
		} catch {}
	}
}
