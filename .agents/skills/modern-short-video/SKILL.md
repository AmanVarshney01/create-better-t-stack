---
name: modern-short-video
description: Create modern product launch/pitch videos using Remotion. Use when creating app promo videos, SaaS launch videos, product demos, or startup pitch videos.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, WebFetch, AskUserQuestion
---

# Modern Short Video Skill

Create professional, modern product launch videos using Remotion and React.

## Prerequisites (MANDATORY)

> **WARNING**: Do NOT skip this step. Skipping will result in missing rich expression opportunities.

This skill extends Remotion best practices. **You MUST do both:**

1. **Load the skill first:**
   ```
   /remotion-best-practices
   ```

2. **Read the SKILL.md** of remotion-best-practices and identify which rules are relevant to the product (maps, charts, text animations, 3D, lottie, etc.)

## Workflow

### Step 1: Analyze Product & Select Rich Expressions (CRITICAL)

**Before asking for screenshots**, analyze the product and find relevant rich expressions from remotion-best-practices.

Replace static screenshots with dynamic content wherever possible:
- Map app → animated map with route drawing
- Dashboard → animated charts
- Text app → typewriter effects
- etc.

Read the relevant rule files from remotion-best-practices and use them.

### Step 2: Device, Theme & BGM Questions

**Use `AskUserQuestion` to ask:**

1. **Device Type**: Is the product primarily for smartphone (SP) or PC/Desktop?
   - SP (Smartphone) → Use phone mockup frame
   - PC/Desktop → Use browser/desktop mockup frame

2. **Screenshot Theme**: Should screenshots be in Light mode or Dark mode?
   - Dark mode (Recommended) → Blends with video background (#0a0a0a)
   - Light mode → Higher contrast, screenshots stand out more

3. **BGM (Background Music)**: Add background music?
   - Yes (Recommended) → Download free music from Pixabay
   - No → Create video without BGM

### Step 3: Collect Screenshots

> **Note**: Screenshots for scenes using rich expressions (Step 1) are not needed.

Required images (place in `public/` folder):

| File | Purpose | Required |
|------|---------|----------|
| `mockup.png` | Main product screenshot (Mockups scene) | Yes |
| `feature-1.png` | Feature 1 screenshot | Yes |
| `feature-2.png` | Feature 2 screenshot | Optional |
| `feature-3.png` | Feature 3 screenshot | Optional |

### Step 4: Collect Content

Required information:
- Product name
- One-line tagline/concept
- Feature 1: Title + short description
- Feature 2: Title + short description (optional)
- Feature 3: Title + short description (optional)
- CTA text (e.g., "Try it free")
- URL

### Step 5: Verify Assets

```bash
ls public/*.png
```

### Step 6: Create Composition

Create `src/remotion/[ProductName]/[ProductName]Intro.tsx` with all scenes.

### Step 7: Register & Calculate Duration

Add to `Root.tsx`. **IMPORTANT**: Calculate `durationInFrames` correctly:

```
durationInFrames = Sum of scene durations - (transition duration × number of transitions)
```

See [rules/duration-calculation.md](rules/duration-calculation.md) for details.

### Step 8: Test

Run `pnpm run dev` (or `bun run remotion`) and preview the video.

## Scene Structure (8 Scenes)

```
┌─────────────────────────────────────────────────────────────┐
│  1. REVEAL     2. CONCEPT    3. MOCKUPS                     │
│  (2-3s)        (3-4s)        (3-4s)                         │
│  Logo/Name     Value prop    Product preview                │
├─────────────────────────────────────────────────────────────┤
│  4. FEATURE 1  5. FEATURE 2  6. FEATURE 3                   │
│  (3-4s each)   (optional)    (optional)                     │
│  Screenshot +  Screenshot +  Screenshot +                   │
│  Title/Desc    Title/Desc    Title/Desc                     │
├─────────────────────────────────────────────────────────────┤
│  7. OUTRO      8. CTA                                       │
│  (2-3s)        (3-4s)                                       │
│  Summary       URL + Action                                 │
└─────────────────────────────────────────────────────────────┘
```

### Scene Details

| Scene | Duration | Content | Asset |
|-------|----------|---------|-------|
| 1. Reveal | 2-3s | Product name, minimal animation | - |
| 2. Concept | 3-4s | Tagline, value proposition | - |
| 3. Mockups | 3-4s | Device mockup with main screenshot | `mockup.png` or rich expression |
| 4. Feature 1 | 3-4s | Feature title + screenshot | `feature-1.png` or rich expression |
| 5. Feature 2 | 3-4s | Feature title + screenshot | `feature-2.png` or rich expression |
| 6. Feature 3 | 3-4s | Feature title + screenshot | `feature-3.png` or rich expression |
| 7. Outro | 2-3s | Product name + summary | - |
| 8. CTA | 3-4s | URL, call to action | - |

**Total Duration**: 15-25 seconds (depending on feature count)

## Design Rules

| Element | Do | Don't |
|---------|-----|-------|
| Background | Solid dark `#0a0a0a` | Gradients |
| Typography | Single font (Inter/Noto Sans JP) | Multiple fonts |
| Animation | Subtle fade/slide | Bouncy/flashy |
| Mockups | Real screenshots or rich expressions | Placeholder graphics |
| Text | Minimal, clear | Long paragraphs |

## Detailed Guidelines

For comprehensive guidance, read these rule files:

- [rules/design-principles.md](rules/design-principles.md) - Visual design system
- [rules/scene-structure.md](rules/scene-structure.md) - Scene composition patterns
- [rules/visual-elements.md](rules/visual-elements.md) - Mockups, typography, colors
- [rules/animation-patterns.md](rules/animation-patterns.md) - Motion design patterns
- [rules/code-templates.md](rules/code-templates.md) - Ready-to-use Remotion components
- [rules/duration-calculation.md](rules/duration-calculation.md) - How to calculate total video duration
- [rules/bgm.md](rules/bgm.md) - Background music source and implementation

## Quick Reference: Scene Components

```tsx
// Scene order
<TransitionSeries>
  <RevealScene />      {/* 1. Logo/Name */}
  <ConceptScene />     {/* 2. Value proposition */}
  <MockupsScene />     {/* 3. Main product mockup */}
  <FeatureScene n={1} /> {/* 4. Feature 1 */}
  <FeatureScene n={2} /> {/* 5. Feature 2 (if provided) */}
  <FeatureScene n={3} /> {/* 6. Feature 3 (if provided) */}
  <OutroScene />       {/* 7. Summary */}
  <CTAScene />         {/* 8. Call to action */}
</TransitionSeries>
```

## Checklist Before Delivery

- [ ] **Prerequisites loaded** (`/remotion-best-practices` executed and relevant rules read)
- [ ] **Rich expressions used** where applicable (maps, charts, text animations, etc.)
- [ ] Screenshots collected for scenes not using rich expressions
- [ ] Screenshots are high quality (2x resolution preferred)
- [ ] Text is readable at 720p
- [ ] Total duration 15-25 seconds
- [ ] **durationInFrames correctly calculated** (subtract transition overlaps!)
- [ ] **No black frames at the end of video**
- [ ] Transitions are smooth (fade, 15 frames)
- [ ] CTA and URL clearly visible
- [ ] BGM added (optional, volume ~0.25)
