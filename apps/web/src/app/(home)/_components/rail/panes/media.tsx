"use client";

import Image from "next/image";
import { type ReactNode, useEffect, useRef, useState } from "react";
import type { TwitterComponents } from "react-tweet";

import { track } from "@/lib/analytics";

export const components: TwitterComponents = {
  AvatarImg: (props) => {
    if (!props.src) {
      return <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted" />;
    }
    return <Image {...props} alt={props.alt || "User avatar"} unoptimized />;
  },
  MediaImg: (props) => {
    if (!props.src) {
      return <div className="flex h-32 w-full items-center justify-center bg-muted" />;
    }
    return <Image {...props} alt={props.alt || "Media content"} fill unoptimized />;
  },
};

export function Deferred({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || shown) return;
    const root = el.closest("[data-pane-scroll]") as HTMLElement | null;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) setShown(true);
      },
      { root, rootMargin: "0px 0px 400px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [shown]);

  return (
    <div ref={ref} style={{ containIntrinsicSize: "0 320px", contentVisibility: "auto" }}>
      {shown ? children : null}
    </div>
  );
}

export function ItemLabel({ label }: { label: string }) {
  return (
    <div className="mb-2 flex items-center gap-3">
      <span className="font-mono text-[10px] text-fd-muted-foreground/50 uppercase tracking-[0.10em]">
        {label}
      </span>
      <span aria-hidden="true" className="h-px flex-1 bg-fd-border" />
    </div>
  );
}

export function VideoCard({
  video,
  index,
}: {
  video: { embedId: string; title: string };
  index: number;
}) {
  const [playing, setPlaying] = useState(false);

  return (
    <div>
      <ItemLabel label={`video ${String(index + 1).padStart(3, "0")}`} />
      <div className="relative aspect-video w-full overflow-hidden rounded-[4px] border">
        {playing ? (
          <iframe
            src={`https://www.youtube.com/embed/${video.embedId}?autoplay=1`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <button
            type="button"
            onClick={() => {
              track("home_video_play", { video: video.embedId, title: video.title });
              setPlaying(true);
            }}
            aria-label={`Play ${video.title}`}
            className="builder-focus-ring group absolute inset-0 h-full w-full"
          >
            {/* Plain img: ytimg is not in next.config remote patterns. */}
            <img
              src={`https://i.ytimg.com/vi/${video.embedId}/hqdefault.jpg`}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover"
            />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="bg-fd-background/90 px-2 py-1 font-mono text-[11px] uppercase tracking-[0.08em] transition-colors duration-150 group-hover:text-primary">
                play
              </span>
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
