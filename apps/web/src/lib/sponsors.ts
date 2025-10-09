import type { SponsorsData } from "./types";

const SPONSORS_URL = "https://sponsors.better-t-stack.dev/sponsors.json";

export async function fetchSponsors() {
	try {
		const response = await fetch(SPONSORS_URL, {
			next: { revalidate: 3600 },
		});

		if (!response.ok) {
			throw new Error(`Failed to fetch sponsors: ${response.status}`);
		}

		const data = await response.json();
		return data as SponsorsData;
	} catch (error) {
		console.error("Error fetching sponsors:", error);
		return {
			generated_at: new Date().toISOString(),
			summary: {
				total_sponsors: 0,
				total_lifetime_amount: 0,
				total_current_monthly: 0,
				special_sponsors: 0,
				current_sponsors: 0,
				past_sponsors: 0,
				top_sponsor: { name: "", amount: 0 },
			},
			specialSponsors: [],
			sponsors: [],
			pastSponsors: [],
		};
	}
}
