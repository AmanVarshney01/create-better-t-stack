import path from "node:path";
import fs from "fs-extra";
import { Project } from "ts-morph";
import type { ProjectConfig } from "../../../types";

const tsProject = new Project({
	useInMemoryFileSystem: false,
	skipAddingFilesFromTsConfig: true,
});

function determineImportPath(
	envDtsPath: string,
	projectDir: string,
	config: ProjectConfig,
): string {
	const { webDeploy, serverDeploy, backend } = config;
	const isBackendSelf = backend === "self";

	let alchemyRunPath: string;

	if (
		webDeploy === "alchemy" &&
		(serverDeploy === "alchemy" || isBackendSelf)
	) {
		// Both web and server are alchemy, or web + backend=self
		if (isBackendSelf) {
			alchemyRunPath = path.join(projectDir, "apps/web/alchemy.run.ts");
		} else {
			alchemyRunPath = path.join(projectDir, "alchemy.run.ts");
		}
	} else if (webDeploy === "alchemy") {
		// Only web is alchemy
		alchemyRunPath = path.join(projectDir, "apps/web/alchemy.run.ts");
	} else if (serverDeploy === "alchemy") {
		// Only server is alchemy
		alchemyRunPath = path.join(projectDir, "apps/server/alchemy.run.ts");
	} else {
		// Should not happen, but fallback
		alchemyRunPath = path.join(projectDir, "alchemy.run.ts");
	}

	// Calculate relative path from env.d.ts to alchemy.run.ts
	const relativePath = path.relative(
		path.dirname(envDtsPath),
		alchemyRunPath.replace(/\.ts$/, ""),
	);

	// Normalize the path for imports (use forward slashes, handle relative paths)
	const importPath = relativePath.startsWith(".")
		? relativePath
		: `./${relativePath}`;

	return importPath.replace(/\\/g, "/");
}

export async function setupEnvDtsImport(
	envDtsPath: string,
	projectDir: string,
	config: ProjectConfig,
) {
	if (!(await fs.pathExists(envDtsPath))) {
		return;
	}

	const importPath = determineImportPath(envDtsPath, projectDir, config);

	const sourceFile = tsProject.addSourceFileAtPath(envDtsPath);

	const existingImports = sourceFile.getImportDeclarations();
	const alreadyHasImport = existingImports.some(
		(imp) =>
			imp.getModuleSpecifierValue() === importPath &&
			imp.getNamedImports().some((named) => named.getName() === "server"),
	);

	if (!alreadyHasImport) {
		sourceFile.insertImportDeclaration(0, {
			moduleSpecifier: importPath,
			namedImports: [{ name: "server", isTypeOnly: true }],
		});
	}

	await sourceFile.save();
}
