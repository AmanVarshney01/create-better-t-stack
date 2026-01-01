import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { glob } from "tinyglobby";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Get the root path where templates are stored
 */
export function getTemplatesRoot(): string {
  // In development: templates are in the package root
  // In production (npm): templates are in the installed package
  const possiblePaths = [
    path.join(__dirname, "../templates"), // From dist/
    path.join(__dirname, "../../templates"), // From dist/src/
    path.join(__dirname, "../../../templates"), // Alternative layout
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      return p;
    }
  }

  throw new Error("Templates directory not found. Checked: " + possiblePaths.join(", "));
}

/**
 * Load all templates from a directory prefix into a Map
 * This is the primary way to load templates for processing
 */
export async function loadTemplates(prefix?: string): Promise<Map<string, string>> {
  const templatesRoot = getTemplatesRoot();
  const searchDir = prefix ? path.join(templatesRoot, prefix) : templatesRoot;

  if (!fs.existsSync(searchDir)) {
    return new Map();
  }

  const files = await glob("**/*", {
    cwd: searchDir,
    dot: true,
    onlyFiles: true,
  });

  const templates = new Map<string, string>();

  for (const file of files) {
    const fullPath = path.join(searchDir, file);
    const relativePath = prefix ? `${prefix}/${file}` : file;

    try {
      // Skip binary files
      if (isBinaryPath(file)) {
        templates.set(relativePath, "[Binary file]");
      } else {
        const content = fs.readFileSync(fullPath, "utf-8");
        templates.set(relativePath, content);
      }
    } catch (error) {
      console.warn(`Failed to read template: ${relativePath}`, error);
    }
  }

  return templates;
}

/**
 * Load a single template file
 */
export function loadTemplate(relativePath: string): string | undefined {
  const templatesRoot = getTemplatesRoot();
  const fullPath = path.join(templatesRoot, relativePath);

  if (!fs.existsSync(fullPath)) {
    return undefined;
  }

  if (isBinaryPath(relativePath)) {
    return "[Binary file]";
  }

  return fs.readFileSync(fullPath, "utf-8");
}

/**
 * List all template paths matching a pattern
 */
export async function listTemplates(prefix?: string): Promise<string[]> {
  const templatesRoot = getTemplatesRoot();
  const searchDir = prefix ? path.join(templatesRoot, prefix) : templatesRoot;

  if (!fs.existsSync(searchDir)) {
    return [];
  }

  const files = await glob("**/*", {
    cwd: searchDir,
    dot: true,
    onlyFiles: true,
  });

  return prefix ? files.map((f: string) => `${prefix}/${f}`) : files;
}

/**
 * Check if path is a binary file
 */
function isBinaryPath(filePath: string): boolean {
  const binaryExtensions = [
    ".png",
    ".ico",
    ".svg",
    ".jpg",
    ".jpeg",
    ".gif",
    ".webp",
    ".woff",
    ".woff2",
    ".ttf",
    ".eot",
  ];
  const ext = path.extname(filePath).toLowerCase();
  return binaryExtensions.includes(ext);
}

export { getTemplatesRoot as TEMPLATES_ROOT };
