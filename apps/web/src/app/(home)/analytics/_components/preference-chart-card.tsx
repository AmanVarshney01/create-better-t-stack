"use client";

import * as Plot from "@observablehq/plot";

import {
  buildCompactCategoryLabels,
  formatPercent,
  getPlotFontSize,
  isCompactPlot,
  resolvePlotMargins,
} from "./analytics-helpers";
import { ChartCard } from "./chart-card";
import { PlotChart } from "./plot-chart";
import type { ShareDistributionItem } from "./types";

type PreferenceChartCardProps = {
  eyebrow: string;
  title: string;
  description: string;
  data: ShareDistributionItem[];
  colorKey: "chart1" | "chart2" | "chart3" | "chart4" | "chart5";
  maxItems?: number;
};

export function PreferenceChartCard({
  eyebrow,
  title,
  description,
  data,
  colorKey,
  maxItems = 5,
}: PreferenceChartCardProps) {
  const ranking = data.slice(0, maxItems);

  return (
    <ChartCard eyebrow={eyebrow} title={title} description={description}>
      <PlotChart
        ariaLabel={title}
        className="min-h-[230px]"
        build={({ width, palette }) => {
          const compact = isCompactPlot(width);
          const shareMax = Math.max(...ranking.map((item) => item.share), 0.2);
          const fill = palette[colorKey];
          const compactLabels = compact
            ? buildCompactCategoryLabels(
                ranking.map((item) => item.name),
                width < 360 ? 10 : 12,
              )
            : null;
          const chartData = ranking.map((item, index) => ({
            ...item,
            label: compact ? (compactLabels?.[index] ?? item.name) : item.name,
          }));
          const margins = resolvePlotMargins(
            width,
            { top: 16, right: 48, bottom: 28, left: 128 },
            { top: 12, right: 42, bottom: 12, left: 92 },
          );

          return Plot.plot({
            width,
            height: compact
              ? Math.max(200, chartData.length * 30 + 28)
              : Math.max(220, chartData.length * 34 + 70),
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
              domain: [0, shareMax * (compact ? 1.34 : 1.22)],
              ticks: 4,
              grid: !compact,
              tickFormat: (value) => formatPercent(Number(value)),
            },
            y: {
              label: null,
            },
            marks: [
              Plot.barX(chartData, {
                x: "share",
                y: "label",
                fill,
                rx: 10,
                title: (item) =>
                  `${item.name}\nShare: ${formatPercent(item.share)}\nProjects: ${item.value.toLocaleString()}`,
              }),
              Plot.text(chartData, {
                x: "share",
                y: "label",
                text: (item) => formatPercent(item.share),
                dx: compact ? 6 : 8,
                textAnchor: "start",
                fill: palette.foreground,
                fontWeight: 600,
              }),
            ],
          });
        }}
      />
    </ChartCard>
  );
}
