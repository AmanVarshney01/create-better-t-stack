/**
 * shadcn/ui v4 OKLCH Theme Data
 *
 * Source: https://github.com/shadcn-ui/ui/blob/main/apps/v4/registry/themes.ts
 * Fetched: 2026-02-28
 *
 * Architecture:
 * - "Base colors" (neutral, stone, zinc, gray) define ALL CSS variables for a complete theme.
 * - "Accent themes" (blue, violet, amber, etc.) provide PARTIAL overrides that merge on top of a base.
 * - A full theme = base color + optional accent theme merged on top.
 *
 * The 4 base colors only differ in the warm/cool tint of their grays:
 *   - neutral: pure gray (hue 0, chroma 0)
 *   - stone:   warm gray (hue ~50, very low chroma)
 *   - zinc:    cool gray (hue ~286, very low chroma)
 *   - gray:    blue-gray (hue ~264, slightly higher chroma)
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ThemeCssVars {
  background: string;
  foreground: string;
  card: string;
  "card-foreground": string;
  popover: string;
  "popover-foreground": string;
  primary: string;
  "primary-foreground": string;
  secondary: string;
  "secondary-foreground": string;
  muted: string;
  "muted-foreground": string;
  accent: string;
  "accent-foreground": string;
  destructive: string;
  border: string;
  input: string;
  ring: string;
  "chart-1": string;
  "chart-2": string;
  "chart-3": string;
  "chart-4": string;
  "chart-5": string;
  sidebar: string;
  "sidebar-foreground": string;
  "sidebar-primary": string;
  "sidebar-primary-foreground": string;
  "sidebar-accent": string;
  "sidebar-accent-foreground": string;
  "sidebar-border": string;
  "sidebar-ring": string;
}

export interface ThemeDefinition {
  light: ThemeCssVars;
  dark: ThemeCssVars;
  radius: string;
}

/** Accent themes only override a subset of variables */
export interface AccentThemeOverrides {
  light: Partial<ThemeCssVars>;
  dark: Partial<ThemeCssVars>;
}

export type BaseColorName = "neutral" | "stone" | "zinc" | "gray";

export type AccentColorName =
  | "amber"
  | "blue"
  | "cyan"
  | "emerald"
  | "fuchsia"
  | "green"
  | "indigo"
  | "lime"
  | "orange"
  | "pink"
  | "purple"
  | "red"
  | "rose"
  | "sky"
  | "teal"
  | "violet"
  | "yellow";

export type ThemeColorName = BaseColorName | AccentColorName;

// ---------------------------------------------------------------------------
// Base Color Themes (complete variable sets)
// ---------------------------------------------------------------------------

export const BASE_THEMES: Record<BaseColorName, ThemeDefinition> = {
  neutral: {
    radius: "0.625rem",
    light: {
      background: "oklch(1 0 0)",
      foreground: "oklch(0.145 0 0)",
      card: "oklch(1 0 0)",
      "card-foreground": "oklch(0.145 0 0)",
      popover: "oklch(1 0 0)",
      "popover-foreground": "oklch(0.145 0 0)",
      primary: "oklch(0.205 0 0)",
      "primary-foreground": "oklch(0.985 0 0)",
      secondary: "oklch(0.97 0 0)",
      "secondary-foreground": "oklch(0.205 0 0)",
      muted: "oklch(0.97 0 0)",
      "muted-foreground": "oklch(0.556 0 0)",
      accent: "oklch(0.97 0 0)",
      "accent-foreground": "oklch(0.205 0 0)",
      destructive: "oklch(0.58 0.22 27)",
      border: "oklch(0.922 0 0)",
      input: "oklch(0.922 0 0)",
      ring: "oklch(0.708 0 0)",
      "chart-1": "oklch(0.809 0.105 251.813)",
      "chart-2": "oklch(0.623 0.214 259.815)",
      "chart-3": "oklch(0.546 0.245 262.881)",
      "chart-4": "oklch(0.488 0.243 264.376)",
      "chart-5": "oklch(0.424 0.199 265.638)",
      sidebar: "oklch(0.985 0 0)",
      "sidebar-foreground": "oklch(0.145 0 0)",
      "sidebar-primary": "oklch(0.205 0 0)",
      "sidebar-primary-foreground": "oklch(0.985 0 0)",
      "sidebar-accent": "oklch(0.97 0 0)",
      "sidebar-accent-foreground": "oklch(0.205 0 0)",
      "sidebar-border": "oklch(0.922 0 0)",
      "sidebar-ring": "oklch(0.708 0 0)",
    },
    dark: {
      background: "oklch(0.145 0 0)",
      foreground: "oklch(0.985 0 0)",
      card: "oklch(0.205 0 0)",
      "card-foreground": "oklch(0.985 0 0)",
      popover: "oklch(0.205 0 0)",
      "popover-foreground": "oklch(0.985 0 0)",
      primary: "oklch(0.87 0.00 0)",
      "primary-foreground": "oklch(0.205 0 0)",
      secondary: "oklch(0.269 0 0)",
      "secondary-foreground": "oklch(0.985 0 0)",
      muted: "oklch(0.269 0 0)",
      "muted-foreground": "oklch(0.708 0 0)",
      accent: "oklch(0.371 0 0)",
      "accent-foreground": "oklch(0.985 0 0)",
      destructive: "oklch(0.704 0.191 22.216)",
      border: "oklch(1 0 0 / 10%)",
      input: "oklch(1 0 0 / 15%)",
      ring: "oklch(0.556 0 0)",
      "chart-1": "oklch(0.809 0.105 251.813)",
      "chart-2": "oklch(0.623 0.214 259.815)",
      "chart-3": "oklch(0.546 0.245 262.881)",
      "chart-4": "oklch(0.488 0.243 264.376)",
      "chart-5": "oklch(0.424 0.199 265.638)",
      sidebar: "oklch(0.205 0 0)",
      "sidebar-foreground": "oklch(0.985 0 0)",
      "sidebar-primary": "oklch(0.488 0.243 264.376)",
      "sidebar-primary-foreground": "oklch(0.985 0 0)",
      "sidebar-accent": "oklch(0.269 0 0)",
      "sidebar-accent-foreground": "oklch(0.985 0 0)",
      "sidebar-border": "oklch(1 0 0 / 10%)",
      "sidebar-ring": "oklch(0.556 0 0)",
    },
  },

  stone: {
    radius: "0.625rem",
    light: {
      background: "oklch(1 0 0)",
      foreground: "oklch(0.147 0.004 49.25)",
      card: "oklch(1 0 0)",
      "card-foreground": "oklch(0.147 0.004 49.25)",
      popover: "oklch(1 0 0)",
      "popover-foreground": "oklch(0.147 0.004 49.25)",
      primary: "oklch(0.216 0.006 56.043)",
      "primary-foreground": "oklch(0.985 0.001 106.423)",
      secondary: "oklch(0.97 0.001 106.424)",
      "secondary-foreground": "oklch(0.216 0.006 56.043)",
      muted: "oklch(0.97 0.001 106.424)",
      "muted-foreground": "oklch(0.553 0.013 58.071)",
      accent: "oklch(0.97 0.001 106.424)",
      "accent-foreground": "oklch(0.216 0.006 56.043)",
      destructive: "oklch(0.577 0.245 27.325)",
      border: "oklch(0.923 0.003 48.717)",
      input: "oklch(0.923 0.003 48.717)",
      ring: "oklch(0.709 0.01 56.259)",
      "chart-1": "oklch(0.646 0.222 41.116)",
      "chart-2": "oklch(0.6 0.118 184.704)",
      "chart-3": "oklch(0.398 0.07 227.392)",
      "chart-4": "oklch(0.828 0.189 84.429)",
      "chart-5": "oklch(0.769 0.188 70.08)",
      sidebar: "oklch(0.985 0.001 106.423)",
      "sidebar-foreground": "oklch(0.147 0.004 49.25)",
      "sidebar-primary": "oklch(0.216 0.006 56.043)",
      "sidebar-primary-foreground": "oklch(0.985 0.001 106.423)",
      "sidebar-accent": "oklch(0.97 0.001 106.424)",
      "sidebar-accent-foreground": "oklch(0.216 0.006 56.043)",
      "sidebar-border": "oklch(0.923 0.003 48.717)",
      "sidebar-ring": "oklch(0.709 0.01 56.259)",
    },
    dark: {
      background: "oklch(0.147 0.004 49.25)",
      foreground: "oklch(0.985 0.001 106.423)",
      card: "oklch(0.216 0.006 56.043)",
      "card-foreground": "oklch(0.985 0.001 106.423)",
      popover: "oklch(0.216 0.006 56.043)",
      "popover-foreground": "oklch(0.985 0.001 106.423)",
      primary: "oklch(0.923 0.003 48.717)",
      "primary-foreground": "oklch(0.216 0.006 56.043)",
      secondary: "oklch(0.268 0.007 34.298)",
      "secondary-foreground": "oklch(0.985 0.001 106.423)",
      muted: "oklch(0.268 0.007 34.298)",
      "muted-foreground": "oklch(0.709 0.01 56.259)",
      accent: "oklch(0.268 0.007 34.298)",
      "accent-foreground": "oklch(0.985 0.001 106.423)",
      destructive: "oklch(0.704 0.191 22.216)",
      border: "oklch(1 0 0 / 10%)",
      input: "oklch(1 0 0 / 15%)",
      ring: "oklch(0.553 0.013 58.071)",
      "chart-1": "oklch(0.488 0.243 264.376)",
      "chart-2": "oklch(0.696 0.17 162.48)",
      "chart-3": "oklch(0.769 0.188 70.08)",
      "chart-4": "oklch(0.627 0.265 303.9)",
      "chart-5": "oklch(0.645 0.246 16.439)",
      sidebar: "oklch(0.216 0.006 56.043)",
      "sidebar-foreground": "oklch(0.985 0.001 106.423)",
      "sidebar-primary": "oklch(0.488 0.243 264.376)",
      "sidebar-primary-foreground": "oklch(0.985 0.001 106.423)",
      "sidebar-accent": "oklch(0.268 0.007 34.298)",
      "sidebar-accent-foreground": "oklch(0.985 0.001 106.423)",
      "sidebar-border": "oklch(1 0 0 / 10%)",
      "sidebar-ring": "oklch(0.553 0.013 58.071)",
    },
  },

  zinc: {
    radius: "0.625rem",
    light: {
      background: "oklch(1 0 0)",
      foreground: "oklch(0.141 0.005 285.823)",
      card: "oklch(1 0 0)",
      "card-foreground": "oklch(0.141 0.005 285.823)",
      popover: "oklch(1 0 0)",
      "popover-foreground": "oklch(0.141 0.005 285.823)",
      primary: "oklch(0.21 0.006 285.885)",
      "primary-foreground": "oklch(0.985 0 0)",
      secondary: "oklch(0.967 0.001 286.375)",
      "secondary-foreground": "oklch(0.21 0.006 285.885)",
      muted: "oklch(0.967 0.001 286.375)",
      "muted-foreground": "oklch(0.552 0.016 285.938)",
      accent: "oklch(0.967 0.001 286.375)",
      "accent-foreground": "oklch(0.21 0.006 285.885)",
      destructive: "oklch(0.577 0.245 27.325)",
      border: "oklch(0.92 0.004 286.32)",
      input: "oklch(0.92 0.004 286.32)",
      ring: "oklch(0.705 0.015 286.067)",
      "chart-1": "oklch(0.646 0.222 41.116)",
      "chart-2": "oklch(0.6 0.118 184.704)",
      "chart-3": "oklch(0.398 0.07 227.392)",
      "chart-4": "oklch(0.828 0.189 84.429)",
      "chart-5": "oklch(0.769 0.188 70.08)",
      sidebar: "oklch(0.985 0 0)",
      "sidebar-foreground": "oklch(0.141 0.005 285.823)",
      "sidebar-primary": "oklch(0.21 0.006 285.885)",
      "sidebar-primary-foreground": "oklch(0.985 0 0)",
      "sidebar-accent": "oklch(0.967 0.001 286.375)",
      "sidebar-accent-foreground": "oklch(0.21 0.006 285.885)",
      "sidebar-border": "oklch(0.92 0.004 286.32)",
      "sidebar-ring": "oklch(0.705 0.015 286.067)",
    },
    dark: {
      background: "oklch(0.141 0.005 285.823)",
      foreground: "oklch(0.985 0 0)",
      card: "oklch(0.21 0.006 285.885)",
      "card-foreground": "oklch(0.985 0 0)",
      popover: "oklch(0.21 0.006 285.885)",
      "popover-foreground": "oklch(0.985 0 0)",
      primary: "oklch(0.92 0.004 286.32)",
      "primary-foreground": "oklch(0.21 0.006 285.885)",
      secondary: "oklch(0.274 0.006 286.033)",
      "secondary-foreground": "oklch(0.985 0 0)",
      muted: "oklch(0.274 0.006 286.033)",
      "muted-foreground": "oklch(0.705 0.015 286.067)",
      accent: "oklch(0.274 0.006 286.033)",
      "accent-foreground": "oklch(0.985 0 0)",
      destructive: "oklch(0.704 0.191 22.216)",
      border: "oklch(1 0 0 / 10%)",
      input: "oklch(1 0 0 / 15%)",
      ring: "oklch(0.552 0.016 285.938)",
      "chart-1": "oklch(0.488 0.243 264.376)",
      "chart-2": "oklch(0.696 0.17 162.48)",
      "chart-3": "oklch(0.769 0.188 70.08)",
      "chart-4": "oklch(0.627 0.265 303.9)",
      "chart-5": "oklch(0.645 0.246 16.439)",
      sidebar: "oklch(0.21 0.006 285.885)",
      "sidebar-foreground": "oklch(0.985 0 0)",
      "sidebar-primary": "oklch(0.488 0.243 264.376)",
      "sidebar-primary-foreground": "oklch(0.985 0 0)",
      "sidebar-accent": "oklch(0.274 0.006 286.033)",
      "sidebar-accent-foreground": "oklch(0.985 0 0)",
      "sidebar-border": "oklch(1 0 0 / 10%)",
      "sidebar-ring": "oklch(0.552 0.016 285.938)",
    },
  },

  gray: {
    radius: "0.625rem",
    light: {
      background: "oklch(1 0 0)",
      foreground: "oklch(0.13 0.028 261.692)",
      card: "oklch(1 0 0)",
      "card-foreground": "oklch(0.13 0.028 261.692)",
      popover: "oklch(1 0 0)",
      "popover-foreground": "oklch(0.13 0.028 261.692)",
      primary: "oklch(0.21 0.034 264.665)",
      "primary-foreground": "oklch(0.985 0.002 247.839)",
      secondary: "oklch(0.967 0.003 264.542)",
      "secondary-foreground": "oklch(0.21 0.034 264.665)",
      muted: "oklch(0.967 0.003 264.542)",
      "muted-foreground": "oklch(0.551 0.027 264.364)",
      accent: "oklch(0.967 0.003 264.542)",
      "accent-foreground": "oklch(0.21 0.034 264.665)",
      destructive: "oklch(0.577 0.245 27.325)",
      border: "oklch(0.928 0.006 264.531)",
      input: "oklch(0.928 0.006 264.531)",
      ring: "oklch(0.707 0.022 261.325)",
      "chart-1": "oklch(0.646 0.222 41.116)",
      "chart-2": "oklch(0.6 0.118 184.704)",
      "chart-3": "oklch(0.398 0.07 227.392)",
      "chart-4": "oklch(0.828 0.189 84.429)",
      "chart-5": "oklch(0.769 0.188 70.08)",
      sidebar: "oklch(0.985 0.002 247.839)",
      "sidebar-foreground": "oklch(0.13 0.028 261.692)",
      "sidebar-primary": "oklch(0.21 0.034 264.665)",
      "sidebar-primary-foreground": "oklch(0.985 0.002 247.839)",
      "sidebar-accent": "oklch(0.967 0.003 264.542)",
      "sidebar-accent-foreground": "oklch(0.21 0.034 264.665)",
      "sidebar-border": "oklch(0.928 0.006 264.531)",
      "sidebar-ring": "oklch(0.707 0.022 261.325)",
    },
    dark: {
      background: "oklch(0.13 0.028 261.692)",
      foreground: "oklch(0.985 0.002 247.839)",
      card: "oklch(0.21 0.034 264.665)",
      "card-foreground": "oklch(0.985 0.002 247.839)",
      popover: "oklch(0.21 0.034 264.665)",
      "popover-foreground": "oklch(0.985 0.002 247.839)",
      primary: "oklch(0.928 0.006 264.531)",
      "primary-foreground": "oklch(0.21 0.034 264.665)",
      secondary: "oklch(0.278 0.033 256.848)",
      "secondary-foreground": "oklch(0.985 0.002 247.839)",
      muted: "oklch(0.278 0.033 256.848)",
      "muted-foreground": "oklch(0.707 0.022 261.325)",
      accent: "oklch(0.278 0.033 256.848)",
      "accent-foreground": "oklch(0.985 0.002 247.839)",
      destructive: "oklch(0.704 0.191 22.216)",
      border: "oklch(1 0 0 / 10%)",
      input: "oklch(1 0 0 / 15%)",
      ring: "oklch(0.551 0.027 264.364)",
      "chart-1": "oklch(0.488 0.243 264.376)",
      "chart-2": "oklch(0.696 0.17 162.48)",
      "chart-3": "oklch(0.769 0.188 70.08)",
      "chart-4": "oklch(0.627 0.265 303.9)",
      "chart-5": "oklch(0.645 0.246 16.439)",
      sidebar: "oklch(0.21 0.034 264.665)",
      "sidebar-foreground": "oklch(0.985 0.002 247.839)",
      "sidebar-primary": "oklch(0.488 0.243 264.376)",
      "sidebar-primary-foreground": "oklch(0.985 0.002 247.839)",
      "sidebar-accent": "oklch(0.278 0.033 256.848)",
      "sidebar-accent-foreground": "oklch(0.985 0.002 247.839)",
      "sidebar-border": "oklch(1 0 0 / 10%)",
      "sidebar-ring": "oklch(0.551 0.027 264.364)",
    },
  },
};

// ---------------------------------------------------------------------------
// Accent Theme Overrides (partial -- merge on top of a base color)
// ---------------------------------------------------------------------------

export const ACCENT_THEMES: Record<AccentColorName, AccentThemeOverrides> = {
  amber: {
    light: {
      primary: "oklch(0.67 0.16 58)",
      "primary-foreground": "oklch(0.99 0.02 95)",
      secondary: "oklch(0.967 0.001 286.375)",
      "secondary-foreground": "oklch(0.21 0.006 285.885)",
      "chart-1": "oklch(0.88 0.15 92)",
      "chart-2": "oklch(0.77 0.16 70)",
      "chart-3": "oklch(0.67 0.16 58)",
      "chart-4": "oklch(0.56 0.15 49)",
      "chart-5": "oklch(0.47 0.12 46)",
      "sidebar-primary": "oklch(0.67 0.16 58)",
      "sidebar-primary-foreground": "oklch(0.99 0.02 95)",
    },
    dark: {
      primary: "oklch(0.77 0.16 70)",
      "primary-foreground": "oklch(0.28 0.07 46)",
      secondary: "oklch(0.274 0.006 286.033)",
      "secondary-foreground": "oklch(0.985 0 0)",
      "chart-1": "oklch(0.88 0.15 92)",
      "chart-2": "oklch(0.77 0.16 70)",
      "chart-3": "oklch(0.67 0.16 58)",
      "chart-4": "oklch(0.56 0.15 49)",
      "chart-5": "oklch(0.47 0.12 46)",
      "sidebar-primary": "oklch(0.77 0.16 70)",
      "sidebar-primary-foreground": "oklch(0.28 0.07 46)",
    },
  },

  blue: {
    light: {
      primary: "oklch(0.488 0.243 264.376)",
      "primary-foreground": "oklch(0.97 0.014 254.604)",
      secondary: "oklch(0.967 0.001 286.375)",
      "secondary-foreground": "oklch(0.21 0.006 285.885)",
      "chart-1": "oklch(0.809 0.105 251.813)",
      "chart-2": "oklch(0.623 0.214 259.815)",
      "chart-3": "oklch(0.546 0.245 262.881)",
      "chart-4": "oklch(0.488 0.243 264.376)",
      "chart-5": "oklch(0.424 0.199 265.638)",
      "sidebar-primary": "oklch(0.546 0.245 262.881)",
      "sidebar-primary-foreground": "oklch(0.97 0.014 254.604)",
    },
    dark: {
      primary: "oklch(0.42 0.18 266)",
      "primary-foreground": "oklch(0.97 0.014 254.604)",
      secondary: "oklch(0.274 0.006 286.033)",
      "secondary-foreground": "oklch(0.985 0 0)",
      "chart-1": "oklch(0.809 0.105 251.813)",
      "chart-2": "oklch(0.623 0.214 259.815)",
      "chart-3": "oklch(0.546 0.245 262.881)",
      "chart-4": "oklch(0.488 0.243 264.376)",
      "chart-5": "oklch(0.424 0.199 265.638)",
      "sidebar-primary": "oklch(0.623 0.214 259.815)",
      "sidebar-primary-foreground": "oklch(0.97 0.014 254.604)",
    },
  },

  cyan: {
    light: {
      primary: "oklch(0.61 0.11 222)",
      "primary-foreground": "oklch(0.98 0.02 201)",
      secondary: "oklch(0.967 0.001 286.375)",
      "secondary-foreground": "oklch(0.21 0.006 285.885)",
      "chart-1": "oklch(0.87 0.12 207)",
      "chart-2": "oklch(0.80 0.13 212)",
      "chart-3": "oklch(0.71 0.13 215)",
      "chart-4": "oklch(0.61 0.11 222)",
      "chart-5": "oklch(0.52 0.09 223)",
      "sidebar-primary": "oklch(0.61 0.11 222)",
      "sidebar-primary-foreground": "oklch(0.98 0.02 201)",
    },
    dark: {
      primary: "oklch(0.71 0.13 215)",
      "primary-foreground": "oklch(0.30 0.05 230)",
      secondary: "oklch(0.274 0.006 286.033)",
      "secondary-foreground": "oklch(0.985 0 0)",
      "chart-1": "oklch(0.87 0.12 207)",
      "chart-2": "oklch(0.80 0.13 212)",
      "chart-3": "oklch(0.71 0.13 215)",
      "chart-4": "oklch(0.61 0.11 222)",
      "chart-5": "oklch(0.52 0.09 223)",
      "sidebar-primary": "oklch(0.80 0.13 212)",
      "sidebar-primary-foreground": "oklch(0.30 0.05 230)",
    },
  },

  emerald: {
    light: {
      primary: "oklch(0.60 0.13 163)",
      "primary-foreground": "oklch(0.98 0.02 166)",
      secondary: "oklch(0.967 0.001 286.375)",
      "secondary-foreground": "oklch(0.21 0.006 285.885)",
      "chart-1": "oklch(0.85 0.13 165)",
      "chart-2": "oklch(0.77 0.15 163)",
      "chart-3": "oklch(0.70 0.15 162)",
      "chart-4": "oklch(0.60 0.13 163)",
      "chart-5": "oklch(0.51 0.10 166)",
      "sidebar-primary": "oklch(0.60 0.13 163)",
      "sidebar-primary-foreground": "oklch(0.98 0.02 166)",
    },
    dark: {
      primary: "oklch(0.70 0.15 162)",
      "primary-foreground": "oklch(0.26 0.05 173)",
      secondary: "oklch(0.274 0.006 286.033)",
      "secondary-foreground": "oklch(0.985 0 0)",
      "chart-1": "oklch(0.85 0.13 165)",
      "chart-2": "oklch(0.77 0.15 163)",
      "chart-3": "oklch(0.70 0.15 162)",
      "chart-4": "oklch(0.60 0.13 163)",
      "chart-5": "oklch(0.51 0.10 166)",
      "sidebar-primary": "oklch(0.77 0.15 163)",
      "sidebar-primary-foreground": "oklch(0.26 0.05 173)",
    },
  },

  fuchsia: {
    light: {
      primary: "oklch(0.59 0.26 323)",
      "primary-foreground": "oklch(0.98 0.02 320)",
      secondary: "oklch(0.967 0.001 286.375)",
      "secondary-foreground": "oklch(0.21 0.006 285.885)",
      "chart-1": "oklch(0.83 0.13 321)",
      "chart-2": "oklch(0.75 0.21 322)",
      "chart-3": "oklch(0.67 0.26 322)",
      "chart-4": "oklch(0.59 0.26 323)",
      "chart-5": "oklch(0.52 0.23 324)",
      "sidebar-primary": "oklch(0.59 0.26 323)",
      "sidebar-primary-foreground": "oklch(0.98 0.02 320)",
    },
    dark: {
      primary: "oklch(0.67 0.26 322)",
      "primary-foreground": "oklch(0.98 0.02 320)",
      secondary: "oklch(0.274 0.006 286.033)",
      "secondary-foreground": "oklch(0.985 0 0)",
      "chart-1": "oklch(0.83 0.13 321)",
      "chart-2": "oklch(0.75 0.21 322)",
      "chart-3": "oklch(0.67 0.26 322)",
      "chart-4": "oklch(0.59 0.26 323)",
      "chart-5": "oklch(0.52 0.23 324)",
      "sidebar-primary": "oklch(0.75 0.21 322)",
      "sidebar-primary-foreground": "oklch(0.98 0.02 320)",
    },
  },

  green: {
    light: {
      primary: "oklch(0.648 0.2 131.684)",
      "primary-foreground": "oklch(0.986 0.031 120.757)",
      secondary: "oklch(0.967 0.001 286.375)",
      "secondary-foreground": "oklch(0.21 0.006 285.885)",
      "chart-1": "oklch(0.871 0.15 154.449)",
      "chart-2": "oklch(0.723 0.219 149.579)",
      "chart-3": "oklch(0.627 0.194 149.214)",
      "chart-4": "oklch(0.527 0.154 150.069)",
      "chart-5": "oklch(0.448 0.119 151.328)",
      "sidebar-primary": "oklch(0.648 0.2 131.684)",
      "sidebar-primary-foreground": "oklch(0.986 0.031 120.757)",
    },
    dark: {
      primary: "oklch(0.648 0.2 131.684)",
      "primary-foreground": "oklch(0.986 0.031 120.757)",
      secondary: "oklch(0.274 0.006 286.033)",
      "secondary-foreground": "oklch(0.985 0 0)",
      "chart-1": "oklch(0.871 0.15 154.449)",
      "chart-2": "oklch(0.723 0.219 149.579)",
      "chart-3": "oklch(0.627 0.194 149.214)",
      "chart-4": "oklch(0.527 0.154 150.069)",
      "chart-5": "oklch(0.448 0.119 151.328)",
      "sidebar-primary": "oklch(0.768 0.233 130.85)",
      "sidebar-primary-foreground": "oklch(0.986 0.031 120.757)",
    },
  },

  indigo: {
    light: {
      primary: "oklch(0.51 0.23 277)",
      "primary-foreground": "oklch(0.96 0.02 272)",
      secondary: "oklch(0.967 0.001 286.375)",
      "secondary-foreground": "oklch(0.21 0.006 285.885)",
      "chart-1": "oklch(0.79 0.10 275)",
      "chart-2": "oklch(0.68 0.16 277)",
      "chart-3": "oklch(0.59 0.20 277)",
      "chart-4": "oklch(0.51 0.23 277)",
      "chart-5": "oklch(0.46 0.21 277)",
      "sidebar-primary": "oklch(0.51 0.23 277)",
      "sidebar-primary-foreground": "oklch(0.96 0.02 272)",
    },
    dark: {
      primary: "oklch(0.59 0.20 277)",
      "primary-foreground": "oklch(0.96 0.02 272)",
      secondary: "oklch(0.274 0.006 286.033)",
      "secondary-foreground": "oklch(0.985 0 0)",
      "chart-1": "oklch(0.79 0.10 275)",
      "chart-2": "oklch(0.68 0.16 277)",
      "chart-3": "oklch(0.59 0.20 277)",
      "chart-4": "oklch(0.51 0.23 277)",
      "chart-5": "oklch(0.46 0.21 277)",
      "sidebar-primary": "oklch(0.68 0.16 277)",
      "sidebar-primary-foreground": "oklch(0.96 0.02 272)",
    },
  },

  lime: {
    light: {
      primary: "oklch(0.65 0.18 132)",
      "primary-foreground": "oklch(0.99 0.03 121)",
      secondary: "oklch(0.967 0.001 286.375)",
      "secondary-foreground": "oklch(0.21 0.006 285.885)",
      "chart-1": "oklch(0.90 0.18 127)",
      "chart-2": "oklch(0.85 0.21 129)",
      "chart-3": "oklch(0.77 0.20 131)",
      "chart-4": "oklch(0.65 0.18 132)",
      "chart-5": "oklch(0.53 0.14 132)",
      "sidebar-primary": "oklch(0.65 0.18 132)",
      "sidebar-primary-foreground": "oklch(0.99 0.03 121)",
    },
    dark: {
      primary: "oklch(0.77 0.20 131)",
      "primary-foreground": "oklch(0.27 0.07 132)",
      secondary: "oklch(0.274 0.006 286.033)",
      "secondary-foreground": "oklch(0.985 0 0)",
      "chart-1": "oklch(0.90 0.18 127)",
      "chart-2": "oklch(0.85 0.21 129)",
      "chart-3": "oklch(0.77 0.20 131)",
      "chart-4": "oklch(0.65 0.18 132)",
      "chart-5": "oklch(0.53 0.14 132)",
      "sidebar-primary": "oklch(0.85 0.21 129)",
      "sidebar-primary-foreground": "oklch(0.27 0.07 132)",
    },
  },

  orange: {
    light: {
      primary: "oklch(0.646 0.222 41.116)",
      "primary-foreground": "oklch(0.98 0.016 73.684)",
      secondary: "oklch(0.967 0.001 286.375)",
      "secondary-foreground": "oklch(0.21 0.006 285.885)",
      "chart-1": "oklch(0.837 0.128 66.29)",
      "chart-2": "oklch(0.705 0.213 47.604)",
      "chart-3": "oklch(0.646 0.222 41.116)",
      "chart-4": "oklch(0.553 0.195 38.402)",
      "chart-5": "oklch(0.47 0.157 37.304)",
      "sidebar-primary": "oklch(0.646 0.222 41.116)",
      "sidebar-primary-foreground": "oklch(0.98 0.016 73.684)",
    },
    dark: {
      primary: "oklch(0.705 0.213 47.604)",
      "primary-foreground": "oklch(0.98 0.016 73.684)",
      secondary: "oklch(0.274 0.006 286.033)",
      "secondary-foreground": "oklch(0.985 0 0)",
      "chart-1": "oklch(0.837 0.128 66.29)",
      "chart-2": "oklch(0.705 0.213 47.604)",
      "chart-3": "oklch(0.646 0.222 41.116)",
      "chart-4": "oklch(0.553 0.195 38.402)",
      "chart-5": "oklch(0.47 0.157 37.304)",
      "sidebar-primary": "oklch(0.705 0.213 47.604)",
      "sidebar-primary-foreground": "oklch(0.98 0.016 73.684)",
    },
  },

  pink: {
    light: {
      primary: "oklch(0.59 0.22 1)",
      "primary-foreground": "oklch(0.97 0.01 343)",
      secondary: "oklch(0.967 0.001 286.375)",
      "secondary-foreground": "oklch(0.21 0.006 285.885)",
      "chart-1": "oklch(0.82 0.11 346)",
      "chart-2": "oklch(0.73 0.18 350)",
      "chart-3": "oklch(0.66 0.21 354)",
      "chart-4": "oklch(0.59 0.22 1)",
      "chart-5": "oklch(0.52 0.20 4)",
      "sidebar-primary": "oklch(0.59 0.22 1)",
      "sidebar-primary-foreground": "oklch(0.97 0.01 343)",
    },
    dark: {
      primary: "oklch(0.66 0.21 354)",
      "primary-foreground": "oklch(0.97 0.01 343)",
      secondary: "oklch(0.274 0.006 286.033)",
      "secondary-foreground": "oklch(0.985 0 0)",
      "chart-1": "oklch(0.82 0.11 346)",
      "chart-2": "oklch(0.73 0.18 350)",
      "chart-3": "oklch(0.66 0.21 354)",
      "chart-4": "oklch(0.59 0.22 1)",
      "chart-5": "oklch(0.52 0.20 4)",
      "sidebar-primary": "oklch(0.73 0.18 350)",
      "sidebar-primary-foreground": "oklch(0.97 0.01 343)",
    },
  },

  purple: {
    light: {
      primary: "oklch(0.56 0.25 302)",
      "primary-foreground": "oklch(0.98 0.01 308)",
      secondary: "oklch(0.967 0.001 286.375)",
      "secondary-foreground": "oklch(0.21 0.006 285.885)",
      "chart-1": "oklch(0.83 0.11 306)",
      "chart-2": "oklch(0.72 0.18 306)",
      "chart-3": "oklch(0.63 0.23 304)",
      "chart-4": "oklch(0.56 0.25 302)",
      "chart-5": "oklch(0.50 0.24 302)",
      "sidebar-primary": "oklch(0.56 0.25 302)",
      "sidebar-primary-foreground": "oklch(0.98 0.01 308)",
    },
    dark: {
      primary: "oklch(0.63 0.23 304)",
      "primary-foreground": "oklch(0.98 0.01 308)",
      secondary: "oklch(0.274 0.006 286.033)",
      "secondary-foreground": "oklch(0.985 0 0)",
      "chart-1": "oklch(0.83 0.11 306)",
      "chart-2": "oklch(0.72 0.18 306)",
      "chart-3": "oklch(0.63 0.23 304)",
      "chart-4": "oklch(0.56 0.25 302)",
      "chart-5": "oklch(0.50 0.24 302)",
      "sidebar-primary": "oklch(0.72 0.18 306)",
      "sidebar-primary-foreground": "oklch(0.98 0.01 308)",
    },
  },

  red: {
    light: {
      primary: "oklch(0.577 0.245 27.325)",
      "primary-foreground": "oklch(0.971 0.013 17.38)",
      secondary: "oklch(0.967 0.001 286.375)",
      "secondary-foreground": "oklch(0.21 0.006 285.885)",
      "chart-1": "oklch(0.808 0.114 19.571)",
      "chart-2": "oklch(0.637 0.237 25.331)",
      "chart-3": "oklch(0.577 0.245 27.325)",
      "chart-4": "oklch(0.505 0.213 27.518)",
      "chart-5": "oklch(0.444 0.177 26.899)",
      "sidebar-primary": "oklch(0.577 0.245 27.325)",
      "sidebar-primary-foreground": "oklch(0.971 0.013 17.38)",
    },
    dark: {
      primary: "oklch(0.637 0.237 25.331)",
      "primary-foreground": "oklch(0.971 0.013 17.38)",
      secondary: "oklch(0.274 0.006 286.033)",
      "secondary-foreground": "oklch(0.985 0 0)",
      "chart-1": "oklch(0.808 0.114 19.571)",
      "chart-2": "oklch(0.637 0.237 25.331)",
      "chart-3": "oklch(0.577 0.245 27.325)",
      "chart-4": "oklch(0.505 0.213 27.518)",
      "chart-5": "oklch(0.444 0.177 26.899)",
      "sidebar-primary": "oklch(0.637 0.237 25.331)",
      "sidebar-primary-foreground": "oklch(0.971 0.013 17.38)",
    },
  },

  rose: {
    light: {
      primary: "oklch(0.586 0.253 17.585)",
      "primary-foreground": "oklch(0.969 0.015 12.422)",
      secondary: "oklch(0.967 0.001 286.375)",
      "secondary-foreground": "oklch(0.21 0.006 285.885)",
      "chart-1": "oklch(0.81 0.117 11.638)",
      "chart-2": "oklch(0.645 0.246 16.439)",
      "chart-3": "oklch(0.586 0.253 17.585)",
      "chart-4": "oklch(0.514 0.222 16.935)",
      "chart-5": "oklch(0.455 0.188 13.697)",
      "sidebar-primary": "oklch(0.586 0.253 17.585)",
      "sidebar-primary-foreground": "oklch(0.969 0.015 12.422)",
    },
    dark: {
      primary: "oklch(0.645 0.246 16.439)",
      "primary-foreground": "oklch(0.969 0.015 12.422)",
      secondary: "oklch(0.274 0.006 286.033)",
      "secondary-foreground": "oklch(0.985 0 0)",
      "chart-1": "oklch(0.81 0.117 11.638)",
      "chart-2": "oklch(0.645 0.246 16.439)",
      "chart-3": "oklch(0.586 0.253 17.585)",
      "chart-4": "oklch(0.514 0.222 16.935)",
      "chart-5": "oklch(0.455 0.188 13.697)",
      sidebar: "oklch(0.21 0.006 285.885)",
      "sidebar-primary": "oklch(0.645 0.246 16.439)",
      "sidebar-primary-foreground": "oklch(0.969 0.015 12.422)",
    },
  },

  sky: {
    light: {
      primary: "oklch(0.59 0.14 242)",
      "primary-foreground": "oklch(0.98 0.01 237)",
      secondary: "oklch(0.967 0.001 286.375)",
      "secondary-foreground": "oklch(0.21 0.006 285.885)",
      "chart-1": "oklch(0.83 0.10 230)",
      "chart-2": "oklch(0.75 0.14 233)",
      "chart-3": "oklch(0.68 0.15 237)",
      "chart-4": "oklch(0.59 0.14 242)",
      "chart-5": "oklch(0.50 0.12 243)",
      "sidebar-primary": "oklch(0.59 0.14 242)",
      "sidebar-primary-foreground": "oklch(0.98 0.01 237)",
    },
    dark: {
      primary: "oklch(0.68 0.15 237)",
      "primary-foreground": "oklch(0.29 0.06 243)",
      secondary: "oklch(0.274 0.006 286.033)",
      "secondary-foreground": "oklch(0.985 0 0)",
      "chart-1": "oklch(0.83 0.10 230)",
      "chart-2": "oklch(0.75 0.14 233)",
      "chart-3": "oklch(0.68 0.15 237)",
      "chart-4": "oklch(0.59 0.14 242)",
      "chart-5": "oklch(0.50 0.12 243)",
      "sidebar-primary": "oklch(0.75 0.14 233)",
      "sidebar-primary-foreground": "oklch(0.29 0.06 243)",
    },
  },

  teal: {
    light: {
      primary: "oklch(0.60 0.10 185)",
      "primary-foreground": "oklch(0.98 0.01 181)",
      secondary: "oklch(0.967 0.001 286.375)",
      "secondary-foreground": "oklch(0.21 0.006 285.885)",
      "chart-1": "oklch(0.85 0.13 181)",
      "chart-2": "oklch(0.78 0.13 182)",
      "chart-3": "oklch(0.70 0.12 183)",
      "chart-4": "oklch(0.60 0.10 185)",
      "chart-5": "oklch(0.51 0.09 186)",
      "sidebar-primary": "oklch(0.60 0.10 185)",
      "sidebar-primary-foreground": "oklch(0.98 0.01 181)",
    },
    dark: {
      primary: "oklch(0.70 0.12 183)",
      "primary-foreground": "oklch(0.28 0.04 193)",
      secondary: "oklch(0.274 0.006 286.033)",
      "secondary-foreground": "oklch(0.985 0 0)",
      "chart-1": "oklch(0.85 0.13 181)",
      "chart-2": "oklch(0.78 0.13 182)",
      "chart-3": "oklch(0.70 0.12 183)",
      "chart-4": "oklch(0.60 0.10 185)",
      "chart-5": "oklch(0.51 0.09 186)",
      "sidebar-primary": "oklch(0.78 0.13 182)",
      "sidebar-primary-foreground": "oklch(0.28 0.04 193)",
    },
  },

  violet: {
    light: {
      primary: "oklch(0.541 0.281 293.009)",
      "primary-foreground": "oklch(0.969 0.016 293.756)",
      secondary: "oklch(0.967 0.001 286.375)",
      "secondary-foreground": "oklch(0.21 0.006 285.885)",
      "chart-1": "oklch(0.811 0.111 293.571)",
      "chart-2": "oklch(0.606 0.25 292.717)",
      "chart-3": "oklch(0.541 0.281 293.009)",
      "chart-4": "oklch(0.491 0.27 292.581)",
      "chart-5": "oklch(0.432 0.232 292.759)",
      "sidebar-primary": "oklch(0.541 0.281 293.009)",
      "sidebar-primary-foreground": "oklch(0.969 0.016 293.756)",
    },
    dark: {
      primary: "oklch(0.606 0.25 292.717)",
      "primary-foreground": "oklch(0.969 0.016 293.756)",
      secondary: "oklch(0.274 0.006 286.033)",
      "secondary-foreground": "oklch(0.985 0 0)",
      "chart-1": "oklch(0.811 0.111 293.571)",
      "chart-2": "oklch(0.606 0.25 292.717)",
      "chart-3": "oklch(0.541 0.281 293.009)",
      "chart-4": "oklch(0.491 0.27 292.581)",
      "chart-5": "oklch(0.432 0.232 292.759)",
      "sidebar-primary": "oklch(0.606 0.25 292.717)",
      "sidebar-primary-foreground": "oklch(0.969 0.016 293.756)",
    },
  },

  yellow: {
    light: {
      primary: "oklch(0.852 0.199 91.936)",
      "primary-foreground": "oklch(0.421 0.095 57.708)",
      secondary: "oklch(0.967 0.001 286.375)",
      "secondary-foreground": "oklch(0.21 0.006 285.885)",
      "chart-1": "oklch(0.905 0.182 98.111)",
      "chart-2": "oklch(0.795 0.184 86.047)",
      "chart-3": "oklch(0.681 0.162 75.834)",
      "chart-4": "oklch(0.554 0.135 66.442)",
      "chart-5": "oklch(0.476 0.114 61.907)",
      "sidebar-primary": "oklch(0.681 0.162 75.834)",
      "sidebar-primary-foreground": "oklch(0.987 0.026 102.212)",
    },
    dark: {
      primary: "oklch(0.795 0.184 86.047)",
      "primary-foreground": "oklch(0.421 0.095 57.708)",
      secondary: "oklch(0.274 0.006 286.033)",
      "secondary-foreground": "oklch(0.985 0 0)",
      "chart-1": "oklch(0.905 0.182 98.111)",
      "chart-2": "oklch(0.795 0.184 86.047)",
      "chart-3": "oklch(0.681 0.162 75.834)",
      "chart-4": "oklch(0.554 0.135 66.442)",
      "chart-5": "oklch(0.476 0.114 61.907)",
      "sidebar-primary": "oklch(0.795 0.184 86.047)",
      "sidebar-primary-foreground": "oklch(0.987 0.026 102.212)",
    },
  },
};

// ---------------------------------------------------------------------------
// All theme names
// ---------------------------------------------------------------------------

export const BASE_COLOR_NAMES: BaseColorName[] = ["neutral", "stone", "zinc", "gray"];

export const ACCENT_COLOR_NAMES: AccentColorName[] = [
  "amber",
  "blue",
  "cyan",
  "emerald",
  "fuchsia",
  "green",
  "indigo",
  "lime",
  "orange",
  "pink",
  "purple",
  "red",
  "rose",
  "sky",
  "teal",
  "violet",
  "yellow",
];

export const ALL_THEME_COLOR_NAMES: ThemeColorName[] = [...BASE_COLOR_NAMES, ...ACCENT_COLOR_NAMES];

// ---------------------------------------------------------------------------
// Theme Composition Helper
// ---------------------------------------------------------------------------

/**
 * Composes a complete theme by merging an accent theme's overrides on top
 * of a base color theme. If no accent is specified, returns the base as-is.
 *
 * This mirrors how shadcn/ui v4 composes themes internally:
 * - Base colors (neutral/stone/zinc/gray) define background, foreground,
 *   card, popover, muted, accent, destructive, border, input, ring, sidebar, etc.
 * - Accent themes (blue, violet, etc.) override primary, primary-foreground,
 *   secondary, secondary-foreground, chart-1..5, sidebar-primary, etc.
 *
 * @example
 * ```ts
 * // Blue theme with zinc base grays
 * const theme = composeTheme("zinc", "blue");
 *
 * // Pure neutral base (no accent override)
 * const neutralTheme = composeTheme("neutral");
 * ```
 */
export function composeTheme(base: BaseColorName, accent?: AccentColorName): ThemeDefinition {
  const baseTheme = BASE_THEMES[base];

  if (!accent) {
    return baseTheme;
  }

  const accentOverrides = ACCENT_THEMES[accent];

  return {
    radius: baseTheme.radius,
    light: {
      ...baseTheme.light,
      ...accentOverrides.light,
    } as ThemeCssVars,
    dark: {
      ...baseTheme.dark,
      ...accentOverrides.dark,
    } as ThemeCssVars,
  };
}

// ---------------------------------------------------------------------------
// CSS Generation Helper
// ---------------------------------------------------------------------------

/**
 * Generates CSS custom property declarations from a ThemeCssVars object.
 *
 * @example
 * ```ts
 * const theme = composeTheme("zinc", "blue");
 * const lightCss = generateCssVars(theme.light);
 * // Returns: "--background: oklch(1 0 0);\n--foreground: oklch(0.141 0.005 285.823);\n..."
 * ```
 */
export function generateCssVars(vars: ThemeCssVars): string {
  return Object.entries(vars)
    .map(([key, value]) => `--${key}: ${value};`)
    .join("\n");
}

/**
 * Generates a complete CSS block with :root (light) and .dark selectors.
 *
 * @example
 * ```ts
 * const theme = composeTheme("zinc", "violet");
 * const css = generateThemeCss(theme);
 * ```
 */
export function generateThemeCss(theme: ThemeDefinition): string {
  const lightVars = Object.entries(theme.light)
    .map(([key, value]) => `  --${key}: ${value};`)
    .join("\n");

  const darkVars = Object.entries(theme.dark)
    .map(([key, value]) => `  --${key}: ${value};`)
    .join("\n");

  return `:root {
  --radius: ${theme.radius};
${lightVars}
}

.dark {
${darkVars}
}`;
}

/**
 * Generates a Tailwind CSS v4 @theme block.
 *
 * @example
 * ```ts
 * const theme = composeTheme("zinc", "blue");
 * const css = generateTailwindV4Theme(theme);
 * ```
 */
export function generateTailwindV4Theme(theme: ThemeDefinition): string {
  const lightVars = Object.entries(theme.light)
    .map(([key, value]) => `    --${key}: ${value};`)
    .join("\n");

  const darkVars = Object.entries(theme.dark)
    .map(([key, value]) => `    --${key}: ${value};`)
    .join("\n");

  return `@layer base {
  :root {
    --radius: ${theme.radius};
${lightVars}
  }

  .dark {
${darkVars}
  }
}`;
}
