"use client";

import { type RefObject, useCallback, useEffect, useRef, useState } from "react";

import { PANES } from "./panes-config";

const DESKTOP_QUERY = "(min-width: 768px)";
// Sticky site nav (h-14) plus the sticky pane header (h-8): the line a stacked
// pane's top edge has to cross before that pane counts as the active one.
const MOBILE_PROBE_PX = 56 + 32;

export function useRailNav(railRef: RefObject<HTMLDivElement | null>) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const offsetsRef = useRef<number[]>([]);

  const measure = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    const railLeft = rail.getBoundingClientRect().left;
    offsetsRef.current = PANES.map((pane) => {
      const el = document.getElementById(pane.id);
      if (!el) return 0;
      return el.getBoundingClientRect().left - railLeft + rail.scrollLeft;
    });
    // Edge flags belong here too: on first paint scrollWidth still equals
    // clientWidth, which would leave the rail reading as "at the end".
    setAtStart(rail.scrollLeft <= 1);
    setAtEnd(rail.scrollLeft >= rail.scrollWidth - rail.clientWidth - 1);
  }, [railRef]);

  const goTo = useCallback(
    (index: number) => {
      const rail = railRef.current;
      if (!rail) return;
      const clamped = Math.min(Math.max(index, 0), PANES.length - 1);
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const behavior: ScrollBehavior = reduced ? "auto" : "smooth";

      if (!window.matchMedia(DESKTOP_QUERY).matches) {
        document.getElementById(PANES[clamped].id)?.scrollIntoView({ block: "start", behavior });
        return;
      }

      rail.scrollTo({ left: offsetsRef.current[clamped] ?? 0, behavior });
    },
    [railRef],
  );

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    measure();
    const settle = requestAnimationFrame(measure);

    const observer = new ResizeObserver(measure);
    observer.observe(rail);
    for (const pane of PANES) {
      const el = document.getElementById(pane.id);
      if (el) observer.observe(el);
    }

    const hash = window.location.hash.slice(1);
    if (hash && PANES.some((pane) => pane.id === hash)) {
      const index = PANES.findIndex((pane) => pane.id === hash);
      requestAnimationFrame(() => {
        measure();
        rail.scrollTo({ left: offsetsRef.current[index] ?? 0, behavior: "auto" });
      });
    }

    return () => {
      cancelAnimationFrame(settle);
      observer.disconnect();
    };
  }, [measure, railRef]);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    let frame = 0;

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        // Stacked layout has its own tracker below; the horizontal probe would
        // otherwise read every pane offset as 0 and mark the last one active.
        if (!window.matchMedia(DESKTOP_QUERY).matches) return;
        // Active pane is the last one whose left edge has crossed the probe line.
        // Nearest-offset picks the wrong pane when the first pane is wider than the probe.
        const probe = rail.scrollLeft + rail.clientWidth / 3;
        let best = 0;
        offsetsRef.current.forEach((offset, index) => {
          if (offset <= probe) best = index;
        });

        PANES.forEach((pane, index) => {
          const el = document.getElementById(pane.id);
          if (el) el.dataset.active = index === best ? "true" : "false";
        });

        setActiveIndex((previous) => (previous === best ? previous : best));
        setAtStart(rail.scrollLeft <= 1);
        setAtEnd(rail.scrollLeft >= rail.scrollWidth - rail.clientWidth - 1);
      });
    };

    onScroll();
    rail.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      rail.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [railRef]);

  // Below md the panes stack vertically and the rail itself never scrolls, so the
  // horizontal probe above sees every offset at 0 and marks the last pane active.
  // The stacked layout has to be tracked off the document scroll instead.
  useEffect(() => {
    const desktop = window.matchMedia(DESKTOP_QUERY);
    let frame = 0;

    const update = () => {
      frame = 0;
      if (desktop.matches) return;
      let best = 0;
      PANES.forEach((pane, index) => {
        const el = document.getElementById(pane.id);
        if (el && el.getBoundingClientRect().top <= MOBILE_PROBE_PX) best = index;
      });
      PANES.forEach((pane, index) => {
        const el = document.getElementById(pane.id);
        if (el) el.dataset.active = index === best ? "true" : "false";
      });
      setActiveIndex((previous) => (previous === best ? previous : best));
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    desktop.addEventListener("change", update);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      desktop.removeEventListener("change", update);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (!window.matchMedia(DESKTOP_QUERY).matches) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest('input, textarea, select, [contenteditable="true"], [role="slider"]')) {
        return;
      }

      const digit = Number.parseInt(event.key, 10);
      if (!Number.isNaN(digit) && digit >= 1 && digit <= PANES.length) {
        event.preventDefault();
        goTo(digit - 1);
        return;
      }

      switch (event.key) {
        case "ArrowRight":
        case "l":
          event.preventDefault();
          goTo(activeIndex + 1);
          break;
        case "ArrowLeft":
        case "h":
          event.preventDefault();
          goTo(activeIndex - 1);
          break;
        case "Home":
        case "g":
          event.preventDefault();
          goTo(0);
          break;
        case "End":
        case "G":
          event.preventDefault();
          goTo(PANES.length - 1);
          break;
        default:
          break;
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, goTo]);

  return { activeIndex, atStart, atEnd, goTo };
}
