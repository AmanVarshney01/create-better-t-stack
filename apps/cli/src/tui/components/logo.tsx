import { useTerminalDimensions } from "@opentui/react";
import { theme, GRADIENT_COLORS } from "../theme";

// Custom ASCII art logo - split into two parts for responsive layout
const LOGO_BETTER = [
  " ██████╗ ███████╗████████╗████████╗███████╗██████╗ ",
  " ██╔══██╗██╔════╝╚══██╔══╝╚══██╔══╝██╔════╝██╔══██╗",
  " ██████╔╝█████╗     ██║      ██║   █████╗  ██████╔╝",
  " ██╔══██╗██╔══╝     ██║      ██║   ██╔══╝  ██╔══██╗",
  " ██████╔╝███████╗   ██║      ██║   ███████╗██║  ██║",
  " ╚═════╝ ╚══════╝   ╚═╝      ╚═╝   ╚══════╝╚═╝  ╚═╝",
];

const LOGO_T_STACK = [
  " ████████╗    ███████╗████████╗ █████╗  ██████╗██╗  ██╗",
  " ╚══██╔══╝    ██╔════╝╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝",
  "    ██║       ███████╗   ██║   ███████║██║     █████╔╝ ",
  "    ██║       ╚════██║   ██║   ██╔══██║██║     ██╔═██╗ ",
  "    ██║       ███████║   ██║   ██║  ██║╚██████╗██║  ██╗",
  "    ╚═╝       ╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝",
];

const LOGO_TEXT = "Better T Stack";

export function Logo() {
  const { width } = useTerminalDimensions();

  // Full width: show both parts side by side (needs ~108 cols)
  if (width >= 110) {
    return (
      <box style={{ flexDirection: "column" }}>
        {LOGO_BETTER.map((line, i) => (
          <text key={i}>
            <span fg={GRADIENT_COLORS[i]}>{line}</span>
            <span fg={GRADIENT_COLORS[i]}> </span>
            <span fg={GRADIENT_COLORS[i]}>{LOGO_T_STACK[i]}</span>
          </text>
        ))}
      </box>
    );
  }

  // Medium width: show stacked vertically (needs ~58 cols)
  if (width >= 58) {
    return (
      <box style={{ flexDirection: "column" }}>
        {LOGO_BETTER.map((line, i) => (
          <text key={`b${i}`}>
            <span fg={GRADIENT_COLORS[i]}>{line}</span>
          </text>
        ))}
        <text> </text>
        {LOGO_T_STACK.map((line, i) => (
          <text key={`t${i}`}>
            <span fg={GRADIENT_COLORS[i]}>{line}</span>
          </text>
        ))}
      </box>
    );
  }

  // Narrow: plain text with gradient first color
  return (
    <text>
      <span fg={GRADIENT_COLORS[0]}>{LOGO_TEXT}</span>
    </text>
  );
}
