import { createFileRoute } from "@tanstack/react-router";

type StatsPayload = {
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
  fetchedAt: number;
};

const REPO = "Marve10s/Better-Fullstack";
const CACHE_TTL_MS = 5 * 60 * 1000;
const CACHE_CONTROL = "public, max-age=60, s-maxage=300, stale-while-revalidate=1800";

const globalStatsCache = globalThis as typeof globalThis & {
  __bfsStatsCache?: {
    value: StatsPayload;
    timestamp: number;
  };
  __bfsStatsInflight?: Promise<StatsPayload>;
};

function getCachedStats(): StatsPayload | null {
  const cached = globalStatsCache.__bfsStatsCache;
  if (!cached) return null;
  if (Date.now() - cached.timestamp > CACHE_TTL_MS) return null;
  return cached.value;
}

async function fetchStatsFromSources(): Promise<StatsPayload> {
  const headers = { "User-Agent": "better-fullstack-web" };

  const repoRes = await fetch(`https://api.github.com/repos/${REPO}`, { headers });
  const [openIssuesRes, closedIssuesRes, openPRsRes, mergedPRsRes, npmRes] = await Promise.all([
    fetch(`https://api.github.com/search/issues?q=repo:${REPO}+type:issue+state:open`, { headers }),
    fetch(`https://api.github.com/search/issues?q=repo:${REPO}+type:issue+state:closed`, {
      headers,
    }),
    fetch(`https://api.github.com/search/issues?q=repo:${REPO}+type:pr+state:open`, { headers }),
    fetch(`https://api.github.com/search/issues?q=repo:${REPO}+type:pr+is:merged`, { headers }),
    fetch("https://api.npmjs.org/downloads/point/last-week/create-better-fullstack"),
  ]);

  const [repoData, openIssues, closedIssues, openPRs, mergedPRs, npmData] = await Promise.all([
    repoRes.json(),
    openIssuesRes.json(),
    closedIssuesRes.json(),
    openPRsRes.json(),
    mergedPRsRes.json(),
    npmRes.json(),
  ]);

  return {
    github: {
      stars: repoData.stargazers_count ?? 0,
      openIssues: openIssues.total_count ?? 0,
      closedIssues: closedIssues.total_count ?? 0,
      openPRs: openPRs.total_count ?? 0,
      mergedPRs: mergedPRs.total_count ?? 0,
    },
    npm: {
      downloads: npmData.downloads ?? 0,
    },
    fetchedAt: Date.now(),
  };
}

async function getStats(): Promise<StatsPayload> {
  const cached = getCachedStats();
  if (cached) return cached;

  if (!globalStatsCache.__bfsStatsInflight) {
    globalStatsCache.__bfsStatsInflight = fetchStatsFromSources()
      .then((payload) => {
        globalStatsCache.__bfsStatsCache = { value: payload, timestamp: Date.now() };
        return payload;
      })
      .finally(() => {
        globalStatsCache.__bfsStatsInflight = undefined;
      });
  }

  return globalStatsCache.__bfsStatsInflight;
}

export const Route = createFileRoute("/api/stats")({
  server: {
    handlers: {
      GET: async () => {
        const headers = {
          "Cache-Control": CACHE_CONTROL,
          "Content-Type": "application/json",
        };

        try {
          const data = await getStats();
          return Response.json(data, { headers });
        } catch (error) {
          const stale = globalStatsCache.__bfsStatsCache?.value;
          if (stale) {
            return Response.json(stale, { headers });
          }
          return Response.json(
            {
              github: { stars: 0, openIssues: 0, closedIssues: 0, openPRs: 0, mergedPRs: 0 },
              npm: { downloads: 0 },
              fetchedAt: Date.now(),
              error: error instanceof Error ? error.message : "Failed to load stats",
            },
            { status: 503, headers },
          );
        }
      },
    },
  },
});
