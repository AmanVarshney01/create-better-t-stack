import type { ProjectConfig } from "@better-fullstack/types";

import Handlebars from "handlebars";
import isBinaryPath from "is-binary-path";

import { composeTheme, type BaseColorName, type AccentColorName } from "../shadcn-themes";

Handlebars.registerHelper("eq", (a, b) => a === b);
Handlebars.registerHelper("ne", (a, b) => a !== b);
Handlebars.registerHelper("not", (a) => !a);
Handlebars.registerHelper("and", (...args) => args.slice(0, -1).every(Boolean));
Handlebars.registerHelper("or", (...args) => args.slice(0, -1).some(Boolean));
Handlebars.registerHelper("includes", (arr, val) => Array.isArray(arr) && arr.includes(val));
Handlebars.registerHelper("replace", (value, find, replacement) =>
  String(value).split(String(find)).join(String(replacement)),
);

// ---------------------------------------------------------------------------
// shadcn/ui theme helpers
// ---------------------------------------------------------------------------

const SHADCN_BASE_COLORS = new Set(["neutral", "stone", "zinc", "gray"]);

const SHADCN_FONT_FAMILY: Record<string, string> = {
  inter: "'Inter Variable', sans-serif",
  geist: "'Geist', sans-serif",
  figtree: "'Figtree Variable', sans-serif",
  "noto-sans": "'Noto Sans Variable', sans-serif",
  "nunito-sans": "'Nunito Sans Variable', sans-serif",
  roboto: "'Roboto', sans-serif",
  raleway: "'Raleway Variable', sans-serif",
  "dm-sans": "'DM Sans Variable', sans-serif",
  "public-sans": "'Public Sans', sans-serif",
  outfit: "'Outfit Variable', sans-serif",
  "jetbrains-mono": "'JetBrains Mono Variable', monospace",
  "geist-mono": "'Geist Mono', monospace",
};

const SHADCN_RADIUS: Record<string, string> = {
  none: "0",
  small: "0.45rem",
  medium: "0.625rem",
  large: "0.875rem",
};

/** Generates `:root` or `.dark` CSS variable declarations for a shadcn theme. */
Handlebars.registerHelper("shadcnThemeVars", function (this: ProjectConfig, mode: string) {
  const baseColor = (this.shadcnBaseColor ?? "neutral") as BaseColorName;
  const colorTheme = this.shadcnColorTheme ?? "neutral";
  const accent = SHADCN_BASE_COLORS.has(colorTheme) ? undefined : (colorTheme as AccentColorName);
  const theme = composeTheme(baseColor, accent);
  const vars = mode === "dark" ? theme.dark : theme.light;
  return new Handlebars.SafeString(
    Object.entries(vars)
      .map(([k, v]) => `  --${k}: ${v};`)
      .join("\n"),
  );
});

/** Returns the resolved radius value for the chosen shadcn radius preset. */
Handlebars.registerHelper("shadcnRadiusValue", function (this: ProjectConfig) {
  const pref = this.shadcnRadius ?? "default";
  if (pref === "default") {
    const baseColor = (this.shadcnBaseColor ?? "neutral") as BaseColorName;
    return composeTheme(baseColor).radius;
  }
  return SHADCN_RADIUS[pref] ?? "0.625rem";
});

/** Returns the CSS font-family string for the chosen shadcn font. */
Handlebars.registerHelper("shadcnFontFamily", function (this: ProjectConfig) {
  const font = this.shadcnFont ?? "inter";
  return SHADCN_FONT_FAMILY[font] ?? "'Inter Variable', sans-serif";
});

/** Returns true if the chosen shadcn font is a monospace font. */
Handlebars.registerHelper("shadcnFontIsMono", function (this: ProjectConfig) {
  const font = this.shadcnFont ?? "inter";
  return font === "jetbrains-mono" || font === "geist-mono";
});

export function processTemplateString(content: string, context: ProjectConfig): string {
  return Handlebars.compile(content)(context);
}

export function isBinaryFile(filePath: string): boolean {
  return isBinaryPath(filePath);
}

export function transformFilename(filename: string): string {
  let result = filename.endsWith(".hbs") ? filename.slice(0, -4) : filename;

  const basename = result.split("/").pop() || result;
  if (basename === "_gitignore") result = result.replace(/_gitignore$/, ".gitignore");
  else if (basename === "_npmrc") result = result.replace(/_npmrc$/, ".npmrc");

  return result;
}

export function processFileContent(
  filePath: string,
  content: string,
  context: ProjectConfig,
): string {
  if (isBinaryFile(filePath)) return "[Binary file]";

  const originalPath = filePath.endsWith(".hbs") ? filePath : filePath + ".hbs";
  if (filePath !== originalPath || filePath.includes(".hbs")) {
    try {
      return processTemplateString(content, context);
    } catch (error) {
      console.warn(`Template processing failed for ${filePath}:`, error);
      return content;
    }
  }

  return content;
}

export { Handlebars };
