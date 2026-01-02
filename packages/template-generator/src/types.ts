import type { ProjectConfig } from "@better-t-stack/types";

export interface VirtualFile {
  type: "file";
  path: string;
  name: string;
  content: string;
  extension: string;
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

export interface GeneratorResult {
  success: boolean;
  tree?: VirtualFileTree;
  error?: string;
}
