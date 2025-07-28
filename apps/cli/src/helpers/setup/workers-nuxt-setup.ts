import path from "node:path";
import fs from "fs-extra";
import {
	type ArrayLiteralExpression,
	type CallExpression,
	Node,
	type ObjectLiteralExpression,
	type PropertyAssignment,
	SyntaxKind,
} from "ts-morph";
import type { PackageManager } from "../../types";
import { addPackageDependency } from "../../utils/add-package-deps";
import { tsProject } from "../../utils/ts-morph";

export async function setupNuxtWorkersDeploy(
	projectDir: string,
	packageManager: PackageManager,
) {
	const webAppDir = path.join(projectDir, "apps/web");
	if (!(await fs.pathExists(webAppDir))) return;

	await addPackageDependency({
		devDependencies: ["nitro-cloudflare-dev", "wrangler"],
		projectDir: webAppDir,
	});

	const pkgPath = path.join(webAppDir, "package.json");
	if (await fs.pathExists(pkgPath)) {
		const pkg = await fs.readJson(pkgPath);

		pkg.scripts = {
			...pkg.scripts,
			deploy: `${packageManager} run build && wrangler deploy`,
			"cf-typegen": "wrangler types",
		};
		await fs.writeJson(pkgPath, pkg, { spaces: 2 });
	}

	const nuxtConfigPath = path.join(webAppDir, "nuxt.config.ts");
	if (!(await fs.pathExists(nuxtConfigPath))) return;

	const sourceFile = tsProject.addSourceFileAtPathIfExists(nuxtConfigPath);
	if (!sourceFile) return;

	const defineCall = sourceFile
		.getDescendantsOfKind(SyntaxKind.CallExpression)
		.find((expr) => {
			const expression = expr.getExpression();
			return (
				Node.isIdentifier(expression) &&
				expression.getText() === "defineNuxtConfig"
			);
		}) as CallExpression | undefined;

	if (!defineCall) return;

	const configObj = defineCall.getArguments()[0] as
		| ObjectLiteralExpression
		| undefined;
	if (!configObj) return;

	const today = new Date().toISOString().slice(0, 10);

	const compatProp = configObj.getProperty("compatibilityDate");
	if (compatProp && compatProp.getKind() === SyntaxKind.PropertyAssignment) {
		(compatProp as PropertyAssignment).setInitializer(`'${today}'`);
	} else {
		configObj.addPropertyAssignment({
			name: "compatibilityDate",
			initializer: `'${today}'`,
		});
	}

	const nitroInitializer = `{
    preset: "cloudflare_module",
    cloudflare: {
      deployConfig: true,
      nodeCompat: true
    }
  }`;
	const nitroProp = configObj.getProperty("nitro");
	if (nitroProp && nitroProp.getKind() === SyntaxKind.PropertyAssignment) {
		(nitroProp as PropertyAssignment).setInitializer(nitroInitializer);
	} else {
		configObj.addPropertyAssignment({
			name: "nitro",
			initializer: nitroInitializer,
		});
	}

	const modulesProp = configObj.getProperty("modules");
	if (modulesProp && modulesProp.getKind() === SyntaxKind.PropertyAssignment) {
		const arrayExpr = modulesProp.getFirstDescendantByKind(
			SyntaxKind.ArrayLiteralExpression,
		) as ArrayLiteralExpression | undefined;
		if (arrayExpr) {
			const alreadyHas = arrayExpr
				.getElements()
				.some(
					(el) => el.getText().replace(/['"`]/g, "") === "nitro-cloudflare-dev",
				);
			if (!alreadyHas) arrayExpr.addElement("'nitro-cloudflare-dev'");
		}
	} else {
		configObj.addPropertyAssignment({
			name: "modules",
			initializer: "['nitro-cloudflare-dev']",
		});
	}

	await tsProject.save();
}
