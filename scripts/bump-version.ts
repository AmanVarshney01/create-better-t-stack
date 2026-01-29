import { confirm, select, text } from "@clack/prompts";
import { $ } from "bun";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const CLI_PACKAGE_JSON_PATH = join(process.cwd(), "apps/cli/package.json");
const ALIAS_PACKAGE_JSON_PATH = join(process.cwd(), "packages/create-bfs/package.json");
const TYPES_PACKAGE_JSON_PATH = join(process.cwd(), "packages/types/package.json");
const TEMPLATE_GENERATOR_PACKAGE_JSON_PATH = join(
  process.cwd(),
  "packages/template-generator/package.json",
);

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const isDryRun = args.includes("--dry-run");
  let versionInput = args.find((arg) => !arg.startsWith("--"));

  if (!versionInput) {
    const bumpType = await select({
      message: "What type of release do you want to create?",
      options: [
        { value: "patch", label: "Patch (bug fixes) - 2.33.9  2.33.10" },
        { value: "minor", label: "Minor (new features) - 2.33.9  2.34.0" },
        { value: "major", label: "Major (breaking changes) - 2.33.9  3.0.0" },
        { value: "custom", label: "Custom version" },
      ],
    });

    if (bumpType === "custom") {
      const customVersion = await text({
        message: "Enter the version (e.g., 2.34.0):",
        placeholder: "2.34.0",
      });
      versionInput = typeof customVersion === "string" ? customVersion : undefined;
    } else if (typeof bumpType === "string") {
      versionInput = bumpType;
    }

    if (!versionInput) {
      console.log(" No version selected");
      process.exit(1);
    }
  }

  const packageJson = JSON.parse(await readFile(CLI_PACKAGE_JSON_PATH, "utf-8"));
  const currentVersion = packageJson.version;
  console.log(`Current version: ${currentVersion}`);

  let newVersion = "";

  if (["major", "minor", "patch"].includes(versionInput)) {
    const [major, minor, patch] = currentVersion.split(".").map(Number);

    switch (versionInput) {
      case "major":
        newVersion = `${major + 1}.0.0`;
        break;
      case "minor":
        newVersion = `${major}.${minor + 1}.0`;
        break;
      case "patch":
        newVersion = `${major}.${minor}.${patch + 1}`;
        break;
    }

    console.log(`Bumping ${versionInput}: ${currentVersion}  ${newVersion}`);
  } else {
    if (!/^\d+\.\d+\.\d+$/.test(versionInput)) {
      console.error("Version must be x.y.z format");
      process.exit(1);
    }
    newVersion = versionInput;
  }

  if (isDryRun) {
    console.log(` Would release v${newVersion} (dry run)`);
    return;
  }

  // Check for uncommitted changes
  const statusResult = await $`git status --porcelain`.text();
  if (statusResult.trim()) {
    console.error(" You have uncommitted changes. Please commit or stash them first.");
    process.exit(1);
  }

  // Create release branch
  const branchName = `release/v${newVersion}`;
  console.log(`\n Creating release branch: ${branchName}`);

  // Make sure we're on main and up to date
  await $`git checkout main`;
  await $`git pull origin main`;

  // Create and checkout the release branch
  await $`git checkout -b ${branchName}`;

  // Update package versions
  packageJson.version = newVersion;
  await writeFile(CLI_PACKAGE_JSON_PATH, `${JSON.stringify(packageJson, null, 2)}\n`);

  // Update alias package version
  const aliasPackageJson = JSON.parse(await readFile(ALIAS_PACKAGE_JSON_PATH, "utf-8"));
  aliasPackageJson.version = newVersion;
  aliasPackageJson.dependencies["create-better-fullstack"] = `^${newVersion}`;
  await writeFile(ALIAS_PACKAGE_JSON_PATH, `${JSON.stringify(aliasPackageJson, null, 2)}\n`);

  // Update types package version
  const typesPackageJson = JSON.parse(await readFile(TYPES_PACKAGE_JSON_PATH, "utf-8"));
  typesPackageJson.version = newVersion;
  await writeFile(TYPES_PACKAGE_JSON_PATH, `${JSON.stringify(typesPackageJson, null, 2)}\n`);

  // Update template-generator package version and types dependency
  const templateGeneratorPackageJson = JSON.parse(
    await readFile(TEMPLATE_GENERATOR_PACKAGE_JSON_PATH, "utf-8"),
  );
  templateGeneratorPackageJson.version = newVersion;
  templateGeneratorPackageJson.dependencies["@better-fullstack/types"] = `^${newVersion}`;
  await writeFile(
    TEMPLATE_GENERATOR_PACKAGE_JSON_PATH,
    `${JSON.stringify(templateGeneratorPackageJson, null, 2)}\n`,
  );

  await $`bun install`;
  await $`bun run build:cli`;
  await $`git add apps/cli/package.json packages/create-bfs/package.json packages/types/package.json packages/template-generator/package.json bun.lock`;
  await $`git commit -m "chore(release): ${newVersion}"`;

  // Push the release branch
  console.log(`\n Pushing release branch...`);
  await $`git push -u origin ${branchName}`;

  // Create PR using GitHub CLI
  console.log(`\n Creating pull request...`);
  const prTitle = `chore(release): ${newVersion}`;
  const prBody = `## Release v${newVersion}

This PR bumps the version to \`${newVersion}\`.

### Changes
- Updated \`create-better-fullstack\` to v${newVersion}
- Updated \`create-bts\` to v${newVersion}
- Updated \`@better-fullstack/types\` to v${newVersion}
- Updated \`@better-fullstack/template-generator\` to v${newVersion}

---
*This PR was automatically created by \`bun run bump\`*`;

  await $`gh pr create --title ${prTitle} --body ${prBody} --base main --head ${branchName}`;

  // Ask if user wants to enable auto-merge
  const shouldAutoMerge = await confirm({
    message: "Enable auto-merge? (PR will merge automatically when tests pass)",
    initialValue: true,
  });

  if (shouldAutoMerge) {
    console.log(`\n Enabling auto-merge...`);
    await $`gh pr merge ${branchName} --auto --squash --delete-branch`;
    console.log(` Auto-merge enabled. PR will merge automatically when tests pass.`);
  }

  console.log(`\n Release PR created for v${newVersion}`);
  console.log(`\n Next steps:`);
  console.log(`   1. Wait for the "Test Suite" check to pass`);
  if (!shouldAutoMerge) {
    console.log(`   2. Merge the PR manually`);
  }
  console.log(
    `   ${shouldAutoMerge ? "2" : "3"}. The release workflow will automatically publish to NPM`,
  );

  // Switch back to main
  await $`git checkout main`;
}

main().catch(console.error);
