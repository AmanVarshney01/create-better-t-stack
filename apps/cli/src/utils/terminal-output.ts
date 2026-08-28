import { log } from "@clack/prompts";
import { consola, createConsola } from "consola";
import pc from "picocolors";

import { isSilent } from "./context";
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

const unicode =
  process.platform !== "win32" ||
  Boolean(process.env.WT_SESSION) ||
  process.env.TERM_PROGRAM === "vscode";
const FRAMES = unicode ? ["◒", "◐", "◓", "◑"] : ["•", "o", "O", "0"];
const BAR = unicode ? "│" : "|";
const STEP = unicode ? "◇" : "o";
const CANCEL = unicode ? "■" : "x";
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
    out.write(`${CLEAR_LINE}${pc.magenta(FRAMES[frame])}  ${text}${suffix}`);
    frame = (frame + 1) % FRAMES.length;
    dots = dots < 4 ? dots + 0.125 : 0;
  };

  return {
    start(message) {
      if (active) return;
      active = true;
      interruptedBefore = wasInterrupted();
      text = message.replace(/\.+$/, "");
      out.write(`${pc.gray(BAR)}\n`);
      if (animate) {
        hideCursor();
        render();
        timer = setInterval(render, FRAME_MS);
      } else {
        out.write(`${pc.magenta(FRAMES[0])}  ${text}\n`);
      }
    },
    message(message) {
      text = message.replace(/\.+$/, "");
    },
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
          ? `${pc.yellow(CANCEL)}  ${text} (cancelled)\n`
          : `${pc.green(STEP)}  ${message || text}\n`,
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
