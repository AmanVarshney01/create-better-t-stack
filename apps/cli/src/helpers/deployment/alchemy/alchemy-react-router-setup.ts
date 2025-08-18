import path from "node:path";
import fs from "fs-extra";
import { IndentationText, Node, Project, QuoteKind } from "ts-morph";
import type { PackageManager } from "../../../types";
import { addPackageDependency } from "../../../utils/add-package-deps";

export async function setupReactRouterAlchemyDeploy(
	projectDir: string,
	_packageManager: PackageManager,
) {
	const webAppDir = path.join(projectDir, "apps/web");
	if (!(await fs.pathExists(webAppDir))) return;

	await addPackageDependency({
		devDependencies: ["alchemy", "@cloudflare/vite-plugin", "dotenv"],
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
				"alchemy/cloudflare/react-router",
			);
			if (!alchemyImport) {
				sourceFile.addImportDeclaration({
					moduleSpecifier: "alchemy/cloudflare/react-router",
					defaultImport: "alchemy",
				});
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
				const pluginsProperty = configObject.getProperty("plugins");
				if (pluginsProperty && Node.isPropertyAssignment(pluginsProperty)) {
					const initializer = pluginsProperty.getInitializer();
					if (Node.isArrayLiteralExpression(initializer)) {
						const hasCloudflarePlugin = initializer
							.getElements()
							.some((el) => el.getText().includes("cloudflare("));

						if (!hasCloudflarePlugin) {
							initializer.addElement("alchemy()");
						}
					}
				} else if (!pluginsProperty) {
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

	const reactRouterConfigPath = path.join(webAppDir, "react-router.config.ts");
	if (await fs.pathExists(reactRouterConfigPath)) {
		try {
			const project = new Project({
				manipulationSettings: {
					indentationText: IndentationText.TwoSpaces,
					quoteKind: QuoteKind.Double,
				},
			});

			project.addSourceFileAtPath(reactRouterConfigPath);
			const sourceFile = project.getSourceFileOrThrow(reactRouterConfigPath);

			const exportAssignment = sourceFile.getExportAssignment(
				(d) => !d.isExportEquals(),
			);
			if (!exportAssignment) return;

			const configExpression = exportAssignment.getExpression();
			let configObject: Node | undefined;

			if (Node.isObjectLiteralExpression(configExpression)) {
				configObject = configExpression;
			} else if (Node.isSatisfiesExpression(configExpression)) {
				const expression = configExpression.getExpression();
				if (Node.isObjectLiteralExpression(expression)) {
					configObject = expression;
				}
			}

			if (!configObject || !Node.isObjectLiteralExpression(configObject))
				return;

			const futureProperty = configObject.getProperty("future");

			if (!futureProperty) {
				configObject.addPropertyAssignment({
					name: "future",
					initializer: `{
    unstable_viteEnvironmentApi: true,
  }`,
				});
			} else if (Node.isPropertyAssignment(futureProperty)) {
				const futureInitializer = futureProperty.getInitializer();

				if (Node.isObjectLiteralExpression(futureInitializer)) {
					const viteEnvApiProp = futureInitializer.getProperty(
						"unstable_viteEnvironmentApi",
					);

					if (!viteEnvApiProp) {
						futureInitializer.addPropertyAssignment({
							name: "unstable_viteEnvironmentApi",
							initializer: "true",
						});
					} else if (Node.isPropertyAssignment(viteEnvApiProp)) {
						const value = viteEnvApiProp.getInitializer()?.getText();
						if (value === "false") {
							viteEnvApiProp.setInitializer("true");
						}
					}
				}
			}

			await project.save();
		} catch (error) {
			console.warn("Failed to update react-router.config.ts:", error);
		}
	}
}
