import path from "node:path";
import fs from "fs-extra";
import { type ImportDeclaration, Project } from "ts-morph";
import type { PackageManager } from "../../types";
import { addPackageDependency } from "../../utils/add-package-deps";

export async function setupSvelteWorkersDeploy(
	projectDir: string,
	packageManager: PackageManager,
): Promise<void> {
	const webAppDir = path.join(projectDir, "apps/web");
	if (!(await fs.pathExists(webAppDir))) return;

	// 1. Add required dev dependencies
	await addPackageDependency({
		devDependencies: ["@sveltejs/adapter-cloudflare", "wrangler"],
		projectDir: webAppDir,
	});

	// 2. Update package.json scripts
	const pkgPath = path.join(webAppDir, "package.json");
	if (await fs.pathExists(pkgPath)) {
		const pkg = await fs.readJson(pkgPath);
		pkg.scripts = {
			...pkg.scripts,
			deploy: `${packageManager} run build && wrangler deploy`,
			"cf-typegen": "wrangler types ./src/worker-configuration.d.ts",
		};
		await fs.writeJson(pkgPath, pkg, { spaces: 2 });
	}

	const possibleConfigFiles = [
		path.join(webAppDir, "svelte.config.js"),
		path.join(webAppDir, "svelte.config.ts"),
	];

	const existingConfigPath = (
		await Promise.all(
			possibleConfigFiles.map(async (p) => ((await fs.pathExists(p)) ? p : "")),
		)
	).find((p) => p);

	if (existingConfigPath) {
		const project = new Project({
			useInMemoryFileSystem: false,
			skipAddingFilesFromTsConfig: true,
		});
		const sourceFile = project.addSourceFileAtPath(existingConfigPath);

		const adapterImport = sourceFile
			.getImportDeclarations()
			.find((imp: ImportDeclaration) =>
				["@sveltejs/adapter-auto", "@sveltejs/adapter-node"].includes(
					imp.getModuleSpecifierValue(),
				),
			);

		if (adapterImport) {
			adapterImport.setModuleSpecifier("@sveltejs/adapter-cloudflare");
		} else {
			// If the adapter-auto import didn't exist, ensure Cloudflare adapter is imported
			const alreadyHasCloudflare = sourceFile
				.getImportDeclarations()
				.some(
					(imp) =>
						imp.getModuleSpecifierValue() === "@sveltejs/adapter-cloudflare",
				);
			if (!alreadyHasCloudflare) {
				sourceFile.insertImportDeclaration(0, {
					defaultImport: "adapter",
					moduleSpecifier: "@sveltejs/adapter-cloudflare",
				});
			}
		}

		// Save modifications
		await sourceFile.save();
	}
}
