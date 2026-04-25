#!/usr/bin/env bun
// Verify create-js-stack installs and runs under npm, pnpm, and bun.
// Catches any regression that breaks the published artifact for consumers —
// unresolved protocol refs, missing files, broken bin entry, import failures
// from missing transitive deps, etc.
//
// Packs each publishable workspace with `npm pack` (matching the release
// workflow, which uses `npm publish`), installs the CLI tarball in a temp
// dir using overrides to redirect sibling workspace deps at their local
// tarballs, then runs `create-js-stack --version` to prove the binary
// actually executes.

import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

import { $ } from "bun";

const ROOT = resolve(import.meta.dir, "..");

type Publishable = {
  name: string;
  dir: string;
  // Release workflow strips bundled workspace deps via jq before publish.
  // Mirror that here so the tarball matches what actually ships.
  stripDeps?: string[];
};

const PUBLISHABLES: Publishable[] = [
  {
    name: "create-js-stack",
    dir: "apps/cli",
    stripDeps: ["@create-js-stack/types", "@create-js-stack/template-generator"],
  },
];

const green = (s: string) => `\x1b[32m${s}\x1b[0m`;
const red = (s: string) => `\x1b[31m${s}\x1b[0m`;
const dim = (s: string) => `\x1b[2m${s}\x1b[0m`;

async function pack(pkg: Publishable, outDir: string): Promise<string> {
  const pkgJsonPath = join(ROOT, pkg.dir, "package.json");
  const original = readFileSync(pkgJsonPath, "utf-8");

  if (pkg.stripDeps) {
    const parsed = JSON.parse(original);
    for (const bucket of [
      "dependencies",
      "devDependencies",
      "peerDependencies",
      "optionalDependencies",
    ] as const) {
      const deps = parsed[bucket];
      if (!deps) continue;
      for (const d of pkg.stripDeps) {
        if (d in deps) delete deps[d];
      }
    }
    writeFileSync(pkgJsonPath, `${JSON.stringify(parsed, null, 2)}\n`);
  }

  try {
    const r = await $`npm pack --pack-destination=${outDir} --json`
      .cwd(join(ROOT, pkg.dir))
      .quiet();
    const [entry] = JSON.parse(r.stdout.toString()) as Array<{ filename: string }>;
    return join(outDir, entry.filename);
  } finally {
    if (pkg.stripDeps) writeFileSync(pkgJsonPath, original);
  }
}

async function installAndRun(
  pm: "npm" | "pnpm" | "bun",
  tarballs: Record<string, string>,
  smokeRoot: string,
) {
  const dir = join(smokeRoot, `install-${pm}`);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });

  const fixture: Record<string, unknown> = {
    name: `smoke-${pm}`,
    private: true,
    version: "0.0.0",
    dependencies: { "create-js-stack": `file:${tarballs["create-js-stack"]}` },
  };

  writeFileSync(join(dir, "package.json"), JSON.stringify(fixture, null, 2));

  const install = await $`${pm} install --ignore-scripts`.cwd(dir).quiet().nothrow();
  if (install.exitCode !== 0) {
    console.error(red(`✗ ${pm} install failed`));
    console.error(dim(install.stderr.toString()));
    process.exit(1);
  }

  // Execute the CLI via its installed bin path to prove it actually works —
  // not just that the file got linked into node_modules/.bin.
  const bin = join(dir, "node_modules", ".bin", "create-js-stack");
  const run = await $`${bin} --version`.cwd(dir).quiet().nothrow();
  if (run.exitCode !== 0) {
    console.error(red(`✗ ${pm}: create-js-stack --version failed (exit ${run.exitCode})`));
    console.error(dim(run.stderr.toString() + run.stdout.toString()));
    process.exit(1);
  }

  console.log(green(`✓ ${pm}`) + dim(`  v${run.stdout.toString().trim()}`));
}

async function hasPackageManager(pm: string): Promise<boolean> {
  return (await $`which ${pm}`.quiet().nothrow()).exitCode === 0;
}

const smokeRoot = join(tmpdir(), `cjs-publish-smoke-${Date.now()}`);
const tarballDir = join(smokeRoot, "tarballs");
mkdirSync(tarballDir, { recursive: true });

console.log("Packing...");
const tarballs: Record<string, string> = {};
for (const pkg of PUBLISHABLES) {
  tarballs[pkg.name] = await pack(pkg, tarballDir);
  console.log(dim(`  ${pkg.name}`));
}

console.log("\nInstalling and running create-js-stack under each package manager...");
for (const pm of ["npm", "pnpm", "bun"] as const) {
  if (!(await hasPackageManager(pm))) {
    console.log(dim(`  - ${pm} not available, skipping`));
    continue;
  }
  await installAndRun(pm, tarballs, smokeRoot);
}

rmSync(smokeRoot, { recursive: true, force: true });
console.log(green("\n✓ publish smoke test passed"));
