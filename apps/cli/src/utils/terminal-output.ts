import { log } from "@clack/prompts";
import { consola, createConsola } from "consola";
import pc from "picocolors";

import { isSilent } from "./context";
import { S_BAR, S_STEP_CANCEL, S_STEP_SUBMIT, SPINNER_FRAMES } from "./glyphs";
import { wasInterrupted } from "./interrupt";

type SpinnerLike = {
  start(message: string): void;
  stop(message?: string): void;
  message(message: string): void;
};

const noopSpinner: SpinnerLike = {
  start() {},
  stop() {},
  message() {},
};

const FRAME_MS = 80;
const HIDE_CURSOR = "\x1b[?25l";
const SHOW_CURSOR = "\x1b[?25h";
const CLEAR_LINE = "\r\x1b[2K";

let cursorHidden = false;
function hideCursor(): void {
  if (cursorHidden) return;
  cursorHidden = true;
  process.stdout.write(HIDE_CURSOR);
  process.once("exit", () => process.stdout.write(SHOW_CURSOR));
}
function showCursor(): void {
  if (!cursorHidden) return;
  cursorHidden = false;
  process.stdout.write(SHOW_CURSOR);
}

/**
 * The clack spinner puts stdin in raw mode and exits the process on Ctrl-C from its own
 * keypress handler. This one never touches stdin, so Ctrl-C stays a SIGINT and the
 * interrupt scope decides what happens.
 */
function createTerminalSpinner(): SpinnerLike {
  const out = process.stdout;
  const animate = out.isTTY && !process.env.CI;
  let text = "";
  let active = false;
  let interruptedBefore = false;
  let frame = 0;
  let dots = 0;
  let timer: ReturnType<typeof setInterval> | undefined;

  const render = () => {
    const suffix = ".".repeat(Math.floor(dots)).slice(0, 3);
    out.write(`${CLEAR_LINE}${pc.magenta(SPINNER_FRAMES[frame])}  ${text}${suffix}`);
    frame = (frame + 1) % SPINNER_FRAMES.length;
    dots = dots < 4 ? dots + 0.125 : 0;
  };
  const setText = (message: string) => {
    text = message.replace(/\.+$/, "");
  };

  return {
    start(message) {
      if (active) return;
      active = true;
      interruptedBefore = wasInterrupted();
      setText(message);
      out.write(`${pc.gray(S_BAR)}\n`);
      if (animate) {
        hideCursor();
        render();
        timer = setInterval(render, FRAME_MS);
      } else {
        out.write(`${pc.magenta(SPINNER_FRAMES[0])}  ${text}\n`);
      }
    },
    message: setText,
    stop(message) {
      if (!active) return;
      active = false;
      if (timer) clearInterval(timer);
      if (animate) {
        out.write(CLEAR_LINE);
        showCursor();
      }
      const cancelled = wasInterrupted() && !interruptedBefore;
      out.write(
        cancelled
          ? `${pc.yellow(S_STEP_CANCEL)}  ${text} (cancelled)\n`
          : `${pc.green(S_STEP_SUBMIT)}  ${message || text}\n`,
      );
    },
  };
}

export function createSpinner(): SpinnerLike {
  return isSilent() ? noopSpinner : createTerminalSpinner();
}

const baseConsola = createConsola({
  ...consola.options,
  formatOptions: {
    ...consola.options.formatOptions,
    date: false,
  },
});

export const cliLog = {
  info(message: string) {
    if (!isSilent()) log.info(message);
  },
  warn(message: string) {
    if (!isSilent()) log.warn(message);
  },
  success(message: string) {
    if (!isSilent()) log.success(message);
  },
  error(message: string) {
    if (!isSilent()) log.error(message);
  },
  message(message: string) {
    if (!isSilent()) log.message(message);
  },
};

export const cliConsola = {
  error(message: string) {
    if (!isSilent()) baseConsola.error(message);
  },
  warn(message: string) {
    if (!isSilent()) baseConsola.warn(message);
  },
  info(message: string) {
    if (!isSilent()) baseConsola.info(message);
  },
  fatal(message: string) {
    if (!isSilent()) baseConsola.fatal(message);
  },
  box(message: string) {
    if (!isSilent()) baseConsola.box(message);
  },
};
