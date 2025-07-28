import path from "node:path";
import { log } from "@clack/prompts";
import { execa } from "execa";
import fs from "fs-extra";
import pc from "picocolors";
import type { Frontend, PackageManager, ProjectConfig } from "../../types";
import { addPackageDependency } from "../../utils/add-package-deps";
import { getPackageExecutionCommand } from "../../utils/package-runner";
import { setupFumadocs } from "./fumadocs-setup";
import { setupStarlight } from "./starlight-setup";
import { setupTauri } from "./tauri-setup";
import { setupUltracite } from "./ultracite-setup";
import { addPwaToViteConfig } from "./vite-pwa-setup";

export async function setupAddons(config: ProjectConfig, isAddCommand = false) {
	const { addons, frontend, projectDir, packageManager } = config;
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
	const hasUltracite = addons.includes("ultracite");
	const hasBiome = addons.includes("biome");
	const hasHusky = addons.includes("husky");
	const hasOxlint = addons.includes("oxlint");

	if (hasUltracite) {
		await setupUltracite(config, hasHusky);
	} else {
		if (hasBiome) {
			await setupBiome(projectDir);
		}
		if (hasHusky) {
			let linter: "biome" | "oxlint" | undefined;
			if (hasOxlint) {
				linter = "oxlint";
			} else if (hasBiome) {
				linter = "biome";
			}
			await setupHusky(projectDir, linter);
		}
	}

	if (addons.includes("oxlint")) {
		await setupOxlint(projectDir, packageManager);
	}
	if (addons.includes("starlight")) {
		await setupStarlight(config);
	}
	if (addons.includes("fumadocs")) {
		await setupFumadocs(config);
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

export async function setupBiome(projectDir: string) {
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

export async function setupHusky(
	projectDir: string,
	linter?: "biome" | "oxlint",
) {
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

		if (linter === "oxlint") {
			packageJson["lint-staged"] = {
				"**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx,vue,astro,svelte}": "oxlint",
			};
		} else if (linter === "biome") {
			packageJson["lint-staged"] = {
				"*.{js,ts,cjs,mjs,d.cts,d.mts,jsx,tsx,json,jsonc}": [
					"biome check --write .",
				],
			};
		} else {
			packageJson["lint-staged"] = {
				"**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx,vue,astro,svelte}": "",
			};
		}

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

async function setupOxlint(projectDir: string, packageManager: PackageManager) {
	await addPackageDependency({
		devDependencies: ["oxlint"],
		projectDir,
	});

	const packageJsonPath = path.join(projectDir, "package.json");
	if (await fs.pathExists(packageJsonPath)) {
		const packageJson = await fs.readJson(packageJsonPath);

		packageJson.scripts = {
			...packageJson.scripts,
			check: "oxlint",
		};

		await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
	}

	const oxlintInitCommand = getPackageExecutionCommand(
		packageManager,
		"oxlint@latest --init",
	);

	await execa(oxlintInitCommand, {
		cwd: projectDir,
		env: { CI: "true" },
		shell: true,
	});
}
