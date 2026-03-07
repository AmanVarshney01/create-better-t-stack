# Geist Color System

10-step scale from 100 (lightest) to 1000 (darkest). Uses CSS variables `--ds-{color}-{step}`.

**IMPORTANT:** Success = Green, NOT Blue. Blue is for info/accent.

## Gray Scale

| Step | Light Theme | Dark Theme | Usage |
|------|-------------|------------|-------|
| 100 | #F2F2F2 | #1A1A1A | Subtle backgrounds |
| 200 | #EBEBEB | #1F1F1F | Secondary backgrounds |
| 300 | #E6E6E6 | #292929 | Borders (subtle) |
| 400 | #EBEBEB | #737373 | **Default borders** |
| 500 | #C9C9C9 | #525252 | Borders (hover) |
| 600 | #A8A8A8 | #404040 | Borders (active) |
| 700 | #8F8F8F | #262626 | Muted text |
| 800 | #7D7D7D | #171717 | Secondary text |
| 900 | #666666 | #A1A1A1 | Primary text (light) |
| 1000 | #171717 | #EDEDED | **Primary text** |

## Background Colors

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| background-100 | #FFFFFF | #0A0A0A | **Primary surface** |
| background-200 | #FAFAFA | #000000 | Elevated surfaces |

## Semantic Colors

| Type | CSS Variable | Value | Usage |
|------|--------------|-------|-------|
| success | --ds-green-700 | #46A758 | Success states |
| error | --ds-red-700 | #E5484D | Error states, destructive |
| warning | --ds-amber-700 | #FFB224 | Caution, attention |
| info | --ds-blue-700 | #0070F3 | Informational, accent |
| secondary | --ds-gray-400 | #737373 | Neutral, muted |
| violet | --ds-violet-700 | #8B5CF6 | Accent, special |
| cyan | --ds-cyan-700 | #06B6D4 | Accent, special |

## Brand Colors

```css
--geist-success: #46A758;    /* Green */
--geist-error: #E5484D;      /* Red */
--geist-warning: #FFB224;    /* Amber */
--geist-info: #0070F3;       /* Blue */
--geist-cyan: #06B6D4;
--geist-violet: #8B5CF6;
```

## Blue Scale (Success/Info)

| Step | Value |
|------|-------|
| 100 | #F0F7FF |
| 200 | #EBF5FF |
| 300 | #E0F0FF |
| 400 | #CCE4FF |
| 500 | #99CAFF |
| 600 | #52A8FF |
| 700 | #0070F3 |
| 800 | #005FCC |
| 900 | #0062D6 |
| 1000 | #002040 |

## Red Scale (Error)

| Step | Value |
|------|-------|
| 100 | #FFF0F0 |
| 700 | #E5484D |
| 1000 | #3B1219 |

## Amber Scale (Warning)

| Step | Value |
|------|-------|
| 100 | #FFF7E6 |
| 700 | #FFB224 |
| 1000 | #4D2900 |

## Green Scale

| Step | Value |
|------|-------|
| 100 | #EEFBEE |
| 700 | #46A758 |
| 1000 | #1B2D1D |

## Usage Patterns

### Component States
- Default bg: `{color}-100` or `{color}-200`
- Hover bg: `{color}-200` or `{color}-300`
- Default border: `{color}-400`
- Hover border: `{color}-500`
- Active border: `{color}-600`
- High contrast bg: `{color}-700` or `{color}-800`
- Secondary text: `{color}-900`
- Primary text: `{color}-1000`

### Tailwind Config

```javascript
colors: {
  background: { 100: '#0a0a0a', 200: '#171717' },
  gray: {
    100: '#ededed', 200: '#d4d4d4', 300: '#a3a3a3',
    400: '#737373', 500: '#525252', 600: '#404040',
    700: '#262626', 800: '#171717', 900: '#0a0a0a', 1000: '#000000'
  },
  blue: { 500: '#3b82f6', 600: '#2563eb', 700: '#0070F3' },
  red: { 500: '#ef4444', 700: '#E5484D' },
  amber: { 500: '#f59e0b', 700: '#FFB224' },
  green: { 500: '#22c55e', 700: '#46A758' },
  violet: { 500: '#8b5cf6' },
  cyan: { 500: '#06b6d4' },
}
```
