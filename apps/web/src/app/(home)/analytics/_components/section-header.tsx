import type { ReactNode } from "react";

export function SectionHeader({
  label,
  title,
  description,
  aside,
}: {
  label: string;
  title: string;
  description: string;
  aside?: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-3">
        <span className="font-mono text-[10px] text-fd-muted-foreground/70 uppercase tracking-[0.10em]">
          {label}
        </span>
        <span aria-hidden="true" className="h-px flex-1 bg-fd-border" />
        {aside}
      </div>
      <div className="space-y-1">
        <h2 className="max-w-3xl text-[15px] leading-[1.5] tracking-[-0.01em]">{title}</h2>
        <p className="max-w-3xl text-[13px] text-fd-muted-foreground leading-[1.55]">
          {description}
        </p>
      </div>
    </div>
  );
}
