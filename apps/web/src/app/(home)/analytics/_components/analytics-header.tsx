import { Activity, DatabaseZap, Terminal } from "lucide-react";

import { cn } from "@/lib/utils";

import { formatCompactNumber } from "./analytics-helpers";

const utcDateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "UTC",
});

const utcDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

function formatUtcDateTime(value: string) {
  return `${utcDateTimeFormatter.format(new Date(value))} UTC`;
}

function formatUtcDate(value: string) {
  return utcDateFormatter.format(new Date(value));
}

function HeaderStat({
  label,
  value,
  detail,
}: {
  label: string;
  value: string | number;
  detail: string;
}) {
  return (
    <div className="rounded border border-border bg-fd-background p-4">
      <div className="font-mono text-[11px] text-muted-foreground uppercase tracking-wide">
        {label}
      </div>
      <div className="mt-3 font-semibold text-2xl">{value}</div>
      <p className="mt-2 text-muted-foreground text-xs leading-5">{detail}</p>
    </div>
  );
}

export function AnalyticsHeader({
  lastUpdated,
  liveTotal,
  trackingDays,
  legacy,
  connectionStatus,
}: {
  lastUpdated: string | null;
  liveTotal: number;
  trackingDays: number;
  legacy: {
    total: number;
    avgPerDay: number;
    lastUpdatedIso: string;
    source: string;
  };
  connectionStatus: "online" | "connecting" | "reconnecting" | "offline";
}) {
  const formattedDate = lastUpdated ? formatUtcDateTime(lastUpdated) : null;
  const legacyDate = formatUtcDate(legacy.lastUpdatedIso);
  const statusMeta = {
    online: {
      label: "Streaming",
      textClass: "text-primary",
      dotClass: "bg-primary",
    },
    connecting: {
      label: "Connecting",
      textClass: "text-muted-foreground",
      dotClass: "bg-muted-foreground",
    },
    reconnecting: {
      label: "Reconnecting",
      textClass: "text-chart-3",
      dotClass: "bg-chart-3",
    },
    offline: {
      label: "Offline",
      textClass: "text-destructive",
      dotClass: "bg-destructive",
    },
  }[connectionStatus];

  return (
    <section className="space-y-5">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-3 sm:flex-nowrap">
        <div className="flex min-w-0 items-center gap-2">
          <Terminal className="h-5 w-5 shrink-0 text-primary" />
          <div className="min-w-0">
            <h1 className="font-bold font-mono text-lg sm:text-xl">ANALYTICS.SH</h1>
            <p className="text-muted-foreground text-sm">
              Aggregate CLI telemetry for create-better-t-stack.
            </p>
          </div>
        </div>
        <div className="hidden h-px flex-1 bg-border sm:block" />
        <div className="flex items-center gap-2 rounded border border-border bg-fd-background px-3 py-2 font-mono text-xs">
          <Activity className={cn("h-3.5 w-3.5", statusMeta.textClass)} />
          <span className={cn("h-2 w-2 rounded-full", statusMeta.dotClass)} />
          <span className={statusMeta.textClass}>{statusMeta.label}</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <HeaderStat
          label="Live projects"
          value={formatCompactNumber(liveTotal)}
          detail="Project creations tracked in the current Convex stream."
        />
        <HeaderStat
          label="Tracked span"
          value={trackingDays}
          detail="Calendar days represented in the live telemetry dataset."
        />
        <HeaderStat
          label="Archive total"
          value={formatCompactNumber(legacy.total)}
          detail={`Historical creations from the pre-Convex archive through ${legacyDate}.`}
        />
        <HeaderStat
          label="Archive pace"
          value={legacy.avgPerDay.toFixed(1)}
          detail="Average project creations per day in the historical snapshot."
        />
      </div>

      <div className="rounded border border-border bg-fd-background p-4">
        <div className="grid gap-3 text-sm md:grid-cols-4">
          <div className="flex items-center gap-2">
            <DatabaseZap className="h-4 w-4 text-primary" />
            <span className="font-mono text-xs text-muted-foreground uppercase">Telemetry</span>
          </div>
          <div className="flex items-center justify-between gap-3 md:block">
            <span className="text-muted-foreground">Latest event</span>
            <div className="font-medium md:mt-1">{formattedDate ?? "Waiting"}</div>
          </div>
          <div className="flex items-center justify-between gap-3 md:block">
            <span className="text-muted-foreground">Archive snapshot</span>
            <div className="font-medium md:mt-1">{legacyDate}</div>
          </div>
          <div className="flex items-center justify-between gap-3 md:block">
            <span className="text-muted-foreground">Source</span>
            <div className="font-medium md:mt-1">{legacy.source}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
