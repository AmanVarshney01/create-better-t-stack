# Storyboard Template

Use this template to plan video structure before implementation.

## Video Metadata

```markdown
# [Video Title]

## Meta
| Property | Value |
|----------|-------|
| Duration | 45s |
| FPS | 30 |
| Resolution | 1920x1080 |
| Font | Geist Sans, Geist Mono |
| Style | Dark (#0a0a0a bg), spring animations |

## Colors
| Name | Hex | Usage |
|------|-----|-------|
| bg-100 | #0a0a0a | Primary background |
| bg-200 | #171717 | Secondary background |
| primary | #ffffff | Primary text |
| muted | #737373 | Secondary text |
| blue | #3b82f6 | Success/info |
| red | #ef4444 | Error |
| amber | #f59e0b | Warning |
```

## Scene Template

```markdown
## Scene N: [Scene Name]
**Time:** 0:00 → 0:03

### Layout
```
┌─────────────────────────────────────┐
│                                     │
│           [ASCII diagram]           │
│                                     │
└─────────────────────────────────────┘
```

### Elements
1. **Element Name** — Description — style notes
2. **Element Name** — Description — style notes

### Animation
| Element | Effect | Delay | Duration |
|---------|--------|-------|----------|
| Title | spring-in | 0ms | 400ms |
| Content | fade-in + slide-up | 300ms | 400ms |

### Transition
Crossfade 200ms
```

## Example Storyboard

```markdown
# Geist Design System Explainer

## Scene 1: Title (0:00 → 0:03)
### Layout
```
┌─────────────────────────────────────┐
│           ▲ (Vercel logo)           │
│          GEIST                      │
│        Design System                │
│   High Contrast • Minimal • Dev     │
└─────────────────────────────────────┘
```

### Elements
1. **Vercel Logo** — Triangle — 80px, white, center
2. **Title** — "GEIST" — 120px, bold, white
3. **Subtitle** — "Design System" — 48px, muted
4. **Tagline** — Principles — 24px, muted

### Animation
| Element | Effect | Delay | Duration |
|---------|--------|-------|----------|
| Logo | scale-in + fade-in | 0ms | 400ms |
| Title | spring-in + slide-up | 300ms | 500ms |
| Subtitle | fade-in + slide-up | 600ms | 400ms |
| Tagline | fade-in | 900ms | 300ms |

---

## Scene 2: Core Principles (0:03 → 0:08)
### Layout
```
┌─────────────────────────────────────┐
│         "Core Principles"           │
│   ┌─────────┐  ┌─────────┐         │
│   │ HIGH    │  │ MINIMAL │         │
│   │CONTRAST │  │ -IST    │         │
│   └─────────┘  └─────────┘         │
│   ┌─────────┐  ┌─────────┐         │
│   │ DEV     │  │ RESPON- │         │
│   │ FOCUSED │  │ SIVE    │         │
│   └─────────┘  └─────────┘         │
└─────────────────────────────────────┘
```

### Elements
1. **Title** — "Core Principles" — 64px, bold
2. **Card 1-4** — Feature cards — bg-200, border, icon + text

### Animation
| Element | Effect | Delay | Duration |
|---------|--------|-------|----------|
| Title | spring-in | 0ms | 400ms |
| Card 1 | spring-in + slide-up | 300ms | 400ms |
| Card 2 | spring-in + slide-up | 450ms | 400ms |
| Card 3 | spring-in + slide-up | 600ms | 400ms |
| Card 4 | spring-in + slide-up | 750ms | 400ms |
```

## Timing Guidelines

| Scene Type | Suggested Duration |
|------------|-------------------|
| Title/Intro | 2-4 seconds |
| Feature cards (4 items) | 4-6 seconds |
| Color/typography demo | 5-7 seconds |
| Component showcase | 4-6 seconds |
| Summary/outro | 3-5 seconds |

## Animation Timing

| Animation | Typical Duration | When to Use |
|-----------|-----------------|-------------|
| fade-in | 300-500ms | Subtle entrances |
| spring-in | 400-600ms | Primary elements |
| slide-up | 300-400ms | Cascading items |
| scale-in | 400-500ms | Emphasis elements |
| stagger | 100-200ms | Lists, grids |

## Checklist

- [ ] All scenes have clear layout diagrams
- [ ] Total duration matches video length
- [ ] Animation delays create readable flow
- [ ] Scene transitions defined
- [ ] Color palette documented
- [ ] Typography choices noted
```
