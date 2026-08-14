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
const HIDE_CURSOR = "\u001B[?25l";
const SHOW_CURSOR = "\u001B[?25h";
const RESET = "\u001B[39m";

const BLOCK_STAGES = ["▁", "▂", "▃", "▄", "▅", "▆", "▇", "█"];
const CREST: RGB = [255, 255, 255];
/** Columns the wavefront travels per frame. */
const WAVE_SPEED = 2.4;
/** Columns each row lags behind the one above, which slants the wavefront. */
const ROW_LAG = 1.4;
/** Columns a glyph takes to rise from its first block stage to settled colour. */
const RAMP = 7;
const FRAME_DELAY_MS = 16;

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

const STOPS: RGB[] = Object.values(catppuccinTheme).map(hexToRgb);

function mix(a: RGB, b: RGB, t: number): RGB {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ];
}

/** Same even spacing across the stops that gradient-string uses per column. */
function sampleStops(t: number): RGB {
  const scaled = Math.max(0, Math.min(1, t)) * (STOPS.length - 1);
  const index = Math.min(STOPS.length - 2, Math.floor(scaled));
  return mix(STOPS[index], STOPS[index + 1], scaled - index);
}

function fg([r, g, b]: RGB): string {
  return `\u001B[38;2;${r};${g};${b}m`;
}

function renderStaticTitle(title: string): string {
  return titleGradient.multiline(title);
}

/**
 * One frame of a wavefront travelling left to right: ahead of it nothing has
 * appeared, at its crest the glyphs are rising through the block ramp and lit
 * near-white, and behind it they have settled into the catppuccin gradient.
 */
function renderWave(lines: string[], width: number, head: number): string {
  return lines
    .map((line, row) => {
      const rowHead = head - row * ROW_LAG;
      let out = "";
      let pen = "";

      for (let column = 0; column < line.length; column++) {
        const age = rowHead - column;
        if (age <= 0) {
          if (pen) {
            out += RESET;
            pen = "";
          }
          out += " ";
          continue;
        }

        const character = line[column];
        const settled = Math.min(1, age / RAMP);
        const glyph =
          character === "█" && settled < 1
            ? BLOCK_STAGES[
                Math.min(BLOCK_STAGES.length - 1, Math.floor(settled * BLOCK_STAGES.length))
              ]
            : character;

        const base = sampleStops(width > 1 ? column / (width - 1) : 0);
        // Ease the crest out quickly so only the leading columns read as hot.
        const heat = (1 - settled) ** 2;
        const next = fg(mix(base, CREST, heat));
        if (next !== pen) {
          out += next;
          pen = next;
        }
        out += glyph;
      }

      return pen ? out + RESET : out;
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
    output.write(`${renderStaticTitle(TITLE_TEXT)}\n`);
    return;
  }

  const frameDelayMs = options.frameDelayMs ?? FRAME_DELAY_MS;
  const lineCount = lines.length - 1;
  const moveToFrameStart = `\u001B[${lineCount}A\r`;
  const travel = titleWidth + lineCount * ROW_LAG + RAMP;

  const frames: string[] = [];
  for (let head = WAVE_SPEED; head < travel; head += WAVE_SPEED) {
    frames.push(renderWave(lines, titleWidth, head));
  }
  // Settle with the same renderer, not gradient-string: it degrades to a lower
  // colour depth than the truecolor frames, which would jump on the last step.
  frames.push(renderWave(lines, titleWidth, travel + RAMP));

  output.write(HIDE_CURSOR);
  const restoreCursorOnExit = () => output.write(SHOW_CURSOR);
  process.once("exit", restoreCursorOnExit);
  try {
    for (const [index, frame] of frames.entries()) {
      output.write(`${index === 0 ? "" : moveToFrameStart}${frame}`);
      if (index < frames.length - 1) await wait(frameDelayMs);
    }
  } finally {
    process.off("exit", restoreCursorOnExit);
    output.write(`${SHOW_CURSOR}\n`);
  }
};
