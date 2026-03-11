#!/usr/bin/env bun

import { mkdir, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import type { Ecosystem, ProjectConfig } from "@better-fullstack/types";

import { generateBatch } from "./lib/generate-combos/options";
import { createSeededRandom, seedFromString } from "./lib/generate-combos/seed-random";
import type { ComboCandidate, GeneratorArgs, HistoricalLedger } from "./lib/generate-combos/types";
import { getVerifier, type VerifyResult } from "./lib/verify";

// ── Types ───────────────────────────────────────────────────────────────

type Mode = "generate" | "verify" | "report" | "local";

interface SmokeTestArgs {
  mode: Mode;
  seed: string;
  ecosystem?: Ecosystem;
  count: number;
  output: string;
  comboIndex?: number;
  manifest?: string;
}

interface Manifest {
  seed: string;
  generatedAt: string;
  combos: Array<{
    index: number;
    ecosystem: Ecosystem;
    name: string;
    config: ProjectConfig;
    command: string;
  }>;
}

// ── Arg Parsing ─────────────────────────────────────────────────────────

function parseArgs(argv: string[]): SmokeTestArgs {
  const args: SmokeTestArgs = {
    mode: "local",
    seed: Date.now().toString(),
    count: 14,
    output: resolve(process.cwd(), "testing/.smoke-output"),
  };

  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];
    const next = argv[i + 1];

    switch (token) {
      case "--mode":
        if (next === "generate" || next === "verify" || next === "report" || next === "local") {
          args.mode = next;
        }
        i++;
        break;
      case "--seed":
        if (next) args.seed = next;
        i++;
        break;
      case "--ecosystem":
        if (next && ["typescript", "rust", "python", "go"].includes(next)) {
          args.ecosystem = next as Ecosystem;
        }
        i++;
        break;
      case "--count":
        if (next) {
          const parsed = Number(next);
          if (Number.isFinite(parsed) && parsed > 0) args.count = Math.floor(parsed);
        }
        i++;
        break;
      case "--output":
        if (next) args.output = resolve(process.cwd(), next);
        i++;
        break;
      case "--combo-index":
        if (next) args.comboIndex = Number(next);
        i++;
        break;
      case "--manifest":
        if (next) args.manifest = resolve(process.cwd(), next);
        i++;
        break;
    }
  }

  return args;
}

// ── Combo Generation ────────────────────────────────────────────────────

function generateCombos(args: SmokeTestArgs): ComboCandidate[] {
  const rng = createSeededRandom(seedFromString(args.seed));

  const emptyHistory: HistoricalLedger = {
    fingerprintKeys: new Set(),
    legacyNames: new Set(),
    historyCount: 0,
  };

  const generatorArgs: GeneratorArgs = {
    count: args.count,
    ecosystems: args.ecosystem ? [args.ecosystem] : ["typescript", "rust", "python", "go"],
    installMode: "no-install",
    rng,
  };

  return generateBatch(generatorArgs, emptyHistory);
}

// ── Project Scaffolding ─────────────────────────────────────────────────

const CLI_PATH = resolve(import.meta.dir, "../apps/cli/dist/cli.mjs");

interface ScaffoldInput {
  name: string;
  command: string;
}

function buildCliArgs(input: ScaffoldInput): string[] {
  // Parse the command: `bun create better-fullstack@latest <name> ...flags`
  // into args for: `node cli.mjs create <name> ...flags --no-install --no-git`
  const parts = input.command.split(" ");
  const nameIndex = parts.indexOf(input.name);
  if (nameIndex === -1) {
    throw new Error(`Could not find project name "${input.name}" in command: ${input.command}`);
  }
  const flags = parts.slice(nameIndex);

  // Override install/git flags: strip existing, force no-install and no-git
  const filtered = flags.filter(
    (f) => f !== "--install" && f !== "--no-install" && f !== "--git" && f !== "--no-git",
  );

  return ["create", ...filtered, "--no-install", "--no-git"];
}

async function scaffoldProject(
  input: ScaffoldInput,
  outputDir: string,
): Promise<{ success: boolean; projectDir: string; error?: string; durationMs: number }> {
  const start = Date.now();
  const projectDir = join(outputDir, input.name);

  await mkdir(outputDir, { recursive: true });

  const args = buildCliArgs(input);

  try {
    const proc = Bun.spawn(["node", CLI_PATH, ...args], {
      cwd: outputDir,
      stdout: "pipe",
      stderr: "pipe",
      env: {
        ...process.env,
        NO_COLOR: "1",
      },
    });

    const timeoutId = setTimeout(() => proc.kill(), 120_000); // 2 min scaffold timeout

    const [_stdout, stderr] = await Promise.all([
      new Response(proc.stdout).text(),
      new Response(proc.stderr).text(),
    ]);
    const exitCode = await proc.exited;

    clearTimeout(timeoutId);

    const success = exitCode === 0 && existsSync(projectDir);
    return {
      success,
      projectDir,
      error: success ? undefined : `exit ${exitCode}: ${stderr.slice(-1000)}`,
      durationMs: Date.now() - start,
    };
  } catch (error) {
    return {
      success: false,
      projectDir,
      error: error instanceof Error ? error.message : String(error),
      durationMs: Date.now() - start,
    };
  }
}

// ── Reporting ───────────────────────────────────────────────────────────

function formatMarkdownSummary(seed: string, results: VerifyResult[]): string {
  const passed = results.filter((r) => r.overallSuccess).length;
  const failed = results.filter((r) => !r.overallSuccess).length;

  let md = "## Smoke Test Results\n\n";
  md += `**Seed**: \`${seed}\`\n`;
  md += `**Total**: ${results.length} | **Passed**: ${passed} | **Failed**: ${failed}\n\n`;

  // Results table
  md += "| Ecosystem | Name | ";
  const allStepNames = [...new Set(results.flatMap((r) => r.steps.map((s) => s.step)))];
  md += allStepNames.join(" | ");
  md += " | Result |\n";
  md += "|-----------|------|";
  md += allStepNames.map(() => "---").join("|");
  md += "|--------|\n";

  for (const result of results) {
    const stepMap = new Map(result.steps.map((s) => [s.step, s]));
    md += `| ${result.ecosystem} | ${result.comboName} | `;
    md += allStepNames
      .map((name) => {
        const step = stepMap.get(name);
        if (!step) return "-";
        if (step.skipped) return "skip";
        return step.success ? "ok" : "FAIL";
      })
      .join(" | ");
    md += ` | ${result.overallSuccess ? "PASS" : "FAIL"} |\n`;
  }

  // Failure details
  const failures = results.filter((r) => !r.overallSuccess);
  if (failures.length > 0) {
    md += "\n### Failures\n\n";
    for (const result of failures) {
      md += `#### ${result.comboName} (${result.ecosystem})\n`;
      for (const step of result.steps.filter((s) => !s.success && !s.skipped)) {
        md += `- **${step.step}**: exit ${step.exitCode} [${step.classification ?? "unknown"}]\n`;
        if (step.stderr) {
          const snippet = step.stderr.trim().slice(-800);
          md += `  \`\`\`\n  ${snippet}\n  \`\`\`\n`;
        }
      }
    }
  }

  md += `\n### Reproduce locally\n\`\`\`bash\nbun run test:smoke -- --seed ${seed}\n\`\`\`\n`;

  return md;
}

// ── Modes ───────────────────────────────────────────────────────────────

async function modeGenerate(args: SmokeTestArgs): Promise<void> {
  const combos = generateCombos(args);

  const manifest: Manifest = {
    seed: args.seed,
    generatedAt: new Date().toISOString(),
    combos: combos.map((combo, index) => ({
      index,
      ecosystem: combo.ecosystem,
      name: combo.name,
      config: combo.config,
      command: combo.command,
    })),
  };

  const manifestPath = args.output.endsWith(".json")
    ? args.output
    : join(args.output, "smoke-manifest.json");
  await mkdir(dirname(manifestPath), { recursive: true });
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2));

  // Write matrix JSON alongside the manifest for CI consumption
  const matrixPath = manifestPath.replace(/\.json$/, ".matrix.json");
  const matrix = {
    include: combos.map((combo, index) => ({
      ecosystem: combo.ecosystem,
      combo_index: index,
      combo_name: combo.name,
    })),
  };
  await writeFile(matrixPath, JSON.stringify(matrix));

  console.log(`Generated ${combos.length} combos (seed: ${args.seed})`);
  for (const combo of combos) {
    console.log(`  [${combo.ecosystem}] ${combo.name}`);
  }
}

async function modeVerify(args: SmokeTestArgs): Promise<void> {
  if (args.comboIndex === undefined || !args.manifest) {
    console.error("--combo-index and --manifest are required for verify mode");
    process.exitCode = 1;
    return;
  }

  const manifestData = await Bun.file(args.manifest).json();
  const manifest = manifestData as Manifest;
  const combo = manifest.combos[args.comboIndex];

  if (!combo) {
    console.error(`Combo index ${args.comboIndex} not found in manifest`);
    process.exitCode = 1;
    return;
  }

  console.log(`Verifying: [${combo.ecosystem}] ${combo.name}`);
  console.log(`  Command: ${combo.command}\n`);

  await mkdir(args.output, { recursive: true });

  // Scaffold
  const scaffoldResult = await scaffoldProject(
    { name: combo.name, command: combo.command },
    args.output,
  );

  if (!scaffoldResult.success) {
    console.error(`Scaffold failed: ${scaffoldResult.error}`);
    const failResult: VerifyResult = {
      ecosystem: combo.ecosystem,
      comboName: combo.name,
      projectDir: scaffoldResult.projectDir,
      overallSuccess: false,
      steps: [
        {
          step: "scaffold",
          success: false,
          durationMs: scaffoldResult.durationMs,
          stderr: scaffoldResult.error,
          classification: "template",
        },
      ],
      totalDurationMs: scaffoldResult.durationMs,
    };
    await writeFile(join(args.output, "smoke-results.json"), JSON.stringify(failResult, null, 2));
    await writeFile(
      join(args.output, "summary.md"),
      formatMarkdownSummary(args.seed, [failResult]),
    );
    process.exitCode = 1;
    return;
  }

  console.log(`Scaffolded to: ${scaffoldResult.projectDir} (${scaffoldResult.durationMs}ms)`);

  // Verify
  const verify = getVerifier(combo.ecosystem);
  const result = await verify(combo.name, scaffoldResult.projectDir);

  // Report
  for (const step of result.steps) {
    const icon = step.skipped ? "⊘" : step.success ? "✓" : "✗";
    console.log(`  ${icon} ${step.step} (${step.durationMs}ms)${step.classification ? ` [${step.classification}]` : ""}`);
  }
  console.log(`\n${result.overallSuccess ? "PASSED" : "FAILED"} (${result.totalDurationMs}ms total)`);

  await writeFile(join(args.output, "smoke-results.json"), JSON.stringify(result, null, 2));
  await writeFile(join(args.output, "summary.md"), formatMarkdownSummary(args.seed, [result]));

  // Exit with failure only on template-classified issues
  const hasTemplateBug = result.steps.some(
    (s) => !s.success && !s.skipped && s.classification === "template",
  );
  if (hasTemplateBug) {
    process.exitCode = 1;
  } else if (!result.overallSuccess) {
    // Non-template failures (environment, unknown) — warn but don't fail CI
    console.log("\nNote: Failures classified as non-template issues (environment/unknown).");
    console.log("CI will not fail for these, but they may warrant investigation.");
  }
}

async function modeLocal(args: SmokeTestArgs): Promise<void> {
  const combos = generateCombos(args);

  console.log(`Running smoke test locally (seed: ${args.seed}, combos: ${combos.length})\n`);

  await mkdir(args.output, { recursive: true });
  const results: VerifyResult[] = [];

  for (const combo of combos) {
    console.log(`\n${"─".repeat(60)}`);
    console.log(`[${combo.ecosystem}] ${combo.name}`);
    console.log(`  ${combo.command}\n`);

    const scaffoldResult = await scaffoldProject(combo, args.output);

    if (!scaffoldResult.success) {
      console.error(`  Scaffold failed: ${scaffoldResult.error}`);
      results.push({
        ecosystem: combo.ecosystem,
        comboName: combo.name,
        projectDir: scaffoldResult.projectDir,
        overallSuccess: false,
        steps: [
          {
            step: "scaffold",
            success: false,
            durationMs: scaffoldResult.durationMs,
            stderr: scaffoldResult.error,
            classification: "template",
          },
        ],
        totalDurationMs: scaffoldResult.durationMs,
      });
      continue;
    }

    console.log(`  Scaffolded (${scaffoldResult.durationMs}ms)`);

    const verify = getVerifier(combo.ecosystem);
    const result = await verify(combo.name, scaffoldResult.projectDir);
    results.push(result);

    for (const step of result.steps) {
      const icon = step.skipped ? "⊘" : step.success ? "✓" : "✗";
      console.log(`  ${icon} ${step.step} (${step.durationMs}ms)${step.classification ? ` [${step.classification}]` : ""}`);
    }
    console.log(`  ${result.overallSuccess ? "PASSED" : "FAILED"}`);

    // Clean up successful projects to save disk
    if (result.overallSuccess && existsSync(scaffoldResult.projectDir)) {
      await rm(scaffoldResult.projectDir, { recursive: true, force: true });
    }
  }

  // Final report
  console.log(`\n${"═".repeat(60)}`);
  const passed = results.filter((r) => r.overallSuccess).length;
  const failed = results.filter((r) => !r.overallSuccess).length;
  console.log(`Results: ${passed} passed, ${failed} failed out of ${results.length}`);

  await writeFile(join(args.output, "smoke-results.json"), JSON.stringify(results, null, 2));
  await writeFile(
    join(args.output, "summary.md"),
    formatMarkdownSummary(args.seed, results),
  );

  const hasTemplateBug = results.some((r) =>
    r.steps.some((s) => !s.success && !s.skipped && s.classification === "template"),
  );
  if (hasTemplateBug) process.exitCode = 1;
}

async function modeReport(args: SmokeTestArgs): Promise<void> {
  const { readdirSync } = await import("node:fs");

  const results: VerifyResult[] = [];
  const baseDir = args.output;

  if (existsSync(baseDir)) {
    for (const sub of readdirSync(baseDir, { withFileTypes: true })) {
      if (!sub.isDirectory()) continue;
      const file = join(baseDir, sub.name, "smoke-results.json");
      if (!existsSync(file)) continue;
      const data = JSON.parse(await Bun.file(file).text());
      if (Array.isArray(data)) results.push(...data);
      else results.push(data);
    }
  }

  const passed = results.filter((r) => r.overallSuccess).length;
  const failed = results.filter((r) => !r.overallSuccess).length;

  let md = "## Smoke Test Summary\n\n";
  md += `| Metric | Count |\n|--------|-------|\n`;
  md += `| Total | ${results.length} |\n`;
  md += `| Passed | ${passed} |\n`;
  md += `| Failed | ${failed} |\n\n`;

  if (failed > 0) {
    md += "### Failures\n\n";
    for (const r of results.filter((r) => !r.overallSuccess)) {
      md += `#### ${r.comboName} (${r.ecosystem})\n`;
      for (const s of r.steps.filter((s) => !s.success && !s.skipped)) {
        md += `- **${s.step}**: exit ${s.exitCode} [${s.classification ?? "unknown"}]\n`;
        if (s.stderr) {
          const snippet = s.stderr.trim().slice(-500);
          md += `  \`\`\`\n  ${snippet}\n  \`\`\`\n`;
        }
      }
    }
  }

  const summaryPath = join(baseDir, "smoke-summary.md");
  await writeFile(summaryPath, md);
  console.log(md);
  console.log(`Summary written to ${summaryPath}`);
}

// ── Main ────────────────────────────────────────────────────────────────

const args = parseArgs(process.argv.slice(2));

switch (args.mode) {
  case "generate":
    await modeGenerate(args);
    break;
  case "verify":
    await modeVerify(args);
    break;
  case "report":
    await modeReport(args);
    break;
  case "local":
    await modeLocal(args);
    break;
}
