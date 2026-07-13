import { Archive, Globe, Heart, Star, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FaGithub } from "react-icons/fa6";

import {
  getSponsorUrl,
  getSponsorUrlLabel,
  isLifetimeSpecialSponsor,
  shouldShowLifetimeTotal,
} from "@/lib/sponsor-utils";
import type { Sponsor, SponsorsData } from "@/lib/types";

import Footer from "../../_components/footer";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function VercelLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 76 65" fill="currentColor" aria-hidden className={className}>
      <path d="M37.59.25l36.95 64H.64l36.95-64z" />
    </svg>
  );
}

function SectionHeader({
  icon,
  title,
  count,
}: {
  icon: React.ReactNode;
  title: string;
  count: number;
}) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <h2 className="font-mono font-semibold text-sm sm:text-base">{title}</h2>
      <div className="mx-2 h-px flex-1 bg-border" />
      <span className="font-mono text-muted-foreground text-xs">[{count} RECORDS]</span>
    </div>
  );
}

function LedgerTile({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="min-w-0 rounded border border-border bg-fd-background p-4">
      <div className="font-mono text-[11px] text-muted-foreground uppercase tracking-wide">
        {label}
      </div>
      <div className="mt-2 truncate font-semibold text-2xl">{value}</div>
      <p className="mt-1 text-muted-foreground text-xs">{detail}</p>
    </div>
  );
}

function SponsorLinks({ sponsor, muted = false }: { sponsor: Sponsor; muted?: boolean }) {
  const sponsorUrl = getSponsorUrl(sponsor);
  const linkClass = muted
    ? "group flex items-center gap-2 text-muted-foreground/70 text-xs transition-colors hover:text-muted-foreground"
    : "group flex items-center gap-2 text-muted-foreground text-xs transition-colors hover:text-primary";

  return (
    <div className="flex flex-col">
      <a href={sponsor.githubUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
        <FaGithub className="size-3 shrink-0" />
        <span className="truncate">{sponsor.githubId}</span>
      </a>
      {sponsor.websiteUrl && (
        <a href={sponsorUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
          <Globe className="size-3 shrink-0" />
          <span className="truncate">{getSponsorUrlLabel(sponsor)}</span>
        </a>
      )}
    </div>
  );
}

function SpecialSponsorCard({ sponsor }: { sponsor: Sponsor }) {
  return (
    <div className="flex flex-col rounded border border-border bg-fd-background">
      <div className="flex items-center gap-2 border-border border-b px-3 py-2">
        <Star className="h-4 w-4 text-yellow-500/90" />
        <div className="ml-auto flex items-center gap-2 font-mono text-muted-foreground text-xs">
          <span>SPECIAL</span>
          <span>•</span>
          <span>{sponsor.sinceWhen.toUpperCase()}</span>
        </div>
      </div>
      <div className="flex flex-1 gap-4 p-4">
        <Image
          src={sponsor.avatarUrl}
          alt={sponsor.name}
          width={112}
          height={112}
          className="size-28 shrink-0 self-start rounded border border-border"
          unoptimized
        />
        <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate font-semibold text-base text-foreground">{sponsor.name}</h3>
            <p className="text-primary text-xs">{sponsor.tierName}</p>
          </div>
          <SponsorLinks sponsor={sponsor} />
        </div>
      </div>
      <div className="flex items-center justify-between gap-2 border-border border-t px-3 py-2">
        <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wide">
          Lifetime support
        </span>
        <span className="font-mono font-semibold text-foreground text-sm">
          {sponsor.formattedAmount}
        </span>
      </div>
    </div>
  );
}

function SponsorCard({ sponsor }: { sponsor: Sponsor }) {
  return (
    <div className="rounded border border-border bg-fd-background">
      <div className="flex items-center gap-2 border-border border-b px-3 py-2">
        <span className="text-primary text-xs">▶</span>
        <span className="ml-auto font-mono text-muted-foreground text-xs">
          {sponsor.sinceWhen.toUpperCase()}
        </span>
      </div>
      <div className="flex gap-4 p-4">
        <Image
          src={sponsor.avatarUrl}
          alt={sponsor.name}
          width={100}
          height={100}
          className="shrink-0 self-start rounded border border-border"
          unoptimized
        />
        <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate font-semibold text-foreground text-sm">{sponsor.name}</h3>
            <p className="text-primary text-xs">{sponsor.tierName}</p>
            {shouldShowLifetimeTotal(sponsor) && (
              <p className="text-muted-foreground text-xs">Total: {sponsor.formattedAmount}</p>
            )}
          </div>
          <SponsorLinks sponsor={sponsor} />
        </div>
      </div>
    </div>
  );
}

function BackerChip({ sponsor }: { sponsor: Sponsor }) {
  return (
    <a
      href={sponsor.githubUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 rounded border border-border bg-fd-background px-3 py-2 transition-colors hover:border-primary/40"
    >
      <Image
        src={sponsor.avatarUrl}
        alt={sponsor.name}
        width={28}
        height={28}
        className="size-7 rounded border border-border"
        unoptimized
      />
      <span className="truncate font-medium text-sm">{sponsor.name}</span>
      <span className="text-muted-foreground text-xs">{sponsor.tierName}</span>
    </a>
  );
}

function PastSponsorRow({ sponsor }: { sponsor: Sponsor }) {
  const wasSpecial = isLifetimeSpecialSponsor(sponsor);
  return (
    <a
      href={sponsor.githubUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 rounded border border-border/70 bg-muted/20 px-3 py-2 transition-colors hover:border-border"
    >
      <Image
        src={sponsor.avatarUrl}
        alt={sponsor.name}
        width={36}
        height={36}
        className="size-9 shrink-0 rounded border border-border/70"
        unoptimized
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="truncate font-medium text-muted-foreground text-sm">{sponsor.name}</span>
          {wasSpecial && <Star className="size-3 shrink-0 text-yellow-500/60" />}
        </div>
        <span className="text-muted-foreground/60 text-xs">{sponsor.formattedAmount}</span>
      </div>
    </a>
  );
}

export function SponsorsPage({
  sponsorsData,
  totalProjects,
}: {
  sponsorsData: SponsorsData;
  totalProjects: number;
}) {
  const { summary, specialSponsors, sponsors, pastSponsors, backers } = sponsorsData;
  const activeCount = specialSponsors.length + sponsors.length;
  const lastSync = sponsorsData.generated_at.slice(0, 10);

  return (
    <main className="min-h-svh bg-fd-background">
      <div className="container mx-auto space-y-8 px-4 py-8 pt-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-primary">
              <Heart className="h-5 w-5" />
              <h1 className="font-bold font-mono text-xl sm:text-2xl">SPONSORS.SH</h1>
            </div>
            <p className="text-muted-foreground text-sm">
              The companies and developers funding create-better-t-stack
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="font-mono text-muted-foreground text-xs">LAST_SYNC: {lastSync}</span>
            <a
              href="https://github.com/sponsors/AmanVarshney01"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded border border-primary/40 px-3 py-1.5 font-mono text-primary text-xs transition-colors hover:bg-primary/10"
            >
              <Heart className="h-3.5 w-3.5" />
              <span>BECOME_SPONSOR.SH</span>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <LedgerTile
            label="Lifetime funding"
            value={currency.format(summary.total_lifetime_amount)}
            detail="All-time processed"
          />
          <LedgerTile
            label="Monthly recurring"
            value={currency.format(summary.total_current_monthly)}
            detail="Per month right now"
          />
          <LedgerTile
            label="Active sponsors"
            value={String(activeCount)}
            detail={`${specialSponsors.length} special`}
          />
          <LedgerTile
            label="All-time sponsors"
            value={String(summary.total_sponsors)}
            detail={`Including ${pastSponsors.length} past`}
          />
        </div>

        {activeCount === 0 ? (
          <div className="rounded border border-border p-8 text-center">
            <p className="mb-4 font-mono text-muted-foreground">NO_SPONSORS_FOUND.NULL</p>
            <div className="flex items-center justify-center gap-2 text-sm">
              <span className="text-primary">$</span>
              <span className="text-muted-foreground">Be the first to support this project!</span>
            </div>
          </div>
        ) : (
          <>
            {specialSponsors.length > 0 && (
              <section className="space-y-4">
                <SectionHeader
                  icon={<Star className="h-4 w-4 text-yellow-500/90" />}
                  title="SPECIAL_SPONSORS"
                  count={specialSponsors.length}
                />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {specialSponsors.map((sponsor) => (
                    <SpecialSponsorCard key={sponsor.githubId} sponsor={sponsor} />
                  ))}
                </div>
              </section>
            )}

            <section className="space-y-4">
              <SectionHeader
                icon={<VercelLogo className="h-4 w-4 text-foreground" />}
                title="SUPPORTED_BY"
                count={1}
              />
              <a
                href="https://vercel.com/oss"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded border border-border bg-fd-background p-4 transition-colors hover:border-primary/40"
              >
                <VercelLogo className="h-9 w-9 shrink-0 text-foreground" />
                <div className="min-w-0">
                  <h3 className="font-semibold text-foreground text-sm">Vercel OSS Program</h3>
                  <p className="text-muted-foreground text-xs">
                    Hosting and infrastructure for better-t-stack.dev
                  </p>
                </div>
                <span className="ml-auto hidden font-mono text-muted-foreground text-xs sm:block">
                  vercel.com/oss
                </span>
              </a>
            </section>

            {sponsors.length > 0 && (
              <section className="space-y-4">
                <SectionHeader
                  icon={<Heart className="h-4 w-4 text-primary" />}
                  title="ACTIVE_SPONSORS"
                  count={sponsors.length}
                />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {sponsors.map((sponsor) => (
                    <SponsorCard key={sponsor.githubId} sponsor={sponsor} />
                  ))}
                </div>
              </section>
            )}

            {backers.length > 0 && (
              <section className="space-y-4">
                <SectionHeader
                  icon={<Users className="h-4 w-4 text-muted-foreground" />}
                  title="BACKERS"
                  count={backers.length}
                />
                <div className="flex flex-wrap gap-3">
                  {backers.map((sponsor) => (
                    <BackerChip key={sponsor.githubId} sponsor={sponsor} />
                  ))}
                </div>
              </section>
            )}

            {pastSponsors.length > 0 && (
              <section className="space-y-4">
                <SectionHeader
                  icon={<Archive className="h-4 w-4 text-muted-foreground" />}
                  title="PAST_SPONSORS.ARCHIVE"
                  count={pastSponsors.length}
                />
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {pastSponsors.map((sponsor) => (
                    <PastSponsorRow key={sponsor.githubId} sponsor={sponsor} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        <div className="rounded border border-border p-6">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-primary">$</span>
              <span className="text-muted-foreground">
                Sponsorship funds development and infrastructure for create-better-t-stack
              </span>
            </div>
            {totalProjects > 0 && (
              <p className="text-muted-foreground text-sm">
                Sponsors are featured in a CLI used to scaffold{" "}
                <span className="font-mono text-foreground">
                  {totalProjects.toLocaleString("en-US")}
                </span>{" "}
                projects since Dec 2025 alone. See{" "}
                <Link
                  href="/analytics"
                  className="underline decoration-border underline-offset-4 transition-colors hover:text-foreground"
                >
                  CLI analytics
                </Link>{" "}
                and{" "}
                <a
                  href="https://umami.amanv.cloud/share/pHvqHleyOl9PBfaK"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-border underline-offset-4 transition-colors hover:text-foreground"
                >
                  website traffic
                </a>
              </p>
            )}
            <a
              href="https://github.com/sponsors/AmanVarshney01"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded border border-primary/40 px-4 py-2 font-mono text-primary text-sm transition-colors hover:bg-primary/10"
            >
              <Heart className="h-4 w-4" />
              <span>BECOME_SPONSOR.SH</span>
            </a>
            <p className="text-muted-foreground text-xs">
              One-time sponsorships count too: every $100 one-time equals a month of special
              placement
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
