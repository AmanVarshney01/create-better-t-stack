import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

/** The one page-heading shape shared by /analytics, /showcase and /sponsors. */
export function PageHeader({
  icon: Icon,
  title,
  description,
  count,
  meta,
  actions,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  count?: number;
  meta?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      {/* min-h-8 so a tall action button cannot shift the title row off the
          baseline the other pages sit on. */}
      <div className="flex min-h-8 flex-wrap items-center gap-x-3 gap-y-2">
        <Icon aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-primary" />
        <h1 className="font-mono text-[11px] uppercase tracking-[0.08em]">{title}</h1>
        <span aria-hidden="true" className="h-px min-w-4 flex-1 bg-fd-border" />
        {count !== undefined && (
          <span className="font-mono text-[10px] text-fd-muted-foreground/50 tabular-nums">
            {count}
          </span>
        )}
        {meta && (
          <span className="font-mono text-[10px] text-fd-muted-foreground uppercase tracking-[0.10em] tabular-nums">
            {meta}
          </span>
        )}
        {actions}
      </div>
      {description && (
        <p className="font-mono text-[15px] text-fd-muted-foreground leading-[1.5] tracking-[-0.01em]">
          {description}
        </p>
      )}
    </div>
  );
}
