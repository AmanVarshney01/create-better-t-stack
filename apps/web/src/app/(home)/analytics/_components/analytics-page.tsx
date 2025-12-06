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
	range,
	onRangeChange,
	legacy,
}: {
	data: AggregatedAnalyticsData;
	range: "all" | "30d" | "7d" | "1d";
	onRangeChange: (value: "all" | "30d" | "7d" | "1d") => void;
	legacy: {
		total: number;
		avgPerDay: number;
		lastUpdatedIso: string;
		source: string;
	};
}) {
	return (
		<div className="mx-auto min-h-svh">
			<div className="container mx-auto space-y-10 px-4 py-8 pt-16">
				<AnalyticsHeader
					totalProjects={data.totalProjects}
					lastUpdated={data.lastUpdated}
					legacy={legacy}
				/>

				<RangeSelector value={range} onChange={onRangeChange} />

				<MetricsCards data={data} />

				<TimelineSection data={data} />

				<StackSection data={data} />

				<DevToolsSection data={data} />
			</div>
			<Footer />
		</div>
	);
}

function RangeSelector({
	value,
	onChange,
}: {
	value: "all" | "30d" | "7d" | "1d";
	onChange: (val: "all" | "30d" | "7d" | "1d") => void;
}) {
	const options: Array<{ value: "all" | "30d" | "7d" | "1d"; label: string }> =
		[
			{ value: "all", label: "All time" },
			{ value: "30d", label: "Last 30 days" },
			{ value: "7d", label: "Last 7 days" },
			{ value: "1d", label: "Today" },
		];

	return (
		<div className="flex flex-wrap items-center gap-2">
			<span className="text-muted-foreground text-sm">Range:</span>
			<div className="flex flex-wrap gap-2">
				{options.map((opt) => (
					<button
						key={opt.value}
						type="button"
						onClick={() => onChange(opt.value)}
						className={`rounded border px-3 py-1 text-sm transition-colors ${
							value === opt.value
								? "border-primary bg-primary/10 text-primary"
								: "border-border text-foreground hover:bg-muted/60"
						}`}
					>
						{opt.label}
					</button>
				))}
			</div>
		</div>
	);
}
