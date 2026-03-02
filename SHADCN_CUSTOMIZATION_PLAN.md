# shadcn/ui Full Customization Integration Plan

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [What Changed in shadcn/ui](#2-what-changed-in-shadcnui)
3. [Current State in Our Codebase](#3-current-state-in-our-codebase)
4. [Gap Analysis](#4-gap-analysis)
5. [New Config Fields Needed](#5-new-config-fields-needed)
6. [Implementation Plan](#6-implementation-plan)
7. [Template Changes](#7-template-changes)
8. [Web Builder UI Changes](#8-web-builder-ui-changes)
9. [CLI Changes](#9-cli-changes)
10. [Compatibility Rules](#10-compatibility-rules)
11. [Community Ports (Svelte, Vue, Solid)](#11-community-ports-svelte-vue-solid)
12. [File-by-File Change List](#12-file-by-file-change-list)
13. [Open Questions](#13-open-questions)

---

## 1. Executive Summary

shadcn/ui has undergone massive changes in 2025-2026. The key additions are:

- **5 visual styles** (vega, nova, maia, lyra, mira) instead of just "default"/"new-york"
- **2 headless library choices** (Radix UI vs Base UI) — combined as `{base}-{style}` presets
- **5 icon libraries** (lucide, tabler, hugeicons, phosphor, remixicon)
- **21 color themes** (neutral, stone, zinc, gray + 17 accent colors)
- **12 font options** (inter, geist, figtree, jetbrains-mono, etc.)
- **4 base colors** (neutral, stone, zinc, gray)
- **Border radius options** (default, none, small, medium, large)
- **Menu customization** (menuColor: default/inverted, menuAccent: subtle/bold)
- **RTL support** toggle

Currently, our codebase hardcodes `"style": "base-lyra"`, `"iconLibrary": "lucide"`, `"baseColor": "neutral"`, and a single OKLCH theme. We need to expose all these choices to the user.

---

## 2. What Changed in shadcn/ui

### 2.1 Visual Styles (Presets)

| Style    | Description                      | Default Font   | Default Icons |
| -------- | -------------------------------- | -------------- | ------------- |
| **Vega** | Classic shadcn/ui look           | Inter          | Lucide        |
| **Nova** | Compact, reduced padding/margins | Geist          | HugeIcons     |
| **Maia** | Soft, rounded, generous spacing  | Figtree        | HugeIcons     |
| **Lyra** | Boxy, sharp edges                | JetBrains Mono | HugeIcons     |
| **Mira** | Dense interfaces                 | Inter          | HugeIcons     |

**Important**: Presets rewrite actual component code, not just CSS. Different styles produce structurally different components.

### 2.2 Headless Library Choice

| Library      | Package                      | Notes                                        |
| ------------ | ---------------------------- | -------------------------------------------- |
| **Radix UI** | `radix-ui` (unified package) | Original foundation, 130M+ monthly downloads |
| **Base UI**  | `@base-ui/react`             | MUI's headless lib, v1.0 stable Dec 2025     |

The `style` field in `components.json` uses `{base}-{style}` format:

- `radix-vega`, `radix-nova`, `radix-maia`, `radix-lyra`, `radix-mira`
- `base-vega`, `base-nova`, `base-maia`, `base-lyra`, `base-mira`

### 2.3 Icon Libraries

From shadcn CLI source code (`packages/shadcn/src/icons/libraries.ts`):

| Value       | Package(s)                                        | Import Pattern                                 |
| ----------- | ------------------------------------------------- | ---------------------------------------------- |
| `lucide`    | `lucide-react`                                    | `import { Icon } from 'lucide-react'`          |
| `tabler`    | `@tabler/icons-react`                             | `import { Icon } from '@tabler/icons-react'`   |
| `hugeicons` | `@hugeicons/react` + `@hugeicons/core-free-icons` | `<HugeiconsIcon icon={Icon} />`                |
| `phosphor`  | `@phosphor-icons/react`                           | `import { Icon } from '@phosphor-icons/react'` |
| `remixicon` | `@remixicon/react`                                | `import { Icon } from '@remixicon/react'`      |

### 2.4 Color Themes (21 options)

Base colors: `neutral`, `stone`, `zinc`, `gray`
Accent themes: `amber`, `blue`, `cyan`, `emerald`, `fuchsia`, `green`, `indigo`, `lime`, `orange`, `pink`, `purple`, `red`, `rose`, `sky`, `teal`, `violet`, `yellow`

Each theme generates a complete set of OKLCH CSS variables for light/dark mode.

### 2.5 Font Options (12)

`inter`, `geist`, `noto-sans`, `nunito-sans`, `figtree`, `roboto`, `raleway`, `dm-sans`, `public-sans`, `outfit`, `jetbrains-mono`, `geist-mono`

### 2.6 Border Radius Options

| Name      | Value                        |
| --------- | ---------------------------- |
| `default` | (empty — uses style default) |
| `none`    | `0`                          |
| `small`   | `0.45rem`                    |
| `medium`  | `0.625rem`                   |
| `large`   | `0.875rem`                   |

### 2.7 New components.json Fields

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "radix-nova",           // NEW: was "new-york" or "default"
  "rsc": false,
  "tsx": true,
  "iconLibrary": "lucide",         // NEW: was always lucide
  "menuColor": "default",          // NEW
  "menuAccent": "subtle",          // NEW
  "rtl": false,                    // NEW
  "tailwind": {
    "config": "",                   // Empty for Tailwind v4
    "css": "src/index.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": { ... },
  "registries": {}                  // NEW: for custom registries
}
```

### 2.8 How `npx shadcn create` Uses Presets

```bash
npx shadcn@latest create --preset "https://ui.shadcn.com/init?base=radix&style=nova&baseColor=neutral&theme=violet&iconLibrary=hugeicons&font=geist&menuAccent=subtle&menuColor=default&radius=default&template=next"
```

---

## 3. Current State in Our Codebase

### 3.1 Hardcoded Values

**`components.json.hbs`** (both React and Astro templates):

```json
{
  "style": "base-lyra",        // HARDCODED — should be user choice
  "iconLibrary": "lucide",     // HARDCODED — should be user choice
  "menuColor": "default",      // HARDCODED — should be user choice
  "menuAccent": "subtle",      // HARDCODED — should be user choice
  "baseColor": "neutral"       // HARDCODED — should be user choice
}
```

**`index.css.hbs`** (React web-base):

- Single hardcoded OKLCH color theme (neutral/base-lyra colors)
- Hardcoded `--font-sans: 'Inter Variable', sans-serif`
- Hardcoded `--radius: 0.625rem`
- No RTL support

### 3.2 Type System

- `UILibrarySchema` has 12 options including `"shadcn-ui"` — no sub-options
- No schemas for shadcn style, icon library, base color, theme, font, radius, etc.
- `ProjectConfig` has `uiLibrary: UILibrary` but no shadcn-specific sub-fields

### 3.3 Web Builder

- `uiLibrary` is a flat single-select with 12 options
- No conditional sub-options appear when `shadcn-ui` is selected
- The pattern for conditional sections exists (astroIntegration shown when astro is selected)

### 3.4 Template Generator

- `components.json.hbs` wrapped in `{{#if (eq uiLibrary "shadcn-ui")}}` — values hardcoded inside
- `index.css.hbs` has shadcn-ui conditional block with hardcoded OKLCH theme
- UI components in `frontend/react/web-base/src/components/ui/` are hardcoded to one style

### 3.5 CLI

- `--ui-library shadcn-ui` flag exists, no sub-flags for customization
- `getUILibraryChoice()` shows navigable prompt with hint text

---

## 4. Gap Analysis

| Feature                                 | shadcn/ui Supports  | We Currently Have     | Gap                                  |
| --------------------------------------- | ------------------- | --------------------- | ------------------------------------ |
| Visual style (vega/nova/maia/lyra/mira) | 5 styles            | Hardcoded `base-lyra` | Need selection + templates           |
| Headless base (radix/base)              | 2 bases             | Hardcoded `base`      | Need selection + different deps      |
| Icon library                            | 5 libraries         | Hardcoded `lucide`    | Need selection + deps + components   |
| Color theme                             | 21 themes           | Hardcoded neutral     | Need 21 CSS variable sets            |
| Base color                              | 4 colors            | Hardcoded `neutral`   | Need 4 base color sets               |
| Font                                    | 12 fonts            | Hardcoded `Inter`     | Need font selection + CSS            |
| Border radius                           | 5 options           | Hardcoded `0.625rem`  | Need selection + CSS var             |
| Menu color                              | 2 options           | Hardcoded `default`   | Need selection                       |
| Menu accent                             | 2 options           | Hardcoded `subtle`    | Need selection                       |
| RTL                                     | boolean             | Not supported         | Need RTL toggle                      |
| Component code per style                | Different per style | Single hardcoded set  | **Major**: Need per-style components |

### 4.1 Critical Decision: Component Code Per Style

This is the biggest challenge. shadcn/ui presets don't just change CSS — they rewrite component source code. Options:

**Option A: Use `shadcn` CLI at scaffold time** (Recommended)

- After scaffolding, run `npx shadcn@latest add` with the user's config to pull correct components
- Pros: Always up-to-date, correct per-style code, less maintenance
- Cons: Requires network access, slower scaffold, dependency on shadcn registry

**Option B: Hardcode component templates for each style**

- Maintain 10 variants (5 styles x 2 bases) of each component
- Pros: Works offline, no external dependency
- Cons: Massive maintenance burden, gets outdated quickly

**Option C: Ship minimal components, let users add more via shadcn CLI** (Practical middle ground)

- Ship only `button`, `card`, `input`, `label` (what we currently ship)
- Generate correct `components.json` and `globals.css` with user's choices
- User runs `npx shadcn add` for additional components
- Pros: Low maintenance, always correct config, user gets latest components
- Cons: Initial scaffold has fewer components

**Recommendation: Option C** — We generate the correct configuration (components.json, globals.css with theme, font, radius) and ship a minimal set of components. The shadcn CLI handles the rest. Our bundled components use Handlebars conditionals for the style/base differences.

---

## 5. New Config Fields Needed

### 5.1 New Zod Schemas (packages/types/src/schemas.ts)

```typescript
// shadcn/ui sub-options — only relevant when uiLibrary === "shadcn-ui"
export const ShadcnBaseSchema = z
  .enum(["radix", "base"])
  .describe("shadcn/ui headless UI base library");

export const ShadcnStyleSchema = z
  .enum(["vega", "nova", "maia", "lyra", "mira"])
  .describe("shadcn/ui visual style preset");

export const ShadcnIconLibrarySchema = z
  .enum(["lucide", "tabler", "hugeicons", "phosphor", "remixicon"])
  .describe("shadcn/ui icon library");

export const ShadcnColorThemeSchema = z
  .enum([
    "neutral", "stone", "zinc", "gray",
    "amber", "blue", "cyan", "emerald", "fuchsia",
    "green", "indigo", "lime", "orange", "pink",
    "purple", "red", "rose", "sky", "teal", "violet", "yellow"
  ])
  .describe("shadcn/ui accent color theme");

export const ShadcnBaseColorSchema = z
  .enum(["neutral", "stone", "zinc", "gray"])
  .describe("shadcn/ui base neutral color");

export const ShadcnFontSchema = z
  .enum([
    "inter", "geist", "noto-sans", "nunito-sans", "figtree",
    "roboto", "raleway", "dm-sans", "public-sans", "outfit",
    "jetbrains-mono", "geist-mono"
  ])
  .describe("shadcn/ui font family");

export const ShadcnRadiusSchema = z
  .enum(["default", "none", "small", "medium", "large"])
  .describe("shadcn/ui border radius preset");
```

### 5.2 ProjectConfig Additions

```typescript
// Add to ProjectConfigSchema:
shadcnBase: ShadcnBaseSchema.optional(),
shadcnStyle: ShadcnStyleSchema.optional(),
shadcnIconLibrary: ShadcnIconLibrarySchema.optional(),
shadcnColorTheme: ShadcnColorThemeSchema.optional(),
shadcnBaseColor: ShadcnBaseColorSchema.optional(),
shadcnFont: ShadcnFontSchema.optional(),
shadcnRadius: ShadcnRadiusSchema.optional(),
```

These are all optional — only populated when `uiLibrary === "shadcn-ui"`.

### 5.3 CLI Flags

```
--shadcn-base <radix|base>
--shadcn-style <vega|nova|maia|lyra|mira>
--shadcn-icon-library <lucide|tabler|hugeicons|phosphor|remixicon>
--shadcn-color-theme <neutral|stone|zinc|...21 options>
--shadcn-base-color <neutral|stone|zinc|gray>
--shadcn-font <inter|geist|figtree|...12 options>
--shadcn-radius <default|none|small|medium|large>
```

---

## 6. Implementation Plan

### Phase 1: Types & Schemas

1. Add new Zod schemas to `packages/types/src/schemas.ts`
2. Add fields to `ProjectConfigSchema`, `CreateInputSchema`, `BetterTStackConfigSchema`
3. Export new value constants
4. Build types package

### Phase 2: CLI Integration

1. Add CLI flags to `apps/cli/src/helpers/core/command-handlers.ts`
2. Create `apps/cli/src/prompts/shadcn-options.ts` — interactive prompts for each shadcn sub-option
3. Update `apps/cli/src/prompts/config-prompts.ts` — call shadcn prompts when `uiLibrary === "shadcn-ui"`
4. Update `apps/cli/src/constants.ts` — defaults for shadcn sub-options
5. Update `apps/cli/src/utils/config-validation.ts` — validate shadcn options
6. Update `apps/cli/src/utils/compatibility-rules.ts` — shadcn constraints

### Phase 3: Template Generator

1. Update `components.json.hbs` — use Handlebars variables instead of hardcoded values
2. Generate OKLCH CSS variables per theme — either embed all 21 themes or fetch from shadcn registry
3. Update `index.css.hbs` — dynamic font, radius, theme colors
4. Update component templates if needed for base (radix vs base-ui) differences
5. Update `css-ui-deps.ts` — different deps per icon library and base
6. Rebuild templates: `bun run --filter=@better-fullstack/template-generator generate-templates`

### Phase 4: Web Builder

1. Add new state fields to `StackState` type in `constant.ts`
2. Add `TECH_OPTIONS` entries for each shadcn sub-option
3. Add conditional section rendering (like astroIntegration pattern) — show shadcn options when `uiLibrary === "shadcn-ui"`
4. Add URL params for new fields in `stack-search-schema.ts` and `stack-url-keys.ts`
5. Add to command generation in `stack-utils.ts`
6. Add compatibility/disabled logic in `utils.ts`
7. Add default values in `DEFAULT_STACK`

### Phase 5: Testing

1. Scaffold test combos with various shadcn configurations
2. Verify `components.json` is generated correctly for each combination
3. Verify CSS variables match expected theme
4. Verify correct icon library deps are installed
5. Verify correct base library deps (radix-ui vs @base-ui/react)
6. Type-check generated projects

---

## 7. Template Changes

### 7.1 `components.json.hbs` (React + Astro)

**Before:**

```handlebars
{{#if (eq uiLibrary "shadcn-ui")}}
{
  "style": "base-lyra",
  "iconLibrary": "lucide",
  "menuColor": "default",
  "menuAccent": "subtle",
  "tailwind": { "baseColor": "neutral" }
}
{{/if}}
```

**After:**

```handlebars
{{#if (eq uiLibrary "shadcn-ui")}}
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "{{shadcnBase}}-{{shadcnStyle}}",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/index.css",
    "baseColor": "{{shadcnBaseColor}}",
    "cssVariables": true,
    "prefix": ""
  },
  "iconLibrary": "{{shadcnIconLibrary}}",
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "menuColor": "default",
  "menuAccent": "subtle",
  "registries": {}
}
{{/if}}
```

### 7.2 `index.css.hbs` — Theme CSS Variables

This is the most complex change. We need OKLCH color sets for each of the 21 themes x 4 base colors.

**Approach**: Create a helper or partial system:

```handlebars
{{#if (eq uiLibrary "shadcn-ui")}}
@import 'shadcn/tailwind.css';

:root {
  {{> shadcn-theme-vars theme=shadcnColorTheme baseColor=shadcnBaseColor mode="light" }}
  --radius: {{shadcnRadiusValue}};
}

.dark {
  {{> shadcn-theme-vars theme=shadcnColorTheme baseColor=shadcnBaseColor mode="dark" }}
}

@theme inline {
  --font-sans: '{{shadcnFontFamily}}', sans-serif;
  /* ... all color mappings ... */
}
{{/if}}
```

**However**, Handlebars partials may be complex. Alternative: generate the CSS variable blocks as a lookup table in the template processor and inject them. The template generator could have a `shadcn-themes.ts` file mapping each theme to its OKLCH values.

### 7.3 Theme Data Source

We need to obtain the exact OKLCH values for all 21 themes x 4 base colors x light/dark modes.

**Options:**

1. **Scrape from shadcn/ui registry** — fetch `https://ui.shadcn.com/registry/themes.json` or equivalent
2. **Hardcode from shadcn source** — copy from `apps/v4/registry/themes/` in the shadcn-ui/ui repo
3. **Use the shadcn CLI at build time** — generate themes programmatically

**Recommendation**: Hardcode from shadcn source. Create `packages/template-generator/src/data/shadcn-themes.ts` with all theme OKLCH values. This can be periodically synced with upstream.

### 7.4 Font Mapping

```typescript
const SHADCN_FONTS: Record<string, { family: string; variable: boolean }> = {
  "inter": { family: "Inter Variable", variable: true },
  "geist": { family: "Geist Variable", variable: true },
  "noto-sans": { family: "Noto Sans Variable", variable: true },
  "nunito-sans": { family: "Nunito Sans Variable", variable: true },
  "figtree": { family: "Figtree Variable", variable: true },
  "roboto": { family: "Roboto", variable: false },
  "raleway": { family: "Raleway", variable: false },
  "dm-sans": { family: "DM Sans", variable: false },
  "public-sans": { family: "Public Sans", variable: false },
  "outfit": { family: "Outfit", variable: false },
  "jetbrains-mono": { family: "JetBrains Mono Variable", variable: true },
  "geist-mono": { family: "Geist Mono Variable", variable: true },
};
```

### 7.5 Icon Library Dependencies

Update `css-ui-deps.ts` to add correct packages:

```typescript
if (uiLibrary === "shadcn-ui") {
  // Base library
  if (config.shadcnBase === "radix") {
    deps.push("radix-ui");
  } else {
    deps.push("@base-ui/react");
  }

  // Icon library
  switch (config.shadcnIconLibrary) {
    case "lucide": deps.push("lucide-react"); break;
    case "tabler": deps.push("@tabler/icons-react"); break;
    case "hugeicons": deps.push("@hugeicons/react", "@hugeicons/core-free-icons"); break;
    case "phosphor": deps.push("@phosphor-icons/react"); break;
    case "remixicon": deps.push("@remixicon/react"); break;
  }

  // Common shadcn deps
  deps.push("shadcn", "class-variance-authority", "clsx", "tailwind-merge", "tw-animate-css");
}
```

### 7.6 Radius Mapping

```typescript
const SHADCN_RADII: Record<string, string> = {
  "default": "",       // Use style default
  "none": "0",
  "small": "0.45rem",
  "medium": "0.625rem",
  "large": "0.875rem",
};
```

---

## 8. Web Builder UI Changes

### 8.1 New State Fields

Add to `StackState` in `constant.ts`:

```typescript
interface StackState {
  // ... existing fields ...
  shadcnBase: string;          // "radix" | "base"
  shadcnStyle: string;         // "vega" | "nova" | "maia" | "lyra" | "mira"
  shadcnIconLibrary: string;   // "lucide" | "tabler" | "hugeicons" | "phosphor" | "remixicon"
  shadcnColorTheme: string;    // 21 options
  shadcnBaseColor: string;     // "neutral" | "stone" | "zinc" | "gray"
  shadcnFont: string;          // 12 options
  shadcnRadius: string;        // "default" | "none" | "small" | "medium" | "large"
}
```

Defaults:

```typescript
shadcnBase: "radix",
shadcnStyle: "nova",
shadcnIconLibrary: "lucide",
shadcnColorTheme: "neutral",
shadcnBaseColor: "neutral",
shadcnFont: "inter",
shadcnRadius: "default",
```

### 8.2 Conditional Section Pattern

Follow the existing `astroIntegration` pattern. When `uiLibrary === "shadcn-ui"`, show a collapsible section with shadcn sub-options below the UI Library section.

**Sidebar**: Add conditional categories:

```typescript
if (cat === "shadcnOptions") {
  if (stack.uiLibrary === "shadcn-ui") {
    cats.push(cat);
  }
  continue;
}
```

**Main content**: Render shadcn sub-options inline after the uiLibrary section (like astroIntegration is rendered after webFrontend).

### 8.3 TECH_OPTIONS Entries

```typescript
shadcnBase: [
  { id: "radix", name: "Radix UI", description: "Original foundation, battle-tested", icon: "...", default: true },
  { id: "base", name: "Base UI", description: "MUI's headless library, cleaner APIs", icon: "..." },
],
shadcnStyle: [
  { id: "vega", name: "Vega", description: "Classic shadcn/ui look", default: false },
  { id: "nova", name: "Nova", description: "Compact, reduced padding", default: true },
  { id: "maia", name: "Maia", description: "Soft, rounded, generous spacing" },
  { id: "lyra", name: "Lyra", description: "Boxy, sharp edges" },
  { id: "mira", name: "Mira", description: "Dense interfaces" },
],
shadcnIconLibrary: [
  { id: "lucide", name: "Lucide", description: "Default icon library", default: true },
  { id: "tabler", name: "Tabler Icons", description: "2000+ open-source icons" },
  { id: "hugeicons", name: "HugeIcons", description: "Modern icon set" },
  { id: "phosphor", name: "Phosphor", description: "Flexible icon family" },
  { id: "remixicon", name: "Remix Icon", description: "Open-source neutral icons" },
],
shadcnColorTheme: [
  { id: "neutral", name: "Neutral", default: true },
  { id: "blue", name: "Blue" },
  { id: "violet", name: "Violet" },
  // ... all 21 themes
],
shadcnBaseColor: [
  { id: "neutral", name: "Neutral", default: true },
  { id: "stone", name: "Stone" },
  { id: "zinc", name: "Zinc" },
  { id: "gray", name: "Gray" },
],
shadcnFont: [
  { id: "inter", name: "Inter", description: "Clean sans-serif", default: true },
  { id: "geist", name: "Geist", description: "Vercel's typeface" },
  // ... all 12 fonts
],
shadcnRadius: [
  { id: "default", name: "Default", default: true },
  { id: "none", name: "None" },
  { id: "small", name: "Small" },
  { id: "medium", name: "Medium" },
  { id: "large", name: "Large" },
],
```

### 8.4 URL Params

Add to `stack-url-keys.ts`:

```typescript
shadcnBase: "sb",
shadcnStyle: "ss",
shadcnIconLibrary: "si",
shadcnColorTheme: "st",
shadcnBaseColor: "sc",
shadcnFont: "sf",
shadcnRadius: "sr",
```

### 8.5 Command Generation

Add to `generateStackCommand()` in `stack-utils.ts`:

```typescript
if (stack.uiLibrary === "shadcn-ui") {
  flags.push(`--shadcn-base ${stack.shadcnBase}`);
  flags.push(`--shadcn-style ${stack.shadcnStyle}`);
  flags.push(`--shadcn-icon-library ${stack.shadcnIconLibrary}`);
  flags.push(`--shadcn-color-theme ${stack.shadcnColorTheme}`);
  flags.push(`--shadcn-base-color ${stack.shadcnBaseColor}`);
  flags.push(`--shadcn-font ${stack.shadcnFont}`);
  flags.push(`--shadcn-radius ${stack.shadcnRadius}`);
}
```

### 8.6 Auto-Reset on UI Library Change

When user switches away from `shadcn-ui`, reset all shadcn sub-options to defaults (in `analyzeStackCompatibility()` or `handleTechSelect()`).

---

## 9. CLI Changes

### 9.1 New Flags

Add to `CreateInputSchema` and CLI flag parser:

```
--shadcn-base <radix|base>
--shadcn-style <vega|nova|maia|lyra|mira>
--shadcn-icon-library <lucide|tabler|hugeicons|phosphor|remixicon>
--shadcn-color-theme <neutral|stone|zinc|...>
--shadcn-base-color <neutral|stone|zinc|gray>
--shadcn-font <inter|geist|figtree|...>
--shadcn-radius <default|none|small|medium|large>
```

### 9.2 Interactive Prompts

Create `apps/cli/src/prompts/shadcn-options.ts`:

```typescript
export async function getShadcnOptions(flags: Partial<CreateInput>): Promise<ShadcnOptions> {
  // Only called when uiLibrary === "shadcn-ui"

  const base = flags.shadcnBase ?? await promptShadcnBase();
  const style = flags.shadcnStyle ?? await promptShadcnStyle();
  const iconLibrary = flags.shadcnIconLibrary ?? await promptShadcnIconLibrary();
  const colorTheme = flags.shadcnColorTheme ?? await promptShadcnColorTheme();
  const baseColor = flags.shadcnBaseColor ?? await promptShadcnBaseColor();
  const font = flags.shadcnFont ?? await promptShadcnFont();
  const radius = flags.shadcnRadius ?? await promptShadcnRadius();

  return { base, style, iconLibrary, colorTheme, baseColor, font, radius };
}
```

### 9.3 Default Config

```typescript
// In constants.ts
SHADCN_DEFAULTS: {
  base: "radix",
  style: "nova",
  iconLibrary: "lucide",
  colorTheme: "neutral",
  baseColor: "neutral",
  font: "inter",
  radius: "default",
}
```

### 9.4 Non-Interactive Mode

When all `--shadcn-*` flags are provided, skip prompts. When `--yes` is used with `--ui-library shadcn-ui`, use defaults.

---

## 10. Compatibility Rules

### 10.1 shadcn Sub-Options Only When shadcn-ui Selected

- All `shadcn*` fields are only relevant when `uiLibrary === "shadcn-ui"`
- Web builder: hide shadcn section when other UI library selected
- CLI: skip shadcn prompts when other UI library selected
- Template generator: ignore shadcn fields when other UI library selected

### 10.2 Base Color / Theme Compatibility

A theme cannot be the same as a different base color. For example:

- `baseColor: "zinc"` + `theme: "stone"` → invalid (stone is a base color, not accent)
- `baseColor: "zinc"` + `theme: "zinc"` → valid (uses zinc as theme)
- `baseColor: "zinc"` + `theme: "violet"` → valid (accent theme)

Actually, re-checking: the theme CAN be any of the 21 values regardless of base color. The base color determines the neutral tones; the theme determines the accent/primary color. They are independent.

### 10.3 Framework Constraints

- shadcn/ui sub-options only apply to React-based frontends (next, tanstack-router, tanstack-start, react-router, astro+react)
- For non-React frontends, shadcn-ui is already not selectable (existing compatibility rules)

---

## 11. Community Ports (Svelte, Vue, Solid)

### 11.1 Current Situation

| Framework  | Port          | CLI Package            | Maturity                  |
| ---------- | ------------- | ---------------------- | ------------------------- |
| SvelteKit  | shadcn-svelte | `shadcn-svelte@latest` | High (7.5k stars, active) |
| Vue/Nuxt   | shadcn-vue    | `shadcn-vue@latest`    | High (9.5k stars, active) |
| SolidStart | solid-ui      | Various                | Medium (fragmented)       |

### 11.2 Do Community Ports Support These Customizations?

**shadcn-svelte**: Has its own `components.json` but does NOT support the new preset system (base/style/iconLibrary). It uses Bits UI (not Radix/Base UI). It supports Tailwind v4 and similar theming but the customization options are different.

**shadcn-vue**: Uses Reka UI (not Radix/Base UI). Has its own CLI and components.json. Does not support the `{base}-{style}` preset system.

### 11.3 Recommendation for Community Ports

For now, the new shadcn customization sub-options should **only apply to React-based frontends** using the official shadcn/ui. Community ports have their own customization systems that we can integrate separately later.

- Svelte frontend + UI library selection: show `shadcn-svelte` (separate option) or `daisyui` etc.
- Or: keep `shadcn-ui` as React-only (current behavior is correct)

**Future work**: Add `shadcn-svelte` and `shadcn-vue` as separate UI library options with their own sub-options.

---

## 12. File-by-File Change List

### packages/types/src/schemas.ts

- [ ] Add `ShadcnBaseSchema`, `ShadcnStyleSchema`, `ShadcnIconLibrarySchema`, `ShadcnColorThemeSchema`, `ShadcnBaseColorSchema`, `ShadcnFontSchema`, `ShadcnRadiusSchema`
- [ ] Add fields to `ProjectConfigSchema` (optional)
- [ ] Add fields to `CreateInputSchema` (optional)
- [ ] Add fields to `BetterTStackConfigSchema` (optional)
- [ ] Export value constants

### packages/types/src/types.ts

- [ ] Export new types (auto-inferred from schemas)

### apps/cli/src/helpers/core/command-handlers.ts

- [ ] Add `--shadcn-base`, `--shadcn-style`, `--shadcn-icon-library`, `--shadcn-color-theme`, `--shadcn-base-color`, `--shadcn-font`, `--shadcn-radius` flags
- [ ] Pass to config builder

### apps/cli/src/prompts/shadcn-options.ts (NEW FILE)

- [ ] Interactive prompts for each shadcn sub-option
- [ ] Called from config-prompts.ts when uiLibrary === "shadcn-ui"

### apps/cli/src/prompts/config-prompts.ts

- [ ] Import and call `getShadcnOptions()` after UI library selection
- [ ] Pass shadcn options to final config

### apps/cli/src/constants.ts

- [ ] Add `SHADCN_DEFAULTS` object
- [ ] Add to `DEFAULT_CONFIG_BASE`

### apps/cli/src/utils/config-validation.ts

- [ ] Validate shadcn sub-options when uiLibrary === "shadcn-ui"
- [ ] Warn if shadcn options provided but uiLibrary !== "shadcn-ui"

### apps/cli/src/utils/compatibility-rules.ts

- [ ] Add shadcn-specific validation functions

### packages/template-generator/src/data/shadcn-themes.ts (NEW FILE)

- [ ] OKLCH color variable sets for all 21 themes x 4 base colors x light/dark
- [ ] Font family mappings
- [ ] Radius value mappings

### packages/template-generator/templates/frontend/react/web-base/components.json.hbs

- [ ] Replace hardcoded values with `{{shadcnBase}}-{{shadcnStyle}}`, `{{shadcnIconLibrary}}`, `{{shadcnBaseColor}}`

### packages/template-generator/templates/frontend/astro/integrations/react/components.json.hbs

- [ ] Same changes as React components.json.hbs

### packages/template-generator/templates/frontend/react/web-base/src/index.css.hbs

- [ ] Dynamic OKLCH variables based on `shadcnColorTheme` + `shadcnBaseColor`
- [ ] Dynamic `--font-sans` based on `shadcnFont`
- [ ] Dynamic `--radius` based on `shadcnRadius`

### packages/template-generator/src/processors/css-ui-deps.ts

- [ ] Handle shadcn-ui icon library deps dynamically
- [ ] Handle radix vs base-ui deps
- [ ] Add font packages if needed (Google Fonts or npm packages)

### packages/template-generator/src/utils/add-deps.ts

- [ ] Add version entries for new packages: `@tabler/icons-react`, `@hugeicons/react`, `@hugeicons/core-free-icons`, `@phosphor-icons/react`, `@remixicon/react`, `@base-ui/react`

### apps/web/src/lib/constant.ts

- [ ] Add `shadcnBase`, `shadcnStyle`, `shadcnIconLibrary`, `shadcnColorTheme`, `shadcnBaseColor`, `shadcnFont`, `shadcnRadius` to `StackState`
- [ ] Add `TECH_OPTIONS` entries for each
- [ ] Add to `DEFAULT_STACK`
- [ ] Add to category order (conditional categories)

### apps/web/src/lib/types.ts

- [ ] Add new category types

### apps/web/src/lib/stack-url-keys.ts

- [ ] Add URL param keys: `sb`, `ss`, `si`, `st`, `sc`, `sf`, `sr`

### apps/web/src/lib/stack-search-schema.ts

- [ ] Add Zod schemas for new URL params

### apps/web/src/lib/stack-url-state.client.ts

- [ ] Parse new URL params into state

### apps/web/src/lib/stack-url-state.ts

- [ ] Parse new params (SSR version)

### apps/web/src/lib/stack-utils.ts

- [ ] Add new categories to category order
- [ ] Generate CLI flags for shadcn options in `generateStackCommand()`

### apps/web/src/components/stack-builder/stack-builder.tsx

- [ ] Add conditional section for shadcn options (like astroIntegration pattern)
- [ ] Show/hide based on `uiLibrary === "shadcn-ui"`
- [ ] Add sidebar categories conditionally

### apps/web/src/components/stack-builder/utils.ts

- [ ] Add compatibility checks for shadcn options
- [ ] Add auto-reset logic when uiLibrary changes away from shadcn-ui
- [ ] Add disabled reasons

### apps/web/src/lib/tech-icons.ts

- [ ] Add icons for shadcn sub-options (bases, styles, icon libraries)

### apps/web/src/lib/tech-resource-links.ts

- [ ] Add resource links for new shadcn options

---

## 13. Open Questions

### Q1: How to obtain all 21 theme color sets?

- Option A: Scrape from shadcn/ui source code (`apps/v4/registry/themes/`)
- Option B: Use shadcn/ui registry API at build time
- Option C: Manually curate a subset (e.g., 8-10 most popular themes)
- **Decision needed**: Full 21 themes or curated subset?

### Q2: Font loading strategy?

- Google Fonts CDN link in HTML head?
- npm package (e.g., `@fontsource/inter`)?
- Next.js `next/font` for Next.js projects?
- Each framework handles fonts differently — need per-framework strategy

### Q3: Should we ship pre-built components or rely on shadcn CLI?

- Current: We ship 8 pre-built components (button, card, checkbox, dropdown-menu, input, label, skeleton, sonner)
- These components differ per style/base — do we template all variants?
- Or ship minimal and let user `npx shadcn add` the rest?
- **Recommendation**: Keep shipping pre-built components but make them style-aware via Handlebars conditionals

### Q4: How deep should icon library integration go?

- Our shipped components (button, card, etc.) use lucide icons in examples
- Do we need to rewrite example components per icon library?
- Or just set up the correct config and let users add icons themselves?
- **Recommendation**: Set up config correctly, keep lucide in shipped examples for simplicity, user can `npx shadcn migrate icons` later

### Q5: Do we need all 12 fonts or a curated set?

- 12 fonts means 12 Google Fonts imports or npm packages to manage
- Could start with top 5-6 (inter, geist, figtree, jetbrains-mono, dm-sans, outfit)
- **Decision needed**: Full 12 or curated subset?

### Q6: How to handle the Astro + shadcn case?

- Astro components.json currently at `integrations/react/components.json.hbs`
- Same shadcn options should apply
- CSS path differs: `src/styles/global.css` vs `src/index.css`

### Q7: Border radius "default" behavior?

- When radius is "default", what value do we use?
- Each style has its own default radius — need to map style → default radius
- Or just use `0.625rem` (medium) as universal default?

### Q8: Naming — should sub-options be grouped or flat?

- Grouped: `--shadcn-base`, `--shadcn-style`, etc.
- Flat: `--component-base`, `--component-style` (more generic)
- **Recommendation**: `--shadcn-*` prefix since these are shadcn-specific

### Q9: Web builder UX — single section or multiple?

- Single "shadcn/ui Options" section with all 7 sub-options?
- Or separate sections: "Style", "Icons", "Theme", "Font", "Radius"?
- **Recommendation**: Single collapsible "shadcn/ui Customization" section under UI Library, with sub-groups inside

### Q10: Should we show a live preview of the theme in the web builder?

- shadcn/ui has a visual builder at ui.shadcn.com/create with live previews
- We could show color swatches for the theme picker
- Font preview for the font picker
- **Nice-to-have**: Not required for initial implementation
