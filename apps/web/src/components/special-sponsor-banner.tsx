import { Github, Globe, Star } from "lucide-react";
import Image from "next/image";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
	formatSponsorUrl,
	getSponsorUrl,
	sortSpecialSponsors,
} from "@/lib/sponsor-utils";
import { fetchSponsors } from "@/lib/sponsors";

export async function SpecialSponsorBanner() {
	const data = await fetchSponsors();
	const specialSponsors = sortSpecialSponsors(data.specialSponsors);

	if (!specialSponsors.length) {
		return null;
	}

	return (
		<div>
			<div className="no-scrollbar grid grid-cols-4 items-center gap-2 overflow-x-auto whitespace-nowrap py-1">
				{specialSponsors.map((entry) => {
					const sponsorUrl = getSponsorUrl(entry);

					return (
						<HoverCard key={entry.githubId}>
							<HoverCardTrigger asChild>
								<a
									href={entry.websiteUrl || sponsorUrl}
									target="_blank"
									rel="noopener noreferrer"
									aria-label={entry.name}
									className="inline-flex"
								>
									<Image
										src={entry.avatarUrl}
										alt={entry.name}
										width={66}
										height={66}
										className="size-12 rounded border border-border"
										unoptimized
									/>
								</a>
							</HoverCardTrigger>
							<HoverCardContent
								align="start"
								sideOffset={8}
								className="bg-fd-background"
							>
								<div className="space-y-3">
									<div className="flex items-center gap-2">
										<Star className="h-4 w-4 text-yellow-500/90" />
										<div className="ml-auto text-muted-foreground text-xs">
											<span>SPECIAL</span>
											<span className="px-1">•</span>
											<span>{entry.sinceWhen.toUpperCase()}</span>
										</div>
									</div>
									<div className="flex gap-3">
										<Image
											src={entry.avatarUrl}
											alt={entry.name}
											width={80}
											height={80}
											className="rounded border border-border"
											unoptimized
										/>
										<div className="grid grid-cols-1 grid-rows-[1fr_auto]">
											<div>
												<h3 className="truncate font-semibold text-sm">
													{entry.name}
												</h3>
												{entry.tierName ? (
													<p className="text-primary text-xs">
														{entry.tierName}
													</p>
												) : null}
											</div>
											<div className="flex flex-col gap-1">
												<a
													href={entry.githubUrl}
													target="_blank"
													rel="noopener noreferrer"
													className="group flex items-center gap-2 text-muted-foreground text-xs transition-colors hover:text-primary"
												>
													<Github className="h-4 w-4" />
													<span className="truncate">{entry.githubId}</span>
												</a>
												{entry.websiteUrl ? (
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
												) : null}
											</div>
										</div>
									</div>
								</div>
							</HoverCardContent>
						</HoverCard>
					);
				})}
			</div>
		</div>
	);
}
