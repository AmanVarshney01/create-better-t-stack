"use client";

import NumberFlow from "@number-flow/react";
import * as Plot from "@observablehq/plot";
import { format } from "date-fns";
import { AreaChart, Flame, Gauge, Radar, Sparkles, Sunrise } from "lucide-react";

import { cn } from "@/lib/utils";

import {
  formatCompactNumber,
  formatDateLabel,
  formatDelta,
  getPlotFontSize,
  getTrendTone,
  isCompactPlot,
  resolvePlotMargins,
  shortenLabel,
} from "./analytics-helpers";
import { PlotChart } from "./plot-chart";
import type { AggregatedAnalyticsData } from "./types";

function MetricTile({
  label,
  value,
  detail,
  icon,
  tone = "default",
}: {
  label: string;
  value: string;
  detail: string;
  icon: React.ReactNode;
  tone?: "default" | "success" | "warning";
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[24px] border border-border/45 bg-fd-background/85 p-5",
        tone === "success" && "border-primary/25 bg-primary/[0.08]",
        tone === "warning" && "border-chart-3/25 bg-chart-3/[0.08]",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
          {label}
        </span>
        <span className="text-muted-foreground/80">{icon}</span>
      </div>
      <div className="mt-4 font-semibold text-2xl tracking-tight">{value}</div>
      <p className="mt-2 text-muted-foreground text-xs leading-5">{detail}</p>
    </div>
  );
}

export function MetricsCards({ data }: { data: AggregatedAnalyticsData }) {
  const momentumTone = getTrendTone(data.momentum.deltaPercentage);
  const sparklineData =
    data.timeSeries.length > 0
      ? data.timeSeries
      : [
          {
            dateValue: new Date(),
            count: 0,
            rollingAverage: 0,
            cumulativeProjects: 0,
            date: new Date().toISOString().slice(0, 10),
          },
        ];

  return (
    <div className="space-y-4">
      <section className="rounded-xl bg-fd-background/85 p-5 ring-1 ring-border/35 sm:p-6">
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-muted/30 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              overview
            </span>
            <span className="inline-flex items-center rounded-full bg-muted/30 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              live trendline
            </span>
          </div>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] xl:items-start">
            <div className="space-y-5">
              <div className="space-y-2">
                <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                  Convex total
                </div>
                <NumberFlow
                  value={data.totalProjects}
                  className="block font-semibold text-5xl tracking-tight sm:text-6xl"
                  transformTiming={{ duration: 850, easing: "ease-out" }}
                  willChange
                  isolate
                />
                <p className="max-w-lg text-muted-foreground text-sm leading-6">
                  The live total of tracked project creations in the current telemetry dataset.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg bg-muted/20 p-4">
                  <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                    average per day
                  </div>
                  <div className="mt-2 font-semibold text-2xl tracking-tight">
                    {data.avgProjectsPerDay.toFixed(1)}
                  </div>
                </div>
                <div className="rounded-lg bg-muted/20 p-4">
                  <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                    leading pair
                  </div>
                  <div className="mt-2 font-medium text-base tracking-tight">
                    {shortenLabel(data.summary.topStack, 24)}
                  </div>
                  <p className="mt-2 text-muted-foreground text-xs">
                    Most common backend + frontend pairing
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-muted/20 p-4">
              <PlotChart
                ariaLabel="Recent daily project activity and rolling average"
                className="min-h-[280px]"
                build={({ width, palette }) => {
                  const compact = isCompactPlot(width);
                  const margins = resolvePlotMargins(
                    width,
                    { top: 18, right: 18, bottom: 32, left: 46 },
                    { top: 12, right: 10, bottom: 24, left: 32 },
                  );

                  return Plot.plot({
                    width,
                    height: compact ? 230 : 280,
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
                      ticks: compact ? 3 : 4,
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
                      Plot.areaY(sparklineData, {
                        x: "dateValue",
                        y: "count",
                        curve: "catmull-rom",
                        fill: palette.chart1,
                        fillOpacity: 0.18,
                      }),
                      Plot.lineY(sparklineData, {
                        x: "dateValue",
                        y: "count",
                        curve: "catmull-rom",
                        stroke: palette.chart1,
                        strokeWidth: 2.3,
                      }),
                      Plot.lineY(sparklineData, {
                        x: "dateValue",
                        y: "rollingAverage",
                        curve: "catmull-rom",
                        stroke: palette.chart2,
                        strokeWidth: 2,
                      }),
                      Plot.dot(sparklineData.slice(-1), {
                        x: "dateValue",
                        y: "count",
                        fill: palette.chart1,
                        r: 4,
                      }),
                      Plot.tip(
                        sparklineData,
                        Plot.pointerX({
                          x: "dateValue",
                          y: "count",
                          title: (point) =>
                            `${formatDateLabel(point.date)}\nProjects: ${point.count}\n7d avg: ${point.rollingAverage.toFixed(1)}`,
                        }),
                      ),
                    ],
                  });
                }}
              />
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <MetricTile
          label="7 day momentum"
          value={formatDelta(data.momentum.deltaPercentage)}
          detail={`${formatCompactNumber(data.momentum.last7Days)} projects in the last 7 days versus ${formatCompactNumber(data.momentum.previous7Days)} in the previous window.`}
          icon={<Gauge className="h-4 w-4" />}
          tone={momentumTone === "up" ? "success" : momentumTone === "down" ? "warning" : "default"}
        />

        <MetricTile
          label="active days"
          value={`${data.momentum.activeDaysLast30}/30`}
          detail="Days in the last month with at least one tracked project creation."
          icon={<AreaChart className="h-4 w-4" />}
        />

        <MetricTile
          label="peak day"
          value={data.momentum.peakDay ? formatCompactNumber(data.momentum.peakDay.count) : "0"}
          detail={
            data.momentum.peakDay
              ? `Highest daily volume landed on ${formatDateLabel(data.momentum.peakDay.date)}.`
              : "Waiting for enough activity to identify a peak."
          }
          icon={<Flame className="h-4 w-4" />}
          tone="warning"
        />

        <MetricTile
          label="busiest hour"
          value={data.momentum.busiestHour?.hour.replace(":00", "") ?? "--"}
          detail={
            data.momentum.busiestHour
              ? `${formatCompactNumber(data.momentum.busiestHour.count)} projects kicked off during this UTC hour.`
              : "Hour-of-day activity appears once events begin arriving."
          }
          icon={<Sunrise className="h-4 w-4" />}
        />

        <MetricTile
          label="leading choices"
          value={shortenLabel(
            `${data.summary.mostPopularFrontend} / ${data.summary.mostPopularBackend}`,
            24,
          )}
          detail={`${data.summary.mostPopularDatabase} leads database choices, and ${data.summary.mostPopularORM} leads ORM picks.`}
          icon={<Sparkles className="h-4 w-4" />}
        />

        <MetricTile
          label="runtime + package"
          value={shortenLabel(
            `${data.summary.mostPopularRuntime} / ${data.summary.mostPopularPackageManager}`,
            24,
          )}
          detail="Top runtime and package-manager choices across tracked project setups."
          icon={<Radar className="h-4 w-4" />}
        />
      </div>
    </div>
  );
}
