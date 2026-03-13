import { DEFAULT_STACK, type StackState, TECH_OPTIONS } from "./constant";

const validWebFrontendIds = new Set(TECH_OPTIONS.webFrontend.map((option) => option.id));
const validNativeFrontendIds = new Set(TECH_OPTIONS.nativeFrontend.map((option) => option.id));
const validAddonIds = new Set(["none", ...TECH_OPTIONS.addons.map((option) => option.id)]);
const validExampleIds = new Set(["none", ...TECH_OPTIONS.examples.map((option) => option.id)]);

function sanitizeSingleSelection(
  values: readonly string[] | null | undefined,
  validIds: ReadonlySet<string>,
  defaultValue: readonly string[],
): string[] {
  if (values == null) {
    return [...defaultValue];
  }

  const selectedValue = values.filter((value) => validIds.has(value) && value !== "none").at(-1);
  return selectedValue ? [selectedValue] : ["none"];
}

function sanitizeMultiSelection(
  values: readonly string[] | null | undefined,
  validIds: ReadonlySet<string>,
  defaultValue: readonly string[],
): string[] {
  if (values == null) {
    return [...defaultValue];
  }

  const sanitized = values.filter((value) => validIds.has(value));
  const normalized =
    sanitized.length > 1 ? sanitized.filter((value) => value !== "none") : sanitized;
  const unique = [...new Set(normalized)];

  return unique.length > 0 ? unique : ["none"];
}

function resolveMonorepoAddonConflicts(addons: readonly string[]): string[] {
  const resolved: string[] = [];

  for (const addon of addons) {
    if (addon === "nx" || addon === "turborepo") {
      const existingMonorepoIndex = resolved.findIndex(
        (value) => value === "nx" || value === "turborepo",
      );

      if (existingMonorepoIndex !== -1) {
        resolved.splice(existingMonorepoIndex, 1);
      }
    }

    if (!resolved.includes(addon)) {
      resolved.push(addon);
    }
  }

  return resolved;
}

export function sanitizeAddons(addons: readonly string[] | null | undefined): string[] {
  const sanitized = sanitizeMultiSelection(addons, validAddonIds, DEFAULT_STACK.addons);
  return resolveMonorepoAddonConflicts(sanitized);
}

export function sanitizeExamples(examples: readonly string[] | null | undefined): string[] {
  return sanitizeMultiSelection(examples, validExampleIds, DEFAULT_STACK.examples);
}

export function sanitizeWebFrontends(webFrontend: readonly string[] | null | undefined): string[] {
  return sanitizeSingleSelection(webFrontend, validWebFrontendIds, DEFAULT_STACK.webFrontend);
}

export function sanitizeNativeFrontends(
  nativeFrontend: readonly string[] | null | undefined,
): string[] {
  return sanitizeSingleSelection(
    nativeFrontend,
    validNativeFrontendIds,
    DEFAULT_STACK.nativeFrontend,
  );
}

export function sanitizeStackState(stack: StackState): StackState {
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
