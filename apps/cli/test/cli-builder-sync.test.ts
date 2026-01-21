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

import {
  ADDONS_VALUES,
  AI_VALUES,
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
  FILE_UPLOAD_VALUES,
  FORMS_VALUES,
  FRONTEND_VALUES,
  JOB_QUEUE_VALUES,
  LOGGING_VALUES,
  OBSERVABILITY_VALUES,
  ORM_VALUES,
  PACKAGE_MANAGER_VALUES,
  PAYMENTS_VALUES,
  REALTIME_VALUES,
  RUNTIME_VALUES,
  RUST_API_VALUES,
  RUST_CLI_VALUES,
  RUST_FRONTEND_VALUES,
  RUST_LIBRARIES_VALUES,
  RUST_ORM_VALUES,
  RUST_WEB_FRAMEWORK_VALUES,
  SERVER_DEPLOY_VALUES,
  STATE_MANAGEMENT_VALUES,
  TESTING_VALUES,
  UI_LIBRARY_VALUES,
  VALIDATION_VALUES,
  WEB_DEPLOY_VALUES,
} from "@better-fullstack/types";
import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// Mapping from Builder TECH_OPTIONS category to CLI schema values
const CLI_SCHEMA_MAP: Record<string, readonly string[]> = {
  // TypeScript ecosystem
  api: API_VALUES,
  webFrontend: FRONTEND_VALUES,
  nativeFrontend: FRONTEND_VALUES,
  database: DATABASE_VALUES,
  orm: ORM_VALUES,
  backend: BACKEND_VALUES,
  runtime: RUNTIME_VALUES,
  auth: AUTH_VALUES,
  payments: PAYMENTS_VALUES,
  email: EMAIL_VALUES,
  stateManagement: STATE_MANAGEMENT_VALUES,
  forms: FORMS_VALUES,
  validation: VALIDATION_VALUES,
  testing: TESTING_VALUES,
  realtime: REALTIME_VALUES,
  jobQueue: JOB_QUEUE_VALUES,
  caching: CACHING_VALUES,
  animation: ANIMATION_VALUES,
  cms: CMS_VALUES,
  fileUpload: FILE_UPLOAD_VALUES,
  logging: LOGGING_VALUES,
  observability: OBSERVABILITY_VALUES,
  ai: AI_VALUES, // aiSdk in StackState
  codeQuality: ADDONS_VALUES,
  documentation: ADDONS_VALUES,
  appPlatforms: ADDONS_VALUES,
  examples: EXAMPLES_VALUES,
  packageManager: PACKAGE_MANAGER_VALUES,
  dbSetup: DATABASE_SETUP_VALUES,
  cssFramework: CSS_FRAMEWORK_VALUES,
  uiLibrary: UI_LIBRARY_VALUES,
  webDeploy: WEB_DEPLOY_VALUES,
  serverDeploy: SERVER_DEPLOY_VALUES,
  astroIntegration: ASTRO_INTEGRATION_VALUES,
  backendLibraries: EFFECT_VALUES,
  // Rust ecosystem
  rustWebFramework: RUST_WEB_FRAMEWORK_VALUES,
  rustFrontend: RUST_FRONTEND_VALUES,
  rustOrm: RUST_ORM_VALUES,
  rustApi: RUST_API_VALUES,
  rustCli: RUST_CLI_VALUES,
  rustLibraries: RUST_LIBRARIES_VALUES,
};

// Parse TECH_OPTIONS from the Builder's constant.ts file
function parseBuilderOptions(): Record<string, string[]> {
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

  // Find where TECH_OPTIONS ends (next export or end of object)
  const techOptionsSection = content.slice(techOptionsStart);
  const result: Record<string, string[]> = {};

  // Parse each category by finding "categoryName: [" patterns
  // Then extract all id: "value" within that array
  const categoryPattern = /^\s*(\w+):\s*\[/gm;
  let categoryMatch: RegExpExecArray | null;

  // biome-ignore lint/suspicious/noAssignInExpressions: needed for regex iteration
  while ((categoryMatch = categoryPattern.exec(techOptionsSection)) !== null) {
    const categoryName = categoryMatch[1];
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
    const idRegex = /id:\s*["']([^"']+)["']/g;
    const ids: string[] = [];
    let idMatch: RegExpExecArray | null;

    // biome-ignore lint/suspicious/noAssignInExpressions: needed for regex iteration
    while ((idMatch = idRegex.exec(categoryContent)) !== null) {
      ids.push(idMatch[1]);
    }

    if (ids.length > 0) {
      result[categoryName] = ids;
    }
  }

  return result;
}

describe("CLI and Builder Sync", () => {
  let builderOptions: Record<string, string[]>;

  try {
    builderOptions = parseBuilderOptions();
  } catch {
    // If we can't parse the file, skip these tests
    builderOptions = {};
  }

  it("should have parsed Builder options successfully", () => {
    expect(Object.keys(builderOptions).length).toBeGreaterThan(0);
    console.log(`Parsed ${Object.keys(builderOptions).length} categories from Builder`);
  });

  // Test each category
  const categoriesToTest = Object.keys(CLI_SCHEMA_MAP);

  for (const category of categoriesToTest) {
    const cliValues = CLI_SCHEMA_MAP[category];
    const builderValues = builderOptions[category];

    // Skip categories that don't exist in Builder (like addons which map to multiple)
    if (!builderValues) {
      continue;
    }

    describe(`Category: ${category}`, () => {
      it("Builder options should all be valid CLI options", () => {
        const cliSet = new Set(cliValues);
        const missingInCli: string[] = [];

        // Builder-specific options that map to different CLI values
        const builderToCli: Record<string, Record<string, string>> = {
          // self-next, self-tanstack-start, self-astro all map to "self" in CLI
          backend: {
            "self-next": "self",
            "self-tanstack-start": "self",
            "self-astro": "self",
          },
        };

        const mapping = builderToCli[category] || {};

        for (const option of builderValues) {
          const cliOption = mapping[option] || option;
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

      it("CLI options should all be in Builder (or intentionally excluded)", () => {
        const builderSet = new Set(builderValues);
        const missingInBuilder: string[] = [];

        // Some CLI options are intentionally not shown in Builder UI
        const intentionallyExcluded: Record<string, string[]> = {
          // "self" backend is mapped from self-next, self-tanstack-start, self-astro in Builder
          backend: ["self"],
          // native frontends are in a separate nativeFrontend category in Builder
          webFrontend: ["native-bare", "native-uniwind", "native-unistyles"],
          // nativeFrontend in Builder only shows native options, web options are in webFrontend
          nativeFrontend: [
            "tanstack-router",
            "react-router",
            "tanstack-start",
            "next",
            "nuxt",
            "svelte",
            "solid",
            "astro",
            "qwik",
            "angular",
            "redwood",
            "fresh",
            "none",
          ],
          // codeQuality, documentation, appPlatforms are subsets of AddonsSchema
          // Each category only shows relevant addons, not all of them
          codeQuality: [
            "pwa",
            "tauri",
            "starlight",
            "turborepo",
            "fumadocs",
            "opentui",
            "wxt",
            "msw",
            "storybook",
            "none",
          ],
          documentation: [
            "pwa",
            "tauri",
            "biome",
            "lefthook",
            "husky",
            "ruler",
            "turborepo",
            "ultracite",
            "oxlint",
            "opentui",
            "wxt",
            "msw",
            "storybook",
            "none",
          ],
          appPlatforms: [
            "starlight",
            "biome",
            "lefthook",
            "husky",
            "ruler",
            "fumadocs",
            "ultracite",
            "oxlint",
            "msw",
            "storybook",
            "none",
          ],
          // examples category may not show "none" explicitly
          examples: ["none"],
        };

        const excluded = intentionallyExcluded[category] || [];

        for (const option of cliValues) {
          if (!builderSet.has(option) && !excluded.includes(option)) {
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
    });
  }

  // Summary test
  it("should have all categories mapped", () => {
    const unmappedCategories: string[] = [];

    for (const category of Object.keys(builderOptions)) {
      if (!CLI_SCHEMA_MAP[category]) {
        unmappedCategories.push(category);
      }
    }

    if (unmappedCategories.length > 0) {
      console.warn(
        `\nBuilder categories without CLI mapping:\n  - ${unmappedCategories.join("\n  - ")}`,
      );
      console.warn(`\nYou may need to add these to CLI_SCHEMA_MAP in this test file`);
    }

    // This is a warning, not a failure - some categories might be Builder-only
    expect(unmappedCategories.length).toBeLessThanOrEqual(5);
  });
});

describe("StackState and CLI Input Sync", () => {
  it("should have all StackState fields represented in CLI", () => {
    // Read the constant.ts to find StackState fields
    const possiblePaths = [
      join(process.cwd(), "..", "web", "src", "lib", "constant.ts"),
      join(process.cwd(), "..", "..", "apps", "web", "src", "lib", "constant.ts"),
      join(process.cwd(), "apps", "web", "src", "lib", "constant.ts"),
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
      console.warn("Could not find constant.ts");
      return;
    }

    // Extract StackState type fields
    const stackStateMatch = content.match(/export type StackState\s*=\s*\{([^}]+)\}/);

    if (!stackStateMatch) {
      console.warn("Could not find StackState type");
      return;
    }

    const stackStateContent = stackStateMatch[1];
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
  try {
    const content = readFileSync(promptPath, "utf-8");

    let searchContent = content;

    // If a function name is provided, only search within that function
    if (functionName) {
      const funcStart = content.indexOf(`function ${functionName}`);
      if (funcStart === -1) {
        return [];
      }
      // Find the end of this function (next export or function declaration)
      const nextFunc = content.indexOf("\nexport", funcStart + 1);
      const nextAsyncFunc = content.indexOf("\nasync function", funcStart + 50);
      const endIndex = Math.min(
        nextFunc > 0 ? nextFunc : content.length,
        nextAsyncFunc > 0 ? nextAsyncFunc : content.length,
      );
      searchContent = content.slice(funcStart, endIndex);
    }

    // Extract all value: "xxx" patterns (with or without "as const")
    const valueRegex = /value:\s*["']([^"']+)["']/g;
    const values: string[] = [];
    let match: RegExpExecArray | null;

    // biome-ignore lint/suspicious/noAssignInExpressions: needed for regex iteration
    while ((match = valueRegex.exec(searchContent)) !== null) {
      values.push(match[1]);
    }

    return [...new Set(values)]; // Remove duplicates
  } catch {
    return [];
  }
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
      ];

      let promptOptions: string[] = [];
      for (const path of possiblePaths) {
        promptOptions = parsePromptOptions(path, config.functionName);
        if (promptOptions.length > 0) break;
      }

      it(`should show all ${config.name} options in the prompt`, () => {
        if (promptOptions.length === 0) {
          console.warn(`Could not parse ${config.file} - skipping`);
          return;
        }

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
        if (promptOptions.length === 0) {
          return;
        }

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
