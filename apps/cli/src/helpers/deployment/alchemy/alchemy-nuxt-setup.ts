import path from "node:path";
import fs from "fs-extra";
import { IndentationText, Node, Project, QuoteKind } from "ts-morph";
import type { PackageManager } from "../../../types";
import { addPackageDependency } from "../../../utils/add-package-deps";

export async function setupNuxtAlchemyDeploy(
	projectDir: string,
	_packageManager: PackageManager,
	options?: { skipAppScripts?: boolean },
) {
	const webAppDir = path.join(projectDir, "apps/web");
	if (!(await fs.pathExists(webAppDir))) return;

	await addPackageDependency({
		devDependencies: ["alchemy", "nitro-cloudflare-dev", "dotenv", "wrangler"],
		projectDir: webAppDir,
	});

	const pkgPath = path.join(webAppDir, "package.json");
	if (await fs.pathExists(pkgPath)) {
		const pkg = await fs.readJson(pkgPath);

		if (!options?.skipAppScripts) {
			pkg.scripts = {
				...pkg.scripts,
				deploy: "alchemy deploy",
				destroy: "alchemy destroy",
			};
		}
		await fs.writeJson(pkgPath, pkg, { spaces: 2 });
	}

	const nuxtConfigPath = path.join(webAppDir, "nuxt.config.ts");
	if (!(await fs.pathExists(nuxtConfigPath))) return;

	try {
		const project = new Project({
			manipulationSettings: {
				indentationText: IndentationText.TwoSpaces,
				quoteKind: QuoteKind.Double,
			},
		});

		project.addSourceFileAtPath(nuxtConfigPath);
		const sourceFile = project.getSourceFileOrThrow(nuxtConfigPath);

		const exportAssignment = sourceFile.getExportAssignment(
			(d) => !d.isExportEquals(),
		);
		if (!exportAssignment) return;

		const defineConfigCall = exportAssignment.getExpression();
		if (
			!Node.isCallExpression(defineConfigCall) ||
			defineConfigCall.getExpression().getText() !== "defineNuxtConfig"
		)
			return;

		let configObject = defineConfigCall.getArguments()[0];
		if (!configObject) {
			configObject = defineConfigCall.addArgument("{}");
		}

		if (Node.isObjectLiteralExpression(configObject)) {
			if (!configObject.getProperty("nitro")) {
				configObject.addPropertyAssignment({
					name: "nitro",
					initializer: `{
    preset: "cloudflare_module",
    cloudflare: {
      deployConfig: true,
      nodeCompat: true
    }
  }`,
				});
			}

			const modulesProperty = configObject.getProperty("modules");
			if (modulesProperty && Node.isPropertyAssignment(modulesProperty)) {
				const initializer = modulesProperty.getInitializer();
				if (Node.isArrayLiteralExpression(initializer)) {
					const hasModule = initializer
						.getElements()
						.some(
							(el) =>
								el.getText() === '"nitro-cloudflare-dev"' ||
								el.getText() === "'nitro-cloudflare-dev'",
						);
					if (!hasModule) {
						initializer.addElement('"nitro-cloudflare-dev"');
					}
				}
			} else if (!modulesProperty) {
				configObject.addPropertyAssignment({
					name: "modules",
					initializer: '["nitro-cloudflare-dev"]',
				});
			}
		}

		await project.save();
	} catch (error) {
		console.warn("Failed to update nuxt.config.ts:", error);
	}
}
