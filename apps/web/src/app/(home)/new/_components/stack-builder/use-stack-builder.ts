import { startTransition, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { type BuilderCopySource, stackSnapshot, track } from "@/lib/analytics";
import { DEFAULT_STACK, PRESET_TEMPLATES, type StackState, TECH_OPTIONS } from "@/lib/constant";
import { OBSERVABILITY_ADDONS, TASK_RUNNER_ADDONS } from "@/lib/sanitize-stack-addons";
import { applyStackUpdate, resolveStackCompatibility } from "@/lib/stack-compatibility";
import { StackStateSchema } from "@/lib/stack-schema";
import { useStackState } from "@/lib/stack-url-state.client";
import {
  CATEGORY_ORDER,
  formatProjectName,
  generateStackCommand,
  generateStackSharingUrl,
} from "@/lib/stack-utils";
import {
  analyzeStackCompatibility,
  isOptionCompatible,
  validateProjectName,
} from "@/lib/stack-validation";
import type { TechCategory } from "@/lib/types";

export type MobileTab = "build" | "preview";

export type CategoryProgressItem = {
  category: TechCategory;
  selected: number;
  total: number;
  done: boolean;
};

const CATEGORY_LIST = CATEGORY_ORDER as TechCategory[];
type StackUpdate = Partial<StackState> | ((prev: StackState) => Partial<StackState>);
type CompatibilityAnalysis = ReturnType<typeof analyzeStackCompatibility>;

function withFormattedProjectName(stack: StackState) {
  return { ...stack, projectName: formatProjectName(stack.projectName) };
}

export function getSelectedTechRemovalUpdate(
  stack: StackState,
  category: TechCategory,
  techId: string,
): Partial<StackState> {
  const effectiveStack = resolveStackCompatibility(stack).stack;
  const categoryKey = category as keyof StackState;
  const value = effectiveStack[categoryKey];
  const options = TECH_OPTIONS[category] || [];
  const hasNoneOption = options.some((option) => option.id === "none");
  const forceNoneFallback = category === "addons" || category === "examples";

  if (Array.isArray(value)) {
    const next = value.filter((id) => id !== techId);
    const fallback = next.length === 0 && (hasNoneOption || forceNoneFallback) ? ["none"] : next;
    return { [categoryKey]: fallback } as Partial<StackState>;
  }

  if (value === techId && hasNoneOption) {
    return { [categoryKey]: "none" } as Partial<StackState>;
  }

  return {};
}

export function getTechSelectionUpdate(
  stack: StackState,
  category: keyof typeof TECH_OPTIONS,
  techId: string,
): Partial<StackState> {
  const effectiveStack = resolveStackCompatibility(stack).stack;
  if (!isOptionCompatible(effectiveStack, category, techId)) {
    return {};
  }

  const catKey = category as keyof StackState;
  const update: Partial<StackState> = {};
  const currentValue = effectiveStack[catKey];

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
        nextArray = currentArray.length > 1 ? nextArray.filter((id) => id !== techId) : ["none"];
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
      nextArray = isSelected ? nextArray.filter((id) => id !== techId) : [...nextArray, techId];

      if (
        catKey === "addons" &&
        !isSelected &&
        (TASK_RUNNER_ADDONS as readonly string[]).includes(techId)
      ) {
        nextArray = nextArray.filter(
          (id) => id === techId || !(TASK_RUNNER_ADDONS as readonly string[]).includes(id),
        );
      }

      if (
        catKey === "addons" &&
        !isSelected &&
        (OBSERVABILITY_ADDONS as readonly string[]).includes(techId)
      ) {
        nextArray = nextArray.filter(
          (id) => id === techId || !(OBSERVABILITY_ADDONS as readonly string[]).includes(id),
        );
      }

      if (nextArray.length > 1) {
        nextArray = nextArray.filter((id) => id !== "none");
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

  return update;
}

function isTechSelected(stack: StackState, category: keyof typeof TECH_OPTIONS, techId: string) {
  const value = stack[category as keyof StackState];
  return Array.isArray(value) ? value.includes(techId) : value === techId;
}

function showCompatibilityChanges(changes: CompatibilityAnalysis["changes"]) {
  if (changes.length > 0) {
    track("builder_compat_adjust", {
      count: changes.length,
      message: changes.map((change) => change.message).join(" | "),
    });
  }

  if (changes.length === 1) {
    toast.info(changes[0].message, { duration: 4000 });
    return;
  }

  if (changes.length > 1) {
    const message = `${changes.length} compatibility adjustments made:\n${changes
      .map((change) => `• ${change.message}`)
      .join("\n")}`;

    toast.info(message, { duration: 5000 });
  }
}

export function useStackBuilder() {
  const [stack, setUrlStack, viewMode, setViewMode, selectedFile, setSelectedFile] =
    useStackState();

  const [copied, setCopied] = useState(false);
  const [lastSavedStack, setLastSavedStack] = useState<StackState | null>(null);
  const mobileTab: MobileTab = viewMode === "preview" ? "preview" : "build";
  const setMobileTab = useCallback(
    (tab: MobileTab) => setViewMode(tab === "preview" ? "preview" : "command"),
    [setViewMode],
  );

  const setStack = useCallback(
    async (update: StackUpdate) => {
      let compatibilityChanges: CompatibilityAnalysis["changes"] = [];

      await setUrlStack((currentStack) => {
        const resolution = applyStackUpdate(currentStack, update);
        compatibilityChanges = resolution.changes;
        return resolution.stack;
      });

      showCompatibilityChanges(compatibilityChanges);
    },
    [setUrlStack],
  );

  const contentRef = useRef<HTMLDivElement | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);

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

  const compatibilityAnalysis = useMemo(() => resolveStackCompatibility(stack), [stack]);
  const effectiveStack = compatibilityAnalysis.stack;
  const projectNameError = validateProjectName(formatProjectName(stack.projectName));

  useEffect(() => {
    try {
      const savedStack = localStorage.getItem("betterTStackPreference");
      if (!savedStack) return;
      const result = StackStateSchema.safeParse(JSON.parse(savedStack));
      if (result.success) {
        setLastSavedStack(resolveStackCompatibility(result.data).stack);
      } else {
        localStorage.removeItem("betterTStackPreference");
      }
    } catch {
      setLastSavedStack(null);
    }
  }, []);

  const command = useMemo(() => {
    return generateStackCommand(withFormattedProjectName(effectiveStack));
  }, [effectiveStack]);

  const categoryProgress = useMemo<Array<CategoryProgressItem>>(() => {
    return CATEGORY_LIST.map((category) => {
      const options = TECH_OPTIONS[category] || [];
      const selectedValue = effectiveStack[category as keyof StackState];
      const realOptionCount = options.filter((option) => option.id !== "none").length;

      if (Array.isArray(selectedValue)) {
        const selectedReal = selectedValue.filter(
          (id) => id !== "none" && options.some((option) => option.id === id),
        );
        const selectedCount = selectedReal.length;
        return {
          category,
          selected: selectedCount,
          total: Math.max(realOptionCount, 1),
          done: selectedCount > 0,
        };
      }

      const isSelectedReal =
        selectedValue !== "none" &&
        selectedValue !== "false" &&
        options.some((option) => option.id === selectedValue);

      return {
        category,
        selected: isSelectedReal ? 1 : 0,
        total: 1,
        done: isSelectedReal,
      };
    });
  }, [effectiveStack]);

  const selectedCount = useMemo(() => {
    return categoryProgress.reduce((total, entry) => total + entry.selected, 0);
  }, [categoryProgress]);

  function getStackUrl() {
    return generateStackSharingUrl(withFormattedProjectName(effectiveStack));
  }

  function getRandomStack() {
    const randomStack: Partial<StackState> = {};

    for (const category of CATEGORY_LIST) {
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
    track("builder_randomize", {});
  }

  function handleTechSelect(category: keyof typeof TECH_OPTIONS, techId: string) {
    track("builder_tech_select", {
      category,
      tech: techId,
      selected: !isTechSelected(effectiveStack, category, techId),
    });
    startTransition(() => {
      setStack((currentStack) => getTechSelectionUpdate(currentStack, category, techId));
    });
  }

  function removeSelectedTech(category: TechCategory, techId: string) {
    track("builder_tech_remove", { category, tech: techId });
    startTransition(() => {
      setStack((currentStack) => getSelectedTechRemovalUpdate(currentStack, category, techId));
    });
  }

  async function copyToClipboard(source: BuilderCopySource) {
    if (projectNameError) {
      toast.error(projectNameError);
      return;
    }
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      track("builder_copy_command", { ...stackSnapshot(effectiveStack), source });
    } catch {
      toast.error("Unable to copy command. Please copy it manually.");
    }
  }

  function resetStack() {
    startTransition(() => {
      setStack(DEFAULT_STACK);
    });
    contentRef.current?.scrollTo(0, 0);
    track("builder_reset", {});
  }

  function saveCurrentStack() {
    if (projectNameError) {
      toast.error(projectNameError);
      return;
    }
    try {
      const stackToSave = withFormattedProjectName(effectiveStack);
      localStorage.setItem("betterTStackPreference", JSON.stringify(stackToSave));
      setLastSavedStack(stackToSave);
      toast.success("Your stack configuration has been saved");
      track("builder_save", {});
    } catch {
      toast.error("Unable to save preferences in this browser. You can share your stack instead.");
    }
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
    track("builder_load", {});
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
    track("builder_preset_apply", { preset: preset.id });
  }

  return {
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
  };
}
