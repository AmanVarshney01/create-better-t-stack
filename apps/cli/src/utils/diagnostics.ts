import type { AnalyticsMode } from "@better-t-stack/types";
import { Result } from "better-result";

import { getContext } from "./context";
import {
  AddonSetupError,
  CLIError,
  CompatibilityError,
  DatabaseSetupError,
  DirectoryConflictError,
  ProjectCreationError,
  ValidationError,
} from "./errors";
import { getLatestCLIVersion } from "./get-latest-cli-version";
import { isTelemetryEnabled } from "./telemetry";

/**
 * Failure diagnostics go to the self-hosted Umami instance (a separate "CLI" website),
 * not to the Convex project dataset, which only records successful creations.
 * Everything is a no-op until UMAMI_CLI_WEBSITE_ID is baked in at build time.
 */
const UMAMI_HOST_URL = process.env.UMAMI_HOST_URL;
const UMAMI_CLI_WEBSITE_ID = process.env.UMAMI_CLI_WEBSITE_ID;
const SEND_TIMEOUT_MS = 3000;
const MAX_STRING_LENGTH = 500;
const MAX_REASON_LENGTH = 160;

type DiagnosticValue = string | number | boolean;

export type DiagnosticEvents = {
  cli_failed: {
    command: string;
    mode: AnalyticsMode;
    stage: string;
    error: string;
    reason: string;
    packageManager?: string;
    backend?: string;
  };
};

export type DiagnosticEventName = keyof DiagnosticEvents;

/** Class name of the failure, which is stable and never carries user content. */
export function errorClass(cause: unknown): string {
  if (cause instanceof Error) return cause.name || cause.constructor.name || "Error";
  return "UnknownError";
}

/** Coarse stage a create/add failure belongs to, derived from the tagged error types. */
export function failureStage(cause: unknown): string {
  if (ProjectCreationError.is(cause)) return cause.phase;
  if (DatabaseSetupError.is(cause)) return "database-setup";
  if (AddonSetupError.is(cause)) return "addons-setup";
  if (DirectoryConflictError.is(cause)) return "directory";
  if (ValidationError.is(cause) || CompatibilityError.is(cause)) return "validate";
  if (CLIError.is(cause)) return "config";
  return "unknown";
}

/**
 * First line of an error message with anything that could identify a machine or
 * project replaced by placeholders: quoted names, URLs, emails, and paths.
 */
export function scrubReason(cause: unknown): string {
  const message = cause instanceof Error ? cause.message : String(cause);
  const lines = message.split(/\r?\n/);
  // Keep the headline plus any bullet lines directly under it: messages such as the
  // toolchain check put the actual failing requirement on those bullets.
  const bullets: string[] = [];
  for (const line of lines.slice(1)) {
    if (!line.startsWith("- ")) break;
    bullets.push(line.slice(2));
  }
  const firstLine = [lines[0] ?? "", ...bullets].join(" ");
  const scrubbed = firstLine
    // Quoted spans first: they are user-supplied values whatever they contain. Apostrophes
    // inside words ("stack's") are not quote delimiters.
    .replaceAll(/(?<![\p{L}\p{N}\p{M}_])(["'`])(?:(?!\1).)*\1(?![\p{L}\p{N}\p{M}_])/gu, "<name>")
    .replaceAll(/https?:\/\/[^\s)\]"'>]+/gi, "<url>")
    .replaceAll(/[\w.+-]+@[\w-]+\.[\w.-]+/g, "<email>")
    // Absolute paths, including segments with spaces ("/Users/Jane Doe/app/file.ts") and a
    // final file name with spaces when it carries an extension ("/Users/jane/report final.txt").
    .replaceAll(/(?:[a-zA-Z]:)?(?:[\\/][\w.@+ -]+)+[\\/][\w.@+-]+(?:[ \w.@+-]*\.\w+)?/g, "<path>")
    // Anything else containing a separator, such as relative paths and "packages/<name>".
    .replaceAll(/\S*[\\/]\S*/g, "<path>")
    .replaceAll(/\s+/g, " ")
    .trim();
  return scrubbed.length > MAX_REASON_LENGTH ? scrubbed.slice(0, MAX_REASON_LENGTH) : scrubbed;
}

function clampValue(value: DiagnosticValue): DiagnosticValue {
  const text = String(value);
  return text.length > MAX_STRING_LENGTH ? text.slice(0, MAX_STRING_LENGTH) : value;
}

function isDiagnosticsEnabled() {
  return (
    Boolean(UMAMI_HOST_URL) &&
    Boolean(UMAMI_CLI_WEBSITE_ID) &&
    isTelemetryEnabled() &&
    !getContext().analyticsDisabled
  );
}

export function buildDiagnosticPayload<Name extends DiagnosticEventName>(
  name: Name,
  data: DiagnosticEvents[Name],
) {
  const eventData: Record<string, DiagnosticValue> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) eventData[key] = clampValue(value);
  }

  return {
    type: "event",
    payload: {
      website: UMAMI_CLI_WEBSITE_ID,
      hostname: "cli",
      url: `/${data.command}`,
      title: name,
      name,
      data: eventData,
    },
  };
}

export function diagnosticUserAgent() {
  return `Mozilla/5.0 (compatible; create-better-t-stack/${getLatestCLIVersion()})`;
}

export async function reportDiagnostic<Name extends DiagnosticEventName>(
  name: Name,
  data: DiagnosticEvents[Name],
): Promise<void> {
  if (!isDiagnosticsEnabled()) return;

  await Result.tryPromise({
    try: () =>
      fetch(`${UMAMI_HOST_URL}/api/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": diagnosticUserAgent(),
        },
        body: JSON.stringify(buildDiagnosticPayload(name, data)),
        signal: AbortSignal.timeout(SEND_TIMEOUT_MS),
        keepalive: true,
      }),
    catch: () => undefined, // Silent failure: diagnostics must never affect the CLI.
  });
}
