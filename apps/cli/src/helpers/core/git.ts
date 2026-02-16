import { log } from "@clack/prompts";
import { $ } from "execa";
import pc from "picocolors";

export async function initializeGit(projectDir: string, useGit: boolean) {
  if (!useGit) return;
  const gitEnv = { ...process.env };
  delete gitEnv.GIT_DIR;
  delete gitEnv.GIT_WORK_TREE;
  delete gitEnv.GIT_INDEX_FILE;
  delete gitEnv.GIT_OBJECT_DIRECTORY;
  delete gitEnv.GIT_ALTERNATE_OBJECT_DIRECTORIES;
  delete gitEnv.GIT_COMMON_DIR;

  const gitVersionResult = await $({
    cwd: projectDir,
    env: gitEnv,
    reject: false,
    stderr: "pipe",
  })`git --version`;

  if (gitVersionResult.exitCode !== 0) {
    log.warn(pc.yellow("Git is not installed"));
    return;
  }

  const result = await $({
    cwd: projectDir,
    env: gitEnv,
    reject: false,
    stderr: "pipe",
  })`git init`;

  if (result.exitCode !== 0) {
    throw new Error(`Git initialization failed: ${result.stderr}`);
  }

  // Ensure git user config exists (may not be configured in CI environments)
  const userName = await $({
    cwd: projectDir,
    env: gitEnv,
    reject: false,
    stderr: "pipe",
  })`git config user.name`;
  if (!userName.stdout.trim()) {
    await $({ cwd: projectDir, env: gitEnv })`git config user.name ${"Better Fullstack"}`;
  }
  const userEmail = await $({
    cwd: projectDir,
    env: gitEnv,
    reject: false,
    stderr: "pipe",
  })`git config user.email`;
  if (!userEmail.stdout.trim()) {
    await $({
      cwd: projectDir,
      env: gitEnv,
    })`git config user.email ${"scaffold@better-fullstack.dev"}`;
  }

  await $({ cwd: projectDir, env: gitEnv })`git add -A`;
  await $({ cwd: projectDir, env: gitEnv })`git commit --no-verify -m ${"initial commit"}`;
}
