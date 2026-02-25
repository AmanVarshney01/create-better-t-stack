"use client";

import { Github, Globe, Plus, Star } from "lucide-react";
import Image from "next/image";

import type { Sponsor } from "@/lib/types";

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { formatSponsorUrl, getSponsorUrl, shouldShowLifetimeTotal } from "@/lib/sponsor-utils";
import { cn } from "@/lib/utils";

type SpecialSponsorsPanelProps = {
  sponsors: Sponsor[];
  compact?: boolean;
};

const SPONSOR_ME_URL = "https://github.com/sponsors/AmanVarshney01";

export function SpecialSponsorsPanel({ sponsors, compact = false }: SpecialSponsorsPanelProps) {
  if (!sponsors.length) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <p className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground uppercase tracking-wide">
          <Star className="h-3.5 w-3.5 text-yellow-500/90" />
          Special sponsors
        </p>
        <span className="rounded-md bg-muted/20 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground uppercase">
          {sponsors.length}
        </span>
      </div>

      <div className="no-scrollbar flex items-center gap-2 overflow-x-auto pb-1">
        {sponsors.map((entry) => {
          const sponsorUrl = getSponsorUrl(entry);

          return (
            <HoverCard key={entry.githubId}>
              <HoverCardTrigger
                render={
                  <a
                    href={sponsorUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={entry.name}
                    className="inline-flex rounded-md"
                  />
                }
              >
                <Image
                  src={entry.avatarUrl}
                  alt={entry.name}
                  width={64}
                  height={64}
                  className={cn(
                    "rounded-md border border-border/70 transition-colors hover:border-primary/40",
                    compact ? "h-9 w-9" : "h-10 w-10",
                  )}
                  unoptimized
                />
              </HoverCardTrigger>

              <HoverCardContent align="start" sideOffset={8} className="bg-fd-background">
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <Image
                      src={entry.avatarUrl}
                      alt={entry.name}
                      width={48}
                      height={48}
                      className="h-11 w-11 rounded border border-border"
                      unoptimized
                    />
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-sm">{entry.name}</h3>
                      {shouldShowLifetimeTotal(entry) ? (
                        <>
                          {entry.tierName && (
                            <p className="text-primary text-xs">{entry.tierName}</p>
                          )}
                          <p className="text-muted-foreground text-xs">
                            Total: {entry.formattedAmount}
                          </p>
                        </>
                      ) : (
                        <p className="text-primary text-xs">{entry.tierName}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <a
                      href={entry.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-2 text-muted-foreground text-xs transition-colors hover:text-primary"
                    >
                      <Github className="h-3.5 w-3.5" />
                      <span className="truncate">{entry.githubId}</span>
                    </a>
                    {entry.websiteUrl ? (
                      <a
                        href={sponsorUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-2 text-muted-foreground text-xs transition-colors hover:text-primary"
                      >
                        <Globe className="h-3.5 w-3.5" />
                        <span className="truncate">{formatSponsorUrl(sponsorUrl)}</span>
                      </a>
                    ) : null}
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          );
        })}

        <HoverCard>
          <HoverCardTrigger
            render={
              <a
                href={SPONSOR_ME_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Become a sponsor"
                className={cn(
                  "builder-focus-ring inline-flex items-center justify-center rounded-md border border-dashed border-primary/40 bg-primary/10 text-primary transition-colors hover:border-primary/60 hover:bg-primary/16",
                  compact ? "h-9 w-9" : "h-10 w-10",
                )}
              />
            }
          >
            <Plus className="h-4 w-4" />
          </HoverCardTrigger>
          <HoverCardContent align="start" sideOffset={8} className="bg-fd-background">
            <div className="space-y-1.5">
              <p className="font-semibold text-sm">Become a sponsor</p>
              <p className="text-muted-foreground text-xs">
                Support the project and get featured in this special sponsors list.
              </p>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
    </div>
  );
}
