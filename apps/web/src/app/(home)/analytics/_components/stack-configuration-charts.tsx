import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, Tooltip, XAxis, YAxis } from "recharts";

import { ChartContainer, ChartLegend, ChartLegendContent } from "@/components/ui/chart";

import type { AggregatedAnalyticsData, Distribution } from "./types";

import { chartConfig, getColor, truncateLabel } from "./types";

function CustomYAxisTick({
  x,
  y,
  payload,
  maxChars = 11,
}: {
  x: number;
  y: number;
  payload: { value: string };
  maxChars?: number;
}) {
  const label = truncateLabel(String(payload.value), maxChars);
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={-4} y={0} dy={4} textAnchor="end" fill="hsl(var(--muted-foreground))" fontSize={11}>
        {label}
      </text>
    </g>
  );
}

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
    <div className="group rounded border border-border bg-fd-background transition-colors hover:bg-muted/10">
      <div className="space-y-4 p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-primary text-xs">$</span>
              <span className="font-semibold font-mono text-sm">{title}</span>
            </div>
            <p className="text-muted-foreground text-xs">{description}</p>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ value: number; payload: { name: string } }>;
}) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="rounded border border-border/50 bg-background px-3 py-2 text-xs shadow-lg">
      <p className="font-medium">{item.payload.name}</p>
      <p className="text-muted-foreground">{item.value.toLocaleString()} projects</p>
    </div>
  );
}

function BarChartComponent({ data, height = 280 }: { data: Distribution; height?: number }) {
  return (
    <ChartContainer config={chartConfig} style={{ height }} className="w-full">
      <BarChart data={data} layout="vertical" margin={{ left: 4, right: 12, top: 4, bottom: 4 }}>
        <CartesianGrid horizontal={false} className="stroke-border/40" />
        <XAxis type="number" tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
        <YAxis
          dataKey="name"
          type="category"
          tickLine={false}
          axisLine={false}
          width={85}
          tick={(props) => <CustomYAxisTick {...props} maxChars={11} />}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--muted))", opacity: 0.3 }} />
        <Bar dataKey="value" radius={3}>
          {data.map((entry, i) => (
            <Cell key={entry.name} fill={getColor(i)} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}

function PieChartComponent({ data }: { data: Distribution }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <ChartContainer config={chartConfig} className="h-[280px] w-full">
      <PieChart>
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            const item = payload[0].payload as { name: string; value: number };
            const percent = ((item.value / total) * 100).toFixed(1);
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
          data={data}
          cx="50%"
          cy="45%"
          outerRadius={65}
          innerRadius={35}
          dataKey="value"
          paddingAngle={2}
        >
          {data.map((entry, i) => (
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

        {dbSetupDistribution.length > 0 && (
          <ChartCard title="db_hosting.bar" description="Database hosting service choices">
            <BarChartComponent data={dbSetupDistribution} />
          </ChartCard>
        )}
      </div>

      <ChartCard title="db_orm_combos.bar" description="Popular database + ORM combinations">
        <BarChartComponent data={databaseORMCombinations} height={320} />
      </ChartCard>
    </div>
  );
}
