import type { ProjectConfig } from "@better-t-stack/types";
import { IndentationText, Node, Project, QuoteKind } from "ts-morph";

import type { VirtualFileSystem } from "../core/virtual-fs";

export function processAlchemyPlugins(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const { webDeploy, frontend } = config;

  if (webDeploy !== "cloudflare") return;

  const isNext = frontend.includes("next");
  const isNuxt = frontend.includes("nuxt");
  const isSvelte = frontend.includes("svelte");
  const isTanstackStart = frontend.includes("tanstack-start");
  const isAstro = frontend.includes("astro");

  if (isNext) {
    processNextAlchemy(vfs);
  } else if (isNuxt) {
    processNuxtAlchemy(vfs);
  } else if (isSvelte) {
    processSvelteAlchemy(vfs);
  } else if (isTanstackStart) {
    processTanStackStartAlchemy(vfs);
  } else if (isAstro) {
    processAstroAlchemy(vfs);
  }
}

function processNextAlchemy(vfs: VirtualFileSystem) {
  const webAppDir = "apps/web";
  const openNextConfigPath = `${webAppDir}/open-next.config.ts`;

  if (!vfs.exists(openNextConfigPath)) {
    const openNextConfigContent = `import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({});
`;
    vfs.writeFile(openNextConfigPath, openNextConfigContent);
  }

  const gitignorePath = `${webAppDir}/.gitignore`;
  if (vfs.exists(gitignorePath)) {
    let gitignoreContent = vfs.readFile(gitignorePath);
    if (gitignoreContent && !gitignoreContent.includes("wrangler.jsonc")) {
      gitignoreContent += "\nwrangler.jsonc\n";
      vfs.writeFile(gitignorePath, gitignoreContent);
    }
  } else {
    vfs.writeFile(gitignorePath, "wrangler.jsonc\n");
  }
}

function processNuxtAlchemy(vfs: VirtualFileSystem) {
  const nuxtConfigPath = "apps/web/nuxt.config.ts";
  if (!vfs.exists(nuxtConfigPath)) return;

  const content = vfs.readFile(nuxtConfigPath);
  const project = new Project({
    useInMemoryFileSystem: true,
    manipulationSettings: {
      indentationText: IndentationText.TwoSpaces,
      quoteKind: QuoteKind.Double,
    },
  });

  const sourceFile = project.createSourceFile("nuxt.config.ts", content);

  const hasAlchemyImport = sourceFile
    .getImportDeclarations()
    .some((decl) => decl.getModuleSpecifierValue() === "alchemy/cloudflare/nuxt");
  if (!hasAlchemyImport) {
    sourceFile.addImportDeclaration({
      moduleSpecifier: "alchemy/cloudflare/nuxt",
      defaultImport: "alchemy",
    });
  }

  const hasFsImport = sourceFile
    .getImportDeclarations()
    .some((decl) => decl.getModuleSpecifierValue() === "node:fs");
  if (!hasFsImport) {
    sourceFile.addImportDeclaration({
      moduleSpecifier: "node:fs",
      namedImports: ["existsSync"],
    });
  }

  const hasUrlImport = sourceFile
    .getImportDeclarations()
    .some((decl) => decl.getModuleSpecifierValue() === "node:url");
  if (!hasUrlImport) {
    sourceFile.addImportDeclaration({
      moduleSpecifier: "node:url",
      namedImports: ["fileURLToPath"],
    });
  }

  if (!sourceFile.getVariableDeclaration("alchemyConfigPath")) {
    const firstExport = sourceFile
      .getStatements()
      .findIndex((statement) => Node.isExportAssignment(statement));
    sourceFile.insertStatements(
      firstExport === -1 ? sourceFile.getStatements().length : firstExport,
      `const alchemyConfigPath = fileURLToPath(new URL("./.alchemy/local/wrangler.jsonc", import.meta.url));
const hasAlchemyConfig = existsSync(alchemyConfigPath);`,
    );
  }

  if (!sourceFile.getVariableDeclaration("cloudflareWorkersShimPath")) {
    const firstExport = sourceFile
      .getStatements()
      .findIndex((statement) => Node.isExportAssignment(statement));
    sourceFile.insertStatements(
      firstExport === -1 ? sourceFile.getStatements().length : firstExport,
      `const cloudflareWorkersShimPath = fileURLToPath(new URL("../../packages/env/src/cloudflare-local.ts", import.meta.url));`,
    );
  }

  if (!sourceFile.getVariableDeclaration("isNuxtPrepare")) {
    const firstExport = sourceFile
      .getStatements()
      .findIndex((statement) => Node.isExportAssignment(statement));
    sourceFile.insertStatements(
      firstExport === -1 ? sourceFile.getStatements().length : firstExport,
      `const isNuxtPrepare =
  process.env.npm_lifecycle_event === "postinstall" ||
  process.env.npm_lifecycle_script === "nuxt prepare" ||
  process.argv.includes("prepare");`,
    );
  }

  if (!sourceFile.getVariableDeclaration("shouldUseAlchemy")) {
    const firstExport = sourceFile
      .getStatements()
      .findIndex((statement) => Node.isExportAssignment(statement));
    sourceFile.insertStatements(
      firstExport === -1 ? sourceFile.getStatements().length : firstExport,
      `const shouldUseAlchemy = !isNuxtPrepare && hasAlchemyConfig;`,
    );
  }

  if (!sourceFile.getVariableDeclaration("isNuxtDev")) {
    const firstExport = sourceFile
      .getStatements()
      .findIndex((statement) => Node.isExportAssignment(statement));
    sourceFile.insertStatements(
      firstExport === -1 ? sourceFile.getStatements().length : firstExport,
      `const isNuxtDev =
  !isNuxtPrepare &&
  process.env.NODE_ENV !== "production" &&
  !process.argv.some((arg) => arg === "build" || arg === "generate");`,
    );
  }

  const exportAssignment = sourceFile.getExportAssignment((d) => !d.isExportEquals());

  if (!exportAssignment) return;

  const defineConfigCall = exportAssignment.getExpression();
  if (
    !Node.isCallExpression(defineConfigCall) ||
    defineConfigCall.getExpression().getText() !== "defineNuxtConfig"
  ) {
    return;
  }

  let configObject = defineConfigCall.getArguments()[0];
  if (!configObject) {
    configObject = defineConfigCall.addArgument("{}");
  }

  if (Node.isObjectLiteralExpression(configObject)) {
    if (!configObject.getProperty("nitro")) {
      configObject.addPropertyAssignment({
        name: "nitro",
        initializer: `{
    preset: "cloudflare-module",
    ...(shouldUseAlchemy ? { cloudflare: alchemy({ dev: { configPath: alchemyConfigPath } }) } : {}),
    alias: !shouldUseAlchemy
      ? {
          "cloudflare:workers": cloudflareWorkersShimPath,
        }
      : {},
    prerender: {
      routes: ["/"],
      autoSubfolderIndex: false,
    },
  }`,
      });
    }

    if (!configObject.getProperty("vite")) {
      configObject.addPropertyAssignment({
        name: "vite",
        initializer: `{
    resolve: {
      alias: !shouldUseAlchemy
        ? {
            "cloudflare:workers": cloudflareWorkersShimPath,
          }
        : {},
    },
  }`,
      });
    }

    const modulesProperty = configObject.getProperty("modules");
    if (modulesProperty && Node.isPropertyAssignment(modulesProperty)) {
      const initializer = modulesProperty.getInitializer();
      if (Node.isArrayLiteralExpression(initializer)) {
        const hasModule = initializer
          .getElements()
          .some(
            (el) =>
              el.getText() === '"nitro-cloudflare-dev"' ||
              el.getText() === "'nitro-cloudflare-dev'",
          );
        if (!hasModule) {
          initializer.addElement('"nitro-cloudflare-dev"');
        }
      }
    } else if (!modulesProperty) {
      configObject.addPropertyAssignment({
        name: "modules",
        initializer: '["nitro-cloudflare-dev"]',
      });
    }
  }

  vfs.writeFile(nuxtConfigPath, sourceFile.getFullText());
}

function processSvelteAlchemy(vfs: VirtualFileSystem) {
  const svelteConfigPath = "apps/web/svelte.config.js";
  if (!vfs.exists(svelteConfigPath)) return;

  const content = vfs.readFile(svelteConfigPath);
  const project = new Project({
    useInMemoryFileSystem: true,
    manipulationSettings: {
      indentationText: IndentationText.TwoSpaces,
      quoteKind: QuoteKind.Single,
    },
  });

  const sourceFile = project.createSourceFile("svelte.config.js", content);

  if (
    !sourceFile
      .getImportDeclarations()
      .some((imp) => imp.getModuleSpecifierValue() === "alchemy/cloudflare/sveltekit")
  ) {
    sourceFile.insertImportDeclaration(0, {
      moduleSpecifier: "alchemy/cloudflare/sveltekit",
      defaultImport: "alchemy",
    });
  }

  if (
    !sourceFile
      .getImportDeclarations()
      .some((imp) => imp.getModuleSpecifierValue() === "@sveltejs/adapter-auto")
  ) {
    sourceFile.insertImportDeclaration(0, {
      moduleSpecifier: "@sveltejs/adapter-auto",
      defaultImport: "adapter",
    });
  }

  if (
    !sourceFile.getImportDeclarations().some((decl) => decl.getModuleSpecifierValue() === "node:fs")
  ) {
    sourceFile.insertImportDeclaration(0, {
      moduleSpecifier: "node:fs",
      namedImports: ["existsSync"],
    });
  }

  if (
    !sourceFile
      .getImportDeclarations()
      .some((decl) => decl.getModuleSpecifierValue() === "node:url")
  ) {
    sourceFile.insertImportDeclaration(0, {
      moduleSpecifier: "node:url",
      namedImports: ["fileURLToPath"],
    });
  }

  if (!sourceFile.getVariableDeclaration("alchemyConfigPath")) {
    const configVariableIndex = sourceFile.getStatements().findIndex(
      (statement) =>
        Node.isVariableStatement(statement) &&
        statement
          .getDeclarationList()
          .getDeclarations()
          .some((decl) => decl.getName() === "config"),
    );
    sourceFile.insertStatements(
      configVariableIndex === -1 ? sourceFile.getStatements().length : configVariableIndex,
      `const alchemyConfigPath = fileURLToPath(new URL("./.alchemy/local/wrangler.jsonc", import.meta.url));
const shouldUseAlchemy = existsSync(alchemyConfigPath);`,
    );
  }

  const configVariable = sourceFile.getVariableDeclaration("config");
  if (configVariable) {
    const initializer = configVariable.getInitializer();
    if (Node.isObjectLiteralExpression(initializer)) {
      const kitProperty = initializer.getProperty("kit");
      if (kitProperty && Node.isPropertyAssignment(kitProperty)) {
        const kitInitializer = kitProperty.getInitializer();
        if (Node.isObjectLiteralExpression(kitInitializer)) {
          const adapterProperty = kitInitializer.getProperty("adapter");
          if (adapterProperty && Node.isPropertyAssignment(adapterProperty)) {
            adapterProperty.setInitializer(
              "shouldUseAlchemy ? alchemy({ platformProxy: { configPath: alchemyConfigPath } }) : adapter()",
            );
          }
        }
      }
    }
  }

  vfs.writeFile(svelteConfigPath, sourceFile.getFullText());
}

function processTanStackStartAlchemy(vfs: VirtualFileSystem) {
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

  const alchemyImport = sourceFile.getImportDeclaration(
    (decl) => decl.getModuleSpecifierValue() === "alchemy/cloudflare/tanstack-start",
  );

  if (!alchemyImport) {
    sourceFile.addImportDeclaration({
      moduleSpecifier: "alchemy/cloudflare/tanstack-start",
      defaultImport: "alchemy",
    });
  }

  const hasFsImport = sourceFile
    .getImportDeclarations()
    .some((decl) => decl.getModuleSpecifierValue() === "node:fs");
  if (!hasFsImport) {
    sourceFile.addImportDeclaration({
      moduleSpecifier: "node:fs",
      namedImports: ["existsSync"],
    });
  }

  const hasUrlImport = sourceFile
    .getImportDeclarations()
    .some((decl) => decl.getModuleSpecifierValue() === "node:url");
  if (!hasUrlImport) {
    sourceFile.addImportDeclaration({
      moduleSpecifier: "node:url",
      namedImports: ["fileURLToPath"],
    });
  }

  if (!sourceFile.getVariableDeclaration("alchemyConfigPath")) {
    const firstExport = sourceFile
      .getStatements()
      .findIndex((statement) => Node.isExportAssignment(statement));
    sourceFile.insertStatements(
      firstExport === -1 ? sourceFile.getStatements().length : firstExport,
      `const alchemyConfigPath = fileURLToPath(new URL("./.alchemy/local/wrangler.jsonc", import.meta.url));
const shouldUseAlchemy = existsSync(alchemyConfigPath);`,
    );
  }

  if (!sourceFile.getVariableDeclaration("cloudflareWorkersShimPath")) {
    const firstExport = sourceFile
      .getStatements()
      .findIndex((statement) => Node.isExportAssignment(statement));
    sourceFile.insertStatements(
      firstExport === -1 ? sourceFile.getStatements().length : firstExport,
      `const cloudflareWorkersShimPath = fileURLToPath(new URL("../../packages/env/src/cloudflare-local.ts", import.meta.url));`,
    );
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
    if (pluginsProperty && Node.isPropertyAssignment(pluginsProperty)) {
      const initializer = pluginsProperty.getInitializer();
      if (Node.isArrayLiteralExpression(initializer)) {
        const hasAlchemy = initializer
          .getElements()
          .some((el) => el.getText().includes("alchemy("));
        if (!hasAlchemy) {
          initializer.addElement(
            "...(shouldUseAlchemy ? [alchemy({ configPath: alchemyConfigPath })] : [])",
          );
        }
      }
    } else {
      configObject.addPropertyAssignment({
        name: "plugins",
        initializer: "[...(shouldUseAlchemy ? [alchemy({ configPath: alchemyConfigPath })] : [])]",
      });
    }

    const resolveProperty = configObject.getProperty("resolve");
    if (resolveProperty && Node.isPropertyAssignment(resolveProperty)) {
      const initializer = resolveProperty.getInitializer();
      if (Node.isObjectLiteralExpression(initializer) && !initializer.getProperty("alias")) {
        initializer.addPropertyAssignment({
          name: "alias",
          initializer:
            '!shouldUseAlchemy ? { "cloudflare:workers": cloudflareWorkersShimPath } : {}',
        });
      }
    } else if (!resolveProperty) {
      configObject.addPropertyAssignment({
        name: "resolve",
        initializer:
          '{ alias: !shouldUseAlchemy ? { "cloudflare:workers": cloudflareWorkersShimPath } : {} }',
      });
    }
  }

  vfs.writeFile(viteConfigPath, sourceFile.getFullText());
}

function processAstroAlchemy(vfs: VirtualFileSystem) {
  const webAppDir = "apps/web";
  const astroConfigPath = `${webAppDir}/astro.config.mjs`;

  if (!vfs.exists(astroConfigPath)) return;

  const content = vfs.readFile(astroConfigPath);
  const project = new Project({
    useInMemoryFileSystem: true,
    manipulationSettings: {
      indentationText: IndentationText.TwoSpaces,
      quoteKind: QuoteKind.Double,
    },
  });

  const sourceFile = project.createSourceFile("astro.config.mjs", content);

  if (
    !sourceFile
      .getImportDeclarations()
      .some((imp) => imp.getModuleSpecifierValue() === "alchemy/cloudflare/astro")
  ) {
    sourceFile.insertImportDeclaration(0, {
      moduleSpecifier: "alchemy/cloudflare/astro",
      defaultImport: "alchemy",
    });
  }

  if (
    !sourceFile
      .getImportDeclarations()
      .some((imp) => imp.getModuleSpecifierValue() === "@astrojs/node")
  ) {
    sourceFile.insertImportDeclaration(0, {
      moduleSpecifier: "@astrojs/node",
      defaultImport: "node",
    });
  }

  if (
    !sourceFile.getImportDeclarations().some((decl) => decl.getModuleSpecifierValue() === "node:fs")
  ) {
    sourceFile.insertImportDeclaration(0, {
      moduleSpecifier: "node:fs",
      namedImports: ["existsSync"],
    });
  }

  if (
    !sourceFile
      .getImportDeclarations()
      .some((decl) => decl.getModuleSpecifierValue() === "node:url")
  ) {
    sourceFile.insertImportDeclaration(0, {
      moduleSpecifier: "node:url",
      namedImports: ["fileURLToPath"],
    });
  }

  if (!sourceFile.getVariableDeclaration("alchemyConfigPath")) {
    const firstExport = sourceFile
      .getStatements()
      .findIndex((statement) => Node.isExportAssignment(statement));
    sourceFile.insertStatements(
      firstExport === -1 ? sourceFile.getStatements().length : firstExport,
      `const alchemyConfigPath = fileURLToPath(new URL("./.alchemy/local/wrangler.jsonc", import.meta.url));
const shouldUseAlchemy = existsSync(alchemyConfigPath);`,
    );
  }

  if (!sourceFile.getVariableDeclaration("cloudflareWorkersShimPath")) {
    const firstExport = sourceFile
      .getStatements()
      .findIndex((statement) => Node.isExportAssignment(statement));
    sourceFile.insertStatements(
      firstExport === -1 ? sourceFile.getStatements().length : firstExport,
      `const cloudflareWorkersShimPath = fileURLToPath(new URL("../../packages/env/src/cloudflare-local.ts", import.meta.url));`,
    );
  }

  const exportAssignment = sourceFile.getExportAssignment((d) => !d.isExportEquals());
  if (exportAssignment) {
    const defineConfigCall = exportAssignment.getExpression();
    if (
      Node.isCallExpression(defineConfigCall) &&
      defineConfigCall.getExpression().getText() === "defineConfig"
    ) {
      const configObject = defineConfigCall.getArguments()[0];
      if (Node.isObjectLiteralExpression(configObject)) {
        const adapterProperty = configObject.getProperty("adapter");
        if (adapterProperty && Node.isPropertyAssignment(adapterProperty)) {
          adapterProperty.setInitializer(
            'shouldUseAlchemy ? alchemy({ platformProxy: { configPath: alchemyConfigPath } }) : node({ mode: "standalone" })',
          );
        }

        const viteProperty = configObject.getProperty("vite");
        if (viteProperty && Node.isPropertyAssignment(viteProperty)) {
          const viteInitializer = viteProperty.getInitializer();
          if (Node.isObjectLiteralExpression(viteInitializer)) {
            const resolveProperty = viteInitializer.getProperty("resolve");
            if (resolveProperty && Node.isPropertyAssignment(resolveProperty)) {
              const resolveInitializer = resolveProperty.getInitializer();
              if (
                Node.isObjectLiteralExpression(resolveInitializer) &&
                !resolveInitializer.getProperty("alias")
              ) {
                resolveInitializer.addPropertyAssignment({
                  name: "alias",
                  initializer:
                    '!shouldUseAlchemy ? { "cloudflare:workers": cloudflareWorkersShimPath } : {}',
                });
              }
            } else if (!resolveProperty) {
              viteInitializer.addPropertyAssignment({
                name: "resolve",
                initializer:
                  '{ alias: !shouldUseAlchemy ? { "cloudflare:workers": cloudflareWorkersShimPath } : {} }',
              });
            }
          }
        } else if (!viteProperty) {
          configObject.addPropertyAssignment({
            name: "vite",
            initializer:
              '{ resolve: { alias: !shouldUseAlchemy ? { "cloudflare:workers": cloudflareWorkersShimPath } : {} } }',
          });
        }
      }
    }
  }

  vfs.writeFile(astroConfigPath, sourceFile.getFullText());
}
