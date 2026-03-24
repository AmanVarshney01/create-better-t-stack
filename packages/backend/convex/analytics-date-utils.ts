export type DailyCount = {
  date: string;
  count: number;
};

const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

function parseUtcDate(date: string): number | null {
  const timestamp = Date.parse(`${date}T00:00:00Z`);
  return Number.isNaN(timestamp) ? null : timestamp;
}

function formatUtcDate(timestamp: number): string {
  return new Date(timestamp).toISOString().slice(0, 10);
}

export function buildDailyWindow(
  items: DailyCount[],
  startDate: string,
  endDate: string,
): DailyCount[] {
  const start = parseUtcDate(startDate);
  const end = parseUtcDate(endDate);

  if (start === null || end === null || end < start) {
    return [...items].sort((a, b) => a.date.localeCompare(b.date));
  }

  const countsByDate = new Map<string, number>();
  for (const item of items) {
    countsByDate.set(item.date, (countsByDate.get(item.date) || 0) + item.count);
  }

  const result: DailyCount[] = [];
  for (let timestamp = start; timestamp <= end; timestamp += MILLISECONDS_PER_DAY) {
    const date = formatUtcDate(timestamp);
    result.push({
      date,
      count: countsByDate.get(date) || 0,
    });
  }

  return result;
}
