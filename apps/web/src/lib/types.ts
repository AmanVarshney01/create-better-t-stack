export type TechCategory =
	| "core"
	| "frontend"
	| "backend"
	| "database"
	| "auth"
	| "orm"
	| "router";

export interface TechNode {
	id: string;
	type: string;
	position: { x: number; y: number };
	data: {
		label: string;
		category: TechCategory;
		description: string;
		isDefault: boolean;
		alternatives?: string[];
		isActive: boolean;
		group?: TechCategory;
		isStatic?: boolean;
	};
}

export interface TechEdge {
	id: string;
	source: string;
	target: string;
	type?: string;
	animated?: boolean;
}

export interface Sponsor {
	sponsor: {
		login: string;
		name: string;
		avatarUrl: string;
		websiteUrl?: string;
		linkUrl: string;
		customLogoUrl: string;
		type: string;
	};
	isOneTime: boolean;
	monthlyDollars: number;
	privacyLevel: string;
	tierName: string;
	createdAt: string;
	provider: string;
}
