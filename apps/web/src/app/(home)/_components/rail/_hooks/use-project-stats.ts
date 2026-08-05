"use client";

import { api } from "@better-t-stack/backend/convex/_generated/api";
import { useNpmDownloadCounter } from "@erquhart/convex-oss-stats/react";
import { useQuery } from "convex/react";

type NpmPackageStats = NonNullable<Parameters<typeof useNpmDownloadCounter>[0]>;
type GithubRepoStats = {
  starCount: number;
  contributorCount: number;
};

const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

function getDaySpan(firstDate: string | null, lastDate: string | null): number {
  if (!firstDate || !lastDate) return 0;
  const start = Date.parse(`${firstDate}T00:00:00Z`);
  const end = Date.parse(`${lastDate}T00:00:00Z`);
  if (Number.isNaN(start) || Number.isNaN(end) || end < start) return 0;
  return Math.floor((end - start) / MILLISECONDS_PER_DAY) + 1;
}

export function useProjectStats() {
  const stats = useQuery(api.analytics.getStats, {});
  const monthlyStats = useQuery(api.analytics.getMonthlyStats, {});
  const githubRepo = useQuery(api.stats.getGithubRepo, {
    name: "AmanVarshney01/create-better-t-stack",
  }) as GithubRepoStats | null | undefined;
  const npmPackages = useQuery(api.stats.getNpmPackages, {
    names: ["create-better-t-stack"],
  }) as NpmPackageStats | null | undefined;

  const liveNpmDownloadCount = useNpmDownloadCounter(npmPackages);

  const totalProjects = stats?.totalProjects ?? null;
  const trackingDays = getDaySpan(monthlyStats?.firstDate ?? null, monthlyStats?.lastDate ?? null);

  return {
    totalProjects,
    avgProjectsPerDay:
      trackingDays > 0 && totalProjects ? (totalProjects / trackingDays).toFixed(1) : null,
    lastUpdated: stats?.lastEventTime
      ? new Date(stats.lastEventTime).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : null,
    starCount: githubRepo?.starCount ?? null,
    contributorCount: githubRepo?.contributorCount ?? null,
    downloadCount: liveNpmDownloadCount?.count ?? null,
    downloadIntervalMs: liveNpmDownloadCount?.intervalMs ?? 1000,
    npmAvgPerDay: npmPackages?.dayOfWeekAverages
      ? Math.round(
          npmPackages.dayOfWeekAverages.reduce((a: number, b: number) => a + b, 0) /
            npmPackages.dayOfWeekAverages.length,
        )
      : null,
  };
}
