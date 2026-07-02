import { describe, expect, test } from "bun:test";

import {
  analyzeStackCompatibility,
  getDisabledReason,
} from "../src/app/(home)/new/_components/utils";
import { DEFAULT_STACK, type StackState, TECH_OPTIONS } from "../src/lib/constant";
import { sanitizeStackState } from "../src/lib/sanitize-stack-addons";
import type { TechCategory } from "../src/lib/types";

const MAX_ADJUST_PASSES = 10;
const RANDOM_STACK_COUNT = 3000;

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(rand: () => number, items: readonly T[]): T {
  return items[Math.floor(rand() * items.length)];
}

function randomStack(rand: () => number): StackState {
  const ids = (category: keyof typeof TECH_OPTIONS) => TECH_OPTIONS[category].map((opt) => opt.id);

  const multi = (category: "addons" | "examples") => {
    const pool = ids(category).filter((id) => id !== "none");
    const count = Math.floor(rand() * Math.min(pool.length, 4));
    if (count === 0) return ["none"];
    return [...pool].sort(() => rand() - 0.5).slice(0, count);
  };

  return sanitizeStackState({
    ...DEFAULT_STACK,
    projectName: "invariant-test",
    webFrontend: [pick(rand, ids("webFrontend"))],
    nativeFrontend: [pick(rand, ids("nativeFrontend"))],
    runtime: pick(rand, ids("runtime")) as StackState["runtime"],
    backend: pick(rand, ids("backend")) as StackState["backend"],
    api: pick(rand, ids("api")) as StackState["api"],
    database: pick(rand, ids("database")) as StackState["database"],
    orm: pick(rand, ids("orm")) as StackState["orm"],
    dbSetup: pick(rand, ids("dbSetup")) as StackState["dbSetup"],
    auth: pick(rand, ids("auth")) as StackState["auth"],
    payments: pick(rand, ids("payments")) as StackState["payments"],
    packageManager: pick(rand, ids("packageManager")) as StackState["packageManager"],
    webDeploy: pick(rand, ids("webDeploy")) as StackState["webDeploy"],
    serverDeploy: pick(rand, ids("serverDeploy")) as StackState["serverDeploy"],
    addons: multi("addons"),
    examples: multi("examples"),
    yolo: "false",
  });
}

function adjustToFixpoint(stack: StackState) {
  let current = stack;
  for (let pass = 0; pass < MAX_ADJUST_PASSES; pass++) {
    const result = analyzeStackCompatibility(current);
    if (!result.adjustedStack) {
      return { stack: current, converged: true, passes: pass };
    }
    current = sanitizeStackState(result.adjustedStack);
  }
  return { stack: current, converged: false, passes: MAX_ADJUST_PASSES };
}

function selectedEntries(stack: StackState): Array<{ category: TechCategory; id: string }> {
  const entries: Array<{ category: TechCategory; id: string }> = [];
  for (const category of Object.keys(TECH_OPTIONS) as TechCategory[]) {
    const value = stack[category as keyof StackState];
    if (value === undefined) continue;
    const ids = Array.isArray(value) ? value : [value];
    for (const id of ids) {
      if (typeof id === "string") {
        entries.push({ category, id });
      }
    }
  }
  return entries;
}

describe("compatibility adjustment invariants", () => {
  test("random stacks converge and contain no disabled selections after adjustment", () => {
    const rand = mulberry32(0xbe77e12);
    const failures: string[] = [];

    for (let i = 0; i < RANDOM_STACK_COUNT; i++) {
      const initial = randomStack(rand);
      const { stack, converged } = adjustToFixpoint(initial);

      if (!converged) {
        failures.push(`did not converge: ${JSON.stringify(initial)}`);
        continue;
      }

      for (const { category, id } of selectedEntries(stack)) {
        const reason = getDisabledReason(stack, category, id);
        if (reason) {
          failures.push(
            `${category}=${id} disabled after adjust ("${reason}") for ${JSON.stringify(initial)}`,
          );
        }
      }
    }

    expect(failures.slice(0, 5)).toEqual([]);
    expect(failures.length).toBe(0);
  });

  test("tauri is removed when Convex Better Auth targets Next.js or TanStack Start", () => {
    const stack = sanitizeStackState({
      ...DEFAULT_STACK,
      webFrontend: ["next"],
      backend: "convex",
      auth: "better-auth",
      addons: ["tauri", "turborepo"],
    });

    const { stack: adjusted, converged } = adjustToFixpoint(stack);
    expect(converged).toBe(true);
    expect(adjusted.addons).not.toContain("tauri");
    expect(getDisabledReason(adjusted, "addons", "tauri")).toBe(
      "Tauri isn't compatible with Convex Better Auth on Next.js or TanStack Start",
    );
  });
});
