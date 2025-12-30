/**
 * Navigable group - a group of prompts that allows going back
 */

import { isCancel } from "@clack/prompts";

import { didLastPromptShowUI, setIsFirstPrompt, setLastPromptShownUI } from "../utils/context";
import { isGoBack } from "../utils/navigation";

type Prettify<T> = {
  [P in keyof T]: T[P];
} & {};

export type PromptGroupAwaitedReturn<T> = {
  [P in keyof T]: Exclude<Awaited<T[P]>, symbol>;
};

export interface NavigablePromptGroupOptions<T> {
  /**
   * Control how the group can be canceled
   * if one of the prompts is canceled.
   */
  onCancel?: (opts: { results: Prettify<Partial<PromptGroupAwaitedReturn<T>>> }) => void;
}

export type NavigablePromptGroup<T> = {
  [P in keyof T]: (opts: {
    results: Prettify<Partial<PromptGroupAwaitedReturn<Omit<T, P>>>>;
  }) => undefined | Promise<T[P] | undefined>;
};

/**
 * Define a group of prompts that supports going back to previous prompts.
 * Returns a result object with all the values, or handles cancel/go-back navigation.
 */
export async function navigableGroup<T>(
  prompts: NavigablePromptGroup<T>,
  opts?: NavigablePromptGroupOptions<T>,
): Promise<Prettify<PromptGroupAwaitedReturn<T>>> {
  const results = {} as any;
  const promptNames = Object.keys(prompts) as (keyof T)[];
  let currentIndex = 0;
  // Flag to track if we're in go-back mode
  let goingBack = false;

  while (currentIndex < promptNames.length) {
    const name = promptNames[currentIndex];
    const prompt = prompts[name];

    // Set whether we're on the first prompt (disable go-back if so)
    setIsFirstPrompt(currentIndex === 0);

    // Reset the UI shown flag before calling prompt
    setLastPromptShownUI(false);

    const result = await prompt({ results })?.catch((e) => {
      throw e;
    });

    // Check for go-back
    if (isGoBack(result)) {
      goingBack = true;
      if (currentIndex > 0) {
        // Go back to previous prompt
        const prevName = promptNames[currentIndex - 1];
        delete results[prevName];
        currentIndex--;
        continue;
      }
      // Already at first prompt, can't go back further
      goingBack = false;
      continue;
    }

    // Check for cancel
    if (typeof opts?.onCancel === "function" && isCancel(result)) {
      results[name] = "canceled";
      opts.onCancel({ results });
      continue;
    }

    // If we're going back and this prompt didn't show UI (auto-skipped),
    // continue going back to find a prompt that actually shows UI
    if (goingBack && !didLastPromptShowUI()) {
      // This prompt auto-completed without showing UI - keep going back
      if (currentIndex > 0) {
        const prevName = promptNames[currentIndex - 1];
        delete results[prevName];
        currentIndex--;
        continue;
      }
    }

    // Reset going back flag since we either showed UI or hit the start
    goingBack = false;

    results[name] = result;
    currentIndex++;
  }

  // Reset the first prompt flag
  setIsFirstPrompt(false);

  return results;
}
