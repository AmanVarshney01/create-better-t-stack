"use client";

import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

import type { AggregatedAnalyticsData, Distribution, VersionDistribution } from "./types";

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

function getVersionChartConfig(): ChartConfig {
  return {
    count: { label: "Count", color: "var(--chart-5)" },
  };
}

function VerticalBarChart({ data, height = 280 }: { data: Distribution; height?: number }) {
  const chartConfig = getChartConfig(data);

  return (
    <ChartContainer
      config={chartConfig}
      className="aspect-auto w-full min-h-[200px]"
      style={{ height }}
    >
      <BarChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="name"
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          tickFormatter={(value) => (value.length > 20 ? `${value.slice(0, 20)}…` : value)}
        />
        <YAxis tickLine={false} axisLine={false} width={16} />
        <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
        <Bar dataKey="value" radius={4}>
          {data.map((entry, index) => (
            <Cell key={entry.name} fill={CHART_COLORS[index % CHART_COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}

function VersionBarChart({ data, height = 280 }: { data: VersionDistribution; height?: number }) {
  const chartConfig = getVersionChartConfig();

  return (
    <ChartContainer
      config={chartConfig}
      className="aspect-auto w-full min-h-[200px]"
      style={{ height }}
    >
      <BarChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="version"
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          tickFormatter={(value) => (value.length > 7 ? `${value.slice(0, 7)}…` : value)}
        />
        <YAxis tickLine={false} axisLine={false} width={16} />
        <ChartTooltip content={<ChartTooltipContent hideIndicator />} />
        <Bar dataKey="count" fill="var(--chart-5)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}

function PieChartComponent({ data }: { data: Distribution }) {
  const chartConfig = getChartConfig(data);

  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-[280px] w-full min-h-[200px]">
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
        <Pie
          data={data}
          cx="50%"
          cy="45%"
          outerRadius={65}
          innerRadius={35}
          dataKey="value"
          nameKey="name"
          paddingAngle={2}
        >
          {data.map((entry, index) => (
            <Cell key={entry.name} fill={CHART_COLORS[index % CHART_COLORS.length]} />
          ))}
        </Pie>
        <ChartLegend content={<ChartLegendContent nameKey="name" />} />
      </PieChart>
    </ChartContainer>
  );
}

export function DevToolsSection({ data }: { data: AggregatedAnalyticsData }) {
  const {
    packageManagerDistribution,
    gitDistribution,
    installDistribution,
    addonsDistribution,
    examplesDistribution,
    nodeVersionDistribution,
    cliVersionDistribution,
    webDeployDistribution,
    serverDeployDistribution,
  } = data;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <span className="font-bold text-lg">DEV_TOOLS_AND_CONFIG</span>
        <div className="h-px flex-1 bg-border" />
        <span className="text-muted-foreground text-xs">[TOOLING]</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="package_managers.bar" description="npm vs pnpm vs bun usage">
          <VerticalBarChart data={packageManagerDistribution} />
        </ChartCard>

        <ChartCard title="git_init.pie" description="Git repository initialization">
          <PieChartComponent data={gitDistribution} />
        </ChartCard>

        <ChartCard title="auto_install.pie" description="Automatic dependency installation">
          <PieChartComponent data={installDistribution} />
        </ChartCard>

        <ChartCard title="node_versions.bar" description="Node.js version distribution">
          <VersionBarChart data={nodeVersionDistribution} />
        </ChartCard>
      </div>

      {addonsDistribution.length > 0 && (
        <ChartCard title="addons.bar" description="Additional tooling and features">
          <VerticalBarChart
            data={addonsDistribution}
            height={Math.max(200, addonsDistribution.length * 40)}
          />
        </ChartCard>
      )}

      {examplesDistribution.length > 0 && (
        <ChartCard title="examples.bar" description="Example templates included">
          <VerticalBarChart data={examplesDistribution} />
        </ChartCard>
      )}

      {(webDeployDistribution.length > 0 || serverDeployDistribution.length > 0) && (
        <div className="grid gap-6 lg:grid-cols-2">
          {webDeployDistribution.length > 0 && (
            <ChartCard title="web_deploy.bar" description="Web deployment platform">
              <VerticalBarChart data={webDeployDistribution} />
            </ChartCard>
          )}
          {serverDeployDistribution.length > 0 && (
            <ChartCard title="server_deploy.bar" description="Server deployment platform">
              <VerticalBarChart data={serverDeployDistribution} />
            </ChartCard>
          )}
        </div>
      )}

      {cliVersionDistribution.length > 0 && (
        <ChartCard title="cli_versions.bar" description="CLI version distribution (top 10)">
          <VersionBarChart data={cliVersionDistribution} height={320} />
        </ChartCard>
      )}
    </div>
  );
}
