"use client";

import { EvilBarChart } from "@/components/evilcharts/charts/bar-chart";
import { cn } from "@/lib/utils";

import {
  buildCompactCategoryLabels,
  formatCompactNumber,
  formatCount,
  formatPercent,
} from "./analytics-helpers";
import { ChartCard } from "./chart-card";
import { getTone, seriesConfig } from "./evil-chart-utils";
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
  colorKey?: "chart1" | "chart2" | "chart3" | "chart4" | "chart5";
  maxItems?: number;
  className?: string;
  chartClassName?: string;
  layout?: "horizontal" | "vertical";
  columnCount?: number;
  columnGridClassName?: string;
};

const colorToneOffset = {
  chart1: 0,
  chart2: 1,
  chart3: 2,
  chart4: 3,
  chart5: 4,
};

export function PreferenceChartCard({
  title,
  description,
  data,
  colorKey = "chart1",
  maxItems,
  className,
  chartClassName,
  layout = "horizontal",
  columnCount = 1,
  columnGridClassName,
}: PreferenceChartCardProps) {
  const ranking = typeof maxItems === "number" ? data.slice(0, maxItems) : data;
  const chunks = columnCount > 1 ? chunkItems(ranking, columnCount) : [ranking];
  const toneOffset = colorToneOffset[colorKey];

  return (
    <ChartCard
      title={title}
      description={description}
      className={className}
      contentClassName={
        chunks.length > 1
          ? cn(
              "grid min-w-0 gap-4",
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
      {chunks.map((chunk, index) => {
        const labels = buildCompactCategoryLabels(
          chunk.map((item) => item.name),
          layout === "horizontal" ? 22 : 12,
        );
        const chartData = chunk.map((item, itemIndex) => ({
          label: labels[itemIndex] ?? item.name,
          value: item.value,
          share: item.share,
          fullName: item.name,
          formatted: `${formatCount(item.value)} (${formatPercent(item.share)})`,
        }));
        const tone = getTone(toneOffset + index);
        const chartConfig = seriesConfig("value", "Tracked setups", tone);
        const height =
          layout === "horizontal"
            ? Math.max(240, chartData.length * 38 + 84)
            : Math.max(260, chartData.length * 18 + 240);

        return (
          <div
            key={`${title}-${index}`}
            className={cn("min-h-[220px] min-w-0 overflow-hidden", chartClassName)}
            style={{ height }}
          >
            <EvilBarChart
              className="h-full min-w-0 w-full p-1"
              data={chartData}
              chartConfig={chartConfig}
              xDataKey="label"
              yDataKey="value"
              layout={layout === "horizontal" ? "horizontal" : "vertical"}
              barVariant="default"
              barRadius={5}
              enableHoverHighlight
              glowingBars={["value"]}
              hideLegend
              tooltipVariant="frosted-glass"
              tooltipRoundness="md"
              backgroundVariant={layout === "horizontal" ? "dots" : "grid"}
              xAxisProps={{
                tickFormatter: (value) =>
                  layout === "horizontal" ? formatCompactNumber(Number(value)) : String(value),
              }}
              yAxisProps={{
                tickFormatter: (value) =>
                  layout === "horizontal" ? String(value) : formatCompactNumber(Number(value)),
              }}
            />
          </div>
        );
      })}
    </ChartCard>
  );
}
