import { DEFAULT_CONFIG } from "../constants";
import type { Auth, Backend, Frontend, Payments } from "../types";
import { UserCancelledError } from "../utils/errors";
import { isCancel, navigableSelect, preferValidInitial } from "./navigable";

export async function getPaymentsChoice(
  payments?: Payments,
  auth?: Auth,
  backend?: Backend,
  frontends?: Frontend[],
  previousValue?: Payments,
) {
  if (payments !== undefined) return payments;

  if (backend === "none") {
    return "none" as Payments;
  }

  const isPolarCompatible = auth === "better-auth";
  const hasNativeFrontend = (frontends ?? []).some(
    (frontend) =>
      frontend === "native-bare" ||
      frontend === "native-uniwind" ||
      frontend === "native-unistyles",
  );
  const isRevenueCatCompatible = hasNativeFrontend;

  if (!isPolarCompatible && !isRevenueCatCompatible) {
    return "none" as Payments;
  }

  const options: Array<{ value: Payments; label: string; hint: string }> = [];

  if (isPolarCompatible) {
    options.push({
      value: "polar" as Payments,
      label: "Polar",
      hint: "Turn your software into a business. 6 lines of code.",
    });
  }

  if (isRevenueCatCompatible) {
    options.push({
      value: "revenuecat" as Payments,
      label: "RevenueCat",
      hint: "In-app subscriptions and cross-platform monetization for mobile.",
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
    initialValue: preferValidInitial(options, previousValue, DEFAULT_CONFIG.payments),
  });

  if (isCancel(response)) throw new UserCancelledError({ message: "Operation cancelled" });

  return response;
}
