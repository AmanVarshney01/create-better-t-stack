import { describe, expect, test } from "bun:test";

import type { CLIInput, ProjectConfig } from "../../cli/src/types";
import { validateFullConfig } from "../../cli/src/utils/config-validation";
import {
  applyStackUpdate,
  getTechSelectionUpdate,
  resolveStackCompatibility,
} from "../src/app/(home)/new/_components/stack-builder/use-stack-builder";
import { getDisabledReason } from "../src/app/(home)/new/_components/utils";
import { DEFAULT_STACK, type StackState, TECH_OPTIONS } from "../src/lib/constant";
import { sanitizeStackState } from "../src/lib/sanitize-stack-addons";
import type { TechCategory } from "../src/lib/types";

const RANDOM_STACK_COUNT = 25_000;
const TRANSITION_SEED_COUNT = 1000;
const CLI_STACK_FLAGS = new Set([
  "database",
  "orm",
  "backend",
  "runtime",
  "frontend",
  "addons",
  "examples",
  "auth",
  "dbSetup",
  "payments",
  "api",
  "webDeploy",
  "serverDeploy",
]);

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

function toCliConfig(stack: StackState): ProjectConfig {
  const combinedFrontends = [...stack.webFrontend, ...stack.nativeFrontend].filter(
    (frontend) => frontend !== "none",
  );

  return {
    projectName: stack.projectName ?? "invariant-test",
    projectDir: "/virtual/invariant-test",
    relativePath: "invariant-test",
    database: stack.database,
    orm: stack.orm,
    backend: stack.backend.startsWith("self-") ? "self" : stack.backend,
    runtime: stack.runtime,
    frontend: combinedFrontends.length > 0 ? combinedFrontends : ["none"],
    addons: stack.addons,
    examples: stack.examples,
    auth: stack.auth,
    payments: stack.payments,
    git: stack.git === "true",
    packageManager: stack.packageManager,
    install: stack.install === "true",
    dbSetup: stack.dbSetup,
    api: stack.api,
    webDeploy: stack.webDeploy,
    serverDeploy: stack.serverDeploy,
  } as ProjectConfig;
}

function getCliCompatibilityError(stack: StackState): string | null {
  const config = toCliConfig(stack);
  const result = validateFullConfig(config, CLI_STACK_FLAGS, config as CLIInput);
  return result.isErr() ? result.error.message : null;
}

function getResolvedSelectionErrors(stack: StackState): string[] {
  const errors: string[] = [];

  for (const { category, id } of selectedEntries(stack)) {
    const reason = getDisabledReason(stack, category, id);
    if (reason) {
      errors.push(`${category}=${id} is disabled: ${reason}`);
    }
  }

  const cliError = getCliCompatibilityError(stack);
  if (cliError) {
    errors.push(`CLI rejected generated stack: ${cliError}`);
  }

  return errors;
}

describe("compatibility adjustment invariants", () => {
  test("exposes exactly the ORM choices offered by the CLI for every database", () => {
    const expectedOrmChoices: Record<string, string[]> = {
      none: ["none"],
      sqlite: ["drizzle", "prisma"],
      postgres: ["drizzle", "prisma"],
      mysql: ["drizzle", "prisma"],
      mongodb: ["prisma", "mongoose"],
    };

    for (const database of TECH_OPTIONS.database.map((option) => option.id)) {
      const stack = applyStackUpdate(DEFAULT_STACK, { database }).stack;
      const enabledOrms = TECH_OPTIONS.orm
        .map((option) => option.id)
        .filter((orm) => !getDisabledReason(stack, "orm", orm));

      expect(enabledOrms).toEqual(expectedOrmChoices[database]);
    }
  });

  test("random stacks converge and contain no disabled selections after adjustment", () => {
    const rand = mulberry32(0xbe77e12);
    const failures: string[] = [];

    for (let i = 0; i < RANDOM_STACK_COUNT; i++) {
      const initial = randomStack(rand);
      const resolution = resolveStackCompatibility(initial);
      const unresolvedAdjustment = resolveStackCompatibility(resolution.stack).adjustedStack;

      if (unresolvedAdjustment) {
        failures.push(`did not converge: ${JSON.stringify(initial)}`);
      }

      for (const error of getResolvedSelectionErrors(resolution.stack)) {
        failures.push(`${error} for ${JSON.stringify(initial)}`);
      }
    }

    expect(failures.slice(0, 5)).toEqual([]);
    expect(failures.length).toBe(0);
  });

  test("every stack-builder option stays valid across representative state transitions", () => {
    const rand = mulberry32(0x51acced);
    const failures: string[] = [];
    let transitionsChecked = 0;

    for (let i = 0; i < TRANSITION_SEED_COUNT; i++) {
      const baseStack = resolveStackCompatibility(randomStack(rand)).stack;

      for (const category of Object.keys(TECH_OPTIONS) as TechCategory[]) {
        for (const option of TECH_OPTIONS[category]) {
          if (getDisabledReason(baseStack, category, option.id)) {
            continue;
          }

          const resolution = applyStackUpdate(baseStack, (currentStack) =>
            getTechSelectionUpdate(currentStack, category, option.id),
          );
          transitionsChecked++;

          for (const error of getResolvedSelectionErrors(resolution.stack)) {
            failures.push(`${category}=${option.id}: ${error} from ${JSON.stringify(baseStack)}`);
          }
        }
      }
    }

    expect(transitionsChecked).toBeGreaterThan(20_000);
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

    const adjusted = resolveStackCompatibility(stack).stack;
    expect(adjusted.addons).not.toContain("tauri");
    expect(getDisabledReason(adjusted, "addons", "tauri")).toBe(
      "Tauri isn't compatible with Convex Better Auth on Next.js or TanStack Start",
    );
  });
});
