import { log } from "@clack/prompts";
import { $ } from "execa";
import pc from "picocolors";

export async function initializeGit(projectDir: string, useGit: boolean) {
	if (!useGit) return;

	const gitVersionResult = await $({
		cwd: projectDir,
		reject: false,
		stderr: "pipe",
	})`git --version`;

	if (gitVersionResult.exitCode !== 0) {
		log.warn(pc.yellow("Git is not installed"));
		return;
	}

	const result = await $({
		cwd: projectDir,
		reject: false,
		stderr: "pipe",
	})`git init`;

	if (result.exitCode !== 0) {
		throw new Error(`Git initialization failed: ${result.stderr}`);
	}

	await $({ cwd: projectDir })`git add -A`;
	await $({ cwd: projectDir })`git commit -m ${"initial commit"}`;
}
