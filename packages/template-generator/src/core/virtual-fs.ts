import type { VirtualDirectory, VirtualFile, VirtualNode } from "../types";

// Pure JS path utilities for browser compatibility
function dirname(p: string): string {
  const normalized = p.replace(/\\/g, "/").replace(/\/+$/, "");
  const lastSlash = normalized.lastIndexOf("/");
  if (lastSlash === -1) return ".";
  if (lastSlash === 0) return "/";
  return normalized.slice(0, lastSlash);
}

function basename(p: string): string {
  const normalized = p.replace(/\\/g, "/").replace(/\/+$/, "");
  const lastSlash = normalized.lastIndexOf("/");
  return lastSlash === -1 ? normalized : normalized.slice(lastSlash + 1);
}

function extname(p: string): string {
  const base = basename(p);
  const dotIndex = base.lastIndexOf(".");
  if (dotIndex <= 0) return "";
  return base.slice(dotIndex);
}

/**
 * In-memory virtual file system for generating project structures
 * without writing to disk. Browser-compatible - no Node.js dependencies.
 */
export class VirtualFileSystem {
  private files: Map<string, string> = new Map();
  private directories: Set<string> = new Set();

  /**
   * Write a file to the virtual file system
   */
  writeFile(filePath: string, content: string): void {
    const normalizedPath = this.normalizePath(filePath);
    this.files.set(normalizedPath, content);

    // Ensure all parent directories exist
    let dir = dirname(normalizedPath);
    while (dir && dir !== "." && dir !== "/") {
      this.directories.add(dir);
      dir = dirname(dir);
    }
  }

  /**
   * Read a file from the virtual file system
   */
  readFile(filePath: string): string | undefined {
    return this.files.get(this.normalizePath(filePath));
  }

  /**
   * Check if a file exists
   */
  fileExists(filePath: string): boolean {
    return this.files.has(this.normalizePath(filePath));
  }

  /**
   * Check if a directory exists
   */
  directoryExists(dirPath: string): boolean {
    return this.directories.has(this.normalizePath(dirPath));
  }

  /**
   * Create a directory (and all parent directories)
   */
  mkdir(dirPath: string): void {
    const normalizedPath = this.normalizePath(dirPath);
    let dir = normalizedPath;
    while (dir && dir !== "." && dir !== "/") {
      this.directories.add(dir);
      dir = dirname(dir);
    }
  }

  /**
   * Get all file paths
   */
  getAllFiles(): string[] {
    return Array.from(this.files.keys()).sort();
  }

  /**
   * Get all directory paths
   */
  getAllDirectories(): string[] {
    return Array.from(this.directories).sort();
  }

  /**
   * Get file count
   */
  getFileCount(): number {
    return this.files.size;
  }

  /**
   * Get directory count
   */
  getDirectoryCount(): number {
    return this.directories.size;
  }

  /**
   * Check if a path exists (file or directory)
   */
  exists(path: string): boolean {
    const normalized = this.normalizePath(path);
    return this.files.has(normalized) || this.directories.has(normalized);
  }

  /**
   * Read and parse a JSON file
   */
  readJson<T = unknown>(filePath: string): T | undefined {
    const content = this.readFile(filePath);
    if (content === undefined) return undefined;
    try {
      return JSON.parse(content) as T;
    } catch {
      return undefined;
    }
  }

  /**
   * Write an object as JSON to a file
   */
  writeJson(filePath: string, data: unknown, spaces = 2): void {
    const content = JSON.stringify(data, null, spaces);
    this.writeFile(filePath, content);
  }

  /**
   * Delete a file
   */
  deleteFile(filePath: string): boolean {
    return this.files.delete(this.normalizePath(filePath));
  }

  /**
   * List immediate children of a directory
   */
  listDir(dirPath: string): string[] {
    const normalized = this.normalizePath(dirPath);
    const prefix = normalized ? `${normalized}/` : "";
    const children: Set<string> = new Set();

    // Find matching files
    for (const filePath of this.files.keys()) {
      if (normalized === "" || filePath.startsWith(prefix)) {
        const remaining = normalized === "" ? filePath : filePath.slice(prefix.length);
        const firstSegment = remaining.split("/")[0];
        if (firstSegment) children.add(firstSegment);
      }
    }

    // Find matching directories
    for (const dir of this.directories) {
      if (normalized === "" || dir.startsWith(prefix)) {
        const remaining = normalized === "" ? dir : dir.slice(prefix.length);
        const firstSegment = remaining.split("/")[0];
        if (firstSegment) children.add(firstSegment);
      }
    }

    return Array.from(children).sort();
  }

  /**
   * Convert the virtual file system to a tree structure
   */
  toTree(rootName: string = "project"): VirtualDirectory {
    const root: VirtualDirectory = {
      type: "directory",
      path: "",
      name: rootName,
      children: [],
    };

    // Build a map of path -> node for quick lookups
    const nodeMap = new Map<string, VirtualDirectory>();
    nodeMap.set("", root);

    // Sort paths to ensure parents are created before children
    const allPaths = [
      ...Array.from(this.directories).map((d) => ({ path: d, isFile: false })),
      ...Array.from(this.files.keys()).map((f) => ({ path: f, isFile: true })),
    ].sort((a, b) => a.path.localeCompare(b.path));

    for (const { path: itemPath, isFile } of allPaths) {
      const parentPath = dirname(itemPath);
      const name = basename(itemPath);

      // Ensure parent exists in node map
      let parent = nodeMap.get(parentPath === "." ? "" : parentPath);
      if (!parent) {
        // Create missing parent directories
        parent = this.ensureParentInMap(parentPath, nodeMap, root);
      }

      if (isFile) {
        const file: VirtualFile = {
          type: "file",
          path: itemPath,
          name,
          content: this.files.get(itemPath) || "",
          extension: this.getExtension(name),
        };
        parent.children.push(file);
      } else {
        const dir: VirtualDirectory = {
          type: "directory",
          path: itemPath,
          name,
          children: [],
        };
        parent.children.push(dir);
        nodeMap.set(itemPath, dir);
      }
    }

    // Sort children: directories first, then files, both alphabetically
    this.sortChildren(root);

    return root;
  }

  private ensureParentInMap(
    dirPath: string,
    nodeMap: Map<string, VirtualDirectory>,
    root: VirtualDirectory,
  ): VirtualDirectory {
    const parts = dirPath.split("/").filter(Boolean);
    let currentPath = "";
    let currentNode = root;

    for (const part of parts) {
      const nextPath = currentPath ? `${currentPath}/${part}` : part;
      let nextNode = nodeMap.get(nextPath);

      if (!nextNode) {
        nextNode = {
          type: "directory",
          path: nextPath,
          name: part,
          children: [],
        };
        currentNode.children.push(nextNode);
        nodeMap.set(nextPath, nextNode);
      }

      currentPath = nextPath;
      currentNode = nextNode;
    }

    return currentNode;
  }

  private sortChildren(node: VirtualDirectory): void {
    node.children.sort((a, b) => {
      // Directories first
      if (a.type === "directory" && b.type === "file") return -1;
      if (a.type === "file" && b.type === "directory") return 1;
      // Then alphabetically
      return a.name.localeCompare(b.name);
    });

    // Recursively sort children of directories
    for (const child of node.children) {
      if (child.type === "directory") {
        this.sortChildren(child);
      }
    }
  }

  private normalizePath(p: string): string {
    // Remove leading slash and normalize
    return p.replace(/^\/+/, "").replace(/\\/g, "/");
  }

  private getExtension(filename: string): string {
    const ext = extname(filename);
    return ext.startsWith(".") ? ext.slice(1) : ext;
  }

  /**
   * Clear all files and directories
   */
  clear(): void {
    this.files.clear();
    this.directories.clear();
  }
}
