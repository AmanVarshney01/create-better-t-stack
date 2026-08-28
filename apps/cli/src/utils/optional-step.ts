import type { Result } from "better-result";
import pc from "picocolors";

import { UserCancelledError } from "./errors";
import { startInterruptibleStep, wasInterrupted } from "./interrupt";
import { cliConsola, cliLog } from "./terminal-output";

/**
 * Runs a setup step after the files are on disk. A failure is reported and the run continues;
 * a cancellation (prompt or Ctrl-C) is only a warning.
 */
export async function runOptionalStep<T>(
  step: () => Promise<Result<T, { message: string }>>,
  cancelledMessage: string,
): Promise<void> {
  startInterruptibleStep();
  const result = await step();
  if (result.isOk()) return;

  if (UserCancelledError.is(result.error) || wasInterrupted()) {
    cliLog.warn(pc.yellow(cancelledMessage));
    return;
  }
  cliConsola.error(pc.red(result.error.message));
}
