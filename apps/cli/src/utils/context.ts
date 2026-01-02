import { AsyncLocalStorage } from "node:async_hooks";

import type { PackageManager } from "../types";

export type NavigationState = {
  isFirstPrompt: boolean;
  lastPromptShownUI: boolean;
};

export type CLIContext = {
  navigation: NavigationState;
  silent: boolean;
  verbose: boolean;
  projectDir?: string;
  projectName?: string;
  packageManager?: PackageManager;
};

const cliStorage = new AsyncLocalStorage<CLIContext>();

function defaultContext(): CLIContext {
  return {
    navigation: {
      isFirstPrompt: false,
      lastPromptShownUI: false,
    },
    silent: false,
    verbose: false,
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
  projectDir?: string;
  projectName?: string;
  packageManager?: PackageManager;
};

export function runWithContext<T>(options: ContextOptions, fn: () => T): T {
  const ctx: CLIContext = {
    navigation: {
      isFirstPrompt: false,
      lastPromptShownUI: false,
    },
    silent: options.silent ?? false,
    verbose: options.verbose ?? false,
    projectDir: options.projectDir,
    projectName: options.projectName,
    packageManager: options.packageManager,
  };

  return cliStorage.run(ctx, fn);
}

export async function runWithContextAsync<T>(
  options: ContextOptions,
  fn: () => Promise<T>,
): Promise<T> {
  const ctx: CLIContext = {
    navigation: {
      isFirstPrompt: false,
      lastPromptShownUI: false,
    },
    silent: options.silent ?? false,
    verbose: options.verbose ?? false,
    projectDir: options.projectDir,
    projectName: options.projectName,
    packageManager: options.packageManager,
  };

  return cliStorage.run(ctx, fn);
}
