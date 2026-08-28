import gradient from "gradient-string";
import pc from "picocolors";

export const TITLE_TEXT = `
 ██████╗ ███████╗████████╗████████╗███████╗██████╗
 ██╔══██╗██╔════╝╚══██╔══╝╚══██╔══╝██╔════╝██╔══██╗
 ██████╔╝█████╗     ██║      ██║   █████╗  ██████╔╝
 ██╔══██╗██╔══╝     ██║      ██║   ██╔══╝  ██╔══██╗
 ██████╔╝███████╗   ██║      ██║   ███████╗██║  ██║
 ╚═════╝ ╚══════╝   ╚═╝      ╚═╝   ╚══════╝╚═╝  ╚═╝

 ████████╗    ███████╗████████╗ █████╗  ██████╗██╗  ██╗
 ╚══██╔══╝    ██╔════╝╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝
    ██║       ███████╗   ██║   ███████║██║     █████╔╝
    ██║       ╚════██║   ██║   ██╔══██║██║     ██╔═██╗
    ██║       ███████║   ██║   ██║  ██║╚██████╗██║  ██╗
    ╚═╝       ╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝
 `;

const catppuccinTheme = {
  pink: "#F5C2E7",
  mauve: "#CBA6F7",
  red: "#F38BA8",
  maroon: "#E78284",
  peach: "#FAB387",
  yellow: "#F9E2AF",
  green: "#A6E3A1",
  teal: "#94E2D5",
  sky: "#89DCEB",
  sapphire: "#74C7EC",
  lavender: "#B4BEFE",
};

const titleGradient = gradient(Object.values(catppuccinTheme));
const hideCursor = "\u001B[?25l";
const showCursor = "\u001B[?25h";
const reset = "\u001B[39m";

const frameCount = 24;
const frameDelayMs = 16;
/** How far the colour ghosts start, in columns. */
const maxSplit = 4;
const pink: RGB = [245, 194, 231];
const sky: RGB = [137, 220, 235];
const nearWhite: RGB = [248, 248, 252];

type RGB = [number, number, number];

type TitleOutput = {
  columns?: number;
  isTTY?: boolean;
  write(chunk: string): unknown;
};

type RenderTitleOptions = {
  animate?: boolean;
  frameDelayMs?: number;
  output?: TitleOutput;
};

type Cell = { ch: string; color: RGB };

function hexToRgb(hex: string): RGB {
  const value = Number.parseInt(hex.slice(1), 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

const colorStops: RGB[] = Object.values(catppuccinTheme).map(hexToRgb);

function mix(a: RGB, b: RGB, t: number): RGB {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ];
}

function clampByte(value: number): number {
  return Math.max(0, Math.min(255, Math.round(value)));
}

function scale(color: RGB, amount: number): RGB {
  return [clampByte(color[0] * amount), clampByte(color[1] * amount), clampByte(color[2] * amount)];
}

function screen(a: RGB, b: RGB): RGB {
  return [
    clampByte(255 - ((255 - a[0]) * (255 - b[0])) / 255),
    clampByte(255 - ((255 - a[1]) * (255 - b[1])) / 255),
    clampByte(255 - ((255 - a[2]) * (255 - b[2])) / 255),
  ];
}

/** Same even spacing across the stops that gradient-string uses per column. */
function sampleStops(t: number): RGB {
  const scaled = Math.max(0, Math.min(1, t)) * (colorStops.length - 1);
  const index = Math.min(colorStops.length - 2, Math.floor(scaled));
  return mix(colorStops[index], colorStops[index + 1], scaled - index);
}

function fg([r, g, b]: RGB): string {
  return `\u001B[38;2;${r};${g};${b}m`;
}

function renderStaticTitle(title: string): string {
  return titleGradient.multiline(title);
}

function renderSettled(lines: string[], width: number): string {
  if (!pc.isColorSupported) return lines.join("\n");
  return renderPrism(lines, width, frameCount - 1);
}

/**
 * Pink and sky ghosts of the wordmark start sheared apart, then slam into
 * register as the true catppuccin gradient takes over. A lock flash at the
 * end. Not a wipe and not a fade — chromatic focus.
 */
function renderPrism(lines: string[], width: number, frame: number): string {
  const linear = frameCount === 1 ? 1 : frame / (frameCount - 1);
  const t = linear ** 2.2;
  const split = Math.round((1 - t) * maxSplit);
  const ghostAmount = (1 - t) ** 0.6;
  const coreAmount = t;
  const flash = linear > 0.84 ? Math.sin(((linear - 0.84) / 0.16) * Math.PI) ** 2 : 0;

  return lines
    .map((line) => {
      const cells: Array<Cell | undefined> = Array.from({ length: line.length });

      const stamp = (offset: number, colorFor: (column: number) => RGB, amount: number) => {
        if (amount <= 0.02) return;
        for (let source = 0; source < line.length; source++) {
          const ch = line[source];
          if (ch === " " || ch === undefined) continue;
          const dest = source + offset;
          if (dest < 0 || dest >= line.length) continue;
          const incoming = scale(colorFor(source), amount);
          const prev = cells[dest];
          if (!prev) {
            cells[dest] = { ch, color: incoming };
          } else {
            cells[dest] = { ch: offset === 0 ? ch : prev.ch, color: screen(prev.color, incoming) };
          }
        }
      };

      stamp(-split, () => pink, ghostAmount);
      stamp(split, () => sky, ghostAmount);
      stamp(0, (column) => sampleStops(width > 1 ? column / (width - 1) : 0), coreAmount);

      if (flash > 0.02) {
        for (const cell of cells) {
          if (!cell) continue;
          cell.color = mix(cell.color, nearWhite, flash * 0.55);
        }
      }

      let out = "";
      let pen = "";
      for (let column = 0; column < line.length; column++) {
        const cell = cells[column];
        if (!cell) {
          if (pen) {
            out += reset;
            pen = "";
          }
          out += " ";
          continue;
        }
        const next = fg(cell.color);
        if (next !== pen) {
          out += next;
          pen = next;
        }
        out += cell.ch;
      }
      return pen ? out + reset : out;
    })
    .join("\n");
}

function shouldAnimate(output: TitleOutput): boolean {
  return Boolean(
    output.isTTY &&
      pc.isColorSupported &&
      !process.env.CI &&
      process.env.NO_COLOR === undefined &&
      process.env.FORCE_COLOR !== "0" &&
      process.env.TERM !== "dumb" &&
      process.env.BTS_TEST_MODE !== "1" &&
      process.env.BTS_NO_ANIMATION !== "1",
  );
}

async function wait(milliseconds: number): Promise<void> {
  if (milliseconds <= 0) return;
  await new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export const renderTitle = async (options: RenderTitleOptions = {}): Promise<void> => {
  const output = options.output ?? process.stdout;
  const terminalWidth = output.columns || 80;
  const lines = TITLE_TEXT.split("\n");
  const titleWidth = Math.max(...lines.map((line) => line.length));

  if (terminalWidth < titleWidth) {
    output.write(`${renderStaticTitle("Better T Stack")}\n`);
    return;
  }

  if (terminalWidth === titleWidth || !(options.animate ?? shouldAnimate(output))) {
    output.write(`${renderSettled(lines, titleWidth)}\n`);
    return;
  }

  const delayMs = options.frameDelayMs ?? frameDelayMs;
  const lineCount = lines.length - 1;
  const moveToFrameStart = `\u001B[${lineCount}F`;

  const frames: string[] = [];
  for (let frame = 0; frame < frameCount; frame++) {
    frames.push(renderPrism(lines, titleWidth, frame));
  }

  const restoreCursor = () => {
    output.write(showCursor);
  };

  output.write(hideCursor);
  const usingRealStdout = options.output === undefined;
  process.once("exit", restoreCursor);
  const onSignal = (signal: NodeJS.Signals) => {
    restoreCursor();
    process.off("exit", restoreCursor);
    process.exit(signal === "SIGINT" ? 130 : 143);
  };
  if (usingRealStdout) {
    process.once("SIGINT", onSignal);
    process.once("SIGTERM", onSignal);
  }

  try {
    for (const [index, frame] of frames.entries()) {
      output.write(`${index === 0 ? "" : moveToFrameStart}${frame}`);
      if (index < frames.length - 1) await wait(delayMs);
    }
  } finally {
    process.off("exit", restoreCursor);
    if (usingRealStdout) {
      process.off("SIGINT", onSignal);
      process.off("SIGTERM", onSignal);
    }
    output.write(`${showCursor}\n`);
  }
};
