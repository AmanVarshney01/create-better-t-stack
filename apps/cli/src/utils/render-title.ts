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

const SCRAMBLE = ["░", "▒", "▓", "╬", "╪", "┼", "═", "║", "#", "%", "*", "+", "=", "<", ">", ":"];
const WHITE: RGB = [255, 255, 255];
const BLACK: RGB = [0, 0, 0];
const NOISE_DIM: RGB = [69, 71, 90];
/** Columns of scramble static running ahead of each glyph's lock-in. */
const NOISE_LEAD = 9;
/** Random spread, in columns, added to each lock-in so the front is ragged. */
const LOCK_JITTER = 7;
/** Columns the decode front travels per frame. */
const DECODE_SPEED = 2.6;
/** Columns each row lags behind the one above. */
const ROW_LAG = 1.4;
/** Columns over which the lock-in flash fades back to the settled colour. */
const FLASH_SPAN = 4;
/** How far the flash lifts a freshly locked glyph toward white. */
const FLASH_LIFT = 0.72;
/** Box-drawing glyphs are ANSI Shadow's drop shadow, kept darker than the fill. */
const SHADOW_DEPTH = 0.42;
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

/** Deterministic per-cell-per-frame noise, so runs and tests are reproducible. */
function hash(x: number, y: number, frame: number): number {
  let h = (x * 374761393 + y * 668265263 + frame * 2246822519) >>> 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return (h ^ (h >>> 16)) >>> 0;
}

function renderStaticTitle(title: string): string {
  return titleGradient.multiline(title);
}

/** The finished wordmark, or plain text where colour is unsupported. */
function renderSettled(lines: string[], width: number): string {
  if (!pc.isColorSupported) return lines.join("\n");
  return renderDecode(lines, width, Number.POSITIVE_INFINITY);
}

/**
 * One frame of the decode: ahead of the front nothing has appeared, inside the
 * noise band glyph cells flicker through scramble static that warms toward the
 * column's colour, and at lock-in the real glyph lands with a brief flash
 * before settling into the gradient.
 */
function renderDecode(lines: string[], width: number, head: number): string {
  const frameKey = Number.isFinite(head) ? Math.floor(head) : 0;
  return lines
    .map((line, row) => {
      let out = "";
      let pen = "";

      for (let column = 0; column < line.length; column++) {
        const character = line[column];
        const lock = column + row * ROW_LAG + ((hash(column, row, 0) % 1000) / 1000) * LOCK_JITTER;
        const age = head - lock;

        if (character === " " || age < -NOISE_LEAD) {
          if (pen) {
            out += RESET;
            pen = "";
          }
          out += " ";
          continue;
        }

        const stop = sampleStops(width > 1 ? column / (width - 1) : 0);
        let glyph: string;
        let colour: RGB;
        if (age < 0) {
          glyph = SCRAMBLE[hash(column, row, frameKey) % SCRAMBLE.length];
          const approach = 1 + age / NOISE_LEAD;
          colour = mix(NOISE_DIM, stop, approach * 0.6);
        } else {
          glyph = character;
          const base = character === "█" ? stop : mix(stop, BLACK, SHADOW_DEPTH);
          const heat = Math.max(0, 1 - age / FLASH_SPAN) ** 2;
          colour = mix(base, WHITE, heat * FLASH_LIFT);
        }

        const next = fg(colour);
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
    output.write(`${renderSettled(lines, titleWidth)}\n`);
    return;
  }

  const frameDelayMs = options.frameDelayMs ?? FRAME_DELAY_MS;
  const lineCount = lines.length - 1;
  const moveToFrameStart = `\u001B[${lineCount}A\r`;
  const travel = titleWidth + lineCount * ROW_LAG + LOCK_JITTER + FLASH_SPAN;

  const frames: string[] = [];
  for (let head = 0; head < travel; head += DECODE_SPEED) {
    frames.push(renderDecode(lines, titleWidth, head));
  }
  // Settle with the same renderer, not gradient-string: it degrades to a lower
  // colour depth than the truecolor frames, which would jump on the last step.
  frames.push(renderDecode(lines, titleWidth, Number.POSITIVE_INFINITY));

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
