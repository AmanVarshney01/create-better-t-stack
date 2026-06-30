"use client";

import { shortenLabel } from "./analytics-helpers";
import { PreferenceChartCard } from "./preference-chart-card";
import { SectionHeader } from "./section-header";
import type { AggregatedAnalyticsData } from "./types";

export function StackSection({ data }: { data: AggregatedAnalyticsData }) {
  return (
    <div className="space-y-6">
      <SectionHeader
        label="Stack choices"
        title="Frameworks, runtimes, data layers, and auth"
        description="The most common stack decisions and pairings selected during project creation."
        aside={
          <div className="rounded border border-border bg-fd-background px-3 py-1.5 font-mono text-muted-foreground text-xs">
            top stack {shortenLabel(data.summary.topStack, 28)}
          </div>
        }
      />

      <div className="grid gap-4 xl:grid-cols-2">
        <PreferenceChartCard
          title="Frontend and backend pairings"
          description="The combinations that appear most often across tracked setups."
          data={data.stackCombinationDistribution}
          colorKey="chart1"
          maxItems={10}
          chartClassName="min-h-[420px]"
        />
        <PreferenceChartCard
          title="Database and ORM pairings"
          description="Which persistence choices tend to be selected together."
          data={data.databaseORMCombinationDistribution}
          colorKey="chart4"
          maxItems={10}
          chartClassName="min-h-[420px]"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <PreferenceChartCard
          title="Frontend"
          description="How often each frontend was selected."
          data={data.frontendDistribution}
          colorKey="chart1"
        />
        <PreferenceChartCard
          title="Backend"
          description="How often each backend was selected."
          data={data.backendDistribution}
          colorKey="chart2"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <PreferenceChartCard
          title="Database"
          description="How often each database was selected."
          data={data.databaseDistribution}
          colorKey="chart4"
          chartClassName="min-h-[320px]"
        />
        <PreferenceChartCard
          title="ORM"
          description="How often each ORM was selected."
          data={data.ormDistribution}
          colorKey="chart5"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-2 2xl:grid-cols-3">
        <PreferenceChartCard
          title="API"
          description="How often each API type was selected."
          data={data.apiDistribution}
          colorKey="chart3"
        />
        <PreferenceChartCard
          title="Authentication provider"
          description="How often each authentication provider was selected."
          data={data.authDistribution}
          colorKey="chart1"
        />
        <PreferenceChartCard
          title="Runtime"
          description="How often each runtime was selected."
          data={data.runtimeDistribution}
          colorKey="chart2"
        />
      </div>
    </div>
  );
}
