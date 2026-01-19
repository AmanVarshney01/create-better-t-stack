// Ecosystem type for selecting language ecosystem
export type Ecosystem = "typescript" | "rust";

// TechCategory for the stack builder UI
export type TechCategory =
  | "api"
  | "webFrontend"
  | "nativeFrontend"
  | "astroIntegration"
  | "runtime"
  | "backend"
  | "database"
  | "orm"
  | "dbSetup"
  | "webDeploy"
  | "serverDeploy"
  | "auth"
  | "payments"
  | "email"
  | "fileUpload"
  | "logging"
  | "observability"
  | "backendLibraries"
  | "stateManagement"
  | "forms"
  | "validation"
  | "testing"
  | "realtime"
  | "animation"
  | "cssFramework"
  | "uiLibrary"
  | "codeQuality"
  | "documentation"
  | "appPlatforms"
  | "packageManager"
  | "examples"
  | "git"
  | "install"
  // Rust ecosystem categories
  | "rustWebFramework"
  | "rustFrontend"
  | "rustOrm"
  | "rustApi"
  | "rustCli"
  | "rustLibraries";

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
