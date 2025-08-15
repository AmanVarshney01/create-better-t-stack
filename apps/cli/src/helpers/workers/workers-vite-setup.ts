import path from "node:path";
import fs from "fs-extra";
import {
	type CallExpression,
	Node,
	type ObjectLiteralExpression,
	SyntaxKind,
} from "ts-morph";
import { addPackageDependency } from "../../utils/add-package-deps";
import { ensureArrayProperty, tsProject } from "../../utils/ts-morph";

export async function setupWorkersVitePlugin(projectDir: string) {
	const webAppDir = path.join(projectDir, "apps/web");
	const viteConfigPath = path.join(webAppDir, "vite.config.ts");

	if (!(await fs.pathExists(viteConfigPath))) {
		throw new Error("vite.config.ts not found in web app directory");
	}

	await addPackageDependency({
		devDependencies: ["@cloudflare/vite-plugin", "wrangler"],
		projectDir: webAppDir,
	});

	const sourceFile = tsProject.addSourceFileAtPathIfExists(viteConfigPath);
	if (!sourceFile) {
		throw new Error("vite.config.ts not found in web app directory");
	}

	const hasCloudflareImport = sourceFile
		.getImportDeclarations()
		.some((imp) => imp.getModuleSpecifierValue() === "@cloudflare/vite-plugin");

	if (!hasCloudflareImport) {
		sourceFile.insertImportDeclaration(0, {
			namedImports: ["cloudflare"],
			moduleSpecifier: "@cloudflare/vite-plugin",
		});
	}

	const defineCall = sourceFile
		.getDescendantsOfKind(SyntaxKind.CallExpression)
		.find((expr) => {
			const expression = expr.getExpression();
			return (
				Node.isIdentifier(expression) && expression.getText() === "defineConfig"
			);
		});

	if (!defineCall) {
		throw new Error("Could not find defineConfig call in vite config");
	}

	const callExpr = defineCall as CallExpression;
	const configObject = callExpr.getArguments()[0] as
		| ObjectLiteralExpression
		| undefined;

	if (!configObject) {
		throw new Error("defineConfig argument is not an object literal");
	}

	const pluginsArray = ensureArrayProperty(configObject, "plugins");

	const hasCloudflarePlugin = pluginsArray
		.getElements()
		.some((el) => el.getText().includes("cloudflare("));

	if (!hasCloudflarePlugin) {
		pluginsArray.addElement("cloudflare()");
	}

	await tsProject.save();
}
