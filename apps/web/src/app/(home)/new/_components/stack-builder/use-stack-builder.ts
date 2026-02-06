import { startTransition, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { DEFAULT_STACK, PRESET_TEMPLATES, type StackState, TECH_OPTIONS } from "@/lib/constant";
import { useStackState } from "@/lib/stack-url-state.client";
import { CATEGORY_ORDER, generateStackCommand, generateStackSharingUrl } from "@/lib/stack-utils";

import { analyzeStackCompatibility, isOptionCompatible, validateProjectName } from "../utils";

export type MobileTab = "summary" | "configure" | "preview";

function formatProjectName(name: string): string {
  return name.replace(/\s+/g, "-");
}

function withFormattedProjectName(stack: StackState): StackState {
  const projectName = stack.projectName || "my-better-t-app";
  return {
    ...stack,
    projectName: formatProjectName(projectName),
  };
}

export function useStackBuilder() {
  const [stack, setStack, viewMode, setViewMode, selectedFile, setSelectedFile] = useStackState();

  const [command, setCommand] = useState("");
  const [copied, setCopied] = useState(false);
  const [lastSavedStack, setLastSavedStack] = useState<StackState | null>(null);
  const [, setLastChanges] = useState<Array<{ category: string; message: string }>>([]);
  const [mobileTab, setMobileTab] = useState<MobileTab>("configure");

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

  useEffect(() => {
    const savedStack = localStorage.getItem("betterTStackPreference");
    if (!savedStack) {
      return;
    }

    try {
      const parsedStack = JSON.parse(savedStack) as StackState;
      setLastSavedStack(parsedStack);
    } catch (error) {
      console.error("Failed to parse saved stack", error);
      localStorage.removeItem("betterTStackPreference");
    }
  }, []);

  useEffect(() => {
    const adjustedStack = compatibilityAnalysis.adjustedStack;
    if (!adjustedStack) {
      return;
    }

    const adjustedStackString = JSON.stringify(adjustedStack);
    if (lastAppliedStackString.current === adjustedStackString) {
      return;
    }

    startTransition(() => {
      if (compatibilityAnalysis.changes.length === 1) {
        toast.info(compatibilityAnalysis.changes[0].message, { duration: 4000 });
      }

      if (compatibilityAnalysis.changes.length > 1) {
        const message = `${compatibilityAnalysis.changes.length} compatibility adjustments made:\n${compatibilityAnalysis.changes
          .map((change) => `• ${change.message}`)
          .join("\n")}`;

        toast.info(message, { duration: 5000 });
      }

      setLastChanges(compatibilityAnalysis.changes);
      setStack(adjustedStack);
      lastAppliedStackString.current = adjustedStackString;
    });
  }, [compatibilityAnalysis.adjustedStack, compatibilityAnalysis.changes, setStack]);

  useEffect(() => {
    const stackToUse = compatibilityAnalysis.adjustedStack || stack;
    setCommand(generateStackCommand(withFormattedProjectName(stackToUse)));
  }, [stack, compatibilityAnalysis.adjustedStack]);

  function getStackUrl(): string {
    const stackToUse = compatibilityAnalysis.adjustedStack || stack;
    return generateStackSharingUrl(withFormattedProjectName(stackToUse));
  }

  function getRandomStack() {
    const randomStack: Partial<StackState> = {};

    for (const category of CATEGORY_ORDER) {
      const options = TECH_OPTIONS[category as keyof typeof TECH_OPTIONS] || [];
      if (options.length === 0) {
        continue;
      }

      const catKey = category as keyof StackState;
      if (
        catKey === "webFrontend" ||
        catKey === "nativeFrontend" ||
        catKey === "addons" ||
        catKey === "examples"
      ) {
        if (catKey === "webFrontend" || catKey === "nativeFrontend") {
          const selectedOption = options[Math.floor(Math.random() * options.length)]?.id;
          if (selectedOption) {
            randomStack[catKey as "webFrontend" | "nativeFrontend"] = [selectedOption];
          }
          continue;
        }

        const numToPick = Math.floor(Math.random() * Math.min(options.length, 4));
        if (numToPick === 0) {
          randomStack[catKey as "addons" | "examples"] = ["none"];
          continue;
        }

        const shuffledOptions = [...options]
          .filter((opt) => opt.id !== "none")
          .sort(() => 0.5 - Math.random())
          .slice(0, numToPick);

        randomStack[catKey as "addons" | "examples"] = shuffledOptions.map((opt) => opt.id);
        continue;
      }

      const selectedOption = options[Math.floor(Math.random() * options.length)]?.id;
      if (selectedOption) {
        randomStack[catKey] = selectedOption as never;
      }
    }

    startTransition(() => {
      setStack({
        ...(randomStack as StackState),
        projectName: stack.projectName || "my-better-t-app",
      });
    });

    contentRef.current?.scrollTo(0, 0);
  }

  function handleTechSelect(category: keyof typeof TECH_OPTIONS, techId: string) {
    if (!isOptionCompatible(stack, category, techId)) {
      return;
    }

    startTransition(() => {
      setStack((currentStack: StackState) => {
        const catKey = category as keyof StackState;
        const update: Partial<StackState> = {};
        const currentValue = currentStack[catKey];

        if (
          catKey === "webFrontend" ||
          catKey === "nativeFrontend" ||
          catKey === "addons" ||
          catKey === "examples"
        ) {
          const currentArray = Array.isArray(currentValue) ? [...currentValue] : [];
          let nextArray = [...currentArray];
          const isSelected = currentArray.includes(techId);

          if (catKey === "webFrontend") {
            if (techId === "none") {
              nextArray = ["none"];
            } else if (isSelected) {
              nextArray =
                currentArray.length > 1 ? nextArray.filter((id) => id !== techId) : ["none"];
            } else {
              nextArray = [techId];
            }
          } else if (catKey === "nativeFrontend") {
            if (techId === "none" || isSelected) {
              nextArray = ["none"];
            } else {
              nextArray = [techId];
            }
          } else {
            nextArray = isSelected
              ? nextArray.filter((id) => id !== techId)
              : [...nextArray, techId];

            if (nextArray.length > 1) {
              nextArray = nextArray.filter((id) => id !== "none");
            }

            if (nextArray.length === 0 && catKey !== "addons" && catKey !== "examples") {
              nextArray = ["none"];
            }
          }

          const uniqueNext = [...new Set(nextArray)].sort();
          const uniqueCurrent = [...new Set(currentArray)].sort();

          if (JSON.stringify(uniqueNext) !== JSON.stringify(uniqueCurrent)) {
            update[catKey] = uniqueNext as never;
          }
        } else if (currentValue !== techId) {
          update[catKey] = techId as never;
        } else if ((category === "git" || category === "install") && techId === "false") {
          update[catKey] = "true" as never;
        } else if ((category === "git" || category === "install") && techId === "true") {
          update[catKey] = "false" as never;
        }

        return Object.keys(update).length > 0 ? update : {};
      });
    });
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function resetStack() {
    startTransition(() => {
      setStack(DEFAULT_STACK);
    });
    contentRef.current?.scrollTo(0, 0);
  }

  function saveCurrentStack() {
    const stackToSave = withFormattedProjectName(compatibilityAnalysis.adjustedStack || stack);
    localStorage.setItem("betterTStackPreference", JSON.stringify(stackToSave));
    setLastSavedStack(stackToSave);
    toast.success("Your stack configuration has been saved");
  }

  function loadSavedStack() {
    if (!lastSavedStack) {
      return;
    }

    startTransition(() => {
      setStack(lastSavedStack);
    });

    contentRef.current?.scrollTo(0, 0);
    toast.success("Saved configuration loaded");
  }

  function applyPreset(presetId: string) {
    const preset = PRESET_TEMPLATES.find((template) => template.id === presetId);
    if (!preset) {
      return;
    }

    startTransition(() => {
      setStack(preset.stack);
    });

    contentRef.current?.scrollTo(0, 0);
    toast.success(`Applied preset: ${preset.name}`);
  }

  return {
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
  };
}
