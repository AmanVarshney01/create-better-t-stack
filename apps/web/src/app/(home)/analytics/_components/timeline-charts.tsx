"use client";

import * as Plot from "@observablehq/plot";
import { format } from "date-fns";

import {
  formatCompactNumber,
  formatDateLabel,
  formatHourLabel,
  formatMonthLabel,
  getPlotFontSize,
  interpolateColor,
  isCompactPlot,
  resolvePlotMargins,
} from "./analytics-helpers";
import { ChartCard } from "./chart-card";
import { PlotChart } from "./plot-chart";
import { SectionHeader } from "./section-header";
import type { AggregatedAnalyticsData } from "./types";

export function TimelineSection({ data }: { data: AggregatedAnalyticsData }) {
  const peakDayLabel = data.momentum.peakDay ? formatDateLabel(data.momentum.peakDay.date) : "n/a";
  const busiestHourLabel = data.momentum.busiestHour
    ? `${formatHourLabel(data.momentum.busiestHour.hour)} UTC`
    : "n/a";

  return (
    <div className="space-y-6">
      <SectionHeader
        label="Activity"
        title="How project creation volume changes over time."
        description="These charts show recent momentum, the longer monthly trend, weekday patterns, and the UTC hours when activity is most concentrated."
        aside={
          <div className="rounded-full border border-border/60 bg-background/55 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
            peak day {peakDayLabel} • hot hour {busiestHourLabel}
          </div>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[1.35fr_0.95fr]">
        <ChartCard
          title="Daily project starts over the last 30 days."
          description="The daily line shows raw activity, while the rolling average smooths out short-term noise."
          footer={
            <>
              Last 7 days:{" "}
              <span className="text-foreground">
                {formatCompactNumber(data.momentum.last7Days)}
              </span>
              {" • "}
              Previous 7 days:{" "}
              <span className="text-foreground">
                {formatCompactNumber(data.momentum.previous7Days)}
              </span>
            </>
          }
        >
          <PlotChart
            ariaLabel="Daily project creations over the last 30 days with a rolling average"
            className="min-h-[320px]"
            build={({ width, palette }) => {
              const compact = isCompactPlot(width);
              const margins = resolvePlotMargins(
                width,
                { top: 18, right: 18, bottom: 32, left: 44 },
                { top: 12, right: 8, bottom: 24, left: 30 },
              );

              return Plot.plot({
                width,
                height: compact ? 240 : 320,
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
                  label: null,
                  ticks: compact ? 3 : 5,
                  tickFormat: (value) => format(new Date(value as Date), "MMM d"),
                },
                y: {
                  label: null,
                  grid: true,
                  nice: true,
                  ticks: compact ? 3 : undefined,
                  tickFormat: (value) => formatCompactNumber(Number(value)),
                },
                marks: [
                  Plot.ruleY([0], { stroke: palette.border }),
                  Plot.areaY(data.timeSeries, {
                    x: "dateValue",
                    y: "count",
                    curve: "catmull-rom",
                    fill: palette.chart1,
                    fillOpacity: 0.16,
                  }),
                  Plot.lineY(data.timeSeries, {
                    x: "dateValue",
                    y: "count",
                    curve: "catmull-rom",
                    stroke: palette.chart1,
                    strokeWidth: 2.4,
                  }),
                  Plot.lineY(data.timeSeries, {
                    x: "dateValue",
                    y: "rollingAverage",
                    curve: "catmull-rom",
                    stroke: palette.chart2,
                    strokeWidth: 2.2,
                  }),
                  Plot.dot(data.timeSeries.slice(-1), {
                    x: "dateValue",
                    y: "count",
                    fill: palette.chart1,
                    r: 4,
                  }),
                  Plot.dot(
                    data.momentum.peakDay
                      ? data.timeSeries.filter(
                          (point) => point.date === data.momentum.peakDay?.date,
                        )
                      : [],
                    {
                      x: "dateValue",
                      y: "count",
                      fill: palette.chart3,
                      r: 4.5,
                    },
                  ),
                  Plot.tip(
                    data.timeSeries,
                    Plot.pointerX({
                      x: "dateValue",
                      y: "count",
                      title: (point) =>
                        `${formatDateLabel(point.date)}\nProjects: ${point.count}\nRolling avg: ${point.rollingAverage.toFixed(1)}`,
                    }),
                  ),
                ],
              });
            }}
          />
        </ChartCard>

        <ChartCard
          title="Monthly project starts across the tracked history."
          description="Use this to see which months contributed the most total activity."
          footer={
            <>
              Total live projects:{" "}
              <span className="text-foreground">{data.totalProjects.toLocaleString()}</span>
            </>
          }
        >
          <PlotChart
            ariaLabel="Monthly project creation totals"
            className="min-h-[320px]"
            build={({ width, palette }) => {
              const compact = isCompactPlot(width);
              const compactTickStep = width < 420 ? 3 : 2;
              const compactTicks = compact
                ? data.monthlyTimeSeries
                    .filter(
                      (_, index) =>
                        index % compactTickStep === 0 ||
                        index === data.monthlyTimeSeries.length - 1,
                    )
                    .map((point) => point.month)
                : undefined;
              const margins = resolvePlotMargins(
                width,
                { top: 18, right: 16, bottom: 42, left: 44 },
                { top: 12, right: 8, bottom: 28, left: 30 },
              );

              return Plot.plot({
                width,
                height: compact ? 240 : 320,
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
                  type: "band",
                  label: null,
                  ticks: compactTicks,
                  tickFormat: (value) =>
                    formatMonthLabel(String(value), compact ? "MMM yy" : "MMM yy"),
                },
                y: {
                  label: null,
                  grid: true,
                  nice: true,
                  ticks: compact ? 3 : undefined,
                  tickFormat: (value) => formatCompactNumber(Number(value)),
                },
                marks: [
                  Plot.ruleY([0], { stroke: palette.border }),
                  Plot.barY(data.monthlyTimeSeries, {
                    x: "month",
                    y: "totalProjects",
                    fill: palette.chart4,
                    rx: 4,
                    title: (point) =>
                      `${formatMonthLabel(point.month)}\nProjects: ${point.totalProjects.toLocaleString()}`,
                  }),
                ],
              });
            }}
          />
        </ChartCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard
          title="Average project starts by weekday over the last 30 days."
          description="Each bar shows the average for that weekday across the last month, including quieter days."
          footer={
            <>
              Active days in the last 30:{" "}
              <span className="text-foreground">{data.momentum.activeDaysLast30}</span>
            </>
          }
        >
          <PlotChart
            ariaLabel="Average project creations by weekday"
            className="min-h-[230px]"
            build={({ width, palette }) => {
              const compact = isCompactPlot(width);
              const margins = resolvePlotMargins(
                width,
                { top: 16, right: 16, bottom: 30, left: 44 },
                { top: 12, right: 8, bottom: 24, left: 30 },
              );

              return Plot.plot({
                width,
                height: compact ? 200 : 230,
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
                  label: null,
                },
                y: {
                  label: null,
                  grid: true,
                  ticks: compact ? 3 : undefined,
                  tickFormat: (value) => formatCompactNumber(Number(value)),
                },
                marks: [
                  Plot.ruleY([0], { stroke: palette.border }),
                  Plot.barY(data.weekdayDistribution, {
                    x: "shortLabel",
                    y: "averageDailyProjects",
                    fill: palette.chart2,
                    rx: 4,
                    title: (point) =>
                      `${point.weekday}\nAverage: ${point.averageDailyProjects.toFixed(1)}\nTotal: ${point.count.toLocaleString()}`,
                  }),
                ],
              });
            }}
          />
        </ChartCard>

        <ChartCard
          title="Project starts by hour of day in UTC."
          description="This shows when activity clusters during the day, with the busiest hour highlighted."
          footer={
            <>
              Busiest hour:{" "}
              <span className="text-foreground">
                {data.momentum.busiestHour
                  ? `${formatHourLabel(data.momentum.busiestHour.hour)} UTC`
                  : "n/a"}
              </span>
            </>
          }
        >
          <PlotChart
            ariaLabel="Hourly project creation activity by UTC hour"
            className="min-h-[230px]"
            build={({ width, palette }) => {
              const compact = isCompactPlot(width);
              const margins = resolvePlotMargins(
                width,
                { top: 18, right: 18, bottom: 36, left: 42 },
                { top: 12, right: 8, bottom: 28, left: 30 },
              );
              const maxCount = Math.max(...data.hourlyDistribution.map((point) => point.count), 0);
              const peakHour = data.momentum.busiestHour?.hour ?? null;
              const hourlyBars = data.hourlyDistribution.map((point) => ({
                ...point,
                tone:
                  point.count === 0
                    ? palette.background
                    : point.hour === peakHour
                      ? palette.chart4
                      : interpolateColor(
                          palette.border,
                          palette.chart3,
                          Math.max(0.2, point.count / maxCount),
                        ),
                isPeak: point.hour === peakHour,
              }));

              return Plot.plot({
                width,
                height: compact ? 210 : 230,
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
                  type: "band",
                  label: "UTC hour",
                  tickFormat: (value) => (compact && Number(value) % 2 === 1 ? "" : String(value)),
                },
                y: {
                  label: null,
                  grid: true,
                  nice: true,
                  ticks: compact ? 3 : 4,
                  tickFormat: (value) => formatCompactNumber(Number(value)),
                },
                marks: [
                  Plot.ruleY([0], { stroke: palette.border }),
                  Plot.barY(hourlyBars, {
                    x: "label",
                    y: "count",
                    fill: "tone",
                    inset: 1.5,
                    rx: 3,
                    title: (point) =>
                      `${formatHourLabel(point.hour)}:00 UTC\nProjects: ${point.count.toLocaleString()}`,
                  }),
                  Plot.text(
                    hourlyBars.filter((point) => point.isPeak && point.count > 0),
                    {
                      x: "label",
                      y: "count",
                      text: (point) => formatCompactNumber(point.count),
                      dy: -10,
                      fill: palette.foreground,
                      fontSize: compact ? 10 : 11,
                      fontWeight: 700,
                    },
                  ),
                ],
              });
            }}
          />
        </ChartCard>
      </div>
    </div>
  );
}
