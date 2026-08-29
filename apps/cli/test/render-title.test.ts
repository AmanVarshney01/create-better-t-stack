import { describe, expect, it } from "bun:test";

import { renderTitle, TITLE_TEXT } from "../src/render-title";

const ansiPattern = new RegExp(`${String.fromCharCode(27)}\\[[0-?]*[ -/]*[@-~]`, "g");

function stripAnsi(value: string): string {
  return value.replaceAll(ansiPattern, "");
}

function glyphCount(value: string): number {
  return [...value].filter((character) => character !== " " && character !== "\n").length;
}

function createOutput(columns: number) {
  const chunks: string[] = [];

  return {
    chunks,
    output: {
      columns,
      isTTY: true,
      write(chunk: string | Uint8Array) {
        chunks.push(String(chunk));
        return true;
      },
    },
  };
}

describe("renderTitle", () => {
  it("renders one static frame when animation is disabled", async () => {
    const { chunks, output } = createOutput(120);

    await renderTitle({ animate: false, output });

    expect(chunks).toHaveLength(1);
    expect(stripAnsi(chunks[0] ?? "")).toBe(`${TITLE_TEXT}\n`);
  });

  it("does not emit animation controls for redirected output", async () => {
    const { chunks, output } = createOutput(120);
    output.isTTY = false;

    await renderTitle({ output });

    expect(chunks).toHaveLength(1);
    expect(chunks[0]).not.toContain("\u001B[?25l");
  });

  it("uses the compact title in narrow terminals", async () => {
    const { chunks, output } = createOutput(40);

    await renderTitle({ animate: true, frameDelayMs: 0, output });

    expect(chunks).toHaveLength(1);
    expect(stripAnsi(chunks[0] ?? "")).toBe("Better T Stack\n");
  });

  it("keeps the full title static when it exactly fits the terminal", async () => {
    const titleWidth = Math.max(...TITLE_TEXT.split("\n").map((line) => line.length));
    const { chunks, output } = createOutput(titleWidth);

    await renderTitle({ animate: true, frameDelayMs: 0, output });

    expect(chunks).toHaveLength(1);
    expect(stripAnsi(chunks[0] ?? "")).toBe(`${TITLE_TEXT}\n`);
  });

  it("skips animation when BTS_NO_ANIMATION is set", async () => {
    const previous = process.env.BTS_NO_ANIMATION;
    process.env.BTS_NO_ANIMATION = "1";
    try {
      const { chunks, output } = createOutput(120);
      await renderTitle({ output });
      expect(chunks).toHaveLength(1);
      expect(chunks[0]).not.toContain("\u001B[?25l");
      expect(stripAnsi(chunks[0] ?? "")).toBe(`${TITLE_TEXT}\n`);
    } finally {
      if (previous === undefined) {
        delete process.env.BTS_NO_ANIMATION;
      } else {
        process.env.BTS_NO_ANIMATION = previous;
      }
    }
  });

  it("draws a neutral wireframe then fills the wordmark upward", async () => {
    const { chunks, output } = createOutput(120);

    await renderTitle({ animate: true, frameDelayMs: 0, output });

    expect(chunks[0]).toBe("\u001B[?25l");
    const lineCount = TITLE_TEXT.split("\n").length - 1;
    expect(chunks.some((chunk) => chunk.includes(`\u001B[${lineCount}F`))).toBe(true);

    const firstFrame = chunks[1] ?? "";
    const lastFrame = chunks.at(-2) ?? "";
    const strippedFirst = stripAnsi(firstFrame);
    const strippedLast = stripAnsi(lastFrame);

    expect(firstFrame).toContain("38;2;108;112;134");
    expect(strippedFirst).not.toContain("█");
    expect(strippedFirst).toContain("╗");
    expect(glyphCount(strippedFirst)).toBeLessThan(glyphCount(TITLE_TEXT));
    expect(strippedLast).toBe(TITLE_TEXT);
    expect(lastFrame).toContain("38;2;");
    expect(strippedLast).toContain("██████╗");
    expect(chunks.at(-1)).toBe("\u001B[?25h\n");
    expect(chunks.length).toBeGreaterThan(20);
  });
});
