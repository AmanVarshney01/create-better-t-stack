import {
  normalizeAnalyticsCLIVersion,
  normalizeAnalyticsNodeVersion,
  normalizeAnalyticsSelection,
} from "@better-t-stack/types";

export type AnalyticsStatsFields = {
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

export type AnalyticsEventFields = {
  database?: string;
  orm?: string;
  backend?: string;
  runtime?: string;
  frontend?: string[];
  addons?: string[];
  examples?: string[];
  auth?: string;
  payments?: string;
  git?: boolean;
  packageManager?: string;
  install?: boolean;
  dbSetup?: string;
  api?: string;
  webDeploy?: string;
  serverDeploy?: string;
  cli_version?: string;
  node_version?: string;
  platform?: string;
};

export type TimestampedAnalyticsEvent = {
  event: AnalyticsEventFields;
  creationTime: number;
};

const DISTRIBUTION_FIELDS = [
  "backend",
  "frontend",
  "database",
  "orm",
  "api",
  "auth",
  "runtime",
  "packageManager",
  "platform",
  "addons",
  "examples",
  "dbSetup",
  "webDeploy",
  "serverDeploy",
  "payments",
  "git",
  "install",
  "nodeVersion",
  "cliVersion",
  "hourlyDistribution",
  "stackCombinations",
  "dbOrmCombinations",
] as const satisfies ReadonlyArray<keyof AnalyticsStatsFields>;

type DistributionField = (typeof DISTRIBUTION_FIELDS)[number];

export function createEmptyAnalyticsStats(): AnalyticsStatsFields {
  return {
    totalProjects: 0,
    lastEventTime: 0,
    backend: {},
    frontend: {},
    database: {},
    orm: {},
    api: {},
    auth: {},
    runtime: {},
    packageManager: {},
    platform: {},
    addons: {},
    examples: {},
    dbSetup: {},
    webDeploy: {},
    serverDeploy: {},
    payments: {},
    git: {},
    install: {},
    nodeVersion: {},
    cliVersion: {},
    hourlyDistribution: {},
    stackCombinations: {},
    dbOrmCombinations: {},
  };
}

function cloneStats(stats: AnalyticsStatsFields): AnalyticsStatsFields {
  const cloned = createEmptyAnalyticsStats();
  cloned.totalProjects = stats.totalProjects;
  cloned.lastEventTime = stats.lastEventTime;
  for (const field of DISTRIBUTION_FIELDS) {
    cloned[field] = { ...stats[field] };
  }
  return cloned;
}

function adjustKey(
  stats: AnalyticsStatsFields,
  field: DistributionField,
  key: string | undefined,
  delta: 1 | -1,
): void {
  if (!key) return;

  const distribution = stats[field];
  const nextCount = (distribution[key] || 0) + delta;
  if (nextCount > 0) {
    distribution[key] = nextCount;
  } else {
    delete distribution[key];
  }
}

function adjustKeys(
  stats: AnalyticsStatsFields,
  field: DistributionField,
  keys: string[] | undefined,
  delta: 1 | -1,
): void {
  for (const key of keys || []) {
    adjustKey(stats, field, key, delta);
  }
}

function getMajorVersion(version: string | undefined): string | undefined {
  if (!version) return undefined;
  const clean = version.startsWith("v") ? version.slice(1) : version;
  return `v${clean.split(".")[0]}`;
}

/** Applies one or more events symmetrically, so repair uses the exact inverse of ingestion. */
export function adjustAnalyticsStats(
  stats: AnalyticsStatsFields,
  events: TimestampedAnalyticsEvent[],
  delta: 1 | -1,
  options: { legacyVersionKeys?: boolean } = {},
): AnalyticsStatsFields {
  const next = cloneStats(stats);

  for (const { event, creationTime } of events) {
    const hourKey = String(new Date(creationTime).getUTCHours()).padStart(2, "0");
    const frontendSelections = normalizeAnalyticsSelection(event.frontend);
    const addonSelections = normalizeAnalyticsSelection(event.addons);
    const exampleSelections = normalizeAnalyticsSelection(event.examples);
    const frontend = frontendSelections[0] || "none";
    const backend = event.backend || "none";
    const database = event.database || "none";
    const orm = event.orm || "none";

    next.totalProjects += delta;
    if (delta === 1) {
      next.lastEventTime = Math.max(next.lastEventTime, creationTime);
    }

    adjustKey(next, "backend", event.backend, delta);
    adjustKeys(next, "frontend", frontendSelections, delta);
    adjustKey(next, "database", event.database, delta);
    adjustKey(next, "orm", event.orm, delta);
    adjustKey(next, "api", event.api, delta);
    adjustKey(next, "auth", event.auth, delta);
    adjustKey(next, "runtime", event.runtime, delta);
    adjustKey(next, "packageManager", event.packageManager, delta);
    adjustKey(next, "platform", event.platform, delta);
    adjustKeys(next, "addons", addonSelections, delta);
    adjustKeys(next, "examples", exampleSelections, delta);
    adjustKey(next, "dbSetup", event.dbSetup, delta);
    adjustKey(next, "webDeploy", event.webDeploy, delta);
    adjustKey(next, "serverDeploy", event.serverDeploy, delta);
    adjustKey(next, "payments", event.payments, delta);
    adjustKey(next, "git", event.git === undefined ? undefined : event.git ? "Yes" : "No", delta);
    adjustKey(
      next,
      "install",
      event.install === undefined ? undefined : event.install ? "Yes" : "No",
      delta,
    );
    adjustKey(
      next,
      "nodeVersion",
      options.legacyVersionKeys
        ? getMajorVersion(event.node_version)
        : event.node_version
          ? normalizeAnalyticsNodeVersion(event.node_version)
          : undefined,
      delta,
    );
    adjustKey(
      next,
      "cliVersion",
      options.legacyVersionKeys
        ? event.cli_version
        : event.cli_version
          ? normalizeAnalyticsCLIVersion(event.cli_version)
          : undefined,
      delta,
    );
    adjustKey(next, "hourlyDistribution", hourKey, delta);
    adjustKey(next, "stackCombinations", `${backend} + ${frontend}`, delta);
    adjustKey(next, "dbOrmCombinations", `${database} + ${orm}`, delta);
  }

  next.totalProjects = Math.max(next.totalProjects, 0);
  return next;
}
