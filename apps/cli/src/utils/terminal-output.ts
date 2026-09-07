import { stripVTControlCharacters } from "node:util";

import { log } from "@clack/prompts";
import { consola, createConsola } from "consola";
import pc from "picocolors";
import stringWidth from "string-width";

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
const graphemes = new Intl.Segmenter(undefined, { granularity: "grapheme" });

type SpinnerOutput = Pick<NodeJS.WriteStream, "write"> & {
  isTTY?: boolean;
  columns?: number;
};

let cursorHidden = false;
let restoreCursorOnExit = false;
/** Hides the cursor on `out` and makes sure it comes back if the process exits mid-spin. */
function hideCursor(out: SpinnerOutput): void {
  if (cursorHidden) return;
  cursorHidden = true;
  out.write(HIDE_CURSOR);
  if (!restoreCursorOnExit) {
    restoreCursorOnExit = true;
    process.once("exit", () => {
      if (cursorHidden) out.write(SHOW_CURSOR);
    });
  }
}
/** Restores the cursor hidden by `hideCursor`. */
function showCursor(out: SpinnerOutput): void {
  if (!cursorHidden) return;
  cursorHidden = false;
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

  /**
   * Rows a frame occupies once the terminal soft-wraps it. Walk graphemes by cell width so
   * wide characters (CJK paths, emoji) count as the two columns they take on screen.
   */
  const rowsFor = (line: string) => {
    const columns = out.columns || 80;
    let rows = 1;
    let col = 0;
    for (const { segment } of graphemes.segment(stripVTControlCharacters(line))) {
      const width = stringWidth(segment);
      if (col + width > columns) {
        rows += 1;
        col = 0;
      }
      col += width;
    }
    return rows;
  };
  /**
   * `\r` + erase-line only clears the row the cursor is on. A frame wider than the terminal
   * wraps, leaving the cursor on its last row, so every redraw would push the rows above it
   * into scrollback (#1215). Climb back to the first row and erase down instead.
   */
  const clearFrame = () => {
    if (renderedRows > 1) out.write(cursorUp(renderedRows - 1));
    out.write(ERASE_DOWN);
    renderedRows = 0;
  };
  const render = () => {
    const suffix = ".".repeat(Math.floor(dots)).slice(0, 3);
    const line = `${pc.magenta(SPINNER_FRAMES[frame])}  ${text}${suffix}`;
    clearFrame();
    out.write(line);
    renderedRows = rowsFor(line);
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

/** `output` defaults to stdout; tests pass a stream with `isTTY`/`columns` set. */
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
