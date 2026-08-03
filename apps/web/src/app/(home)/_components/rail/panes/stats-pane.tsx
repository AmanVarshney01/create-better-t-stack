"use client";

import NumberFlow, { continuous } from "@number-flow/react";
import Link from "next/link";
import type { ReactNode } from "react";

import { useProjectStats } from "../_hooks/use-project-stats";
import { GroupHeader } from "../chrome";

function StatColumn({
  href,
  label,
  value,
  caption,
  notes,
}: {
  href: string;
  label: string;
  value: ReactNode;
  caption: string;
  notes: string[];
}) {
  const external = href.startsWith("http");
  return (
    <div className="min-w-0">
      <Link
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className="builder-focus-ring font-mono text-[10px] text-fd-muted-foreground/70 uppercase tracking-[0.10em] transition-colors duration-150 hover:text-fd-foreground"
      >
        {label}
      </Link>
      <div className="mt-1.5 font-medium font-mono text-[20px] leading-none tracking-[-0.02em] tabular-nums">
        {value}
      </div>
      <p className="mt-1 font-mono text-[10px] text-fd-muted-foreground uppercase tracking-[0.08em]">
        {caption}
      </p>
      {notes.map((note) => (
        <p key={note} className="truncate font-mono text-[11px] text-fd-muted-foreground">
          {note}
        </p>
      ))}
    </div>
  );
}

export default function StatsPane() {
  const stats = useProjectStats();

  return (
    <div>
      <GroupHeader label="stats" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatColumn
          href="/analytics"
          label="analytics"
          caption="projects"
          notes={[
            stats.avgProjectsPerDay ? `${stats.avgProjectsPerDay} / day` : "— / day",
            stats.lastUpdated ?? "—",
          ]}
          value={
            <NumberFlow
              value={stats.totalProjects ?? 0}
              className="tabular-nums"
              transformTiming={{ duration: 1000, easing: "ease-out" }}
              trend={1}
              willChange
              isolate
            />
          }
        />

        <StatColumn
          href="https://github.com/AmanVarshney01/create-better-t-stack"
          label="github"
          caption="stars"
          notes={[
            stats.contributorCount === null
              ? "— contributors"
              : `${stats.contributorCount} contributors`,
          ]}
          value={
            <NumberFlow
              value={stats.starCount ?? 0}
              className="tabular-nums"
              transformTiming={{ duration: 800, easing: "ease-out" }}
              trend={1}
              willChange
              isolate
            />
          }
        />

        <StatColumn
          href="https://www.npmjs.com/package/create-better-t-stack"
          label="npm"
          caption="downloads"
          notes={[
            stats.npmAvgPerDay === null ? "— / day" : `${stats.npmAvgPerDay} / day`,
            "create-better-t-stack",
          ]}
          value={
            <NumberFlow
              value={stats.downloadCount ?? 0}
              className="tabular-nums"
              transformTiming={{ duration: stats.downloadIntervalMs, easing: "linear" }}
              trend={1}
              willChange
              plugins={[continuous]}
              isolate
            />
          }
        />
      </div>
    </div>
  );
}
