import { log, outro, spinner } from "@clack/prompts";
import { consola } from "consola";
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
	name?: string;
	githubId: string;
	avatarUrl: string;
	websiteUrl?: string;
	githubUrl: string;
	tierName?: string;
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

export const SPONSORS_JSON_URL =
	"https://sponsors.better-t-stack.dev/sponsors.json";

export async function fetchSponsors(url: string = SPONSORS_JSON_URL) {
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

	displaySponsorsBox(sponsors);

	if (total_sponsors - sponsors.specialSponsors.length > 0) {
		log.message(
			pc.blue(
				`+${total_sponsors - sponsors.specialSponsors.length} more amazing sponsors.\n`,
			),
		);
	}
	outro(
		pc.magenta(
			"Visit https://github.com/sponsors/AmanVarshney01 to become a sponsor.",
		),
	);
}

function displaySponsorsBox(sponsors: SponsorEntry) {
	if (sponsors.specialSponsors.length === 0) {
		return;
	}

	let output = `${pc.bold(pc.cyan("-> Special Sponsors"))}\n\n`;

	sponsors.specialSponsors.forEach((sponsor: Sponsor, idx: number) => {
		const displayName = sponsor.name ?? sponsor.githubId;
		const tier = sponsor.tierName
			? ` ${pc.yellow(`(${sponsor.tierName})`)}`
			: "";

		output += `${pc.green(`• ${displayName}`)}${tier}\n`;
		output += `  ${pc.dim("GitHub:")} https://github.com/${sponsor.githubId}\n`;

		const website = sponsor.websiteUrl ?? sponsor.githubUrl;
		if (website) {
			output += `  ${pc.dim("Website:")} ${website}\n`;
		}

		if (idx < sponsors.specialSponsors.length - 1) {
			output += "\n";
		}
	});

	consola.box(output);
}
