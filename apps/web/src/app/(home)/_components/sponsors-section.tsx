import {
	ChevronDown,
	ChevronUp,
	Github,
	Globe,
	Heart,
	Star,
	Terminal,
} from "lucide-react";
import Image from "next/image";
// import Link from "next/link";
import { useEffect, useState } from "react";
import {
	filterCurrentSponsors,
	filterPastSponsors,
	filterRegularSponsors,
	filterSpecialSponsors,
	formatSponsorUrl,
	getSponsorUrl,
	isSpecialSponsor,
	sortSpecialSponsors,
	sortSponsors,
} from "@/lib/sponsor-utils";
import type { Sponsor } from "@/lib/types";

export default function SponsorsSection() {
	const [sponsors, setSponsors] = useState<Sponsor[]>([]);
	const [loadingSponsors, setLoadingSponsors] = useState(true);
	const [sponsorError, setSponsorError] = useState<string | null>(null);
	const [showPastSponsors, setShowPastSponsors] = useState(false);

	useEffect(() => {
		fetch("https://sponsors.amanv.dev/sponsors.json")
			.then((res) => {
				if (!res.ok) throw new Error("Failed to fetch sponsors");
				return res.json();
			})
			.then((data) => {
				const sponsorsData = Array.isArray(data) ? data : [];
				const sortedSponsors = sortSponsors(sponsorsData);
				setSponsors(sortedSponsors);
				setLoadingSponsors(false);
			})
			.catch(() => {
				setSponsorError("Could not load sponsors");
				setLoadingSponsors(false);
			});
	}, []);

	const currentSponsors = filterCurrentSponsors(sponsors);
	const pastSponsors = filterPastSponsors(sponsors);

	const specialSponsors = sortSpecialSponsors(
		filterSpecialSponsors(currentSponsors),
	);
	const regularSponsors = filterRegularSponsors(currentSponsors);

	return (
		<div className="mb-12">
			<div className="mb-6 flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
				<div className="flex items-center gap-2">
					<Terminal className="h-5 w-5 text-primary" />
					<span className="font-bold text-lg sm:text-xl">
						SPONSORS_DATABASE.JSON
					</span>
				</div>
				<div className="hidden h-px flex-1 bg-border sm:block" />
				<span className="w-full text-right text-muted-foreground text-xs sm:w-auto sm:text-left">
					[{loadingSponsors ? "LOADING..." : sponsors.length} RECORDS]
				</span>
			</div>
			{loadingSponsors ? (
				<div className="rounded border border-border p-8">
					<div className="flex items-center justify-center gap-2">
						<div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
						<span className=" text-muted-foreground">LOADING_SPONSORS.SH</span>
						<div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
					</div>
				</div>
			) : sponsorError ? (
				<div className="rounded border border-border bg-destructive/10 p-8">
					<div className="flex items-center justify-center gap-2">
						<span className="text-destructive">✗</span>
						<span className=" text-destructive">ERROR: {sponsorError}</span>
					</div>
				</div>
			) : sponsors.length === 0 ? (
				<div className="space-y-4">
					<div className="rounded border border-border p-8">
						<div className="text-center">
							<div className="mb-4 flex items-center justify-center gap-2">
								<span className=" text-muted-foreground">
									NO_SPONSORS_FOUND.NULL
								</span>
							</div>
							<div className="flex items-center justify-center gap-2 text-sm">
								<span className="text-primary">$</span>
								<span className=" text-muted-foreground">
									Be the first to support this project!
								</span>
							</div>
						</div>
					</div>
					<div className="rounded border border-border p-4">
						<a
							href="https://github.com/sponsors/AmanVarshney01"
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center justify-center gap-2 text-primary transition-colors hover:text-accent"
						>
							<Heart className="h-4 w-4" />
							<span>BECOME_SPONSOR.SH</span>
						</a>
					</div>
				</div>
			) : (
				<div className="space-y-8">
					{specialSponsors.length > 0 && (
						<div className="space-y-4">
							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
								{specialSponsors.map((entry, index) => {
									const since = new Date(entry.createdAt).toLocaleDateString(
										undefined,
										{ year: "numeric", month: "short" },
									);
									const sponsorUrl = getSponsorUrl(entry);

									return (
										<div
											key={entry.sponsor.login}
											className="rounded border border-border"
											style={{ animationDelay: `${index * 50}ms` }}
										>
											<div className="border-border border-b px-3 py-2">
												<div className="flex items-center gap-2">
													<Star className="h-4 w-4 text-yellow-500/90" />
													<div className="ml-auto flex items-center gap-2 text-muted-foreground text-xs">
														<span>SPECIAL</span>
														<span>•</span>
														<span>SINCE {since.toUpperCase()}</span>
													</div>
												</div>
											</div>
											<div className="p-4">
												<div className="flex gap-4">
													<div className="flex-shrink-0">
														<Image
															src={
																entry.sponsor.customLogoUrl ||
																entry.sponsor.avatarUrl
															}
															alt={entry.sponsor.name || entry.sponsor.login}
															width={100}
															height={100}
															className="rounded border border-border transition-colors duration-300"
															unoptimized
														/>
													</div>
													<div className="grid grid-cols-1 grid-rows-[1fr_auto] justify-between py-2">
														<div>
															<h3 className="truncate font-semibold text-foreground text-sm">
																{entry.sponsor.name || entry.sponsor.login}
															</h3>
															{entry.tierName && (
																<p className=" text-primary text-xs">
																	{entry.tierName}
																</p>
															)}
														</div>
														<div className="flex flex-col gap-1">
															<a
																href={`https://github.com/${entry.sponsor.login}`}
																target="_blank"
																rel="noopener noreferrer"
																className="group flex items-center gap-2 text-muted-foreground text-xs transition-colors hover:text-primary"
															>
																<Github className="h-4 w-4" />
																<span className="truncate">
																	{entry.sponsor.login}
																</span>
															</a>
															{(entry.sponsor.websiteUrl ||
																entry.sponsor.linkUrl) && (
																<a
																	href={sponsorUrl}
																	target="_blank"
																	rel="noopener noreferrer"
																	className="group flex items-center gap-2 text-muted-foreground text-xs transition-colors hover:text-primary"
																>
																	<Globe className="h-4 w-4" />
																	<span className="truncate">
																		{formatSponsorUrl(sponsorUrl)}
																	</span>
																</a>
															)}
														</div>
													</div>
												</div>
											</div>
										</div>
									);
								})}
							</div>
						</div>
					)}
					{regularSponsors.length > 0 && (
						<div className="space-y-4">
							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
								{regularSponsors.map((entry, index) => {
									const since = new Date(entry.createdAt).toLocaleDateString(
										undefined,
										{ year: "numeric", month: "short" },
									);
									return (
										<div
											key={entry.sponsor.login}
											className="rounded border border-border"
											style={{ animationDelay: `${index * 50}ms` }}
										>
											<div className="border-border border-b px-3 py-2">
												<div className="flex items-center gap-2">
													<span className="text-primary text-xs">▶</span>
													<div className="ml-auto flex items-center gap-2 text-muted-foreground text-xs">
														<span>SINCE {since.toUpperCase()}</span>
													</div>
												</div>
											</div>
											<div className="p-4">
												<div className="flex gap-4">
													<div className="flex-shrink-0">
														<Image
															src={entry.sponsor.avatarUrl}
															alt={entry.sponsor.name || entry.sponsor.login}
															width={100}
															height={100}
															className="rounded border border-border transition-colors duration-300"
															unoptimized
														/>
													</div>
													<div className="grid grid-cols-1 grid-rows-[1fr_auto] justify-between py-2">
														<div>
															<h3 className="truncate font-semibold text-foreground text-sm">
																{entry.sponsor.name || entry.sponsor.login}
															</h3>
															{entry.tierName && (
																<p className=" text-primary text-xs">
																	{entry.tierName}
																</p>
															)}
														</div>
														<div className="flex flex-col gap-1">
															<a
																href={`https://github.com/${entry.sponsor.login}`}
																target="_blank"
																rel="noopener noreferrer"
																className="group flex items-center gap-2 text-muted-foreground text-xs transition-colors hover:text-primary"
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
																	className="group flex items-center gap-2 text-muted-foreground text-xs transition-colors hover:text-primary"
																>
																	<Globe className="h-4 w-4" />
																	<span className="truncate">
																		{formatSponsorUrl(
																			entry.sponsor.websiteUrl ||
																				entry.sponsor.linkUrl,
																		)}
																	</span>
																</a>
															)}
														</div>
													</div>
												</div>
											</div>
										</div>
									);
								})}
							</div>
						</div>
					)}

					{pastSponsors.length > 0 && (
						<div className="space-y-4">
							<button
								type="button"
								onClick={() => setShowPastSponsors(!showPastSponsors)}
								className="flex w-full items-center gap-2 rounded p-2 text-left transition-colors hover:bg-muted/50"
							>
								{showPastSponsors ? (
									<ChevronUp className="h-4 w-4 text-muted-foreground" />
								) : (
									<ChevronDown className="h-4 w-4 text-muted-foreground" />
								)}
								<span className="font-semibold text-muted-foreground text-sm">
									PAST_SPONSORS.ARCHIVE
								</span>
								<span className="text-muted-foreground text-xs">
									({pastSponsors.length})
								</span>
								<div className="mx-2 h-px flex-1 bg-border" />
								<span className="text-muted-foreground text-xs">
									{showPastSponsors ? "HIDE" : "SHOW"}
								</span>
							</button>

							{showPastSponsors && (
								<div className="slide-in-from-top-2 grid animate-in grid-cols-1 gap-4 duration-300 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
									{pastSponsors.map((entry, index) => {
										const since = new Date(entry.createdAt).toLocaleDateString(
											undefined,
											{ year: "numeric", month: "short" },
										);
										const wasSpecial = isSpecialSponsor(entry);
										const sponsorUrl = getSponsorUrl(entry);

										return (
											<div
												key={entry.sponsor.login}
												className="rounded border border-border/70 bg-muted/20"
												style={{ animationDelay: `${index * 50}ms` }}
											>
												<div className="border-border/70 border-b px-3 py-2">
													<div className="flex items-center gap-2">
														{wasSpecial ? (
															<Star className="h-4 w-4 text-yellow-500/60" />
														) : (
															<span className="text-muted-foreground text-xs">
																◆
															</span>
														)}
														<div className="ml-auto flex items-center gap-2 text-muted-foreground text-xs">
															{wasSpecial && <span>SPECIAL</span>}
															{wasSpecial && <span>•</span>}
															<span>SINCE {since.toUpperCase()}</span>
														</div>
													</div>
												</div>
												<div className="p-4">
													<div className="flex gap-4">
														<div className="flex-shrink-0">
															<Image
																src={
																	entry.sponsor.customLogoUrl ||
																	entry.sponsor.avatarUrl
																}
																alt={entry.sponsor.name || entry.sponsor.login}
																width={80}
																height={80}
																className="rounded border border-border/70"
																unoptimized
															/>
														</div>
														<div className="grid grid-cols-1 grid-rows-[1fr_auto] justify-between">
															<div>
																<h3 className="truncate font-semibold text-muted-foreground text-sm">
																	{entry.sponsor.name || entry.sponsor.login}
																</h3>
																{entry.tierName && (
																	<p className="text-muted-foreground/70 text-xs">
																		{entry.tierName}
																	</p>
																)}
															</div>
															<div className="flex flex-col gap-1">
																<a
																	href={`https://github.com/${entry.sponsor.login}`}
																	target="_blank"
																	rel="noopener noreferrer"
																	className="group flex items-center gap-2 text-muted-foreground/70 text-xs transition-colors hover:text-muted-foreground"
																>
																	<Github className="h-4 w-4" />
																	<span className="truncate">
																		{entry.sponsor.login}
																	</span>
																</a>
																{(entry.sponsor.websiteUrl ||
																	entry.sponsor.linkUrl) && (
																	<a
																		href={sponsorUrl}
																		target="_blank"
																		rel="noopener noreferrer"
																		className="group flex items-center gap-2 text-muted-foreground/70 text-xs transition-colors hover:text-muted-foreground"
																	>
																		<Globe className="h-4 w-4" />
																		<span className="truncate">
																			{formatSponsorUrl(sponsorUrl)}
																		</span>
																	</a>
																)}
															</div>
														</div>
													</div>
												</div>
											</div>
										);
									})}
								</div>
							)}
						</div>
					)}

					<div className="rounded border border-border p-4">
						<a
							href="https://github.com/sponsors/AmanVarshney01"
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center justify-center gap-2 text-primary transition-colors hover:text-accent"
						>
							<Heart className="h-4 w-4" />
							<span>SUPPORT_PROJECT.SH</span>
						</a>
					</div>
				</div>
			)}
		</div>
	);
}
