import { startTransition, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { type BuilderCopySource, stackSnapshot, track } from "@/lib/analytics";
import { DEFAULT_STACK, PRESET_TEMPLATES, type StackState, TECH_OPTIONS } from "@/lib/constant";
import { sanitizeAddons, sanitizeExamples } from "@/lib/sanitize-stack-addons";
import { applyStackUpdate, resolveStackCompatibility } from "@/lib/stack-compatibility";
import { StackStateSchema, StackUpdateSchema } from "@/lib/stack-schema";
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

const CATEGORY_LIST = CATEGORY_ORDER;
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
  const categoryKey = category;
  const value = effectiveStack[categoryKey];
  const options = TECH_OPTIONS[category] || [];
  const hasNoneOption = options.some((option) => option.id === "none");
  const forceNoneFallback = category === "addons" || category === "examples";

  if (Array.isArray(value)) {
    const next = value.filter((id) => id !== techId);
    const fallback = next.length === 0 && (hasNoneOption || forceNoneFallback) ? ["none"] : next;
    return StackUpdateSchema.parse({ [categoryKey]: fallback });
  }

  if (value === techId && hasNoneOption) {
    return StackUpdateSchema.parse({ [categoryKey]: "none" });
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

  const currentValue = effectiveStack[category];
  const candidate = StackUpdateSchema.safeParse({
    [category]: Array.isArray(currentValue) ? [techId] : techId,
  });
  if (!candidate.success) return {};
  const choice = candidate.data;
  if (choice.webFrontend)
    return { webFrontend: toggleSingle(effectiveStack.webFrontend, choice.webFrontend[0]) };
  if (choice.nativeFrontend)
    return {
      nativeFrontend: toggleSingle(effectiveStack.nativeFrontend, choice.nativeFrontend[0]),
    };
  if (choice.addons)
    return { addons: sanitizeAddons(toggleMulti(effectiveStack.addons, choice.addons[0])).sort() };
  if (choice.examples)
    return {
      examples: sanitizeExamples(toggleMulti(effectiveStack.examples, choice.examples[0])).sort(),
    };
  if (currentValue !== techId) return choice;
  if (choice.git) return { git: choice.git === "true" ? "false" : "true" };
  if (choice.install) return { install: choice.install === "true" ? "false" : "true" };
  return {};
}

function toggleSingle<T extends string>(
  values: readonly (T | "none")[],
  id: T | "none",
): (T | "none")[] {
  return values.includes(id) ? ["none"] : [id];
}

function toggleMulti<T extends string>(values: readonly T[], id: T): T[] {
  return values.includes(id) ? values.filter((value) => value !== id) : [...values, id];
}

function isTechSelected(stack: StackState, category: keyof typeof TECH_OPTIONS, techId: string) {
  const value = stack[category];
  return Array.isArray(value) ? value.some((id) => id === techId) : value === techId;
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
      const selectedValue = effectiveStack[category];
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
    const entries = CATEGORY_LIST.map((category) => {
      const options = TECH_OPTIONS[category];
      if (category === "addons" || category === "examples") {
        const count = Math.floor(Math.random() * Math.min(options.length, 4));
        const ids = [...options]
          .filter(({ id }) => id !== "none")
          .sort(() => 0.5 - Math.random())
          .slice(0, count)
          .map(({ id }) => id);
        return [category, ids.length ? ids : ["none"]];
      }
      const id = options[Math.floor(Math.random() * options.length)].id;
      return [category, category === "webFrontend" || category === "nativeFrontend" ? [id] : id];
    });
    const randomStack = StackStateSchema.parse(Object.fromEntries(entries));

    startTransition(() => {
      setStack({
        ...randomStack,
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
