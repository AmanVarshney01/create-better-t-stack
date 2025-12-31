import type { ProjectConfig } from "@better-t-stack/types";

/**
 * Represents a virtual file in the generated project
 */
export interface VirtualFile {
  type: "file";
  path: string;
  name: string;
  content: string;
  /** File extension without dot, e.g. "ts", "json" */
  extension: string;
}

/**
 * Represents a virtual directory in the generated project
 */
export interface VirtualDirectory {
  type: "directory";
  path: string;
  name: string;
  children: VirtualNode[];
}

/**
 * A node in the virtual file tree (either file or directory)
 */
export type VirtualNode = VirtualFile | VirtualDirectory;

/**
 * The complete virtual file tree representing a generated project
 */
export interface VirtualFileTree {
  root: VirtualDirectory;
  /** Total number of files in the tree */
  fileCount: number;
  /** Total number of directories in the tree */
  directoryCount: number;
  /** Project configuration used to generate this tree */
  config: ProjectConfig;
}

/**
 * Options for template generation
 */
export interface GeneratorOptions {
  /** Project configuration */
  config: ProjectConfig;
  /** Base path for templates (for CLI usage) */
  templateBasePath?: string;
  /** Pre-loaded templates as a map of path -> content (for web usage) */
  templates?: Map<string, string>;
}

/**
 * Result of generating a virtual file tree
 */
export interface GeneratorResult {
  success: boolean;
  tree?: VirtualFileTree;
  error?: string;
}
