import { format } from "date-fns";
import { Terminal } from "lucide-react";
import Link from "next/link";

export function AnalyticsHeader({
  lastUpdated,
  legacy,
}: {
  lastUpdated: string | null;
  legacy: {
    total: number;
    avgPerDay: number;
    lastUpdatedIso: string;
    source: string;
  };
}) {
  const formattedDate = lastUpdated
    ? format(new Date(lastUpdated), "MMM d, yyyy 'at' HH:mm")
    : null;
  const legacyDate = format(new Date(legacy.lastUpdatedIso), "MMM d, yyyy 'at' HH:mm");

  return (
    <div className="mb-4 space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-primary">
            <Terminal className="h-5 w-5" />
            <h1 className="font-bold font-mono text-xl sm:text-2xl">CLI_ANALYTICS.JSON</h1>
          </div>
          <p className="text-muted-foreground text-sm">
            Real-time usage statistics from create-better-t-stack
          </p>
        </div>
      </div>

      <div className="rounded-xl bg-gradient-to-br from-primary/12 via-fd-background to-fd-background/90 p-4 ring-1 ring-border/40 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="text-primary">$</span>
            <span className="text-muted-foreground">status:</span>
            <span className="text-green-500">online</span>
          </div>
          {formattedDate && (
            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <span>last_event:</span>
              <span className="text-foreground">{formattedDate}</span>
            </div>
          )}
        </div>

        <div className="my-3 h-px w-full bg-border/35" />

        <div className="space-y-1.5 text-muted-foreground text-xs">
          <div className="flex items-start gap-2">
            <span className="mt-0.5 shrink-0 text-primary">&gt;</span>
            <span>No personal data collected - anonymous usage stats only</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="mt-0.5 shrink-0 text-primary">&gt;</span>
            <span>
              Source code:{" "}
              <Link
                href="https://github.com/AmanVarshney01/create-better-t-stack/blob/main/apps/cli/src/utils/analytics.ts"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline underline-offset-2 hover:text-primary"
              >
                apps/cli/src/utils/analytics.ts
              </Link>
            </span>
          </div>
        </div>

        <div className="mt-4 rounded-lg bg-muted/25 p-3 text-xs">
          <div className="mb-2 flex items-center gap-2 font-mono font-semibold">
            <span className="text-primary">#</span>
            <span className="text-foreground">Legacy Data (pre-Convex)</span>
          </div>
          <div className="grid grid-cols-1 gap-x-8 gap-y-1 sm:grid-cols-2 md:grid-cols-4">
            <div>
              <span className="text-muted-foreground">Total:</span>{" "}
              <span className="text-foreground">{legacy.total.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Avg/Day:</span>{" "}
              <span className="text-foreground">{legacy.avgPerDay.toFixed(1)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">As of:</span>{" "}
              <span className="text-foreground">{legacyDate}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Source:</span>{" "}
              <span className="text-foreground">{legacy.source}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
