import consola from "consola";
import pc from "picocolors";
import type { ProjectConfig } from "../../types";
import { addPackageDependency } from "../../utils/add-package-deps";

export async function setupFrontendDependencies(config: ProjectConfig) {
	const { frontend, projectDir } = config;

	// Check if nativewind is being used
	const hasNativeWind = frontend.includes("native-nativewind");
	const hasUnistyles = frontend.includes("native-unistyles");

	consola.info(`Frontend: ${frontend.join(", ")}`);
	consola.info(`Has NativeWind: ${hasNativeWind}`);
	consola.info(`Project Dir: ${projectDir}`);

	if (hasNativeWind) {
		try {
			consola.info("Adding TailwindCSS dependencies...");
			// Add TailwindCSS and related dependencies to root package.json
			await addPackageDependency({
				devDependencies: ["autoprefixer", "postcss", "tailwindcss"],
				projectDir,
			});

			consola.success(
				pc.green("Added TailwindCSS dependencies to root package.json"),
			);
		} catch (error) {
			consola.error(pc.red("Failed to add TailwindCSS dependencies"));
			if (error instanceof Error) {
				consola.error(pc.red(error.message));
			}
		}
	} else {
		consola.info("NativeWind not detected, skipping TailwindCSS dependencies");
	}
}
