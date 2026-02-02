import { spinner } from "@clack/prompts";
import { Result } from "better-result";
import { $ } from "execa";
import pc from "picocolors";

import type { Addons, PackageManager } from "../../types";

import { ProjectCreationError } from "../../utils/errors";
import { shouldSkipExternalCommands } from "../../utils/external-commands";

export async function installDependencies({
  projectDir,
  packageManager,
}: {
  projectDir: string;
  packageManager: PackageManager;
  addons?: Addons[];
}): Promise<Result<void, ProjectCreationError>> {
  if (shouldSkipExternalCommands()) {
    return Result.ok(undefined);
  }

  const s = spinner();

  s.start(`Running ${packageManager} install...`);

  const result = await Result.tryPromise({
    try: async () => {
      await $({
        cwd: projectDir,
        stderr: "inherit",
      })`${packageManager} install`;
    },
    catch: (e) =>
      new ProjectCreationError({
        phase: "dependency-installation",
        message: `Installation error: ${e instanceof Error ? e.message : String(e)}`,
        cause: e,
      }),
  });

  if (result.isOk()) {
    s.stop("Dependencies installed successfully");
  } else {
    s.stop(pc.red("Failed to install dependencies"));
  }

  return result;
}
