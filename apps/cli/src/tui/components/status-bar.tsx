import { theme } from "../theme";

type Phase = "prompts" | "creating" | "done";

// Version from package.json
const VERSION = "3.11.0";

export function StatusBar(props: { phase: Phase; canGoBack: boolean }) {
  const keybinds = () => {
    switch (props.phase) {
      case "prompts":
        return (
          <>
            <span fg={theme.muted}>↑↓</span>
            <span fg={theme.subtext}> navigate </span>
            <span fg={theme.muted}>⏎</span>
            <span fg={theme.subtext}> select </span>
            {props.canGoBack && (
              <>
                <span fg={theme.muted}>esc</span>
                <span fg={theme.subtext}> back </span>
              </>
            )}
            <span fg={theme.muted}>ctrl+c</span>
            <span fg={theme.subtext}> exit</span>
          </>
        );
      case "creating":
        return (
          <>
            <span fg={theme.muted}>ctrl+c</span>
            <span fg={theme.subtext}> cancel</span>
          </>
        );
      case "done":
        return (
          <>
            <span fg={theme.muted}>any key</span>
            <span fg={theme.subtext}> exit</span>
          </>
        );
    }
  };

  return (
    <box
      style={{
        height: 1,
        backgroundColor: theme.surface,
        paddingLeft: 2,
        paddingRight: 2,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <text>
        <span fg={theme.muted}>v{VERSION}</span>
      </text>
      <text>{keybinds()}</text>
      <text>
        <span fg={theme.primary}>better-t-stack.dev</span>
      </text>
    </box>
  );
}

export type { Phase };
