import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export function AnalyticsSources() {
  return (
    <div className="rounded-[4px] border p-4">
      <div className="mb-3 flex items-center gap-3">
        <span className="text-[11px] text-fd-muted-foreground uppercase tracking-[0.08em]">
          Source map
        </span>
        <span aria-hidden="true" className="h-px flex-1 bg-fd-border" />
      </div>

      <div className="divide-y">
        <Link
          href="https://github.com/AmanVarshney01/create-better-t-stack/blob/main/apps/cli/src/utils/analytics.ts"
          target="_blank"
          rel="noopener noreferrer"
          className="builder-focus-ring group flex items-center justify-between gap-3 py-2.5"
        >
          <span className="min-w-0">
            <span className="block text-[10px] text-fd-muted-foreground uppercase tracking-[0.10em]">
              CLI sender
            </span>
            <span className="block break-words text-[13px] leading-[1.55] transition-colors duration-150 group-hover:text-primary">
              apps/cli/src/utils/analytics.ts
            </span>
          </span>
          <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-fd-muted-foreground transition-colors duration-150 group-hover:text-primary" />
        </Link>

        <Link
          href="https://github.com/AmanVarshney01/create-better-t-stack/blob/main/packages/backend/convex/analytics.ts"
          target="_blank"
          rel="noopener noreferrer"
          className="builder-focus-ring group flex items-center justify-between gap-3 py-2.5"
        >
          <span className="min-w-0">
            <span className="block text-[10px] text-fd-muted-foreground uppercase tracking-[0.10em]">
              Aggregator
            </span>
            <span className="block break-words text-[13px] leading-[1.55] transition-colors duration-150 group-hover:text-primary">
              packages/backend/convex/analytics.ts
            </span>
          </span>
          <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-fd-muted-foreground transition-colors duration-150 group-hover:text-primary" />
        </Link>

        <Link
          href="https://umami.amanv.cloud/share/pHvqHleyOl9PBfaK"
          target="_blank"
          rel="noopener noreferrer"
          className="builder-focus-ring group flex items-center justify-between gap-3 py-2.5"
        >
          <span className="min-w-0">
            <span className="block text-[10px] text-fd-muted-foreground uppercase tracking-[0.10em]">
              Website analytics
            </span>
            <span className="block break-words text-[13px] leading-[1.55] transition-colors duration-150 group-hover:text-primary">
              Umami dashboard
            </span>
          </span>
          <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-fd-muted-foreground transition-colors duration-150 group-hover:text-primary" />
        </Link>
      </div>

      <p className="mt-4 text-[11px] text-fd-muted-foreground leading-[1.5]">
        No personal data is collected here. The page only surfaces aggregate CLI usage and a small
        live event feed for recent anonymous activity.
      </p>
    </div>
  );
}
