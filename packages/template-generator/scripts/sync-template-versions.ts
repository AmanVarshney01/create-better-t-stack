#!/usr/bin/env bun
/**
 * Check for hardcoded versions in template files that drift from dependencyVersionMap.
 *
 * This script scans all package.json.hbs template files and compares the versions
 * against the central dependencyVersionMap in add-deps.ts.
 *
 * Usage:
 *   bun run scripts/sync-template-versions.ts              # Check only
 *   bun run scripts/sync-template-versions.ts --fix        # Fix mismatches
 *   bun run scripts/sync-template-versions.ts --verbose    # Show all packages
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { glob } from "tinyglobby";

import { dependencyVersionMap } from "../src/utils/add-deps";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEMPLATES_DIR = path.join(__dirname, "../templates");

// Parse CLI arguments
const args = process.argv.slice(2);
const options = {
  fix: args.includes("--fix"),
  verbose: args.includes("--verbose"),
  help: args.includes("--help") || args.includes("-h"),
};

type Mismatch = {
  file: string;
  package: string;
  templateVersion: string;
  mapVersion: string;
};

type TemplatePackageJson = {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};

function printHelp() {
  console.log(`
Template Version Sync

Check for hardcoded versions in template files that differ from dependencyVersionMap.

Usage:
  bun run scripts/sync-template-versions.ts [options]

Options:
  --fix        Automatically fix mismatched versions in template files
  --verbose    Show all packages (including matches)
  --help, -h   Show this help message

Examples:
  bun run scripts/sync-template-versions.ts
  bun run scripts/sync-template-versions.ts --fix
`);
}

function extractVersionsFromTemplate(content: string): Record<string, string> {
  const versions: Record<string, string> = {};

  // Parse the template as JSON (ignoring Handlebars syntax for now)
  // This is a simplified approach that works for most cases
  try {
    // Remove Handlebars expressions temporarily for parsing
    const cleanedContent = content.replace(/\{\{[^}]+\}\}/g, '""').replace(/,(\s*[}\]])/g, "$1"); // Remove trailing commas

    const parsed = JSON.parse(cleanedContent) as TemplatePackageJson;

    // Extract versions from dependencies and devDependencies
    if (parsed.dependencies) {
      for (const [pkg, version] of Object.entries(parsed.dependencies)) {
        if (typeof version === "string" && !version.startsWith("{{")) {
          versions[pkg] = version;
        }
      }
    }

    if (parsed.devDependencies) {
      for (const [pkg, version] of Object.entries(parsed.devDependencies)) {
        if (typeof version === "string" && !version.startsWith("{{")) {
          versions[pkg] = version;
        }
      }
    }
  } catch {
    // If JSON parsing fails, try regex extraction
    const versionPattern = /"([^"]+)":\s*"(\^?[\d.]+[^"]*)"/g;
    let match;
    while ((match = versionPattern.exec(content)) !== null) {
      const [, pkg, version] = match;
      if (!version.startsWith("{{") && !pkg.startsWith("{")) {
        versions[pkg] = version;
      }
    }
  }

  return versions;
}

async function checkTemplateVersions(): Promise<Mismatch[]> {
  const files = await glob("**/package.json.hbs", {
    cwd: TEMPLATES_DIR,
    dot: true,
    onlyFiles: true,
  });

  console.log(`Scanning ${files.length} package.json.hbs files...\n`);

  const mismatches: Mismatch[] = [];
  let totalPackages = 0;
  let matchedPackages = 0;

  for (const file of files) {
    const fullPath = path.join(TEMPLATES_DIR, file);
    const content = fs.readFileSync(fullPath, "utf-8");

    const templateVersions = extractVersionsFromTemplate(content);

    for (const [pkg, templateVersion] of Object.entries(templateVersions)) {
      totalPackages++;

      // Check if this package is in our version map
      const mapVersion = dependencyVersionMap[pkg as keyof typeof dependencyVersionMap];

      if (mapVersion) {
        if (templateVersion !== mapVersion) {
          mismatches.push({
            file,
            package: pkg,
            templateVersion,
            mapVersion,
          });
        } else {
          matchedPackages++;
          if (options.verbose) {
            console.log(`  ✓ ${pkg}: ${templateVersion}`);
          }
        }
      } else if (options.verbose) {
        console.log(`  ? ${pkg}: ${templateVersion} (not in version map)`);
      }
    }
  }

  return mismatches;
}

async function fixMismatches(mismatches: Mismatch[]): Promise<number> {
  const fileUpdates = new Map<string, Mismatch[]>();

  // Group mismatches by file
  for (const mismatch of mismatches) {
    const existing = fileUpdates.get(mismatch.file) || [];
    existing.push(mismatch);
    fileUpdates.set(mismatch.file, existing);
  }

  let fixedCount = 0;

  for (const [file, updates] of fileUpdates) {
    const fullPath = path.join(TEMPLATES_DIR, file);
    let content = fs.readFileSync(fullPath, "utf-8");

    for (const update of updates) {
      // Replace the version in the template
      const escapedPkg = update.package.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const pattern = new RegExp(
        `("${escapedPkg}":\\s*)"${update.templateVersion.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`,
        "g",
      );

      const newContent = content.replace(pattern, `$1"${update.mapVersion}"`);

      if (newContent !== content) {
        content = newContent;
        fixedCount++;
      }
    }

    fs.writeFileSync(fullPath, content, "utf-8");
  }

  return fixedCount;
}

async function main() {
  if (options.help) {
    printHelp();
    process.exit(0);
  }

  console.log("Template Version Sync\n");
  console.log("Checking for version mismatches between templates and dependencyVersionMap...\n");

  const mismatches = await checkTemplateVersions();

  if (mismatches.length === 0) {
    console.log("✓ All template versions match dependencyVersionMap!");
    process.exit(0);
  }

  console.log(`\nFound ${mismatches.length} version mismatches:\n`);

  // Group by file for display
  const byFile = new Map<string, Mismatch[]>();
  for (const m of mismatches) {
    const existing = byFile.get(m.file) || [];
    existing.push(m);
    byFile.set(m.file, existing);
  }

  for (const [file, items] of byFile) {
    console.log(`\n${file}:`);
    for (const item of items) {
      console.log(`  ${item.package}: ${item.templateVersion} -> ${item.mapVersion}`);
    }
  }

  if (options.fix) {
    console.log("\nApplying fixes...");
    const fixedCount = await fixMismatches(mismatches);
    console.log(`\n✓ Fixed ${fixedCount} version mismatches.`);
    console.log("\nRemember to rebuild templates: bun run generate-templates");
  } else {
    console.log("\nRun with --fix to automatically update these versions.");
  }

  // Exit with error code if there are mismatches and we didn't fix them
  if (!options.fix) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
