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
  eyebrow,
  title,
  description,
  matrix,
  tone,
}: {
  eyebrow: string;
  title: string;
  description: string;
  matrix: AggregatedAnalyticsData["stackMatrix"];
  tone: "chart1" | "chart4";
}) {
  return (
    <ChartCard eyebrow={eyebrow} title={title} description={description}>
      <PlotChart
        ariaLabel={title}
        className="min-h-[320px]"
        build={({ width, palette }) => {
          const compact = isCompactPlot(width);
          const maxValue = Math.max(matrix.maxValue, 1);
          const fillEnd = tone === "chart1" ? palette.chart1 : palette.chart4;
          const cells = matrix.data.map((item) => ({
            ...item,
            tone:
              item.count === 0
                ? palette.background
                : interpolateColor(palette.border, fillEnd, item.count / maxValue),
          }));

          const margins = resolvePlotMargins(
            width,
            { top: 18, right: 18, bottom: 54, left: 88 },
            { top: 12, right: 8, bottom: 38, left: 62 },
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
        title="Clearer answers to the real question: which combinations keep winning?"
        description="Instead of treating each category in isolation, the pairing matrices show how choices cluster together. The preference boards underneath answer the simpler question of what keeps getting picked."
        aside={
          <div className="rounded-full border border-border/60 bg-background/55 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
            top stack {shortenLabel(data.summary.topStack, 28)}
          </div>
        }
      />

      <div className="grid gap-4 xl:grid-cols-2">
        <PairingMatrix
          eyebrow="Frontend x backend"
          title="Popular frontend and backend pairings stop being abstract when you can see the hotspots."
          description="The brightest cells show where builders are converging, not just which standalone options top the list."
          matrix={data.stackMatrix}
          tone="chart1"
        />
        <PairingMatrix
          eyebrow="Database x ORM"
          title="Database and ORM choices reveal which data layer combinations feel safest."
          description="This view removes string clutter and makes the strongest backend data pairings immediately visible."
          matrix={data.databaseOrmMatrix}
          tone="chart4"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <PreferenceChartCard
          eyebrow="Frontend"
          title="Frontend frameworks"
          description="Most-selected frontend surfaces, ranked by project share."
          data={data.frontendDistribution}
          colorKey="chart1"
        />
        <PreferenceChartCard
          eyebrow="Backend"
          title="Backend frameworks"
          description="Backend choices by share of tracked projects."
          data={data.backendDistribution}
          colorKey="chart2"
        />
        <PreferenceChartCard
          eyebrow="Database"
          title="Databases"
          description="Storage backends builders reach for most often."
          data={data.databaseDistribution}
          colorKey="chart4"
        />
        <PreferenceChartCard
          eyebrow="ORM"
          title="ORMs and query builders"
          description="Data-access tooling ranked by selection share."
          data={data.ormDistribution}
          colorKey="chart5"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-2 2xl:grid-cols-3">
        <PreferenceChartCard
          eyebrow="API"
          title="API layer"
          description="Transport choices used in tracked projects."
          data={data.apiDistribution}
          colorKey="chart3"
        />
        <PreferenceChartCard
          eyebrow="Auth"
          title="Authentication provider"
          description="Auth preferences across the live dataset."
          data={data.authDistribution}
          colorKey="chart1"
        />
        <PreferenceChartCard
          eyebrow="Runtime"
          title="Runtime preference"
          description="Which JavaScript runtimes show up most often."
          data={data.runtimeDistribution}
          colorKey="chart2"
        />
      </div>
    </div>
  );
}
