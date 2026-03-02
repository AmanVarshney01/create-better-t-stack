import type {
  ShadcnBase,
  ShadcnBaseColor,
  ShadcnColorTheme,
  ShadcnFont,
  ShadcnIconLibrary,
  ShadcnRadius,
  ShadcnStyle,
} from "../types";

import { isSilent } from "../utils/context";
import { exitCancelled } from "../utils/errors";
import { isCancel, navigableSelect } from "./navigable";

export interface ShadcnOptions {
  shadcnBase: ShadcnBase;
  shadcnStyle: ShadcnStyle;
  shadcnIconLibrary: ShadcnIconLibrary;
  shadcnColorTheme: ShadcnColorTheme;
  shadcnBaseColor: ShadcnBaseColor;
  shadcnFont: ShadcnFont;
  shadcnRadius: ShadcnRadius;
}

const BASE_OPTIONS: { value: ShadcnBase; label: string; hint: string }[] = [
  {
    value: "radix",
    label: "Radix UI",
    hint: "Battle-tested headless primitives (130M+ monthly downloads)",
  },
  {
    value: "base",
    label: "Base UI",
    hint: "MUI's headless library with cleaner APIs and native multi-select",
  },
];

const STYLE_OPTIONS: { value: ShadcnStyle; label: string; hint: string }[] = [
  { value: "vega", label: "Vega", hint: "Classic shadcn/ui look" },
  { value: "nova", label: "Nova", hint: "Compact layout with reduced padding" },
  { value: "maia", label: "Maia", hint: "Soft, rounded with generous spacing" },
  { value: "lyra", label: "Lyra", hint: "Boxy and sharp, pairs well with mono fonts" },
  { value: "mira", label: "Mira", hint: "Dense, made for data-heavy interfaces" },
];

const ICON_LIBRARY_OPTIONS: { value: ShadcnIconLibrary; label: string; hint: string }[] = [
  { value: "lucide", label: "Lucide", hint: "Default icon library — clean, consistent icons" },
  { value: "tabler", label: "Tabler Icons", hint: "2000+ open-source SVG icons" },
  { value: "hugeicons", label: "HugeIcons", hint: "Modern icon set with wrapper component" },
  { value: "phosphor", label: "Phosphor Icons", hint: "Flexible, consistent icon family" },
  { value: "remixicon", label: "Remix Icon", hint: "Open-source neutral style icons" },
];

const COLOR_THEME_OPTIONS: { value: ShadcnColorTheme; label: string; hint: string }[] = [
  { value: "neutral", label: "Neutral", hint: "Clean and minimal" },
  { value: "stone", label: "Stone", hint: "Warm neutral tones" },
  { value: "zinc", label: "Zinc", hint: "Cool neutral tones" },
  { value: "gray", label: "Gray", hint: "Blue-tinted neutral" },
  { value: "blue", label: "Blue", hint: "Trust and reliability" },
  { value: "violet", label: "Violet", hint: "Creative and modern" },
  { value: "green", label: "Green", hint: "Growth and success" },
  { value: "red", label: "Red", hint: "Bold and energetic" },
  { value: "rose", label: "Rose", hint: "Warm and inviting" },
  { value: "orange", label: "Orange", hint: "Friendly and vibrant" },
  { value: "amber", label: "Amber", hint: "Warm and golden" },
  { value: "yellow", label: "Yellow", hint: "Bright and optimistic" },
  { value: "lime", label: "Lime", hint: "Fresh and lively" },
  { value: "emerald", label: "Emerald", hint: "Rich and luxurious" },
  { value: "teal", label: "Teal", hint: "Calm and sophisticated" },
  { value: "cyan", label: "Cyan", hint: "Cool and refreshing" },
  { value: "sky", label: "Sky", hint: "Light and airy" },
  { value: "indigo", label: "Indigo", hint: "Deep and focused" },
  { value: "purple", label: "Purple", hint: "Royal and elegant" },
  { value: "fuchsia", label: "Fuchsia", hint: "Playful and bold" },
  { value: "pink", label: "Pink", hint: "Soft and expressive" },
];

const BASE_COLOR_OPTIONS: { value: ShadcnBaseColor; label: string; hint: string }[] = [
  { value: "neutral", label: "Neutral", hint: "Pure neutral grays" },
  { value: "stone", label: "Stone", hint: "Warm-tinted grays" },
  { value: "zinc", label: "Zinc", hint: "Cool-tinted grays" },
  { value: "gray", label: "Gray", hint: "Blue-tinted grays" },
];

const FONT_OPTIONS: { value: ShadcnFont; label: string; hint: string }[] = [
  { value: "inter", label: "Inter", hint: "Clean variable sans-serif (default)" },
  { value: "geist", label: "Geist", hint: "Vercel's modern typeface" },
  { value: "figtree", label: "Figtree", hint: "Friendly geometric sans-serif" },
  { value: "noto-sans", label: "Noto Sans", hint: "Google's universal typeface" },
  { value: "nunito-sans", label: "Nunito Sans", hint: "Rounded, balanced sans-serif" },
  { value: "roboto", label: "Roboto", hint: "Google's Material Design typeface" },
  { value: "raleway", label: "Raleway", hint: "Elegant thin-weight display font" },
  { value: "dm-sans", label: "DM Sans", hint: "Low-contrast geometric sans" },
  { value: "public-sans", label: "Public Sans", hint: "Neutral, US government typeface" },
  { value: "outfit", label: "Outfit", hint: "Modern geometric variable font" },
  { value: "jetbrains-mono", label: "JetBrains Mono", hint: "Developer-focused monospace" },
  { value: "geist-mono", label: "Geist Mono", hint: "Vercel's monospace typeface" },
];

const RADIUS_OPTIONS: { value: ShadcnRadius; label: string; hint: string }[] = [
  { value: "default", label: "Default", hint: "Use the style's default radius" },
  { value: "none", label: "None", hint: "Sharp corners (0)" },
  { value: "small", label: "Small", hint: "Subtle rounding (0.45rem)" },
  { value: "medium", label: "Medium", hint: "Moderate rounding (0.625rem)" },
  { value: "large", label: "Large", hint: "Generous rounding (0.875rem)" },
];

const SHADCN_DEFAULTS: ShadcnOptions = {
  shadcnBase: "radix",
  shadcnStyle: "nova",
  shadcnIconLibrary: "lucide",
  shadcnColorTheme: "neutral",
  shadcnBaseColor: "neutral",
  shadcnFont: "inter",
  shadcnRadius: "default",
};

export async function getShadcnOptions(flags: {
  shadcnBase?: ShadcnBase;
  shadcnStyle?: ShadcnStyle;
  shadcnIconLibrary?: ShadcnIconLibrary;
  shadcnColorTheme?: ShadcnColorTheme;
  shadcnBaseColor?: ShadcnBaseColor;
  shadcnFont?: ShadcnFont;
  shadcnRadius?: ShadcnRadius;
}): Promise<ShadcnOptions> {
  // In silent/programmatic mode, use defaults for any missing flags
  const fallback = (key: keyof ShadcnOptions) => (isSilent() ? SHADCN_DEFAULTS[key] : undefined);

  const shadcnBase =
    flags.shadcnBase ?? (fallback("shadcnBase") as ShadcnBase) ?? (await promptShadcnBase());
  const shadcnStyle =
    flags.shadcnStyle ?? (fallback("shadcnStyle") as ShadcnStyle) ?? (await promptShadcnStyle());
  const shadcnIconLibrary =
    flags.shadcnIconLibrary ??
    (fallback("shadcnIconLibrary") as ShadcnIconLibrary) ??
    (await promptShadcnIconLibrary());
  const shadcnColorTheme =
    flags.shadcnColorTheme ??
    (fallback("shadcnColorTheme") as ShadcnColorTheme) ??
    (await promptShadcnColorTheme());
  const shadcnBaseColor =
    flags.shadcnBaseColor ??
    (fallback("shadcnBaseColor") as ShadcnBaseColor) ??
    (await promptShadcnBaseColor());
  const shadcnFont =
    flags.shadcnFont ?? (fallback("shadcnFont") as ShadcnFont) ?? (await promptShadcnFont());
  const shadcnRadius =
    flags.shadcnRadius ??
    (fallback("shadcnRadius") as ShadcnRadius) ??
    (await promptShadcnRadius());

  return {
    shadcnBase,
    shadcnStyle,
    shadcnIconLibrary,
    shadcnColorTheme,
    shadcnBaseColor,
    shadcnFont,
    shadcnRadius,
  };
}

async function promptShadcnBase(): Promise<ShadcnBase> {
  const selected = await navigableSelect<ShadcnBase>({
    message: "Select shadcn/ui base library",
    options: BASE_OPTIONS,
    initialValue: "radix" as ShadcnBase,
  });
  if (isCancel(selected)) return exitCancelled("Operation cancelled");
  return selected;
}

async function promptShadcnStyle(): Promise<ShadcnStyle> {
  const selected = await navigableSelect<ShadcnStyle>({
    message: "Select shadcn/ui visual style",
    options: STYLE_OPTIONS,
    initialValue: "nova" as ShadcnStyle,
  });
  if (isCancel(selected)) return exitCancelled("Operation cancelled");
  return selected;
}

async function promptShadcnIconLibrary(): Promise<ShadcnIconLibrary> {
  const selected = await navigableSelect<ShadcnIconLibrary>({
    message: "Select shadcn/ui icon library",
    options: ICON_LIBRARY_OPTIONS,
    initialValue: "lucide" as ShadcnIconLibrary,
  });
  if (isCancel(selected)) return exitCancelled("Operation cancelled");
  return selected;
}

async function promptShadcnColorTheme(): Promise<ShadcnColorTheme> {
  const selected = await navigableSelect<ShadcnColorTheme>({
    message: "Select shadcn/ui color theme",
    options: COLOR_THEME_OPTIONS,
    initialValue: "neutral" as ShadcnColorTheme,
  });
  if (isCancel(selected)) return exitCancelled("Operation cancelled");
  return selected;
}

async function promptShadcnBaseColor(): Promise<ShadcnBaseColor> {
  const selected = await navigableSelect<ShadcnBaseColor>({
    message: "Select shadcn/ui base neutral color",
    options: BASE_COLOR_OPTIONS,
    initialValue: "neutral" as ShadcnBaseColor,
  });
  if (isCancel(selected)) return exitCancelled("Operation cancelled");
  return selected;
}

async function promptShadcnFont(): Promise<ShadcnFont> {
  const selected = await navigableSelect<ShadcnFont>({
    message: "Select shadcn/ui font",
    options: FONT_OPTIONS,
    initialValue: "inter" as ShadcnFont,
  });
  if (isCancel(selected)) return exitCancelled("Operation cancelled");
  return selected;
}

async function promptShadcnRadius(): Promise<ShadcnRadius> {
  const selected = await navigableSelect<ShadcnRadius>({
    message: "Select shadcn/ui border radius",
    options: RADIUS_OPTIONS,
    initialValue: "default" as ShadcnRadius,
  });
  if (isCancel(selected)) return exitCancelled("Operation cancelled");
  return selected;
}
