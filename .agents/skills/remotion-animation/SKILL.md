---
name: remotion-animation
description: Generates animation configurations for Remotion including spring configs, interpolations, easing functions, and timing logic. Focuses ONLY on animation parameters, NOT component implementation. Use when defining animation behavior or when asked to "configure animations", "setup spring configs", "define easing curves".
---

# Remotion Animation

Generates animation configuration documents that define spring behaviors, interpolation mappings, easing curves, and timing constants for Remotion videos. This skill focuses exclusively on animation parameters and does NOT generate component code.

## What This Skill Does

Generates animation configurations for:

1. **Spring configs** — Damping, stiffness, mass parameters for spring animations
2. **Interpolation mappings** — Input/output ranges for value transformations
3. **Easing functions** — Timing function configurations
4. **Animation timing** — Stagger delays, durations, transition points
5. **Progress calculations** — Frame-based animation progress logic

## Scope Boundaries

**IN SCOPE:**
- Spring configuration parameters
- Interpolation input/output ranges
- Easing curve definitions
- Animation timing constants
- Progress calculation patterns

**OUT OF SCOPE:**
- Component implementation (use `/remotion-component-gen`)
- Scene layout (use `/remotion-composition`)
- Visual styling (colors, fonts, layout)
- Asset management (use `/remotion-asset-coordinator`)

## Input/Output Formats

### Input Format: Animation Requirements

Accepts animation specifications from natural language or motion specs:

**From Natural Language:**
```
Create smooth entrance animations with gentle bounce for logo.
Scale from 0.8 to 1.0 over 30 frames.
Stagger text words with 5 frame delay between each.
```

**From Motion Spec:**
```markdown
## Scene 1 Animation Details

**Logo Entrance:**
- Spring animation: Scale 0.8 → 1.0
- Timing: Frames 0-30
- Config: Smooth with slight bounce (damping: 180)
- Opacity: 0 → 1 (linear)

**Text Stagger:**
- Word-by-word reveal
- Stagger delay: 5 frames
- Individual word animation: 15 frames
- Spring config: Snappy (damping: 20, stiffness: 200)
```

### Output Format: ANIMATION_CONFIG.md

Generates a configuration document with all animation parameters:

```markdown
# Animation Configuration: ProductDemo

## Status
✅ Animation parameters defined
⏳ Ready for implementation in components

## Spring Configurations

```typescript
export const SPRING_CONFIGS = {
  // Smooth, elegant entrance - minimal bounce
  smooth: {
    damping: 200,
    mass: 1,
    stiffness: 100,
  },

  // Snappy, responsive - quick settle
  snappy: {
    damping: 20,
    stiffness: 200,
    mass: 0.5,
  },

  // Bouncy, playful - noticeable oscillation
  bouncy: {
    damping: 8,
    mass: 1,
    stiffness: 100,
  },

  // Gentle, soft - slow and smooth
  gentle: {
    damping: 30,
    stiffness: 80,
    mass: 1,
  },
} as const;
```

## Interpolation Mappings

```typescript
export const INTERPOLATIONS = {
  // Logo scale animation
  logoScale: {
    input: [0, 1],      // Progress from spring (0 to 1)
    output: [0.8, 1],   // Scale value (0.8 to 1.0)
    extrapolate: 'clamp',
  },

  // Text slide-in
  textSlide: {
    input: [0, 1],
    output: [-50, 0],   // Translate X from -50px to 0
    extrapolate: 'clamp',
  },

  // Fade effect
  fade: {
    input: [0, 1],
    output: [0, 1],     // Opacity 0 to 1
    extrapolate: 'clamp',
  },
} as const;
```

## Animation Timing

```typescript
export const ANIMATION_TIMING = {
  // Global timing constants
  fps: 30,

  // Stagger animations
  stagger: {
    textWords: 5,         // Frame delay between words
    listItems: 3,         // Frame delay between list items
    cards: 8,             // Frame delay between card reveals
  },

  // Durations
  durations: {
    fadeIn: 15,           // Frames for fade in
    fadeOut: 10,          // Frames for fade out
    hold: 30,             // Frames to hold on screen
    quickTransition: 5,   // Frames for quick change
  },

  // Scene-specific timing
  scene1: {
    logoEnter: { start: 0, end: 30 },
    textReveal: { start: 20, end: 60 },
  },

  scene2: {
    contentFadeIn: { start: 0, end: 20 },
    bulletStagger: { start: 25, delay: 8 },
  },
} as const;
```

## Easing Functions

```typescript
export const EASING = {
  // Standard easing curves
  easeInOut: (t: number) =>
    t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,

  easeOut: (t: number) =>
    t * (2 - t),

  easeIn: (t: number) =>
    t * t,

  // Cubic bezier approximations
  cubicBezier: {
    ease: [0.25, 0.1, 0.25, 1],
    easeIn: [0.42, 0, 1, 1],
    easeOut: [0, 0, 0.58, 1],
    easeInOut: [0.42, 0, 0.58, 1],
  },
} as const;
```

## Progress Calculation Patterns

```typescript
// Pattern 1: Simple spring progress
const logoProgress = spring({
  frame,
  fps,
  config: SPRING_CONFIGS.smooth,
});

// Pattern 2: Delayed spring (for stagger)
const itemProgress = spring({
  frame: frame - (index * ANIMATION_TIMING.stagger.textWords),
  fps,
  config: SPRING_CONFIGS.snappy,
});

// Pattern 3: Frame-based linear progress
const linearProgress = interpolate(
  frame,
  [startFrame, endFrame],
  [0, 1],
  { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
);

// Pattern 4: Eased progress
const easedProgress = EASING.easeOut(linearProgress);

// Pattern 5: Looping animation
const loopProgress = (frame % loopDuration) / loopDuration;
```

## Usage Examples

### Implementing in Components

```typescript
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { SPRING_CONFIGS, INTERPOLATIONS, ANIMATION_TIMING } from '../constants';

// In component:
const frame = useCurrentFrame();
const { fps } = useVideoConfig();

// Apply spring animation
const logoProgress = spring({
  frame,
  fps,
  config: SPRING_CONFIGS.smooth,
});

// Apply interpolation
const scale = interpolate(
  logoProgress,
  INTERPOLATIONS.logoScale.input,
  INTERPOLATIONS.logoScale.output
);

const opacity = logoProgress; // Direct 0-1 progress

// Use in styles
<div style={{
  transform: `scale(${scale})`,
  opacity,
}} />
```

## Next Steps

1. **Integrate into constants.ts** in composition folder
2. **Use in component implementation** via `/remotion-component-gen`
3. **Test animation feel** in Remotion preview
4. **Adjust parameters** if timing feels off
5. **Document final values** for consistency

## Checklist

- [x] Spring configs defined
- [x] Interpolation ranges specified
- [x] Timing constants calculated
- [x] Progress patterns documented
- [ ] Integrated into components (next step)
- [ ] Tested in preview (next step)
```

## Animation Patterns

### Pattern 1: Entrance Animation

Spring-based entrance with scale and opacity:

```typescript
const entranceProgress = spring({
  frame,
  fps,
  config: { damping: 200 },
});

const scale = interpolate(entranceProgress, [0, 1], [0.8, 1]);
const opacity = entranceProgress;
const translateY = interpolate(entranceProgress, [0, 1], [20, 0]);
```

### Pattern 2: Staggered Reveal

Multiple items animating with delay:

```typescript
const items = ['Item 1', 'Item 2', 'Item 3'];
const STAGGER_DELAY = 5;

items.map((item, index) => {
  const itemProgress = spring({
    frame: frame - (index * STAGGER_DELAY),
    fps,
    config: SPRING_CONFIGS.snappy,
  });

  return (
    <div style={{ opacity: itemProgress }}>
      {item}
    </div>
  );
});
```

### Pattern 3: Transition Between States

Smooth transition using frame ranges:

```typescript
const transitionProgress = interpolate(
  frame,
  [startFrame, endFrame],
  [0, 1],
  { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
);

// State A → State B
const value = interpolate(
  transitionProgress,
  [0, 1],
  [stateAValue, stateBValue]
);
```

### Pattern 4: Looping Animation

Continuous cycling animation:

```typescript
const LOOP_DURATION = 60; // frames
const loopProgress = (frame % LOOP_DURATION) / LOOP_DURATION;

const rotation = loopProgress * 360; // 0 to 360 degrees
const pulse = Math.sin(loopProgress * Math.PI * 2) * 0.1 + 1; // 0.9 to 1.1
```

### Pattern 5: Overshoot and Settle

Spring with intentional overshoot:

```typescript
const overshootProgress = spring({
  frame,
  fps,
  config: {
    damping: 10,    // Low damping = more bounce
    stiffness: 100,
  },
});

const scale = interpolate(overshootProgress, [0, 1], [0, 1.2]); // Overshoots to 1.2
```

## Spring Configuration Guide

### Damping Parameter

Controls how quickly oscillation stops:

```typescript
// High damping (200+) - Smooth, minimal/no bounce
damping: 200  // → Smooth entrance, elegant

// Medium damping (20-80) - Visible bounce, quick settle
damping: 40   // → Snappy, responsive

// Low damping (8-15) - Strong bounce, playful
damping: 10   // → Bouncy, fun

// Very low damping (2-5) - Extreme bounce
damping: 5    // → Jello-like
```

### Stiffness Parameter

Controls animation speed:

```typescript
// High stiffness (200+) - Fast animation
stiffness: 300  // → Quick, snappy

// Medium stiffness (80-150) - Standard speed
stiffness: 100  // → Balanced

// Low stiffness (30-60) - Slow animation
stiffness: 50   // → Gentle, relaxed
```

### Mass Parameter

Controls inertia and weight:

```typescript
// Light mass (0.5) - Responsive, quick
mass: 0.5  // → Featherlight

// Standard mass (1) - Balanced
mass: 1    // → Normal weight

// Heavy mass (2+) - Sluggish, weighty
mass: 2    // → Heavy, substantial
```

## Easing Function Reference

Standard easing curves:

```typescript
// Linear - Constant speed
easeLinear: (t) => t

// Ease Out - Fast start, slow end (most common)
easeOut: (t) => t * (2 - t)

// Ease In - Slow start, fast end
easeIn: (t) => t * t

// Ease In-Out - Slow start and end, fast middle
easeInOut: (t) => t < 0.5 ? 2*t*t : -1+(4-2*t)*t

// Ease Out Cubic - Smooth deceleration
easeOutCubic: (t) => (--t)*t*t + 1

// Ease In Cubic - Smooth acceleration
easeInCubic: (t) => t*t*t
```

## Frame Calculation Helpers

Common frame calculations:

```typescript
// Convert seconds to frames
const secondsToFrames = (seconds: number, fps: number) => seconds * fps;

// Calculate stagger frame offset
const staggerFrame = (index: number, delay: number, startFrame: number = 0) =>
  startFrame + (index * delay);

// Calculate animation end frame
const endFrame = (startFrame: number, durationFrames: number) =>
  startFrame + durationFrames;

// Check if animation is active
const isActive = (frame: number, start: number, end: number) =>
  frame >= start && frame <= end;

// Get progress within range
const rangeProgress = (frame: number, start: number, end: number) =>
  Math.max(0, Math.min(1, (frame - start) / (end - start)));
```

## Integration Workflow

1. **Generate animation config** using this skill → ANIMATION_CONFIG.md
2. **Add to constants.ts** in composition folder
3. **Reference in components** during implementation
4. **Test in preview** and adjust parameters
5. **Document any changes** back to config

## Common Animation Combinations

### Logo Entrance (Smooth + Scale + Fade)

```typescript
config: { damping: 200 }
scale: [0.8, 1]
opacity: [0, 1]
translateY: [20, 0]
```

### Text Reveal (Stagger + Slide + Fade)

```typescript
config: { damping: 20, stiffness: 200 }
staggerDelay: 5 frames
translateX: [-30, 0]
opacity: [0, 1]
```

### Button Pulse (Loop + Scale)

```typescript
loopDuration: 60 frames
scale: [1, 1.05, 1]
easing: easeInOut
```

### Page Transition (Fade + Slide)

```typescript
duration: 15 frames
opacity: [1, 0] (out), [0, 1] (in)
translateX: [0, -100] (out), [100, 0] (in)
```

## Timing Best Practices

Recommended timing ranges for different animation types:

```typescript
// Micro-interactions
button hover: 5-10 frames
tooltip appear: 8-12 frames

// Standard animations
fade in/out: 10-20 frames
slide in/out: 15-25 frames
scale entrance: 20-30 frames

// Stagger delays
individual items: 3-8 frames
word-by-word: 4-6 frames
large groups: 2-4 frames

// Hold durations
text on screen: 60-120 frames (2-4 seconds)
quick message: 30-60 frames (1-2 seconds)
```

## Integration with Other Skills

This skill feeds into:

```
remotion-animation (this skill)
    ↓ outputs: ANIMATION_CONFIG.md
remotion-component-gen
    ↓ applies animation configs in components
remotion-composition
    ↓ coordinates timing across scenes
```

**Works with:**
- `/motion-designer` — Animation specs from design documents
- `/remotion-scaffold` — Configs go into constants.ts
- `/remotion-component-gen` — Components apply these configs
- `/remotion-composition` — Timing coordinates with Sequence layout
- `/remotion-spec-translator` — Orchestrates this skill when translating specs

---

This skill provides precise animation parameter definitions that ensure consistent, production-quality motion across Remotion video projects.
