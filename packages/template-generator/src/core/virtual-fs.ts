import type { Dirent } from "node:fs";

import { memfs } from "memfs";
import { dirname, basename, extname, normalize, join } from "pathe";

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
    const normalizedPath = this.normalizePath(filePath);
    const dir = dirname(normalizedPath);

    if (dir && dir !== "/" && dir !== ".") {
      this._fs.mkdirSync(dir, { recursive: true });
    }

    this._fs.writeFileSync(normalizedPath, content, { encoding: "utf-8" });
  }

  readFile(filePath: string): string | undefined {
    const normalizedPath = this.normalizePath(filePath);
    try {
      return this._fs.readFileSync(normalizedPath, "utf-8") as string;
    } catch {
      return undefined;
    }
  }

  fileExists(filePath: string): boolean {
    const normalizedPath = this.normalizePath(filePath);
    try {
      const stat = this._fs.statSync(normalizedPath);
      return stat.isFile();
    } catch {
      return false;
    }
  }

  directoryExists(dirPath: string): boolean {
    const normalizedPath = this.normalizePath(dirPath);
    try {
      const stat = this._fs.statSync(normalizedPath);
      return stat.isDirectory();
    } catch {
      return false;
    }
  }

  mkdir(dirPath: string): void {
    const normalizedPath = this.normalizePath(dirPath);
    this._fs.mkdirSync(normalizedPath, { recursive: true });
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

  private walkDir(dir: string, results: string[], filesOnly: boolean): void {
    try {
      const entries = this._fs.readdirSync(dir, { withFileTypes: true }) as Dirent[];
      for (const entry of entries) {
        const fullPath = join(dir, entry.name);
        const relativePath = fullPath.replace(/^\//, "");

        if (entry.isDirectory()) {
          if (!filesOnly) {
            results.push(relativePath);
          }
          this.walkDir(fullPath, results, filesOnly);
        } else if (entry.isFile() && filesOnly) {
          results.push(relativePath);
        }
      }
    } catch {
      // Directory doesn't exist
    }
  }

  getFileCount(): number {
    return this.getAllFiles().length;
  }

  getDirectoryCount(): number {
    return this.getAllDirectories().length;
  }

  exists(path: string): boolean {
    const normalizedPath = this.normalizePath(path);
    try {
      this._fs.statSync(normalizedPath);
      return true;
    } catch {
      return false;
    }
  }

  readJson<T = unknown>(filePath: string): T | undefined {
    const content = this.readFile(filePath);
    if (content === undefined) return undefined;
    try {
      return JSON.parse(content) as T;
    } catch {
      return undefined;
    }
  }

  writeJson(filePath: string, data: unknown, spaces = 2): void {
    const content = JSON.stringify(data, null, spaces);
    this.writeFile(filePath, content);
  }

  deleteFile(filePath: string): boolean {
    const normalizedPath = this.normalizePath(filePath);
    try {
      this._fs.unlinkSync(normalizedPath);
      return true;
    } catch {
      return false;
    }
  }

  listDir(dirPath: string): string[] {
    const normalizedPath = this.normalizePath(dirPath) || "/";
    try {
      const entries = this._fs.readdirSync(normalizedPath) as string[];
      return entries.sort();
    } catch {
      return [];
    }
  }

  toTree(rootName: string = "project"): VirtualDirectory {
    const root: VirtualDirectory = {
      type: "directory",
      path: "",
      name: rootName,
      children: [],
    };

    this.buildTree("/", root);
    this.sortChildren(root);

    return root;
  }

  private buildTree(dir: string, parent: VirtualDirectory): void {
    try {
      const entries = this._fs.readdirSync(dir, { withFileTypes: true }) as Dirent[];

      for (const entry of entries) {
        const fullPath = join(dir, entry.name);
        const relativePath = fullPath.replace(/^\//, "");
        const name = entry.name;

        if (entry.isDirectory()) {
          const dirNode: VirtualDirectory = {
            type: "directory",
            path: relativePath,
            name,
            children: [],
          };
          parent.children.push(dirNode);
          this.buildTree(fullPath, dirNode);
        } else if (entry.isFile()) {
          const content = this._fs.readFileSync(fullPath, "utf-8") as string;
          const file: VirtualFile = {
            type: "file",
            path: relativePath,
            name,
            content,
            extension: this.getExtension(name),
          };
          parent.children.push(file);
        }
      }
    } catch {
      // Directory doesn't exist or can't be read
    }
  }

  private sortChildren(node: VirtualDirectory): void {
    node.children.sort((a, b) => {
      if (a.type === "directory" && b.type === "file") return -1;
      if (a.type === "file" && b.type === "directory") return 1;
      return a.name.localeCompare(b.name);
    });

    for (const child of node.children) {
      if (child.type === "directory") {
        this.sortChildren(child);
      }
    }
  }

  private normalizePath(p: string): string {
    const normalized = normalize(p).replace(/^\/+/, "");
    return "/" + normalized;
  }

  private getExtension(filename: string): string {
    const ext = extname(filename);
    return ext.startsWith(".") ? ext.slice(1) : ext;
  }

  clear(): void {
    const { fs, vol } = memfs();
    this._fs = fs;
    this._vol = vol;
  }

  getVolume(): ReturnType<typeof memfs>["vol"] {
    return this._vol;
  }

  getFs(): ReturnType<typeof memfs>["fs"] {
    return this._fs;
  }
}
