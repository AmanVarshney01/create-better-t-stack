import type { Animation, Frontend } from "../types";

import { splitFrontends } from "../utils/compatibility-rules";
import { exitCancelled } from "../utils/errors";
import { isCancel, navigableSelect } from "./navigable";

export async function getAnimationChoice(animation?: Animation, frontends?: Frontend[]) {
  if (animation !== undefined) return animation;

  const { web } = splitFrontends(frontends);

  // Animation libraries are primarily for web frontends
  if (web.length === 0) {
    return "none" as Animation;
  }

  // Check if React-based frontend
  const isReact = web.some((f) =>
    ["tanstack-router", "react-router", "tanstack-start", "next", "redwood"].includes(f),
  );
  const isFresh = web.includes("fresh");

  // Build options based on frontend
  const options: Array<{ value: Animation; label: string; hint: string }> = [];

  if (isReact) {
    options.push(
      {
        value: "framer-motion" as const,
        label: "Framer Motion",
        hint: "Production-ready declarative animations for React",
      },
      {
        value: "react-spring" as const,
        label: "React Spring",
        hint: "Physics-based animations for fluid interactions",
      },
    );
  }

  // Framework-agnostic options
  options.push(
    {
      value: "gsap" as const,
      label: "GSAP",
      hint: "Professional-grade animation engine for the web",
    },
    {
      value: "auto-animate" as const,
      label: "Auto Animate",
      hint: "Zero-config, drop-in animation utility",
    },
  );

  // Lottie requires lottie-react, not available for Fresh/Preact
  if (!isFresh) {
    options.push({
      value: "lottie" as const,
      label: "Lottie",
      hint: "Render After Effects animations natively",
    });
  }

  options.push({
    value: "none" as const,
    label: "None",
    hint: "Skip animation library setup",
  });

  const response = await navigableSelect<Animation>({
    message: "Select animation library",
    options,
    initialValue: "none",
  });

  if (isCancel(response)) return exitCancelled("Operation cancelled");

  return response;
}
