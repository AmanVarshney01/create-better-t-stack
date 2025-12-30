import { isCancel } from "@clack/prompts";

import { DEFAULT_CONFIG } from "../constants";
import { type Addons, AddonsSchema, type Auth, type Frontend } from "../types";
import { getCompatibleAddons, validateAddonCompatibility } from "../utils/compatibility-rules";
import { exitCancelled } from "../utils/errors";
import { navigableGroupMultiselect } from "./navigable";

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
    case "pwa":
      label = "PWA";
      hint = "Make your app installable and work offline";
      break;
    case "tauri":
      label = "Tauri";
      hint = "Build native desktop apps from your web frontend";
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
    case "ruler":
      label = "Ruler";
      hint = "Centralize your AI rules";
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
    default:
      label = addon;
      hint = `Add ${addon}`;
  }

  return { label, hint };
}

const ADDON_GROUPS = {
  Documentation: ["starlight", "fumadocs"],
  Linting: ["biome", "oxlint", "ultracite"],
  Other: ["ruler", "pwa", "tauri", "husky", "opentui", "wxt", "turborepo"],
};

export async function getAddonsChoice(addons?: Addons[], frontends?: Frontend[], auth?: Auth) {
  if (addons !== undefined) return addons;

  const allAddons = AddonsSchema.options.filter((addon) => addon !== "none");
  const groupedOptions: Record<string, AddonOption[]> = {
    Documentation: [],
    Linting: [],
    Other: [],
  };

  const frontendsArray = frontends || [];

  for (const addon of allAddons) {
    const { isCompatible } = validateAddonCompatibility(addon, frontendsArray, auth);
    if (!isCompatible) continue;

    const { label, hint } = getAddonDisplay(addon);
    const option = { value: addon, label, hint };

    if (ADDON_GROUPS.Documentation.includes(addon)) {
      groupedOptions.Documentation.push(option);
    } else if (ADDON_GROUPS.Linting.includes(addon)) {
      groupedOptions.Linting.push(option);
    } else if (ADDON_GROUPS.Other.includes(addon)) {
      groupedOptions.Other.push(option);
    }
  }

  Object.keys(groupedOptions).forEach((group) => {
    if (groupedOptions[group].length === 0) {
      delete groupedOptions[group];
    } else {
      const groupOrder = ADDON_GROUPS[group as keyof typeof ADDON_GROUPS] || [];
      groupedOptions[group].sort((a, b) => {
        const indexA = groupOrder.indexOf(a.value);
        const indexB = groupOrder.indexOf(b.value);
        return indexA - indexB;
      });
    }
  });

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
  });

  if (isCancel(response)) return exitCancelled("Operation cancelled");

  return response;
}

export async function getAddonsToAdd(
  frontend: Frontend[],
  existingAddons: Addons[] = [],
  auth?: Auth,
) {
  const groupedOptions: Record<string, AddonOption[]> = {
    Documentation: [],
    Linting: [],
    Other: [],
  };

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

    if (ADDON_GROUPS.Documentation.includes(addon)) {
      groupedOptions.Documentation.push(option);
    } else if (ADDON_GROUPS.Linting.includes(addon)) {
      groupedOptions.Linting.push(option);
    } else if (ADDON_GROUPS.Other.includes(addon)) {
      groupedOptions.Other.push(option);
    }
  }

  Object.keys(groupedOptions).forEach((group) => {
    if (groupedOptions[group].length === 0) {
      delete groupedOptions[group];
    } else {
      const groupOrder = ADDON_GROUPS[group as keyof typeof ADDON_GROUPS] || [];
      groupedOptions[group].sort((a, b) => {
        const indexA = groupOrder.indexOf(a.value);
        const indexB = groupOrder.indexOf(b.value);
        return indexA - indexB;
      });
    }
  });

  if (Object.keys(groupedOptions).length === 0) {
    return [];
  }

  const response = await navigableGroupMultiselect<Addons>({
    message: "Select addons to add",
    options: groupedOptions,
    required: false,
  });

  if (isCancel(response)) return exitCancelled("Operation cancelled");

  return response;
}
