// Core browser-compatible exports
export * from "./types";
export * from "./core/virtual-fs";
export * from "./core/template-processor";
export * from "./generator";

// Embedded templates for browser usage
export { EMBEDDED_TEMPLATES, TEMPLATE_COUNT } from "./templates.generated";

// NOTE: fs-writer and template-reader use Node.js fs module and are NOT exported here
// For Node.js-only usage (like CLI), import directly:
// import { writeTreeToFilesystem } from "@better-t-stack/template-generator/fs-writer"
// import { loadTemplates } from "@better-t-stack/template-generator/template-reader"
