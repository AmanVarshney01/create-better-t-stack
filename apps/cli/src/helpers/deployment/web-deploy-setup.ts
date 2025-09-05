import path from "node:path";
import fs from "fs-extra";
import { setupCombinedAlchemyDeploy } from "@/helpers/deployment/alchemy/alchemy-combined-setup";
import { setupNextAlchemyDeploy } from "@/helpers/deployment/alchemy/alchemy-next-setup";
import { setupNuxtAlchemyDeploy } from "@/helpers/deployment/alchemy/alchemy-nuxt-setup";
import { setupReactRouterAlchemyDeploy } from "@/helpers/deployment/alchemy/alchemy-react-router-setup";
import { setupSolidAlchemyDeploy } from "@/helpers/deployment/alchemy/alchemy-solid-setup";
import { setupSvelteAlchemyDeploy } from "@/helpers/deployment/alchemy/alchemy-svelte-setup";
import { setupTanStackRouterAlchemyDeploy } from "@/helpers/deployment/alchemy/alchemy-tanstack-router-setup";
import { setupTanStackStartAlchemyDeploy } from "@/helpers/deployment/alchemy/alchemy-tanstack-start-setup";
import { setupNextWorkersDeploy } from "@/helpers/deployment/workers/workers-next-setup";
import { setupNuxtWorkersDeploy } from "@/helpers/deployment/workers/workers-nuxt-setup";
import { setupSvelteWorkersDeploy } from "@/helpers/deployment/workers/workers-svelte-setup";
import { setupTanstackStartWorkersDeploy } from "@/helpers/deployment/workers/workers-tanstack-start-setup";
import { setupWorkersVitePlugin } from "@/helpers/deployment/workers/workers-vite-setup";
import type { PackageManager, ProjectConfig } from "@/types";

export async function setupWebDeploy(config: ProjectConfig) {
	const { webDeploy, serverDeploy, frontend, projectDir } = config;
	const { packageManager } = config;

	if (webDeploy === "none") return;

	if (webDeploy !== "wrangler" && webDeploy !== "alchemy") return;

	if (webDeploy === "alchemy" && serverDeploy === "alchemy") {
		await setupCombinedAlchemyDeploy(projectDir, packageManager, config);
		return;
	}

	const isNext = frontend.includes("next");
	const isNuxt = frontend.includes("nuxt");
	const isSvelte = frontend.includes("svelte");
	const isTanstackRouter = frontend.includes("tanstack-router");
	const isTanstackStart = frontend.includes("tanstack-start");
	const isReactRouter = frontend.includes("react-router");
	const isSolid = frontend.includes("solid");

	if (webDeploy === "wrangler") {
		if (isNext) {
			await setupNextWorkersDeploy(projectDir, packageManager);
		} else if (isNuxt) {
			await setupNuxtWorkersDeploy(projectDir, packageManager);
		} else if (isSvelte) {
			await setupSvelteWorkersDeploy(projectDir, packageManager);
		} else if (isTanstackStart) {
			await setupTanstackStartWorkersDeploy(projectDir, packageManager);
		} else if (isTanstackRouter || isReactRouter || isSolid) {
			await setupWorkersWebDeploy(projectDir, packageManager);
		}
	} else if (webDeploy === "alchemy") {
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
	}
}

async function setupWorkersWebDeploy(
	projectDir: string,
	pkgManager: PackageManager,
) {
	const webAppDir = path.join(projectDir, "apps/web");

	if (!(await fs.pathExists(webAppDir))) {
		return;
	}

	const packageJsonPath = path.join(webAppDir, "package.json");
	if (await fs.pathExists(packageJsonPath)) {
		const packageJson = await fs.readJson(packageJsonPath);

		packageJson.scripts = {
			...packageJson.scripts,
			"wrangler:dev": "wrangler dev --port=3001",
			deploy: `${pkgManager} run build && wrangler deploy`,
		};

		await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
	}

	await setupWorkersVitePlugin(projectDir);
}
