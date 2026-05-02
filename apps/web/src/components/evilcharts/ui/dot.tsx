import * as React from "react";

import { cn } from "@/lib/utils";

export type DotVariant = "default" | "border" | "colored-border";

type ChartDotProps = {
  cx?: number;
  cy?: number;
  dataKey: string;
  chartId: string;
  className?: string;
  fillOpacity?: number;
  type?: DotVariant;
};

const ChartDot = React.memo(function ChartDot({
  cx,
  cy,
  dataKey,
  chartId: _chartId,
  className,
  fillOpacity = 1,
  type = "default",
}: ChartDotProps) {
  const dotId = React.useId().replace(/:/g, "");
  const fillColor = `var(--color-${String(dataKey)}-0)`;

  if (cx === undefined || cy === undefined) return null;

  switch (type) {
    case "border":
      return (
        <PrimaryBorderDot
          cx={cx}
          cy={cy}
          dotId={dotId}
          fillOpacity={fillOpacity}
          fillColor={fillColor}
          className={className}
        />
      );
    case "colored-border":
      return (
        <ColoredBorderDot
          cx={cx}
          cy={cy}
          dotId={dotId}
          fillOpacity={fillOpacity}
          fillColor={fillColor}
          className={className}
        />
      );
    default:
      return (
        <DefaultDot
          cx={cx}
          cy={cy}
          dotId={dotId}
          fillOpacity={fillOpacity}
          fillColor={fillColor}
          className={className}
        />
      );
  }
});

type DotVariantProps = {
  cx: number;
  cy: number;
  dotId: string;
  fillOpacity: number;
  fillColor: string;
  className?: string;
};

const DefaultDot = React.memo(
  ({ cx, cy, dotId, fillOpacity, fillColor, className }: DotVariantProps) => {
    const r = 3;
    return (
      <g className={className}>
        <defs>
          <clipPath id={`dot-clip-${dotId}`}>
            <circle cx={cx} cy={cy} r={r} />
          </clipPath>
        </defs>
        <rect
          x="0"
          y={cy - r}
          width="100%"
          height={r * 2}
          fill={fillColor}
          fillOpacity={fillOpacity}
          clipPath={`url(#dot-clip-${dotId})`}
        />
      </g>
    );
  },
);

DefaultDot.displayName = "DefaultDot";

const PrimaryBorderDot = React.memo(
  ({ cx, cy, dotId, fillOpacity, fillColor, className }: DotVariantProps) => {
    const r = 6;
    const strokeWidth = 5;
    return (
      <g className={cn(className, "text-background")}>
        <defs>
          <clipPath id={`dot-clip-${dotId}`}>
            <circle cx={cx} cy={cy} r={r} />
          </clipPath>
        </defs>
        {/* Background stroke (border) */}
        <circle cx={cx} cy={cy} r={r} fill="currentColor" />
        <rect
          x="0"
          y={cy - (r - strokeWidth / 2)}
          width="100%"
          height={(r - strokeWidth / 2) * 2}
          fill={fillColor}
          fillOpacity={fillOpacity}
          clipPath={`url(#dot-clip-inner-${dotId})`}
        />
        <defs>
          <clipPath id={`dot-clip-inner-${dotId}`}>
            <circle cx={cx} cy={cy} r={r - strokeWidth / 2} />
          </clipPath>
        </defs>
      </g>
    );
  },
);

PrimaryBorderDot.displayName = "PrimaryBorderDot";

const ColoredBorderDot = React.memo(
  ({ cx, cy, dotId, fillOpacity, fillColor, className }: DotVariantProps) => {
    const r = 3;
    const strokeWidth = 1;
    return (
      <g className={cn(className, "text-background")}>
        <defs>
          <clipPath id={`dot-clip-${dotId}`}>
            <circle cx={cx} cy={cy} r={r + strokeWidth / 2} />
          </clipPath>
        </defs>
        {/* Gradient stroke (border) via clipped rect */}
        <rect
          x="0"
          y={cy - r - strokeWidth / 2}
          width="100%"
          height={(r + strokeWidth / 2) * 2}
          fill={fillColor}
          fillOpacity={fillOpacity}
          clipPath={`url(#dot-clip-${dotId})`}
        />
        {/* Inner solid fill */}
        <circle cx={cx} cy={cy} r={r - strokeWidth / 2} fill="currentColor" />
      </g>
    );
  },
);

ColoredBorderDot.displayName = "ColoredBorderDot";

export { ChartDot };
