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
	getAPIData,
	getAuthData,
	getBackendData,
	getDatabaseData,
	getDatabaseORMCombinations,
	getDBSetupData,
	getFrontendData,
	getORMData,
	getPopularStackCombinations,
	getProjectTypeData,
	getRuntimeData,
	getServerDeployData,
	getWebDeployData,
} from "./data-utils";
import type { AggregatedAnalyticsData } from "./types";
import {
	apiConfig,
	authConfig,
	backendConfig,
	databaseConfig,
	dbSetupConfig,
	frontendConfig,
	ormConfig,
	projectTypeConfig,
	runtimeConfig,
	serverDeployConfig,
	webDeployConfig,
} from "./types";

interface StackConfigurationChartsProps {
	data: AggregatedAnalyticsData | null;
}

export function StackConfigurationCharts({
	data,
}: StackConfigurationChartsProps) {
	const backendData = getBackendData(data);
	const databaseData = getDatabaseData(data);
	const ormData = getORMData(data);
	const dbSetupData = getDBSetupData(data);
	const apiData = getAPIData(data);
	const frontendData = getFrontendData(data);
	const authData = getAuthData(data);
	const runtimeData = getRuntimeData(data);
	const projectTypeData = getProjectTypeData(data);
	const webDeployData = getWebDeployData(data);
	const serverDeployData = getServerDeployData(data);
	const popularStackCombinations = getPopularStackCombinations(data);
	const databaseORMCombinations = getDatabaseORMCombinations(data);

	return (
		<div className="space-y-6">
			<div className="mb-6 flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
				<div className="flex items-center gap-2">
					<span className="font-bold text-lg sm:text-xl">
						STACK_CONFIGURATION.DB
					</span>
				</div>
				<div className="hidden h-px flex-1 bg-border sm:block" />
				<span className="w-full text-right text-muted-foreground text-xs sm:w-auto sm:text-left">
					[CORE_COMPONENTS]
				</span>
			</div>

			<div className="rounded border border-border">
				<div className="border-border border-b px-4 py-3">
					<div className="flex items-center gap-2">
						<span className="text-primary text-xs">▶</span>
						<span className="font-semibold text-sm">
							POPULAR_STACK_COMBINATIONS.BAR
						</span>
					</div>
					<p className="mt-1 text-muted-foreground text-xs">
						Most popular frontend + backend combinations
					</p>
				</div>
				<div className="p-4">
					<ChartContainer config={frontendConfig} className="h-[400px] w-full">
						<BarChart data={popularStackCombinations}>
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
							<Bar dataKey="value" radius={4} fill="hsl(var(--chart-1))" />
						</BarChart>
					</ChartContainer>
				</div>
			</div>

			<div className="rounded border border-border">
				<div className="border-border border-b px-4 py-3">
					<div className="flex items-center gap-2">
						<span className="text-primary text-xs">▶</span>
						<span className="font-semibold text-sm">
							FRONTEND_FRAMEWORKS.BAR
						</span>
					</div>
					<p className="mt-1 text-muted-foreground text-xs">
						Frontend framework and meta-framework usage
					</p>
				</div>
				<div className="p-4">
					<ChartContainer config={frontendConfig} className="h-[350px] w-full">
						<BarChart data={frontendData}>
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
								{frontendData.map((entry) => (
									<Cell
										key={`frontend-${entry.name}`}
										fill={
											entry.name === "react-router"
												? "hsl(var(--chart-1))"
												: entry.name === "tanstack-router"
													? "hsl(var(--chart-2))"
													: entry.name === "tanstack-start"
														? "hsl(var(--chart-3))"
														: entry.name === "next"
															? "hsl(var(--chart-4))"
															: entry.name === "nuxt"
																? "hsl(var(--chart-5))"
																: entry.name === "native-bare"
																	? "hsl(var(--chart-6))"
																	: entry.name === "native-uniwind"
																		? "hsl(var(--chart-7))"
																		: entry.name === "native-unistyles"
																			? "hsl(var(--chart-1))"
																			: entry.name === "svelte"
																				? "hsl(var(--chart-3))"
																				: entry.name === "solid"
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

			<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
				<div className="rounded border border-border">
					<div className="border-border border-b px-4 py-3">
						<div className="flex items-center gap-2">
							<span className="text-primary text-xs">▶</span>
							<span className="font-semibold text-sm">
								BACKEND_FRAMEWORKS.BAR
							</span>
						</div>
						<p className="mt-1 text-muted-foreground text-xs">
							Backend framework distribution
						</p>
					</div>
					<div className="p-4">
						<ChartContainer config={backendConfig} className="h-[300px] w-full">
							<BarChart data={backendData}>
								<CartesianGrid vertical={false} />
								<XAxis
									dataKey="name"
									tickLine={false}
									tickMargin={10}
									axisLine={false}
								/>
								<YAxis hide />
								<ChartTooltip content={<ChartTooltipContent />} />
								<Bar dataKey="value" radius={4}>
									{backendData.map((entry) => (
										<Cell
											key={`backend-${entry.name}`}
											fill={
												entry.name === "hono"
													? "hsl(var(--chart-1))"
													: entry.name === "express"
														? "hsl(var(--chart-2))"
														: entry.name === "fastify"
															? "hsl(var(--chart-3))"
															: entry.name === "next"
																? "hsl(var(--chart-4))"
																: entry.name === "elysia"
																	? "hsl(var(--chart-5))"
																	: entry.name === "convex"
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
							<span className="font-semibold text-sm">
								DATABASE_DISTRIBUTION.BAR
							</span>
						</div>
						<p className="mt-1 text-muted-foreground text-xs">
							Database technology distribution
						</p>
					</div>
					<div className="p-4">
						<ChartContainer
							config={databaseConfig}
							className="h-[300px] w-full"
						>
							<BarChart data={databaseData}>
								<CartesianGrid vertical={false} />
								<XAxis
									dataKey="name"
									tickLine={false}
									tickMargin={10}
									axisLine={false}
								/>
								<YAxis hide />
								<ChartTooltip content={<ChartTooltipContent />} />
								<Bar dataKey="value" radius={4}>
									{databaseData.map((entry) => (
										<Cell
											key={`database-${entry.name}`}
											fill={
												entry.name === "sqlite"
													? "hsl(var(--chart-1))"
													: entry.name === "postgres"
														? "hsl(var(--chart-2))"
														: entry.name === "mysql"
															? "hsl(var(--chart-3))"
															: entry.name === "mongodb"
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
								ORM_DISTRIBUTION.BAR
							</span>
						</div>
						<p className="mt-1 text-muted-foreground text-xs">
							ORM/Database layer distribution
						</p>
					</div>
					<div className="p-4">
						<ChartContainer config={ormConfig} className="h-[300px] w-full">
							<BarChart data={ormData}>
								<CartesianGrid vertical={false} />
								<XAxis
									dataKey="name"
									tickLine={false}
									tickMargin={10}
									axisLine={false}
								/>
								<YAxis hide />
								<ChartTooltip content={<ChartTooltipContent />} />
								<Bar dataKey="value" radius={4}>
									{ormData.map((entry) => (
										<Cell
											key={`orm-${entry.name}`}
											fill={
												entry.name === "drizzle"
													? "hsl(var(--chart-1))"
													: entry.name === "prisma"
														? "hsl(var(--chart-2))"
														: entry.name === "mongoose"
															? "hsl(var(--chart-3))"
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
								DATABASE_HOSTING.BAR
							</span>
						</div>
						<p className="mt-1 text-muted-foreground text-xs">
							Database hosting service preferences
						</p>
					</div>
					<div className="p-4">
						<ChartContainer config={dbSetupConfig} className="h-[300px] w-full">
							<BarChart data={dbSetupData}>
								<CartesianGrid vertical={false} />
								<XAxis
									dataKey="name"
									tickLine={false}
									tickMargin={10}
									axisLine={false}
								/>
								<YAxis hide />
								<ChartTooltip content={<ChartTooltipContent />} />
								<Bar dataKey="value" radius={4}>
									{dbSetupData.map((entry) => (
										<Cell
											key={`dbsetup-${entry.name}`}
											fill={
												entry.name === "turso"
													? "hsl(var(--chart-1))"
													: entry.name === "planetscale"
														? "hsl(var(--chart-2))"
														: entry.name === "prisma-postgres"
															? "hsl(var(--chart-3))"
															: entry.name === "mongodb-atlas"
																? "hsl(var(--chart-4))"
																: entry.name === "neon"
																	? "hsl(var(--chart-5))"
																	: entry.name === "supabase"
																		? "hsl(var(--chart-6))"
																		: entry.name === "d1"
																			? "hsl(var(--chart-7))"
																			: entry.name === "docker"
																				? "hsl(var(--chart-1))"
																				: "hsl(var(--chart-2))"
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
							<span className="font-semibold text-sm">API_LAYER.PIE</span>
						</div>
						<p className="mt-1 text-muted-foreground text-xs">
							API layer technology distribution
						</p>
					</div>
					<div className="p-4">
						<ChartContainer config={apiConfig} className="h-[300px] w-full">
							<PieChart>
								<ChartTooltip
									content={<ChartTooltipContent nameKey="name" />}
								/>
								<Pie
									data={apiData}
									dataKey="value"
									nameKey="name"
									cx="50%"
									cy="50%"
									outerRadius={80}
								>
									{apiData.map((entry) => (
										<Cell
											key={`api-${entry.name}`}
											fill={
												entry.name === "trpc"
													? "hsl(var(--chart-1))"
													: entry.name === "orpc"
														? "hsl(var(--chart-2))"
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
							<span className="font-semibold text-sm">
								AUTH_DISTRIBUTION.PIE
							</span>
						</div>
						<p className="mt-1 text-muted-foreground text-xs">
							Authentication provider distribution
						</p>
					</div>
					<div className="p-4">
						<ChartContainer config={authConfig} className="h-[300px] w-full">
							<PieChart>
								<ChartTooltip
									content={<ChartTooltipContent nameKey="name" />}
								/>
								<Pie
									data={authData}
									dataKey="value"
									nameKey="name"
									cx="50%"
									cy="50%"
									outerRadius={80}
									label={({ name, percent }) =>
										`${name} ${(percent * 100).toFixed(0)}%`
									}
								>
									{authData.map((entry) => (
										<Cell
											key={`auth-${entry.name}`}
											fill={
												entry.name === "better-auth"
													? "hsl(var(--chart-1))"
													: entry.name === "clerk"
														? "hsl(var(--chart-2))"
														: "hsl(var(--chart-3))"
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
								RUNTIME_DISTRIBUTION.PIE
							</span>
						</div>
						<p className="mt-1 text-muted-foreground text-xs">
							JavaScript runtime preference distribution
						</p>
					</div>
					<div className="p-4">
						<ChartContainer config={runtimeConfig} className="h-[300px] w-full">
							<PieChart>
								<ChartTooltip
									content={<ChartTooltipContent nameKey="name" />}
								/>
								<Pie
									data={runtimeData}
									dataKey="value"
									nameKey="name"
									cx="50%"
									cy="50%"
									outerRadius={80}
									label={({ name, percent }) =>
										`${name} ${(percent * 100).toFixed(0)}%`
									}
								>
									{runtimeData.map((entry) => (
										<Cell
											key={`runtime-${entry.name}`}
											fill={
												entry.name === "node"
													? "hsl(var(--chart-1))"
													: entry.name === "bun"
														? "hsl(var(--chart-2))"
														: entry.name === "workers"
															? "hsl(var(--chart-3))"
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
							<span className="font-semibold text-sm">PROJECT_TYPES.PIE</span>
						</div>
						<p className="mt-1 text-muted-foreground text-xs">
							Full-stack vs Frontend-only vs Backend-only projects
						</p>
					</div>
					<div className="p-4">
						<ChartContainer
							config={projectTypeConfig}
							className="h-[300px] w-full"
						>
							<PieChart>
								<ChartTooltip
									content={<ChartTooltipContent nameKey="name" />}
								/>
								<Pie
									data={projectTypeData}
									dataKey="value"
									nameKey="name"
									cx="50%"
									cy="50%"
									outerRadius={80}
									label={({ name, percent }) =>
										`${name} ${(percent * 100).toFixed(0)}%`
									}
								>
									{projectTypeData.map((entry) => (
										<Cell
											key={`project-type-${entry.name}`}
											fill={
												entry.name === "fullstack"
													? "hsl(var(--chart-1))"
													: entry.name === "frontend-only"
														? "hsl(var(--chart-2))"
														: entry.name === "backend-only"
															? "hsl(var(--chart-3))"
															: "hsl(var(--chart-4))"
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
								WEB_DEPLOYMENT_COMPARISON.PIE
							</span>
						</div>
						<p className="mt-1 text-muted-foreground text-xs">
							Web deployment platform comparison (Wrangler vs Alchemy)
						</p>
					</div>
					<div className="p-4">
						<ChartContainer
							config={webDeployConfig}
							className="h-[300px] w-full"
						>
							<PieChart>
								<ChartTooltip
									content={<ChartTooltipContent nameKey="name" />}
								/>
								<Pie
									data={webDeployData}
									dataKey="value"
									nameKey="name"
									cx="50%"
									cy="50%"
									outerRadius={80}
									label={({ name, percent }) =>
										`${name} ${(percent * 100).toFixed(0)}%`
									}
								>
									{webDeployData.map((entry) => (
										<Cell
											key={`web-deploy-${entry.name}`}
											fill={
												entry.name === "wrangler"
													? "hsl(var(--chart-1))"
													: entry.name === "alchemy"
														? "hsl(var(--chart-2))"
														: "hsl(var(--chart-3))"
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
								SERVER_DEPLOYMENT_COMPARISON.PIE
							</span>
						</div>
						<p className="mt-1 text-muted-foreground text-xs">
							Server deployment platform comparison (Wrangler vs Alchemy)
						</p>
					</div>
					<div className="p-4">
						<ChartContainer
							config={serverDeployConfig}
							className="h-[300px] w-full"
						>
							<PieChart>
								<ChartTooltip
									content={<ChartTooltipContent nameKey="name" />}
								/>
								<Pie
									data={serverDeployData}
									dataKey="value"
									nameKey="name"
									cx="50%"
									cy="50%"
									outerRadius={80}
									label={({ name, percent }) =>
										`${name} ${(percent * 100).toFixed(0)}%`
									}
								>
									{serverDeployData.map((entry) => (
										<Cell
											key={`server-deploy-${entry.name}`}
											fill={
												entry.name === "wrangler"
													? "hsl(var(--chart-1))"
													: entry.name === "alchemy"
														? "hsl(var(--chart-2))"
														: "hsl(var(--chart-3))"
											}
										/>
									))}
								</Pie>
								<ChartLegend content={<ChartLegendContent />} />
							</PieChart>
						</ChartContainer>
					</div>
				</div>
			</div>

			<div className="rounded border border-border">
				<div className="border-border border-b px-4 py-3">
					<div className="flex items-center gap-2">
						<span className="text-primary text-xs">▶</span>
						<span className="font-semibold text-sm">
							DATABASE_ORM_COMBINATIONS.BAR
						</span>
					</div>
					<p className="mt-1 text-muted-foreground text-xs">
						Popular database + ORM combinations
					</p>
				</div>
				<div className="p-4">
					<ChartContainer config={databaseConfig} className="h-[350px] w-full">
						<BarChart data={databaseORMCombinations}>
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
							<Bar dataKey="value" radius={4} fill="hsl(var(--chart-1))" />
						</BarChart>
					</ChartContainer>
				</div>
			</div>
		</div>
	);
}
