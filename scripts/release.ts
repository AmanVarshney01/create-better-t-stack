import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { $ } from "bun";
import { generate } from "changelogithub";
import config from "../changelogithub.config";

async function main(): Promise<void> {
	const tag = process.env.GITHUB_REF?.replace("refs/tags/", "");
	if (!tag) {
		console.error("No git tag found");
		process.exit(1);
	}

	console.log(`Generating changelog for ${tag}`);

	const changelog = await generate({
		to: tag,
		...config,
	});

	const changelogPath = join(process.cwd(), "CHANGELOG.md");
	let existingContent = "";

	try {
		existingContent = await readFile(changelogPath, "utf-8");
	} catch {}

	const newChangelog = `## ${tag}\n\n${changelog.md}\n\n---\n\n${existingContent}`;
	await writeFile(changelogPath, newChangelog);

	await $`git add CHANGELOG.md`;
	await $`git commit -m "chore: update changelog for ${tag}"`;
	await $`git push`;

	console.log(`✅ Generated changelog for ${tag}`);
}

main().catch(console.error);
