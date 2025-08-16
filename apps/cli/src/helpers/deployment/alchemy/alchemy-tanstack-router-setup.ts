import path from "node:path";
import fs from "fs-extra";
import { IndentationText, Node, Project, QuoteKind } from "ts-morph";
import type { PackageManager } from "../../../types";
import { addPackageDependency } from "../../../utils/add-package-deps";

export async function setupTanStackRouterAlchemyDeploy(
	projectDir: string,
	_packageManager: PackageManager,
) {
	const webAppDir = path.join(projectDir, "apps/web");
	if (!(await fs.pathExists(webAppDir))) return;

	await addPackageDependency({
		devDependencies: ["alchemy", "@cloudflare/vite-plugin"],
		projectDir: webAppDir,
	});

	const pkgPath = path.join(webAppDir, "package.json");
	if (await fs.pathExists(pkgPath)) {
		const pkg = await fs.readJson(pkgPath);

		pkg.scripts = {
			...pkg.scripts,
			deploy: "alchemy deploy",
			destroy: "alchemy destroy",
			"alchemy:dev": "alchemy dev",
		};
		await fs.writeJson(pkgPath, pkg, { spaces: 2 });
	}

	// Update Vite config
	const viteConfigPath = path.join(webAppDir, "vite.config.ts");
	if (await fs.pathExists(viteConfigPath)) {
		try {
			const project = new Project({
				manipulationSettings: {
					indentationText: IndentationText.TwoSpaces,
					quoteKind: QuoteKind.Double,
				},
			});

			project.addSourceFileAtPath(viteConfigPath);
			const sourceFile = project.getSourceFileOrThrow(viteConfigPath);

			// Add alchemy import
			const alchemyImport = sourceFile.getImportDeclaration(
				"alchemy/cloudflare/vite",
			);
			if (!alchemyImport) {
				sourceFile.addImportDeclaration({
					moduleSpecifier: "alchemy/cloudflare/vite",
					defaultImport: "alchemy",
				});
			}

			// Find the defineConfig call
			const exportAssignment = sourceFile.getExportAssignment(
				(d) => !d.isExportEquals(),
			);
			if (!exportAssignment) return;

			const defineConfigCall = exportAssignment.getExpression();
			if (
				!Node.isCallExpression(defineConfigCall) ||
				defineConfigCall.getExpression().getText() !== "defineConfig"
			)
				return;

			let configObject = defineConfigCall.getArguments()[0];
			if (!configObject) {
				configObject = defineConfigCall.addArgument("{}");
			}

			if (Node.isObjectLiteralExpression(configObject)) {
				const pluginsProperty = configObject.getProperty("plugins");
				if (pluginsProperty && Node.isPropertyAssignment(pluginsProperty)) {
					const initializer = pluginsProperty.getInitializer();
					if (Node.isArrayLiteralExpression(initializer)) {
						// Check if cloudflare plugin is already configured
						const hasCloudflarePlugin = initializer
							.getElements()
							.some((el) => el.getText().includes("cloudflare("));

						if (!hasCloudflarePlugin) {
							// Add cloudflare plugin
							initializer.addElement("alchemy()");
						}
					}
				} else if (!pluginsProperty) {
					// If no plugins property exists, create one with cloudflare plugin
					configObject.addPropertyAssignment({
						name: "plugins",
						initializer: "[alchemy()]",
					});
				}
			}

			await project.save();
		} catch (error) {
			console.warn("Failed to update vite.config.ts:", error);
		}
	}
}
