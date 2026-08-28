"use client";

import { ExternalLink, File, Monitor } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FaGithub } from "react-icons/fa6";

import { track } from "@/lib/analytics";

export interface ShowcaseItemProps {
  title: string;
  description: string;
  imageUrl: string;
  liveUrl?: string;
  sourceUrl?: string;
  tags: string[];
  index?: number;
}

export default function ShowcaseItem({
  title,
  description,
  imageUrl,
  liveUrl,
  sourceUrl,
  tags,
  index = 0,
}: ShowcaseItemProps) {
  const projectId = `PROJECT_${String(index + 1).padStart(3, "0")}`;

  return (
    <div className="flex h-full flex-col rounded-[4px] border">
      <div className="flex min-h-8 shrink-0 flex-wrap items-center gap-x-2 gap-y-0.5 border-b px-4 py-1">
        <File aria-hidden="true" className="h-3 w-3 shrink-0 text-primary" />
        <span className="font-mono text-[10px] uppercase tracking-[0.10em]">
          {projectId}.PROJECT
        </span>
        <span
          aria-hidden="true"
          className="ml-auto text-[10px] leading-none text-fd-muted-foreground/40"
        >
          •
        </span>
        <span className="font-mono text-[10px] text-fd-muted-foreground uppercase tabular-nums tracking-[0.10em]">
          {tags.length} DEPS
        </span>
      </div>

      <div className="relative aspect-video w-full border-b">
        <Image src={imageUrl} alt={title} fill className="object-cover" unoptimized />
      </div>

      <div className="flex flex-1 flex-col gap-4 px-4 py-4">
        <div className="flex flex-col gap-2">
          <h3 className="font-mono text-[13px] leading-[1.55]">{title}</h3>
          <p className="font-mono text-[13px] text-fd-muted-foreground leading-[1.55]">
            {description}
          </p>
        </div>

        <div className="mt-auto">
          <div className="mb-2 flex items-center gap-3">
            <span className="font-mono text-[10px] text-fd-muted-foreground/70 uppercase tracking-[0.10em]">
              DEPENDENCIES:
            </span>
            <span aria-hidden="true" className="h-px flex-1 bg-fd-border" />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span key={tag} className="rounded-[4px] border px-1.5 py-0.5 font-mono text-[11px]">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {liveUrl && (
        <Link
          href={liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("showcase_click", { project: title, target: "demo" })}
          className="builder-focus-ring flex items-center gap-2 border-t px-4 py-2.5 font-mono text-[11px] text-primary uppercase tracking-[0.08em] transition-colors duration-150 hover:text-primary/70"
        >
          <Monitor aria-hidden="true" className="h-3 w-3 shrink-0" />
          <span>LAUNCH_DEMO.SH</span>
          <ExternalLink aria-hidden="true" className="ml-auto h-3 w-3 shrink-0" />
        </Link>
      )}
      {sourceUrl && (
        <Link
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("showcase_click", { project: title, target: "source" })}
          className="builder-focus-ring flex items-center gap-2 border-t px-4 py-2.5 font-mono text-[11px] text-fd-muted-foreground uppercase tracking-[0.08em] transition-colors duration-150 hover:text-fd-foreground"
        >
          <FaGithub aria-hidden="true" className="h-3 w-3 shrink-0" />
          <span>VIEW_SOURCE.GIT</span>
          <ExternalLink aria-hidden="true" className="ml-auto h-3 w-3 shrink-0" />
        </Link>
      )}
    </div>
  );
}
