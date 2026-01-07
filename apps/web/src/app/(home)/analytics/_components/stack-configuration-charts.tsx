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

function BarChartComponent({ data, height = 280 }: { data: Distribution; height?: number }) {
  const chartConfig = getChartConfig(data);

  return (
    <ChartContainer
      config={chartConfig}
      style={{ height }}
      className="aspect-auto w-full min-h-[200px]"
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
        <YAxis tickLine={false} axisLine={false} />
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

export function StackSection({ data }: { data: AggregatedAnalyticsData }) {
  const {
    popularStackCombinations,
    frontendDistribution,
    backendDistribution,
    databaseDistribution,
    ormDistribution,
    dbSetupDistribution,
    apiDistribution,
    authDistribution,
    runtimeDistribution,
    databaseORMCombinations,
  } = data;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <span className="font-bold text-lg">STACK_CONFIGURATION</span>
        <div className="h-px flex-1 bg-border" />
        <span className="text-muted-foreground text-xs">[CORE_CHOICES]</span>
      </div>

      <ChartCard
        title="popular_stacks.bar"
        description="Most common backend + frontend combinations"
      >
        <BarChartComponent data={popularStackCombinations} height={320} />
      </ChartCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="frontend_frameworks.bar" description="Frontend framework distribution">
          <BarChartComponent data={frontendDistribution} />
        </ChartCard>

        <ChartCard title="backend_frameworks.bar" description="Backend framework distribution">
          <BarChartComponent data={backendDistribution} />
        </ChartCard>

        <ChartCard title="databases.bar" description="Database technology distribution">
          <BarChartComponent data={databaseDistribution} />
        </ChartCard>

        <ChartCard title="orms.bar" description="ORM / query builder distribution">
          <BarChartComponent data={ormDistribution} />
        </ChartCard>

        <ChartCard title="api_layer.pie" description="API layer technology (tRPC vs oRPC)">
          <PieChartComponent data={apiDistribution} />
        </ChartCard>

        <ChartCard title="authentication.pie" description="Authentication provider distribution">
          <PieChartComponent data={authDistribution} />
        </ChartCard>

        <ChartCard title="runtime.pie" description="JavaScript runtime preference">
          <PieChartComponent data={runtimeDistribution} />
        </ChartCard>
      </div>

      <ChartCard title="db_hosting.bar" description="Database hosting service choices">
        <BarChartComponent data={dbSetupDistribution} height={320} />
      </ChartCard>

      <ChartCard title="db_orm_combos.bar" description="Popular database + ORM combinations">
        <BarChartComponent data={databaseORMCombinations} height={320} />
      </ChartCard>
    </div>
  );
}
