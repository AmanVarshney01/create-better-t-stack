import { formatRgb, interpolate } from "culori";
import { format } from "date-fns";

import type {
  ComboMatrix,
  Distribution,
  ShareDistributionItem,
  TimeSeriesPoint,
  VersionDistribution,
  WeekdayPoint,
} from "./types";

const compactNumberFormatter = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const countFormatter = new Intl.NumberFormat("en");

const percentFormatter = new Intl.NumberFormat("en", {
  style: "percent",
  maximumFractionDigits: 0,
});

const precisePercentFormatter = new Intl.NumberFormat("en", {
  style: "percent",
  maximumFractionDigits: 1,
});

const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

export type PlotMargins = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export function formatCompactNumber(value: number): string {
  return compactNumberFormatter.format(value);
}

export function formatCount(value: number): string {
  return countFormatter.format(value);
}

export function formatPercent(value: number, precise = value > 0 && value < 0.1): string {
  return (precise ? precisePercentFormatter : percentFormatter).format(value);
}

export function formatDelta(value: number | null): string {
  if (value === null) return "new";
  const formatted = `${Math.abs(value * 100).toFixed(Math.abs(value) >= 0.1 ? 0 : 1)}%`;
  if (value === 0) return "0%";
  return `${value > 0 ? "+" : "-"}${formatted}`;
}

export function formatDateLabel(date: string): string {
  return format(new Date(`${date}T00:00:00`), "MMM d");
}

export function formatMonthLabel(month: string, pattern = "MMM yyyy"): string {
  return format(new Date(`${month}-01T00:00:00`), pattern);
}

export function formatHourLabel(hour: string): string {
  return hour.replace(":00", "");
}

export function shortenLabel(value: string, maxLength = 18): string {
  return value.length > maxLength ? `${value.slice(0, maxLength - 1)}…` : value;
}

export function shortenMiddleLabel(value: string, maxLength = 18): string {
  if (value.length <= maxLength) return value;
  if (maxLength <= 5) return `${value.slice(0, Math.max(1, maxLength - 1))}…`;

  const suffixLength = Math.max(3, Math.floor((maxLength - 1) / 3));
  const prefixLength = Math.max(3, maxLength - suffixLength - 1);

  return `${value.slice(0, prefixLength)}…${value.slice(-suffixLength)}`;
}

export function buildCompactCategoryLabels(values: string[], maxLength = 12): string[] {
  const used = new Set<string>();

  return values.map((value) => {
    const attempts = [
      shortenMiddleLabel(value, maxLength),
      shortenMiddleLabel(value, maxLength + 2),
      shortenMiddleLabel(value, maxLength + 4),
      value,
    ];

    for (const candidate of attempts) {
      if (!used.has(candidate)) {
        used.add(candidate);
        return candidate;
      }
    }

    const base = shortenMiddleLabel(value, Math.max(6, maxLength - 2));
    let suffix = 2;
    let candidate = `${base}-${suffix}`;

    while (used.has(candidate)) {
      suffix += 1;
      candidate = `${base}-${suffix}`;
    }

    used.add(candidate);
    return candidate;
  });
}

export function withShare(items: Distribution, total?: number): ShareDistributionItem[] {
  const resolvedTotal = total ?? items.reduce((sum, item) => sum + item.value, 0);
  if (resolvedTotal <= 0) {
    return items.map((item) => ({ ...item, share: 0 }));
  }

  return items.map((item) => ({
    ...item,
    share: item.value / resolvedTotal,
  }));
}

export function versionWithShare(
  items: Array<{ version: string; count: number }>,
  total?: number,
): VersionDistribution {
  const resolvedTotal = total ?? items.reduce((sum, item) => sum + item.count, 0);
  if (resolvedTotal <= 0) {
    return items.map((item) => ({ ...item, share: 0 }));
  }

  return items.map((item) => ({
    ...item,
    share: item.count / resolvedTotal,
  }));
}

export function buildWeekdayDistribution(timeSeries: TimeSeriesPoint[]): WeekdayPoint[] {
  const seed = [
    { weekday: "Monday", shortLabel: "Mon", dayIndex: 1 },
    { weekday: "Tuesday", shortLabel: "Tue", dayIndex: 2 },
    { weekday: "Wednesday", shortLabel: "Wed", dayIndex: 3 },
    { weekday: "Thursday", shortLabel: "Thu", dayIndex: 4 },
    { weekday: "Friday", shortLabel: "Fri", dayIndex: 5 },
    { weekday: "Saturday", shortLabel: "Sat", dayIndex: 6 },
    { weekday: "Sunday", shortLabel: "Sun", dayIndex: 0 },
  ].map((day) => ({ ...day, count: 0, dayCount: 0 }));

  if (timeSeries.length === 0) {
    return seed.map(({ dayCount: _dayCount, ...day }) => ({
      ...day,
      averageDailyProjects: 0,
    }));
  }

  const countsByDate = new Map(timeSeries.map((point) => [point.date, point.count]));
  const sortedDates = Array.from(countsByDate.keys()).sort((a, b) => a.localeCompare(b));
  const start = Date.parse(`${sortedDates[0]}T00:00:00Z`);
  const end = Date.parse(`${sortedDates.at(-1)}T00:00:00Z`);

  if (Number.isNaN(start) || Number.isNaN(end) || end < start) {
    return seed.map(({ dayCount: _dayCount, ...day }) => ({
      ...day,
      averageDailyProjects: 0,
    }));
  }

  for (let timestamp = start; timestamp <= end; timestamp += MILLISECONDS_PER_DAY) {
    const date = new Date(timestamp).toISOString().slice(0, 10);
    const dayIndex = new Date(timestamp).getUTCDay();
    const target = seed.find((day) => day.dayIndex === dayIndex);
    if (!target) continue;
    target.count += countsByDate.get(date) || 0;
    target.dayCount += 1;
  }

  return seed.map(({ dayCount, ...day }) => ({
    ...day,
    averageDailyProjects: dayCount > 0 ? day.count / dayCount : 0,
  }));
}

type MatrixOptions = {
  distribution: ShareDistributionItem[];
  total: number;
  xFromLabel: (name: string) => string;
  yFromLabel: (name: string) => string;
  xLimit?: number;
  yLimit?: number;
};

export function buildComboMatrix({
  distribution,
  total,
  xFromLabel,
  yFromLabel,
  xLimit,
  yLimit,
}: MatrixOptions): ComboMatrix {
  const pairs = distribution
    .map((item) => ({
      x: xFromLabel(item.name),
      y: yFromLabel(item.name),
      count: item.value,
    }))
    .filter((item) => item.x && item.y);

  const xTotals = new Map<string, number>();
  const yTotals = new Map<string, number>();
  const counts = new Map<string, number>();

  for (const pair of pairs) {
    xTotals.set(pair.x, (xTotals.get(pair.x) || 0) + pair.count);
    yTotals.set(pair.y, (yTotals.get(pair.y) || 0) + pair.count);
    counts.set(`${pair.x}:::${pair.y}`, (counts.get(`${pair.x}:::${pair.y}`) || 0) + pair.count);
  }

  const rankedXDomain = Array.from(xTotals.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([name]) => name);

  const rankedYDomain = Array.from(yTotals.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([name]) => name);

  const xDomain = typeof xLimit === "number" ? rankedXDomain.slice(0, xLimit) : rankedXDomain;
  const yDomain = typeof yLimit === "number" ? rankedYDomain.slice(0, yLimit) : rankedYDomain;

  const data = yDomain.flatMap((y) =>
    xDomain.map((x) => {
      const count = counts.get(`${x}:::${y}`) || 0;
      return {
        x,
        y,
        count,
        share: total > 0 ? count / total : 0,
      };
    }),
  );

  return {
    data,
    xDomain,
    yDomain,
    maxValue: Math.max(...data.map((item) => item.count), 0),
  };
}

export function splitComboLabel(value: string): [string, string] {
  const [left = "none", ...rest] = value.split(" + ");
  return [left.trim(), rest.join(" + ").trim() || "none"];
}

export function getTrendTone(deltaPercentage: number | null): "up" | "down" | "flat" {
  if (deltaPercentage === null) return "up";
  if (deltaPercentage > 0.02) return "up";
  if (deltaPercentage < -0.02) return "down";
  return "flat";
}

export function interpolateColor(start: string, end: string, ratio: number): string {
  const mixer = interpolate([start, end]);
  return formatRgb(mixer(Math.min(1, Math.max(0, ratio)))) || end;
}

export function isCompactPlot(width: number): boolean {
  return width < 480;
}

export function resolvePlotMargins(
  width: number,
  desktop: PlotMargins,
  compact: PlotMargins,
): PlotMargins {
  return isCompactPlot(width) ? compact : desktop;
}

export function getPlotFontSize(width: number): string {
  return isCompactPlot(width) ? "11px" : "12px";
}

export function resolveHorizontalBarMargins({
  width,
  longestLabelLength,
  longestValueLength,
  desktop,
  compact,
}: {
  width: number;
  longestLabelLength: number;
  longestValueLength: number;
  desktop: PlotMargins;
  compact: PlotMargins;
}): PlotMargins {
  const compactView = isCompactPlot(width);
  const base = compactView ? compact : desktop;

  return {
    top: base.top,
    bottom: base.bottom,
    left: Math.max(
      base.left,
      Math.min(
        compactView ? 132 : 188,
        base.left + Math.max(0, longestLabelLength - 8) * (compactView ? 4 : 5.5),
      ),
    ),
    right: Math.max(
      base.right,
      Math.min(
        compactView ? 82 : 112,
        base.right + Math.max(0, longestValueLength - 3) * (compactView ? 5 : 7),
      ),
    ),
  };
}
