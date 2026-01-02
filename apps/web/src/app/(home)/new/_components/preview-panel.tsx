"use client";

import { Loader2, FolderTree, FileCode2 } from "lucide-react";
import { useEffect, useState, useCallback } from "react";

import type { StackState } from "@/lib/constant";

import { CodeViewer, CodeViewerEmpty } from "./code-viewer";
import { FileExplorer, type VirtualFile, type VirtualDirectory } from "./file-explorer";

interface PreviewPanelProps {
  stack: StackState;
  selectedFilePath: string | null;
  onSelectFile: (filePath: string | null) => void;
}

interface PreviewResponse {
  success: boolean;
  tree?: {
    root: VirtualDirectory;
    fileCount: number;
    directoryCount: number;
  };
  error?: string;
}

export function PreviewPanel({ stack, selectedFilePath, onSelectFile }: PreviewPanelProps) {
  const [tree, setTree] = useState<VirtualDirectory | null>(null);
  const [fileCount, setFileCount] = useState(0);
  const [directoryCount, setDirectoryCount] = useState(0);
  const [selectedFile, setSelectedFile] = useState<VirtualFile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPreview = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stack),
      });

      const data: PreviewResponse = await response.json();

      if (data.success && data.tree) {
        setTree(data.tree.root);
        setFileCount(data.tree.fileCount);
        setDirectoryCount(data.tree.directoryCount);

        // Restore selected file from query state if it exists
        if (selectedFilePath) {
          const file = findFileByPath(data.tree.root, selectedFilePath);
          if (file) {
            setSelectedFile(file);
          } else {
            setSelectedFile(null);
            onSelectFile(null);
          }
        } else {
          setSelectedFile(null);
        }
      } else {
        setError(data.error || "Failed to generate preview");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch preview");
    } finally {
      setIsLoading(false);
    }
  }, [stack]);

  // Debounced fetch on stack change
  useEffect(() => {
    const timeoutId = setTimeout(fetchPreview, 300);
    return () => clearTimeout(timeoutId);
  }, [fetchPreview]);

  const handleSelectFile = (file: VirtualFile) => {
    setSelectedFile(file);
    onSelectFile(file.path);
  };

  // Helper function to find a file by path in the tree
  function findFileByPath(node: VirtualDirectory, path: string): VirtualFile | null {
    for (const child of node.children) {
      if (child.type === "file" && child.path === path) {
        return child;
      }
      if (child.type === "directory") {
        const found = findFileByPath(child, path);
        if (found) return found;
      }
    }
    return null;
  }

  if (isLoading && !tree) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error && !tree) {
    return (
      <div className="flex h-full items-center justify-center text-destructive">
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (!tree) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        <p className="text-sm">Generating preview...</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Stats bar */}
      <div className="flex items-center gap-4 border-b border-border bg-muted/20 px-3 py-1.5">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <FolderTree className="h-3.5 w-3.5" />
          <span>{directoryCount} folders</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <FileCode2 className="h-3.5 w-3.5" />
          <span>{fileCount} files</span>
        </div>
        {isLoading && (
          <Loader2 className="ml-auto h-3.5 w-3.5 animate-spin text-muted-foreground" />
        )}
      </div>

      {/* Split view */}
      <div className="flex flex-1 overflow-hidden">
        {/* File explorer */}
        <div className="w-48 shrink-0 overflow-hidden border-r border-border md:w-56 lg:w-64">
          <FileExplorer
            root={tree}
            selectedPath={selectedFile?.path || selectedFilePath || null}
            onSelectFile={handleSelectFile}
          />
        </div>

        {/* Code viewer */}
        <div className="flex-1 overflow-hidden">
          {selectedFile ? (
            <CodeViewer
              filePath={selectedFile.path}
              content={selectedFile.content}
              extension={selectedFile.extension}
            />
          ) : (
            <CodeViewerEmpty />
          )}
        </div>
      </div>
    </div>
  );
}
