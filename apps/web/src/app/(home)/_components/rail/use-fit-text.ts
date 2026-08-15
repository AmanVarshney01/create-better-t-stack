"use client";

import { type RefObject, useEffect, useLayoutEffect } from "react";

// Correct before paint on the client so a clipped frame is never shown,
// without tripping the SSR warning.
const useIsomorphicLayoutEffect = globalThis.window === undefined ? useEffect : useLayoutEffect;

/**
 * Shrinks a <pre> until it actually fits its parent.
 *
 * The CSS sizes the banner from an assumed monospace advance, which holds only
 * while every glyph comes from one font. Geist Mono has no box-drawing range,
 * so those glyphs fall back to a system face whose advance can differ, and the
 * line then renders wider than any precomputed divisor allows. Measuring is the
 * only device-independent answer.
 */
export function useFitText(ref: RefObject<HTMLPreElement | null>) {
  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    const parent = el?.parentElement;
    if (!el || !parent) return;

    const fit = () => {
      el.style.fontSize = "";
      const available = parent.clientWidth;
      const natural = el.scrollWidth;
      if (!available || !natural || natural <= available) return;
      const current = Number.parseFloat(getComputedStyle(el).fontSize);
      // 0.99 keeps a hair of margin instead of sitting flush against the clip.
      el.style.fontSize = `${(current * available * 0.99) / natural}px`;
    };

    fit();

    const observer = new ResizeObserver(fit);
    observer.observe(parent);
    // Fallback glyph metrics can change once fonts settle.
    document.fonts?.ready.then(fit).catch(() => {});

    return () => observer.disconnect();
  }, [ref]);
}
