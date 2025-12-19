import { confirm, isCancel, multiselect, spinner } from "@clack/prompts";
import { $ } from "bun";

const PACKAGES = ["create-better-t-stack", "create-bts", "@better-t-stack/types"] as const;

interface DistTags {
  [tag: string]: string;
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const isDryRun = args.includes("--dry-run");
  const autoYes = args.includes("--yes");
  const prNumber = args.find((arg) => arg.startsWith("--pr="))?.split("=")[1];

  console.log("PR Preview Cleanup Script");
  console.log("=========================\n");

  if (isDryRun) {
    console.log("[DRY RUN MODE - No changes will be made]\n");
  }

  // If specific PR number provided, clean up just that PR
  if (prNumber) {
    await cleanupPR(prNumber, isDryRun);
    return;
  }

  // Otherwise, show all PR tags and let user select
  const allTags = new Map<string, Map<string, string>>();

  const fetchSpin = spinner();
  fetchSpin.start("Fetching PR preview tags from NPM...");

  for (const pkg of PACKAGES) {
    try {
      const tagsJson = await $`npm view ${pkg} dist-tags --json`.text();
      const tags = JSON.parse(tagsJson) as DistTags;

      for (const [tag, version] of Object.entries(tags)) {
        const match = tag.match(/^pr(\d+)$/);
        if (!match) continue;

        if (!allTags.has(tag)) {
          allTags.set(tag, new Map());
        }
        allTags.get(tag)?.set(pkg, version);
      }
    } catch {
      console.warn(`Failed to fetch tags for ${pkg}`);
    }
  }

  fetchSpin.stop("Fetched PR preview tags");

  if (allTags.size === 0) {
    console.log("\nNo PR preview tags found. Nothing to clean up.");
    return;
  }

  console.log(`\nFound ${allTags.size} PR preview tag(s):\n`);

  const tagOptions = Array.from(allTags.entries())
    .sort((a, b) => {
      const prA = Number.parseInt(a[0].replace("pr", ""), 10);
      const prB = Number.parseInt(b[0].replace("pr", ""), 10);
      return prB - prA;
    })
    .map(([tag, packages]) => {
      const versions = Array.from(packages.entries())
        .map(([pkg, ver]) => `${pkg}@${ver}`)
        .join(", ");
      return {
        value: tag,
        label: `${tag} (${versions})`,
      };
    });

  if (autoYes) {
    // Clean up all tags
    console.log("Auto-cleaning all PR preview tags...\n");
    for (const { value: tag } of tagOptions) {
      const prNum = tag.replace("pr", "");
      await cleanupPR(prNum, isDryRun);
    }
    return;
  }

  const selected = (await multiselect({
    message: "Select PR tags to clean up:",
    options: tagOptions,
  })) as unknown as string[] | symbol;

  if (isCancel(selected) || !Array.isArray(selected) || selected.length === 0) {
    console.log("\nNo selections made. Aborting.");
    return;
  }

  const proceed = await confirm({
    message: `Clean up ${selected.length} PR preview tag(s)?`,
  });

  if (isCancel(proceed) || proceed === false) {
    console.log("\nCanceled by user.");
    return;
  }

  for (const tag of selected) {
    const prNum = tag.replace("pr", "");
    await cleanupPR(prNum, isDryRun);
  }

  console.log("\nCleanup complete!");
}

async function cleanupPR(prNumber: string, isDryRun: boolean): Promise<void> {
  const tag = `pr${prNumber}`;
  console.log(`\nCleaning up PR #${prNumber}...`);

  for (const pkg of PACKAGES) {
    try {
      const versionText = await $`npm view ${pkg}@${tag} version 2>/dev/null`.text();
      const version = versionText.trim();

      if (!version) {
        console.log(`  ${pkg}: No version found for tag ${tag}`);
        continue;
      }

      console.log(`  ${pkg}@${version} (tag: ${tag})`);

      if (isDryRun) {
        console.log(`    [DRY RUN] Would remove tag and deprecate`);
        continue;
      }

      // Remove the dist-tag
      try {
        await $`npm dist-tag rm ${pkg} ${tag}`.quiet();
        console.log(`    Removed tag ${tag}`);
      } catch {
        console.log(`    Tag ${tag} already removed or doesn't exist`);
      }

      // Deprecate the version
      try {
        await $`npm deprecate ${pkg}@${version} "PR preview for closed PR #${prNumber}"`.quiet();
        console.log(`    Deprecated version ${version}`);
      } catch {
        console.log(`    Failed to deprecate ${version}`);
      }
    } catch {
      console.log(`  ${pkg}: No preview found`);
    }
  }
}

main().catch(console.error);
