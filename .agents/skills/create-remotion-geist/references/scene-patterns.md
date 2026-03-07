# Scene Patterns

Templates for common Remotion scene types using Geist design system.

**IMPORTANT:** Never use emojis. Use icons from `@geist-ui/icons` package.

## Base Scene Structure

```tsx
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { fadeIn, springIn, slideUp, slideRight } from '../utils/animations';

export function SceneName() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animation values
  const titleOpacity = fadeIn(frame, fps, 0, 0.4);
  const titleScale = springIn(frame, fps, 0);

  return (
    <AbsoluteFill className="bg-background-100 flex flex-col items-center justify-center px-20">
      <h2
        className="text-white font-bold"
        style={{
          fontSize: 64,
          opacity: titleOpacity,
          transform: `scale(${titleScale})`,
        }}
      >
        Scene Title
      </h2>
      {/* Content */}
    </AbsoluteFill>
  );
}
```

## Title Scene

```tsx
export function TitleScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoOpacity = fadeIn(frame, fps, 0, 0.4);
  const logoScale = scaleIn(frame, fps, 0, 0.5);
  const titleOpacity = fadeIn(frame, fps, 0.3, 0.5);
  const titleY = slideUp(frame, fps, 0.3, 40);
  const subtitleOpacity = fadeIn(frame, fps, 0.6, 0.4);
  const taglineOpacity = fadeIn(frame, fps, 0.9, 0.3);

  return (
    <AbsoluteFill className="bg-background-100 flex flex-col items-center justify-center">
      <div style={{ opacity: logoOpacity, transform: `scale(${logoScale})` }}>
        <VercelLogo size={80} />
      </div>
      <h1 className="text-white font-bold mt-8"
        style={{ fontSize: 120, letterSpacing: '-0.03em', opacity: titleOpacity, transform: `translateY(${titleY}px)` }}>
        TITLE
      </h1>
      <p className="text-gray-400 mt-2" style={{ fontSize: 48, opacity: subtitleOpacity }}>
        Subtitle
      </p>
      <p className="text-gray-500 mt-12" style={{ fontSize: 24, opacity: taglineOpacity }}>
        Tagline • Words • Here
      </p>
    </AbsoluteFill>
  );
}
```

## Card Grid Scene (2x2)

```tsx
import { Eye, Zap, Monitor, Smartphone } from '@geist-ui/icons';

// Define items with icon components, NOT emojis
const items = [
  { Icon: Eye, title: 'Feature 1', desc: 'Description' },
  { Icon: Zap, title: 'Feature 2', desc: 'Description' },
  { Icon: Monitor, title: 'Feature 3', desc: 'Description' },
  { Icon: Smartphone, title: 'Feature 4', desc: 'Description' },
];

export function CardGridScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill className="bg-background-100 flex flex-col items-center justify-center px-20">
      <h2 className="text-white font-bold mb-16" style={{ fontSize: 64 }}>Title</h2>
      <div className="grid grid-cols-2 gap-8">
        {items.map((item, index) => {
          const delay = 0.3 + index * 0.15;
          const opacity = fadeIn(frame, fps, delay, 0.4);
          const y = slideUp(frame, fps, delay, 30);
          const { Icon } = item;
          return (
            <div key={item.title}
              className="bg-background-200 border border-gray-400 rounded-lg p-8 flex items-center gap-6"
              style={{ opacity, transform: `translateY(${y}px)`, width: 400 }}>
              <Icon size={48} color="white" />
              <div>
                <h3 className="text-white font-semibold text-2xl">{item.title}</h3>
                <p className="text-gray-400 text-lg mt-1">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}
```

## Color Scale Scene

```tsx
const colors = [
  { value: '#ededed', label: '100' },
  { value: '#d4d4d4', label: '200' },
  // ... continue scale
  { value: '#000000', label: '1000' },
];

export function ColorScaleScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill className="bg-background-100 flex flex-col items-center justify-center px-20">
      <h2 className="text-white font-bold" style={{ fontSize: 64 }}>Color System</h2>
      <p className="text-gray-400 mt-4 mb-12" style={{ fontSize: 24 }}>
        10-step scale: 100 → 1000
      </p>
      <div className="flex gap-2">
        {colors.map((color, index) => {
          const delay = 0.4 + index * 0.08;
          const opacity = fadeIn(frame, fps, delay, 0.2);
          const scale = springIn(frame, fps, delay);
          return (
            <div key={color.label}
              className="rounded-md flex items-center justify-center"
              style={{ width: 80, height: 80, backgroundColor: color.value, opacity, transform: `scale(${scale})` }}>
              <span style={{ fontSize: 14, color: index < 4 ? '#0a0a0a' : '#ededed', fontFamily: 'Geist Mono' }}>
                {color.label}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}
```

## Typography Showcase Scene

```tsx
const sections = [
  { title: 'Headers', items: [
    { class: 'text-heading-48', size: '48px', sample: 'Heading' },
    { class: 'text-heading-32', size: '32px', sample: 'Heading' },
  ]},
  { title: 'Labels', items: [
    { class: 'text-label-14', size: '14px', sample: 'Label Text' },
  ]},
  { title: 'Copy', items: [
    { class: 'text-copy-14', size: '14px', sample: 'Body text' },
    { class: 'text-copy-13-mono', size: '13px', sample: 'code', mono: true },
  ]},
];

// Render with staggered animations per section and item
```

## Spacing Visualization Scene

```tsx
const spacing = [
  { name: 'space-2', px: 8, label: 'tight' },
  { name: 'space-4', px: 16, label: 'default' },
  { name: 'space-6', px: 24, label: 'comfortable' },
  { name: 'space-8', px: 32, label: 'spacious' },
];

// Render with animated bar widths:
const widthProgress = springIn(frame, fps, delay);
const barWidth = interpolate(widthProgress, [0, 1], [0, space.px * 5]);
```

## Checklist Summary Scene

```tsx
import { Check } from '@geist-ui/icons';

const items = ['Feature 1', 'Feature 2', 'Feature 3'];

export function SummaryScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill className="bg-background-100 flex flex-col items-center justify-center">
      <h2 className="text-white font-bold mb-12" style={{ fontSize: 80 }}>Title</h2>
      <div className="flex flex-col gap-3">
        {items.map((item, index) => {
          const delay = 0.2 + index * 0.12;
          const opacity = fadeIn(frame, fps, delay, 0.3);
          const x = slideRight(frame, fps, delay, 20);
          return (
            <div key={item} className="flex items-center gap-4" style={{ opacity, transform: `translateX(${x}px)` }}>
              <div className="w-6 h-6 rounded-full bg-green-700/20 border border-green-700/40 flex items-center justify-center">
                <Check size={14} color="#46A758" />
              </div>
              <span className="text-white text-xl">{item}</span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}
```

## Main Video Composition

```tsx
import { AbsoluteFill, Sequence, useVideoConfig } from 'remotion';

export function MainVideo() {
  const { fps } = useVideoConfig();

  const scenes = [
    { component: TitleScene, duration: 3 },
    { component: FeatureScene, duration: 5 },
    { component: ColorScene, duration: 6 },
    // Add more scenes...
  ];

  let currentFrame = 0;
  return (
    <AbsoluteFill className="bg-background-100">
      {scenes.map((scene, index) => {
        const Scene = scene.component;
        const from = currentFrame;
        currentFrame += scene.duration * fps;
        return (
          <Sequence key={index} from={from} durationInFrames={scene.duration * fps} premountFor={fps}>
            <Scene />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
}
```
