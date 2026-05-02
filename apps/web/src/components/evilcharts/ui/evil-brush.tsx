"use client";

import { motion, useMotionValue, useMotionValueEvent, useSpring, useTransform } from "motion/react";
import type { MotionValue } from "motion/react";
import { useCallback, useEffect, type ComponentProps } from "react";
import * as React from "react";
import { ResponsiveContainer, AreaChart, Area, LineChart, Line, BarChart, Bar } from "recharts";

import { ChartStyle, getColorsCount, type ChartConfig } from "@/components/evilcharts/ui/chart";
import { cn } from "@/lib/utils";

// ─── Types ──────────────────────────────────────────────────────────────────

type EvilBrushVariant = "line" | "area" | "bar";
type CurveType = ComponentProps<typeof Area>["type"];

interface EvilBrushRange {
  startIndex: number;
  endIndex: number;
}

interface EvilBrushProps {
  /** Full dataset – always rendered in the miniature chart */
  data: Record<string, unknown>[];
  /** Chart config with colour definitions */
  chartConfig: ChartConfig;
  /** Data keys to plot (default: all keys from chartConfig) */
  dataKeys?: string[];
  /** X-axis data key – used for handle labels */
  xDataKey?: string;
  /** Visual variant of the mini chart */
  variant?: EvilBrushVariant;
  /** Pixel height of the brush */
  height?: number;
  /** Extra className */
  className?: string;
  /** Whether areas/bars should be stacked in the mini chart */
  stacked?: boolean;
  /** Stroke variant for line / area strokes in the mini chart */
  strokeVariant?: "solid" | "dashed" | "animated-dashed";
  /** Whether to connect null data points in line / area variants */
  connectNulls?: boolean;
  /** Radius for bar corners in the bar variant */
  barRadius?: number;

  // ── Controlled mode ──────────────────────────────────────────────────
  /** Controlled start index */
  startIndex?: number;
  /** Controlled end index */
  endIndex?: number;

  // ── Uncontrolled mode ────────────────────────────────────────────────
  /** Initial start index (uncontrolled) */
  defaultStartIndex?: number;
  /** Initial end index (uncontrolled) */
  defaultEndIndex?: number;

  /** Fired whenever the visible range changes */
  onChange?: (range: EvilBrushRange) => void;
  /** Format the handle label from the xDataKey value */
  formatLabel?: (value: unknown, index: number) => string;
  /** Curve type for line / area variants */
  curveType?: CurveType;
  /** Minimum number of data points that must remain selected */
  minSpan?: number;
  /** Whether to render labels on the handles */
  showLabels?: boolean;
  /** Skip rendering own ChartStyle (when inside a ChartContainer that already provides CSS vars) */
  skipStyle?: boolean;
}

// ─── Spring config ──────────────────────────────────────────────────────────

const SPRING_CONFIG = { stiffness: 300, damping: 35, mass: 0.8 };

// ─── Pointer-capture drag hook ──────────────────────────────────────────────
// Replaces raw addEventListener with the modern Pointer Events API.
// setPointerCapture routes all pointer events to the originating element,
// so we get mouse + touch + pen support with zero global listeners.

type DragType = "left" | "right" | "middle";

interface DragState {
  type: DragType;
  originX: number;
  originRange: EvilBrushRange;
}

function useBrushDrag({
  range,
  totalPoints,
  containerRef,
  commit,
}: {
  range: EvilBrushRange;
  totalPoints: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
  commit: (next: EvilBrushRange, mode?: DragType) => void;
}) {
  const dragRef = React.useRef<DragState | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const toIndexDelta = useCallback(
    (px: number) => {
      if (!containerRef.current || totalPoints <= 1) return 0;
      return Math.round(
        (px / containerRef.current.getBoundingClientRect().width) * (totalPoints - 1),
      );
    },
    [totalPoints, containerRef],
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent, type: DragType) => {
      e.preventDefault();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      dragRef.current = { type, originX: e.clientX, originRange: { ...range } };
      setIsDragging(true);
    },
    [range],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      const d = dragRef.current;
      if (!d) return;

      const delta = toIndexDelta(e.clientX - d.originX);
      const { type, originRange: o } = d;

      if (type === "left") {
        commit({ startIndex: o.startIndex + delta, endIndex: o.endIndex }, "left");
      } else if (type === "right") {
        commit({ startIndex: o.startIndex, endIndex: o.endIndex + delta }, "right");
      } else {
        const span = o.endIndex - o.startIndex;
        let s = o.startIndex + delta;
        let e2 = s + span;
        if (s < 0) {
          s = 0;
          e2 = span;
        }
        if (e2 > totalPoints - 1) {
          e2 = totalPoints - 1;
          s = Math.max(0, e2 - span);
        }
        commit({ startIndex: s, endIndex: e2 }, "middle");
      }
    },
    [toIndexDelta, totalPoints, commit],
  );

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    dragRef.current = null;
    setIsDragging(false);
  }, []);

  // Helper to bind all three pointer handlers for a given drag type
  const bind = useCallback(
    (type: DragType) => ({
      onPointerDown: (e: React.PointerEvent) => onPointerDown(e, type),
      onPointerMove,
      onPointerUp,
    }),
    [onPointerDown, onPointerMove, onPointerUp],
  );

  return { isDragging, bind };
}

// ─── EvilBrush ────────────────────────────────────────────────────────────

function EvilBrush({
  data,
  chartConfig,
  dataKeys,
  xDataKey,
  variant = "area",
  height = 56,
  className,
  stacked = false,
  strokeVariant = "solid",
  connectNulls = false,
  barRadius,
  startIndex: controlledStart,
  endIndex: controlledEnd,
  defaultStartIndex = 0,
  defaultEndIndex,
  onChange,
  formatLabel,
  curveType = "monotone",
  minSpan = 2,
  showLabels = true,
  skipStyle = false,
}: EvilBrushProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const keys = React.useMemo(() => dataKeys ?? Object.keys(chartConfig), [dataKeys, chartConfig]);
  const totalPoints = data.length;
  const chartId = React.useId().replace(/:/g, "");

  // ── Controlled vs uncontrolled ──────────────────────────────────────────

  const isControlled = controlledStart !== undefined && controlledEnd !== undefined;

  const [internalRange, setInternalRange] = React.useState<EvilBrushRange>(() => ({
    startIndex: Math.max(0, Math.min(defaultStartIndex, totalPoints - 1)),
    endIndex: Math.max(0, Math.min(defaultEndIndex ?? totalPoints - 1, totalPoints - 1)),
  }));

  // Track the last committed range to avoid duplicate updates when small
  // mouse movements don't produce index changes (e.g., at boundaries)
  const lastCommittedRef = React.useRef<EvilBrushRange>(internalRange);

  useEffect(() => {
    if (!isControlled) {
      setInternalRange((prev) => {
        const adjusted = {
          startIndex: Math.min(prev.startIndex, Math.max(0, totalPoints - 1)),
          endIndex: Math.min(prev.endIndex, Math.max(0, totalPoints - 1)),
        };
        lastCommittedRef.current = adjusted;
        return adjusted;
      });
    }
  }, [totalPoints, isControlled]);

  // ── Clamping & committing ───────────────────────────────────────────────

  const clampRange = useCallback(
    (range: EvilBrushRange, mode?: DragType): EvilBrushRange => {
      let { startIndex, endIndex } = range;
      const maxIndex = Math.max(0, totalPoints - 1);

      startIndex = Math.max(0, Math.min(startIndex, maxIndex));
      endIndex = Math.max(0, Math.min(endIndex, maxIndex));

      if (mode === "left") {
        const maxStart = Math.max(0, endIndex - minSpan);
        startIndex = Math.min(startIndex, maxStart);
        return { startIndex, endIndex };
      }

      if (mode === "right") {
        const minEnd = Math.min(maxIndex, startIndex + minSpan);
        endIndex = Math.max(endIndex, minEnd);
        return { startIndex, endIndex };
      }

      if (endIndex - startIndex < minSpan) {
        endIndex = Math.min(startIndex + minSpan, maxIndex);
        if (endIndex - startIndex < minSpan) {
          startIndex = Math.max(0, endIndex - minSpan);
        }
      }
      return { startIndex, endIndex };
    },
    [totalPoints, minSpan],
  );

  const commit = useCallback(
    (next: EvilBrushRange, mode?: DragType) => {
      const clamped = clampRange(next, mode);
      const last = lastCommittedRef.current;

      // Only update if the range has actually changed — avoids unnecessary
      // re-renders when the brush is at a boundary and small mouse movements
      // don't produce index changes
      if (last.startIndex === clamped.startIndex && last.endIndex === clamped.endIndex) {
        return;
      }

      lastCommittedRef.current = clamped;
      setInternalRange(clamped);
      // Defer the parent callback — chart re-render happens at lower priority,
      // React can skip intermediate frames during fast drags
      React.startTransition(() => {
        onChange?.(clamped);
      });
    },
    [clampRange, onChange],
  );

  // ── Drag ────────────────────────────────────────────────────────────────

  const { isDragging, bind } = useBrushDrag({
    range: internalRange,
    totalPoints,
    containerRef,
    commit,
  });

  // Position always driven by internalRange (never lags behind controlled props)
  const range = internalRange;

  // Sync internalRange with controlled props when not dragging
  useEffect(() => {
    if (isControlled && !isDragging) {
      const syncedRange = { startIndex: controlledStart, endIndex: controlledEnd };
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInternalRange(syncedRange);
      lastCommittedRef.current = syncedRange;
    }
  }, [isControlled, controlledStart, controlledEnd, isDragging]);

  // ── Computed positions (%) ──────────────────────────────────────────────

  const leftPct = totalPoints > 1 ? (range.startIndex / (totalPoints - 1)) * 100 : 0;
  const rightPct = totalPoints > 1 ? (range.endIndex / (totalPoints - 1)) * 100 : 100;

  // Drive all moving brush UI from the same springed edge values.
  const leftTarget = useMotionValue(leftPct);
  const rightTarget = useMotionValue(rightPct);
  if (leftTarget.get() !== leftPct) leftTarget.set(leftPct);
  if (rightTarget.get() !== rightPct) rightTarget.set(rightPct);

  const leftSpring = useSpring(leftTarget, SPRING_CONFIG);
  const rightSpring = useSpring(rightTarget, SPRING_CONFIG);
  const leftPosition = useTransform(leftSpring, (v) => `${v}%`);
  const rightPosition = useTransform(rightSpring, (v) => `${v}%`);
  const leftOverlayWidth = useTransform(leftSpring, (v) => `${v}%`);
  const rightOverlayWidth = useTransform(rightSpring, (v) => `${Math.max(0, 100 - v)}%`);
  const selectedWidth = useMotionValue(`${Math.max(0, rightPct - leftPct)}%`);

  const updateSelectedWidth = useCallback(() => {
    selectedWidth.set(`${Math.max(0, rightSpring.get() - leftSpring.get())}%`);
  }, [leftSpring, rightSpring, selectedWidth]);

  useMotionValueEvent(leftSpring, "change", updateSelectedWidth);
  useMotionValueEvent(rightSpring, "change", updateSelectedWidth);

  const getLabel = useCallback(
    (idx: number) => {
      if (!xDataKey) return String(idx);
      const v = data[idx]?.[xDataKey];
      return formatLabel ? formatLabel(v, idx) : String(v ?? idx);
    },
    [data, xDataKey, formatLabel],
  );

  // ── Render ──────────────────────────────────────────────────────────────

  if (totalPoints === 0) return null;

  return (
    <div
      ref={containerRef}
      data-chart={skipStyle ? undefined : chartId}
      className={cn("group relative select-none", className)}
      style={{ height }}
    >
      {!skipStyle && <ChartStyle id={chartId} config={chartConfig} />}

      {/* Mini chart – always shows all data */}
      <div className="absolute inset-0 overflow-hidden rounded-md">
        <MiniChart
          data={data}
          keys={keys}
          chartConfig={chartConfig}
          variant={variant}
          curveType={curveType}
          chartId={chartId}
          stacked={stacked}
          strokeVariant={strokeVariant === "animated-dashed" ? "dashed" : strokeVariant}
          connectNulls={connectNulls}
          barRadius={barRadius}
        />
      </div>

      {/* Dim overlay – left */}
      <motion.div
        className="bg-background/70 pointer-events-none absolute inset-y-0 left-0 rounded-l-md"
        style={{ width: leftOverlayWidth }}
      />
      {/* Dim overlay – right */}
      <motion.div
        className="bg-background/70 pointer-events-none absolute inset-y-0 right-0 rounded-r-md"
        style={{ width: rightOverlayWidth }}
      />

      {/* Selected region – draggable to pan */}
      <motion.div
        className="absolute inset-y-0 cursor-grab touch-none rounded-sm border active:cursor-grabbing"
        style={{ left: leftPosition, width: selectedWidth }}
        {...bind("middle")}
      />

      {/* Left handle */}
      <BrushHandle
        side="left"
        position={leftPosition}
        label={showLabels ? getLabel(range.startIndex) : undefined}
        bind={bind("left")}
      />

      {/* Right handle */}
      <BrushHandle
        side="right"
        position={rightPosition}
        label={showLabels ? getLabel(range.endIndex) : undefined}
        bind={bind("right")}
      />
    </div>
  );
}

// ─── Brush Handle ───────────────────────────────────────────────────────────

function BrushHandle({
  side,
  position,
  label,
  bind,
}: {
  side: "left" | "right";
  position: MotionValue<string>;
  label?: string;
  bind: {
    onPointerDown: (e: React.PointerEvent) => void;
    onPointerMove: (e: React.PointerEvent) => void;
    onPointerUp: (e: React.PointerEvent) => void;
  };
}) {
  const isLeft = side === "left";

  return (
    <motion.div className="absolute inset-y-0 z-10" style={{ left: position }}>
      <div
        className={cn(
          "group absolute inset-y-0 flex w-3 cursor-ew-resize touch-none items-center justify-center after:absolute after:inset-y-0 after:-left-4 after:w-11 after:content-['']",
          isLeft ? "" : "-translate-x-full",
        )}
        {...bind}
      >
        <div
          className={cn(
            "bg-muted-foreground group-hover:bg-foreground relative flex h-4 w-1.5 items-center justify-center rounded-md transition-colors",
            isLeft ? "-left-[5.5px]" : "-right-[5.5px]",
          )}
        >
          <div className="flex flex-col gap-[2px]">
            <div className="bg-background/70 h-[2px] w-[2px] rounded-full" />
            <div className="bg-background/70 h-[2px] w-[2px] rounded-full" />
            <div className="bg-background/70 h-[2px] w-[2px] rounded-full" />
          </div>
        </div>
      </div>

      {label && (
        <div
          className={cn(
            "bg-foreground text-background pointer-events-none absolute -bottom-3 -translate-y-1/2 rounded-[3px] px-1 py-px text-[8px] leading-tight font-medium whitespace-nowrap opacity-0 group-hover:opacity-100",
            isLeft ? "left-1.5" : "right-1.5",
          )}
        >
          {label}
        </div>
      )}
    </motion.div>
  );
}

// ─── Mini Chart ─────────────────────────────────────────────────────────────

function MiniChart({
  data,
  keys,
  chartConfig,
  variant,
  curveType,
  chartId,
  stacked,
  strokeVariant = "solid",
  connectNulls = false,
  barRadius,
}: {
  data: Record<string, unknown>[];
  keys: string[];
  chartConfig: ChartConfig;
  variant: EvilBrushVariant;
  curveType: CurveType;
  chartId: string;
  stacked: boolean;
  strokeVariant?: "solid" | "dashed" | "animated-dashed";
  connectNulls?: boolean;
  barRadius?: number;
}) {
  const gradients = React.useMemo(
    () =>
      Object.entries(chartConfig)
        .filter(([key]) => keys.includes(key))
        .map(([dataKey, config]) => ({
          dataKey,
          colorsCount: getColorsCount(config),
        })),
    [chartConfig, keys],
  );

  const dashArray =
    strokeVariant === "dashed" || strokeVariant === "animated-dashed" ? "4 4" : undefined;

  const defsContent = (
    <>
      {/* Vertical fade gradient for area fill mask */}
      {variant === "area" && (
        <linearGradient id={`${chartId}-zm-vertical-fade`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity={0.15} />
          <stop offset="100%" stopColor="white" stopOpacity={0} />
        </linearGradient>
      )}
      {gradients.map(({ dataKey, colorsCount }) => {
        const colorStops =
          colorsCount === 1 ? (
            <>
              <stop offset="0%" stopColor={`var(--color-${dataKey}-0)`} />
              <stop offset="100%" stopColor={`var(--color-${dataKey}-0)`} />
            </>
          ) : (
            Array.from({ length: colorsCount }, (_, i) => (
              <stop
                key={i}
                offset={`${(i / (colorsCount - 1)) * 100}%`}
                stopColor={`var(--color-${dataKey}-${i}, var(--color-${dataKey}-0))`}
              />
            ))
          );

        return (
          <React.Fragment key={dataKey}>
            {/* Vertical color gradient (stroke + bar fill) */}
            <linearGradient id={`${chartId}-zm-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              {colorStops}
            </linearGradient>

            {/* Area fill: color gradient masked with vertical fade */}
            {variant === "area" && (
              <>
                <mask id={`${chartId}-zm-fill-mask-${dataKey}`}>
                  <rect width="100%" height="100%" fill={`url(#${chartId}-zm-vertical-fade)`} />
                </mask>
                <pattern
                  id={`${chartId}-zm-fill-${dataKey}`}
                  patternUnits="userSpaceOnUse"
                  width="100%"
                  height="100%"
                >
                  <rect
                    width="100%"
                    height="100%"
                    fill={`url(#${chartId}-zm-${dataKey})`}
                    mask={`url(#${chartId}-zm-fill-mask-${dataKey})`}
                  />
                </pattern>
              </>
            )}
          </React.Fragment>
        );
      })}
    </>
  );

  if (variant === "line") {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
          <defs>{defsContent}</defs>
          {keys.map((dk) => (
            <Line
              key={dk}
              type={curveType}
              dataKey={dk}
              stroke={`url(#${chartId}-zm-${dk})`}
              strokeWidth={1}
              strokeOpacity={0.5}
              strokeDasharray={dashArray}
              connectNulls={connectNulls}
              dot={false}
              activeDot={false}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    );
  }

  if (variant === "bar") {
    const r = barRadius ?? 3;
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 2, right: 0, bottom: 0, left: 0 }}
          barGap={2}
          barSize={14}
        >
          <defs>{defsContent}</defs>
          {keys.map((dk) => (
            <Bar
              key={dk}
              dataKey={dk}
              fill={`url(#${chartId}-zm-${dk})`}
              fillOpacity={0.35}
              stackId={stacked ? "zm-stack" : undefined}
              isAnimationActive={false}
              radius={[r, r, r, r]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    );
  }

  // Default: area
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
        <defs>{defsContent}</defs>
        {keys.map((dk) => (
          <Area
            key={dk}
            type={curveType}
            dataKey={dk}
            stroke={`url(#${chartId}-zm-${dk})`}
            fill={`url(#${chartId}-zm-fill-${dk})`}
            strokeWidth={1}
            strokeOpacity={0.5}
            strokeDasharray={dashArray}
            connectNulls={connectNulls}
            fillOpacity={1}
            stackId={stacked ? "zm-stack" : undefined}
            dot={false}
            activeDot={false}
            isAnimationActive={false}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ─── useEvilBrush Hook ──────────────────────────────────────────────────────

function useEvilBrush<TData extends Record<string, unknown>>({
  data,
  defaultStartIndex = 0,
  defaultEndIndex,
}: {
  data: TData[];
  defaultStartIndex?: number;
  defaultEndIndex?: number;
}) {
  const [range, setRange] = React.useState<EvilBrushRange>({
    startIndex: defaultStartIndex,
    endIndex: defaultEndIndex ?? Math.max(0, data.length - 1),
  });

  // Defer the range used for data slicing — the brush handles move at the

  // immediate `range` cadence while the expensive chart re-render uses the
  // deferred value.  React can skip intermediate slices during fast drags.
  const deferredRange = React.useDeferredValue(range);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRange({
      startIndex: 0,
      endIndex: Math.max(0, data.length - 1),
    });
  }, [data.length]);

  const visibleData = React.useMemo(
    () => data.slice(deferredRange.startIndex, deferredRange.endIndex + 1),
    [data, deferredRange.startIndex, deferredRange.endIndex],
  );

  return {
    range,
    visibleData,
    brushProps: {
      startIndex: range.startIndex,
      endIndex: range.endIndex,
      onChange: setRange,
    } satisfies Pick<EvilBrushProps, "startIndex" | "endIndex" | "onChange">,
  };
}

export { EvilBrush, useEvilBrush, type EvilBrushProps, type EvilBrushRange, type EvilBrushVariant };
