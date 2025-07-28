import {
	type CallExpression,
	Node,
	type ObjectLiteralExpression,
	SyntaxKind,
} from "ts-morph";
import { ensureArrayProperty, tsProject } from "../../utils/ts-morph";

export async function addPwaToViteConfig(
	viteConfigPath: string,
	projectName: string,
) {
	const sourceFile = tsProject.addSourceFileAtPathIfExists(viteConfigPath);
	if (!sourceFile) {
		throw new Error("vite config not found");
	}

	const hasImport = sourceFile
		.getImportDeclarations()
		.some((imp) => imp.getModuleSpecifierValue() === "vite-plugin-pwa");

	if (!hasImport) {
		sourceFile.insertImportDeclaration(0, {
			namedImports: ["VitePWA"],
			moduleSpecifier: "vite-plugin-pwa",
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

	const alreadyPresent = pluginsArray
		.getElements()
		.some((el) => el.getText().startsWith("VitePWA("));

	if (!alreadyPresent) {
		pluginsArray.addElement(
			`VitePWA({
  registerType: "autoUpdate",
  manifest: {
    name: "${projectName}",
    short_name: "${projectName}",
    description: "${projectName} - PWA Application",
    theme_color: "#0c0c0c",
  },
  pwaAssets: { disabled: false, config: true },
  devOptions: { enabled: true },
})`,
		);
	}

	await tsProject.save();
}
