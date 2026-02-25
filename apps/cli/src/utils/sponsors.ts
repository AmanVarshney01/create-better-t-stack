import { log, outro, spinner } from "@clack/prompts";
import { Result } from "better-result";
import { consola } from "consola";
import pc from "picocolors";
import z from "zod";

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

const nullableString = z
  .string()
  .nullish()
  .transform((value) => value ?? undefined);
const nullableNumber = z
  .number()
  .nullish()
  .transform((value) => value ?? undefined);

const sponsorSchema = z.object({
  name: nullableString,
  githubId: z.string(),
  avatarUrl: z.string(),
  websiteUrl: nullableString,
  githubUrl: z.string(),
  tierName: nullableString,
  sinceWhen: z.string(),
  transactionCount: z.number(),
  totalProcessedAmount: nullableNumber,
  formattedAmount: nullableString,
});

const sponsorSummarySchema = z.object({
  total_sponsors: z.number(),
  total_lifetime_amount: z.number(),
  total_current_monthly: z.number(),
  special_sponsors: z.number(),
  current_sponsors: z.number(),
  past_sponsors: z.number(),
  backers: z.number(),
  top_sponsor: z
    .object({
      name: z.string(),
      amount: z.number(),
    })
    .nullish()
    .transform((value) => value ?? undefined),
});

const sponsorEntrySchema = z.object({
  generated_at: z.string(),
  summary: sponsorSummarySchema,
  specialSponsors: z.array(sponsorSchema),
  sponsors: z.array(sponsorSchema),
  pastSponsors: z.array(sponsorSchema),
  backers: z.array(sponsorSchema),
});

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

  const sponsorTokens = sponsors.specialSponsors.map((sponsor) => {
    const displayName = sponsor.name ?? sponsor.githubId;
    return `• ${displayName}`;
  });
  const wrappedSponsorLines = wrapSponsorTokens(sponsorTokens, getPostInstallSponsorLineWidth());

  let output = `${pc.bold("Special sponsors")}\n`;
  wrappedSponsorLines.forEach((line) => {
    output += `${line}\n`;
  });
  return output.trimEnd();
}

function getPostInstallSponsorLineWidth(): number {
  const terminalWidth = process.stdout.columns;
  if (!terminalWidth || terminalWidth <= 0) {
    return 72;
  }

  // Keep room for the surrounding box border/padding and avoid edge wrapping.
  return Math.max(48, terminalWidth - 24);
}

function wrapSponsorTokens(tokens: string[], maxLineWidth: number): string[] {
  const lines: string[] = [];
  const separator = "   ";
  let currentLine = "";

  tokens.forEach((token) => {
    const candidateLine = currentLine ? `${currentLine}${separator}${token}` : token;

    if (candidateLine.length <= maxLineWidth) {
      currentLine = candidateLine;
      return;
    }

    if (currentLine) {
      lines.push(currentLine);
      currentLine = token;
      return;
    }

    lines.push(token);
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
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
      throw new Error(
        `Failed to fetch sponsors: ${response.statusText || String(response.status)}`,
      );
    }

    const rawSponsors = await response.json();
    const parseResult = sponsorEntrySchema.safeParse(rawSponsors);
    if (!parseResult.success) {
      const firstIssue = parseResult.error.issues[0];
      const path = firstIssue?.path?.join(".") || "unknown";
      throw new Error(`Invalid sponsors response format at "${path}"`);
    }

    const sponsors = parseResult.data;
    if (s) {
      s.stop("Sponsors fetched successfully!");
    }

    return sponsors;
  } catch (error) {
    const normalizedError = normalizeSponsorFetchError(error);
    if (s) {
      s.stop(pc.red(normalizedError.message));
    }
    throw normalizedError;
  } finally {
    if (timeout) {
      clearTimeout(timeout);
    }
  }
}

function normalizeSponsorFetchError(error: unknown): Error {
  if (error instanceof Error && error.name === "AbortError") {
    return new Error("Failed to fetch sponsors: request timed out");
  }

  if (error instanceof Error) {
    return error;
  }

  return new Error(`Failed to fetch sponsors: ${String(error)}`);
}
