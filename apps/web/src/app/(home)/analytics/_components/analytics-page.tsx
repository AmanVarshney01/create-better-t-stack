"use client";
import Footer from "../../_components/footer";
import { AddonsExamplesCharts } from "./addons-examples-charts";
import { AnalyticsHeader } from "./analytics-header";
import { DevEnvironmentCharts } from "./dev-environment-charts";
import { MetricsCards } from "./metrics-cards";
import { StackConfigurationCharts } from "./stack-configuration-charts";
import { TimelineCharts } from "./timeline-charts";
import type { AggregatedAnalyticsData } from "./types";

export default function AnalyticsPage({
	data,
}: {
	data: AggregatedAnalyticsData | null;
}) {
	const totalProjects = data?.summary?.totalProjects || 0;
	const avgProjectsPerDay = data?.summary?.avgProjectsPerDay || 0;
	const authEnabledPercent = data?.summary?.authEnabledPercent || 0;
	const mostPopularFrontend = data?.summary?.mostPopularFrontend || "None";
	const mostPopularBackend = data?.summary?.mostPopularBackend || "None";
	const mostPopularORM = data?.summary?.mostPopularORM || "None";
	const mostPopularAPI = data?.summary?.mostPopularAPI || "None";
	const mostPopularPackageManager =
		data?.summary?.mostPopularPackageManager || "npm";

	return (
		<div className="mx-auto min-h-svh max-w-[1280px]">
			<div className="container mx-auto space-y-8 px-4 py-8 pt-16">
				<AnalyticsHeader
					totalProjects={totalProjects}
					lastUpdated={data?.lastUpdated || null}
				/>

				<MetricsCards
					totalProjects={totalProjects}
					avgProjectsPerDay={avgProjectsPerDay}
					authEnabledPercent={authEnabledPercent}
					mostPopularFrontend={mostPopularFrontend}
					mostPopularBackend={mostPopularBackend}
					mostPopularORM={mostPopularORM}
					mostPopularAPI={mostPopularAPI}
					mostPopularPackageManager={mostPopularPackageManager}
				/>

				<TimelineCharts data={data} />

				<StackConfigurationCharts data={data} />

				<AddonsExamplesCharts data={data} />

				<DevEnvironmentCharts data={data} />
			</div>
			<Footer />
		</div>
	);
}
