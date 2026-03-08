import { DEFAULT_CONFIG } from "../constants";
import { type Addons, AddonsSchema, type Auth, type Frontend } from "../types";
import { getCompatibleAddons, validateAddonCompatibility } from "../utils/compatibility-rules";
import { UserCancelledError } from "../utils/errors";
import { isCancel, navigableGroupMultiselect } from "./navigable";

type AddonOption = {
  value: Addons;
  label: string;
  hint: string;
};

function getAddonDisplay(addon: Addons): { label: string; hint: string } {
  let label: string;
  let hint: string;

  switch (addon) {
    case "turborepo":
      label = "Turborepo";
      hint = "High-performance build system";
      break;
    case "nx":
      label = "Nx";
      hint = "Smart monorepo orchestration and task graph";
      break;
    case "pwa":
      label = "PWA";
      hint = "Make your app installable and work offline";
      break;
    case "tauri":
      label = "Tauri";
      hint = "Build native desktop apps from your web frontend";
      break;
    case "electrobun":
      label = "Electrobun";
      hint = "Wrap web frontends in a lightweight desktop shell";
      break;
    case "biome":
      label = "Biome";
      hint = "Format, lint, and more";
      break;
    case "oxlint":
      label = "Oxlint";
      hint = "Oxlint + Oxfmt (linting & formatting)";
      break;
    case "ultracite":
      label = "Ultracite";
      hint = "Zero-config Biome preset with AI integration";
      break;
    case "lefthook":
      label = "Lefthook";
      hint = "Fast and powerful Git hooks manager";
      break;
    case "husky":
      label = "Husky";
      hint = "Modern native Git hooks made easy";
      break;
    case "starlight":
      label = "Starlight";
      hint = "Build stellar docs with astro";
      break;
    case "fumadocs":
      label = "Fumadocs";
      hint = "Build excellent documentation site";
      break;
    case "opentui":
      label = "OpenTUI";
      hint = "Build terminal user interfaces";
      break;
    case "wxt":
      label = "WXT";
      hint = "Build browser extensions";
      break;
    case "skills":
      label = "Skills";
      hint = "AI coding agent skills for your stack";
      break;
    case "mcp":
      label = "MCP";
      hint = "Install MCP servers, including Better T Stack, via add-mcp";
      break;
    default:
      label = addon;
      hint = `Add ${addon}`;
  }

  return { label, hint };
}

const ADDON_GROUPS = {
  "Monorepo & Tasks": ["turborepo", "nx"],
  "Code Quality": ["biome", "oxlint", "ultracite", "husky", "lefthook"],
  Documentation: ["starlight", "fumadocs"],
  "Platform Extensions": ["pwa", "tauri", "electrobun", "opentui", "wxt"],
  "AI & Agent Tools": ["skills", "mcp"],
};

function createGroupedOptions(): Record<string, AddonOption[]> {
  return Object.fromEntries(Object.keys(ADDON_GROUPS).map((group) => [group, [] as AddonOption[]]));
}

function addOptionToGroup(groupedOptions: Record<string, AddonOption[]>, option: AddonOption) {
  for (const [group, addons] of Object.entries(ADDON_GROUPS)) {
    if (addons.includes(option.value)) {
      groupedOptions[group]?.push(option);
      return;
    }
  }
}

function sortAndPruneGroupedOptions(groupedOptions: Record<string, AddonOption[]>) {
  Object.keys(groupedOptions).forEach((group) => {
    if (groupedOptions[group].length === 0) {
      delete groupedOptions[group];
      return;
    }

    const groupOrder = ADDON_GROUPS[group as keyof typeof ADDON_GROUPS] || [];
    groupedOptions[group].sort((a, b) => {
      const indexA = groupOrder.indexOf(a.value);
      const indexB = groupOrder.indexOf(b.value);
      return indexA - indexB;
    });
  });
}

function validateAddonSelection(selected: Addons[] | undefined) {
  if (selected?.includes("turborepo") && selected.includes("nx")) {
    return "Choose either Turborepo or Nx as your monorepo tool, not both.";
  }
}

export async function getAddonsChoice(addons?: Addons[], frontends?: Frontend[], auth?: Auth) {
  if (addons !== undefined) return addons;

  const allAddons = AddonsSchema.options.filter((addon) => addon !== "none");
  const groupedOptions = createGroupedOptions();

  const frontendsArray = frontends || [];

  for (const addon of allAddons) {
    const { isCompatible } = validateAddonCompatibility(addon, frontendsArray, auth);
    if (!isCompatible) continue;

    const { label, hint } = getAddonDisplay(addon);
    const option = { value: addon, label, hint };
    addOptionToGroup(groupedOptions, option);
  }

  sortAndPruneGroupedOptions(groupedOptions);

  const initialValues = DEFAULT_CONFIG.addons.filter((addonValue) =>
    Object.values(groupedOptions).some((options) =>
      options.some((opt) => opt.value === addonValue),
    ),
  );

  const response = await navigableGroupMultiselect<Addons>({
    message: "Select addons",
    options: groupedOptions,
    initialValues: initialValues,
    required: false,
    validate: validateAddonSelection,
  });

  if (isCancel(response)) throw new UserCancelledError({ message: "Operation cancelled" });

  return response;
}

export async function getAddonsToAdd(
  frontend: Frontend[],
  existingAddons: Addons[] = [],
  auth?: Auth,
) {
  const groupedOptions = createGroupedOptions();

  const frontendArray = frontend || [];

  const compatibleAddons = getCompatibleAddons(
    AddonsSchema.options.filter((addon) => addon !== "none"),
    frontendArray,
    existingAddons,
    auth,
  );

  for (const addon of compatibleAddons) {
    const { label, hint } = getAddonDisplay(addon);
    const option = { value: addon, label, hint };
    addOptionToGroup(groupedOptions, option);
  }

  sortAndPruneGroupedOptions(groupedOptions);

  if (Object.keys(groupedOptions).length === 0) {
    return [];
  }

  const response = await navigableGroupMultiselect<Addons>({
    message: "Select addons to add",
    options: groupedOptions,
    required: false,
    validate: validateAddonSelection,
  });

  if (isCancel(response)) throw new UserCancelledError({ message: "Operation cancelled" });

  return response;
}
