import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { getAddonsData, getExamplesData } from "./data-utils";
import type { AggregatedAnalyticsData } from "./types";
import { addonsConfig, examplesConfig } from "./types";

interface AddonsExamplesChartsProps {
	data: AggregatedAnalyticsData | null;
}

export function AddonsExamplesCharts({ data }: AddonsExamplesChartsProps) {
	const addonsData = getAddonsData(data);
	const examplesData = getExamplesData(data);

	return (
		<>
			<div className="rounded border border-border">
				<div className="border-border border-b px-4 py-3">
					<div className="flex items-center gap-2">
						<span className="text-primary text-xs">▶</span>
						<span className="font-semibold text-sm">ADDONS_USAGE.BAR</span>
					</div>
					<p className="mt-1 text-muted-foreground text-xs">
						Additional features and tooling adoption
					</p>
				</div>
				<div className="p-4">
					<ChartContainer config={addonsConfig} className="h-[350px] w-full">
						<BarChart data={addonsData}>
							<CartesianGrid vertical={false} />
							<XAxis
								dataKey="name"
								tickLine={false}
								tickMargin={10}
								axisLine={false}
								className="text-xs"
							/>
							<YAxis hide />
							<ChartTooltip content={<ChartTooltipContent />} />
							<Bar dataKey="value" radius={4}>
								{addonsData.map((entry) => (
									<Cell
										key={`addons-${entry.name}`}
										fill={
											entry.name === "pwa"
												? "hsl(var(--chart-1))"
												: entry.name === "biome"
													? "hsl(var(--chart-2))"
													: entry.name === "tauri"
														? "hsl(var(--chart-3))"
														: entry.name === "husky"
															? "hsl(var(--chart-4))"
															: entry.name === "starlight"
																? "hsl(var(--chart-5))"
																: entry.name === "turborepo"
																	? "hsl(var(--chart-6))"
																	: "hsl(var(--chart-7))"
										}
									/>
								))}
							</Bar>
						</BarChart>
					</ChartContainer>
				</div>
			</div>

			<div className="rounded border border-border">
				<div className="border-border border-b px-4 py-3">
					<div className="flex items-center gap-2">
						<span className="text-primary text-xs">▶</span>
						<span className="font-semibold text-sm">EXAMPLES_USAGE.BAR</span>
					</div>
					<p className="mt-1 text-muted-foreground text-xs">
						Example applications included in projects
					</p>
				</div>
				<div className="p-4">
					<ChartContainer config={examplesConfig} className="h-[300px] w-full">
						<BarChart data={examplesData}>
							<CartesianGrid vertical={false} />
							<XAxis
								dataKey="name"
								tickLine={false}
								tickMargin={10}
								axisLine={false}
								className="text-xs"
							/>
							<YAxis hide />
							<ChartTooltip content={<ChartTooltipContent />} />
							<Bar dataKey="value" radius={4}>
								{examplesData.map((entry) => (
									<Cell
										key={`examples-${entry.name}`}
										fill={
											entry.name === "todo"
												? "hsl(var(--chart-1))"
												: entry.name === "ai"
													? "hsl(var(--chart-2))"
													: "hsl(var(--chart-7))"
										}
									/>
								))}
							</Bar>
						</BarChart>
					</ChartContainer>
				</div>
			</div>
		</>
	);
}
