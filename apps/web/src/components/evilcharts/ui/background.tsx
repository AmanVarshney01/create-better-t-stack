"use client";

import { useId } from "react";
import { ZIndexLayer } from "recharts";

// ── Background Variant Types ─────────────────────────────────────────────────
// To add a new variant:
// 1. Add its name to the BackgroundVariant union type below
// 2. Create a pattern component with PatternProps
// 3. Register it in PATTERN_MAP

export type BackgroundVariant =
  | "dots"
  | "grid"
  | "cross-hatch"
  | "diagonal-lines"
  | "plus"
  | "falling-triangles"
  | "4-pointed-star"
  | "tiny-checkers"
  | "overlapping-circles"
  | "wiggle-lines"
  | "bubbles";

// ── Pattern Components ───────────────────────────────────────────────────────

type PatternProps = { id: string };

const DotsPattern = ({ id }: PatternProps) => (
  <pattern id={id} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
    <circle className="text-border dark:text-border" cx="2" cy="2" r="1" fill="currentColor" />
  </pattern>
);

const GridPattern = ({ id }: PatternProps) => (
  <pattern id={id} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
    <path
      className="text-border dark:text-border"
      d="M 20 0 L 0 0 0 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.5"
    />
  </pattern>
);

const CrossHatchPattern = ({ id }: PatternProps) => (
  <pattern id={id} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
    <path
      className="text-border/60 dark:text-border/50"
      d="M 0 0 L 20 20 M 20 0 L 0 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.5"
    />
  </pattern>
);

const DiagonalLinesPattern = ({ id }: PatternProps) => (
  <pattern
    id={id}
    x="0"
    y="0"
    width="6"
    height="6"
    patternUnits="userSpaceOnUse"
    patternTransform="rotate(45)"
  >
    <line
      className="text-border dark:text-border"
      x1="0"
      y1="0"
      x2="0"
      y2="6"
      stroke="currentColor"
      strokeWidth="0.5"
    />
  </pattern>
);

const PlusPattern = ({ id }: PatternProps) => (
  <pattern id={id} x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
    <path
      className="text-border dark:text-border"
      d="M 8 4 L 8 12 M 4 8 L 12 8"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.5"
      strokeLinecap="round"
    />
  </pattern>
);

const FallingTrianglesPattern = ({ id }: PatternProps) => (
  <pattern id={id} x="0" y="0" width="18" height="36" patternUnits="userSpaceOnUse">
    <path
      className="text-border dark:text-border"
      d="M2 6h12L8 18 2 6zm18 36h12l-6 12-6-12z"
      transform="scale(0.5)"
      fill="currentColor"
      fillOpacity="0.4"
    />
  </pattern>
);

const FourPointedStarPattern = ({ id }: PatternProps) => (
  <pattern id={id} x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
    <polygon
      className="text-border dark:text-border"
      fillRule="evenodd"
      points="5 3 8 4 5 5 4 8 3 5 0 4 3 3 4 0 5 3"
      fill="currentColor"
      fillOpacity="0.4"
    />
  </pattern>
);

const TinyCheckersPattern = ({ id }: PatternProps) => (
  <pattern id={id} x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
    <path
      className="text-border dark:text-border"
      fillRule="evenodd"
      d="M0 0h4v4H0V0zm4 4h4v4H4V4z"
      fill="currentColor"
      fillOpacity="0.2"
    />
  </pattern>
);

const OverlappingCirclesPattern = ({ id }: PatternProps) => (
  <pattern id={id} x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
    <path
      className="text-border dark:text-border"
      fillRule="evenodd"
      d="M25 25c0-2.762 2.238-5 5-5s5 2.238 5 5-2.238 5-5 5c0 2.762-2.238 5-5 5s-5-2.238-5-5 2.238-5 5-5zM5 5c0-2.762 2.238-5 5-5s5 2.238 5 5-2.238 5-5 5c0 2.762-2.238 5-5 5S0 12.762 0 10s2.238-5 5-5zm5 4c2.209 0 4-1.791 4-4s-1.791-4-4-4-4 1.791-4 4 1.791 4 4 4zm20 20c2.209 0 4-1.791 4-4s-1.791-4-4-4-4 1.791-4 4 1.791 4 4 4z"
      fill="currentColor"
      fillOpacity="0.4"
    />
  </pattern>
);

const WiggleLinesPattern = ({ id }: PatternProps) => (
  <pattern
    id={id}
    x="0"
    y="0"
    width="52"
    height="26"
    patternUnits="userSpaceOnUse"
    patternTransform="scale(0.6)"
  >
    <path
      className="text-border dark:text-border"
      d="M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z"
      fill="currentColor"
      fillOpacity="0.4"
    />
  </pattern>
);

const BubblesPattern = ({ id }: PatternProps) => (
  <pattern
    id={id}
    x="0"
    y="0"
    width="100"
    height="100"
    patternUnits="userSpaceOnUse"
    patternTransform="scale(0.6667)"
  >
    <path
      className="text-border dark:text-border"
      d="M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z"
      fill="currentColor"
      fillOpacity="0.4"
      fillRule="evenodd"
    />
  </pattern>
);

// ── Pattern Registry ─────────────────────────────────────────────────────────
// Map variant names to pattern components

const PATTERN_MAP: Record<BackgroundVariant, React.FC<PatternProps>> = {
  dots: DotsPattern,
  grid: GridPattern,
  plus: PlusPattern,
  bubbles: BubblesPattern,
  "cross-hatch": CrossHatchPattern,
  "diagonal-lines": DiagonalLinesPattern,
  "falling-triangles": FallingTrianglesPattern,
  "4-pointed-star": FourPointedStarPattern,
  "tiny-checkers": TinyCheckersPattern,
  "overlapping-circles": OverlappingCirclesPattern,
  "wiggle-lines": WiggleLinesPattern,
};

// ── Main Component ───────────────────────────────────────────────────────────
// Usage: Place <ChartBackground variant="dots" /> inside any Recharts chart component.
// ZIndexLayer with zIndex={-1} ensures the background renders behind all chart content.

interface ChartBackgroundProps {
  variant: BackgroundVariant;
}

export function ChartBackground({ variant }: ChartBackgroundProps) {
  const baseId = useId().replace(/:/g, "");
  const patternId = `${baseId}-bg-${variant}`;
  const maskId = `${baseId}-bg-edge-fade`;
  const filterId = `${baseId}-bg-blur`;
  const PatternComponent = PATTERN_MAP[variant];

  return (
    <ZIndexLayer zIndex={-1}>
      <defs>
        <PatternComponent id={patternId} />
        {/* Gaussian blur filter for soft edge fade */}
        <filter id={filterId}>
          <feGaussianBlur stdDeviation="25" />
        </filter>
        {/* Mask: a slightly inset white rect with blur creates smooth transparent edges */}
        <mask id={maskId} maskUnits="userSpaceOnUse">
          <rect x="8%" y="20%" width="85%" height="60%" fill="white" filter={`url(#${filterId})`} />
        </mask>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} mask={`url(#${maskId})`} />
    </ZIndexLayer>
  );
}
