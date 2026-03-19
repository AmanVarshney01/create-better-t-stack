"use client";

import { api } from "@better-t-stack/backend/convex/_generated/api";
import { type Preloaded, useConvexConnectionState, usePreloadedQuery } from "convex/react";
import { useEffect, useState } from "react";

import {
  buildComboMatrix,
  buildWeekdayDistribution,
  splitComboLabel,
  versionWithShare,
  withShare,
} from "./_components/analytics-helpers";
import AnalyticsPage from "./_components/analytics-page";
import type { AggregatedAnalyticsData, Distribution, TimeSeriesPoint } from "./_components/types";

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

function buildTimeSeries(dailyStats: DailyStats[]): TimeSeriesPoint[] {
  const sorted = [...dailyStats].sort((a, b) => a.date.localeCompare(b.date));
  let cumulativeProjects = 0;

  return sorted.map((day, index) => {
    cumulativeProjects += day.count;
    const trailingWindow = sorted.slice(Math.max(0, index - 6), index + 1);
    const rollingAverage =
      trailingWindow.reduce((sum, point) => sum + point.count, 0) / trailingWindow.length;

    return {
      date: day.date,
      dateValue: new Date(`${day.date}T00:00:00`),
      count: day.count,
      rollingAverage,
      cumulativeProjects,
    };
  });
}

function buildMonthlyTimeSeries(monthlyStats: MonthlyStats["monthly"]) {
  let cumulativeProjects = 0;

  return [...monthlyStats]
    .sort((a, b) => a.month.localeCompare(b.month))
    .map((month) => {
      cumulativeProjects += month.totalProjects;
      return {
        month: month.month,
        monthDate: new Date(`${month.month}-01T00:00:00`),
        totalProjects: month.totalProjects,
        cumulativeProjects,
      };
    });
}

function buildFromPrecomputed(
  stats: PrecomputedStats,
  dailyStats: DailyStats[],
  monthlyStats: MonthlyStats,
): AggregatedAnalyticsData {
  const totalProjects = stats.totalProjects;
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
  const stackCombinationDistribution = withShare(
    recordToDistribution(stats.stackCombinations),
    totalProjects,
  );
  const databaseORMCombinationDistribution = withShare(
    recordToDistribution(stats.dbOrmCombinations),
    totalProjects,
  );

  const timeSeries = buildTimeSeries(dailyStats);
  const monthlyTimeSeries = buildMonthlyTimeSeries(monthlyStats.monthly);
  const calendarDaySpan = getCalendarDaySpanFromRange(
    monthlyStats.firstDate,
    monthlyStats.lastDate,
    dailyStats,
  );

  const hourlyDistribution = Array.from({ length: 24 }, (_, hourValue) => {
    const hour = String(hourValue).padStart(2, "0");
    return {
      hour: `${hour}:00`,
      hourValue,
      label: hour,
      count: stats.hourlyDistribution[hour] || 0,
    };
  });

  const weekdayDistribution = buildWeekdayDistribution(timeSeries);
  const nodeVersionDistribution = versionWithShare(
    recordToDistribution(stats.nodeVersion).map((item) => ({
      version: item.name,
      count: item.value,
    })),
    totalProjects,
  );
  const cliVersionDistribution = versionWithShare(
    recordToDistribution(stats.cliVersion)
      .filter((item) => item.name !== "unknown")
      .map((item) => ({
        version: item.name,
        count: item.value,
      })),
    totalProjects,
  );

  const recent7Days = timeSeries.slice(-7).reduce((sum, point) => sum + point.count, 0);
  const previous7Days = timeSeries.slice(-14, -7).reduce((sum, point) => sum + point.count, 0);
  const delta = recent7Days - previous7Days;
  const deltaPercentage = previous7Days > 0 ? delta / previous7Days : recent7Days > 0 ? null : 0;
  const peakDay = timeSeries.reduce<TimeSeriesPoint | null>(
    (max, point) => (max && max.count >= point.count ? max : point),
    null,
  );
  const busiestHourCandidate = hourlyDistribution.reduce<
    (typeof hourlyDistribution)[number] | null
  >((max, point) => (max && max.count >= point.count ? max : point), null);
  const busiestHour =
    busiestHourCandidate && busiestHourCandidate.count > 0 ? busiestHourCandidate : null;

  return {
    lastUpdated: new Date(stats.lastEventTime).toISOString(),
    totalProjects,
    avgProjectsPerDay: totalProjects / Math.max(calendarDaySpan, 1),
    timeSeries,
    monthlyTimeSeries,
    hourlyDistribution,
    weekdayDistribution,
    platformDistribution: withShare(platformDistribution, totalProjects),
    packageManagerDistribution: withShare(packageManagerDistribution, totalProjects),
    backendDistribution: withShare(backendDistribution, totalProjects),
    databaseDistribution: withShare(databaseDistribution, totalProjects),
    ormDistribution: withShare(ormDistribution, totalProjects),
    dbSetupDistribution: withShare(dbSetupDistribution, totalProjects),
    apiDistribution: withShare(apiDistribution, totalProjects),
    frontendDistribution: withShare(frontendDistribution, totalProjects),
    authDistribution: withShare(authDistribution, totalProjects),
    runtimeDistribution: withShare(runtimeDistribution, totalProjects),
    addonsDistribution: withShare(addonsDistribution, totalProjects),
    examplesDistribution: withShare(examplesDistribution, totalProjects),
    gitDistribution: withShare(gitDistribution, totalProjects),
    installDistribution: withShare(installDistribution, totalProjects),
    webDeployDistribution: withShare(webDeployDistribution, totalProjects),
    serverDeployDistribution: withShare(serverDeployDistribution, totalProjects),
    paymentsDistribution: withShare(paymentsDistribution, totalProjects),
    nodeVersionDistribution,
    cliVersionDistribution,
    stackCombinationDistribution,
    databaseORMCombinationDistribution,
    stackMatrix: buildComboMatrix({
      distribution: stackCombinationDistribution,
      total: totalProjects,
      xFromLabel: (name) => splitComboLabel(name)[1],
      yFromLabel: (name) => splitComboLabel(name)[0],
    }),
    databaseOrmMatrix: buildComboMatrix({
      distribution: databaseORMCombinationDistribution,
      total: totalProjects,
      xFromLabel: (name) => splitComboLabel(name)[1],
      yFromLabel: (name) => splitComboLabel(name)[0],
    }),
    summary: {
      mostPopularFrontend: getMostPopular(frontendDistribution),
      mostPopularBackend: getMostPopular(backendDistribution),
      mostPopularDatabase: getMostPopular(databaseDistribution),
      mostPopularORM: getMostPopular(ormDistribution),
      mostPopularAPI: getMostPopular(apiDistribution),
      mostPopularAuth: getMostPopular(authDistribution),
      mostPopularPackageManager: getMostPopular(packageManagerDistribution),
      mostPopularRuntime: getMostPopular(runtimeDistribution),
      topStack: stackCombinationDistribution[0]?.name ?? "none",
      topDatabasePair: databaseORMCombinationDistribution[0]?.name ?? "none",
    },
    momentum: {
      trackingDays: calendarDaySpan,
      last7Days: recent7Days,
      previous7Days,
      delta,
      deltaPercentage,
      activeDaysLast30: timeSeries.filter((point) => point.count > 0).length,
      peakDay: peakDay ? { date: peakDay.date, count: peakDay.count } : null,
      busiestHour: busiestHour ? { hour: busiestHour.hour, count: busiestHour.count } : null,
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
  weekdayDistribution: [],
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
  stackCombinationDistribution: [],
  databaseORMCombinationDistribution: [],
  stackMatrix: { data: [], xDomain: [], yDomain: [], maxValue: 0 },
  databaseOrmMatrix: { data: [], xDomain: [], yDomain: [], maxValue: 0 },
  summary: {
    mostPopularFrontend: "none",
    mostPopularBackend: "none",
    mostPopularDatabase: "none",
    mostPopularORM: "none",
    mostPopularAPI: "none",
    mostPopularAuth: "none",
    mostPopularPackageManager: "none",
    mostPopularRuntime: "none",
    topStack: "none",
    topDatabasePair: "none",
  },
  momentum: {
    trackingDays: 0,
    last7Days: 0,
    previous7Days: 0,
    delta: 0,
    deltaPercentage: 0,
    activeDaysLast30: 0,
    peakDay: null,
    busiestHour: null,
  },
};

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
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  const connectionStatus = hasHydrated ? getConnectionStatus(connectionState) : "connecting";

  const data = stats ? buildFromPrecomputed(stats, dailyStats, monthlyStats) : emptyData;

  const legacy = {
    total: 55434,
    avgPerDay: 326.1,
    lastUpdatedIso: "2025-11-13T10:10:00.000Z",
    source: "Legacy analytics (pre-Convex)",
  };

  return <AnalyticsPage data={data} legacy={legacy} connectionStatus={connectionStatus} />;
}
