import { log } from "@clack/prompts";
import { Result } from "better-result";
import { $ } from "execa";
import pc from "picocolors";

import type { Addons, PackageManager } from "../../types";
import { isSilent } from "../../utils/context";
import { ProjectCreationError } from "../../utils/errors";
import { shouldSkipExternalCommands } from "../../utils/external-commands";

export type InstallStatus = "installed" | "cancelled";

const FORCE_KILL_AFTER_MS = 2000;

/**
 * Ctrl-C during the install only stops the install. No spinner here on purpose: clack's spinner
 * puts stdin in raw mode and exits the process on Ctrl-C itself; without it Ctrl-C is a SIGINT,
 * which the listener below turns into a cancelled subprocess while the CLI keeps running.
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

  if (!isSilent()) log.step(`Running ${packageManager} install...`);

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
    if (!isSilent()) log.warn(pc.yellow("Dependency install cancelled"));
    return Result.ok("cancelled");
  }

  if (result.isOk()) {
    if (!isSilent()) log.success("Dependencies installed");
    return Result.ok("installed");
  }

  if (!isSilent()) log.error(pc.red("Failed to install dependencies"));
  return Result.err(result.error);
}
