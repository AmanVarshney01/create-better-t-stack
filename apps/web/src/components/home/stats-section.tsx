"use client";
import { api } from "@better-fullstack/backend/convex/_generated/api";
import NumberFlow from "@number-flow/react";
import { useQuery } from "convex/react";
import { BarChart3, Github, Package, Star, Terminal, TrendingUp, Users } from "lucide-react";

import { isConvexConfigured } from "@/lib/convex";

function StatsSectionContent() {
  const stats = useQuery(api.analytics.getStats, {});
  const dailyStats = useQuery(api.analytics.getDailyStats, {});

  const totalProjects = stats?.totalProjects ?? 0;
  const avgProjectsPerDay =
    dailyStats && dailyStats.length > 0 ? (totalProjects / dailyStats.length).toFixed(2) : "0";
  const lastUpdated = stats?.lastEventTime
    ? new Date(stats.lastEventTime).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div className="group cursor-pointer rounded border border-border bg-fd-background p-4 transition-colors hover:bg-muted/10">
        <div className="mb-3 flex items-center gap-2">
          <Terminal className="h-4 w-4 text-primary" />
          <span className="font-semibold font-mono text-sm sm:text-base">CLI_ANALYTICS.JSON</span>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 font-mono text-muted-foreground text-xs uppercase tracking-wide">
              <BarChart3 className="h-3 w-3" />
              Total Projects
            </span>
            <NumberFlow
              value={totalProjects}
              className="font-bold font-mono text-lg text-primary tabular-nums"
              transformTiming={{
                duration: 1000,
                easing: "ease-out",
              }}
              trend={1}
              willChange
              isolate
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 font-mono text-muted-foreground text-xs uppercase tracking-wide">
              <TrendingUp className="h-3 w-3" />
              Avg/Day
            </span>
            <span className="font-mono text-foreground text-sm">{avgProjectsPerDay}</span>
          </div>

          <div className="border-border/50 border-t pt-3">
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="font-mono text-muted-foreground">Last Updated</span>
              <span className="truncate font-mono text-accent">
                {lastUpdated ||
                  new Date().toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
              </span>
            </div>
          </div>
        </div>
      </div>

      <a
        href="https://github.com/Marve10s/Better-Fullstack"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="group cursor-pointer rounded border border-border bg-fd-background p-4 transition-colors hover:bg-muted/10">
          <div className="mb-3 flex items-center gap-2">
            <Github className="h-4 w-4 text-primary" />
            <span className="font-semibold font-mono text-sm sm:text-base">GITHUB_REPO.GIT</span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 font-mono text-muted-foreground text-xs uppercase tracking-wide">
                <Star className="h-3 w-3" />
                Stars
              </span>
              <span className="font-bold font-mono text-lg text-primary tabular-nums">—</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 font-mono text-muted-foreground text-xs uppercase tracking-wide">
                <Users className="h-3 w-3" />
                Contributors
              </span>
              <span className="font-mono text-foreground text-sm">—</span>
            </div>

            <div className="border-border/50 border-t pt-3">
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="font-mono text-muted-foreground">Repository</span>
                <span className="truncate font-mono text-accent">Marve10s/Better-Fullstack</span>
              </div>
            </div>
          </div>
        </div>
      </a>

      <a
        href="https://www.npmjs.com/package/create-better-fullstack"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="group cursor-pointer rounded border border-border bg-fd-background p-4 transition-colors hover:bg-muted/10">
          <div className="mb-3 flex items-center gap-2">
            <Terminal className="h-4 w-4 text-primary" />
            <span className="font-semibold font-mono text-sm sm:text-base">NPM_PACKAGE.JS</span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 font-mono text-muted-foreground text-xs uppercase tracking-wide">
                <Package className="h-3 w-3" />
                Downloads
              </span>
              <span className="font-bold font-mono text-lg text-primary tabular-nums">—</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 font-mono text-muted-foreground text-xs uppercase tracking-wide">
                <TrendingUp className="h-3 w-3" />
                Avg/Day
              </span>
              <span className="font-mono text-foreground text-sm">—</span>
            </div>

            <div className="border-border/50 border-t pt-3">
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="font-mono text-muted-foreground">Package</span>
                <span className="truncate font-mono text-accent">create-better-fullstack</span>
              </div>
            </div>
          </div>
        </div>
      </a>
    </div>
  );
}

export default function StatsSection() {
  if (!isConvexConfigured) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="group cursor-pointer rounded border border-border bg-fd-background p-4 transition-colors hover:bg-muted/10">
          <div className="mb-3 flex items-center gap-2">
            <Terminal className="h-4 w-4 text-primary" />
            <span className="font-semibold font-mono text-sm sm:text-base">CLI_ANALYTICS.JSON</span>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 font-mono text-muted-foreground text-xs uppercase tracking-wide">
                <BarChart3 className="h-3 w-3" />
                Total Projects
              </span>
              <span className="font-bold font-mono text-lg text-primary tabular-nums">—</span>
            </div>
            <div className="border-border/50 border-t pt-3">
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="font-mono text-muted-foreground">Status</span>
                <span className="truncate font-mono text-accent">Convex not configured</span>
              </div>
            </div>
          </div>
        </div>

        <a
          href="https://github.com/Marve10s/Better-Fullstack"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="group cursor-pointer rounded border border-border bg-fd-background p-4 transition-colors hover:bg-muted/10">
            <div className="mb-3 flex items-center gap-2">
              <Github className="h-4 w-4 text-primary" />
              <span className="font-semibold font-mono text-sm sm:text-base">GITHUB_REPO.GIT</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 font-mono text-muted-foreground text-xs uppercase tracking-wide">
                  <Star className="h-3 w-3" />
                  Stars
                </span>
                <span className="font-bold font-mono text-lg text-primary tabular-nums">—</span>
              </div>
              <div className="border-border/50 border-t pt-3">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-mono text-muted-foreground">Repository</span>
                  <span className="truncate font-mono text-accent">Marve10s/Better-Fullstack</span>
                </div>
              </div>
            </div>
          </div>
        </a>

        <a
          href="https://www.npmjs.com/package/create-better-fullstack"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="group cursor-pointer rounded border border-border bg-fd-background p-4 transition-colors hover:bg-muted/10">
            <div className="mb-3 flex items-center gap-2">
              <Terminal className="h-4 w-4 text-primary" />
              <span className="font-semibold font-mono text-sm sm:text-base">NPM_PACKAGE.JS</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 font-mono text-muted-foreground text-xs uppercase tracking-wide">
                  <Package className="h-3 w-3" />
                  Downloads
                </span>
                <span className="font-bold font-mono text-lg text-primary tabular-nums">—</span>
              </div>
              <div className="border-border/50 border-t pt-3">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-mono text-muted-foreground">Package</span>
                  <span className="truncate font-mono text-accent">create-better-fullstack</span>
                </div>
              </div>
            </div>
          </div>
        </a>
      </div>
    );
  }
  return <StatsSectionContent />;
}
