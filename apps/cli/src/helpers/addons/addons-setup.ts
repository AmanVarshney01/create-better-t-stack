import path from "node:path";
import { log } from "@clack/prompts";
import { execa } from "execa";
import fs from "fs-extra";
import pc from "picocolors";
import { setupFumadocs } from "@/helpers/addons/fumadocs-setup";
import { setupVibeRules } from "@/helpers/addons/ruler-setup";
import { setupStarlight } from "@/helpers/addons/starlight-setup";
import { setupTauri } from "@/helpers/addons/tauri-setup";
import { setupUltracite } from "@/helpers/addons/ultracite-setup";
import { addPwaToViteConfig } from "@/helpers/addons/vite-pwa-setup";
import type { Frontend, PackageManager, ProjectConfig } from "@/types";
import { addPackageDependency } from "@/utils/add-package-deps";
import { getEnabledAddons } from "@/utils/get-enabled-addons";
import {
	getEnabledFrontendFramework,
	getEnabledFrontendFrameworksGroups,
} from "@/utils/get-enabled-frontend";
import { getPackageExecutionCommand } from "@/utils/package-runner";

export async function setupAddons(config: ProjectConfig, isAddCommand = false) {
	const { addons, frontend, projectDir, packageManager } = config;

	const { hasReactFramework } = getEnabledFrontendFrameworksGroups(frontend);
	const { hasNuxt, hasSvelte, hasSolid } =
		getEnabledFrontendFramework(frontend);
	const {
		hasBiome,
		hasHusky,
		hasOxlint,
		hasUltracite,
		hasRuler,
		hasFumadocs,
		hasPwa,
		hasTauri,
		hasStarlight,
		hasTurborepo,
	} = getEnabledAddons(addons);

	if (hasTurborepo) {
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

	if (hasPwa && (hasReactFramework || hasSolid)) {
		await setupPwa(projectDir, frontend);
	}
	if (hasTauri && (hasReactFramework || hasNuxt || hasSvelte || hasSolid)) {
		await setupTauri(config);
	}
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

	if (hasOxlint) {
		await setupOxlint(projectDir, packageManager);
	}
	if (hasStarlight) {
		await setupStarlight(config);
	}

	if (hasRuler) {
		await setupVibeRules(config);
	}
	if (hasFumadocs) {
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
