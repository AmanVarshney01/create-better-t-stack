import { useSearch } from "@tanstack/react-router";
import { useCallback, useState, useEffect, useRef } from "react";

import { DEFAULT_STACK, type StackState } from "@/lib/constant";

import type { StackSearchParams } from "./stack-search-schema";

// Convert from URL search params (short keys) to StackState
function searchToStack(search: StackSearchParams | undefined): StackState {
  if (!search) return DEFAULT_STACK;

  return {
    projectName: search.name ?? DEFAULT_STACK.projectName,
    webFrontend: search["fe-w"] ?? DEFAULT_STACK.webFrontend,
    nativeFrontend: search["fe-n"] ?? DEFAULT_STACK.nativeFrontend,
    astroIntegration: search.ai ?? DEFAULT_STACK.astroIntegration,
    cssFramework: search.css ?? DEFAULT_STACK.cssFramework,
    uiLibrary: search.ui ?? DEFAULT_STACK.uiLibrary,
    runtime: search.rt ?? DEFAULT_STACK.runtime,
    backend: search.be ?? DEFAULT_STACK.backend,
    api: search.api ?? DEFAULT_STACK.api,
    database: search.db ?? DEFAULT_STACK.database,
    orm: search.orm ?? DEFAULT_STACK.orm,
    dbSetup: search.dbs ?? DEFAULT_STACK.dbSetup,
    auth: search.au ?? DEFAULT_STACK.auth,
    payments: search.pay ?? DEFAULT_STACK.payments,
    email: search.em ?? DEFAULT_STACK.email,
    backendLibraries: search.bl ?? DEFAULT_STACK.backendLibraries,
    stateManagement: search.sm ?? DEFAULT_STACK.stateManagement,
    codeQuality: search.cq ?? DEFAULT_STACK.codeQuality,
    documentation: search.doc ?? DEFAULT_STACK.documentation,
    appPlatforms: search.ap ?? DEFAULT_STACK.appPlatforms,
    packageManager: search.pm ?? DEFAULT_STACK.packageManager,
    examples: search.ex ?? DEFAULT_STACK.examples,
    git: search.git ?? DEFAULT_STACK.git,
    install: search.i ?? DEFAULT_STACK.install,
    webDeploy: search.wd ?? DEFAULT_STACK.webDeploy,
    serverDeploy: search.sd ?? DEFAULT_STACK.serverDeploy,
    yolo: search.yolo ?? DEFAULT_STACK.yolo,
  };
}

export function useStackState() {
  // Always initialize with DEFAULT_STACK to avoid hydration mismatch
  const [stack, setStackState] = useState<StackState>(DEFAULT_STACK);
  const [viewMode, setViewModeState] = useState<"command" | "preview">("command");
  const [selectedFile, setSelectedFileState] = useState<string>("");
  const initialized = useRef(false);

  // Get search params from the route
  const search = useSearch({ from: "/new", strict: false }) as StackSearchParams | undefined;

  // Initialize from URL on client mount only (for shared links)
  useEffect(() => {
    if (!initialized.current && search) {
      initialized.current = true;
      const initialStack = searchToStack(search);
      setStackState(initialStack);
      setViewModeState(search.view || "command");
      setSelectedFileState(search.file || "");
    }
  }, [search]);

  const updateStack = useCallback(
    (updates: Partial<StackState> | ((prev: StackState) => Partial<StackState>)) => {
      console.log("[useStackState] updateStack called with:", updates);
      setStackState((currentStack) => {
        const newUpdates = typeof updates === "function" ? updates(currentStack) : updates;
        console.log("[useStackState] newUpdates:", newUpdates);
        const merged = { ...currentStack, ...newUpdates };
        console.log("[useStackState] merged result:", merged);
        return merged;
      });
    },
    [],
  );

  const setViewMode = useCallback((mode: "command" | "preview") => {
    setViewModeState(mode);
  }, []);

  const setSelectedFile = useCallback((filePath: string | null) => {
    setSelectedFileState(filePath || "");
  }, []);

  return [stack, updateStack, viewMode, setViewMode, selectedFile, setSelectedFile] as const;
}
