import { AsyncLocalStorage } from "node:async_hooks";

import type { AnalyticsMode, PackageManager } from "../types";

export type NavigationState = {
  isFirstPrompt: boolean;
  lastPromptShownUI: boolean;
  promptProgress?: PromptProgress;
};

export type PromptProgress = {
  current: number;
  total: number;
  section: string;
  sectionCurrent: number;
  sectionTotal: number;
};

export type CLIContext = {
  navigation: NavigationState;
  silent: boolean;
  verbose: boolean;
  /** Set when the caller already knows how the CLI is being driven (json, api, mcp). */
  mode?: AnalyticsMode;
  /** True once any interactive prompt was rendered during this run. */
  promptShown: boolean;
  analyticsDisabled: boolean;
  projectDir?: string;
  projectName?: string;
  packageManager?: PackageManager;
};

const cliStorage = new AsyncLocalStorage<CLIContext>();

/** Process-wide mode for hosts that own the whole process, such as the MCP server. */
let processMode: AnalyticsMode | undefined;

export function setProcessMode(mode: AnalyticsMode | undefined): void {
  processMode = mode;
}

export function getProcessMode(): AnalyticsMode | undefined {
  return processMode;
}

function defaultContext(): CLIContext {
  return {
    navigation: {
      isFirstPrompt: false,
      lastPromptShownUI: false,
    },
    silent: false,
    verbose: false,
    promptShown: false,
    analyticsDisabled: false,
  };
}

export function getContext(): CLIContext {
  const ctx = cliStorage.getStore();
  if (!ctx) {
    return defaultContext();
  }
  return ctx;
}

export function tryGetContext(): CLIContext | undefined {
  return cliStorage.getStore();
}

export function isSilent(): boolean {
  return getContext().silent;
}

export function isVerbose(): boolean {
  return getContext().verbose;
}

export function getNavigation(): NavigationState {
  return getContext().navigation;
}

export function isFirstPrompt(): boolean {
  return getContext().navigation.isFirstPrompt;
}

export function didLastPromptShowUI(): boolean {
  return getContext().navigation.lastPromptShownUI;
}

export function getPromptProgress(): PromptProgress | undefined {
  return getContext().navigation.promptProgress;
}

export function markPromptShown(): void {
  const ctx = tryGetContext();
  if (ctx) {
    ctx.promptShown = true;
  }
}

/**
 * How this run is being driven. Hosts that know (json, api, mcp) set it up front;
 * otherwise it is derived from whether prompts were rendered.
 */
export function resolveInvocationMode(yes?: boolean): AnalyticsMode {
  const ctx = getContext();
  if (ctx.mode) return ctx.mode;
  if (yes) return "yes";
  return ctx.promptShown ? "interactive" : "flags";
}

export function getProjectDir(): string | undefined {
  return getContext().projectDir;
}

export function getPackageManager(): PackageManager | undefined {
  return getContext().packageManager;
}

export function setIsFirstPrompt(value: boolean): void {
  const ctx = tryGetContext();
  if (ctx) {
    ctx.navigation.isFirstPrompt = value;
  }
}

export function setLastPromptShownUI(value: boolean): void {
  const ctx = tryGetContext();
  if (ctx) {
    ctx.navigation.lastPromptShownUI = value;
  }
}

export function setPromptProgress(value: PromptProgress | undefined): void {
  const ctx = tryGetContext();
  if (ctx) {
    ctx.navigation.promptProgress = value;
  }
}

export function setProjectInfo(info: {
  projectDir?: string;
  projectName?: string;
  packageManager?: PackageManager;
}): void {
  const ctx = tryGetContext();
  if (ctx) {
    if (info.projectDir !== undefined) ctx.projectDir = info.projectDir;
    if (info.projectName !== undefined) ctx.projectName = info.projectName;
    if (info.packageManager !== undefined) ctx.packageManager = info.packageManager;
  }
}

export type ContextOptions = {
  silent?: boolean;
  verbose?: boolean;
  mode?: AnalyticsMode;
  analyticsDisabled?: boolean;
  projectDir?: string;
  projectName?: string;
  packageManager?: PackageManager;
};

function createContext(options: ContextOptions): CLIContext {
  return {
    navigation: {
      isFirstPrompt: false,
      lastPromptShownUI: false,
    },
    silent: options.silent ?? false,
    verbose: options.verbose ?? false,
    mode: options.mode ?? processMode,
    promptShown: false,
    analyticsDisabled: options.analyticsDisabled ?? false,
    projectDir: options.projectDir,
    projectName: options.projectName,
    packageManager: options.packageManager,
  };
}

export function runWithContext<T>(options: ContextOptions, fn: () => T): T {
  return cliStorage.run(createContext(options), fn);
}

export async function runWithContextAsync<T>(
  options: ContextOptions,
  fn: () => Promise<T>,
): Promise<T> {
  return cliStorage.run(createContext(options), fn);
}
