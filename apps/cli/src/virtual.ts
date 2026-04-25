/**
 * Virtual filesystem export for web preview
 * Re-exports from @create-js-stack/template-generator for browser-compatible usage
 */

// Re-export everything from template-generator for web/programmatic usage
export {
  // Generator functions
  generate,
  // Virtual file system types
  VirtualFileSystem,
  type VirtualFileTree,
  type VirtualFile,
  type VirtualDirectory,
  type VirtualNode,
  // Generator types
  type GeneratorOptions,
  // Error types
  GeneratorError,
  // Embedded templates for browser usage
  EMBEDDED_TEMPLATES,
  TEMPLATE_COUNT,
} from "@create-js-stack/template-generator";

export { Result } from "better-result";

// Re-export types needed for configuration options
export type {
  Database,
  ORM,
  Backend,
  Runtime,
  Frontend,
  Addons,
  Examples,
  PackageManager,
  DatabaseSetup,
  API,
  Auth,
  Payments,
  WebDeploy,
  ServerDeploy,
  ProjectConfig,
} from "@create-js-stack/types";
