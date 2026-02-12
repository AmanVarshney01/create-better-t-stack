"use client";

import { Check, ChevronDown, ClipboardCopy, FolderTree, Settings, Terminal } from "lucide-react";
import { startTransition } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

import { ActionButtons } from "../action-buttons";
import { PresetDropdown } from "../preset-dropdown";
import { PreviewPanel } from "../preview-panel";
import { ShareButton } from "../share-button";
import { YoloToggle } from "../yolo-toggle";
import { SelectedStackBadges } from "./selected-stack-badges";
import { TechCategories } from "./tech-categories";
import { useStackBuilder } from "./use-stack-builder";

export function StackBuilder() {
  const {
    applyPreset,
    command,
    compatibilityAnalysis,
    copied,
    copyToClipboard,
    getRandomStack,
    getStackUrl,
    handleTechSelect,
    lastSavedStack,
    loadSavedStack,
    mobileTab,
    projectNameError,
    removeSelectedTech,
    resetStack,
    saveCurrentStack,
    scrollAreaRef,
    selectedCount,
    selectedFile,
    setMobileTab,
    setSelectedFile,
    setStack,
    setViewMode,
    stack,
    viewMode,
  } = useStackBuilder();

  return (
    <TooltipProvider>
      <div className="flex h-full w-full flex-col overflow-hidden bg-fd-background text-foreground">
        <div className="sticky top-0 z-20 border-border border-b bg-fd-background/95 px-3 py-2 backdrop-blur-sm sm:hidden">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-md bg-muted/20 p-1">
              <button
                type="button"
                onClick={() => setMobileTab("build")}
                className={cn(
                  "builder-focus-ring rounded px-2 py-1 font-mono text-[11px] uppercase",
                  mobileTab === "build"
                    ? "bg-primary/12 text-primary"
                    : "text-muted-foreground hover:bg-muted/30",
                )}
              >
                Build
              </button>
              <button
                type="button"
                onClick={() => setMobileTab("preview")}
                className={cn(
                  "builder-focus-ring rounded px-2 py-1 font-mono text-[11px] uppercase",
                  mobileTab === "preview"
                    ? "bg-primary/12 text-primary"
                    : "text-muted-foreground hover:bg-muted/30",
                )}
              >
                Preview
              </button>
            </div>
          </div>
        </div>

        <div className="hidden h-full flex-1 grid-cols-[24rem_minmax(0,1fr)] overflow-hidden border-border sm:grid">
          <aside className="flex min-h-0 flex-col overflow-hidden border-border/50 border-r bg-fd-background">
            <ScrollArea className="min-h-0 flex-1">
              <div className="p-2">
                <div className="overflow-hidden rounded-2xl bg-fd-background/80">
                  <section className="space-y-2 border-b border-border/20 px-3 py-3">
                    <label className="flex flex-col">
                      <span className="mb-1 font-mono text-[11px] text-muted-foreground uppercase tracking-wide">
                        Project Name
                      </span>
                      <Input
                        type="text"
                        value={stack.projectName || ""}
                        onChange={(event) => {
                          setStack({ projectName: event.target.value });
                        }}
                        aria-invalid={!!projectNameError}
                        className={cn(
                          "builder-focus-ring w-full rounded-lg px-2.5 py-1.5 font-mono text-sm focus:outline-none",
                          projectNameError
                            ? "border-destructive bg-destructive/10 text-destructive-foreground"
                            : "border-border/60 focus:border-primary",
                        )}
                        placeholder="my-better-t-app"
                      />
                      {projectNameError && (
                        <p className="mt-1 text-destructive text-xs">{projectNameError}</p>
                      )}
                    </label>
                  </section>

                  <section className="space-y-2 border-border/20 border-b px-3 py-3">
                    <div className="flex items-center justify-between">
                      <p className="font-mono text-[11px] text-muted-foreground uppercase tracking-wide">
                        CLI Command
                      </p>
                      <button
                        type="button"
                        onClick={copyToClipboard}
                        className={cn(
                          "builder-focus-ring flex items-center gap-1 rounded-md px-2 py-1 font-mono text-[11px] uppercase transition-colors",
                          copied
                            ? "bg-primary/14 text-primary"
                            : "bg-muted/20 text-muted-foreground hover:bg-muted/35 hover:text-foreground",
                        )}
                        title={copied ? "Copied!" : "Copy command"}
                      >
                        {copied ? (
                          <Check className="h-3 w-3 shrink-0" />
                        ) : (
                          <ClipboardCopy className="h-3 w-3 shrink-0" />
                        )}
                        {copied ? "Copied" : "Copy"}
                      </button>
                    </div>
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={copyToClipboard}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          copyToClipboard();
                        }
                      }}
                      aria-label="Copy CLI command"
                      title="Click to copy command"
                      className="builder-focus-ring cursor-pointer rounded-lg bg-muted/20 px-2.5 py-2"
                    >
                      <div className="flex items-start gap-2">
                        <code className="block break-all font-mono text-muted-foreground text-xs">
                          {command}
                        </code>
                      </div>
                    </div>
                  </section>

                  <section className="space-y-2 px-3 py-3">
                    <div className="flex items-center justify-between">
                      <p className="font-mono text-[11px] text-muted-foreground uppercase tracking-wide">
                        Selected stack
                      </p>
                      <span className="font-mono text-[11px] text-muted-foreground uppercase">
                        {selectedCount} picks
                      </span>
                    </div>
                    <SelectedStackBadges stack={stack} onRemove={removeSelectedTech} />
                  </section>

                  {compatibilityAnalysis.changes.length > 0 && (
                    <section className="space-y-2 border-border/20 border-t px-3 py-3">
                      <p className="font-mono text-[11px] text-primary uppercase tracking-wide">
                        Compatibility Log
                      </p>
                      <ul className="space-y-1 rounded-lg bg-primary/7 px-2.5 py-2">
                        {compatibilityAnalysis.changes.slice(0, 4).map((change, index) => (
                          <li
                            key={`${change.category}-${change.message}-${index}`}
                            className="text-muted-foreground text-xs"
                          >
                            • {change.message}
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}
                </div>
              </div>
            </ScrollArea>

            <div className="border-border/35 border-t bg-fd-background/95 p-2">
              <div className="rounded-2xl bg-fd-background/80 p-2">
                <ActionButtons
                  onReset={resetStack}
                  onRandom={getRandomStack}
                  onSave={saveCurrentStack}
                  onLoad={loadSavedStack}
                  hasSavedStack={!!lastSavedStack}
                />

                <div className="mt-2 grid grid-cols-3 gap-1.5">
                  <ShareButton stackUrl={getStackUrl()} stackState={stack} />
                  <PresetDropdown onApplyPreset={applyPreset} />
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <button
                          type="button"
                          className="builder-focus-ring flex items-center justify-center gap-1.5 rounded-md bg-muted/20 px-2 py-1.5 font-mono font-medium text-muted-foreground text-xs transition-colors hover:bg-muted/35 hover:text-foreground"
                        />
                      }
                    >
                      <Settings className="h-3 w-3" />
                      <span className="sr-only">Settings</span>
                      <ChevronDown className="h-3 w-3" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-64 bg-fd-background">
                      <YoloToggle stack={stack} onToggle={(yolo) => setStack({ yolo })} />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </aside>

          <section className="flex min-h-0 flex-col overflow-hidden">
            <div className="sticky top-0 z-10 flex items-center gap-2 border-border border-b bg-fd-background px-3 py-2">
              <div className="flex items-center gap-1 rounded-md bg-muted/20 p-1">
                <button
                  type="button"
                  onClick={() => {
                    startTransition(() => {
                      setViewMode("command");
                    });
                  }}
                  className={cn(
                    "builder-focus-ring flex items-center gap-1.5 rounded px-2 py-1 font-mono text-[11px] uppercase tracking-wide",
                    viewMode === "command"
                      ? "bg-primary/12 text-primary"
                      : "text-muted-foreground hover:bg-muted/30",
                  )}
                >
                  <Terminal className="h-3 w-3" />
                  Configure
                </button>
                <button
                  type="button"
                  onClick={() => {
                    startTransition(() => {
                      setViewMode("preview");
                    });
                  }}
                  className={cn(
                    "builder-focus-ring flex items-center gap-1.5 rounded px-2 py-1 font-mono text-[11px] uppercase tracking-wide",
                    viewMode === "preview"
                      ? "bg-primary/12 text-primary"
                      : "text-muted-foreground hover:bg-muted/30",
                  )}
                >
                  <FolderTree className="h-3 w-3" />
                  Preview
                </button>
              </div>
            </div>

            {viewMode === "command" ? (
              <div ref={scrollAreaRef} className="h-full">
                <ScrollArea className="h-full overflow-hidden scroll-smooth">
                  <main className="p-2 sm:p-4">
                    <TechCategories
                      mode="desktop"
                      stack={stack}
                      compatibilityNotes={compatibilityAnalysis.notes}
                      onSelect={handleTechSelect}
                      showAllCategories
                    />
                  </main>
                </ScrollArea>
              </div>
            ) : (
              <PreviewPanel
                stack={stack}
                selectedFilePath={selectedFile}
                onSelectFile={setSelectedFile}
              />
            )}
          </section>
        </div>

        <div className="flex flex-1 flex-col overflow-hidden sm:hidden">
          {mobileTab === "build" && (
            <div className="flex min-h-0 flex-1 flex-col">
              <ScrollArea className="h-full overflow-hidden scroll-smooth">
                <main className="p-2 pb-6">
                  <div className="mb-4 space-y-2 rounded-xl bg-muted/10 p-2">
                    <label className="flex flex-col">
                      <span className="mb-1 font-mono text-[11px] text-muted-foreground uppercase tracking-wide">
                        Project Name
                      </span>
                      <Input
                        type="text"
                        value={stack.projectName || ""}
                        onChange={(event) => {
                          setStack({ projectName: event.target.value });
                        }}
                        aria-invalid={!!projectNameError}
                        className={cn(
                          "builder-focus-ring w-full rounded-lg border bg-background/75 px-2.5 py-1.5 font-mono text-sm focus:outline-none",
                          projectNameError
                            ? "border-destructive bg-destructive/10 text-destructive-foreground"
                            : "border-border/60 focus:border-primary",
                        )}
                        placeholder="my-better-t-app"
                      />
                      {projectNameError && (
                        <p className="mt-1 text-destructive text-xs">{projectNameError}</p>
                      )}
                    </label>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wide">
                          CLI Command
                        </span>
                        <span
                          className={cn(
                            "flex items-center gap-1 rounded-md px-2 py-1 font-mono text-[11px] uppercase",
                            copied
                              ? "bg-primary/14 text-primary"
                              : "bg-muted/20 text-muted-foreground",
                          )}
                        >
                          {copied ? (
                            <Check className="h-3 w-3 shrink-0" />
                          ) : (
                            <ClipboardCopy className="h-3 w-3 shrink-0" />
                          )}
                          {copied ? "Copied" : "Tap to copy"}
                        </span>
                      </div>
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={copyToClipboard}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            copyToClipboard();
                          }
                        }}
                        className={cn(
                          "builder-focus-ring rounded-lg bg-background/75 px-2.5 py-2 font-mono text-xs text-muted-foreground ring-1",
                          copied ? "ring-primary/40" : "ring-border/45",
                        )}
                        aria-label="Copy command"
                        title="Click to copy command"
                      >
                        <div className="flex items-start gap-1.5">
                          <span className="mt-0.5 text-chart-4">$</span>
                          <code className="break-all">{command}</code>
                        </div>
                      </div>
                    </div>
                  </div>

                  <TechCategories
                    mode="mobile"
                    stack={stack}
                    compatibilityNotes={compatibilityAnalysis.notes}
                    onSelect={handleTechSelect}
                    showAllCategories
                  />
                </main>
              </ScrollArea>

              <div className="border-border/35 border-t bg-fd-background/95 p-2 backdrop-blur-sm">
                <div className="rounded-xl bg-fd-background/80 p-2">
                  <ActionButtons
                    onReset={resetStack}
                    onRandom={getRandomStack}
                    onSave={saveCurrentStack}
                    onLoad={loadSavedStack}
                    hasSavedStack={!!lastSavedStack}
                  />

                  <div className="mt-2 grid grid-cols-3 gap-1.5">
                    <ShareButton stackUrl={getStackUrl()} stackState={stack} />
                    <PresetDropdown onApplyPreset={applyPreset} />
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <button
                            type="button"
                            className="builder-focus-ring flex items-center justify-center gap-1.5 rounded-md bg-muted/20 px-2 py-1.5 font-mono font-medium text-muted-foreground text-xs transition-colors hover:bg-muted/35 hover:text-foreground"
                          />
                        }
                      >
                        <Settings className="h-3 w-3" />
                        <span className="sr-only">Settings</span>
                        <ChevronDown className="h-3 w-3" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-64 bg-fd-background">
                        <YoloToggle stack={stack} onToggle={(yolo) => setStack({ yolo })} />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </div>
          )}

          {mobileTab === "preview" && (
            <PreviewPanel
              stack={stack}
              selectedFilePath={selectedFile}
              onSelectFile={setSelectedFile}
            />
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
