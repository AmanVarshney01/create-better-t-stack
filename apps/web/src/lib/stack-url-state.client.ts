import { useNavigate, useSearch } from "@tanstack/react-router";
import { useCallback } from "react";

import { DEFAULT_STACK, type StackState } from "@/lib/constant";

import type { StackSearchParams } from "./stack-search-schema";

// Convert from URL search params (short keys) to StackState
function searchToStack(search: StackSearchParams): StackState {
  return {
    projectName: search.name,
    webFrontend: search["fe-w"],
    nativeFrontend: search["fe-n"],
    astroIntegration: search.ai,
    runtime: search.rt,
    backend: search.be,
    api: search.api,
    database: search.db,
    orm: search.orm,
    dbSetup: search.dbs,
    auth: search.au,
    payments: search.pay,
    packageManager: search.pm,
    addons: search.add,
    examples: search.ex,
    git: search.git,
    install: search.i,
    webDeploy: search.wd,
    serverDeploy: search.sd,
    yolo: search.yolo,
  };
}

// Convert from StackState to URL search params (short keys)
function stackToSearch(
  stack: StackState,
  viewMode: "command" | "preview",
  selectedFile: string,
): StackSearchParams {
  return {
    name: stack.projectName ?? DEFAULT_STACK.projectName ?? "my-better-t-app",
    "fe-w": stack.webFrontend,
    "fe-n": stack.nativeFrontend,
    ai: stack.astroIntegration,
    rt: stack.runtime,
    be: stack.backend,
    api: stack.api,
    db: stack.database,
    orm: stack.orm,
    dbs: stack.dbSetup,
    au: stack.auth,
    pay: stack.payments,
    pm: stack.packageManager,
    add: stack.addons,
    ex: stack.examples,
    git: stack.git,
    i: stack.install,
    wd: stack.webDeploy,
    sd: stack.serverDeploy,
    yolo: stack.yolo,
    view: viewMode,
    file: selectedFile,
  };
}

// Serialize search params to URL string (arrays become comma-separated)
function serializeSearch(search: StackSearchParams): Record<string, string> {
  const result: Record<string, string> = {};

  for (const [key, value] of Object.entries(search)) {
    if (Array.isArray(value)) {
      // Only include if not default
      const defaultArrays: Record<string, string[]> = {
        "fe-w": DEFAULT_STACK.webFrontend,
        "fe-n": DEFAULT_STACK.nativeFrontend,
        add: DEFAULT_STACK.addons,
        ex: DEFAULT_STACK.examples,
      };
      const defaultVal = defaultArrays[key];
      if (defaultVal && JSON.stringify(value) !== JSON.stringify(defaultVal)) {
        result[key] = value.join(",");
      } else if (!defaultVal) {
        result[key] = value.join(",");
      }
    } else if (value !== undefined && value !== null && value !== "") {
      // Check if it's a default value
      const defaultStrings: Record<string, string> = {
        name: DEFAULT_STACK.projectName ?? "my-better-t-app",
        ai: DEFAULT_STACK.astroIntegration,
        rt: DEFAULT_STACK.runtime,
        be: DEFAULT_STACK.backend,
        api: DEFAULT_STACK.api,
        db: DEFAULT_STACK.database,
        orm: DEFAULT_STACK.orm,
        dbs: DEFAULT_STACK.dbSetup,
        au: DEFAULT_STACK.auth,
        pay: DEFAULT_STACK.payments,
        pm: DEFAULT_STACK.packageManager,
        git: DEFAULT_STACK.git,
        i: DEFAULT_STACK.install,
        wd: DEFAULT_STACK.webDeploy,
        sd: DEFAULT_STACK.serverDeploy,
        yolo: DEFAULT_STACK.yolo,
        view: "command",
        file: "",
      };
      if (defaultStrings[key] !== value) {
        result[key] = value;
      }
    }
  }

  return result;
}

export function useStackState() {
  const search = useSearch({ from: "/new" }) as StackSearchParams;
  const navigate = useNavigate({ from: "/new" });

  const stack = searchToStack(search);
  const viewMode = search.view;
  const selectedFile = search.file;

  const updateStack = useCallback(
    (updates: Partial<StackState> | ((prev: StackState) => Partial<StackState>)) => {
      const currentStack = searchToStack(search);
      const newStack = typeof updates === "function" ? updates(currentStack) : updates;
      const finalStack = { ...currentStack, ...newStack };
      const newSearch = stackToSearch(finalStack, search.view, search.file);

      navigate({
        search: serializeSearch(newSearch) as unknown as StackSearchParams,
        replace: true,
      });
    },
    [search, navigate],
  );

  const setViewMode = useCallback(
    (mode: "command" | "preview") => {
      const currentStack = searchToStack(search);
      const newSearch = stackToSearch(currentStack, mode, search.file);

      navigate({
        search: serializeSearch(newSearch) as unknown as StackSearchParams,
        replace: true,
      });
    },
    [search, navigate],
  );

  const setSelectedFile = useCallback(
    (filePath: string | null) => {
      const currentStack = searchToStack(search);
      const newSearch = stackToSearch(currentStack, search.view, filePath || "");

      navigate({
        search: serializeSearch(newSearch) as unknown as StackSearchParams,
        replace: true,
      });
    },
    [search, navigate],
  );

  return [stack, updateStack, viewMode, setViewMode, selectedFile, setSelectedFile] as const;
}
