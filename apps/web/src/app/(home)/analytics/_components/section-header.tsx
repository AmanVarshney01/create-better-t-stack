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
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-bold font-mono text-lg">{label.toUpperCase()}</span>
        <div className="hidden h-px flex-1 bg-border/45 sm:block" />
        {aside}
      </div>
      <div className="space-y-1.5">
        <h2 className="max-w-3xl font-semibold text-xl tracking-tight sm:text-2xl">{title}</h2>
        <p className="max-w-3xl text-muted-foreground text-sm leading-6">{description}</p>
      </div>
    </div>
  );
}
