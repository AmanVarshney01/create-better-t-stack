import type { ProjectConfig } from "@better-fullstack/types";

import { fingerprintToKey } from "./fingerprint";
import type { TemplateFingerprint } from "./types";

function withExplicitNone(values: readonly string[]): string[] {
  return values.length === 0 ? ["none"] : [...values];
}

function renderFlag(flag: string, value: string | readonly string[]): string {
  const formatted = Array.isArray(value) ? value.join(" ") : value;
  return `--${flag} ${formatted}`;
}

export function formatNameFromFingerprint(fingerprint: TemplateFingerprint): string {
  const ecosystem = typeof fingerprint.ecosystem === "string" ? fingerprint.ecosystem : "combo";

  const tokensByEcosystem = {
    typescript: [
      Array.isArray(fingerprint.frontend)
        ? fingerprint.frontend.filter((value) => value !== "none").join("-")
        : undefined,
      typeof fingerprint.backend === "string" ? fingerprint.backend : undefined,
      typeof fingerprint.api === "string" ? fingerprint.api : undefined,
      typeof fingerprint.orm === "string" ? fingerprint.orm : undefined,
      typeof fingerprint.database === "string" ? fingerprint.database : undefined,
      typeof fingerprint.auth === "string" ? fingerprint.auth : undefined,
      typeof fingerprint.cssFramework === "string" ? fingerprint.cssFramework : undefined,
      typeof fingerprint.uiLibrary === "string" ? fingerprint.uiLibrary : undefined,
    ],
    rust: [
      typeof fingerprint.rustWebFramework === "string" ? fingerprint.rustWebFramework : undefined,
      typeof fingerprint.rustFrontend === "string" ? fingerprint.rustFrontend : undefined,
      typeof fingerprint.rustOrm === "string" ? fingerprint.rustOrm : undefined,
      typeof fingerprint.rustApi === "string" ? fingerprint.rustApi : undefined,
      typeof fingerprint.rustCli === "string" ? fingerprint.rustCli : undefined,
      Array.isArray(fingerprint.rustLibraries)
        ? fingerprint.rustLibraries.filter((value) => value !== "none").join("-")
        : undefined,
    ],
    python: [
      typeof fingerprint.pythonWebFramework === "string"
        ? fingerprint.pythonWebFramework
        : undefined,
      typeof fingerprint.pythonOrm === "string" ? fingerprint.pythonOrm : undefined,
      typeof fingerprint.pythonValidation === "string" ? fingerprint.pythonValidation : undefined,
      Array.isArray(fingerprint.pythonAi)
        ? fingerprint.pythonAi.filter((value) => value !== "none").join("-")
        : undefined,
      typeof fingerprint.pythonTaskQueue === "string" ? fingerprint.pythonTaskQueue : undefined,
      typeof fingerprint.pythonQuality === "string" ? fingerprint.pythonQuality : undefined,
    ],
    go: [
      typeof fingerprint.goWebFramework === "string" ? fingerprint.goWebFramework : undefined,
      typeof fingerprint.goOrm === "string" ? fingerprint.goOrm : undefined,
      typeof fingerprint.goApi === "string" ? fingerprint.goApi : undefined,
      typeof fingerprint.goCli === "string" ? fingerprint.goCli : undefined,
      typeof fingerprint.goLogging === "string" ? fingerprint.goLogging : undefined,
    ],
  } as const;

  const tokens = [ecosystem, ...tokensByEcosystem[ecosystem]]
    .filter((value): value is string => Boolean(value && value !== "none"))
    .map((value) => value.replace(/[^a-z0-9]+/gi, "-"));

  const digest = Bun.hash(fingerprintToKey(fingerprint)).toString(36).slice(0, 6);
  return [...tokens.slice(0, 8), digest].join("-").replace(/-+/g, "-");
}

export function buildCommand(name: string, config: ProjectConfig): string {
  const parts = [`bun create better-fullstack@latest ${name}`];

  const commonFlags: Array<[string, string | readonly string[]]> = [
    ["ecosystem", config.ecosystem],
    ["addons", withExplicitNone(config.addons)],
    ["examples", withExplicitNone(config.examples)],
    ["ai-docs", withExplicitNone(config.aiDocs)],
    ["package-manager", config.packageManager],
  ];

  const typeScriptFlags: Array<[string, string | readonly string[]]> = [
    ["frontend", withExplicitNone(config.frontend)],
    ["backend", config.backend],
    ["runtime", config.runtime],
    ["api", config.api],
    ["database", config.database],
    ["orm", config.orm],
    ["db-setup", config.dbSetup],
    ["auth", config.auth],
    ["payments", config.payments],
    ["email", config.email],
    ["file-upload", config.fileUpload],
    ["logging", config.logging],
    ["observability", config.observability],
    ["feature-flags", config.featureFlags],
    ["analytics", config.analytics],
    ["effect", config.effect],
    ["state-management", config.stateManagement],
    ["forms", config.forms],
    ["validation", config.validation],
    ["testing", config.testing],
    ["ai", config.ai],
    ["realtime", config.realtime],
    ["job-queue", config.jobQueue],
    ["animation", config.animation],
    ["css-framework", config.cssFramework],
    ["ui-library", config.uiLibrary],
    ["cms", config.cms],
    ["caching", config.caching],
    ["search", config.search],
    ["file-storage", config.fileStorage],
    ["web-deploy", config.webDeploy],
    ["server-deploy", config.serverDeploy],
  ];

  const rustFlags: Array<[string, string | readonly string[]]> = [
    ["rust-web-framework", config.rustWebFramework],
    ["rust-frontend", config.rustFrontend],
    ["rust-orm", config.rustOrm],
    ["rust-api", config.rustApi],
    ["rust-cli", config.rustCli],
    ["rust-libraries", withExplicitNone(config.rustLibraries)],
  ];

  const pythonFlags: Array<[string, string | readonly string[]]> = [
    ["python-web-framework", config.pythonWebFramework],
    ["python-orm", config.pythonOrm],
    ["python-validation", config.pythonValidation],
    ["python-ai", withExplicitNone(config.pythonAi)],
    ["python-task-queue", config.pythonTaskQueue],
    ["python-quality", config.pythonQuality],
  ];

  const goFlags: Array<[string, string | readonly string[]]> = [
    ["go-web-framework", config.goWebFramework],
    ["go-orm", config.goOrm],
    ["go-api", config.goApi],
    ["go-cli", config.goCli],
    ["go-logging", config.goLogging],
  ];

  const orderedFlags = [...commonFlags];
  switch (config.ecosystem) {
    case "typescript":
      orderedFlags.push(...typeScriptFlags);
      if (config.astroIntegration) {
        orderedFlags.push(["astro-integration", config.astroIntegration]);
      }
      if (config.shadcnBase) orderedFlags.push(["shadcn-base", config.shadcnBase]);
      if (config.shadcnStyle) orderedFlags.push(["shadcn-style", config.shadcnStyle]);
      if (config.shadcnIconLibrary) {
        orderedFlags.push(["shadcn-icon-library", config.shadcnIconLibrary]);
      }
      if (config.shadcnColorTheme) {
        orderedFlags.push(["shadcn-color-theme", config.shadcnColorTheme]);
      }
      if (config.shadcnBaseColor) {
        orderedFlags.push(["shadcn-base-color", config.shadcnBaseColor]);
      }
      if (config.shadcnFont) orderedFlags.push(["shadcn-font", config.shadcnFont]);
      if (config.shadcnRadius) orderedFlags.push(["shadcn-radius", config.shadcnRadius]);
      break;
    case "rust":
      orderedFlags.push(...rustFlags);
      break;
    case "python":
      orderedFlags.push(...pythonFlags);
      break;
    case "go":
      orderedFlags.push(...goFlags);
      break;
  }

  for (const [flag, value] of orderedFlags) {
    parts.push(renderFlag(flag, value));
  }

  parts.push(config.git ? "--git" : "--no-git");
  parts.push(config.install ? "--install" : "--no-install");

  return parts.join(" ");
}
