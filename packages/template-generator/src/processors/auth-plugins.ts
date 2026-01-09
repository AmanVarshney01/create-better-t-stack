import type { ProjectConfig } from "@better-t-stack/types";

import { Project, SyntaxKind } from "ts-morph";

import type { VirtualFileSystem } from "../core/virtual-fs";

export function processAuthPlugins(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const authIndexPath = "packages/auth/src/index.ts";
  if (!vfs.exists(authIndexPath)) return;

  const content = vfs.readFile(authIndexPath);
  const project = new Project({
    useInMemoryFileSystem: true,
  });

  const sourceFile = project.createSourceFile("index.ts", content);

  const pluginsToAdd: string[] = [];
  const importsToAdd: { named: string; module: string }[] = [];

  // TanStack Start Cookies
  if (config.backend === "self" && config.frontend.includes("tanstack-start")) {
    pluginsToAdd.push("tanstackStartCookies()");
    importsToAdd.push({
      named: "tanstackStartCookies",
      module: "better-auth/tanstack-start",
    });
  }

  // Next.js Cookies
  if (config.backend === "self" && config.frontend.includes("next")) {
    pluginsToAdd.push("nextCookies()");
    importsToAdd.push({
      named: "nextCookies",
      module: "better-auth/next-js",
    });
  }

  // Expo Plugin
  const hasNative = config.frontend.some((f) =>
    ["native-bare", "native-uniwind", "native-unistyles"].includes(f),
  );
  if (hasNative) {
    pluginsToAdd.push("expo()");
    importsToAdd.push({
      named: "expo",
      module: "@better-auth/expo",
    });
  }

  if (pluginsToAdd.length === 0) return;

  // Add imports
  importsToAdd.forEach(({ named, module }) => {
    const existingImport = sourceFile.getImportDeclaration((decl) =>
      decl.getModuleSpecifierValue().includes(module),
    );

    if (existingImport) {
      const namedImports = existingImport.getNamedImports();
      if (!namedImports.some((ni) => ni.getName() === named)) {
        existingImport.addNamedImport(named);
      }
    } else {
      sourceFile.addImportDeclaration({
        moduleSpecifier: module,
        namedImports: [named],
      });
    }
  });

  // Add plugins to betterAuth config
  const betterAuthCall = sourceFile
    .getVariableDeclaration("auth")
    ?.getInitializerIfKind(SyntaxKind.CallExpression);

  if (betterAuthCall) {
    const configObject = betterAuthCall
      .getArguments()[0]
      ?.asKind(SyntaxKind.ObjectLiteralExpression);

    if (configObject) {
      const pluginsProp = configObject.getProperty("plugins");

      if (pluginsProp?.isKind(SyntaxKind.PropertyAssignment)) {
        const arrayLiteral = pluginsProp.getInitializerIfKind(SyntaxKind.ArrayLiteralExpression);
        if (arrayLiteral) {
          pluginsToAdd.forEach((plugin) => {
            arrayLiteral.addElement(plugin);
          });
        }
      } else {
        // Create plugins array if it doesn't exist
        configObject.addPropertyAssignment({
          name: "plugins",
          initializer: `[${pluginsToAdd.join(", ")}]`,
        });
      }
    }
  }

  vfs.writeFile(authIndexPath, sourceFile.getFullText());
}
