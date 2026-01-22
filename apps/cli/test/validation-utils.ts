import type {
  VirtualFileTree,
  VirtualFile,
  VirtualDirectory,
  VirtualNode,
} from "@better-fullstack/template-generator";

import { parse as parseJsonc, ParseError, printParseErrorCode } from "jsonc-parser";
import { Project, DiagnosticCategory } from "ts-morph";

// Types
export interface ValidationError {
  file: string;
  type: "syntax" | "json" | "handlebars";
  message: string;
  line?: number;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

// Patterns for errors that are NOT actual syntax errors (import/type resolution related)
const NON_SYNTAX_ERROR_PATTERNS = [
  "Cannot find module",
  "Cannot find name",
  "Cannot find namespace",
  "Cannot find lib definition", // Deno/Fresh libs
  "Could not find a declaration file",
  "has no exported member",
  "is not a module",
  "Module '",
  "has no default export",
  "Property '",
  "does not exist on type",
  "Argument of type",
  "Type '",
  "is not assignable to",
  "requires 'React' to be in scope",
  "is declared but its value is never read",
  "is defined but never used",
  "JSX element implicitly has type 'any'",
  "'React' refers to a UMD global",
  "react/jsx-runtime",
  "module path",
  "to exist, but none could be found",
  "Invalid module name in augmentation",
  "cannot be found",
  "Decorators are not valid here", // NestJS decorators - requires experimentalDecorators
];

/**
 * Validate TypeScript/JavaScript syntax using ts-morph
 * Uses in-memory filesystem for speed - no disk I/O
 */
export function validateTypeScript(content: string, filename: string): ValidationResult {
  const isTsx = filename.endsWith(".tsx") || filename.endsWith(".jsx");

  const project = new Project({
    useInMemoryFileSystem: true,
    skipAddingFilesFromTsConfig: true,
    compilerOptions: {
      // Minimal options for syntax checking only
      noEmit: true,
      skipLibCheck: true,
      // Use react-jsx to avoid needing React in scope
      jsx: isTsx ? 4 : undefined, // 4 = react-jsx (automatic runtime)
      jsxImportSource: "react",
      // Don't require imports to resolve
      noResolve: true,
      // Allow any module syntax
      module: 99, // ESNext
      target: 99, // ESNext
      moduleResolution: 100, // Bundler
      // Be lenient with missing types
      allowJs: true,
      checkJs: false,
      // Don't error on unused locals/params
      noUnusedLocals: false,
      noUnusedParameters: false,
      // Strict mode off for syntax-only checking
      strict: false,
      noImplicitAny: false,
    },
  });

  const sourceFile = project.createSourceFile(filename, content);
  const diagnostics = sourceFile.getPreEmitDiagnostics();

  // Filter to only true syntax errors (not import/type resolution errors)
  const syntaxErrors = diagnostics.filter((d) => {
    if (d.getCategory() !== DiagnosticCategory.Error) return false;

    const message = d.getMessageText().toString();

    // Filter out non-syntax errors
    for (const pattern of NON_SYNTAX_ERROR_PATTERNS) {
      if (message.includes(pattern)) return false;
    }

    return true;
  });

  if (syntaxErrors.length === 0) {
    return { valid: true, errors: [] };
  }

  const errors: ValidationError[] = syntaxErrors.map((d) => ({
    file: filename,
    type: "syntax" as const,
    message: d.getMessageText().toString(),
    line: d.getLineNumber(),
  }));

  return { valid: false, errors };
}

/**
 * Get line number from character offset in content
 */
function getLineFromOffset(content: string, offset: number): number {
  const substring = content.substring(0, offset);
  return (substring.match(/\n/g) || []).length + 1;
}

/**
 * Validate JSON syntax
 * Uses JSONC parser for tsconfig.json and other config files that may have comments
 */
export function validateJSON(content: string, filename: string): ValidationResult {
  // Use JSONC parser for files that commonly have comments or trailing commas
  const isJsonc =
    filename.endsWith("tsconfig.json") ||
    filename.includes("tsconfig.") ||
    filename.endsWith(".jsonc") ||
    filename.endsWith("jsconfig.json");

  if (isJsonc) {
    const errors: ParseError[] = [];
    parseJsonc(content, errors, {
      allowTrailingComma: true,
      allowEmptyContent: true,
    });

    if (errors.length === 0) {
      return { valid: true, errors: [] };
    }

    return {
      valid: false,
      errors: errors.map((e) => ({
        file: filename,
        type: "json" as const,
        message: printParseErrorCode(e.error),
        line: getLineFromOffset(content, e.offset),
      })),
    };
  }

  // Standard JSON parsing
  try {
    JSON.parse(content);
    return { valid: true, errors: [] };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid JSON";
    return {
      valid: false,
      errors: [
        {
          file: filename,
          type: "json",
          message,
        },
      ],
    };
  }
}

/**
 * Check for unprocessed Handlebars markers
 * Returns true if unprocessed markers are found
 *
 * Handlebars markers look like: {{variableName}}, {{helper arg}}, {{#if}}, etc.
 * We need to distinguish from JSX object literals: {{ key: value }}
 */
export function checkForUnprocessedHandlebars(content: string): boolean {
  const markers = getUnprocessedHandlebarsMarkers(content);
  return markers.length > 0;
}

/**
 * Get all unprocessed Handlebars markers in content
 * Filters out JSX object literals which use {{ }} for objects in expressions
 */
export function getUnprocessedHandlebarsMarkers(content: string): string[] {
  // Match {{...}} patterns on a single line (Handlebars markers are typically single-line)
  // Pattern: {{ followed by content without newlines, ending with }}
  const pattern = /\{\{([^}\n]+)\}\}/g;
  const matches: string[] = [];

  let match;
  while ((match = pattern.exec(content)) !== null) {
    const innerContent = match[1].trim();

    // Skip if it looks like a JSX object literal (contains : for key-value pairs)
    // Handlebars markers: {{name}}, {{helper arg}}, {{#if condition}}
    // JSX objects: {{ key: value }}, {{ ...spread }}
    if (
      innerContent.includes(":") &&
      !innerContent.startsWith("#") &&
      !innerContent.startsWith("/")
    ) {
      continue;
    }

    // Skip spread syntax: {{ ...props }}
    if (innerContent.startsWith("...")) {
      continue;
    }

    // Skip empty objects: {{ }}
    if (innerContent === "") {
      continue;
    }

    // Skip if it starts with special Handlebars chars (these are valid Handlebars, not unprocessed)
    if (/^[#\/\^!>~]/.test(innerContent)) {
      continue;
    }

    // Skip if it looks like a JavaScript expression (has operators, parentheses, etc.)
    // Common in Vue/Angular templates: {{ expression }}
    if (/[()[\]=<>!&|+\-*/%]/.test(innerContent)) {
      continue;
    }

    // This looks like an unprocessed Handlebars variable marker
    matches.push(match[0]);
  }

  return matches;
}

/**
 * Recursively get all files from a VirtualFileTree
 */
export function getAllFiles(tree: VirtualFileTree): { path: string; content: string }[] {
  const files: { path: string; content: string }[] = [];

  function traverse(node: VirtualNode) {
    if (node.type === "file") {
      files.push({ path: node.path, content: node.content });
    } else {
      for (const child of node.children) {
        traverse(child);
      }
    }
  }

  traverse(tree.root);
  return files;
}

/**
 * Get files matching specific extensions
 */
export function getFilesOfType(
  tree: VirtualFileTree,
  extensions: string[],
): { path: string; content: string }[] {
  const allFiles = getAllFiles(tree);
  return allFiles.filter((file) => extensions.some((ext) => file.path.endsWith(ext)));
}

/**
 * Validate all TypeScript/TSX/JS/JSX files in a tree
 */
export function validateAllTypeScriptFiles(tree: VirtualFileTree): ValidationResult {
  const tsFiles = getFilesOfType(tree, [".ts", ".tsx", ".js", ".jsx", ".mts", ".cts"]);
  const errors: ValidationError[] = [];

  for (const file of tsFiles) {
    // Skip .d.ts files - they're type declarations only
    if (file.path.endsWith(".d.ts")) continue;

    const result = validateTypeScript(file.content, file.path);
    if (!result.valid) {
      errors.push(...result.errors);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate all JSON files in a tree
 */
export function validateAllJSONFiles(tree: VirtualFileTree): ValidationResult {
  const jsonFiles = getFilesOfType(tree, [".json"]);
  const errors: ValidationError[] = [];

  for (const file of jsonFiles) {
    const result = validateJSON(file.content, file.path);
    if (!result.valid) {
      errors.push(...result.errors);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Check all files for unprocessed Handlebars markers
 */
export function checkAllFilesForHandlebars(tree: VirtualFileTree): ValidationResult {
  const allFiles = getAllFiles(tree);
  const errors: ValidationError[] = [];

  // File extensions that might contain Handlebars templates
  // NOTE: Excludes .vue and .svelte files which use {{ }} for template interpolation
  const checkExtensions = [
    ".ts",
    ".tsx",
    ".js",
    ".jsx",
    ".json",
    ".html",
    ".css",
    ".scss",
    ".md",
    ".yaml",
    ".yml",
    ".toml",
  ];

  for (const file of allFiles) {
    // Only check certain file types
    if (!checkExtensions.some((ext) => file.path.endsWith(ext))) continue;

    // Skip files that legitimately use {{ }} syntax
    if (file.path.includes("angular") || file.path.includes(".component.html")) continue;

    if (checkForUnprocessedHandlebars(file.content)) {
      const markers = getUnprocessedHandlebarsMarkers(file.content);
      if (markers.length > 0) {
        errors.push({
          file: file.path,
          type: "handlebars",
          message: `Unprocessed Handlebars markers found: ${markers.join(", ")}`,
        });
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Basic Vue SFC validation - checks for basic structure
 */
export function validateVueFile(content: string, filename: string): ValidationResult {
  const errors: ValidationError[] = [];

  // Check for basic Vue SFC structure
  const hasTemplate = /<template[\s>]/i.test(content);
  const hasScript = /<script[\s>]/i.test(content);

  // A Vue file should have at least a template or script section
  if (!hasTemplate && !hasScript) {
    errors.push({
      file: filename,
      type: "syntax",
      message: "Vue file missing both <template> and <script> sections",
    });
  }

  // Check for unclosed tags (basic check)
  const openTemplateTags = (content.match(/<template[\s>]/gi) || []).length;
  const closeTemplateTags = (content.match(/<\/template>/gi) || []).length;
  if (openTemplateTags !== closeTemplateTags) {
    errors.push({
      file: filename,
      type: "syntax",
      message: `Mismatched template tags: ${openTemplateTags} opening, ${closeTemplateTags} closing`,
    });
  }

  const openScriptTags = (content.match(/<script[\s>]/gi) || []).length;
  const closeScriptTags = (content.match(/<\/script>/gi) || []).length;
  if (openScriptTags !== closeScriptTags) {
    errors.push({
      file: filename,
      type: "syntax",
      message: `Mismatched script tags: ${openScriptTags} opening, ${closeScriptTags} closing`,
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Basic Svelte file validation
 */
export function validateSvelteFile(content: string, filename: string): ValidationResult {
  const errors: ValidationError[] = [];

  // Check for unclosed script tags
  const openScriptTags = (content.match(/<script[\s>]/gi) || []).length;
  const closeScriptTags = (content.match(/<\/script>/gi) || []).length;
  if (openScriptTags !== closeScriptTags) {
    errors.push({
      file: filename,
      type: "syntax",
      message: `Mismatched script tags: ${openScriptTags} opening, ${closeScriptTags} closing`,
    });
  }

  // Check for unclosed style tags
  const openStyleTags = (content.match(/<style[\s>]/gi) || []).length;
  const closeStyleTags = (content.match(/<\/style>/gi) || []).length;
  if (openStyleTags !== closeStyleTags) {
    errors.push({
      file: filename,
      type: "syntax",
      message: `Mismatched style tags: ${openStyleTags} opening, ${closeStyleTags} closing`,
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate all Vue files in a tree
 */
export function validateAllVueFiles(tree: VirtualFileTree): ValidationResult {
  const vueFiles = getFilesOfType(tree, [".vue"]);
  const errors: ValidationError[] = [];

  for (const file of vueFiles) {
    const result = validateVueFile(file.content, file.path);
    if (!result.valid) {
      errors.push(...result.errors);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate all Svelte files in a tree
 */
export function validateAllSvelteFiles(tree: VirtualFileTree): ValidationResult {
  const svelteFiles = getFilesOfType(tree, [".svelte"]);
  const errors: ValidationError[] = [];

  for (const file of svelteFiles) {
    const result = validateSvelteFile(file.content, file.path);
    if (!result.valid) {
      errors.push(...result.errors);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Comprehensive validation of all files in a tree
 */
export function validateAllFiles(tree: VirtualFileTree): ValidationResult {
  const results: ValidationResult[] = [
    validateAllTypeScriptFiles(tree),
    validateAllJSONFiles(tree),
    checkAllFilesForHandlebars(tree),
    validateAllVueFiles(tree),
    validateAllSvelteFiles(tree),
  ];

  const allErrors = results.flatMap((r) => r.errors);

  return {
    valid: allErrors.length === 0,
    errors: allErrors,
  };
}

/**
 * Format validation errors for readable output
 */
export function formatValidationErrors(result: ValidationResult): string {
  if (result.valid) {
    return "All files valid";
  }

  const lines = [`Found ${result.errors.length} validation error(s):`];
  for (const error of result.errors) {
    const lineInfo = error.line ? `:${error.line}` : "";
    lines.push(`  ${error.type.toUpperCase()}: ${error.file}${lineInfo}`);
    lines.push(`    ${error.message}`);
  }

  return lines.join("\n");
}
