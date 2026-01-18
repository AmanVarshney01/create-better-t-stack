import type { CSSFramework, UILibrary } from "../types";

import { getCompatibleCSSFrameworks } from "../utils/compatibility-rules";
import { exitCancelled } from "../utils/errors";
import { isCancel, navigableSelect } from "./navigable";

const CSS_FRAMEWORK_OPTIONS: Record<CSSFramework, { label: string; hint: string }> = {
  tailwind: {
    label: "Tailwind CSS",
    hint: "Utility-first CSS framework",
  },
  scss: {
    label: "SCSS/Sass",
    hint: "CSS preprocessor with advanced features",
  },
  less: {
    label: "Less",
    hint: "Backwards-compatible CSS extension",
  },
  "postcss-only": {
    label: "PostCSS Only",
    hint: "Minimal setup with just PostCSS",
  },
  none: {
    label: "None",
    hint: "Plain CSS without preprocessors",
  },
};

export async function getCSSFrameworkChoice(
  cssFramework?: CSSFramework,
  uiLibrary?: UILibrary,
): Promise<CSSFramework> {
  const compatibleFrameworks = getCompatibleCSSFrameworks(uiLibrary);

  if (cssFramework !== undefined) {
    return compatibleFrameworks.includes(cssFramework) ? cssFramework : compatibleFrameworks[0];
  }

  const options = compatibleFrameworks.map((fw) => ({
    value: fw,
    label: CSS_FRAMEWORK_OPTIONS[fw].label,
    hint: CSS_FRAMEWORK_OPTIONS[fw].hint,
  }));

  const selected = await navigableSelect<CSSFramework>({
    message: "Select CSS framework",
    options,
    initialValue: compatibleFrameworks.includes("tailwind") ? "tailwind" : compatibleFrameworks[0],
  });

  if (isCancel(selected)) return exitCancelled("Operation cancelled");

  return selected;
}
