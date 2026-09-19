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

const frameCount = 40;
const frameDelayMs = 22;
/** Quiet grey for the wireframe — catppuccin overlay0. */
const neutral: RGB = [108, 112, 134];
/** Hold as outline-only before the ink waterline starts rising. */
const outlineUntil = 0.42;
/** Partial block used only on the rising waterline row. */
const waterlineGlyph = "\u2584";

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

function smoothstep(t: number): number {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
}

function renderStaticTitle(title: string): string {
  return titleGradient.multiline(title);
}

function renderSettled(lines: string[], width: number): string {
  if (!pc.isColorSupported) return lines.join("\n");
  return renderInk(lines, width, frameCount - 1);
}

/**
 * Hold a neutral grey wireframe, then a crisp ink waterline rises from the
 * bottom and floods each row solid into the catppuccin gradient.
 * Deliberately not a block-stage wavefront.
 */
function renderInk(lines: string[], width: number, frame: number): string {
  const linear = frameCount === 1 ? 1 : frame / (frameCount - 1);
  const fillLinear = linear <= outlineUntil ? 0 : (linear - outlineUntil) / (1 - outlineUntil);
  const fillEase = smoothstep(fillLinear);
  const rowCount = Math.max(1, lines.length - 1);
  // 0 = nothing filled, rowCount = every row solid. Overshoot so the last frame settles.
  const waterline = fillEase * (rowCount + 1);

  return lines
    .map((line, row) => {
      const fromBottom = rowCount - row;
      // >1 solid, 0..1 waterline row (half block), <=0 empty (outline only).
      const depth = waterline - fromBottom;

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

        const stop = sampleStops(width > 1 ? column / (width - 1) : 0);
        let glyph = character;
        let color: RGB = neutral;

        if (isFullBlock(character)) {
          if (depth <= 0) {
            if (pen) {
              out += reset;
              pen = "";
            }
            out += " ";
            continue;
          }
          if (depth < 1) {
            glyph = waterlineGlyph;
            color = mix(neutral, stop, 0.55);
          } else {
            glyph = "\u2588";
            color = stop;
          }
        } else {
          // Outline stays grey until the waterline has passed, then settles.
          color = depth > 0 ? mix(neutral, stop, Math.min(1, depth)) : neutral;
        }

        const next = fg(color);
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
    frames.push(renderInk(lines, titleWidth, frame));
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
