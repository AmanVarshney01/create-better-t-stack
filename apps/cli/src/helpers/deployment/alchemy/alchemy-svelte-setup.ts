import path from "node:path";
import fs from "fs-extra";
import { IndentationText, Node, Project, QuoteKind } from "ts-morph";
import type { PackageManager } from "../../../types";
import { addPackageDependency } from "../../../utils/add-package-deps";

export async function setupSvelteAlchemyDeploy(
	projectDir: string,
	_packageManager: PackageManager,
) {
	const webAppDir = path.join(projectDir, "apps/web");
	if (!(await fs.pathExists(webAppDir))) return;

	await addPackageDependency({
		devDependencies: ["alchemy", "@sveltejs/adapter-cloudflare"],
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

	// Update Svelte config
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

		// Find and update the adapter import
		const importDeclarations = sourceFile.getImportDeclarations();
		const adapterImport = importDeclarations.find((imp) =>
			imp.getModuleSpecifierValue().includes("@sveltejs/adapter"),
		);

		if (adapterImport) {
			// Change the import to alchemy
			adapterImport.setModuleSpecifier("alchemy/cloudflare/sveltekit");
			// Remove old default import and add new one
			adapterImport.removeDefaultImport();
			adapterImport.setDefaultImport("alchemy");
		} else {
			// Add alchemy import if no adapter import exists
			sourceFile.insertImportDeclaration(0, {
				moduleSpecifier: "alchemy/cloudflare/sveltekit",
				defaultImport: "alchemy",
			});
		}

		// Find the config object
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

function updateAdapterInConfig(configObject: Node): void {
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
