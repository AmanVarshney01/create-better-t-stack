import path from "node:path";
import { cancel, log } from "@clack/prompts";
import pc from "picocolors";
import type { AddInput, ProjectConfig, WebDeploy } from "../../types";
import { updateBtsConfig } from "../../utils/bts-config";
import { setupWebDeploy } from "../setup/web-deploy-setup";
import {
	detectProjectConfig,
	isBetterTStackProject,
} from "./detect-project-config";
import { installDependencies } from "./install-dependencies";
import { setupDeploymentTemplates } from "./template-manager";

function exitWithError(message: string): never {
	cancel(pc.red(message));
	process.exit(1);
}

export async function addDeploymentToProject(
	input: AddInput & { webDeploy: WebDeploy; suppressInstallMessage?: boolean },
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

		if (detectedConfig.webDeploy === input.webDeploy) {
			exitWithError(
				`${input.webDeploy} deployment is already configured for this project.`,
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
			addons: detectedConfig.addons || [],
			examples: detectedConfig.examples || [],
			auth: detectedConfig.auth || false,
			git: false,
			packageManager:
				input.packageManager || detectedConfig.packageManager || "npm",
			install: input.install || false,
			dbSetup: detectedConfig.dbSetup || "none",
			api: detectedConfig.api || "none",
			webDeploy: input.webDeploy,
		};

		log.info(
			pc.green(
				`Adding ${input.webDeploy} deployment to ${config.frontend.join("/")}`,
			),
		);

		await setupDeploymentTemplates(projectDir, config);
		await setupWebDeploy(config);

		await updateBtsConfig(projectDir, { webDeploy: input.webDeploy });

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
		exitWithError(`Error adding deployment: ${message}`);
	}
}
