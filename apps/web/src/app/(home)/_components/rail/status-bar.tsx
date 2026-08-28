"use client";

import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

import { useNpmVersion } from "./_hooks/use-npm-version";
import { useProjectStats } from "./_hooks/use-project-stats";
import { Keycap, Sep } from "./chrome";
import { PANES } from "./panes-config";
import { useRail } from "./rail-context";

function Metric({ value, unit }: { value: number | null; unit: string }) {
  return (
    <span className="inline-flex items-baseline gap-1">
      <span className="min-w-[7ch] text-right tabular-nums">
        {value === null ? "—" : value.toLocaleString("en-US")}
      </span>
      <span>{unit}</span>
    </span>
  );
}

export default function StatusBar() {
  const { activeIndex, atStart, atEnd, goTo } = useRail();
  const version = useNpmVersion();
  const stats = useProjectStats();

  return (
    <footer className="flex h-7 shrink-0 items-center gap-x-3 gap-y-0.5 border-t px-4 font-mono text-[10px] uppercase tracking-[0.10em] max-md:sticky max-md:bottom-0 max-md:z-30 max-md:h-auto max-md:flex-wrap max-md:bg-fd-background max-md:py-1">
      <span className="flex shrink-0 items-center gap-1.5 font-medium">
        <span aria-hidden="true" className="text-primary">
          •
        </span>
        better-t-stack
      </span>

      <Sep className="max-lg:hidden" />

      <nav
        aria-label="Pane navigation"
        className="no-scrollbar flex items-center gap-3 overflow-x-auto whitespace-nowrap max-md:order-1 max-md:w-full md:hidden lg:flex lg:overflow-x-visible"
      >
        {PANES.map((pane, index) => {
          const active = index === activeIndex;
          return (
            <button
              key={pane.id}
              type="button"
              onClick={() => {
                track("home_rail_navigate", { pane: pane.id, method: "click" });
                goTo(index);
              }}
              aria-current={active ? "true" : undefined}
              className={cn(
                "builder-focus-ring shrink-0 uppercase tracking-[0.10em] transition-colors duration-150 max-md:py-2",
                active ? "text-fd-foreground" : "text-fd-muted-foreground hover:text-fd-foreground",
              )}
            >
              {index + 1}:{pane.label}
              {active ? "*" : ""}
            </button>
          );
        })}
      </nav>

      <span className="hidden text-fd-muted-foreground tabular-nums md:block lg:hidden">
        pane {activeIndex + 1}/{PANES.length}
      </span>

      <span className="flex-1" />

      <span className="hidden items-center gap-2 text-fd-muted-foreground md:flex">
        <Metric value={stats.totalProjects} unit="projects" />
        <span aria-hidden="true">·</span>
        <Metric value={stats.starCount} unit="stars" />
        <span aria-hidden="true">·</span>
        <Metric value={stats.downloadCount} unit="dl" />
      </span>

      <Sep className="hidden md:inline-block" />

      <span className="shrink-0 text-primary">v{version}</span>

      <span className="hidden shrink-0 items-center gap-1.5 lg:flex">
        <Keycap dim={atStart}>h</Keycap>
        <Keycap dim={atEnd}>l</Keycap>
        <span className="text-fd-muted-foreground">move</span>
        <Keycap>1-{PANES.length}</Keycap>
        <span className="text-fd-muted-foreground">jump</span>
      </span>
    </footer>
  );
}
