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
  let goingBack = false;

  while (currentIndex < promptNames.length) {
    const name = promptNames[currentIndex];
    const prompt = prompts[name];

    setIsFirstPrompt(currentIndex === 0);

    setLastPromptShownUI(false);

    const result = await prompt({ results })?.catch((e) => {
      throw e;
    });

    if (isGoBack(result)) {
      goingBack = true;
      if (currentIndex > 0) {
        const prevName = promptNames[currentIndex - 1];
        delete results[prevName];
        currentIndex--;
        continue;
      }
      goingBack = false;
      continue;
    }

    if (isCancel(result)) {
      if (typeof opts?.onCancel === "function") {
        results[name] = "canceled";
        opts.onCancel({ results });
      }
      setIsFirstPrompt(false);
      return results;
    }

    if (goingBack && !didLastPromptShowUI()) {
      if (currentIndex > 0) {
        const prevName = promptNames[currentIndex - 1];
        delete results[prevName];
        currentIndex--;
        continue;
      }
    }

    goingBack = false;

    results[name] = result;
    currentIndex++;
  }

  setIsFirstPrompt(false);

  return results;
}
