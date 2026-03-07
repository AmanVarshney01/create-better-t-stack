---
name: design-principles
description: Visual design system for modern product launch videos
---

# Design Principles

## The Modern Aesthetic

Modern product videos follow a **minimalist, high-contrast** design language inspired by Apple, Linear, and Stripe.

### Color Philosophy

**Dark Mode (Recommended)**
```
Background: #0a0a0a (near black)
Text Primary: #ffffff
Text Secondary: rgba(255,255,255,0.6)
Accent: Brand color or #4ade80 (green)
```

**Light Mode**
```
Background: #fafafa or #ffffff
Text Primary: #0a0a0a
Text Secondary: rgba(0,0,0,0.5)
Accent: Brand color
```

### Why No Gradients?

Gradients were popular in 2015-2020. Modern design uses:
- Solid colors with strategic shadows
- Subtle depth through layering
- Light/dark contrast instead of color transitions

**Exception**: Subtle gradient on accent buttons or highlights is acceptable.

## Typography Scale

Use a single font family. Recommended: Inter, SF Pro, or system fonts.

```
Title:       64-80px, weight 700
Subtitle:    24-32px, weight 400
Body:        16-20px, weight 400
Caption:     12-14px, weight 500
```

### Letter Spacing

```tsx
// Titles: slightly tighter
letterSpacing: -1 to -2

// Body: default
letterSpacing: 0

// Captions/Labels: slightly wider
letterSpacing: 0.5 to 1
```

## Spacing System

Use 8px grid system:

```
xs: 8px
sm: 16px
md: 24px
lg: 32px
xl: 48px
xxl: 64px
```

## Shadow System

Shadows create depth without gradients:

```tsx
// Subtle (cards, buttons)
boxShadow: "0 1px 2px rgba(0,0,0,0.1)"

// Medium (floating elements)
boxShadow: "0 4px 12px rgba(0,0,0,0.15)"

// Strong (device mockups)
boxShadow: "0 25px 50px rgba(0,0,0,0.25)"

// Hero (main focal point)
boxShadow: "0 50px 100px rgba(0,0,0,0.4)"
```

## Visual Hierarchy

```
1. Device mockup with screenshot (focal point)
2. Primary headline
3. Supporting text
4. CTA / URL
```

Never compete for attention. One hero element per scene.

## Brand Integration

### Logo Placement
- Opening: Center or top-left
- Closing: Center, larger

### Brand Colors
Use sparingly:
- Accent on CTAs
- Subtle highlight on key features
- NOT as background

## Common Mistakes

| Mistake | Why It's Bad | Fix |
|---------|--------------|-----|
| Multiple accent colors | Looks chaotic | Pick one accent |
| Patterned backgrounds | Distracts from product | Solid color |
| Decorative elements | Looks amateur | Remove them |
| Low contrast text | Hard to read | Increase opacity |
| Too many font sizes | Inconsistent | Stick to scale |
