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

/** The wordmark lands whole in this quiet grey; colour is the only motion. */
const NEUTRAL: RGB = [108, 112, 134];
/** Share of the timeline the mark holds in grey before colour begins. */
const HOLD = 0.15;
const FRAME_COUNT = 26;
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

function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3;
}

function renderStaticTitle(title: string): string {
  return titleGradient.multiline(title);
}

/** The finished wordmark, or plain text where colour is unsupported. */
function renderSettled(lines: string[], width: number): string {
  if (!pc.isColorSupported) return lines.join("\n");
  return renderFade(lines, width, 1);
}

/**
 * The whole wordmark at one point of the fade: every glyph present from the
 * first frame, colour interpolated uniformly from the neutral grey to each
 * column's gradient stop. Colour is the only thing that changes, matching the
 * site's rule that motion is a colour transition and nothing else.
 */
function renderFade(lines: string[], width: number, t: number): string {
  return lines
    .map((line) => {
      let out = "";
      let pen = "";

      for (let column = 0; column < line.length; column++) {
        const character = line[column];
        if (character === " ") {
          if (pen) {
            out += RESET;
            pen = "";
          }
          out += " ";
          continue;
        }

        const stop = sampleStops(width > 1 ? column / (width - 1) : 0);
        const next = fg(mix(NEUTRAL, stop, t));
        if (next !== pen) {
          out += next;
          pen = next;
        }
        out += character;
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

  const frames: string[] = [];
  for (let frame = 0; frame < FRAME_COUNT; frame++) {
    const linear = frame / (FRAME_COUNT - 1);
    const t = linear <= HOLD ? 0 : easeOutCubic((linear - HOLD) / (1 - HOLD));
    frames.push(renderFade(lines, titleWidth, t));
  }

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
