import path from "node:path";
import { log } from "@clack/prompts";
import { consola } from "consola";
import { type ExecaError, execa } from "execa";
import fs from "fs-extra";
import pc from "picocolors";
import type { PackageManager, ProjectConfig } from "../../types";
import { getPackageExecutionCommand } from "../../utils/package-runner";
import {
	addEnvVariablesToFile,
	type EnvVariable,
} from "../project-generation/env-setup";

async function writeSupabaseEnvFile(projectDir: string, databaseUrl: string) {
	try {
		const envPath = path.join(projectDir, "apps/server", ".env");
		const dbUrlToUse =
			databaseUrl || "postgresql://postgres:postgres@127.0.0.1:54322/postgres";
		const variables: EnvVariable[] = [
			{
				key: "DATABASE_URL",
				value: dbUrlToUse,
				condition: true,
			},
			{
				key: "DIRECT_URL",
				value: dbUrlToUse,
				condition: true,
			},
		];
		await addEnvVariablesToFile(envPath, variables);
		return true;
	} catch (error) {
		consola.error(pc.red("Failed to update .env file for Supabase."));
		if (error instanceof Error) {
			consola.error(error.message);
		}
		return false;
	}
}

function extractDbUrl(output: string): string | null {
	const dbUrlMatch = output.match(/DB URL:\s*(postgresql:\/\/[^\s]+)/);
	const url = dbUrlMatch?.[1];
	if (url) {
		return url;
	}
	return null;
}

async function initializeSupabase(
	serverDir: string,
	packageManager: PackageManager,
) {
	log.info("Initializing Supabase project...");
	try {
		const supabaseInitCommand = getPackageExecutionCommand(
			packageManager,
			"supabase init",
		);
		await execa(supabaseInitCommand, {
			cwd: serverDir,
			stdio: "inherit",
			shell: true,
		});
		log.success("Supabase project initialized");
		return true;
	} catch (error) {
		consola.error(pc.red("Failed to initialize Supabase project."));
		if (error instanceof Error) {
			consola.error(error.message);
		} else {
			consola.error(String(error));
		}
		if (error instanceof Error && error.message.includes("ENOENT")) {
			log.error(
				pc.red(
					"Supabase CLI not found. Please install it globally or ensure it's in your PATH.",
				),
			);
			log.info("You can install it using: npm install -g supabase");
		}
		return false;
	}
}

async function startSupabase(
	serverDir: string,
	packageManager: PackageManager,
) {
	log.info("Starting Supabase services (this may take a moment)...");
	const supabaseStartCommand = getPackageExecutionCommand(
		packageManager,
		"supabase start",
	);
	try {
		const subprocess = execa(supabaseStartCommand, {
			cwd: serverDir,
			shell: true,
		});

		let stdoutData = "";

		if (subprocess.stdout) {
			subprocess.stdout.on("data", (data) => {
				const text = data.toString();
				process.stdout.write(text);
				stdoutData += text;
			});
		}

		if (subprocess.stderr) {
			subprocess.stderr.pipe(process.stderr);
		}

		await subprocess;

		await new Promise((resolve) => setTimeout(resolve, 100));

		return stdoutData;
	} catch (error) {
		consola.error(pc.red("Failed to start Supabase services."));
		const execaError = error as ExecaError;
		if (execaError?.message) {
			consola.error(`Error details: ${execaError.message}`);
			if (execaError.message.includes("Docker is not running")) {
				log.error(
					pc.red("Docker is not running. Please start Docker and try again."),
				);
			}
		} else {
			consola.error(String(error));
		}
		return null;
	}
}

function displayManualSupabaseInstructions(output?: string | null) {
	log.info(
		`"Manual Supabase Setup Instructions:"
1. Ensure Docker is installed and running.
2. Install the Supabase CLI (e.g., \`npm install -g supabase\`).
3. Run \`supabase init\` in your project's \`apps/server\` directory.
4. Run \`supabase start\` in your project's \`apps/server\` directory.
5. Copy the 'DB URL' from the output.${
			output
				? `
${pc.bold("Relevant output from `supabase start`:")}
${pc.dim(output)}`
				: ""
		}
6. Add the DB URL to the .env file in \`apps/server/.env\` as \`DATABASE_URL\`:
			${pc.gray('DATABASE_URL="your_supabase_db_url"')}`,
	);
}

export async function setupSupabase(config: ProjectConfig) {
	const { projectDir, packageManager } = config;

	const serverDir = path.join(projectDir, "apps", "server");

	try {
		await fs.ensureDir(serverDir);

		const initialized = await initializeSupabase(serverDir, packageManager);
		if (!initialized) {
			displayManualSupabaseInstructions();
			return;
		}

		const supabaseOutput = await startSupabase(serverDir, packageManager);
		if (!supabaseOutput) {
			displayManualSupabaseInstructions();
			return;
		}

		const dbUrl = extractDbUrl(supabaseOutput);

		if (dbUrl) {
			const envUpdated = await writeSupabaseEnvFile(projectDir, dbUrl);

			if (envUpdated) {
				log.success(pc.green("Supabase local development setup ready!"));
			} else {
				log.error(
					pc.red(
						"Supabase setup completed, but failed to update .env automatically.",
					),
				);
				displayManualSupabaseInstructions(supabaseOutput);
			}
		} else {
			log.error(
				pc.yellow(
					"Supabase started, but could not extract DB URL automatically.",
				),
			);
			displayManualSupabaseInstructions(supabaseOutput);
		}
	} catch (error) {
		if (error instanceof Error) {
			consola.error(pc.red(`Error during Supabase setup: ${error.message}`));
		} else {
			consola.error(
				pc.red(
					`An unknown error occurred during Supabase setup: ${String(error)}`,
				),
			);
		}
		displayManualSupabaseInstructions();
	}
}
