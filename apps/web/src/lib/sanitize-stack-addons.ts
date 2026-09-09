import { TASK_RUNNER_ADDONS, OBSERVABILITY_ADDONS, type Addons } from "@better-t-stack/types";

import { DEFAULT_STACK, type StackState, TECH_OPTIONS } from "./constant";

const validWebFrontendIds = TECH_OPTIONS.webFrontend.map((option) => option.id);
const validNativeFrontendIds = TECH_OPTIONS.nativeFrontend.map((option) => option.id);
const validAddonIds = ["none" as const, ...TECH_OPTIONS.addons.map((option) => option.id)];
const validExampleIds = ["none" as const, ...TECH_OPTIONS.examples.map((option) => option.id)];

function sanitizeSingleSelection<T extends string>(
  values: readonly string[] | null | undefined,
  validIds: readonly T[],
  defaultValue: readonly (T | "none")[],
): (T | "none")[] {
  if (values == null) {
    return [...defaultValue];
  }

  const selectedValue = values
    .flatMap((value) => validIds.filter((id) => id === value && id !== "none"))
    .at(-1);
  return selectedValue ? [selectedValue] : ["none"];
}

function sanitizeMultiSelection<T extends string>(
  values: readonly string[] | null | undefined,
  validIds: readonly T[],
  defaultValue: readonly (T | "none")[],
): (T | "none")[] {
  if (values == null) {
    return [...defaultValue];
  }

  const sanitized = values.flatMap((value) => validIds.filter((id) => id === value));
  const normalized =
    sanitized.length > 1 ? sanitized.filter((value) => value !== "none") : sanitized;
  const unique = [...new Set(normalized)];

  return unique.length > 0 ? unique : ["none"];
}

function resolveAddonConflicts(addons: readonly Addons[]): Addons[] {
  const resolved: Addons[] = [];
  const exclusiveGroups = [
    new Set<Addons>(TASK_RUNNER_ADDONS),
    new Set<Addons>(OBSERVABILITY_ADDONS),
  ];

  for (const addon of addons) {
    const group = exclusiveGroups.find((values) => values.has(addon));
    if (group) {
      const existingIndex = resolved.findIndex((value) => group.has(value));
      if (existingIndex !== -1) resolved.splice(existingIndex, 1);
    }

    if (!resolved.includes(addon)) {
      resolved.push(addon);
    }
  }

  return resolved;
}

export function sanitizeAddons(addons: readonly string[] | null | undefined) {
  const sanitized = sanitizeMultiSelection(addons, validAddonIds, DEFAULT_STACK.addons);
  return resolveAddonConflicts(sanitized);
}

export function sanitizeExamples(examples: readonly string[] | null | undefined) {
  return sanitizeMultiSelection(examples, validExampleIds, DEFAULT_STACK.examples);
}

export function sanitizeWebFrontends(webFrontend: readonly string[] | null | undefined) {
  return sanitizeSingleSelection(webFrontend, validWebFrontendIds, DEFAULT_STACK.webFrontend);
}

export function sanitizeNativeFrontends(nativeFrontend: readonly string[] | null | undefined) {
  return sanitizeSingleSelection(
    nativeFrontend,
    validNativeFrontendIds,
    DEFAULT_STACK.nativeFrontend,
  );
}

export type RawStackLists = Omit<
  StackState,
  "webFrontend" | "nativeFrontend" | "addons" | "examples"
> & {
  webFrontend: string[];
  nativeFrontend: string[];
  addons: string[];
  examples: string[];
};

export function sanitizeStackState(stack: RawStackLists): StackState {
  return {
    ...stack,
    webFrontend: sanitizeWebFrontends(stack.webFrontend),
    nativeFrontend: sanitizeNativeFrontends(stack.nativeFrontend),
    addons: sanitizeAddons(stack.addons),
    examples: sanitizeExamples(stack.examples),
  };
}

export function sanitizeStackAddons(stack: StackState): StackState {
  return sanitizeStackState(stack);
}
