import { useState } from "react";
import { useKeyboard } from "@opentui/react";
import { theme } from "../../theme";

export function SelectPrompt(props: {
  options: { name: string; value: string; hint?: string }[];
  initialValue?: string;
  onSelect: (v: string) => void;
  onBack?: () => void;
}) {
  // Find initial index based on initialValue, or default to 0
  const initialIndex = props.initialValue
    ? Math.max(
        0,
        props.options.findIndex((o) => o.value === props.initialValue),
      )
    : 0;
  const [i, setI] = useState(initialIndex);

  useKeyboard((key) => {
    if (key.name === "up" || key.name === "k") setI((x: number) => Math.max(0, x - 1));
    else if (key.name === "down" || key.name === "j")
      setI((x: number) => Math.min(props.options.length - 1, x + 1));
    else if (key.name === "return") props.onSelect(props.options[i].value);
    else if (key.name === "escape" && props.onBack) props.onBack();
  });

  return (
    <box style={{ flexDirection: "column", paddingLeft: 2 }}>
      {props.options.map((o, idx) => (
        <text key={o.value}>
          <span fg={idx === i ? theme.primary : theme.muted}>{idx === i ? "❯ " : "  "}</span>
          <span fg={idx === i ? theme.text : theme.subtext}>{o.name}</span>
          {o.hint && <span fg={theme.muted}> · {o.hint}</span>}
        </text>
      ))}
      <box style={{ marginTop: 1 }}>
        <text>
          <span fg={theme.muted}>↑↓ navigate ↵ select{props.onBack ? "  esc back" : ""}</span>
        </text>
      </box>
    </box>
  );
}
