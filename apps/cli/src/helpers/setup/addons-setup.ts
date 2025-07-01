import path from "node:path";
import { log } from "@clack/prompts";
import fs from "fs-extra";
import pc from "picocolors";
import type { Frontend, ProjectConfig } from "../../types";
import { addPackageDependency } from "../../utils/add-package-deps";
import { setupStarlight } from "./starlight-setup";
import { setupTauri } from "./tauri-setup";
import { addPwaToViteConfig } from "./vite-pwa-setup";

export async function setupAddons(config: ProjectConfig, isAddCommand = false) {
	const { addons, frontend, projectDir } = config;
	const hasReactWebFrontend =
		frontend.includes("react-router") ||
		frontend.includes("tanstack-router") ||
		frontend.includes("next");
	const hasNuxtFrontend = frontend.includes("nuxt");
	const hasSvelteFrontend = frontend.includes("svelte");
	const hasSolidFrontend = frontend.includes("solid");
	const hasNextFrontend = frontend.includes("next");

	if (addons.includes("turborepo")) {
		await addPackageDependency({
			devDependencies: ["turbo"],
			projectDir,
		});

		if (isAddCommand) {
			log.info(`${pc.yellow("Update your package.json scripts:")}

${pc.dim("Replace:")} ${pc.yellow('"pnpm -r dev"')} ${pc.dim("→")} ${pc.green(
				'"turbo dev"',
			)}
${pc.dim("Replace:")} ${pc.yellow('"pnpm --filter web dev"')} ${pc.dim(
				"→",
			)} ${pc.green('"turbo -F web dev"')}

${pc.cyan("Docs:")} ${pc.underline("https://turborepo.com/docs")}
		`);
		}
	}

	if (addons.includes("pwa") && (hasReactWebFrontend || hasSolidFrontend)) {
		await setupPwa(projectDir, frontend);
	}
	if (
		addons.includes("tauri") &&
		(hasReactWebFrontend ||
			hasNuxtFrontend ||
			hasSvelteFrontend ||
			hasSolidFrontend ||
			hasNextFrontend)
	) {
		await setupTauri(config);
	}
	if (addons.includes("biome")) {
		await setupBiome(projectDir);
	}
	if (addons.includes("husky")) {
		await setupHusky(projectDir);
	}
	if (addons.includes("starlight")) {
		await setupStarlight(config);
	}
}

function getWebAppDir(projectDir: string, frontends: Frontend[]): string {
	if (
		frontends.some((f) =>
			["react-router", "tanstack-router", "nuxt", "svelte", "solid"].includes(
				f,
			),
		)
	) {
		return path.join(projectDir, "apps/web");
	}
	return path.join(projectDir, "apps/web");
}

async function setupBiome(projectDir: string) {
	await addPackageDependency({
		devDependencies: ["@biomejs/biome"],
		projectDir,
	});

	const packageJsonPath = path.join(projectDir, "package.json");
	if (await fs.pathExists(packageJsonPath)) {
		const packageJson = await fs.readJson(packageJsonPath);

		packageJson.scripts = {
			...packageJson.scripts,
			check: "biome check --write .",
		};

		await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
	}
}

async function setupHusky(projectDir: string) {
	await addPackageDependency({
		devDependencies: ["husky", "lint-staged"],
		projectDir,
	});

	const packageJsonPath = path.join(projectDir, "package.json");
	if (await fs.pathExists(packageJsonPath)) {
		const packageJson = await fs.readJson(packageJsonPath);

		packageJson.scripts = {
			...packageJson.scripts,
			prepare: "husky",
		};

		packageJson["lint-staged"] = {
			"*.{js,ts,cjs,mjs,d.cts,d.mts,jsx,tsx,json,jsonc}": [
				"biome check --write .",
			],
		};

		await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
	}
}

async function setupPwa(projectDir: string, frontends: Frontend[]) {
	const isCompatibleFrontend = frontends.some((f) =>
		["react-router", "tanstack-router", "solid"].includes(f),
	);
	if (!isCompatibleFrontend) return;

	const clientPackageDir = getWebAppDir(projectDir, frontends);

	if (!(await fs.pathExists(clientPackageDir))) {
		return;
	}

	await addPackageDependency({
		dependencies: ["vite-plugin-pwa"],
		devDependencies: ["@vite-pwa/assets-generator"],
		projectDir: clientPackageDir,
	});

	const clientPackageJsonPath = path.join(clientPackageDir, "package.json");
	if (await fs.pathExists(clientPackageJsonPath)) {
		const packageJson = await fs.readJson(clientPackageJsonPath);

		packageJson.scripts = {
			...packageJson.scripts,
			"generate-pwa-assets": "pwa-assets-generator",
		};

		await fs.writeJson(clientPackageJsonPath, packageJson, { spaces: 2 });
	}

	const viteConfigTs = path.join(clientPackageDir, "vite.config.ts");

	if (await fs.pathExists(viteConfigTs)) {
		await addPwaToViteConfig(viteConfigTs, path.basename(projectDir));
	}
}
