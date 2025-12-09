import type { ChartConfig } from "@/components/ui/chart";

export type Distribution = Array<{ name: string; value: number }>;
export type VersionDistribution = Array<{ version: string; count: number }>;
export type TimeSeriesData = Array<{ date: string; count: number }>;
export type MonthlyData = Array<{ month: string; count: number }>;
export type HourlyData = Array<{ hour: string; count: number }>;

export type AggregatedAnalyticsData = {
  lastUpdated: string | null;
  totalProjects: number;
  avgProjectsPerDay: number;
  timeSeries: TimeSeriesData;
  monthlyTimeSeries: MonthlyData;
  hourlyDistribution: HourlyData;
  platformDistribution: Distribution;
  packageManagerDistribution: Distribution;
  backendDistribution: Distribution;
  databaseDistribution: Distribution;
  ormDistribution: Distribution;
  dbSetupDistribution: Distribution;
  apiDistribution: Distribution;
  frontendDistribution: Distribution;
  authDistribution: Distribution;
  runtimeDistribution: Distribution;
  addonsDistribution: Distribution;
  examplesDistribution: Distribution;
  gitDistribution: Distribution;
  installDistribution: Distribution;
  webDeployDistribution: Distribution;
  serverDeployDistribution: Distribution;
  paymentsDistribution: Distribution;
  nodeVersionDistribution: VersionDistribution;
  cliVersionDistribution: VersionDistribution;
  popularStackCombinations: Distribution;
  databaseORMCombinations: Distribution;
  summary: {
    mostPopularFrontend: string;
    mostPopularBackend: string;
    mostPopularDatabase: string;
    mostPopularORM: string;
    mostPopularAPI: string;
    mostPopularAuth: string;
    mostPopularPackageManager: string;
    mostPopularRuntime: string;
  };
};

export const chartConfig = {
  value: { label: "Count", color: "hsl(var(--chart-1))" },
  count: { label: "Projects", color: "hsl(var(--chart-1))" },
} satisfies ChartConfig;

export const CHART_COLORS = [
  "hsl(142 76% 36%)",
  "hsl(221 83% 53%)",
  "hsl(262 83% 58%)",
  "hsl(24 95% 53%)",
  "hsl(47 96% 53%)",
  "hsl(339 90% 51%)",
  "hsl(173 80% 40%)",
  "hsl(291 64% 42%)",
  "hsl(210 40% 50%)",
  "hsl(0 72% 51%)",
];

export function getColor(index: number) {
  return CHART_COLORS[index % CHART_COLORS.length];
}

export function truncateLabel(label: string, maxLength = 16) {
  if (label.length <= maxLength) return label;
  return `${label.slice(0, maxLength - 1)}...`;
}
