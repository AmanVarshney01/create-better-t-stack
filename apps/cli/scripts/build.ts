#!/usr/bin/env bun
/**
 * Build script for compiling create-better-t-stack as native Bun binaries.
 * Generates platform-specific npm packages ready for publishing.
 *
 * Usage:
 *   bun run scripts/build.ts           # Build for all platforms
 *   bun run scripts/build.ts --single  # Build only for current platform
 *
 * Output structure:
 *   dist/better-t-stack-cli-darwin-arm64/
 *     ├── bin/create-better-t-stack
 *     └── package.json
 *   dist/better-t-stack-cli-darwin-x64/
 *   ... etc
 */
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectDir = path.resolve(__dirname, "..");

process.chdir(projectDir);

// Read package.json for version
const pkg = JSON.parse(fs.readFileSync("./package.json", "utf-8"));
const version = pkg.version;
const cliName = "create-better-t-stack";
const scope = "@better-t-stack";

const singleFlag = process.argv.includes("--single");

interface Target {
  os: "linux" | "darwin" | "win32";
  arch: "arm64" | "x64";
  bunTarget: `bun-${"linux" | "darwin" | "windows"}-${"arm64" | "x64"}`;
}

const allTargets: Target[] = [
  { os: "linux", arch: "arm64", bunTarget: "bun-linux-arm64" },
  { os: "linux", arch: "x64", bunTarget: "bun-linux-x64" },
  { os: "darwin", arch: "arm64", bunTarget: "bun-darwin-arm64" },
  { os: "darwin", arch: "x64", bunTarget: "bun-darwin-x64" },
  { os: "win32", arch: "x64", bunTarget: "bun-windows-x64" },
];

const targets = singleFlag
  ? allTargets.filter((item) => item.os === process.platform && item.arch === process.arch)
  : allTargets;

if (targets.length === 0) {
  console.error(`No matching target for platform ${process.platform}-${process.arch}`);
  process.exit(1);
}

// Clean existing binary builds
for (const target of allTargets) {
  const platformName = target.os === "win32" ? "windows" : target.os;
  const dirName = `${scope.replace("@", "")}-cli-${platformName}-${target.arch}`;
  const outDir = path.join(projectDir, "dist", dirName);
  if (fs.existsSync(outDir)) {
    fs.rmSync(outDir, { recursive: true });
  }
}

console.log(`Building ${cliName} v${version}\n`);

export interface BuiltPackage {
  name: string;
  version: string;
  dirName: string;
}

const builtPackages: BuiltPackage[] = [];

for (const target of targets) {
  const platformName = target.os === "win32" ? "windows" : target.os;
  const packageName = `${scope}/cli-${platformName}-${target.arch}`;
  const dirName = `${scope.replace("@", "")}-cli-${platformName}-${target.arch}`;
  const binaryName = target.os === "win32" ? `${cliName}.exe` : cliName;
  const outDir = path.join(projectDir, "dist", dirName);
  const binDir = path.join(outDir, "bin");

  console.log(`Building ${packageName}...`);

  // Create output directories
  fs.mkdirSync(binDir, { recursive: true });

  try {
    // Compile the binary using Bun.build API
    const result = await Bun.build({
      entrypoints: ["./src/cli.ts"],
      minify: true,
      define: {
        CLI_VERSION: JSON.stringify(version),
      },
      compile: {
        target: target.bunTarget as Bun.Build.Target,
        outfile: path.join(binDir, binaryName),
      },
    });

    if (!result.success) {
      console.error(`  ✗ Compile failed for ${packageName}`);
      for (const log of result.logs) {
        console.error(`    ${log}`);
      }
      continue;
    }

    // Create package.json for the platform package
    const platformPkg = {
      name: packageName,
      version: version,
      description: `${cliName} binary for ${platformName}-${target.arch}`,
      os: [target.os === "win32" ? "win32" : target.os],
      cpu: [target.arch],
      bin: {
        [cliName]: `./bin/${binaryName}`,
      },
      publishConfig: {
        access: "public",
      },
    };

    await Bun.write(path.join(outDir, "package.json"), JSON.stringify(platformPkg, null, 2));

    // Get binary size
    const binaryPath = path.join(binDir, binaryName);
    const stats = fs.statSync(binaryPath);
    const sizeMB = (stats.size / 1024 / 1024).toFixed(2);

    console.log(`  ✓ Built ${packageName} (${sizeMB} MB)\n`);
    builtPackages.push({ name: packageName, version, dirName });
  } catch (error) {
    console.error(`  ✗ Error building ${packageName}:`, error);
  }
}

console.log("─".repeat(50));
console.log(`\nBuild complete! Built ${builtPackages.length}/${targets.length} packages.\n`);

if (builtPackages.length > 0) {
  console.log("Platform packages:");
  for (const pkg of builtPackages) {
    console.log(`  ${pkg.name}@${pkg.version}`);
  }
  console.log("\nTo publish, run: bun run scripts/publish.ts");
}

// Export for use in publish script
export { builtPackages, version };
