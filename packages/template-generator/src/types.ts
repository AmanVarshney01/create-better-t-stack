import type { ProjectConfig } from "@better-t-stack/types";

import { TaggedError } from "better-result";

export interface VirtualFile {
  type: "file";
  path: string;
  name: string;
  content: string;
  extension: string;
  sourcePath?: string; // Original template path for binary files
}

export interface VirtualDirectory {
  type: "directory";
  path: string;
  name: string;
  children: VirtualNode[];
}

export type VirtualNode = VirtualFile | VirtualDirectory;

export interface VirtualFileTree {
  root: VirtualDirectory;
  fileCount: number;
  directoryCount: number;
  config: ProjectConfig;
}

export interface GeneratorOptions {
  config: ProjectConfig;
  templateBasePath?: string;
  templates?: Map<string, string>;
}

/**
 * Error class for template generation failures
 */
export class GeneratorError extends TaggedError("GeneratorError")<{
  message: string;
  phase?: string;
  cause?: unknown;
}>() {}
