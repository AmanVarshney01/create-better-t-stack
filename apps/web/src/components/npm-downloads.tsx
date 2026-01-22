"use client";

import { Download } from "lucide-react";
import { useEffect, useState } from "react";

type NpmStats = {
  downloads: number;
};

const CACHE_KEY = "npm-downloads-cache";
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`;
  }
  return num.toString();
}

export function NpmDownloads() {
  const [stats, setStats] = useState<NpmStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          setStats(data);
          setLoading(false);
          return;
        }
      }

      try {
        const res = await fetch(
          "https://api.npmjs.org/downloads/point/last-week/create-better-fullstack",
        );
        const data = await res.json();
        const stats = { downloads: data.downloads };
        localStorage.setItem(CACHE_KEY, JSON.stringify({ data: stats, timestamp: Date.now() }));
        setStats(stats);
      } catch (error) {
        console.error("Failed to fetch npm stats:", error);
        if (cached) {
          const { data } = JSON.parse(cached);
          setStats(data);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <a
      href="https://www.npmjs.com/package/create-better-fullstack"
      target="_blank"
      rel="noopener noreferrer"
      className="hidden items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground sm:flex"
      title={stats ? `${stats.downloads.toLocaleString()} downloads this week` : "npm downloads"}
    >
      <Download className="h-3.5 w-3.5" />
      {loading || !stats ? (
        <span className="h-4 w-8 animate-pulse rounded bg-muted" />
      ) : (
        <span className="tabular-nums">{formatNumber(stats.downloads)}/wk</span>
      )}
    </a>
  );
}
