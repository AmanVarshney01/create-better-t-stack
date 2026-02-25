import type { ChartConfig } from "@/components/ui/chart";

export type Distribution = Array<{ name: string; value: number }>;
export type VersionDistribution = Array<{ version: string; count: number }>;
export type TimeSeriesData = Array<{ date: string; count: number }>;
export type MonthlyData = Array<{ month: string; totalProjects: number }>;
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
  value: { label: "Projects", color: "var(--chart-1)" },
  count: { label: "Projects", color: "var(--chart-1)" },
} satisfies ChartConfig;
