import { Result, TaggedError } from "better-result";
import * as fs from "node:fs/promises";
import { join, dirname } from "pathe";

import type { VirtualFileTree, VirtualNode, VirtualFile, VirtualDirectory } from "./types";

import { getBinaryTemplatesRoot } from "./core/template-reader";

const BINARY_FILE_MARKER = "[Binary file]";

/**
 * Error class for filesystem write failures
 */
export class FileWriteError extends TaggedError("FileWriteError")<{
  message: string;
  path?: string;
  cause?: unknown;
}>() {}

/**
 * Writes a virtual file tree to the filesystem.
 * Returns a Result type for type-safe error handling.
 */
export async function writeTree(
  tree: VirtualFileTree,
  destDir: string,
): Promise<Result<void, FileWriteError>> {
  return Result.tryPromise({
    try: async () => {
      for (const child of tree.root.children) {
        await writeNodeInternal(child, destDir, "");
      }
    },
    catch: (e) => {
      if (FileWriteError.is(e)) return e;
      return new FileWriteError({
        message: e instanceof Error ? e.message : String(e),
        cause: e,
      });
    },
  });
}

async function writeNodeInternal(
  node: VirtualNode,
  baseDir: string,
  relativePath: string,
): Promise<void> {
  const fullPath = join(baseDir, relativePath, node.name);
  const nodePath = relativePath ? join(relativePath, node.name) : node.name;

  if (node.type === "file") {
    const fileNode = node as VirtualFile;
    await fs.mkdir(dirname(fullPath), { recursive: true });

    if (fileNode.content === BINARY_FILE_MARKER && fileNode.sourcePath) {
      await copyBinaryFile(fileNode.sourcePath, fullPath);
    } else if (fileNode.content !== BINARY_FILE_MARKER) {
      await fs.writeFile(fullPath, fileNode.content, "utf-8");
    }
  } else {
    await fs.mkdir(fullPath, { recursive: true });
    for (const child of (node as VirtualDirectory).children) {
      await writeNodeInternal(child, baseDir, nodePath);
    }
  }
}

/**
 * Writes selected files from a virtual file tree to the filesystem.
 * Returns a Result with the list of written file paths.
 */
export async function writeSelected(
  tree: VirtualFileTree,
  destDir: string,
  filter: (filePath: string) => boolean,
): Promise<Result<string[], FileWriteError>> {
  return Result.tryPromise({
    try: async () => {
      const writtenFiles: string[] = [];
      await writeSelectedNodeInternal(tree.root, destDir, "", filter, writtenFiles);
      return writtenFiles;
    },
    catch: (e) => {
      if (FileWriteError.is(e)) return e;
      return new FileWriteError({
        message: e instanceof Error ? e.message : String(e),
        cause: e,
      });
    },
  });
}

async function writeSelectedNodeInternal(
  node: VirtualNode,
  baseDir: string,
  relativePath: string,
  filter: (filePath: string) => boolean,
  writtenFiles: string[],
): Promise<void> {
  const nodePath = relativePath ? `${relativePath}/${node.name}` : node.name;

  if (node.type === "file") {
    if (filter(nodePath)) {
      const fileNode = node as VirtualFile;
      await fs.mkdir(dirname(join(baseDir, nodePath)), { recursive: true });

      if (fileNode.content === BINARY_FILE_MARKER && fileNode.sourcePath) {
        await copyBinaryFile(fileNode.sourcePath, join(baseDir, nodePath));
      } else if (fileNode.content !== BINARY_FILE_MARKER) {
        await fs.writeFile(join(baseDir, nodePath), fileNode.content, "utf-8");
      }
      writtenFiles.push(nodePath);
    }
  } else {
    for (const child of (node as VirtualDirectory).children) {
      await writeSelectedNodeInternal(child, baseDir, nodePath, filter, writtenFiles);
    }
  }
}

async function copyBinaryFile(templatePath: string, destPath: string): Promise<void> {
  const templatesRoot = getBinaryTemplatesRoot();
  const sourcePath = join(templatesRoot, templatePath);
  // Let errors propagate - they'll be caught by the Result wrapper
  await fs.copyFile(sourcePath, destPath);
}
