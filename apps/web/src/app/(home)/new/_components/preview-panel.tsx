"use client";

import { Loader2, FolderTree, FileCode2, Info, ChevronLeft } from "lucide-react";
import { useEffect, useState, useCallback, useRef } from "react";

import type { StackState } from "@/lib/constant";

import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

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
  // On mobile, track whether we're viewing the file tree or the code
  const [mobileView, setMobileView] = useState<"tree" | "code">("tree");
  const requestIdRef = useRef(0);
  const abortRef = useRef<AbortController | null>(null);
  const selectedFilePathRef = useRef<string | null>(selectedFilePath);
  const onSelectFileRef = useRef(onSelectFile);

  useEffect(() => {
    selectedFilePathRef.current = selectedFilePath;
  }, [selectedFilePath]);

  useEffect(() => {
    onSelectFileRef.current = onSelectFile;
  }, [onSelectFile]);

  const fetchPreview = useCallback(async () => {
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stack),
        signal: controller.signal,
      });

      if (requestId !== requestIdRef.current) return;

      const data: PreviewResponse = await response.json();

      if (requestId !== requestIdRef.current) return;

      if (data.success && data.tree) {
        setTree(data.tree.root);
        setFileCount(data.tree.fileCount);
        setDirectoryCount(data.tree.directoryCount);

        // Restore selected file from query state if it exists
        const currentSelectedFilePath = selectedFilePathRef.current;
        if (currentSelectedFilePath) {
          const file = findFileByPath(data.tree.root, currentSelectedFilePath);
          if (file) {
            setSelectedFile(file);
            setMobileView("code");
          } else {
            setSelectedFile(null);
            onSelectFileRef.current(null);
            setMobileView("tree");
          }
        } else {
          setSelectedFile(null);
          setMobileView("tree");
        }
      } else {
        setError(data.error || "Failed to generate preview");
      }
    } catch (err) {
      if (controller.signal.aborted) return;
      if (requestId !== requestIdRef.current) return;
      setError(err instanceof Error ? err.message : "Failed to fetch preview");
    } finally {
      if (requestId === requestIdRef.current) {
        setIsLoading(false);
      }
    }
  }, [stack]);

  // Debounced fetch on stack change
  useEffect(() => {
    const timeoutId = setTimeout(fetchPreview, 300);
    return () => {
      clearTimeout(timeoutId);
      abortRef.current?.abort();
    };
  }, [fetchPreview]);

  const handleSelectFile = (file: VirtualFile) => {
    setSelectedFile(file);
    onSelectFile(file.path);
    setMobileView("code");
  };

  const handleBackToTree = () => {
    setMobileView("tree");
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
      <div className="flex h-full items-center justify-center rounded-lg border border-border bg-fd-background">
        <div className="flex items-center gap-2 rounded border border-border bg-muted/20 px-3 py-2 font-mono text-muted-foreground text-xs">
          <Loader2 className="h-4 w-4 animate-spin" />
          Rendering file tree
        </div>
      </div>
    );
  }

  if (error && !tree) {
    return (
      <div className="flex h-full items-center justify-center rounded-lg border border-border bg-fd-background">
        <p className="rounded border border-destructive/30 bg-destructive/10 px-3 py-2 font-mono text-destructive text-sm">
          {error}
        </p>
      </div>
    );
  }

  if (!tree) {
    return (
      <div className="flex h-full items-center justify-center rounded-lg border border-border bg-fd-background text-muted-foreground">
        <p className="font-mono text-sm">Generating preview...</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border border-border/80 bg-fd-background">
      {/* Stats bar */}
      <div className="flex items-center gap-2 border-border border-b bg-muted/20 px-3 py-2 sm:gap-4">
        {/* Mobile back button when viewing code */}
        {mobileView === "code" && selectedFile && (
          <button
            type="button"
            onClick={handleBackToTree}
            className="builder-focus-ring flex items-center gap-1 rounded px-1 py-0.5 font-mono text-xs text-muted-foreground hover:text-foreground sm:hidden"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Files</span>
          </button>
        )}
        <div
          className={cn(
            "flex items-center gap-1.5 text-xs text-muted-foreground",
            mobileView === "code" && "hidden sm:flex",
          )}
        >
          <FolderTree className="h-3.5 w-3.5" />
          <span>{directoryCount} folders</span>
        </div>
        <div
          className={cn(
            "flex items-center gap-1.5 text-xs text-muted-foreground",
            mobileView === "code" && "hidden sm:flex",
          )}
        >
          <FileCode2 className="h-3.5 w-3.5" />
          <span>{fileCount} files</span>
        </div>
        <span
          className={cn(
            "hidden rounded border border-border/70 bg-fd-background px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground uppercase tracking-wide sm:inline-flex",
          )}
        >
          {mobileView === "code" ? "Code view" : "Tree view"}
        </span>
        {/* Show current file name on mobile */}
        {mobileView === "code" && selectedFile && (
          <span className="truncate font-mono text-xs text-foreground sm:hidden">
            {selectedFile.path.split("/").pop()}
          </span>
        )}
        <div className="ml-auto flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
              <Info className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Preview info</span>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-xs">
              <p>
                This is a static template preview. Files are not formatted. Some features like
                database provider setup (Turso, Neon, Supabase, etc.) and certain addons (Fumadocs,
                Starlight, Tauri, etc.) require CLI execution and are not shown here.
              </p>
            </TooltipContent>
          </Tooltip>
          {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />}
        </div>
      </div>

      {/* Split view - side by side on desktop, toggle on mobile */}
      <div className="flex flex-1 overflow-hidden">
        {/* File explorer - full width on mobile when tree view, hidden when code view */}
        <div
          className={cn(
            "shrink-0 overflow-hidden border-border sm:border-r",
            "w-full sm:w-48 md:w-56 lg:w-64",
            mobileView === "code" ? "hidden sm:block" : "block",
          )}
        >
          <FileExplorer
            root={tree}
            selectedPath={selectedFile?.path || selectedFilePath || null}
            onSelectFile={handleSelectFile}
          />
        </div>

        {/* Code viewer - full width on mobile when code view, hidden when tree view */}
        <div
          className={cn(
            "flex-1 overflow-hidden bg-fd-background/80",
            mobileView === "tree" ? "hidden sm:block" : "block",
          )}
        >
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
