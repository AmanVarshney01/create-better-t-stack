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
import {
	getCLIVersionData,
	getGitData,
	getInstallData,
	getNodeVersionData,
	getPackageManagerData,
} from "./data-utils";
import type { AggregatedAnalyticsData } from "./types";
import {
	cliVersionConfig,
	gitConfig,
	installConfig,
	nodeVersionConfig,
	packageManagerConfig,
} from "./types";

interface DevEnvironmentChartsProps {
	data: AggregatedAnalyticsData | null;
}

export function DevEnvironmentCharts({ data }: DevEnvironmentChartsProps) {
	const gitData = getGitData(data);
	const packageManagerData = getPackageManagerData(data);
	const installData = getInstallData(data);
	const nodeVersionData = getNodeVersionData(data);
	const cliVersionData = getCLIVersionData(data);

	return (
		<div className="space-y-6">
			<div className="mb-4 flex items-center gap-2">
				<span className="font-bold text-lg">DEV_ENVIRONMENT.CONFIG</span>
				<div className="h-px flex-1 bg-border" />
			</div>

			<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
				<div className="rounded border border-border">
					<div className="border-border border-b px-4 py-3">
						<div className="flex items-center gap-2">
							<span className="text-primary text-xs">▶</span>
							<span className="font-semibold text-sm">
								GIT_INITIALIZATION.PIE
							</span>
						</div>
						<p className="mt-1 text-muted-foreground text-xs">
							Git repository initialization rate
						</p>
					</div>
					<div className="p-4">
						<ChartContainer config={gitConfig} className="h-[300px] w-full">
							<PieChart>
								<ChartTooltip
									content={<ChartTooltipContent nameKey="name" />}
								/>
								<Pie
									data={gitData}
									dataKey="value"
									nameKey="name"
									cx="50%"
									cy="50%"
									outerRadius={80}
									label={({ name, percent }) =>
										`${name} ${(percent * 100).toFixed(0)}%`
									}
								>
									{gitData.map((entry) => (
										<Cell
											key={`git-${entry.name}`}
											fill={
												entry.name === "enabled"
													? "hsl(var(--chart-1))"
													: "hsl(var(--chart-7))"
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
							<span className="font-semibold text-sm">PACKAGE_MANAGER.BAR</span>
						</div>
						<p className="mt-1 text-muted-foreground text-xs">
							Package manager usage distribution
						</p>
					</div>
					<div className="p-4">
						<ChartContainer
							config={packageManagerConfig}
							className="h-[300px] w-full"
						>
							<BarChart data={packageManagerData}>
								<CartesianGrid vertical={false} />
								<XAxis
									dataKey="name"
									tickLine={false}
									tickMargin={10}
									axisLine={false}
								/>
								<YAxis />
								<ChartTooltip content={<ChartTooltipContent />} />
								<Bar dataKey="value" radius={4}>
									{packageManagerData.map((entry) => (
										<Cell
											key={`package-${entry.name}`}
											fill={
												entry.name === "npm"
													? "hsl(var(--chart-1))"
													: entry.name === "pnpm"
														? "hsl(var(--chart-2))"
														: entry.name === "bun"
															? "hsl(var(--chart-3))"
															: entry.name === "yarn"
																? "hsl(var(--chart-4))"
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
							<span className="font-semibold text-sm">
								INSTALL_PREFERENCE.PIE
							</span>
						</div>
						<p className="mt-1 text-muted-foreground text-xs">
							Automatic dependency installation preference
						</p>
					</div>
					<div className="p-4">
						<ChartContainer config={installConfig} className="h-[300px] w-full">
							<PieChart>
								<ChartTooltip
									content={<ChartTooltipContent nameKey="name" />}
								/>
								<Pie
									data={installData}
									dataKey="value"
									nameKey="name"
									cx="50%"
									cy="50%"
									outerRadius={80}
									label={({ name, percent }) =>
										`${name} ${(percent * 100).toFixed(0)}%`
									}
								>
									{installData.map((entry) => (
										<Cell
											key={`install-${entry.name}`}
											fill={
												entry.name === "enabled"
													? "hsl(var(--chart-1))"
													: "hsl(var(--chart-7))"
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
							<span className="font-semibold text-sm">NODE_VERSIONS.BAR</span>
						</div>
						<p className="mt-1 text-muted-foreground text-xs">
							Node.js version distribution (major versions)
						</p>
					</div>
					<div className="p-4">
						<ChartContainer
							config={nodeVersionConfig}
							className="h-[300px] w-full"
						>
							<BarChart data={nodeVersionData}>
								<CartesianGrid vertical={false} />
								<XAxis
									dataKey="version"
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
			</div>

			<div className="rounded border border-border">
				<div className="border-border border-b px-4 py-3">
					<div className="flex items-center gap-2">
						<span className="text-primary text-xs">▶</span>
						<span className="font-semibold text-sm">CLI_VERSIONS.BAR</span>
					</div>
					<p className="mt-1 text-muted-foreground text-xs">
						CLI version distribution across project creations
					</p>
				</div>
				<div className="p-4">
					<ChartContainer
						config={cliVersionConfig}
						className="h-[350px] w-full"
					>
						<BarChart data={cliVersionData}>
							<CartesianGrid vertical={false} />
							<XAxis
								dataKey="version"
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
		</div>
	);
}
