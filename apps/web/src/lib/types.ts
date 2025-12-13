// Re-export TechCategory from shared types
export type { TechCategory } from "@better-t-stack/types";

export type TechEdge = {
  id: string;
  source: string;
  target: string;
  type?: string;
  animated?: boolean;
};

export type Sponsor = {
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
};

export type SponsorsData = {
  generated_at: string;
  summary: {
    total_sponsors: number;
    total_lifetime_amount: number;
    total_current_monthly: number;
    special_sponsors: number;
    current_sponsors: number;
    past_sponsors: number;
    backers: number;
    top_sponsor: {
      name: string;
      amount: number;
    };
  };
  specialSponsors: Sponsor[];
  sponsors: Sponsor[];
  pastSponsors: Sponsor[];
  backers: Sponsor[];
};
