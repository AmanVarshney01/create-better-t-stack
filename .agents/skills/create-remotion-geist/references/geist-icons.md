# Geist Icons & Brand Assets

**CRITICAL: NEVER use emojis in Remotion videos.** Always use proper Geist icons or official brand assets.

## Icon Package

Install the `@geist-ui/icons` package for proper Geist icons:

```bash
npm install @geist-ui/icons
```

### Usage

```tsx
import { Code, Folder, Check, ArrowRight, Settings, Globe } from '@geist-ui/icons';

// Basic usage
<Code />

// With customization
<Check size={24} color="#46A758" />
<Folder size={32} color="white" />
```

### Common Icons

| Instead of Emoji | Use Icon |
|------------------|----------|
| 📁 | `<Folder />` |
| 📄 | `<File />` |
| ✓ or ✅ | `<Check />` or `<CheckCircle />` |
| ⚠ or ⚠️ | `<AlertTriangle />` |
| ❌ | `<X />` or `<XCircle />` |
| ⬇️ | `<ArrowDown />` or `<Download />` |
| ⬆️ | `<ArrowUp />` or `<Upload />` |
| ➡️ | `<ArrowRight />` |
| 🔒 | `<Lock />` |
| 🌐 | `<Globe />` |
| ⚙️ | `<Settings />` |
| 💻 | `<Monitor />` or `<Code />` |
| 📱 | `<Smartphone />` |
| 🔍 | `<Search />` |
| 📊 | `<BarChart />` |

### Icon Props

```tsx
interface IconProps {
  size?: number;       // Default: 24
  color?: string;      // Default: 'currentColor'
  strokeWidth?: number; // Default: 1.5
}
```

## Official Brand Assets

Download official logos from Vercel's brand page. **Do not hand-craft SVGs.**

### Download URLs

| Brand | Download |
|-------|----------|
| Vercel | https://assets.vercel.com/raw/upload/front/press/vercel-assets.zip |
| Next.js | https://assets.vercel.com/raw/upload/front/press/nextjs-assets.zip |
| Turbo | https://assets.vercel.com/raw/upload/front/press/turbo-assets.zip |
| v0 | https://assets.vercel.com/raw/upload/v1762563059/front/press/v0-assets.zip |
| AI SDK | https://assets.vercel.com/raw/upload/v1763470459/front/press/ai-sdk-assets.zip |

### Vercel Logo Component

After downloading assets, create a component from the official SVG:

```tsx
// src/components/VercelLogo.tsx
type VercelLogoProps = { size?: number; color?: string };

export function VercelLogo({ size = 80, color = 'white' }: VercelLogoProps) {
  return (
    <svg width={size} height={size * 0.87} viewBox="0 0 76 65" fill="none">
      <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" fill={color} />
    </svg>
  );
}
```

### Next.js Logo Component

```tsx
// src/components/NextJSLogo.tsx
type NextJSLogoProps = { size?: number; color?: string };

export function NextJSLogo({ size = 80, color = 'white' }: NextJSLogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 180 180" fill="none">
      <mask id="mask0" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="180" height="180">
        <circle cx="90" cy="90" r="90" fill="black" />
      </mask>
      <g mask="url(#mask0)">
        <circle cx="90" cy="90" r="90" fill={color === 'white' ? 'black' : color} stroke={color} strokeWidth="6" />
        <path
          d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z"
          fill="url(#paint0_linear)"
        />
        <rect x="115" y="54" width="12" height="72" fill="url(#paint1_linear)" />
      </g>
      <defs>
        <linearGradient id="paint0_linear" x1="109" y1="116.5" x2="144.5" y2="160.5" gradientUnits="userSpaceOnUse">
          <stop stopColor={color} />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
        <linearGradient id="paint1_linear" x1="121" y1="54" x2="120.799" y2="106.875" gradientUnits="userSpaceOnUse">
          <stop stopColor={color} />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}
```

## Geist Icons Browser

Browse all 600+ official icons at: https://vercel.com/geist/icons

You can right-click any icon to copy its SVG.

## Alternative: Copy SVGs Directly

If you need icons not in `@geist-ui/icons`, visit https://vercel.com/geist/icons and right-click to copy the SVG, then create a React component:

```tsx
// Example: Custom icon from Geist
export function CustomIcon({ size = 24, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
      {/* Paste SVG path here */}
    </svg>
  );
}
```

## Icon Categories Available

From vercel.com/geist/icons:

- **Navigation**: Arrows, chevrons, menu, sidebar
- **Actions**: Check, X, plus, minus, edit, delete
- **Files**: Folder, file, document, code
- **Communication**: Bell, envelope, message, chat
- **Media**: Play, pause, volume, camera
- **Data**: Chart, graph, database, table
- **Status**: Loading, spinner, check-circle, alert
- **Devices**: Monitor, smartphone, tablet, server
- **Social**: GitHub, Twitter/X, Discord, LinkedIn
- **Brand**: Vercel, Next.js, Turbo, v0, and 40+ tech logos
