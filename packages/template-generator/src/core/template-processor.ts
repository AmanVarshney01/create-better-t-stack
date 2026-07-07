import type { ProjectConfig } from "@better-t-stack/types";
import Handlebars from "handlebars";
import isBinaryPath from "is-binary-path";

Handlebars.registerHelper("eq", (a, b) => a === b);
Handlebars.registerHelper("ne", (a, b) => a !== b);
Handlebars.registerHelper("and", (...args) => args.slice(0, -1).every(Boolean));
Handlebars.registerHelper("or", (...args) => args.slice(0, -1).some(Boolean));
Handlebars.registerHelper("not", (a) => !a);
Handlebars.registerHelper("includes", (arr, val) => Array.isArray(arr) && arr.includes(val));

// Shared across every web client template (oRPC/tRPC/better-auth) so the
// same-origin URL normalization for Vercel deploys has one source of truth.
const getServerUrlSource = `const getServerUrl = (url: string) => {
	const normalized = url.endsWith("/") ? url.slice(0, -1) : url;

	if (!normalized.startsWith("/")) {
		return normalized;
	}

	if (typeof window !== "undefined") {
		return \`\${window.location.origin}\${normalized}\`;
	}

	const processEnv = (globalThis as {
		process?: { env?: Record<string, string | undefined> };
	}).process?.env;
	const vercelUrl =
		processEnv?.VERCEL_ENV === "production"
			? (processEnv?.VERCEL_PROJECT_PRODUCTION_URL ?? processEnv?.VERCEL_URL)
			: (processEnv?.VERCEL_URL ?? processEnv?.VERCEL_PROJECT_PRODUCTION_URL);
	if (vercelUrl) {
		const origin = vercelUrl.startsWith("http") ? vercelUrl : \`https://\${vercelUrl}\`;
		return \`\${origin}\${normalized}\`;
	}

	return \`http://localhost:3000\${normalized}\`;
};`;

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
