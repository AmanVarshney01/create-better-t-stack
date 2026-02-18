#!/usr/bin/env bun

import { execFileSync } from "node:child_process";

type CommitEntry = {
  hash: string;
  shortHash: string;
  subject: string;
  date: string;
  files: string[];
};

type ReportArea =
  | "apps/cli"
  | "apps/web"
  | "packages/template-generator"
  | "packages/types"
  | "other";

type ReportResult = {
  generatedAt: string;
  baseRef: string;
  upstreamUrl: string;
  upstreamBranch: string;
  upstreamRef: string;
  totalBehindCommits: number;
  byArea: Record<ReportArea, CommitEntry[]>;
};

const DEFAULT_UPSTREAM_URL = "https://github.com/AmanVarshney01/create-better-t-stack.git";
const DEFAULT_UPSTREAM_BRANCH = "main";
const DEFAULT_BASE_REF = "HEAD";
const DEFAULT_MAX_PER_AREA = 50;

function runGit(args: string[]): string {
  return execFileSync("git", args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
}

function getArg(name: string): string | undefined {
  const index = process.argv.indexOf(name);
  if (index === -1) return undefined;
  return process.argv[index + 1];
}

function hasFlag(name: string): boolean {
  return process.argv.includes(name);
}

function classifyArea(filePath: string): ReportArea {
  if (filePath.startsWith("apps/cli/")) return "apps/cli";
  if (filePath.startsWith("apps/web/")) return "apps/web";
  if (filePath.startsWith("packages/template-generator/")) return "packages/template-generator";
  if (filePath.startsWith("packages/types/")) return "packages/types";
  return "other";
}

function fetchUpstreamRef(upstreamUrl: string, upstreamBranch: string): string {
  const sanitizedBranch = upstreamBranch.replace(/[^a-zA-Z0-9._/-]/g, "");
  const upstreamRef = `refs/remotes/upstream-gap/${sanitizedBranch}`;
  runGit(["fetch", "--no-tags", "--prune", upstreamUrl, `${sanitizedBranch}:${upstreamRef}`]);
  return upstreamRef;
}

function readBehindCommits(range: string): CommitEntry[] {
  const raw = runGit([
    "log",
    "--no-merges",
    "--date=short",
    "--pretty=format:__COMMIT__%n%H%n%s%n%ad",
    "--name-only",
    range,
  ]);

  if (!raw) return [];

  const blocks = raw
    .split("__COMMIT__\n")
    .map((block) => block.trim())
    .filter(Boolean);

  const commits: CommitEntry[] = [];

  for (const block of blocks) {
    const lines = block.split("\n");
    if (lines.length < 3) continue;

    const hash = lines[0];
    const subject = lines[1] ?? "";
    const date = lines[2] ?? "";
    const files = lines.slice(3).filter(Boolean);

    commits.push({
      hash,
      shortHash: hash.slice(0, 7),
      subject,
      date,
      files,
    });
  }

  return commits;
}

function generateReport({
  baseRef,
  upstreamUrl,
  upstreamBranch,
  upstreamRef,
  commits,
}: {
  baseRef: string;
  upstreamUrl: string;
  upstreamBranch: string;
  upstreamRef: string;
  commits: CommitEntry[];
}): ReportResult {
  const byArea: Record<ReportArea, CommitEntry[]> = {
    "apps/cli": [],
    "apps/web": [],
    "packages/template-generator": [],
    "packages/types": [],
    other: [],
  };

  for (const commit of commits) {
    const areas = new Set<ReportArea>();
    for (const file of commit.files) {
      areas.add(classifyArea(file));
    }

    if (areas.size === 0) {
      areas.add("other");
    }

    for (const area of areas) {
      byArea[area].push(commit);
    }
  }

  return {
    generatedAt: new Date().toISOString(),
    baseRef,
    upstreamUrl,
    upstreamBranch,
    upstreamRef,
    totalBehindCommits: commits.length,
    byArea,
  };
}

function formatMarkdown(report: ReportResult, maxPerArea: number): string {
  const lines: string[] = [];

  lines.push("# Upstream Gap Report");
  lines.push("");
  lines.push(`- Generated: ${report.generatedAt}`);
  lines.push(`- Base ref: ${report.baseRef}`);
  lines.push(`- Upstream: ${report.upstreamUrl} (${report.upstreamBranch})`);
  lines.push(`- Behind commits: ${report.totalBehindCommits}`);
  lines.push("");

  const areas: ReportArea[] = [
    "apps/cli",
    "apps/web",
    "packages/template-generator",
    "packages/types",
    "other",
  ];

  for (const area of areas) {
    const commits = report.byArea[area];
    lines.push(`## ${area} (${commits.length})`);

    if (commits.length === 0) {
      lines.push("- No upstream commits behind in this area.");
      lines.push("");
      continue;
    }

    for (const commit of commits.slice(0, maxPerArea)) {
      lines.push(`- ${commit.shortHash} (${commit.date}) ${commit.subject}`);
    }

    if (commits.length > maxPerArea) {
      lines.push(`- ... ${commits.length - maxPerArea} more commit(s)`);
    }

    lines.push("");
  }

  return lines.join("\n");
}

function formatText(report: ReportResult, maxPerArea: number): string {
  const lines: string[] = [];
  lines.push("Upstream Gap Report");
  lines.push(`Generated: ${report.generatedAt}`);
  lines.push(`Base ref: ${report.baseRef}`);
  lines.push(`Upstream: ${report.upstreamUrl} (${report.upstreamBranch})`);
  lines.push(`Behind commits: ${report.totalBehindCommits}`);
  lines.push("");

  const areas: ReportArea[] = [
    "apps/cli",
    "apps/web",
    "packages/template-generator",
    "packages/types",
    "other",
  ];

  for (const area of areas) {
    const commits = report.byArea[area];
    lines.push(`${area}: ${commits.length}`);
    for (const commit of commits.slice(0, maxPerArea)) {
      lines.push(`  - ${commit.shortHash} (${commit.date}) ${commit.subject}`);
    }
    if (commits.length > maxPerArea) {
      lines.push(`  - ... ${commits.length - maxPerArea} more commit(s)`);
    }
    lines.push("");
  }

  return lines.join("\n");
}

function main() {
  const upstreamUrl = getArg("--upstream") || process.env.UPSTREAM_REPO || DEFAULT_UPSTREAM_URL;
  const upstreamBranch =
    getArg("--upstream-branch") || process.env.UPSTREAM_BRANCH || DEFAULT_UPSTREAM_BRANCH;
  const baseRef = getArg("--base") || process.env.UPSTREAM_BASE_REF || DEFAULT_BASE_REF;
  const maxPerArea = Number(getArg("--max-per-area") || DEFAULT_MAX_PER_AREA);

  const asJson = hasFlag("--json");
  const asMarkdown = hasFlag("--markdown");

  const upstreamRef = fetchUpstreamRef(upstreamUrl, upstreamBranch);
  const range = `${baseRef}..${upstreamRef}`;
  const commits = readBehindCommits(range);
  const report = generateReport({ baseRef, upstreamUrl, upstreamBranch, upstreamRef, commits });

  if (asJson) {
    console.log(JSON.stringify(report, null, 2));
    return;
  }

  if (asMarkdown) {
    console.log(formatMarkdown(report, maxPerArea));
    return;
  }

  console.log(formatText(report, maxPerArea));
}

try {
  main();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Failed to produce upstream gap report: ${message}`);
  process.exit(1);
}
