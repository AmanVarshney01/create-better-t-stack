#!/usr/bin/env bun
/**
 * Publish script for create-better-t-stack.
 * Builds all platform binaries and publishes them to npm.
 *
 * Usage:
 *   bun run scripts/publish.ts           # Build and publish all
 *   bun run scripts/publish.ts --dry-run # Build only, don't publish
 */
import path from "node:path";
import fs from "node:fs";
import { $ } from "bun";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectDir = path.resolve(__dirname, "..");

process.chdir(projectDir);

const dryRun = process.argv.includes("--dry-run");
const tag = process.argv.includes("--tag")
  ? process.argv[process.argv.indexOf("--tag") + 1]
  : "latest";

// Read package.json
const pkg = JSON.parse(fs.readFileSync("./package.json", "utf-8"));
const version = pkg.version;

console.log(`📦 Publishing create-better-t-stack v${version}\n`);

// Step 1: Build all platform binaries
console.log("Step 1: Building binaries for all platforms...\n");
const { builtPackages } = await import("./build.ts");

if (builtPackages.length === 0) {
  console.error("No packages were built. Aborting publish.");
  process.exit(1);
}

// Step 2: Smoke test - run the binary for current platform
const currentPlatform = process.platform === "win32" ? "windows" : process.platform;
const currentArch = process.arch;
const currentPackage = builtPackages.find((p) =>
  p.name.includes(`${currentPlatform}-${currentArch}`),
);

if (currentPackage) {
  console.log(`\nStep 2: Smoke test - running ${currentPackage.name}...`);
  const binaryName =
    process.platform === "win32" ? "create-better-t-stack.exe" : "create-better-t-stack";
  const binaryPath = path.join(projectDir, "dist", currentPackage.dirName, "bin", binaryName);

  const result = Bun.spawnSync({
    cmd: [binaryPath, "--version"],
    stdout: "pipe",
  });

  const output = result.stdout.toString().trim();
  if (output !== version) {
    console.error(`  ✗ Version mismatch: expected ${version}, got ${output}`);
    process.exit(1);
  }
  console.log(`  ✓ Binary reports version ${output}\n`);
} else {
  console.log("\nStep 2: Smoke test skipped (no binary for current platform)\n");
}

// Step 3: Publish platform packages
console.log("Step 3: Publishing platform packages...\n");

for (const built of builtPackages) {
  const pkgDir = path.join(projectDir, "dist", built.dirName);

  if (dryRun) {
    console.log(`  [dry-run] Would publish ${built.name}@${built.version}`);
    // Pack to verify it works
    await $`bun pm pack`.cwd(pkgDir).quiet();
    console.log(`  ✓ Packed ${built.name}`);
  } else {
    console.log(`  Publishing ${built.name}@${built.version}...`);
    try {
      await $`bun pm pack`.cwd(pkgDir).quiet();
      await $`npm publish *.tgz --access public --tag ${tag}`.cwd(pkgDir);
      console.log(`  ✓ Published ${built.name}`);
    } catch (error) {
      console.error(`  ✗ Failed to publish ${built.name}:`, error);
      process.exit(1);
    }
  }
}

// Step 4: Update main package.json with correct versions
console.log("\nStep 4: Updating main package optionalDependencies...");

const optionalDeps: Record<string, string> = {};
for (const built of builtPackages) {
  optionalDeps[built.name] = built.version;
}

pkg.optionalDependencies = optionalDeps;
await Bun.write("./package.json", JSON.stringify(pkg, null, 2) + "\n");
console.log("  ✓ Updated package.json\n");

// Step 5: Publish main package
console.log("Step 5: Publishing main package...\n");

if (dryRun) {
  console.log(`  [dry-run] Would publish create-better-t-stack@${version}`);
  await $`bun pm pack`.quiet();
  console.log(`  ✓ Packed create-better-t-stack`);
} else {
  console.log(`  Publishing create-better-t-stack@${version}...`);
  try {
    await $`bun pm pack`.quiet();
    await $`npm publish *.tgz --access public --tag ${tag}`;
    console.log(`  ✓ Published create-better-t-stack`);
  } catch (error) {
    console.error(`  ✗ Failed to publish create-better-t-stack:`, error);
    process.exit(1);
  }
}

// Cleanup tarballs
await $`rm -f *.tgz`.quiet();
for (const built of builtPackages) {
  await $`rm -f *.tgz`.cwd(path.join(projectDir, "dist", built.dirName)).quiet();
}

console.log("\n" + "─".repeat(50));
console.log(`\n✅ ${dryRun ? "[DRY RUN] " : ""}Publishing complete!`);
console.log(`\nPublished packages:`);
for (const built of builtPackages) {
  console.log(`  - ${built.name}@${built.version}`);
}
console.log(`  - create-better-t-stack@${version}`);
