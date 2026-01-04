"use client";

import type { AggregatedAnalyticsData } from "./types";

import Footer from "../../_components/footer";
import { AnalyticsHeader } from "./analytics-header";
import { DevToolsSection } from "./dev-environment-charts";
import { LiveLogs } from "./live-logs";
import { MetricsCards } from "./metrics-cards";
import { StackSection } from "./stack-configuration-charts";
import { TimelineSection } from "./timeline-charts";

export default function AnalyticsPage({
  data,
  legacy,
}: {
  data: AggregatedAnalyticsData;
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
        <AnalyticsHeader lastUpdated={data.lastUpdated} legacy={legacy} />

        <MetricsCards data={data} />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-3">
            <LiveLogs />
          </div>
        </div>

        <TimelineSection data={data} />

        <StackSection data={data} />

        <DevToolsSection data={data} />
      </div>
      <Footer />
    </div>
  );
}
