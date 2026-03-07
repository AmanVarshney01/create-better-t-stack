---
name: scene-structure
description: Scene composition patterns for product launch videos
---

# Scene Structure

## The 3-Act Structure

Every effective product video follows this pattern:

```
┌─────────────────────────────────────────────────────┐
│  Act 1: HOOK        Act 2: VALUE       Act 3: CTA   │
│  (20% of time)      (60% of time)      (20% of time)│
│                                                      │
│  "What is this?"    "Why should I     "How do I     │
│                      care?"            get it?"      │
└─────────────────────────────────────────────────────┘
```

## Scene Templates

### Template A: Hero Layout (15 seconds)

Best for: Simple apps, single-feature products

```
[0-5s]  INTRO
        ├── Product name (large, center)
        ├── One-line tagline (smaller, below)
        └── Device mockup fades in from bottom

[5-12s] FEATURE
        ├── Mockup moves to side
        ├── 2-3 feature points appear
        └── Each point with icon/number

[12-15s] CTA
        ├── Mockup fades out
        ├── "Try it free" or similar
        └── URL prominently displayed
```

### Template B: Split Screen (30 seconds)

Best for: Feature-rich products, comparisons

```
[0-5s]  INTRO
        ├── Left: Text content
        └── Right: Device mockup

[5-20s] FEATURES (3 scenes, ~5s each)
        ├── Scene 1: Feature A
        │   ├── Left: Feature title + description
        │   └── Right: Relevant screenshot
        ├── Scene 2: Feature B
        └── Scene 3: Feature C

[20-25s] SOCIAL PROOF (optional)
        ├── User count / reviews
        └── Trust badges

[25-30s] CTA
        ├── Center: Product name
        ├── Tagline
        └── URL + optional QR code
```

### Template C: Full Screen Showcase (45 seconds)

Best for: Visual products (design tools, photo apps)

```
[0-8s]  HOOK
        ├── Problem statement or question
        └── Device mockup with "before" state

[8-35s] SHOWCASE
        ├── Multiple screenshots
        ├── Smooth transitions between screens
        └── Minimal text overlay

[35-40s] BENEFITS
        ├── 3 key benefits, quick succession
        └── Icons + short text

[40-45s] CTA
        ├── Logo
        ├── "Start creating today"
        └── URL
```

## Scene Timing Guidelines

```
Element              Duration
─────────────────────────────
Logo reveal          1-2 seconds
Text fade in         0.5-0.7 seconds
Text hold (reading)  2-3 seconds minimum
Screenshot hold      3-5 seconds
Transition           0.5-1 second
CTA hold             3-5 seconds
```

## Transition Patterns

### Recommended
```tsx
// Fade (default, professional)
<TransitionSeries.Transition
  presentation={fade()}
  timing={linearTiming({ durationInFrames: 15 })}
/>

// Slide (for progressive reveal)
<TransitionSeries.Transition
  presentation={slide({ direction: "from-right" })}
  timing={linearTiming({ durationInFrames: 20 })}
/>
```

### Avoid
- Wipe transitions
- 3D flips
- Zoom bursts
- Any "creative" transitions

## Content Per Scene

**Maximum elements per scene:**
- 1 headline
- 1 supporting line
- 1 visual element (mockup/screenshot)
- 1 accent element (icon, badge, etc.)

**If you need more, split into multiple scenes.**

## Pacing Rules

```
Fast pacing (social media): 2-3 seconds per scene
Normal pacing (website):    4-5 seconds per scene
Slow pacing (presentation): 6-8 seconds per scene
```

## Scene Code Structure

```tsx
// Each scene is a self-contained component
const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene-specific animations
  const titleOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a" }}>
      {/* Scene content */}
    </AbsoluteFill>
  );
};
```
