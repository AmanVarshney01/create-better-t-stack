"use client";

import * as Plot from "@observablehq/plot";

import {
  formatPercent,
  getPlotFontSize,
  interpolateColor,
  isCompactPlot,
  resolvePlotMargins,
  shortenLabel,
} from "./analytics-helpers";
import { ChartCard } from "./chart-card";
import { PlotChart } from "./plot-chart";
import { PreferenceChartCard } from "./preference-chart-card";
import { SectionHeader } from "./section-header";
import type { AggregatedAnalyticsData } from "./types";

function PairingMatrix({
  title,
  description,
  matrix,
  tone,
}: {
  title: string;
  description: string;
  matrix: AggregatedAnalyticsData["stackMatrix"];
  tone: "chart1" | "chart4";
}) {
  return (
    <ChartCard title={title} description={description}>
      <PlotChart
        ariaLabel={title}
        className="min-h-[320px]"
        build={({ width, palette }) => {
          const compact = isCompactPlot(width);
          const maxValue = Math.max(matrix.maxValue, 1);
          const fillEnd = tone === "chart1" ? palette.chart1 : palette.chart4;
          const xLabelCount = matrix.xDomain.length;
          const needsDenseXAxis = xLabelCount > (compact ? 5 : 7);
          const cells = matrix.data.map((item) => ({
            ...item,
            tone:
              item.count === 0
                ? palette.background
                : interpolateColor(palette.border, fillEnd, item.count / maxValue),
          }));

          const margins = resolvePlotMargins(
            width,
            {
              top: 18,
              right: 18,
              bottom: needsDenseXAxis ? 78 : 54,
              left: 88,
            },
            {
              top: 12,
              right: 8,
              bottom: needsDenseXAxis ? 58 : 38,
              left: 62,
            },
          );

          return Plot.plot({
            width,
            height: compact
              ? Math.max(240, matrix.yDomain.length * 40 + 70)
              : Math.max(280, matrix.yDomain.length * 54 + 90),
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
              label: null,
              domain: matrix.xDomain,
              tickRotate: needsDenseXAxis ? -40 : 0,
              tickFormat: (value) => shortenLabel(String(value), compact ? 8 : 16),
            },
            y: {
              label: null,
              domain: matrix.yDomain,
              tickFormat: (value) => shortenLabel(String(value), compact ? 8 : 16),
            },
            marks: [
              Plot.cell(cells, {
                x: "x",
                y: "y",
                fill: "tone",
                inset: 2,
                title: (item) =>
                  `${item.y} + ${item.x}\nProjects: ${item.count.toLocaleString()}\nShare: ${formatPercent(item.share, true)}`,
              }),
              Plot.text(
                cells.filter((item) => item.count > 0),
                {
                  x: "x",
                  y: "y",
                  text: (item) => item.count.toLocaleString(),
                  fill: (item) =>
                    item.count / maxValue > 0.5 ? palette.background : palette.foreground,
                  fontSize: compact ? 10 : 12,
                  fontWeight: 700,
                },
              ),
            ],
          });
        }}
      />
    </ChartCard>
  );
}

export function StackSection({ data }: { data: AggregatedAnalyticsData }) {
  return (
    <div className="space-y-6">
      <SectionHeader
        label="Stack choices"
        title="Frontend, backend, database, ORM, API, auth, and runtime choices."
        description="These charts show which stack options were selected most often and which combinations appear together."
        aside={
          <div className="rounded-full border border-border/60 bg-background/55 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
            top stack {shortenLabel(data.summary.topStack, 28)}
          </div>
        }
      />

      <div className="grid gap-4 xl:grid-cols-2">
        <PairingMatrix
          title="Frontend x Backend"
          description="How often each frontend and backend combination was selected."
          matrix={data.stackMatrix}
          tone="chart1"
        />
        <PairingMatrix
          title="Database x ORM"
          description="How often each database and ORM combination was selected."
          matrix={data.databaseOrmMatrix}
          tone="chart4"
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
          chartClassName="min-h-[280px]"
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
