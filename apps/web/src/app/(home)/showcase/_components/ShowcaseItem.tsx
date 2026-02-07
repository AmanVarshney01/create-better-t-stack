"use client";

import { ExternalLink, File, Github, Monitor } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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
    <div className="group flex h-full flex-col overflow-hidden rounded-xl bg-fd-background/85 ring-1 ring-border/35 transition-all duration-200 hover:-translate-y-0.5 hover:ring-primary/35">
      <div className="px-4 py-3">
        <div className="flex items-center gap-2">
          <File className="h-3 w-3 text-primary" />
          <span className="font-semibold font-mono text-foreground text-xs">
            {projectId}.PROJECT
          </span>
          <div className="ml-auto flex items-center gap-2 text-muted-foreground text-xs">
            <span>•</span>
            <span className="font-mono">{tags.length} DEPS</span>
          </div>
        </div>
      </div>

      <div className="relative aspect-video w-full overflow-hidden bg-muted/10">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-all duration-300 ease-in-out group-hover:scale-[1.03]"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/45 via-transparent to-transparent" />
      </div>

      <div className="flex flex-1 flex-col p-4 pt-4">
        <h3 className="mb-2 font-bold text-lg text-primary">{title}</h3>

        <p className="mb-4 flex-grow text-muted-foreground text-sm leading-relaxed">
          {description}
        </p>

        <div className="mb-4">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-muted-foreground text-xs">DEPENDENCIES:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-muted/30 px-2 py-1 text-foreground text-xs transition-colors hover:bg-muted/45"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-auto grid gap-2">
          {liveUrl && (
            <Link
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-md bg-primary/12 px-3 py-2 text-primary text-sm transition-colors hover:bg-primary/20"
            >
              <Monitor className="h-3 w-3" />
              <span>LAUNCH_DEMO.SH</span>
              <ExternalLink className="ml-auto h-3 w-3" />
            </Link>
          )}
          {sourceUrl && (
            <Link
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-md bg-muted/30 px-3 py-2 text-muted-foreground text-sm transition-colors hover:bg-muted/45 hover:text-foreground"
            >
              <Github className="h-3 w-3" />
              <span>VIEW_SOURCE.GIT</span>
              <ExternalLink className="ml-auto h-3 w-3" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
