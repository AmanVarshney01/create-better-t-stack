import path from "node:path";
import fs from "fs-extra";
import { IndentationText, Node, Project, QuoteKind } from "ts-morph";
import type { PackageManager } from "../../../types";
import { addPackageDependency } from "../../../utils/add-package-deps";

export async function setupSvelteAlchemyDeploy(
	projectDir: string,
	_packageManager: PackageManager,
	options?: { skipAppScripts?: boolean },
) {
	const webAppDir = path.join(projectDir, "apps/web");
	if (!(await fs.pathExists(webAppDir))) return;

	await addPackageDependency({
		devDependencies: ["alchemy", "@sveltejs/adapter-cloudflare", "dotenv"],
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

	const svelteConfigPath = path.join(webAppDir, "svelte.config.js");
	if (!(await fs.pathExists(svelteConfigPath))) return;

	try {
		const project = new Project({
			manipulationSettings: {
				indentationText: IndentationText.TwoSpaces,
				quoteKind: QuoteKind.Single,
			},
		});

		project.addSourceFileAtPath(svelteConfigPath);
		const sourceFile = project.getSourceFileOrThrow(svelteConfigPath);

		const importDeclarations = sourceFile.getImportDeclarations();
		const adapterImport = importDeclarations.find((imp) =>
			imp.getModuleSpecifierValue().includes("@sveltejs/adapter"),
		);

		if (adapterImport) {
			adapterImport.setModuleSpecifier("alchemy/cloudflare/sveltekit");
			adapterImport.removeDefaultImport();
			adapterImport.setDefaultImport("alchemy");
		} else {
			sourceFile.insertImportDeclaration(0, {
				moduleSpecifier: "alchemy/cloudflare/sveltekit",
				defaultImport: "alchemy",
			});
		}

		const configVariable = sourceFile.getVariableDeclaration("config");
		if (configVariable) {
			const initializer = configVariable.getInitializer();
			if (Node.isObjectLiteralExpression(initializer)) {
				updateAdapterInConfig(initializer);
			}
		}

		await project.save();
	} catch (error) {
		console.warn("Failed to update svelte.config.js:", error);
	}
}

function updateAdapterInConfig(configObject: Node) {
	if (!Node.isObjectLiteralExpression(configObject)) return;

	const kitProperty = configObject.getProperty("kit");
	if (kitProperty && Node.isPropertyAssignment(kitProperty)) {
		const kitInitializer = kitProperty.getInitializer();
		if (Node.isObjectLiteralExpression(kitInitializer)) {
			const adapterProperty = kitInitializer.getProperty("adapter");
			if (adapterProperty && Node.isPropertyAssignment(adapterProperty)) {
				const initializer = adapterProperty.getInitializer();
				if (Node.isCallExpression(initializer)) {
					const expression = initializer.getExpression();
					if (
						Node.isIdentifier(expression) &&
						expression.getText() === "adapter"
					) {
						expression.replaceWithText("alchemy");
					}
				}
			}
		}
	}
}
