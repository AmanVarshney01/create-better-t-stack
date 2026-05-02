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
      <div className="flex flex-wrap items-center gap-3">
        <span className="font-mono font-semibold text-foreground text-sm">{label}</span>
        <div className="hidden h-px flex-1 bg-border sm:block" />
        {aside}
      </div>
      <div className="space-y-1.5">
        <h2 className="max-w-3xl font-semibold text-lg sm:text-xl">{title}</h2>
        <p className="max-w-3xl text-muted-foreground text-sm leading-6">{description}</p>
      </div>
    </div>
  );
}
