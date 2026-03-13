import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import type { Ecosystem } from "@better-fullstack/types";

const STEP_TIMEOUT_MS = 300_000; // 5 minutes per step

export type StepResult = {
  step: string;
  success: boolean;
  durationMs: number;
  stdout?: string;
  stderr?: string;
  exitCode?: number;
  skipped?: boolean;
  advisory?: boolean;
  classification?: "environment" | "template" | "unknown";
};

export type VerifyResult = {
  ecosystem: Ecosystem;
  comboName: string;
  projectDir: string;
  overallSuccess: boolean;
  steps: StepResult[];
  totalDurationMs: number;
};

const ENVIRONMENT_PATTERNS = [
  /ENOTFOUND/,
  /ETIMEDOUT/,
  /ECONNREFUSED/,
  /ECONNRESET/,
  /fetch failed/i,
  /command not found/i,
  /Executable not found/i,
  /No such file or directory.*\/bin\//,
  /error: could not find/i,
  /Failed to spawn/i,
  /network/i,
  /qwik.*MODULE_NOT_FOUND/is,
  /registry/i,
  /certificate/i,
];

const TEMPLATE_PATTERNS = [
  /error\[E\d+\]/, // Rust compiler errors
  /SyntaxError/,
  /TypeError/,
  /ReferenceError/,
  /Cannot find module/,
  /Module not found/,
  /Could not resolve/,
  /Unexpected token/,
  /expected.*found/i,
  /undeclared type/i,
  /undefined:/,
  /not assignable to/,
  /has no exported member/,
  /Import .* is not found/i,
  /unresolved import/i,
  /No version matching/i,
  /failed to resolve/i,
  /is not exported by/i,
];

function classifyError(stderr: string, stdout: string): StepResult["classification"] {
  const combined = `${stderr}\n${stdout}`;
  for (const pattern of ENVIRONMENT_PATTERNS) {
    if (pattern.test(combined)) return "environment";
  }
  for (const pattern of TEMPLATE_PATTERNS) {
    if (pattern.test(combined)) return "template";
  }
  return "unknown";
}

async function runStep(
  step: string,
  command: string,
  args: string[],
  cwd: string,
): Promise<StepResult> {
  const start = Date.now();

  try {
    const proc = Bun.spawn([command, ...args], {
      cwd,
      stdout: "pipe",
      stderr: "pipe",
      env: process.env,
    });

    const timeoutId = setTimeout(() => { try { proc.kill(); } catch {} }, STEP_TIMEOUT_MS);

    const [stdout, stderr] = await Promise.all([
      new Response(proc.stdout).text(),
      new Response(proc.stderr).text(),
    ]);
    const exitCode = await proc.exited;

    clearTimeout(timeoutId);

    const success = exitCode === 0;
    return {
      step,
      success,
      durationMs: Date.now() - start,
      stdout: stdout.slice(-4000),
      stderr: stderr.slice(-4000),
      exitCode,
      classification: success ? undefined : classifyError(stderr, stdout),
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      step,
      success: false,
      durationMs: Date.now() - start,
      stderr: message.slice(-4000),
      exitCode: -1,
      classification: classifyError(message, ""),
    };
  }
}

function hasPackageScript(projectDir: string, scriptName: string): boolean {
  try {
    const pkgPath = join(projectDir, "package.json");
    if (!existsSync(pkgPath)) return false;
    const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
    return Boolean(pkg.scripts?.[scriptName]);
  } catch {
    return false;
  }
}

function fileContains(projectDir: string, filename: string, needle: string): boolean {
  try {
    const filePath = join(projectDir, filename);
    if (!existsSync(filePath)) return false;
    return readFileSync(filePath, "utf-8").includes(needle);
  } catch {
    return false;
  }
}

function wrapResult(
  ecosystem: Ecosystem,
  comboName: string,
  projectDir: string,
  steps: StepResult[],
): VerifyResult {
  return {
    ecosystem,
    comboName,
    projectDir,
    overallSuccess: steps.every((s) => s.success || s.skipped || s.advisory),
    steps,
    totalDurationMs: steps.reduce((sum, s) => sum + s.durationMs, 0),
  };
}

function skippedStep(step: string): StepResult {
  return { step, success: true, durationMs: 0, skipped: true };
}

async function runAdvisoryStep(
  step: string,
  command: string,
  args: string[],
  cwd: string,
): Promise<StepResult> {
  const result = await runStep(step, command, args, cwd);
  return { ...result, advisory: true };
}

export async function verifyTypeScript(
  comboName: string,
  projectDir: string,
): Promise<VerifyResult> {
  const steps: StepResult[] = [];

  // Convex projects require `convex codegen` before build/typecheck can work
  const isConvex = existsSync(join(projectDir, "packages", "backend", "convex"));

  // Step 1: install
  steps.push(await runStep("install", "bun", ["install"], projectDir));
  if (!steps.at(-1)!.success) return wrapResult("typescript", comboName, projectDir, steps);

  // Step 2: build (if script exists)
  if (isConvex) {
    steps.push(skippedStep("build"));
  } else if (hasPackageScript(projectDir, "build")) {
    const buildResult = await runStep("build", "bun", ["run", "build"], projectDir);
    // Native-only projects have no web packages to build — treat as skip
    if (!buildResult.success && /No packages matched the filter/i.test(`${buildResult.stderr}\n${buildResult.stdout}`)) {
      steps.push({ ...buildResult, success: true, skipped: true });
    } else {
      steps.push(buildResult);
    }
  } else {
    steps.push(skippedStep("build"));
  }

  // Step 3: lint (advisory — doesn't affect overall pass/fail)
  if (hasPackageScript(projectDir, "lint")) {
    steps.push(await runAdvisoryStep("lint", "bun", ["run", "lint"], projectDir));
  } else {
    steps.push(skippedStep("lint"));
  }

  // Step 4: typecheck (check-types or typecheck script)
  const typecheckScript = hasPackageScript(projectDir, "check-types")
    ? "check-types"
    : hasPackageScript(projectDir, "typecheck")
      ? "typecheck"
      : null;

  if (isConvex) {
    steps.push(skippedStep("typecheck"));
  } else if (typecheckScript) {
    steps.push(await runStep("typecheck", "bun", ["run", typecheckScript], projectDir));
  } else {
    steps.push(skippedStep("typecheck"));
  }

  return wrapResult("typescript", comboName, projectDir, steps);
}

export async function verifyRust(comboName: string, projectDir: string): Promise<VerifyResult> {
  const steps: StepResult[] = [];

  // Step 1: cargo check
  steps.push(await runStep("check", "cargo", ["check"], projectDir));
  if (!steps.at(-1)!.success) return wrapResult("rust", comboName, projectDir, steps);

  // Step 2: cargo clippy (advisory — doesn't affect overall pass/fail)
  steps.push(
    await runAdvisoryStep("clippy", "cargo", ["clippy", "--", "-D", "warnings"], projectDir),
  );

  return wrapResult("rust", comboName, projectDir, steps);
}

export async function verifyPython(comboName: string, projectDir: string): Promise<VerifyResult> {
  const steps: StepResult[] = [];

  // Step 1: uv sync (--all-extras to include dev optional dependencies like ruff, pytest)
  steps.push(await runStep("install", "uv", ["sync", "--all-extras"], projectDir));
  if (!steps.at(-1)!.success) return wrapResult("python", comboName, projectDir, steps);

  // Step 2: compile check
  const srcDir = existsSync(join(projectDir, "src")) ? "src/" : ".";
  steps.push(
    await runStep(
      "compile-check",
      "uv",
      ["run", "python", "-m", "compileall", "-q", srcDir],
      projectDir,
    ),
  );

  // Step 3: ruff lint (advisory — doesn't affect overall pass/fail)
  if (fileContains(projectDir, "pyproject.toml", "ruff")) {
    steps.push(await runAdvisoryStep("lint", "uv", ["run", "ruff", "check", "."], projectDir));
  } else {
    steps.push(skippedStep("lint"));
  }

  return wrapResult("python", comboName, projectDir, steps);
}

export async function verifyGo(comboName: string, projectDir: string): Promise<VerifyResult> {
  const steps: StepResult[] = [];

  // Step 1: go mod tidy
  steps.push(await runStep("mod-tidy", "go", ["mod", "tidy"], projectDir));
  if (!steps.at(-1)!.success) return wrapResult("go", comboName, projectDir, steps);

  // Step 2: go build
  steps.push(await runStep("build", "go", ["build", "./..."], projectDir));

  // Step 3: go vet (advisory — doesn't affect overall pass/fail)
  steps.push(await runAdvisoryStep("vet", "go", ["vet", "./..."], projectDir));

  return wrapResult("go", comboName, projectDir, steps);
}

export function getVerifier(
  ecosystem: Ecosystem,
): (comboName: string, projectDir: string) => Promise<VerifyResult> {
  switch (ecosystem) {
    case "typescript":
      return verifyTypeScript;
    case "rust":
      return verifyRust;
    case "python":
      return verifyPython;
    case "go":
      return verifyGo;
  }
}
