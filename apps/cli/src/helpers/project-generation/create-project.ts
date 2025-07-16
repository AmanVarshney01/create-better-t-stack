import { cancel, log } from "@clack/prompts";
import fs from "fs-extra";
import pc from "picocolors";
import type { ProjectConfig } from "../../types";
import { writeBtsConfig } from "../../utils/bts-config";
import { setupAddons } from "../setup/addons-setup";
import { setupApi } from "../setup/api-setup";
import { setupAuth } from "../setup/auth-setup";
import { setupBackendDependencies } from "../setup/backend-setup";
import { setupDatabase } from "../setup/db-setup";
import { setupExamples } from "../setup/examples-setup";
import {
	generateCloudflareWorkerTypes,
	setupRuntime,
} from "../setup/runtime-setup";
import { setupWebDeploy } from "../setup/web-deploy-setup";
import { createReadme } from "./create-readme";
import { setupEnvironmentVariables } from "./env-setup";
import { initializeGit } from "./git";
import { installDependencies } from "./install-dependencies";
import { displayPostInstallInstructions } from "./post-installation";
import { updatePackageConfigurations } from "./project-config";
import {
	copyBaseTemplate,
	handleExtras,
	setupAddonsTemplate,
	setupAuthTemplate,
	setupBackendFramework,
	setupDbOrmTemplates,
	setupDeploymentTemplates,
	setupDockerComposeTemplates,
	setupExamplesTemplate,
	setupFrontendTemplates,
} from "./template-manager";

export async function createProject(options: ProjectConfig) {
	const projectDir = options.projectDir;
	const isConvex = options.backend === "convex";

	try {
		await fs.ensureDir(projectDir);

		await copyBaseTemplate(projectDir, options);
		await setupFrontendTemplates(projectDir, options);
		await setupBackendFramework(projectDir, options);
		if (!isConvex) {
			await setupDbOrmTemplates(projectDir, options);
			await setupDockerComposeTemplates(projectDir, options);
			await setupAuthTemplate(projectDir, options);
		}
		if (options.examples.length > 0 && options.examples[0] !== "none") {
			await setupExamplesTemplate(projectDir, options);
		}
		await setupAddonsTemplate(projectDir, options);

		await setupDeploymentTemplates(projectDir, options);

		await setupApi(options);

		if (!isConvex) {
			await setupBackendDependencies(options);
			await setupDatabase(options);
			await setupRuntime(options);
			if (options.examples.length > 0 && options.examples[0] !== "none") {
				await setupExamples(options);
			}
		}

		if (options.addons.length > 0 && options.addons[0] !== "none") {
			await setupAddons(options);
		}

		if (!isConvex && options.auth) {
			await setupAuth(options);
		}

		await handleExtras(projectDir, options);

		await setupWebDeploy(options);

		await setupEnvironmentVariables(options);
		await updatePackageConfigurations(projectDir, options);
		await createReadme(projectDir, options);

		await writeBtsConfig(options);

		log.success("Project template successfully scaffolded!");

		if (options.install) {
			await installDependencies({
				projectDir,
				packageManager: options.packageManager,
			});
			await generateCloudflareWorkerTypes(options);
		}

		await initializeGit(projectDir, options.git);

		await displayPostInstallInstructions({
			...options,
			depsInstalled: options.install,
		});

		return projectDir;
	} catch (error) {
		if (error instanceof Error) {
			cancel(pc.red(`Error during project creation: ${error.message}`));
			console.error(error.stack);
			process.exit(1);
		} else {
			cancel(pc.red(`An unexpected error occurred: ${String(error)}`));
			console.error(error);
			process.exit(1);
		}
	}
}
