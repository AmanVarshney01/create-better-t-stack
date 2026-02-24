import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { GitHubStats } from "@/components/github-stats";
import { NpmDownloads } from "@/components/npm-downloads";
import { ThemeToggle } from "@/components/theme-toggle";

export function Navbar() {
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
            <span className="rounded border border-border px-1.5 py-0.5 font-pixel text-[9px] text-muted-foreground">
              Alpha
            </span>
          </Link>
          <Link
            to="/new"
            className="text-xs text-muted-foreground transition-colors hover:text-foreground sm:text-sm"
          >
            Builder
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-4 sm:gap-6">
          <GitHubStats />
          <NpmDownloads />

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <Link
              to="/new"
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
