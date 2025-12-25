import fs from "fs-extra";
import path from "node:path";
import { Project } from "ts-morph";

import type { ProjectConfig } from "../../../types";

const tsProject = new Project({
  useInMemoryFileSystem: false,
  skipAddingFilesFromTsConfig: true,
});

function determineImportPath(
  envDtsPath: string,
  projectDir: string,
  _config: ProjectConfig,
): string {
  // alchemy.run.ts is always in packages/infra
  const alchemyRunPath = path.join(projectDir, "packages/infra/alchemy.run.ts");

  // Calculate relative path from env.d.ts to alchemy.run.ts
  const relativePath = path.relative(path.dirname(envDtsPath), alchemyRunPath.replace(/\.ts$/, ""));

  // Normalize the path for imports (use forward slashes, handle relative paths)
  const importPath = relativePath.startsWith(".") ? relativePath : `./${relativePath}`;

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
