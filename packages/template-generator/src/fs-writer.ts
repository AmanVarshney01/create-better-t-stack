/**
 * Filesystem Writer - Node.js only module
 * Writes VirtualFileTree to real filesystem
 * Uses fs-extra for safer file operations
 */

import fs from "fs-extra";
import { join, dirname } from "pathe";

import type { VirtualFileTree, VirtualNode, VirtualFile, VirtualDirectory } from "./types";

/**
 * Write a VirtualFileTree to the real filesystem
 * Note: The destDir should be the project directory. The root node name is skipped
 * since destDir already includes the project name.
 */
export async function writeTreeToFilesystem(tree: VirtualFileTree, destDir: string): Promise<void> {
  // Skip the root node name (project name) and write children directly to destDir
  const root = tree.root as VirtualDirectory;
  for (const child of root.children) {
    await writeNode(child, destDir, "");
  }
}

/**
 * Recursively write a VirtualNode to the filesystem
 */
async function writeNode(node: VirtualNode, baseDir: string, relativePath: string): Promise<void> {
  const fullPath = join(baseDir, relativePath, node.name);

  if (node.type === "file") {
    const file = node as VirtualFile;

    // Skip binary placeholders
    if (file.content === "[Binary file]") {
      return;
    }

    // fs-extra's outputFile creates parent directories automatically
    await fs.outputFile(fullPath, file.content, "utf-8");
  } else {
    const dir = node as VirtualDirectory;
    await fs.ensureDir(fullPath);

    for (const child of dir.children) {
      await writeNode(child, baseDir, join(relativePath, node.name));
    }
  }
}

/**
 * Write only specific files from a VirtualFileTree
 * Useful for partial updates or selective file generation
 */
export async function writeSelectedFiles(
  tree: VirtualFileTree,
  destDir: string,
  filter: (filePath: string) => boolean,
): Promise<string[]> {
  const writtenFiles: string[] = [];
  await writeSelectedNode(tree.root, destDir, "", filter, writtenFiles);
  return writtenFiles;
}

async function writeSelectedNode(
  node: VirtualNode,
  baseDir: string,
  relativePath: string,
  filter: (filePath: string) => boolean,
  writtenFiles: string[],
): Promise<void> {
  const nodePath = relativePath ? `${relativePath}/${node.name}` : node.name;

  if (node.type === "file") {
    if (filter(nodePath)) {
      const file = node as VirtualFile;
      const fullPath = join(baseDir, nodePath);

      if (file.content !== "[Binary file]") {
        // fs-extra's outputFile creates parent directories automatically
        await fs.outputFile(fullPath, file.content, "utf-8");
        writtenFiles.push(nodePath);
      }
    }
  } else {
    const dir = node as VirtualDirectory;
    for (const child of dir.children) {
      await writeSelectedNode(child, baseDir, nodePath, filter, writtenFiles);
    }
  }
}
