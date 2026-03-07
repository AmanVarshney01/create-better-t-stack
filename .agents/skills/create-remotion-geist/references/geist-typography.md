# Geist Typography

All typography uses Geist Sans (sans) or Geist Mono (mono). Classes set font-size, line-height, letter-spacing, and font-weight.

## Heading Classes

| Class | Size | Line Height | Letter Spacing | Weight |
|-------|------|-------------|----------------|--------|
| text-heading-72 | 72px | 72px | -4.32px | 600 (semibold) |
| text-heading-64 | 64px | 64px | -3.84px | 600 |
| text-heading-56 | 56px | 56px | -3.36px | 600 |
| text-heading-48 | 48px | 56px | -2.88px | 600 |
| text-heading-40 | 40px | 48px | -2.4px | 600 |
| text-heading-32 | 32px | 40px | -1.28px | 600 |
| text-heading-24 | 24px | 32px | -0.96px | 600 |
| text-heading-20 | 20px | 26px | -0.4px | 600 |
| text-heading-16 | 16px | 24px | -0.32px | 600 |
| text-heading-14 | 14px | 20px | -0.28px | 600 |

**Usage:**
- 72: Marketing heroes
- 48-64: Marketing subheadings
- 32: Dashboard page headings
- 24: Section headings
- 16-20: Card/modal titles
- 14: Small headings

## Label Classes

| Class | Font | Size | Line Height | Weight |
|-------|------|------|-------------|--------|
| text-label-20 | sans | 20px | 32px | 400 |
| text-label-18 | sans | 18px | 20px | 400 |
| text-label-16 | sans | 16px | 20px | 400 |
| text-label-14 | sans | 14px | 20px | 400 |
| text-label-14-mono | mono | 14px | 20px | 400 |
| text-label-13 | sans | 13px | 16px | 400 |
| text-label-13-mono | mono | 13px | 20px | 400 |
| text-label-12 | sans | 12px | 16px | 400 |
| text-label-12-mono | mono | 12px | 16px | 400 |

**Usage:**
- 20: Marketing labels
- 16: Form labels, titles
- 14: Most common (menus, buttons)
- 13: Secondary info, tabular data
- 12: Tertiary (timestamps, badges)
- mono variants: Code, technical data

## Copy Classes

| Class | Font | Size | Line Height | Weight |
|-------|------|------|-------------|--------|
| text-copy-24 | sans | 24px | 36px | 400 |
| text-copy-20 | sans | 20px | 36px | 400 |
| text-copy-18 | sans | 18px | 28px | 400 |
| text-copy-16 | sans | 16px | 24px | 400 |
| text-copy-14 | sans | 14px | 20px | 400 |
| text-copy-14-mono | mono | 14px | 20px | 400 |
| text-copy-13 | sans | 13px | 18px | 400 |
| text-copy-13-mono | mono | 13px | 18px | 400 |

**Usage:**
- 24: Marketing hero paragraphs
- 20: Marketing body text
- 18: Quotes, featured text
- 16: Modal body, spacious views
- 14: Most common body text
- 13: Compact views, descriptions
- mono variants: Inline code

## Button Classes

| Class | Size | Line Height | Weight |
|-------|------|-------------|--------|
| text-button-16 | 16px | 20px | 500 (medium) |
| text-button-14 | 14px | 20px | 500 |
| text-button-12 | 12px | 16px | 500 |

## Font Families

```css
--font-sans: 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-mono: 'Geist Mono', 'SF Mono', Monaco, 'Consolas', monospace;
```

## CSS Implementation

```css
.text-heading-32 {
  font-family: var(--font-sans);
  font-size: 32px;
  font-weight: 600;
  line-height: 40px;
  letter-spacing: -1.28px;
}

.text-label-14 {
  font-family: var(--font-sans);
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
}

.text-copy-14-mono {
  font-family: var(--font-mono);
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
}
```

## Remotion Implementation

```tsx
// For headings - use semibold + tight tracking
<h2 style={{
  fontSize: 48,
  fontWeight: 600,
  lineHeight: '56px',
  letterSpacing: '-2.88px',
  fontFamily: 'Geist, sans-serif',
}}>
  Heading Text
</h2>

// For labels - normal weight
<span style={{
  fontSize: 14,
  fontWeight: 400,
  lineHeight: '20px',
  fontFamily: 'Geist, sans-serif',
}}>
  Label Text
</span>

// For mono text
<code style={{
  fontSize: 13,
  fontWeight: 400,
  lineHeight: '18px',
  fontFamily: 'Geist Mono, monospace',
}}>
  code text
</code>
```
