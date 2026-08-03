"use client";

import { api } from "@better-t-stack/backend/convex/_generated/api";
import { useQuery } from "convex/react";

import { GroupHeader } from "../chrome";

// Fetch well past what fits so the "last hour" count is accurate: at the current
// ~227 projects/day (~9.5/hour) 60 rows covers a busy hour with headroom.
const FEED_LIMIT = 60;
const ONE_HOUR_MS = 60 * 60 * 1000;

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

type FeedEvent = {
  _id: string;
  _creationTime: number;
  frontend?: string[];
  backend?: string;
  database?: string;
};

/** Same shape the analytics log uses, trimmed to what fits a 632px pane. */
function summarize(event: FeedEvent): string {
  const parts = [
    event.frontend?.length ? event.frontend.join("+") : null,
    event.backend && event.backend !== "none" ? event.backend : null,
    event.database && event.database !== "none" ? event.database : null,
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(" + ") : "empty stack";
}

export default function LiveFeed() {
  const events = useQuery(api.analytics.getRecentEvents, { limit: FEED_LIMIT }) as
    | FeedEvent[]
    | undefined;

  // Date.now() only runs once events resolve, which is client-only, so this
  // cannot desync during hydration.
  const lastHour = events
    ? events.filter((event) => Date.now() - event._creationTime < ONE_HOUR_MS).length
    : null;

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
            {lastHour === null ? "connecting" : `${lastHour} in the last hour`}
          </span>
        }
      />

      <ol
        aria-label="Recent project starts"
        className="fd-scroll-container min-h-0 flex-1 overflow-hidden font-mono text-[11px] leading-[1.7]"
      >
        {events?.map((event) => (
          <li key={event._id} className="flex items-baseline gap-3">
            <span className="shrink-0 text-fd-muted-foreground/60 tabular-nums">
              {timeFormatter.format(event._creationTime)}
            </span>
            <span className="truncate text-fd-muted-foreground">{summarize(event)}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
