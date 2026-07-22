import type { PackageManager } from "../types";
import { UserCancelledError } from "../utils/errors";
import { getUserPkgManager } from "../utils/get-package-manager";
import { isCancel, navigableSelect, preferValidInitial } from "./navigable";

export async function getPackageManagerChoice(
  packageManager?: PackageManager,
  previousValue?: PackageManager,
) {
  if (packageManager !== undefined) return packageManager;

  const detectedPackageManager = getUserPkgManager();

  const options: Array<{ value: PackageManager; label: string; hint: string }> = [
    { value: "npm", label: "npm", hint: "not recommended" },
    {
      value: "pnpm",
      label: "pnpm",
      hint: "Fast, disk space efficient package manager",
    },
    {
      value: "bun",
      label: "bun",
      hint: "All-in-one JavaScript runtime & toolkit",
    },
  ];

  const response = await navigableSelect<PackageManager>({
    message: "Choose package manager",
    options,
    initialValue: preferValidInitial(options, previousValue, detectedPackageManager),
  });

  if (isCancel(response)) throw new UserCancelledError({ message: "Operation cancelled" });

  return response;
}
