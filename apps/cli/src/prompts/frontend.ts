import type { Backend, Frontend } from "../types";

import { DEFAULT_CONFIG } from "../constants";
import { isFrontendAllowedWithBackend } from "../utils/compatibility-rules";
import { isFirstPrompt } from "../utils/context";
import { exitCancelled } from "../utils/errors";
import {
  GO_BACK_SYMBOL,
  isCancel,
  isGoBack,
  navigableMultiselect,
  navigableSelect,
  setIsFirstPrompt,
} from "./navigable";

export async function getFrontendChoice(
  frontendOptions?: Frontend[],
  backend?: Backend,
  auth?: string,
): Promise<Frontend[] | symbol> {
  if (frontendOptions !== undefined) return frontendOptions;

  while (true) {
    const wasFirstPrompt = isFirstPrompt();

    const frontendTypes = await navigableMultiselect({
      message: "Select project type",
      options: [
        {
          value: "web",
          label: "Web",
          hint: "React, Vue or Svelte Web Application",
        },
        {
          value: "native",
          label: "Native",
          hint: "Create a React Native/Expo app",
        },
      ],
      required: false,
      initialValues: ["web"],
    });

    if (isGoBack(frontendTypes)) return GO_BACK_SYMBOL;
    if (isCancel(frontendTypes)) return exitCancelled("Operation cancelled");

    setIsFirstPrompt(false);

    const result: Frontend[] = [];
    let shouldRestart = false;

    if (frontendTypes.includes("web")) {
      const allWebOptions = [
        {
          value: "tanstack-router" as const,
          label: "TanStack Router",
          hint: "Modern and scalable routing for React Applications",
        },
        {
          value: "react-router" as const,
          label: "React Router",
          hint: "A user‑obsessed, standards‑focused, multi‑strategy router",
        },
        {
          value: "next" as const,
          label: "Next.js",
          hint: "The React Framework for the Web",
        },
        {
          value: "nuxt" as const,
          label: "Nuxt",
          hint: "The Progressive Web Framework for Vue.js",
        },
        {
          value: "svelte" as const,
          label: "Svelte",
          hint: "web development for the rest of us",
        },
        {
          value: "solid" as const,
          label: "Solid",
          hint: "Simple and performant reactivity for building user interfaces",
        },
        {
          value: "astro" as const,
          label: "Astro",
          hint: "The web framework for content-driven websites",
        },
        {
          value: "tanstack-start" as const,
          label: "TanStack Start",
          hint: "SSR, Server Functions, API Routes and more with TanStack Router",
        },
      ];

      const webOptions = allWebOptions.filter((option) =>
        isFrontendAllowedWithBackend(option.value, backend, auth),
      );

      const webFramework = await navigableSelect<Frontend>({
        message: "Choose web",
        options: webOptions,
        initialValue: DEFAULT_CONFIG.frontend[0],
      });

      if (isGoBack(webFramework)) {
        shouldRestart = true;
      } else if (isCancel(webFramework)) {
        return exitCancelled("Operation cancelled");
      } else {
        result.push(webFramework as Frontend);
      }
    }

    if (shouldRestart) {
      setIsFirstPrompt(wasFirstPrompt);
      continue;
    }

    if (frontendTypes.includes("native")) {
      const nativeFramework = await navigableSelect<Frontend>({
        message: "Choose native",
        options: [
          {
            value: "native-bare" as const,
            label: "Bare",
            hint: "Bare Expo without styling library",
          },
          {
            value: "native-uniwind" as const,
            label: "Uniwind",
            hint: "Fastest Tailwind bindings for React Native with HeroUI Native",
          },
          {
            value: "native-unistyles" as const,
            label: "Unistyles",
            hint: "Consistent styling for React Native",
          },
        ],
        initialValue: "native-bare",
      });

      if (isGoBack(nativeFramework)) {
        if (frontendTypes.includes("web")) {
          shouldRestart = true;
        } else {
          setIsFirstPrompt(wasFirstPrompt);
          continue;
        }
      } else if (isCancel(nativeFramework)) {
        return exitCancelled("Operation cancelled");
      } else {
        result.push(nativeFramework as Frontend);
      }
    }

    if (shouldRestart) {
      setIsFirstPrompt(wasFirstPrompt);
      continue;
    }

    return result;
  }
}
