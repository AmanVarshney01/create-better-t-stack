"use client";

import { useTheme } from "next-themes";
import { useEffect, useId, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export type PlotPalette = {
  background: string;
  foreground: string;
  muted: string;
  border: string;
  primary: string;
  accent: string;
  chart1: string;
  chart2: string;
  chart3: string;
  chart4: string;
  chart5: string;
};

export type PlotContext = {
  id: string;
  width: number;
  palette: PlotPalette;
};

function readPlotPalette(element: HTMLElement): PlotPalette {
  const styles = getComputedStyle(element);

  const get = (name: string, fallback: string) => styles.getPropertyValue(name).trim() || fallback;

  return {
    background: get("--background", "#11111b"),
    foreground: get("--foreground", "#cdd6f4"),
    muted: get("--muted-foreground", "#a6adc8"),
    border: get("--border", "#45475a"),
    primary: get("--primary", "#cba6f7"),
    accent: get("--accent", "#b4befe"),
    chart1: get("--chart-1", "#cba6f7"),
    chart2: get("--chart-2", "#4ade80"),
    chart3: get("--chart-3", "#fbbf24"),
    chart4: get("--chart-4", "#fb7185"),
    chart5: get("--chart-5", "#38bdf8"),
  };
}

export function PlotChart({
  ariaLabel,
  className,
  build,
}: {
  ariaLabel: string;
  className?: string;
  build: (context: PlotContext) => HTMLElement | SVGElement;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const id = useId();
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const observer = new ResizeObserver(([entry]) => {
      setWidth(Math.floor(entry.contentRect.width));
    });

    observer.observe(frame);
    setWidth(Math.floor(frame.getBoundingClientRect().width));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const frame = frameRef.current;
    const mount = mountRef.current;
    if (!frame || !mount || width < 180) return;

    // Keep build stable when parent state changes frequently so we do not rebuild
    // the same Plot instance on every render.
    const plot = build({
      id,
      width,
      palette: readPlotPalette(frame),
    });

    plot.classList.add("bts-plot");
    plot.setAttribute("aria-label", ariaLabel);
    plot.setAttribute("role", "img");
    mount.replaceChildren(plot);

    return () => {
      plot.remove();
    };
  }, [ariaLabel, build, id, resolvedTheme, width]);

  return (
    <div ref={frameRef} className={cn("plot-frame w-full", className)}>
      <div ref={mountRef} className="min-h-[160px] w-full" />
    </div>
  );
}
