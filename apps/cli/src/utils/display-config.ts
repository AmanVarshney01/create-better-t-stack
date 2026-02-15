import pc from "picocolors";

import type { ProjectConfig } from "../types";

export function displayConfig(config: Partial<ProjectConfig>) {
  const configDisplay: string[] = [];

  if (config.projectName) {
    configDisplay.push(`${pc.blue("Project Name:")} ${config.projectName}`);
  }

  if (config.frontend !== undefined) {
    const frontend = Array.isArray(config.frontend) ? config.frontend : [config.frontend];
    const frontendText =
      frontend.length > 0 && frontend[0] !== undefined ? frontend.join(", ") : "none";
    configDisplay.push(`${pc.blue("Frontend:")} ${frontendText}`);
  }

  if (config.uiLibrary !== undefined) {
    configDisplay.push(`${pc.blue("UI Library:")} ${String(config.uiLibrary)}`);
  }

  if (config.cssFramework !== undefined) {
    configDisplay.push(`${pc.blue("CSS Framework:")} ${String(config.cssFramework)}`);
  }

  if (config.backend !== undefined) {
    configDisplay.push(`${pc.blue("Backend:")} ${String(config.backend)}`);
  }

  if (config.runtime !== undefined) {
    configDisplay.push(`${pc.blue("Runtime:")} ${String(config.runtime)}`);
  }

  if (config.api !== undefined) {
    configDisplay.push(`${pc.blue("API:")} ${String(config.api)}`);
  }

  if (config.database !== undefined) {
    configDisplay.push(`${pc.blue("Database:")} ${String(config.database)}`);
  }

  if (config.orm !== undefined) {
    configDisplay.push(`${pc.blue("ORM:")} ${String(config.orm)}`);
  }

  if (config.auth !== undefined) {
    configDisplay.push(`${pc.blue("Auth:")} ${String(config.auth)}`);
  }

  if (config.payments !== undefined) {
    configDisplay.push(`${pc.blue("Payments:")} ${String(config.payments)}`);
  }

  if (config.email !== undefined) {
    configDisplay.push(`${pc.blue("Email:")} ${String(config.email)}`);
  }

  if (config.fileUpload !== undefined) {
    configDisplay.push(`${pc.blue("File Upload:")} ${String(config.fileUpload)}`);
  }

  if (config.effect !== undefined) {
    configDisplay.push(`${pc.blue("Effect:")} ${String(config.effect)}`);
  }

  if (config.ai !== undefined) {
    configDisplay.push(`${pc.blue("AI:")} ${String(config.ai)}`);
  }

  if (config.stateManagement !== undefined) {
    configDisplay.push(`${pc.blue("State Management:")} ${String(config.stateManagement)}`);
  }

  if (config.forms !== undefined) {
    configDisplay.push(`${pc.blue("Forms:")} ${String(config.forms)}`);
  }

  if (config.validation !== undefined) {
    configDisplay.push(`${pc.blue("Validation:")} ${String(config.validation)}`);
  }

  if (config.testing !== undefined) {
    configDisplay.push(`${pc.blue("Testing:")} ${String(config.testing)}`);
  }

  if (config.animation !== undefined) {
    configDisplay.push(`${pc.blue("Animation:")} ${String(config.animation)}`);
  }

  if (config.realtime !== undefined) {
    configDisplay.push(`${pc.blue("Realtime:")} ${String(config.realtime)}`);
  }

  if (config.jobQueue !== undefined) {
    configDisplay.push(`${pc.blue("Job Queue:")} ${String(config.jobQueue)}`);
  }

  if (config.logging !== undefined) {
    configDisplay.push(`${pc.blue("Logging:")} ${String(config.logging)}`);
  }

  if (config.observability !== undefined) {
    configDisplay.push(`${pc.blue("Observability:")} ${String(config.observability)}`);
  }

  if (config.caching !== undefined) {
    configDisplay.push(`${pc.blue("Caching:")} ${String(config.caching)}`);
  }

  if (config.cms !== undefined) {
    configDisplay.push(`${pc.blue("CMS:")} ${String(config.cms)}`);
  }

  if (config.search !== undefined) {
    configDisplay.push(`${pc.blue("Search:")} ${String(config.search)}`);
  }

  if (config.fileStorage !== undefined) {
    configDisplay.push(`${pc.blue("File Storage:")} ${String(config.fileStorage)}`);
  }

  if (config.addons !== undefined) {
    const addons = Array.isArray(config.addons) ? config.addons : [config.addons];
    const addonsText = addons.length > 0 && addons[0] !== undefined ? addons.join(", ") : "none";
    configDisplay.push(`${pc.blue("Addons:")} ${addonsText}`);
  }

  if (config.examples !== undefined) {
    const examples = Array.isArray(config.examples) ? config.examples : [config.examples];
    const examplesText =
      examples.length > 0 && examples[0] !== undefined ? examples.join(", ") : "none";
    configDisplay.push(`${pc.blue("Examples:")} ${examplesText}`);
  }

  if (config.git !== undefined) {
    const gitText =
      typeof config.git === "boolean" ? (config.git ? "Yes" : "No") : String(config.git);
    configDisplay.push(`${pc.blue("Git Init:")} ${gitText}`);
  }

  if (config.packageManager !== undefined) {
    configDisplay.push(`${pc.blue("Package Manager:")} ${String(config.packageManager)}`);
  }

  if (config.install !== undefined) {
    const installText =
      typeof config.install === "boolean"
        ? config.install
          ? "Yes"
          : "No"
        : String(config.install);
    configDisplay.push(`${pc.blue("Install Dependencies:")} ${installText}`);
  }

  if (config.dbSetup !== undefined) {
    configDisplay.push(`${pc.blue("Database Setup:")} ${String(config.dbSetup)}`);
  }

  if (config.webDeploy !== undefined) {
    configDisplay.push(`${pc.blue("Web Deployment:")} ${String(config.webDeploy)}`);
  }

  if (config.serverDeploy !== undefined) {
    configDisplay.push(`${pc.blue("Server Deployment:")} ${String(config.serverDeploy)}`);
  }

  if (configDisplay.length === 0) {
    return pc.yellow("No configuration selected.");
  }

  return configDisplay.join("\n");
}
