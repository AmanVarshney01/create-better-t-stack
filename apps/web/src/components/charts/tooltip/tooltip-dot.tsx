"use client";

import { motion, useSpring } from "motion/react";

import { type SpringConfig, useChartConfig } from "../chart-config-context";
import { chartCssVars } from "../chart-context";

export interface TooltipDotProps {
  x: number;
  y: number;
  visible: boolean;
  color: string;
  size?: number;
  strokeColor?: string;
  strokeWidth?: number;
  /** Per-chart override; falls back to `ChartConfigProvider.tooltipSpring`. */
  springConfig?: SpringConfig;
  /** Animate position with a spring. Default: true */
  animate?: boolean;
}

export function TooltipDot({
  x,
  y,
  visible,
  color,
  size = 5,
  strokeColor = chartCssVars.background,
  strokeWidth = 2,
  springConfig,
  animate = true,
}: TooltipDotProps) {
  const { tooltipSpring } = useChartConfig();
  const effectiveSpring = springConfig ?? tooltipSpring;
  const animatedX = useSpring(x, effectiveSpring);
  const animatedY = useSpring(y, effectiveSpring);

  if (animate) {
    animatedX.set(x);
    animatedY.set(y);
  }

  if (!visible) {
    return null;
  }

  if (!animate) {
    return (
      <circle cx={x} cy={y} fill={color} r={size} stroke={strokeColor} strokeWidth={strokeWidth} />
    );
  }

  return (
    <motion.circle
      cx={animatedX}
      cy={animatedY}
      fill={color}
      r={size}
      stroke={strokeColor}
      strokeWidth={strokeWidth}
    />
  );
}

TooltipDot.displayName = "TooltipDot";

export default TooltipDot;
