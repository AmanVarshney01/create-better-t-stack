# Project Setup

Complete file templates for a Geist Remotion video project.

## package.json

```json
{
  "name": "geist-video",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "start": "remotion studio",
    "build": "remotion render MainVideo out/video.mp4",
    "render": "remotion render MainVideo out/video.mp4"
  },
  "dependencies": {
    "@geist-ui/icons": "^1.0.2",
    "@remotion/cli": "^4.0.0",
    "@remotion/tailwind": "^4.0.0",
    "prism-react-renderer": "^2.3.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "remotion": "^4.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.0.0"
  }
}
```

## remotion.config.ts

```typescript
import { Config } from '@remotion/cli/config';
import { enableTailwind } from '@remotion/tailwind';

Config.overrideWebpackConfig((config) => {
  return enableTailwind(config);
});
```

## tailwind.config.js

```javascript
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: { 100: '#0a0a0a', 200: '#171717' },
        gray: {
          100: '#ededed', 200: '#d4d4d4', 300: '#a3a3a3',
          400: '#737373', 500: '#525252', 600: '#404040',
          700: '#262626', 800: '#171717', 900: '#0a0a0a', 1000: '#000000'
        },
        // Semantic colors - success=green, error=red, warning=amber, info=blue
        blue: { 500: '#3b82f6', 600: '#2563eb', 700: '#0070F3' },
        red: { 500: '#ef4444', 700: '#E5484D' },
        amber: { 500: '#f59e0b', 700: '#FFB224' },
        green: { 500: '#22c55e', 700: '#46A758' },  // Success color
        violet: { 500: '#8b5cf6', 700: '#8B5CF6' },
        cyan: { 500: '#06b6d4', 700: '#06B6D4' },
      },
      fontFamily: {
        sans: ['Geist', 'sans-serif'],
        mono: ['Geist Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
```

## src/styles.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@font-face {
  font-family: 'Geist';
  src: url('https://cdn.jsdelivr.net/npm/geist@1.5.1/dist/fonts/geist-sans/Geist-Regular.woff2') format('woff2');
  font-weight: 400;
}

@font-face {
  font-family: 'Geist';
  src: url('https://cdn.jsdelivr.net/npm/geist@1.5.1/dist/fonts/geist-sans/Geist-Medium.woff2') format('woff2');
  font-weight: 500;
}

@font-face {
  font-family: 'Geist';
  src: url('https://cdn.jsdelivr.net/npm/geist@1.5.1/dist/fonts/geist-sans/Geist-SemiBold.woff2') format('woff2');
  font-weight: 600;
}

@font-face {
  font-family: 'Geist';
  src: url('https://cdn.jsdelivr.net/npm/geist@1.5.1/dist/fonts/geist-sans/Geist-Bold.woff2') format('woff2');
  font-weight: 700;
}

@font-face {
  font-family: 'Geist Mono';
  src: url('https://cdn.jsdelivr.net/npm/geist@1.5.1/dist/fonts/geist-mono/GeistMono-Regular.woff2') format('woff2');
  font-weight: 400;
}
```

## src/index.tsx (Entry Point)

**IMPORTANT:** The entry point must be `.tsx` (not `.ts`) and must call `registerRoot()`.

```tsx
import { registerRoot } from 'remotion';
import { RemotionRoot } from './Root';

registerRoot(RemotionRoot);
```

## src/Root.tsx (Composition Definitions)

```tsx
import { Composition } from 'remotion';
import { MainVideo } from './MainVideo';
import './styles.css';

export const RemotionRoot = () => {
  return (
    <Composition
      id="MainVideo"
      component={MainVideo}
      durationInFrames={45 * 30}  // 45 seconds at 30fps
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
```

## src/utils/animations.ts

```typescript
import { interpolate, spring } from 'remotion';

export const springConfig = {
  smooth: { damping: 200 },
  snappy: { damping: 20, stiffness: 200 },
  bouncy: { damping: 8 },
};

export function fadeIn(frame: number, fps: number, delay = 0, duration = 0.4) {
  const delayFrames = delay * fps;
  const durationFrames = duration * fps;
  return interpolate(frame, [delayFrames, delayFrames + durationFrames], [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
}

export function slideUp(frame: number, fps: number, delay = 0, distance = 30) {
  const progress = spring({ frame: frame - delay * fps, fps, config: springConfig.smooth });
  return interpolate(progress, [0, 1], [distance, 0]);
}

export function slideRight(frame: number, fps: number, delay = 0, distance = 30) {
  const progress = spring({ frame: frame - delay * fps, fps, config: springConfig.smooth });
  return interpolate(progress, [0, 1], [-distance, 0]);
}

export function scaleIn(frame: number, fps: number, delay = 0, from = 0.8) {
  const progress = spring({ frame: frame - delay * fps, fps, config: springConfig.snappy });
  return interpolate(progress, [0, 1], [from, 1]);
}

export function springIn(frame: number, fps: number, delay = 0) {
  return spring({ frame: frame - delay * fps, fps, config: springConfig.smooth });
}
```

## src/components/VercelLogo.tsx

**NOTE:** For official brand assets, download from https://assets.vercel.com/raw/upload/front/press/vercel-assets.zip
See `references/geist-icons.md` for more brand asset download links.

```tsx
type VercelLogoProps = { size?: number; color?: string };

export function VercelLogo({ size = 80, color = 'white' }: VercelLogoProps) {
  return (
    <svg width={size} height={size * 0.87} viewBox="0 0 76 65" fill="none">
      <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" fill={color} />
    </svg>
  );
}
```
