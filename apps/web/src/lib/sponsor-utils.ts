import type { Sponsor } from "@/lib/types";

export const SPECIAL_SPONSOR_THRESHOLD = 100;

export const getSponsorAmount = (sponsor: Sponsor): number => {
	// For past sponsors, return 0
	if (sponsor.monthlyDollars === -1) {
		return 0;
	}

	// For one-time sponsors, parse the actual amount from tierName
	if (sponsor.isOneTime && sponsor.tierName) {
		const match = sponsor.tierName.match(/\$(\d+(?:\.\d+)?)/);
		return match ? Number.parseFloat(match[1]) : sponsor.monthlyDollars;
	}

	// For monthly sponsors, use monthlyDollars
	return sponsor.monthlyDollars;
};

export const isSpecialSponsor = (sponsor: Sponsor): boolean => {
	const amount = getSponsorAmount(sponsor);
	return amount >= SPECIAL_SPONSOR_THRESHOLD;
};

export const sortSponsors = (sponsors: Sponsor[]): Sponsor[] => {
	return sponsors.sort((a, b) => {
		// Past sponsors (monthlyDollars === -1) go to the end
		if (a.monthlyDollars === -1 && b.monthlyDollars !== -1) return 1;
		if (a.monthlyDollars !== -1 && b.monthlyDollars === -1) return -1;

		// If both are past sponsors, sort by creation date (newest first)
		if (a.monthlyDollars === -1 && b.monthlyDollars === -1) {
			return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
		}

		// For current sponsors, sort by actual amount (highest first)
		const aAmount = getSponsorAmount(a);
		const bAmount = getSponsorAmount(b);
		if (aAmount !== bAmount) {
			return bAmount - aAmount;
		}

		// If amounts are equal, sort by creation date (oldest first)
		return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
	});
};

export const sortSpecialSponsors = (sponsors: Sponsor[]): Sponsor[] => {
	return sponsors.sort((a, b) => {
		// Sort by actual amount (highest first)
		const aAmount = getSponsorAmount(a);
		const bAmount = getSponsorAmount(b);
		if (aAmount !== bAmount) {
			return bAmount - aAmount;
		}
		// If amounts are equal, sort by creation date (oldest first)
		return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
	});
};

export const filterCurrentSponsors = (sponsors: Sponsor[]): Sponsor[] => {
	return sponsors.filter((sponsor) => sponsor.monthlyDollars !== -1);
};

export const filterPastSponsors = (sponsors: Sponsor[]): Sponsor[] => {
	return sponsors.filter((sponsor) => sponsor.monthlyDollars === -1);
};

export const filterSpecialSponsors = (sponsors: Sponsor[]): Sponsor[] => {
	return sponsors.filter(isSpecialSponsor);
};

export const filterRegularSponsors = (sponsors: Sponsor[]): Sponsor[] => {
	return sponsors.filter((sponsor) => !isSpecialSponsor(sponsor));
};

export const getSponsorUrl = (sponsor: Sponsor): string => {
	return (
		sponsor.sponsor.websiteUrl ||
		sponsor.sponsor.linkUrl ||
		`https://github.com/${sponsor.sponsor.login}`
	);
};

export const formatSponsorUrl = (url: string): string => {
	return url?.replace(/^https?:\/\//, "")?.replace(/\/$/, "");
};
