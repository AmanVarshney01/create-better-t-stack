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
    <div className="rounded border border-border">
      <div className="border-border border-b px-4 py-2">
        <div className="flex items-center justify-between">
          <span className="font-mono text-muted-foreground text-xs">{title}</span>
          <span className="text-primary">{icon}</span>
        </div>
      </div>
      <div className="p-4">
        {animate && typeof value === "number" ? (
          <NumberFlow
            value={value}
            className={`truncate font-bold text-xl ${highlight ? "text-primary" : "text-accent"}`}
            transformTiming={{ duration: 800, easing: "ease-out" }}
            willChange
            isolate
          />
        ) : (
          <div
            className={`truncate font-bold text-xl ${highlight ? "text-primary" : "text-accent"}`}
          >
            {typeof value === "number" ? value.toLocaleString() : value}
          </div>
        )}
        <p className="mt-1 text-muted-foreground text-xs">{subtitle}</p>
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
          icon={<Terminal className="h-4 w-4" />}
          highlight
          animate
        />
        <MetricCard
          title="AVG_PER_DAY"
          value={Number(avgProjectsPerDay.toFixed(1))}
          subtitle="Average daily creations"
          icon={<TrendingUp className="h-4 w-4" />}
          highlight
          animate
        />
        <MetricCard
          title="TOP_FRONTEND"
          value={summary.mostPopularFrontend}
          subtitle="Most selected frontend"
          icon={<Globe className="h-4 w-4" />}
        />
        <MetricCard
          title="TOP_BACKEND"
          value={summary.mostPopularBackend}
          subtitle="Most selected backend"
          icon={<Server className="h-4 w-4" />}
        />
        <MetricCard
          title="TOP_DATABASE"
          value={summary.mostPopularDatabase}
          subtitle="Most selected database"
          icon={<Database className="h-4 w-4" />}
        />
        <MetricCard
          title="TOP_ORM"
          value={summary.mostPopularORM}
          subtitle="Most selected ORM"
          icon={<Layers className="h-4 w-4" />}
        />
        <MetricCard
          title="TOP_API"
          value={summary.mostPopularAPI}
          subtitle="Most selected API layer"
          icon={<Code2 className="h-4 w-4" />}
        />
        <MetricCard
          title="TOP_RUNTIME"
          value={summary.mostPopularRuntime}
          subtitle="Most selected runtime"
          icon={<Zap className="h-4 w-4" />}
        />
      </div>
    </div>
  );
}
