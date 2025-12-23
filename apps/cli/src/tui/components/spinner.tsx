import { useState, useEffect } from "react";
import { theme } from "../theme";

export function Spinner(props: { text: string }) {
  const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((f: number) => (f + 1) % frames.length);
    }, 80);
    return () => clearInterval(interval);
  }, []);

  return (
    <text>
      <span fg={theme.primary}>{frames[frame]}</span>
      <span fg={theme.text}> {props.text}</span>
    </text>
  );
}
