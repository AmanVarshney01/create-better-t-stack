"use client";

import { Heart } from "lucide-react";

// Placeholder sponsors - replace with real sponsors when available
const goldSponsors = [
  { name: "Your Company", logo: null },
  { name: "Your Company", logo: null },
];

const silverSponsors = [
  { name: "Your Company", logo: null },
  { name: "Your Company", logo: null },
  { name: "Your Company", logo: null },
  { name: "Your Company", logo: null },
];

const bronzeSponsors = [
  { name: "Sponsor", logo: null },
  { name: "Sponsor", logo: null },
  { name: "Sponsor", logo: null },
  { name: "Sponsor", logo: null },
  { name: "Sponsor", logo: null },
  { name: "Sponsor", logo: null },
];

function SponsorPlaceholder({ size = "md" }: { size?: "lg" | "md" | "sm" }) {
  const sizeClasses = {
    lg: "h-16 w-40",
    md: "h-14 w-32",
    sm: "h-10 w-24",
  };

  return (
    <div
      className={`${sizeClasses[size]} flex items-center justify-center rounded-md border border-dashed border-border text-xs text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground/70`}
    >
      Your Logo
    </div>
  );
}

export default function SponsorsSection() {
  return (
    <section className="border-t border-border py-16">
      <div className="mx-auto max-w-3xl px-4">
        {/* Section Header */}
        <h2 className="font-pixel text-xl font-bold">Sponsors</h2>
        <p className="mt-2 text-muted-foreground">
          Better Fullstack is free and open source. Sponsors help keep the project maintained.
        </p>

        {/* Gold Sponsors */}
        <div className="mt-10">
          <p className="mb-4 font-mono text-xs uppercase tracking-widest text-amber-500">Gold</p>
          <div className="flex flex-wrap items-center gap-4">
            {goldSponsors.map((_, i) => (
              <SponsorPlaceholder key={i} size="lg" />
            ))}
          </div>
        </div>

        {/* Silver Sponsors */}
        <div className="mt-8">
          <p className="mb-4 font-mono text-xs uppercase tracking-widest text-zinc-400">Silver</p>
          <div className="flex flex-wrap items-center gap-3">
            {silverSponsors.map((_, i) => (
              <SponsorPlaceholder key={i} size="md" />
            ))}
          </div>
        </div>

        {/* Bronze Sponsors */}
        <div className="mt-8">
          <p className="mb-4 font-mono text-xs uppercase tracking-widest text-amber-700 dark:text-amber-600">
            Bronze
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {bronzeSponsors.map((_, i) => (
              <SponsorPlaceholder key={i} size="sm" />
            ))}
          </div>
        </div>

        {/* Become a Sponsor CTA */}
        <a
          href="https://www.patreon.com/c/marve10s"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 inline-flex items-center gap-2 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
        >
          <Heart className="h-4 w-4" />
          Become a Sponsor
        </a>
      </div>
    </section>
  );
}
