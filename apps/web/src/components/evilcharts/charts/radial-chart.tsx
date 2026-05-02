"use client";

import { useCallback, useEffect, useId, useMemo, useState, type ComponentProps } from "react";
import { RadialBar, RadialBarChart, Sector, type SectorProps } from "recharts";
import { TypedDataKey } from "recharts/types/util/typedDataKey";

import { ChartBackground, type BackgroundVariant } from "@/components/evilcharts/ui/background";
import {
  type ChartConfig,
  ChartContainer,
  getColorsCount,
  LoadingIndicator,
} from "@/components/evilcharts/ui/chart";
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

// Loading animation constants
const LOADING_BARS = 5;
const LOADING_ANIMATION_DURATION = 1500; // Duration between data changes in ms

// Constants
const DEFAULT_INNER_RADIUS = "30%";
const DEFAULT_OUTER_RADIUS = "100%";
const DEFAULT_CORNER_RADIUS = 5;
const DEFAULT_BAR_SIZE = 14;

type ChartProps = ComponentProps<typeof RadialBarChart>;
type RadialBarProps = ComponentProps<typeof RadialBar>;

type RadialVariant = "full" | "semi";

type EvilRadialChartProps<TData extends Record<string, unknown>> = {
  // Data
  data: TData[];
  dataKey: keyof TData & string;
  nameKey: keyof TData & string;
  chartConfig: ChartConfig;
  className?: string;
  chartProps?: ChartProps;
  radialBarProps?: Omit<RadialBarProps, "dataKey">;

  // Variant
  variant?: RadialVariant;

  // Radial Shape
  innerRadius?: number | string;
  outerRadius?: number | string;
  cornerRadius?: number;
  barSize?: number;

  // Hide Stuffs
  hideTooltip?: boolean;
  hideLegend?: boolean;
  hideBackground?: boolean;
  legendVariant?: ChartLegendVariant;
  // Tooltip
  tooltipRoundness?: TooltipRoundness;
  tooltipVariant?: TooltipVariant;
  tooltipDefaultIndex?: number;

  // Interactive Stuffs
  isLoading?: boolean;

  // Glow Effects
  glowingBars?: string[];
  // Background
  backgroundVariant?: BackgroundVariant;
};

type EvilRadialChartClickable = {
  isClickable: true;
  onSelectionChange?: (selection: { dataKey: string; value: number } | null) => void;
};

type EvilRadialChartNotClickable = {
  isClickable?: false;
  onSelectionChange?: never;
};

type EvilRadialChartPropsWithCallback<TData extends Record<string, unknown>> =
  EvilRadialChartProps<TData> & (EvilRadialChartClickable | EvilRadialChartNotClickable);

export function EvilRadialChart<TData extends Record<string, unknown>>({
  data,
  dataKey,
  nameKey,
  chartConfig,
  className,
  chartProps,
  radialBarProps,
  variant = "full",
  innerRadius = DEFAULT_INNER_RADIUS,
  outerRadius = DEFAULT_OUTER_RADIUS,
  cornerRadius = DEFAULT_CORNER_RADIUS,
  barSize = DEFAULT_BAR_SIZE,
  hideTooltip = false,
  hideLegend = false,
  hideBackground = false,
  legendVariant,
  tooltipRoundness,
  tooltipVariant,
  tooltipDefaultIndex,
  isClickable = false,
  isLoading = false,
  glowingBars = [],
  onSelectionChange,
  backgroundVariant,
}: EvilRadialChartPropsWithCallback<TData>) {
  const [selectedBar, setSelectedBar] = useState<string | null>(null);
  const chartId = useId().replace(/:/g, "");
  const loadingData = useLoadingData(isLoading);

  // Handler to update selection and call callback
  const handleSelectionChange = useCallback(
    (barName: string | null) => {
      setSelectedBar(barName);
      if (isClickable && onSelectionChange) {
        if (barName === null) {
          onSelectionChange(null);
        } else {
          // Find the data item and get its value
          const selectedItem = data.find((item) => (item[nameKey] as string) === barName);
          if (selectedItem) {
            const value = selectedItem[dataKey] as number;
            onSelectionChange({ dataKey: barName, value });
          }
        }
      }
    },
    [isClickable, onSelectionChange, data, nameKey, dataKey],
  );

  // Variant-specific settings
  const variantConfig = getVariantConfig(variant);

  // Prepare data with fill colors referencing gradients
  const preparedData = data.map((item) => {
    const barName = item[nameKey] as string;
    return {
      ...item,
      fill: `url(#${chartId}-radial-colors-${barName})`,
    };
  });

  return (
    <ChartContainer className={className} config={chartConfig}>
      <LoadingIndicator isLoading={isLoading} />
      <RadialBarChart
        id="evil-charts-radial-chart"
        data={isLoading ? loadingData : preparedData}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={variantConfig.startAngle}
        endAngle={variantConfig.endAngle}
        cx={variantConfig.cx}
        cy={variantConfig.cy}
        {...chartProps}
      >
        {backgroundVariant && <ChartBackground variant={backgroundVariant} />}
        {!hideLegend && !isLoading && (
          <ChartLegend
            verticalAlign={variant === "semi" ? "bottom" : "bottom"}
            align="center"
            content={
              <ChartLegendContent
                selected={selectedBar}
                onSelectChange={handleSelectionChange}
                isClickable={isClickable}
                nameKey={nameKey}
                variant={legendVariant}
              />
            }
          />
        )}
        {!hideTooltip && !isLoading && (
          <ChartTooltip
            defaultIndex={tooltipDefaultIndex}
            cursor={false}
            content={
              <ChartTooltipContent
                nameKey={nameKey}
                hideLabel
                roundness={tooltipRoundness}
                variant={tooltipVariant}
              />
            }
          />
        )}

        {/* Main radial bar */}
        {!isLoading && (
          <RadialBar
            dataKey={dataKey as TypedDataKey<TData>}
            cornerRadius={cornerRadius}
            barSize={barSize}
            background={!hideBackground}
            className="drop-shadow-sm"
            style={isClickable ? { cursor: "pointer" } : undefined}
            onClick={(_, index) => {
              if (!isClickable) return;
              const clickedName = data[index]?.[nameKey] as string;
              handleSelectionChange(selectedBar === clickedName ? null : clickedName);
            }}
            shape={(props: SectorProps) => {
              // Recharts merges data entry properties into shape props,
              // so we can read the nameKey value directly from props
              const barName = (props as unknown as TData)[nameKey] as string;
              const isGlowing = glowingBars.includes(barName);
              const isSelected = selectedBar === null || selectedBar === barName;

              const getFilter = () => {
                if (isGlowing) return `url(#${chartId}-radial-glow-${barName})`;
                return undefined;
              };

              return (
                <Sector
                  {...props}
                  filter={getFilter()}
                  opacity={isClickable && !isSelected ? 0.3 : 1}
                  className="transition-opacity duration-200"
                />
              );
            }}
            {...radialBarProps}
          />
        )}

        {/* Loading state with animated data */}
        {isLoading && (
          <RadialBar
            dataKey="value"
            cornerRadius={cornerRadius}
            barSize={barSize}
            background
            isAnimationActive
            animationDuration={LOADING_ANIMATION_DURATION}
            animationEasing="ease-in-out"
            shape={(props: SectorProps) => (
              <Sector {...props} fill="currentColor" fillOpacity={0.25} />
            )}
          />
        )}

        {/* ======== CHART STYLES ======== */}
        <defs>
          {/* Color gradients for each bar */}
          <ColorGradientStyle chartConfig={chartConfig} chartId={chartId} />

          {/* Glow filters */}
          {glowingBars.length > 0 && (
            <GlowFilterStyle chartId={chartId} glowingBars={glowingBars} />
          )}
        </defs>
      </RadialBarChart>
    </ChartContainer>
  );
}

// Get angle and position configuration based on chart variant (full/semi)
function getVariantConfig(variant: RadialVariant) {
  switch (variant) {
    case "semi":
      return {
        startAngle: 180,
        endAngle: 0,
        cx: "50%",
        cy: "70%",
      };
    case "full":
    default:
      return {
        startAngle: 90,
        endAngle: -270,
        cx: "50%",
        cy: "50%",
      };
  }
}

// Generate random loading data with values between 40-100
function generateLoadingData() {
  return Array.from({ length: LOADING_BARS }, (_, i) => ({
    name: `loading${i}`,
    value: 40 + Math.random() * 60, // Random values between 40-100
  }));
}

// Hook to animate loading data at intervals
function useLoadingData(isLoading: boolean) {
  const [dataKey, setDataKey] = useState(0);

  useEffect(() => {
    if (!isLoading) return;

    const interval = setInterval(() => {
      setDataKey((prev) => prev + 1);
    }, LOADING_ANIMATION_DURATION);

    return () => clearInterval(interval);
  }, [isLoading]);

  // Regenerate data when dataKey changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadingData = useMemo(() => generateLoadingData(), [dataKey]);

  return loadingData;
}

// Create horizontal color gradient for radial bars following the arc
const ColorGradientStyle = ({
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
            key={`${chartId}-radial-colors-${dataKey}`}
            id={`${chartId}-radial-colors-${dataKey}`}
            x1="0"
            y1="0"
            x2="1"
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

// Apply soft glow filter effect to radial bars using SVG filters
const GlowFilterStyle = ({ chartId, glowingBars }: { chartId: string; glowingBars: string[] }) => {
  return (
    <>
      {glowingBars.map((barName) => (
        <filter
          key={`${chartId}-radial-glow-${barName}`}
          id={`${chartId}-radial-glow-${barName}`}
          x="-100%"
          y="-100%"
          width="300%"
          height="300%"
        >
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.6 0"
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
