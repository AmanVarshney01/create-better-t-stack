import path from "node:path";
import fs from "fs-extra";
import { IndentationText, Node, Project, QuoteKind } from "ts-morph";
import type { PackageManager } from "../../../types";
import { addPackageDependency } from "../../../utils/add-package-deps";

export async function setupTanStackStartAlchemyDeploy(
	projectDir: string,
	_packageManager: PackageManager,
) {
	const webAppDir = path.join(projectDir, "apps/web");
	if (!(await fs.pathExists(webAppDir))) return;

	await addPackageDependency({
		devDependencies: ["alchemy", "nitropack", "dotenv"],
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

			const alchemyImport = sourceFile.getImportDeclaration(
				"alchemy/cloudflare/tanstack-start",
			);
			if (!alchemyImport) {
				sourceFile.addImportDeclaration({
					moduleSpecifier: "alchemy/cloudflare/tanstack-start",
					defaultImport: "alchemy",
				});
			} else {
				alchemyImport.setModuleSpecifier("alchemy/cloudflare/tanstack-start");
			}

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
				if (!configObject.getProperty("build")) {
					configObject.addPropertyAssignment({
						name: "build",
						initializer: `{
    target: "esnext",
    rollupOptions: {
      external: ["node:async_hooks", "cloudflare:workers"],
    },
  }`,
					});
				}

				const pluginsProperty = configObject.getProperty("plugins");
				if (pluginsProperty && Node.isPropertyAssignment(pluginsProperty)) {
					const initializer = pluginsProperty.getInitializer();
					if (Node.isArrayLiteralExpression(initializer)) {
						const hasShim = initializer
							.getElements()
							.some((el) => el.getText().includes("alchemy"));
						if (!hasShim) {
							initializer.addElement("alchemy()");
						}

						const tanstackElements = initializer
							.getElements()
							.filter((el) => el.getText().includes("tanstackStart"));

						tanstackElements.forEach((element) => {
							if (Node.isCallExpression(element)) {
								const args = element.getArguments();
								if (args.length === 0) {
									element.addArgument(`{
      target: "cloudflare-module",
      customViteReactPlugin: true,
    }`);
								} else if (
									args.length === 1 &&
									Node.isObjectLiteralExpression(args[0])
								) {
									const configObj = args[0];
									if (!configObj.getProperty("target")) {
										configObj.addPropertyAssignment({
											name: "target",
											initializer: '"cloudflare-module"',
										});
									}
									if (!configObj.getProperty("customViteReactPlugin")) {
										configObj.addPropertyAssignment({
											name: "customViteReactPlugin",
											initializer: "true",
										});
									}
								}
							}
						});
					}
				} else {
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

	// workaround for tanstack start + workers
	const nitroConfigPath = path.join(webAppDir, "nitro.config.ts");
	const nitroConfigContent = `import { defineNitroConfig } from "nitropack/config";

export default defineNitroConfig({
    preset: "cloudflare-module",
    cloudflare: {
        nodeCompat: true,
    },
});
`;

	await fs.writeFile(nitroConfigPath, nitroConfigContent, "utf-8");
}
