import type { ProjectConfig } from "@better-t-stack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

function updateFile(vfs: VirtualFileSystem, filePath: string, update: (content: string) => string) {
  const content = vfs.readFile(filePath);
  if (!content) return;
  vfs.writeFile(filePath, update(content));
}

function prependImport(content: string, importLine: string) {
  if (content.includes(importLine)) return content;
  return `${importLine}\n${content}`;
}

function addTopLevelConfig(content: string, block: string) {
  if (content.includes(block.trim().split("\n")[0] ?? "")) return content;
  return content.replace(/\n\}\)\s*$/, `\n${block}\n})\n`);
}

function processNext(vfs: VirtualFileSystem) {
  updateFile(vfs, "apps/web/next.config.ts", (content) => {
    if (content.includes("withSentryConfig(nextConfig")) return content;
    const withImport = prependImport(content, 'import { withSentryConfig } from "@sentry/nextjs";');
    return withImport.replace(
      "export default nextConfig;",
      `export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_WEB_PROJECT ?? process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  telemetry: false,
  silent: !process.env.CI,
  sourcemaps: { disable: !process.env.SENTRY_AUTH_TOKEN },
});`,
    );
  });
}

function processNuxt(vfs: VirtualFileSystem) {
  updateFile(vfs, "apps/web/nuxt.config.ts", (content) => {
    let nextContent = content;
    if (!nextContent.includes('"@sentry/nuxt/module"')) {
      nextContent = nextContent.replace(/modules:\s*\[/, '$&\n    "@sentry/nuxt/module",');
    }

    if (!nextContent.includes("sentryDsn:")) {
      if (nextContent.includes("public: {")) {
        nextContent = nextContent.replace(
          "public: {",
          "public: {\n      sentryDsn: process.env.NUXT_PUBLIC_SENTRY_DSN,",
        );
      } else if (nextContent.includes("runtimeConfig: {")) {
        nextContent = nextContent.replace(
          "runtimeConfig: {",
          "runtimeConfig: {\n    public: { sentryDsn: process.env.NUXT_PUBLIC_SENTRY_DSN },",
        );
      } else {
        nextContent = nextContent.replace(
          "export default defineNuxtConfig({",
          "export default defineNuxtConfig({\n  runtimeConfig: {\n    public: { sentryDsn: process.env.NUXT_PUBLIC_SENTRY_DSN },\n  },",
        );
      }
    }

    return addTopLevelConfig(
      nextContent,
      `  sentry: {
    org: process.env.SENTRY_ORG,
    project: process.env.SENTRY_WEB_PROJECT ?? process.env.SENTRY_PROJECT,
    authToken: process.env.SENTRY_AUTH_TOKEN,
    telemetry: false,
    sourcemaps: { disable: !process.env.SENTRY_AUTH_TOKEN },
  },`,
    );
  });
}

function processSvelte(vfs: VirtualFileSystem) {
  const hooksPath = "apps/web/src/hooks.server.ts";
  const existing = vfs.readFile(hooksPath) ?? "";
  if (existing.includes('from "@sentry/sveltekit"')) return;

  let content = prependImport(existing, 'import * as Sentry from "@sentry/sveltekit";');
  const hasEvlog = content.includes("createEvlogHooks(");

  if (hasEvlog) {
    content = prependImport(content, 'import { sequence } from "@sveltejs/kit/hooks";');
    const exportedHooksPattern =
      /export const \{ handle, handleError \} = (createEvlogHooks\([^;]*\));/;
    if (exportedHooksPattern.test(content)) {
      content = content.replace(
        exportedHooksPattern,
        `const { handle: evlogHandle, handleError: evlogHandleError } = $1;
const sentryHandle = Sentry.sentryHandle();

export const handle = sequence(sentryHandle, evlogHandle);
export const handleError = Sentry.handleErrorWithSentry(evlogHandleError);`,
      );
      vfs.writeFile(hooksPath, content);
      return;
    }
    content = content
      .replace(
        "const { handle: evlogHandle, handleError } =",
        "const { handle: evlogHandle, handleError: evlogHandleError } =",
      )
      .replace(
        /export const handle = sequence\(([^;]+)\);/,
        "const sentryHandle = Sentry.sentryHandle();\n\nexport const handle = sequence(sentryHandle, $1);",
      )
      .replace(
        "export { handleError };",
        "export const handleError = Sentry.handleErrorWithSentry(evlogHandleError);",
      );
    if (!content.includes("const sentryHandle")) {
      content = `${content.trimEnd()}\n\nconst sentryHandle = Sentry.sentryHandle();\nexport const handle = sequence(sentryHandle, evlogHandle);\nexport const handleError = Sentry.handleErrorWithSentry(evlogHandleError);\n`;
    }
    vfs.writeFile(hooksPath, content);
    return;
  }

  const handlePattern = /export const handle(:\s*Handle)?\s*=\s*async/;
  if (handlePattern.test(content)) {
    content = prependImport(content, 'import { sequence } from "@sveltejs/kit/hooks";');
    content = content.replace(handlePattern, (_match, type: string | undefined) => {
      return `const appHandle${type ?? ""} = async`;
    });
    content = `${content.trimEnd()}\n\nconst sentryHandle = Sentry.sentryHandle();\nexport const handle = sequence(sentryHandle, appHandle);\nexport const handleError = Sentry.handleErrorWithSentry();\n`;
  } else {
    content = `${content.trimEnd()}\n\nexport const handle = Sentry.sentryHandle();\nexport const handleError = Sentry.handleErrorWithSentry();\n`;
  }

  vfs.writeFile(hooksPath, content.trimStart());
}

function processSolid(vfs: VirtualFileSystem) {
  updateFile(vfs, "apps/web/vite.config.ts", (content) => {
    let nextContent = prependImport(
      content,
      'import { sentrySolidStart } from "@sentry/solidstart/vite";',
    );
    if (!nextContent.includes('import { nitro } from "nitro/vite";')) {
      nextContent = prependImport(nextContent, 'import { nitro } from "nitro/vite";');
    }
    nextContent = nextContent.replace("nitro(),", 'nitro({ serverDir: "./server" }),');
    if (!nextContent.includes("sentrySolidStart({")) {
      nextContent = nextContent.replace(
        "solidStart(),",
        `solidStart(),
    sentrySolidStart({
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_WEB_PROJECT ?? process.env.SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,
      telemetry: false,
      sourcemaps: { disable: !process.env.SENTRY_AUTH_TOKEN },
    }),`,
      );
    }
    if (!nextContent.includes('nitro({ serverDir: "./server" })')) {
      nextContent = nextContent.replace(
        "tailwindcss(),",
        'tailwindcss(),\n    nitro({ serverDir: "./server" }),',
      );
    }
    return nextContent;
  });

  updateFile(vfs, "apps/web/src/entry-client.tsx", (content) => {
    if (content.includes("Sentry.init(")) return content;
    let nextContent = prependImport(
      content,
      'import { solidRouterBrowserTracingIntegration } from "@sentry/solidstart/solidrouter";',
    );
    nextContent = prependImport(nextContent, 'import * as Sentry from "@sentry/solidstart";');
    return nextContent.replace(
      "mount(() =>",
      `Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [solidRouterBrowserTracingIntegration()],
  tracesSampleRate: 0.1,
});

mount(() =>`,
    );
  });
}

function processAstro(vfs: VirtualFileSystem) {
  updateFile(vfs, "apps/web/astro.config.mjs", (content) => {
    if (content.includes("sentry({")) return content;
    const withImport = prependImport(content, 'import sentry from "@sentry/astro";');
    return withImport.replace(
      "export default defineConfig({",
      `export default defineConfig({
  integrations: [
    sentry({
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_WEB_PROJECT ?? process.env.SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,
      telemetry: false,
      sourcemaps: { disable: !process.env.SENTRY_AUTH_TOKEN },
    }),
  ],`,
    );
  });
}

function processReactRouter(vfs: VirtualFileSystem, config: ProjectConfig) {
  updateFile(vfs, "apps/web/vite.config.ts", (content) => {
    if (content.includes("sentryReactRouter(")) return content;
    let nextContent = prependImport(
      content,
      'import { sentryReactRouter } from "@sentry/react-router";',
    );
    nextContent = nextContent.replace(
      "export default defineConfig({",
      "export default defineConfig((config) => ({",
    );
    nextContent = nextContent.replace(
      "export default defineConfig((config) => ({",
      `export default defineConfig((config) => ({
  build: { sourcemap: process.env.SENTRY_AUTH_TOKEN ? "hidden" : false },`,
    );
    nextContent = nextContent.replace(/\}\);\s*$/, `}));\n`);
    return nextContent.replace(
      "reactRouter(),",
      `reactRouter(),
    sentryReactRouter(
      {
        org: process.env.SENTRY_ORG,
        project: process.env.SENTRY_WEB_PROJECT ?? process.env.SENTRY_PROJECT,
        authToken: process.env.SENTRY_AUTH_TOKEN,
        telemetry: false,
        sourcemaps: { disable: !process.env.SENTRY_AUTH_TOKEN },
      },
      config,
    ),`,
    );
  });

  updateFile(vfs, "apps/web/src/root.tsx", (content) => {
    if (content.includes("Sentry.captureException(error)")) return content;
    let nextContent = prependImport(content, 'import * as Sentry from "@sentry/react-router";');
    nextContent = nextContent.replace(
      "} else if (import.meta.env.DEV && error && error instanceof Error) {\n    details = error.message;\n    stack = error.stack;\n  }",
      `} else if (error && error instanceof Error) {
    Sentry.captureException(error);
    if (import.meta.env.DEV) {
      details = error.message;
      stack = error.stack;
    }
  }`,
    );
    return nextContent;
  });

  if (config.webDeploy !== "cloudflare") return;

  updateFile(vfs, "apps/web/workers/app.ts", (content) => {
    if (content.includes("Sentry.withSentry(")) return content;
    let nextContent = prependImport(content, 'import * as Sentry from "@sentry/cloudflare";');
    nextContent = nextContent.replace("export default {", `const worker = {`);
    return `${nextContent.trimEnd()}\n\nexport default Sentry.withSentry(\n\t(env: Env) => ({ dsn: env.SENTRY_DSN, tracesSampleRate: 0.1 }),\n\tworker,\n);\n`;
  });

  updateFile(vfs, "apps/web/src/entry.server.tsx", (content) => {
    if (content.includes("wrapSentryHandleRequest")) return content;
    let nextContent = prependImport(
      content,
      'import { wrapSentryHandleRequest } from "@sentry/react-router/cloudflare";',
    );
    nextContent = nextContent.replace(
      "export default async function handleRequest(",
      "async function handleRequest(",
    );
    return `${nextContent.trimEnd()}\n\nexport default wrapSentryHandleRequest(handleRequest);\n`;
  });
}

function processTanStackStart(vfs: VirtualFileSystem) {
  updateFile(vfs, "apps/web/vite.config.ts", (content) => {
    if (content.includes("sentryTanstackStart(")) return content;
    const nextContent = prependImport(
      content,
      'import { sentryTanstackStart } from "@sentry/tanstackstart-react/vite";',
    );
    return nextContent.replace(
      "viteReact(),",
      `viteReact(),
    sentryTanstackStart({
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_WEB_PROJECT ?? process.env.SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,
      telemetry: false,
      sourcemaps: { disable: !process.env.SENTRY_AUTH_TOKEN },
    }),`,
    );
  });

  updateFile(vfs, "apps/web/src/router.tsx", (content) => {
    if (content.includes("tanstackRouterBrowserTracingIntegration(router)")) return content;
    let nextContent = prependImport(
      content,
      'import * as Sentry from "@sentry/tanstackstart-react";',
    );
    nextContent = nextContent.replace(
      /\n(\s*)return router;/,
      `\n$1if (!router.isServer) {\n$1\tSentry.addIntegration(Sentry.tanstackRouterBrowserTracingIntegration(router));\n$1}\n\n$1return router;`,
    );
    return nextContent;
  });
}

function processTanStackRouter(vfs: VirtualFileSystem) {
  updateFile(vfs, "apps/web/src/main.tsx", (content) => {
    if (content.includes("tanstackRouterBrowserTracingIntegration(router)")) return content;
    let nextContent = prependImport(content, 'import * as Sentry from "@sentry/react";');
    return nextContent.replace(
      '\n\ndeclare module "@tanstack/react-router"',
      `

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [Sentry.tanstackRouterBrowserTracingIntegration(router)],
  tracesSampleRate: 0.1,
});

declare module "@tanstack/react-router"`,
    );
  });
}

function processNative(vfs: VirtualFileSystem) {
  const appJsonPath = "apps/native/app.json";
  const appJson = vfs.readJson<{ expo?: { plugins?: Array<string | unknown[]> } }>(appJsonPath);
  if (appJson?.expo) {
    appJson.expo.plugins = appJson.expo.plugins ?? [];
    if (
      !appJson.expo.plugins.some(
        (plugin) =>
          plugin === "@sentry/react-native/expo" ||
          (Array.isArray(plugin) && plugin[0] === "@sentry/react-native/expo"),
      )
    ) {
      appJson.expo.plugins.unshift("@sentry/react-native/expo");
    }
    vfs.writeJson(appJsonPath, appJson);
  }

  updateFile(vfs, "apps/native/metro.config.js", (content) => {
    if (content.includes("withSentryConfig")) return content;
    const nextContent = prependImport(
      content,
      'const { withSentryConfig } = require("@sentry/react-native/metro");',
    );
    return nextContent.replace(
      /module\.exports = (\w+);/,
      "module.exports = withSentryConfig($1);",
    );
  });

  updateFile(vfs, "apps/native/app/_layout.tsx", (content) => {
    if (content.includes("Sentry.wrap(")) return content;
    let nextContent = prependImport(content, 'import * as Sentry from "@sentry/react-native";');
    nextContent = nextContent.replace(
      /export default function (RootLayout|Layout)\(\)/,
      "function $1()",
    );
    const componentName = /function (RootLayout|Layout)\(\)/.exec(nextContent)?.[1];
    if (!componentName) return content;
    nextContent = nextContent.replace(
      /(^import[\s\S]*?\n)(?=(?:const|export|function|Sentry))/,
      `$1\nexport { ErrorBoundary } from "expo-router";\n\nSentry.init({\n  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,\n  tracesSampleRate: 0.1,\n});\n\n`,
    );
    return `${nextContent.trimEnd()}\n\nexport default Sentry.wrap(${componentName});\n`;
  });
}

function processServer(vfs: VirtualFileSystem, config: ProjectConfig) {
  const entryPath = "apps/server/src/index.ts";
  updateFile(vfs, entryPath, (content) => {
    let nextContent = content;

    if (config.backend === "hono") {
      const sentryImport =
        config.runtime === "workers"
          ? 'import { sentry } from "@sentry/hono/cloudflare";'
          : config.runtime === "bun"
            ? 'import { sentry } from "@sentry/hono/bun";'
            : 'import { sentry } from "@sentry/hono/node";';
      nextContent = prependImport(nextContent, sentryImport);
      if (config.runtime === "node") {
        nextContent = prependImport(nextContent, 'import "./instrument";');
      }
      if (!nextContent.includes("app.use(sentry(app")) {
        const options =
          config.runtime === "workers"
            ? ", { dsn: env.SENTRY_DSN, tracesSampleRate: 0.1 }"
            : config.runtime === "bun"
              ? ", { dsn: process.env.SENTRY_DSN, tracesSampleRate: 0.1 }"
              : "";
        nextContent = nextContent.replace(
          "const app = new Hono();",
          `const app = new Hono();\n\napp.use(sentry(app${options}));`,
        );
      }
      return nextContent;
    }

    if (config.backend === "express" || config.backend === "fastify") {
      const packageName = config.runtime === "bun" ? "@sentry/bun" : "@sentry/node";
      nextContent = prependImport(nextContent, `import * as Sentry from "${packageName}";`);
      nextContent = prependImport(nextContent, 'import "./instrument";');
      const marker = config.backend === "express" ? "app.listen(" : "fastify.listen(";
      const setup =
        config.backend === "express"
          ? "Sentry.setupExpressErrorHandler(app);"
          : "Sentry.setupFastifyErrorHandler(fastify);";
      if (!nextContent.includes(setup)) {
        nextContent = nextContent.replace(marker, `${setup}\n\n${marker}`);
      }
      return nextContent;
    }

    if (config.backend === "elysia") {
      nextContent = prependImport(nextContent, 'import * as Sentry from "@sentry/elysia";');
      if (!nextContent.includes("Sentry.init(")) {
        const firstDeclaration = nextContent.indexOf("\n\n", nextContent.lastIndexOf("import "));
        nextContent = `${nextContent.slice(0, firstDeclaration + 2)}Sentry.init({\n\tdsn: process.env.SENTRY_DSN,\n\ttracesSampleRate: 0.1,\n});\n\n${nextContent.slice(firstDeclaration + 2)}`;
      }
      return nextContent.replace(/new Elysia\(([^\n]*)\)/, "Sentry.withElysia(new Elysia($1))");
    }

    return nextContent;
  });
}

function addAlchemyEnvBinding(content: string, marker: string, sourceKey: string) {
  const markerIndex = content.indexOf(marker);
  if (markerIndex === -1) return content;
  const envIndex = content.indexOf("env: {", markerIndex);
  if (envIndex === -1) return content;
  const insertionIndex = envIndex + "env: {".length;
  const nearbyContent = content.slice(insertionIndex, insertionIndex + 160);
  if (nearbyContent.includes("SENTRY_DSN:")) return content;
  return `${content.slice(0, insertionIndex)}\n    SENTRY_DSN: Config.string("${sourceKey}"),${content.slice(insertionIndex)}`;
}

function processAlchemy(vfs: VirtualFileSystem, config: ProjectConfig) {
  if (config.webDeploy !== "cloudflare" && config.serverDeploy !== "cloudflare") return;
  const infraPath = "packages/infra/alchemy.run.ts";
  const content = vfs.readFile(infraPath);
  if (!content) return;

  let nextContent = content;
  if (config.serverDeploy === "cloudflare") {
    nextContent = addAlchemyEnvBinding(nextContent, "export const server =", "SENTRY_SERVER_DSN");
  }
  if (config.webDeploy === "cloudflare") {
    const marker = config.backend === "self" ? "export const web =" : "const webWorker = yield*";
    nextContent = addAlchemyEnvBinding(nextContent, marker, "SENTRY_WEB_DSN");
  }
  vfs.writeFile(infraPath, nextContent);
}

export function processSentryPlugins(vfs: VirtualFileSystem, config: ProjectConfig) {
  if (!config.addons.includes("sentry")) return;

  if (config.frontend.includes("next")) processNext(vfs);
  if (config.frontend.includes("nuxt")) processNuxt(vfs);
  if (config.frontend.includes("svelte")) processSvelte(vfs);
  if (config.frontend.includes("solid")) processSolid(vfs);
  if (config.frontend.includes("astro")) processAstro(vfs);
  if (config.frontend.includes("react-router")) processReactRouter(vfs, config);
  if (config.frontend.includes("tanstack-start")) processTanStackStart(vfs);
  if (config.frontend.includes("tanstack-router")) processTanStackRouter(vfs);
  if (
    config.frontend.some((frontend) =>
      ["native-bare", "native-uniwind", "native-unistyles"].includes(frontend),
    )
  ) {
    processNative(vfs);
  }

  if (["hono", "express", "fastify", "elysia"].includes(config.backend)) {
    processServer(vfs, config);
  }
  processAlchemy(vfs, config);
}
