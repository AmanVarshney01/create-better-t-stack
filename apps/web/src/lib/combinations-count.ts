import {
  ADDONS_VALUES,
  AI_DOCS_VALUES,
  AI_VALUES,
  ANALYTICS_VALUES,
  ANIMATION_VALUES,
  API_VALUES,
  ASTRO_INTEGRATION_VALUES,
  AUTH_VALUES,
  BACKEND_VALUES,
  CACHING_VALUES,
  CMS_VALUES,
  CSS_FRAMEWORK_VALUES,
  DATABASE_SETUP_VALUES,
  DATABASE_VALUES,
  EFFECT_VALUES,
  EMAIL_VALUES,
  EXAMPLES_VALUES,
  FEATURE_FLAGS_VALUES,
  FILE_STORAGE_VALUES,
  FILE_UPLOAD_VALUES,
  FORMS_VALUES,
  FRONTEND_VALUES,
  GO_API_VALUES,
  GO_CLI_VALUES,
  GO_LOGGING_VALUES,
  GO_ORM_VALUES,
  GO_WEB_FRAMEWORK_VALUES,
  JOB_QUEUE_VALUES,
  LOGGING_VALUES,
  OBSERVABILITY_VALUES,
  ORM_VALUES,
  PACKAGE_MANAGER_VALUES,
  PAYMENTS_VALUES,
  PYTHON_AI_VALUES,
  PYTHON_ORM_VALUES,
  PYTHON_QUALITY_VALUES,
  PYTHON_TASK_QUEUE_VALUES,
  PYTHON_VALIDATION_VALUES,
  PYTHON_WEB_FRAMEWORK_VALUES,
  REALTIME_VALUES,
  RUNTIME_VALUES,
  RUST_API_VALUES,
  RUST_CLI_VALUES,
  RUST_FRONTEND_VALUES,
  RUST_LIBRARIES_VALUES,
  RUST_ORM_VALUES,
  RUST_WEB_FRAMEWORK_VALUES,
  SEARCH_VALUES,
  SERVER_DEPLOY_VALUES,
  STATE_MANAGEMENT_VALUES,
  TESTING_VALUES,
  UI_LIBRARY_VALUES,
  VALIDATION_VALUES,
  WEB_DEPLOY_VALUES,
} from "@better-fullstack/types";

export type ScientificNotation = {
  mantissa: string;
  exponent: number;
};

const MILLISECONDS_PER_YEAR = 1000 * 60 * 60 * 24 * 365.25;
const OBSERVABLE_UNIVERSE_SAND_GRAINS = 7.5e24;
const UNIVERSE_AGE_YEARS = 13.8e9;

function powerSetSize(values: readonly string[]): bigint {
  const nonNoneCount = values.filter((value) => value !== "none").length;
  return 2n ** BigInt(nonNoneCount);
}

function multiplyCounts(counts: readonly number[]): bigint {
  return counts.reduce((acc, count) => acc * BigInt(count), 1n);
}

function formatScientificFromBigInt(value: bigint, precision = 3): ScientificNotation {
  const str = value.toString();
  const exponent = str.length - 1;
  const digits = str.slice(0, precision).padEnd(precision, "0");
  const mantissa =
    digits.length <= 1
      ? digits
      : `${digits[0]}.${digits.slice(1).replace(/0+$/, "") || "0"}`.replace(/\.0$/, "");
  return { mantissa, exponent };
}

function formatScientificFromNumber(value: number, precision = 3): ScientificNotation {
  if (!Number.isFinite(value) || value <= 0) {
    return { mantissa: "0", exponent: 0 };
  }
  const [mantissaStr, exponentStr] = value.toExponential(precision - 1).split("e");
  return { mantissa: mantissaStr.replace(/\.0+$/, ""), exponent: Number.parseInt(exponentStr, 10) };
}

const typescriptSingleSelectCounts = [
  DATABASE_VALUES.length,
  ORM_VALUES.length,
  BACKEND_VALUES.length,
  RUNTIME_VALUES.length,
  ASTRO_INTEGRATION_VALUES.length,
  PACKAGE_MANAGER_VALUES.length,
  DATABASE_SETUP_VALUES.length,
  API_VALUES.length,
  AUTH_VALUES.length,
  PAYMENTS_VALUES.length,
  WEB_DEPLOY_VALUES.length,
  SERVER_DEPLOY_VALUES.length,
  AI_VALUES.length,
  EFFECT_VALUES.length,
  STATE_MANAGEMENT_VALUES.length,
  FORMS_VALUES.length,
  TESTING_VALUES.length,
  EMAIL_VALUES.length,
  CSS_FRAMEWORK_VALUES.length,
  UI_LIBRARY_VALUES.length,
  VALIDATION_VALUES.length,
  REALTIME_VALUES.length,
  JOB_QUEUE_VALUES.length,
  CMS_VALUES.length,
  CACHING_VALUES.length,
  ANIMATION_VALUES.length,
  FILE_UPLOAD_VALUES.length,
  LOGGING_VALUES.length,
  OBSERVABILITY_VALUES.length,
  FEATURE_FLAGS_VALUES.length,
  ANALYTICS_VALUES.length,
  SEARCH_VALUES.length,
  FILE_STORAGE_VALUES.length,
  2, // git
  2, // install
] as const;

const rustSingleSelectCounts = [
  RUST_WEB_FRAMEWORK_VALUES.length,
  RUST_FRONTEND_VALUES.length,
  RUST_ORM_VALUES.length,
  RUST_API_VALUES.length,
  RUST_CLI_VALUES.length,
  PACKAGE_MANAGER_VALUES.length,
  2, // git
  2, // install
] as const;

const pythonSingleSelectCounts = [
  PYTHON_WEB_FRAMEWORK_VALUES.length,
  PYTHON_ORM_VALUES.length,
  PYTHON_VALIDATION_VALUES.length,
  PYTHON_AI_VALUES.length,
  PYTHON_TASK_QUEUE_VALUES.length,
  PYTHON_QUALITY_VALUES.length,
  PACKAGE_MANAGER_VALUES.length,
  2, // git
  2, // install
] as const;

const goSingleSelectCounts = [
  GO_WEB_FRAMEWORK_VALUES.length,
  GO_ORM_VALUES.length,
  GO_API_VALUES.length,
  GO_CLI_VALUES.length,
  GO_LOGGING_VALUES.length,
  PACKAGE_MANAGER_VALUES.length,
  2, // git
  2, // install
] as const;

const typescriptCombinations =
  multiplyCounts(typescriptSingleSelectCounts) *
  powerSetSize(FRONTEND_VALUES) *
  powerSetSize(ADDONS_VALUES) *
  powerSetSize(EXAMPLES_VALUES) *
  powerSetSize(AI_DOCS_VALUES);

const rustCombinations =
  multiplyCounts(rustSingleSelectCounts) * powerSetSize(RUST_LIBRARIES_VALUES) * powerSetSize(AI_DOCS_VALUES);

const pythonCombinations = multiplyCounts(pythonSingleSelectCounts) * powerSetSize(AI_DOCS_VALUES);

const goCombinations = multiplyCounts(goSingleSelectCounts) * powerSetSize(AI_DOCS_VALUES);

const totalCombinations = typescriptCombinations + rustCombinations + pythonCombinations + goCombinations;
const yoloCombinations = totalCombinations * 2n;

const yearsAtOneMillisecondPerCombination = Number(totalCombinations) / MILLISECONDS_PER_YEAR;
const universeLifetimesAtOneMillisecondPerCombination =
  yearsAtOneMillisecondPerCombination / UNIVERSE_AGE_YEARS;
const ratioToUniverseSand = Number(totalCombinations) / OBSERVABLE_UNIVERSE_SAND_GRAINS;

export const combinationsMetrics = {
  totalCombinations,
  yoloCombinations,
  totalScientific: formatScientificFromBigInt(totalCombinations),
  yearsAtOneMillisecondScientific: formatScientificFromNumber(
    yearsAtOneMillisecondPerCombination,
  ),
  universeLifetimesScientific: formatScientificFromNumber(
    universeLifetimesAtOneMillisecondPerCombination,
  ),
  universeSandRatioScientific: formatScientificFromNumber(ratioToUniverseSand),
};

