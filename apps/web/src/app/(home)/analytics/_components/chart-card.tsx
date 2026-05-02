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
    <section
      className={cn(
        "min-w-0 overflow-hidden rounded border border-border bg-fd-background transition-colors duration-200 hover:border-muted-foreground/30",
        className,
      )}
    >
      <div className="space-y-5 p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-2xl space-y-1.5">
            <h3 className="font-semibold text-sm sm:text-base">{title}</h3>
            <p className="max-w-xl text-muted-foreground text-sm leading-6">{description}</p>
          </div>
          {aside ? <div className="shrink-0">{aside}</div> : null}
        </div>

        <div className={cn("min-w-0 space-y-4", contentClassName)}>{children}</div>

        {footer ? (
          <div className="border-border/35 border-t pt-4 text-muted-foreground text-xs leading-5">
            {footer}
          </div>
        ) : null}
      </div>
    </section>
  );
}
