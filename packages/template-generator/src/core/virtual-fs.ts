import { dirname, extname, normalize, join } from "pathe";

import type { VirtualDirectory, VirtualFile } from "../types";

/**
 * Pure-JS in-memory virtual file system.
 * Stores files as a Map<path, content> — no Node.js dependencies (memfs, Buffer, etc.)
 * so this works identically in browsers and Node.js.
 */
export class VirtualFileSystem {
  private _files: Map<string, string> = new Map();
  private _dirs: Set<string> = new Set(["/"]);
  private _sourcePathMap: Map<string, string> = new Map();

  writeFile(filePath: string, content: string, sourcePath?: string): void {
    const path = this.normalizePath(filePath);
    // Ensure parent directories exist
    this._ensureParentDirs(path);
    this._files.set(path, content);
    if (sourcePath) {
      this._sourcePathMap.set(path, sourcePath);
    }
  }

  readFile(filePath: string): string | undefined {
    return this._files.get(this.normalizePath(filePath));
  }

  exists(path: string): boolean {
    const p = this.normalizePath(path);
    return this._files.has(p) || this._dirs.has(p);
  }

  fileExists(filePath: string): boolean {
    return this._files.has(this.normalizePath(filePath));
  }

  directoryExists(dirPath: string): boolean {
    return this._dirs.has(this.normalizePath(dirPath));
  }

  mkdir(dirPath: string): void {
    const path = this.normalizePath(dirPath);
    this._ensureParentDirs(path);
    this._dirs.add(path);
  }

  deleteFile(filePath: string): boolean {
    const path = this.normalizePath(filePath);
    this._sourcePathMap.delete(path);
    return this._files.delete(path);
  }

  listDir(dirPath: string): string[] {
    const dir = this.normalizePath(dirPath) || "/";
    const names = new Set<string>();
    const prefix = dir === "/" ? "/" : dir + "/";

    for (const path of this._files.keys()) {
      if (path.startsWith(prefix)) {
        const rest = path.slice(prefix.length);
        const name = rest.split("/")[0];
        if (name) names.add(name);
      }
    }
    for (const path of this._dirs) {
      if (path.startsWith(prefix)) {
        const rest = path.slice(prefix.length);
        const name = rest.split("/")[0];
        if (name) names.add(name);
      }
    }

    return [...names].sort();
  }

  readJson<T = unknown>(filePath: string): T | undefined {
    const content = this.readFile(filePath);
    if (!content) return undefined;
    try {
      return JSON.parse(content) as T;
    } catch {
      return undefined;
    }
  }

  writeJson(filePath: string, data: unknown, spaces = 2): void {
    this.writeFile(filePath, JSON.stringify(data, null, spaces) + "\n");
  }

  getAllFiles(): string[] {
    return [...this._files.keys()].map((f) => f.replace(/^\//, "")).sort();
  }

  getAllDirectories(): string[] {
    return [...this._dirs]
      .filter((d) => d !== "/")
      .map((d) => d.replace(/^\//, ""))
      .sort();
  }

  getFileCount(): number {
    return this._files.size;
  }

  getDirectoryCount(): number {
    // Exclude root "/"
    return this._dirs.size - 1;
  }

  toTree(rootName = "project"): VirtualDirectory {
    const root: VirtualDirectory = { type: "directory", path: "", name: rootName, children: [] };
    this._buildTree("/", root);
    this._sortChildren(root);
    return root;
  }

  clear(): void {
    this._files.clear();
    this._dirs.clear();
    this._dirs.add("/");
    this._sourcePathMap.clear();
  }

  /** Returns entries in a directory (like readdirSync with withFileTypes). */
  private _readDir(dir: string): Array<{ name: string; isFile: boolean }> {
    const prefix = dir === "/" ? "/" : dir + "/";
    const entries = new Map<string, boolean>(); // name → isFile

    for (const path of this._files.keys()) {
      if (path.startsWith(prefix)) {
        const rest = path.slice(prefix.length);
        const name = rest.split("/")[0];
        if (name && !rest.includes("/", name.length + 1) && rest === name) {
          entries.set(name, true);
        } else if (name) {
          if (!entries.has(name)) entries.set(name, false);
        }
      }
    }
    for (const path of this._dirs) {
      if (path !== dir && path.startsWith(prefix)) {
        const rest = path.slice(prefix.length);
        const name = rest.split("/")[0];
        if (name && !entries.has(name)) entries.set(name, false);
      }
    }

    return [...entries.entries()].map(([name, isFile]) => ({ name, isFile }));
  }

  private _buildTree(dir: string, parent: VirtualDirectory): void {
    for (const entry of this._readDir(dir)) {
      const fullPath = join(dir, entry.name);
      const relativePath = fullPath.replace(/^\//, "");

      if (!entry.isFile) {
        const dirNode: VirtualDirectory = {
          type: "directory",
          path: relativePath,
          name: entry.name,
          children: [],
        };
        parent.children.push(dirNode);
        this._buildTree(fullPath, dirNode);
      } else {
        const content = this._files.get(fullPath) ?? "";
        const sourcePath = this._sourcePathMap.get(fullPath);
        const fileNode: VirtualFile = {
          type: "file",
          path: relativePath,
          name: entry.name,
          content,
          extension: extname(entry.name).slice(1),
        };
        if (sourcePath) {
          fileNode.sourcePath = sourcePath;
        }
        parent.children.push(fileNode);
      }
    }
  }

  private _sortChildren(node: VirtualDirectory): void {
    node.children.sort((a, b) => {
      if (a.type === "directory" && b.type === "file") return -1;
      if (a.type === "file" && b.type === "directory") return 1;
      return a.name.localeCompare(b.name);
    });
    for (const child of node.children) {
      if (child.type === "directory") this._sortChildren(child);
    }
  }

  private _ensureParentDirs(filePath: string): void {
    let dir = dirname(filePath);
    while (dir && dir !== "/" && !this._dirs.has(dir)) {
      this._dirs.add(dir);
      dir = dirname(dir);
    }
  }

  private normalizePath(p: string): string {
    return "/" + normalize(p).replace(/^\/+/, "");
  }
}
