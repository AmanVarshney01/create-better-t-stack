import type { Sponsor } from "@/lib/types";
import { Github, Globe, Heart, Terminal } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function SponsorsSection() {
	const [sponsors, setSponsors] = useState<Sponsor[]>([]);
	const [loadingSponsors, setLoadingSponsors] = useState(true);
	const [sponsorError, setSponsorError] = useState<string | null>(null);

	useEffect(() => {
		fetch("https://sponsors.amanv.dev/sponsors.json")
			.then((res) => {
				if (!res.ok) throw new Error("Failed to fetch sponsors");
				return res.json();
			})
			.then((data) => {
				setSponsors(Array.isArray(data) ? data : []);
				setLoadingSponsors(false);
			})
			.catch(() => {
				setSponsorError("Could not load sponsors");
				setLoadingSponsors(false);
			});
	}, []);

	return (
		<div className="mb-12">
			<div className="mb-6 flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
				<div className="flex items-center gap-2">
					<Terminal className="h-5 w-5 text-primary" />
					<span className="font-bold font-mono text-lg sm:text-xl">
						SPONSORS_DATABASE.JSON
					</span>
				</div>
				<div className="hidden h-px flex-1 bg-border sm:block" />
				<span className="w-full text-right font-mono text-muted-foreground text-xs sm:w-auto sm:text-left">
					[{loadingSponsors ? "LOADING..." : sponsors.length} RECORDS]
				</span>
			</div>

			<div className="terminal-block-hover mb-8 rounded border border-border bg-muted/20 p-4">
				<div className="flex items-center gap-2 text-sm">
					<span className="text-primary">$</span>
					<span className="font-mono text-foreground">
						# Amazing organizations and individuals supporting this project
					</span>
				</div>
				<div className="mt-2 flex items-center gap-2 text-sm">
					<span className="text-primary">$</span>
					<span className="font-mono text-muted-foreground">
						# Your support helps maintain and improve Better-T-Stack
					</span>
				</div>
			</div>

			{loadingSponsors ? (
				<div className="terminal-block-hover rounded border border-border bg-muted/20 p-8">
					<div className="flex items-center justify-center gap-2">
						<div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
						<span className="font-mono text-muted-foreground">
							LOADING_SPONSORS.EXE
						</span>
						<div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
					</div>
				</div>
			) : sponsorError ? (
				<div className="terminal-block-hover rounded border border-border bg-destructive/10 p-8">
					<div className="flex items-center justify-center gap-2">
						<span className="text-destructive">✗</span>
						<span className="font-mono text-destructive">
							ERROR: {sponsorError}
						</span>
					</div>
				</div>
			) : sponsors.length === 0 ? (
				<div className="space-y-4">
					<div className="terminal-block-hover rounded border border-border bg-muted/20 p-8">
						<div className="text-center">
							<div className="mb-4 flex items-center justify-center gap-2">
								<span className="font-mono text-muted-foreground">
									NO_SPONSORS_FOUND.NULL
								</span>
							</div>
							<div className="flex items-center justify-center gap-2 text-sm">
								<span className="text-primary">$</span>
								<span className="font-mono text-muted-foreground">
									# Be the first to support this project!
								</span>
							</div>
						</div>
					</div>
					<div className="terminal-block-hover rounded border border-border bg-background p-4">
						<a
							href="https://github.com/sponsors/AmanVarshney01"
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center justify-center gap-2 font-mono text-primary transition-colors hover:text-accent"
						>
							<Heart className="h-4 w-4" />
							<span>BECOME_SPONSOR.EXE</span>
						</a>
					</div>
				</div>
			) : (
				<div className="space-y-6">
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
						{sponsors.map((entry, index) => {
							const since = new Date(entry.createdAt).toLocaleDateString(
								undefined,
								{ year: "numeric", month: "short" },
							);
							return (
								<div
									key={entry.sponsor.login}
									className="terminal-block-hover rounded border border-border bg-background"
									style={{ animationDelay: `${index * 50}ms` }}
								>
									<div className="border-border border-b bg-muted/20 px-3 py-2">
										<div className="flex items-center gap-2">
											<span className="text-primary text-xs">▶</span>
											<div className="ml-auto flex items-center gap-2 text-muted-foreground text-xs">
												<span>{entry.isOneTime ? "ONE-TIME" : "MONTHLY"}</span>
												<span>•</span>
												<span>SINCE {since.toUpperCase()}</span>
											</div>
										</div>
									</div>
									<div className="p-4">
										<div className="flex items-center gap-4">
											<div className="flex-shrink-0">
												<Image
													src={entry.sponsor.avatarUrl}
													alt={entry.sponsor.name || entry.sponsor.login}
													width={100}
													height={100}
													className="rounded border border-border bg-background transition-colors duration-300"
													unoptimized
												/>
											</div>
											<div className="min-w-0 flex-1 space-y-2">
												<div>
													<h3 className="truncate font-mono font-semibold text-foreground text-sm">
														{entry.sponsor.name || entry.sponsor.login}
													</h3>
													{entry.tierName && (
														<p className="font-mono text-primary text-xs">
															{entry.tierName}
														</p>
													)}
												</div>
												<div className="flex flex-col gap-1">
													<a
														href={`https://github.com/${entry.sponsor.login}`}
														target="_blank"
														rel="noopener noreferrer"
														className="group flex items-center gap-2 font-mono text-muted-foreground text-xs transition-colors hover:text-primary"
													>
														<Github className="h-4 w-4" />
														<span className="truncate">
															{entry.sponsor.login}
														</span>
													</a>
													{(entry.sponsor.websiteUrl ||
														entry.sponsor.linkUrl) && (
														<a
															href={
																entry.sponsor.websiteUrl ||
																entry.sponsor.linkUrl
															}
															target="_blank"
															rel="noopener noreferrer"
															className="group flex items-center gap-2 font-mono text-muted-foreground text-xs transition-colors hover:text-primary"
														>
															<Globe className="h-4 w-4" />
															<span className="truncate">
																{(
																	entry.sponsor.websiteUrl ||
																	entry.sponsor.linkUrl
																)
																	?.replace(/^https?:\/\//, "")
																	?.replace(/\/$/, "")}
															</span>
														</a>
													)}

													{/* <div className="flex items-center gap-2 font-mono text-muted-foreground text-xs">
														<span className="text-xs">👤</span>
														<span>{entry.sponsor.type.toUpperCase()}</span>
													</div> */}
												</div>
											</div>
										</div>
									</div>
								</div>
							);
						})}
					</div>

					<div className="terminal-block-hover rounded border border-border bg-background p-4">
						<a
							href="https://github.com/sponsors/AmanVarshney01"
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center justify-center gap-2 font-mono text-primary transition-colors hover:text-accent"
						>
							<Heart className="h-4 w-4" />
							<span>SUPPORT_PROJECT.EXE</span>
						</a>
					</div>
				</div>
			)}
		</div>
	);
}
