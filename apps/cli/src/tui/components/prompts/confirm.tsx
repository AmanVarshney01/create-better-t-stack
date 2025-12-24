import { useState } from "react";
import { useKeyboard } from "@opentui/react";
import { theme } from "../../theme";

export function ConfirmPrompt(props: {
  onSubmit: (v: boolean) => void;
  onBack?: () => void;
  defaultValue?: boolean;
}) {
  const [yes, setYes] = useState(props.defaultValue ?? true);

  useKeyboard((key) => {
    if (key.name === "left" || key.name === "h") setYes(true);
    else if (key.name === "right" || key.name === "l") setYes(false);
    else if (key.name === "y") {
      setYes(true);
      props.onSubmit(true);
    } else if (key.name === "n") {
      setYes(false);
      props.onSubmit(false);
    } else if (key.name === "return") props.onSubmit(yes);
    else if (key.name === "escape" && props.onBack) props.onBack();
  });

  return (
    <box style={{ flexDirection: "column", paddingLeft: 2 }}>
      <text>
        <span fg={yes ? theme.success : theme.muted}>{yes ? "● Yes" : "○ Yes"}</span>
        <span fg={theme.muted}> / </span>
        <span fg={!yes ? theme.error : theme.muted}>{!yes ? "● No" : "○ No"}</span>
      </text>
      <box style={{ marginTop: 1 }}>
        <text>
          <span fg={theme.muted}>←→ toggle ↵ confirm{props.onBack ? "  esc back" : ""}</span>
        </text>
      </box>
    </box>
  );
}
