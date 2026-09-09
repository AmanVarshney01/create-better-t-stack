"use client";

import { Loader2, FolderTree, FileCode2, Info, ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";

import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { scrubMessage, track } from "@/lib/analytics";
import type { StackState } from "@/lib/constant";
import { orpc } from "@/lib/orpc";
import { StackStateSchema } from "@/lib/stack-schema";
import { formatProjectName } from "@/lib/stack-utils";
import { validateProjectName } from "@/lib/stack-validation";
import { cn } from "@/lib/utils";

import { CodeViewer, CodeViewerEmpty } from "./code-viewer";
import { FileExplorer, type VirtualFile, type VirtualDirectory } from "./file-explorer";

type Preview = Awaited<ReturnType<typeof orpc.preview>>;

export function useStackPreview(stack: StackState, enabled: boolean) {
  const [data, setData] = useState<Preview | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const nameError = validateProjectName(formatProjectName(stack.projectName));
  const requestKey = enabled && !nameError ? JSON.stringify(stack) : null;

  useEffect(() => {
    if (!requestKey) return;
    const controller = new AbortController();
    setIsLoading(true);
    setError(null);
    const timeout = setTimeout(async () => {
      try {
        const input = StackStateSchema.parse(JSON.parse(requestKey));
        const preview = await orpc.preview(input, { signal: controller.signal });
        if (!controller.signal.aborted) setData(preview);
      } catch (cause) {
        if (controller.signal.aborted) return;
        const message = cause instanceof Error ? cause.message : "Unable to load preview";
        setError(message);
        track("preview_error", { message: scrubMessage(message) });
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }, 300);
    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [requestKey, attempt]);

  return {
    data,
    isLoading: !nameError && isLoading,
    error: nameError ?? error,
    canRetry: !nameError,
    retry: () => setAttempt((value) => value + 1),
  };
}

interface PreviewPanelProps {
  preview: ReturnType<typeof useStackPreview>;
  selectedFilePath: string | null;
  onSelectFile: (filePath: string | null) => void;
}

function findFileByPath(node: VirtualDirectory, path: string): VirtualFile | null {
  for (const child of node.children) {
    if (child.type === "file" && child.path === path) return child;
    if (child.type === "directory") {
      const found = findFileByPath(child, path);
      if (found) return found;
    }
  }
  return null;
}

export function PreviewPanel({ preview, selectedFilePath, onSelectFile }: PreviewPanelProps) {
  const { data, isLoading, error, canRetry, retry } = preview;
  const tree = data?.root ?? null;
  const fileCount = data?.fileCount ?? 0;
  const directoryCount = data?.directoryCount ?? 0;
  const selectedFile = tree && selectedFilePath ? findFileByPath(tree, selectedFilePath) : null;
  const [mobileView, setMobileView] = useState<"tree" | "code">("tree");

  useEffect(() => {
    setMobileView(selectedFilePath ? "code" : "tree");
  }, [selectedFilePath]);

  useEffect(() => {
    if (tree && !isLoading && !error && selectedFilePath && !selectedFile) {
      onSelectFile(null);
    }
  }, [tree, isLoading, error, selectedFilePath, selectedFile, onSelectFile]);

  const handleSelectFile = (file: VirtualFile) => {
    track("preview_file_open", { path: file.path, extension: file.extension });
    onSelectFile(file.path);
    setMobileView("code");
  };

  const handleBackToTree = () => setMobileView("tree");

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

  if (error) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 rounded-[4px] border bg-fd-background p-4">
        <p
          role="alert"
          className="rounded-[4px] border border-destructive px-3 py-2 font-mono text-[13px] text-destructive"
        >
          {error}
        </p>
        {canRetry && (
          <button
            type="button"
            onClick={retry}
            className="builder-focus-ring rounded border px-3 py-2 text-sm"
          >
            Try again
          </button>
        )}
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
    <div
      aria-busy={isLoading}
      className="@container flex h-full flex-col overflow-hidden rounded-[4px] border bg-fd-background"
    >
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
          {isLoading && (
            <span role="status" className="flex items-center gap-1 text-xs">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-fd-muted-foreground" />
              Updating preview
            </span>
          )}
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
