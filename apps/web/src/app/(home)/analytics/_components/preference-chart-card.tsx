"use client";

import { cn } from "@/lib/utils";

import { buildCompactCategoryLabels, formatCount, formatPercent } from "./analytics-helpers";
import {
  CategoryBarChart,
  resolveLabelCharBudget,
  resolveLabelGutter,
  useContainerWidth,
} from "./bklit-charts";
import { ChartCard } from "./chart-card";
import type { ShareDistributionItem } from "./types";

function chunkItems<T>(items: T[], chunkCount: number) {
  if (chunkCount <= 1 || items.length === 0) return [items];
  const chunks = Array.from({ length: Math.min(chunkCount, items.length) }, () => [] as T[]);

  items.forEach((item, index) => {
    chunks[index % chunks.length]?.push(item);
  });

  return chunks.filter((chunk) => chunk.length > 0);
}

/**
 * One ranked column. Measures itself so the category labels are shortened to
 * what actually fits the gutter (middle ellipsis keeps the distinguishing tail)
 * instead of being clipped by CSS.
 */
function PreferenceChartColumn({
  items,
  color,
  layout,
  labelWidth,
  compactLabelLength,
  className,
}: {
  items: ShareDistributionItem[];
  color: string;
  layout: "horizontal" | "vertical";
  labelWidth: number;
  compactLabelLength: number;
  className?: string;
}) {
  const [containerRef, containerWidth] = useContainerWidth();
  const maxLabelLength =
    layout === "horizontal"
      ? Math.min(
          compactLabelLength,
          resolveLabelCharBudget(resolveLabelGutter(containerWidth, labelWidth)),
        )
      : compactLabelLength;

  const labels = buildCompactCategoryLabels(
    items.map((item) => item.name),
    maxLabelLength,
  );
  const chartData = items.map((item, itemIndex) => ({
    label: labels[itemIndex] ?? item.name,
    value: item.value,
    fullName: item.name,
    formatted: `${formatCount(item.value)} (${formatPercent(item.share)})`,
  }));
  const height =
    layout === "horizontal"
      ? Math.max(180, chartData.length * 30 + 48)
      : Math.max(240, chartData.length * 18 + 220);

  return (
    <div className={cn("min-w-0 overflow-hidden", className)} ref={containerRef}>
      <CategoryBarChart
        data={chartData}
        xKey="label"
        orientation={layout}
        height={height}
        labelWidth={labelWidth}
        series={[{ key: "value", label: "Tracked setups", color }]}
        tooltipLabelKey="fullName"
        tooltipValueKey="formatted"
      />
    </div>
  );
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

const colorByKey: Record<NonNullable<PreferenceChartCardProps["colorKey"]>, string> = {
  chart1: "var(--chart-1)",
  chart2: "var(--chart-2)",
  chart3: "var(--chart-3)",
  chart4: "var(--chart-4)",
  chart5: "var(--chart-5)",
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
  const color = colorByKey[colorKey];
  const labelWidth = columnCount >= 3 ? 70 : columnCount === 2 ? 96 : 120;
  const compactLabelLength =
    layout === "horizontal" ? (columnCount >= 3 ? 11 : columnCount === 2 ? 16 : 22) : 12;

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
      {chunks.map((chunk, index) => (
        <PreferenceChartColumn
          className={chartClassName}
          color={color}
          compactLabelLength={compactLabelLength}
          items={chunk}
          key={`${title}-${index}`}
          labelWidth={labelWidth}
          layout={layout}
        />
      ))}
    </ChartCard>
  );
}
