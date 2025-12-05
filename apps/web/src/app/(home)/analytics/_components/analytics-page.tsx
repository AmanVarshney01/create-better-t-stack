"use client";

import Footer from "../../_components/footer";
import { AnalyticsHeader } from "./analytics-header";
import { DevToolsSection } from "./dev-environment-charts";
import { MetricsCards } from "./metrics-cards";
import { StackSection } from "./stack-configuration-charts";
import { TimelineSection } from "./timeline-charts";
import type { AggregatedAnalyticsData } from "./types";

export default function AnalyticsPage({
	data,
}: {
	data: AggregatedAnalyticsData;
}) {
	return (
		<div className="mx-auto min-h-svh max-w-[1280px]">
			<div className="container mx-auto space-y-10 px-4 py-8 pt-16">
				<AnalyticsHeader
					totalProjects={data.totalProjects}
					lastUpdated={data.lastUpdated}
				/>

				<MetricsCards data={data} />

				<TimelineSection data={data} />

				<StackSection data={data} />

				<DevToolsSection data={data} />
			</div>
			<Footer />
		</div>
	);
}
