"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { track, trackAttrs } from "@/lib/analytics";
import {
  getSponsorUrl,
  getSponsorUrlLabel,
  isLifetimeSpecialSponsor,
  shouldShowLifetimeTotal,
} from "@/lib/sponsor-utils";
import type { SponsorsData } from "@/lib/types";
import { cn } from "@/lib/utils";

import { GroupHeader } from "../chrome";

type SponsorEntry = SponsorsData["sponsors"][number];

function SponsorTile({
  entry,
  size = "md",
  dim,
}: {
  entry: SponsorEntry;
  size?: "lg" | "md";
  dim?: boolean;
}) {
  const large = size === "lg";
  const showTotal = shouldShowLifetimeTotal(entry);
  const wasSpecial = dim && isLifetimeSpecialSponsor(entry);

  return (
    <li
      className={cn(
        "flex min-w-0 flex-col justify-between gap-3 rounded-[4px] border p-3 transition-colors duration-150 hover:border-fd-muted-foreground/40",
        dim && "opacity-70",
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <Image
          src={entry.avatarUrl}
          alt=""
          width={large ? 48 : 36}
          height={large ? 48 : 36}
          className={cn("shrink-0 rounded-[4px] border", large ? "size-12" : "size-9")}
          unoptimized
        />
        <div className="min-w-0 flex-1">
          <a
            href={entry.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            {...trackAttrs("sponsor_click", {
              sponsor: entry.githubId,
              target: "github",
              location: "home",
            })}
            className={cn(
              "builder-focus-ring block wrap-anywhere font-mono leading-[1.4] transition-colors duration-150 hover:text-primary",
              large ? "text-[15px] tracking-[-0.01em]" : "text-[13px]",
            )}
          >
            {entry.name}
          </a>
          <span className="block truncate font-mono text-[11px] text-fd-muted-foreground">
            @{entry.githubId}
          </span>
        </div>
      </div>

      {/* Stacked, not justify-between: wrapping made tile heights inconsistent. */}
      <div className="flex flex-col gap-0.5">
        <span
          className={cn(
            "truncate font-mono text-[11px]",
            large ? "text-primary" : "text-fd-muted-foreground",
          )}
        >
          {wasSpecial ? `special \u00b7 ${entry.tierName}` : entry.tierName}
        </span>
        <span className="truncate font-mono text-[11px] text-fd-muted-foreground tabular-nums">
          {showTotal && `${entry.formattedAmount} \u00b7 `}
          {entry.sinceWhen}
        </span>
      </div>

      {entry.websiteUrl && (
        <a
          href={getSponsorUrl(entry)}
          target="_blank"
          rel="noopener noreferrer"
          {...trackAttrs("sponsor_click", {
            sponsor: entry.githubId,
            target: "website",
            location: "home",
          })}
          className="builder-focus-ring -mt-1 truncate font-mono text-[11px] text-fd-muted-foreground transition-colors duration-150 hover:text-fd-foreground"
        >
          {getSponsorUrlLabel(entry)}
        </a>
      )}
    </li>
  );
}

export default function SponsorsPane({ sponsorsData }: { sponsorsData: SponsorsData }) {
  const [showPast, setShowPast] = useState(false);
  const { specialSponsors, sponsors, pastSponsors } = sponsorsData;

  return (
    <div className="@container flex flex-col gap-6">
      {specialSponsors.length > 0 && (
        <div>
          <GroupHeader label="special" count={specialSponsors.length} />
          <ul className="grid grid-cols-1 gap-3 @sm:grid-cols-2">
            {specialSponsors.map((entry) => (
              <SponsorTile key={entry.githubId} entry={entry} size="lg" />
            ))}
          </ul>
        </div>
      )}

      {sponsors.length > 0 && (
        <div>
          <GroupHeader label="current" count={sponsors.length} />
          <ul className="grid grid-cols-1 gap-3 @sm:grid-cols-2">
            {sponsors.map((entry) => (
              <SponsorTile key={entry.githubId} entry={entry} />
            ))}
          </ul>
        </div>
      )}

      {pastSponsors.length > 0 && (
        <div>
          <button
            type="button"
            onClick={() => {
              track("home_past_sponsors", { shown: !showPast });
              setShowPast(!showPast);
            }}
            aria-expanded={showPast}
            className="builder-focus-ring -mt-2 mb-1 flex w-full items-center gap-3 py-2 text-left"
          >
            <span className="font-mono text-[10px] text-fd-muted-foreground/70 uppercase tracking-[0.10em]">
              past
            </span>
            <span aria-hidden="true" className="h-px flex-1 bg-fd-border" />
            <span className="font-mono text-[10px] text-fd-muted-foreground/50 tabular-nums">
              {pastSponsors.length}
            </span>
            <span className="font-mono text-[10px] text-fd-muted-foreground uppercase tracking-[0.10em]">
              {showPast ? "hide" : "show"}
            </span>
          </button>
          {showPast && (
            <ul className="grid grid-cols-1 gap-3 @sm:grid-cols-2">
              {pastSponsors.map((entry) => (
                <SponsorTile key={entry.githubId} entry={entry} dim />
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export function SponsorsPaneFooter() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
      <a
        href="https://github.com/sponsors/AmanVarshney01"
        target="_blank"
        rel="noopener noreferrer"
        {...trackAttrs("sponsor_click", {
          sponsor: "AmanVarshney01",
          target: "sponsor-me",
          location: "home",
        })}
        className="builder-focus-ring font-mono text-[13px] text-primary transition-colors duration-150 hover:text-primary/70"
      >
        become a sponsor -&gt;
      </a>
      <Link
        href="/sponsors"
        className="builder-focus-ring font-mono text-[11px] text-fd-muted-foreground uppercase tracking-[0.08em] transition-colors duration-150 hover:text-fd-foreground"
      >
        view all
      </Link>
    </div>
  );
}
