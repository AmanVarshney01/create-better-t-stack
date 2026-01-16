import type { Auth, Backend, Frontend, Payments } from "../types";

import { DEFAULT_CONFIG } from "../constants";
import { splitFrontends } from "../utils/compatibility-rules";
import { exitCancelled } from "../utils/errors";
import { isCancel, navigableSelect } from "./navigable";

export async function getPaymentsChoice(
  payments?: Payments,
  auth?: Auth,
  backend?: Backend,
  frontends?: Frontend[],
) {
  if (payments !== undefined) return payments;

  if (backend === "none") {
    return "none" as Payments;
  }

  const isPolarCompatible =
    (auth === "better-auth" || auth === "clerk") &&
    (frontends?.length === 0 || splitFrontends(frontends).web.length > 0);

  // Always show options, but only include polar if compatible
  const options = [];

  if (isPolarCompatible) {
    options.push({
      value: "polar" as Payments,
      label: "Polar",
      hint: "Turn your software into a business. 6 lines of code.",
    });
  }

  options.push({
    value: "none" as Payments,
    label: "None",
    hint: "No payments integration",
  });

  const response = await navigableSelect<Payments>({
    message: "Select payments provider",
    options,
    initialValue: DEFAULT_CONFIG.payments,
  });

  if (isCancel(response)) return exitCancelled("Operation cancelled");

  return response;
}
