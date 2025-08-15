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
import {
	getHourlyDistributionData,
	getMonthlyTimeSeriesData,
	getPlatformData,
	getTimeSeriesData,
} from "./data-utils";
import type { AggregatedAnalyticsData } from "./types";
import {
	hourlyDistributionConfig,
	platformConfig,
	timeSeriesConfig,
} from "./types";

interface TimelineChartsProps {
	data: AggregatedAnalyticsData | null;
}

export function TimelineCharts({ data }: TimelineChartsProps) {
	const timeSeriesData = getTimeSeriesData(data);
	const monthlyTimeSeriesData = getMonthlyTimeSeriesData(data);
	const platformData = getPlatformData(data);
	const hourlyDistributionData = getHourlyDistributionData(data);

	return (
		<div className="space-y-6">
			<div className="mb-4 flex items-center gap-2">
				<span className="font-bold text-lg">TIMELINE_ANALYSIS.CHARTS</span>
				<div className="h-px flex-1 bg-border" />
			</div>

			<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
				<div className="rounded border border-border">
					<div className="border-border border-b px-4 py-3">
						<div className="flex items-center gap-2">
							<span className="text-primary text-xs">▶</span>
							<span className="font-semibold text-sm">
								PROJECT_TIMELINE.CHART
							</span>
						</div>
						<p className="mt-1 text-muted-foreground text-xs">
							Daily project creation timeline from actual data
						</p>
					</div>
					<div className="p-4">
						<ChartContainer
							config={timeSeriesConfig}
							className="h-[300px] w-full"
						>
							<AreaChart data={timeSeriesData}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="displayDate" />
								<YAxis />
								<ChartTooltip
									content={<ChartTooltipContent />}
									labelFormatter={(value, payload) => {
										const date = payload?.[0]?.payload?.date;
										return date
											? format(parseISO(date), "MMM dd, yyyy")
											: value;
									}}
								/>
								<Area
									type="monotone"
									dataKey="count"
									stroke="hsl(var(--chart-1))"
									fill="hsl(var(--chart-1))"
									fillOpacity={0.2}
								/>
							</AreaChart>
						</ChartContainer>
					</div>
				</div>

				<div className="rounded border border-border">
					<div className="border-border border-b px-4 py-3">
						<div className="flex items-center gap-2">
							<span className="text-primary text-xs">▶</span>
							<span className="font-semibold text-sm">
								MONTHLY_TRENDS.CHART
							</span>
						</div>
						<p className="mt-1 text-muted-foreground text-xs">
							Monthly project creation trends
						</p>
					</div>
					<div className="p-4">
						<ChartContainer
							config={timeSeriesConfig}
							className="h-[300px] w-full"
						>
							<BarChart data={monthlyTimeSeriesData}>
								<CartesianGrid vertical={false} />
								<XAxis
									dataKey="displayMonth"
									tickLine={false}
									tickMargin={10}
									axisLine={false}
									className="text-xs"
								/>
								<YAxis hide />
								<ChartTooltip content={<ChartTooltipContent />} />
								<Bar dataKey="count" radius={4} fill="hsl(var(--chart-1))" />
							</BarChart>
						</ChartContainer>
					</div>
				</div>

				<div className="rounded border border-border">
					<div className="border-border border-b px-4 py-3">
						<div className="flex items-center gap-2">
							<span className="text-primary text-xs">▶</span>
							<span className="font-semibold text-sm">
								PLATFORM_DISTRIBUTION.PIE
							</span>
						</div>
						<p className="mt-1 text-muted-foreground text-xs">
							Operating system distribution
						</p>
					</div>
					<div className="p-4">
						<ChartContainer
							config={platformConfig}
							className="h-[300px] w-full"
						>
							<PieChart>
								<ChartTooltip
									content={<ChartTooltipContent nameKey="name" />}
								/>
								<Pie
									data={platformData}
									cx="50%"
									cy="50%"
									labelLine={false}
									label={({ name, percent }) =>
										`${name} ${(percent * 100).toFixed(0)}%`
									}
									outerRadius={80}
									fill="hsl(var(--chart-1))"
									dataKey="value"
								>
									{platformData.map((entry) => (
										<Cell
											key={entry.name}
											fill={
												entry.name === "darwin"
													? "hsl(var(--chart-1))"
													: entry.name === "linux"
														? "hsl(var(--chart-2))"
														: entry.name === "win32"
															? "hsl(var(--chart-3))"
															: entry.name === "android"
																? "hsl(var(--chart-4))"
																: "hsl(var(--chart-5))"
											}
										/>
									))}
								</Pie>
								<ChartLegend content={<ChartLegendContent />} />
							</PieChart>
						</ChartContainer>
					</div>
				</div>

				<div className="rounded border border-border">
					<div className="border-border border-b px-4 py-3">
						<div className="flex items-center gap-2">
							<span className="text-primary text-xs">▶</span>
							<span className="font-semibold text-sm">
								HOURLY_DISTRIBUTION.BAR
							</span>
						</div>
						<p className="mt-1 text-muted-foreground text-xs">
							Projects created by hour of day (UTC)
						</p>
					</div>
					<div className="p-4">
						<ChartContainer
							config={hourlyDistributionConfig}
							className="h-[350px] w-full"
						>
							<BarChart data={hourlyDistributionData}>
								<CartesianGrid vertical={false} />
								<XAxis
									dataKey="displayHour"
									tickLine={false}
									tickMargin={10}
									axisLine={false}
									className="text-xs"
								/>
								<YAxis hide />
								<ChartTooltip
									content={<ChartTooltipContent />}
									labelFormatter={(value, payload) => {
										const hour = payload?.[0]?.payload?.displayHour;
										return hour ? `${hour} UTC` : value;
									}}
								/>
								<Bar dataKey="count" radius={4} fill="hsl(var(--chart-1))" />
							</BarChart>
						</ChartContainer>
					</div>
				</div>
			</div>
		</div>
	);
}
