import type { ProjectConfig } from "@better-fullstack/types";

import type {
  FingerprintValue,
  LedgerRowDoc,
  TemplateFingerprint,
  TemplateFingerprintKey,
} from "./types";
import { TEMPLATE_FINGERPRINT_KEYS } from "./types";

const ARRAY_OPTION_KEYS = new Set([
  "frontend",
  "addons",
  "examples",
  "rustLibraries",
  "pythonAi",
  "aiDocs",
] as const);

const FLAG_PLACEHOLDER_PATTERN = /<|\.{3}/;

function kebabToCamel(flag: string): string {
  return flag.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase());
}

export function normalizeArrayValue(values: readonly string[]): readonly string[] {
  const filtered = values.filter(Boolean).filter((value) => value !== "none");
  if (filtered.length === 0) return ["none"];
  return Array.from(new Set(filtered)).sort();
}

function tokenToStringArray(value: unknown): readonly string[] {
  if (Array.isArray(value)) {
    return normalizeArrayValue(
      value.flatMap((entry) => (typeof entry === "string" ? [entry] : [])),
    );
  }

  if (typeof value === "string") {
    return normalizeArrayValue([value]);
  }

  return ["none"];
}

function normalizeFingerprintValue(
  key: TemplateFingerprintKey,
  value: unknown,
): FingerprintValue | undefined {
  if (ARRAY_OPTION_KEYS.has(key as never)) {
    return tokenToStringArray(value);
  }

  if (typeof value === "string" && value.length > 0) {
    return value;
  }

  return undefined;
}

export function fingerprintToKey(fingerprint: TemplateFingerprint): string {
  return TEMPLATE_FINGERPRINT_KEYS.flatMap((key) => {
    const value = fingerprint[key];
    if (!value) return [];
    return [`${key}=${Array.isArray(value) ? value.join("+") : value}`];
  }).join("|");
}

function parseTemplateDefaults(commandTemplate: string | undefined): TemplateFingerprint {
  if (!commandTemplate) return {};

  const tokens = commandTemplate.split(/\s+/).filter(Boolean);
  const parsed: TemplateFingerprint = {};

  for (let index = 0; index < tokens.length; index++) {
    const token = tokens[index];
    if (!token.startsWith("--")) continue;
    if (token.startsWith("--no-")) continue;

    const rawFlag = token.slice(2);
    const next = tokens[index + 1];
    if (!next || next.startsWith("--") || FLAG_PLACEHOLDER_PATTERN.test(next)) {
      continue;
    }

    const key = kebabToCamel(rawFlag) as TemplateFingerprintKey;
    if (!TEMPLATE_FINGERPRINT_KEYS.includes(key)) {
      continue;
    }

    const normalized = normalizeFingerprintValue(key, next);
    if (normalized) {
      parsed[key] = normalized;
    }
  }

  return parsed;
}

export function parseRowFingerprint(
  document: LedgerRowDoc,
  row: unknown,
): TemplateFingerprint | undefined {
  if (!Array.isArray(row) || row.length < 3 || !document.schema?.flagsOrder) {
    return undefined;
  }

  const ecosystemCode = row[1];
  const flagValues = row[2];

  if (typeof ecosystemCode !== "string" || !Array.isArray(flagValues)) {
    return undefined;
  }

  const order = document.schema.flagsOrder[ecosystemCode];
  if (!order) return undefined;

  const fingerprint: TemplateFingerprint = {
    ...parseTemplateDefaults(document.cb),
  };

  for (let index = 0; index < order.length; index++) {
    const orderedKey = order[index];
    const rawValue = flagValues[index];
    const isArrayKey = orderedKey.endsWith("[]");
    const key = (isArrayKey ? orderedKey.slice(0, -2) : orderedKey) as TemplateFingerprintKey;

    if (!TEMPLATE_FINGERPRINT_KEYS.includes(key)) {
      continue;
    }

    if (key === "frontend" && typeof rawValue === "string" && rawValue.startsWith("astro+")) {
      const [frontend, astroIntegration] = rawValue.split("+", 2);
      fingerprint.frontend = normalizeArrayValue([frontend]);
      if (astroIntegration) {
        fingerprint.astroIntegration = astroIntegration;
      }
      continue;
    }

    const normalized = normalizeFingerprintValue(key, isArrayKey ? rawValue : String(rawValue));
    if (normalized) {
      fingerprint[key] = normalized;
    }
  }

  return fingerprint;
}

export function buildHistoryFingerprint(config: ProjectConfig): TemplateFingerprint {
  const fingerprint: TemplateFingerprint = {};

  for (const key of TEMPLATE_FINGERPRINT_KEYS) {
    const rawValue = config[key];
    if (rawValue === undefined) continue;

    if (Array.isArray(rawValue)) {
      fingerprint[key] = normalizeArrayValue(rawValue);
      continue;
    }

    fingerprint[key] = String(rawValue);
  }

  return fingerprint;
}
