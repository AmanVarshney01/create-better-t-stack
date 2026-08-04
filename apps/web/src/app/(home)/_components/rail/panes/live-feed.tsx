"use client";

import { api } from "@better-t-stack/backend/convex/_generated/api";
import { useQuery } from "convex/react";
import { useEffect, useState } from "react";

import { GroupHeader } from "../chrome";

// 50 is the server-side cap in getRecentEvents. At ~227 projects/day
// (~9.5/hour) that still covers a busy hour for the last-hour count.
const FEED_LIMIT = 50;
const ONE_HOUR_MS = 60 * 60 * 1000;

/** Relative, so the row never depends on the reader's timezone. */
function ago(createdAt: number, now: number): string {
  const seconds = Math.max(0, Math.round((now - createdAt) / 1000));
  if (seconds < 60) return "just now";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

type FeedEvent = {
  _id: string;
  _creationTime: number;
  frontend?: string[];
  backend?: string;
  runtime?: string;
  database?: string;
  orm?: string;
  api?: string;
  auth?: string;
  dbSetup?: string;
  webDeploy?: string;
  serverDeploy?: string;
};

function pick(value: string | undefined): string | null {
  return value && value !== "none" ? value : null;
}

/** The stack decisions worth reading at a glance, in the order someone would
 *  say them out loud. "none" picks are dropped rather than printed. Runtime is
 *  omitted deliberately: it is implied by the backend far more often than not. */
function summarize(event: FeedEvent): string {
  const parts = [
    event.frontend?.length ? event.frontend.join("+") : null,
    pick(event.backend),
    pick(event.database),
    pick(event.orm),
    pick(event.api),
    pick(event.auth),
    pick(event.dbSetup),
    pick(event.webDeploy),
    pick(event.serverDeploy),
  ].filter(Boolean) as string[];

  // web and server deploy are usually the same provider, and printing
  // "cloudflare + cloudflare" reads as a bug rather than as two choices.
  const seen = new Set<string>();
  const unique = parts.filter((part) => !seen.has(part) && seen.add(part));

  return unique.length > 0 ? unique.join(" + ") : "empty stack";
}

export default function LiveFeed() {
  const events = useQuery(api.analytics.getRecentEvents, { limit: FEED_LIMIT }) as
    | FeedEvent[]
    | undefined;

  // The clock lives in state rather than being read during render: events age
  // out without a new query arriving, and Date.now() is not a dependency the
  // React Compiler can see, so it would happily cache a stale count.
  // null until the effect runs, which also keeps hydration deterministic.
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);

  const inLastHour =
    events && now !== null
      ? events.filter((event) => now - event._creationTime < ONE_HOUR_MS).length
      : null;
  // Every fetched row falling inside the window means the query cap clipped it,
  // so the number is a floor rather than a total.
  const saturated =
    inLastHour !== null && inLastHour === events?.length && inLastHour === FEED_LIMIT;

  return (
    /* Below ~820px tall the group header alone costs more room than the pane
       has spare, so the feed drops out entirely rather than forcing a scrollbar. */
    <div className="flex min-h-0 flex-1 flex-col max-md:hidden [@media(max-height:820px)]:hidden">
      <GroupHeader
        label="live"
        count={
          <span className="inline-flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className={events ? "size-1.5 bg-primary" : "size-1.5 bg-fd-muted-foreground/40"}
            />
            {inLastHour === null
              ? "connecting"
              : `${inLastHour}${saturated ? "+" : ""} in the last hour`}
          </span>
        }
      />

      <ol
        aria-label="Recent project starts"
        data-pane-scroll
        className="fd-scroll-container min-h-0 flex-1 overflow-y-auto overscroll-y-contain font-mono text-[11px] leading-[1.7]"
      >
        {events?.map((event) => (
          <li key={event._id} className="flex items-baseline gap-3 py-px">
            <span className="w-[7ch] shrink-0 text-right text-fd-muted-foreground/60 tabular-nums">
              {now === null ? "" : ago(event._creationTime, now)}
            </span>
            {/* Wraps rather than truncates: a clipped stack hides the very picks
                the feed exists to show. Fewer rows, none of them lying. */}
            <span className="min-w-0 text-fd-muted-foreground">{summarize(event)}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
