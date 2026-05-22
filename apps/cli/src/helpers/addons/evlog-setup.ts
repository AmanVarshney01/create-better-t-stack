import path from "node:path";

import { Result } from "better-result";
import fs from "fs-extra";

import type { Backend, Frontend, ProjectConfig } from "../../types";
import { AddonSetupError } from "../../utils/errors";

type EvlogBackend = Extract<Backend, "hono" | "express" | "fastify" | "elysia">;
type EvlogWebFrontend = Extract<Frontend, "next" | "nuxt" | "svelte" | "tanstack-start" | "astro">;

const evlogBackends = ["hono", "express", "fastify", "elysia"] as const;
const evlogWebFrontends = ["next", "nuxt", "svelte", "tanstack-start", "astro"] as const;

function isEvlogBackend(backend: Backend): backend is EvlogBackend {
  return (evlogBackends as readonly Backend[]).includes(backend);
}

function getEvlogWebFrontend(frontends: Frontend[]): EvlogWebFrontend | undefined {
  return frontends.find((frontend): frontend is EvlogWebFrontend =>
    (evlogWebFrontends as readonly Frontend[]).includes(frontend),
  );
}

function shouldIdentifyWebAuth(config: ProjectConfig) {
  return config.auth === "better-auth" && config.backend === "self";
}

function prependMissingImports(content: string, imports: string[]) {
  const missingImports = imports.filter((line) => !content.includes(line));
  if (missingImports.length === 0) return content;

  const importBlock = `${missingImports.join("\n")}\n`;
  const referenceMatch = content.match(/^(?:\/\/\/ <reference[^\n]*>\n)+/);
  if (referenceMatch) {
    return `${referenceMatch[0]}${importBlock}${content.slice(referenceMatch[0].length)}`;
  }

  return `${importBlock}${content}`;
}

function addNamedImport(content: string, moduleName: string, names: string[]) {
  const importRegex = new RegExp(
    `import \\{([^}]+)\\} from "${moduleName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}";`,
  );
  const match = content.match(importRegex);

  if (!match) {
    return prependMissingImports(content, [`import { ${names.join(", ")} } from "${moduleName}";`]);
  }

  const existingNames = match[1]
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean);
  const nextNames = [...existingNames];

  for (const name of names) {
    if (!nextNames.includes(name)) {
      nextNames.push(name);
    }
  }

  return content.replace(match[0], `import { ${nextNames.join(", ")} } from "${moduleName}";`);
}

function insertBeforeOnce(
  content: string,
  marker: string,
  snippet: string,
  alreadyPresent: string,
) {
  if (content.includes(alreadyPresent)) return content;
  if (!content.includes(marker)) return content;
  return content.replace(marker, `${snippet}${marker}`);
}

function insertAfterOnce(content: string, marker: string, snippet: string, alreadyPresent: string) {
  if (content.includes(alreadyPresent)) return content;
  if (!content.includes(marker)) return content;
  return content.replace(marker, `${marker}${snippet}`);
}

async function writeFileIfChanged(filePath: string, content: string) {
  const existing = (await fs.pathExists(filePath))
    ? await fs.readFile(filePath, "utf-8")
    : undefined;
  if (existing === content) return;
  await fs.ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, content);
}

async function updateFileIfExists(filePath: string, update: (content: string) => string) {
  if (!(await fs.pathExists(filePath))) return;
  const content = await fs.readFile(filePath, "utf-8");
  const nextContent = update(content);
  if (nextContent !== content) {
    await fs.writeFile(filePath, nextContent);
  }
}

function usesCreateAuthFactory(config: ProjectConfig) {
  return (
    config.runtime === "workers" ||
    config.serverDeploy === "cloudflare" ||
    (config.backend === "self" && config.webDeploy === "cloudflare")
  );
}

function getAuthImportLine(config: ProjectConfig) {
  return usesCreateAuthFactory(config)
    ? `import { createAuth } from "@${config.projectName}/auth";`
    : `import { auth } from "@${config.projectName}/auth";`;
}

function getAuthExpression(config: ProjectConfig) {
  return usesCreateAuthFactory(config) ? "createAuth()" : "auth";
}

function addAiSdkEvlogTelemetry(content: string, loggerExpression: string) {
  let nextContent = addNamedImport(content, "evlog/ai", [
    "createAILogger",
    "createEvlogIntegration",
  ]);

  if (!nextContent.includes("const ai = createAILogger(")) {
    nextContent = nextContent.replace(
      /^(\s*)const model = wrapLanguageModel\({/m,
      (_match, indent: string) =>
        `${indent}const ai = createAILogger(${loggerExpression});\n${indent}const model = wrapLanguageModel({`,
    );
  }

  if (!nextContent.includes("model: ai.wrap(model)")) {
    nextContent = nextContent.replace(
      /(const result = streamText\({\n\s*)model,/,
      "$1model: ai.wrap(model),",
    );
  }

  if (!nextContent.includes("createEvlogIntegration(ai)")) {
    nextContent = nextContent.replace(
      /(messages:\s*await convertToModelMessages\([^)]+\),?)/,
      (match) =>
        `${match.endsWith(",") ? match : `${match},`}\n\t\texperimental_telemetry: {\n\t\t\tisEnabled: true,\n\t\t\tintegrations: [createEvlogIntegration(ai)],\n\t\t},`,
    );
  }

  return nextContent;
}

function addEvlogBetterAuthServerSetup(
  content: string,
  backend: EvlogBackend,
  authExpression: string,
) {
  let nextContent = addNamedImport(content, "evlog/better-auth", [
    "createAuthMiddleware",
    "type BetterAuthInstance",
  ]);
  const usesAuthFactory = authExpression.endsWith("()");
  const evlogAuthExpression = `${authExpression} as BetterAuthInstance`;
  const authOptions = '{ exclude: ["/api/auth/**"], maskEmail: true }';
  const identifySnippet = usesAuthFactory
    ? ""
    : `const identifyUser = createAuthMiddleware(${evlogAuthExpression}, ${authOptions});\n\n`;
  const identifyUserSetup = usesAuthFactory
    ? `\n\tconst identifyUser = createAuthMiddleware(${evlogAuthExpression}, ${authOptions});`
    : "";

  if (backend === "hono") {
    nextContent = insertBeforeOnce(
      nextContent,
      "const app = new Hono",
      identifySnippet,
      "createAuthMiddleware(",
    );
    return insertAfterOnce(
      nextContent,
      "app.use(evlog());",
      `\napp.use("*", async (c, next) => {${identifyUserSetup}\n\tawait identifyUser(c.get("log"), c.req.raw.headers, c.req.path);\n\tawait next();\n});`,
      'identifyUser(c.get("log")',
    );
  }

  if (backend === "express") {
    nextContent = insertBeforeOnce(
      nextContent,
      "const app = express();",
      identifySnippet,
      "createAuthMiddleware(",
    );
    return insertAfterOnce(
      nextContent,
      "app.use(evlog());",
      `\napp.use(async (req, _res, next) => {${identifyUserSetup}\n\tawait identifyUser(req.log, req.headers, req.path);\n\tnext();\n});`,
      "identifyUser(req.log",
    );
  }

  if (backend === "fastify") {
    nextContent = addNamedImport(nextContent, "evlog/fastify", ["useLogger"]);
    nextContent = insertBeforeOnce(
      nextContent,
      "const fastify = Fastify",
      identifySnippet,
      "createAuthMiddleware(",
    );
    return insertAfterOnce(
      nextContent,
      "fastify.register(evlog);",
      `\nfastify.addHook("preHandler", async (request) => {${identifyUserSetup}\n\tawait identifyUser(useLogger(), request.headers, request.url);\n});`,
      "identifyUser(useLogger()",
    );
  }

  nextContent = insertBeforeOnce(
    nextContent,
    "new Elysia",
    identifySnippet,
    "createAuthMiddleware(",
  );
  return insertAfterOnce(
    nextContent,
    ".use(evlog())",
    `\n\t.derive(async ({ request, log }) => {${identifyUserSetup.replace(/\n\t/g, "\n\t\t")}\n\t\tawait identifyUser(log, request.headers, new URL(request.url).pathname);\n\t\treturn {};\n\t})`,
    "identifyUser(log",
  );
}

export function addEvlogServerSetup(content: string, backend: EvlogBackend, serviceName: string) {
  const initSnippet = `initLogger({\n\tenv: { service: "${serviceName}" },\n});\n\n`;

  if (backend === "hono") {
    let nextContent = prependMissingImports(content, [
      'import { initLogger } from "evlog";',
      'import { evlog, type EvlogVariables } from "evlog/hono";',
    ]);
    nextContent = insertBeforeOnce(
      nextContent,
      "const app = new Hono",
      initSnippet,
      "initLogger({",
    );
    nextContent = nextContent.replace(
      "const app = new Hono();",
      "const app = new Hono<EvlogVariables>();",
    );
    nextContent = nextContent
      .replace('import { logger } from "hono/logger";\n', "")
      .replace(/\napp\.use\(logger\(\)\);/, "");
    return insertAfterOnce(
      nextContent,
      "const app = new Hono<EvlogVariables>();",
      "\n\napp.use(evlog());",
      "app.use(evlog());",
    );
  }

  if (backend === "express") {
    let nextContent = prependMissingImports(content, [
      'import { initLogger } from "evlog";',
      'import { evlog } from "evlog/express";',
    ]);
    nextContent = insertBeforeOnce(
      nextContent,
      "const app = express();",
      initSnippet,
      "initLogger({",
    );
    return insertAfterOnce(
      nextContent,
      "const app = express();",
      "\n\napp.use(evlog());",
      "app.use(evlog());",
    );
  }

  if (backend === "fastify") {
    let nextContent = prependMissingImports(content, [
      'import { initLogger } from "evlog";',
      'import { evlog } from "evlog/fastify";',
    ]);
    nextContent = insertBeforeOnce(
      nextContent,
      "const fastify = Fastify",
      initSnippet,
      "initLogger({",
    );
    return insertBeforeOnce(
      nextContent,
      "fastify.register(fastifyCors",
      "fastify.register(evlog);\n",
      "fastify.register(evlog);",
    );
  }

  let nextContent = prependMissingImports(content, [
    'import { initLogger } from "evlog";',
    'import { evlog } from "evlog/elysia";',
  ]);
  nextContent = insertBeforeOnce(nextContent, "new Elysia", initSnippet, "initLogger({");
  for (const marker of ["new Elysia({ adapter: node() })", "new Elysia()"]) {
    nextContent = insertAfterOnce(nextContent, marker, "\n\t.use(evlog())", ".use(evlog())");
  }
  return nextContent;
}

function addNuxtEvlogSetup(content: string, serviceName: string) {
  let nextContent = content;
  if (!nextContent.includes('"evlog/nuxt"') && !nextContent.includes("'evlog/nuxt'")) {
    nextContent = nextContent.replace(/modules:\s*\[/, (match) => `${match}\n    "evlog/nuxt",`);
  }

  if (!nextContent.includes("evlog:")) {
    nextContent = nextContent.replace(/\n\}\)\s*$/, (match) => {
      const contentBeforeConfigClose = nextContent.slice(0, -match.length);
      const needsComma = !/[,{]\s*$/.test(contentBeforeConfigClose);
      return `${needsComma ? "," : ""}\n  evlog: {\n    env: { service: "${serviceName}" },\n  },\n})`;
    });
  }

  return nextContent;
}

function addSvelteViteEvlogSetup(content: string, serviceName: string) {
  let nextContent = prependMissingImports(content, ['import evlog from "evlog/vite";']);
  if (nextContent.includes("evlog({")) return nextContent;

  return nextContent.replace(
    "plugins: [tailwindcss(), sveltekit()],",
    `plugins: [\n    tailwindcss(),\n    sveltekit(),\n    evlog({ service: "${serviceName}" }),\n  ],`,
  );
}

function addSvelteHooksEvlogSetup(content: string) {
  let nextContent = prependMissingImports(content, [
    'import { createEvlogHooks } from "evlog/sveltekit";',
  ]);

  if (!nextContent.includes("export const handle") && !nextContent.includes("const authHandle")) {
    if (!nextContent.includes("createEvlogHooks()")) {
      nextContent = `${nextContent.trimEnd()}\n\nexport const { handle, handleError } = createEvlogHooks();\n`;
    }
    return nextContent;
  }

  nextContent = prependMissingImports(nextContent, [
    'import { sequence } from "@sveltejs/kit/hooks";',
  ]);
  if (!nextContent.includes("const { handle: evlogHandle, handleError }")) {
    nextContent = nextContent.replace(
      /((?:import .+\n)+)/,
      `$1\nconst { handle: evlogHandle, handleError } = createEvlogHooks();\n\n`,
    );
  }
  nextContent = nextContent.replace(
    /export const handle(:\s*Handle)?\s*=\s*async/,
    (_match, typeAnnotation: string | undefined) =>
      `const authHandle${typeAnnotation ?? ""} = async`,
  );

  if (!nextContent.includes("sequence(evlogHandle, authHandle)")) {
    nextContent = `${nextContent.trimEnd()}\n\nexport const handle = sequence(evlogHandle as Handle, authHandle);\nexport { handleError };\n`;
  }

  return nextContent;
}

function addSvelteLocalsType(content: string) {
  let nextContent = prependMissingImports(content, ['import type { RequestLogger } from "evlog";']);

  if (nextContent.includes("log: RequestLogger")) return nextContent;

  if (nextContent.includes("// interface Locals {}")) {
    return nextContent.replace(
      "// interface Locals {}",
      "interface Locals {\n\t\t\tlog: RequestLogger;\n\t\t}",
    );
  }

  return nextContent.replace(
    "namespace App {",
    "namespace App {\n\t\tinterface Locals {\n\t\t\tlog: RequestLogger;\n\t\t}\n",
  );
}

function addTanstackStartRootEvlogSetup(content: string) {
  let nextContent = prependMissingImports(content, [
    'import { createMiddleware } from "@tanstack/react-start";',
    'import { evlogErrorHandler } from "evlog/nitro/v3";',
  ]);

  const middlewareEntry = "createMiddleware().server(evlogErrorHandler)";
  if (nextContent.includes(`middleware: [${middlewareEntry}]`)) {
    return nextContent;
  }

  if (nextContent.includes("middleware: [")) {
    return nextContent.replace("middleware: [", `middleware: [${middlewareEntry}, `);
  }

  if (/server:\s*{/.test(nextContent)) {
    return nextContent.replace(
      /server:\s*{\n/,
      `server: {\n    middleware: [${middlewareEntry}],\n`,
    );
  }

  return nextContent.replace(
    "head: () => ({",
    `server: {\n    middleware: [${middlewareEntry}],\n  },\n\n  head: () => ({`,
  );
}

function addAstroMiddlewareEvlogSetup(content: string, serviceName: string) {
  let nextContent = prependMissingImports(content, [
    'import { createRequestLogger, initLogger } from "evlog";',
  ]);
  const initSnippet = `initLogger({\n  env: { service: "${serviceName}" },\n});\n\n`;

  nextContent = insertBeforeOnce(
    nextContent,
    "export const onRequest",
    initSnippet,
    "initLogger({",
  );

  if (nextContent.includes("createRequestLogger({")) return nextContent;

  const contextMarker = "export const onRequest = defineMiddleware(async (context, next) => {";
  if (nextContent.includes(contextMarker)) {
    nextContent = insertAfterOnce(
      nextContent,
      contextMarker,
      `\n  const url = new URL(context.request.url);\n  const log = createRequestLogger({\n    method: context.request.method,\n    path: url.pathname,\n  });\n\n  context.locals.log = log;\n`,
      "const log = createRequestLogger({",
    );

    return nextContent.replace(
      "return next();",
      "const response = await next();\n  log.emit();\n  return response;",
    );
  }

  const localsMarker =
    "export const onRequest = defineMiddleware(async ({ request, locals }, next) => {";
  if (nextContent.includes(localsMarker)) {
    nextContent = insertAfterOnce(
      nextContent,
      localsMarker,
      `\n  const url = new URL(request.url);\n  const log = createRequestLogger({\n    method: request.method,\n    path: url.pathname,\n  });\n\n  locals.log = log;\n`,
      "const log = createRequestLogger({",
    );

    return nextContent.replace(
      "return next();",
      "const response = await next();\n  log.emit();\n  return response;",
    );
  }

  return nextContent;
}

function addAstroLocalsType(content: string) {
  let nextContent = prependMissingImports(content, ['import type { RequestLogger } from "evlog";']);

  if (nextContent.includes("log: RequestLogger")) return nextContent;

  if (nextContent.includes("interface Locals {")) {
    return nextContent.replace("interface Locals {", "interface Locals {\n    log: RequestLogger;");
  }

  if (nextContent.includes("declare namespace App {")) {
    return nextContent.replace(
      "declare namespace App {",
      "declare namespace App {\n  interface Locals {\n    log: RequestLogger;\n  }\n",
    );
  }

  return `${nextContent.trimEnd()}\n\ndeclare namespace App {\n  interface Locals {\n    log: RequestLogger;\n  }\n}\n`;
}

function addNextRouteWrappers(content: string) {
  let nextContent = prependMissingImports(content, ['import { withEvlog } from "@/lib/evlog";']);
  if (
    nextContent.includes("withEvlog(handler)") ||
    nextContent.includes("withEvlog(handleRequest)")
  ) {
    return nextContent;
  }

  nextContent = nextContent.replace(
    "export { handler as GET, handler as POST };",
    "export const GET = withEvlog(handler);\nexport const POST = withEvlog(handler);",
  );

  for (const method of ["GET", "POST", "PUT", "PATCH", "DELETE"]) {
    nextContent = nextContent.replace(
      `export const ${method} = handleRequest;`,
      `export const ${method} = withEvlog(handleRequest);`,
    );
  }

  return nextContent;
}

function addNextAiEvlogSetup(content: string) {
  let nextContent = addNamedImport(content, "@/lib/evlog", ["withEvlog"]);

  if (!nextContent.includes("withEvlog(async (req: Request)")) {
    nextContent = nextContent.replace(
      "export async function POST(req: Request) {",
      "export const POST = withEvlog(async (req: Request) => {",
    );
    if (nextContent.includes("export const POST = withEvlog(async (req: Request) => {")) {
      nextContent = nextContent.replace(/\n}\s*$/, "\n});\n");
    }
  }

  // Next emits the evlog route event when the streaming Response is returned.
  // AI SDK stream telemetry arrives later, so wiring createAILogger here drops `ai`.
  return nextContent;
}

function addNuxtAiEvlogSetup(content: string) {
  return addAiSdkEvlogTelemetry(content, "useLogger(event)");
}

function addSvelteAiEvlogSetup(content: string) {
  let nextContent = content.replace(
    "export const POST: RequestHandler = async ({ request }) => {",
    "export const POST: RequestHandler = async ({ request, locals }) => {",
  );

  return addAiSdkEvlogTelemetry(nextContent, "locals.log");
}

function addTanstackStartAiEvlogSetup(content: string) {
  let nextContent = prependMissingImports(content, [
    'import type { RequestLogger } from "evlog";',
    'import { useRequest } from "nitro/context";',
  ]);

  return addAiSdkEvlogTelemetry(nextContent, "useRequest().context.log as RequestLogger");
}

function addBackendAiEvlogSetup(content: string, backend: EvlogBackend) {
  if (backend === "hono") {
    return addAiSdkEvlogTelemetry(content, 'c.get("log")');
  }

  if (backend === "express") {
    return addAiSdkEvlogTelemetry(content, "req.log");
  }

  if (backend === "fastify") {
    const nextContent = addNamedImport(content, "evlog/fastify", ["useLogger"]);
    return addAiSdkEvlogTelemetry(nextContent, "useLogger()");
  }

  return addAiSdkEvlogTelemetry(content, "context.log");
}

function addNextBetterAuthToRoute(content: string) {
  let nextContent = addNamedImport(content, "@/lib/evlog-auth", ["identifyEvlogUser"]);

  nextContent = nextContent.replace("function handler(req:", "async function handler(req:");

  for (const marker of [
    "async function handler(req: NextRequest) {",
    "async function handleRequest(req: NextRequest) {",
    "export const POST = withEvlog(async (req: Request) => {",
  ]) {
    nextContent = insertAfterOnce(
      nextContent,
      marker,
      "\n\tawait identifyEvlogUser(req);",
      "identifyEvlogUser(req)",
    );
  }

  return nextContent;
}

function addSvelteBetterAuthEvlogSetup(content: string, config: ProjectConfig) {
  if (!content.includes("authHandle") || content.includes("evlogAuthHandle")) {
    return content;
  }

  let nextContent = addNamedImport(content, "evlog/better-auth", [
    "createAuthMiddleware",
    "type BetterAuthInstance",
  ]);
  if (!nextContent.includes(`@${config.projectName}/auth`)) {
    nextContent = prependMissingImports(nextContent, [getAuthImportLine(config)]);
  }
  if (
    usesCreateAuthFactory(config) &&
    config.webDeploy === "cloudflare" &&
    !nextContent.includes(`@${config.projectName}/env/server`)
  ) {
    nextContent = prependMissingImports(nextContent, [
      `import { env as localEnv } from "@${config.projectName}/env/server";`,
    ]);
  }
  const authExpression = getAuthExpression(config);
  const authOptions = '{ exclude: ["/api/auth/**"], maskEmail: true }';
  const authHandleSnippet =
    usesCreateAuthFactory(config) && config.webDeploy === "cloudflare"
      ? `const evlogAuthHandle: Handle = async ({ event, resolve }) => {\n\tif (building) {\n\t\treturn resolve(event);\n\t}\n\n\tconst authEnv = event.platform?.env ?? localEnv;\n\tconst identifyUser = createAuthMiddleware(createAuth(authEnv) as BetterAuthInstance, ${authOptions});\n\tawait identifyUser(event.locals.log, event.request.headers, event.url.pathname);\n\treturn resolve(event);\n};\n\n`
      : `const identifyUser = createAuthMiddleware(${authExpression} as BetterAuthInstance, ${authOptions});\n\nconst evlogAuthHandle: Handle = async ({ event, resolve }) => {\n\tawait identifyUser(event.locals.log, event.request.headers, event.url.pathname);\n\treturn resolve(event);\n};\n\n`;

  nextContent = insertAfterOnce(
    nextContent,
    "const { handle: evlogHandle, handleError } = createEvlogHooks();\n\n",
    authHandleSnippet,
    "evlogAuthHandle",
  );

  return nextContent
    .replace(
      "sequence(evlogHandle as Handle, authHandle)",
      "sequence(evlogHandle as Handle, evlogAuthHandle, authHandle)",
    )
    .replace(
      "sequence(evlogHandle, authHandle)",
      "sequence(evlogHandle as Handle, evlogAuthHandle, authHandle)",
    );
}

function addAstroBetterAuthEvlogSetup(content: string, config: ProjectConfig) {
  if (content.includes("createAuthMiddleware(")) return content;

  let nextContent = addNamedImport(content, "evlog/better-auth", [
    "createAuthMiddleware",
    "type BetterAuthInstance",
  ]);
  if (!nextContent.includes(`@${config.projectName}/auth`)) {
    nextContent = prependMissingImports(nextContent, [getAuthImportLine(config)]);
  }
  const authExpression = getAuthExpression(config);
  const authOptions = '{ exclude: ["/api/auth/**"], maskEmail: true }';
  const usesFactory = usesCreateAuthFactory(config);
  if (!usesFactory) {
    nextContent = insertBeforeOnce(
      nextContent,
      "export const onRequest",
      `const identifyUser = createAuthMiddleware(${authExpression} as BetterAuthInstance, ${authOptions});\n\n`,
      "const identifyUser = createAuthMiddleware(",
    );
  }

  for (const marker of ["context.locals.log = log;", "locals.log = log;"]) {
    if (!nextContent.includes(marker)) continue;

    const requestExpression = marker.startsWith("context") ? "context.request" : "request";
    const identifySnippet = usesFactory
      ? `\n\n  const identifyUser = createAuthMiddleware(${authExpression} as BetterAuthInstance, ${authOptions});\n  await identifyUser(log, ${requestExpression}.headers, url.pathname);`
      : `\n\n  await identifyUser(log, ${requestExpression}.headers, url.pathname);`;

    return insertAfterOnce(nextContent, marker, identifySnippet, "identifyUser(log");
  }

  return nextContent;
}

function getNextEvlogFile(serviceName: string) {
  return `import { createEvlog } from "evlog/next";
import { createInstrumentation } from "evlog/next/instrumentation";

export const { withEvlog, useLogger, log, createError } = createEvlog({
  service: "${serviceName}",
});

export const { register, onRequestError } = createInstrumentation({
  service: "${serviceName}",
});
`;
}

function getNextInstrumentationFile() {
  return `import { defineNodeInstrumentation } from "evlog/next/instrumentation";

export const { register, onRequestError } = defineNodeInstrumentation(() => import("./src/lib/evlog"));
`;
}

function getNextProxyFile() {
  return `import { evlogMiddleware } from "evlog/next";

export const proxy = evlogMiddleware();

export const config = {
  matcher: ["/api/:path*"],
};
`;
}

function getNextEvlogAuthFile(config: ProjectConfig) {
  if (usesCreateAuthFactory(config)) {
    return `${getAuthImportLine(config)}
import { createAuthMiddleware, type BetterAuthInstance } from "evlog/better-auth";
import { useLogger } from "@/lib/evlog";

export async function identifyEvlogUser(request: Request) {
  const identifyUser = createAuthMiddleware(${getAuthExpression(config)} as BetterAuthInstance, {
    exclude: ["/api/auth/**"],
    maskEmail: true,
  });
  await identifyUser(useLogger(), request.headers, new URL(request.url).pathname);
}
`;
  }

  return `${getAuthImportLine(config)}
import { createAuthMiddleware, type BetterAuthInstance } from "evlog/better-auth";
import { useLogger } from "@/lib/evlog";

const identifyUser = createAuthMiddleware(${getAuthExpression(config)} as BetterAuthInstance, {
  exclude: ["/api/auth/**"],
  maskEmail: true,
});

export async function identifyEvlogUser(request: Request) {
  await identifyUser(useLogger(), request.headers, new URL(request.url).pathname);
}
`;
}

function getNitroEvlogAuthPluginFile(config: ProjectConfig) {
  if (usesCreateAuthFactory(config)) {
    return `${getAuthImportLine(config)}
import { createAuthIdentifier, type BetterAuthInstance } from "evlog/better-auth";

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook("request", async (event) => {
    const identify = createAuthIdentifier(${getAuthExpression(config)} as BetterAuthInstance, {
      exclude: ["/api/auth/**"],
      maskEmail: true,
    });
    await identify(event);
  });
});
`;
  }

  return `${getAuthImportLine(config)}
import { createAuthIdentifier, type BetterAuthInstance } from "evlog/better-auth";

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook(
    "request",
    createAuthIdentifier(${getAuthExpression(config)} as BetterAuthInstance, {
      exclude: ["/api/auth/**"],
      maskEmail: true,
    }),
  );
});
`;
}

function getNuxtEvlogAuthMiddlewareFile(config: ProjectConfig) {
  if (usesCreateAuthFactory(config)) {
    return `${getAuthImportLine(config)}
import { createAuthMiddleware, type BetterAuthInstance } from "evlog/better-auth";

export default defineEventHandler(async (event) => {
  if (!event.context.log) return;
  const identify = createAuthMiddleware(${getAuthExpression(config)} as BetterAuthInstance, {
    exclude: ["/api/auth/**"],
    maskEmail: true,
  });
  await identify(event.context.log, event.headers, event.path);
});
`;
  }

  return `${getAuthImportLine(config)}
import { createAuthMiddleware, type BetterAuthInstance } from "evlog/better-auth";

const identify = createAuthMiddleware(${getAuthExpression(config)} as BetterAuthInstance, {
  exclude: ["/api/auth/**"],
  maskEmail: true,
});

export default defineEventHandler(async (event) => {
  if (!event.context.log) return;
  await identify(event.context.log, event.headers, event.path);
});
`;
}

function getTanstackNitroConfigFile(serviceName: string) {
  return `import { defineConfig } from "nitro";
import evlog from "evlog/nitro/v3";

export default defineConfig({
  experimental: {
    asyncContext: true,
  },
  modules: [
    evlog({
      env: { service: "${serviceName}" },
    }),
  ],
});
`;
}

function getAstroMiddlewareFile(serviceName: string) {
  return `import { defineMiddleware } from "astro:middleware";
import { createRequestLogger, initLogger } from "evlog";

initLogger({
  env: { service: "${serviceName}" },
});

export const onRequest = defineMiddleware(async ({ request, locals }, next) => {
  const url = new URL(request.url);
  const log = createRequestLogger({
    method: request.method,
    path: url.pathname,
  });

  locals.log = log;

  try {
    const response = await next();
    log.emit();
    return response;
  } catch (error) {
    log.error(error instanceof Error ? error : new Error(String(error)));
    log.emit();
    throw error;
  }
});
`;
}

function getAstroEnvFile() {
  return `/// <reference types="astro/client" />

import type { RequestLogger } from "evlog";

declare namespace App {
  interface Locals {
    log: RequestLogger;
  }
}
`;
}

async function setupNextEvlog(config: ProjectConfig, serviceName: string) {
  const webDir = path.join(config.projectDir, "apps/web");

  const evlogPath = path.join(webDir, "src/lib/evlog.ts");
  if (!(await fs.pathExists(evlogPath))) {
    await writeFileIfChanged(evlogPath, getNextEvlogFile(serviceName));
  }

  const identifyWebAuth = shouldIdentifyWebAuth(config);

  if (identifyWebAuth) {
    const evlogAuthPath = path.join(webDir, "src/lib/evlog-auth.ts");
    if (!(await fs.pathExists(evlogAuthPath))) {
      await writeFileIfChanged(evlogAuthPath, getNextEvlogAuthFile(config));
    }
  }

  const instrumentationPath = path.join(webDir, "instrumentation.ts");
  if (!(await fs.pathExists(instrumentationPath))) {
    await writeFileIfChanged(instrumentationPath, getNextInstrumentationFile());
  }

  const proxyPath = path.join(webDir, "src/proxy.ts");
  const rootProxyPath = path.join(webDir, "proxy.ts");
  if (!(await fs.pathExists(proxyPath)) && !(await fs.pathExists(rootProxyPath))) {
    await writeFileIfChanged(proxyPath, getNextProxyFile());
  }

  const updateNextApiRoute = (content: string) => {
    let nextContent = addNextRouteWrappers(content);
    if (identifyWebAuth) {
      nextContent = addNextBetterAuthToRoute(nextContent);
    }
    return nextContent;
  };

  await updateFileIfExists(
    path.join(webDir, "src/app/api/trpc/[trpc]/route.ts"),
    updateNextApiRoute,
  );
  await updateFileIfExists(
    path.join(webDir, "src/app/api/rpc/[[...rest]]/route.ts"),
    updateNextApiRoute,
  );

  if (config.examples.includes("ai")) {
    await updateFileIfExists(path.join(webDir, "src/app/api/ai/route.ts"), (content) => {
      let nextContent = addNextAiEvlogSetup(content);
      if (identifyWebAuth) {
        nextContent = addNextBetterAuthToRoute(nextContent);
      }
      return nextContent;
    });
  }
}

async function setupNuxtEvlog(config: ProjectConfig, serviceName: string) {
  const webDir = path.join(config.projectDir, "apps/web");
  await updateFileIfExists(path.join(webDir, "nuxt.config.ts"), (content) =>
    addNuxtEvlogSetup(content, serviceName),
  );

  if (shouldIdentifyWebAuth(config)) {
    const oldAuthPluginPath = path.join(webDir, "server/plugins/evlog-auth.ts");
    if (await fs.pathExists(oldAuthPluginPath)) {
      const oldAuthPlugin = await fs.readFile(oldAuthPluginPath, "utf-8");
      if (oldAuthPlugin.includes("evlog/better-auth")) {
        await fs.remove(oldAuthPluginPath);
      }
    }

    const authMiddlewarePath = path.join(webDir, "server/middleware/evlog-auth.ts");
    if (!(await fs.pathExists(authMiddlewarePath))) {
      await writeFileIfChanged(authMiddlewarePath, getNuxtEvlogAuthMiddlewareFile(config));
    }
  }

  if (config.examples.includes("ai")) {
    await updateFileIfExists(path.join(webDir, "server/api/ai.post.ts"), addNuxtAiEvlogSetup);
  }
}

async function setupSvelteEvlog(config: ProjectConfig, serviceName: string) {
  const webDir = path.join(config.projectDir, "apps/web");
  await updateFileIfExists(path.join(webDir, "vite.config.ts"), (content) =>
    addSvelteViteEvlogSetup(content, serviceName),
  );

  const hooksPath = path.join(webDir, "src/hooks.server.ts");
  if (await fs.pathExists(hooksPath)) {
    await updateFileIfExists(hooksPath, addSvelteHooksEvlogSetup);
  } else {
    await writeFileIfChanged(
      hooksPath,
      `import { createEvlogHooks } from "evlog/sveltekit";

export const { handle, handleError } = createEvlogHooks();
`,
    );
  }

  await updateFileIfExists(path.join(webDir, "src/app.d.ts"), addSvelteLocalsType);

  if (shouldIdentifyWebAuth(config)) {
    await updateFileIfExists(path.join(webDir, "src/hooks.server.ts"), (content) =>
      addSvelteBetterAuthEvlogSetup(content, config),
    );
  }

  if (config.examples.includes("ai")) {
    await updateFileIfExists(
      path.join(webDir, "src/routes/api/ai/+server.ts"),
      addSvelteAiEvlogSetup,
    );
  }
}

async function setupTanstackStartEvlog(config: ProjectConfig, serviceName: string) {
  const webDir = path.join(config.projectDir, "apps/web");
  const nitroConfigPath = path.join(webDir, "nitro.config.ts");
  if (!(await fs.pathExists(nitroConfigPath))) {
    await writeFileIfChanged(nitroConfigPath, getTanstackNitroConfigFile(serviceName));
  }
  await updateFileIfExists(
    path.join(webDir, "src/routes/__root.tsx"),
    addTanstackStartRootEvlogSetup,
  );

  if (shouldIdentifyWebAuth(config)) {
    const authPluginPath = path.join(webDir, "server/plugins/evlog-auth.ts");
    if (!(await fs.pathExists(authPluginPath))) {
      await writeFileIfChanged(authPluginPath, getNitroEvlogAuthPluginFile(config));
    }
  }

  if (config.examples.includes("ai")) {
    await updateFileIfExists(
      path.join(webDir, "src/routes/api/ai/$.ts"),
      addTanstackStartAiEvlogSetup,
    );
  }
}

async function setupAstroEvlog(config: ProjectConfig, serviceName: string) {
  const webDir = path.join(config.projectDir, "apps/web");
  const middlewarePath = path.join(webDir, "src/middleware.ts");
  if (!(await fs.pathExists(middlewarePath))) {
    await writeFileIfChanged(middlewarePath, getAstroMiddlewareFile(serviceName));
  } else {
    await updateFileIfExists(middlewarePath, (content) =>
      addAstroMiddlewareEvlogSetup(content, serviceName),
    );
  }

  const envPath = path.join(webDir, "src/env.d.ts");
  if (!(await fs.pathExists(envPath))) {
    await writeFileIfChanged(envPath, getAstroEnvFile());
  } else {
    await updateFileIfExists(envPath, addAstroLocalsType);
  }

  if (shouldIdentifyWebAuth(config)) {
    await updateFileIfExists(middlewarePath, (content) =>
      addAstroBetterAuthEvlogSetup(content, config),
    );
  }
}

async function setupEvlogWeb(config: ProjectConfig) {
  const frontend = getEvlogWebFrontend(config.frontend);
  if (!frontend) return;

  const serviceName = `${config.projectName}-web`;

  if (frontend === "next") {
    await setupNextEvlog(config, serviceName);
  } else if (frontend === "nuxt") {
    await setupNuxtEvlog(config, serviceName);
  } else if (frontend === "svelte") {
    await setupSvelteEvlog(config, serviceName);
  } else if (frontend === "tanstack-start") {
    await setupTanstackStartEvlog(config, serviceName);
  } else if (frontend === "astro") {
    await setupAstroEvlog(config, serviceName);
  }
}

export async function setupEvlog(config: ProjectConfig): Promise<Result<void, AddonSetupError>> {
  return Result.tryPromise({
    try: async () => {
      if (isEvlogBackend(config.backend)) {
        const serverIndexPath = path.join(config.projectDir, "apps/server/src/index.ts");
        if (await fs.pathExists(serverIndexPath)) {
          const content = await fs.readFile(serverIndexPath, "utf-8");
          let nextContent = addEvlogServerSetup(
            content,
            config.backend,
            `${config.projectName}-server`,
          );

          if (config.auth === "better-auth") {
            nextContent = addEvlogBetterAuthServerSetup(
              nextContent,
              config.backend,
              getAuthExpression(config),
            );
          }

          if (config.examples.includes("ai")) {
            nextContent = addBackendAiEvlogSetup(nextContent, config.backend);
          }

          if (nextContent !== content) {
            await fs.writeFile(serverIndexPath, nextContent);
          }
        }
      }

      await setupEvlogWeb(config);
    },
    catch: (error) =>
      new AddonSetupError({
        addon: "evlog",
        message: `Failed to set up evlog: ${error instanceof Error ? error.message : String(error)}`,
        cause: error,
      }),
  });
}
