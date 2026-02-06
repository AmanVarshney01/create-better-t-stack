"use client";

import {
  Check,
  ChevronDown,
  ClipboardCopy,
  FolderTree,
  List,
  Settings,
  Terminal,
} from "lucide-react";
import { startTransition } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

const StackBuilder = () => {
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
    resetStack,
    saveCurrentStack,
    scrollAreaRef,
    sectionRefs,
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
      <div className="flex h-full w-full flex-col overflow-hidden border-border text-foreground sm:grid sm:grid-cols-[auto_1fr]">
        <div className="flex border-b border-border bg-fd-background pl-2 sm:hidden">
          <button
            type="button"
            onClick={() => setMobileTab("summary")}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 border-b-2 px-1 py-3 text-xs font-medium transition-all hover:bg-muted/50",
              mobileTab === "summary"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            <List className="h-4 w-4" />
            <span>Summary</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileTab("configure")}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 border-b-2 px-1 py-3 text-xs font-medium transition-all hover:bg-muted/50",
              mobileTab === "configure"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            <Terminal className="h-4 w-4" />
            <span>Configure</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileTab("preview")}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 border-b-2 px-1 py-3 text-xs font-medium transition-all hover:bg-muted/50",
              mobileTab === "preview"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            <FolderTree className="h-4 w-4" />
            <span>Preview</span>
          </button>
        </div>

        <div
          className={cn(
            "flex w-full flex-col border-border sm:max-w-3xs sm:border-r md:max-w-xs lg:max-w-sm",
            mobileTab === "summary" ? "flex" : "hidden sm:flex",
          )}
        >
          <ScrollArea className="flex-1">
            <div className="flex h-full flex-col gap-3 p-3 sm:p-4 md:h-[calc(100vh-64px)]">
              <div className="space-y-3">
                <label className="flex flex-col">
                  <span className="mb-1 text-muted-foreground text-xs">Project Name:</span>
                  <input
                    type="text"
                    value={stack.projectName || ""}
                    onChange={(event) => {
                      setStack({ projectName: event.target.value });
                    }}
                    className={cn(
                      "w-full rounded border px-2 py-1 text-sm focus:outline-none",
                      projectNameError
                        ? "border-destructive bg-destructive/10 text-destructive-foreground"
                        : "border-border focus:border-primary",
                    )}
                    placeholder="my-better-t-app"
                  />
                  {projectNameError && (
                    <p className="mt-1 text-destructive text-xs">{projectNameError}</p>
                  )}
                  {(stack.projectName || "my-better-t-app").includes(" ") && (
                    <p className="mt-1 text-muted-foreground text-xs">
                      Will be saved as:{" "}
                      <code className="rounded bg-muted px-1 py-0.5 text-xs">
                        {(stack.projectName || "my-better-t-app").replace(/\s+/g, "-")}
                      </code>
                    </p>
                  )}
                </label>

                <div className="rounded border border-border p-2">
                  <div className="flex">
                    <span className="mr-2 select-none text-chart-4">$</span>
                    <code className="block break-all text-muted-foreground text-xs sm:text-sm">
                      {command}
                    </code>
                  </div>
                  <div className="mt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={copyToClipboard}
                      className={cn(
                        "flex items-center gap-1 rounded px-2 py-1 text-xs transition-colors",
                        copied
                          ? "bg-muted text-chart-4"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                      title={copied ? "Copied!" : "Copy command"}
                    >
                      {copied ? (
                        <>
                          <Check className="h-3 w-3 shrink-0" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <ClipboardCopy className="h-3 w-3 shrink-0" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 font-medium text-foreground text-sm">Selected Stack</h3>
                  <div className="flex flex-wrap gap-1.5">
                    <SelectedStackBadges stack={stack} />
                  </div>
                </div>
              </div>

              <div className="mt-auto border-border border-t pt-4">
                <div className="space-y-3">
                  <ActionButtons
                    onReset={resetStack}
                    onRandom={getRandomStack}
                    onSave={saveCurrentStack}
                    onLoad={loadSavedStack}
                    hasSavedStack={!!lastSavedStack}
                  />

                  <div className="flex gap-1">
                    <ShareButton stackUrl={getStackUrl()} stackState={stack} />

                    <PresetDropdown onApplyPreset={applyPreset} />

                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <button
                            type="button"
                            className="flex flex-1 items-center justify-center gap-1.5 rounded border border-border bg-fd-background px-2 py-1.5 font-mono font-medium text-muted-foreground text-xs transition-all hover:border-muted-foreground/30 hover:bg-muted hover:text-foreground"
                          />
                        }
                      >
                        <Settings className="h-3 w-3" />
                        Settings
                        <ChevronDown className="ml-auto h-3 w-3" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-64 bg-fd-background">
                        <YoloToggle stack={stack} onToggle={(yolo) => setStack({ yolo })} />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>

        <div
          className={cn(
            "flex flex-1 flex-col overflow-hidden",
            mobileTab === "summary" ? "hidden sm:flex" : "flex",
          )}
        >
          <Tabs
            value={viewMode}
            onValueChange={(value: string) => {
              startTransition(() => {
                setViewMode(value as "command" | "preview");
              });
            }}
            className="hidden sm:flex sm:flex-1 sm:flex-col sm:overflow-hidden"
          >
            <div className="flex items-center border-b border-border bg-fd-background sm:px-2">
              <TabsList
                variant="line"
                className="h-auto w-full justify-start gap-4 rounded-none bg-transparent p-0"
              >
                <TabsTrigger
                  value="command"
                  className="relative gap-2 rounded-none border-b-2 border-transparent bg-transparent px-2 py-3 text-xs font-medium text-muted-foreground transition-none data-active:border-primary data-active:bg-transparent data-active:text-foreground data-active:shadow-none hover:text-foreground"
                >
                  <Terminal className="h-3.5 w-3.5" />
                  Configure
                </TabsTrigger>
                <TabsTrigger
                  value="preview"
                  className="relative gap-2 rounded-none border-b-2 border-transparent bg-transparent px-2 py-3 text-xs font-medium text-muted-foreground transition-none data-active:border-primary data-active:bg-transparent data-active:text-foreground data-active:shadow-none hover:text-foreground"
                >
                  <FolderTree className="h-3.5 w-3.5" />
                  Preview
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="command" className="min-h-0 flex-1 overflow-hidden">
              <div ref={scrollAreaRef} className="h-full">
                <ScrollArea className="h-full overflow-hidden scroll-smooth">
                  <main className="p-3 sm:p-4">
                    <TechCategories
                      mode="desktop"
                      stack={stack}
                      compatibilityNotes={compatibilityAnalysis.notes}
                      onSelect={handleTechSelect}
                      sectionRefs={sectionRefs}
                    />
                  </main>
                </ScrollArea>
              </div>
            </TabsContent>
            <TabsContent value="preview" className="min-h-0 flex-1 overflow-hidden">
              <PreviewPanel
                stack={stack}
                selectedFilePath={selectedFile}
                onSelectFile={setSelectedFile}
              />
            </TabsContent>
          </Tabs>

          <div className="flex flex-1 flex-col overflow-hidden sm:hidden">
            {mobileTab === "configure" && (
              <ScrollArea className="h-full overflow-hidden scroll-smooth">
                <main className="p-3">
                  <TechCategories
                    mode="mobile"
                    stack={stack}
                    compatibilityNotes={compatibilityAnalysis.notes}
                    onSelect={handleTechSelect}
                  />
                </main>
              </ScrollArea>
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
      </div>
    </TooltipProvider>
  );
};

export default StackBuilder;
