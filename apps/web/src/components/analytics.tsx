"use client";

import { useSearchContext } from "fumadocs-ui/contexts/search";
import Script from "next/script";
import { useEffect, useRef } from "react";

import {
  beforeSend,
  flushPendingEvents,
  getOutboundEvent,
  readTrackAttrs,
  track,
  TRACK_ATTRIBUTE,
  trackRaw,
} from "@/lib/analytics";
import { SITE_URL } from "@/lib/site";

const UMAMI_SCRIPT_URL = "https://umami.amanv.cloud/script.js";
const UMAMI_WEBSITE_ID = "3fe218f9-a51b-40c3-ab37-d65e6963d686";
const SITE_HOST = new URL(SITE_URL).hostname;
const TRACKED_DOMAINS = [SITE_HOST, SITE_HOST.replace(/^www\./, "")].join(",");

function handleDocumentClick(event: MouseEvent) {
  const target = event.target;
  if (!(target instanceof Element)) return;

  const declared = target.closest(`[${TRACK_ATTRIBUTE}]`);
  if (declared) {
    const parsed = readTrackAttrs(declared);
    if (parsed) trackRaw(parsed[0], parsed[1]);
    return;
  }

  const anchor = target.closest("a[href]");
  if (!(anchor instanceof HTMLAnchorElement)) return;
  const outbound = getOutboundEvent(anchor, window.location);
  if (!outbound) return;
  trackRaw(outbound[0], outbound[1]);
}

function SearchOpenTracker() {
  const { open } = useSearchContext();
  const wasOpen = useRef(false);

  useEffect(() => {
    if (open && !wasOpen.current) track("search_open", {});
    wasOpen.current = open;
  }, [open]);

  return null;
}

export function Analytics() {
  useEffect(() => {
    window.btsBeforeSend = beforeSend;
    document.addEventListener("click", handleDocumentClick);
    return () => {
      document.removeEventListener("click", handleDocumentClick);
      delete window.btsBeforeSend;
    };
  }, []);

  return (
    <>
      <Script
        src={UMAMI_SCRIPT_URL}
        data-website-id={UMAMI_WEBSITE_ID}
        data-domains={TRACKED_DOMAINS}
        data-before-send="btsBeforeSend"
        strategy="afterInteractive"
        onLoad={flushPendingEvents}
      />
      <SearchOpenTracker />
    </>
  );
}
