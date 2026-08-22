import { DEFAULT_STACK, isStackDefault, type StackState, TECH_OPTIONS } from "@/lib/constant";
import { SITE_URL } from "@/lib/site";
import { stackUrlKeys } from "@/lib/stack-url-keys";

const CATEGORY_ORDER: Array<keyof typeof TECH_OPTIONS> = [
  "webFrontend",
  "nativeFrontend",
  "backend",
  "runtime",
  "api",
  "database",
  "orm",
  "dbSetup",
  "webDeploy",
  "serverDeploy",
  "auth",
  "payments",
  "packageManager",
  "addons",
  "examples",
  "git",
  "install",
];

const desktopAddonNames = {
  tauri: "Tauri",
  electrobun: "Electrobun",
} as const;

const staticDesktopFrontendNames = {
  "tanstack-start": "TanStack Start",
  next: "Next.js",
  nuxt: "Nuxt",
  svelte: "SvelteKit",
  astro: "Astro",
} as const;

const selfHostedFullstackBackends = [
  "self-next",
  "self-tanstack-start",
  "self-nuxt",
  "self-svelte",
  "self-solid",
  "self-astro",
] as const;

export function formatProjectName(name: string | null | undefined) {
  return (name || "my-better-t-app").replace(/\s+/g, "-");
}

function quoteShellArgument(value: string) {
  if (/^[a-zA-Z0-9_./-]+$/.test(value)) {
    return value;
  }

  return `'${value.replaceAll("'", `'\\''`)}'`;
}

export type SelectedTech = {
  category: keyof typeof TECH_OPTIONS;
  id: string;
  name: string;
  icon: string;
};

export function getSelectedTechs(stack: StackState): SelectedTech[] {
  const selected: SelectedTech[] = [];
  for (const category of CATEGORY_ORDER) {
    const options = TECH_OPTIONS[category];
    const value = stack[category as keyof StackState];
    if (!options || value === undefined) continue;

    const ids = Array.isArray(value) ? value : [value];
    for (const id of ids) {
      if (
        id === "none" ||
        id === "false" ||
        (["git", "install", "auth"].includes(category) && id === "true")
      ) {
        continue;
      }
      const tech = options.find((opt) => opt.id === id);
      if (tech) {
        selected.push({ category, id: tech.id, name: tech.name, icon: tech.icon });
      }
    }
  }
  return selected;
}

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

export function getDesktopBuildNote(stack: Pick<StackState, "addons" | "backend" | "webFrontend">) {
  const selectedDesktopAddons = stack.addons.filter(
    (addon): addon is keyof typeof desktopAddonNames => addon in desktopAddonNames,
  );

  if (selectedDesktopAddons.length === 0) {
    return null;
  }

  const staticFrontend = stack.webFrontend.find(
    (frontend): frontend is keyof typeof staticDesktopFrontendNames =>
      frontend in staticDesktopFrontendNames,
  );

  if (!staticFrontend) {
    return null;
  }

  const addonLabel =
    selectedDesktopAddons.length === 2
      ? "Tauri and Electrobun desktop builds"
      : `${desktopAddonNames[selectedDesktopAddons[0]]} desktop builds`;

  if (
    selfHostedFullstackBackends.includes(
      stack.backend as (typeof selfHostedFullstackBackends)[number],
    )
  ) {
    return `${addonLabel} package static web assets and require a separate backend or no backend. Fullstack self backends emit server routes inside the web app, so they cannot be bundled for desktop packaging.`;
  }

  return `${addonLabel} package static web assets. ${staticDesktopFrontendNames[staticFrontend]} needs a static/export build configuration before desktop packaging will work.`;
}

export function generateStackCommand(stack: StackState) {
  const packageManagerCommands = {
    npm: "npx create-better-t-stack@latest",
    pnpm: "pnpm create better-t-stack@latest",
    default: "bun create better-t-stack@latest",
  };

  const base =
    packageManagerCommands[stack.packageManager as keyof typeof packageManagerCommands] ||
    packageManagerCommands.default;
  const projectName = quoteShellArgument(stack.projectName || "my-better-t-app");

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
    if (
      backend === "self-next" ||
      backend === "self-tanstack-start" ||
      backend === "self-nuxt" ||
      backend === "self-svelte" ||
      backend === "self-solid" ||
      backend === "self-astro"
    ) {
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
    `--backend ${mapBackendToCli(stack.backend)}`,
    `--runtime ${stack.runtime}`,
    `--api ${stack.api}`,
    `--auth ${stack.auth}`,
    `--payments ${stack.payments}`,
    `--database ${stack.database}`,
    `--orm ${stack.orm}`,
    `--db-setup ${stack.dbSetup}`,
    `--package-manager ${stack.packageManager}`,
    stack.git === "false" ? "--no-git" : "--git",
    `--web-deploy ${stack.webDeploy}`,
    `--server-deploy ${stack.serverDeploy}`,
    stack.install === "false" ? "--no-install" : "--install",
    `--addons ${
      stack.addons.length > 0
        ? stack.addons
            .filter(
              (addon) =>
                addon !== "none" && TECH_OPTIONS.addons.some((option) => option.id === addon),
            )
            .join(" ") || "none"
        : "none"
    }`,
    `--examples ${stack.examples.join(" ") || "none"}`,
  ];

  if (stack.apps.length > 0) {
    flags.push(`--apps ${stack.apps.join(" ")}`);
  }

  if (stack.yolo === "true") {
    flags.push("--yolo");
  }

  return `${base} ${projectName} ${flags.join(" ")}`;
}

export function formatStackCommandForDisplay(command: string) {
  return command.replaceAll(" --", ` ${"\\"}\n  --`);
}

export function generateStackUrlFromState(stack: StackState, baseUrl?: string) {
  const origin = baseUrl || SITE_URL;
  const searchString = serializeStackToSearchString(stack);
  return `${origin}/new${searchString ? `?${searchString}` : ""}`;
}

function serializeStackToSearchString(stack: StackState) {
  const stackParams = new URLSearchParams();
  Object.entries(stackUrlKeys).forEach(([stackKey, urlKey]) => {
    const value = stack[stackKey as keyof StackState];
    if (value !== undefined) {
      stackParams.set(urlKey as string, Array.isArray(value) ? value.join(",") : String(value));
    }
  });
  return stackParams.toString();
}

export function generateStackSharingUrl(stack: StackState, baseUrl?: string) {
  const origin = baseUrl || SITE_URL;
  const searchString = serializeStackToSearchString(stack);
  return `${origin}/stack${searchString ? `?${searchString}` : ""}`;
}

export function generateStackOgImageUrl(stack: StackState, baseUrl = "") {
  const searchString = serializeStackToSearchString(stack);
  return `${baseUrl}/og/stack${searchString ? `?${searchString}` : ""}`;
}

export { CATEGORY_ORDER };
