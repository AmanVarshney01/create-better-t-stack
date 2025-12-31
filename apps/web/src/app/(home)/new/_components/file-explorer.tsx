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
          <FolderOpen className="h-4 w-4 shrink-0 text-amber-500" />
        ) : (
          <Folder className="h-4 w-4 shrink-0 text-amber-500" />
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
    // TypeScript/JavaScript
    ts: "text-blue-500",
    tsx: "text-blue-400",
    js: "text-yellow-500",
    jsx: "text-yellow-400",
    mjs: "text-yellow-500",
    cjs: "text-yellow-500",
    mts: "text-blue-500",
    cts: "text-blue-500",

    // Vue
    vue: "text-green-500",

    // Svelte
    svelte: "text-orange-500",

    // Solid
    solid: "text-blue-600",

    // Data formats
    json: "text-amber-500",
    yaml: "text-red-400",
    yml: "text-red-400",
    toml: "text-orange-400",
    xml: "text-orange-300",

    // Markup/Styling
    md: "text-gray-400",
    mdx: "text-yellow-400",
    css: "text-purple-500",
    scss: "text-pink-400",
    sass: "text-pink-400",
    less: "text-indigo-400",
    html: "text-orange-500",
    hbs: "text-orange-400",

    // Database/ORM
    prisma: "text-indigo-500",
    sql: "text-cyan-500",

    // Config files
    env: "text-emerald-500",
    gitignore: "text-gray-500",
    npmrc: "text-red-400",
    nvmrc: "text-green-400",
    editorconfig: "text-gray-400",
    prettierrc: "text-pink-400",
    eslintrc: "text-purple-400",

    // Images
    svg: "text-pink-500",
    png: "text-green-400",
    jpg: "text-green-400",
    jpeg: "text-green-400",
    gif: "text-green-400",
    ico: "text-green-400",
    webp: "text-green-400",

    // Other
    sh: "text-green-500",
    bash: "text-green-500",
    zsh: "text-green-500",
    dockerfile: "text-blue-400",
    lock: "text-gray-500",
    txt: "text-gray-400",
  };
  return colorMap[extension.toLowerCase()] || "text-muted-foreground";
}
