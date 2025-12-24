import { theme } from "../theme";
import type { LogEntry } from "../../utils/logger";

function getLogIcon(level: LogEntry["level"]) {
  switch (level) {
    case "info":
      return { icon: "◆", color: theme.primary };
    case "success":
      return { icon: "✓", color: theme.success };
    case "error":
      return { icon: "✗", color: theme.error };
    case "warn":
      return { icon: "⚠", color: "#f59e0b" };
    default:
      return { icon: "•", color: theme.muted };
  }
}

export function LogDisplay(props: { logs: LogEntry[] }) {
  const { logs } = props;

  return (
    <box style={{ flexDirection: "column" }}>
      {logs.slice(-15).map((log) => {
        const { icon, color } = getLogIcon(log.level);
        return (
          <text key={log.id}>
            <span fg={color}>{icon}</span>
            <span fg={theme.text}> {log.message}</span>
          </text>
        );
      })}
    </box>
  );
}
