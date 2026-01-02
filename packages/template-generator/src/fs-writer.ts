import * as fs from "node:fs/promises";
import { join, dirname } from "pathe";

import type { VirtualFileTree, VirtualNode, VirtualFile, VirtualDirectory } from "./types";

async function ensureDir(dirPath: string): Promise<void> {
  await fs.mkdir(dirPath, { recursive: true });
}

export async function writeTreeToFilesystem(tree: VirtualFileTree, destDir: string): Promise<void> {
  const root = tree.root as VirtualDirectory;
  for (const child of root.children) {
    await writeNode(child, destDir, "");
  }
}

async function writeNode(node: VirtualNode, baseDir: string, relativePath: string): Promise<void> {
  const fullPath = join(baseDir, relativePath, node.name);

  if (node.type === "file") {
    const file = node as VirtualFile;

    if (file.content === "[Binary file]") {
      return;
    }

    await ensureDir(dirname(fullPath));
    await fs.writeFile(fullPath, file.content, "utf-8");
  } else {
    const dir = node as VirtualDirectory;
    await ensureDir(fullPath);

    for (const child of dir.children) {
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
    if (filter(nodePath)) {
      const file = node as VirtualFile;
      const fullPath = join(baseDir, nodePath);

      if (file.content !== "[Binary file]") {
        await ensureDir(dirname(fullPath));
        await fs.writeFile(fullPath, file.content, "utf-8");
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
