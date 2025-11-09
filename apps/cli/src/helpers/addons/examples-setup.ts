import path from "node:path";
import fs from "fs-extra";
import type { AvailableDependencies } from "../../constants";
import type { ProjectConfig } from "../../types";
import { addPackageDependency } from "../../utils/add-package-deps";

export async function setupExamples(config: ProjectConfig) {
	const { examples, frontend, backend, projectDir, orm } = config;

	if (
		backend === "convex" ||
		!examples ||
		examples.length === 0 ||
		examples[0] === "none"
	) {
		return;
	}

	const apiDir = path.join(projectDir, "packages/api");
	const apiDirExists = await fs.pathExists(apiDir);

	if (apiDirExists && backend !== "none") {
		if (orm === "drizzle") {
			await addPackageDependency({
				dependencies: ["drizzle-orm"],
				projectDir: apiDir,
			});
		} else if (orm === "prisma") {
			await addPackageDependency({
				dependencies: ["@prisma/client"],
				projectDir: apiDir,
			});
		} else if (orm === "mongoose") {
			await addPackageDependency({
				dependencies: ["mongoose"],
				projectDir: apiDir,
			});
		}
	}

	if (examples.includes("ai")) {
		const webClientDir = path.join(projectDir, "apps/web");
		const nativeClientDir = path.join(projectDir, "apps/native");
		const apiDir = path.join(projectDir, "packages/api");

		const webClientDirExists = await fs.pathExists(webClientDir);
		const nativeClientDirExists = await fs.pathExists(nativeClientDir);
		const apiDirExists = await fs.pathExists(apiDir);

		const hasNuxt = frontend.includes("nuxt");
		const hasSvelte = frontend.includes("svelte");
		const hasReactWeb =
			frontend.includes("react-router") ||
			frontend.includes("tanstack-router") ||
			frontend.includes("next") ||
			frontend.includes("tanstack-start");
		const hasNext = frontend.includes("next");
		const hasReactNative =
			frontend.includes("native-bare") ||
			frontend.includes("native-uniwind") ||
			frontend.includes("native-unistyles");

		if (webClientDirExists) {
			const dependencies: AvailableDependencies[] = ["ai"];
			if (hasNuxt) {
				dependencies.push("@ai-sdk/vue");
			} else if (hasSvelte) {
				dependencies.push("@ai-sdk/svelte");
			} else if (hasReactWeb) {
				dependencies.push("@ai-sdk/react", "streamdown");
			}

			if (hasNext) {
				dependencies.push("shiki");
			}

			await addPackageDependency({
				dependencies,
				projectDir: webClientDir,
			});
		}

		if (nativeClientDirExists && hasReactNative) {
			await addPackageDependency({
				dependencies: ["ai", "@ai-sdk/react"],
				projectDir: nativeClientDir,
			});
		}

		if (apiDirExists && backend !== "none") {
			await addPackageDependency({
				dependencies: ["ai", "@ai-sdk/google"],
				projectDir: apiDir,
			});
		}

		if (backend === "self" && webClientDirExists) {
			await addPackageDependency({
				dependencies: ["ai", "@ai-sdk/google"],
				projectDir: webClientDir,
			});
		}
	}
}
