import path from "node:path";
import fs from "fs-extra";
import type { PackageManager, ProjectConfig } from "../../../types";
import { addPackageDependency } from "../../../utils/add-package-deps";
import { setupAlchemyServerDeploy } from "../server-deploy-setup";
import { setupNextAlchemyDeploy } from "./alchemy-next-setup";
import { setupNuxtAlchemyDeploy } from "./alchemy-nuxt-setup";
import { setupReactRouterAlchemyDeploy } from "./alchemy-react-router-setup";
import { setupSolidAlchemyDeploy } from "./alchemy-solid-setup";
import { setupSvelteAlchemyDeploy } from "./alchemy-svelte-setup";
import { setupTanStackRouterAlchemyDeploy } from "./alchemy-tanstack-router-setup";
import { setupTanStackStartAlchemyDeploy } from "./alchemy-tanstack-start-setup";

export async function setupCombinedAlchemyDeploy(
	projectDir: string,
	packageManager: PackageManager,
	config: ProjectConfig,
) {
	await addPackageDependency({
		devDependencies: ["alchemy"],
		projectDir,
	});

	const rootPkgPath = path.join(projectDir, "package.json");
	if (await fs.pathExists(rootPkgPath)) {
		const pkg = await fs.readJson(rootPkgPath);

		pkg.scripts = {
			...pkg.scripts,
			deploy: "alchemy deploy",
			destroy: "alchemy destroy",
			dev: "alchemy dev",
		};
		await fs.writeJson(rootPkgPath, pkg, { spaces: 2 });
	}

	const serverDir = path.join(projectDir, "apps/server");
	if (await fs.pathExists(serverDir)) {
		await setupAlchemyServerDeploy(serverDir, projectDir);
	}

	const frontend = config.frontend;
	const isNext = frontend.includes("next");
	const isNuxt = frontend.includes("nuxt");
	const isSvelte = frontend.includes("svelte");
	const isTanstackRouter = frontend.includes("tanstack-router");
	const isTanstackStart = frontend.includes("tanstack-start");
	const isReactRouter = frontend.includes("react-router");
	const isSolid = frontend.includes("solid");

	if (isNext) {
		await setupNextAlchemyDeploy(projectDir, packageManager, {
			skipAppScripts: true,
		});
	} else if (isNuxt) {
		await setupNuxtAlchemyDeploy(projectDir, packageManager, {
			skipAppScripts: true,
		});
	} else if (isSvelte) {
		await setupSvelteAlchemyDeploy(projectDir, packageManager, {
			skipAppScripts: true,
		});
	} else if (isTanstackStart) {
		await setupTanStackStartAlchemyDeploy(projectDir, packageManager, {
			skipAppScripts: true,
		});
	} else if (isTanstackRouter) {
		await setupTanStackRouterAlchemyDeploy(projectDir, packageManager, {
			skipAppScripts: true,
		});
	} else if (isReactRouter) {
		await setupReactRouterAlchemyDeploy(projectDir, packageManager, {
			skipAppScripts: true,
		});
	} else if (isSolid) {
		await setupSolidAlchemyDeploy(projectDir, packageManager, {
			skipAppScripts: true,
		});
	}
}
