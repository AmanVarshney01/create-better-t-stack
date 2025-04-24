import path from "node:path";
import { cancel, log, spinner } from "@clack/prompts";
import fs from "fs-extra";
import pc from "picocolors";
import type { ProjectConfig } from "../types";
import { setupAddons } from "./addons-setup";
import { setupApi } from "./api-setup";
import { setupAuth } from "./auth-setup";
import { setupBackendDependencies } from "./backend-framework-setup";
import { createReadme } from "./create-readme";
import { setupDatabase } from "./db-setup";
import { setupEnvironmentVariables } from "./env-setup";
import { setupExamples } from "./examples-setup";
import { installDependencies } from "./install-dependencies";
import { displayPostInstallInstructions } from "./post-installation";
import { initializeGit, updatePackageConfigurations } from "./project-config";
import { setupRuntime } from "./runtime-setup";
import {
	copyBaseTemplate,
	handleExtras,
	setupAddonsTemplate,
	setupAuthTemplate,
	setupBackendFramework,
	setupDbOrmTemplates,
	setupExamplesTemplate,
	setupFrontendTemplates,
} from "./template-manager";

export async function createProject(options: ProjectConfig): Promise<string> {
	const s = spinner();
	const projectDir = path.resolve(process.cwd(), options.projectName);

	try {
		await fs.ensureDir(projectDir);

		await copyBaseTemplate(projectDir, options);
		await setupFrontendTemplates(projectDir, options);

		await setupBackendFramework(projectDir, options);
		await setupBackendDependencies(options);

		await setupDbOrmTemplates(projectDir, options);

		await setupDatabase(options);

		await setupAuthTemplate(projectDir, options);
		await setupAuth(options);

		await setupAddonsTemplate(projectDir, options);
		if (options.addons.length > 0 && options.addons[0] !== "none") {
			await setupAddons(options);
		}

		await setupExamplesTemplate(projectDir, options);
		await handleExtras(projectDir, options);

		if (options.examples.length > 0 && options.examples[0] !== "none") {
			await setupExamples(options);
		}

		await setupApi(options);

		await setupRuntime(options);

		await setupEnvironmentVariables(options);

		await updatePackageConfigurations(projectDir, options);
		await createReadme(projectDir, options);

		await initializeGit(projectDir, options.git);

		log.success("Project template successfully scaffolded!");

		if (options.install) {
			await installDependencies({
				projectDir,
				packageManager: options.packageManager,
				addons: options.addons,
			});
		}

		displayPostInstallInstructions({
			...options,
			depsInstalled: options.install,
		});

		return projectDir;
	} catch (error) {
		s.stop(pc.red("Failed"));
		if (error instanceof Error) {
			cancel(pc.red(`Error during project creation: ${error.message}`));
			console.error(error.stack);
			process.exit(1);
		}
		throw error;
	}
}
