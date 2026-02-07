import type { ReactNode } from "react";

export function ChartCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="group rounded-xl bg-fd-background/85 ring-1 ring-border/35 transition-all duration-200 hover:-translate-y-0.5 hover:ring-primary/35">
      <div className="space-y-4 p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-primary text-xs">$</span>
              <span className="font-semibold font-mono text-sm">{title}</span>
            </div>
            <p className="text-muted-foreground text-xs">{description}</p>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
