# Remotion Video Style

Use this guide for Remotion videos made for this project unless the user asks for a different direction.

## Default look

- Default to short-form videos in the 10-20 second range.
- Follow an OpenCode-inspired dark palette taken from the live homepage, especially the background treatment.
- Follow the Vercel/Geist visual language for layout, typography, icon handling, and motion.
- Keep the result sharp, minimal, premium, and technical rather than playful, loud, or cartoonish.

## Color system

Use these as the default palette unless the user overrides it:

- Background: `#0c0c0e`
- Surface: `#161618`
- Elevated surface: `#1c1c1f`
- Primary text: `#ffffff`
- Secondary text: `#c7c7cc`
- Muted text: `#a1a1a6`
- Border: `#38383a`
- Muted border: `#2c2c2e`
- Accent: `#007aff`
- Accent hover/deeper emphasis: `#0056b3`
- Accent active/deepest emphasis: `#004085`

Apply the palette like this:

- Keep most frames dark, with the background close to `#0c0c0e`.
- Use the accent blue sparingly for focus points, key icons, active states, graph highlights, or CTA moments.
- Prefer grayscale layers over colorful gradients.
- Avoid warm or saturated accent colors unless the prompt explicitly asks for them.

## Visual direction

- Use a Vercel-like composition style: generous spacing, crisp alignment, restrained color, and clear visual hierarchy.
- Prefer clean geometric layouts, panels, cards, terminal/code motifs, grids, and product-demo framing.
- Use icons instead of emojis.
- Prefer polished outline or solid icons that feel compatible with Geist-style UI.
- Keep icon sizes bold enough to read quickly on short scenes.

## Typography

- Use Geist-style typography when available.
- Prefer strong sans-serif headlines with tight tracking and compact line breaks.
- Use mono text only for terminal snippets, code labels, timing marks, or technical callouts.
- Keep on-screen copy short. A scene should usually communicate one idea.

## Motion rules

- Favor spring-based motion, smooth easing, and precise timing over flashy bounces.
- Use fast, confident entrances and clean exits.
- Keep transitions elegant and brief; do not let transitions dominate the runtime.
- Use staggered reveals, masked wipes, parallax, scale, blur-to-sharp, and subtle depth shifts when useful.
- Avoid random movement, oversized elastic effects, or constant floating motion.

## Scene structure

- Build around 3-6 scenes for a 10-20 second video.
- Open with a strong hero frame in the first second.
- Introduce the main value quickly, then show one idea per scene.
- Reserve the strongest transition or visual flourish for the midpoint or final beat.
- End on a clean branded frame, product name, or concise CTA.

## Icons and assets

- Use icons as core storytelling elements, not just decoration.
- Animate icons with scale, rotation, position shifts, path reveals, or layered transitions.
- Keep icons consistent in stroke weight and visual family within a single video.
- Put icons on dark surfaces with enough contrast to read immediately.
- If mixing screenshots with icons, simplify the screenshot framing so the icon motion remains the focal point.

## Skill usage defaults

When multiple installed skills overlap, use them in this order:

1. `remotion-best-practices` for core Remotion decisions.
2. `modern-short-video` for pacing, short-form structure, and promo-style editing.
3. `remotion-bits` for premium motion components and transitions.
4. `create-remotion-geist` for typography, icon usage, and Vercel-like presentation.
5. `remotion-animation` when animation tuning needs more explicit parameter guidance.

Use the broader `remotion` and `video-production` skills only when the task clearly needs their extra workflow or tooling guidance.

## What to avoid

- Do not default to bright multi-color backgrounds.
- Do not use emoji-heavy or meme-style motion.
- Do not overload scenes with too many simultaneous animated elements.
- Do not turn every transition into a spectacle.
- Do not copy Vercel branding directly; borrow the design discipline, not the brand identity.

## Source notes

This guide is based on:

- OpenCode homepage dark theme values observed on `https://opencode.ai/` on 2026-03-07.
- The installed `create-remotion-geist` skill's Vercel/Geist design guidance.
