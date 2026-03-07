---
name: animation-patterns
description: Motion design patterns for professional product videos
---

# Animation Patterns

## The Golden Rule

**Subtle > Flashy**

Professional videos use motion to guide attention, not to impress. If the animation is noticeable, it's probably too much.

## Core Animation Library

### Fade In (Default)

The most versatile animation. Use for text and UI elements.

```tsx
const FadeIn: React.FC<{
  children: React.ReactNode;
  delay?: number;
  duration?: number;
}> = ({ children, delay = 0, duration = 20 }) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(
    frame - delay,
    [0, duration],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const translateY = interpolate(
    frame - delay,
    [0, duration],
    [20, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div style={{ opacity, transform: `translateY(${translateY}px)` }}>
      {children}
    </div>
  );
};
```

### Slide In (For Mockups)

Use for device mockups entering the scene.

```tsx
const SlideIn: React.FC<{
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
}> = ({ children, direction = "up", delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 20, stiffness: 80 },
  });

  const transforms = {
    up: `translateY(${interpolate(progress, [0, 1], [100, 0])}px)`,
    down: `translateY(${interpolate(progress, [0, 1], [-100, 0])}px)`,
    left: `translateX(${interpolate(progress, [0, 1], [100, 0])}px)`,
    right: `translateX(${interpolate(progress, [0, 1], [-100, 0])}px)`,
  };

  const opacity = interpolate(progress, [0, 0.3], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div style={{ opacity, transform: transforms[direction] }}>
      {children}
    </div>
  );
};
```

### Scale In (For Emphasis)

Use sparingly for key moments.

```tsx
const ScaleIn: React.FC<{
  children: React.ReactNode;
  delay?: number;
}> = ({ children, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  const scale = interpolate(progress, [0, 1], [0.9, 1]);
  const opacity = interpolate(progress, [0, 0.5], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div style={{ opacity, transform: `scale(${scale})` }}>
      {children}
    </div>
  );
};
```

## Easing Reference

### For UI Elements (Text, Cards)
```tsx
import { Easing } from "remotion";

// Smooth deceleration
easing: Easing.out(Easing.quad)

// Usage
const opacity = interpolate(frame, [0, 20], [0, 1], {
  easing: Easing.out(Easing.quad),
});
```

### For Physical Objects (Mockups)
```tsx
// Spring physics
const progress = spring({
  frame,
  fps,
  config: {
    damping: 20,    // Higher = less bounce
    stiffness: 80,  // Higher = faster
  },
});
```

## Timing Cheat Sheet

```
Animation Type     Duration (frames @30fps)
─────────────────────────────────────────────
Text fade in       15-20 frames (0.5-0.7s)
Mockup slide in    25-30 frames (0.8-1.0s)
Scene transition   15-20 frames (0.5-0.7s)
Subtle float       Continuous, 3-5px range
Button pulse       Continuous, 2% scale range
```

## Continuous Animations

### Floating Effect

For device mockups that stay on screen:

```tsx
const floatY = Math.sin(frame / 20) * 5; // 5px up/down

<div style={{ transform: `translateY(${floatY}px)` }}>
  <PhoneMockup>...</PhoneMockup>
</div>
```

### Subtle Pulse

For CTAs:

```tsx
const pulse = 1 + Math.sin(frame / 10) * 0.02; // 2% scale

<div style={{ transform: `scale(${pulse})` }}>
  <UrlButton url="..." />
</div>
```

## Staggered Animations

For lists or multiple elements:

```tsx
const items = ["Feature 1", "Feature 2", "Feature 3"];

{items.map((item, index) => (
  <FadeIn key={item} delay={index * 15}>
    <FeatureItem {...} />
  </FadeIn>
))}
```

## Animation Don'ts

| Don't | Why | Do Instead |
|-------|-----|------------|
| Bounce animations | Looks playful, not professional | Use smooth easing |
| Rotation effects | Distracting | Keep elements stable |
| Elastic springs | Too bouncy | Use damping: 15-20 |
| Fast animations | Hard to follow | Min 0.3s duration |
| Multiple concurrent | Overwhelming | Stagger or sequence |
| Looping animations | Distracting during reading | Use only on non-text |

## Scene Transitions

### Recommended: Fade

```tsx
import { fade } from "@remotion/transitions/fade";

<TransitionSeries.Transition
  presentation={fade()}
  timing={linearTiming({ durationInFrames: 15 })}
/>
```

### Alternative: Slide

```tsx
import { slide } from "@remotion/transitions/slide";

<TransitionSeries.Transition
  presentation={slide({ direction: "from-right" })}
  timing={linearTiming({ durationInFrames: 20 })}
/>
```

## Performance Tips

```tsx
// Use transform instead of top/left
transform: `translateY(${y}px)` // Good
top: y // Bad

// Use opacity for visibility
opacity: progress // Good
display: progress > 0 ? "block" : "none" // Bad for animation

// Avoid re-renders
const MemoizedComponent = React.memo(MyComponent);
```
