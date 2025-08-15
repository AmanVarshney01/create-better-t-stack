import path from "node:path";
import fs from "fs-extra";
import type { Frontend, PackageManager, ProjectConfig } from "../../types";
import { addPackageDependency } from "../../utils/add-package-deps";
import { setupNuxtWorkersDeploy } from "../workers/workers-nuxt-setup";
import { setupSvelteWorkersDeploy } from "../workers/workers-svelte-setup";
import { setupTanstackStartWorkersDeploy } from "../workers/workers-tanstack-start-setup";
import { setupWorkersVitePlugin } from "../workers/workers-vite-setup";

export async function setupWebDeploy(config: ProjectConfig) {
	const { webDeploy, frontend, projectDir } = config;
	const { packageManager } = config;

	if (webDeploy === "none") return;

	if (webDeploy !== "workers" && webDeploy !== "alchemy") return;

	const isNext = frontend.includes("next");
	const isNuxt = frontend.includes("nuxt");
	const isSvelte = frontend.includes("svelte");
	const isTanstackRouter = frontend.includes("tanstack-router");
	const isTanstackStart = frontend.includes("tanstack-start");
	const isReactRouter = frontend.includes("react-router");
	const isSolid = frontend.includes("solid");

	if (webDeploy === "workers") {
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
		await setupAlchemyWebDeploy(projectDir, packageManager, frontend);
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

async function setupAlchemyWebDeploy(
	_projectDir: string,
	_pkgManager: PackageManager,
	_frontend: Frontend[],
) {
	// no-op; user will handle Alchemy web deployment setup
	return;
}

async function setupNextWorkersDeploy(
	projectDir: string,
	_packageManager: PackageManager,
) {
	const webAppDir = path.join(projectDir, "apps/web");
	if (!(await fs.pathExists(webAppDir))) return;

	await addPackageDependency({
		dependencies: ["@opennextjs/cloudflare"],
		devDependencies: ["wrangler"],
		projectDir: webAppDir,
	});

	const packageJsonPath = path.join(webAppDir, "package.json");
	if (await fs.pathExists(packageJsonPath)) {
		const pkg = await fs.readJson(packageJsonPath);

		pkg.scripts = {
			...pkg.scripts,
			preview: "opennextjs-cloudflare build && opennextjs-cloudflare preview",
			deploy: "opennextjs-cloudflare build && opennextjs-cloudflare deploy",
			upload: "opennextjs-cloudflare build && opennextjs-cloudflare upload",
			"cf-typegen":
				"wrangler types --env-interface CloudflareEnv cloudflare-env.d.ts",
		};

		await fs.writeJson(packageJsonPath, pkg, { spaces: 2 });
	}
}
