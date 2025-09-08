import { log } from "@clack/prompts";
import fs from "fs-extra";
import type { ProjectConfig } from "../../types";
import { writeBtsConfig } from "../../utils/bts-config";
import { exitWithError } from "../../utils/errors";
import { setupAddons } from "../addons/addons-setup";
import { setupExamples } from "../addons/examples-setup";
import { setupApi } from "../core/api-setup";
import { setupBackendDependencies } from "../core/backend-setup";
import { setupDatabase } from "../core/db-setup";
import { setupRuntime } from "../core/runtime-setup";
import { setupServerDeploy } from "../deployment/server-deploy-setup";
import { setupWebDeploy } from "../deployment/web-deploy-setup";
import { setupAuth } from "./auth-setup";
import { runConvexCodegen } from "./convex-codegen";
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
		}
		await setupAuthTemplate(projectDir, options);
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

		if (options.auth && options.auth !== "none") {
			await setupAuth(options);
		}

		await handleExtras(projectDir, options);

		await setupEnvironmentVariables(options);
		await updatePackageConfigurations(projectDir, options);

		await setupWebDeploy(options);
		await setupServerDeploy(options);

		await createReadme(projectDir, options);

		await writeBtsConfig(options);

		if (isConvex) {
			await runConvexCodegen(projectDir, options.packageManager);
		}

		log.success("Project template successfully scaffolded!");

		if (options.install) {
			await installDependencies({
				projectDir,
				packageManager: options.packageManager,
			});
		}

		await initializeGit(projectDir, options.git);

		await displayPostInstallInstructions({
			...options,
			depsInstalled: options.install,
		});

		return projectDir;
	} catch (error) {
		if (error instanceof Error) {
			console.error(error.stack);
			exitWithError(`Error during project creation: ${error.message}`);
		} else {
			console.error(error);
			exitWithError(`An unexpected error occurred: ${String(error)}`);
		}
	}
}
