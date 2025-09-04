import { log, outro, spinner } from "@clack/prompts";
import pc from "picocolors";

type SponsorSummary = {
	total_sponsors: number;
	total_lifetime_amount: number;
	total_current_monthly: number;
	special_sponsors: number;
	current_sponsors: number;
	past_sponsors: number;
	backers: number;
	top_sponsor?: {
		name: string;
		amount: number;
	};
};

type Sponsor = {
	name: string;
	githubId: string;
	avatarUrl: string;
	websiteUrl: string;
	githubUrl: string;
	tierName: string;
	sinceWhen: string;
	transactionCount: number;
	totalProcessedAmount?: number;
	formattedAmount?: string;
};

type SponsorEntry = {
	generated_at: string;
	summary: SponsorSummary;
	specialSponsors: Sponsor[];
	sponsors: Sponsor[];
	pastSponsors: Sponsor[];
	backers: Sponsor[];
};

export const SPONSORS_JSON_URL = "https://sponsors.amanv.dev/sponsors.json";

export async function fetchSponsors(
	url: string = SPONSORS_JSON_URL,
): Promise<SponsorEntry> {
	const s = spinner();
	s.start("Fetching sponsors…");

	const response = await fetch(url);
	if (!response.ok) {
		s.stop(pc.red(`Failed to fetch sponsors: ${response.statusText}`));
		throw new Error(`Failed to fetch sponsors: ${response.statusText}`);
	}

	const sponsors = (await response.json()) as SponsorEntry;
	s.stop("Sponsors fetched successfully!");
	return sponsors;
}

// TODO: Fixed the sponsor display
export function displaySponsors(sponsors: SponsorEntry) {
	const { total_sponsors } = sponsors.summary;
	if (total_sponsors === 0) {
		log.info("No sponsors found. You can be the first one! ✨");
		outro(
			pc.cyan(
				"Visit https://github.com/sponsors/AmanVarshney01 to become a sponsor.",
			),
		);
		return;
	}

	listSponsors(sponsors.specialSponsors);
	// listSponsors(sponsors.sponsors);
	// listSponsors(sponsors.pastSponsors);
	// listSponsors(sponsors.backers);

	log.message("");
	outro(
		pc.magenta(
			`There are ${total_sponsors - sponsors.specialSponsors.length}+ more amazing sponsors.\n   https://github.com/sponsors/AmanVarshney01 to become a sponsor.`,
		),
	);
}

function listSponsors(sponsors: Sponsor[]) {
	if (sponsors.length === 0) {
		return;
	}

	log.message("Sponsors:");
	sponsors.forEach((sponsor: Sponsor, idx: number) => {
		const displayName = sponsor.name ?? sponsor.githubId;
		const tier = sponsor.tierName ? ` (${sponsor.tierName})` : "";

		log.step(`${idx + 1}. ${pc.green(displayName)}${pc.yellow(tier)}`);
		log.message(
			`   ${pc.dim("GitHub:")} https://github.com/${sponsor.githubId}`,
		);

		const website = sponsor.websiteUrl ?? sponsor.githubUrl;
		if (website) {
			log.message(`   ${pc.dim("Website:")} ${website}`);
		}
	});
}
