"use client";

import NumberFlow from "@number-flow/react";
import { Code2, Database, Globe, Layers, Server, Terminal, TrendingUp, Zap } from "lucide-react";

import type { AggregatedAnalyticsData } from "./types";

type MetricCardProps = {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  highlight?: boolean;
  animate?: boolean;
};

function MetricCard({ title, value, subtitle, icon, highlight, animate }: MetricCardProps) {
  return (
    <div className="group cursor-default rounded border border-border transition-colors hover:bg-muted/10">
      <div className="space-y-3 p-4">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 font-mono text-muted-foreground text-xs uppercase tracking-wide">
            {icon}
            {title}
          </span>
        </div>

        {animate && typeof value === "number" ? (
          <NumberFlow
            value={value}
            className={`truncate font-bold font-mono text-xl ${highlight ? "text-primary" : "text-accent"}`}
            transformTiming={{ duration: 800, easing: "ease-out" }}
            willChange
            isolate
          />
        ) : (
          <div
            className={`truncate font-bold font-mono text-xl ${highlight ? "text-primary" : "text-accent"}`}
          >
            {typeof value === "number" ? value.toLocaleString() : value}
          </div>
        )}

        <div className="border-border/50 border-t pt-3">
          <p className="truncate font-mono text-muted-foreground text-xs">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

export function MetricsCards({ data }: { data: AggregatedAnalyticsData }) {
  const { summary, totalProjects, avgProjectsPerDay } = data;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="font-bold text-lg">KEY_METRICS</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="TOTAL_PROJECTS"
          value={totalProjects}
          subtitle="Projects created with CLI"
          icon={<Terminal className="h-3 w-3" />}
          highlight
          animate
        />
        <MetricCard
          title="AVG_PER_DAY"
          value={Number(avgProjectsPerDay.toFixed(1))}
          subtitle="Average daily creations"
          icon={<TrendingUp className="h-3 w-3" />}
          highlight
          animate
        />
        <MetricCard
          title="TOP_FRONTEND"
          value={summary.mostPopularFrontend}
          subtitle="Most selected frontend"
          icon={<Globe className="h-3 w-3" />}
        />
        <MetricCard
          title="TOP_BACKEND"
          value={summary.mostPopularBackend}
          subtitle="Most selected backend"
          icon={<Server className="h-3 w-3" />}
        />
        <MetricCard
          title="TOP_DATABASE"
          value={summary.mostPopularDatabase}
          subtitle="Most selected database"
          icon={<Database className="h-3 w-3" />}
        />
        <MetricCard
          title="TOP_ORM"
          value={summary.mostPopularORM}
          subtitle="Most selected ORM"
          icon={<Layers className="h-3 w-3" />}
        />
        <MetricCard
          title="TOP_API"
          value={summary.mostPopularAPI}
          subtitle="Most selected API layer"
          icon={<Code2 className="h-3 w-3" />}
        />
        <MetricCard
          title="TOP_RUNTIME"
          value={summary.mostPopularRuntime}
          subtitle="Most selected runtime"
          icon={<Zap className="h-3 w-3" />}
        />
      </div>
    </div>
  );
}
