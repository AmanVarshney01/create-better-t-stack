import type { ProjectConfig } from "@better-t-stack/types";

import Handlebars from "handlebars";

Handlebars.registerHelper("eq", (a, b) => a === b);
Handlebars.registerHelper("ne", (a, b) => a !== b);
Handlebars.registerHelper("and", (...args) => args.slice(0, -1).every(Boolean));
Handlebars.registerHelper("or", (...args) => args.slice(0, -1).some(Boolean));
Handlebars.registerHelper("includes", (arr, val) => Array.isArray(arr) && arr.includes(val));

const BINARY_EXTENSIONS = new Set([".png", ".ico", ".svg", ".jpg", ".jpeg", ".gif", ".webp"]);

export function processTemplateString(content: string, context: ProjectConfig): string {
  return Handlebars.compile(content)(context);
}

export function isBinaryFile(filePath: string): boolean {
  const ext = filePath.slice(filePath.lastIndexOf(".")).toLowerCase();
  return BINARY_EXTENSIONS.has(ext);
}

export function transformFilename(filename: string): string {
  let result = filename.endsWith(".hbs") ? filename.slice(0, -4) : filename;

  const basename = result.split("/").pop() || result;
  if (basename === "_gitignore") result = result.replace(/_gitignore$/, ".gitignore");
  else if (basename === "_npmrc") result = result.replace(/_npmrc$/, ".npmrc");

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
