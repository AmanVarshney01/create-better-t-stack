import { DEFAULT_STACK, isStackDefault, type StackState, TECH_OPTIONS } from "@/lib/constant";
import { stackUrlKeys } from "@/lib/stack-url-keys";

// TypeScript ecosystem category order
const TYPESCRIPT_CATEGORY_ORDER: Array<keyof typeof TECH_OPTIONS> = [
  "webFrontend",
  "nativeFrontend",
  "astroIntegration",
  "cssFramework",
  "uiLibrary",
  "backend",
  "backendLibraries",
  "runtime",
  "api",
  "database",
  "orm",
  "dbSetup",
  "webDeploy",
  "serverDeploy",
  "auth",
  "payments",
  "email",
  "fileUpload",
  "logging",
  "observability",
  "codeQuality",
  "documentation",
  "appPlatforms",
  "packageManager",
  "examples",
  "git",
  "install",
];

// Rust ecosystem category order
const RUST_CATEGORY_ORDER: Array<keyof typeof TECH_OPTIONS> = [
  "rustWebFramework",
  "rustFrontend",
  "rustOrm",
  "rustApi",
  "rustCli",
  "rustLibraries",
  "git",
  "install",
];

// Combined category order for backwards compatibility
const CATEGORY_ORDER: Array<keyof typeof TECH_OPTIONS> = [
  ...TYPESCRIPT_CATEGORY_ORDER,
  // Rust categories (excluding duplicates like git, install)
  "rustWebFramework",
  "rustFrontend",
  "rustOrm",
  "rustApi",
  "rustCli",
  "rustLibraries",
];

export function generateStackSummary(stack: StackState) {
  const selectedTechs = CATEGORY_ORDER.flatMap((category) => {
    const options = TECH_OPTIONS[category];
    const selectedValue = stack[category as keyof StackState];

    if (!options) return [];

    const getTechNames = (value: string | string[]) => {
      const values = Array.isArray(value) ? value : [value];
      return values
        .filter(
          (id) =>
            id !== "none" &&
            id !== "false" &&
            !(["git", "install", "auth"].includes(category) && id === "true"),
        )
        .map((id) => options.find((opt) => opt.id === id)?.name)
        .filter(Boolean) as string[];
    };

    return selectedValue ? getTechNames(selectedValue) : [];
  });

  return selectedTechs.length > 0 ? selectedTechs.join(" • ") : "Custom stack";
}

export function generateStackCommand(stack: StackState) {
  const projectName = stack.projectName || "my-better-t-app";

  // Handle Rust ecosystem
  if (stack.ecosystem === "rust") {
    return generateRustCommand(stack, projectName);
  }

  // TypeScript ecosystem
  const packageManagerCommands = {
    npm: "npx create-better-t-stack@latest",
    pnpm: "pnpm create better-t-stack@latest",
    default: "bun create better-t-stack@latest",
  };

  const base =
    packageManagerCommands[stack.packageManager as keyof typeof packageManagerCommands] ||
    packageManagerCommands.default;

  const isStackDefaultExceptProjectName = Object.entries(DEFAULT_STACK).every(
    ([key]) =>
      key === "projectName" ||
      isStackDefault(stack, key as keyof StackState, stack[key as keyof StackState]),
  );

  if (isStackDefaultExceptProjectName) {
    return `${base} ${projectName} --yes`;
  }

  // Map web interface backend IDs to CLI backend flags
  const mapBackendToCli = (backend: string) => {
    if (backend === "self-next" || backend === "self-tanstack-start" || backend === "self-astro") {
      return "self";
    }
    return backend;
  };

  const flags = [
    `--frontend ${
      [...stack.webFrontend, ...stack.nativeFrontend]
        .filter((v, _, arr) => v !== "none" || arr.length === 1)
        .join(" ") || "none"
    }`,
    // Add astro-integration flag only when Astro is selected
    ...(stack.webFrontend.includes("astro") && stack.astroIntegration !== "none"
      ? [`--astro-integration ${stack.astroIntegration}`]
      : []),
    `--css-framework ${stack.cssFramework}`,
    `--ui-library ${stack.uiLibrary}`,
    `--backend ${mapBackendToCli(stack.backend)}`,
    `--runtime ${stack.runtime}`,
    `--api ${stack.api}`,
    `--auth ${stack.auth}`,
    `--payments ${stack.payments}`,
    `--email ${stack.email}`,
    `--file-upload ${stack.fileUpload}`,
    `--logging ${stack.logging}`,
    `--observability ${stack.observability}`,
    `--effect ${stack.backendLibraries}`,
    `--database ${stack.database}`,
    `--orm ${stack.orm}`,
    `--db-setup ${stack.dbSetup}`,
    `--package-manager ${stack.packageManager}`,
    stack.git === "false" ? "--no-git" : "--git",
    `--web-deploy ${stack.webDeploy}`,
    `--server-deploy ${stack.serverDeploy}`,
    stack.install === "false" ? "--no-install" : "--install",
    `--addons ${
      [...stack.codeQuality, ...stack.documentation, ...stack.appPlatforms].length > 0
        ? [...stack.codeQuality, ...stack.documentation, ...stack.appPlatforms]
            .filter((addon) =>
              [
                "pwa",
                "tauri",
                "starlight",
                "biome",
                "lefthook",
                "husky",
                "turborepo",
                "ultracite",
                "fumadocs",
                "oxlint",
                "ruler",
                "opentui",
                "wxt",
              ].includes(addon),
            )
            .join(" ") || "none"
        : "none"
    }`,
    `--examples ${stack.examples.join(" ") || "none"}`,
  ];

  if (stack.yolo === "true") {
    flags.push("--yolo");
  }

  return `${base} ${projectName} ${flags.join(" ")}`;
}

function generateRustCommand(stack: StackState, projectName: string) {
  // For Rust projects, use cargo init with appropriate setup
  const flags: string[] = [];

  if (stack.rustWebFramework !== "none") {
    flags.push(`--web-framework ${stack.rustWebFramework}`);
  }
  if (stack.rustFrontend !== "none") {
    flags.push(`--frontend ${stack.rustFrontend}`);
  }
  if (stack.rustOrm !== "none") {
    flags.push(`--orm ${stack.rustOrm}`);
  }
  if (stack.rustApi !== "none") {
    flags.push(`--api ${stack.rustApi}`);
  }
  if (stack.rustCli !== "none") {
    flags.push(`--cli ${stack.rustCli}`);
  }
  if (stack.rustLibraries !== "none" && stack.rustLibraries !== "serde") {
    flags.push(`--libraries ${stack.rustLibraries}`);
  }
  if (stack.git === "false") {
    flags.push("--no-git");
  }

  // Rust ecosystem command - placeholder until CLI supports Rust
  const base = "cargo new";
  const flagStr = flags.length > 0 ? ` # Options: ${flags.join(" ")}` : "";
  return `${base} ${projectName}${flagStr}`;
}

export function generateStackUrlFromState(stack: StackState, baseUrl?: string) {
  const origin = baseUrl || "https://better-t-stack.dev";

  const stackParams = new URLSearchParams();
  Object.entries(stackUrlKeys).forEach(([stackKey, urlKey]) => {
    const value = stack[stackKey as keyof StackState];
    if (value !== undefined) {
      stackParams.set(urlKey as string, Array.isArray(value) ? value.join(",") : String(value));
    }
  });

  const searchString = stackParams.toString();
  return `${origin}/new${searchString ? `?${searchString}` : ""}`;
}

export function generateStackSharingUrl(stack: StackState, baseUrl?: string) {
  const origin = baseUrl || "https://better-t-stack.dev";

  const stackParams = new URLSearchParams();
  Object.entries(stackUrlKeys).forEach(([stackKey, urlKey]) => {
    const value = stack[stackKey as keyof StackState];
    if (value !== undefined) {
      stackParams.set(urlKey as string, Array.isArray(value) ? value.join(",") : String(value));
    }
  });

  const searchString = stackParams.toString();
  return `${origin}/stack${searchString ? `?${searchString}` : ""}`;
}

export { CATEGORY_ORDER, TYPESCRIPT_CATEGORY_ORDER, RUST_CATEGORY_ORDER };
