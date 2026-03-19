"use client";

import * as Plot from "@observablehq/plot";

import { cn } from "@/lib/utils";

import {
  buildCompactCategoryLabels,
  formatCompactNumber,
  formatCount,
  formatPercent,
  getPlotFontSize,
  isCompactPlot,
  resolveHorizontalBarMargins,
} from "./analytics-helpers";
import { ChartCard } from "./chart-card";
import { PlotChart } from "./plot-chart";
import type { ShareDistributionItem } from "./types";

function chunkItems<T>(items: T[], chunkCount: number) {
  if (chunkCount <= 1 || items.length === 0) return [items];
  const chunks = Array.from({ length: Math.min(chunkCount, items.length) }, () => [] as T[]);

  items.forEach((item, index) => {
    chunks[index % chunks.length]?.push(item);
  });

  return chunks.filter((chunk) => chunk.length > 0);
}

type PreferenceChartCardProps = {
  title: string;
  description: string;
  data: ShareDistributionItem[];
  colorKey: "chart1" | "chart2" | "chart3" | "chart4" | "chart5";
  maxItems?: number;
  className?: string;
  chartClassName?: string;
  layout?: "horizontal" | "vertical";
  columnCount?: number;
  columnGridClassName?: string;
};

export function PreferenceChartCard({
  title,
  description,
  data,
  colorKey,
  maxItems,
  className,
  chartClassName,
  layout = "vertical",
  columnCount = 1,
  columnGridClassName,
}: PreferenceChartCardProps) {
  const ranking = typeof maxItems === "number" ? data.slice(0, maxItems) : data;
  const countMax = Math.max(...ranking.map((item) => item.value), 1);
  const chunks = columnCount > 1 ? chunkItems(ranking, columnCount) : [ranking];

  return (
    <ChartCard
      title={title}
      description={description}
      className={className}
      contentClassName={
        chunks.length > 1
          ? cn(
              "grid gap-4",
              columnGridClassName ??
                (layout === "horizontal"
                  ? columnCount >= 3
                    ? "xl:grid-cols-2 2xl:grid-cols-3"
                    : "xl:grid-cols-2"
                  : "xl:grid-cols-2"),
            )
          : undefined
      }
    >
      {layout === "vertical"
        ? chunks.map((chunk, index) => (
            <PlotChart
              key={`${title}-${index}`}
              ariaLabel={chunks.length > 1 ? `${title} segment ${index + 1}` : title}
              className={chartClassName ?? "min-h-[260px]"}
              build={({ width, palette }) => {
                const compact = isCompactPlot(width);
                const denseDesktop = !compact && chunk.length > 10;
                const compactLabels =
                  compact || denseDesktop
                    ? buildCompactCategoryLabels(
                        chunk.map((item) => item.name),
                        width < 360 ? 8 : denseDesktop ? 12 : 10,
                      )
                    : null;
                const chartData = chunk.map((item, itemIndex) => ({
                  ...item,
                  label: compact
                    ? (compactLabels?.[itemIndex] ?? item.name)
                    : (compactLabels?.[itemIndex] ?? item.name),
                }));
                const longestLabelLength = Math.max(
                  ...chartData.map((item) => item.label.length),
                  0,
                );
                const rotateTicks = chartData.length > 5 || longestLabelLength > 8;

                return Plot.plot({
                  width,
                  height: compact ? 220 : Math.max(260, 220 + chartData.length * 7),
                  marginTop: 20,
                  marginRight: compact ? 10 : 16,
                  marginBottom: rotateTicks ? (compact ? 64 : 82) : compact ? 36 : 44,
                  marginLeft: compact ? 32 : 40,
                  style: {
                    background: "transparent",
                    color: palette.foreground,
                    fontFamily: "var(--font-mono)",
                    fontSize: getPlotFontSize(width),
                  },
                  x: {
                    type: "band",
                    label: null,
                    tickRotate: rotateTicks ? -40 : 0,
                  },
                  y: {
                    label: null,
                    domain: [0, countMax * 1.14],
                    grid: true,
                    nice: true,
                    ticks: compact ? 3 : 4,
                    tickFormat: (value) => formatCompactNumber(Number(value)),
                  },
                  marks: [
                    Plot.ruleY([0], { stroke: palette.border }),
                    Plot.barY(chartData, {
                      x: "label",
                      y: "value",
                      fill: palette[colorKey],
                      rx: 4,
                      title: (item) =>
                        `${item.name}\nTracked setups: ${formatCount(item.value)}\nShare: ${formatPercent(item.share)}`,
                    }),
                    Plot.text(chartData, {
                      x: "label",
                      y: "value",
                      text: (item) => formatCompactNumber(item.value),
                      dy: -8,
                      fill: palette.foreground,
                      fontWeight: 600,
                    }),
                  ],
                });
              }}
            />
          ))
        : chunks.map((chunk, index) => (
            <PlotChart
              key={`${title}-${index}`}
              ariaLabel={chunks.length > 1 ? `${title} column ${index + 1}` : title}
              className={chartClassName ?? "min-h-[250px]"}
              build={({ width, palette }) => {
                const compact = isCompactPlot(width);
                const fill = palette[colorKey];
                const compactLabels = compact
                  ? buildCompactCategoryLabels(
                      chunk.map((item) => item.name),
                      width < 360 ? 10 : 12,
                    )
                  : null;
                const chartData = chunk.map((item, itemIndex) => ({
                  ...item,
                  label: compact ? (compactLabels?.[itemIndex] ?? item.name) : item.name,
                }));
                const longestLabelLength = Math.max(
                  ...chartData.map((item) => item.label.length),
                  0,
                );
                const longestValueLength = Math.max(
                  ...chartData.map((item) => formatCount(item.value).length),
                  1,
                );
                const margins = resolveHorizontalBarMargins({
                  width,
                  longestLabelLength,
                  longestValueLength,
                  desktop: { top: 16, right: 52, bottom: 28, left: 132 },
                  compact: { top: 12, right: 36, bottom: 12, left: 88 },
                });

                return Plot.plot({
                  width,
                  height: compact
                    ? Math.max(220, chartData.length * 32 + 28)
                    : Math.max(240, chartData.length * 38 + 68),
                  marginTop: margins.top,
                  marginRight: margins.right,
                  marginBottom: margins.bottom,
                  marginLeft: margins.left,
                  style: {
                    background: "transparent",
                    color: palette.foreground,
                    fontFamily: "var(--font-mono)",
                    fontSize: getPlotFontSize(width),
                  },
                  x: {
                    axis: compact ? null : undefined,
                    label: null,
                    domain: [0, countMax * (compact ? 1.28 : 1.18)],
                    ticks: 4,
                    grid: !compact,
                    tickFormat: (value) => formatCompactNumber(Number(value)),
                  },
                  y: {
                    label: null,
                  },
                  marks: [
                    Plot.barX(chartData, {
                      x: "value",
                      y: "label",
                      fill,
                      rx: 4,
                      title: (item) =>
                        `${item.name}\nTracked setups: ${formatCount(item.value)}\nShare: ${formatPercent(item.share)}`,
                    }),
                    Plot.text(chartData, {
                      x: "value",
                      y: "label",
                      text: (item) => formatCount(item.value),
                      dx: compact ? 6 : 8,
                      textAnchor: "start",
                      fill: palette.foreground,
                      fontWeight: 600,
                    }),
                  ],
                });
              }}
            />
          ))}
    </ChartCard>
  );
}
