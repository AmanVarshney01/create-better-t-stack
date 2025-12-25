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
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { ChartContainer, ChartLegend, ChartLegendContent } from "@/components/ui/chart";

import type { AggregatedAnalyticsData } from "./types";

import { CHART_COLORS, chartConfig, getColor, truncateLabel } from "./types";

function ChartCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded border border-border">
      <div className="border-border border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-primary text-xs">$</span>
          <span className="font-semibold text-sm">{title}</span>
        </div>
        <p className="mt-1 text-muted-foreground text-xs">{description}</p>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function SimpleTooltip({
  active,
  payload,
  label,
  formatLabel,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
  formatLabel?: (label: string) => string;
}) {
  if (!active || !payload?.length) return null;
  const displayLabel = formatLabel && label ? formatLabel(label) : label;
  return (
    <div className="rounded border border-border/50 bg-background px-3 py-2 text-xs shadow-lg">
      <p className="font-medium">{displayLabel}</p>
      <p className="text-muted-foreground">{payload[0].value.toLocaleString()} projects</p>
    </div>
  );
}

export function TimelineSection({ data }: { data: AggregatedAnalyticsData }) {
  const { timeSeries, monthlyTimeSeries, platformDistribution, hourlyDistribution } = data;
  const platformTotal = platformDistribution.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <span className="font-bold text-lg">TIMELINE_ANALYSIS</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="daily_projects.chart" description="Project creations over time">
          <ChartContainer config={chartConfig} className="h-[280px] w-full">
            <AreaChart data={timeSeries} margin={{ left: -10, right: 8, top: 8, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => format(parseISO(val), "d")}
                tick={{ fontSize: 10 }}
                interval="preserveStartEnd"
              />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10 }} width={35} />
              <Tooltip
                content={({ active, payload, label }) => (
                  <SimpleTooltip
                    active={active}
                    payload={payload as Array<{ value: number }>}
                    label={label}
                    formatLabel={(l) => format(parseISO(l), "MMM d, yyyy")}
                  />
                )}
                cursor={{ stroke: "hsl(var(--muted-foreground))", strokeWidth: 1 }}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke={CHART_COLORS[0]}
                fill={CHART_COLORS[0]}
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        </ChartCard>

        <ChartCard title="monthly_trends.bar" description="Monthly project volume">
          <ChartContainer config={chartConfig} className="h-[280px] w-full">
            <BarChart data={monthlyTimeSeries} margin={{ left: -10, right: 8, top: 8, bottom: 4 }}>
              <CartesianGrid vertical={false} className="stroke-border/40" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 10 }}
                tickFormatter={(val) => val.slice(5)}
              />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10 }} width={35} />
              <Tooltip
                content={({ active, payload, label }) => (
                  <SimpleTooltip
                    active={active}
                    payload={payload as Array<{ value: number }>}
                    label={label}
                  />
                )}
                cursor={{ fill: "hsl(var(--muted))", opacity: 0.3 }}
              />
              <Bar dataKey="count" radius={3}>
                {monthlyTimeSeries.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[1]} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </ChartCard>

        <ChartCard title="platform_distribution.pie" description="Operating system usage">
          <ChartContainer config={chartConfig} className="h-[280px] w-full">
            <PieChart>
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const item = payload[0].payload as { name: string; value: number };
                  const percent = ((item.value / platformTotal) * 100).toFixed(1);
                  return (
                    <div className="rounded border border-border/50 bg-background px-3 py-2 text-xs shadow-lg">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-muted-foreground">
                        {item.value.toLocaleString()} ({percent}%)
                      </p>
                    </div>
                  );
                }}
              />
              <Pie
                data={platformDistribution}
                cx="50%"
                cy="45%"
                outerRadius={65}
                innerRadius={35}
                dataKey="value"
                paddingAngle={2}
              >
                {platformDistribution.map((entry, i) => (
                  <Cell key={entry.name} fill={getColor(i)} />
                ))}
              </Pie>
              <ChartLegend
                content={<ChartLegendContent nameKey="name" />}
                formatter={(value) => truncateLabel(String(value), 10)}
                wrapperStyle={{ fontSize: 11 }}
              />
            </PieChart>
          </ChartContainer>
        </ChartCard>

        <ChartCard title="hourly_activity.bar" description="Projects by hour (UTC)">
          <ChartContainer config={chartConfig} className="h-[280px] w-full">
            <BarChart data={hourlyDistribution} margin={{ left: -10, right: 8, top: 8, bottom: 4 }}>
              <CartesianGrid vertical={false} className="stroke-border/40" />
              <XAxis
                dataKey="hour"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 9 }}
                interval={3}
                tickFormatter={(val) => val.replace(":00", "")}
              />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10 }} width={30} />
              <Tooltip
                content={({ active, payload, label }) => (
                  <SimpleTooltip
                    active={active}
                    payload={payload as Array<{ value: number }>}
                    label={label}
                    formatLabel={(l) => `${l} UTC`}
                  />
                )}
                cursor={{ fill: "hsl(var(--muted))", opacity: 0.3 }}
              />
              <Bar dataKey="count" radius={2}>
                {hourlyDistribution.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[2]} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </ChartCard>
      </div>
    </div>
  );
}
