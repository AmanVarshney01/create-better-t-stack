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
import type { AggregatedAnalyticsData, Distribution } from "./types";
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

function BarChartComponent({
	data,
	height = 280,
}: {
	data: Distribution;
	height?: number;
}) {
	return (
		<ChartContainer
			config={chartConfig}
			className={`h-[${height}px] w-full`}
			style={{ height }}
		>
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
					width={100}
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
				<ChartCard
					title="frontend_frameworks.bar"
					description="Frontend framework distribution"
				>
					<BarChartComponent data={frontendDistribution} />
				</ChartCard>

				<ChartCard
					title="backend_frameworks.bar"
					description="Backend framework distribution"
				>
					<BarChartComponent data={backendDistribution} />
				</ChartCard>

				<ChartCard
					title="databases.bar"
					description="Database technology distribution"
				>
					<BarChartComponent data={databaseDistribution} />
				</ChartCard>

				<ChartCard
					title="orms.bar"
					description="ORM / query builder distribution"
				>
					<BarChartComponent data={ormDistribution} />
				</ChartCard>

				<ChartCard
					title="api_layer.pie"
					description="API layer technology (tRPC vs oRPC)"
				>
					<PieChartComponent data={apiDistribution} />
				</ChartCard>

				<ChartCard
					title="authentication.pie"
					description="Authentication provider distribution"
				>
					<PieChartComponent data={authDistribution} />
				</ChartCard>

				<ChartCard
					title="runtime.pie"
					description="JavaScript runtime preference"
				>
					<PieChartComponent data={runtimeDistribution} />
				</ChartCard>

				{dbSetupDistribution.length > 0 && (
					<ChartCard
						title="db_hosting.bar"
						description="Database hosting service choices"
					>
						<BarChartComponent data={dbSetupDistribution} />
					</ChartCard>
				)}
			</div>

			<ChartCard
				title="db_orm_combos.bar"
				description="Popular database + ORM combinations"
			>
				<BarChartComponent data={databaseORMCombinations} height={320} />
			</ChartCard>
		</div>
	);
}
