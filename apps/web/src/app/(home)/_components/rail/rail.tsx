"use client";

import { type ReactNode, useMemo, useRef } from "react";

import { PANES } from "./panes-config";
import { RailContext } from "./rail-context";
import StatusBar from "./status-bar";
import { useRailNav } from "./use-rail-nav";

export default function Rail({ children }: { children: ReactNode }) {
  const railRef = useRef<HTMLDivElement>(null);
  const { activeIndex, atStart, atEnd, goTo } = useRailNav(railRef);

  const value = useMemo(
    () => ({ activeIndex, atStart, atEnd, goTo }),
    [activeIndex, atStart, atEnd, goTo],
  );

  return (
    <RailContext.Provider value={value}>
      {/* overflow-x-clip, not -hidden: hidden would make this the sticky containing
          block and unpin the mobile status bar. */}
      <div className="flex w-full flex-col overflow-x-clip md:h-[calc(100svh-3.5rem)] md:overflow-hidden">
        <a
          href={`#${PANES[PANES.length - 1].id}`}
          className="sr-only font-mono text-[11px] uppercase tracking-[0.08em] focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-fd-background focus:px-3 focus:py-2 focus:text-fd-foreground focus:outline focus:outline-primary"
        >
          Skip to site links
        </a>

        <div
          id="bts-rail"
          ref={railRef}
          role="group"
          aria-label="Homepage sections, arranged horizontally"
          className="fd-scroll-container flex min-h-0 flex-1 flex-col md:flex-row md:overflow-x-auto md:overflow-y-hidden md:overscroll-x-contain"
        >
          {children}
        </div>

        <StatusBar />
      </div>
    </RailContext.Provider>
  );
}
