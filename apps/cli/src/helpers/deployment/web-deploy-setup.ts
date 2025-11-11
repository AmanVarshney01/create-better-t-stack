import type { ProjectConfig } from "../../types";
import { addPackageDependency } from "../../utils/add-package-deps";
import { setupCombinedAlchemyDeploy } from "./alchemy/alchemy-combined-setup";
import { setupNextAlchemyDeploy } from "./alchemy/alchemy-next-setup";
import { setupNuxtAlchemyDeploy } from "./alchemy/alchemy-nuxt-setup";
import { setupReactRouterAlchemyDeploy } from "./alchemy/alchemy-react-router-setup";
import { setupSolidAlchemyDeploy } from "./alchemy/alchemy-solid-setup";
import { setupSvelteAlchemyDeploy } from "./alchemy/alchemy-svelte-setup";
import { setupTanStackRouterAlchemyDeploy } from "./alchemy/alchemy-tanstack-router-setup";
import { setupTanStackStartAlchemyDeploy } from "./alchemy/alchemy-tanstack-start-setup";

export async function setupWebDeploy(config: ProjectConfig) {
	const { webDeploy, serverDeploy, frontend, projectDir } = config;
	const { packageManager } = config;

	if (webDeploy === "none") return;

	if (webDeploy !== "alchemy") return;

	if (webDeploy === "alchemy" && serverDeploy === "alchemy") {
		await setupCombinedAlchemyDeploy(projectDir, packageManager, config);
		await addAlchemyPackagesDependencies(projectDir);
		return;
	}

	const isNext = frontend.includes("next");
	const isNuxt = frontend.includes("nuxt");
	const isSvelte = frontend.includes("svelte");
	const isTanstackRouter = frontend.includes("tanstack-router");
	const isTanstackStart = frontend.includes("tanstack-start");
	const isReactRouter = frontend.includes("react-router");
	const isSolid = frontend.includes("solid");

	if (isNext) {
		await setupNextAlchemyDeploy(projectDir, packageManager);
	} else if (isNuxt) {
		await setupNuxtAlchemyDeploy(projectDir, packageManager);
	} else if (isSvelte) {
		await setupSvelteAlchemyDeploy(projectDir, packageManager);
	} else if (isTanstackStart) {
		await setupTanStackStartAlchemyDeploy(projectDir, packageManager);
	} else if (isTanstackRouter) {
		await setupTanStackRouterAlchemyDeploy(projectDir, packageManager);
	} else if (isReactRouter) {
		await setupReactRouterAlchemyDeploy(projectDir, packageManager);
	} else if (isSolid) {
		await setupSolidAlchemyDeploy(projectDir, packageManager);
	}

	await addAlchemyPackagesDependencies(projectDir);
}

async function addAlchemyPackagesDependencies(projectDir: string) {
	await addPackageDependency({
		devDependencies: ["@cloudflare/workers-types"],
		projectDir,
	});
}
