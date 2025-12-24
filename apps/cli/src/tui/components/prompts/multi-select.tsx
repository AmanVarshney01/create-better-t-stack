import { useState } from "react";
import { useKeyboard } from "@opentui/react";
import { theme } from "../../theme";

export function MultiSelectPrompt(props: {
  options: { name: string; value: string; hint?: string }[];
  selected: string[];
  onSubmit: (v: string[]) => void;
  onBack?: () => void;
}) {
  const [i, setI] = useState(0);
  const [sel, setSel] = useState<string[]>(props.selected);

  useKeyboard((key) => {
    if (key.name === "up" || key.name === "k") setI((x: number) => Math.max(0, x - 1));
    else if (key.name === "down" || key.name === "j")
      setI((x: number) => Math.min(props.options.length - 1, x + 1));
    else if (key.name === "space") {
      const v = props.options[i].value;
      setSel((s: string[]) => (s.includes(v) ? s.filter((x: string) => x !== v) : [...s, v]));
    } else if (key.name === "return") props.onSubmit(sel);
    else if (key.name === "escape" && props.onBack) props.onBack();
  });

  return (
    <box style={{ flexDirection: "column", paddingLeft: 2 }}>
      {props.options.map((o, idx) => (
        <text key={o.value}>
          <span fg={idx === i ? theme.primary : theme.muted}>{idx === i ? "❯ " : "  "}</span>
          <span fg={sel.includes(o.value) ? theme.success : theme.muted}>
            {sel.includes(o.value) ? "◉ " : "○ "}
          </span>
          <span fg={idx === i ? theme.text : theme.subtext}>{o.name}</span>
          {o.hint && <span fg={theme.muted}> · {o.hint}</span>}
        </text>
      ))}
      <box style={{ marginTop: 1 }}>
        <text>
          <span fg={theme.muted}>
            ↑↓ navigate space toggle ↵ confirm{props.onBack ? "  esc back" : ""}
          </span>
        </text>
      </box>
    </box>
  );
}
