---
name: duration-calculation
description: How to calculate total video duration with TransitionSeries
---

# Duration Calculation

## The Problem

When using `TransitionSeries`, transitions **overlap** between scenes. This means the total video duration is NOT simply the sum of all scene durations.

If you set `durationInFrames` too high, you'll get **black frames at the end**.

## Formula

```
Total Duration = Sum of Scene Durations - (Transition Duration × Number of Transitions)
```

Or more simply:

```
Total Duration = Sum of Scene Durations - Total Overlap
```

## Calculation Example

For an 8-scene video:

### Scene Durations (at 30fps)

| Scene | Seconds | Frames |
|-------|---------|--------|
| 1. Reveal | 2.5s | 75 |
| 2. Concept | 3.0s | 90 |
| 3. Mockups | 3.0s | 90 |
| 4. Feature 1 | 3.0s | 90 |
| 5. Feature 2 | 3.0s | 90 |
| 6. Feature 3 | 3.0s | 90 |
| 7. Outro | 2.5s | 75 |
| 8. CTA | 3.0s | 90 |
| **Total** | **23s** | **690** |

### Transitions

- Number of transitions: 7 (between each scene)
- Transition duration: 15 frames each
- Total overlap: 15 × 7 = **105 frames**

### Final Calculation

```
690 - 105 = 585 frames (19.5 seconds)
```

## Quick Reference Table

| Scenes | Transitions | Overlap (15f each) |
|--------|-------------|-------------------|
| 3 | 2 | -30 frames |
| 4 | 3 | -45 frames |
| 5 | 4 | -60 frames |
| 6 | 5 | -75 frames |
| 7 | 6 | -90 frames |
| 8 | 7 | -105 frames |

## Code Example

```tsx
// In Root.tsx
const SCENE_FRAMES = {
  reveal: 2.5 * 30,     // 75
  concept: 3 * 30,      // 90
  mockups: 3 * 30,      // 90
  feature1: 3 * 30,     // 90
  feature2: 3 * 30,     // 90
  feature3: 3 * 30,     // 90
  outro: 2.5 * 30,      // 75
  cta: 3 * 30,          // 90
};

const TRANSITION_DURATION = 15;
const NUM_TRANSITIONS = 7;

const totalSceneFrames = Object.values(SCENE_FRAMES).reduce((a, b) => a + b, 0);
const totalOverlap = TRANSITION_DURATION * NUM_TRANSITIONS;
const durationInFrames = totalSceneFrames - totalOverlap;

<Composition
  id="MyVideo"
  component={MyVideo}
  durationInFrames={durationInFrames}  // 585
  fps={30}
  width={1280}
  height={720}
/>
```

## Helper Function

Add this to your project for automatic calculation:

```tsx
function calculateDuration(
  sceneDurations: number[],
  transitionDuration: number = 15
): number {
  const totalScenes = sceneDurations.reduce((a, b) => a + b, 0);
  const numTransitions = sceneDurations.length - 1;
  const totalOverlap = transitionDuration * numTransitions;
  return totalScenes - totalOverlap;
}

// Usage
const duration = calculateDuration([75, 90, 90, 90, 90, 90, 75, 90]);
// Returns: 585
```

## Common Mistakes

| Mistake | Result | Fix |
|---------|--------|-----|
| Using sum of scene durations | Black frames at end | Subtract transition overlaps |
| Forgetting a transition | Duration too short | Count all transitions |
| Wrong transition duration | Off by a few frames | Use consistent 15f transitions |

## Verification

After setting duration, always preview the video and check:
1. Does the last scene (CTA) end cleanly?
2. Are there any black frames after the content?
3. Does the BGM fade out properly at the end?
