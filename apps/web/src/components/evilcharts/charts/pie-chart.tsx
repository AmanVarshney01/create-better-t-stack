"use client";

import { motion } from "motion/react";
import { useCallback, useId, useState, type ComponentProps } from "react";
import { LabelList, Pie, PieChart, Sector, type PieSectorShapeProps } from "recharts";

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
const LOADING_SECTORS = 5;
const LOADING_ANIMATION_DURATION = 2000; // Full cycle duration in ms

// Constants
const DEFAULT_INNER_RADIUS = 0;
const DEFAULT_OUTER_RADIUS = "80%";
const DEFAULT_CORNER_RADIUS = 0;
const DEFAULT_PADDING_ANGLE = 0;

type ChartProps = ComponentProps<typeof PieChart>;
type PieProps = ComponentProps<typeof Pie>;
type LabelListProps = ComponentProps<typeof LabelList>;

type EvilPieChartProps<TData extends Record<string, unknown>> = {
  // Data
  data: TData[];
  dataKey: keyof TData & string;
  nameKey: keyof TData & string;
  chartConfig: ChartConfig;
  className?: string;
  chartProps?: ChartProps;
  pieProps?: Omit<PieProps, "data" | "dataKey" | "nameKey">;

  // Pie Shape
  innerRadius?: number | string;
  outerRadius?: number | string;
  cornerRadius?: number;
  paddingAngle?: number;
  startAngle?: number;
  endAngle?: number;

  // Labels
  showLabels?: boolean;
  labelKey?: keyof TData & string;
  labelListProps?: Omit<LabelListProps, "dataKey">;

  // Hide Stuffs
  hideTooltip?: boolean;
  hideLegend?: boolean;
  legendVariant?: ChartLegendVariant;
  // Tooltip
  tooltipRoundness?: TooltipRoundness;
  tooltipVariant?: TooltipVariant;
  tooltipDefaultIndex?: number;

  // Interactive Stuffs
  isLoading?: boolean;

  // Glow Effects
  glowingSectors?: string[];
  // Background
  backgroundVariant?: BackgroundVariant;
};

type EvilPieChartClickable = {
  isClickable: true;
  onSelectionChange?: (selection: { dataKey: string; value: number } | null) => void;
};

type EvilPieChartNotClickable = {
  isClickable?: false;
  onSelectionChange?: never;
};

type EvilPieChartPropsWithCallback<TData extends Record<string, unknown>> =
  EvilPieChartProps<TData> & (EvilPieChartClickable | EvilPieChartNotClickable);

export function EvilPieChart<TData extends Record<string, unknown>>({
  data,
  dataKey,
  nameKey,
  chartConfig,
  className,
  chartProps,
  pieProps,
  innerRadius = DEFAULT_INNER_RADIUS,
  outerRadius = DEFAULT_OUTER_RADIUS,
  cornerRadius = DEFAULT_CORNER_RADIUS,
  paddingAngle = DEFAULT_PADDING_ANGLE,
  startAngle = 0,
  endAngle = 360,
  showLabels = false,
  labelKey,
  labelListProps,
  hideTooltip = false,
  hideLegend = false,
  legendVariant,
  tooltipRoundness,
  tooltipVariant,
  tooltipDefaultIndex,
  isClickable = false,
  isLoading = false,
  glowingSectors = [],
  onSelectionChange,
  backgroundVariant,
}: EvilPieChartPropsWithCallback<TData>) {
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const chartId = useId().replace(/:/g, "");

  // Handler to update selection and call callback
  const handleSelectionChange = useCallback(
    (sectorName: string | null) => {
      setSelectedSector(sectorName);
      if (isClickable && onSelectionChange) {
        if (sectorName === null) {
          onSelectionChange(null);
        } else {
          // Find the data item and get its value
          const selectedItem = data.find((item) => (item[nameKey] as string) === sectorName);
          if (selectedItem) {
            const value = selectedItem[dataKey] as number;
            onSelectionChange({ dataKey: sectorName, value });
          }
        }
      }
    },
    [isClickable, onSelectionChange, data, nameKey, dataKey],
  );

  // Prepare data with fill colors referencing gradients
  const preparedData = data.map((item) => {
    const sectorName = item[nameKey] as string;
    return {
      ...item,
      fill: `url(#${chartId}-pie-colors-${sectorName})`,
    };
  });

  return (
    <ChartContainer className={className} config={chartConfig}>
      <LoadingIndicator isLoading={isLoading} />
      <PieChart id="evil-charts-pie-chart" accessibilityLayer {...chartProps}>
        {backgroundVariant && <ChartBackground variant={backgroundVariant} />}
        {!hideLegend && (
          <ChartLegend
            verticalAlign="bottom"
            align="center"
            content={
              <ChartLegendContent
                selected={selectedSector}
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
        {!isLoading && (
          <Pie
            data={preparedData}
            dataKey={dataKey}
            nameKey={nameKey}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            cornerRadius={cornerRadius}
            paddingAngle={paddingAngle}
            startAngle={startAngle}
            endAngle={endAngle}
            strokeWidth={0}
            isAnimationActive
            style={isClickable ? { cursor: "pointer" } : undefined}
            onClick={(_, index) => {
              if (!isClickable) return;
              const clickedName = data[index]?.[nameKey] as string;
              handleSelectionChange(selectedSector === clickedName ? null : clickedName);
            }}
            shape={(props: PieSectorShapeProps) => {
              const index = props.index ?? 0;
              const sectorName = data[index]?.[nameKey] as string;
              const isGlowing = glowingSectors.includes(sectorName);
              const isSelected = selectedSector === null || selectedSector === sectorName;

              const getFilter = () => {
                if (isGlowing) return `url(#${chartId}-pie-glow-${sectorName})`;
                return undefined;
              };

              return (
                <Sector
                  {...props}
                  fill={`url(#${chartId}-pie-colors-${sectorName})`}
                  filter={getFilter()}
                  stroke={paddingAngle < 0 ? "var(--background)" : "none"}
                  strokeWidth={paddingAngle < 0 ? 5 : 0}
                  opacity={isClickable && !isSelected ? 0.3 : 1}
                  className="transition-opacity duration-200"
                />
              );
            }}
            {...pieProps}
          >
            {showLabels && (
              <LabelList
                dataKey={labelKey ?? dataKey}
                stroke="none"
                fontSize={12}
                fontWeight={500}
                fill="currentColor"
                className="fill-background"
                {...labelListProps}
              />
            )}
          </Pie>
        )}

        {/* Animated loading overlay using custom shape */}
        {isLoading && (
          <Pie
            data={LOADING_PIE_DATA}
            dataKey="value"
            nameKey="name"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            cornerRadius={cornerRadius}
            paddingAngle={paddingAngle}
            startAngle={startAngle}
            endAngle={endAngle}
            strokeWidth={0}
            isAnimationActive={false}
            shape={(props) => <AnimatedLoadingSector {...props} />}
          />
        )}

        {/* ======== CHART STYLES ======== */}
        <defs>
          {/* Radial color gradients for each sector */}
          <RadialColorGradientStyle chartConfig={chartConfig} chartId={chartId} />

          {/* Glow filters */}
          {glowingSectors.length > 0 && (
            <GlowFilterStyle chartId={chartId} glowingSectors={glowingSectors} />
          )}
        </defs>
      </PieChart>
    </ChartContainer>
  );
}

// Generate fixed loading data with equal sectors for circular pulsing animation
const LOADING_PIE_DATA = Array.from({ length: LOADING_SECTORS }, (_, i) => ({
  name: `loading${i}`,
  value: 100 / LOADING_SECTORS,
}));

// Animated sector for loading state using motion.dev
const AnimatedLoadingSector = (props: ComponentProps<typeof Sector> & { index?: number }) => {
  const { index = 0, ...sectorProps } = props;

  // Calculate delay for circular wave effect
  const delay = (index / LOADING_SECTORS) * (LOADING_ANIMATION_DURATION / 1000);

  return (
    <motion.g
      initial={{ opacity: 0.15 }}
      animate={{ opacity: [0.15, 0.5, 0.15] }}
      transition={{
        duration: LOADING_ANIMATION_DURATION / 1000,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <Sector {...sectorProps} fill="currentColor" />
    </motion.g>
  );
};

// Create radial color gradient for pie sectors
const RadialColorGradientStyle = ({
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
            key={`${chartId}-pie-colors-${dataKey}`}
            id={`${chartId}-pie-colors-${dataKey}`}
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

// Apply soft glow filter effect to pie sectors using SVG filters
const GlowFilterStyle = ({
  chartId,
  glowingSectors,
}: {
  chartId: string;
  glowingSectors: string[];
}) => {
  return (
    <>
      {glowingSectors.map((sectorName) => (
        <filter
          key={`${chartId}-pie-glow-${sectorName}`}
          id={`${chartId}-pie-glow-${sectorName}`}
          x="-100%"
          y="-100%"
          width="300%"
          height="300%"
        >
          <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.5 0"
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
