export type TechCategory =
	| "api"
	| "webFrontend"
	| "nativeFrontend"
	| "runtime"
	| "backend"
	| "database"
	| "orm"
	| "dbSetup"
	| "webDeploy"
	| "serverDeploy"
	| "auth"
	| "payments"
	| "packageManager"
	| "addons"
	| "examples"
	| "git"
	| "install";

export interface TechEdge {
	id: string;
	source: string;
	target: string;
	type?: string;
	animated?: boolean;
}

export interface Sponsor {
	name: string;
	githubId: string;
	avatarUrl: string;
	websiteUrl?: string;
	githubUrl: string;
	tierName: string;
	totalProcessedAmount?: number;
	sinceWhen: string;
	transactionCount: number;
	formattedAmount?: string;
}

export interface SponsorsData {
	generated_at: string;
	summary: {
		total_sponsors: number;
		total_lifetime_amount: number;
		total_current_monthly: number;
		special_sponsors: number;
		current_sponsors: number;
		past_sponsors: number;
		top_sponsor: {
			name: string;
			amount: number;
		};
	};
	specialSponsors: Sponsor[];
	sponsors: Sponsor[];
	pastSponsors: Sponsor[];
}
