import { Star, GitPullRequest, CircleDot } from "lucide-react";
import { useEffect, useState } from "react";

type GitHubStats = {
  stars: number;
  openIssues: number;
  closedIssues: number;
  openPRs: number;
  mergedPRs: number;
};

const REPO = "Marve10s/Better-Fullstack";
const CACHE_KEY = "github-stats-cache";
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function formatNumber(num: number): string {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`;
  }
  return num.toString();
}

export function GitHubStats() {
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      // Check cache first
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
        // Fetch repo info for stars
        const repoRes = await fetch(`https://api.github.com/repos/${REPO}`);
        const repoData = await repoRes.json();
        const stars = repoData.stargazers_count ?? 0;

        // Fetch issue counts using search API
        const [openIssuesRes, closedIssuesRes, openPRsRes, mergedPRsRes] = await Promise.all([
          fetch(`https://api.github.com/search/issues?q=repo:${REPO}+type:issue+state:open`),
          fetch(`https://api.github.com/search/issues?q=repo:${REPO}+type:issue+state:closed`),
          fetch(`https://api.github.com/search/issues?q=repo:${REPO}+type:pr+state:open`),
          fetch(`https://api.github.com/search/issues?q=repo:${REPO}+type:pr+is:merged`),
        ]);

        const [openIssues, closedIssues, openPRs, mergedPRs] = await Promise.all([
          openIssuesRes.json(),
          closedIssuesRes.json(),
          openPRsRes.json(),
          mergedPRsRes.json(),
        ]);

        const data: GitHubStats = {
          stars,
          openIssues: openIssues.total_count ?? 0,
          closedIssues: closedIssues.total_count ?? 0,
          openPRs: openPRs.total_count ?? 0,
          mergedPRs: mergedPRs.total_count ?? 0,
        };

        // Cache the result
        localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch GitHub stats:", error);
        // Try to use stale cache
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

  if (loading || !stats) {
    return (
      <a
        href={`https://github.com/${REPO}`}
        target="_blank"
        rel="noopener noreferrer"
        className="hidden items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground sm:flex"
      >
        <Star className="h-4 w-4" />
        <span className="h-4 w-8 animate-pulse rounded bg-muted" />
      </a>
    );
  }

  return (
    <div className="hidden items-center gap-3 sm:flex">
      {/* Stars */}
      <a
        href={`https://github.com/${REPO}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        title={`${stats.stars} stars`}
      >
        <Star className="h-3.5 w-3.5" />
        <span>{formatNumber(stats.stars)}</span>
      </a>

      {/* Issues */}
      <a
        href={`https://github.com/${REPO}/issues`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        title={`${stats.openIssues} open, ${stats.closedIssues} closed issues`}
      >
        <CircleDot className="h-3.5 w-3.5" />
        <span>
          {stats.openIssues}/{stats.closedIssues}
        </span>
      </a>

      {/* PRs */}
      <a
        href={`https://github.com/${REPO}/pulls`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        title={`${stats.openPRs} open, ${stats.mergedPRs} merged PRs`}
      >
        <GitPullRequest className="h-3.5 w-3.5" />
        <span>
          {stats.openPRs}/{stats.mergedPRs}
        </span>
      </a>
    </div>
  );
}
