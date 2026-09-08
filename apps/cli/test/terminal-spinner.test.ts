import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import { PassThrough } from "node:stream";
import { stripVTControlCharacters } from "node:util";

import { S_BAR, S_STEP_SUBMIT } from "../src/utils/glyphs";
import { createSpinner } from "../src/utils/terminal-output";

const ESC = String.fromCharCode(27);
const graphemes = new Intl.Segmenter(undefined, { granularity: "grapheme" });

/** A capturing stream that looks like a terminal of the given width to the spinner. */
function createOutput(columns: number, isTTY = true) {
  const output = Object.assign(new PassThrough(), { isTTY, columns });
  let rendered = "";
  output.on("data", (chunk) => (rendered += chunk));
  return { output, rendered: () => rendered };
}

/**
 * Minimal terminal model: soft-wraps at `columns` by cell width and honors the control
 * sequences the spinner emits (CR, LF, cursor up, erase down, erase line, cursor show/hide,
 * SGR colors). Returns the visible rows plus every cursor-up distance, so assertions
 * describe what the user sees rather than raw bytes.
 */
function replay(bytes: string, columns: number) {
  const rows: string[][] = [[]];
  const cursorUps: number[] = [];
  let row = 0;
  let col = 0;

  const put = (grapheme: string) => {
    const width = Bun.stringWidth(grapheme);
    if (width === 0) return;
    if (col + width > columns) {
      row += 1;
      col = 0;
      rows[row] ??= [];
    }
    rows[row][col] = grapheme;
    for (let extra = 1; extra < width; extra += 1) rows[row][col + extra] = "";
    col += width;
  };

  let i = 0;
  while (i < bytes.length) {
    const char = bytes[i];
    if (char === "\r") {
      col = 0;
      i += 1;
    } else if (char === "\n") {
      row += 1;
      col = 0;
      rows[row] ??= [];
      i += 1;
    } else if (char === ESC && bytes[i + 1] === "[") {
      let end = i + 2;
      while (end < bytes.length && !/[A-Za-z]/.test(bytes[end])) end += 1;
      const kind = bytes[end];
      const arg = Number.parseInt(bytes.slice(i + 2, end), 10) || 1;
      if (kind === "A") {
        cursorUps.push(arg);
        row = Math.max(0, row - arg);
      } else if (kind === "J") {
        rows[row] = rows[row].slice(0, col);
        rows.length = row + 1;
      } else if (kind === "K") {
        rows[row] = [];
      }
      i = end + 1;
    } else {
      let end = i;
      while (
        end < bytes.length &&
        bytes[end] !== ESC &&
        bytes[end] !== "\r" &&
        bytes[end] !== "\n"
      ) {
        end += 1;
      }
      for (const { segment } of graphemes.segment(bytes.slice(i, end))) put(segment);
      i = end;
    }
  }

  const screen = rows
    .map((cells) => Array.from(cells, (cell) => cell ?? " ").join(""))
    .filter((line) => line.trim() !== "");
  return { screen, cursorUps };
}

/** Starts a spinner on `output`, lets a few frames render, then stops it with `done`. */
async function runSpinner(output: PassThrough, message: string, done: string) {
  const spinner = createSpinner(output);
  spinner.start(message);
  await new Promise((resolve) => setTimeout(resolve, 200));
  spinner.stop(done);
  await new Promise((resolve) => setTimeout(resolve, 0));
}

describe("terminal spinner", () => {
  // The spinner falls back to static output when CI is set. Every test below drives the
  // animated path through the stream it is given, so pin that here and restore it after.
  let savedCI: string | undefined;
  beforeAll(() => {
    savedCI = process.env.CI;
    delete process.env.CI;
  });
  afterAll(() => {
    if (savedCI === undefined) delete process.env.CI;
    else process.env.CI = savedCI;
  });

  // 83-86 columns once the frame glyph and animated dots are added.
  const longMessage =
    'Creating Turso database "tanstack-start-hono-turso-alchemyv2" in group "default"...';

  it("redraws a frame wider than the terminal in place", async () => {
    const { output, rendered } = createOutput(40);

    await runSpinner(output, longMessage, "Turso database created");

    const { screen, cursorUps } = replay(rendered(), 40);
    expect(cursorUps.length).toBeGreaterThan(0);
    expect(new Set(cursorUps)).toEqual(new Set([2]));
    expect(screen).toEqual([S_BAR, `${S_STEP_SUBMIT}  Turso database created`]);
  });

  it("does not move the cursor up for a frame that fits on one row", async () => {
    const { output, rendered } = createOutput(120);

    await runSpinner(output, longMessage, "Turso database created");

    const { screen, cursorUps } = replay(rendered(), 120);
    expect(cursorUps).toEqual([]);
    expect(screen).toEqual([S_BAR, `${S_STEP_SUBMIT}  Turso database created`]);
  });

  it("counts wide characters by the columns they occupy", async () => {
    const { output, rendered } = createOutput(40);
    // 10 CJK characters: 10 code units but 20 columns, so the frame is 44-47 columns wide
    // while its string length (34-37) would still fit on one row.
    const wideMessage = `Clearing directory "${"项目".repeat(5)}"...`;

    await runSpinner(output, wideMessage, "Directory cleared");

    const { screen, cursorUps } = replay(rendered(), 40);
    expect(cursorUps.length).toBeGreaterThan(0);
    expect(new Set(cursorUps)).toEqual(new Set([1]));
    expect(screen).toEqual([S_BAR, `${S_STEP_SUBMIT}  Directory cleared`]);
  });

  for (const [name, message] of [
    ["exact-width text", "x".repeat(37)],
    ["a wide character at the margin", "x".repeat(36) + "项目"],
    ["ANSI-colored text", "\x1b[31m" + "x".repeat(82) + "\x1b[0m"],
    ["explicit newlines", "first line\nsecond line"],
  ]) {
    it(`clears ${name} before the final result`, async () => {
      const { output, rendered } = createOutput(40);
      await runSpinner(output, message, "Done");
      expect(replay(rendered(), 40).screen).toEqual([S_BAR, `${S_STEP_SUBMIT}  Done`]);
    });
  }

  it("clears the previous frame when the message becomes shorter", async () => {
    const { output, rendered } = createOutput(40);
    const spinner = createSpinner(output);
    spinner.start(longMessage);
    spinner.message("Short");
    await new Promise((resolve) => setTimeout(resolve, 200));
    spinner.stop("Done");
    expect(replay(rendered(), 40).screen).toEqual([S_BAR, `${S_STEP_SUBMIT}  Done`]);
  });

  it("restores the cursor on the active stream when the process exits", async () => {
    const script = `
      import { PassThrough } from "node:stream";
      import { createSpinner } from ${JSON.stringify(new URL("../src/utils/terminal-output.ts", import.meta.url).href)};
      delete process.env.CI;
      const streams = [0, 1].map(() => Object.assign(new PassThrough(), { isTTY: true, columns: 80 }));
      const captured = ["", ""];
      streams.forEach((stream, index) => stream.on("data", (chunk) => captured[index] += chunk));
      const first = createSpinner(streams[0]);
      first.start("First");
      first.stop("Done");
      createSpinner(streams[1]).start("Second");
      process.once("exit", () => process.stdout.write(JSON.stringify(captured)));
      process.exit(0);
    `;
    const child = Bun.spawn([process.execPath, "--eval", script], {
      stdout: "pipe",
      stderr: "pipe",
    });
    const output = await new Response(child.stdout).text();
    expect(await child.exited).toBe(0);
    const [first, active] = JSON.parse(output) as string[];
    expect(first.split(`${ESC}[?25h`)).toHaveLength(2);
    expect(active).toEndWith(`${ESC}[?25h`);
  });

  it("prints static lines without cursor control when output is not a TTY", async () => {
    const { output, rendered } = createOutput(40, false);

    await runSpinner(output, longMessage, "Turso database created");

    expect(rendered()).not.toContain(`${ESC}[?25l`);
    expect(replay(rendered(), 40).cursorUps).toEqual([]);
    const lines = stripVTControlCharacters(rendered()).trimEnd().split("\n");
    expect(lines).toHaveLength(3);
    expect(lines[1]).toContain('Creating Turso database "tanstack-start-hono-turso-alchemyv2"');
    expect(lines[2]).toBe(`${S_STEP_SUBMIT}  Turso database created`);
  });
});
