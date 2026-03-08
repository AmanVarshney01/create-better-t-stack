# Remotion Video Style

Use this guide for Remotion videos made for this project unless the user asks for a different direction.

## Default look

- Default to short videos — under 10 seconds, ideally a single scene (3-5s).
- Cut aggressively. Start with the minimum, don't pad with intro/outro scenes.
- One clear message per video. No redundant text — if the heading says it, don't repeat it in a badge.
- Follow the homepage dark palette exactly. Keep the result sharp, minimal, premium, and technical.

## Branding

- **Never use the BF square icon.** Only use the text treatment: "better" (white `#f2eeee`) + "fullstack" (muted `#b3b0b0`) in Geist Mono, bold, `-0.02em` tracking.
- Text should communicate the message — don't rely on logos alone (e.g. "betterfullstack now supports Deno Fresh Framework").
- Include the actual CLI command users run (`bun create better-fullstack@latest`) in a styled command box when relevant.

## Color system

Use the homepage dark theme colors exactly:

| Token | Value | Usage |
|-------|-------|-------|
| Background | `#0c0c0e` | Primary background |
| Foreground | `#f2eeee` | Primary text, active tabs |
| Muted foreground | `#b3b0b0` | Secondary text, subtitles |
| Border | `#2a2a2a` | Borders, dividers |
| Secondary/Input | `#1a1a1a` | Command box bg, card bg |
| Primary | `#8839ef` | Brand purple (use sparingly) |

Apply the palette like this:

- Keep frames dark, background always `#0c0c0e`.
- Use the purple sparingly — it's the brand accent, not a fill color.
- Prefer grayscale layers. No gradients, no glow effects, no radial orbs.
- Avoid warm or saturated accent colors unless the prompt explicitly asks for them.

## Background

- Use a subtle **grid background**: `rgba(242,238,238,0.04)` lines at `64px` spacing.
- No glow orbs, no radial gradients, no blurred color blobs.

## Command box style

When showing CLI commands:

```
background: #1a1a1a
border: 1px solid #2a2a2a
border-radius: 8px
padding: 14px 32px
font: Geist Mono, 22px, #f2eeee
```

No package manager tabs — just show the command directly.

## Icons and assets

- **Use official SVGs** — download from official repos (e.g. `denoland/fresh` for Fresh logo, Simple Icons for framework logos).
- Don't hand-draw approximations — fetch the real thing.
- Use the same icon system as the builder page: Simple Icons CDN (`cdn.simpleicons.org/{slug}`) or local `/public/icon/` assets.
- Icon registry reference: `apps/web/src/lib/tech-icons.ts`.
- Keep icons bold enough to read on short scenes.
- Animate icons with scale, position shifts, or opacity — not constant floating motion.

## Typography

- Use Geist Sans for body text, Geist Mono for code/commands and the brand text treatment.
- Prefer strong sans-serif headlines with tight tracking.
- Keep on-screen copy short. A scene should communicate one idea.

## Motion rules

- Favor spring-based motion with smooth easing.
- Use fast, confident entrances and clean exits.
- Keep transitions brief — don't let them dominate runtime.
- **Simple effects over fancy** — confetti is fine, pulsing glow orbs are not.
- Avoid random movement, oversized elastic effects, or constant floating motion.

## Scene structure

- Prefer a single scene for announcements (3-5s).
- Open with the key message immediately — no slow fade-in intros.
- If multiple scenes needed, cap at 2-3 for under 10 seconds.
- End with a clean branded frame or CTA (command box, URL).

## What to avoid

- No gradients, glow effects, or radial blobs.
- No BF square icon — text treatment only.
- No package manager tabs — just the command.
- No redundant badges/labels that repeat the heading.
- No bright multi-color backgrounds.
- No emoji, meme-style motion, or cartoonish effects.
- No overloaded scenes with too many simultaneous animations.
- Don't copy Vercel branding directly; borrow the design discipline, not the brand identity.

## Skill usage defaults

When multiple installed skills overlap, use them in this order:

1. `remotion-best-practices` for core Remotion decisions.
2. `modern-short-video` for pacing and short-form structure.
3. `remotion-bits` for premium motion components.
4. `create-remotion-geist` for typography and Vercel-like presentation.
5. `remotion-animation` for explicit animation parameter guidance.

## Tech stack

- Remotion + Tailwind for video generation.
- Project location: `videos/` directory.
- Render: `npx remotion render MainVideo out/video.mp4`
- Preview: `npx remotion studio`
