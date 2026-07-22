/**
 * Navigable group - a group of prompts that allows going back
 */

import {
  didLastPromptShowUI,
  setIsFirstPrompt,
  setLastPromptShownUI,
  setPromptProgress,
} from "../utils/context";
import { isGoBack } from "../utils/navigation";
import { isCancel } from "./navigable";

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
  /** Group related questions into named stages shown in the prompt chrome. */
  sections?: ReadonlyArray<{
    label: string;
    prompts: ReadonlyArray<keyof T>;
  }>;
}

export type NavigablePromptGroup<T> = {
  [P in keyof T]: (opts: {
    results: Prettify<Partial<PromptGroupAwaitedReturn<Omit<T, P>>>>;
    /** The answer this prompt previously returned, when the user navigated back over it. */
    previousAnswer?: Exclude<Awaited<T[P]>, symbol>;
  }) => undefined | Promise<T[P] | symbol | undefined>;
};

/**
 * Define a group of prompts that supports going back to previous prompts.
 * Returns a result object with all the values, or handles cancel/go-back navigation.
 * When navigating back, the discarded answers are replayed to the prompts as
 * `previousAnswer` so they can preselect what the user chose before.
 */
export async function navigableGroup<T>(
  prompts: NavigablePromptGroup<T>,
  opts?: NavigablePromptGroupOptions<T>,
): Promise<Prettify<PromptGroupAwaitedReturn<T>>> {
  const results = {} as any;
  const previousAnswers = {} as any;
  const promptNames = Object.keys(prompts) as (keyof T)[];
  let currentIndex = 0;
  let goingBack = false;

  const stepBack = () => {
    const prevName = promptNames[currentIndex - 1];
    previousAnswers[prevName] = results[prevName];
    delete results[prevName];
    currentIndex--;
  };

  try {
    while (currentIndex < promptNames.length) {
      const name = promptNames[currentIndex];
      const prompt = prompts[name];
      const section = opts?.sections?.find(({ prompts: sectionPrompts }) =>
        sectionPrompts.includes(name),
      );
      const sectionPromptIndex = section?.prompts.indexOf(name) ?? -1;

      setPromptProgress({
        current: currentIndex + 1,
        total: promptNames.length,
        section: section?.label ?? "Setup",
        sectionCurrent: sectionPromptIndex + 1,
        sectionTotal: section?.prompts.length ?? promptNames.length,
      });

      setIsFirstPrompt(currentIndex === 0);
      setLastPromptShownUI(false);

      const pendingResult = prompt({
        results,
        previousAnswer: previousAnswers[name],
      });
      const result = pendingResult ? await pendingResult : undefined;

      if (isGoBack(result)) {
        goingBack = true;
        if (currentIndex > 0) {
          stepBack();
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
        return results;
      }

      if (goingBack && !didLastPromptShowUI()) {
        if (currentIndex > 0) {
          stepBack();
          continue;
        }
      }

      goingBack = false;
      results[name] = result;
      currentIndex++;
    }
  } finally {
    setIsFirstPrompt(false);
    setPromptProgress(undefined);
  }

  return results;
}
