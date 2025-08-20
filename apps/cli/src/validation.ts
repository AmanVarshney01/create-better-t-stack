import type { CLIInput, ProjectConfig } from "./types";
import {
	getProvidedFlags,
	processFlags,
	validateArrayOptions,
} from "./utils/config-processing";
import {
	validateConfigForProgrammaticUse,
	validateFullConfig,
} from "./utils/config-validation";
import { exitWithError } from "./utils/errors";
import { extractAndValidateProjectName } from "./utils/project-name-validation";

export function processAndValidateFlags(
	options: CLIInput,
	providedFlags: Set<string>,
	projectName?: string,
): Partial<ProjectConfig> {
	if (options.yolo) {
		const cfg = processFlags(options, projectName);
		const validatedProjectName = extractAndValidateProjectName(
			projectName,
			options.projectDirectory,
			true,
		);
		if (validatedProjectName) {
			cfg.projectName = validatedProjectName;
		}
		return cfg;
	}

	try {
		validateArrayOptions(options);
	} catch (error) {
		exitWithError(error instanceof Error ? error.message : String(error));
	}

	const config = processFlags(options, projectName);

	const validatedProjectName = extractAndValidateProjectName(
		projectName,
		options.projectDirectory,
		false,
	);
	if (validatedProjectName) {
		config.projectName = validatedProjectName;
	}

	validateFullConfig(config, providedFlags, options);

	return config;
}

export function processProvidedFlagsWithoutValidation(
	options: CLIInput,
	projectName?: string,
): Partial<ProjectConfig> {
	const config = processFlags(options, projectName);

	const validatedProjectName = extractAndValidateProjectName(
		projectName,
		options.projectDirectory,
		true,
	);
	if (validatedProjectName) {
		config.projectName = validatedProjectName;
	}

	return config;
}

export function validateConfigCompatibility(
	config: Partial<ProjectConfig>,
	providedFlags?: Set<string>,
	options?: CLIInput,
) {
	if (options?.yolo) return;
	if (options && providedFlags) {
		validateFullConfig(config, providedFlags, options);
	} else {
		validateConfigForProgrammaticUse(config);
	}
}

export { getProvidedFlags };
