import type { ProjectConfig } from "@better-fullstack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

let tsMorph: typeof import("ts-morph");

async function loadTsMorph(): Promise<boolean> {
  try {
    tsMorph = await import("ts-morph");
    return true;
  } catch {
    return false; // ts-morph unavailable (browser environment)
  }
}

export async function processAlchemyPlugins(
  vfs: VirtualFileSystem,
  config: ProjectConfig,
): Promise<void> {
  const { webDeploy, frontend } = config;

  if (webDeploy !== "cloudflare") return;

  const isNext = frontend.includes("next");
  const isNuxt = frontend.includes("nuxt");
  const isSvelte = frontend.includes("svelte");
  const isTanstackStart = frontend.includes("tanstack-start");

  if (isNext) {
    processNextAlchemy(vfs);
  } else if (isNuxt) {
    if (await loadTsMorph()) processNuxtAlchemy(vfs);
  } else if (isSvelte) {
    if (await loadTsMorph()) processSvelteAlchemy(vfs);
  } else if (isTanstackStart) {
    if (await loadTsMorph()) processTanStackStartAlchemy(vfs);
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
  const project = new tsMorph.Project({
    useInMemoryFileSystem: true,
    manipulationSettings: {
      indentationText: tsMorph.IndentationText.TwoSpaces,
      quoteKind: tsMorph.QuoteKind.Double,
    },
  });

  const sourceFile = project.createSourceFile("nuxt.config.ts", content);
  const exportAssignment = sourceFile.getExportAssignment((d) => !d.isExportEquals());

  if (!exportAssignment) return;

  const defineConfigCall = exportAssignment.getExpression();
  if (
    !tsMorph.Node.isCallExpression(defineConfigCall) ||
    defineConfigCall.getExpression().getText() !== "defineNuxtConfig"
  ) {
    return;
  }

  let configObject = defineConfigCall.getArguments()[0];
  if (!configObject) {
    configObject = defineConfigCall.addArgument("{}");
  }

  if (tsMorph.Node.isObjectLiteralExpression(configObject)) {
    if (!configObject.getProperty("nitro")) {
      configObject.addPropertyAssignment({
        name: "nitro",
        initializer: `{
    preset: "cloudflare_module",
    cloudflare: {
      deployConfig: true,
      nodeCompat: true
    }
  }`,
      });
    }

    const modulesProperty = configObject.getProperty("modules");
    if (modulesProperty && tsMorph.Node.isPropertyAssignment(modulesProperty)) {
      const initializer = modulesProperty.getInitializer();
      if (tsMorph.Node.isArrayLiteralExpression(initializer)) {
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
  const project = new tsMorph.Project({
    useInMemoryFileSystem: true,
    manipulationSettings: {
      indentationText: tsMorph.IndentationText.TwoSpaces,
      quoteKind: tsMorph.QuoteKind.Single,
    },
  });

  const sourceFile = project.createSourceFile("svelte.config.js", content);

  const importDeclarations = sourceFile.getImportDeclarations();
  const adapterImport = importDeclarations.find((imp) =>
    imp.getModuleSpecifierValue().includes("@sveltejs/adapter"),
  );

  if (adapterImport) {
    adapterImport.setModuleSpecifier("alchemy/cloudflare/sveltekit");
    adapterImport.removeDefaultImport();
    adapterImport.setDefaultImport("alchemy");
  } else {
    sourceFile.insertImportDeclaration(0, {
      moduleSpecifier: "alchemy/cloudflare/sveltekit",
      defaultImport: "alchemy",
    });
  }

  const configVariable = sourceFile.getVariableDeclaration("config");
  if (configVariable) {
    const initializer = configVariable.getInitializer();
    if (tsMorph.Node.isObjectLiteralExpression(initializer)) {
      const kitProperty = initializer.getProperty("kit");
      if (kitProperty && tsMorph.Node.isPropertyAssignment(kitProperty)) {
        const kitInitializer = kitProperty.getInitializer();
        if (tsMorph.Node.isObjectLiteralExpression(kitInitializer)) {
          const adapterProperty = kitInitializer.getProperty("adapter");
          if (adapterProperty && tsMorph.Node.isPropertyAssignment(adapterProperty)) {
            const adapterInitializer = adapterProperty.getInitializer();
            if (tsMorph.Node.isCallExpression(adapterInitializer)) {
              const expression = adapterInitializer.getExpression();
              if (tsMorph.Node.isIdentifier(expression) && expression.getText() === "adapter") {
                expression.replaceWithText("alchemy");
              }
            }
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
  const project = new tsMorph.Project({
    useInMemoryFileSystem: true,
    manipulationSettings: {
      indentationText: tsMorph.IndentationText.TwoSpaces,
      quoteKind: tsMorph.QuoteKind.Double,
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

  const exportAssignment = sourceFile.getExportAssignment((d) => !d.isExportEquals());
  if (!exportAssignment) return;

  const defineConfigCall = exportAssignment.getExpression();
  if (
    !tsMorph.Node.isCallExpression(defineConfigCall) ||
    defineConfigCall.getExpression().getText() !== "defineConfig"
  ) {
    return;
  }

  let configObject = defineConfigCall.getArguments()[0];
  if (!configObject) {
    configObject = defineConfigCall.addArgument("{}");
  }

  if (tsMorph.Node.isObjectLiteralExpression(configObject)) {
    const pluginsProperty = configObject.getProperty("plugins");
    if (pluginsProperty && tsMorph.Node.isPropertyAssignment(pluginsProperty)) {
      const initializer = pluginsProperty.getInitializer();
      if (tsMorph.Node.isArrayLiteralExpression(initializer)) {
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

  vfs.writeFile(viteConfigPath, sourceFile.getFullText());
}
