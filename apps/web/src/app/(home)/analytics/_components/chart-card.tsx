import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function ChartCard({
  title,
  description,
  aside,
  children,
  footer,
  className,
  contentClassName,
}: {
  title: string;
  description: string;
  aside?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  contentClassName?: string;
}) {
  return (
    <section className={cn("min-w-0 rounded-[4px] border", className)}>
      <div className="space-y-4 p-4 sm:p-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <h3 className="shrink-0 font-mono text-[11px] text-fd-muted-foreground uppercase tracking-[0.08em]">
              {title}
            </h3>
            <span aria-hidden="true" className="h-px flex-1 bg-fd-border" />
            {aside ? <div className="shrink-0">{aside}</div> : null}
          </div>
          <p className="max-w-xl text-[13px] text-fd-muted-foreground leading-[1.55]">
            {description}
          </p>
        </div>

        <div className={cn("min-w-0 space-y-4", contentClassName)}>{children}</div>

        {footer ? (
          <div className="border-t pt-3 text-[11px] text-fd-muted-foreground leading-[1.5]">
            {footer}
          </div>
        ) : null}
      </div>
    </section>
  );
}
