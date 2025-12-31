import type { ProjectConfig } from "@better-t-stack/types";

import Handlebars from "handlebars";

// Register Handlebars helpers (same as CLI)
Handlebars.registerHelper("eq", (a, b) => a === b);
Handlebars.registerHelper("ne", (a, b) => a !== b);
Handlebars.registerHelper("and", (...args) => {
  const values = args.slice(0, -1);
  return values.every((value) => value);
});
Handlebars.registerHelper("or", (...args) => {
  const values = args.slice(0, -1);
  return values.some((value) => value);
});
Handlebars.registerHelper(
  "includes",
  (array, value) => Array.isArray(array) && array.includes(value),
);

/**
 * Process a Handlebars template string with the given context
 */
export function processTemplateString(templateContent: string, context: ProjectConfig): string {
  const template = Handlebars.compile(templateContent);
  return template(context);
}

/**
 * Determine if a file should be treated as binary (not processed by Handlebars)
 */
export function isBinaryFile(filePath: string): boolean {
  const binaryExtensions = new Set([".png", ".ico", ".svg", ".jpg", ".jpeg", ".gif", ".webp"]);
  const ext = filePath.slice(filePath.lastIndexOf(".")).toLowerCase();
  return binaryExtensions.has(ext);
}

/**
 * Transform template filename to output filename
 * - Remove .hbs extension
 * - Convert _gitignore to .gitignore
 * - Convert _npmrc to .npmrc
 */
export function transformFilename(filename: string): string {
  let result = filename;

  // Remove .hbs extension
  if (result.endsWith(".hbs")) {
    result = result.slice(0, -4);
  }

  // Transform special filenames
  const basename = result.split("/").pop() || result;
  if (basename === "_gitignore") {
    result = result.replace(/_gitignore$/, ".gitignore");
  } else if (basename === "_npmrc") {
    result = result.replace(/_npmrc$/, ".npmrc");
  }

  return result;
}

/**
 * Process template content based on file type
 * - Binary files: return empty string (placeholder)
 * - .hbs files: compile with Handlebars
 * - Other files: return as-is
 */
export function processFileContent(
  filePath: string,
  content: string,
  context: ProjectConfig,
): string {
  if (isBinaryFile(filePath)) {
    return "[Binary file]";
  }

  const originalPath = filePath.endsWith(".hbs") ? filePath : filePath + ".hbs";

  // Check if this was a .hbs file (content came from .hbs source)
  if (filePath !== originalPath || filePath.includes(".hbs")) {
    try {
      return processTemplateString(content, context);
    } catch (error) {
      // If template processing fails, return original content
      console.warn(`Template processing failed for ${filePath}:`, error);
      return content;
    }
  }

  return content;
}

export { Handlebars };
