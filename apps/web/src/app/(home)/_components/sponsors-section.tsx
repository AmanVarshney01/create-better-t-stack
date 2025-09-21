"use client";
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
import { useState } from "react";
import {
	filterVisibleSponsors,
	formatSponsorUrl,
	getSponsorUrl,
	isSpecialSponsor,
	shouldShowLifetimeTotal,
	sortSpecialSponsors,
} from "@/lib/sponsor-utils";
import type { SponsorsData } from "@/lib/types";

export default function SponsorsSection({
	sponsorsData,
}: {
	sponsorsData: SponsorsData;
}) {
	const [showPastSponsors, setShowPastSponsors] = useState(false);

	const allCurrentSponsors = [
		...sponsorsData.specialSponsors,
		...sponsorsData.sponsors,
	];
	const visibleSponsors = filterVisibleSponsors(allCurrentSponsors);
	const pastSponsors = sponsorsData.pastSponsors;
	const specialSponsors = sortSpecialSponsors(sponsorsData.specialSponsors);

	return (
		<div className="">
			<div className="mb-6 flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
				<div className="flex items-center gap-2">
					<Terminal className="h-5 w-5 text-primary" />
					<span className="font-bold text-lg sm:text-xl">
						SPONSORS_DATABASE.JSON
					</span>
				</div>
				<div className="hidden h-px flex-1 bg-border sm:block" />
				<div className="flex items-center gap-2">
					<span className="text-muted-foreground text-xs">
						[{visibleSponsors.length} RECORDS]
					</span>
				</div>
			</div>
			{visibleSponsors.length === 0 ? (
				<div className="space-y-4">
					<div className="rounded border border-border p-8">
						<div className="text-center">
							<div className="mb-4 flex items-center justify-center gap-2">
								<span className="text-muted-foreground">
									NO_SPONSORS_FOUND.NULL
								</span>
							</div>
							<div className="flex items-center justify-center gap-2 text-sm">
								<span className="text-primary">$</span>
								<span className="text-muted-foreground">
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
									const sponsorUrl = getSponsorUrl(entry);

									return (
										<div
											key={entry.githubId}
											className="rounded border border-border"
											style={{ animationDelay: `${index * 50}ms` }}
										>
											<div className="border-border border-b px-3 py-2">
												<div className="flex items-center gap-2">
													<Star className="h-4 w-4 text-yellow-500/90" />
													<div className="ml-auto flex items-center gap-2 text-muted-foreground text-xs">
														<span>SPECIAL</span>
														<span>•</span>
														<span>{entry.sinceWhen.toUpperCase()}</span>
													</div>
												</div>
											</div>
											<div className="p-4">
												<div className="flex gap-4">
													<div className="flex-shrink-0">
														<Image
															src={entry.avatarUrl}
															alt={entry.name}
															width={100}
															height={100}
															className="rounded border border-border transition-colors duration-300"
															unoptimized
														/>
													</div>
													<div className="grid grid-cols-1 grid-rows-[1fr_auto] justify-between py-2">
														<div>
															<h3 className="truncate font-semibold text-foreground text-sm">
																{entry.name}
															</h3>
															{shouldShowLifetimeTotal(entry) ? (
																<>
																	{entry.tierName && (
																		<p className="text-primary text-xs">
																			{entry.tierName}
																		</p>
																	)}
																	<p className="text-muted-foreground text-xs">
																		Total: {entry.formattedAmount}
																	</p>
																</>
															) : (
																<p className="text-primary text-xs">
																	{entry.tierName}
																</p>
															)}
														</div>
														<div className="flex flex-col">
															<a
																href={entry.githubUrl}
																target="_blank"
																rel="noopener noreferrer"
																className="group flex items-center gap-2 text-muted-foreground text-xs transition-colors hover:text-primary"
															>
																<Github className="size-3" />
																<span className="truncate">
																	{entry.githubId}
																</span>
															</a>
															{entry.websiteUrl && (
																<a
																	href={sponsorUrl}
																	target="_blank"
																	rel="noopener noreferrer"
																	className="group flex items-center gap-2 text-muted-foreground text-xs transition-colors hover:text-primary"
																>
																	<Globe className="size-3" />
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

					{sponsorsData.sponsors.length > 0 && (
						<div className="space-y-4">
							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
								{sponsorsData.sponsors.map((entry, index) => {
									const sponsorUrl = getSponsorUrl(entry);
									return (
										<div
											key={entry.githubId}
											className="rounded border border-border"
											style={{ animationDelay: `${index * 50}ms` }}
										>
											<div className="border-border border-b px-3 py-2">
												<div className="flex items-center gap-2">
													<span className="text-primary text-xs">▶</span>
													<div className="ml-auto flex items-center gap-2 text-muted-foreground text-xs">
														<span>{entry.sinceWhen.toUpperCase()}</span>
													</div>
												</div>
											</div>
											<div className="p-4">
												<div className="flex gap-4">
													<div className="flex-shrink-0">
														<Image
															src={entry.avatarUrl}
															alt={entry.name}
															width={100}
															height={100}
															className="rounded border border-border transition-colors duration-300"
															unoptimized
														/>
													</div>
													<div className="grid grid-cols-1 grid-rows-[1fr_auto] justify-between py-2">
														<div>
															<h3 className="truncate font-semibold text-foreground text-sm">
																{entry.name}
															</h3>
															{shouldShowLifetimeTotal(entry) ? (
																<>
																	{entry.tierName && (
																		<p className="text-primary text-xs">
																			{entry.tierName}
																		</p>
																	)}
																	<p className="text-muted-foreground text-xs">
																		Total: {entry.formattedAmount}
																	</p>
																</>
															) : (
																<p className="text-primary text-xs">
																	{entry.tierName}
																</p>
															)}
														</div>
														<div className="flex flex-col">
															<a
																href={entry.githubUrl}
																target="_blank"
																rel="noopener noreferrer"
																className="group flex items-center gap-2 text-muted-foreground text-xs transition-colors hover:text-primary"
															>
																<Github className="size-3" />
																<span className="truncate">
																	{entry.githubId}
																</span>
															</a>
															{entry.websiteUrl && (
																<a
																	href={sponsorUrl}
																	target="_blank"
																	rel="noopener noreferrer"
																	className="group flex items-center gap-2 text-muted-foreground text-xs transition-colors hover:text-primary"
																>
																	<Globe className="size-3" />
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

					{pastSponsors.length > 0 && (
						<div className="space-y-4">
							<button
								type="button"
								onClick={() => setShowPastSponsors(!showPastSponsors)}
								className="flex w-full items-center gap-2 rounded border border-muted p-2 text-left transition-colors hover:bg-muted"
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
										const wasSpecial = isSpecialSponsor(entry);
										const sponsorUrl = getSponsorUrl(entry);

										return (
											<div
												key={entry.githubId}
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
															<span>{entry.sinceWhen.toUpperCase()}</span>
														</div>
													</div>
												</div>
												<div className="p-4">
													<div className="flex gap-4">
														<div className="flex-shrink-0">
															<Image
																src={entry.avatarUrl}
																alt={entry.name}
																width={80}
																height={80}
																className="rounded border border-border/70"
																unoptimized
															/>
														</div>
														<div className="grid grid-cols-1 grid-rows-[1fr_auto] justify-between">
															<div>
																<h3 className="truncate font-semibold text-muted-foreground text-sm">
																	{entry.name}
																</h3>
																{shouldShowLifetimeTotal(entry) ? (
																	<>
																		{entry.tierName && (
																			<p className="text-muted-foreground/70 text-xs">
																				{entry.tierName}
																			</p>
																		)}
																		<p className="text-muted-foreground/50 text-xs">
																			Total: {entry.formattedAmount}
																		</p>
																	</>
																) : (
																	<p className="text-muted-foreground/70 text-xs">
																		{entry.tierName}
																	</p>
																)}
															</div>
															<div className="flex flex-col">
																<a
																	href={entry.githubUrl}
																	target="_blank"
																	rel="noopener noreferrer"
																	className="group flex items-center gap-2 text-muted-foreground/70 text-xs transition-colors hover:text-muted-foreground"
																>
																	<Github className="size-3" />
																	<span className="truncate">
																		{entry.githubId}
																	</span>
																</a>
																{entry.websiteUrl && (
																	<a
																		href={sponsorUrl}
																		target="_blank"
																		rel="noopener noreferrer"
																		className="group flex items-center gap-2 text-muted-foreground/70 text-xs transition-colors hover:text-muted-foreground"
																	>
																		<Globe className="size-3" />
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
