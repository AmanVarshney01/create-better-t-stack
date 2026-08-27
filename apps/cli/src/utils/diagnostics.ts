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
 * Diagnostic events go to the self-hosted Umami instance (a separate "CLI" website),
 * not to the Convex project dataset. They cover what the project-creation event
 * cannot: failures, cancellations, non-create commands, slow stages, and MCP usage.
 * Everything is a no-op until UMAMI_CLI_WEBSITE_ID is baked in at build time.
 */
const UMAMI_HOST_URL = process.env.UMAMI_HOST_URL;
const UMAMI_CLI_WEBSITE_ID = process.env.UMAMI_CLI_WEBSITE_ID;
const SEND_TIMEOUT_MS = 3000;
const MAX_STRING_LENGTH = 500;
const MAX_REASON_LENGTH = 160;
export const SLOW_STAGE_THRESHOLD_MS = 60_000;

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
  cli_cancelled: { command: string; mode: AnalyticsMode; prompt: string };
  cli_command: { command: string; mode?: AnalyticsMode; ok: boolean; duration: string };
  cli_slow: { command: string; stage: string; duration: string; packageManager: string };
  mcp_session: { client: string; clientVersion: string };
  mcp_tool: { tool: string; ok: boolean; duration: string };
  mcp_tool_error: { tool: string; error: string; reason: string };
};

export type DiagnosticEventName = keyof DiagnosticEvents;

const DURATION_BUCKETS: Array<[number, string]> = [
  [1_000, "<1s"],
  [5_000, "1-5s"],
  [15_000, "5-15s"],
  [60_000, "15-60s"],
  [300_000, "1-5m"],
];

export function durationBucket(elapsedMs: number): string {
  for (const [limit, label] of DURATION_BUCKETS) {
    if (elapsedMs < limit) return label;
  }
  return ">5m";
}

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
 * project replaced by placeholders: file paths, URLs, emails, and quoted names.
 */
export function scrubReason(cause: unknown): string {
  const message = cause instanceof Error ? cause.message : String(cause);
  const firstLine = message.split(/\r?\n/, 1)[0] ?? "";
  const scrubbed = firstLine
    .replaceAll(/https?:\/\/[^\s)\]"'>]+/gi, "<url>")
    .replaceAll(/[\w.+-]+@[\w-]+\.[\w.-]+/g, "<email>")
    .replaceAll(/(?:[a-zA-Z]:)?(?:[\\/][\w.@+-]+){2,}/g, "<path>")
    .replaceAll(/(["'`])(?:(?!\1).)*\1/g, "<name>")
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

function eventUrl(name: DiagnosticEventName, data: Record<string, DiagnosticValue>) {
  if (name.startsWith("mcp_")) return "/mcp";
  const command = data.command;
  return command === undefined ? `/${name}` : `/${String(command)}`;
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
      url: eventUrl(name, eventData),
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

/** Reports a stage only when it crossed the slow threshold, so the event is a signal. */
export async function reportSlowStage(
  command: string,
  stage: string,
  elapsedMs: number,
  packageManager: string,
): Promise<void> {
  if (elapsedMs < SLOW_STAGE_THRESHOLD_MS) return;
  await reportDiagnostic("cli_slow", {
    command,
    stage,
    duration: durationBucket(elapsedMs),
    packageManager,
  });
}
