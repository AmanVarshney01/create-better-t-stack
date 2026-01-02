import isBinaryPath from "is-binary-path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "pathe";
import { glob } from "tinyglobby";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function getTemplatesRoot(): string {
  const possiblePaths = [
    join(__dirname, "../templates"),
    join(__dirname, "../../templates"),
    join(__dirname, "../../../templates"),
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) return p;
  }

  throw new Error("Templates directory not found. Checked: " + possiblePaths.join(", "));
}

export async function loadTemplates(prefix?: string): Promise<Map<string, string>> {
  const templatesRoot = getTemplatesRoot();
  const searchDir = prefix ? join(templatesRoot, prefix) : templatesRoot;

  if (!fs.existsSync(searchDir)) return new Map();

  const files = await glob("**/*", { cwd: searchDir, dot: true, onlyFiles: true });
  const templates = new Map<string, string>();

  for (const file of files) {
    const fullPath = join(searchDir, file);
    const relativePath = prefix ? `${prefix}/${file}` : file;

    try {
      if (isBinaryPath(file)) {
        templates.set(relativePath, "[Binary file]");
      } else {
        templates.set(relativePath, fs.readFileSync(fullPath, "utf-8"));
      }
    } catch (error) {
      console.warn(`Failed to read template: ${relativePath}`, error);
    }
  }

  return templates;
}

export function loadTemplate(relativePath: string): string | undefined {
  const fullPath = join(getTemplatesRoot(), relativePath);
  if (!fs.existsSync(fullPath)) return undefined;
  if (isBinaryPath(relativePath)) return "[Binary file]";
  return fs.readFileSync(fullPath, "utf-8");
}

export async function listTemplates(prefix?: string): Promise<string[]> {
  const templatesRoot = getTemplatesRoot();
  const searchDir = prefix ? join(templatesRoot, prefix) : templatesRoot;

  if (!fs.existsSync(searchDir)) return [];

  const files = await glob("**/*", { cwd: searchDir, dot: true, onlyFiles: true });
  return prefix ? files.map((f: string) => `${prefix}/${f}`) : files;
}

export { isBinaryPath, getTemplatesRoot as TEMPLATES_ROOT };
