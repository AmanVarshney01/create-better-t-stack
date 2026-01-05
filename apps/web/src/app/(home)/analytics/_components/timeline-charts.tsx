"use client";

import { format, parseISO } from "date-fns";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

import type { AggregatedAnalyticsData, Distribution } from "./types";

import { ChartCard } from "./chart-card";

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

function getChartConfig(data: Distribution): ChartConfig {
  const config: ChartConfig = {};
  for (const [index, item] of data.entries()) {
    config[item.name] = {
      label: item.name,
      color: CHART_COLORS[index % CHART_COLORS.length],
    };
  }
  return config;
}

const areaChartConfig = {
  count: { label: "Projects", color: "var(--chart-1)" },
} satisfies ChartConfig;

const barChartConfig = {
  count: { label: "Projects", color: "var(--chart-2)" },
} satisfies ChartConfig;

const hourlyChartConfig = {
  count: { label: "Projects", color: "var(--chart-3)" },
} satisfies ChartConfig;

export function TimelineSection({ data }: { data: AggregatedAnalyticsData }) {
  const { timeSeries, monthlyTimeSeries, platformDistribution, hourlyDistribution } = data;
  const platformChartConfig = getChartConfig(platformDistribution);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <span className="font-bold text-lg">TIMELINE_ANALYSIS</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="daily_projects.chart" description="Project creations over time">
          <ChartContainer config={areaChartConfig} className="h-[280px] w-full min-h-[200px]">
            <AreaChart
              accessibilityLayer
              data={timeSeries}
              margin={{ left: -10, right: 8, top: 8, bottom: 4 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                tickFormatter={(val) => format(parseISO(val), "d")}
                interval="preserveStartEnd"
              />
              <YAxis tickLine={false} axisLine={false} width={35} />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(_, payload) => {
                      const item = payload?.[0]?.payload as { date: string } | undefined;
                      return item ? format(parseISO(item.date), "MMM d, yyyy") : "";
                    }}
                    hideIndicator
                  />
                }
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="var(--chart-1)"
                fill="var(--chart-1)"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        </ChartCard>

        <ChartCard title="monthly_trends.bar" description="Monthly project volume">
          <ChartContainer config={barChartConfig} className="h-[280px] w-full min-h-[200px]">
            <BarChart
              accessibilityLayer
              data={monthlyTimeSeries}
              margin={{ left: -10, right: 8, top: 8, bottom: 4 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                tickFormatter={(val) => val.slice(5)}
              />
              <YAxis tickLine={false} axisLine={false} width={35} />
              <ChartTooltip content={<ChartTooltipContent hideIndicator />} />
              <Bar dataKey="count" fill="var(--chart-2)" radius={4} />
            </BarChart>
          </ChartContainer>
        </ChartCard>

        <ChartCard title="platform_distribution.pie" description="Operating system usage">
          <ChartContainer config={platformChartConfig} className="h-[280px] w-full min-h-[200px]">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
              <Pie
                data={platformDistribution}
                cx="50%"
                cy="45%"
                outerRadius={65}
                innerRadius={35}
                dataKey="value"
                nameKey="name"
                paddingAngle={2}
              >
                {platformDistribution.map((entry, index) => (
                  <Cell key={entry.name} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <ChartLegend content={<ChartLegendContent nameKey="name" />} />
            </PieChart>
          </ChartContainer>
        </ChartCard>

        <ChartCard title="hourly_activity.bar" description="Projects by hour (UTC)">
          <ChartContainer config={hourlyChartConfig} className="h-[280px] w-full min-h-[200px]">
            <BarChart
              accessibilityLayer
              data={hourlyDistribution}
              margin={{ left: -10, right: 8, top: 8, bottom: 4 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="hour"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                interval={3}
                tickFormatter={(val) => val.replace(":00", "")}
              />
              <YAxis tickLine={false} axisLine={false} width={30} />
              <ChartTooltip
                content={
                  <ChartTooltipContent labelFormatter={(value) => `${value} UTC`} hideIndicator />
                }
              />
              <Bar dataKey="count" fill="var(--chart-3)" radius={4} />
            </BarChart>
          </ChartContainer>
        </ChartCard>
      </div>
    </div>
  );
}
