"use client";

import { Globe, Plus, Star } from "lucide-react";
import Image from "next/image";
import { FaGithub } from "react-icons/fa6";

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { trackAttrs } from "@/lib/analytics";
import { getSponsorUrl, getSponsorUrlLabel, shouldShowLifetimeTotal } from "@/lib/sponsor-utils";
import type { Sponsor } from "@/lib/types";
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
      <div className="flex items-center gap-3">
        <p className="flex items-center gap-1.5 font-mono text-[11px] text-fd-muted-foreground uppercase tracking-[0.08em]">
          <Star aria-hidden="true" className="h-3 w-3 text-fd-muted-foreground" />
          Special sponsors
        </p>
        <span aria-hidden="true" className="h-px flex-1 bg-fd-border" />
        <span className="font-mono text-[10px] text-fd-muted-foreground tabular-nums">
          {sponsors.length}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
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
                    className="builder-focus-ring inline-flex shrink-0"
                    {...trackAttrs("sponsor_click", {
                      sponsor: entry.githubId,
                      target: entry.websiteUrl ? "website" : "github",
                      location: "builder",
                    })}
                  />
                }
              >
                <Image
                  src={entry.avatarUrl}
                  alt={entry.name}
                  width={64}
                  height={64}
                  className={cn(
                    "shrink-0 rounded-md border transition-colors duration-150 hover:border-primary",
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
                      className="h-11 w-11 rounded border"
                      unoptimized
                    />
                    <div className="min-w-0">
                      <h3 className="truncate font-mono text-[13px] leading-[1.55]">
                        {entry.name}
                      </h3>
                      {shouldShowLifetimeTotal(entry) ? (
                        <>
                          {entry.tierName && (
                            <p className="font-mono text-[11px] text-fd-muted-foreground uppercase tracking-[0.08em]">
                              {entry.tierName}
                            </p>
                          )}
                          <p className="font-mono text-[11px] text-fd-muted-foreground tabular-nums">
                            Total: {entry.formattedAmount}
                          </p>
                        </>
                      ) : (
                        <p className="font-mono text-[11px] text-fd-muted-foreground uppercase tracking-[0.08em]">
                          {entry.tierName}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <a
                      href={entry.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-2 font-mono text-[11px] text-fd-muted-foreground transition-colors duration-150 hover:text-primary"
                      {...trackAttrs("sponsor_click", {
                        sponsor: entry.githubId,
                        target: "github",
                        location: "builder",
                      })}
                    >
                      <FaGithub className="h-3.5 w-3.5" />
                      <span className="truncate">{entry.githubId}</span>
                    </a>
                    {entry.websiteUrl ? (
                      <a
                        href={sponsorUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-2 font-mono text-[11px] text-fd-muted-foreground transition-colors duration-150 hover:text-primary"
                        {...trackAttrs("sponsor_click", {
                          sponsor: entry.githubId,
                          target: "website",
                          location: "builder",
                        })}
                      >
                        <Globe className="h-3.5 w-3.5" />
                        <span className="truncate">{getSponsorUrlLabel(entry)}</span>
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
                {...trackAttrs("sponsor_click", {
                  sponsor: "AmanVarshney01",
                  target: "sponsor-me",
                  location: "builder",
                })}
                className={cn(
                  "builder-focus-ring inline-flex shrink-0 items-center justify-center rounded-[4px] border border-dashed text-primary transition-colors duration-150 hover:border-primary",
                  compact ? "h-9 w-9" : "h-10 w-10",
                )}
              />
            }
          >
            <Plus className="h-4 w-4" />
          </HoverCardTrigger>
          <HoverCardContent align="start" sideOffset={8} className="bg-fd-background">
            <div className="space-y-1.5">
              <p className="font-mono text-[13px] leading-[1.55]">Become a sponsor</p>
              <p className="font-mono text-[11px] text-fd-muted-foreground leading-[1.5]">
                Support the project and get featured in this special sponsors list.
              </p>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
    </div>
  );
}
