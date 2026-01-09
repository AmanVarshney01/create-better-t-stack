import * as fs from "node:fs/promises";
import { join, dirname } from "pathe";

import type { VirtualFileTree, VirtualNode, VirtualFile, VirtualDirectory } from "./types";

import { getBinaryTemplatesRoot } from "./core/template-reader";

const BINARY_FILE_MARKER = "[Binary file]";

export async function writeTreeToFilesystem(tree: VirtualFileTree, destDir: string): Promise<void> {
  for (const child of tree.root.children) {
    await writeNode(child, destDir, "");
  }
}

async function writeNode(node: VirtualNode, baseDir: string, relativePath: string): Promise<void> {
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
      await writeNode(child, baseDir, nodePath);
    }
  }
}

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
      await writeSelectedNode(child, baseDir, nodePath, filter, writtenFiles);
    }
  }
}

async function copyBinaryFile(templatePath: string, destPath: string): Promise<void> {
  const templatesRoot = getBinaryTemplatesRoot();
  const sourcePath = join(templatesRoot, templatePath);

  try {
    await fs.copyFile(sourcePath, destPath);
  } catch (error) {
    console.warn(`Failed to copy binary file: ${templatePath}`, error);
  }
}
