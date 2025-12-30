import { DEFAULT_CONFIG } from "../constants";
import { exitCancelled } from "../utils/errors";
import { isCancel, navigableConfirm } from "./navigable";

export async function getinstallChoice(install?: boolean) {
  if (install !== undefined) return install;

  const response = await navigableConfirm({
    message: "Install dependencies?",
    initialValue: DEFAULT_CONFIG.install,
  });

  if (isCancel(response)) return exitCancelled("Operation cancelled");

  return response;
}
