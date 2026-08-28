import { Result } from "better-result";
import { $ } from "execa";
import pc from "picocolors";

import type { Addons, PackageManager } from "../../types";
import { ProjectCreationError } from "../../utils/errors";
import { shouldSkipExternalCommands } from "../../utils/external-commands";
import { createSpinner } from "../../utils/terminal-output";

export type InstallStatus = "installed" | "cancelled";

const FORCE_KILL_AFTER_MS = 2000;

/**
 * Ctrl-C during the install only stops the install: the CLI keeps its own SIGINT listener
 * while the package manager runs so the process is not terminated, and execa's cancelSignal
 * ends the subprocess.
 */
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

  const s = createSpinner();
  s.start(`Running ${packageManager} install...`);

  const controller = new AbortController();
  const onSigint = () => controller.abort();
  process.on("SIGINT", onSigint);

  const result = await Result.tryPromise({
    try: async () => {
      await $({
        cwd: projectDir,
        stderr: "inherit",
        cancelSignal: controller.signal,
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

  process.off("SIGINT", onSigint);

  if (controller.signal.aborted) {
    s.stop(pc.yellow("Dependency install cancelled"));
    return Result.ok("cancelled");
  }

  if (result.isOk()) {
    s.stop("Dependencies installed");
    return Result.ok("installed");
  }

  s.stop(pc.red("Failed to install dependencies"));
  return Result.err(result.error);
}
