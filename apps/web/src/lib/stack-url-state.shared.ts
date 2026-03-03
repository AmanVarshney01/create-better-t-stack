import { DEFAULT_STACK, type StackState } from "@/lib/stack-defaults";
import { stackUrlKeys } from "@/lib/stack-url-keys";

type QueryValue = string | string[] | null | undefined;
type UrlRecord = Record<string, QueryValue>;

export const stackStateKeys = Object.keys(stackUrlKeys) as Array<keyof StackState>;

const stackArrayKeySet = new Set<keyof StackState>(
  stackStateKeys.filter((key) => Array.isArray(DEFAULT_STACK[key])),
);

export function isArrayStackKey(key: keyof StackState): boolean {
  return stackArrayKeySet.has(key);
}

function cloneDefaultStack(): StackState {
  const cloned: Partial<StackState> = {};

  for (const key of stackStateKeys) {
    const defaultValue = DEFAULT_STACK[key];
    (cloned as Record<string, unknown>)[key] = Array.isArray(defaultValue)
      ? [...defaultValue]
      : defaultValue;
  }

  return cloned as StackState;
}

function parseArrayValue(value: QueryValue, defaultValue: string[]): string[] {
  if (typeof value === "string") {
    return value.split(",").filter(Boolean);
  }

  if (Array.isArray(value)) {
    return value
      .flatMap((item) => (typeof item === "string" ? item.split(",") : []))
      .filter(Boolean);
  }

  return [...defaultValue];
}

function parseScalarValue(value: QueryValue, defaultValue: string): string {
  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value)) {
    const firstString = value.find((item): item is string => typeof item === "string");
    if (firstString) return firstString;
  }

  return defaultValue;
}

export function parseStackFromUrlRecord(params: UrlRecord): StackState {
  const parsed = cloneDefaultStack() as Record<string, unknown>;

  for (const stackKey of stackStateKeys) {
    const urlKey = stackUrlKeys[stackKey];
    const rawValue = params[urlKey];
    const defaultValue = DEFAULT_STACK[stackKey];

    if (isArrayStackKey(stackKey)) {
      parsed[stackKey] = parseArrayValue(rawValue, defaultValue as string[]);
      continue;
    }

    parsed[stackKey] = parseScalarValue(rawValue, String(defaultValue ?? ""));
  }

  return parsed as StackState;
}

export function parseStackFromSearch(search: Record<string, unknown> | undefined): StackState {
  if (!search) return cloneDefaultStack();

  const normalized: UrlRecord = {};

  for (const [key, value] of Object.entries(search)) {
    if (typeof value === "string" || Array.isArray(value)) {
      normalized[key] = value as QueryValue;
      continue;
    }

    if (typeof value === "number" || typeof value === "boolean") {
      normalized[key] = String(value);
    }
  }

  return parseStackFromUrlRecord(normalized);
}

export function createStackSearchParams(
  stack: StackState,
  options?: { includeDefaults?: boolean },
): URLSearchParams {
  const includeDefaults = options?.includeDefaults ?? false;
  const params = new URLSearchParams();

  for (const stackKey of stackStateKeys) {
    const urlKey = stackUrlKeys[stackKey];
    const value = stack[stackKey];
    const defaultValue = DEFAULT_STACK[stackKey];

    if (Array.isArray(value)) {
      const serialized = value.join(",");
      const defaultSerialized = Array.isArray(defaultValue) ? defaultValue.join(",") : "";
      if (includeDefaults || serialized !== defaultSerialized) {
        params.set(urlKey, serialized);
      }
      continue;
    }

    if (value == null) {
      if (includeDefaults && typeof defaultValue === "string") {
        params.set(urlKey, defaultValue);
      }
      continue;
    }

    const serialized = value;
    const defaultSerialized = typeof defaultValue === "string" ? defaultValue : "";
    if (includeDefaults || serialized !== defaultSerialized) {
      params.set(urlKey, serialized);
    }
  }

  return params;
}
