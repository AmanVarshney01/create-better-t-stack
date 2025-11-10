import { SyntaxKind } from "ts-morph";
import type { ProjectConfig } from "../types";
import { ensureArrayProperty, tsProject } from "./ts-morph";

export async function setupBetterAuthPlugins(
	projectDir: string,
	config: ProjectConfig,
) {
	const authIndexPath = `${projectDir}/packages/auth/src/index.ts`;
	const authIndexFile = tsProject.addSourceFileAtPath(authIndexPath);

	if (!authIndexFile) {
		return;
	}

	const pluginsToAdd: string[] = [];
	const importsToAdd: string[] = [];

	if (
		config.backend === "self" &&
		config.frontend?.includes("tanstack-start")
	) {
		pluginsToAdd.push("reactStartCookies()");
		importsToAdd.push(
			'import { reactStartCookies } from "better-auth/react-start";',
		);
	}

	if (config.backend === "self" && config.frontend?.includes("next")) {
		pluginsToAdd.push("nextCookies()");
		importsToAdd.push('import { nextCookies } from "better-auth/next-js";');
	}

	if (
		config.frontend?.includes("native-bare") ||
		config.frontend?.includes("native-uniwind") ||
		config.frontend?.includes("native-unistyles")
	) {
		pluginsToAdd.push("expo()");
		importsToAdd.push('import { expo } from "@better-auth/expo";');
	}

	if (pluginsToAdd.length === 0) {
		return;
	}

	importsToAdd.forEach((importStatement) => {
		const existingImport = authIndexFile.getImportDeclaration((declaration) =>
			declaration
				.getModuleSpecifierValue()
				.includes(importStatement.split('"')[1]),
		);

		if (!existingImport) {
			authIndexFile.insertImportDeclaration(0, {
				moduleSpecifier: importStatement.split('"')[1],
				namedImports: [importStatement.split("{")[1].split("}")[0].trim()],
			});
		}
	});

	const betterAuthCall = authIndexFile
		.getDescendantsOfKind(SyntaxKind.CallExpression)
		.find((call) => call.getExpression().getText() === "betterAuth");

	if (betterAuthCall) {
		const configObject = betterAuthCall.getArguments()[0];

		if (
			configObject &&
			configObject.getKind() === SyntaxKind.ObjectLiteralExpression
		) {
			const objLiteral = configObject.asKindOrThrow(
				SyntaxKind.ObjectLiteralExpression,
			);

			const pluginsArray = ensureArrayProperty(objLiteral, "plugins");

			pluginsToAdd.forEach((plugin) => {
				pluginsArray.addElement(plugin);
			});
		}
	}

	authIndexFile.save();
}
