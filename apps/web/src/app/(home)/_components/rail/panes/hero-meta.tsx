"use client";

import { useEffect, useState } from "react";

import { useRail } from "../rail-context";

const HINT_KEY = "bts-rail-hint-dismissed";

export default function HeroMeta() {
  const { activeIndex } = useRail();
  const [hintDismissed, setHintDismissed] = useState(true);

  useEffect(() => {
    setHintDismissed(window.localStorage.getItem(HINT_KEY) === "1");
  }, []);

  useEffect(() => {
    if (activeIndex > 0) {
      window.localStorage.setItem(HINT_KEY, "1");
      setHintDismissed(true);
    }
  }, [activeIndex]);

  if (hintDismissed) return null;

  return (
    <p className="font-mono text-[11px] text-fd-muted-foreground/70 uppercase tracking-[0.08em] max-md:hidden">
      use h/l or scroll to move
    </p>
  );
}
