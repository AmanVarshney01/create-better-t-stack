"use client";

import {
  formatCompactNumber,
  formatDateLabel,
  formatHourLabel,
  formatMonthLabel,
} from "./analytics-helpers";
import { CategoryBarChart, TrendAreaChart } from "./bklit-charts";
import { ChartCard } from "./chart-card";
import { SectionHeader } from "./section-header";
import type { AggregatedAnalyticsData } from "./types";

export function TimelineSection({ data }: { data: AggregatedAnalyticsData }) {
  const peakDayLabel = data.momentum.peakDay ? formatDateLabel(data.momentum.peakDay.date) : "n/a";
  const busiestHourLabel = data.momentum.busiestHour
    ? `${formatHourLabel(data.momentum.busiestHour.hour)} UTC`
    : "n/a";
  const dailyData = data.timeSeries.map((point) => ({
    date: point.dateValue,
    projects: point.count,
    average: Number(point.rollingAverage.toFixed(2)),
  }));
  const monthlyData = data.monthlyTimeSeries.map((point) => ({
    month: formatMonthLabel(point.month, "MMM yy"),
    projects: point.totalProjects,
  }));
  const weekdayData = data.weekdayDistribution.map((point) => ({
    weekday: point.shortLabel,
    average: Number(point.averageDailyProjects.toFixed(2)),
  }));
  const hourlyData = data.hourlyDistribution.map((point) => ({
    hour: point.label,
    projects: point.count,
  }));

  return (
    <div className="space-y-6">
      <SectionHeader
        label="Activity"
        title="Project creation volume over time"
        description="Recent momentum, monthly totals, weekday averages, and UTC-hour concentration from live CLI telemetry."
        aside={
          <div className="rounded border border-border bg-fd-background px-3 py-1.5 font-mono text-muted-foreground text-xs">
            peak {peakDayLabel} · hot hour {busiestHourLabel}
          </div>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[1.35fr_0.95fr]">
        <ChartCard
          title="Daily project starts"
          description="Raw daily activity with the rolling average layered on top."
          footer={
            <>
              Last 7 days:{" "}
              <span className="text-foreground">
                {formatCompactNumber(data.momentum.last7Days)}
              </span>
              {" · "}
              Previous 7 days:{" "}
              <span className="text-foreground">
                {formatCompactNumber(data.momentum.previous7Days)}
              </span>
            </>
          }
        >
          <TrendAreaChart
            data={dailyData}
            height={340}
            series={[
              { key: "projects", label: "Daily starts" },
              { key: "average", label: "7 day average", line: true },
            ]}
          />
        </ChartCard>

        <ChartCard
          title="Monthly starts"
          description="The longer view of when the tracked history accumulated; the latest month may still be in progress."
          footer={
            <>
              Live total:{" "}
              <span className="text-foreground">{data.totalProjects.toLocaleString()}</span>
            </>
          }
        >
          <CategoryBarChart
            data={monthlyData}
            xKey="month"
            height={340}
            series={[{ key: "projects", label: "Monthly starts" }]}
          />
        </ChartCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard
          title="Weekday average"
          description="Average project starts for each weekday across the last month."
          footer={
            <>
              Active days in the last 30:{" "}
              <span className="text-foreground">{data.momentum.activeDaysLast30}</span>
            </>
          }
        >
          <CategoryBarChart
            data={weekdayData}
            xKey="weekday"
            height={260}
            series={[{ key: "average", label: "Average starts" }]}
          />
        </ChartCard>

        <ChartCard
          title="UTC hour distribution"
          description="When project starts cluster during the day."
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
          <CategoryBarChart
            data={hourlyData}
            xKey="hour"
            height={260}
            maxLabels={12}
            series={[{ key: "projects", label: "Project starts" }]}
          />
        </ChartCard>
      </div>
    </div>
  );
}
