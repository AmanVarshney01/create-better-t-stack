import path from "node:path";
import fs from "fs-extra";
import type { AvailableDependencies } from "../../constants";
import type { ProjectConfig } from "../../types";
import { addPackageDependency } from "../../utils/add-package-deps";

export async function setupExamples(config: ProjectConfig) {
	const { examples, frontend, backend, projectDir } = config;

	if (
		backend === "convex" ||
		!examples ||
		examples.length === 0 ||
		examples[0] === "none"
	) {
		return;
	}

	if (examples.includes("ai")) {
		const clientDir = path.join(projectDir, "apps/web");
		const serverDir = path.join(projectDir, "apps/server");
		const clientDirExists = await fs.pathExists(clientDir);
		const serverDirExists = await fs.pathExists(serverDir);

		const hasNuxt = frontend.includes("nuxt");
		const hasSvelte = frontend.includes("svelte");
		const hasReact =
			frontend.includes("react-router") ||
			frontend.includes("tanstack-router") ||
			frontend.includes("next") ||
			frontend.includes("tanstack-start") ||
			frontend.includes("native-nativewind") ||
			frontend.includes("native-unistyles");

		if (clientDirExists) {
			const dependencies: AvailableDependencies[] = ["ai"];
			if (hasNuxt) {
				dependencies.push("@ai-sdk/vue");
			} else if (hasSvelte) {
				dependencies.push("@ai-sdk/svelte");
			} else if (hasReact) {
				dependencies.push("@ai-sdk/react");
			}
			await addPackageDependency({
				dependencies,
				projectDir: clientDir,
			});
		}

		if (serverDirExists && backend !== "none") {
			await addPackageDependency({
				dependencies: ["ai", "@ai-sdk/google"],
				projectDir: serverDir,
			});
		}
	}
}
