import { Activity, DatabaseZap, Terminal } from "lucide-react";

import { cn } from "@/lib/utils";

import { PageHeader } from "../../_components/page-header";
import { formatCompactNumber } from "./analytics-helpers";

// Feb-Nov 2025 PostHog era, estimated from npm downloads (92.8k) times the
// tracked era's projects-per-download ratio (~0.64)
const UNTRACKED_ERA_PROJECT_ESTIMATE = 59_000;

const utcDateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "UTC",
});

function formatUtcDateTime(value: string) {
  return `${utcDateTimeFormatter.format(new Date(value))} UTC`;
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
    <div className="min-w-0 border-t pt-3">
      <div className="font-mono text-[11px] text-fd-muted-foreground uppercase tracking-[0.08em]">
        {label}
      </div>
      <div className="mt-2 font-medium text-[20px] tabular-nums tracking-[-0.02em]">{value}</div>
      <p className="mt-1.5 text-[11px] text-fd-muted-foreground leading-[1.5]">{detail}</p>
    </div>
  );
}

export function AnalyticsHeader({
  lastUpdated,
  liveTotal,
  trackingDays,
  connectionStatus,
}: {
  lastUpdated: string | null;
  liveTotal: number;
  trackingDays: number;
  connectionStatus: "online" | "connecting" | "reconnecting" | "offline";
}) {
  const formattedDate = lastUpdated ? formatUtcDateTime(lastUpdated) : null;
  const statusMeta = {
    online: {
      label: "Streaming",
      textClass: "text-primary",
      dotClass: "bg-primary",
    },
    connecting: {
      label: "Connecting",
      textClass: "text-fd-muted-foreground",
      dotClass: "bg-fd-muted-foreground",
    },
    reconnecting: {
      label: "Reconnecting",
      textClass: "text-fd-muted-foreground",
      dotClass: "bg-fd-muted-foreground",
    },
    offline: {
      label: "Offline",
      textClass: "text-destructive",
      dotClass: "bg-destructive",
    },
  }[connectionStatus];

  return (
    <section className="space-y-5">
      <PageHeader
        icon={Terminal}
        title="ANALYTICS.SH"
        description="Aggregate CLI telemetry for create-better-t-stack."
        actions={
          <span className="flex shrink-0 items-center gap-2 font-mono text-[10px] uppercase tracking-[0.10em]">
            <Activity className={cn("h-3 w-3", statusMeta.textClass)} />
            <span aria-hidden="true" className={cn("h-1.5 w-1.5", statusMeta.dotClass)} />
            <span className={statusMeta.textClass}>{statusMeta.label}</span>
          </span>
        }
      />

      <div className="grid gap-x-6 gap-y-4 md:grid-cols-2">
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
      </div>

      <div className="border-t pt-3">
        <div className="flex items-start gap-2 text-[13px] leading-[1.55]">
          <span className="text-primary">$</span>
          <span className="text-fd-muted-foreground">
            These numbers undercount real usage. The CLI shipped in Feb 2025, but this dataset only
            goes back to Dec 2025. Earlier telemetry lived in PostHog and isn't included. Counting
            that period via npm download volume, estimated all-time usage is around{" "}
            {formatCompactNumber(liveTotal + UNTRACKED_ERA_PROJECT_ESTIMATE)} projects.
          </span>
        </div>
      </div>

      <div className="border-t pt-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <DatabaseZap className="h-3.5 w-3.5 text-primary" />
            <span className="text-[11px] text-fd-muted-foreground uppercase tracking-[0.08em]">
              Telemetry
            </span>
          </div>
          <div className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="text-[11px] text-fd-muted-foreground uppercase tracking-[0.08em]">
              Latest event
            </span>
            <span className="text-[13px] tabular-nums">{formattedDate ?? "Waiting"}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
