"use client";

import {
  Check,
  ChevronDown,
  ClipboardCopy,
  InfoIcon,
  List,
  Settings,
  Terminal,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { startTransition, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import type { Ecosystem } from "@/lib/types";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { PresetDropdown } from "./preset-dropdown";
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

// ─── Helpers ─────────────────────────────────────────────────────────────────

type MobileTab = "summary" | "configure";

function formatProjectName(name: string): string {
  return name.replace(/\s+/g, "-");
}

function getSelectedCount(category: keyof typeof TECH_OPTIONS, stack: StackState): number {
  const catKey = category as keyof StackState;
  const value = stack[catKey];

  if (Array.isArray(value)) {
    return (value as string[]).filter((v) => v !== "none").length;
  }

  if (typeof value === "string" && value !== "none" && value !== "false") {
    if ((category === "git" || category === "install" || category === "auth") && value === "true")
      return 0;
    return 1;
  }

  return 0;
}

function isSelectedCheck(stack: StackState, categoryKey: string, techId: string): boolean {
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
    return ((currentValue as string[]) || []).includes(techId);
  }
  return currentValue === techId;
}

// ─── SidebarAccordionItem ────────────────────────────────────────────────────

function SidebarAccordionItem({
  category,
  isOpen,
  onToggle,
  stack,
  handleTechSelect,
  compatibilityNotes,
}: {
  category: keyof typeof TECH_OPTIONS;
  isOpen: boolean;
  onToggle: () => void;
  stack: StackState;
  handleTechSelect: (cat: keyof typeof TECH_OPTIONS, techId: string) => void;
  compatibilityNotes?: { notes: string[]; hasIssue: boolean };
}) {
  const options = TECH_OPTIONS[category];
  if (!options || options.length === 0) return null;

  const count = getSelectedCount(category, stack);
  const displayName = getCategoryDisplayName(category);

  return (
    <div className="border-b border-border/50 last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "flex w-full items-center justify-between px-3 py-2.5 text-left text-sm transition-colors",
          isOpen
            ? "bg-muted/80 text-foreground font-medium"
            : "text-muted-foreground hover:bg-muted/40 hover:text-foreground",
        )}
      >
        <span className="truncate pr-2 font-pixel">{displayName}</span>
        <div className="flex items-center gap-1.5 shrink-0">
          {compatibilityNotes?.hasIssue && <InfoIcon className="h-3.5 w-3.5 text-amber-500" />}
          {count > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 font-mono text-[10px] font-semibold text-primary-foreground">
              {count}
            </span>
          )}
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown className="h-3.5 w-3.5" />
          </motion.div>
        </div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="space-y-0.5 px-2 py-1.5">
              {options.map((option) => {
                const selected = isSelectedCheck(stack, category, option.id);
                const disabled = !isOptionCompatible(stack, category, option.id);
                const disabledReason = disabled
                  ? getDisabledReason(stack, category, option.id)
                  : null;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => {
                      if (!disabled) {
                        handleTechSelect(category, option.id);
                      }
                    }}
                    disabled={disabled}
                    title={disabledReason || option.description}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs transition-colors",
                      selected
                        ? "bg-primary/10 text-foreground"
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                      disabled && "opacity-40 cursor-not-allowed",
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors",
                        selected ? "border-primary bg-primary" : "border-border bg-background",
                      )}
                    >
                      {selected && <Check className="h-2.5 w-2.5 text-primary-foreground" />}
                    </div>
                    {option.icon !== undefined && (
                      <TechIcon
                        techId={option.id}
                        icon={option.icon}
                        name={option.name}
                        className="h-4 w-4"
                      />
                    )}
                    <span className="truncate">{option.name}</span>
                    {option.default && !selected && (
                      <span className="ml-auto shrink-0 rounded bg-muted px-1 py-0.5 text-[9px] text-muted-foreground">
                        default
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Collapsible section config ──────────────────────────────────────────────

const INITIALLY_COLLAPSED_SET = new Set([
  "nativeFrontend",
  "payments",
  "email",
  "fileUpload",
  "logging",
  "observability",
  "featureFlags",
  "analytics",
  "ai",
  "stateManagement",
  "forms",
  "validation",
  "testing",
  "realtime",
  "jobQueue",
  "caching",
  "search",
  "fileStorage",
  "animation",
  "cms",
  "documentation",
  "appPlatforms",
]);

// ─── Main Component ──────────────────────────────────────────────────────────

const StackBuilder = () => {
  const [stack, setStack] = useStackState();

  const [command, setCommand] = useState("");
  const [copied, setCopied] = useState(false);
  const [lastSavedStack, setLastSavedStack] = useState<StackState | null>(null);
  const [, setLastChanges] = useState<Array<{ category: string; message: string }>>([]);
  const [mobileTab, setMobileTab] = useState<MobileTab>("configure");
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(() => {
    const initial = new Set(INITIALLY_COLLAPSED_SET);
    for (const cat of INITIALLY_COLLAPSED_SET) {
      const catKey = cat as keyof StackState;
      if (JSON.stringify(stack[catKey]) !== JSON.stringify(DEFAULT_STACK[catKey])) {
        initial.delete(cat);
      }
    }
    return initial;
  });

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const mainScrollRef = useRef<HTMLDivElement | null>(null);
  const lastAppliedStackString = useRef<string>("");

  const compatibilityAnalysis = analyzeStackCompatibility(stack);
  const projectNameError = validateProjectName(stack.projectName || "");

  // ─── Derived state ──────────────────────────────────────────────────────

  const categoryOrder = useMemo(() => {
    switch (stack.ecosystem) {
      case "rust":
        return RUST_CATEGORY_ORDER;
      case "python":
        return PYTHON_CATEGORY_ORDER;
      case "go":
        return GO_CATEGORY_ORDER;
      default:
        return TYPESCRIPT_CATEGORY_ORDER;
    }
  }, [stack.ecosystem]);

  // Open first category when ecosystem changes
  useEffect(() => {
    if (
      categoryOrder.length > 0 &&
      !categoryOrder.includes(openCategory as keyof typeof TECH_OPTIONS)
    ) {
      setOpenCategory(categoryOrder[0] || null);
    }
  }, [categoryOrder, openCategory]);

  // Get the main scroll viewport for scrollIntoView
  useEffect(() => {
    if (mainScrollRef.current) {
      const viewport = mainScrollRef.current.querySelector<HTMLDivElement>(
        '[data-slot="scroll-area-viewport"]',
      );
      if (viewport) {
        mainScrollRef.current = viewport;
      }
    }
  }, []);

  // ─── URL & command generation ───────────────────────────────────────────

  const getStackUrl = (): string => {
    const stackToUse = compatibilityAnalysis.adjustedStack || stack;
    const projectName = stackToUse.projectName || "my-app";
    const formattedProjectName = formatProjectName(projectName);
    return generateStackSharingUrl({ ...stackToUse, projectName: formattedProjectName });
  };

  // ─── Side effects ──────────────────────────────────────────────────────

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
              toast.info(compatibilityAnalysis.changes[0].message, { duration: 4000 });
            } else if (compatibilityAnalysis.changes.length > 1) {
              const message = `${compatibilityAnalysis.changes.length} compatibility adjustments made:\n${compatibilityAnalysis.changes.map((c) => `\u2022 ${c.message}`).join("\n")}`;
              toast.info(message, { duration: 5000 });
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
    const cmd = generateStackCommand({ ...stackToUse, projectName: formattedProjectName });
    setCommand(cmd);
  }, [stack, compatibilityAnalysis.adjustedStack]);

  // ─── Handlers ───────────────────────────────────────────────────────────

  const handleTechSelect = (category: keyof typeof TECH_OPTIONS, techId: string) => {
    if (!isOptionCompatible(stack, category, techId)) return;

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
              // These categories can be empty
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
      toast.success("Saved configuration loaded");
    }
  };

  const applyPreset = (presetId: string) => {
    const preset = PRESET_TEMPLATES.find((template) => template.id === presetId);
    if (preset) {
      startTransition(() => {
        setStack({ ...DEFAULT_STACK, ...preset.stack } as StackState);
      });
      toast.success(`Applied preset: ${preset.name}`);
    }
  };

  const handleAccordionToggle = useCallback((category: string) => {
    setOpenCategory((prev) => (prev === category ? null : category));
    setCollapsedSections((prev) => {
      if (!prev.has(category)) return prev;
      const next = new Set(prev);
      next.delete(category);
      return next;
    });
    // Scroll to the corresponding section in main content
    const sectionEl = sectionRefs.current[category];
    if (sectionEl) {
      sectionEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const toggleSection = useCallback((categoryKey: string) => {
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      if (next.has(categoryKey)) {
        next.delete(categoryKey);
      } else {
        next.add(categoryKey);
      }
      return next;
    });
  }, []);

  // ─── Build the categories to show in sidebar (with astro integration) ──

  const sidebarCategories = useMemo(() => {
    const cats: (keyof typeof TECH_OPTIONS)[] = [];
    for (const cat of categoryOrder) {
      if (cat === "astroIntegration") {
        if (stack.webFrontend.includes("astro")) {
          cats.push(cat);
        }
        continue;
      }
      cats.push(cat);
    }
    return cats;
  }, [categoryOrder, stack.webFrontend]);

  // ─── Render ─────────────────────────────────────────────────────────────

  return (
    <TooltipProvider>
      <div className="flex h-full w-full flex-col overflow-hidden border-border text-foreground">
        {/* Mobile tab navigation */}
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
            <span>Categories</span>
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
        </div>

        <div className="flex min-h-0 flex-1 overflow-hidden">
          {/* ─── Left Sidebar ───────────────────────────────────────────────── */}
          <aside
            className={cn(
              "flex h-full w-full shrink-0 flex-col overflow-hidden border-r border-border bg-background sm:w-[270px]",
              mobileTab === "summary" ? "flex" : "hidden sm:flex",
            )}
          >
            {/* Ecosystem Selector */}
            <div className="border-b border-border p-3">
              <p className="mb-2 font-pixel text-[10px] uppercase tracking-wider text-muted-foreground">
                Ecosystem
              </p>
              <div className="space-y-1">
                {ECOSYSTEMS.map((eco) => (
                  <button
                    key={eco.id}
                    type="button"
                    onClick={() => {
                      startTransition(() => {
                        setStack({ ecosystem: eco.id as Ecosystem });
                      });
                    }}
                    className={cn(
                      "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-all",
                      stack.ecosystem === eco.id
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <TechIcon
                      techId={eco.id}
                      icon={eco.icon}
                      name={eco.name}
                      className={cn(
                        "h-4 w-4",
                        stack.ecosystem === eco.id ? "brightness-0 invert" : "",
                      )}
                    />
                    <span className="font-pixel">{eco.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Category Accordion */}
            <div className="relative min-h-0 flex-1">
              <div className="absolute inset-0">
                <ScrollArea className="h-full">
                  <div className="py-1">
                    {sidebarCategories.map((category) => (
                      <SidebarAccordionItem
                        key={category}
                        category={category}
                        isOpen={openCategory === category}
                        onToggle={() => handleAccordionToggle(category)}
                        stack={stack}
                        handleTechSelect={handleTechSelect}
                        compatibilityNotes={compatibilityAnalysis.notes[category]}
                      />
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>

            {/* Sidebar Command (Option 2) */}
            <div className="relative z-10 border-t border-border bg-background px-3 pt-2 pb-1">
              <div className="rounded-md border border-border bg-fd-background p-2">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <Terminal className="h-3 w-3 text-muted-foreground" />
                    <span className="font-pixel text-[10px] text-muted-foreground">Command</span>
                  </div>
                  <button
                    type="button"
                    onClick={copyToClipboard}
                    className={cn(
                      "flex items-center gap-1 rounded px-1.5 py-0.5 font-mono text-[10px] transition-colors",
                      copied
                        ? "text-green-600"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    {copied ? (
                      <>
                        <Check className="h-2.5 w-2.5" />
                        Copied
                      </>
                    ) : (
                      <>
                        <ClipboardCopy className="h-2.5 w-2.5" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <code className="block break-all text-muted-foreground text-[11px] leading-relaxed max-h-16 overflow-y-auto">
                  <span className="select-none text-chart-4">$ </span>
                  {command}
                </code>
              </div>
            </div>

            {/* Sidebar Footer */}
            <div className="relative z-10 border-t border-border bg-background p-3 space-y-2">
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
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-border bg-fd-background px-2 py-1.5 text-muted-foreground transition-all hover:border-muted-foreground/30 hover:bg-muted hover:text-foreground"
                      />
                    }
                  >
                    <Settings className="h-3.5 w-3.5" />
                    <span className="font-pixel text-[9px] leading-none">Settings</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64 bg-fd-background">
                    <YoloToggle stack={stack} onToggle={(yolo) => setStack({ yolo })} />
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </aside>

          {/* ─── Main Content Area ──────────────────────────────────────────── */}
          <main
            className={cn(
              "flex min-w-0 flex-1 flex-col overflow-hidden",
              mobileTab === "summary" ? "hidden sm:flex" : "flex",
            )}
          >
            <div className="relative min-h-0 flex-1">
              <div className="absolute inset-0">
                <ScrollArea ref={mainScrollRef} className="h-full">
                  <div className="p-3 sm:p-4">
                    {/* Project Name */}
                    <div className="mb-6">
                      <label
                        htmlFor="project-name"
                        className="mb-1.5 block font-pixel text-[10px] uppercase tracking-wider text-muted-foreground"
                      >
                        Project Name
                      </label>
                      <Input
                        id="project-name"
                        value={stack.projectName || ""}
                        onChange={(e) => setStack({ projectName: e.target.value })}
                        placeholder="my-app"
                        className={cn(
                          "max-w-sm",
                          projectNameError
                            ? "border-destructive bg-destructive/10 text-destructive-foreground"
                            : "focus-visible:border-primary",
                        )}
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
                    </div>

                    {/* Category sections - all options for each category */}
                    {categoryOrder.map((categoryKey) => {
                      // Skip astroIntegration - rendered conditionally after webFrontend
                      if (categoryKey === "astroIntegration") return null;

                      const categoryOptions =
                        TECH_OPTIONS[categoryKey as keyof typeof TECH_OPTIONS] || [];
                      const categoryDisplayName = getCategoryDisplayName(categoryKey);

                      if (categoryOptions.length === 0) return null;

                      const isSectionCollapsed = collapsedSections.has(categoryKey);
                      const sectionSelectedCount = getSelectedCount(
                        categoryKey as keyof typeof TECH_OPTIONS,
                        stack,
                      );

                      return (
                        <div key={categoryKey}>
                          <section
                            ref={(el) => {
                              sectionRefs.current[categoryKey] = el;
                            }}
                            id={`section-${categoryKey}`}
                            className="mb-6 scroll-mt-4 sm:mb-8"
                          >
                            <button
                              type="button"
                              onClick={() => toggleSection(categoryKey)}
                              className="mb-3 flex w-full items-center gap-2 border-b border-border pb-2 text-left transition-opacity hover:opacity-80"
                            >
                              <Terminal className="h-4 w-4 shrink-0 text-muted-foreground sm:h-5 sm:w-5" />
                              <h2 className="flex-1 font-pixel text-foreground text-sm sm:text-base">
                                {categoryDisplayName}
                              </h2>
                              {compatibilityAnalysis.notes[categoryKey]?.hasIssue && (
                                <InfoIcon className="h-4 w-4 shrink-0 text-amber-500" />
                              )}
                              {isSectionCollapsed && sectionSelectedCount > 0 && (
                                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 font-mono text-[10px] font-semibold text-primary-foreground">
                                  {sectionSelectedCount}
                                </span>
                              )}
                              <motion.div
                                animate={{ rotate: isSectionCollapsed ? 0 : 180 }}
                                transition={{ duration: 0.2 }}
                              >
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                              </motion.div>
                            </button>
                            <AnimatePresence initial={false}>
                              {!isSectionCollapsed && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.25, ease: "easeInOut" }}
                                  className="overflow-hidden"
                                >
                                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3 2xl:grid-cols-4">
                                    {categoryOptions.map((tech) => {
                                      const isSelected = isSelectedCheck(
                                        stack,
                                        categoryKey,
                                        tech.id,
                                      );
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
                                                : "border-border bg-fd-background hover:border-primary/40 hover:bg-gradient-to-br hover:from-primary/6 hover:to-transparent hover:shadow-[0_0_10px_0px_hsl(var(--primary)/0.10)]",
                                          )}
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
                                          {tech.legacy && (
                                            <Tooltip>
                                              <TooltipTrigger
                                                onClick={(e) => e.stopPropagation()}
                                                className="absolute top-2 right-2 cursor-default"
                                              >
                                                <span className="rounded-sm border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 font-pixel text-[9px] text-amber-500 dark:text-amber-400">
                                                  Legacy
                                                </span>
                                              </TooltipTrigger>
                                              <TooltipContent>
                                                No longer actively maintained
                                              </TooltipContent>
                                            </Tooltip>
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
                                                  techId={tech.id}
                                                  icon={tech.icon}
                                                  name={tech.name}
                                                  className="h-5 w-5"
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
                                  ref={(el) => {
                                    sectionRefs.current.astroIntegration = el;
                                  }}
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.3, ease: "easeInOut" }}
                                  className="mb-6 scroll-mt-4 sm:mb-8 overflow-hidden"
                                >
                                  <div className="mb-3 flex items-center gap-2 border-border border-b pb-2">
                                    <Terminal className="h-4 w-4 shrink-0 text-muted-foreground sm:h-5 sm:w-5" />
                                    <h2 className="font-pixel text-foreground text-sm sm:text-base">
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
                                                : "border-border bg-fd-background hover:border-primary/40 hover:bg-gradient-to-br hover:from-primary/6 hover:to-transparent hover:shadow-[0_0_10px_0px_hsl(var(--primary)/0.10)]",
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
                                          {tech.legacy && (
                                            <Tooltip>
                                              <TooltipTrigger
                                                onClick={(e) => e.stopPropagation()}
                                                className="absolute top-2 right-2 cursor-default"
                                              >
                                                <span className="rounded-sm border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 font-pixel text-[9px] text-amber-500 dark:text-amber-400">
                                                  Legacy
                                                </span>
                                              </TooltipTrigger>
                                              <TooltipContent>
                                                No longer actively maintained
                                              </TooltipContent>
                                            </Tooltip>
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
                                                  techId={tech.id}
                                                  icon={tech.icon}
                                                  name={tech.name}
                                                  className="h-5 w-5"
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
                  </div>
                </ScrollArea>
              </div>
            </div>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default StackBuilder;
