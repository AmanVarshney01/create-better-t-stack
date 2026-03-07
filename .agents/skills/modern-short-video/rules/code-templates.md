---
name: code-templates
description: Ready-to-use Remotion component templates for product videos
---

# Code Templates

Complete, copy-paste ready templates following the 8-scene structure:
**Reveal → Concept → Mockups → Features (1-3) → Outro → CTA**

## Important: TransitionSeries Rules

**CRITICAL**: `TransitionSeries.Transition` components must NOT be consecutive. Always place a `TransitionSeries.Sequence` between transitions.

```tsx
// ❌ BAD - Consecutive transitions cause runtime error
<TransitionSeries.Transition ... />
<TransitionSeries.Transition ... />

// ✅ GOOD - Sequence between transitions
<TransitionSeries.Transition ... />
<TransitionSeries.Sequence>...</TransitionSeries.Sequence>
<TransitionSeries.Transition ... />
```

When using `.map()` with features, use `React.Fragment` (not `<>`) to properly set keys:

## Full Video Template

### Main Composition File

`src/remotion/[ProductName]/[ProductName]Intro.tsx`

```tsx
import React from "react";
import {
  AbsoluteFill,
  Img,
  staticFile,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { loadFont, fontFamily } from "@remotion/google-fonts/Inter";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";

loadFont("normal", {
  weights: ["400", "500", "700"],
});

const FPS = 30;

// ============================================
// CONFIGURATION - Edit these values
// ============================================

const CONFIG = {
  productName: "ProductName",
  tagline: "Your one-line value proposition here",
  features: [
    {
      title: "Feature One",
      description: "Short description of the first feature",
      image: "feature-1.png",
    },
    {
      title: "Feature Two",
      description: "Short description of the second feature",
      image: "feature-2.png",
    },
    // Add or remove features as needed (max 3)
  ],
  cta: "Try it free",
  url: "yourapp.com",
  mockupImage: "mockup.png",
};

// ============================================
// SHARED COMPONENTS
// ============================================

const PhoneMockup: React.FC<{
  children: React.ReactNode;
  scale?: number;
}> = ({ children, scale = 1 }) => (
  <div
    style={{
      transform: `scale(${scale})`,
      position: "relative",
      width: 280,
      height: 580,
      borderRadius: 40,
      backgroundColor: "#000",
      padding: 8,
      boxShadow: "0 50px 100px rgba(0,0,0,0.4)",
    }}
  >
    <div
      style={{
        position: "absolute",
        top: 12,
        left: "50%",
        transform: "translateX(-50%)",
        width: 100,
        height: 28,
        backgroundColor: "#000",
        borderRadius: 20,
        zIndex: 10,
      }}
    />
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: 32,
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  </div>
);

const FadeIn: React.FC<{
  children: React.ReactNode;
  delay?: number;
  duration?: number;
}> = ({ children, delay = 0, duration = 20 }) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame - delay, [0, duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  const translateY = interpolate(frame - delay, [0, duration], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  return (
    <div style={{ opacity, transform: `translateY(${translateY}px)` }}>
      {children}
    </div>
  );
};

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

  const scale = interpolate(progress, [0, 1], [0.8, 1]);
  const opacity = interpolate(progress, [0, 0.5], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div style={{ opacity, transform: `scale(${scale})` }}>
      {children}
    </div>
  );
};

// ============================================
// SCENE 1: REVEAL
// ============================================

const RevealScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
    delay: 5,
  });

  const scale = interpolate(progress, [0, 1], [0.8, 1]);
  const opacity = interpolate(progress, [0, 0.5], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a" }}>
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontFamily,
            fontSize: 96,
            fontWeight: 700,
            color: "#fff",
            letterSpacing: -2,
            opacity,
            transform: `scale(${scale})`,
          }}
        >
          {CONFIG.productName}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ============================================
// SCENE 2: CONCEPT
// ============================================

const ConceptScene: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a" }}>
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
          padding: "0 120px",
        }}
      >
        <FadeIn delay={5}>
          <div
            style={{
              fontFamily,
              fontSize: 48,
              fontWeight: 700,
              color: "#fff",
              textAlign: "center",
              lineHeight: 1.3,
            }}
          >
            {CONFIG.tagline}
          </div>
        </FadeIn>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ============================================
// SCENE 3: MOCKUPS
// ============================================

const MockupsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const phoneProgress = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 80 },
    delay: 5,
  });

  const phoneY = interpolate(phoneProgress, [0, 1], [80, 0]);
  const phoneOpacity = interpolate(phoneProgress, [0, 0.3], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a" }}>
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            opacity: phoneOpacity,
            transform: `translateY(${phoneY}px)`,
          }}
        >
          <PhoneMockup scale={1.1}>
            <Img
              src={staticFile(CONFIG.mockupImage)}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </PhoneMockup>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ============================================
// SCENE 4-6: FEATURE
// ============================================

const FeatureScene: React.FC<{
  title: string;
  description: string;
  image: string;
  index: number;
}> = ({ title, description, image, index }) => {
  const frame = useCurrentFrame();
  const floatY = Math.sin(frame / 20) * 5;

  // Alternate layout: odd = left mockup, even = right mockup
  const isLeftMockup = index % 2 === 0;

  const content = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        maxWidth: 400,
      }}
    >
      <FadeIn delay={10}>
        <div
          style={{
            fontFamily,
            fontSize: 14,
            fontWeight: 500,
            color: "#4ade80",
            backgroundColor: "rgba(74, 222, 128, 0.1)",
            padding: "6px 16px",
            borderRadius: 20,
            width: "fit-content",
          }}
        >
          Feature {index + 1}
        </div>
      </FadeIn>
      <FadeIn delay={20}>
        <div
          style={{
            fontFamily,
            fontSize: 40,
            fontWeight: 700,
            color: "#fff",
            lineHeight: 1.2,
          }}
        >
          {title}
        </div>
      </FadeIn>
      <FadeIn delay={30}>
        <div
          style={{
            fontFamily,
            fontSize: 20,
            fontWeight: 400,
            color: "rgba(255,255,255,0.6)",
            lineHeight: 1.5,
          }}
        >
          {description}
        </div>
      </FadeIn>
    </div>
  );

  const mockup = (
    <ScaleIn delay={5}>
      <div style={{ transform: `translateY(${floatY}px)` }}>
        <PhoneMockup scale={0.9}>
          <Img
            src={staticFile(image)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </PhoneMockup>
      </div>
    </ScaleIn>
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a" }}>
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 80,
          padding: "0 100px",
        }}
      >
        {isLeftMockup ? (
          <>
            {mockup}
            {content}
          </>
        ) : (
          <>
            {content}
            {mockup}
          </>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ============================================
// SCENE 7: OUTRO
// ============================================

const OutroScene: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a" }}>
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
        }}
      >
        <ScaleIn delay={0}>
          <div
            style={{
              fontFamily,
              fontSize: 72,
              fontWeight: 700,
              color: "#fff",
              letterSpacing: -1,
            }}
          >
            {CONFIG.productName}
          </div>
        </ScaleIn>
        <FadeIn delay={15}>
          <div
            style={{
              fontFamily,
              fontSize: 24,
              fontWeight: 400,
              color: "rgba(255,255,255,0.6)",
            }}
          >
            {CONFIG.tagline}
          </div>
        </FadeIn>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ============================================
// SCENE 8: CTA
// ============================================

const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = 1 + Math.sin(frame / 10) * 0.02;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a" }}>
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 32,
        }}
      >
        <FadeIn delay={0}>
          <div
            style={{
              fontFamily,
              fontSize: 36,
              fontWeight: 500,
              color: "rgba(255,255,255,0.8)",
            }}
          >
            {CONFIG.cta}
          </div>
        </FadeIn>
        <FadeIn delay={15}>
          <div
            style={{
              fontFamily,
              fontSize: 24,
              fontWeight: 600,
              color: "#0a0a0a",
              backgroundColor: "#fff",
              padding: "20px 56px",
              borderRadius: 50,
              transform: `scale(${pulse})`,
            }}
          >
            {CONFIG.url}
          </div>
        </FadeIn>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ============================================
// MAIN COMPOSITION
// ============================================

export const ProductNameIntro: React.FC = () => {
  const sceneDuration = 3 * FPS; // 3 seconds per scene
  const transitionDuration = 15;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a" }}>
      <TransitionSeries>
        {/* 1. Reveal */}
        <TransitionSeries.Sequence durationInFrames={2.5 * FPS}>
          <RevealScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: transitionDuration })}
        />

        {/* 2. Concept */}
        <TransitionSeries.Sequence durationInFrames={sceneDuration}>
          <ConceptScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: transitionDuration })}
        />

        {/* 3. Mockups */}
        <TransitionSeries.Sequence durationInFrames={sceneDuration}>
          <MockupsScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: transitionDuration })}
        />

        {/* 4-6. Features */}
        {CONFIG.features.map((feature, index) => (
          <React.Fragment key={`feature-${index}`}>
            <TransitionSeries.Sequence durationInFrames={sceneDuration}>
              <FeatureScene
                title={feature.title}
                description={feature.description}
                image={feature.image}
                index={index}
              />
            </TransitionSeries.Sequence>

            <TransitionSeries.Transition
              presentation={fade()}
              timing={linearTiming({ durationInFrames: transitionDuration })}
            />
          </React.Fragment>
        ))}

        {/* 7. Outro */}
        <TransitionSeries.Sequence durationInFrames={2.5 * FPS}>
          <OutroScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: transitionDuration })}
        />

        {/* 8. CTA */}
        <TransitionSeries.Sequence durationInFrames={3 * FPS}>
          <CTAScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
```

## Register in Root.tsx

```tsx
import { Composition } from "remotion";
import { ProductNameIntro } from "./ProductName/ProductNameIntro";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* ... other compositions ... */}
      <Composition
        id="ProductNameIntro"
        component={ProductNameIntro}
        durationInFrames={600}  // ~20 seconds at 30fps
        fps={30}
        width={1280}
        height={720}
      />
    </>
  );
};
```

## Configuration Checklist

Edit the `CONFIG` object at the top of the file:

```tsx
const CONFIG = {
  productName: "___",      // Your product name
  tagline: "___",          // One-line value proposition
  features: [
    {
      title: "___",        // Feature 1 title
      description: "___",  // Feature 1 description
      image: "___",        // feature-1.png
    },
    // Add more features...
  ],
  cta: "___",              // Call to action text
  url: "___",              // Your URL
  mockupImage: "___",      // mockup.png
};
```

## Required Images

Place these in the `public/` folder:

```
public/
├── mockup.png       # Main product screenshot
├── feature-1.png    # Feature 1 screenshot
├── feature-2.png    # Feature 2 screenshot (if needed)
└── feature-3.png    # Feature 3 screenshot (if needed)
```

## Render Commands

```bash
# Preview
bun run remotion

# Render MP4
bunx remotion render ProductNameIntro out/product-intro.mp4
```
