import type { ChartDatum } from "./chart-data";

export function filterDataByXDomain(
  data: ChartDatum[],
  xDomain: [Date, Date],
  xAccessor: (d: ChartDatum) => Date,
): ChartDatum[] {
  const start = xDomain[0].getTime();
  const end = xDomain[1].getTime();
  const minTime = Math.min(start, end);
  const maxTime = Math.max(start, end);

  return data.filter((d) => {
    const time = xAccessor(d).getTime();
    return time >= minTime && time <= maxTime;
  });
}

export function resolveDataXExtent(
  data: ChartDatum[],
  xAccessor: (d: ChartDatum) => Date,
): [Date, Date] | null {
  if (data.length === 0) {
    return null;
  }

  let minTime = Number.POSITIVE_INFINITY;
  let maxTime = Number.NEGATIVE_INFINITY;

  for (const point of data) {
    const time = xAccessor(point).getTime();
    if (time < minTime) {
      minTime = time;
    }
    if (time > maxTime) {
      maxTime = time;
    }
  }

  if (minTime === Number.POSITIVE_INFINITY) {
    return null;
  }

  return [new Date(minTime), new Date(maxTime)];
}

/** Brush track extent — optionally extends past the last data row (e.g. projections). */
export function resolveBrushTrackXExtent(
  data: ChartDatum[],
  xAccessor: (d: ChartDatum) => Date,
  xExtentMax?: Date,
): [Date, Date] | null {
  const extent = resolveDataXExtent(data, xAccessor);
  if (!extent) {
    return null;
  }
  if (!xExtentMax || xExtentMax.getTime() <= extent[1].getTime()) {
    return extent;
  }
  return [extent[0], xExtentMax];
}
