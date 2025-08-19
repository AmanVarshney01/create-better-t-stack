import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { confirm, isCancel, multiselect, spinner } from "@clack/prompts";
import { $ } from "bun";

const CLI_PACKAGE_JSON_PATH = join(process.cwd(), "apps/cli/package.json");

async function main(): Promise<void> {
	const args = process.argv.slice(2);
	const isDryRun = args.includes("--dry-run");
	const deprecateOld =
		args.includes("--deprecate-old") || args.includes("--prune-old");
	const autoYes = args.includes("--yes");

	const packageJson = JSON.parse(
		await readFile(CLI_PACKAGE_JSON_PATH, "utf-8"),
	);
	const currentVersion = packageJson.version;
	const packageName: string = packageJson.name || "create-better-t-stack";
	const strictSemver = /^\d+\.\d+\.\d+$/;
	let baseVersion = currentVersion;
	if (strictSemver.test(currentVersion)) {
		baseVersion = currentVersion;
	} else {
		const m = currentVersion.match(/^(\d+)\.(\d+)\.(\d+)/);
		baseVersion = m ? m[0] : currentVersion;
	}
	console.log(`Current version: ${currentVersion}`);
	if (baseVersion !== currentVersion) {
		console.log(`Sanitized base version: ${baseVersion}`);
	}

	const commitHash = (await $`git rev-parse --short HEAD`.text()).trim();
	const canaryVersion = `${baseVersion}-canary.${commitHash}`;

	console.log(`Canary version: ${canaryVersion}`);
	console.log(`Commit: ${commitHash}`);

	if (isDryRun) {
		console.log(`✅ Would release canary v${canaryVersion} (dry run)`);
		return;
	}

	if (deprecateOld) {
		try {
			const versionsJson =
				await $`npm view ${packageName} versions --json`.text();
			const versions = JSON.parse(versionsJson) as string[];
			const isCanary = (v: string) =>
				v.includes("-canary.") || v.includes("+canary.");
			const canaryVersions = (Array.isArray(versions) ? versions : []).filter(
				isCanary,
			);

			if (!canaryVersions.length) {
				console.log("ℹ️ No canary versions found to deprecate.");
				return;
			}

			const nonDeprecated: string[] = [];
			for (const v of canaryVersions) {
				try {
					const deprecatedJson =
						await $`npm view ${`${packageName}@${v}`} deprecated --json`.text();
					const deprecatedMsg = deprecatedJson
						? JSON.parse(deprecatedJson)
						: null;
					if (
						!deprecatedMsg ||
						(typeof deprecatedMsg === "string" && deprecatedMsg.length === 0)
					) {
						nonDeprecated.push(v);
					}
				} catch {
					nonDeprecated.push(v);
				}
			}

			if (autoYes) {
				const depSpin = spinner();
				depSpin.start(
					`Deprecating ${nonDeprecated.length} canary version(s)...`,
				);
				let count = 0;
				for (const v of nonDeprecated) {
					try {
						await $`npm deprecate -f ${`${packageName}@${v}`} "Deprecated canary; use ${packageName}@canary (currently ${canaryVersion})"`;
						count++;
					} catch {}
				}
				depSpin.stop(`Deprecated ${count} version(s).`);
				return;
			}

			const selected = (await multiselect({
				message: "Select canary versions to deprecate:",
				options: nonDeprecated
					.sort()
					.reverse()
					.map((v) => ({ value: v, label: v })),
			})) as unknown as string[] | symbol;

			if (
				isCancel(selected) ||
				!Array.isArray(selected) ||
				selected.length === 0
			) {
				console.log("❌ No selections made. Aborting.");
				return;
			}

			const depSpin = spinner();
			depSpin.start(`Deprecating ${selected.length} canary version(s)...`);
			let count = 0;
			for (const v of selected) {
				try {
					await $`npm deprecate -f ${`${packageName}@${v}`} "Deprecated canary; use ${packageName}@canary (currently ${canaryVersion})"`;
					count++;
				} catch {}
			}
			depSpin.stop(`Deprecated ${count} version(s).`);
			return;
		} catch (err) {
			console.error("❌ Failed to fetch versions from npm:", err);
			return;
		}
	}

	try {
		const versionsJson =
			await $`npm view ${packageName} versions --json`.text();
		const versions = JSON.parse(versionsJson) as string[];
		if (Array.isArray(versions) && versions.includes(canaryVersion)) {
			if (deprecateOld) {
				const depSpin = spinner();
				depSpin.start("Deprecating older canary versions (no publish)...");
				try {
					const isCanary = (v: string) =>
						v.includes("-canary.") || v.includes("+canary.");
					let count = 0;
					for (const v of versions) {
						if (!isCanary(v) || v === canaryVersion) continue;
						await $`npm deprecate -f ${`${packageName}@${v}`} "Deprecated canary; use ${packageName}@canary (currently ${canaryVersion})"`;
						count++;
					}
					depSpin.stop(`Deprecated ${count} older canary versions`);
				} catch (err) {
					depSpin.stop("Failed to deprecate older canaries");
					console.warn("⚠️ Failed to deprecate older canaries:", err);
				}
				console.error(
					`❌ ${packageName}@${canaryVersion} is already published on npm. Skipped publish after deprecating older canaries.`,
				);
				return;
			}
			console.error(
				`❌ ${packageName}@${canaryVersion} is already published on npm. Make a new commit (or clean your workspace) and try again.`,
			);
			return;
		}
	} catch {}

	if (!autoYes) {
		const proceed = await confirm({
			message: `Publish ${packageName}@${canaryVersion} with dist-tag "canary"${deprecateOld ? ", then deprecate older canaries" : ""}?`,
		});
		if (isCancel(proceed) || proceed === false) {
			console.log("❌ Canceled by user.");
			return;
		}
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

		const buildSpin = spinner();
		buildSpin.start("Building CLI...");
		try {
			await $`bun run build:cli`;
			buildSpin.stop("Build complete");
		} catch (err) {
			buildSpin.stop("Build failed");
			throw err;
		}

		const pubSpin = spinner();
		pubSpin.start(`Publishing ${packageName}@${canaryVersion} (canary)...`);
		try {
			await $`cd apps/cli && bun publish --access public --tag canary`;
			pubSpin.stop("Publish complete");
		} catch (err) {
			pubSpin.stop("Publish failed");
			throw err;
		}

		if (deprecateOld) {
			console.log("🔎 Cleaning up older canary versions (deprecating)...");
			try {
				const versionsJson =
					await $`npm view ${packageName} versions --json`.text();
				const versions = JSON.parse(versionsJson) as string[];
				const isCanary = (v: string) =>
					v.includes("-canary.") || v.includes("+canary.");
				for (const v of versions) {
					if (!isCanary(v) || v === canaryVersion) continue;
					console.log(`➡️ Deprecating ${packageName}@${v}`);
					await $`npm deprecate -f ${`${packageName}@${v}`} "Deprecated canary; use ${packageName}@canary (currently ${canaryVersion})"`;
				}
				console.log("🧹 Older canaries deprecated.");
			} catch (err) {
				console.warn("⚠️ Failed to deprecate older canaries:", err);
			}
		}

		await writeFile(CLI_PACKAGE_JSON_PATH, originalPackageJsonString);
		restored = true;

		console.log(`✅ Published canary v${canaryVersion}`);
		console.log(
			`📦 NPM: https://www.npmjs.com/package/${packageName}/v/${canaryVersion}`,
		);
	} finally {
		if (!restored) {
			await writeFile(CLI_PACKAGE_JSON_PATH, originalPackageJsonString);
		}
	}
}

main().catch(console.error);
