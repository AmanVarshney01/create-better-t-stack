import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { lazy, Suspense, useEffect, useState } from "react";

import { ThemeToggle } from "@/components/theme-toggle";

const NavbarStats = lazy(async () => {
  const mod = await import("@/components/navbar-stats");
  return { default: mod.NavbarStats };
});

export function Navbar() {
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    const onIdle = () => setShowStats(true);

    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      const id = window.requestIdleCallback(onIdle, { timeout: 2000 });
      return () => window.cancelIdleCallback(id);
    }

    const timeout = globalThis.setTimeout(onIdle, 600);
    return () => globalThis.clearTimeout(timeout);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm">
      <nav className="container mx-auto flex h-14 items-center justify-between px-6">
        {/* Logo + Builder */}
        <div className="flex items-center gap-4 sm:gap-6">
          <Link
            to="/"
            className="flex items-center gap-2 font-mono text-base font-bold tracking-tight sm:text-lg"
          >
            better<span className="text-muted-foreground">fullstack</span>
            <span className="rounded border border-border px-1.5 py-0.5 text-[9px] font-semibold leading-none tracking-wide text-muted-foreground">
              Alpha
            </span>
          </Link>
          <Link
            to="/new"
            search={{ view: "command", file: "" }}
            className="text-xs text-muted-foreground transition-colors hover:text-foreground sm:text-sm"
          >
            Builder
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-4 sm:gap-6">
          {showStats ? (
            <Suspense
              fallback={
                <>
                  <div className="hidden h-4 w-12 animate-pulse rounded bg-muted sm:block" />
                  <div className="hidden h-4 w-12 animate-pulse rounded bg-muted sm:block" />
                </>
              }
            >
              <NavbarStats />
            </Suspense>
          ) : (
            <>
              <div className="hidden h-4 w-12 animate-pulse rounded bg-muted sm:block" />
              <div className="hidden h-4 w-12 animate-pulse rounded bg-muted sm:block" />
            </>
          )}

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <Link
              to="/new"
              search={{ view: "command", file: "" }}
              className="inline-flex items-center gap-1 rounded-lg bg-foreground px-2.5 py-1.5 text-xs font-medium text-background transition-colors hover:bg-foreground/90 sm:gap-1.5 sm:px-3 sm:text-sm"
            >
              Try now
              <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
