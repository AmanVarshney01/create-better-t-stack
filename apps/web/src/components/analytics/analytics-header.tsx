import { format } from "date-fns";
import { Terminal } from "lucide-react";

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
    <div className="mb-4">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4 sm:flex-nowrap">
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

      <div className="rounded-lg border border-border bg-fd-background p-4 font-mono text-sm shadow-sm transition-colors hover:border-primary/50">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
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

        <div className="my-3 h-px w-full bg-border/50" />

        <div className="space-y-1.5 text-muted-foreground text-xs">
          <div className="flex items-start gap-2">
            <span className="mt-0.5 text-primary shrink-0">&gt;</span>
            <span>No personal data collected - anonymous usage stats only</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="mt-0.5 text-primary shrink-0">&gt;</span>
            <span>
              Source code:{" "}
              <a
                href="https://github.com/AmanVarshney01/create-better-t-stack/blob/main/apps/cli/src/utils/analytics.ts"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline underline-offset-2 hover:text-primary"
              >
                apps/cli/src/utils/analytics.ts
              </a>
            </span>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2 rounded border border-border/50 bg-muted/20 p-3 text-xs">
          <div className="flex items-center gap-2 font-semibold">
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
