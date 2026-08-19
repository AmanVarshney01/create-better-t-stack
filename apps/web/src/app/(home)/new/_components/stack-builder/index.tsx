"use client";

import {
  AlertTriangle,
  Check,
  ChevronDown,
  ClipboardCopy,
  FolderTree,
  Terminal,
} from "lucide-react";
import { startTransition, useState } from "react";

import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TooltipProvider } from "@/components/ui/tooltip";
import { formatStackCommandForDisplay, getDesktopBuildNote } from "@/lib/stack-utils";
import type { Sponsor } from "@/lib/types";
import { cn } from "@/lib/utils";

import { ActionButtons } from "../action-buttons";
import { PreviewPanel } from "../preview-panel";
import { SpecialSponsorsPanel } from "../special-sponsors-panel";
import { CategoryNav, scrollToCategorySection } from "./category-nav";
import { SelectedStackBadges } from "./selected-stack-badges";
import { TechCategories } from "./tech-categories";
import { useStackBuilder } from "./use-stack-builder";

type StackBuilderProps = {
  specialSponsors?: Sponsor[];
};

export function StackBuilder({ specialSponsors = [] }: StackBuilderProps) {
  const {
    applyPreset,
    categoryProgress,
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
  const effectiveStack = compatibilityAnalysis.stack;
  const desktopBuildNote = getDesktopBuildNote(effectiveStack);
  const displayCommand = formatStackCommandForDisplay(command);
  const [commandExpanded, setCommandExpanded] = useState(false);
  const isCommandMultiline = displayCommand !== command;

  const actionButtons = (
    <ActionButtons
      onReset={resetStack}
      onRandom={getRandomStack}
      onSave={saveCurrentStack}
      onLoad={loadSavedStack}
      hasSavedStack={!!lastSavedStack}
      onApplyPreset={applyPreset}
      stackUrl={getStackUrl()}
      stackState={effectiveStack}
      yolo={stack.yolo === "true"}
      onYoloToggle={(yolo) => setStack({ yolo })}
    />
  );

  return (
    <TooltipProvider>
      <div className="flex h-full w-full flex-col overflow-hidden bg-fd-background text-fd-foreground">
        <div className="sticky top-0 z-20 border-b bg-fd-background px-3 py-2 sm:hidden">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setMobileTab("build")}
                className={cn(
                  "builder-focus-ring -m-2 flex items-center gap-1.5 p-2 font-mono text-[11px] uppercase tracking-[0.08em] transition-colors duration-150",
                  mobileTab === "build"
                    ? "text-primary"
                    : "text-fd-muted-foreground hover:text-fd-foreground",
                )}
              >
                <span aria-hidden="true" className="text-[10px] leading-none">
                  {mobileTab === "build" ? "•" : "·"}
                </span>
                Build
              </button>
              <button
                type="button"
                onClick={() => setMobileTab("preview")}
                className={cn(
                  "builder-focus-ring -m-2 flex items-center gap-1.5 p-2 font-mono text-[11px] uppercase tracking-[0.08em] transition-colors duration-150",
                  mobileTab === "preview"
                    ? "text-primary"
                    : "text-fd-muted-foreground hover:text-fd-foreground",
                )}
              >
                <span aria-hidden="true" className="text-[10px] leading-none">
                  {mobileTab === "preview" ? "•" : "·"}
                </span>
                Preview
              </button>
            </div>
          </div>
          {mobileTab === "build" && (
            <div className="mt-2">
              <CategoryNav progress={categoryProgress} idPrefix="section-mobile" />
            </div>
          )}
        </div>

        <div className="hidden h-full flex-1 grid-cols-[16rem_minmax(0,1fr)] overflow-hidden sm:grid md:grid-cols-[19rem_minmax(0,1fr)] lg:grid-cols-[24rem_minmax(0,1fr)]">
          <aside className="flex min-h-0 flex-col overflow-hidden border-r bg-fd-background">
            <ScrollArea className="min-h-0 flex-1">
              <div className="p-2">
                <div className="overflow-hidden">
                  <section className="space-y-2 border-b px-3 py-3">
                    <label className="flex flex-col">
                      <span className="mb-1 font-mono text-[11px] text-fd-muted-foreground uppercase tracking-[0.08em]">
                        Project Name
                      </span>
                      <Input
                        type="text"
                        value={stack.projectName || ""}
                        onChange={(event) => {
                          setStack({ projectName: event.target.value });
                        }}
                        aria-invalid={!!projectNameError}
                        aria-describedby={projectNameError ? "project-name-error" : undefined}
                        className={cn(
                          "builder-focus-ring w-full border-fd-border px-2.5 py-1.5 font-mono text-[13px] focus:outline-none",
                          projectNameError
                            ? "border-destructive text-destructive"
                            : "focus:border-primary",
                        )}
                        placeholder="my-better-t-app"
                      />
                      {projectNameError && (
                        <p
                          id="project-name-error"
                          className="mt-1 font-mono text-[11px] text-destructive"
                        >
                          {projectNameError}
                        </p>
                      )}
                    </label>
                  </section>

                  <section className="space-y-2 border-b px-3 py-3">
                    <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
                      <p className="font-mono text-[11px] text-fd-muted-foreground uppercase tracking-[0.08em]">
                        CLI Command
                      </p>
                      <div className="flex items-center gap-2">
                        {isCommandMultiline && (
                          <button
                            type="button"
                            onClick={() => setCommandExpanded((prev) => !prev)}
                            className="builder-focus-ring flex items-center gap-1 rounded-[4px] border px-2 py-1 font-mono text-[10px] text-fd-muted-foreground uppercase tracking-[0.10em] transition-colors duration-150 hover:text-fd-foreground"
                            title={commandExpanded ? "Collapse command" : "Show full command"}
                          >
                            <ChevronDown
                              className={cn(
                                "h-3 w-3 shrink-0 transition-transform",
                                commandExpanded && "rotate-180",
                              )}
                            />
                            {commandExpanded ? "Less" : "Flags"}
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={copyToClipboard}
                          className={cn(
                            "builder-focus-ring flex items-center gap-1 rounded-[4px] border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.10em] transition-colors duration-150",
                            copied
                              ? "border-primary text-primary"
                              : "text-fd-muted-foreground hover:text-fd-foreground",
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
                      className="builder-focus-ring cursor-pointer rounded-[4px] border px-2.5 py-2 transition-colors duration-150 hover:border-primary/50"
                    >
                      <div className="flex min-w-0 items-start gap-1.5">
                        <span aria-hidden="true" className="font-mono text-[13px] text-primary">
                          $
                        </span>
                        <code
                          className={cn(
                            "block min-w-0 flex-1 font-mono text-[11px] text-fd-muted-foreground leading-[1.55]",
                            commandExpanded ? "whitespace-pre-wrap break-words" : "truncate",
                          )}
                        >
                          {commandExpanded ? displayCommand : command}
                        </code>
                      </div>
                    </div>
                  </section>

                  <section className="space-y-2 px-3 py-3">
                    <div className="flex items-center gap-3">
                      <p className="font-mono text-[11px] text-fd-muted-foreground uppercase tracking-[0.08em]">
                        Selected stack
                      </p>
                      <span aria-hidden="true" className="h-px flex-1 bg-fd-border" />
                      <span className="font-mono text-[10px] text-fd-muted-foreground uppercase tracking-[0.10em] tabular-nums">
                        {selectedCount} picks
                      </span>
                    </div>
                    <SelectedStackBadges
                      stack={effectiveStack}
                      onRemove={removeSelectedTech}
                      onJump={(category) => {
                        if (viewMode !== "command") {
                          startTransition(() => {
                            setViewMode("command");
                          });
                        }
                        scrollToCategorySection("section", category);
                      }}
                      onRemoveApp={(name) =>
                        setStack({
                          apps: effectiveStack.apps.filter(
                            (encoded) => !encoded.startsWith(`${name}:`),
                          ),
                        })
                      }
                      onJumpToApps={() => {
                        if (viewMode !== "command") {
                          startTransition(() => {
                            setViewMode("command");
                          });
                        }
                        scrollToCategorySection("section", "apps");
                      }}
                    />
                  </section>

                  {desktopBuildNote && (
                    <section className="space-y-2 border-t px-3 py-3">
                      <div className="flex items-center gap-1.5 font-mono text-[11px] text-amber-600 uppercase tracking-[0.08em] dark:text-amber-400">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        Desktop Build Note
                      </div>
                      <div className="rounded-[4px] border px-2.5 py-2 font-mono text-[11px] text-fd-muted-foreground leading-[1.55]">
                        {desktopBuildNote}
                      </div>
                    </section>
                  )}
                </div>
              </div>
            </ScrollArea>

            <div className="border-t bg-fd-background p-2">
              <div className="@container p-2">
                <SpecialSponsorsPanel sponsors={specialSponsors} />
                {specialSponsors.length > 0 ? (
                  <span aria-hidden="true" className="my-3 block h-px w-full bg-fd-border" />
                ) : null}
                {actionButtons}
              </div>
            </div>
          </aside>

          <section className="flex min-h-0 flex-col overflow-hidden">
            <div className="sticky top-0 z-10 flex flex-col gap-2 border-b bg-fd-background px-3 py-2">
              <div className="flex w-fit items-center gap-4">
                <button
                  type="button"
                  onClick={() => {
                    startTransition(() => {
                      setViewMode("command");
                    });
                  }}
                  className={cn(
                    "builder-focus-ring -m-2 flex items-center gap-1.5 p-2 font-mono text-[11px] uppercase tracking-[0.08em] transition-colors duration-150",
                    viewMode === "command"
                      ? "text-primary"
                      : "text-fd-muted-foreground hover:text-fd-foreground",
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
                    "builder-focus-ring -m-2 flex items-center gap-1.5 p-2 font-mono text-[11px] uppercase tracking-[0.08em] transition-colors duration-150",
                    viewMode === "preview"
                      ? "text-primary"
                      : "text-fd-muted-foreground hover:text-fd-foreground",
                  )}
                >
                  <FolderTree className="h-3 w-3" />
                  Preview
                </button>
              </div>
              {viewMode === "command" && (
                <CategoryNav progress={categoryProgress} idPrefix="section" />
              )}
            </div>

            {viewMode === "command" ? (
              <div ref={scrollAreaRef} className="min-h-0 flex-1">
                <ScrollArea className="h-full overflow-hidden scroll-smooth">
                  <main className="@container p-2 sm:p-4">
                    <TechCategories
                      mode="desktop"
                      stack={effectiveStack}
                      compatibilityNotes={compatibilityAnalysis.notes}
                      onSelect={handleTechSelect}
                      onExtraAppsChange={(apps) => setStack({ apps })}
                      showAllCategories
                    />
                  </main>
                </ScrollArea>
              </div>
            ) : (
              <PreviewPanel
                stack={effectiveStack}
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
                  <div className="mb-4 space-y-3 rounded-[4px] border p-3">
                    <label className="flex flex-col">
                      <span className="mb-1 font-mono text-[11px] text-fd-muted-foreground uppercase tracking-[0.08em]">
                        Project Name
                      </span>
                      <Input
                        type="text"
                        value={stack.projectName || ""}
                        onChange={(event) => {
                          setStack({ projectName: event.target.value });
                        }}
                        aria-invalid={!!projectNameError}
                        aria-describedby={
                          projectNameError ? "project-name-error-mobile" : undefined
                        }
                        className={cn(
                          "builder-focus-ring w-full border-fd-border px-2.5 py-1.5 font-mono text-[13px] focus:outline-none",
                          projectNameError
                            ? "border-destructive text-destructive"
                            : "focus:border-primary",
                        )}
                        placeholder="my-better-t-app"
                      />
                      {projectNameError && (
                        <p
                          id="project-name-error-mobile"
                          className="mt-1 font-mono text-[11px] text-destructive"
                        >
                          {projectNameError}
                        </p>
                      )}
                    </label>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
                        <span className="font-mono text-[10px] text-fd-muted-foreground uppercase tracking-[0.10em]">
                          CLI Command
                        </span>
                        <div className="flex items-center gap-2">
                          {isCommandMultiline && (
                            <button
                              type="button"
                              onClick={() => setCommandExpanded((prev) => !prev)}
                              className="builder-focus-ring flex items-center gap-1 rounded-[4px] border px-2 py-1 font-mono text-[10px] text-fd-muted-foreground uppercase tracking-[0.10em] transition-colors duration-150 hover:text-fd-foreground"
                              title={commandExpanded ? "Collapse command" : "Show full command"}
                            >
                              <ChevronDown
                                className={cn(
                                  "h-3 w-3 shrink-0 transition-transform",
                                  commandExpanded && "rotate-180",
                                )}
                              />
                              {commandExpanded ? "Less" : "Flags"}
                            </button>
                          )}
                          <span
                            className={cn(
                              "flex items-center gap-1 rounded-[4px] border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.10em]",
                              copied ? "border-primary text-primary" : "text-fd-muted-foreground",
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
                          "builder-focus-ring rounded-[4px] border px-2.5 py-2 font-mono text-[11px] text-fd-muted-foreground leading-[1.55] transition-colors duration-150",
                          copied && "border-primary",
                        )}
                        aria-label="Copy command"
                        title="Click to copy command"
                      >
                        <div className="flex min-w-0 items-start gap-1.5">
                          <span aria-hidden="true" className="text-primary">
                            $
                          </span>
                          <code
                            className={cn(
                              "min-w-0 flex-1",
                              commandExpanded ? "whitespace-pre-wrap break-words" : "truncate",
                            )}
                          >
                            {commandExpanded ? displayCommand : command}
                          </code>
                        </div>
                      </div>
                    </div>

                    {desktopBuildNote && (
                      <div className="rounded-[4px] border px-2.5 py-2">
                        <div className="mb-1 flex items-center gap-1.5 font-mono text-[10px] text-amber-600 uppercase tracking-[0.10em] dark:text-amber-400">
                          <AlertTriangle className="h-3 w-3" />
                          Desktop Build Note
                        </div>
                        <p className="font-mono text-[11px] text-fd-muted-foreground leading-[1.55]">
                          {desktopBuildNote}
                        </p>
                      </div>
                    )}
                  </div>

                  <TechCategories
                    mode="mobile"
                    stack={effectiveStack}
                    compatibilityNotes={compatibilityAnalysis.notes}
                    onSelect={handleTechSelect}
                    onExtraAppsChange={(apps) => setStack({ apps })}
                    showAllCategories
                  />
                </main>
              </ScrollArea>

              <div className="border-t bg-fd-background p-2">
                <div className="@container p-2">
                  <SpecialSponsorsPanel sponsors={specialSponsors} compact />
                  {specialSponsors.length > 0 ? (
                    <span aria-hidden="true" className="my-3 block h-px w-full bg-fd-border" />
                  ) : null}
                  {actionButtons}
                </div>
              </div>
            </div>
          )}

          {mobileTab === "preview" && (
            <PreviewPanel
              stack={effectiveStack}
              selectedFilePath={selectedFile}
              onSelectFile={setSelectedFile}
            />
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
