import { api } from "@better-t-stack/backend/convex/_generated/api";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "convex/react";

import type { AggregatedAnalyticsData, Distribution } from "@/components/analytics/types";

import AnalyticsPage from "@/components/analytics/analytics-page";
import { isConvexConfigured } from "@/lib/convex";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics - Better-T-Stack" },
      {
        name: "description",
        content: "Project creation analytics for Better-T-Stack.",
      },
      { property: "og:title", content: "Analytics - Better-T-Stack" },
      {
        property: "og:description",
        content: "Project creation analytics for Better-T-Stack.",
      },
      { property: "og:url", content: "https://better-t-stack.dev/analytics" },
      {
        property: "og:image",
        content: "https://r2.better-t-stack.dev/og.png",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Analytics - Better-T-Stack" },
      {
        name: "twitter:description",
        content: "Project creation analytics for Better-T-Stack.",
      },
      {
        name: "twitter:image",
        content: "https://r2.better-t-stack.dev/og.png",
      },
    ],
  }),
  component: AnalyticsRoute,
});

type PrecomputedStats = {
  totalProjects: number;
  lastEventTime: number;
  backend: Record<string, number>;
  frontend: Record<string, number>;
  database: Record<string, number>;
  orm: Record<string, number>;
  api: Record<string, number>;
  auth: Record<string, number>;
  runtime: Record<string, number>;
  packageManager: Record<string, number>;
  platform: Record<string, number>;
  addons: Record<string, number>;
  examples: Record<string, number>;
  dbSetup: Record<string, number>;
  webDeploy: Record<string, number>;
  serverDeploy: Record<string, number>;
  payments: Record<string, number>;
  git: Record<string, number>;
  install: Record<string, number>;
  nodeVersion: Record<string, number>;
  cliVersion: Record<string, number>;
  hourlyDistribution: Record<string, number>;
  stackCombinations: Record<string, number>;
  dbOrmCombinations: Record<string, number>;
};

type DailyStats = { date: string; count: number };

function recordToDistribution(record: Record<string, number>): Distribution {
  return Object.entries(record)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

function getMostPopular(dist: Distribution) {
  return dist.length > 0 ? dist[0].name : "none";
}

function buildFromPrecomputed(
  stats: PrecomputedStats,
  dailyStats: DailyStats[],
): AggregatedAnalyticsData {
  const backendDistribution = recordToDistribution(stats.backend);
  const frontendDistribution = recordToDistribution(stats.frontend);
  const databaseDistribution = recordToDistribution(stats.database);
  const ormDistribution = recordToDistribution(stats.orm);
  const apiDistribution = recordToDistribution(stats.api);
  const authDistribution = recordToDistribution(stats.auth);
  const runtimeDistribution = recordToDistribution(stats.runtime);
  const packageManagerDistribution = recordToDistribution(stats.packageManager);
  const platformDistribution = recordToDistribution(stats.platform);
  const addonsDistribution = recordToDistribution(stats.addons);
  const examplesDistribution = recordToDistribution(stats.examples);
  const dbSetupDistribution = recordToDistribution(stats.dbSetup);
  const webDeployDistribution = recordToDistribution(stats.webDeploy);
  const serverDeployDistribution = recordToDistribution(stats.serverDeploy);
  const paymentsDistribution = recordToDistribution(stats.payments);
  const gitDistribution = recordToDistribution(stats.git);
  const installDistribution = recordToDistribution(stats.install);
  const nodeVersionDistribution = recordToDistribution(stats.nodeVersion).map((d) => ({
    version: d.name,
    count: d.value,
  }));
  const cliVersionDistribution = recordToDistribution(stats.cliVersion)
    .filter((d) => d.name !== "unknown")
    .slice(0, 10)
    .map((d) => ({ version: d.name, count: d.value }));

  const timeSeries = dailyStats
    .map((d) => ({ date: d.date, count: d.count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const byMonth = new Map<string, number>();
  for (const d of dailyStats) {
    const month = d.date.slice(0, 7);
    byMonth.set(month, (byMonth.get(month) || 0) + d.count);
  }
  const monthlyTimeSeries = Array.from(byMonth.entries())
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => a.month.localeCompare(b.month));

  const uniqueDays = dailyStats.length || 1;

  const hourlyDistribution = Array.from({ length: 24 }, (_, i) => {
    const hour = String(i).padStart(2, "0");
    return { hour: `${hour}:00`, count: stats.hourlyDistribution[hour] || 0 };
  });

  const popularStackCombinations = recordToDistribution(stats.stackCombinations).slice(0, 8);
  const databaseORMCombinations = recordToDistribution(stats.dbOrmCombinations).slice(0, 8);

  return {
    lastUpdated: new Date(stats.lastEventTime).toISOString(),
    totalProjects: stats.totalProjects,
    avgProjectsPerDay: stats.totalProjects / uniqueDays,
    timeSeries,
    monthlyTimeSeries,
    hourlyDistribution,
    platformDistribution,
    packageManagerDistribution,
    backendDistribution,
    databaseDistribution,
    ormDistribution,
    dbSetupDistribution,
    apiDistribution,
    frontendDistribution,
    authDistribution,
    runtimeDistribution,
    addonsDistribution,
    examplesDistribution,
    gitDistribution,
    installDistribution,
    webDeployDistribution,
    serverDeployDistribution,
    paymentsDistribution,
    nodeVersionDistribution,
    cliVersionDistribution,
    popularStackCombinations,
    databaseORMCombinations,
    summary: {
      mostPopularFrontend: getMostPopular(frontendDistribution),
      mostPopularBackend: getMostPopular(backendDistribution),
      mostPopularDatabase: getMostPopular(databaseDistribution),
      mostPopularORM: getMostPopular(ormDistribution),
      mostPopularAPI: getMostPopular(apiDistribution),
      mostPopularAuth: getMostPopular(authDistribution),
      mostPopularPackageManager: getMostPopular(packageManagerDistribution),
      mostPopularRuntime: getMostPopular(runtimeDistribution),
    },
  };
}

const emptyData: AggregatedAnalyticsData = {
  lastUpdated: null,
  totalProjects: 0,
  avgProjectsPerDay: 0,
  timeSeries: [],
  monthlyTimeSeries: [],
  hourlyDistribution: [],
  platformDistribution: [],
  packageManagerDistribution: [],
  backendDistribution: [],
  databaseDistribution: [],
  ormDistribution: [],
  dbSetupDistribution: [],
  apiDistribution: [],
  frontendDistribution: [],
  authDistribution: [],
  runtimeDistribution: [],
  addonsDistribution: [],
  examplesDistribution: [],
  gitDistribution: [],
  installDistribution: [],
  webDeployDistribution: [],
  serverDeployDistribution: [],
  paymentsDistribution: [],
  nodeVersionDistribution: [],
  cliVersionDistribution: [],
  popularStackCombinations: [],
  databaseORMCombinations: [],
  summary: {
    mostPopularFrontend: "none",
    mostPopularBackend: "none",
    mostPopularDatabase: "none",
    mostPopularORM: "none",
    mostPopularAPI: "none",
    mostPopularAuth: "none",
    mostPopularPackageManager: "none",
    mostPopularRuntime: "none",
  },
};

function AnalyticsRouteContent() {
  const stats = useQuery(api.analytics.getStats, {});
  const dailyStats = useQuery(api.analytics.getDailyStats, {});

  const data = stats && dailyStats ? buildFromPrecomputed(stats, dailyStats) : emptyData;

  const legacy = {
    total: 55434,
    avgPerDay: 326.1,
    lastUpdatedIso: "2025-11-13T10:10:00.000Z",
    source: "PostHog (legacy)",
  };

  return <AnalyticsPage data={data} legacy={legacy} />;
}

function AnalyticsRoute() {
  if (!isConvexConfigured) {
    const legacy = {
      total: 55434,
      avgPerDay: 326.1,
      lastUpdatedIso: "2025-11-13T10:10:00.000Z",
      source: "PostHog (legacy)",
    };
    return <AnalyticsPage data={emptyData} legacy={legacy} />;
  }
  return <AnalyticsRouteContent />;
}
