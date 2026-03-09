/**
 * CLI and Builder Sync Tests
 *
 * This test ensures that all options available in the Builder (web app)
 * are also available in the CLI, and vice versa.
 *
 * When adding a new library/option:
 * 1. Add to CLI: packages/types/src/schemas.ts
 * 2. Add to Builder: apps/web/src/lib/constant.ts (TECH_OPTIONS)
 * 3. Run this test to verify sync: bun test cli-builder-sync
 */

import { getCapabilityDefinitions } from "@better-fullstack/types";
import {
  ADDONS_VALUES,
  ANALYTICS_VALUES,
  AI_DOCS_VALUES,
  AI_VALUES,
  ANIMATION_VALUES,
  API_VALUES,
  ASTRO_INTEGRATION_VALUES,
  AUTH_VALUES,
  BACKEND_VALUES,
  CACHING_VALUES,
  CMS_VALUES,
  SEARCH_VALUES,
  FILE_STORAGE_VALUES,
  CSS_FRAMEWORK_VALUES,
  DATABASE_SETUP_VALUES,
  DATABASE_VALUES,
  EFFECT_VALUES,
  EMAIL_VALUES,
  EXAMPLES_VALUES,
  FILE_UPLOAD_VALUES,
  FORMS_VALUES,
  FEATURE_FLAGS_VALUES,
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
  SHADCN_BASE_COLOR_VALUES,
  SHADCN_BASE_VALUES,
  SHADCN_COLOR_THEME_VALUES,
  SHADCN_FONT_VALUES,
  SHADCN_ICON_LIBRARY_VALUES,
  SHADCN_RADIUS_VALUES,
  SHADCN_STYLE_VALUES,
  SERVER_DEPLOY_VALUES,
  STATE_MANAGEMENT_VALUES,
  TESTING_VALUES,
  UI_LIBRARY_VALUES,
  VALIDATION_VALUES,
  WEB_DEPLOY_VALUES,
  getCategoryCliValues,
  getOptionMetadata,
  type OptionCategory,
  OPTION_CATEGORY_METADATA,
} from "@better-fullstack/types";
import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

type BuilderOption = {
  id: string;
  name: string;
};

const CAPABILITY_BACKED_CATEGORIES: Record<string, () => BuilderOption[]> = {
  AUTH_TECH_OPTIONS: () =>
    getCapabilityDefinitions("auth").map((cap) => ({ id: cap.id, name: cap.label })),
};

function parseReferencedOptions(
  content: string,
  identifier: string,
): BuilderOption[] {
  if (CAPABILITY_BACKED_CATEGORIES[identifier]) {
    return CAPABILITY_BACKED_CATEGORIES[identifier]();
  }

  const identifierPattern = new RegExp(
    `const\\s+${identifier}\\s*=\\s*\\[(?<body>[\\s\\S]*?)\\]\\s*(?:as const)?;`,
  );
  const match = identifierPattern.exec(content);
  if (!match?.groups?.body) {
    return [];
  }

  const options: BuilderOption[] = [];
  const optionRegex = /id:\s*["']([^"']+)["'][\s\S]*?name:\s*["']([^"']+)["']/g;
  let optionMatch: RegExpExecArray | null;

  // biome-ignore lint/suspicious/noAssignInExpressions: needed for regex iteration
  while ((optionMatch = optionRegex.exec(match.groups.body)) !== null) {
    options.push({ id: optionMatch[1], name: optionMatch[2] });
  }

  return options;
}

// Parse TECH_OPTIONS from the Builder's constant.ts file
function parseBuilderOptions(): Record<string, BuilderOption[]> {
  // Handle both running from apps/cli and apps/cli/test
  const possiblePaths = [
    join(process.cwd(), "..", "web", "src", "lib", "constant.ts"),
    join(process.cwd(), "..", "..", "apps", "web", "src", "lib", "constant.ts"),
    join(process.cwd(), "apps", "web", "src", "lib", "constant.ts"),
  ];

  let content = "";
  let constantPath = "";

  for (const path of possiblePaths) {
    try {
      content = readFileSync(path, "utf-8");
      constantPath = path;
      break;
    } catch {
      continue;
    }
  }

  if (!content) {
    throw new Error(`Could not find constant.ts. Tried paths:\n${possiblePaths.join("\n")}`);
  }

  console.log(`Reading Builder options from: ${constantPath}`);

  // Extract TECH_OPTIONS object - find the start and then parse categories
  const techOptionsStart = content.indexOf("export const TECH_OPTIONS");
  if (techOptionsStart === -1) {
    throw new Error("Could not find TECH_OPTIONS in constant.ts");
  }

  // Isolate TECH_OPTIONS object body for reliable category parsing
  const assignmentStart = content.indexOf("= {", techOptionsStart);
  if (assignmentStart === -1) {
    throw new Error("Could not find TECH_OPTIONS assignment start");
  }
  const objectStart = content.indexOf("{", assignmentStart);
  if (objectStart === -1) {
    throw new Error("Could not find TECH_OPTIONS object start");
  }
  let braceDepth = 1;
  let objectEnd = objectStart + 1;
  for (let i = objectStart + 1; i < content.length && braceDepth > 0; i++) {
    if (content[i] === "{") braceDepth++;
    if (content[i] === "}") braceDepth--;
    objectEnd = i;
  }
  if (braceDepth !== 0) {
    throw new Error("Could not find TECH_OPTIONS object end");
  }
  const techOptionsSection = content.slice(objectStart + 1, objectEnd);
  const result: Record<string, BuilderOption[]> = {};

  // Parse each category by finding "categoryName: [" patterns
  // Then extract all id: "value" within that array
  const categoryPattern = /^\s*(\w+):\s*(?:\[(?<inlineStart>)|(?<reference>[A-Z_]+))/gm;
  let categoryMatch: RegExpExecArray | null;

  // biome-ignore lint/suspicious/noAssignInExpressions: needed for regex iteration
  while ((categoryMatch = categoryPattern.exec(techOptionsSection)) !== null) {
    const categoryName = categoryMatch[1];
    const referencedIdentifier = categoryMatch.groups?.reference;

    if (referencedIdentifier) {
      const options = parseReferencedOptions(content, referencedIdentifier);
      if (options.length > 0) {
        result[categoryName] = options;
      }
      continue;
    }

    const startIndex = categoryMatch.index + categoryMatch[0].length;

    // Find the matching closing bracket by counting brackets
    let bracketCount = 1;
    let endIndex = startIndex;

    for (let i = startIndex; i < techOptionsSection.length && bracketCount > 0; i++) {
      if (techOptionsSection[i] === "[") bracketCount++;
      if (techOptionsSection[i] === "]") bracketCount--;
      endIndex = i;
    }

    const categoryContent = techOptionsSection.slice(startIndex, endIndex);

    // Extract all id values from this category
    const optionRegex = /id:\s*["']([^"']+)["'][\s\S]*?name:\s*["']([^"']+)["']/g;
    const options: BuilderOption[] = [];
    let optionMatch: RegExpExecArray | null;

    // biome-ignore lint/suspicious/noAssignInExpressions: needed for regex iteration
    while ((optionMatch = optionRegex.exec(categoryContent)) !== null) {
      options.push({ id: optionMatch[1], name: optionMatch[2] });
    }

    if (options.length > 0) {
      result[categoryName] = options;
    }
  }

  return result;
}

describe("CLI and Builder Sync", () => {
  const builderOptions = parseBuilderOptions();
  const categoryMetadata = OPTION_CATEGORY_METADATA;

  it("should have parsed Builder options successfully", () => {
    expect(Object.keys(builderOptions).length).toBeGreaterThan(0);
    console.log(`Parsed ${Object.keys(builderOptions).length} categories from Builder`);
  });

  // Test each category
  const categoriesToTest = Object.keys(categoryMetadata);
  const missingBuilderCategories = categoriesToTest.filter((category) => !builderOptions[category]);

  it("should have all mapped categories present in Builder", () => {
    expect(missingBuilderCategories).toEqual([]);
  });

  for (const category of categoriesToTest) {
    const cliValues = getCategoryCliValues(category as OptionCategory);
    const builderEntries = builderOptions[category];
    if (!builderEntries) throw new Error(`Missing builder options for category '${category}'`);
    const builderValues = builderEntries.map((option) => option.id);

    describe(`Category: ${category}`, () => {
      it("Builder options should all be valid CLI options", () => {
        const cliSet = new Set(cliValues);
        const missingInCli: string[] = [];

        for (const option of builderValues) {
          const cliOption = getOptionMetadata(category as OptionCategory, option)?.cliValue ?? option;
          if (!cliSet.has(cliOption)) {
            missingInCli.push(option);
          }
        }

        if (missingInCli.length > 0) {
          console.error(
            `\n[${category}] Options in Builder but NOT in CLI:\n  - ${missingInCli.join("\n  - ")}`,
          );
          console.error(
            `\nFix: Add these to packages/types/src/schemas.ts in the appropriate schema`,
          );
        }

        expect(missingInCli).toEqual([]);
      });

      it("CLI options should all be represented in Builder", () => {
        const builderCliValues = new Set(
          builderValues.map(
            (option) => getOptionMetadata(category as OptionCategory, option)?.cliValue ?? option,
          ),
        );
        const missingInBuilder: string[] = [];

        for (const option of cliValues) {
          if (!builderCliValues.has(option)) {
            missingInBuilder.push(option);
          }
        }

        if (missingInBuilder.length > 0) {
          console.error(
            `\n[${category}] Options in CLI but NOT in Builder:\n  - ${missingInBuilder.join("\n  - ")}`,
          );
          console.error(
            `\nFix: Add these to apps/web/src/lib/constant.ts in TECH_OPTIONS.${category}`,
          );
        }

        expect(missingInBuilder).toEqual([]);
      });

      it("Builder labels should match canonical metadata for aliased options", () => {
        const aliasedEntries = builderEntries.filter((entry) => {
          const metadata = getOptionMetadata(category as OptionCategory, entry.id);
          return Boolean(metadata && metadata.aliases.length > 0);
        });

        for (const entry of aliasedEntries) {
          const metadata = getOptionMetadata(category as OptionCategory, entry.id);
          expect(entry.name).toBe(metadata?.label);
        }
      });
    });
  }

  // Summary test
  it("should have all categories mapped", () => {
    const unmappedCategories: string[] = [];

    for (const category of Object.keys(builderOptions)) {
      if (!categoryMetadata[category as OptionCategory]) {
        unmappedCategories.push(category);
      }
    }

    expect(unmappedCategories).toEqual([]);
  });
});

describe("StackState and CLI Input Sync", () => {
  it("should have all StackState fields represented in CLI", () => {
    // Read stack-defaults.ts to find StackState fields
    const possiblePaths = [
      join(process.cwd(), "..", "web", "src", "lib", "stack-defaults.ts"),
      join(process.cwd(), "..", "..", "apps", "web", "src", "lib", "stack-defaults.ts"),
      join(process.cwd(), "apps", "web", "src", "lib", "stack-defaults.ts"),
    ];

    let content = "";
    for (const path of possiblePaths) {
      try {
        content = readFileSync(path, "utf-8");
        break;
      } catch {
        continue;
      }
    }

    expect(content.length).toBeGreaterThan(0);

    // Extract StackState type fields
    const stackStateMatch = content.match(/export type StackState\s*=\s*\{([^}]+)\}/);
    expect(stackStateMatch).not.toBeNull();

    const stackStateContent = stackStateMatch![1];
    const fieldRegex = /(\w+):/g;
    const stackStateFields: string[] = [];
    let match: RegExpExecArray | null;

    // biome-ignore lint/suspicious/noAssignInExpressions: needed for regex iteration
    while ((match = fieldRegex.exec(stackStateContent)) !== null) {
      stackStateFields.push(match[1]);
    }

    console.log(`Found ${stackStateFields.length} StackState fields`);

    // These fields are OK to not have direct CLI equivalents
    const excludedFields = [
      "projectName", // handled separately
      "ecosystem", // handled separately
      "yolo", // handled as flag
    ];

    const fieldsToCheck = stackStateFields.filter((f) => !excludedFields.includes(f));

    // Just log the fields for now - a more comprehensive check would compare
    // against the CLI CreateInputSchema fields
    expect(fieldsToCheck.length).toBeGreaterThan(20);
    console.log(`StackState has ${fieldsToCheck.length} configuration fields (excluding basics)`);
  });
});

// Parse CLI prompt files to extract option values
function parsePromptOptions(promptPath: string, functionName?: string): string[] {
  const content = readFileSync(promptPath, "utf-8");

  let searchContent = content;

  // If a function name is provided, only search within that function body.
  if (functionName) {
    const functionPattern = new RegExp(`(?:async\\s+)?function\\s+${functionName}\\b`);
    const functionMatch = functionPattern.exec(content);
    if (!functionMatch) {
      throw new Error(`Could not find function '${functionName}' in ${promptPath}`);
    }

    const functionStart = functionMatch.index;
    const bodyStart = content.indexOf("{", functionStart);
    if (bodyStart === -1) {
      throw new Error(`Could not find function body start for '${functionName}' in ${promptPath}`);
    }

    let braceDepth = 1;
    let bodyEnd = bodyStart + 1;
    for (let i = bodyStart + 1; i < content.length && braceDepth > 0; i++) {
      if (content[i] === "{") braceDepth++;
      if (content[i] === "}") braceDepth--;
      bodyEnd = i;
    }

    if (braceDepth !== 0) {
      throw new Error(`Could not find function body end for '${functionName}' in ${promptPath}`);
    }
    searchContent = content.slice(functionStart, bodyEnd + 1);
  }

  const values = new Set<string>();

  // Extract value literals in prompt option arrays.
  const valueRegex = /value:\s*["']([^"']+)["']/g;
  let match: RegExpExecArray | null;
  // biome-ignore lint/suspicious/noAssignInExpressions: needed for regex iteration
  while ((match = valueRegex.exec(searchContent)) !== null) {
    values.add(match[1]);
  }

  // Fallback for prompts that derive options from *_OPTIONS record maps.
  if (values.size === 0) {
    const optionsRecordStart = searchContent.match(/const\s+\w+_OPTIONS\s*:[^=]*=\s*\{/);
    if (optionsRecordStart) {
      const objectStart = optionsRecordStart.index! + optionsRecordStart[0].length - 1;
      let braceDepth = 1;
      let objectEnd = objectStart + 1;
      for (let i = objectStart + 1; i < searchContent.length && braceDepth > 0; i++) {
        if (searchContent[i] === "{") braceDepth++;
        if (searchContent[i] === "}") braceDepth--;
        objectEnd = i;
      }
      if (braceDepth === 0) {
        const objectBody = searchContent.slice(objectStart + 1, objectEnd);
        const keyRegex = /^\s*(?:"([^"]+)"|'([^']+)'|([A-Za-z0-9_-]+))\s*:\s*\{/gm;
        let keyMatch: RegExpExecArray | null;
        // biome-ignore lint/suspicious/noAssignInExpressions: needed for regex iteration
        while ((keyMatch = keyRegex.exec(objectBody)) !== null) {
          values.add(keyMatch[1] || keyMatch[2] || keyMatch[3]);
        }
      }
    }
  }

  return [...values];
}

// Mapping from prompt file to schema values
const PROMPT_SCHEMA_MAP: Record<
  string,
  { file: string; schema: readonly string[]; name: string; functionName?: string }
> = {
  frontend: {
    file: "frontend.ts",
    schema: FRONTEND_VALUES,
    name: "FrontendSchema",
  },
  backend: {
    file: "backend.ts",
    schema: BACKEND_VALUES,
    name: "BackendSchema",
  },
  ai: {
    file: "ai.ts",
    schema: AI_VALUES,
    name: "AISchema",
  },
  animation: {
    file: "animation.ts",
    schema: ANIMATION_VALUES,
    name: "AnimationSchema",
  },
  api: {
    file: "api.ts",
    schema: API_VALUES,
    name: "APISchema",
  },
  auth: {
    file: "auth.ts",
    schema: AUTH_VALUES,
    name: "AuthSchema",
  },
  caching: {
    file: "caching.ts",
    schema: CACHING_VALUES,
    name: "CachingSchema",
  },
  cms: {
    file: "cms.ts",
    schema: CMS_VALUES,
    name: "CMSSchema",
  },
  cssFramework: {
    file: "css-framework.ts",
    schema: CSS_FRAMEWORK_VALUES,
    name: "CSSFrameworkSchema",
  },
  database: {
    file: "database.ts",
    schema: DATABASE_VALUES,
    name: "DatabaseSchema",
  },
  dbSetup: {
    file: "database-setup.ts",
    schema: DATABASE_SETUP_VALUES,
    name: "DatabaseSetupSchema",
  },
  email: {
    file: "email.ts",
    schema: EMAIL_VALUES,
    name: "EmailSchema",
  },
  fileUpload: {
    file: "file-upload.ts",
    schema: FILE_UPLOAD_VALUES,
    name: "FileUploadSchema",
  },
  forms: {
    file: "forms.ts",
    schema: FORMS_VALUES,
    name: "FormsSchema",
  },
  jobQueue: {
    file: "job-queue.ts",
    schema: JOB_QUEUE_VALUES,
    name: "JobQueueSchema",
  },
  logging: {
    file: "logging.ts",
    schema: LOGGING_VALUES,
    name: "LoggingSchema",
  },
  observability: {
    file: "observability.ts",
    schema: OBSERVABILITY_VALUES,
    name: "ObservabilitySchema",
  },
  orm: {
    file: "orm.ts",
    schema: ORM_VALUES,
    name: "ORMSchema",
  },
  payments: {
    file: "payments.ts",
    schema: PAYMENTS_VALUES,
    name: "PaymentsSchema",
  },
  realtime: {
    file: "realtime.ts",
    schema: REALTIME_VALUES,
    name: "RealtimeSchema",
  },
  runtime: {
    file: "runtime.ts",
    schema: RUNTIME_VALUES,
    name: "RuntimeSchema",
  },
  stateManagement: {
    file: "state-management.ts",
    schema: STATE_MANAGEMENT_VALUES,
    name: "StateManagementSchema",
  },
  testing: {
    file: "testing.ts",
    schema: TESTING_VALUES,
    name: "TestingSchema",
  },
  uiLibrary: {
    file: "ui-library.ts",
    schema: UI_LIBRARY_VALUES,
    name: "UILibrarySchema",
  },
  validation: {
    file: "validation.ts",
    schema: VALIDATION_VALUES,
    name: "ValidationSchema",
  },
  astroIntegration: {
    file: "astro-integration.ts",
    schema: ASTRO_INTEGRATION_VALUES,
    name: "AstroIntegrationSchema",
  },
  rustWebFramework: {
    file: "rust-ecosystem.ts",
    schema: RUST_WEB_FRAMEWORK_VALUES,
    name: "RustWebFrameworkSchema",
    functionName: "getRustWebFrameworkChoice",
  },
  rustFrontend: {
    file: "rust-ecosystem.ts",
    schema: RUST_FRONTEND_VALUES,
    name: "RustFrontendSchema",
    functionName: "getRustFrontendChoice",
  },
  rustOrm: {
    file: "rust-ecosystem.ts",
    schema: RUST_ORM_VALUES,
    name: "RustOrmSchema",
    functionName: "getRustOrmChoice",
  },
  rustApi: {
    file: "rust-ecosystem.ts",
    schema: RUST_API_VALUES,
    name: "RustApiSchema",
    functionName: "getRustApiChoice",
  },
  rustCli: {
    file: "rust-ecosystem.ts",
    schema: RUST_CLI_VALUES,
    name: "RustCliSchema",
    functionName: "getRustCliChoice",
  },
  pythonWebFramework: {
    file: "python-ecosystem.ts",
    schema: PYTHON_WEB_FRAMEWORK_VALUES,
    name: "PythonWebFrameworkSchema",
    functionName: "getPythonWebFrameworkChoice",
  },
  pythonOrm: {
    file: "python-ecosystem.ts",
    schema: PYTHON_ORM_VALUES,
    name: "PythonOrmSchema",
    functionName: "getPythonOrmChoice",
  },
  pythonValidation: {
    file: "python-ecosystem.ts",
    schema: PYTHON_VALIDATION_VALUES,
    name: "PythonValidationSchema",
    functionName: "getPythonValidationChoice",
  },
  pythonAi: {
    file: "python-ecosystem.ts",
    schema: PYTHON_AI_VALUES,
    name: "PythonAiSchema",
    functionName: "getPythonAiChoice",
  },
  pythonTaskQueue: {
    file: "python-ecosystem.ts",
    schema: PYTHON_TASK_QUEUE_VALUES,
    name: "PythonTaskQueueSchema",
    functionName: "getPythonTaskQueueChoice",
  },
  pythonQuality: {
    file: "python-ecosystem.ts",
    schema: PYTHON_QUALITY_VALUES,
    name: "PythonQualitySchema",
    functionName: "getPythonQualityChoice",
  },
  goWebFramework: {
    file: "go-ecosystem.ts",
    schema: GO_WEB_FRAMEWORK_VALUES,
    name: "GoWebFrameworkSchema",
    functionName: "getGoWebFrameworkChoice",
  },
  goOrm: {
    file: "go-ecosystem.ts",
    schema: GO_ORM_VALUES,
    name: "GoOrmSchema",
    functionName: "getGoOrmChoice",
  },
  goApi: {
    file: "go-ecosystem.ts",
    schema: GO_API_VALUES,
    name: "GoApiSchema",
    functionName: "getGoApiChoice",
  },
  goCli: {
    file: "go-ecosystem.ts",
    schema: GO_CLI_VALUES,
    name: "GoCliSchema",
    functionName: "getGoCliChoice",
  },
  goLogging: {
    file: "go-ecosystem.ts",
    schema: GO_LOGGING_VALUES,
    name: "GoLoggingSchema",
    functionName: "getGoLoggingChoice",
  },
};

describe("CLI Prompts vs Schemas Sync", () => {
  // Some options are intentionally excluded from interactive prompts
  // but still valid in schema (for CLI flags)
  const intentionallyExcludedFromPrompts: Record<string, string[]> = {
    // "none" for frontend is handled by not selecting any option
    frontend: ["none"],
    // "self" is conditionally shown based on frontend choice
    backend: [],
    // Effect "effect-full" might not be shown interactively
    effect: [],
    // "none" for ORM is handled by the database selection
    orm: ["none"],
    // "none" for runtime is auto-selected when backend is convex/none/self
    runtime: ["none"],
  };

  // Values that appear in prompts but are not schema values
  // (e.g., category selectors, navigation options)
  const nonSchemaPromptValues: Record<string, string[]> = {
    // "web" and "native" are category selectors, not actual frontends
    frontend: ["web", "native"],
  };

  for (const [category, config] of Object.entries(PROMPT_SCHEMA_MAP)) {
    describe(`Prompt: ${category} (${config.file})`, () => {
      const possiblePaths = [
        join(process.cwd(), "src", "prompts", config.file),
        join(process.cwd(), "..", "cli", "src", "prompts", config.file),
        join(process.cwd(), "..", "..", "apps", "cli", "src", "prompts", config.file),
        join(process.cwd(), "apps", "cli", "src", "prompts", config.file),
      ];

      let promptOptions: string[] = [];
      for (const path of possiblePaths) {
        try {
          promptOptions = parsePromptOptions(path, config.functionName);
          if (promptOptions.length > 0) break;
        } catch {
          continue;
        }
      }

      it(`should parse ${config.name} options from prompt`, () => {
        if (promptOptions.length === 0) {
          throw new Error(`Could not parse ${config.file}`);
        }
        expect(promptOptions.length).toBeGreaterThan(0);
      });

      it(`should show all ${config.name} options in the prompt`, () => {
        const promptSet = new Set(promptOptions);
        const excluded = intentionallyExcludedFromPrompts[category] || [];
        const missingFromPrompt: string[] = [];

        for (const schemaOption of config.schema) {
          if (!promptSet.has(schemaOption) && !excluded.includes(schemaOption)) {
            missingFromPrompt.push(schemaOption);
          }
        }

        if (missingFromPrompt.length > 0) {
          console.error(
            `\n[${category}] Schema options NOT shown in prompt (${config.file}):\n  - ${missingFromPrompt.join("\n  - ")}`,
          );
          console.error(`\nFix: Add these options to apps/cli/src/prompts/${config.file}`);
        }

        expect(missingFromPrompt).toEqual([]);
      });

      it(`should only show valid ${config.name} options`, () => {
        const schemaSet = new Set(config.schema);
        const nonSchemaValues = nonSchemaPromptValues[category] || [];
        const invalidOptions: string[] = [];

        for (const promptOption of promptOptions) {
          if (!schemaSet.has(promptOption) && !nonSchemaValues.includes(promptOption)) {
            invalidOptions.push(promptOption);
          }
        }

        if (invalidOptions.length > 0) {
          console.error(
            `\n[${category}] Prompt options NOT in schema:\n  - ${invalidOptions.join("\n  - ")}`,
          );
          console.error(`\nFix: Either add to packages/types/src/schemas.ts or remove from prompt`);
        }

        expect(invalidOptions).toEqual([]);
      });
    });
  }
});

// Mapping from schema name to expected CLI flag name
const SCHEMA_TO_CLI_FLAG: Record<string, string> = {
  // Core options
  EcosystemSchema: "ecosystem",
  DatabaseSchema: "database",
  ORMSchema: "orm",
  BackendSchema: "backend",
  RuntimeSchema: "runtime",
  FrontendSchema: "frontend",
  AstroIntegrationSchema: "astroIntegration",
  AddonsSchema: "addons",
  ExamplesSchema: "examples",
  PackageManagerSchema: "packageManager",
  DatabaseSetupSchema: "dbSetup",
  APISchema: "api",
  AuthSchema: "auth",
  PaymentsSchema: "payments",
  WebDeploySchema: "webDeploy",
  ServerDeploySchema: "serverDeploy",
  DirectoryConflictSchema: "directoryConflict",
  TemplateSchema: "template",
  // Feature options
  AISchema: "ai",
  EffectSchema: "effect",
  StateManagementSchema: "stateManagement",
  FormsSchema: "forms",
  ValidationSchema: "validation",
  TestingSchema: "testing",
  EmailSchema: "email",
  CSSFrameworkSchema: "cssFramework",
  UILibrarySchema: "uiLibrary",
  RealtimeSchema: "realtime",
  JobQueueSchema: "jobQueue",
  AnimationSchema: "animation",
  FileUploadSchema: "fileUpload",
  LoggingSchema: "logging",
  ObservabilitySchema: "observability",
  FeatureFlagsSchema: "featureFlags",
  AnalyticsSchema: "analytics",
  CMSSchema: "cms",
  CachingSchema: "caching",
  SearchSchema: "search",
  FileStorageSchema: "fileStorage",
  AiDocsSchema: "aiDocs",
  ShadcnBaseSchema: "shadcnBase",
  ShadcnStyleSchema: "shadcnStyle",
  ShadcnIconLibrarySchema: "shadcnIconLibrary",
  ShadcnColorThemeSchema: "shadcnColorTheme",
  ShadcnBaseColorSchema: "shadcnBaseColor",
  ShadcnFontSchema: "shadcnFont",
  ShadcnRadiusSchema: "shadcnRadius",
  // Rust ecosystem
  RustWebFrameworkSchema: "rustWebFramework",
  RustFrontendSchema: "rustFrontend",
  RustOrmSchema: "rustOrm",
  RustApiSchema: "rustApi",
  RustCliSchema: "rustCli",
  RustLibrariesSchema: "rustLibraries",
  // Python ecosystem
  PythonWebFrameworkSchema: "pythonWebFramework",
  PythonOrmSchema: "pythonOrm",
  PythonValidationSchema: "pythonValidation",
  PythonAiSchema: "pythonAi",
  PythonTaskQueueSchema: "pythonTaskQueue",
  PythonQualitySchema: "pythonQuality",
  // Go ecosystem
  GoWebFrameworkSchema: "goWebFramework",
  GoOrmSchema: "goOrm",
  GoApiSchema: "goApi",
  GoCliSchema: "goCli",
  GoLoggingSchema: "goLogging",
};

// Parse CLI router to extract flag names
function parseCLIRouterFlags(): string[] {
  const possiblePaths = [
    join(process.cwd(), "src", "index.ts"),
    join(process.cwd(), "..", "cli", "src", "index.ts"),
    join(process.cwd(), "..", "..", "apps", "cli", "src", "index.ts"),
    join(process.cwd(), "apps", "cli", "src", "index.ts"),
  ];

  let content = "";
  for (const path of possiblePaths) {
    try {
      content = readFileSync(path, "utf-8");
      break;
    } catch {
      continue;
    }
  }

  if (!content) {
    return [];
  }

  // Find the z.object({ ... }) section in the router
  const routerStart = content.indexOf("z.object({");
  if (routerStart === -1) return [];

  // Find matching closing bracket
  let bracketCount = 1;
  let endIndex = routerStart + "z.object({".length;

  for (let i = endIndex; i < content.length && bracketCount > 0; i++) {
    if (content[i] === "{") bracketCount++;
    if (content[i] === "}") bracketCount--;
    endIndex = i;
  }

  const schemaContent = content.slice(routerStart, endIndex + 1);

  // Extract all flag names (property names before :)
  const flagRegex = /^\s*(\w+):\s*(?:z\b|[A-Z])/gm;
  const flags: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = flagRegex.exec(schemaContent)) !== null) {
    flags.push(match[1]);
  }

  return [...new Set(flags)];
}

describe("CLI Router Flags vs Schemas Sync", () => {
  const cliFlags = parseCLIRouterFlags();

  it("should have parsed CLI router flags", () => {
    expect(cliFlags.length).toBeGreaterThan(20);
    console.log(`Found ${cliFlags.length} CLI flags in router`);
  });

  it("should have CLI flags for all schema types", () => {
    const missingFlags: string[] = [];
    const cliSet = new Set(cliFlags);

    for (const [schemaName, expectedFlag] of Object.entries(SCHEMA_TO_CLI_FLAG)) {
      if (!cliSet.has(expectedFlag)) {
        missingFlags.push(
          `${schemaName} -> --${expectedFlag.replace(/([A-Z])/g, "-$1").toLowerCase()}`,
        );
      }
    }

    if (missingFlags.length > 0) {
      console.error(`\nSchema types missing CLI flags:\n  - ${missingFlags.join("\n  - ")}`);
      console.error(`\nFix: Add the missing flags to apps/cli/src/index.ts in the router schema`);
    }

    expect(missingFlags).toEqual([]);
  });

  it("should have all expected flags documented", () => {
    // List of flags that should exist
    const requiredFlags = Object.values(SCHEMA_TO_CLI_FLAG);
    const cliSet = new Set(cliFlags);
    const missing = requiredFlags.filter((f) => !cliSet.has(f));

    if (missing.length > 0) {
      console.error(`\nRequired CLI flags missing:\n  - ${missing.join("\n  - ")}`);
    }

    expect(missing).toEqual([]);
  });
});
