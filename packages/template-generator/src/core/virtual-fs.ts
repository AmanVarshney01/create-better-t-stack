import type { Dirent } from "node:fs";

import { memfs } from "memfs";
import { dirname, extname, normalize, join } from "pathe";

import type { VirtualDirectory, VirtualFile } from "../types";

export class VirtualFileSystem {
  private _fs: ReturnType<typeof memfs>["fs"];
  private _vol: ReturnType<typeof memfs>["vol"];

  constructor() {
    const { fs, vol } = memfs();
    this._fs = fs;
    this._vol = vol;
  }

  writeFile(filePath: string, content: string): void {
    const path = this.normalizePath(filePath);
    const dir = dirname(path);
    if (dir && dir !== "/" && dir !== ".") {
      this._fs.mkdirSync(dir, { recursive: true });
    }
    this._fs.writeFileSync(path, content, { encoding: "utf-8" });
  }

  readFile(filePath: string): string | undefined {
    try {
      return this._fs.readFileSync(this.normalizePath(filePath), "utf-8") as string;
    } catch {
      return undefined;
    }
  }

  exists(path: string): boolean {
    try {
      this._fs.statSync(this.normalizePath(path));
      return true;
    } catch {
      return false;
    }
  }

  fileExists(filePath: string): boolean {
    try {
      return this._fs.statSync(this.normalizePath(filePath)).isFile();
    } catch {
      return false;
    }
  }

  directoryExists(dirPath: string): boolean {
    try {
      return this._fs.statSync(this.normalizePath(dirPath)).isDirectory();
    } catch {
      return false;
    }
  }

  mkdir(dirPath: string): void {
    this._fs.mkdirSync(this.normalizePath(dirPath), { recursive: true });
  }

  deleteFile(filePath: string): boolean {
    try {
      this._fs.unlinkSync(this.normalizePath(filePath));
      return true;
    } catch {
      return false;
    }
  }

  listDir(dirPath: string): string[] {
    try {
      return (this._fs.readdirSync(this.normalizePath(dirPath) || "/") as string[]).sort();
    } catch {
      return [];
    }
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
    this.writeFile(filePath, JSON.stringify(data, null, spaces));
  }

  getAllFiles(): string[] {
    const files: string[] = [];
    this.walkDir("/", files, true);
    return files.sort();
  }

  getAllDirectories(): string[] {
    const dirs: string[] = [];
    this.walkDir("/", dirs, false);
    return dirs.filter((d) => d !== "/").sort();
  }

  getFileCount(): number {
    return this.getAllFiles().length;
  }

  getDirectoryCount(): number {
    return this.getAllDirectories().length;
  }

  toTree(rootName = "project"): VirtualDirectory {
    const root: VirtualDirectory = { type: "directory", path: "", name: rootName, children: [] };
    this.buildTree("/", root);
    this.sortChildren(root);
    return root;
  }

  clear(): void {
    const { fs, vol } = memfs();
    this._fs = fs;
    this._vol = vol;
  }

  getVolume() {
    return this._vol;
  }
  getFs() {
    return this._fs;
  }

  private walkDir(dir: string, results: string[], filesOnly: boolean): void {
    try {
      for (const entry of this._fs.readdirSync(dir, { withFileTypes: true }) as Dirent[]) {
        const fullPath = join(dir, entry.name);
        const relativePath = fullPath.replace(/^\//, "");
        if (entry.isDirectory()) {
          if (!filesOnly) results.push(relativePath);
          this.walkDir(fullPath, results, filesOnly);
        } else if (entry.isFile() && filesOnly) {
          results.push(relativePath);
        }
      }
    } catch {}
  }

  private buildTree(dir: string, parent: VirtualDirectory): void {
    try {
      for (const entry of this._fs.readdirSync(dir, { withFileTypes: true }) as Dirent[]) {
        const fullPath = join(dir, entry.name);
        const relativePath = fullPath.replace(/^\//, "");
        if (entry.isDirectory()) {
          const dirNode: VirtualDirectory = {
            type: "directory",
            path: relativePath,
            name: entry.name,
            children: [],
          };
          parent.children.push(dirNode);
          this.buildTree(fullPath, dirNode);
        } else if (entry.isFile()) {
          const content = this._fs.readFileSync(fullPath, "utf-8") as string;
          parent.children.push({
            type: "file",
            path: relativePath,
            name: entry.name,
            content,
            extension: extname(entry.name).slice(1),
          } as VirtualFile);
        }
      }
    } catch {}
  }

  private sortChildren(node: VirtualDirectory): void {
    node.children.sort((a, b) => {
      if (a.type === "directory" && b.type === "file") return -1;
      if (a.type === "file" && b.type === "directory") return 1;
      return a.name.localeCompare(b.name);
    });
    for (const child of node.children) {
      if (child.type === "directory") this.sortChildren(child);
    }
  }

  private normalizePath(p: string): string {
    return "/" + normalize(p).replace(/^\/+/, "");
  }
}
