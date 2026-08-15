"use client";

import { PageShell } from "../../_components/page-shell";
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
  connectionStatus,
}: {
  data: AggregatedAnalyticsData;
  connectionStatus: "online" | "connecting" | "reconnecting" | "offline";
}) {
  return (
    <PageShell>
      <AnalyticsHeader
        lastUpdated={data.lastUpdated}
        liveTotal={data.totalProjects}
        trackingDays={data.momentum.trackingDays}
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
    </PageShell>
  );
}
