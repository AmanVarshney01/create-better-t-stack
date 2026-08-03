"use client";

import NumberFlow from "@number-flow/react";
import { AreaChart, Flame, Gauge, Radar, Sparkles, Sunrise } from "lucide-react";

import {
  formatCompactNumber,
  formatDateLabel,
  formatDelta,
  shortenLabel,
} from "./analytics-helpers";
import { CategoryBarChart, TrendAreaChart } from "./bklit-charts";
import { ChartCard } from "./chart-card";
import type { AggregatedAnalyticsData } from "./types";

function MetricTile({
  label,
  value,
  detail,
  icon,
}: {
  label: string;
  value: string;
  detail: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="min-w-0 border-t pt-3">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[11px] text-fd-muted-foreground uppercase tracking-[0.08em]">
          {label}
        </span>
        <span className="text-fd-muted-foreground/60">{icon}</span>
      </div>
      <div className="mt-2 font-medium text-[20px] tabular-nums tracking-[-0.02em]">{value}</div>
      <p className="mt-1.5 text-[11px] text-fd-muted-foreground leading-[1.5]">{detail}</p>
    </div>
  );
}

export function MetricsCards({ data }: { data: AggregatedAnalyticsData }) {
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
    date: point.dateValue,
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

  return (
    <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)] xl:items-start">
      <div className="grid min-w-0 gap-4">
        <section className="min-w-0 rounded-[4px] border p-4 sm:p-5">
          <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(220px,0.36fr)_minmax(0,0.64fr)] xl:items-center">
            <div className="min-w-0 space-y-5">
              <div className="space-y-2">
                <div className="text-[11px] text-fd-muted-foreground uppercase tracking-[0.08em]">
                  Convex total
                </div>
                <NumberFlow
                  value={data.totalProjects}
                  className="block font-medium text-[20px] tabular-nums tracking-[-0.02em]"
                  transformTiming={{ duration: 850, easing: "ease-out" }}
                  willChange
                  isolate
                />
                <p className="max-w-md text-[13px] text-fd-muted-foreground leading-[1.55]">
                  Live project starts in the current telemetry dataset.
                </p>
              </div>

              <div className="grid min-w-0 gap-x-6 gap-y-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                <div className="min-w-0 border-t pt-3">
                  <div className="text-[11px] text-fd-muted-foreground uppercase tracking-[0.08em]">
                    Average per day
                  </div>
                  <div className="mt-2 font-medium text-[20px] tabular-nums tracking-[-0.02em]">
                    {data.avgProjectsPerDay.toFixed(1)}
                  </div>
                </div>
                <div className="min-w-0 border-t pt-3">
                  <div className="text-[11px] text-fd-muted-foreground uppercase tracking-[0.08em]">
                    Leading pair
                  </div>
                  <div className="mt-2 text-[13px] leading-[1.55]">
                    {shortenLabel(data.summary.topStack, 24)}
                  </div>
                </div>
              </div>
            </div>

            <TrendAreaChart
              data={sparklineData}
              height={310}
              series={[
                { key: "projects", label: "Projects" },
                { key: "average", label: "7 day average", line: true },
              ]}
            />
          </div>
        </section>

        <div className="grid min-w-0 gap-x-6 gap-y-4 md:grid-cols-2">
          <MetricTile
            label="7 day momentum"
            value={formatDelta(data.momentum.deltaPercentage)}
            detail={`${formatCompactNumber(data.momentum.last7Days)} projects in the last 7 days versus ${formatCompactNumber(data.momentum.previous7Days)} in the previous window.`}
            icon={<Gauge className="h-3.5 w-3.5" />}
          />

          <MetricTile
            label="Active days"
            value={`${data.momentum.activeDaysLast30}/30`}
            detail="Days in the last month with at least one tracked project creation."
            icon={<AreaChart className="h-3.5 w-3.5" />}
          />

          <MetricTile
            label="Peak day"
            value={data.momentum.peakDay ? formatCompactNumber(data.momentum.peakDay.count) : "0"}
            detail={
              data.momentum.peakDay
                ? `Highest daily volume landed on ${formatDateLabel(data.momentum.peakDay.date)}.`
                : "Waiting for enough activity to identify a peak."
            }
            icon={<Flame className="h-3.5 w-3.5" />}
          />

          <MetricTile
            label="Busiest hour"
            value={data.momentum.busiestHour?.hour.replace(":00", "") ?? "--"}
            detail={
              data.momentum.busiestHour
                ? `${formatCompactNumber(data.momentum.busiestHour.count)} projects kicked off during this UTC hour.`
                : "Hour-of-day activity appears once events begin arriving."
            }
            icon={<Sunrise className="h-3.5 w-3.5" />}
          />

          <MetricTile
            label="Leading choices"
            value={shortenLabel(
              `${data.summary.mostPopularFrontend} / ${data.summary.mostPopularBackend}`,
              24,
            )}
            detail={`${data.summary.mostPopularDatabase} leads database choices, and ${data.summary.mostPopularORM} leads ORM picks.`}
            icon={<Sparkles className="h-3.5 w-3.5" />}
          />

          <MetricTile
            label="Runtime + package"
            value={shortenLabel(
              `${data.summary.mostPopularRuntime} / ${data.summary.mostPopularPackageManager}`,
              24,
            )}
            detail="Top runtime and package-manager choices across tracked project setups."
            icon={<Radar className="h-3.5 w-3.5" />}
          />
        </div>
      </div>

      <div className="grid min-w-0 gap-4">
        <ChartCard
          title="Leading choices"
          description="The top selected option in each major category, shown by tracked setup count."
        >
          <CategoryBarChart
            data={leadingChoices}
            xKey="choice"
            orientation="horizontal"
            height={290}
            labelWidth={140}
            series={[{ key: "setups", label: "Tracked setups" }]}
          />
        </ChartCard>

        <ChartCard
          title="7 day comparison"
          description="Recent project starts compared with the previous 7 day window."
        >
          <CategoryBarChart
            data={momentumComparison}
            xKey="window"
            height={220}
            series={[{ key: "projects", label: "Projects" }]}
          />
        </ChartCard>
      </div>
    </div>
  );
}
