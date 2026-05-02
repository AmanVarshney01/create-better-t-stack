"use client";

import { motion } from "motion/react";
import { useCallback, useId, useMemo, useRef, useState, type ComponentProps } from "react";
import { Bar, BarChart, CartesianGrid, Rectangle, ReferenceLine, XAxis, YAxis } from "recharts";
import { RectRadius } from "recharts/types/shape/Rectangle";

import { ChartBackground, type BackgroundVariant } from "@/components/evilcharts/ui/background";
import {
  type ChartConfig,
  ChartContainer,
  getColorsCount,
  getLoadingData,
  LoadingIndicator,
} from "@/components/evilcharts/ui/chart";
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
const DEFAULT_BAR_RADIUS = 2;
const LOADING_BAR_DATA_KEY = "loading";
const LOADING_ANIMATION_DURATION = 2000; // in milliseconds

type ChartProps = ComponentProps<typeof BarChart>;
type XAxisProps = ComponentProps<typeof XAxis>;
type YAxisProps = ComponentProps<typeof YAxis>;
type BarVariant = "default" | "hatched" | "duotone" | "duotone-reverse" | "gradient" | "stripped";
type StackType = "default" | "stacked" | "percent";
type BarLayout = "vertical" | "horizontal";

// Validating Types to make sure user have provided valid data according to chartConfig
type ValidateConfigKeys<TData, TConfig> = {
  [K in keyof TConfig]: K extends keyof TData ? ChartConfig[string] : never;
};

// Extract only keys from TData where the value is a number (not string, boolean, etc.)
type NumericDataKeys<T> = {
  [K in keyof T]: T[K] extends number ? K : never;
}[keyof T];

type EvilBarChartProps<
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
  barVariant?: BarVariant;
  stackType?: StackType;
  layout?: BarLayout;
  barRadius?: number;
  barGap?: number;
  barCategoryGap?: number;
  tickGap?: number;
  legendVariant?: ChartLegendVariant;
  // Hide Stuffs
  hideTooltip?: boolean;
  hideCartesianGrid?: boolean;
  hideLegend?: boolean;
  // Tooltip
  tooltipRoundness?: TooltipRoundness;
  tooltipVariant?: TooltipVariant;
  tooltipDefaultIndex?: number;
  // Interactive Stuffs
  enableHoverHighlight?: boolean;
  isLoading?: boolean;
  loadingBars?: number;
  // Glow Effects
  glowingBars?: NumericDataKeys<TData>[];
  // Brush
  showBrush?: boolean;
  brushHeight?: number;
  brushFormatLabel?: (value: unknown, index: number) => string;
  onBrushChange?: (range: EvilBrushRange) => void;
  // Background
  backgroundVariant?: BackgroundVariant;
  // Buffer Bar - renders last data point bars as hatched/lines style
  enableBufferBar?: boolean;
};

type EvilBarChartClickable = {
  isClickable: true;
  onSelectionChange?: (selectedDataKey: string | null) => void;
};

type EvilBarChartNotClickable = {
  isClickable?: false;
  onSelectionChange?: never;
};

type EvilBarChartPropsWithCallback<
  TData extends Record<string, unknown>,
  TConfig extends Record<string, ChartConfig[string]>,
> = EvilBarChartProps<TData, TConfig> & (EvilBarChartClickable | EvilBarChartNotClickable);

export function EvilBarChart<
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
  barVariant = "default",
  stackType = "default",
  layout = "vertical",
  barRadius = DEFAULT_BAR_RADIUS,
  barGap,
  barCategoryGap,
  tickGap = 8,
  legendVariant,
  hideTooltip = false,
  hideCartesianGrid = false,
  hideLegend = false,
  tooltipRoundness,
  tooltipVariant,
  tooltipDefaultIndex,
  isClickable = false,
  enableHoverHighlight = false,
  isLoading = false,
  loadingBars,
  glowingBars = [],
  showBrush = false,
  brushHeight,
  brushFormatLabel,
  onBrushChange,
  onSelectionChange,
  backgroundVariant,
  enableBufferBar = false,
}: EvilBarChartPropsWithCallback<TData, TConfig>) {
  const [selectedDataKey, setSelectedDataKey] = useState<string | null>(defaultSelectedDataKey);
  const [isMouseInChart, setIsMouseInChart] = useState(false);
  const { loadingData, onShimmerExit } = useLoadingData(isLoading, loadingBars);
  const chartId = useId().replace(/:/g, ""); // Remove colons for valid CSS selectors

  // ── Zoom state ──────────────────────────────────────────────────────────
  const { visibleData, brushProps } = useEvilBrush({ data });
  const displayData = showBrush && !isLoading ? visibleData : data;

  // Wrapper function to update state and call parent callback
  const handleSelectionChange = useCallback(
    (newSelectedDataKey: string | null) => {
      setSelectedDataKey(newSelectedDataKey);
      if (isClickable && onSelectionChange) {
        onSelectionChange(newSelectedDataKey);
      }
    },
    [onSelectionChange, isClickable],
  );

  const isStacked = stackType === "stacked" || stackType === "percent";
  const isHorizontal = layout === "horizontal";
  const hasMultiColorSeries = Object.values(chartConfig).some(
    (config) => getColorsCount(config) > 1,
  );
  const useSolidDefaultBars = barVariant === "default" && !enableBufferBar && !hasMultiColorSeries;

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
            variant="bar"
            barRadius={barRadius}
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
      <BarChart
        id="evil-charts-bar-chart"
        accessibilityLayer
        layout={isHorizontal ? "vertical" : "horizontal"}
        data={isLoading ? loadingData : displayData}
        barGap={barGap}
        barCategoryGap={barCategoryGap}
        stackOffset={stackType === "percent" ? "expand" : undefined}
        onMouseEnter={() => setIsMouseInChart(true)}
        onMouseLeave={() => setIsMouseInChart(false)}
        {...chartProps}
      >
        {backgroundVariant && <ChartBackground variant={backgroundVariant} />}
        <ReferenceLine color="white" />
        {!hideCartesianGrid && !backgroundVariant && (
          <CartesianGrid vertical={isHorizontal} horizontal={!isHorizontal} strokeDasharray="3 3" />
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
            dataKey={isHorizontal ? undefined : xDataKey}
            type={isHorizontal ? "number" : "category"}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={tickGap}
            {...xAxisProps}
          />
        )}
        {(isHorizontal ? xDataKey : yDataKey) && !isLoading && (
          <YAxis
            dataKey={isHorizontal ? xDataKey : yDataKey}
            type={isHorizontal ? "category" : "number"}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={tickGap}
            width="auto"
            {...yAxisProps}
          />
        )}
        {!hideTooltip && !isLoading && (
          <ChartTooltip
            cursor={false}
            defaultIndex={tooltipDefaultIndex}
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
            const isGlowing = glowingBars.includes(dataKey as NumericDataKeys<TData>);
            const filter = isGlowing ? `url(#${chartId}-bar-glow-${dataKey})` : undefined;

            // Shared props for both shape and activeBar
            const customBarProps = {
              chartId,
              dataKey,
              barVariant,
              barRadius,
              filter,
              isClickable,
              enableHoverHighlight,
              isMouseInChart,
              selectedDataKey,
              useSolidFill: useSolidDefaultBars,
              enableBufferBar,
              dataLength: displayData.length,
              onClick: () => {
                if (!isClickable) return;
                handleSelectionChange(selectedDataKey === dataKey ? null : dataKey);
              },
            };

            return (
              <Bar
                key={dataKey}
                dataKey={dataKey}
                stackId={isStacked ? "evil-stacked" : undefined}
                fill={
                  useSolidDefaultBars
                    ? getSeriesColor(dataKey)
                    : `url(#${chartId}-colors-${dataKey})`
                }
                radius={barRadius}
                style={isClickable || enableHoverHighlight ? { cursor: "pointer" } : undefined}
                shape={(props: unknown) => (
                  <CustomBar {...(props as BarShapeProps)} {...customBarProps} />
                )}
                activeBar={(props: unknown) => (
                  <CustomBar {...(props as BarShapeProps)} {...customBarProps} />
                )}
              />
            );
          })}
        {/* ======== LOADING BAR ======== */}
        {isLoading && (
          <Bar
            dataKey={LOADING_BAR_DATA_KEY}
            fill="currentColor"
            fillOpacity={0.15}
            radius={barRadius}
            isAnimationActive={false}
            legendType="none"
            style={{ mask: `url(#${chartId}-loading-mask)` }}
          />
        )}
        {/* ======== CHART STYLES ======== */}
        <defs>
          {isLoading && <LoadingBarPatternStyle chartId={chartId} onShimmerExit={onShimmerExit} />}
          {/* Shared vertical color gradient for textured, buffer, or multi-color bar variants */}
          {!useSolidDefaultBars && (
            <VerticalColorGradientStyle chartConfig={chartConfig} chartId={chartId} />
          )}
          {/* Variant-specific styles */}
          {barVariant === "hatched" && (
            <HatchedPatternStyle chartConfig={chartConfig} chartId={chartId} />
          )}
          {barVariant === "duotone" && (
            <DuotonePatternStyle chartConfig={chartConfig} chartId={chartId} />
          )}
          {barVariant === "duotone-reverse" && (
            <DuotoneReversePatternStyle chartConfig={chartConfig} chartId={chartId} />
          )}
          {barVariant === "gradient" && (
            <GradientPatternStyle chartConfig={chartConfig} chartId={chartId} />
          )}
          {barVariant === "stripped" && (
            <StrippedPatternStyle chartConfig={chartConfig} chartId={chartId} />
          )}
          {/* Buffer bar hatched pattern - always rendered when enableBufferBar */}
          {enableBufferBar && (
            <BufferHatchedPatternStyle chartConfig={chartConfig} chartId={chartId} />
          )}
          {/* Glow filter for glowing bars */}
          {glowingBars.length > 0 && (
            <GlowFilterStyle chartId={chartId} glowingBars={glowingBars as string[]} />
          )}
        </defs>
      </BarChart>
    </ChartContainer>
  );
}

// Types for custom bar shape
type BarShapeProps = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  fill?: string;
  fillOpacity?: number;
  dataKey?: string;
  index?: number;
  [key: string]: unknown;
};

type CustomBarProps = {
  chartId: string;
  dataKey: string;
  barVariant: BarVariant;
  barRadius: number;
  filter?: string;
  isClickable?: boolean;
  enableHoverHighlight?: boolean;
  isMouseInChart?: boolean;
  selectedDataKey?: string | null;
  useSolidFill?: boolean;
  isActive?: boolean;
  enableBufferBar?: boolean;
  dataLength?: number;
  onClick?: () => void;
} & BarShapeProps;

// Custom bar shape component for different variants
const CustomBar = (props: CustomBarProps) => {
  const {
    x = 0,
    y = 0,
    width = 0,
    height = 0,
    chartId,
    dataKey,
    barVariant,
    barRadius,
    filter,
    isClickable,
    enableHoverHighlight,
    isMouseInChart,
    selectedDataKey,
    useSolidFill,
    isActive,
    enableBufferBar,
    dataLength = 0,
    onClick,
  } = props;

  const index = typeof props.index === "number" ? props.index : -1;
  const isLastBar = enableBufferBar && dataLength > 0 && index === dataLength - 1;
  const isStripped = barVariant === "stripped";

  const getFill = () => {
    // Buffer bar: last bar always uses hatched pattern
    if (isLastBar) {
      return `url(#${chartId}-buffer-hatched-${dataKey})`;
    }

    switch (barVariant) {
      case "hatched":
        return `url(#${chartId}-hatched-${dataKey})`;
      case "duotone":
        return `url(#${chartId}-duotone-${dataKey})`;
      case "duotone-reverse":
        return `url(#${chartId}-duotone-reverse-${dataKey})`;
      case "gradient":
        return `url(#${chartId}-gradient-${dataKey})`;
      case "stripped":
        return `url(#${chartId}-stripped-${dataKey})`;
      default:
        return useSolidFill ? getSeriesColor(dataKey) : `url(#${chartId}-colors-${dataKey})`;
    }
  };

  const fillOpacity = getBarOpacity({
    isClickable,
    selectedDataKey,
    dataKey,
    enableHoverHighlight,
    isMouseInChart,
    isActive,
  });
  const cursorStyle = isClickable || enableHoverHighlight ? { cursor: "pointer" } : undefined;

  // For stripped: top corners rounded, bottom flat [topLeft, topRight, bottomRight, bottomLeft]
  // For others: all corners rounded
  const radius: RectRadius = isStripped ? [barRadius, barRadius, 0, 0] : barRadius;

  return (
    <g style={cursorStyle} onClick={onClick}>
      {/* Transparent rectangle for full column hit area */}
      <Rectangle {...props} fill="transparent" />
      {/* Visible bar with animated opacity */}
      <Rectangle
        x={x}
        y={y}
        width={width}
        opacity={fillOpacity}
        height={Math.max(0, height - 3)}
        radius={radius}
        fill={getFill()}
        filter={filter}
        stroke={
          isLastBar
            ? useSolidFill
              ? getSeriesColor(dataKey)
              : `url(#${chartId}-colors-${dataKey})`
            : undefined
        }
        strokeWidth={isLastBar ? 1 : undefined}
      />
      {/* Top border strip for stripped variant */}
      {isStripped && (
        <Rectangle
          x={x}
          y={y - 4}
          width={width}
          height={2}
          radius={1}
          fill={useSolidFill ? getSeriesColor(dataKey) : `url(#${chartId}-colors-${dataKey})`}
        />
      )}
    </g>
  );
};

const getSeriesColor = (dataKey: string) => `var(--color-${dataKey}-0)`;

// Shared vertical color gradient (top to bottom) - used for bar fill
const VerticalColorGradientStyle = ({
  chartConfig,
  chartId,
}: {
  chartConfig: ChartConfig;
  chartId: string;
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
            x2="0"
            y2="1"
          >
            {colorsCount === 1 ? (
              <>
                <stop offset="0%" stopColor={`var(--color-${dataKey}-0)`} />
                <stop offset="100%" stopColor={`var(--color-${dataKey}-0)`} />
              </>
            ) : (
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

// Hatched pattern style for bars - uses mask to preserve gradient colors
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
      <pattern
        id={`${chartId}-hatched-mask-pattern`}
        x="0"
        y="0"
        width="5"
        height="5"
        patternUnits="userSpaceOnUse"
        patternTransform="rotate(-45)"
      >
        <rect width="5" height="5" fill="white" fillOpacity={0.3} />
        <rect width="1.5" height="5" fill="white" fillOpacity={1} />
      </pattern>

      {Object.keys(chartConfig).map((dataKey) => (
        <g key={`${chartId}-hatched-group-${dataKey}`}>
          {/* Mask using hatched stripes */}
          <mask id={`${chartId}-hatched-mask-${dataKey}`}>
            <rect width="100%" height="100%" fill={`url(#${chartId}-hatched-mask-pattern)`} />
          </mask>

          {/* Pattern: gradient fill masked by hatched stripes */}
          <pattern
            id={`${chartId}-hatched-${dataKey}`}
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

// Buffer hatched pattern style - diagonal lines only (no background fill), used for the last bar when enableBufferBar is true
const BufferHatchedPatternStyle = ({
  chartConfig,
  chartId,
}: {
  chartConfig: ChartConfig;
  chartId: string;
}) => {
  return (
    <>
      {/* Shared buffer hatched stripes mask pattern - lines only, no background */}
      <pattern
        id={`${chartId}-buffer-hatched-mask-pattern`}
        x="0"
        y="0"
        width="5"
        height="5"
        patternUnits="userSpaceOnUse"
        patternTransform="rotate(-45)"
      >
        <rect width="5" height="5" fill="black" fillOpacity={0} />
        <rect width="1" height="5" fill="white" fillOpacity={1} />
      </pattern>

      {Object.keys(chartConfig).map((dataKey) => (
        <g key={`${chartId}-buffer-hatched-group-${dataKey}`}>
          {/* Mask using buffer hatched stripes */}
          <mask id={`${chartId}-buffer-hatched-mask-${dataKey}`}>
            <rect
              width="100%"
              height="100%"
              fill={`url(#${chartId}-buffer-hatched-mask-pattern)`}
            />
          </mask>

          {/* Pattern: gradient fill masked by buffer hatched stripes - lines only */}
          <pattern
            id={`${chartId}-buffer-hatched-${dataKey}`}
            patternUnits="userSpaceOnUse"
            width="100%"
            height="100%"
          >
            <rect
              width="100%"
              height="100%"
              fill={`url(#${chartId}-colors-${dataKey})`}
              mask={`url(#${chartId}-buffer-hatched-mask-${dataKey})`}
            />
          </pattern>
        </g>
      ))}
    </>
  );
};

// Duotone pattern style for bars (half opacity, half full) - uses objectBoundingBox for per-bar effect
const DuotonePatternStyle = ({
  chartConfig,
  chartId,
}: {
  chartConfig: ChartConfig;
  chartId: string;
}) => {
  return (
    <>
      {Object.entries(chartConfig).map(([dataKey, config]) => {
        const colorsCount = getColorsCount(config);

        return (
          <g key={`${chartId}-duotone-group-${dataKey}`}>
            {/* Duotone mask gradient - applies to each bar's bounding box */}
            <linearGradient
              id={`${chartId}-duotone-mask-gradient-${dataKey}`}
              gradientUnits="objectBoundingBox"
              x1="0"
              y1="0"
              x2="1"
              y2="0"
            >
              <stop offset="50%" stopColor="white" stopOpacity={0.4} />
              <stop offset="50%" stopColor="white" stopOpacity={1} />
            </linearGradient>

            {/* Color gradient for this dataKey - applies to each bar's bounding box */}
            <linearGradient
              id={`${chartId}-duotone-colors-${dataKey}`}
              gradientUnits="objectBoundingBox"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              {colorsCount === 1 ? (
                <>
                  <stop offset="0%" stopColor={`var(--color-${dataKey}-0)`} />
                  <stop offset="100%" stopColor={`var(--color-${dataKey}-0)`} />
                </>
              ) : (
                Array.from({ length: colorsCount }, (_, index) => (
                  <stop
                    key={index}
                    offset={`${(index / (colorsCount - 1)) * 100}%`}
                    stopColor={`var(--color-${dataKey}-${index}, var(--color-${dataKey}-0))`}
                  />
                ))
              )}
            </linearGradient>

            {/* Mask for duotone effect */}
            <mask id={`${chartId}-duotone-mask-${dataKey}`} maskContentUnits="objectBoundingBox">
              <rect
                x="0"
                y="0"
                width="1"
                height="1"
                fill={`url(#${chartId}-duotone-mask-gradient-${dataKey})`}
              />
            </mask>

            {/* Pattern: gradient fill with duotone mask */}
            <pattern
              id={`${chartId}-duotone-${dataKey}`}
              patternUnits="objectBoundingBox"
              patternContentUnits="objectBoundingBox"
              width="1"
              height="1"
            >
              <rect
                x="0"
                y="0"
                width="1"
                height="1"
                fill={`url(#${chartId}-duotone-colors-${dataKey})`}
                mask={`url(#${chartId}-duotone-mask-${dataKey})`}
              />
            </pattern>
          </g>
        );
      })}
    </>
  );
};

// Duotone reverse pattern style for bars (full opacity first, then half) - uses objectBoundingBox for per-bar effect
const DuotoneReversePatternStyle = ({
  chartConfig,
  chartId,
}: {
  chartConfig: ChartConfig;
  chartId: string;
}) => {
  return (
    <>
      {Object.entries(chartConfig).map(([dataKey, config]) => {
        const colorsCount = getColorsCount(config);

        return (
          <g key={`${chartId}-duotone-reverse-group-${dataKey}`}>
            {/* Duotone reverse mask gradient - applies to each bar's bounding box */}
            <linearGradient
              id={`${chartId}-duotone-reverse-mask-gradient-${dataKey}`}
              gradientUnits="objectBoundingBox"
              x1="0"
              y1="0"
              x2="1"
              y2="0"
            >
              <stop offset="50%" stopColor="white" stopOpacity={1} />
              <stop offset="50%" stopColor="white" stopOpacity={0.4} />
            </linearGradient>

            {/* Color gradient for this dataKey - applies to each bar's bounding box */}
            <linearGradient
              id={`${chartId}-duotone-reverse-colors-${dataKey}`}
              gradientUnits="objectBoundingBox"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              {colorsCount === 1 ? (
                <>
                  <stop offset="0%" stopColor={`var(--color-${dataKey}-0)`} />
                  <stop offset="100%" stopColor={`var(--color-${dataKey}-0)`} />
                </>
              ) : (
                Array.from({ length: colorsCount }, (_, index) => (
                  <stop
                    key={index}
                    offset={`${(index / (colorsCount - 1)) * 100}%`}
                    stopColor={`var(--color-${dataKey}-${index}, var(--color-${dataKey}-0))`}
                  />
                ))
              )}
            </linearGradient>

            {/* Mask for duotone reverse effect */}
            <mask
              id={`${chartId}-duotone-reverse-mask-${dataKey}`}
              maskContentUnits="objectBoundingBox"
            >
              <rect
                x="0"
                y="0"
                width="1"
                height="1"
                fill={`url(#${chartId}-duotone-reverse-mask-gradient-${dataKey})`}
              />
            </mask>

            {/* Pattern: gradient fill with duotone reverse mask */}
            <pattern
              id={`${chartId}-duotone-reverse-${dataKey}`}
              patternUnits="objectBoundingBox"
              patternContentUnits="objectBoundingBox"
              width="1"
              height="1"
            >
              <rect
                x="0"
                y="0"
                width="1"
                height="1"
                fill={`url(#${chartId}-duotone-reverse-colors-${dataKey})`}
                mask={`url(#${chartId}-duotone-reverse-mask-${dataKey})`}
              />
            </pattern>
          </g>
        );
      })}
    </>
  );
};

// Gradient pattern style for bars (top to bottom fade) - uses mask to preserve gradient colors
const GradientPatternStyle = ({
  chartConfig,
  chartId,
}: {
  chartConfig: ChartConfig;
  chartId: string;
}) => {
  return (
    <>
      {/* Shared vertical fade gradient for mask */}
      <linearGradient id={`${chartId}-gradient-mask-gradient`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="20%" stopColor="white" stopOpacity={1} />
        <stop offset="90%" stopColor="white" stopOpacity={0} />
      </linearGradient>

      {Object.keys(chartConfig).map((dataKey) => (
        <g key={`${chartId}-gradient-group-${dataKey}`}>
          {/* Mask for vertical fade */}
          <mask id={`${chartId}-gradient-mask-${dataKey}`}>
            <rect width="100%" height="100%" fill={`url(#${chartId}-gradient-mask-gradient)`} />
          </mask>

          {/* Pattern: gradient fill with vertical fade mask */}
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

// Stripped pattern style for bars (low opacity body with full opacity top) - uses mask to preserve gradient colors
const StrippedPatternStyle = ({
  chartConfig,
  chartId,
}: {
  chartConfig: ChartConfig;
  chartId: string;
}) => {
  return (
    <>
      {/* Shared stripped fade gradient for mask */}
      <linearGradient id={`${chartId}-stripped-mask-gradient`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="white" stopOpacity={0.2} />
        <stop offset="100%" stopColor="white" stopOpacity={0.2} />
      </linearGradient>

      {Object.keys(chartConfig).map((dataKey) => (
        <g key={`${chartId}-stripped-group-${dataKey}`}>
          {/* Mask for stripped fade */}
          <mask id={`${chartId}-stripped-mask-${dataKey}`}>
            <rect width="100%" height="100%" fill={`url(#${chartId}-stripped-mask-gradient)`} />
          </mask>

          {/* Pattern: gradient fill with stripped fade mask */}
          <pattern
            id={`${chartId}-stripped-${dataKey}`}
            patternUnits="userSpaceOnUse"
            width="100%"
            height="100%"
          >
            <rect
              width="100%"
              height="100%"
              fill={`url(#${chartId}-colors-${dataKey})`}
              mask={`url(#${chartId}-stripped-mask-${dataKey})`}
            />
          </pattern>
        </g>
      ))}
    </>
  );
};

// Glow filter style for glowing bars
const GlowFilterStyle = ({ chartId, glowingBars }: { chartId: string; glowingBars: string[] }) => {
  return (
    <>
      {glowingBars.map((dataKey) => (
        <filter
          key={`${chartId}-bar-glow-${dataKey}`}
          id={`${chartId}-bar-glow-${dataKey}`}
          x="-100%"
          y="-100%"
          width="300%"
          height="300%"
        >
          <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="1 0 0 0 0
                    0 1 0 0 0
                    0 0 1 0 0
                    0 0 0 0.5 0"
            result="glow"
          />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
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
    const t = i / (steps - 1);
    const eased = Math.sin(t * Math.PI) ** 2;
    const opacity = minOpacity + eased * (maxOpacity - minOpacity);
    return { offset: `${(t * 100).toFixed(0)}%`, opacity: Number(opacity.toFixed(3)) };
  });
};

/**
 * Hook to manage loading data with pixel-perfect shimmer synchronization.
 */
export function useLoadingData(isLoading: boolean, loadingBars: number = 12) {
  const [loadingDataKey, setLoadingDataKey] = useState(false);

  const onShimmerExit = useCallback(() => {
    if (isLoading) {
      setLoadingDataKey((prev) => !prev);
    }
  }, [isLoading]);

  const loadingData = useMemo(
    () => getLoadingData(loadingBars, 20, 80),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [loadingBars, loadingDataKey],
  );

  return { loadingData, onShimmerExit };
}

/**
 * Loading bar pattern with animated skeleton effect
 */
const LoadingBarPatternStyle = ({
  chartId,
  onShimmerExit,
}: {
  chartId: string;
  onShimmerExit: () => void;
}) => {
  const gradientStops = generateEasedGradientStops();
  const patternWidth = 3;
  const startX = -1;
  const endX = 2;
  const lastXRef = useRef(startX);

  return (
    <>
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
          onUpdate={(latest) => {
            const xValue = typeof latest.x === "number" ? latest.x : startX;
            const lastX = lastXRef.current;
            if (xValue >= 1 && lastX < 1) {
              onShimmerExit();
            }
            lastXRef.current = xValue;
          }}
        />
      </pattern>
      <mask id={`${chartId}-loading-mask`} maskUnits="userSpaceOnUse">
        <rect width="100%" height="100%" fill={`url(#${chartId}-loading-mask-pattern)`} />
      </mask>
    </>
  );
};

/**
 * Calculate bar opacity based on click selection and hover highlight state
 */
const getBarOpacity = ({
  isClickable,
  selectedDataKey,
  dataKey,
  enableHoverHighlight,
  isMouseInChart,
  isActive,
}: {
  isClickable?: boolean;
  selectedDataKey?: string | null;
  dataKey: string;
  enableHoverHighlight?: boolean;
  isMouseInChart?: boolean;
  isActive?: boolean;
}) => {
  // Check if this dataKey is selected (for click selection)
  const isSelectedDataKey = selectedDataKey === null || selectedDataKey === dataKey;

  // Base opacity from click selection
  const clickOpacity = isClickable && selectedDataKey !== null ? (isSelectedDataKey ? 1 : 0.3) : 1;

  // If hover highlight is enabled and mouse is in chart
  if (enableHoverHighlight && isMouseInChart) {
    // Combine: if this bar is active/hovered, show full opacity (respecting click selection)
    // If not hovered, dim it further
    return isActive ? clickOpacity : clickOpacity * 0.3;
  }

  return clickOpacity;
};
