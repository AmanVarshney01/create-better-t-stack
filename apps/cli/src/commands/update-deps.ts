/**
 * CLI command to check and update dependency versions
 */

import {
  checkAllVersions,
  generateCliReport,
  listEcosystems,
  ECOSYSTEM_GROUPS,
  type CheckResult,
  type VersionInfo,
  type UpdateType,
} from "@better-fullstack/template-generator";
import { confirm, isCancel, log, select, spinner } from "@clack/prompts";
import fs from "fs-extra";
import path from "path";
import pc from "picocolors";

export type UpdateDepsOptions = {
  check?: boolean;
  patch?: boolean;
  all?: boolean;
  ecosystem?: string;
};

/**
 * Format a version update for display
 */
function formatUpdate(info: VersionInfo): string {
  const typeColors: Record<UpdateType, (s: string) => string> = {
    downgrade: pc.red,
    major: pc.red,
    minor: pc.yellow,
    patch: pc.green,
    none: pc.gray,
  };

  const colorFn = typeColors[info.updateType];
  const label = `[${info.updateType.toUpperCase()}]`;

  return `${colorFn(label.padEnd(8))} ${pc.cyan(info.name.padEnd(45))} ${pc.dim(info.current)} ${pc.dim("->")} ${pc.green(info.latest)}`;
}

/**
 * Get the path to add-deps.ts
 */
function getAddDepsPath(): string {
  // Handle both development and installed scenarios
  const possiblePaths = [
    // Development: running from repo root
    path.join(process.cwd(), "packages/template-generator/src/utils/add-deps.ts"),
    // Development: running from apps/cli
    path.join(process.cwd(), "../../packages/template-generator/src/utils/add-deps.ts"),
    // Installed: look in node_modules
    path.join(
      process.cwd(),
      "node_modules/@better-fullstack/template-generator/src/utils/add-deps.ts",
    ),
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      return p;
    }
  }

  // Default fallback
  return possiblePaths[0];
}

/**
 * Update the add-deps.ts file with new versions
 */
async function updateAddDepsFile(updates: VersionInfo[]): Promise<boolean> {
  const filePath = getAddDepsPath();

  if (!fs.existsSync(filePath)) {
    log.error(`Could not find add-deps.ts at ${filePath}`);
    return false;
  }

  let content = await fs.readFile(filePath, "utf-8");
  let updated = false;

  for (const update of updates) {
    // Match the package entry in the version map
    // Handle both regular and scoped packages
    const escapedName = update.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(`(["']${escapedName}["']:\\s*["'])([^"']+)(["'])`, "g");

    const newContent = content.replace(pattern, `$1${update.latest}$3`);
    if (newContent !== content) {
      content = newContent;
      updated = true;
    }
  }

  if (updated) {
    await fs.writeFile(filePath, content, "utf-8");
    return true;
  }

  return false;
}

/**
 * Interactive mode: prompt for each update
 */
async function interactiveUpdate(updates: VersionInfo[]): Promise<VersionInfo[]> {
  const toApply: VersionInfo[] = [];

  for (const update of updates) {
    console.log("\n" + pc.bold("-----------------------------------"));
    console.log(formatUpdate(update));

    if (update.ecosystem) {
      console.log(pc.dim(`  Ecosystem: ${update.ecosystem}`));
    }

    if (update.updateType === "major") {
      console.log(pc.yellow("  Warning: Breaking changes possible. Check changelog."));
    } else if (update.updateType === "downgrade") {
      console.log(
        pc.red("  Warning: npm latest is lower than current pinned version. Review carefully."),
      );
    }

    const action = await select({
      message: "What would you like to do?",
      options: [
        { value: "update", label: "Update to latest" },
        { value: "skip", label: "Skip this package" },
        { value: "quit", label: "Quit (apply selected updates)" },
      ],
    });

    if (isCancel(action) || action === "quit") {
      break;
    }

    if (action === "update") {
      toApply.push(update);
    }
  }

  return toApply;
}

/**
 * Main handler for the update-deps command
 */
export async function updateDepsHandler(options: UpdateDepsOptions): Promise<void> {
  const { check = false, patch = false, all = false, ecosystem } = options;

  // Validate ecosystem if provided
  if (ecosystem) {
    const validEcosystems = listEcosystems();
    if (!validEcosystems.includes(ecosystem)) {
      log.error(`Invalid ecosystem: ${ecosystem}. Valid options: ${validEcosystems.join(", ")}`);
      return;
    }
  }

  // Start spinner
  const s = spinner();
  s.start(
    ecosystem
      ? `Checking ${ecosystem} packages for updates...`
      : "Checking all packages for updates...",
  );

  let result: CheckResult;
  try {
    result = await checkAllVersions({
      ecosystem,
      concurrency: 5,
      delayMs: 100,
      onProgress: (checked, total) => {
        s.message(`Checking packages (${checked}/${total})...`);
      },
    });
  } catch (error) {
    s.stop("Failed to check versions");
    log.error(String(error));
    return;
  }

  s.stop("Version check complete");

  // Display results
  console.log(generateCliReport(result));

  // If check-only mode, we're done
  if (check || result.outdated.length === 0) {
    return;
  }

  // Determine which updates to apply
  let toApply: VersionInfo[] = [];
  const downgradeCount = result.outdated.filter((u) => u.updateType === "downgrade").length;

  if (patch) {
    // Apply only patch and minor updates automatically
    toApply = result.outdated.filter((u) => u.updateType === "patch" || u.updateType === "minor");

    if (toApply.length === 0) {
      log.info("No patch/minor updates available.");
      return;
    }

    log.info(`Found ${toApply.length} patch/minor updates to apply automatically.`);
    if (downgradeCount > 0) {
      log.warn(
        `${downgradeCount} downgrade${downgradeCount === 1 ? "" : "s"} detected and excluded from --patch mode.`,
      );
    }

    const shouldProceed = await confirm({
      message: `Apply ${toApply.length} safe updates?`,
    });

    if (isCancel(shouldProceed) || !shouldProceed) {
      log.info("Cancelled.");
      return;
    }
  } else if (all) {
    // Interactive mode for all updates
    log.info("\nEntering interactive mode...");
    toApply = await interactiveUpdate(result.outdated);

    if (toApply.length === 0) {
      log.info("No updates selected.");
      return;
    }
  } else {
    // Default: show what would be updated and ask
    const shouldProceed = await confirm({
      message:
        downgradeCount > 0
          ? `Apply all ${result.outdated.length} updates (including ${downgradeCount} downgrade${downgradeCount === 1 ? "" : "s"})?`
          : `Apply all ${result.outdated.length} updates?`,
    });

    if (isCancel(shouldProceed) || !shouldProceed) {
      log.info("Cancelled. Use --check to only view updates without prompting.");
      return;
    }

    toApply = result.outdated;
  }

  // Apply updates
  const updateSpinner = spinner();
  updateSpinner.start(`Applying ${toApply.length} updates...`);

  try {
    const success = await updateAddDepsFile(toApply);

    if (success) {
      updateSpinner.stop("Updates applied successfully!");

      console.log("\n" + pc.green("Updated packages:"));
      for (const update of toApply) {
        console.log(`  ${pc.cyan(update.name)}: ${update.current} -> ${update.latest}`);
      }

      console.log("\n" + pc.yellow("Next steps:"));
      console.log("  1. Review the changes in add-deps.ts");
      console.log("  2. Run: bun run build (in packages/template-generator)");
      console.log("  3. Run tests to verify compatibility");
      console.log("  4. Update any hardcoded versions in template files");
    } else {
      updateSpinner.stop("No changes were made");
      log.warn("Could not apply updates. The file may have changed.");
    }
  } catch (error) {
    updateSpinner.stop("Failed to apply updates");
    log.error(String(error));
  }
}

/**
 * Show available ecosystems
 */
export function showEcosystems(): void {
  console.log("\nAvailable ecosystems:\n");

  for (const [name, packages] of Object.entries(ECOSYSTEM_GROUPS)) {
    console.log(`  ${pc.cyan(name.padEnd(15))} (${packages.length} packages)`);
  }

  console.log(`\nUsage: update-deps --ecosystem <name>`);
}
