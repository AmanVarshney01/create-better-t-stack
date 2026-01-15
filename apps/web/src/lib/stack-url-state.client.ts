"use client";
import { parseAsArrayOf, parseAsString, parseAsStringEnum, useQueryStates } from "nuqs";

import { DEFAULT_STACK, type StackState, TECH_OPTIONS } from "@/lib/constant";

import { stackUrlKeys } from "./stack-url-keys";

const getValidIds = (category: keyof typeof TECH_OPTIONS): string[] => {
  return TECH_OPTIONS[category]?.map((opt) => opt.id) ?? [];
};

export const stackParsers = {
  projectName: parseAsString.withDefault(DEFAULT_STACK.projectName ?? "my-better-t-app"),
  webFrontend: parseAsArrayOf(parseAsString).withDefault(DEFAULT_STACK.webFrontend),
  nativeFrontend: parseAsArrayOf(parseAsString).withDefault(DEFAULT_STACK.nativeFrontend),
  astroIntegration: parseAsStringEnum<StackState["astroIntegration"]>(
    getValidIds("astroIntegration"),
  ).withDefault(DEFAULT_STACK.astroIntegration),
  runtime: parseAsStringEnum<StackState["runtime"]>(getValidIds("runtime")).withDefault(
    DEFAULT_STACK.runtime,
  ),
  backend: parseAsStringEnum<StackState["backend"]>(getValidIds("backend")).withDefault(
    DEFAULT_STACK.backend,
  ),
  api: parseAsStringEnum<StackState["api"]>(getValidIds("api")).withDefault(DEFAULT_STACK.api),
  database: parseAsStringEnum<StackState["database"]>(getValidIds("database")).withDefault(
    DEFAULT_STACK.database,
  ),
  orm: parseAsStringEnum<StackState["orm"]>(getValidIds("orm")).withDefault(DEFAULT_STACK.orm),
  dbSetup: parseAsStringEnum<StackState["dbSetup"]>(getValidIds("dbSetup")).withDefault(
    DEFAULT_STACK.dbSetup,
  ),
  auth: parseAsStringEnum<StackState["auth"]>(getValidIds("auth")).withDefault(DEFAULT_STACK.auth),
  payments: parseAsStringEnum<StackState["payments"]>(getValidIds("payments")).withDefault(
    DEFAULT_STACK.payments,
  ),
  packageManager: parseAsStringEnum<StackState["packageManager"]>(
    getValidIds("packageManager"),
  ).withDefault(DEFAULT_STACK.packageManager),
  addons: parseAsArrayOf(parseAsString).withDefault(DEFAULT_STACK.addons),
  examples: parseAsArrayOf(parseAsString).withDefault(DEFAULT_STACK.examples),
  git: parseAsStringEnum<StackState["git"]>(["true", "false"]).withDefault(DEFAULT_STACK.git),
  install: parseAsStringEnum<StackState["install"]>(["true", "false"]).withDefault(
    DEFAULT_STACK.install,
  ),
  webDeploy: parseAsStringEnum<StackState["webDeploy"]>(getValidIds("webDeploy")).withDefault(
    DEFAULT_STACK.webDeploy,
  ),
  serverDeploy: parseAsStringEnum<StackState["serverDeploy"]>(
    getValidIds("serverDeploy"),
  ).withDefault(DEFAULT_STACK.serverDeploy),
  yolo: parseAsStringEnum<StackState["yolo"]>(["true", "false"]).withDefault(DEFAULT_STACK.yolo),
  viewMode: parseAsStringEnum<"command" | "preview">(["command", "preview"]).withDefault("command"),
  selectedFile: parseAsString.withDefault(""),
};

export const stackQueryStatesOptions = {
  history: "replace" as const,
  shallow: false,
  urlKeys: stackUrlKeys,
  clearOnDefault: true,
};

export function useStackState() {
  const [queryState, setQueryState] = useQueryStates(stackParsers, stackQueryStatesOptions);

  const stack: StackState = {
    projectName: queryState.projectName,
    webFrontend: queryState.webFrontend,
    nativeFrontend: queryState.nativeFrontend,
    astroIntegration: queryState.astroIntegration,
    runtime: queryState.runtime,
    backend: queryState.backend,
    api: queryState.api,
    database: queryState.database,
    orm: queryState.orm,
    dbSetup: queryState.dbSetup,
    auth: queryState.auth,
    payments: queryState.payments,
    packageManager: queryState.packageManager,
    addons: queryState.addons,
    examples: queryState.examples,
    git: queryState.git,
    install: queryState.install,
    webDeploy: queryState.webDeploy,
    serverDeploy: queryState.serverDeploy,
    yolo: queryState.yolo,
  };

  const viewMode = queryState.viewMode;
  const selectedFile = queryState.selectedFile;

  const updateStack = async (
    updates: Partial<StackState> | ((prev: StackState) => Partial<StackState>),
  ) => {
    const newStack = typeof updates === "function" ? updates(stack) : updates;
    const finalStack = { ...stack, ...newStack };
    await setQueryState({ ...finalStack, viewMode, selectedFile });
  };

  const setViewMode = async (mode: "command" | "preview") => {
    await setQueryState({ viewMode: mode, selectedFile });
  };

  const setSelectedFile = async (filePath: string | null) => {
    await setQueryState({ selectedFile: filePath || "" });
  };

  return [stack, updateStack, viewMode, setViewMode, selectedFile, setSelectedFile] as const;
}
