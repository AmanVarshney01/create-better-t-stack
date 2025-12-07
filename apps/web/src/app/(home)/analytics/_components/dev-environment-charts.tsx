import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, Tooltip, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import type { AggregatedAnalyticsData, Distribution, VersionDistribution } from "./types";
import { CHART_COLORS, chartConfig, getColor, truncateLabel } from "./types";

function CustomYAxisTick({
  x,
  y,
  payload,
  maxChars = 10,
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

function CustomXAxisTick({
  x,
  y,
  payload,
  maxChars = 7,
}: {
  x: number;
  y: number;
  payload: { value: string };
  maxChars?: number;
}) {
  const label = truncateLabel(String(payload.value), maxChars);
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={12}
        textAnchor="middle"
        fill="hsl(var(--muted-foreground))"
        fontSize={10}
      >
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

function HorizontalBarChart({ data, height = 280 }: { data: Distribution; height?: number }) {
  return (
    <ChartContainer config={chartConfig} className="w-full" style={{ height }}>
      <BarChart data={data} layout="vertical" margin={{ left: 4, right: 12, top: 4, bottom: 4 }}>
        <CartesianGrid horizontal={false} className="stroke-border/40" />
        <XAxis type="number" tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
        <YAxis
          dataKey="name"
          type="category"
          tickLine={false}
          axisLine={false}
          width={75}
          tick={(props) => <CustomYAxisTick {...props} maxChars={10} />}
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

function VersionBarChart({ data, height = 280 }: { data: VersionDistribution; height?: number }) {
  return (
    <ChartContainer config={chartConfig} className="w-full" style={{ height }}>
      <BarChart data={data} margin={{ left: -10, right: 8, top: 8, bottom: 4 }}>
        <CartesianGrid vertical={false} className="stroke-border/40" />
        <XAxis
          dataKey="version"
          tickLine={false}
          axisLine={false}
          tick={(props) => <CustomXAxisTick {...props} maxChars={7} />}
          interval={0}
        />
        <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10 }} width={35} />
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            const item = payload[0].payload as { version: string; count: number };
            return (
              <div className="rounded border border-border/50 bg-background px-3 py-2 text-xs shadow-lg">
                <p className="font-medium">{item.version}</p>
                <p className="text-muted-foreground">{item.count.toLocaleString()} projects</p>
              </div>
            );
          }}
          cursor={{ fill: "hsl(var(--muted))", opacity: 0.3 }}
        />
        <Bar dataKey="count" radius={3}>
          {data.map((_, i) => (
            <Cell key={i} fill={CHART_COLORS[4]} />
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
          formatter={(value) => truncateLabel(String(value), 8)}
          wrapperStyle={{ fontSize: 11 }}
        />
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
          <HorizontalBarChart data={packageManagerDistribution} />
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
          <HorizontalBarChart
            data={addonsDistribution}
            height={Math.max(200, addonsDistribution.length * 40)}
          />
        </ChartCard>
      )}

      {examplesDistribution.length > 0 && (
        <ChartCard title="examples.bar" description="Example templates included">
          <HorizontalBarChart data={examplesDistribution} />
        </ChartCard>
      )}

      {(webDeployDistribution.length > 0 || serverDeployDistribution.length > 0) && (
        <div className="grid gap-6 lg:grid-cols-2">
          {webDeployDistribution.length > 0 && (
            <ChartCard title="web_deploy.bar" description="Web deployment platform">
              <HorizontalBarChart data={webDeployDistribution} />
            </ChartCard>
          )}
          {serverDeployDistribution.length > 0 && (
            <ChartCard title="server_deploy.bar" description="Server deployment platform">
              <HorizontalBarChart data={serverDeployDistribution} />
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
