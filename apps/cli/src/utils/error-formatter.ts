import consola from "consola";
import pc from "picocolors";

import { isSilent } from "./context";
import { CLIError } from "./errors";

type ErrorCategory =
  | "incompatibility" // Two options don't work together
  | "invalid-selection" // Invalid value or multiple selections
  | "missing-requirement" // A dependency is required
  | "constraint"; // Backend/runtime/database constraints

interface StructuredError {
  category: ErrorCategory;
  message: string;
  provided?: Record<string, string | string[]>;
  suggestions: string[];
}

function getCategoryTitle(category: ErrorCategory): string {
  const titles: Record<ErrorCategory, string> = {
    incompatibility: "Incompatible Options",
    "invalid-selection": "Invalid Selection",
    "missing-requirement": "Missing Requirement",
    constraint: "Constraint Violation",
  };
  return titles[category];
}

export function displayStructuredError(error: StructuredError): never {
  // For programmatic API, throw plain CLIError
  if (isSilent()) {
    throw new CLIError(error.message);
  }

  const lines: string[] = [];

  lines.push(pc.bold(pc.red(getCategoryTitle(error.category))));
  lines.push("");
  lines.push(error.message);

  if (error.provided && Object.keys(error.provided).length > 0) {
    lines.push("");
    lines.push(pc.dim("You provided:"));
    for (const [key, value] of Object.entries(error.provided)) {
      const displayValue = Array.isArray(value) ? value.join(", ") : value;
      lines.push(`  ${pc.cyan("--" + key)} ${displayValue}`);
    }
  }

  if (error.suggestions.length > 0) {
    lines.push("");
    lines.push(pc.dim("Suggestions:"));
    for (const suggestion of error.suggestions) {
      lines.push(`  ${pc.green("•")} ${suggestion}`);
    }
  }

  consola.box({
    title: pc.red("Error"),
    message: lines.join("\n"),
    style: { borderColor: "red" },
  });

  process.exit(1);
}

// Helper for incompatibility errors
export function incompatibilityError(opts: {
  message: string;
  provided: Record<string, string | string[]>;
  suggestions: string[];
}): never {
  return displayStructuredError({
    category: "incompatibility",
    ...opts,
  });
}

// Helper for invalid selection errors
export function invalidSelectionError(opts: {
  message: string;
  provided: Record<string, string | string[]>;
  suggestions: string[];
}): never {
  return displayStructuredError({
    category: "invalid-selection",
    ...opts,
  });
}

// Helper for missing requirement errors
export function missingRequirementError(opts: {
  message: string;
  provided: Record<string, string | string[]>;
  suggestions: string[];
}): never {
  return displayStructuredError({
    category: "missing-requirement",
    ...opts,
  });
}

// Helper for constraint errors
export function constraintError(opts: {
  message: string;
  provided: Record<string, string | string[]>;
  suggestions: string[];
}): never {
  return displayStructuredError({
    category: "constraint",
    ...opts,
  });
}
