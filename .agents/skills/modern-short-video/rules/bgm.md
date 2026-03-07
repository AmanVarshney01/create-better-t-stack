---
name: bgm
description: Background music guidelines for product videos
---

# BGM (Background Music)

## Source

Use [Pixabay Music](https://pixabay.com/music/) only.
- Free, no credit required, commercial OK

**Recommended Searches:**
- [Product Launch](https://pixabay.com/music/search/product%20launch/)
- [Corporate Technology](https://pixabay.com/music/search/corporate%20technology/)
- [Startup Launch](https://pixabay.com/music/search/startup%20launch/)

## Adding BGM

Place audio file in `public/` folder as `bgm.mp3`.

### Basic Usage

```tsx
import { Audio, staticFile } from "remotion";

<Audio src={staticFile("bgm.mp3")} volume={0.25} />
```

### With Fade Out (Recommended)

Fade out BGM during the last 2 seconds for a professional finish:

```tsx
import { Audio, staticFile, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

const frame = useCurrentFrame();
const { durationInFrames } = useVideoConfig();

// Fade out during last 2 seconds (60 frames at 30fps)
const volume = interpolate(
  frame,
  [durationInFrames - 60, durationInFrames],
  [0.25, 0],
  { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
);

<Audio src={staticFile("bgm.mp3")} volume={volume} />
```

## Volume Guidelines

| Volume | Use Case |
|--------|----------|
| 0.1-0.2 | Very quiet, almost ambient |
| **0.2-0.3** | **Recommended for product videos** |
| 0.4-0.5 | More prominent, for energetic videos |
