import type { CSSProperties, ReactNode } from "react";

import { cn } from "@/lib/utils";

export default function Pane({
  id,
  index,
  title,
  width,
  count,
  footer,
  children,
}: {
  id: string;
  index: number;
  title: string;
  width: string;
  count?: number;
  footer?: ReactNode;
  children: ReactNode;
}) {
  // overflow-hidden is desktop-only: on mobile it would make the section the
  // sticky scrollport and offset the header into the pane instead of under the nav.
  return (
    <section
      id={id}
      data-index={index}
      data-active={index === 0 ? "true" : "false"}
      aria-labelledby={`${id}-title`}
      style={{ "--pane-w": width } as CSSProperties}
      className="group/pane flex w-full shrink-0 scroll-mt-14 flex-col border-b md:h-full md:w-[var(--pane-w)] md:max-w-full md:grow md:scroll-mt-0 md:overflow-hidden md:border-b-0 md:border-l md:first:border-l-0"
    >
      <header className="flex h-8 shrink-0 items-center gap-2 border-b px-6 max-md:sticky max-md:top-14 max-md:z-20 max-md:bg-fd-background max-md:px-5">
        <span
          aria-hidden="true"
          className="text-[10px] leading-none text-fd-muted-foreground/50 group-data-[active=true]/pane:hidden"
        >
          ·
        </span>
        <span
          aria-hidden="true"
          className="hidden text-[10px] leading-none text-primary group-data-[active=true]/pane:inline"
        >
          •
        </span>
        <h2
          id={`${id}-title`}
          className="font-mono text-[11px] text-fd-muted-foreground uppercase tracking-[0.08em]"
        >
          {title}
        </h2>
        {count !== undefined && (
          <span className="ml-auto font-mono text-[10px] text-fd-muted-foreground/60 tabular-nums">
            {count}
          </span>
        )}
        <span
          aria-hidden="true"
          className={cn(
            "font-mono text-[10px] text-fd-muted-foreground/40 tabular-nums",
            count === undefined && "ml-auto",
          )}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      </header>

      <div
        data-pane-scroll
        className="fd-scroll-container flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-y-contain px-6 py-6 max-md:px-5 max-md:py-6"
      >
        {children}
      </div>

      {footer && <div className="shrink-0 border-t px-6 py-3 max-md:px-5">{footer}</div>}
    </section>
  );
}
