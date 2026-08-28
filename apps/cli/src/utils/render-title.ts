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

/** Block fill rises through this ramp at the wavefront. */
const blockStages = ["\u2581", "\u2582", "\u2583", "\u2584", "\u2585", "\u2586", "\u2587", "\u2588"] as const;
/** Crest of the wave reads as a light source. */
const nearWhite: RGB = [248, 248, 252];
const frameCount = 34;
const frameDelayMs = 16;
/** Columns of lag per row so T STACK trails BETTER. */
const rowLag = 1.75;
/** Width of the rising band, in columns. */
const waveWidth = 7;

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

/** Same even spacing across the stops that gradient-string uses per column. */
function sampleStops(t: number): RGB {
  const scaled = Math.max(0, Math.min(1, t)) * (colorStops.length - 1);
  const index = Math.min(colorStops.length - 2, Math.floor(scaled));
  return mix(colorStops[index], colorStops[index + 1], scaled - index);
}

function fg([r, g, b]: RGB): string {
  return `\u001B[38;2;${r};${g};${b}m`;
}

function isFullBlock(character: string): boolean {
  return character === "\u2588";
}

function glyphFor(character: string, rise: number): string {
  if (!isFullBlock(character)) {
    return rise < 0.35 ? " " : character;
  }
  const index = Math.min(blockStages.length - 1, Math.floor(rise * blockStages.length));
  return blockStages[index];
}

function renderStaticTitle(title: string): string {
  return titleGradient.multiline(title);
}

function renderSettled(lines: string[], width: number): string {
  if (!pc.isColorSupported) return lines.join("\n");
  return renderWave(lines, width, frameCount - 1);
}

/**
 * One wavefront travelling left to right.
 * Ahead of it nothing has appeared. At the crest, full-block glyphs rise
 * through ▁▂▃▄▅▆▇█ and light near-white. Behind it they settle into the
 * catppuccin gradient. Rows lag the one above so T STACK trails BETTER.
 */
function renderWave(lines: string[], width: number, frame: number): string {
  const maxRowLag = rowLag * Math.max(0, lines.length - 1);
  const travel = width + waveWidth + maxRowLag;
  const waveX = (frame / (frameCount - 1)) * travel;

  return lines
    .map((line, row) => {
      let out = "";
      let pen = "";

      for (let column = 0; column < line.length; column++) {
        const character = line[column];
        if (character === " ") {
          if (pen) {
            out += reset;
            pen = "";
          }
          out += " ";
          continue;
        }

        const local = waveX - column - row * rowLag;
        if (local < 0) {
          if (pen) {
            out += reset;
            pen = "";
          }
          out += " ";
          continue;
        }

        const settled = local >= waveWidth;
        const rise = settled ? 1 : local / waveWidth;
        const glyph = glyphFor(character, rise);
        if (glyph === " ") {
          if (pen) {
            out += reset;
            pen = "";
          }
          out += " ";
          continue;
        }

        const stop = sampleStops(width > 1 ? column / (width - 1) : 0);
        const heat = settled ? 0 : (1 - rise) ** 2;
        const next = fg(mix(stop, nearWhite, heat));
        if (next !== pen) {
          out += next;
          pen = next;
        }
        out += glyph;
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
    frames.push(renderWave(lines, titleWidth, frame));
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
