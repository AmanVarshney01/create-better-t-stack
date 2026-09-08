import type { Writable } from "node:stream";

import { wrapTextWithPrefix } from "@clack/core";
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
const ERASE_DOWN = "\r\x1b[J";
const cursorUp = (rows: number) => `\x1b[${rows}A`;

type SpinnerOutput = Writable & {
  isTTY?: boolean;
  columns?: number;
};

let cursorOutput: SpinnerOutput | undefined;
let restoreCursorOnExit = false;
function hideCursor(out: SpinnerOutput): void {
  if (cursorOutput) return;
  cursorOutput = out;
  out.write(HIDE_CURSOR);
  if (!restoreCursorOnExit) {
    restoreCursorOnExit = true;
    process.once("exit", () => {
      cursorOutput?.write(SHOW_CURSOR);
    });
  }
}
function showCursor(out: SpinnerOutput): void {
  if (cursorOutput !== out) return;
  cursorOutput = undefined;
  out.write(SHOW_CURSOR);
}

/**
 * The clack spinner puts stdin in raw mode and exits the process on Ctrl-C from its own
 * keypress handler. This one never touches stdin, so Ctrl-C stays a SIGINT and the
 * interrupt scope decides what happens.
 */
function createTerminalSpinner(out: SpinnerOutput): SpinnerLike {
  const animate = Boolean(out.isTTY) && !process.env.CI;
  let text = "";
  let active = false;
  let interruptedBefore = false;
  let frame = 0;
  let dots = 0;
  let renderedRows = 0;
  let timer: ReturnType<typeof setInterval> | undefined;

  const clearFrame = () => {
    if (renderedRows > 1) out.write(cursorUp(renderedRows - 1));
    out.write(ERASE_DOWN);
    renderedRows = 0;
  };
  const render = () => {
    const suffix = ".".repeat(Math.floor(dots)).slice(0, 3);
    const line = `${pc.magenta(SPINNER_FRAMES[frame])}  ${text}${suffix}`;
    clearFrame();
    const wrapped = wrapTextWithPrefix(out, line, "");
    out.write(wrapped.replaceAll("\n", "\r\n"));
    renderedRows = wrapped.split("\n").length;
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
        hideCursor(out);
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
        clearFrame();
        showCursor(out);
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

export function createSpinner(output?: SpinnerOutput): SpinnerLike {
  return isSilent() ? noopSpinner : createTerminalSpinner(output ?? process.stdout);
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
  /** Silent after a Ctrl-C in the current step: the cancelled line already said it. */
  error(message: string) {
    if (!isSilent() && !wasInterrupted()) log.error(message);
  },
  message(message: string) {
    if (!isSilent()) log.message(message);
  },
};

export const cliConsola = {
  error(message: string) {
    if (!isSilent() && !wasInterrupted()) baseConsola.error(message);
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
