#!/usr/bin/env node

/**
 * Postinstall script for create-better-t-stack.
 * Symlinks the platform-specific binary to the bin directory for convenience.
 *
 * This runs after npm install to set up the binary.
 */

import fs from "fs";
import path from "path";
import os from "os";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

function detectPlatformAndArch() {
  let platform;
  switch (os.platform()) {
    case "darwin":
      platform = "darwin";
      break;
    case "linux":
      platform = "linux";
      break;
    case "win32":
      platform = "windows";
      break;
    default:
      platform = os.platform();
      break;
  }

  let arch;
  switch (os.arch()) {
    case "x64":
      arch = "x64";
      break;
    case "arm64":
      arch = "arm64";
      break;
    default:
      arch = os.arch();
      break;
  }

  return { platform, arch };
}

function findBinary() {
  const { platform, arch } = detectPlatformAndArch();
  // Scoped package: @better-t-stack/cli-{platform}-{arch}
  const packageName = `@better-t-stack/cli-${platform}-${arch}`;
  const binaryName = platform === "windows" ? "create-better-t-stack.exe" : "create-better-t-stack";

  try {
    // Use require.resolve to find the package
    const packageJsonPath = require.resolve(`${packageName}/package.json`);
    const packageDir = path.dirname(packageJsonPath);
    const binaryPath = path.join(packageDir, "bin", binaryName);

    if (!fs.existsSync(binaryPath)) {
      throw new Error(`Binary not found at ${binaryPath}`);
    }

    return { binaryPath, binaryName };
  } catch (error) {
    throw new Error(`Could not find package ${packageName}: ${error.message}`);
  }
}

function prepareBinDirectory(binaryName) {
  const binDir = path.join(__dirname, "..", "bin");
  const targetPath = path.join(binDir, binaryName);

  // Ensure bin directory exists
  if (!fs.existsSync(binDir)) {
    fs.mkdirSync(binDir, { recursive: true });
  }

  // Remove existing binary/symlink if it exists
  try {
    if (fs.existsSync(targetPath) || fs.lstatSync(targetPath).isSymbolicLink()) {
      fs.unlinkSync(targetPath);
    }
  } catch {
    // File doesn't exist, that's fine
  }

  return { binDir, targetPath };
}

function symlinkBinary(sourcePath, binaryName) {
  const { targetPath } = prepareBinDirectory(binaryName);

  fs.symlinkSync(sourcePath, targetPath);
  console.log(`create-better-t-stack binary symlinked: ${targetPath} -> ${sourcePath}`);

  // Verify the file exists after operation
  if (!fs.existsSync(targetPath)) {
    throw new Error(`Failed to symlink binary to ${targetPath}`);
  }
}

async function main() {
  try {
    if (os.platform() === "win32") {
      // On Windows, symlinks require admin privileges
      // The bin stub will find the binary directly
      console.log("Windows detected: skipping symlink (bin stub will find binary directly)");
      return;
    }

    const { binaryPath, binaryName } = findBinary();
    symlinkBinary(binaryPath, binaryName);
  } catch (error) {
    // Don't fail the install if we can't symlink - the bin stub will still work
    console.log(`Note: Could not symlink binary (${error.message}). The CLI will still work.`);
  }
}

try {
  main();
} catch (error) {
  // Silently continue - postinstall failures shouldn't break the install
  console.log("Postinstall completed with warnings.");
}
