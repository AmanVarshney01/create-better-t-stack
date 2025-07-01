import {
	type ArrayLiteralExpression,
	type CallExpression,
	type ObjectLiteralExpression,
	Project,
	SyntaxKind,
} from "ts-morph";

export async function addPwaToViteConfig(
	viteConfigPath: string,
	projectName: string,
): Promise<void> {
	const project = new Project({
		useInMemoryFileSystem: false,
	});

	const sourceFile = project.addSourceFileAtPath(viteConfigPath);

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
		.find((expr) => expr.getExpression().getText() === "defineConfig");

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

	let pluginsArray = configObject
		.getProperty("plugins")
		?.getFirstDescendantByKind(SyntaxKind.ArrayLiteralExpression) as
		| ArrayLiteralExpression
		| undefined;

	if (!pluginsArray) {
		pluginsArray = configObject
			.addPropertyAssignment({ name: "plugins", initializer: "[]" })
			.getFirstDescendantByKindOrThrow(
				SyntaxKind.ArrayLiteralExpression,
			) as ArrayLiteralExpression;
	}

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

	await sourceFile.save();
}
