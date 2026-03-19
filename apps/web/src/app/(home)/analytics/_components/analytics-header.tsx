import { Activity, Radio } from "lucide-react";

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
      label: "streaming",
      textClass: "text-primary",
      dotClass: "bg-primary",
    },
    connecting: {
      label: "connecting",
      textClass: "text-muted-foreground",
      dotClass: "bg-muted-foreground",
    },
    reconnecting: {
      label: "reconnecting",
      textClass: "text-accent",
      dotClass: "bg-accent",
    },
    offline: {
      label: "offline",
      textClass: "text-destructive",
      dotClass: "bg-destructive",
    },
  }[connectionStatus];

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary">
            <Activity className="h-5 w-5" />
            <h1 className="font-bold font-mono text-xl sm:text-2xl">CLI_ANALYTICS.JSON</h1>
          </div>
          <p className="max-w-2xl text-muted-foreground text-sm">
            Usage analytics for Better T Stack, combining the live telemetry stream with the
            historical archive in the site’s existing terminal-style UI.
          </p>
        </div>
      </div>

      <div className="rounded-xl bg-fd-background/85 p-5 ring-1 ring-border/35">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em]",
              statusMeta.textClass,
              "bg-muted/30",
            )}
          >
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                statusMeta.dotClass,
                connectionStatus !== "online" && "animate-pulse",
              )}
            />
            {statusMeta.label}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-muted/30 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            <Radio className="h-3 w-3" />
            anonymous telemetry
          </span>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-lg bg-muted/20 p-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
              live projects
            </div>
            <div className="mt-2 font-semibold text-3xl tracking-tight">
              {formatCompactNumber(liveTotal)}
            </div>
            <p className="mt-2 text-muted-foreground text-xs leading-5">
              Project creations tracked in the live Convex telemetry stream.
            </p>
          </div>

          <div className="rounded-lg bg-muted/20 p-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
              tracked span
            </div>
            <div className="mt-2 font-semibold text-3xl tracking-tight">{trackingDays}</div>
            <p className="mt-2 text-muted-foreground text-xs leading-5">
              Calendar days represented in the live dataset.
            </p>
          </div>

          <div className="rounded-lg bg-muted/20 p-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
              archive total
            </div>
            <div className="mt-2 font-semibold text-3xl tracking-tight">
              {formatCompactNumber(legacy.total)}
            </div>
            <p className="mt-2 text-muted-foreground text-xs leading-5">
              Historical project creations from the pre-Convex archive through {legacyDate}.
            </p>
          </div>

          <div className="rounded-lg bg-muted/20 p-4">
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
              <Activity className="h-3.5 w-3.5 text-primary" />
              telemetry status
            </div>

            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Convex stream</span>
                <span className={cn("font-medium", statusMeta.textClass)}>{statusMeta.label}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Latest event</span>
                <span className="text-right text-foreground/90">
                  {formattedDate ?? "Waiting for first event"}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Archive snapshot</span>
                <span className="text-right text-foreground/90">{legacyDate}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
