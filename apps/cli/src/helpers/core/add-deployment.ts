import path from "node:path";
import { log } from "@clack/prompts";
import pc from "picocolors";
import type {
	AddInput,
	ProjectConfig,
	ServerDeploy,
	WebDeploy,
} from "../../types";
import { updateBtsConfig } from "../../utils/bts-config";
import { exitWithError } from "../../utils/errors";
import { setupServerDeploy } from "../deployment/server-deploy-setup";
import { setupWebDeploy } from "../deployment/web-deploy-setup";
import {
	detectProjectConfig,
	isBetterTStackProject,
} from "./detect-project-config";
import { installDependencies } from "./install-dependencies";
import { setupDeploymentTemplates } from "./template-manager";

export async function addDeploymentToProject(
	input: AddInput & {
		webDeploy?: WebDeploy;
		serverDeploy?: ServerDeploy;
		suppressInstallMessage?: boolean;
	},
) {
	try {
		const projectDir = input.projectDir || process.cwd();

		const isBetterTStack = await isBetterTStackProject(projectDir);
		if (!isBetterTStack) {
			exitWithError(
				"This doesn't appear to be a Better-T-Stack project. Please run this command from the root of a Better-T-Stack project.",
			);
		}

		const detectedConfig = await detectProjectConfig(projectDir);
		if (!detectedConfig) {
			exitWithError(
				"Could not detect the project configuration. Please ensure this is a valid Better-T-Stack project.",
			);
		}

		if (input.webDeploy && detectedConfig.webDeploy === input.webDeploy) {
			exitWithError(
				`${input.webDeploy} web deployment is already configured for this project.`,
			);
		}

		if (
			input.serverDeploy &&
			detectedConfig.serverDeploy === input.serverDeploy
		) {
			exitWithError(
				`${input.serverDeploy} server deployment is already configured for this project.`,
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
			auth: detectedConfig.auth || "none",
			payments: detectedConfig.payments || "none",
			git: false,
			packageManager:
				input.packageManager || detectedConfig.packageManager || "npm",
			install: input.install || false,
			dbSetup: detectedConfig.dbSetup || "none",
			api: detectedConfig.api || "none",
			webDeploy: input.webDeploy || detectedConfig.webDeploy || "none",
			serverDeploy: input.serverDeploy || detectedConfig.serverDeploy || "none",
		};

		if (input.webDeploy && input.webDeploy !== "none") {
			log.info(
				pc.green(
					`Adding ${input.webDeploy} web deployment to ${config.frontend.join("/")}`,
				),
			);
		}

		if (input.serverDeploy && input.serverDeploy !== "none") {
			log.info(pc.green(`Adding ${input.serverDeploy} server deployment`));
		}

		await setupDeploymentTemplates(projectDir, config);
		await setupWebDeploy(config);
		await setupServerDeploy(config);

		await updateBtsConfig(projectDir, {
			webDeploy: input.webDeploy || config.webDeploy,
			serverDeploy: input.serverDeploy || config.serverDeploy,
		});

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
