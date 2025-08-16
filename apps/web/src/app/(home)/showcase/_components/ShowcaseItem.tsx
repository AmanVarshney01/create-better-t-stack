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
		<div className="flex h-full flex-col overflow-hidden rounded border border-border">
			<div className="border-border border-b px-3 py-2">
				<div className="flex items-center gap-2">
					<File className="h-3 w-3 text-primary" />
					<span className="font-semibold text-foreground text-xs">
						{projectId}.PROJECT
					</span>
					<div className="ml-auto flex items-center gap-2 text-muted-foreground text-xs">
						<span>•</span>
						<span>{tags.length} DEPS</span>
					</div>
				</div>
			</div>

			<div className="relative aspect-[4/3] w-full overflow-hidden bg-muted/10">
				<Image
					src={imageUrl}
					alt={title}
					fill
					className="object-cover transition-all duration-300 ease-in-out hover:scale-105"
					unoptimized
				/>
				<div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 hover:opacity-100" />
			</div>

			<div className="flex flex-1 flex-col p-4">
				<h3 className="mb-2 font-bold text-lg text-primary">{title}</h3>

				<p className="mb-4 flex-grow text-muted-foreground text-sm leading-relaxed">
					{description}
				</p>

				<div className="mb-4">
					<div className="mb-2 flex items-center gap-2">
						<span className="text-muted-foreground text-xs">DEPENDENCIES:</span>
					</div>
					<div className="flex flex-wrap gap-1">
						{tags.map((tag) => (
							<span
								key={tag}
								className="rounded border border-border bg-muted/30 px-2 py-1 text-foreground text-xs transition-colors hover:bg-muted/50"
							>
								{tag}
							</span>
						))}
					</div>
				</div>

				<div className="mt-auto space-y-2">
					<div className="grid gap-2">
						{liveUrl && (
							<Link
								href={liveUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center gap-2 rounded border border-border bg-primary/10 px-3 py-2 text-primary text-sm transition-all hover:bg-primary/20 hover:text-primary"
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
								className="flex items-center gap-2 rounded border border-border px-3 py-2 text-muted-foreground text-sm transition-all hover:bg-muted/40 hover:text-foreground"
							>
								<Github className="h-3 w-3" />
								<span>VIEW_SOURCE.GIT</span>
								<ExternalLink className="ml-auto h-3 w-3" />
							</Link>
						)}
					</div>

					<div className="border-border border-t pt-2">
						<div className="flex items-center gap-2 text-xs">
							<span className="text-primary">$</span>
							<span className="text-muted-foreground">
								echo &quot;Status: READY&quot;
							</span>
							<div className="ml-auto flex items-center gap-1">
								<div className="h-1 w-1 animate-pulse rounded-full bg-green-400" />
								<span className="text-green-400 text-xs">ONLINE</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
