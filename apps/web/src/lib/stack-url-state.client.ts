"use client";

import { useSearch } from "@tanstack/react-router";
import { useCallback, useState, useEffect, useRef } from "react";

import { DEFAULT_STACK, type StackState } from "@/lib/constant";

import type { StackSearchParams } from "./stack-search-schema";

// Convert from URL search params (short keys) to StackState
function searchToStack(search: StackSearchParams | undefined): StackState {
  if (!search) return DEFAULT_STACK;

  return {
    ecosystem: search.eco ?? DEFAULT_STACK.ecosystem,
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
    fileUpload: search.fu ?? DEFAULT_STACK.fileUpload,
    logging: search.log ?? DEFAULT_STACK.logging,
    observability: search.obs ?? DEFAULT_STACK.observability,
    featureFlags: search.ff ?? DEFAULT_STACK.featureFlags,
    analytics: search.an ?? DEFAULT_STACK.analytics,
    backendLibraries: search.bl ?? DEFAULT_STACK.backendLibraries,
    stateManagement: search.sm ?? DEFAULT_STACK.stateManagement,
    forms: search.frm ?? DEFAULT_STACK.forms,
    validation: search.val ?? DEFAULT_STACK.validation,
    testing: search.tst ?? DEFAULT_STACK.testing,
    realtime: search.rt2 ?? DEFAULT_STACK.realtime,
    jobQueue: search.jq ?? DEFAULT_STACK.jobQueue,
    caching: search.cache ?? DEFAULT_STACK.caching,
    animation: search.anim ?? DEFAULT_STACK.animation,
    cms: search.cms ?? DEFAULT_STACK.cms,
    codeQuality: search.cq ?? DEFAULT_STACK.codeQuality,
    documentation: search.doc ?? DEFAULT_STACK.documentation,
    appPlatforms: search.ap ?? DEFAULT_STACK.appPlatforms,
    packageManager: search.pm ?? DEFAULT_STACK.packageManager,
    examples: search.ex ?? DEFAULT_STACK.examples,
    aiSdk: search.aisdk ?? DEFAULT_STACK.aiSdk,
    git: search.git ?? DEFAULT_STACK.git,
    install: search.i ?? DEFAULT_STACK.install,
    webDeploy: search.wd ?? DEFAULT_STACK.webDeploy,
    serverDeploy: search.sd ?? DEFAULT_STACK.serverDeploy,
    yolo: search.yolo ?? DEFAULT_STACK.yolo,
    // Rust ecosystem fields
    rustWebFramework: search.rwf ?? DEFAULT_STACK.rustWebFramework,
    rustFrontend: search.rfe ?? DEFAULT_STACK.rustFrontend,
    rustOrm: search.rorm ?? DEFAULT_STACK.rustOrm,
    rustApi: search.rapi ?? DEFAULT_STACK.rustApi,
    rustCli: search.rcli ?? DEFAULT_STACK.rustCli,
    rustLibraries: search.rlib ?? DEFAULT_STACK.rustLibraries,
  };
}

export function useStackState() {
  // Always initialize with DEFAULT_STACK to avoid hydration mismatch
  const [stack, setStackState] = useState<StackState>(DEFAULT_STACK);
  const [viewMode, setViewModeState] = useState<"command" | "preview">("command");
  const [selectedFile, setSelectedFileState] = useState<string>("");
  const initialized = useRef(false);

  // Get search params from the route
  // @ts-expect-error - route path typing with strict: false
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
