import path from "node:path";
import fs from "fs-extra";
import {
	type CallExpression,
	Node,
	type ObjectLiteralExpression,
	SyntaxKind,
} from "ts-morph";
import type { PackageManager } from "../../../types";
import { addPackageDependency } from "../../../utils/add-package-deps";
import { ensureArrayProperty, tsProject } from "../../../utils/ts-morph";

export async function setupTanstackStartWorkersDeploy(
	projectDir: string,
	packageManager: PackageManager,
) {
	const webAppDir = path.join(projectDir, "apps/web");
	if (!(await fs.pathExists(webAppDir))) return;

	await addPackageDependency({
		devDependencies: ["wrangler", "@cloudflare/vite-plugin"],
		projectDir: webAppDir,
	});

	const pkgPath = path.join(webAppDir, "package.json");
	if (await fs.pathExists(pkgPath)) {
		const pkg = await fs.readJson(pkgPath);
		pkg.scripts = {
			...pkg.scripts,
			deploy: `${packageManager} run build && wrangler deploy`,
			"cf-typegen": "wrangler types --env-interface Env",
		};
		await fs.writeJson(pkgPath, pkg, { spaces: 2 });
	}

	const viteConfigPath = path.join(webAppDir, "vite.config.ts");
	if (!(await fs.pathExists(viteConfigPath))) return;

	const sourceFile = tsProject.addSourceFileAtPathIfExists(viteConfigPath);
	if (!sourceFile) return;

	const cfImport = sourceFile.getImportDeclaration("@cloudflare/vite-plugin");
	if (!cfImport) {
		sourceFile.addImportDeclaration({
			moduleSpecifier: "@cloudflare/vite-plugin",
			namedImports: [{ name: "cloudflare" }],
		});
	} else if (
		!cfImport.getNamedImports().some((ni) => ni.getName() === "cloudflare")
	) {
		cfImport.addNamedImport({ name: "cloudflare" });
	}

	const reactImport = sourceFile.getImportDeclaration("@vitejs/plugin-react");
	let reactPluginIdentifier = "viteReact";
	if (!reactImport) {
		sourceFile.addImportDeclaration({
			moduleSpecifier: "@vitejs/plugin-react",
			defaultImport: "viteReact",
		});
	} else {
		const defaultImport = reactImport.getDefaultImport();
		if (defaultImport) {
			reactPluginIdentifier = defaultImport.getText();
		} else {
			reactImport.setDefaultImport("viteReact");
		}
	}

	const defineCall = sourceFile
		.getDescendantsOfKind(SyntaxKind.CallExpression)
		.find((expr) => {
			const expression = expr.getExpression();
			return (
				Node.isIdentifier(expression) && expression.getText() === "defineConfig"
			);
		}) as CallExpression | undefined;

	if (!defineCall) return;

	const configObj = defineCall.getArguments()[0] as
		| ObjectLiteralExpression
		| undefined;
	if (!configObj) return;

	const pluginsArray = ensureArrayProperty(configObj, "plugins");

	const hasCloudflare = pluginsArray
		.getElements()
		.some((el) => el.getText().includes("cloudflare("));
	if (!hasCloudflare) {
		pluginsArray.insertElement(
			0,
			"cloudflare({ viteEnvironment: { name: 'ssr' } })",
		);
	}

	const hasReactPlugin = pluginsArray
		.getElements()
		.some(
			(el) =>
				Node.isCallExpression(el) &&
				el.getExpression().getText() === reactPluginIdentifier,
		);
	if (!hasReactPlugin) {
		const nextIndex =
			pluginsArray
				.getElements()
				.findIndex((el) => el.getText().includes("tanstackStart(")) + 1;
		if (nextIndex > 0) {
			pluginsArray.insertElement(nextIndex, `${reactPluginIdentifier}()`);
		} else {
			pluginsArray.addElement(`${reactPluginIdentifier}()`);
		}
	}

	await tsProject.save();
}
