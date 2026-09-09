import type {
  Backend,
  FullstackFrontend,
  NativeFrontend,
  ProjectConfig,
  WebFrontend,
} from "@better-t-stack/types";

export type StackState = Pick<
  ProjectConfig,
  | "runtime"
  | "database"
  | "orm"
  | "dbSetup"
  | "auth"
  | "payments"
  | "packageManager"
  | "addons"
  | "examples"
  | "api"
  | "webDeploy"
  | "serverDeploy"
> & {
  projectName: string | null;
  webFrontend: WebFrontend[];
  nativeFrontend: NativeFrontend[];
  backend: Exclude<Backend, "self"> | `self-${FullstackFrontend}`;
  git: "true" | "false";
  install: "true" | "false";
  yolo: "true" | "false";
};

export type TechCategory = Exclude<keyof StackState, "projectName" | "yolo">;
type StackOptionIds = {
  [K in TechCategory]: Extract<StackState[K] extends (infer Id)[] ? Id : StackState[K], string>;
};
export type StackOptionId<K extends TechCategory> = StackOptionIds[K];
export type TechOptions = {
  [K in TechCategory]: {
    id: StackOptionId<K>;
    name: string;
    description: string;
    icon: string;
    color: string;
    default?: boolean;
    className?: string;
    experimental?: boolean;
  }[];
};

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
  websiteUrl?: string | null;
  // Optional display text for the website link. When set, show this label
  // instead of the URL while still linking to websiteUrl (e.g. show
  // "CodeRabbit.ai" but link to a redirect URL).
  websiteLabel?: string | null;
  githubUrl: string;
  tierName: string;
  totalProcessedAmount: number;
  sinceWhen: string;
  transactionCount: number;
  formattedAmount: string;
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
    } | null;
  };
  specialSponsors: Sponsor[];
  sponsors: Sponsor[];
  pastSponsors: Sponsor[];
  backers: Sponsor[];
};
