import path from "node:path";
import fs from "fs-extra";
import type { PackageManager, ProjectConfig } from "../../types";
import { addPackageDependency } from "../../utils/add-package-deps";
import { setupCombinedAlchemyDeploy } from "./alchemy/alchemy-combined-setup";
import { setupNextAlchemyDeploy } from "./alchemy/alchemy-next-setup";
import { setupNuxtAlchemyDeploy } from "./alchemy/alchemy-nuxt-setup";
import { setupReactRouterAlchemyDeploy } from "./alchemy/alchemy-react-router-setup";
import { setupSolidAlchemyDeploy } from "./alchemy/alchemy-solid-setup";
import { setupSvelteAlchemyDeploy } from "./alchemy/alchemy-svelte-setup";
import { setupTanStackRouterAlchemyDeploy } from "./alchemy/alchemy-tanstack-router-setup";
import { setupTanStackStartAlchemyDeploy } from "./alchemy/alchemy-tanstack-start-setup";
import { setupNextWorkersDeploy } from "./workers/workers-next-setup";
import { setupNuxtWorkersDeploy } from "./workers/workers-nuxt-setup";
import { setupSvelteWorkersDeploy } from "./workers/workers-svelte-setup";
import { setupTanstackStartWorkersDeploy } from "./workers/workers-tanstack-start-setup";
import { setupWorkersVitePlugin } from "./workers/workers-vite-setup";

export async function setupWebDeploy(config: ProjectConfig) {
	const { webDeploy, serverDeploy, frontend, projectDir } = config;
	const { packageManager } = config;

	if (webDeploy === "none") return;

	if (webDeploy !== "wrangler" && webDeploy !== "alchemy") return;

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

		await addAlchemyPackagesDependencies(projectDir);
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

async function addAlchemyPackagesDependencies(projectDir: string) {
	const packages = ["packages/api", "packages/auth", "packages/db"];

	for (const packageName of packages) {
		const packageDir = path.join(projectDir, packageName);
		if (await fs.pathExists(packageDir)) {
			await addPackageDependency({
				devDependencies: ["@cloudflare/workers-types"],
				projectDir: packageDir,
			});
		}
	}
}
