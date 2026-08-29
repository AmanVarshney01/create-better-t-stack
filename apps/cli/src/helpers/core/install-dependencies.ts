import { Result } from "better-result";
import { $ } from "execa";
import pc from "picocolors";

import type { Addons, PackageManager } from "../../types";
import { ProjectCreationError } from "../../utils/errors";
import { shouldSkipExternalCommands } from "../../utils/external-commands";
import { getInterruptSignal, startInterruptibleStep, wasInterrupted } from "../../utils/interrupt";
import { createSpinner } from "../../utils/terminal-output";

export type InstallStatus = "installed" | "cancelled";

const FORCE_KILL_AFTER_MS = 2000;

export async function installDependencies({
  projectDir,
  packageManager,
}: {
  projectDir: string;
  packageManager: PackageManager;
  addons?: Addons[];
}): Promise<Result<InstallStatus, ProjectCreationError>> {
  if (shouldSkipExternalCommands()) {
    return Result.ok("installed");
  }

  startInterruptibleStep();
  const s = createSpinner();
  s.start(`Running ${packageManager} install...`);

  const result = await Result.tryPromise({
    try: async () => {
      await $({
        cwd: projectDir,
        stderr: "inherit",
        cancelSignal: getInterruptSignal(),
        forceKillAfterDelay: FORCE_KILL_AFTER_MS,
      })`${packageManager} install`;
    },
    catch: (e) =>
      new ProjectCreationError({
        phase: "dependency-installation",
        message: `Installation error: ${e instanceof Error ? e.message : String(e)}`,
        cause: e,
      }),
  });

  if (wasInterrupted()) {
    s.stop();
    return Result.ok("cancelled");
  }

  if (result.isOk()) {
    s.stop("Dependencies installed");
    return Result.ok("installed");
  }

  s.stop(pc.red("Failed to install dependencies"));
  return Result.err(result.error);
}
