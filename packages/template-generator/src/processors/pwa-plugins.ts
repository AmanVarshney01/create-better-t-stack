import type { ProjectConfig } from "@better-t-stack/types";
import {
  IndentationText,
  Node,
  Project,
  QuoteKind,
  SyntaxKind,
  type ObjectLiteralExpression,
} from "ts-morph";

import type { VirtualFileSystem } from "../core/virtual-fs";

export function processPwaPlugins(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const { addons, projectName } = config;

  if (!addons.includes("pwa")) return;

  processPwaDocument(vfs, config);
  if (config.frontend.includes("next")) processNextPwaConfig(vfs);

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

  const usesSsr = config.frontend.some((frontend) => ["solid", "react-router"].includes(frontend));
  const ssrOptions = usesSsr
    ? `
  includeAssets: ["offline.html"],
  integration: {
    closeBundleOrder: "post",
    configureOptions(viteConfig, options) {
      const outDir = viteConfig.environments.client.build.outDir;
      options.outDir = outDir;
      options.pwaAssets = { ...options.pwaAssets, integration: { outDir } };
    },
  },
  workbox: {
    navigateFallback: null,
    runtimeCaching: [{
      urlPattern: ({ request }) => request.mode === "navigate",
      handler: "NetworkOnly",
      options: { precacheFallback: { fallbackURL: "offline.html" } },
    }],
    globPatterns: ["**/*.{js,css,html,png,svg,ico}"],
  },`
    : `
  workbox: { globPatterns: ["**/*.{js,css,html,png,svg,ico}"] },`;

  for (const object of getConfigObjects(configObject)) {
    const pluginsProperty = object.getProperty("plugins");

    const pwaConfig = `VitePWA({
  registerType: "autoUpdate",${ssrOptions}
  manifest: {
    name: ${JSON.stringify(projectName)},
    short_name: ${JSON.stringify(projectName)},
    description: ${JSON.stringify(`${projectName} - PWA Application`)},
    theme_color: "#0c0c0c",
  },
  pwaAssets: { disabled: false, config: true },
  devOptions: { enabled: true },
})${
      usesSsr
        ? `.map((plugin) => {
  // Service workers belong to the client build. SSR/server builds must not
  // regenerate them after the server has recorded public asset metadata.
  plugin.applyToEnvironment = (environment) => environment.name === "client";
  return plugin;
})`
        : ""
    }`;

    if (pluginsProperty && Node.isPropertyAssignment(pluginsProperty)) {
      const initializer = pluginsProperty.getInitializer();
      if (Node.isArrayLiteralExpression(initializer)) {
        const hasPwa = initializer.getElements().some((el) => el.getText().startsWith("VitePWA("));
        if (!hasPwa) {
          initializer.addElement(pwaConfig);
        }
      } else if (initializer) {
        // Vite accepts nested plugin arrays, promises and falsy plugin options.
        // Keep the existing expression intact without assuming it is iterable.
        pluginsProperty.setInitializer(`[${initializer.getText()}, ${pwaConfig}]`);
      }
    } else if (pluginsProperty && Node.isShorthandPropertyAssignment(pluginsProperty)) {
      pluginsProperty.replaceWithText(`plugins: [${pluginsProperty.getName()}, ${pwaConfig}]`);
    } else if (!pluginsProperty) {
      object.addPropertyAssignment({
        name: "plugins",
        initializer: `[${pwaConfig}]`,
      });
    }
  }

  vfs.writeFile(viteConfigPath, sourceFile.getFullText());
}

// Vite accepts both an object and a callback returning an object. Only inspect
// returns belonging to the config callback, not nested plugin/helper functions.
function getConfigObjects(node: Node): ObjectLiteralExpression[] {
  if (Node.isParenthesizedExpression(node)) return getConfigObjects(node.getExpression());
  if (Node.isObjectLiteralExpression(node)) return [node];
  if (Node.isArrowFunction(node) || Node.isFunctionExpression(node)) {
    const body = node.getBody();
    if (!Node.isBlock(body)) return getConfigObjects(body);
    return body
      .getDescendantsOfKind(SyntaxKind.ReturnStatement)
      .filter(
        (statement) =>
          statement.getFirstAncestor(
            (ancestor) =>
              Node.isFunctionLikeDeclaration(ancestor) ||
              Node.isFunctionExpression(ancestor) ||
              Node.isArrowFunction(ancestor),
          ) === node,
      )
      .flatMap((statement) => {
        const expression = statement.getExpression();
        return expression ? getConfigObjects(expression) : [];
      });
  }
  return [];
}

// SSR frameworks render their own document and do not run transformIndexHtml.
function processPwaDocument(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const documentPath = config.frontend.includes("solid")
    ? "apps/web/src/Document.tsx"
    : config.frontend.includes("react-router")
      ? "apps/web/src/root.tsx"
      : config.frontend.includes("next")
        ? "apps/web/src/app/layout.tsx"
        : undefined;
  if (!documentPath || !vfs.exists(documentPath)) return;
  const project = new Project({ useInMemoryFileSystem: true });
  const source = project.createSourceFile(documentPath, vfs.readFile(documentPath));
  const tag = config.frontend.includes("next") ? "body" : "head";
  for (const element of source
    .getDescendantsOfKind(SyntaxKind.JsxElement)
    .filter((element) => element.getOpeningElement().getTagNameNode().getText() === tag)) {
    const body = element
      .getJsxChildren()
      .map((child) => child.getFullText())
      .join("");
    const additions = [];
    if (tag === "head" && !body.includes('rel="manifest"')) {
      additions.push('<link rel="manifest" href="/manifest.webmanifest" />');
    }
    if (tag === "body" && !body.includes("<PwaRegistration")) {
      additions.push("<PwaRegistration />");
    } else if (tag === "head" && !body.includes('src="/registerSW.js"')) {
      additions.push('<script src="/registerSW.js" defer></script>');
    }
    if (additions.length) element.setBodyText(`${additions.join("\n")}\n${body}`);
  }
  if (tag === "body" && !source.getImportDeclaration("@/components/pwa-registration")) {
    source.addImportDeclaration({
      defaultImport: "PwaRegistration",
      moduleSpecifier: "@/components/pwa-registration",
    });
  }
  vfs.writeFile(documentPath, source.getFullText());
}

function processNextPwaConfig(vfs: VirtualFileSystem): void {
  const configPath = "apps/web/next.config.ts";
  if (!vfs.exists(configPath)) return;
  const project = new Project({ useInMemoryFileSystem: true });
  const source = project.createSourceFile(configPath, vfs.readFile(configPath));
  const assignment = source.getExportAssignment((node) => !node.isExportEquals());
  if (!assignment || assignment.getExpression().getText().startsWith("withPwa(")) return;
  if (!source.getImportDeclaration("./pwa.config")) {
    source.addImportDeclaration({ namedImports: ["withPwa"], moduleSpecifier: "./pwa.config" });
  }
  const expression = assignment.getExpression().getText();
  assignment.setExpression(
    expression.startsWith("withVarlock(")
      ? `withVarlock(withPwa(${expression.slice("withVarlock(".length, -1)}))`
      : `withPwa(${expression})`,
  );

  vfs.writeFile(configPath, source.getFullText());
}
