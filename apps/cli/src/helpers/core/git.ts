import { log } from "@clack/prompts";
import { Result } from "better-result";
import { $ } from "execa";
import pc from "picocolors";

import { ProjectCreationError } from "../../utils/errors";

export async function initializeGit(
  projectDir: string,
  useGit: boolean,
): Promise<Result<void, ProjectCreationError>> {
  if (!useGit) return Result.ok(undefined);

  const gitVersionResult = await $({
    cwd: projectDir,
    reject: false,
    stderr: "pipe",
  })`git --version`;

  if (gitVersionResult.exitCode !== 0) {
    log.warn(pc.yellow("Git is not installed"));
    return Result.ok(undefined);
  }

  const result = await $({
    cwd: projectDir,
    reject: false,
    stderr: "pipe",
  })`git init`;

  if (result.exitCode !== 0) {
    return Result.err(
      new ProjectCreationError({
        phase: "git-initialization",
        message: `Git initialization failed: ${result.stderr}`,
      }),
    );
  }

  return Result.tryPromise({
    try: async () => {
      await $({ cwd: projectDir })`git add -A`;
      await $({ cwd: projectDir })`git commit -m ${"initial commit"}`;
    },
    catch: (e) =>
      new ProjectCreationError({
        phase: "git-initialization",
        message: `Git commit failed: ${e instanceof Error ? e.message : String(e)}`,
        cause: e,
      }),
  });
}
