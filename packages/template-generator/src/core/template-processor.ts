import { type ProjectConfig, usesAlchemyManagedDatabase } from "@better-t-stack/types";
import Handlebars from "handlebars";
import isBinaryPath from "is-binary-path";

Handlebars.registerHelper("eq", (a, b) => a === b);
Handlebars.registerHelper("ne", (a, b) => a !== b);
Handlebars.registerHelper("and", (...args) => args.slice(0, -1).every(Boolean));
Handlebars.registerHelper("or", (...args) => args.slice(0, -1).some(Boolean));
Handlebars.registerHelper("not", (a) => !a);
Handlebars.registerHelper("includes", (arr, val) => Array.isArray(arr) && arr.includes(val));
// Mirrors the sanitizers expo prebuild applies when it suggests identifiers.
const reservedAndroidSegments = new Set([
  "abstract",
  "assert",
  "boolean",
  "break",
  "byte",
  "case",
  "catch",
  "char",
  "class",
  "const",
  "continue",
  "default",
  "do",
  "double",
  "else",
  "enum",
  "extends",
  "final",
  "finally",
  "float",
  "for",
  "goto",
  "if",
  "implements",
  "import",
  "instanceof",
  "int",
  "interface",
  "long",
  "native",
  "new",
  "package",
  "private",
  "protected",
  "public",
  "return",
  "short",
  "static",
  "strictfp",
  "super",
  "switch",
  "synchronized",
  "this",
  "throw",
  "throws",
  "transient",
  "try",
  "void",
  "volatile",
  "while",
  "true",
  "false",
  "null",
]);

function sanitizeAndroidPackage(value: string) {
  const output = value
    .replace(/[^a-zA-Z0-9_.]/g, "")
    .replace(/\.+/g, ".")
    .replace(/^\.|\.$/g, "");
  return (output || "app")
    .split(".")
    .map((segment) => {
      const valid = /^[a-zA-Z]/.test(segment) ? segment : `x${segment}`;
      return reservedAndroidSegments.has(valid) ? `x${valid}` : valid;
    })
    .join(".");
}

function sanitizeIosBundleIdentifier(value: string) {
  return value.replace(/(^[^a-zA-Z.-]|[^a-zA-Z0-9-.])/g, "-");
}

Handlebars.registerHelper("appId", (projectName: string, platform: "ios" | "android") => {
  const id = `com.anonymous.${projectName}`;
  return platform === "android" ? sanitizeAndroidPackage(id) : sanitizeIosBundleIdentifier(id);
});
Handlebars.registerHelper(
  "usesAlchemyDatabase",
  (backend, dbSetup, webDeploy, serverDeploy, dbSetupOptions) =>
    usesAlchemyManagedDatabase({ backend, dbSetup, webDeploy, serverDeploy, dbSetupOptions }),
);
// Vercel Services pass the original request path to the server service, so a
// server deployed alongside its web app serves the public /api paths directly
Handlebars.registerHelper("apiPrefix", (webDeploy, serverDeploy) =>
  webDeploy === "vercel" && serverDeploy === "vercel" ? "/api" : "",
);
Handlebars.registerHelper(
  "usesRequestScopedCloudflareEnv",
  (backend, webDeploy, frontend) =>
    backend === "self" &&
    webDeploy === "cloudflare" &&
    Array.isArray(frontend) &&
    (frontend.includes("nuxt") || frontend.includes("svelte")),
);

const getServerUrlSource = `{{#if (and (eq webDeploy serverDeploy) (or (eq webDeploy "vercel") (eq webDeploy "docker")))}}
function getServerUrl(url: string) {
	const processEnv = typeof process === "undefined" ? undefined : process.env;
	if (typeof window === "undefined" && processEnv?.SERVER_URL) {
{{#if (eq webDeploy "vercel")}}
		return new URL("api", processEnv.SERVER_URL).toString().replace(/\\/$/, "");
{{else}}
		return processEnv.SERVER_URL.endsWith("/")
			? processEnv.SERVER_URL.slice(0, -1)
			: processEnv.SERVER_URL;
{{/if}}
	}

{{#if (eq webDeploy "vercel")}}
	const normalized = url.endsWith("/") ? url.slice(0, -1) : url;

	if (!normalized.startsWith("/")) {
		return normalized;
	}

	if (typeof window !== "undefined") {
		return \`\${window.location.origin}\${normalized}\`;
	}

	const vercelUrl =
		processEnv?.VERCEL_ENV === "production"
			? (processEnv?.VERCEL_PROJECT_PRODUCTION_URL ?? processEnv?.VERCEL_URL)
			: (processEnv?.VERCEL_URL ?? processEnv?.VERCEL_PROJECT_PRODUCTION_URL);
	if (vercelUrl) {
		const origin = vercelUrl.startsWith("http") ? vercelUrl : \`https://\${vercelUrl}\`;
		return \`\${origin}\${normalized}\`;
	}

	return \`http://localhost:3000\${normalized}\`;
{{else}}
	return url.endsWith("/") ? url.slice(0, -1) : url;
{{/if}}
}
{{/if}}`;

const dockerEnvSecrets =
  "--mount=type=secret,id=web_env,target=/app/apps/web/.env.local --mount=type=secret,id=server_env,target=/app/apps/server/.env.local";

// `{{> dockerPrune target="web"}}`: a stage holding `out/json` (manifests and the pruned
// lockfile) and `out/full` (sources) for one app and the workspace packages it uses.
Handlebars.registerPartial(
  "dockerPrune",
  `# Keep only {{target}} and the workspace packages it uses, so dependency installs stay
# cached until one of their package.json files or the lockfile changes.
FROM node:26-slim AS prune
WORKDIR /app
COPY . .
# Installing runs \`varlock codegen\`, which reads the app schemas, so they ship with the manifests.
RUN --mount=type=cache,target=/root/.npm npx --yes turbo@2 prune {{target}} --docker \\
  && find . -mindepth 3 -maxdepth 3 -name .env.schema -not -path "./out/*" -exec cp --parents {} out/json/ \\;
`,
);

Handlebars.registerPartial(
  "dockerInstall",
  `{{#if (eq packageManager "bun")}}
RUN ${dockerEnvSecrets} --mount=type=cache,target=/root/.bun/install/cache bun install --frozen-lockfile
{{else if (eq packageManager "pnpm")}}
RUN ${dockerEnvSecrets} --mount=type=cache,target=/pnpm-store pnpm install --frozen-lockfile --store-dir /pnpm-store
{{else}}
RUN ${dockerEnvSecrets} --mount=type=cache,target=/root/.npm npm ci
{{/if}}
`,
);

Handlebars.registerPartial(
  "dockerProdInstall",
  `{{#if (eq packageManager "bun")}}
RUN --mount=type=cache,target=/root/.bun/install/cache bun install --production --frozen-lockfile --ignore-scripts
{{else if (eq packageManager "pnpm")}}
RUN --mount=type=cache,target=/pnpm-store pnpm install --prod --frozen-lockfile --ignore-scripts --store-dir /pnpm-store
{{else}}
RUN --mount=type=cache,target=/root/.npm npm ci --omit=dev --ignore-scripts
{{/if}}
`,
);

// For bundled server output (Next standalone, Nitro): the runtime only needs the Varlock CLI,
// installed alone at the version the lockfile resolved for the web app.
Handlebars.registerPartial(
  "dockerVarlockCli",
  `# The server bundle carries its own dependencies; startup only needs the Varlock CLI
RUN --mount=type=cache,target=/root/.npm cd apps/web && npm install --prefix /varlock --omit=dev --no-save --no-package-lock \\
  "varlock@$(node -p 'require(require("fs").existsSync("node_modules/varlock") ? "./node_modules/varlock/package.json" : "../../node_modules/varlock/package.json").version')"
`,
);

// The Prisma client is gitignored, so the pruned sources never include it.
Handlebars.registerPartial(
  "dockerPrismaGenerate",
  `{{#if (eq orm "prisma")}}
RUN ${dockerEnvSecrets} if [ -d packages/db ]; then cd packages/db && {{packageManager}} run db:generate; fi
{{/if}}
`,
);

Handlebars.registerPartial("getServerUrl", getServerUrlSource);
Handlebars.registerPartial("getServerUrlSpaces", getServerUrlSource.replaceAll("\t", "  "));

export function processTemplateString(content: string, context: ProjectConfig): string {
  return Handlebars.compile(content)(context);
}

export function isBinaryFile(filePath: string): boolean {
  return isBinaryPath(filePath);
}

export function transformFilename(filename: string): string {
  let result = filename.endsWith(".hbs") ? filename.slice(0, -4) : filename;

  const basename = result.split("/").pop() || result;
  if (basename === "_gitignore") result = result.replace(/_gitignore$/, ".gitignore");
  else if (basename === "_npmrc") result = result.replace(/_npmrc$/, ".npmrc");
  else if (basename === "_dockerignore") result = result.replace(/_dockerignore$/, ".dockerignore");
  else if (basename === "_vercelignore") result = result.replace(/_vercelignore$/, ".vercelignore");

  return result;
}

export function processFileContent(
  filePath: string,
  content: string,
  context: ProjectConfig,
): string {
  if (isBinaryFile(filePath)) return "[Binary file]";

  const originalPath = filePath.endsWith(".hbs") ? filePath : filePath + ".hbs";
  if (filePath !== originalPath || filePath.includes(".hbs")) {
    try {
      return processTemplateString(content, context);
    } catch (error) {
      console.warn(`Template processing failed for ${filePath}:`, error);
      return content;
    }
  }

  return content;
}

export { Handlebars };
