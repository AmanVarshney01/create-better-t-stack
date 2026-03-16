"use client";

import * as Plot from "@observablehq/plot";

import { cn } from "@/lib/utils";

import {
  buildCompactCategoryLabels,
  formatPercent,
  getPlotFontSize,
  isCompactPlot,
  resolvePlotMargins,
} from "./analytics-helpers";
import { ChartCard } from "./chart-card";
import { PlotChart } from "./plot-chart";
import { PreferenceChartCard } from "./preference-chart-card";
import { SectionHeader } from "./section-header";
import type { AggregatedAnalyticsData, ShareDistributionItem, VersionDistribution } from "./types";

function VersionCard({
  eyebrow,
  title,
  description,
  data,
}: {
  eyebrow: string;
  title: string;
  description: string;
  data: VersionDistribution;
}) {
  const ranking = data.slice(0, 6);

  return (
    <ChartCard eyebrow={eyebrow} title={title} description={description}>
      <PlotChart
        ariaLabel={title}
        className="min-h-[240px]"
        build={({ width, palette }) => {
          const compact = isCompactPlot(width);
          const shareMax = Math.max(...ranking.map((item) => item.share), 0.12);
          const compactLabels = compact
            ? buildCompactCategoryLabels(
                ranking.map((item) => item.version),
                width < 360 ? 8 : 10,
              )
            : null;
          const chartData = ranking.map((item, index) => ({
            ...item,
            label: compact ? (compactLabels?.[index] ?? item.version) : item.version,
          }));
          const margins = resolvePlotMargins(
            width,
            { top: 16, right: 48, bottom: 28, left: 96 },
            { top: 12, right: 40, bottom: 12, left: 74 },
          );

          return Plot.plot({
            width,
            height: compact
              ? Math.max(200, chartData.length * 28 + 24)
              : Math.max(220, chartData.length * 34 + 70),
            marginTop: margins.top,
            marginRight: margins.right,
            marginBottom: margins.bottom,
            marginLeft: margins.left,
            style: {
              background: "transparent",
              color: palette.foreground,
              fontFamily: "var(--font-mono)",
              fontSize: getPlotFontSize(width),
            },
            x: {
              axis: compact ? null : undefined,
              label: null,
              domain: [0, shareMax * (compact ? 1.34 : 1.24)],
              ticks: 4,
              grid: !compact,
              tickFormat: (value) => formatPercent(Number(value), true),
            },
            y: {
              label: null,
            },
            marks: [
              Plot.barX(chartData, {
                x: "share",
                y: "label",
                fill: palette.chart5,
                rx: 10,
                title: (item) =>
                  `${item.version}\nShare: ${formatPercent(item.share, true)}\nProjects: ${item.count.toLocaleString()}`,
              }),
              Plot.text(chartData, {
                x: "share",
                y: "label",
                text: (item) => formatPercent(item.share, true),
                dx: compact ? 6 : 10,
                textAnchor: "start",
                fill: palette.foreground,
                fontWeight: 600,
              }),
            ],
          });
        }}
      />
    </ChartCard>
  );
}

function SplitMeterCard({
  eyebrow,
  title,
  description,
  data,
}: {
  eyebrow: string;
  title: string;
  description: string;
  data: ShareDistributionItem[];
}) {
  const yesShare = data.find((item) => item.name === "Yes")?.share ?? 0;
  const noShare = data.find((item) => item.name === "No")?.share ?? 0;

  return (
    <ChartCard eyebrow={eyebrow} title={title} description={description}>
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
            <div className="mt-2 font-semibold text-2xl">{formatPercent(yesShare)}</div>
          </div>
          <div className="rounded-2xl border border-border/45 bg-background/55 p-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
              no
            </div>
            <div className="mt-2 font-semibold text-2xl">{formatPercent(noShare)}</div>
          </div>
        </div>
      </div>
    </ChartCard>
  );
}

export function DevToolsSection({ data }: { data: AggregatedAnalyticsData }) {
  const webDeployTargets = data.webDeployDistribution.filter((item) => item.name !== "none");
  const serverDeployTargets = data.serverDeployDistribution.filter((item) => item.name !== "none");
  const hasDeployTargets = webDeployTargets.length > 0 || serverDeployTargets.length > 0;

  return (
    <div className="space-y-6">
      <SectionHeader
        label="Environment"
        title="Tooling and deployment details, trimmed down to the parts worth comparing."
        description="This section keeps the operational details that matter, but avoids wasting space on decorative charts that don’t help anyone make sense of the telemetry."
        aside={
          <div className="rounded-full border border-border/60 bg-background/55 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
            packages {data.summary.mostPopularPackageManager} • runtime{" "}
            {data.summary.mostPopularRuntime}
          </div>
        }
      />

      <div className="grid gap-4 xl:grid-cols-2 2xl:grid-cols-3">
        <PreferenceChartCard
          eyebrow="Package manager"
          title="Dependency tooling"
          description="How people install and manage their stack."
          data={data.packageManagerDistribution}
          colorKey="chart1"
        />
        <PreferenceChartCard
          eyebrow="Platform"
          title="Operating systems"
          description="Where the CLI is most often being run."
          data={data.platformDistribution}
          colorKey="chart2"
        />
        <PreferenceChartCard
          eyebrow="Database setup"
          title="Provisioning preference"
          description="Database setup services and strategies by project share."
          data={data.dbSetupDistribution}
          colorKey="chart4"
        />
      </div>

      {hasDeployTargets ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {webDeployTargets.length > 0 ? (
            <PreferenceChartCard
              eyebrow="Web target"
              title="Web deploy targets"
              description="The deployment platforms picked for the web surface."
              data={webDeployTargets}
              colorKey="chart3"
            />
          ) : null}

          {serverDeployTargets.length > 0 ? (
            <PreferenceChartCard
              eyebrow="Server target"
              title="Server deploy targets"
              description="Back-end hosting destinations selected during setup."
              data={serverDeployTargets}
              colorKey="chart2"
            />
          ) : null}
        </div>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-2">
        <SplitMeterCard
          eyebrow="Git init"
          title="Repository initialization"
          description="How often projects are scaffolded with git already initialized."
          data={data.gitDistribution}
        />
        <SplitMeterCard
          eyebrow="Install"
          title="Auto dependency install"
          description="Whether users let the CLI install dependencies immediately."
          data={data.installDistribution}
        />
        <VersionCard
          eyebrow="Node"
          title="Node major versions"
          description="Major Node versions observed in tracked runs."
          data={data.nodeVersionDistribution}
        />
        <VersionCard
          eyebrow="CLI"
          title="CLI versions"
          description="Most common release versions in the live telemetry stream."
          data={data.cliVersionDistribution}
        />
      </div>

      <div
        className={cn(
          "grid gap-4",
          data.addonsDistribution.length > 0 && data.examplesDistribution.length > 0
            ? "xl:grid-cols-2"
            : "grid-cols-1",
        )}
      >
        {data.addonsDistribution.length > 0 ? (
          <PreferenceChartCard
            eyebrow="Add-ons"
            title="Extra capabilities"
            description="Additional tooling and generators selected during setup."
            data={data.addonsDistribution}
            colorKey="chart1"
            maxItems={8}
          />
        ) : null}

        {data.examplesDistribution.length > 0 ? (
          <PreferenceChartCard
            eyebrow="Examples"
            title="Included examples"
            description="Sample templates people choose to include."
            data={data.examplesDistribution}
            colorKey="chart4"
            maxItems={8}
          />
        ) : null}
      </div>
    </div>
  );
}
