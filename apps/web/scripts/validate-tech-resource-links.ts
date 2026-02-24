import { TECH_OPTIONS } from "../src/lib/constant";
import { getTechResourceLinks } from "../src/lib/tech-resource-links";

type LinkKind = "docsUrl" | "githubUrl";

type LinkCheckTarget = {
  category: string;
  id: string;
  kind: LinkKind;
  url: string;
};

const SKIP_IDS = new Set(["none", "true", "false"]);
const LIVE_MODE = process.argv.includes("--live");

function isValidHttpsUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:";
  } catch {
    return false;
  }
}

async function fetchStatus(url: string): Promise<number> {
  const head = await fetch(url, {
    method: "HEAD",
    redirect: "follow",
  });

  if (head.ok) return head.status;
  if (head.status === 405 || head.status === 403) {
    const get = await fetch(url, {
      method: "GET",
      redirect: "follow",
    });
    return get.status;
  }

  return head.status;
}

async function run() {
  const errors: string[] = [];
  const warnings: string[] = [];
  const liveTargets: LinkCheckTarget[] = [];

  let optionCount = 0;
  let linkedCount = 0;

  for (const [category, options] of Object.entries(TECH_OPTIONS)) {
    for (const option of options) {
      if (SKIP_IDS.has(option.id)) continue;
      optionCount += 1;

      const links = getTechResourceLinks(category, option.id);
      const docsUrl = links.docsUrl?.trim();
      const githubUrl = links.githubUrl?.trim();

      if (!docsUrl && !githubUrl) {
        errors.push(`${category}:${option.id} is missing both docs and GitHub links`);
        continue;
      }

      linkedCount += 1;

      if (docsUrl && !isValidHttpsUrl(docsUrl)) {
        errors.push(`${category}:${option.id} has invalid docs URL: ${docsUrl}`);
      }
      if (githubUrl && !isValidHttpsUrl(githubUrl)) {
        errors.push(`${category}:${option.id} has invalid GitHub URL: ${githubUrl}`);
      }

      if (docsUrl && !githubUrl) {
        warnings.push(`${category}:${option.id} is docs-only`);
      }
      if (githubUrl && !docsUrl) {
        warnings.push(`${category}:${option.id} is GitHub-only`);
      }

      if (LIVE_MODE) {
        if (docsUrl) liveTargets.push({ category, id: option.id, kind: "docsUrl", url: docsUrl });
        if (githubUrl) {
          liveTargets.push({ category, id: option.id, kind: "githubUrl", url: githubUrl });
        }
      }
    }
  }

  if (LIVE_MODE && errors.length === 0) {
    const seen = new Set<string>();
    for (const target of liveTargets) {
      const dedupeKey = `${target.kind}:${target.url}`;
      if (seen.has(dedupeKey)) continue;
      seen.add(dedupeKey);

      try {
        const status = await fetchStatus(target.url);
        if (status >= 400) {
          errors.push(`${target.kind} returned ${status}: ${target.url}`);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        errors.push(`${target.kind} request failed for ${target.url}: ${message}`);
      }
    }
  }

  console.log(
    `[tech-links] validated ${linkedCount}/${optionCount} builder options (${LIVE_MODE ? "live" : "static"} mode)`,
  );

  if (warnings.length > 0) {
    console.log(`[tech-links] warnings (${warnings.length})`);
    for (const warning of warnings) {
      console.log(`  - ${warning}`);
    }
  }

  if (errors.length > 0) {
    console.error(`[tech-links] errors (${errors.length})`);
    for (const error of errors) {
      console.error(`  - ${error}`);
    }
    process.exit(1);
  }
}

await run();
