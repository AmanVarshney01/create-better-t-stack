"use client";

import { api } from "@better-t-stack/backend/convex/_generated/api";
import { type Preloaded, useConvexConnectionState, usePreloadedQuery } from "convex/react";

import type { AggregatedAnalyticsData, Distribution } from "./_components/types";

import AnalyticsPage from "./_components/analytics-page";

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
type MonthlyStats = {
  monthly: Array<{ month: string; totalProjects: number }>;
  firstDate: string | null;
  lastDate: string | null;
};
type ConnectionStatus = "online" | "connecting" | "reconnecting" | "offline";

const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

function getConnectionStatus({
  isWebSocketConnected,
  hasEverConnected,
  connectionRetries,
}: {
  isWebSocketConnected: boolean;
  hasEverConnected: boolean;
  connectionRetries: number;
}): ConnectionStatus {
  if (isWebSocketConnected) return "online";
  if (hasEverConnected) return "reconnecting";
  if (connectionRetries > 0) return "offline";
  return "connecting";
}

function recordToDistribution(record: Record<string, number>): Distribution {
  return Object.entries(record)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

function getMostPopular(dist: Distribution) {
  return dist.length > 0 ? dist[0].name : "none";
}

function getCalendarDaySpan(timeSeries: DailyStats[]): number {
  if (timeSeries.length === 0) return 1;

  const firstDate = timeSeries[0]?.date;
  const lastDate = timeSeries[timeSeries.length - 1]?.date;
  if (!firstDate || !lastDate) return 1;

  const start = Date.parse(`${firstDate}T00:00:00Z`);
  const end = Date.parse(`${lastDate}T00:00:00Z`);

  if (Number.isNaN(start) || Number.isNaN(end) || end < start) {
    return Math.max(timeSeries.length, 1);
  }

  return Math.floor((end - start) / MILLISECONDS_PER_DAY) + 1;
}

function getCalendarDaySpanFromRange(
  firstDate: string | null,
  lastDate: string | null,
  fallbackSeries: DailyStats[],
): number {
  if (!firstDate || !lastDate) {
    return getCalendarDaySpan(fallbackSeries);
  }

  const start = Date.parse(`${firstDate}T00:00:00Z`);
  const end = Date.parse(`${lastDate}T00:00:00Z`);

  if (Number.isNaN(start) || Number.isNaN(end) || end < start) {
    return getCalendarDaySpan(fallbackSeries);
  }

  return Math.floor((end - start) / MILLISECONDS_PER_DAY) + 1;
}

function buildFromPrecomputed(
  stats: PrecomputedStats,
  dailyStats: DailyStats[],
  monthlyStats: MonthlyStats,
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

  const monthlyTimeSeries = monthlyStats.monthly;
  const calendarDaySpan = getCalendarDaySpanFromRange(
    monthlyStats.firstDate,
    monthlyStats.lastDate,
    timeSeries,
  );

  const hourlyDistribution = Array.from({ length: 24 }, (_, i) => {
    const hour = String(i).padStart(2, "0");
    return { hour: `${hour}:00`, count: stats.hourlyDistribution[hour] || 0 };
  });

  const popularStackCombinations = recordToDistribution(stats.stackCombinations).slice(0, 8);
  const databaseORMCombinations = recordToDistribution(stats.dbOrmCombinations).slice(0, 8);

  return {
    lastUpdated: new Date(stats.lastEventTime).toISOString(),
    totalProjects: stats.totalProjects,
    avgProjectsPerDay: stats.totalProjects / calendarDaySpan,
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

export function AnalyticsClient({
  preloadedStats,
  preloadedDailyStats,
  preloadedMonthlyStats,
}: {
  preloadedStats: Preloaded<typeof api.analytics.getStats>;
  preloadedDailyStats: Preloaded<typeof api.analytics.getDailyStats>;
  preloadedMonthlyStats: Preloaded<typeof api.analytics.getMonthlyStats>;
}) {
  const stats = usePreloadedQuery(preloadedStats);
  const dailyStats = usePreloadedQuery(preloadedDailyStats);
  const monthlyStats = usePreloadedQuery(preloadedMonthlyStats);
  const connectionState = useConvexConnectionState();
  const connectionStatus = getConnectionStatus(connectionState);

  const data = stats
    ? buildFromPrecomputed(stats, dailyStats, monthlyStats)
    : {
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

  const legacy = {
    total: 55434,
    avgPerDay: 326.1,
    lastUpdatedIso: "2025-11-13T10:10:00.000Z",
    source: "Legacy analytics (pre-Convex)",
  };

  return <AnalyticsPage data={data} legacy={legacy} connectionStatus={connectionStatus} />;
}
