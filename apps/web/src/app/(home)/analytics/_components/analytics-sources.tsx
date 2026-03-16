import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export function AnalyticsSources() {
  return (
    <div className="rounded-xl bg-fd-background/85 p-5 ring-1 ring-border/35">
      <div className="font-mono text-[10px] uppercase tracking-[0.26em] text-muted-foreground">
        source map
      </div>

      <div className="mt-4 space-y-3 text-sm">
        <Link
          href="https://github.com/AmanVarshney01/create-better-t-stack/blob/main/apps/cli/src/utils/analytics.ts"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-between rounded-lg border border-border/40 px-4 py-3 transition-colors hover:border-primary/30 hover:bg-muted/20"
        >
          <span className="min-w-0">
            <span className="block text-muted-foreground text-xs">CLI sender</span>
            <span className="block truncate">apps/cli/src/utils/analytics.ts</span>
          </span>
          <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
        </Link>

        <Link
          href="https://github.com/AmanVarshney01/create-better-t-stack/blob/main/packages/backend/convex/analytics.ts"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-between rounded-lg border border-border/40 px-4 py-3 transition-colors hover:border-primary/30 hover:bg-muted/20"
        >
          <span className="min-w-0">
            <span className="block text-muted-foreground text-xs">Aggregator</span>
            <span className="block truncate">packages/backend/convex/analytics.ts</span>
          </span>
          <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
        </Link>

        <Link
          href="https://umami.amanv.cloud/share/pHvqHleyOl9PBfaK"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-between rounded-lg border border-border/40 px-4 py-3 transition-colors hover:border-primary/30 hover:bg-muted/20"
        >
          <span className="min-w-0">
            <span className="block text-muted-foreground text-xs">Website analytics</span>
            <span className="block truncate">Umami dashboard</span>
          </span>
          <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
        </Link>
      </div>

      <p className="mt-4 text-muted-foreground text-xs leading-5">
        No personal data is collected here. The page only surfaces aggregate CLI usage and a small
        live event feed for recent anonymous activity.
      </p>
    </div>
  );
}
