import { log, outro, spinner } from "@clack/prompts";
import { Result } from "better-result";
import { consola } from "consola";
import pc from "picocolors";

export const SPONSORS_JSON_URL = "https://sponsors.better-t-stack.dev/sponsors.json";
export const GITHUB_SPONSOR_URL = "https://github.com/sponsors/AmanVarshney01";

export type SponsorSummary = {
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

export type Sponsor = {
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

export type SponsorEntry = {
  generated_at: string;
  summary: SponsorSummary;
  specialSponsors: Sponsor[];
  sponsors: Sponsor[];
  pastSponsors: Sponsor[];
  backers: Sponsor[];
};

type FetchSponsorsOptions = {
  url?: string;
  withSpinner?: boolean;
  timeoutMs?: number;
};

export async function fetchSponsors(url: string = SPONSORS_JSON_URL) {
  return fetchSponsorsData({ url, withSpinner: true });
}

export async function fetchSponsorsQuietly({
  url = SPONSORS_JSON_URL,
  timeoutMs = 1500,
}: {
  url?: string;
  timeoutMs?: number;
} = {}): Promise<Result<SponsorEntry, Error>> {
  return Result.tryPromise({
    try: () => fetchSponsorsData({ url, withSpinner: false, timeoutMs }),
    catch: (error) =>
      error instanceof Error ? error : new Error(`Failed to fetch sponsors: ${String(error)}`),
  });
}

export function displaySponsors(sponsors: SponsorEntry) {
  const { total_sponsors } = sponsors.summary;
  if (total_sponsors === 0) {
    log.info("No sponsors found. You can be the first one! ✨");
    outro(pc.cyan(`Visit ${GITHUB_SPONSOR_URL} to become a sponsor.`));
    return;
  }

  displaySponsorsBox(sponsors);

  if (total_sponsors - sponsors.specialSponsors.length > 0) {
    log.message(
      pc.blue(`+${total_sponsors - sponsors.specialSponsors.length} more amazing sponsors.\n`),
    );
  }
  outro(pc.magenta(`Visit ${GITHUB_SPONSOR_URL} to become a sponsor.`));
}

function displaySponsorsBox(sponsors: SponsorEntry) {
  if (sponsors.specialSponsors.length === 0) {
    return;
  }

  let output = `${pc.bold(pc.cyan("-> Special Sponsors"))}\n\n`;

  sponsors.specialSponsors.forEach((sponsor: Sponsor, idx: number) => {
    const displayName = sponsor.name ?? sponsor.githubId;
    const tier = sponsor.tierName ? ` ${pc.yellow(`(${sponsor.tierName})`)}` : "";

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

export function formatPostInstallSpecialSponsorsSection(sponsors: SponsorEntry): string {
  if (sponsors.specialSponsors.length === 0) {
    return "";
  }

  let output = `${pc.bold("Special sponsors")}\n`;

  sponsors.specialSponsors.forEach((sponsor) => {
    const displayName = sponsor.name ?? sponsor.githubId;
    output += `${pc.cyan("•")} ${pc.green(displayName)}\n`;
  });

  output += `${pc.cyan("+")} Become a sponsor: ${GITHUB_SPONSOR_URL}`;
  return output;
}

async function fetchSponsorsData({
  url = SPONSORS_JSON_URL,
  withSpinner = false,
  timeoutMs,
}: FetchSponsorsOptions): Promise<SponsorEntry> {
  const s = withSpinner ? spinner() : null;
  if (s) {
    s.start("Fetching sponsors…");
  }

  const controller = timeoutMs ? new AbortController() : null;
  const timeout = timeoutMs
    ? setTimeout(() => {
        controller?.abort();
      }, timeoutMs)
    : null;

  try {
    const response = await fetch(url, controller ? { signal: controller.signal } : undefined);
    if (!response.ok) {
      if (s) {
        s.stop(pc.red(`Failed to fetch sponsors: ${response.statusText}`));
      }
      throw new Error(`Failed to fetch sponsors: ${response.statusText}`);
    }

    const sponsors = (await response.json()) as SponsorEntry;
    if (s) {
      s.stop("Sponsors fetched successfully!");
    }

    return sponsors;
  } catch (error) {
    if (s && error instanceof Error && error.name === "AbortError") {
      s.stop(pc.red("Failed to fetch sponsors: request timed out"));
    }
    throw error;
  } finally {
    if (timeout) {
      clearTimeout(timeout);
    }
  }
}
