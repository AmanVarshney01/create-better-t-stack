import { CircleDot, Download, GitPullRequest, Star } from "lucide-react";
import { useEffect, useState } from "react";

type NavbarStatsData = {
  github: {
    stars: number;
    openIssues: number;
    closedIssues: number;
    openPRs: number;
    mergedPRs: number;
  };
  npm: {
    downloads: number;
  };
};

const REPO = "Marve10s/Better-Fullstack";
const CACHE_KEY = "navbar-stats-cache-v1";
const CACHE_TTL_MS = 5 * 60 * 1000;

let memoryCache: { data: NavbarStatsData; timestamp: number } | null = null;
let inflight: Promise<NavbarStatsData> | null = null;

function formatCompact(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}k`;
  return num.toString();
}

function readCachedStats(): NavbarStatsData | null {
  if (memoryCache && Date.now() - memoryCache.timestamp < CACHE_TTL_MS) {
    return memoryCache.data;
  }

  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { data: NavbarStatsData; timestamp: number };
    if (Date.now() - parsed.timestamp >= CACHE_TTL_MS) return null;
    memoryCache = parsed;
    return parsed.data;
  } catch {
    return null;
  }
}

function writeCachedStats(data: NavbarStatsData) {
  const value = { data, timestamp: Date.now() };
  memoryCache = value;
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(value));
  } catch {
    // no-op
  }
}

async function fetchNavbarStats(): Promise<NavbarStatsData> {
  const cached = readCachedStats();
  if (cached) return cached;

  if (!inflight) {
    inflight = fetch("/api/stats")
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch navbar stats (${res.status})`);
        return res.json() as Promise<NavbarStatsData>;
      })
      .then((data) => {
        writeCachedStats(data);
        return data;
      })
      .finally(() => {
        inflight = null;
      });
  }

  return inflight;
}

export function NavbarStats() {
  const [stats, setStats] = useState<NavbarStatsData | null>(() => readCachedStats());

  useEffect(() => {
    let cancelled = false;
    void fetchNavbarStats()
      .then((data) => {
        if (!cancelled) setStats(data);
      })
      .catch(() => {
        // Keep UI resilient; placeholders remain if stats are unavailable.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!stats) {
    return (
      <>
        <div className="hidden h-4 w-12 animate-pulse rounded bg-muted sm:block" />
        <div className="hidden h-4 w-12 animate-pulse rounded bg-muted sm:block" />
      </>
    );
  }

  return (
    <>
      <div className="hidden items-center gap-3 sm:flex">
        <a
          href={`https://github.com/${REPO}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          title={`${stats.github.stars} stars`}
        >
          <Star className="h-3.5 w-3.5" />
          <span>{formatCompact(stats.github.stars)}</span>
        </a>

        <a
          href={`https://github.com/${REPO}/issues`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          title={`${stats.github.openIssues} open, ${stats.github.closedIssues} closed issues`}
        >
          <CircleDot className="h-3.5 w-3.5" />
          <span>
            {stats.github.openIssues}/{stats.github.closedIssues}
          </span>
        </a>

        <a
          href={`https://github.com/${REPO}/pulls`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          title={`${stats.github.openPRs} open, ${stats.github.mergedPRs} merged PRs`}
        >
          <GitPullRequest className="h-3.5 w-3.5" />
          <span>
            {stats.github.openPRs}/{stats.github.mergedPRs}
          </span>
        </a>
      </div>

      <a
        href="https://www.npmjs.com/package/create-better-fullstack"
        target="_blank"
        rel="noopener noreferrer"
        className="hidden items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground sm:flex"
        title={`${stats.npm.downloads.toLocaleString()} downloads this week`}
      >
        <Download className="h-3.5 w-3.5" />
        <span className="tabular-nums">{formatCompact(stats.npm.downloads)}/wk</span>
      </a>
    </>
  );
}
