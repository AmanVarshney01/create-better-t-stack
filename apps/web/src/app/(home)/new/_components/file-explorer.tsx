"use client";

import type { VirtualFile, VirtualDirectory } from "@better-t-stack/template-generator";
import { useMemo } from "react";

import { Tree, Folder, File } from "@/components/ui/file-tree";
export type { VirtualFile, VirtualDirectory } from "@better-t-stack/template-generator";

interface FileExplorerProps {
  root: VirtualDirectory;
  selectedPath: string | null;
  onSelectFile: (file: VirtualFile) => void;
}

function collectInitialExpandedItems(node: VirtualDirectory, depth: number = 0): string[] {
  const result: string[] = [];
  if (depth < 2) {
    result.push(node.path);
  }
  for (const child of node.children) {
    if (child.type === "directory") {
      result.push(...collectInitialExpandedItems(child, depth + 1));
    }
  }
  return result;
}

export function FileExplorer({ root, selectedPath, onSelectFile }: FileExplorerProps) {
  const initialExpandedItems = useMemo(() => collectInitialExpandedItems(root), [root]);

  return (
    <div className="h-full overflow-auto font-mono text-[13px]">
      <Tree
        initialExpandedItems={initialExpandedItems}
        initialSelectedId={selectedPath ?? undefined}
        indicator={false}
        className="p-2"
      >
        <DirectoryContents node={root} selectedPath={selectedPath} onSelectFile={onSelectFile} />
      </Tree>
    </div>
  );
}

interface DirectoryContentsProps {
  node: VirtualDirectory;
  selectedPath: string | null;
  onSelectFile: (file: VirtualFile) => void;
}

function DirectoryContents({ node, selectedPath, onSelectFile }: DirectoryContentsProps) {
  return (
    <Folder element={node.name} value={node.path}>
      {node.children.map((child) =>
        child.type === "directory" ? (
          <DirectoryContents
            key={child.path}
            node={child}
            selectedPath={selectedPath}
            onSelectFile={onSelectFile}
          />
        ) : (
          <File
            key={child.path}
            value={child.path}
            isSelect={selectedPath === child.path}
            onClick={() => onSelectFile(child)}
            className="max-w-full text-left"
          >
            <span className="wrap-anywhere">{child.name}</span>
          </File>
        ),
      )}
    </Folder>
  );
}
