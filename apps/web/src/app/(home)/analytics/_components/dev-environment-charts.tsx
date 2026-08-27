"use client";

import { cn } from "@/lib/utils";

import { formatCount, formatPercent } from "./analytics-helpers";
import { CategoryBarChart } from "./bklit-charts";
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
  const chartData = data.map((item) => ({
    label: item.name,
    value: item.value,
  }));

  return (
    <ChartCard title={title} description={description}>
      <div className="grid gap-4 sm:grid-cols-[minmax(0,0.9fr)_minmax(180px,0.7fr)] sm:items-center">
        <div className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
          <div className="min-w-0 border-t pt-3">
            <div className="text-[11px] text-fd-muted-foreground uppercase tracking-[0.08em]">
              Yes
            </div>
            <div className="mt-2 font-medium text-[20px] tabular-nums tracking-[-0.02em]">
              {formatCount(yesCount)}
            </div>
            <div className="mt-1 text-[11px] text-fd-muted-foreground tabular-nums">
              {formatPercent(yesShare)}
            </div>
          </div>
          <div className="min-w-0 border-t pt-3">
            <div className="text-[11px] text-fd-muted-foreground uppercase tracking-[0.08em]">
              No
            </div>
            <div className="mt-2 font-medium text-[20px] tabular-nums tracking-[-0.02em]">
              {formatCount(noCount)}
            </div>
            <div className="mt-1 text-[11px] text-fd-muted-foreground tabular-nums">
              {formatPercent(noShare)}
            </div>
          </div>
        </div>
        <CategoryBarChart
          data={chartData}
          xKey="label"
          orientation="horizontal"
          height={210}
          labelWidth={52}
          series={[{ key: "value", label: "Tracked setups", color: "var(--chart-2)" }]}
        />
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
        title="Package manager, setup, deployment, and addon choices"
        description="The environment choices that shape generated projects after the stack options are selected."
        aside={
          <span className="shrink-0 text-[10px] text-fd-muted-foreground uppercase tracking-[0.10em]">
            packages {data.summary.mostPopularPackageManager} • runtime{" "}
            {data.summary.mostPopularRuntime}
          </span>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]">
        <PreferenceChartCard
          title="Database setup"
          description="How often each database setup option was selected."
          data={data.dbSetupDistribution}
          colorKey="chart4"
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

      {data.modeDistribution.length > 0 ? (
        <PreferenceChartCard
          title="How the CLI was driven"
          description="Interactive prompts, flags, --yes, JSON output, the programmatic API, or the MCP server. Counted for runs that report it."
          data={data.modeDistribution}
          colorKey="chart2"
          columnCount={3}
          columnGridClassName="grid-cols-1 sm:grid-cols-3"
        />
      ) : null}

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
        />

        {data.examplesDistribution.length > 0 ? (
          <PreferenceChartCard
            title="Examples"
            description="Selected examples and projects created without an example."
            data={data.examplesDistribution}
            colorKey="chart4"
            layout="vertical"
          />
        ) : null}
      </div>

      {data.addonsDistribution.length > 0 ? (
        <PreferenceChartCard
          title="Addons"
          description="Selected addons and projects created without addons."
          data={data.addonsDistribution}
          colorKey="chart1"
          columnCount={2}
        />
      ) : null}

      {cliVersionPreferences.length > 0 ? (
        <PreferenceChartCard
          title="CLI versions"
          description="How many tracked setups were created with each CLI version."
          data={cliVersionPreferences}
          colorKey="chart4"
          columnCount={4}
          columnGridClassName="grid-cols-1 sm:grid-cols-2 xl:grid-cols-4"
        />
      ) : null}
    </div>
  );
}
