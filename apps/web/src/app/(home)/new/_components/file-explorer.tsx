"use client";

import { ChevronDown, ChevronRight, File, Folder, FolderOpen } from "lucide-react";
import { useState, memo } from "react";

import { cn } from "@/lib/utils";

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

interface FileExplorerProps {
  root: VirtualDirectory;
  selectedPath: string | null;
  onSelectFile: (file: VirtualFile) => void;
}

export function FileExplorer({ root, selectedPath, onSelectFile }: FileExplorerProps) {
  return (
    <div className="h-full overflow-auto text-sm">
      <div className="p-2">
        <DirectoryNode
          node={root}
          depth={0}
          selectedPath={selectedPath}
          onSelectFile={onSelectFile}
          defaultExpanded
        />
      </div>
    </div>
  );
}

interface DirectoryNodeProps {
  node: VirtualDirectory;
  depth: number;
  selectedPath: string | null;
  onSelectFile: (file: VirtualFile) => void;
  defaultExpanded?: boolean;
}

const DirectoryNode = memo(function DirectoryNode({
  node,
  depth,
  selectedPath,
  onSelectFile,
  defaultExpanded = false,
}: DirectoryNodeProps) {
  const [expanded, setExpanded] = useState(defaultExpanded || depth < 2);

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  return (
    <div>
      <button
        type="button"
        className={cn(
          "flex w-full items-center gap-1 rounded px-1 py-0.5 text-left hover:bg-muted/50",
          "transition-colors",
        )}
        style={{ paddingLeft: `${depth * 12 + 4}px` }}
        onClick={handleToggle}
      >
        {expanded ? (
          <ChevronDown className="h-3 w-3 shrink-0 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground" />
        )}
        {expanded ? (
          <FolderOpen className="h-4 w-4 shrink-0 text-primary" />
        ) : (
          <Folder className="h-4 w-4 shrink-0 text-primary" />
        )}
        <span className="truncate font-medium">{node.name}</span>
      </button>

      {expanded && (
        <div>
          {node.children.map((child) =>
            child.type === "directory" ? (
              <DirectoryNode
                key={child.path}
                node={child}
                depth={depth + 1}
                selectedPath={selectedPath}
                onSelectFile={onSelectFile}
              />
            ) : (
              <FileNode
                key={child.path}
                node={child}
                depth={depth + 1}
                isSelected={selectedPath === child.path}
                onSelect={onSelectFile}
              />
            ),
          )}
        </div>
      )}
    </div>
  );
});

interface FileNodeProps {
  node: VirtualFile;
  depth: number;
  isSelected: boolean;
  onSelect: (file: VirtualFile) => void;
}

const FileNode = memo(function FileNode({ node, depth, isSelected, onSelect }: FileNodeProps) {
  const fileColor = getFileColor(node.extension);

  return (
    <button
      type="button"
      className={cn(
        "flex w-full items-center gap-1 rounded px-1 py-0.5 text-left",
        "transition-colors",
        isSelected
          ? "bg-primary/20 text-primary"
          : "hover:bg-muted/50 text-muted-foreground hover:text-foreground",
      )}
      style={{ paddingLeft: `${depth * 12 + 16}px` }}
      onClick={() => onSelect(node)}
    >
      <File className={cn("h-4 w-4 shrink-0", fileColor)} />
      <span className="truncate">{node.name}</span>
    </button>
  );
});

function getFileColor(extension: string): string {
  const colorMap: Record<string, string> = {
    // TypeScript/JavaScript - use primary/accent variations
    ts: "text-primary",
    tsx: "text-primary/80",
    js: "text-accent",
    jsx: "text-accent/80",
    mjs: "text-accent",
    cjs: "text-accent",
    mts: "text-primary",
    cts: "text-primary",

    // Vue - use accent
    vue: "text-accent",

    // Svelte - use muted primary
    svelte: "text-primary/70",

    // Solid - use primary
    solid: "text-primary",

    // Data formats - use muted colors
    json: "text-muted-foreground",
    yaml: "text-muted-foreground",
    yml: "text-muted-foreground",
    toml: "text-muted-foreground",
    xml: "text-muted-foreground",

    // Markup/Styling - use theme colors
    md: "text-muted-foreground",
    mdx: "text-muted-foreground",
    css: "text-primary/70",
    scss: "text-primary/60",
    sass: "text-primary/60",
    less: "text-primary/60",
    html: "text-muted-foreground",
    hbs: "text-muted-foreground",

    // Database/ORM - use primary variations
    prisma: "text-primary/80",
    sql: "text-primary/70",

    // Config files - use muted
    env: "text-muted-foreground",
    gitignore: "text-muted-foreground",
    npmrc: "text-muted-foreground",
    nvmrc: "text-muted-foreground",
    editorconfig: "text-muted-foreground",
    prettierrc: "text-muted-foreground",
    eslintrc: "text-muted-foreground",

    // Images - use muted
    svg: "text-muted-foreground",
    png: "text-muted-foreground",
    jpg: "text-muted-foreground",
    jpeg: "text-muted-foreground",
    gif: "text-muted-foreground",
    ico: "text-muted-foreground",
    webp: "text-muted-foreground",

    // Other - use muted
    sh: "text-muted-foreground",
    bash: "text-muted-foreground",
    zsh: "text-muted-foreground",
    dockerfile: "text-muted-foreground",
    lock: "text-muted-foreground",
    txt: "text-muted-foreground",
  };
  return colorMap[extension.toLowerCase()] || "text-muted-foreground";
}
