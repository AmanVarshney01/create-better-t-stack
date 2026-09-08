import { analyzeStackCompatibility } from "@/lib/stack-validation";

import type { StackState } from "./constant";
import { sanitizeStackState } from "./sanitize-stack-addons";

const MAX_COMPATIBILITY_PASSES = 10;

type StackUpdate = Partial<StackState> | ((prev: StackState) => Partial<StackState>);
type CompatibilityAnalysis = ReturnType<typeof analyzeStackCompatibility>;

export type ResolvedStackCompatibility = CompatibilityAnalysis & {
  stack: StackState;
};

export function resolveStackCompatibility(stack: StackState): ResolvedStackCompatibility {
  let currentStack = sanitizeStackState(stack);
  let wasAdjusted = false;
  const changes: CompatibilityAnalysis["changes"] = [];

  for (let pass = 0; pass < MAX_COMPATIBILITY_PASSES; pass++) {
    const analysis = analyzeStackCompatibility(currentStack);
    if (!analysis.adjustedStack) {
      return {
        stack: currentStack,
        adjustedStack: wasAdjusted ? currentStack : null,
        notes: analysis.notes,
        changes,
      };
    }

    wasAdjusted = true;
    changes.push(...analysis.changes);
    currentStack = sanitizeStackState(analysis.adjustedStack);
  }

  const finalAnalysis = analyzeStackCompatibility(currentStack);
  return {
    stack: currentStack,
    adjustedStack: wasAdjusted ? currentStack : null,
    notes: finalAnalysis.notes,
    changes,
  };
}

export function applyStackUpdate(
  currentStack: StackState,
  update: StackUpdate,
): ResolvedStackCompatibility {
  const resolvedCurrentStack = resolveStackCompatibility(currentStack).stack;
  const partialUpdate = update instanceof Function ? update(resolvedCurrentStack) : update;
  const requestedStack = sanitizeStackState({ ...resolvedCurrentStack, ...partialUpdate });
  return resolveStackCompatibility(requestedStack);
}
