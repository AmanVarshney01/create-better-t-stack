import { useState } from "react";
import { useKeyboard } from "@opentui/react";
import { theme } from "../../theme";

export function InputPrompt(props: {
  onSubmit: (v: string) => void;
  onBack?: () => void;
  placeholder?: string;
}) {
  useKeyboard((key) => {
    if (key.name === "escape" && props.onBack) props.onBack();
  });

  return (
    <box style={{ flexDirection: "column", paddingLeft: 2 }}>
      <box
        style={{
          border: true,
          borderColor: theme.border,
          height: 3,
          width: 40,
          backgroundColor: theme.surface,
        }}
      >
        <input
          placeholder={props.placeholder || "my-app"}
          focused
          onSubmit={(v: string) => props.onSubmit(v || props.placeholder || "my-app")}
        />
      </box>
      <text>
        <span fg={theme.muted}>↵ confirm{props.onBack ? "  esc back" : ""}</span>
      </text>
    </box>
  );
}
