"use client";

import { Loader2, FolderTree, FileCode2, Info, ChevronLeft } from "lucide-react";
import { useEffect, useState, useCallback, useRef } from "react";

import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import type { StackState } from "@/lib/constant";
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
      <div className="flex h-full items-center justify-center rounded-[4px] border bg-fd-background">
        <div className="flex items-center gap-2 rounded-[4px] border px-3 py-2 font-mono text-[11px] text-fd-muted-foreground uppercase tracking-[0.08em]">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Rendering file tree
        </div>
      </div>
    );
  }

  if (error && !tree) {
    return (
      <div className="flex h-full items-center justify-center rounded-[4px] border bg-fd-background">
        <p className="rounded-[4px] border border-destructive px-3 py-2 font-mono text-[13px] text-destructive">
          {error}
        </p>
      </div>
    );
  }

  if (!tree) {
    return (
      <div className="flex h-full items-center justify-center rounded-[4px] border bg-fd-background text-fd-muted-foreground">
        <p className="font-mono text-[13px]">Generating preview...</p>
      </div>
    );
  }

  return (
    <div className="@container flex h-full flex-col overflow-hidden rounded-[4px] border bg-fd-background">
      {/* Stats bar */}
      <div className="@lg:gap-4 flex flex-wrap items-center gap-x-3 gap-y-1 border-b px-3 py-2">
        {/* Back button when the panel is too narrow for the split view */}
        {mobileView === "code" && selectedFile && (
          <button
            type="button"
            onClick={handleBackToTree}
            className="builder-focus-ring pointer-coarse:py-2 @lg:hidden flex items-center gap-1 py-0.5 font-mono text-[10px] text-fd-muted-foreground uppercase tracking-[0.10em] transition-colors duration-150 hover:text-fd-foreground"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span>Files</span>
          </button>
        )}
        <div
          className={cn(
            "flex shrink-0 items-center gap-1.5 font-mono text-[10px] text-fd-muted-foreground uppercase tracking-[0.10em] tabular-nums",
            mobileView === "code" && "@lg:flex hidden",
          )}
        >
          <FolderTree className="h-3.5 w-3.5" />
          <span>{directoryCount} folders</span>
        </div>
        <div
          className={cn(
            "flex shrink-0 items-center gap-1.5 font-mono text-[10px] text-fd-muted-foreground uppercase tracking-[0.10em] tabular-nums",
            mobileView === "code" && "@lg:flex hidden",
          )}
        >
          <FileCode2 className="h-3.5 w-3.5" />
          <span>{fileCount} files</span>
        </div>
        <span
          className={cn(
            "@lg:inline-flex hidden font-mono text-[10px] text-fd-muted-foreground uppercase tracking-[0.10em]",
          )}
        >
          {mobileView === "code" ? "Code view" : "Tree view"}
        </span>
        {/* Current file name, shown when the tree is hidden */}
        {mobileView === "code" && selectedFile && (
          <span className="@lg:hidden min-w-0 truncate font-mono text-[11px] text-fd-foreground">
            {selectedFile.path.split("/").pop()}
          </span>
        )}
        <div className="ml-auto flex shrink-0 items-center gap-2">
          <Tooltip>
            <TooltipTrigger className="pointer-coarse:py-2 flex items-center gap-1 font-mono text-[10px] text-fd-muted-foreground uppercase tracking-[0.10em] transition-colors duration-150 hover:text-fd-foreground">
              <Info className="h-3.5 w-3.5" />
              <span className="@lg:inline hidden">Preview info</span>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-xs">
              <p>
                This is a static template preview. Files are not formatted. Some features like
                database provider setup (Turso, Neon, Supabase, etc.) and certain addons (Fumadocs,
                Starlight, Tauri, etc.) require CLI execution and are not shown here.
              </p>
            </TooltipContent>
          </Tooltip>
          {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin text-fd-muted-foreground" />}
        </div>
      </div>

      {/* Split view once the panel is wide enough, toggle while it is narrow */}
      <div className="flex flex-1 overflow-hidden">
        {/* File explorer - full width while narrow, fixed rail once split */}
        <div
          className={cn(
            "@lg:border-r shrink-0 overflow-hidden",
            "@lg:w-48 @xl:w-56 @3xl:w-64 w-full",
            mobileView === "code" ? "@lg:block hidden" : "block",
          )}
        >
          <FileExplorer
            root={tree}
            selectedPath={selectedFile?.path || selectedFilePath || null}
            onSelectFile={handleSelectFile}
          />
        </div>

        {/* Code viewer - full width while narrow, right pane once split */}
        <div
          className={cn(
            "min-w-0 flex-1 overflow-hidden bg-fd-background",
            mobileView === "tree" ? "@lg:block hidden" : "block",
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
