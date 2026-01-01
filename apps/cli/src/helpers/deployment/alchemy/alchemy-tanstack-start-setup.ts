/**
 * Alchemy TanStack Start setup - CLI-only operations
 * NOTE: Dependencies are handled by template-generator's deploy-deps.ts
 * This only modifies vite.config.ts for "add deploy" command
 */

import fs from "fs-extra";
import path from "node:path";
import { IndentationText, Node, Project, QuoteKind } from "ts-morph";

import type { PackageManager } from "../../../types";

export async function setupTanStackStartAlchemyDeploy(
  projectDir: string,
  _packageManager: PackageManager,
  _options?: { skipAppScripts?: boolean },
) {
  const webAppDir = path.join(projectDir, "apps/web");
  if (!(await fs.pathExists(webAppDir))) return;

  // Dependencies are added by template-generator's deploy-deps.ts
  // This only modifies vite.config.ts for "add deploy" command

  const viteConfigPath = path.join(webAppDir, "vite.config.ts");
  if (await fs.pathExists(viteConfigPath)) {
    try {
      const project = new Project({
        manipulationSettings: {
          indentationText: IndentationText.TwoSpaces,
          quoteKind: QuoteKind.Double,
        },
      });

      project.addSourceFileAtPath(viteConfigPath);
      const sourceFile = project.getSourceFileOrThrow(viteConfigPath);

      const alchemyImport = sourceFile.getImportDeclaration("alchemy/cloudflare/tanstack-start");
      if (!alchemyImport) {
        sourceFile.addImportDeclaration({
          moduleSpecifier: "alchemy/cloudflare/tanstack-start",
          defaultImport: "alchemy",
        });
      } else {
        alchemyImport.setModuleSpecifier("alchemy/cloudflare/tanstack-start");
      }

      const exportAssignment = sourceFile.getExportAssignment((d) => !d.isExportEquals());
      if (!exportAssignment) return;

      const defineConfigCall = exportAssignment.getExpression();
      if (
        !Node.isCallExpression(defineConfigCall) ||
        defineConfigCall.getExpression().getText() !== "defineConfig"
      )
        return;

      let configObject = defineConfigCall.getArguments()[0];
      if (!configObject) {
        configObject = defineConfigCall.addArgument("{}");
      }

      if (Node.isObjectLiteralExpression(configObject)) {
        const pluginsProperty = configObject.getProperty("plugins");
        if (pluginsProperty && Node.isPropertyAssignment(pluginsProperty)) {
          const initializer = pluginsProperty.getInitializer();
          if (Node.isArrayLiteralExpression(initializer)) {
            const hasAlchemy = initializer
              .getElements()
              .some((el) => el.getText().includes("alchemy("));
            if (!hasAlchemy) {
              initializer.addElement("alchemy()");
            }
          }
        } else {
          configObject.addPropertyAssignment({
            name: "plugins",
            initializer: "[alchemy()]",
          });
        }
      }

      await project.save();
    } catch (error) {
      console.warn("Failed to update vite.config.ts:", error);
    }
  }
}
