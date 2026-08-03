import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function Sep({ className }: { className?: string }) {
  return <span aria-hidden="true" className={cn("h-3 w-px shrink-0 bg-fd-border", className)} />;
}

export function Keycap({ children, dim }: { children: ReactNode; dim?: boolean }) {
  return (
    <span
      className={cn(
        "rounded-[2px] bg-foreground px-1 py-px font-medium text-background",
        dim && "opacity-40",
      )}
    >
      {children}
    </span>
  );
}

export function GroupHeader({ label, count }: { label: string; count?: ReactNode }) {
  return (
    <div className="mb-3 flex items-center gap-3">
      <span className="font-mono text-[10px] text-fd-muted-foreground/70 uppercase tracking-[0.10em]">
        {label}
      </span>
      <span aria-hidden="true" className="h-px flex-1 bg-fd-border" />
      {count !== undefined && (
        <span className="font-mono text-[10px] text-fd-muted-foreground/50 tabular-nums">
          {count}
        </span>
      )}
    </div>
  );
}

export function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-1.5">
      <span className="font-mono text-[11px] text-fd-muted-foreground uppercase tracking-[0.08em]">
        {label}
      </span>
      <span className="font-mono text-[13px] tabular-nums">{value}</span>
    </div>
  );
}
