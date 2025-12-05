import {
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
} from "@/components/ui/chart";
import type {
	AggregatedAnalyticsData,
	Distribution,
	VersionDistribution,
} from "./types";
import { chartConfig, getColor } from "./types";

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

function HorizontalBarChart({
	data,
	height = 280,
}: {
	data: Distribution;
	height?: number;
}) {
	return (
		<ChartContainer config={chartConfig} className="w-full" style={{ height }}>
			<BarChart data={data} layout="vertical" margin={{ left: 0 }}>
				<CartesianGrid horizontal={false} className="stroke-border" />
				<XAxis
					type="number"
					tickLine={false}
					axisLine={false}
					className="text-xs"
				/>
				<YAxis
					dataKey="name"
					type="category"
					tickLine={false}
					axisLine={false}
					width={80}
					className="text-xs"
				/>
				<ChartTooltip content={<ChartTooltipContent />} />
				<Bar dataKey="value" radius={4}>
					{data.map((entry, i) => (
						<Cell key={entry.name} fill={getColor(i)} />
					))}
				</Bar>
			</BarChart>
		</ChartContainer>
	);
}

function VersionBarChart({
	data,
	height = 280,
}: {
	data: VersionDistribution;
	height?: number;
}) {
	return (
		<ChartContainer config={chartConfig} className="w-full" style={{ height }}>
			<BarChart data={data}>
				<CartesianGrid vertical={false} className="stroke-border" />
				<XAxis
					dataKey="version"
					tickLine={false}
					axisLine={false}
					className="text-xs"
				/>
				<YAxis tickLine={false} axisLine={false} className="text-xs" />
				<ChartTooltip content={<ChartTooltipContent />} />
				<Bar dataKey="count" radius={4} fill="hsl(var(--chart-1))" />
			</BarChart>
		</ChartContainer>
	);
}

function PieChartComponent({ data }: { data: Distribution }) {
	return (
		<ChartContainer config={chartConfig} className="h-[280px] w-full">
			<PieChart>
				<ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
				<Pie
					data={data}
					cx="50%"
					cy="50%"
					outerRadius={80}
					dataKey="value"
					label={({ name, percent }) =>
						`${name} ${(percent * 100).toFixed(0)}%`
					}
					labelLine={false}
				>
					{data.map((entry, i) => (
						<Cell key={entry.name} fill={getColor(i)} />
					))}
				</Pie>
				<ChartLegend content={<ChartLegendContent />} />
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
				<ChartCard
					title="package_managers.bar"
					description="npm vs pnpm vs bun usage"
				>
					<HorizontalBarChart data={packageManagerDistribution} />
				</ChartCard>

				<ChartCard
					title="git_init.pie"
					description="Git repository initialization"
				>
					<PieChartComponent data={gitDistribution} />
				</ChartCard>

				<ChartCard
					title="auto_install.pie"
					description="Automatic dependency installation"
				>
					<PieChartComponent data={installDistribution} />
				</ChartCard>

				<ChartCard
					title="node_versions.bar"
					description="Node.js version distribution"
				>
					<VersionBarChart data={nodeVersionDistribution} />
				</ChartCard>
			</div>

			{addonsDistribution.length > 0 && (
				<ChartCard
					title="addons.bar"
					description="Additional tooling and features"
				>
					<HorizontalBarChart
						data={addonsDistribution}
						height={Math.max(200, addonsDistribution.length * 40)}
					/>
				</ChartCard>
			)}

			{examplesDistribution.length > 0 && (
				<ChartCard
					title="examples.bar"
					description="Example templates included"
				>
					<HorizontalBarChart data={examplesDistribution} />
				</ChartCard>
			)}

			{(webDeployDistribution.length > 0 ||
				serverDeployDistribution.length > 0) && (
				<div className="grid gap-6 lg:grid-cols-2">
					{webDeployDistribution.length > 0 && (
						<ChartCard
							title="web_deploy.bar"
							description="Web deployment platform"
						>
							<HorizontalBarChart data={webDeployDistribution} />
						</ChartCard>
					)}
					{serverDeployDistribution.length > 0 && (
						<ChartCard
							title="server_deploy.bar"
							description="Server deployment platform"
						>
							<HorizontalBarChart data={serverDeployDistribution} />
						</ChartCard>
					)}
				</div>
			)}

			{cliVersionDistribution.length > 0 && (
				<ChartCard
					title="cli_versions.bar"
					description="CLI version distribution (top 10)"
				>
					<VersionBarChart data={cliVersionDistribution} height={320} />
				</ChartCard>
			)}
		</div>
	);
}
