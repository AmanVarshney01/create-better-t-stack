"use client";

import Footer from "../../_components/footer";
import { AnalyticsHeader } from "./analytics-header";
import { AnalyticsSources } from "./analytics-sources";
import { DevToolsSection } from "./dev-environment-charts";
import { LiveLogs } from "./live-logs";
import { MetricsCards } from "./metrics-cards";
import { StackSection } from "./stack-configuration-charts";
import { TimelineSection } from "./timeline-charts";
import type { AggregatedAnalyticsData } from "./types";

export default function AnalyticsPage({
  data,
  legacy,
  connectionStatus,
}: {
  data: AggregatedAnalyticsData;
  legacy: {
    total: number;
    avgPerDay: number;
    lastUpdatedIso: string;
    source: string;
  };
  connectionStatus: "online" | "connecting" | "reconnecting" | "offline";
}) {
  return (
    <main className="container mx-auto min-h-svh">
      <div className="mx-auto flex flex-col gap-8 px-4 pt-12">
        <AnalyticsHeader
          lastUpdated={data.lastUpdated}
          liveTotal={data.totalProjects}
          trackingDays={data.momentum.trackingDays}
          legacy={legacy}
          connectionStatus={connectionStatus}
        />

        <LiveLogs />

        <MetricsCards data={data} />

        <TimelineSection data={data} />

        <StackSection data={data} />

        <DevToolsSection data={data} />

        <div className="max-w-xl">
          <AnalyticsSources />
        </div>
      </div>
      <Footer />
    </main>
  );
}
