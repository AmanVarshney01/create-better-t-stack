import { useState } from "react";
import { useKeyboard } from "@opentui/react";
import { theme } from "../../theme";

export function ConfirmStepPrompt(props: {
  label: string;
  hint?: string;
  onConfirm: () => void;
  onDeny: () => void;
  onBack?: () => void;
}) {
  const [yes, setYes] = useState(true);

  useKeyboard((key) => {
    if (key.name === "left" || key.name === "h") setYes(true);
    else if (key.name === "right" || key.name === "l") setYes(false);
    else if (key.name === "return") {
      if (yes) props.onConfirm();
      else props.onDeny();
    } else if (key.name === "escape" && props.onBack) props.onBack();
  });

  return (
    <box style={{ flexDirection: "column", paddingLeft: 2 }}>
      <text>
        <span fg={theme.text}>{props.label}</span>
        {props.hint && <span fg={theme.muted}> · {props.hint}</span>}
      </text>
      <box style={{ marginTop: 1 }}>
        <text>
          <span fg={yes ? theme.success : theme.muted}>{yes ? "● Yes" : "○ Yes"}</span>
          <span fg={theme.muted}> / </span>
          <span fg={!yes ? theme.error : theme.muted}>{!yes ? "● No" : "○ No"}</span>
        </text>
      </box>
      <box style={{ marginTop: 1 }}>
        <text>
          <span fg={theme.muted}>←→ toggle ↵ confirm{props.onBack ? "  esc back" : ""}</span>
        </text>
      </box>
    </box>
  );
}
