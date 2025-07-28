import os from "node:os";
import path from "node:path";
import {
	cancel,
	confirm,
	isCancel,
	log,
	select,
	spinner,
	text,
} from "@clack/prompts";
import consola from "consola";
import { $ } from "execa";
import pc from "picocolors";
import type { ProjectConfig } from "../../types";
import { commandExists } from "../../utils/command-exists";
import {
	addEnvVariablesToFile,
	type EnvVariable,
} from "../project-generation/env-setup";

type TursoConfig = {
	dbUrl: string;
	authToken: string;
};

type TursoGroup = {
	name: string;
	locations: string;
	version: string;
	status: string;
};

async function isTursoInstalled() {
	return commandExists("turso");
}

async function isTursoLoggedIn() {
	try {
		const output = await $`turso auth whoami`;
		return !output.stdout.includes("You are not logged in");
	} catch {
		return false;
	}
}

async function loginToTurso() {
	const s = spinner();
	try {
		s.start("Logging in to Turso...");
		await $`turso auth login`;
		s.stop("Logged into Turso");
		return true;
	} catch (_error) {
		s.stop(pc.red("Failed to log in to Turso"));
	}
}

async function installTursoCLI(isMac: boolean) {
	const s = spinner();
	try {
		s.start("Installing Turso CLI...");

		if (isMac) {
			await $`brew install tursodatabase/tap/turso`;
		} else {
			const { stdout: installScript } =
				await $`curl -sSfL https://get.tur.so/install.sh`;
			await $`bash -c '${installScript}'`;
		}

		s.stop("Turso CLI installed");
		return true;
	} catch (error) {
		if (error instanceof Error && error.message.includes("User force closed")) {
			s.stop("Turso CLI installation cancelled");
			log.warn(pc.yellow("Turso CLI installation cancelled by user"));
			throw new Error("Installation cancelled");
		}
		s.stop(pc.red("Failed to install Turso CLI"));
	}
}

async function getTursoGroups(): Promise<TursoGroup[]> {
	const s = spinner();
	try {
		s.start("Fetching Turso groups...");
		const { stdout } = await $`turso group list`;
		const lines = stdout.trim().split("\n");

		if (lines.length <= 1) {
			s.stop("No Turso groups found");
			return [];
		}

		const groups = lines.slice(1).map((line) => {
			const [name, locations, version, status] = line.trim().split(/\s{2,}/);
			return { name, locations, version, status };
		});

		s.stop(`Found ${groups.length} Turso groups`);
		return groups;
	} catch (error) {
		s.stop(pc.red("Error fetching Turso groups"));
		console.error("Error fetching Turso groups:", error);
		return [];
	}
}

async function selectTursoGroup(): Promise<string | null> {
	const groups = await getTursoGroups();

	if (groups.length === 0) {
		return null;
	}

	if (groups.length === 1) {
		log.info(`Using the only available group: ${pc.blue(groups[0].name)}`);
		return groups[0].name;
	}

	const groupOptions = groups.map((group) => ({
		value: group.name,
		label: `${group.name} (${group.locations})`,
	}));

	const selectedGroup = await select({
		message: "Select a Turso database group:",
		options: groupOptions,
	});

	if (isCancel(selectedGroup)) {
		cancel(pc.red("Operation cancelled"));
		process.exit(0);
	}

	return selectedGroup as string;
}

async function createTursoDatabase(dbName: string, groupName: string | null) {
	const s = spinner();

	try {
		s.start(
			`Creating Turso database "${dbName}"${
				groupName ? ` in group "${groupName}"` : ""
			}...`,
		);

		if (groupName) {
			await $`turso db create ${dbName} --group ${groupName}`;
		} else {
			await $`turso db create ${dbName}`;
		}

		s.stop(`Turso database "${dbName}" created`);
	} catch (error) {
		s.stop(pc.red(`Failed to create database "${dbName}"`));
		if (error instanceof Error && error.message.includes("already exists")) {
			throw new Error("DATABASE_EXISTS");
		}
	}

	s.start("Retrieving database connection details...");
	try {
		const { stdout: dbUrl } = await $`turso db show ${dbName} --url`;
		const { stdout: authToken } = await $`turso db tokens create ${dbName}`;

		s.stop("Database connection details retrieved");

		return {
			dbUrl: dbUrl.trim(),
			authToken: authToken.trim(),
		};
	} catch (_error) {
		s.stop(pc.red("Failed to retrieve database connection details"));
	}
}

async function writeEnvFile(projectDir: string, config?: TursoConfig) {
	const envPath = path.join(projectDir, "apps/server", ".env");
	const variables: EnvVariable[] = [
		{
			key: "DATABASE_URL",
			value: config?.dbUrl ?? "",
			condition: true,
		},
		{
			key: "DATABASE_AUTH_TOKEN",
			value: config?.authToken ?? "",
			condition: true,
		},
	];
	await addEnvVariablesToFile(envPath, variables);
}

function displayManualSetupInstructions() {
	log.info(`Manual Turso Setup Instructions:

1. Visit https://turso.tech and create an account
2. Create a new database from the dashboard
3. Get your database URL and authentication token
4. Add these credentials to the .env file in apps/server/.env

DATABASE_URL=your_database_url
DATABASE_AUTH_TOKEN=your_auth_token`);
}

export async function setupTurso(config: ProjectConfig) {
	const { orm, projectDir } = config;
	const _isDrizzle = orm === "drizzle";
	const setupSpinner = spinner();
	setupSpinner.start("Checking Turso CLI availability...");

	try {
		const platform = os.platform();
		const isMac = platform === "darwin";
		const _isLinux = platform === "linux";
		const isWindows = platform === "win32";

		if (isWindows) {
			setupSpinner.stop(pc.yellow("Turso setup not supported on Windows"));
			log.warn(pc.yellow("Automatic Turso setup is not supported on Windows."));
			await writeEnvFile(projectDir);
			displayManualSetupInstructions();
			return;
		}

		setupSpinner.stop("Turso CLI availability checked");

		const isCliInstalled = await isTursoInstalled();

		if (!isCliInstalled) {
			const shouldInstall = await confirm({
				message: "Would you like to install Turso CLI?",
				initialValue: true,
			});

			if (isCancel(shouldInstall)) {
				cancel(pc.red("Operation cancelled"));
				process.exit(0);
			}

			if (!shouldInstall) {
				await writeEnvFile(projectDir);
				displayManualSetupInstructions();
				return;
			}

			await installTursoCLI(isMac);
		}

		const isLoggedIn = await isTursoLoggedIn();
		if (!isLoggedIn) {
			await loginToTurso();
		}

		const selectedGroup = await selectTursoGroup();

		let success = false;
		let dbName = "";
		let suggestedName = path.basename(projectDir);

		while (!success) {
			const dbNameResponse = await text({
				message: "Enter a name for your database:",
				defaultValue: suggestedName,
				initialValue: suggestedName,
				placeholder: suggestedName,
			});

			if (isCancel(dbNameResponse)) {
				cancel(pc.red("Operation cancelled"));
				process.exit(0);
			}

			dbName = dbNameResponse as string;

			try {
				const config = await createTursoDatabase(dbName, selectedGroup);
				await writeEnvFile(projectDir, config);
				success = true;
			} catch (error) {
				if (error instanceof Error && error.message === "DATABASE_EXISTS") {
					log.warn(pc.yellow(`Database "${pc.red(dbName)}" already exists`));
					suggestedName = `${dbName}-${Math.floor(Math.random() * 1000)}`;
				} else {
					throw error;
				}
			}
		}

		log.success("Turso database setup completed successfully!");
	} catch (error) {
		setupSpinner.stop(pc.red("Turso CLI availability check failed"));
		consola.error(
			pc.red(
				`Error during Turso setup: ${
					error instanceof Error ? error.message : String(error)
				}`,
			),
		);
		await writeEnvFile(projectDir);
		displayManualSetupInstructions();
		log.success("Setup completed with manual configuration required.");
	}
}
