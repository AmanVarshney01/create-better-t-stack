import { log, spinner } from "@clack/prompts";
import consola from "consola";
import { $ } from "execa";
import pc from "picocolors";
import type { ProjectAddons, ProjectPackageManager } from "../types";

export async function installDependencies({
	projectDir,
	packageManager,
	addons = [],
}: {
	projectDir: string;
	packageManager: ProjectPackageManager;
	addons?: ProjectAddons[];
}) {
	const s = spinner();

	try {
		s.start(`Running ${packageManager} install...`);

		await $({
			cwd: projectDir,
			stderr: "inherit",
		})`${packageManager} install`;

		s.stop("Dependencies installed successfully");

		if (addons.includes("biome") || addons.includes("husky")) {
			await runBiomeCheck(projectDir, packageManager);
		}
	} catch (error) {
		s.stop(pc.red("Failed to install dependencies"));
		if (error instanceof Error) {
			consola.error(pc.red(`Installation error: ${error.message}`));
		}
	}
}

async function runBiomeCheck(
	projectDir: string,
	packageManager: ProjectPackageManager,
) {
	const s = spinner();

	try {
		s.start("Running Biome format check...");

		await $({
			cwd: projectDir,
			stderr: "inherit",
		})`${packageManager} biome check --write .`;

		s.stop("Biome check completed successfully");
	} catch (error) {
		s.stop(pc.yellow("Biome check encountered issues"));
		log.warn(pc.yellow("Some files may need manual formatting"));
	}
}
