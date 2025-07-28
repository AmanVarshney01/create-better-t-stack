import path from "node:path";
import { cancel, log } from "@clack/prompts";
import pc from "picocolors";
import type { AddInput, Addons, ProjectConfig } from "../../types";
import { validateAddonCompatibility } from "../../utils/addon-compatibility";
import { updateBtsConfig } from "../../utils/bts-config";
import { setupAddons } from "../setup/addons-setup";
import {
	detectProjectConfig,
	isBetterTStackProject,
} from "./detect-project-config";
import { installDependencies } from "./install-dependencies";
import { setupAddonsTemplate } from "./template-manager";

function exitWithError(message: string): never {
	cancel(pc.red(message));
	process.exit(1);
}

export async function addAddonsToProject(
	input: AddInput & { addons: Addons[]; suppressInstallMessage?: boolean },
) {
	try {
		const projectDir = input.projectDir || process.cwd();

		const isBetterTStack = await isBetterTStackProject(projectDir);
		if (!isBetterTStack) {
			exitWithError(
				"This doesn't appear to be a Better-T Stack project. Please run this command from the root of a Better-T Stack project.",
			);
		}

		const detectedConfig = await detectProjectConfig(projectDir);
		if (!detectedConfig) {
			exitWithError(
				"Could not detect the project configuration. Please ensure this is a valid Better-T Stack project.",
			);
		}

		const config: ProjectConfig = {
			projectName: detectedConfig.projectName || path.basename(projectDir),
			projectDir,
			relativePath: ".",
			database: detectedConfig.database || "none",
			orm: detectedConfig.orm || "none",
			backend: detectedConfig.backend || "none",
			runtime: detectedConfig.runtime || "none",
			frontend: detectedConfig.frontend || [],
			addons: input.addons,
			examples: detectedConfig.examples || [],
			auth: detectedConfig.auth || false,
			git: false,
			packageManager:
				input.packageManager || detectedConfig.packageManager || "npm",
			install: input.install || false,
			dbSetup: detectedConfig.dbSetup || "none",
			api: detectedConfig.api || "none",
			webDeploy: detectedConfig.webDeploy || "none",
		};

		for (const addon of input.addons) {
			const { isCompatible, reason } = validateAddonCompatibility(
				addon,
				config.frontend,
			);
			if (!isCompatible) {
				exitWithError(
					reason ||
						`${addon} addon is not compatible with current frontend configuration`,
				);
			}
		}

		log.info(
			`Adding ${input.addons.join(", ")} to ${config.frontend.join("/")}`,
		);

		await setupAddonsTemplate(projectDir, config);
		await setupAddons(config, true);

		const currentAddons = detectedConfig.addons || [];
		const mergedAddons = [...new Set([...currentAddons, ...input.addons])];
		await updateBtsConfig(projectDir, { addons: mergedAddons });

		if (config.install) {
			await installDependencies({
				projectDir,
				packageManager: config.packageManager,
			});
		} else if (!input.suppressInstallMessage) {
			log.info(
				pc.yellow(
					`Run ${pc.bold(
						`${config.packageManager} install`,
					)} to install dependencies`,
				),
			);
		}
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		exitWithError(`Error adding addons: ${message}`);
	}
}
