import * as fs from "node:fs/promises";
import { join, dirname } from "pathe";

import type { VirtualFileTree, VirtualNode, VirtualFile, VirtualDirectory } from "./types";

export async function writeTreeToFilesystem(tree: VirtualFileTree, destDir: string): Promise<void> {
  for (const child of tree.root.children) {
    await writeNode(child, destDir, "");
  }
}

async function writeNode(node: VirtualNode, baseDir: string, relativePath: string): Promise<void> {
  const fullPath = join(baseDir, relativePath, node.name);

  if (node.type === "file") {
    if ((node as VirtualFile).content === "[Binary file]") return;
    await fs.mkdir(dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, (node as VirtualFile).content, "utf-8");
  } else {
    await fs.mkdir(fullPath, { recursive: true });
    for (const child of (node as VirtualDirectory).children) {
      await writeNode(child, baseDir, join(relativePath, node.name));
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
    if (filter(nodePath) && (node as VirtualFile).content !== "[Binary file]") {
      await fs.mkdir(dirname(join(baseDir, nodePath)), { recursive: true });
      await fs.writeFile(join(baseDir, nodePath), (node as VirtualFile).content, "utf-8");
      writtenFiles.push(nodePath);
    }
  } else {
    for (const child of (node as VirtualDirectory).children) {
      await writeSelectedNode(child, baseDir, nodePath, filter, writtenFiles);
    }
  }
}
