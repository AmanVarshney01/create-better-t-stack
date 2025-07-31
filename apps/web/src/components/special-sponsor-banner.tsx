"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
	filterCurrentSponsors,
	filterSpecialSponsors,
	sortSpecialSponsors,
} from "@/lib/sponsor-utils";
import type { Sponsor } from "@/lib/types";

export function SpecialSponsorBanner() {
	const [specialSponsors, setSpecialSponsors] = useState<Sponsor[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetch("https://sponsors.amanv.dev/sponsors.json")
			.then((res) => {
				if (!res.ok) throw new Error("Failed to fetch sponsors");
				return res.json();
			})
			.then((data) => {
				const sponsorsData = Array.isArray(data) ? data : [];
				const currentSponsors = filterCurrentSponsors(sponsorsData);
				const specials = sortSpecialSponsors(
					filterSpecialSponsors(currentSponsors),
				);
				setSpecialSponsors(specials);
				setLoading(false);
			})
			.catch(() => {
				setLoading(false);
			});
	}, []);

	if (loading) {
		return (
			<div className="">
				<div className="flex items-center gap-3">
					<div className="h-[30px] w-[30px] animate-pulse rounded border border-border bg-muted" />
					<div className="min-w-0 flex-1">
						<div className="h-4 w-20 animate-pulse rounded bg-muted" />
					</div>
				</div>
			</div>
		);
	}

	if (!specialSponsors.length) {
		return null;
	}

	return (
		<div className="">
			<div className="flex flex-col gap-2">
				{specialSponsors.map((sponsor) => (
					<div key={sponsor.sponsor.login} className="flex items-center gap-3">
						<Image
							src={sponsor.sponsor.customLogoUrl || sponsor.sponsor.avatarUrl}
							alt={sponsor.sponsor.name || sponsor.sponsor.login}
							width={30}
							height={30}
							className="rounded border border-border"
							unoptimized
						/>
						<div className="min-w-0 flex-1">
							<h4 className="truncate font-medium text-sm">
								{sponsor.sponsor.name || sponsor.sponsor.login}
							</h4>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
