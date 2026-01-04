"use client";

import { Loader2 } from "lucide-react";

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
  range,
  onRangeChange,
  legacy,
  isLoading,
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
  isLoading?: boolean;
}) {
  return (
    <div className="mx-auto min-h-svh">
      <div className="container mx-auto space-y-10 px-4 py-8 pt-16">
        <AnalyticsHeader
          totalProjects={data.totalProjects}
          lastUpdated={data.lastUpdated}
          legacy={legacy}
        />

        <RangeSelector value={range} onChange={onRangeChange} isLoading={isLoading} />

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

function RangeSelector({
  value,
  onChange,
  isLoading,
}: {
  value: "all" | "30d" | "7d" | "1d";
  onChange: (val: "all" | "30d" | "7d" | "1d") => void;
  isLoading?: boolean;
}) {
  const options: Array<{ value: "all" | "30d" | "7d" | "1d"; label: string }> = [
    { value: "all", label: "All time" },
    { value: "30d", label: "Last 30 days" },
    { value: "7d", label: "Last 7 days" },
    { value: "1d", label: "Today" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-4">
      <span className="font-mono text-muted-foreground text-sm uppercase tracking-wider">
        Range:
      </span>
      <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/30 p-1">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            disabled={isLoading}
            className={`rounded-md px-3 py-1.5 font-medium text-xs transition-all disabled:opacity-50 ${
              value === opt.value
                ? "bg-background text-foreground shadow-sm ring-1 ring-border"
                : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
      {isLoading && (
        <div className="flex items-center gap-2 text-primary">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="font-mono text-xs">syncing...</span>
        </div>
      )}
    </div>
  );
}
