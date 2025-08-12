import path from "node:path";
import { intro, log, outro } from "@clack/prompts";
import consola from "consola";
import fs from "fs-extra";
import pc from "picocolors";
import { DEFAULT_CONFIG } from "../../constants";
import { getAddonsToAdd } from "../../prompts/addons";
import { gatherConfig } from "../../prompts/config-prompts";
import { getProjectName } from "../../prompts/project-name";
import { getDeploymentToAdd } from "../../prompts/web-deploy";
import type {
	AddInput,
	CreateInput,
	DirectoryConflict,
	InitResult,
	ProjectConfig,
} from "../../types";
import { trackProjectCreation } from "../../utils/analytics";
import { displayConfig } from "../../utils/display-config";
import { exitWithError, handleError } from "../../utils/errors";
import { generateReproducibleCommand } from "../../utils/generate-reproducible-command";
import {
	handleDirectoryConflict,
	setupProjectDirectory,
} from "../../utils/project-directory";
import { renderTitle } from "../../utils/render-title";
import { getProvidedFlags, processAndValidateFlags } from "../../validation";
import { addAddonsToProject } from "./add-addons";
import { addDeploymentToProject } from "./add-deployment";
import { createProject } from "./create-project";
import { detectProjectConfig } from "./detect-project-config";
import { installDependencies } from "./install-dependencies";

export async function createProjectHandler(
	input: CreateInput & { projectName?: string },
): Promise<InitResult> {
	const startTime = Date.now();
	const timeScaffolded = new Date().toISOString();

	if (input.renderTitle !== false) {
		renderTitle();
	}
	intro(pc.magenta("Creating a new Better-T Stack project"));

	if (input.yolo) {
		consola.fatal("YOLO mode enabled - skipping checks. Things may break!");
	}

	let currentPathInput: string;
	if (input.yes && input.projectName) {
		currentPathInput = input.projectName;
	} else if (input.yes) {
		let defaultName = DEFAULT_CONFIG.relativePath;
		let counter = 1;
		while (
			fs.pathExistsSync(path.resolve(process.cwd(), defaultName)) &&
			fs.readdirSync(path.resolve(process.cwd(), defaultName)).length > 0
		) {
			defaultName = `${DEFAULT_CONFIG.projectName}-${counter}`;
			counter++;
		}
		currentPathInput = defaultName;
	} else {
		currentPathInput = await getProjectName(input.projectName);
	}

	let finalPathInput: string;
	let shouldClearDirectory: boolean;

	try {
		if (input.directoryConflict) {
			const result = await handleDirectoryConflictProgrammatically(
				currentPathInput,
				input.directoryConflict,
			);
			finalPathInput = result.finalPathInput;
			shouldClearDirectory = result.shouldClearDirectory;
		} else {
			const result = await handleDirectoryConflict(currentPathInput);
			finalPathInput = result.finalPathInput;
			shouldClearDirectory = result.shouldClearDirectory;
		}
	} catch (error) {
		const elapsedTimeMs = Date.now() - startTime;
		return {
			success: false,
			projectConfig: {
				projectName: "",
				projectDir: "",
				relativePath: "",
				database: "none",
				orm: "none",
				backend: "none",
				runtime: "none",
				frontend: [],
				addons: [],
				examples: [],
				auth: false,
				git: false,
				packageManager: "npm",
				install: false,
				dbSetup: "none",
				api: "none",
				webDeploy: "none",
			} satisfies ProjectConfig,
			reproducibleCommand: "",
			timeScaffolded,
			elapsedTimeMs,
			projectDirectory: "",
			relativePath: "",
			error: error instanceof Error ? error.message : String(error),
		};
	}

	const { finalResolvedPath, finalBaseName } = await setupProjectDirectory(
		finalPathInput,
		shouldClearDirectory,
	);

	const cliInput = {
		...input,
		projectDirectory: input.projectName,
	};

	const providedFlags = getProvidedFlags(cliInput);

	const flagConfig = processAndValidateFlags(
		cliInput,
		providedFlags,
		finalBaseName,
	);
	const { projectName: _projectNameFromFlags, ...otherFlags } = flagConfig;

	if (!input.yes && Object.keys(otherFlags).length > 0) {
		log.info(pc.yellow("Using these pre-selected options:"));
		log.message(displayConfig(otherFlags));
		log.message("");
	}

	let config: ProjectConfig;
	if (input.yes) {
		config = {
			...DEFAULT_CONFIG,
			...flagConfig,
			projectName: finalBaseName,
			projectDir: finalResolvedPath,
			relativePath: finalPathInput,
		};

		if (config.backend === "convex") {
			log.info(
				"Due to '--backend convex' flag, the following options have been automatically set: auth=false, database=none, orm=none, api=none, runtime=none, dbSetup=none, examples=todo",
			);
		} else if (config.backend === "none") {
			log.info(
				"Due to '--backend none', the following options have been automatically set: --auth=false, --database=none, --orm=none, --api=none, --runtime=none, --db-setup=none, --examples=none",
			);
		}

		log.info(pc.yellow("Using default/flag options (config prompts skipped):"));
		log.message(displayConfig(config));
		log.message("");
	} else {
		config = await gatherConfig(
			flagConfig,
			finalBaseName,
			finalResolvedPath,
			finalPathInput,
		);
	}

	await createProject(config);

	const reproducibleCommand = generateReproducibleCommand(config);
	log.success(
		pc.blue(
			`You can reproduce this setup with the following command:\n${reproducibleCommand}`,
		),
	);

	await trackProjectCreation(config);

	const elapsedTimeMs = Date.now() - startTime;
	const elapsedTimeInSeconds = (elapsedTimeMs / 1000).toFixed(2);
	outro(
		pc.magenta(
			`Project created successfully in ${pc.bold(
				elapsedTimeInSeconds,
			)} seconds!`,
		),
	);

	return {
		success: true,
		projectConfig: config,
		reproducibleCommand,
		timeScaffolded,
		elapsedTimeMs,
		projectDirectory: config.projectDir,
		relativePath: config.relativePath,
	};
}

async function handleDirectoryConflictProgrammatically(
	currentPathInput: string,
	strategy: DirectoryConflict,
): Promise<{ finalPathInput: string; shouldClearDirectory: boolean }> {
	const currentPath = path.resolve(process.cwd(), currentPathInput);

	if (!fs.pathExistsSync(currentPath)) {
		return { finalPathInput: currentPathInput, shouldClearDirectory: false };
	}

	const dirContents = fs.readdirSync(currentPath);
	const isNotEmpty = dirContents.length > 0;

	if (!isNotEmpty) {
		return { finalPathInput: currentPathInput, shouldClearDirectory: false };
	}

	switch (strategy) {
		case "overwrite":
			return { finalPathInput: currentPathInput, shouldClearDirectory: true };

		case "merge":
			return { finalPathInput: currentPathInput, shouldClearDirectory: false };

		case "increment": {
			let counter = 1;
			const baseName = currentPathInput;
			let finalPathInput = `${baseName}-${counter}`;

			while (
				fs.pathExistsSync(path.resolve(process.cwd(), finalPathInput)) &&
				fs.readdirSync(path.resolve(process.cwd(), finalPathInput)).length > 0
			) {
				counter++;
				finalPathInput = `${baseName}-${counter}`;
			}

			return { finalPathInput, shouldClearDirectory: false };
		}

		case "error":
			throw new Error(
				`Directory "${currentPathInput}" already exists and is not empty. Use directoryConflict: "overwrite", "merge", or "increment" to handle this.`,
			);

		default:
			throw new Error(`Unknown directory conflict strategy: ${strategy}`);
	}
}

export async function addAddonsHandler(input: AddInput) {
	try {
		const projectDir = input.projectDir || process.cwd();
		const detectedConfig = await detectProjectConfig(projectDir);

		if (!detectedConfig) {
			exitWithError(
				"Could not detect project configuration. Please ensure this is a valid Better-T Stack project.",
			);
		}

		if (!input.addons || input.addons.length === 0) {
			const addonsPrompt = await getAddonsToAdd(
				detectedConfig.frontend || [],
				detectedConfig.addons || [],
			);

			if (addonsPrompt.length > 0) {
				input.addons = addonsPrompt;
			}
		}

		if (!input.webDeploy) {
			const deploymentPrompt = await getDeploymentToAdd(
				detectedConfig.frontend || [],
				detectedConfig.webDeploy,
			);

			if (deploymentPrompt !== "none") {
				input.webDeploy = deploymentPrompt;
			}
		}

		const packageManager =
			input.packageManager || detectedConfig.packageManager || "npm";

		let somethingAdded = false;

		if (input.addons && input.addons.length > 0) {
			await addAddonsToProject({
				...input,
				install: false,
				suppressInstallMessage: true,
				addons: input.addons,
			});
			somethingAdded = true;
		}

		if (input.webDeploy && input.webDeploy !== "none") {
			await addDeploymentToProject({
				...input,
				install: false,
				suppressInstallMessage: true,
				webDeploy: input.webDeploy,
			});
			somethingAdded = true;
		}

		if (!somethingAdded) {
			outro(pc.yellow("No addons or deployment configurations to add."));
			return;
		}

		if (input.install) {
			await installDependencies({
				projectDir,
				packageManager,
			});
		} else {
			log.info(
				`Run ${pc.bold(`${packageManager} install`)} to install dependencies`,
			);
		}

		outro("Add command completed successfully!");
	} catch (error) {
		handleError(error, "Failed to add addons or deployment");
	}
}
