"use client";

import { motion } from "motion/react";
import { useCallback, useId, useMemo, useRef, useState, type ComponentProps } from "react";
import { Area, AreaChart, CartesianGrid, ReferenceLine, XAxis, YAxis } from "recharts";

import { ChartBackground, type BackgroundVariant } from "@/components/evilcharts/ui/background";
import {
  axisValueToPercentFormatter,
  type ChartConfig,
  ChartContainer,
  getColorsCount,
  getLoadingData,
  LoadingIndicator,
} from "@/components/evilcharts/ui/chart";
import { ChartDot, DotVariant } from "@/components/evilcharts/ui/dot";
import {
  EvilBrush,
  useEvilBrush,
  type EvilBrushRange,
} from "@/components/evilcharts/ui/evil-brush";
import {
  ChartLegend,
  ChartLegendContent,
  type ChartLegendVariant,
} from "@/components/evilcharts/ui/legend";
import {
  ChartTooltip,
  ChartTooltipContent,
  type TooltipRoundness,
  type TooltipVariant,
} from "@/components/evilcharts/ui/tooltip";

// Constants
const STROKE_WIDTH = 0.8;
const LOADING_AREA_DATA_KEY = "loading";
const LOADING_ANIMATION_DURATION = 2000; // in milliseconds

type ChartProps = ComponentProps<typeof AreaChart>;
type XAxisProps = ComponentProps<typeof XAxis>;
type YAxisProps = ComponentProps<typeof YAxis>;
type AreaType = ComponentProps<typeof Area>["type"];
type AreaVariant = "gradient" | "gradient-reverse" | "solid" | "dotted" | "lines" | "hatched";
type StrokeVariant = "solid" | "dashed" | "animated-dashed";
type StackType = "default" | "expanded" | "stacked";

// Validating Tyes to make sure user have provided valid data according to chartConfig
type ValidateConfigKeys<TData, TConfig> = {
  [K in keyof TConfig]: K extends keyof TData ? ChartConfig[string] : never;
};

type BaseEvilAreaChartProps<
  TData extends Record<string, unknown>,
  TConfig extends Record<string, ChartConfig[string]>,
> = {
  chartConfig: TConfig & ValidateConfigKeys<TData, TConfig>;
  data: TData[];
  xDataKey?: keyof TData & string;
  yDataKey?: keyof TData & string;
  className?: string;
  chartProps?: ChartProps;
  xAxisProps?: XAxisProps;
  yAxisProps?: YAxisProps;
  defaultSelectedDataKey?: string | null;
  curveType?: AreaType;
  areaVariant?: AreaVariant;
  strokeVariant?: StrokeVariant;
  stackType?: StackType;
  dotVariant?: DotVariant;
  activeDotVariant?: DotVariant;
  legendVariant?: ChartLegendVariant;
  connectNulls?: boolean;
  tickGap?: number;
  // Hide Stuffs
  hideTooltip?: boolean;
  hideCartesianGrid?: boolean;
  hideLegend?: boolean;
  hideCursorLine?: boolean;
  // Tooltip
  tooltipRoundness?: TooltipRoundness;
  tooltipVariant?: TooltipVariant;
  tooltipDefaultIndex?: number;
  isLoading?: boolean;
  loadingPoints?: number;
  // Brush
  showBrush?: boolean;
  brushHeight?: number;
  brushFormatLabel?: (value: unknown, index: number) => string;
  onBrushChange?: (range: EvilBrushRange) => void;
  // Background
  backgroundVariant?: BackgroundVariant;
};

type EvilAreaChartClickable = {
  isClickable: true;
  onSelectionChange?: (selectedDataKey: string | null) => void;
};

type EvilAreaChartNotClickable = {
  isClickable?: false;
  onSelectionChange?: never;
};

type EvilAreaChartProps<
  TData extends Record<string, unknown>,
  TConfig extends Record<string, ChartConfig[string]>,
> = BaseEvilAreaChartProps<TData, TConfig> & (EvilAreaChartClickable | EvilAreaChartNotClickable);

export function EvilAreaChart<
  TData extends Record<string, unknown>,
  TConfig extends Record<string, ChartConfig[string]>,
>({
  chartConfig,
  data,
  xDataKey,
  yDataKey,
  className,
  chartProps,
  xAxisProps,
  yAxisProps,
  defaultSelectedDataKey = null,
  curveType = "linear",
  areaVariant = "gradient",
  strokeVariant = "dashed",
  stackType = "default",
  dotVariant,
  activeDotVariant,
  legendVariant,
  connectNulls = false,
  tickGap = 8,
  hideTooltip = false,
  hideCartesianGrid = false,
  hideLegend = false,
  hideCursorLine = false,
  tooltipRoundness,
  tooltipVariant,
  tooltipDefaultIndex,
  isClickable = false,
  isLoading = false,
  loadingPoints,
  showBrush = false,
  brushHeight,
  brushFormatLabel,
  onBrushChange,
  onSelectionChange,
  backgroundVariant,
}: EvilAreaChartProps<TData, TConfig>) {
  const [selectedDataKey, setSelectedDataKey] = useState<string | null>(defaultSelectedDataKey);
  const { loadingData, onShimmerExit } = useLoadingData(isLoading, loadingPoints);
  const chartId = useId().replace(/:/g, ""); // Remove colons for valid CSS selectors

  // ── Zoom state ──────────────────────────────────────────────────────────
  const { visibleData, brushProps } = useEvilBrush({ data });
  const displayData = showBrush && !isLoading ? visibleData : data;

  // Wrapper function to update state and call parent callback
  // Only call callback when isClickable is true
  const handleSelectionChange = useCallback(
    (newSelectedDataKey: string | null) => {
      setSelectedDataKey(newSelectedDataKey);
      if (isClickable && onSelectionChange) {
        onSelectionChange(newSelectedDataKey);
      }
    },
    [onSelectionChange, isClickable],
  );

  const isExpanded = stackType === "expanded";
  const isStacked = stackType === "stacked" || stackType === "expanded";

  return (
    <ChartContainer
      className={className}
      config={chartConfig}
      footer={
        showBrush &&
        !isLoading && (
          <EvilBrush
            data={data}
            chartConfig={chartConfig}
            xDataKey={xDataKey}
            variant="area"
            curveType={curveType}
            strokeVariant={strokeVariant}
            connectNulls={connectNulls}
            height={brushHeight}
            formatLabel={brushFormatLabel}
            stacked={isStacked}
            skipStyle
            className="mt-1"
            {...brushProps}
            onChange={(range) => {
              brushProps.onChange(range);
              onBrushChange?.(range);
            }}
          />
        )
      }
    >
      <LoadingIndicator isLoading={isLoading} />
      <AreaChart
        id="evil-charts-area-chart"
        accessibilityLayer
        stackOffset={isExpanded ? "expand" : undefined}
        data={isLoading ? loadingData : displayData}
        {...chartProps}
      >
        {backgroundVariant && <ChartBackground variant={backgroundVariant} />}
        <ReferenceLine color="white" />
        {!hideCartesianGrid && !backgroundVariant && (
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
        )}
        {!hideLegend && (
          <ChartLegend
            verticalAlign="top"
            align="right"
            content={
              <ChartLegendContent
                selected={selectedDataKey}
                onSelectChange={handleSelectionChange}
                isClickable={isClickable}
                variant={legendVariant}
              />
            }
          />
        )}
        {xDataKey && !isLoading && (
          <XAxis
            dataKey={xDataKey}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={tickGap}
            {...xAxisProps}
          />
        )}
        {yDataKey && !isLoading && (
          <YAxis
            dataKey={yDataKey}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={tickGap}
            width="auto"
            tickFormatter={
              stackType === "expanded" ? axisValueToPercentFormatter : yAxisProps?.tickFormatter
            }
            {...yAxisProps}
          />
        )}
        {!hideTooltip && !isLoading && (
          <ChartTooltip
            defaultIndex={tooltipDefaultIndex}
            cursor={
              hideCursorLine
                ? false
                : {
                    strokeDasharray:
                      strokeVariant === "dashed" || strokeVariant === "animated-dashed"
                        ? "3 3"
                        : undefined,
                    strokeWidth: STROKE_WIDTH,
                  }
            }
            content={
              <ChartTooltipContent
                selected={selectedDataKey}
                roundness={tooltipRoundness}
                variant={tooltipVariant}
              />
            }
          />
        )}
        {!isLoading &&
          Object.keys(chartConfig).map((dataKey) => {
            const _opacity = getOpacity(isClickable, selectedDataKey, dataKey);
            const isSelected = selectedDataKey === dataKey;
            const hasSelection = selectedDataKey !== null;

            // Get fill pattern based on variant and selection state
            const fillPattern = getFillPattern(
              areaVariant,
              isClickable,
              hasSelection,
              isSelected,
              dataKey,
              chartId,
            );

            const dot = dotVariant ? (
              <ChartDot
                fillOpacity={_opacity.dot}
                type={dotVariant}
                dataKey={dataKey}
                chartId={chartId}
              />
            ) : (
              false
            );
            const activeDot = activeDotVariant ? (
              <ChartDot
                fillOpacity={_opacity.dot}
                type={activeDotVariant}
                dataKey={dataKey}
                chartId={chartId}
              />
            ) : (
              false
            );

            return (
              <Area
                type={curveType}
                key={dataKey}
                dataKey={dataKey}
                connectNulls={connectNulls}
                fillOpacity={_opacity.fill}
                strokeOpacity={_opacity.stroke}
                fill={fillPattern}
                stroke={
                  areaVariant === "solid"
                    ? getSeriesColor(dataKey)
                    : `url(#${chartId}-colors-${dataKey})`
                }
                stackId={isStacked ? "evil-stacked" : undefined}
                dot={dot}
                activeDot={activeDot}
                strokeWidth={STROKE_WIDTH}
                strokeDasharray={
                  strokeVariant === "dashed"
                    ? "3 3"
                    : strokeVariant === "animated-dashed"
                      ? "3 3"
                      : undefined
                }
                style={isClickable ? { cursor: "pointer" } : undefined}
                onClick={() => {
                  if (!isClickable) return;
                  // Toggle: if already selected, unselect; otherwise select
                  handleSelectionChange(selectedDataKey === dataKey ? null : dataKey);
                }}
              >
                {strokeVariant === "animated-dashed" && !hasSelection && <AnimatedDashedStyle />}
              </Area>
            );
          })}
        {/* ======== LOADING AREA ======== */}
        {isLoading && (
          <Area
            type={curveType}
            dataKey={LOADING_AREA_DATA_KEY}
            fillOpacity={0.05}
            min={0}
            max={100}
            fill="currentColor"
            stroke="currentColor"
            strokeOpacity={0.5}
            isAnimationActive={false}
            legendType="none"
            tooltipType="none"
            activeDot={false}
            dot={false}
            style={{ mask: `url(#${chartId}-loading-mask)` }}
          />
        )}
        {/* ======== CHART STYLES ======== */}
        <defs>
          {isLoading && <LoadingAreaPatternStyle chartId={chartId} onShimmerExit={onShimmerExit} />}
          {/* Shared horizontal color gradient for textured or gradient area variants */}
          {areaVariant !== "solid" && (
            <HorizontalColorGradientStyle
              chartConfig={chartConfig}
              chartId={chartId}
              isExpanded={isExpanded}
            />
          )}
          {/* Variant-specific styles */}
          {areaVariant === "gradient" && (
            <LinearGradientStyle chartConfig={chartConfig} chartId={chartId} />
          )}
          {areaVariant === "gradient-reverse" && (
            <ReverseGradientStyle chartConfig={chartConfig} chartId={chartId} />
          )}
          {areaVariant === "lines" && (
            <LinesPatternStyle chartConfig={chartConfig} chartId={chartId} />
          )}
          {areaVariant === "dotted" && (
            <DottedPatternStyle chartConfig={chartConfig} chartId={chartId} />
          )}
          {areaVariant === "hatched" && (
            <HatchedPatternStyle chartConfig={chartConfig} chartId={chartId} />
          )}
          {areaVariant !== "solid" && (
            <UnselectedDiagonalPatternStyle
              chartConfig={chartConfig}
              chartId={chartId}
              selectedDataKey={selectedDataKey}
              isClickable={isClickable}
            />
          )}
        </defs>
      </AreaChart>
    </ChartContainer>
  );
}

const getSeriesColor = (dataKey: string) => `var(--color-${dataKey}-0)`;

// Returns opacity object for both fill and stroke, same values for both
const getOpacity = (isClickable: boolean, selectedDataKey: string | null, dataKey: string) => {
  if (!isClickable || selectedDataKey === null) {
    return { fill: 0.8, stroke: 0.8, dot: 1 };
  }
  return selectedDataKey === dataKey
    ? { fill: 0.8, stroke: 0.8, dot: 1 }
    : { fill: 0.2, stroke: 0.3, dot: 0.3 };
};

// Returns the appropriate fill pattern based on variant and selection state
const getFillPattern = (
  variant: AreaVariant,
  isClickable: boolean,
  hasSelection: boolean,
  isSelected: boolean,
  dataKey: string,
  chartId: string,
): string => {
  // If clickable and there's a selection but this item is not selected, use unselected diagonal pattern
  if (isClickable && hasSelection && !isSelected) {
    return `url(#${chartId}-unselected-${dataKey})`;
  }

  // Otherwise, use the variant-specific pattern
  switch (variant) {
    case "gradient":
      return `url(#${chartId}-gradient-${dataKey})`;
    case "gradient-reverse":
      return `url(#${chartId}-gradient-reverse-${dataKey})`;
    case "solid":
      return getSeriesColor(dataKey);
    case "dotted":
      return `url(#${chartId}-dotted-${dataKey})`;
    case "lines":
      return `url(#${chartId}-lines-${dataKey})`;
    case "hatched":
      return `url(#${chartId}-hatched-pattern-${dataKey})`;
    default:
      return `url(#${chartId}-${dataKey})`;
  }
};

// Animated dashed-stroke style for the area chart
const AnimatedDashedStyle = () => {
  return (
    <>
      <animate
        attributeName="stroke-dasharray"
        values="3 3; 0 3; 3 3"
        dur="1s"
        repeatCount="indefinite"
        keyTimes="0;0.5;1"
      />
      <animate
        attributeName="stroke-dashoffset"
        values="0; -6"
        dur="1s"
        repeatCount="indefinite"
        keyTimes="0;1"
      />
    </>
  );
};

// Shared horizontal color gradient (left to right) - used by all variants and stroke
// This is ALWAYS rendered so colors are available for any variant
const HorizontalColorGradientStyle = ({
  chartConfig,
  chartId,
  isExpanded = false,
}: {
  chartConfig: ChartConfig;
  chartId: string;
  isExpanded?: boolean;
}) => {
  return (
    <>
      {Object.entries(chartConfig).map(([dataKey, config]) => {
        const colorsCount = getColorsCount(config);

        return (
          <linearGradient
            key={`${chartId}-colors-${dataKey}`}
            id={`${chartId}-colors-${dataKey}`}
            x1="0"
            y1="0"
            x2="1"
            y2="0"
            gradientUnits={isExpanded ? "userSpaceOnUse" : "objectBoundingBox"}
          >
            {colorsCount === 1 ? (
              // Single color: same color at start and end
              <>
                <stop offset="0%" stopColor={`var(--color-${dataKey}-0)`} />
                <stop offset="100%" stopColor={`var(--color-${dataKey}-0)`} />
              </>
            ) : (
              // Multiple colors: distribute evenly
              // Fallback to first color if index doesn't exist in current theme
              Array.from({ length: colorsCount }, (_, index) => (
                <stop
                  key={index}
                  offset={`${(index / (colorsCount - 1)) * 100}%`}
                  stopColor={`var(--color-${dataKey}-${index}, var(--color-${dataKey}-0))`}
                />
              ))
            )}
          </linearGradient>
        );
      })}
    </>
  );
};

// Linear gradient variant - adds vertical fade mask on top of the shared color gradient
const LinearGradientStyle = ({
  chartConfig,
  chartId,
}: {
  chartConfig: ChartConfig;
  chartId: string;
}) => {
  return (
    <>
      {/* Vertical fade gradient for mask */}
      <linearGradient id={`${chartId}-vertical-fade`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="white" stopOpacity={0.1} />
        <stop offset="100%" stopColor="white" stopOpacity={0} />
      </linearGradient>

      {Object.keys(chartConfig).map((dataKey) => (
        <g key={`${chartId}-gradient-group-${dataKey}`}>
          {/* Mask for vertical fade (top visible, bottom transparent) */}
          <mask id={`${chartId}-gradient-mask-${dataKey}`}>
            <rect width="100%" height="100%" fill={`url(#${chartId}-vertical-fade)`} />
          </mask>

          {/* Pattern combining shared color gradient + vertical mask */}
          <pattern
            id={`${chartId}-gradient-${dataKey}`}
            patternUnits="userSpaceOnUse"
            width="100%"
            height="100%"
          >
            <rect
              width="100%"
              height="100%"
              fill={`url(#${chartId}-colors-${dataKey})`}
              mask={`url(#${chartId}-gradient-mask-${dataKey})`}
            />
          </pattern>
        </g>
      ))}
    </>
  );
};

// Reverse gradient for the area chart - vertical fade (top transparent, bottom visible)
const ReverseGradientStyle = ({
  chartConfig,
  chartId,
}: {
  chartConfig: ChartConfig;
  chartId: string;
}) => {
  return (
    <>
      {/* Vertical reverse fade gradient for mask */}
      <linearGradient id={`${chartId}-vertical-fade-reverse`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="white" stopOpacity={0} />
        <stop offset="100%" stopColor="white" stopOpacity={0.1} />
      </linearGradient>

      {Object.keys(chartConfig).map((dataKey) => (
        <g key={`${chartId}-gradient-reverse-group-${dataKey}`}>
          {/* Mask for reverse vertical fade */}
          <mask id={`${chartId}-gradient-reverse-mask-${dataKey}`}>
            <rect width="100%" height="100%" fill={`url(#${chartId}-vertical-fade-reverse)`} />
          </mask>

          {/* Pattern: horizontal gradient + reverse vertical mask */}
          <pattern
            id={`${chartId}-gradient-reverse-${dataKey}`}
            patternUnits="userSpaceOnUse"
            width="100%"
            height="100%"
          >
            <rect
              width="100%"
              height="100%"
              fill={`url(#${chartId}-colors-${dataKey})`}
              mask={`url(#${chartId}-gradient-reverse-mask-${dataKey})`}
            />
          </pattern>
        </g>
      ))}
    </>
  );
};

// Lines pattern for the area chart - diagonal lines with gradient
const LinesPatternStyle = ({
  chartConfig,
  chartId,
}: {
  chartConfig: ChartConfig;
  chartId: string;
}) => {
  return (
    <>
      {/* Shared diagonal lines pattern for mask */}
      <pattern
        id={`${chartId}-lines-mask-pattern`}
        patternUnits="userSpaceOnUse"
        width="5"
        height="5"
        patternTransform="rotate(45)"
      >
        <line x1="0" y1="0" x2="0" y2="5" stroke="white" strokeWidth="1" />
      </pattern>

      {Object.keys(chartConfig).map((dataKey) => (
        <g key={`${chartId}-lines-group-${dataKey}`}>
          {/* Mask using diagonal lines */}
          <mask id={`${chartId}-lines-mask-${dataKey}`}>
            <rect
              width="100%"
              height="100%"
              fill={`url(#${chartId}-lines-mask-pattern)`}
              fillOpacity="0.3"
            />
          </mask>

          {/* Pattern: gradient fill masked by diagonal lines */}
          <pattern
            id={`${chartId}-lines-${dataKey}`}
            patternUnits="userSpaceOnUse"
            width="100%"
            height="100%"
          >
            <rect
              width="100%"
              height="100%"
              fill={`url(#${chartId}-colors-${dataKey})`}
              mask={`url(#${chartId}-lines-mask-${dataKey})`}
            />
          </pattern>
        </g>
      ))}
    </>
  );
};

// Dotted pattern for the area chart - dots with gradient
const DottedPatternStyle = ({
  chartConfig,
  chartId,
}: {
  chartConfig: ChartConfig;
  chartId: string;
}) => {
  return (
    <>
      {/* Shared dots pattern for mask */}
      <pattern
        id={`${chartId}-dotted-mask-pattern`}
        x="0"
        y="0"
        width="6"
        height="6"
        patternUnits="userSpaceOnUse"
      >
        <circle cx="4" cy="4" r="0.5" fill="white" />
      </pattern>

      {Object.keys(chartConfig).map((dataKey) => (
        <g key={`${chartId}-dotted-group-${dataKey}`}>
          {/* Mask using dots pattern */}
          <mask id={`${chartId}-dotted-mask-${dataKey}`}>
            <rect
              width="100%"
              height="100%"
              fill={`url(#${chartId}-dotted-mask-pattern)`}
              fillOpacity="0.5"
            />
          </mask>

          {/* Pattern: gradient fill masked by dots */}
          <pattern
            id={`${chartId}-dotted-${dataKey}`}
            patternUnits="userSpaceOnUse"
            width="100%"
            height="100%"
          >
            <rect
              width="100%"
              height="100%"
              fill={`url(#${chartId}-colors-${dataKey})`}
              mask={`url(#${chartId}-dotted-mask-${dataKey})`}
            />
          </pattern>
        </g>
      ))}
    </>
  );
};

// Diagonal lines pattern for non-selected areas
const UnselectedDiagonalPatternStyle = ({
  chartConfig,
  chartId,
  selectedDataKey,
  isClickable,
}: {
  chartConfig: ChartConfig;
  chartId: string;
  selectedDataKey: string | null;
  isClickable: boolean;
}) => {
  if (!isClickable || selectedDataKey === null) return null;

  return (
    <>
      {/* Shared diagonal lines pattern for mask (white lines) */}
      <pattern
        id={`${chartId}-unselected-lines-mask-pattern`}
        patternUnits="userSpaceOnUse"
        width="5"
        height="5"
        patternTransform="rotate(45)"
      >
        <line x1="0" y1="0" x2="0" y2="5" stroke="white" strokeWidth="1" />
      </pattern>

      {Object.keys(chartConfig).map((dataKey) => {
        const isSelected = selectedDataKey === dataKey;
        if (isSelected) return null;

        return (
          <g key={`${chartId}-unselected-group-${dataKey}`}>
            {/* Mask using diagonal lines pattern */}
            <mask id={`${chartId}-unselected-mask-${dataKey}`}>
              <rect
                width="100%"
                height="100%"
                fill={`url(#${chartId}-unselected-lines-mask-pattern)`}
                fillOpacity="0.3"
              />
            </mask>

            {/* Pattern: gradient fill masked by diagonal lines */}
            <pattern
              id={`${chartId}-unselected-${dataKey}`}
              patternUnits="userSpaceOnUse"
              width="100%"
              height="100%"
            >
              <rect
                width="100%"
                height="100%"
                fill={`url(#${chartId}-colors-${dataKey})`}
                mask={`url(#${chartId}-unselected-mask-${dataKey})`}
              />
            </pattern>
          </g>
        );
      })}
    </>
  );
};

// Hatched pattern with striped gradient effect
const HatchedPatternStyle = ({
  chartConfig,
  chartId,
}: {
  chartConfig: ChartConfig;
  chartId: string;
}) => {
  return (
    <>
      {/* Shared hatched stripes mask pattern */}
      <linearGradient id={`${chartId}-hatched-stripe-gradient`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="50%" stopColor="white" stopOpacity={0.2} />
        <stop offset="50%" stopColor="white" stopOpacity={1} />
      </linearGradient>
      <pattern
        id={`${chartId}-hatched-mask-pattern`}
        x="0"
        y="0"
        width="20"
        height="10"
        patternUnits="userSpaceOnUse"
        overflow="visible"
        patternTransform="rotate(20)"
      >
        <rect width="20" height="10" fill={`url(#${chartId}-hatched-stripe-gradient)`} />
      </pattern>

      {Object.keys(chartConfig).map((dataKey) => (
        <g key={`${chartId}-hatched-group-${dataKey}`}>
          {/* Mask using hatched stripes */}
          <mask id={`${chartId}-hatched-mask-${dataKey}`}>
            <rect
              width="100%"
              height="100%"
              fill={`url(#${chartId}-hatched-mask-pattern)`}
              fillOpacity="0.2"
            />
          </mask>

          {/* Pattern: gradient fill masked by hatched stripes */}
          <pattern
            id={`${chartId}-hatched-pattern-${dataKey}`}
            patternUnits="userSpaceOnUse"
            width="100%"
            height="100%"
          >
            <rect
              width="100%"
              height="100%"
              fill={`url(#${chartId}-colors-${dataKey})`}
              mask={`url(#${chartId}-hatched-mask-${dataKey})`}
            />
          </pattern>
        </g>
      ))}
    </>
  );
};

// Generate gradient stops with smooth easing for loading animation
const generateEasedGradientStops = (
  steps: number = 17,
  minOpacity: number = 0.05,
  maxOpacity: number = 0.9,
) => {
  return Array.from({ length: steps }, (_, i) => {
    const t = i / (steps - 1); // 0 to 1
    // Sine-based bell curve easing: peaks at center (t=0.5), smooth falloff at edges
    const eased = Math.sin(t * Math.PI) ** 2;
    const opacity = minOpacity + eased * (maxOpacity - minOpacity);
    return { offset: `${(t * 100).toFixed(0)}%`, opacity: Number(opacity.toFixed(3)) };
  });
};

/**
 * Hook to manage loading data with pixel-perfect shimmer synchronization.
 *
 * Uses motion.dev's onAnimationComplete callback to ensure chart data
 * is only regenerated when the shimmer has completely exited the visible area.
 * This eliminates timing drift issues from setTimeout/setInterval.
 *
 * The shimmer pattern has 200-300% width so that when the visible shimmer
 * exits the chart container (at the 100% point), we can safely swap data
 * while the invisible portion continues animating.
 */
export function useLoadingData(isLoading: boolean, loadingPoints: number = 14) {
  const [loadingDataKey, setLoadingDataKey] = useState(false);

  // Callback fired by motion.dev when shimmer exits visible area
  const onShimmerExit = useCallback(() => {
    if (isLoading) {
      setLoadingDataKey((prev) => !prev);
    }
  }, [isLoading]);

  const loadingData = useMemo(
    () => getLoadingData(loadingPoints),
    // loadingDataKey toggle triggers re-computation when shimmer exits
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [loadingPoints, loadingDataKey],
  );

  return { loadingData, onShimmerExit };
}

/**
 * Loading area pattern with animated skeleton effect using motion.dev
 *
 * Key design for pixel-perfect sync:
 * - Visible chart area is normalized to 0-1 in objectBoundingBox units
 * - Shimmer gradient has width=1 (same as visible area)
 * - Pattern width is 3x (300%) to provide buffer on both sides
 * - Animation: x goes from -1 (off-screen left) to 2 (off-screen right)
 * - At x=-1: shimmer is completely outside left edge
 * - At x=0: shimmer starts entering from left
 * - At x=1: shimmer has fully exited right edge
 * - At x=2: shimmer is in the right buffer zone
 * - onShimmerExit fires when x crosses 1 (shimmer fully exited visible area)
 * - Data swaps happen while shimmer is outside visible area (x >= 1)
 * - Loop continues infinitely
 */
const LoadingAreaPatternStyle = ({
  chartId,
  onShimmerExit,
}: {
  chartId: string;
  onShimmerExit: () => void;
}) => {
  const gradientStops = generateEasedGradientStops();

  // Pattern width needs to accommodate: 1 (left buffer) + 1 (visible) + 1 (right buffer) = 3
  const patternWidth = 3;

  // Animation goes from -1 (left of visible) to 2 (right of visible)
  // Total travel distance = 3, matching pattern width
  const startX = -1;
  const endX = 2;

  // Track last x value to detect threshold crossing
  const lastXRef = useRef(startX);

  return (
    <>
      {/* Gradient for smooth fade: edges dim, middle bright for sweep effect */}
      <linearGradient id={`${chartId}-loading-mask-gradient`} x1="0" y1="0" x2="1" y2="0">
        {gradientStops.map(({ offset, opacity }) => (
          <stop key={offset} offset={offset} stopColor="white" stopOpacity={opacity} />
        ))}
      </linearGradient>
      <pattern
        id={`${chartId}-loading-mask-pattern`}
        patternUnits="objectBoundingBox"
        patternContentUnits="objectBoundingBox"
        patternTransform="rotate(25)"
        width={patternWidth}
        height="1"
        x="0"
        y="0"
      >
        {/* Use motion.rect with keyframe animation for precise timing */}
        <motion.rect
          y="0"
          width="1"
          height="1"
          fill={`url(#${chartId}-loading-mask-gradient)`}
          initial={{ x: startX }}
          animate={{ x: endX }}
          transition={{
            duration: LOADING_ANIMATION_DURATION / 1000,
            ease: "linear",
            repeat: Infinity,
            repeatType: "loop",
          }}
          // Use onUpdate to fire callback at precise exit point
          onUpdate={(latest) => {
            const xValue = typeof latest.x === "number" ? latest.x : startX;
            const lastX = lastXRef.current;

            // Fire when crossing the exit threshold (x >= 1 means shimmer fully exited right)
            if (xValue >= 1 && lastX < 1) {
              onShimmerExit();
            }

            // Update tracked value
            lastXRef.current = xValue;
          }}
        />
      </pattern>
      {/* Masking */}
      <mask id={`${chartId}-loading-mask`} maskUnits="userSpaceOnUse">
        <rect width="100%" height="100%" fill={`url(#${chartId}-loading-mask-pattern)`} />
      </mask>
    </>
  );
};
