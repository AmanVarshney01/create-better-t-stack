import type { ChartConfig } from "@/components/evilcharts/ui/chart";

import type { ShareDistributionItem } from "./types";

type EvilTone = "blue" | "teal" | "amber" | "rose" | "violet" | "slate";

const toneColors: Record<EvilTone, NonNullable<ChartConfig[string]["colors"]>> = {
  blue: {
    light: ["#1d4ed8", "#60a5fa"],
    dark: ["#60a5fa", "#2563eb"],
  },
  teal: {
    light: ["#0f766e", "#2dd4bf"],
    dark: ["#2dd4bf", "#0f766e"],
  },
  amber: {
    light: ["#ca8a04", "#facc15"],
    dark: ["#facc15", "#ca8a04"],
  },
  rose: {
    light: ["#be123c", "#fb7185"],
    dark: ["#fb7185", "#be123c"],
  },
  violet: {
    light: ["#7c3aed", "#c084fc"],
    dark: ["#c084fc", "#7c3aed"],
  },
  slate: {
    light: ["#475569", "#94a3b8"],
    dark: ["#cbd5e1", "#64748b"],
  },
};

const toneOrder: EvilTone[] = ["blue", "teal", "amber", "rose", "violet", "slate"];

export function seriesConfig<TKey extends string>(
  key: TKey,
  label: string,
  tone: EvilTone,
): Record<TKey, ChartConfig[string]> {
  return {
    [key]: {
      label,
      colors: toneColors[tone],
    },
  } as Record<TKey, ChartConfig[string]>;
}

export function multiSeriesConfig<const TKey extends string>(
  entries: Array<{ key: TKey; label: string; tone: EvilTone }>,
): Record<TKey, ChartConfig[string]> {
  return Object.fromEntries(
    entries.map((entry) => [
      entry.key,
      {
        label: entry.label,
        colors: toneColors[entry.tone],
      },
    ]),
  ) as Record<TKey, ChartConfig[string]>;
}

function slugify(value: string): string {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return slug || "none";
}

export type KeyedShareItem = ShareDistributionItem & {
  key: string;
};

export function toKeyedShareItems(
  items: ShareDistributionItem[],
  prefix: string,
): KeyedShareItem[] {
  const seen = new Map<string, number>();

  return items.map((item) => {
    const base = `${prefix}-${slugify(item.name)}`;
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);

    return {
      ...item,
      key: count === 0 ? base : `${base}-${count + 1}`,
    };
  });
}

export function categoryConfig(items: KeyedShareItem[], toneOffset = 0): ChartConfig {
  return Object.fromEntries(
    items.map((item, index) => {
      const tone = toneOrder[(index + toneOffset) % toneOrder.length] ?? "blue";

      return [
        item.key,
        {
          label: item.name,
          colors: toneColors[tone],
        },
      ];
    }),
  );
}

export function getTone(index: number): EvilTone {
  return toneOrder[index % toneOrder.length] ?? "blue";
}
