import { describe, expect, it } from "bun:test";

import { renderTitle, TITLE_TEXT } from "../src/utils/render-title";

const ANSI_PATTERN = new RegExp(`${String.fromCharCode(27)}\\[[0-?]*[ -/]*[@-~]`, "g");

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
    expect(chunks[0]?.replaceAll(ANSI_PATTERN, "")).toBe(`${TITLE_TEXT}\n`);
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
    expect(chunks[0]?.replaceAll(ANSI_PATTERN, "")).toBe("Better T Stack\n");
  });

  it("keeps the full title static when it exactly fits the terminal", async () => {
    const titleWidth = Math.max(...TITLE_TEXT.split("\n").map((line) => line.length));
    const { chunks, output } = createOutput(titleWidth);

    await renderTitle({ animate: true, frameDelayMs: 0, output });

    expect(chunks).toHaveLength(1);
    expect(chunks[0]?.replaceAll(ANSI_PATTERN, "")).toBe(`${TITLE_TEXT}\n`);
  });

  it("fades the whole wordmark from neutral grey into the gradient", async () => {
    const { chunks, output } = createOutput(120);

    await renderTitle({ animate: true, frameDelayMs: 0, output });

    expect(chunks[0]).toBe("\u001B[?25l");
    const lineCount = TITLE_TEXT.split("\n").length - 1;
    expect(chunks.some((chunk) => chunk.includes(`\u001B[${lineCount}A\r`))).toBe(true);
    const firstFrame = chunks[1] ?? "";
    expect(firstFrame.replaceAll(ANSI_PATTERN, "")).toBe(TITLE_TEXT);
    expect(firstFrame).toContain("38;2;108;112;134");
    const lastFrame = chunks.at(-2) ?? "";
    expect(lastFrame.replaceAll(ANSI_PATTERN, "")).toContain("██████╗");
    expect(lastFrame).not.toContain("38;2;108;112;134");
    expect(chunks.at(-1)).toBe("\u001B[?25h\n");
    expect(chunks.length).toBeGreaterThan(20);
  });
});
