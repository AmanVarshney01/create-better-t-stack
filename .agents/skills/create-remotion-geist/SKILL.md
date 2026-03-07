---
name: create-remotion-geist
description: Create Remotion videos using the Geist design system aesthetic. Use when asked to create videos, animations, or motion graphics that should follow Vercel's visual style - dark theme, spring animations, Geist typography, and the Geist color palette.
---

# Create Remotion Geist Video

Create Remotion videos styled with Vercel's Geist design system - dark backgrounds, spring animations, Geist fonts, and the 10-step color scale.

## When to Use

- Creating any Remotion video that should look like Vercel
- Building motion graphics with Geist's dark theme aesthetic
- Making animated content using Geist typography and colors
- Producing videos that need the polished Vercel visual style

## Critical Rules

1. **NEVER use emojis** - Use proper Geist icons from `@geist-ui/icons` package
2. **Use official brand assets** - Download from official sources, don't hand-craft SVGs
3. **Entry point must be .tsx** - Use `src/index.tsx` with `registerRoot()`, not `.ts`
4. **Use prism-react-renderer for code** - Do NOT use regex-based syntax highlighting

## Quick Start

1. **Scaffold the project:**
   ```bash
   mkdir -p src/{scenes,components,utils} out
   npm init -y
   npm install remotion @remotion/cli @remotion/tailwind react react-dom
   npm install -D tailwindcss typescript @types/react
   npm install @geist-ui/icons  # For proper icons
   ```

2. **Create core files** (see `references/project-setup.md` for templates):
   - `remotion.config.ts` - Enable Tailwind
   - `tailwind.config.js` - Geist colors and fonts
   - `src/styles.css` - Font loading from CDN
   - `src/index.tsx` - Root composition with `registerRoot()`
   - `src/Root.tsx` - Composition definitions
   - `src/utils/animations.ts` - Spring animations

3. **Build scenes** following the pattern in `references/scene-patterns.md`

4. **Render:**
   ```bash
   npx remotion studio          # Preview at localhost:3000
   npx remotion render MyComp out/video.mp4
   ```

## Geist Design Tokens (Quick Reference)

### Colors (Dark Theme)
| Token | CSS Variable | Value | Usage |
|-------|--------------|-------|-------|
| background-100 | --ds-background-100 | #0a0a0a | Primary background |
| background-200 | --ds-background-200 | #171717 | Secondary/elevated |
| gray-400 | --ds-gray-400 | #737373 | Default borders |
| green-700 | --ds-green-700 | #46A758 | Success |
| red-700 | --ds-red-700 | #E5484D | Error |
| amber-700 | --ds-amber-700 | #FFB224 | Warning |
| blue-700 | --ds-blue-700 | #0070F3 | Info/accent |

### Typography Classes
- **Headings:** `text-heading-{72|64|56|48|40|32|24|20|16|14}` (semibold, tight tracking)
- **Labels:** `text-label-{20|18|16|14|13|12}[-mono]` (normal weight)
- **Copy:** `text-copy-{24|20|18|16|14|13}[-mono]` (normal weight)

### Spacing (4px base)
- `space-2`: 8px | `space-4`: 16px | `space-6`: 24px | `space-8`: 32px

## Animation Utilities

Use spring-based animations for Geist's smooth aesthetic:

```typescript
import { spring, interpolate } from 'remotion';

// Fade in with delay
export function fadeIn(frame: number, fps: number, delay = 0, duration = 0.4) {
  const delayFrames = delay * fps;
  const durationFrames = duration * fps;
  return interpolate(frame, [delayFrames, delayFrames + durationFrames], [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
}

// Spring scale
export function springIn(frame: number, fps: number, delay = 0) {
  return spring({ frame: frame - delay * fps, fps, config: { damping: 200 } });
}
```

## Scene Structure Pattern

```tsx
export function MyScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = fadeIn(frame, fps, 0, 0.4);
  const titleScale = springIn(frame, fps, 0);

  return (
    <AbsoluteFill className="bg-background-100 flex flex-col items-center justify-center">
      <h2 style={{ opacity: titleOpacity, transform: `scale(${titleScale})` }}>
        Title
      </h2>
    </AbsoluteFill>
  );
}
```

## Key Principles

1. **NEVER use emojis** - Import icons from `@geist-ui/icons` (e.g., `import { Code, Folder, Check } from '@geist-ui/icons'`)
2. **Success = Green** - Geist uses green for success states (--ds-green-700)
3. **Borders = gray-400** - Default border color (--ds-gray-400)
4. **Inputs use bg-100** - Primary background, not secondary
5. **Spring animations** - Smooth, damped motion (damping: 200)
6. **Tight letter-spacing** - Headings have negative tracking
7. **Use official brand assets** - Download logos from official sources (see references/geist-icons.md)

## References

- `references/project-setup.md` - Complete file templates
- `references/geist-icons.md` - **Icons and brand assets (MUST READ)**
- `references/code-blocks.md` - **Syntax-highlighted code blocks (use prism-react-renderer)**
- `references/geist-colors.md` - Full 10-step color scale
- `references/geist-typography.md` - All typography classes with specs
- `references/geist-components.md` - Component props and patterns
- `references/scene-patterns.md` - Scene templates for common content
- `references/storyboard-template.md` - Planning video structure

## Font Loading (jsDelivr CDN)

```css
@font-face {
  font-family: 'Geist';
  src: url('https://cdn.jsdelivr.net/npm/geist@1.5.1/dist/fonts/geist-sans/Geist-Regular.woff2') format('woff2');
  font-weight: 400;
}
/* Add Medium (500), SemiBold (600), Bold (700) weights */
```
