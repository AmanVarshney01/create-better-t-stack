import { log } from "@clack/prompts";
import { $ } from "bun";
import pc from "picocolors";

export async function initializeGit(projectDir: string, useGit: boolean) {
  if (!useGit) return;

  const gitVersionResult = await $`git --version`.cwd(projectDir).nothrow().quiet();

  if (gitVersionResult.exitCode !== 0) {
    log.warn(pc.yellow("Git is not installed"));
    return;
  }

  const result = await $`git init`.cwd(projectDir).nothrow().quiet();

  if (result.exitCode !== 0) {
    throw new Error(`Git initialization failed: ${result.stderr.toString()}`);
  }

  await $`git add -A`.cwd(projectDir).quiet();
  await $`git commit -m ${"initial commit"}`.cwd(projectDir).quiet();
}
