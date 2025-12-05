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
} from "@/components/ui/chart";
import type { AggregatedAnalyticsData } from "./types";
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

export function TimelineSection({ data }: { data: AggregatedAnalyticsData }) {
	const {
		timeSeries,
		monthlyTimeSeries,
		platformDistribution,
		hourlyDistribution,
	} = data;

	return (
		<div className="space-y-6">
			<div className="flex items-center gap-2">
				<span className="font-bold text-lg">TIMELINE_ANALYSIS</span>
				<div className="h-px flex-1 bg-border" />
			</div>

			<div className="grid gap-6 lg:grid-cols-2">
				<ChartCard
					title="daily_projects.chart"
					description="Project creations over time"
				>
					<ChartContainer config={chartConfig} className="h-[280px] w-full">
						<AreaChart data={timeSeries}>
							<CartesianGrid strokeDasharray="3 3" className="stroke-border" />
							<XAxis
								dataKey="date"
								tickLine={false}
								axisLine={false}
								tickFormatter={(val) => format(parseISO(val), "MMM d")}
								className="text-xs"
							/>
							<YAxis tickLine={false} axisLine={false} className="text-xs" />
							<ChartTooltip
								content={<ChartTooltipContent />}
								labelFormatter={(val) =>
									format(parseISO(val as string), "MMM dd, yyyy")
								}
							/>
							<Area
								type="monotone"
								dataKey="count"
								stroke="hsl(var(--chart-1))"
								fill="hsl(var(--chart-1))"
								fillOpacity={0.15}
								strokeWidth={2}
							/>
						</AreaChart>
					</ChartContainer>
				</ChartCard>

				<ChartCard
					title="monthly_trends.bar"
					description="Monthly project volume"
				>
					<ChartContainer config={chartConfig} className="h-[280px] w-full">
						<BarChart data={monthlyTimeSeries}>
							<CartesianGrid vertical={false} className="stroke-border" />
							<XAxis
								dataKey="month"
								tickLine={false}
								axisLine={false}
								className="text-xs"
							/>
							<YAxis tickLine={false} axisLine={false} className="text-xs" />
							<ChartTooltip content={<ChartTooltipContent />} />
							<Bar dataKey="count" radius={4} fill="hsl(var(--chart-1))" />
						</BarChart>
					</ChartContainer>
				</ChartCard>

				<ChartCard
					title="platform_distribution.pie"
					description="Operating system usage"
				>
					<ChartContainer config={chartConfig} className="h-[280px] w-full">
						<PieChart>
							<ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
							<Pie
								data={platformDistribution}
								cx="50%"
								cy="50%"
								outerRadius={80}
								dataKey="value"
								label={({ name, percent }) =>
									`${name} ${(percent * 100).toFixed(0)}%`
								}
								labelLine={false}
							>
								{platformDistribution.map((entry, i) => (
									<Cell key={entry.name} fill={getColor(i)} />
								))}
							</Pie>
							<ChartLegend content={<ChartLegendContent />} />
						</PieChart>
					</ChartContainer>
				</ChartCard>

				<ChartCard
					title="hourly_activity.bar"
					description="Projects by hour (UTC)"
				>
					<ChartContainer config={chartConfig} className="h-[280px] w-full">
						<BarChart data={hourlyDistribution}>
							<CartesianGrid vertical={false} className="stroke-border" />
							<XAxis
								dataKey="hour"
								tickLine={false}
								axisLine={false}
								className="text-xs"
								interval={2}
							/>
							<YAxis tickLine={false} axisLine={false} className="text-xs" />
							<ChartTooltip content={<ChartTooltipContent />} />
							<Bar dataKey="count" radius={2} fill="hsl(var(--chart-2))" />
						</BarChart>
					</ChartContainer>
				</ChartCard>
			</div>
		</div>
	);
}
