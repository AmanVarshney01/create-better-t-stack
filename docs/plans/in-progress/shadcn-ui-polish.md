# shadcn/ui Section — UI Polish Fixes

## Status: Complete

## Context

The shadcn/ui sub-option cards in the stack builder have several UI inconsistencies
compared to regular section cards, plus missing metadata that causes CI to fail.

---

## Completed Fixes

### Fix 1: Remove motion hover/tap from shadcn cards

**File:** `apps/web/src/components/stack-builder/stack-builder.tsx`

Removed `whileHover={{ scale: 1.01 }}` and `whileTap={{ scale: 0.99 }}` from the
shadcn sub-option `motion.div` cards. Regular tech cards use only CSS hover transitions,
not framer-motion scale animations.

### Fix 2: Make shadcn section collapsible

**File:** `apps/web/src/components/stack-builder/stack-builder.tsx`

Replaced static header `<div>` with interactive `<button onClick={() => toggleSection("shadcnBase")}>`.
Added rotating `ChevronDown` icon and wrapped sub-categories content in
`<AnimatePresence initial={false}>` + `<motion.div>` with height/opacity animation,
gated on `!collapsedSections.has("shadcnBase")`. Matches the exact pattern used by
regular sections (lines 927-960).

### Fix 3: Color swatches for Color Theme & Base Color

**File:** `apps/web/src/components/stack-builder/stack-builder.tsx`

For `shadcnColorTheme` and `shadcnBaseColor` sub-categories, the icon container now
renders a gradient circle using `tech.color` instead of doing a TechIcon lookup:

```tsx
<div className={cn("h-4 w-4 rounded-full bg-gradient-to-br", tech.color)} />
```

All other shadcn sub-categories still use the standard TechIcon component.

### Fix 4: Icons for Icon Library options

**File:** `apps/web/src/lib/tech-icons.ts`, `apps/web/public/icon/hugeicons.svg`

Added two missing icon library entries to `ICON_REGISTRY`:

- `hugeicons`: local SVG extracted from the HugeIcons logo mark (green crown + dark box)
- `remixicon`: Simple Icons slug `remix` with hex `000000`

All 5 icon library options now have icons: lucide (SI), tabler (local), hugeicons (local),
phosphor (SI), remixicon (SI).

### Fix 5: Fix Base UI icon

**Files:** `apps/web/public/icon/base-ui.svg`, `apps/web/src/lib/tech-icons.ts`

Downloaded Base UI's actual favicon from `https://base-ui.com/static/favicon.svg` —
a 32x32 SVG with two abstract paths (`fill="#000"`). Saved as `base-ui.svg`.

Updated both `base-ui` and `base` entries in `ICON_REGISTRY` from the incorrect
MUI Simple Icons slug to `{ type: "local", src: "/icon/base-ui.svg", needsInvert: "dark" }`.

---

### Fix 6: Add tech resource links for shadcn color/radius options

**File:** `apps/web/src/lib/tech-resource-links.ts`

CI step `Validate Builder Tech Links` was failing with 29 errors — all shadcn options
missing both `docsUrl` and `githubUrl` in `CATEGORY_LINKS`.

Added docs-only entries pointing to `https://ui.shadcn.com/themes` for:

- **shadcnColorTheme** (21 options): neutral, stone, zinc, gray, blue, violet, green,
  red, rose, orange, amber, yellow, lime, emerald, teal, cyan, sky, indigo, purple,
  fuchsia, pink
- **shadcnBaseColor** (4 options): neutral, stone, zinc, gray
- **shadcnRadius** (4 options, `none` auto-skipped by validator): default, small, medium, large

Result: 298/298 builder options validated, 0 errors.

---

## Verification

1. `bun run --filter=web build` — must pass
2. `bun run --filter=web lint` — must pass (0 errors)
3. `bun run --cwd apps/web validate:tech-links` — must pass (0 errors)
4. Visual: shadcn section collapsible, no scale-on-hover, color swatches visible,
   all icon libs have icons, Base UI shows correct logo
