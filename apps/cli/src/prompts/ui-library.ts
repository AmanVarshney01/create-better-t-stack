import type { Frontend, UILibrary } from "../types";

import { DEFAULT_UI_LIBRARY_BY_FRONTEND } from "../constants";
import { getCompatibleUILibraries, splitFrontends } from "../utils/compatibility-rules";
import { exitCancelled } from "../utils/errors";
import { isCancel, navigableSelect } from "./navigable";

const UI_LIBRARY_OPTIONS: Record<UILibrary, { label: string; hint: string }> = {
  "shadcn-ui": {
    label: "shadcn/ui",
    hint: "Beautifully designed components built with Radix UI and Tailwind CSS",
  },
  daisyui: {
    label: "daisyUI",
    hint: "Tailwind CSS component library with semantic class names",
  },
  "radix-ui": {
    label: "Radix UI",
    hint: "Unstyled, accessible UI primitives for React",
  },
  "headless-ui": {
    label: "Headless UI",
    hint: "Unstyled, accessible UI components from Tailwind Labs",
  },
  "park-ui": {
    label: "Park UI",
    hint: "Beautifully designed components built on Ark UI",
  },
  "chakra-ui": {
    label: "Chakra UI",
    hint: "Simple, modular and accessible component library",
  },
  nextui: {
    label: "NextUI",
    hint: "Beautiful, fast and modern React UI library",
  },
  none: {
    label: "None",
    hint: "No UI component library",
  },
};

export async function getUILibraryChoice(
  uiLibrary?: UILibrary,
  frontends?: Frontend[],
): Promise<UILibrary> {
  const { web } = splitFrontends(frontends);

  // If no web frontend selected, default to none
  if (web.length === 0) {
    return "none";
  }

  const compatibleLibraries = getCompatibleUILibraries(frontends);

  if (uiLibrary !== undefined) {
    return compatibleLibraries.includes(uiLibrary) ? uiLibrary : compatibleLibraries[0];
  }

  const options = compatibleLibraries.map((lib) => ({
    value: lib,
    label: UI_LIBRARY_OPTIONS[lib].label,
    hint: UI_LIBRARY_OPTIONS[lib].hint,
  }));

  // Determine default based on frontend
  const webFrontend = web[0];
  const defaultLib = DEFAULT_UI_LIBRARY_BY_FRONTEND[webFrontend];
  const initialValue = compatibleLibraries.includes(defaultLib)
    ? defaultLib
    : compatibleLibraries[0];

  const selected = await navigableSelect<UILibrary>({
    message: "Select UI component library",
    options,
    initialValue,
  });

  if (isCancel(selected)) return exitCancelled("Operation cancelled");

  return selected;
}
