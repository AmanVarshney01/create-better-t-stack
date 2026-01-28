"use client";

import type React from "react";

import {
  Check,
  ChevronDown,
  ChevronRight,
  ClipboardCopy,
  FolderTree,
  InfoIcon,
  List,
  Settings,
  Terminal,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { startTransition, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import type { Ecosystem } from "@/lib/types";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DEFAULT_STACK,
  ECOSYSTEMS,
  PRESET_TEMPLATES,
  type StackState,
  TECH_OPTIONS,
} from "@/lib/constant";
import { useStackState } from "@/lib/stack-url-state.client";
import {
  CATEGORY_ORDER,
  generateStackCommand,
  generateStackSharingUrl,
  GO_CATEGORY_ORDER,
  PYTHON_CATEGORY_ORDER,
  RUST_CATEGORY_ORDER,
  TYPESCRIPT_CATEGORY_ORDER,
} from "@/lib/stack-utils";
import { cn } from "@/lib/utils";

import { ActionButtons } from "./action-buttons";
import { getBadgeColors } from "./get-badge-color";
import { PresetDropdown } from "./preset-dropdown";
import { PreviewPanel } from "./preview-panel";
import { ShareButton } from "./share-button";
import { TechIcon } from "./tech-icon";
import {
  analyzeStackCompatibility,
  getCategoryDisplayName,
  getDisabledReason,
  isOptionCompatible,
  validateProjectName,
} from "./utils";
import { YoloToggle } from "./yolo-toggle";

type MobileTab = "summary" | "configure" | "preview";

function formatProjectName(name: string): string {
  return name.replace(/\s+/g, "-");
}

const StackBuilder = () => {
  const [stack, setStack, viewMode, setViewMode, selectedFile, setSelectedFile] = useStackState();

  // Debug: log when stack changes
  useEffect(() => {
    console.log("[StackBuilder] Stack state:", stack);
  }, [stack]);

  const [command, setCommand] = useState("");
  const [copied, setCopied] = useState(false);
  const [lastSavedStack, setLastSavedStack] = useState<StackState | null>(null);
  const [, setLastChanges] = useState<Array<{ category: string; message: string }>>([]);

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const contentRef = useRef<HTMLDivElement | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  const lastAppliedStackString = useRef<string>("");

  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector<HTMLDivElement>(
        '[data-slot="scroll-area-viewport"]',
      );
      if (viewport) {
        contentRef.current = viewport;
      }
    }
  }, [viewMode]);

  const compatibilityAnalysis = analyzeStackCompatibility(stack);

  const projectNameError = validateProjectName(stack.projectName || "");

  const getStackUrl = (): string => {
    const stackToUse = compatibilityAnalysis.adjustedStack || stack;
    const projectName = stackToUse.projectName || "my-app";
    const formattedProjectName = formatProjectName(projectName);
    const stackWithProjectName = {
      ...stackToUse,
      projectName: formattedProjectName,
    };
    return generateStackSharingUrl(stackWithProjectName);
  };

  const getRandomStack = () => {
    const randomStack: Partial<StackState> = {};
    for (const category of CATEGORY_ORDER) {
      const options = TECH_OPTIONS[category as keyof typeof TECH_OPTIONS] || [];
      if (options.length === 0) continue;
      const catKey = category as keyof StackState;
      if (
        catKey === "webFrontend" ||
        catKey === "nativeFrontend" ||
        catKey === "codeQuality" ||
        catKey === "documentation" ||
        catKey === "appPlatforms" ||
        catKey === "examples" ||
        catKey === "aiDocs"
      ) {
        if (catKey === "webFrontend" || catKey === "nativeFrontend") {
          const randomIndex = Math.floor(Math.random() * options.length);
          const selectedOption = options[randomIndex].id;
          randomStack[catKey as "webFrontend" | "nativeFrontend"] = [selectedOption];
        } else {
          const numToPick = Math.floor(Math.random() * Math.min(options.length, 4));
          if (numToPick === 0) {
            (randomStack as Record<string, string[]>)[catKey] = [];
          } else {
            const shuffledOptions = [...options]
              .filter((opt) => opt.id !== "none")
              .sort(() => 0.5 - Math.random())
              .slice(0, numToPick);
            (randomStack as Record<string, string[]>)[catKey] = shuffledOptions.map(
              (opt) => opt.id,
            );
          }
        }
      } else {
        const randomIndex = Math.floor(Math.random() * options.length);
        (randomStack[catKey] as string) = options[randomIndex].id;
      }
    }
    startTransition(() => {
      setStack({
        ...(randomStack as StackState),
        projectName: stack.projectName || "my-app",
      });
    });
    contentRef.current?.scrollTo(0, 0);
  };

  const selectedStackCards = (() => {
    const cards: React.ReactNode[] = [];
    const categoryOrder =
      stack.ecosystem === "rust"
        ? RUST_CATEGORY_ORDER
        : stack.ecosystem === "python"
          ? PYTHON_CATEGORY_ORDER
          : stack.ecosystem === "go"
            ? GO_CATEGORY_ORDER
            : TYPESCRIPT_CATEGORY_ORDER;
    for (const category of categoryOrder) {
      const categoryKey = category as keyof StackState;
      const options = TECH_OPTIONS[category as keyof typeof TECH_OPTIONS];
      const selectedValue = stack[categoryKey];
      const categoryDisplayName = getCategoryDisplayName(category);

      if (!options) continue;

      if (Array.isArray(selectedValue)) {
        if (
          selectedValue.length === 0 ||
          (selectedValue.length === 1 && selectedValue[0] === "none")
        ) {
          continue;
        }

        for (const id of selectedValue) {
          if (id === "none") continue;
          const tech = options.find((opt) => opt.id === id);
          if (tech) {
            cards.push(
              <div
                key={`${category}-${tech.id}`}
                className={cn(
                  "flex items-center gap-3 rounded-lg border p-2.5 transition-colors",
                  getBadgeColors(category),
                )}
              >
                {tech.icon !== "" && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted/50">
                    <TechIcon
                      icon={tech.icon}
                      name={tech.name}
                      className={cn("h-5 w-5", tech.className)}
                    />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="mb-0.5 truncate text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">
                    {categoryDisplayName}
                  </p>
                  <p className="truncate font-medium text-foreground text-sm">{tech.name}</p>
                </div>
              </div>,
            );
          }
        }
      } else {
        const tech = options.find((opt) => opt.id === selectedValue);
        if (
          !tech ||
          tech.id === "none" ||
          tech.id === "false" ||
          ((category === "git" || category === "install" || category === "auth") &&
            tech.id === "true")
        ) {
          continue;
        }
        cards.push(
          <div
            key={`${category}-${tech.id}`}
            className={cn(
              "flex items-center gap-3 rounded-lg border p-2.5 transition-colors",
              getBadgeColors(category),
            )}
          >
            {tech.icon !== "" && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted/50">
                <TechIcon
                  icon={tech.icon}
                  name={tech.name}
                  className={cn("h-5 w-5", tech.className)}
                />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="mb-0.5 truncate text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">
                {categoryDisplayName}
              </p>
              <p className="truncate font-medium text-foreground text-sm">{tech.name}</p>
            </div>
          </div>,
        );
      }
    }
    return cards;
  })();

  useEffect(() => {
    const savedStack = localStorage.getItem("betterFullstackPreference");
    if (savedStack) {
      try {
        const parsedStack = JSON.parse(savedStack) as StackState;
        setLastSavedStack(parsedStack);
      } catch (e) {
        console.error("Failed to parse saved stack", e);
        localStorage.removeItem("betterFullstackPreference");
      }
    }
  }, []);

  useEffect(() => {
    if (compatibilityAnalysis.adjustedStack) {
      const adjustedStackString = JSON.stringify(compatibilityAnalysis.adjustedStack);

      if (lastAppliedStackString.current !== adjustedStackString) {
        startTransition(() => {
          if (compatibilityAnalysis.changes.length > 0) {
            if (compatibilityAnalysis.changes.length === 1) {
              toast.info(compatibilityAnalysis.changes[0].message, {
                duration: 4000,
              });
            } else if (compatibilityAnalysis.changes.length > 1) {
              const message = `${
                compatibilityAnalysis.changes.length
              } compatibility adjustments made:\n${compatibilityAnalysis.changes
                .map((c) => `• ${c.message}`)
                .join("\n")}`;
              toast.info(message, {
                duration: 5000,
              });
            }
          }
          setLastChanges(compatibilityAnalysis.changes);
          if (compatibilityAnalysis.adjustedStack) {
            setStack(compatibilityAnalysis.adjustedStack);
          }
          lastAppliedStackString.current = adjustedStackString;
        });
      }
    }
  }, [compatibilityAnalysis.adjustedStack, compatibilityAnalysis.changes, setStack]);

  useEffect(() => {
    const stackToUse = compatibilityAnalysis.adjustedStack || stack;
    const projectName = stackToUse.projectName || "my-app";
    const formattedProjectName = formatProjectName(projectName);
    const stackWithProjectName = {
      ...stackToUse,
      projectName: formattedProjectName,
    };
    const cmd = generateStackCommand(stackWithProjectName);
    setCommand(cmd);
  }, [stack, compatibilityAnalysis.adjustedStack]);

  const handleTechSelect = (category: keyof typeof TECH_OPTIONS, techId: string) => {
    console.log("[StackBuilder] handleTechSelect called:", { category, techId, stack });

    if (!isOptionCompatible(stack, category, techId)) {
      console.log("[StackBuilder] Option not compatible, returning early");
      return;
    }

    console.log("[StackBuilder] Option is compatible, updating state");
    startTransition(() => {
      setStack((currentStack: StackState) => {
        const catKey = category as keyof StackState;
        const update: Partial<StackState> = {};
        const currentValue = currentStack[catKey];

        if (
          catKey === "webFrontend" ||
          catKey === "nativeFrontend" ||
          catKey === "codeQuality" ||
          catKey === "documentation" ||
          catKey === "appPlatforms" ||
          catKey === "examples" ||
          catKey === "aiDocs"
        ) {
          const currentArray = Array.isArray(currentValue) ? [...currentValue] : [];
          let nextArray = [...currentArray];
          const isSelected = currentArray.includes(techId);

          if (catKey === "webFrontend") {
            if (techId === "none") {
              nextArray = ["none"];
            } else if (isSelected) {
              if (currentArray.length > 1) {
                nextArray = nextArray.filter((id) => id !== techId);
              } else {
                nextArray = ["none"];
              }
            } else {
              nextArray = [techId];
            }
          } else if (catKey === "nativeFrontend") {
            if (techId === "none") {
              nextArray = ["none"];
            } else if (isSelected) {
              nextArray = ["none"];
            } else {
              nextArray = [techId];
            }
          } else {
            if (isSelected) {
              nextArray = nextArray.filter((id) => id !== techId);
            } else {
              nextArray.push(techId);
            }
            if (nextArray.length > 1) {
              nextArray = nextArray.filter((id) => id !== "none");
            }
            if (
              nextArray.length === 0 &&
              (catKey === "codeQuality" ||
                catKey === "documentation" ||
                catKey === "appPlatforms" ||
                catKey === "examples")
            ) {
              // These categories can be empty - no need to set to ["none"]
            } else if (nextArray.length === 0) {
              nextArray = ["none"];
            }
          }

          const uniqueNext = [...new Set(nextArray)].sort();
          const uniqueCurrent = [...new Set(currentArray)].sort();

          if (JSON.stringify(uniqueNext) !== JSON.stringify(uniqueCurrent)) {
            update[catKey] = uniqueNext;
          }
        } else {
          if (currentValue !== techId) {
            // Type cast needed because techId is string but some fields have narrower types
            (update as Record<string, string>)[catKey] = techId;
          } else {
            if ((category === "git" || category === "install") && techId === "false") {
              (update as Record<string, string>)[catKey] = "true";
            } else if ((category === "git" || category === "install") && techId === "true") {
              (update as Record<string, string>)[catKey] = "false";
            }
          }
        }

        return Object.keys(update).length > 0 ? update : {};
      });
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetStack = () => {
    startTransition(() => {
      setStack(DEFAULT_STACK);
    });
    contentRef.current?.scrollTo(0, 0);
  };

  const saveCurrentStack = () => {
    const stackToUse = compatibilityAnalysis.adjustedStack || stack;
    const projectName = stackToUse.projectName || "my-app";
    const formattedProjectName = formatProjectName(projectName);
    const stackToSave = { ...stackToUse, projectName: formattedProjectName };
    localStorage.setItem("betterFullstackPreference", JSON.stringify(stackToSave));
    setLastSavedStack(stackToSave);
    toast.success("Your stack configuration has been saved");
  };

  const loadSavedStack = () => {
    if (lastSavedStack) {
      startTransition(() => {
        setStack(lastSavedStack);
      });
      contentRef.current?.scrollTo(0, 0);
      toast.success("Saved configuration loaded");
    }
  };

  const applyPreset = (presetId: string) => {
    const preset = PRESET_TEMPLATES.find((template) => template.id === presetId);
    if (preset) {
      startTransition(() => {
        // Merge preset with DEFAULT_STACK to ensure all fields are present
        setStack({ ...DEFAULT_STACK, ...preset.stack } as StackState);
      });
      contentRef.current?.scrollTo(0, 0);
      toast.success(`Applied preset: ${preset.name}`);
    }
  };

  const [mobileTab, setMobileTab] = useState<MobileTab>("configure");

  // Collapsible sections - these categories can be expanded/collapsed
  const COLLAPSIBLE_CATEGORIES = [
    "nativeFrontend",
    "cssFramework",
    "payments",
    "email",
    "fileUpload",
    "logging",
    "observability",
    "ai",
    "stateManagement",
    "forms",
    "validation",
    "testing",
    "realtime",
    "jobQueue",
    "caching",
    "animation",
    "cms",
    "documentation",
  ];

  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(
    () => new Set(COLLAPSIBLE_CATEGORIES),
  );

  const toggleSection = (categoryKey: string) => {
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      if (next.has(categoryKey)) {
        next.delete(categoryKey);
      } else {
        next.add(categoryKey);
      }
      return next;
    });
  };

  const isCollapsible = (categoryKey: string) => COLLAPSIBLE_CATEGORIES.includes(categoryKey);
  const isCollapsed = (categoryKey: string) => collapsedSections.has(categoryKey);

  return (
    <TooltipProvider>
      {/* Mobile tab navigation - only visible on small screens */}
      <div className="flex flex-col h-full w-full overflow-hidden border-border text-foreground sm:grid sm:grid-cols-[auto_1fr]">
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
          {/* Mobile preview tab hidden for now - re-enable when ready
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
          */}
        </div>

        {/* Left sidebar - hidden on mobile unless summary tab selected */}
        <div
          className={cn(
            "flex w-full flex-col border-border sm:border-r sm:max-w-3xs md:max-w-xs lg:max-w-sm",
            mobileTab === "summary" ? "flex" : "hidden sm:flex",
          )}
        >
          <ScrollArea className="flex-1">
            <div className="flex h-full flex-col gap-3 p-3 sm:p-4 md:h-[calc(100vh-64px)]">
              <div className="flex flex-1 flex-col gap-3 overflow-hidden">
                <label className="flex shrink-0 flex-col">
                  <span className="mb-1 text-muted-foreground text-xs">Project Name:</span>
                  <input
                    type="text"
                    value={stack.projectName || ""}
                    onChange={(e) => {
                      setStack({ projectName: e.target.value });
                    }}
                    className={cn(
                      "w-full rounded border px-2 py-1 text-sm focus:outline-none",
                      projectNameError
                        ? "border-destructive bg-destructive/10 text-destructive-foreground"
                        : "border-border focus:border-primary",
                    )}
                    placeholder="my-app"
                  />
                  {projectNameError && (
                    <p className="mt-1 text-destructive text-xs">{projectNameError}</p>
                  )}
                  {(stack.projectName || "my-app").includes(" ") && (
                    <p className="mt-1 text-muted-foreground text-xs">
                      Will be saved as:{" "}
                      <code className="rounded bg-muted px-1 py-0.5 text-xs">
                        {(stack.projectName || "my-app").replace(/\s+/g, "-")}
                      </code>
                    </p>
                  )}
                </label>

                <div className="shrink-0 rounded border border-border p-2">
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
                          <span className="">Copied</span>
                        </>
                      ) : (
                        <>
                          <ClipboardCopy className="h-3 w-3 shrink-0" />
                          <span className="">Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex flex-1 flex-col overflow-hidden">
                  <h3 className="mb-2 font-medium text-foreground text-sm">
                    Selected Stack ({selectedStackCards.length})
                  </h3>
                  <div className="flex-1 overflow-y-auto pr-1">
                    <div className="flex flex-col gap-2 pb-2">{selectedStackCards}</div>
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
                    <ShareButton stackUrl={getStackUrl()} />

                    <PresetDropdown onApplyPreset={applyPreset} />

                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <button
                            type="button"
                            className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-border bg-fd-background px-2 py-1.5 font-medium text-muted-foreground text-xs transition-all hover:border-muted-foreground/30 hover:bg-muted hover:text-foreground"
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

        {/* Main content area - hidden on mobile unless configure/preview tab selected */}
        <div
          className={cn(
            "flex flex-1 flex-col overflow-hidden",
            mobileTab === "summary" ? "hidden sm:flex" : "flex",
          )}
        >
          {/* Desktop tab toggle */}
          <Tabs
            value={viewMode}
            onValueChange={(value: string) => {
              startTransition(() => {
                setViewMode(value as "command" | "preview");
              });
            }}
            className="hidden sm:flex sm:flex-col sm:flex-1 sm:overflow-hidden"
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
                {/* Preview tab hidden for now - re-enable when ready
                <TabsTrigger
                  value="preview"
                  className="relative gap-2 rounded-none border-b-2 border-transparent bg-transparent px-2 py-3 text-xs font-medium text-muted-foreground transition-none data-active:border-primary data-active:bg-transparent data-active:text-foreground data-active:shadow-none hover:text-foreground"
                >
                  <FolderTree className="h-3.5 w-3.5" />
                  Preview
                </TabsTrigger>
                */}
              </TabsList>
            </div>
            <TabsContent value="command" className="flex-1 min-h-0 overflow-hidden">
              <div ref={scrollAreaRef} className="h-full">
                <ScrollArea className="h-full overflow-hidden scroll-smooth">
                  <main className="p-3 sm:p-4">
                    {/* Ecosystem Tabs */}
                    <div className="mb-6 sm:mb-8">
                      <div className="mb-3 flex items-center border-border border-b pb-2 text-muted-foreground">
                        <Terminal className="mr-2 h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
                        <h2 className="font-semibold font-mono text-foreground text-sm sm:text-base">
                          Ecosystem
                        </h2>
                      </div>
                      <div className="flex gap-3">
                        {ECOSYSTEMS.map((ecosystem) => {
                          const isSelected = stack.ecosystem === ecosystem.id;
                          return (
                            <motion.button
                              key={ecosystem.id}
                              type="button"
                              className={cn(
                                "group relative flex flex-1 cursor-pointer items-center gap-3 rounded-xl border-2 px-4 py-4 transition-all",
                                isSelected
                                  ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                                  : "border-border bg-fd-background hover:border-primary/30 hover:bg-muted/5",
                              )}
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                              onClick={() => {
                                startTransition(() => {
                                  setStack({ ecosystem: ecosystem.id as Ecosystem });
                                });
                              }}
                            >
                              <div
                                className={cn(
                                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg transition-colors",
                                  isSelected ? "bg-primary/10" : "bg-muted/50 group-hover:bg-muted",
                                )}
                              >
                                <TechIcon
                                  icon={ecosystem.icon}
                                  name={ecosystem.name}
                                  className={cn(
                                    "h-6 w-6",
                                    ecosystem.id === "rust" && "invert-0 dark:invert",
                                  )}
                                />
                              </div>
                              <div className="text-left">
                                <span
                                  className={cn(
                                    "block font-semibold text-base",
                                    isSelected ? "text-primary" : "text-foreground",
                                  )}
                                >
                                  {ecosystem.name}
                                </span>
                                <p className="text-muted-foreground text-xs">
                                  {ecosystem.description}
                                </p>
                              </div>
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Category sections filtered by ecosystem */}
                    {(stack.ecosystem === "rust"
                      ? RUST_CATEGORY_ORDER
                      : stack.ecosystem === "python"
                        ? PYTHON_CATEGORY_ORDER
                        : stack.ecosystem === "go"
                          ? GO_CATEGORY_ORDER
                          : TYPESCRIPT_CATEGORY_ORDER
                    ).map((categoryKey) => {
                      // Skip astroIntegration - it will be rendered conditionally
                      if (categoryKey === "astroIntegration") return null;

                      const categoryOptions =
                        TECH_OPTIONS[categoryKey as keyof typeof TECH_OPTIONS] || [];
                      const categoryDisplayName = getCategoryDisplayName(categoryKey);

                      const filteredOptions = categoryOptions;

                      if (filteredOptions.length === 0) return null;

                      return (
                        <div key={categoryKey}>
                          <section
                            ref={(el) => {
                              sectionRefs.current[categoryKey] = el;
                            }}
                            id={`section-${categoryKey}`}
                            className="mb-6 scroll-mt-4 sm:mb-8"
                          >
                            <div
                              className={cn(
                                "mb-3 flex items-center border-border border-b pb-2 text-muted-foreground",
                                isCollapsible(categoryKey) &&
                                  "cursor-pointer hover:text-foreground transition-colors",
                              )}
                              onClick={
                                isCollapsible(categoryKey)
                                  ? () => toggleSection(categoryKey)
                                  : undefined
                              }
                            >
                              {isCollapsible(categoryKey) ? (
                                <motion.div
                                  animate={{ rotate: isCollapsed(categoryKey) ? 0 : 90 }}
                                  transition={{ duration: 0.2 }}
                                  className="mr-2"
                                >
                                  <ChevronRight className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
                                </motion.div>
                              ) : (
                                <Terminal className="mr-2 h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
                              )}
                              <h2 className="font-semibold font-mono text-foreground text-sm sm:text-base">
                                {categoryDisplayName}
                              </h2>
                              {isCollapsible(categoryKey) && isCollapsed(categoryKey) && (
                                <span className="ml-2 text-xs text-muted-foreground">
                                  ({filteredOptions.length} options)
                                </span>
                              )}
                              {compatibilityAnalysis.notes[categoryKey]?.hasIssue && (
                                <Tooltip delay={100}>
                                  <TooltipTrigger
                                    render={
                                      <InfoIcon className="ml-2 h-4 w-4 shrink-0 cursor-help text-muted-foreground" />
                                    }
                                  />
                                  <TooltipContent side="top" align="start">
                                    <ul className="list-disc space-y-1 pl-4 text-xs">
                                      {compatibilityAnalysis.notes[categoryKey].notes.map(
                                        (note) => (
                                          <li key={note}>{note}</li>
                                        ),
                                      )}
                                    </ul>
                                  </TooltipContent>
                                </Tooltip>
                              )}
                            </div>

                            <AnimatePresence initial={false}>
                              {(!isCollapsible(categoryKey) || !isCollapsed(categoryKey)) && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.3, ease: "easeInOut" }}
                                  className="overflow-hidden"
                                >
                                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3 2xl:grid-cols-4">
                                    {filteredOptions.map((tech) => {
                                      let isSelected = false;
                                      const category = categoryKey as keyof StackState;
                                      const currentValue = stack[category];

                                      if (
                                        category === "codeQuality" ||
                                        category === "documentation" ||
                                        category === "appPlatforms" ||
                                        category === "examples" ||
                                        category === "webFrontend" ||
                                        category === "nativeFrontend" ||
                                        category === "aiDocs"
                                      ) {
                                        isSelected = ((currentValue as string[]) || []).includes(
                                          tech.id,
                                        );
                                      } else {
                                        isSelected = currentValue === tech.id;
                                      }

                                      const isDisabled = !isOptionCompatible(
                                        stack,
                                        categoryKey as keyof typeof TECH_OPTIONS,
                                        tech.id,
                                      );

                                      const disabledReason = isDisabled
                                        ? getDisabledReason(
                                            stack,
                                            categoryKey as keyof typeof TECH_OPTIONS,
                                            tech.id,
                                          )
                                        : null;

                                      return (
                                        <motion.div
                                          key={tech.id}
                                          className={cn(
                                            "group relative cursor-pointer rounded-lg border p-3 transition-all sm:p-4",
                                            isSelected
                                              ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                                              : isDisabled
                                                ? "border-destructive/30 bg-destructive/5 opacity-50 hover:opacity-75"
                                                : "border-border bg-fd-background hover:border-primary/30 hover:bg-muted/5",
                                          )}
                                          whileHover={{ scale: 1.01 }}
                                          whileTap={{ scale: 0.99 }}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleTechSelect(
                                              categoryKey as keyof typeof TECH_OPTIONS,
                                              tech.id,
                                            );
                                          }}
                                          title={disabledReason || undefined}
                                        >
                                          {tech.default && !isSelected && (
                                            <span className="absolute top-2 right-2 rounded-full bg-muted px-2 py-0.5 font-medium text-[10px] text-muted-foreground">
                                              Default
                                            </span>
                                          )}
                                          <div className="flex items-start gap-3">
                                            {tech.icon !== "" && (
                                              <div
                                                className={cn(
                                                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors",
                                                  isSelected
                                                    ? "bg-primary/10"
                                                    : "bg-muted/50 group-hover:bg-muted",
                                                )}
                                              >
                                                <TechIcon
                                                  icon={tech.icon}
                                                  name={tech.name}
                                                  className={cn("h-5 w-5", tech.className)}
                                                />
                                              </div>
                                            )}
                                            <div className="min-w-0 flex-1 pt-0.5">
                                              <span
                                                className={cn(
                                                  "block font-semibold text-sm",
                                                  isSelected ? "text-primary" : "text-foreground",
                                                )}
                                              >
                                                {tech.name}
                                              </span>
                                              <p className="mt-0.5 line-clamp-2 text-muted-foreground text-xs leading-relaxed">
                                                {tech.description}
                                              </p>
                                            </div>
                                          </div>
                                        </motion.div>
                                      );
                                    })}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </section>

                          {/* Astro Integration - shown only when Astro is selected, right after webFrontend */}
                          {categoryKey === "webFrontend" && (
                            <AnimatePresence>
                              {stack.webFrontend.includes("astro") && (
                                <motion.section
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.3, ease: "easeInOut" }}
                                  className="mb-6 scroll-mt-4 sm:mb-8 overflow-hidden"
                                >
                                  <div className="mb-3 flex items-center border-border border-b pb-2 text-muted-foreground">
                                    <Terminal className="mr-2 h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
                                    <h2 className="font-semibold font-mono text-foreground text-sm sm:text-base">
                                      Astro Integration
                                    </h2>
                                  </div>
                                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3 2xl:grid-cols-4">
                                    {(TECH_OPTIONS.astroIntegration || []).map((tech) => {
                                      const isSelected = stack.astroIntegration === tech.id;
                                      const isDisabled = !isOptionCompatible(
                                        stack,
                                        "astroIntegration",
                                        tech.id,
                                      );
                                      const disabledReason = isDisabled
                                        ? getDisabledReason(stack, "astroIntegration", tech.id)
                                        : null;

                                      return (
                                        <motion.div
                                          key={tech.id}
                                          className={cn(
                                            "group relative cursor-pointer rounded-lg border p-3 transition-all sm:p-4",
                                            isSelected
                                              ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                                              : isDisabled
                                                ? "border-destructive/30 bg-destructive/5 opacity-50 hover:opacity-75"
                                                : "border-border bg-fd-background hover:border-primary/30 hover:bg-muted/5",
                                          )}
                                          whileHover={{ scale: 1.01 }}
                                          whileTap={{ scale: 0.99 }}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleTechSelect("astroIntegration", tech.id);
                                          }}
                                          title={disabledReason || undefined}
                                        >
                                          {tech.default && !isSelected && (
                                            <span className="absolute top-2 right-2 rounded-full bg-muted px-2 py-0.5 font-medium text-[10px] text-muted-foreground">
                                              Default
                                            </span>
                                          )}
                                          <div className="flex items-start gap-3">
                                            {tech.icon !== "" && (
                                              <div
                                                className={cn(
                                                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors",
                                                  isSelected
                                                    ? "bg-primary/10"
                                                    : "bg-muted/50 group-hover:bg-muted",
                                                )}
                                              >
                                                <TechIcon
                                                  icon={tech.icon}
                                                  name={tech.name}
                                                  className={cn("h-5 w-5", tech.className)}
                                                />
                                              </div>
                                            )}
                                            <div className="min-w-0 flex-1 pt-0.5">
                                              <span
                                                className={cn(
                                                  "block font-semibold text-sm",
                                                  isSelected ? "text-primary" : "text-foreground",
                                                )}
                                              >
                                                {tech.name}
                                              </span>
                                              <p className="mt-0.5 line-clamp-2 text-muted-foreground text-xs leading-relaxed">
                                                {tech.description}
                                              </p>
                                            </div>
                                          </div>
                                        </motion.div>
                                      );
                                    })}
                                  </div>
                                </motion.section>
                              )}
                            </AnimatePresence>
                          )}
                        </div>
                      );
                    })}

                    <div className="h-10" />
                  </main>
                </ScrollArea>
              </div>
            </TabsContent>
            {/* Preview panel hidden for now - re-enable when ready
            <TabsContent value="preview" className="flex-1 min-h-0 overflow-hidden">
              <PreviewPanel
                stack={stack}
                selectedFilePath={selectedFile}
                onSelectFile={setSelectedFile}
              />
            </TabsContent>
            */}
          </Tabs>

          {/* Mobile content - shown based on mobileTab */}
          <div className="flex flex-1 flex-col overflow-hidden sm:hidden">
            {mobileTab === "configure" && (
              <ScrollArea className="h-full overflow-hidden scroll-smooth">
                <main className="p-3">
                  {CATEGORY_ORDER.map((categoryKey) => {
                    // Skip astroIntegration - it will be rendered conditionally
                    if (categoryKey === "astroIntegration") return null;

                    const categoryOptions =
                      TECH_OPTIONS[categoryKey as keyof typeof TECH_OPTIONS] || [];
                    const categoryDisplayName = getCategoryDisplayName(categoryKey);

                    const filteredOptions = categoryOptions;

                    if (filteredOptions.length === 0) return null;

                    return (
                      <div key={categoryKey}>
                        <section id={`section-mobile-${categoryKey}`} className="mb-6 scroll-mt-4">
                          <div
                            className={cn(
                              "mb-3 flex items-center border-border border-b pb-2 text-muted-foreground",
                              isCollapsible(categoryKey) &&
                                "cursor-pointer hover:text-foreground transition-colors",
                            )}
                            onClick={
                              isCollapsible(categoryKey)
                                ? () => toggleSection(categoryKey)
                                : undefined
                            }
                          >
                            {isCollapsible(categoryKey) ? (
                              <motion.div
                                animate={{ rotate: isCollapsed(categoryKey) ? 0 : 90 }}
                                transition={{ duration: 0.2 }}
                                className="mr-2"
                              >
                                <ChevronRight className="h-4 w-4 shrink-0" />
                              </motion.div>
                            ) : (
                              <Terminal className="mr-2 h-4 w-4 shrink-0" />
                            )}
                            <h2 className="font-semibold font-mono text-foreground text-sm">
                              {categoryDisplayName}
                            </h2>
                            {isCollapsible(categoryKey) && isCollapsed(categoryKey) && (
                              <span className="ml-2 text-xs text-muted-foreground">
                                ({filteredOptions.length} options)
                              </span>
                            )}
                            {compatibilityAnalysis.notes[categoryKey]?.hasIssue && (
                              <Tooltip delay={100}>
                                <TooltipTrigger
                                  render={
                                    <InfoIcon className="ml-2 h-4 w-4 shrink-0 cursor-help text-muted-foreground" />
                                  }
                                />
                                <TooltipContent side="top" align="start">
                                  <ul className="list-disc space-y-1 pl-4 text-xs">
                                    {compatibilityAnalysis.notes[categoryKey].notes.map((note) => (
                                      <li key={note}>{note}</li>
                                    ))}
                                  </ul>
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </div>

                          <AnimatePresence initial={false}>
                            {(!isCollapsible(categoryKey) || !isCollapsed(categoryKey)) && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="overflow-hidden"
                              >
                                <div className="grid grid-cols-1 gap-2">
                                  {filteredOptions.map((tech) => {
                                    let isSelected = false;
                                    const category = categoryKey as keyof StackState;
                                    const currentValue = stack[category];

                                    if (
                                      category === "codeQuality" ||
                                      category === "documentation" ||
                                      category === "appPlatforms" ||
                                      category === "examples" ||
                                      category === "webFrontend" ||
                                      category === "nativeFrontend" ||
                                      category === "aiDocs"
                                    ) {
                                      isSelected = ((currentValue as string[]) || []).includes(
                                        tech.id,
                                      );
                                    } else {
                                      isSelected = currentValue === tech.id;
                                    }

                                    const isDisabled = !isOptionCompatible(
                                      stack,
                                      categoryKey as keyof typeof TECH_OPTIONS,
                                      tech.id,
                                    );

                                    return (
                                      <motion.div
                                        key={tech.id}
                                        className={cn(
                                          "group relative cursor-pointer rounded-lg border p-3 transition-all",
                                          isSelected
                                            ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                                            : isDisabled
                                              ? "border-destructive/30 bg-destructive/5 opacity-50"
                                              : "border-border bg-fd-background hover:border-primary/30 hover:bg-muted/5",
                                        )}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() =>
                                          handleTechSelect(
                                            categoryKey as keyof typeof TECH_OPTIONS,
                                            tech.id,
                                          )
                                        }
                                      >
                                        {tech.default && !isSelected && (
                                          <span className="absolute top-2 right-2 rounded-full bg-muted px-2 py-0.5 font-medium text-[10px] text-muted-foreground">
                                            Default
                                          </span>
                                        )}
                                        <div className="flex items-start gap-3">
                                          {tech.icon !== "" && (
                                            <div
                                              className={cn(
                                                "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors",
                                                isSelected ? "bg-primary/10" : "bg-muted/50",
                                              )}
                                            >
                                              <TechIcon
                                                icon={tech.icon}
                                                name={tech.name}
                                                className={cn("h-5 w-5", tech.className)}
                                              />
                                            </div>
                                          )}
                                          <div className="min-w-0 flex-1 pt-0.5">
                                            <span
                                              className={cn(
                                                "block font-semibold text-sm",
                                                isSelected ? "text-primary" : "text-foreground",
                                              )}
                                            >
                                              {tech.name}
                                            </span>
                                            <p className="mt-0.5 line-clamp-2 text-muted-foreground text-xs leading-relaxed">
                                              {tech.description}
                                            </p>
                                          </div>
                                        </div>
                                      </motion.div>
                                    );
                                  })}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </section>

                        {/* Astro Integration - shown only when Astro is selected, right after webFrontend (Mobile) */}
                        {categoryKey === "webFrontend" && (
                          <AnimatePresence>
                            {stack.webFrontend.includes("astro") && (
                              <motion.section
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="mb-6 scroll-mt-4 overflow-hidden"
                              >
                                <div className="mb-3 flex items-center border-border border-b pb-2 text-muted-foreground">
                                  <Terminal className="mr-2 h-4 w-4 shrink-0" />
                                  <h2 className="font-semibold font-mono text-foreground text-sm">
                                    Astro Integration
                                  </h2>
                                </div>
                                <div className="grid grid-cols-1 gap-2">
                                  {(TECH_OPTIONS.astroIntegration || []).map((tech) => {
                                    const isSelected = stack.astroIntegration === tech.id;
                                    const isDisabled = !isOptionCompatible(
                                      stack,
                                      "astroIntegration",
                                      tech.id,
                                    );

                                    return (
                                      <motion.div
                                        key={tech.id}
                                        className={cn(
                                          "group relative cursor-pointer rounded-lg border p-3 transition-all",
                                          isSelected
                                            ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                                            : isDisabled
                                              ? "border-destructive/30 bg-destructive/5 opacity-50"
                                              : "border-border bg-fd-background hover:border-primary/30 hover:bg-muted/5",
                                        )}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() =>
                                          handleTechSelect("astroIntegration", tech.id)
                                        }
                                      >
                                        {tech.default && !isSelected && (
                                          <span className="absolute top-2 right-2 rounded-full bg-muted px-2 py-0.5 font-medium text-[10px] text-muted-foreground">
                                            Default
                                          </span>
                                        )}
                                        <div className="flex items-start gap-3">
                                          {tech.icon !== "" && (
                                            <div
                                              className={cn(
                                                "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors",
                                                isSelected ? "bg-primary/10" : "bg-muted/50",
                                              )}
                                            >
                                              <TechIcon
                                                icon={tech.icon}
                                                name={tech.name}
                                                className={cn("h-5 w-5", tech.className)}
                                              />
                                            </div>
                                          )}
                                          <div className="min-w-0 flex-1 pt-0.5">
                                            <span
                                              className={cn(
                                                "block font-semibold text-sm",
                                                isSelected ? "text-primary" : "text-foreground",
                                              )}
                                            >
                                              {tech.name}
                                            </span>
                                            <p className="mt-0.5 line-clamp-2 text-muted-foreground text-xs leading-relaxed">
                                              {tech.description}
                                            </p>
                                          </div>
                                        </div>
                                      </motion.div>
                                    );
                                  })}
                                </div>
                              </motion.section>
                            )}
                          </AnimatePresence>
                        )}
                      </div>
                    );
                  })}

                  <div className="h-10" />
                </main>
              </ScrollArea>
            )}
            {/* Mobile preview hidden for now - re-enable when ready
            {mobileTab === "preview" && (
              <PreviewPanel
                stack={stack}
                selectedFilePath={selectedFile}
                onSelectFile={setSelectedFile}
              />
            )}
            */}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default StackBuilder;
