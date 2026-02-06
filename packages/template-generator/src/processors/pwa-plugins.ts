import type { ProjectConfig } from "@better-t-stack/types";

import { IndentationText, Node, Project, QuoteKind } from "ts-morph";

import type { VirtualFileSystem } from "../core/virtual-fs";

export function processPwaPlugins(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const { addons, projectName } = config;

  if (!addons.includes("pwa")) return;

  const viteConfigPath = "apps/web/vite.config.ts";
  if (!vfs.exists(viteConfigPath)) return;

  const content = vfs.readFile(viteConfigPath);
  const project = new Project({
    useInMemoryFileSystem: true,
    manipulationSettings: {
      indentationText: IndentationText.TwoSpaces,
      quoteKind: QuoteKind.Double,
    },
  });

  const sourceFile = project.createSourceFile("vite.config.ts", content);

  const hasImport = sourceFile
    .getImportDeclarations()
    .some((imp) => imp.getModuleSpecifierValue() === "vite-plugin-pwa");

  if (!hasImport) {
    sourceFile.addImportDeclaration({
      namedImports: ["VitePWA"],
      moduleSpecifier: "vite-plugin-pwa",
    });
  }

  const exportAssignment = sourceFile.getExportAssignment((d) => !d.isExportEquals());
  if (!exportAssignment) return;

  const defineConfigCall = exportAssignment.getExpression();
  if (
    !Node.isCallExpression(defineConfigCall) ||
    defineConfigCall.getExpression().getText() !== "defineConfig"
  ) {
    return;
  }

  let configObject = defineConfigCall.getArguments()[0];
  if (!configObject) {
    configObject = defineConfigCall.addArgument("{}");
  }

  if (Node.isObjectLiteralExpression(configObject)) {
    const pluginsProperty = configObject.getProperty("plugins");

    const pwaConfig = `VitePWA({
  registerType: "autoUpdate",
  manifest: {
    name: "${projectName}",
    short_name: "${projectName}",
    description: "${projectName} - PWA Application",
    theme_color: "#0c0c0c",
  },
  pwaAssets: { disabled: false, config: true },
  devOptions: { enabled: true },
})`;

    if (pluginsProperty && Node.isPropertyAssignment(pluginsProperty)) {
      const initializer = pluginsProperty.getInitializer();
      if (Node.isArrayLiteralExpression(initializer)) {
        const hasPwa = initializer.getElements().some((el) => el.getText().startsWith("VitePWA("));
        if (!hasPwa) {
          initializer.addElement(pwaConfig);
        }
      }
    } else {
      configObject.addPropertyAssignment({
        name: "plugins",
        initializer: `[${pwaConfig}]`,
      });
    }
  }

  vfs.writeFile(viteConfigPath, sourceFile.getFullText());
}
