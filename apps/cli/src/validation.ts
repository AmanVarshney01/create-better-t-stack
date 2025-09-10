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

const CORE_STACK_FLAGS = new Set([
	"database",
	"orm",
	"backend",
	"runtime",
	"frontend",
	"addons",
	"examples",
	"auth",
	"dbSetup",
	"api",
	"webDeploy",
	"serverDeploy",
]);

function validateYesFlagCombination(
	options: CLIInput,
	providedFlags: Set<string>,
) {
	if (!options.yes) return;

	const coreStackFlagsProvided = Array.from(providedFlags).filter((flag) =>
		CORE_STACK_FLAGS.has(flag),
	);

	if (coreStackFlagsProvided.length > 0) {
		exitWithError(
			`Cannot combine --yes with core stack configuration flags: ${coreStackFlagsProvided.map((f) => `--${f}`).join(", ")}. ` +
				"The --yes flag uses default configuration. Remove these flags or use --yes without them.",
		);
	}
}

export function processAndValidateFlags(
	options: CLIInput,
	providedFlags: Set<string>,
	projectName?: string,
) {
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

	validateYesFlagCombination(options, providedFlags);

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
) {
	if (!options.yolo) {
		const providedFlags = getProvidedFlags(options);
		validateYesFlagCombination(options, providedFlags);
	}

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
