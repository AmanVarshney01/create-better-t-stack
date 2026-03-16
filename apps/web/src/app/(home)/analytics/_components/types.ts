export type DistributionItem = { name: string; value: number };
export type Distribution = DistributionItem[];

export type ShareDistributionItem = DistributionItem & {
  share: number;
};

export type VersionDistributionItem = {
  version: string;
  count: number;
  share: number;
};

export type VersionDistribution = VersionDistributionItem[];

export type TimeSeriesPoint = {
  date: string;
  dateValue: Date;
  count: number;
  rollingAverage: number;
  cumulativeProjects: number;
};

export type MonthlyPoint = {
  month: string;
  monthDate: Date;
  totalProjects: number;
  cumulativeProjects: number;
};

export type HourlyPoint = {
  hour: string;
  hourValue: number;
  label: string;
  count: number;
};

export type WeekdayPoint = {
  weekday: string;
  shortLabel: string;
  dayIndex: number;
  count: number;
  averageDailyProjects: number;
};

export type ComboMatrixPoint = {
  x: string;
  y: string;
  count: number;
  share: number;
};

export type ComboMatrix = {
  data: ComboMatrixPoint[];
  xDomain: string[];
  yDomain: string[];
  maxValue: number;
};

export type MomentumSnapshot = {
  trackingDays: number;
  last7Days: number;
  previous7Days: number;
  delta: number;
  deltaPercentage: number | null;
  activeDaysLast30: number;
  peakDay: { date: string; count: number } | null;
  busiestHour: { hour: string; count: number } | null;
};

export type AggregatedAnalyticsData = {
  lastUpdated: string | null;
  totalProjects: number;
  avgProjectsPerDay: number;
  timeSeries: TimeSeriesPoint[];
  monthlyTimeSeries: MonthlyPoint[];
  hourlyDistribution: HourlyPoint[];
  weekdayDistribution: WeekdayPoint[];
  platformDistribution: ShareDistributionItem[];
  packageManagerDistribution: ShareDistributionItem[];
  backendDistribution: ShareDistributionItem[];
  databaseDistribution: ShareDistributionItem[];
  ormDistribution: ShareDistributionItem[];
  dbSetupDistribution: ShareDistributionItem[];
  apiDistribution: ShareDistributionItem[];
  frontendDistribution: ShareDistributionItem[];
  authDistribution: ShareDistributionItem[];
  runtimeDistribution: ShareDistributionItem[];
  addonsDistribution: ShareDistributionItem[];
  examplesDistribution: ShareDistributionItem[];
  gitDistribution: ShareDistributionItem[];
  installDistribution: ShareDistributionItem[];
  webDeployDistribution: ShareDistributionItem[];
  serverDeployDistribution: ShareDistributionItem[];
  paymentsDistribution: ShareDistributionItem[];
  nodeVersionDistribution: VersionDistribution;
  cliVersionDistribution: VersionDistribution;
  stackCombinationDistribution: ShareDistributionItem[];
  databaseORMCombinationDistribution: ShareDistributionItem[];
  stackMatrix: ComboMatrix;
  databaseOrmMatrix: ComboMatrix;
  summary: {
    mostPopularFrontend: string;
    mostPopularBackend: string;
    mostPopularDatabase: string;
    mostPopularORM: string;
    mostPopularAPI: string;
    mostPopularAuth: string;
    mostPopularPackageManager: string;
    mostPopularRuntime: string;
    topStack: string;
    topDatabasePair: string;
  };
  momentum: MomentumSnapshot;
};
