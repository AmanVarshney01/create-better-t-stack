import { log } from "@clack/prompts";
import fs from "fs-extra";
import { setupAddons } from "@/helpers/addons/addons-setup";
import { setupExamples } from "@/helpers/addons/examples-setup";
import { setupApi } from "@/helpers/core/api-setup";
import { setupAuth } from "@/helpers/core/auth-setup";
import { setupBackendDependencies } from "@/helpers/core/backend-setup";
import { runConvexCodegen } from "@/helpers/core/convex-codegen";
import { createReadme } from "@/helpers/core/create-readme";
import { setupDatabase } from "@/helpers/core/db-setup";
import { setupEnvironmentVariables } from "@/helpers/core/env-setup";
import { initializeGit } from "@/helpers/core/git";
import { installDependencies } from "@/helpers/core/install-dependencies";
import { displayPostInstallInstructions } from "@/helpers/core/post-installation";
import { updatePackageConfigurations } from "@/helpers/core/project-config";
import { setupRuntime } from "@/helpers/core/runtime-setup";
import { setupServerDeploy } from "@/helpers/deployment/server-deploy-setup";
import { setupWebDeploy } from "@/helpers/deployment/web-deploy-setup";
import type { ProjectConfig } from "@/types";
import { writeBtsConfig } from "@/utils/bts-config";
import { exitWithError } from "@/utils/errors";
import { formatProjectWithBiome } from "@/utils/format-with-biome";
import {
	copyBaseTemplate,
	handleExtras,
	setupAddonsTemplate,
	setupAuthTemplate,
	setupBackendFramework,
	setupDbOrmTemplates,
	setupDeploymentTemplates,
	setupDockerComposeTemplates,
	setupDockerTemplates,
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

		await setupDockerTemplates(projectDir, options);

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

		await formatProjectWithBiome(projectDir);

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
