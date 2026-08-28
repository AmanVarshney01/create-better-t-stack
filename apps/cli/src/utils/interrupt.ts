let interrupted = false;
let controller: AbortController | null = null;
let listener: (() => void) | null = null;

/**
 * Once files are on disk, Ctrl-C should only stop the step that is running. Holding a SIGINT
 * listener keeps the CLI alive (the terminal's signal already ends the subprocess), and the
 * remaining optional steps check wasInterrupted() to skip themselves.
 */
export function beginInterruptibleScope(): void {
  endInterruptibleScope();
  interrupted = false;
  controller = new AbortController();
  listener = () => {
    interrupted = true;
    controller?.abort();
  };
  process.on("SIGINT", listener);
}

export function endInterruptibleScope(): void {
  if (listener) process.off("SIGINT", listener);
  listener = null;
  controller = null;
}

export function wasInterrupted(): boolean {
  return interrupted;
}

export function getInterruptSignal(): AbortSignal | undefined {
  return controller?.signal;
}
