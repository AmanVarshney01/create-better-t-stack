import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { $ } from "bun";

const CLI_PACKAGE_JSON_PATH = join(process.cwd(), "apps/cli/package.json");

async function main(): Promise<void> {
	const args = process.argv.slice(2);
	const isDryRun = args.includes("--dry-run");
	const isPrerelease = args.includes("--prerelease");
	const withGitTag = args.includes("--git");

	const packageJson = JSON.parse(
		await readFile(CLI_PACKAGE_JSON_PATH, "utf-8"),
	);
	const currentVersion = packageJson.version;
	const baseVersionMatch = currentVersion.match(/^(\d+)\.(\d+)\.(\d+)/);
	const baseVersion = baseVersionMatch ? baseVersionMatch[0] : currentVersion;
	console.log(`Current version: ${currentVersion}`);
	if (baseVersion !== currentVersion) {
		console.log(`Sanitized base version: ${baseVersion}`);
	}

	const commitHash = (await $`git rev-parse --short HEAD`).text().trim();
	const branch = (await $`git rev-parse --abbrev-ref HEAD`).text().trim();

	let canaryVersion: string;

	if (isPrerelease) {
		const [major, minor, patch] = baseVersion.split(".").map(Number);
		const prereleaseType =
			args.find((arg) => ["alpha", "beta", "rc"].includes(arg)) || "alpha";
		const prereleaseNumber = 1;
		canaryVersion = `${major}.${minor}.${patch}-${prereleaseType}.${prereleaseNumber}+canary.${commitHash}`;
	} else {
		canaryVersion = `${baseVersion}-canary.${commitHash}`;
	}

	console.log(`Canary version: ${canaryVersion}`);
	console.log(`Branch: ${branch}`);
	console.log(`Commit: ${commitHash}`);

	if (isDryRun) {
		console.log(`✅ Would release canary v${canaryVersion} (dry run)`);
		return;
	}

	const originalPackageJsonString = await readFile(
		CLI_PACKAGE_JSON_PATH,
		"utf-8",
	);
	let restored = false;

	try {
		packageJson.version = canaryVersion;
		await writeFile(
			CLI_PACKAGE_JSON_PATH,
			`${JSON.stringify(packageJson, null, 2)}\n`,
		);

		await $`bun run build:cli`;

		await $`cd apps/cli && bun publish --access public --tag canary`;

		const canaryTag = `v${canaryVersion}`;
		if (withGitTag) {
			await $`git add apps/cli/package.json`;
			await $`git commit -m "chore(canary): ${canaryVersion}"`;
			await $`git tag ${canaryTag}`;
			await $`git push origin ${canaryTag}`;
		} else {
			await writeFile(CLI_PACKAGE_JSON_PATH, originalPackageJsonString);
			restored = true;
		}

		console.log(`✅ Published canary v${canaryVersion}`);
		console.log(
			`📦 NPM: https://www.npmjs.com/package/create-better-t-stack/v/${canaryVersion}`,
		);
		console.log(`🏷️  Tag: v${canaryVersion}`);
	} finally {
		if (!withGitTag && !restored) {
			await writeFile(CLI_PACKAGE_JSON_PATH, originalPackageJsonString);
		}
	}
}

main().catch(console.error);
