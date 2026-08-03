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

import { PageHeader } from "../../_components/page-header";
import { PageShell } from "../../_components/page-shell";

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
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
      <span className="flex shrink-0 items-center text-fd-muted-foreground/70">{icon}</span>
      <h2 className="text-[10px] text-fd-muted-foreground/70 uppercase tracking-[0.10em]">
        {title}
      </h2>
      <span aria-hidden="true" className="h-px min-w-4 flex-1 bg-fd-border" />
      <span className="text-[10px] text-fd-muted-foreground/50 uppercase tracking-[0.10em] tabular-nums">
        [{count} RECORDS]
      </span>
    </div>
  );
}

function LedgerTile({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="min-w-0 lg:border-l lg:pl-5 lg:first:border-l-0 lg:first:pl-0">
      <div className="text-[11px] text-fd-muted-foreground uppercase tracking-[0.08em]">
        {label}
      </div>
      <div className="mt-2 font-medium text-[20px] tracking-[-0.02em] tabular-nums">{value}</div>
      <p className="mt-1 text-[10px] text-fd-muted-foreground/70 uppercase tracking-[0.10em] tabular-nums">
        {detail}
      </p>
    </div>
  );
}

function SponsorLinks({ sponsor, muted = false }: { sponsor: Sponsor; muted?: boolean }) {
  const sponsorUrl = getSponsorUrl(sponsor);
  const linkClass = muted
    ? "flex items-center gap-2 text-[13px] text-fd-muted-foreground/70 leading-[1.55] transition-colors duration-150 hover:text-fd-muted-foreground"
    : "flex items-center gap-2 text-[13px] text-fd-muted-foreground leading-[1.55] transition-colors duration-150 hover:text-primary";

  return (
    <div className="flex flex-col">
      <a href={sponsor.githubUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
        <FaGithub aria-hidden="true" className="size-3 shrink-0" />
        <span className="wrap-anywhere">{sponsor.githubId}</span>
      </a>
      {sponsor.websiteUrl && (
        <a href={sponsorUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
          <Globe aria-hidden="true" className="size-3 shrink-0" />
          <span className="wrap-anywhere">{getSponsorUrlLabel(sponsor)}</span>
        </a>
      )}
    </div>
  );
}

function SpecialSponsorCard({ sponsor }: { sponsor: Sponsor }) {
  return (
    <div className="@container flex flex-col rounded-[4px] border">
      <div className="flex items-center gap-2 border-b px-3 py-2">
        <Star aria-hidden="true" className="h-3 w-3 shrink-0 text-primary" />
        <div className="ml-auto flex flex-wrap items-center justify-end gap-x-2 text-[10px] text-fd-muted-foreground uppercase tracking-[0.10em]">
          <span>SPECIAL</span>
          <span aria-hidden="true">•</span>
          <span>{sponsor.sinceWhen.toUpperCase()}</span>
        </div>
      </div>
      <div className="flex flex-1 gap-4 p-4">
        <Image
          src={sponsor.avatarUrl}
          alt={sponsor.name}
          width={112}
          height={112}
          className="@2xs:size-24 @sm:size-28 size-20 shrink-0 self-start rounded-[4px] border"
          unoptimized
        />
        <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
          <div className="min-w-0">
            <h3 className="wrap-anywhere text-[15px] text-fd-foreground leading-[1.5] tracking-[-0.01em]">
              {sponsor.name}
            </h3>
            <p className="text-[13px] text-fd-muted-foreground leading-[1.55]">
              {sponsor.tierName}
            </p>
          </div>
          <SponsorLinks sponsor={sponsor} />
        </div>
      </div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-t px-3 py-2">
        <span className="text-[11px] text-fd-muted-foreground uppercase tracking-[0.08em]">
          Lifetime support
        </span>
        <span className="text-[13px] text-fd-foreground tabular-nums">
          {sponsor.formattedAmount}
        </span>
      </div>
    </div>
  );
}

function SponsorCard({ sponsor }: { sponsor: Sponsor }) {
  return (
    <div className="@container rounded-[4px] border">
      <div className="flex items-center gap-2 border-b px-3 py-2">
        <span aria-hidden="true" className="text-[10px] text-primary leading-none">
          ▶
        </span>
        <span className="ml-auto text-[10px] text-fd-muted-foreground uppercase tracking-[0.10em]">
          {sponsor.sinceWhen.toUpperCase()}
        </span>
      </div>
      <div className="flex gap-4 p-4">
        <Image
          src={sponsor.avatarUrl}
          alt={sponsor.name}
          width={100}
          height={100}
          className="@2xs:size-20 @xs:size-24 size-16 shrink-0 self-start rounded-[4px] border"
          unoptimized
        />
        <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
          <div className="min-w-0">
            <h3 className="wrap-anywhere text-[13px] text-fd-foreground leading-[1.55]">
              {sponsor.name}
            </h3>
            <p className="text-[13px] text-fd-muted-foreground leading-[1.55]">
              {sponsor.tierName}
            </p>
            {shouldShowLifetimeTotal(sponsor) && (
              <p className="text-[13px] text-fd-muted-foreground leading-[1.55] tabular-nums">
                Total: {sponsor.formattedAmount}
              </p>
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
      className="builder-focus-ring group flex items-center gap-2 rounded-[4px] border px-3 py-2"
    >
      <Image
        src={sponsor.avatarUrl}
        alt={sponsor.name}
        width={28}
        height={28}
        className="size-7 shrink-0 rounded-[4px] border"
        unoptimized
      />
      <span className="wrap-anywhere text-[13px] text-fd-foreground leading-[1.55] transition-colors duration-150 group-hover:text-primary">
        {sponsor.name}
      </span>
      <span className="shrink-0 text-[11px] text-fd-muted-foreground uppercase tracking-[0.08em]">
        {sponsor.tierName}
      </span>
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
      className="builder-focus-ring group flex items-center gap-3 rounded-[4px] border px-3 py-2"
    >
      <Image
        src={sponsor.avatarUrl}
        alt={sponsor.name}
        width={36}
        height={36}
        className="size-9 shrink-0 rounded-[4px] border"
        unoptimized
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="wrap-anywhere text-[13px] text-fd-muted-foreground leading-[1.55] transition-colors duration-150 group-hover:text-fd-foreground">
            {sponsor.name}
          </span>
          {wasSpecial && (
            <Star aria-hidden="true" className="size-3 shrink-0 text-fd-muted-foreground/60" />
          )}
        </div>
        <span className="text-[10px] text-fd-muted-foreground/60 uppercase tracking-[0.10em] tabular-nums">
          {sponsor.formattedAmount}
        </span>
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
    <PageShell>
      <PageHeader
        icon={Heart}
        title="SPONSORS.SH"
        description="The companies and developers funding create-better-t-stack"
        meta={`LAST_SYNC: ${lastSync}`}
        actions={
          <a
            href="https://github.com/sponsors/AmanVarshney01"
            target="_blank"
            rel="noopener noreferrer"
            className="builder-focus-ring flex min-h-8 items-center gap-2 rounded-[4px] border px-3 py-1.5 font-mono text-[10px] text-primary uppercase tracking-[0.10em] transition-colors duration-150 hover:text-fd-foreground"
          >
            <Heart aria-hidden="true" className="h-3 w-3" />
            <span>BECOME_SPONSOR.SH</span>
          </a>
        }
      />

      <div className="grid grid-cols-2 gap-x-6 gap-y-6 border-t border-b py-5 lg:grid-cols-4 lg:gap-x-0">
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

      {activeCount === 0 && (
        <div className="rounded-[4px] border p-8 text-center">
          <p className="mb-4 text-[11px] text-fd-muted-foreground uppercase tracking-[0.08em]">
            NO_ACTIVE_SPONSORS.NULL
          </p>
          <div className="flex items-center justify-center gap-2 text-[13px] leading-[1.55]">
            <span className="text-primary">$</span>
            <span className="text-fd-muted-foreground">Be the first to support this project!</span>
          </div>
        </div>
      )}

      {specialSponsors.length > 0 && (
        <section className="space-y-4">
          <SectionHeader
            icon={<Star aria-hidden="true" className="h-3 w-3" />}
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
        <SectionHeader icon={<VercelLogo className="h-3 w-3" />} title="SUPPORTED_BY" count={1} />
        <a
          href="https://vercel.com/oss"
          target="_blank"
          rel="noopener noreferrer"
          className="builder-focus-ring group flex items-center gap-4 rounded-[4px] border p-4"
        >
          <VercelLogo className="h-6 w-6 shrink-0 text-fd-foreground" />
          <div className="min-w-0">
            <h3 className="text-[13px] text-fd-foreground leading-[1.55] transition-colors duration-150 group-hover:text-primary">
              Vercel OSS Program
            </h3>
            <p className="text-[13px] text-fd-muted-foreground leading-[1.55]">
              Hosting and infrastructure for better-t-stack.dev
            </p>
          </div>
          <span className="ml-auto hidden text-[10px] text-fd-muted-foreground uppercase tracking-[0.10em] sm:block">
            vercel.com/oss
          </span>
        </a>
      </section>

      {sponsors.length > 0 && (
        <section className="space-y-4">
          <SectionHeader
            icon={<Heart aria-hidden="true" className="h-3 w-3" />}
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
            icon={<Users aria-hidden="true" className="h-3 w-3" />}
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
            icon={<Archive aria-hidden="true" className="h-3 w-3" />}
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

      <div className="rounded-[4px] border p-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex items-center gap-2 text-[13px] leading-[1.55]">
            <span className="text-primary">$</span>
            <span className="text-fd-muted-foreground">
              Sponsorship funds development and infrastructure for create-better-t-stack
            </span>
          </div>
          {totalProjects > 0 && (
            <p className="text-[13px] text-fd-muted-foreground leading-[1.55]">
              Sponsors are featured in a CLI used to scaffold{" "}
              <span className="text-fd-foreground tabular-nums">
                {totalProjects.toLocaleString("en-US")}
              </span>{" "}
              projects since Dec 2025 alone. See{" "}
              <Link
                href="/analytics"
                className="builder-focus-ring text-primary transition-colors duration-150 hover:text-fd-foreground"
              >
                CLI analytics
              </Link>{" "}
              and{" "}
              <a
                href="https://umami.amanv.cloud/share/pHvqHleyOl9PBfaK"
                target="_blank"
                rel="noopener noreferrer"
                className="builder-focus-ring text-primary transition-colors duration-150 hover:text-fd-foreground"
              >
                website traffic
              </a>
            </p>
          )}
          <a
            href="https://github.com/sponsors/AmanVarshney01"
            target="_blank"
            rel="noopener noreferrer"
            className="builder-focus-ring flex min-h-9 items-center gap-2 rounded-[4px] border px-4 py-2 text-[11px] text-primary uppercase tracking-[0.08em] transition-colors duration-150 hover:text-fd-foreground"
          >
            <Heart aria-hidden="true" className="h-3.5 w-3.5" />
            <span>BECOME_SPONSOR.SH</span>
          </a>
          <p className="text-[13px] text-fd-muted-foreground leading-[1.55]">
            One-time sponsorships count too: every $100 one-time equals a month of special placement
          </p>
        </div>
      </div>
    </PageShell>
  );
}
