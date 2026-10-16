import { Result } from "better-result";
import { $ } from "execa";
import pc from "picocolors";

import { ProjectCreationError } from "../../utils/errors";
import { cliLog } from "../../utils/terminal-output";

export async function prepareGitRepository(
  projectDir: string,
  useGit: boolean,
  signal?: AbortSignal,
): Promise<Result<boolean, ProjectCreationError>> {
  if (!useGit) return Result.ok(false);

  const cancelled = () =>
    Result.err(
      new ProjectCreationError({
        phase: "git-initialization",
        message: "Git initialization cancelled",
      }),
    );

  const gitVersionResult = await $({
    cwd: projectDir,
    reject: false,
    stderr: "pipe",
    cancelSignal: signal,
  })`git --version`;
  if (signal?.aborted) return cancelled();

  if (gitVersionResult.exitCode !== 0) {
    cliLog.warn(pc.yellow("Git is not installed"));
    return Result.ok(false);
  }

  const result = await $({
    cwd: projectDir,
    reject: false,
    stderr: "pipe",
    cancelSignal: signal,
  })`git init`;
  if (signal?.aborted) return cancelled();

  if (result.exitCode !== 0) {
    return Result.err(
      new ProjectCreationError({
        phase: "git-initialization",
        message: `Git initialization failed: ${result.stderr}`,
      }),
    );
  }

  return Result.ok(true);
}

export async function initializeGit(
  projectDir: string,
  useGit: boolean,
  signal?: AbortSignal,
): Promise<Result<void, ProjectCreationError>> {
  if (!useGit) return Result.ok(undefined);
  const prepared = await prepareGitRepository(projectDir, useGit, signal);
  if (prepared.isErr()) return prepared;
  if (!prepared.value) return Result.ok(undefined);

  return Result.tryPromise({
    try: async () => {
      await $({ cwd: projectDir, cancelSignal: signal })`git add -A`;
      await $({ cwd: projectDir, cancelSignal: signal })`git commit -m ${"initial commit"}`;
    },
    catch: (e) =>
      new ProjectCreationError({
        phase: "git-initialization",
        message: `Git commit failed: ${e instanceof Error ? e.message : String(e)}`,
        cause: e,
      }),
  });
}
