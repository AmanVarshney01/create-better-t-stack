import type { Frontend, StateManagement } from "../types";

import { splitFrontends } from "../utils/compatibility-rules";
import { exitCancelled } from "../utils/errors";
import { isCancel, navigableSelect } from "./navigable";

export async function getStateManagementChoice(
  stateManagement?: StateManagement,
  frontends?: Frontend[],
) {
  if (stateManagement !== undefined) return stateManagement;

  const { web } = splitFrontends(frontends);

  // State management is primarily for web frontends
  if (web.length === 0) {
    return "none" as StateManagement;
  }

  // Check if React-based frontend
  const isReact = web.some((f) =>
    ["tanstack-router", "react-router", "tanstack-start", "next", "redwood"].includes(f),
  );
  const isFresh = web.includes("fresh");

  // Build options based on frontend
  const options: Array<{ value: StateManagement; label: string; hint: string }> = [];

  if (isReact) {
    options.push(
      {
        value: "zustand" as const,
        label: "Zustand",
        hint: "Lightweight state management with simple API",
      },
      {
        value: "jotai" as const,
        label: "Jotai",
        hint: "Primitive and flexible atomic state",
      },
      {
        value: "redux-toolkit" as const,
        label: "Redux Toolkit",
        hint: "Enterprise-standard state with excellent TS support",
      },
      {
        value: "valtio" as const,
        label: "Valtio",
        hint: "Proxy-based state management",
      },
      {
        value: "legend-state" as const,
        label: "Legend State",
        hint: "High-performance observable state for React",
      },
      {
        value: "mobx" as const,
        label: "MobX",
        hint: "Observable-based reactive state management",
      },
    );
  }

  // Framework-agnostic options (but require React bindings, so exclude Fresh)
  if (!isFresh) {
    options.push(
      {
        value: "nanostores" as const,
        label: "Nanostores",
        hint: "Tiny state manager (1KB) for all frameworks",
      },
      {
        value: "xstate" as const,
        label: "XState",
        hint: "State machines and statecharts for complex logic",
      },
      {
        value: "tanstack-store" as const,
        label: "TanStack Store",
        hint: "Framework-agnostic store powering TanStack ecosystem",
      },
    );
  }

  options.push({
    value: "none" as const,
    label: "None",
    hint: "Skip state management setup",
  });

  const response = await navigableSelect<StateManagement>({
    message: "Select state management",
    options,
    initialValue: "none",
  });

  if (isCancel(response)) return exitCancelled("Operation cancelled");

  return response;
}
