import { DEFAULT_STACK, type StackState, TECH_OPTIONS } from "./constant";

const validAddonIds = new Set(TECH_OPTIONS.addons.map((option) => option.id));

export function sanitizeAddons(addons: readonly string[] | null | undefined): string[] {
  const sanitized = [
    ...new Set((addons ?? []).filter((addon): addon is string => validAddonIds.has(addon))),
  ];
  const normalized =
    sanitized.length > 1 ? sanitized.filter((addon) => addon !== "none") : sanitized;

  return normalized.length > 0 ? normalized : [...DEFAULT_STACK.addons];
}

export function sanitizeStackAddons(stack: StackState): StackState {
  return {
    ...stack,
    addons: sanitizeAddons(stack.addons),
  };
}
