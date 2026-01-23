import { log } from "@clack/prompts";

import type { Ecosystem } from "../types";

import { DEFAULT_CONFIG } from "../constants";
import { commandExists } from "../utils/command-exists";
import { exitCancelled } from "../utils/errors";
import { isCancel, navigableConfirm } from "./navigable";

export async function getinstallChoice(install?: boolean, ecosystem?: Ecosystem) {
  if (install !== undefined) return install;

  // For Rust: check cargo and show appropriate message
  if (ecosystem === "rust") {
    const cargoInstalled = await commandExists("cargo");
    if (!cargoInstalled) {
      log.warn("Cargo is not installed. Please install Rust from https://rustup.rs");
      return false;
    }

    const response = await navigableConfirm({
      message: "Run cargo build?",
      initialValue: DEFAULT_CONFIG.install,
    });

    if (isCancel(response)) return exitCancelled("Operation cancelled");

    return response;
  }

  // For Python: check uv and show appropriate message
  if (ecosystem === "python") {
    const uvInstalled = await commandExists("uv");
    if (!uvInstalled) {
      log.warn("uv is not installed. Please install uv from https://docs.astral.sh/uv/");
      return false;
    }

    const response = await navigableConfirm({
      message: "Run uv sync?",
      initialValue: DEFAULT_CONFIG.install,
    });

    if (isCancel(response)) return exitCancelled("Operation cancelled");

    return response;
  }

  // For TypeScript: existing behavior
  const response = await navigableConfirm({
    message: "Install dependencies?",
    initialValue: DEFAULT_CONFIG.install,
  });

  if (isCancel(response)) return exitCancelled("Operation cancelled");

  return response;
}
