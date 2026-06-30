"use client";

import NumberFlow from "@number-flow/react";
import { AreaChart, Flame, Gauge, Radar, Sparkles, Sunrise } from "lucide-react";

import { EvilAreaChart } from "@/components/evilcharts/charts/area-chart";
import { EvilBarChart } from "@/components/evilcharts/charts/bar-chart";
import { cn } from "@/lib/utils";

import {
  formatCompactNumber,
  formatDateLabel,
  formatDelta,
  getTrendTone,
  shortenLabel,
} from "./analytics-helpers";
import { multiSeriesConfig, seriesConfig } from "./evil-chart-utils";
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
        "min-w-0 rounded border border-border bg-fd-background p-4",
        tone === "success" && "border-primary/25",
        tone === "warning" && "border-chart-3/25",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-[11px] text-muted-foreground uppercase tracking-wide">
          {label}
        </span>
        <span className="text-muted-foreground/80">{icon}</span>
      </div>
      <div className="mt-3 font-semibold text-2xl">{value}</div>
      <p className="mt-2 text-muted-foreground text-xs leading-5">{detail}</p>
    </div>
  );
}

export function MetricsCards({ data }: { data: AggregatedAnalyticsData }) {
  const momentumTone = getTrendTone(data.momentum.deltaPercentage);
  const sparklineData = (
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
        ]
  ).map((point) => ({
    day: formatDateLabel(point.date),
    projects: point.count,
    average: Number(point.rollingAverage.toFixed(2)),
  }));

  const leadingChoices = [
    { category: "Frontend", item: data.frontendDistribution[0] },
    { category: "Backend", item: data.backendDistribution[0] },
    { category: "Database", item: data.databaseDistribution[0] },
    { category: "ORM", item: data.ormDistribution[0] },
    { category: "Runtime", item: data.runtimeDistribution[0] },
    {
      category: "Packages",
      item: data.packageManagerDistribution[0],
    },
  ].map(({ category, item }) => ({
    choice: `${category} · ${shortenLabel(item?.name ?? "n/a", 18)}`,
    setups: item?.value ?? 0,
  }));
  const momentumComparison = [
    { window: "Last 7 days", projects: data.momentum.last7Days },
    { window: "Previous 7 days", projects: data.momentum.previous7Days },
  ];

  const trendConfig = multiSeriesConfig([
    { key: "projects", label: "Projects", tone: "blue" },
    { key: "average", label: "7 day average", tone: "teal" },
  ]);
  const leadingChoicesConfig = seriesConfig("setups", "Tracked setups", "violet");
  const momentumComparisonConfig = seriesConfig("projects", "Projects", "amber");

  return (
    <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)] xl:items-start">
      <div className="grid min-w-0 gap-4">
        <section className="min-w-0 overflow-hidden rounded border border-border bg-fd-background p-4 sm:p-5">
          <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(220px,0.36fr)_minmax(0,0.64fr)] xl:items-center">
            <div className="min-w-0 space-y-5">
              <div className="space-y-2">
                <div className="font-mono text-[11px] text-muted-foreground uppercase tracking-wide">
                  Convex total
                </div>
                <NumberFlow
                  value={data.totalProjects}
                  className="block font-semibold text-4xl sm:text-5xl"
                  transformTiming={{ duration: 850, easing: "ease-out" }}
                  willChange
                  isolate
                />
                <p className="max-w-md text-muted-foreground text-sm leading-6">
                  Live project starts in the current telemetry dataset.
                </p>
              </div>

              <div className="grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                <div className="min-w-0 rounded border border-border p-3">
                  <div className="font-mono text-[11px] text-muted-foreground uppercase tracking-wide">
                    Average per day
                  </div>
                  <div className="mt-2 font-semibold text-2xl">
                    {data.avgProjectsPerDay.toFixed(1)}
                  </div>
                </div>
                <div className="min-w-0 rounded border border-border p-3">
                  <div className="font-mono text-[11px] text-muted-foreground uppercase tracking-wide">
                    Leading pair
                  </div>
                  <div className="mt-2 font-medium text-base">
                    {shortenLabel(data.summary.topStack, 24)}
                  </div>
                </div>
              </div>
            </div>

            <EvilAreaChart
              className="h-[310px] min-w-0 w-full p-1"
              xDataKey="day"
              yDataKey="projects"
              data={sparklineData}
              chartConfig={trendConfig}
              curveType="monotone"
              areaVariant="gradient"
              strokeVariant="animated-dashed"
              activeDotVariant="colored-border"
              dotVariant="border"
              legendVariant="horizontal-bar"
              tooltipVariant="frosted-glass"
              tooltipRoundness="md"
              backgroundVariant="grid"
              xAxisProps={{
                interval: "preserveStartEnd",
                tickFormatter: (value) => String(value),
              }}
              yAxisProps={{
                tickFormatter: (value) => formatCompactNumber(Number(value)),
              }}
            />
          </div>
        </section>

        <div className="grid min-w-0 gap-4 md:grid-cols-2">
          <MetricTile
            label="7 day momentum"
            value={formatDelta(data.momentum.deltaPercentage)}
            detail={`${formatCompactNumber(data.momentum.last7Days)} projects in the last 7 days versus ${formatCompactNumber(data.momentum.previous7Days)} in the previous window.`}
            icon={<Gauge className="h-4 w-4" />}
            tone={
              momentumTone === "up" ? "success" : momentumTone === "down" ? "warning" : "default"
            }
          />

          <MetricTile
            label="Active days"
            value={`${data.momentum.activeDaysLast30}/30`}
            detail="Days in the last month with at least one tracked project creation."
            icon={<AreaChart className="h-4 w-4" />}
          />

          <MetricTile
            label="Peak day"
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
            label="Busiest hour"
            value={data.momentum.busiestHour?.hour.replace(":00", "") ?? "--"}
            detail={
              data.momentum.busiestHour
                ? `${formatCompactNumber(data.momentum.busiestHour.count)} projects kicked off during this UTC hour.`
                : "Hour-of-day activity appears once events begin arriving."
            }
            icon={<Sunrise className="h-4 w-4" />}
          />

          <MetricTile
            label="Leading choices"
            value={shortenLabel(
              `${data.summary.mostPopularFrontend} / ${data.summary.mostPopularBackend}`,
              24,
            )}
            detail={`${data.summary.mostPopularDatabase} leads database choices, and ${data.summary.mostPopularORM} leads ORM picks.`}
            icon={<Sparkles className="h-4 w-4" />}
          />

          <MetricTile
            label="Runtime + package"
            value={shortenLabel(
              `${data.summary.mostPopularRuntime} / ${data.summary.mostPopularPackageManager}`,
              24,
            )}
            detail="Top runtime and package-manager choices across tracked project setups."
            icon={<Radar className="h-4 w-4" />}
          />
        </div>
      </div>

      <div className="grid min-w-0 gap-4">
        <section className="min-w-0 overflow-hidden rounded border border-border bg-fd-background p-4 sm:p-5">
          <div className="space-y-1.5">
            <h3 className="font-semibold text-sm sm:text-base">Leading choices</h3>
            <p className="text-muted-foreground text-sm leading-6">
              The top selected option in each major category, shown by tracked setup count.
            </p>
          </div>
          <EvilBarChart
            className="mt-3 h-[290px] min-w-0 w-full p-1"
            data={leadingChoices}
            xDataKey="choice"
            yDataKey="setups"
            chartConfig={leadingChoicesConfig}
            layout="horizontal"
            barVariant="default"
            barRadius={5}
            hideLegend
            enableHoverHighlight
            tooltipVariant="frosted-glass"
            tooltipRoundness="md"
            backgroundVariant="grid"
            xAxisProps={{
              tickFormatter: (value) => formatCompactNumber(Number(value)),
            }}
          />
        </section>

        <section className="min-w-0 overflow-hidden rounded border border-border bg-fd-background p-4 sm:p-5">
          <div className="space-y-1.5">
            <h3 className="font-semibold text-sm sm:text-base">7 day comparison</h3>
            <p className="text-muted-foreground text-sm leading-6">
              Recent project starts compared with the previous 7 day window.
            </p>
          </div>
          <EvilBarChart
            className="mt-3 h-[220px] min-w-0 w-full p-1"
            data={momentumComparison}
            xDataKey="window"
            yDataKey="projects"
            chartConfig={momentumComparisonConfig}
            barVariant="default"
            barRadius={5}
            hideLegend
            enableHoverHighlight
            tooltipVariant="frosted-glass"
            tooltipRoundness="md"
            backgroundVariant="grid"
            yAxisProps={{
              tickFormatter: (value) => formatCompactNumber(Number(value)),
            }}
          />
        </section>
      </div>
    </div>
  );
}
