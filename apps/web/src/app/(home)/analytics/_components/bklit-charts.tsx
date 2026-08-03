"use client";

import { curveLinear } from "@visx/curve";
import { useEffect, useRef, useState } from "react";

import { Area } from "@/components/charts/area";
import { AreaChart } from "@/components/charts/area-chart";
import { Bar } from "@/components/charts/bar";
import { BarChart } from "@/components/charts/bar-chart";
import { BarXAxis } from "@/components/charts/bar-x-axis";
import { BarYAxis } from "@/components/charts/bar-y-axis";
import { Grid } from "@/components/charts/grid";
import { ChartTooltip, type TooltipRow } from "@/components/charts/tooltip";
import { XAxis } from "@/components/charts/x-axis";

const ACCENT = "var(--chart-line-primary)";
const MUTED = "var(--chart-line-secondary)";
const GRID = "var(--color-fd-border)";

const compactNumber = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
}).format;

/** Geist Mono advance width at the 12px axis-label size. */
const MONO_CHAR_PX = 7.2;
/** Horizontal padding baked into the y-axis label gutter. */
const LABEL_GUTTER_PADDING = 14;
/** Ceiling for how much of a chart the category gutter may consume. */
const MAX_LABEL_GUTTER_RATIO = 0.45;
/** Breathing room between two neighbouring x-axis labels. */
const X_LABEL_GAP_PX = 6;
/** Left + right margin of a vertical (category-on-x) bar chart. */
const VERTICAL_MARGIN_X = 24;

/**
 * Clamps a requested category gutter so it never eats more than
 * `MAX_LABEL_GUTTER_RATIO` of a narrow chart. Only bites below ~360px wide.
 */
export function resolveLabelGutter(containerWidth: number, requested: number) {
  if (containerWidth <= 0) return requested;
  return Math.min(requested, Math.max(48, Math.round(containerWidth * MAX_LABEL_GUTTER_RATIO)));
}

/** How many monospace characters fit inside a resolved gutter. */
export function resolveLabelCharBudget(gutter: number) {
  return Math.max(6, Math.floor((gutter - LABEL_GUTTER_PADDING) / MONO_CHAR_PX));
}

/** Measures the rendered width of a chart shell so labels can respond to it. */
export function useContainerWidth() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new ResizeObserver((entries) => {
      const next = entries[0]?.contentRect.width ?? 0;
      setWidth((current) => (Math.abs(current - next) < 1 ? current : next));
    });
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return [ref, width] as const;
}

export type ChartSeries = {
  /** Numeric key in each data row. */
  key: string;
  /** Human label shown in the tooltip / legend. */
  label: string;
  /** Series color. Defaults to the site accent (muted for line series). */
  color?: string;
  /** Render as a stroke-only line instead of a filled area (area chart only). */
  line?: boolean;
};

type Row = Record<string, unknown>;

const num = (value: unknown) => Number(value ?? 0);

/**
 * Time-series area chart (x is a `Date`). Filled series plus optional overlay
 * lines. Styling comes from the shared `--chart-*` theme tokens.
 */
export function TrendAreaChart({
  data,
  series,
  xKey = "date",
  height = 300,
  valueFormat = compactNumber,
}: {
  data: Row[];
  series: ChartSeries[];
  xKey?: string;
  height?: number;
  valueFormat?: (value: number) => string;
}) {
  const rows = (point: Row): TooltipRow[] =>
    series.map((s) => ({
      color: s.color ?? (s.line ? MUTED : ACCENT),
      label: s.label,
      value: valueFormat(num(point[s.key])),
    }));

  return (
    <div className="min-w-0 font-mono tabular-nums" style={{ height }}>
      <AreaChart
        data={data}
        xDataKey={xKey}
        aspectRatio="auto"
        className="h-full w-full"
        margin={{ top: 16, right: 20, bottom: 28, left: 20 }}
        animationDuration={700}
      >
        <Grid horizontal stroke={GRID} strokeDasharray="2,4" />
        {series.map((s) => {
          const color = s.color ?? (s.line ? MUTED : ACCENT);
          return (
            <Area
              key={s.key}
              dataKey={s.key}
              fill={color}
              stroke={color}
              fillOpacity={s.line ? 0 : 0.12}
              strokeWidth={s.line ? 1 : 1.5}
              curve={curveLinear}
              showHighlight={false}
            />
          );
        })}
        <XAxis numTicks={5} />
        <ChartTooltip rows={rows} />
      </AreaChart>
    </div>
  );
}

/**
 * Categorical bar chart. `orientation="horizontal"` puts categories on the Y
 * axis (ranked lists); `"vertical"` puts them on the X axis (time buckets).
 */
export function CategoryBarChart({
  data,
  xKey,
  series,
  orientation = "vertical",
  height = 300,
  maxLabels = 12,
  labelWidth = 120,
  valueFormat = compactNumber,
  tooltipLabelKey,
  tooltipValueKey,
}: {
  data: Row[];
  xKey: string;
  series: ChartSeries[];
  orientation?: "vertical" | "horizontal";
  height?: number;
  maxLabels?: number;
  /** Left gutter (px) reserved for category names when `orientation="horizontal"`. */
  labelWidth?: number;
  valueFormat?: (value: number) => string;
  /** Row field holding the full display name for the tooltip (defaults to `xKey`). */
  tooltipLabelKey?: string;
  /** Row field holding a preformatted value string (e.g. "1,234 (12%)"). */
  tooltipValueKey?: string;
}) {
  const horizontal = orientation === "horizontal";
  const [containerRef, containerWidth] = useContainerWidth();
  const gutter = resolveLabelGutter(containerWidth, labelWidth);

  const longestLabel = data.reduce(
    (longest, row) => Math.max(longest, String(row[xKey] ?? "").length),
    0,
  );
  const perLabelPx = longestLabel * MONO_CHAR_PX + X_LABEL_GAP_PX;
  const plotWidth = containerWidth - VERTICAL_MARGIN_X;
  const fittedMaxLabels =
    containerWidth > 0 && longestLabel > 0
      ? Math.max(2, Math.floor(plotWidth / perLabelPx))
      : maxLabels;

  const rows = (point: Row): TooltipRow[] => {
    if (series.length === 1) {
      const s = series[0];
      return [
        {
          color: s.color ?? ACCENT,
          label: String(point[tooltipLabelKey ?? xKey] ?? s.label),
          value: tooltipValueKey
            ? String(point[tooltipValueKey] ?? "")
            : valueFormat(num(point[s.key])),
        },
      ];
    }
    return series.map((s) => ({
      color: s.color ?? ACCENT,
      label: s.label,
      value: valueFormat(num(point[s.key])),
    }));
  };

  return (
    <div className="min-w-0 font-mono tabular-nums" ref={containerRef} style={{ height }}>
      <BarChart
        data={data}
        xDataKey={xKey}
        orientation={orientation}
        aspectRatio="auto"
        className="h-full w-full"
        margin={
          horizontal
            ? { top: 8, right: 16, bottom: 8, left: gutter }
            : { top: 16, right: 12, bottom: 28, left: 12 }
        }
        animationDuration={700}
      >
        <Grid horizontal={!horizontal} vertical={horizontal} stroke={GRID} strokeDasharray="2,4" />
        {series.map((s) => (
          <Bar key={s.key} dataKey={s.key} fill={s.color ?? ACCENT} lineCap={4} />
        ))}
        {horizontal ? <BarYAxis /> : <BarXAxis maxLabels={Math.min(maxLabels, fittedMaxLabels)} />}
        <ChartTooltip showDatePill={false} showCrosshair={false} rows={rows} />
      </BarChart>
    </div>
  );
}
