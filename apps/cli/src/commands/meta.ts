import { intro, log } from "@clack/prompts";
import { Result } from "better-result";
import pc from "picocolors";

import { CLIError, displayError } from "../utils/errors";
import { openUrl } from "../utils/open-url";
import { renderTitle } from "../utils/render-title";
import { displaySponsors, fetchSponsors } from "../utils/sponsors";

const DOCS_URL = "https://better-t-stack.dev/docs";
const BUILDER_URL = "https://better-t-stack.dev/new";

async function openExternalUrl(url: string, successMessage: string) {
  const result = await Result.tryPromise({
    try: () => openUrl(url),
    catch: () => null,
  });

  if (result.isOk()) {
    log.success(pc.blue(successMessage));
  } else {
    log.message(`Please visit ${url}`);
  }
}

export async function showSponsorsCommand() {
  const result = await Result.tryPromise({
    try: async () => {
      renderTitle();
      intro(pc.magenta("Better-T-Stack Sponsors"));
      const sponsors = await fetchSponsors();
      displaySponsors(sponsors);
    },
    catch: (error: unknown) =>
      new CLIError({
        message: error instanceof Error ? error.message : "Failed to display sponsors",
        cause: error,
      }),
  });

  if (result.isErr()) {
    displayError(result.error);
    process.exit(1);
  }
}

export async function openDocsCommand() {
  await openExternalUrl(DOCS_URL, "Opened docs in your default browser.");
}

export async function openBuilderCommand() {
  await openExternalUrl(BUILDER_URL, "Opened builder in your default browser.");
}
