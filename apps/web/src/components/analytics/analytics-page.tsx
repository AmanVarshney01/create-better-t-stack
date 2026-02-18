"use client";

"use client";

import { useConvexConnectionState } from "convex/react";

import Footer from "@/components/home/footer";
import { isConvexConfigured } from "@/lib/convex";

import type { AggregatedAnalyticsData } from "./types";

import { AnalyticsHeader, type AnalyticsConnectionStatus } from "./analytics-header";
import { DevToolsSection } from "./dev-environment-charts";
import { LiveLogs } from "./live-logs";
import { MetricsCards } from "./metrics-cards";
import { StackSection } from "./stack-configuration-charts";
import { TimelineSection } from "./timeline-charts";

type AnalyticsPageProps = {
  data: AggregatedAnalyticsData;
  legacy: {
    total: number;
    avgPerDay: number;
    lastUpdatedIso: string;
    source: string;
  };
};

function getConnectionStatus(connectionState: {
  isWebSocketConnected: boolean;
  hasInflightRequests: boolean;
}): AnalyticsConnectionStatus {
  if (connectionState.isWebSocketConnected) return "online";
  if (connectionState.hasInflightRequests) return "reconnecting";
  return "offline";
}

function AnalyticsLayout({
  data,
  legacy,
  connectionStatus,
}: AnalyticsPageProps & { connectionStatus: AnalyticsConnectionStatus }) {
  return (
    <div className="mx-auto min-h-svh">
      <div className="container mx-auto space-y-10 px-4 py-8 pt-16">
        <AnalyticsHeader
          lastUpdated={data.lastUpdated}
          legacy={legacy}
          connectionStatus={connectionStatus}
        />

        <MetricsCards data={data} />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-3">
            <LiveLogs connectionStatus={connectionStatus} />
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

function ConnectedAnalyticsLayout(props: AnalyticsPageProps) {
  const connectionState = useConvexConnectionState();
  const connectionStatus = getConnectionStatus(connectionState);
  return <AnalyticsLayout {...props} connectionStatus={connectionStatus} />;
}

export default function AnalyticsPage({ data, legacy }: AnalyticsPageProps) {
  if (!isConvexConfigured) {
    return <AnalyticsLayout data={data} legacy={legacy} connectionStatus="disabled" />;
  }

  return <ConnectedAnalyticsLayout data={data} legacy={legacy} />;
}
