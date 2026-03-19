"use client";

import { cn } from "@/lib/utils";

import { formatCount, formatPercent } from "./analytics-helpers";
import { ChartCard } from "./chart-card";
import { PreferenceChartCard } from "./preference-chart-card";
import { SectionHeader } from "./section-header";
import type { AggregatedAnalyticsData, ShareDistributionItem } from "./types";

function SplitMeterCard({
  title,
  description,
  data,
}: {
  title: string;
  description: string;
  data: ShareDistributionItem[];
}) {
  const yesShare = data.find((item) => item.name === "Yes")?.share ?? 0;
  const noShare = data.find((item) => item.name === "No")?.share ?? 0;
  const yesCount = data.find((item) => item.name === "Yes")?.value ?? 0;
  const noCount = data.find((item) => item.name === "No")?.value ?? 0;

  return (
    <ChartCard title={title} description={description}>
      <div className="space-y-4">
        <div className="overflow-hidden rounded-full border border-border/45 bg-background/65">
          <div className="flex h-4 w-full">
            <div className="bg-primary transition-all" style={{ width: `${yesShare * 100}%` }} />
            <div className="bg-muted transition-all" style={{ width: `${noShare * 100}%` }} />
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-border/45 bg-background/55 p-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
              yes
            </div>
            <div className="mt-2 font-semibold text-2xl">{formatCount(yesCount)}</div>
            <div className="mt-1 text-muted-foreground text-xs">{formatPercent(yesShare)}</div>
          </div>
          <div className="rounded-2xl border border-border/45 bg-background/55 p-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
              no
            </div>
            <div className="mt-2 font-semibold text-2xl">{formatCount(noCount)}</div>
            <div className="mt-1 text-muted-foreground text-xs">{formatPercent(noShare)}</div>
          </div>
        </div>
      </div>
    </ChartCard>
  );
}

export function DevToolsSection({ data }: { data: AggregatedAnalyticsData }) {
  const webDeployOptions = data.webDeployDistribution;
  const serverDeployOptions = data.serverDeployDistribution;
  const hasDeploymentOptions = webDeployOptions.length > 0 || serverDeployOptions.length > 0;
  const nodeVersionPreferences = data.nodeVersionDistribution.map((item) => ({
    name: item.version,
    value: item.count,
    share: item.share,
  }));
  const cliVersionPreferences = data.cliVersionDistribution.map((item) => ({
    name: item.version,
    value: item.count,
    share: item.share,
  }));

  return (
    <div className="space-y-6">
      <SectionHeader
        label="Environment"
        title="Package manager, setup, deployment, and addon choices."
        description="These charts show the environment and setup options selected in tracked CLI runs."
        aside={
          <div className="rounded-full border border-border/60 bg-background/55 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
            packages {data.summary.mostPopularPackageManager} • runtime{" "}
            {data.summary.mostPopularRuntime}
          </div>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]">
        <PreferenceChartCard
          title="Database setup"
          description="How often each database setup option was selected."
          data={data.dbSetupDistribution}
          colorKey="chart4"
          className="xl:min-h-full"
          chartClassName="min-h-[290px]"
        />
        <PreferenceChartCard
          title="Package manager"
          description="How often each package manager was selected."
          data={data.packageManagerDistribution}
          colorKey="chart1"
        />
      </div>

      <div
        className={cn(
          "grid gap-4",
          data.paymentsDistribution.length > 0 ? "xl:grid-cols-2" : "grid-cols-1",
        )}
      >
        <PreferenceChartCard
          title="Platform"
          description="How many tracked CLI runs came from each platform."
          data={data.platformDistribution}
          colorKey="chart2"
        />
        {data.paymentsDistribution.length > 0 ? (
          <PreferenceChartCard
            title="Payments"
            description="How often each payments option was selected, including none."
            data={data.paymentsDistribution}
            colorKey="chart3"
          />
        ) : null}
      </div>

      {hasDeploymentOptions ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {webDeployOptions.length > 0 ? (
            <PreferenceChartCard
              title="Web deployment"
              description="How often each web deployment option was selected, including none."
              data={webDeployOptions}
              colorKey="chart3"
            />
          ) : null}

          {serverDeployOptions.length > 0 ? (
            <PreferenceChartCard
              title="Server deployment"
              description="How often each server deployment option was selected, including none."
              data={serverDeployOptions}
              colorKey="chart2"
            />
          ) : null}
        </div>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-2">
        <SplitMeterCard
          title="Git initialization"
          description="Share of tracked setups where Git was initialized during project creation."
          data={data.gitDistribution}
        />
        <SplitMeterCard
          title="Install dependencies"
          description="Share of tracked setups where dependencies were installed during project creation."
          data={data.installDistribution}
        />
      </div>

      <div
        className={cn(
          "grid gap-4",
          data.examplesDistribution.length > 0 ? "xl:grid-cols-2" : "grid-cols-1",
        )}
      >
        <PreferenceChartCard
          title="Node versions"
          description="How many tracked CLI runs reported each Node major version."
          data={nodeVersionPreferences}
          colorKey="chart5"
          layout="vertical"
          chartClassName="min-h-[280px]"
        />

        {data.examplesDistribution.length > 0 ? (
          <PreferenceChartCard
            title="Examples"
            description="How often each example was included."
            data={data.examplesDistribution}
            colorKey="chart4"
            layout="vertical"
            chartClassName="min-h-[280px]"
          />
        ) : null}
      </div>

      {data.addonsDistribution.length > 0 ? (
        <PreferenceChartCard
          title="Addons"
          description="How often each addon was selected."
          data={data.addonsDistribution}
          colorKey="chart1"
          columnCount={2}
          chartClassName="min-h-[280px]"
        />
      ) : null}

      {cliVersionPreferences.length > 0 ? (
        <PreferenceChartCard
          title="CLI versions"
          description="How many tracked setups were created with each CLI version."
          data={cliVersionPreferences}
          colorKey="chart4"
          columnCount={4}
          columnGridClassName="xl:grid-cols-2"
          chartClassName="min-h-[300px]"
        />
      ) : null}
    </div>
  );
}
