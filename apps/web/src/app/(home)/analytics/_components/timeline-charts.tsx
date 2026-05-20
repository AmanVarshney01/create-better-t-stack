"use client";

import { EvilAreaChart } from "@/components/evilcharts/charts/area-chart";
import { EvilBarChart } from "@/components/evilcharts/charts/bar-chart";

import {
  formatCompactNumber,
  formatDateLabel,
  formatHourLabel,
  formatMonthLabel,
} from "./analytics-helpers";
import { ChartCard } from "./chart-card";
import { multiSeriesConfig, seriesConfig } from "./evil-chart-utils";
import { SectionHeader } from "./section-header";
import type { AggregatedAnalyticsData } from "./types";

export function TimelineSection({ data }: { data: AggregatedAnalyticsData }) {
  const peakDayLabel = data.momentum.peakDay ? formatDateLabel(data.momentum.peakDay.date) : "n/a";
  const busiestHourLabel = data.momentum.busiestHour
    ? `${formatHourLabel(data.momentum.busiestHour.hour)} UTC`
    : "n/a";
  const dailyData = data.timeSeries.map((point) => ({
    day: formatDateLabel(point.date),
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
    total: point.count,
  }));
  const hourlyData = data.hourlyDistribution.map((point) => ({
    hour: point.label,
    projects: point.count,
  }));
  const dailyConfig = multiSeriesConfig([
    { key: "projects", label: "Daily starts", tone: "blue" },
    { key: "average", label: "7 day average", tone: "teal" },
  ]);
  const monthlyConfig = seriesConfig("projects", "Monthly starts", "rose");
  const weekdayConfig = seriesConfig("average", "Average starts", "amber");
  const hourlyConfig = seriesConfig("projects", "Project starts", "violet");

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
          <EvilAreaChart
            className="h-[340px] w-full p-1"
            xDataKey="day"
            yDataKey="projects"
            data={dailyData}
            chartConfig={dailyConfig}
            curveType="monotone"
            areaVariant="gradient"
            strokeVariant="animated-dashed"
            dotVariant="border"
            activeDotVariant="colored-border"
            legendVariant="horizontal-bar"
            tooltipVariant="frosted-glass"
            tooltipRoundness="md"
            backgroundVariant="grid"
            xAxisProps={{ interval: "preserveStartEnd" }}
            yAxisProps={{
              tickFormatter: (value) => formatCompactNumber(Number(value)),
            }}
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
          <EvilBarChart
            className="h-[340px] w-full p-1"
            xDataKey="month"
            yDataKey="projects"
            data={monthlyData}
            chartConfig={monthlyConfig}
            barVariant="default"
            barRadius={5}
            enableBufferBar
            glowingBars={["projects"]}
            hideLegend
            tooltipVariant="frosted-glass"
            tooltipRoundness="md"
            backgroundVariant="diagonal-lines"
            xAxisProps={{ interval: "preserveStartEnd" }}
            yAxisProps={{
              tickFormatter: (value) => formatCompactNumber(Number(value)),
            }}
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
          <EvilBarChart
            className="h-[260px] w-full p-1"
            xDataKey="weekday"
            yDataKey="average"
            data={weekdayData}
            chartConfig={weekdayConfig}
            barVariant="default"
            barRadius={5}
            enableHoverHighlight
            hideLegend
            tooltipVariant="frosted-glass"
            tooltipRoundness="md"
            backgroundVariant="tiny-checkers"
            yAxisProps={{
              tickFormatter: (value) => formatCompactNumber(Number(value)),
            }}
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
          <EvilBarChart
            className="h-[260px] w-full p-1"
            xDataKey="hour"
            yDataKey="projects"
            data={hourlyData}
            chartConfig={hourlyConfig}
            barVariant="default"
            barRadius={4}
            enableHoverHighlight
            hideLegend
            tooltipVariant="frosted-glass"
            tooltipRoundness="md"
            backgroundVariant="dots"
            xAxisProps={{
              interval: 1,
              tickFormatter: (value) => String(value),
            }}
            yAxisProps={{
              tickFormatter: (value) => formatCompactNumber(Number(value)),
            }}
          />
        </ChartCard>
      </div>
    </div>
  );
}
