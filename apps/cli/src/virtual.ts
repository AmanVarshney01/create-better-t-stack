/**
 * Virtual filesystem export for web preview
 * Re-exports from @better-t-stack/template-generator for browser-compatible usage
 */

// Re-export everything from template-generator for web/programmatic usage
export {
  // Generator function
  generateVirtualProject,
  // Virtual file system types
  VirtualFileSystem,
  type VirtualFileTree,
  type VirtualFile,
  type VirtualDirectory,
  type VirtualNode,
  // Generator types
  type GeneratorOptions,
  type GeneratorResult,
  // Embedded templates for browser usage
  EMBEDDED_TEMPLATES,
  TEMPLATE_COUNT,
} from "@better-t-stack/template-generator";

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
} from "@better-t-stack/types";
