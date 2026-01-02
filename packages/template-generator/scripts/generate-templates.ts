import isBinaryPath from "is-binary-path";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { glob } from "tinyglobby";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEMPLATES_DIR = path.join(__dirname, "../templates");
const OUTPUT_FILE = path.join(__dirname, "../src/templates.generated.ts");

async function generateTemplates() {
  console.log("📦 Generating embedded templates...");

  const files = await glob("**/*", { cwd: TEMPLATES_DIR, dot: true, onlyFiles: true });
  console.log(`📂 Found ${files.length} template files`);

  const entries: string[] = [];

  for (const file of files) {
    const fullPath = path.join(TEMPLATES_DIR, file);
    const normalizedPath = file.replace(/\\/g, "/");

    const content = isBinaryPath(file) ? "[Binary file]" : fs.readFileSync(fullPath, "utf-8");
    const escapedContent = content
      .replace(/\\/g, "\\\\")
      .replace(/`/g, "\\`")
      .replace(/\$\{/g, "\\${");

    entries.push(`  ["${normalizedPath}", \`${escapedContent}\`]`);
  }

  const output = `// Auto-generated - DO NOT EDIT
// Run 'bun run generate-templates' to regenerate

export const EMBEDDED_TEMPLATES: Map<string, string> = new Map([
${entries.join(",\n")}
]);

export const TEMPLATE_COUNT = ${files.length};
`;

  fs.writeFileSync(OUTPUT_FILE, output);

  const stats = fs.statSync(OUTPUT_FILE);
  const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);

  console.log(`✅ Generated ${OUTPUT_FILE}`);
  console.log(`📊 File size: ${sizeMB} MB (${files.length} templates)`);
}

generateTemplates().catch((err) => {
  console.error("❌ Failed to generate templates:", err);
  process.exit(1);
});
