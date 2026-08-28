let stepInterrupted = false;
let anyStepInterrupted = false;
let controller: AbortController | null = null;
let listener: (() => void) | null = null;

/**
 * Once files are on disk, Ctrl-C should only stop the step that is running. Holding a SIGINT
 * listener keeps the CLI alive; the terminal's signal already ends the subprocess. Each
 * optional step starts with startInterruptibleStep() so a cancel applies to that step only.
 */
export function beginInterruptibleScope(): void {
  endInterruptibleScope();
  stepInterrupted = false;
  anyStepInterrupted = false;
  listener = () => {
    stepInterrupted = true;
    anyStepInterrupted = true;
    controller?.abort();
  };
  process.on("SIGINT", listener);
}

export function endInterruptibleScope(): void {
  if (listener) process.off("SIGINT", listener);
  listener = null;
  controller = null;
}

export function startInterruptibleStep(): void {
  stepInterrupted = false;
  controller = listener ? new AbortController() : null;
}

/** True if the user pressed Ctrl-C during the current step. */
export function wasInterrupted(): boolean {
  return stepInterrupted;
}

export function wasAnyStepInterrupted(): boolean {
  return anyStepInterrupted;
}

export function getInterruptSignal(): AbortSignal | undefined {
  return controller?.signal;
}
