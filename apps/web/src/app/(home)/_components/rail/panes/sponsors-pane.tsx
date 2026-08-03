"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

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

function SponsorRow({
  entry,
  dim,
  featured,
}: {
  entry: SponsorEntry;
  dim?: boolean;
  featured?: boolean;
}) {
  const showTotal = shouldShowLifetimeTotal(entry);
  const wasSpecial = dim && isLifetimeSpecialSponsor(entry);

  return (
    <li className={cn("flex items-start gap-3", featured ? "py-3" : "py-2")}>
      <Image
        src={entry.avatarUrl}
        alt=""
        width={featured ? 44 : 28}
        height={featured ? 44 : 28}
        className={cn(
          "mt-0.5 shrink-0 rounded-[4px]",
          featured ? "size-11 border" : "size-7",
          dim && "opacity-60",
        )}
        unoptimized
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-x-3 gap-y-0.5 max-sm:flex-col max-sm:items-start">
          <a
            href={entry.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "builder-focus-ring wrap-anywhere font-mono leading-[1.55] transition-colors duration-150 hover:text-primary",
              featured ? "text-[15px] tracking-[-0.01em]" : "text-[13px]",
              dim && "text-fd-muted-foreground",
            )}
          >
            {entry.name}
          </a>
          <span
            className={cn(
              "shrink-0 font-mono text-[11px]",
              featured ? "text-primary" : "text-fd-muted-foreground",
            )}
          >
            {wasSpecial ? `special · ${entry.tierName}` : entry.tierName}
          </span>
        </div>

        <div className="flex items-baseline justify-between gap-x-3 gap-y-0.5 font-mono text-[11px] text-fd-muted-foreground max-sm:flex-col max-sm:items-start">
          <span className="wrap-anywhere">
            @{entry.githubId}
            {entry.websiteUrl && (
              <>
                {" · "}
                <a
                  href={getSponsorUrl(entry)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="builder-focus-ring transition-colors duration-150 hover:text-fd-foreground"
                >
                  {getSponsorUrlLabel(entry)}
                </a>
              </>
            )}
          </span>
          <span className="shrink-0 tabular-nums">
            {showTotal && `${entry.formattedAmount} · `}
            {entry.sinceWhen}
          </span>
        </div>
      </div>
    </li>
  );
}

export default function SponsorsPane({ sponsorsData }: { sponsorsData: SponsorsData }) {
  const [showPast, setShowPast] = useState(false);
  const { specialSponsors, sponsors, pastSponsors } = sponsorsData;

  return (
    <>
      {specialSponsors.length > 0 && (
        <div>
          <GroupHeader label="special" count={specialSponsors.length} />
          <ul className="divide-y">
            {specialSponsors.map((entry) => (
              <SponsorRow key={entry.githubId} entry={entry} featured />
            ))}
          </ul>
        </div>
      )}

      {sponsors.length > 0 && (
        <div>
          <GroupHeader label="current" count={sponsors.length} />
          <ul>
            {sponsors.map((entry) => (
              <SponsorRow key={entry.githubId} entry={entry} />
            ))}
          </ul>
        </div>
      )}

      {pastSponsors.length > 0 && (
        <div>
          <button
            type="button"
            onClick={() => setShowPast(!showPast)}
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
            <ul>
              {pastSponsors.map((entry) => (
                <SponsorRow key={entry.githubId} entry={entry} dim />
              ))}
            </ul>
          )}
        </div>
      )}
    </>
  );
}

export function SponsorsPaneFooter() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
      <a
        href="https://github.com/sponsors/AmanVarshney01"
        target="_blank"
        rel="noopener noreferrer"
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
