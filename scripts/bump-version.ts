import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { select, text } from "@clack/prompts";
import { $ } from "bun";

const CLI_PACKAGE_JSON_PATH = join(process.cwd(), "apps/cli/package.json");

async function main(): Promise<void> {
	const args = process.argv.slice(2);
	const isDryRun = args.includes("--dry-run");
	let versionInput = args.find((arg) => !arg.startsWith("--"));

	if (!versionInput) {
		const bumpType = await select({
			message: "What type of release do you want to create?",
			options: [
				{ value: "patch", label: "Patch (bug fixes) - 2.33.9 → 2.33.10" },
				{ value: "minor", label: "Minor (new features) - 2.33.9 → 2.34.0" },
				{ value: "major", label: "Major (breaking changes) - 2.33.9 → 3.0.0" },
				{ value: "custom", label: "Custom version" },
			],
		});

		if (bumpType === "custom") {
			const customVersion = await text({
				message: "Enter the version (e.g., 2.34.0):",
				placeholder: "2.34.0",
			});
			versionInput =
				typeof customVersion === "string" ? customVersion : undefined;
		} else if (typeof bumpType === "string") {
			versionInput = bumpType;
		}

		if (!versionInput) {
			console.log("❌ No version selected");
			process.exit(1);
		}
	}

	const packageJson = JSON.parse(
		await readFile(CLI_PACKAGE_JSON_PATH, "utf-8"),
	);
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

		console.log(`Bumping ${versionInput}: ${currentVersion} → ${newVersion}`);
	} else {
		if (!/^\d+\.\d+\.\d+$/.test(versionInput)) {
			console.error("Version must be x.y.z format");
			process.exit(1);
		}
		newVersion = versionInput;
	}

	if (isDryRun) {
		console.log(`✅ Would release v${newVersion} (dry run)`);
		return;
	}

	packageJson.version = newVersion;
	await writeFile(
		CLI_PACKAGE_JSON_PATH,
		`${JSON.stringify(packageJson, null, 2)}\n`,
	);

	await $`bun install`;
	await $`bun run build:cli`;
	await $`git add apps/cli/package.json bun.lock`;
	await $`git commit -m "chore(release): ${newVersion}"`;
	await $`git tag v${newVersion}`;
	await $`git push origin v${newVersion}`;

	console.log(`✅ Released v${newVersion}`);
}

main().catch(console.error);
