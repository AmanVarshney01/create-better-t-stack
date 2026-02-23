#!/usr/bin/env bun
/**
 * Check dependency versions and optionally apply updates.
 *
 * Usage:
 *   bun run scripts/check-deps.ts                  # Check only
 *   bun run scripts/check-deps.ts --ecosystem effect  # Check specific ecosystem
 *   bun run scripts/check-deps.ts --apply-patch   # Apply patch/minor updates
 *   bun run scripts/check-deps.ts --apply-all     # Apply all updates
 *   bun run scripts/check-deps.ts --json          # Output JSON format
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  checkAllVersions,
  generateMarkdownReport,
  generateCliReport,
  listEcosystems,
  type VersionInfo,
} from "../src/utils/dependency-checker";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse CLI arguments
const args = process.argv.slice(2);
const options = {
  ecosystem: getArgValue("--ecosystem"),
  applyPatch: args.includes("--apply-patch"),
  applyAll: args.includes("--apply-all"),
  json: args.includes("--json"),
  markdown: args.includes("--markdown"),
  help: args.includes("--help") || args.includes("-h"),
};

function getArgValue(flag: string): string | undefined {
  const index = args.indexOf(flag);
  if (index !== -1 && index + 1 < args.length) {
    return args[index + 1];
  }
  return undefined;
}

function printHelp() {
  console.log(`
Dependency Version Checker

Usage:
  bun run scripts/check-deps.ts [options]

Options:
  --ecosystem <name>   Filter by ecosystem (${listEcosystems().join(", ")})
  --apply-patch        Apply patch and minor updates to add-deps.ts
  --apply-all          Apply all updates to add-deps.ts
  --json               Output in JSON format
  --markdown           Output in Markdown format
  --help, -h           Show this help message

Examples:
  bun run scripts/check-deps.ts
  bun run scripts/check-deps.ts --ecosystem effect
  bun run scripts/check-deps.ts --apply-patch
`);
}

async function updateAddDepsFile(updates: VersionInfo[]): Promise<boolean> {
  const filePath = path.join(__dirname, "../src/utils/add-deps.ts");

  if (!fs.existsSync(filePath)) {
    console.error(`Could not find add-deps.ts at ${filePath}`);
    return false;
  }

  let content = fs.readFileSync(filePath, "utf-8");
  let updated = false;

  for (const update of updates) {
    const escapedName = update.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(`(["']${escapedName}["']:\\s*["'])([^"']+)(["'])`, "g");

    const newContent = content.replace(pattern, `$1${update.latest}$3`);
    if (newContent !== content) {
      content = newContent;
      updated = true;
    }
  }

  if (updated) {
    fs.writeFileSync(filePath, content, "utf-8");
    return true;
  }

  return false;
}

async function main() {
  if (options.help) {
    printHelp();
    process.exit(0);
  }

  // Validate ecosystem if provided
  if (options.ecosystem) {
    const validEcosystems = listEcosystems();
    if (!validEcosystems.includes(options.ecosystem)) {
      console.error(
        `Invalid ecosystem: ${options.ecosystem}. Valid options: ${validEcosystems.join(", ")}`,
      );
      process.exit(1);
    }
  }

  const structuredOutput = options.json || options.markdown;
  const showProgress = !structuredOutput && process.stderr.isTTY;

  if (!structuredOutput) {
    console.log("Checking dependency versions...\n");
  } else {
    console.error("Checking dependency versions...");
  }

  const result = await checkAllVersions({
    ecosystem: options.ecosystem,
    concurrency: 5,
    delayMs: 100,
    onProgress: showProgress
      ? (current, total) => {
          process.stderr.write(`\rChecking packages (${current}/${total})...`);
        }
      : undefined,
  });

  // Clear the progress line
  if (showProgress) {
    process.stderr.write("\r" + " ".repeat(50) + "\r");
  }

  // Output results
  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
  } else if (options.markdown) {
    console.log(generateMarkdownReport(result));
  } else {
    console.log(generateCliReport(result));
  }

  // Apply updates if requested
  if (options.applyPatch || options.applyAll) {
    let toApply: VersionInfo[];

    if (options.applyPatch) {
      toApply = result.outdated.filter((u) => u.updateType === "patch" || u.updateType === "minor");
    } else {
      toApply = result.outdated;
    }

    if (toApply.length === 0) {
      console.log("\nNo updates to apply.");
    } else {
      console.log(`\nApplying ${toApply.length} updates...`);

      const success = await updateAddDepsFile(toApply);

      if (success) {
        console.log("Updates applied successfully!\n");
        console.log("Updated packages:");
        for (const update of toApply) {
          console.log(`  ${update.name}: ${update.current} -> ${update.latest}`);
        }
      } else {
        console.error("Failed to apply updates.");
        process.exit(1);
      }
    }
  }

  // Set GitHub Actions output
  if (process.env.GITHUB_OUTPUT) {
    const outputFile = process.env.GITHUB_OUTPUT;
    const outdatedCount = result.outdated.length;
    const downgradeCount = result.outdated.filter((u) => u.updateType === "downgrade").length;
    const hasUpdates = outdatedCount > 0 ? "true" : "false";

    fs.appendFileSync(
      outputFile,
      `has_updates=${hasUpdates}\n` +
        `outdated_count=${outdatedCount}\n` +
        `downgrade_count=${downgradeCount}\n` +
        `uptodate_count=${result.upToDate.length}\n` +
        `error_count=${result.errors.length}\n`,
    );
  }

  // Exit with error if there are errors
  if (result.errors.length > 0) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
