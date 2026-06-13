import { DEFAULT_CONFIG } from "../constants";
import { UserCancelledError } from "../utils/errors";
import { isCancel, navigableConfirm } from "./navigable";

export async function getinstallChoice(install?: boolean, previousValue?: boolean) {
  if (install !== undefined) return install;

  const response = await navigableConfirm({
    message: "Install dependencies?",
    initialValue: previousValue ?? DEFAULT_CONFIG.install,
  });

  if (isCancel(response)) throw new UserCancelledError({ message: "Operation cancelled" });

  return response;
}
